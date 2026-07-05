const { test, expect } = require('@playwright/test');

// End-to-end tests for Wandertrap. The game exposes its engine on
// window.__wandertrap so tests can assert on player position, health,
// lives, score and current level.

/** Read a snapshot of the live game state from the page. */
function gameState(page) {
  return page.evaluate(() => {
    const game = window.__wandertrap.game;
    return {
      started: game.started,
      paused: game.paused,
      isGameOver: game.isGameOver,
      level: game.currentLevel,
      lives: game.lives,
      score: game.score,
      health: game.player ? game.player.getHealth() : null,
      position: game.player ? game.player.getPosition() : null,
    };
  });
}

/** Press a key `times` times with a small delay so the game loop keeps up. */
async function press(page, key, times, delay = 30) {
  for (let i = 0; i < times; i++) {
    await page.keyboard.press(key);
    await page.waitForTimeout(delay);
  }
}

/**
 * Hold a key down until the predicate is satisfied (or the timeout hits),
 * then release it. Movement is applied every frame while a key is held, so
 * this is how a human actually travels long distances.
 */
async function holdKeyUntil(page, key, predicate, timeoutMs = 8000) {
  await page.keyboard.down(key);
  try {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      if (await predicate()) return true;
      await page.waitForTimeout(15);
    }
    return false;
  } finally {
    await page.keyboard.up(key);
  }
}

async function openWelcomeScreen(page) {
  await page.goto('/');
  await expect(page.locator('#welcome-screen')).toBeVisible({ timeout: 30_000 });
}

async function startNewGame(page) {
  await openWelcomeScreen(page);
  await page.getByRole('button', { name: 'New Game' }).click();
  await expect(page.locator('canvas')).toBeVisible();
  await expect.poll(() => gameState(page).then((s) => s.started)).toBe(true);
}

let consoleErrors;

test.beforeEach(({ page }) => {
  consoleErrors = [];
  page.on('pageerror', (error) => consoleErrors.push(`pageerror: ${error.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(`console: ${msg.text()}`);
  });
});

test.afterEach(() => {
  expect(consoleErrors, 'no console or page errors during the test').toEqual([]);
});

test('loads the welcome screen with all menu buttons', async ({ page }) => {
  await openWelcomeScreen(page);
  await expect(page.getByRole('button', { name: 'New Game' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Story' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'High Scores' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Exit' })).toBeVisible();
});

test('story screen opens and Escape returns to the menu', async ({ page }) => {
  await openWelcomeScreen(page);
  await page.getByRole('button', { name: 'Story' }).click();
  await expect(page.getByRole('button', { name: 'Next' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Skip' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#welcome-screen')).toBeVisible();
});

test('high scores screen renders and navigates back', async ({ page }) => {
  await openWelcomeScreen(page);
  await page.getByRole('button', { name: 'High Scores' }).click();
  await expect(page.getByRole('heading', { name: 'High Scores' })).toBeVisible();
  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page.locator('#welcome-screen')).toBeVisible();
});

test('a new game starts on level 1 with full lives and health', async ({ page }) => {
  await startNewGame(page);
  const state = await gameState(page);
  expect(state.level).toBe(1);
  expect(state.lives).toBe(3);
  expect(state.health).toBe(100);
  expect(state.score).toBe(0);
});

test('arrow keys move the player', async ({ page }) => {
  await startNewGame(page);
  const before = await gameState(page);
  await press(page, 'ArrowDown', 10);
  const after = await gameState(page);
  expect(after.position.y).toBeGreaterThan(before.position.y);
  expect(after.position.x).toBe(before.position.x);
});

test('holding a key moves the player continuously, not just once', async ({ page }) => {
  await startNewGame(page);
  const before = await gameState(page);
  // A single uninterrupted hold must cover real distance (loop-driven
  // movement); with the old keydown-driven movement this moved ~5px.
  await page.keyboard.down('ArrowDown');
  await page.waitForTimeout(500);
  await page.keyboard.up('ArrowDown');
  const after = await gameState(page);
  expect(after.position.y - before.position.y).toBeGreaterThan(60);
});

test('walls block the player', async ({ page }) => {
  await startNewGame(page);
  const start = await gameState(page);

  // A wall row sits directly above the level 1 spawn point
  await press(page, 'ArrowUp', 20);
  let state = await gameState(page);
  expect(state.position.y).toBeGreaterThan(start.position.y - 20);

  // And a wall column directly to the left
  await press(page, 'ArrowLeft', 20);
  state = await gameState(page);
  expect(state.position.x).toBeGreaterThan(start.position.x - 20);
});

test('pausing via Escape and continuing preserves the run', async ({ page }) => {
  await startNewGame(page);
  await press(page, 'ArrowDown', 5);
  const before = await gameState(page);

  await page.keyboard.press('Escape');
  await expect(page.locator('#welcome-screen')).toBeVisible();
  await expect.poll(() => gameState(page).then((s) => s.paused)).toBe(true);

  // Arrow keys on the menu must not move the player behind the scenes
  await press(page, 'ArrowDown', 5);
  const whilePaused = await gameState(page);
  expect(whilePaused.position).toEqual(before.position);

  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('canvas')).toBeVisible();
  const resumed = await gameState(page);
  expect(resumed.paused).toBe(false);
  expect(resumed.position).toEqual(before.position);
});

test('losing all health costs a life, respawns, and eventually ends the game', async ({ page }) => {
  await startNewGame(page);
  await press(page, 'ArrowDown', 5);

  const damage = () => page.evaluate(() => window.__wandertrap.game.player.takeDamage(100));

  await damage();
  await expect.poll(() => gameState(page).then((s) => s.lives)).toBe(2);
  let state = await gameState(page);
  expect(state.health).toBe(100); // respawned with full health
  expect(state.position).toEqual({ x: 448, y: 128 }); // back at the level 1 spawn

  await damage();
  await expect.poll(() => gameState(page).then((s) => s.lives)).toBe(1);

  await damage();
  await expect(page.locator('#game-over-screen')).toBeVisible();
  await expect(page.getByText('Game Over')).toBeVisible();

  // Try Again starts a fresh run
  await page.getByRole('button', { name: 'Try Again' }).click();
  await expect(page.locator('canvas')).toBeVisible();
  state = await gameState(page);
  expect(state.lives).toBe(3);
  expect(state.level).toBe(1);
  expect(state.score).toBe(0);
  expect(state.isGameOver).toBe(false);
});

// ---------------------------------------------------------------------------
// Regression tests
// One test per fixed bug, so a fixed bug can never silently come back.
// These use the test hooks on window.__wandertrap.game (teleportPlayer,
// spawnGuard, step) to build exact scenarios without walking the maze.
// ---------------------------------------------------------------------------

test('regression: obstacles (trees, boulders) block the player like walls', async ({ page }) => {
  await startNewGame(page);

  // Level 1 has a boulder ('O') at column 7, row 4 => pixel (448, 256).
  // Put the player in the free cell directly above it and push down.
  const after = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.teleportPlayer(448, 192);
    for (let i = 0; i < 30; i++) game.movePlayer('down');
    return game.player.getPosition();
  });

  // The player's hitbox must be stopped before entering the boulder's cell
  expect(after.x).toBe(448);
  expect(after.y).toBeLessThan(256);
});

test('regression: attacking damages and defeats an adjacent guard', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    // Clear pre-placed guards so the assertion only sees our scenario
    game.guards = [];
    game.teleportPlayer(300, 300);
    game.spawnGuard(300, 360); // directly below the player
    game.player.movement = 'down'; // face the guard

    const alive = () => game.guards.filter((g) => !g.isDefeated()).length;
    const scoreBefore = game.score;

    game.playerAttack(); // guard has 100 health, attackPower is 50
    const aliveAfterOneHit = alive();
    game.step(30); // wait out the attack cooldown
    game.playerAttack();
    const aliveAfterTwoHits = alive();
    game.powerups = []; // discard any drop so the score delta is exactly the kill
    game.step(60); // let the death animation finish

    return {
      aliveAfterOneHit,
      aliveAfterTwoHits,
      corpseRemoved: game.guards.length === 0,
      scoreGained: game.score - scoreBefore,
    };
  });

  expect(result.aliveAfterOneHit).toBe(1); // survives the first hit
  expect(result.aliveAfterTwoHits).toBe(0); // defeated on the second
  expect(result.corpseRemoved).toBe(true); // removed after the death animation
  expect(result.scoreGained).toBe(100); // defeat awards score
});

test('regression: attack has a cooldown, spamming cannot double-hit', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.guards = [];
    game.teleportPlayer(300, 300);
    game.spawnGuard(300, 360);
    game.player.movement = 'down';

    // Two attacks in the same instant: only the first may land
    game.playerAttack();
    game.playerAttack();
    return { alive: game.guards.filter((g) => !g.isDefeated()).length };
  });

  expect(result.alive).toBe(1); // the spam attack was ignored
});

test('regression: attack only hits in the direction the player is facing', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.guards = [];
    game.teleportPlayer(300, 300);
    game.spawnGuard(300, 360); // below the player
    game.player.movement = 'up'; // facing away from the guard

    game.playerAttack();
    game.step(30);
    game.playerAttack();
    return { alive: game.guards.filter((g) => !g.isDefeated()).length };
  });

  expect(result.alive).toBe(1); // guard behind the player is untouched
});

test('explosive traps arm on approach, detonate, and hurt the player', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.guards = []; // isolate: no guard damage in this scenario
    // Level 1 has an explosive ('E') at column 11, row 7 => pixel (704, 448).
    // Stand one cell to its left, inside the trigger range.
    game.teleportPlayer(640, 448);
    game.step(1);
    const armed = game.explosives[0] ? game.explosives[0].isArmed() : false;
    game.step(95); // fuse is 90 frames; the blast lands within this window
    const healthAfterBlast = game.player.getHealth();
    game.step(25); // explosion animation finishes
    return {
      armed,
      healthAfterBlast,
      explosivesLeft: game.explosives.length,
    };
  });

  expect(result.armed).toBe(true); // revealed and armed by proximity
  expect(result.healthAfterBlast).toBeLessThan(100); // blast hurt the player
  expect(result.explosivesLeft).toBe(0); // spent trap is removed
});

test('powerup effects: speed is temporary, invincibility blocks damage', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.guards = [];
    game.explosives = [];
    const player = game.player;

    const baseSpeed = player.getSpeed();
    player.applyPowerup('speed');
    const boostedSpeed = player.getSpeed();
    game.step(481); // effect lasts 480 frames
    const speedAfterExpiry = player.getSpeed();

    player.applyPowerup('invincibility');
    player.takeDamage(50);
    const healthWhileInvincible = player.getHealth();

    return { baseSpeed, boostedSpeed, speedAfterExpiry, healthWhileInvincible };
  });

  expect(result.boostedSpeed).toBeGreaterThan(result.baseSpeed);
  expect(result.speedAfterExpiry).toBe(result.baseSpeed);
  expect(result.healthWhileInvincible).toBe(100);
});

test('the same seed produces an identical level setup', async ({ page }) => {
  const loadSeeded = async () => {
    await page.goto('/?seed=42');
    await expect(page.locator('#welcome-screen')).toBeVisible({ timeout: 30_000 });
    await page.getByRole('button', { name: 'New Game' }).click();
    await expect.poll(() => gameState(page).then((s) => s.started)).toBe(true);
    return page.evaluate(() => ({
      guards: window.__wandertrap.game.guards.map((g) => g.getType()),
      powerups: window.__wandertrap.game.powerups.map((p) => p.getType()),
    }));
  };

  const first = await loadSeeded();
  const second = await loadSeeded();
  expect(first.guards.length).toBeGreaterThan(0);
  expect(second).toEqual(first);
});

test('step(frames) advances the simulation deterministically while paused', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.pause(); // no requestAnimationFrame loop interference
    const frameBefore = game.player.currentFrame;
    game.step(60); // one simulated second at 60 FPS
    return {
      frameBefore,
      frameAfter: game.player.currentFrame,
      isGameOver: game.isGameOver,
    };
  });

  // The player animation advances one sprite frame every 10 game frames,
  // so 60 stepped frames must land exactly 6 frames further (mod 6 = same
  // frame index after a full cycle)
  expect(result.frameAfter).toBe(result.frameBefore);
  expect(result.isGameOver).toBe(false);
});

test('all levels are distinct and solvable', async ({ page }) => {
  await openWelcomeScreen(page);

  const result = await page.evaluate(() => {
    const levels = window.__wandertrap.levelData.levels;

    const solvable = (layout) => {
      let start, exit;
      for (let y = 0; y < layout.length; y++) {
        for (let x = 0; x < layout[y].length; x++) {
          if (layout[y][x] === 'P') start = [x, y];
          if (layout[y][x] === 'X') exit = [x, y];
        }
      }
      if (!start || !exit) return false;
      // Obstacles (O/T) are choppable, so only walls truly block the path
      const blocked = ['#'];
      const seen = new Set([start.join()]);
      const queue = [start];
      while (queue.length) {
        const [x, y] = queue.shift();
        if (x === exit[0] && y === exit[1]) return true;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = x + dx, ny = y + dy;
          if (ny < 0 || ny >= layout.length || nx < 0 || nx >= layout[ny].length) continue;
          if (blocked.includes(layout[ny][nx])) continue;
          const key = nx + ',' + ny;
          if (!seen.has(key)) { seen.add(key); queue.push([nx, ny]); }
        }
      }
      return false;
    };

    const serialized = levels.map((level) => JSON.stringify(level.layout));
    return {
      count: levels.length,
      allSolvable: levels.every((level) => solvable(level.layout)),
      allDistinct: new Set(serialized).size === serialized.length,
      themes: levels.map((level) => level.theme),
    };
  });

  expect(result.count).toBe(5);
  expect(result.allSolvable).toBe(true);
  expect(result.allDistinct).toBe(true); // levels 3-5 used to be identical copies
  expect(new Set(result.themes).size).toBeGreaterThan(1); // themed levels
});

test('level 5 has a boss guarding the exit', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.startAtLevel(5);
    const boss = game.guards.find((g) => g.isBoss);
    return {
      hasBoss: Boolean(boss),
      guardCount: game.guards.length,
      bossDefeatedByOneHit: boss ? (boss.takeDamage(50), boss.isDefeated()) : null,
    };
  });

  expect(result.hasBoss).toBe(true);
  expect(result.guardCount).toBeGreaterThan(3);
  expect(result.bossDefeatedByOneHit).toBe(false); // boss survives a normal hit
});

test('a qualifying score can be saved and shows up in high scores', async ({ page }) => {
  await startNewGame(page);

  // Earn some score (defeat one guard), then lose all lives
  await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.guards = [];
    game.teleportPlayer(300, 300);
    game.spawnGuard(300, 360);
    game.player.movement = 'down';
    game.playerAttack();
    game.step(30);
    game.playerAttack();
    // The kill may have dropped a powerup onto the player; strip pickups and
    // reset effects so an invincibility drop can't block the damage below
    game.powerups = [];
    game.player.respawn(448, 128);
  });
  await expect.poll(() => gameState(page).then((s) => s.score)).toBeGreaterThanOrEqual(100);

  const damage = () => page.evaluate(() => window.__wandertrap.game.player.takeDamage(100));
  await damage();
  await expect.poll(() => gameState(page).then((s) => s.lives)).toBe(2);
  await damage();
  await expect.poll(() => gameState(page).then((s) => s.lives)).toBe(1);
  await damage();
  await expect(page.locator('#game-over-screen')).toBeVisible();

  // The score qualifies for the top 10, so the name form is shown
  await page.locator('#score-name-input').fill('Theo');
  await page.getByRole('button', { name: 'Save Score' }).click();
  await expect(page.getByText('Score saved!')).toBeVisible();

  await page.getByRole('button', { name: 'Main Menu' }).click();
  await page.getByRole('button', { name: 'High Scores' }).click();
  await expect(page.getByRole('heading', { name: 'High Scores' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Theo' })).toBeVisible();
});

test('reaching the exit completes level 1 and advances to level 2', async ({ page }) => {
  test.setTimeout(120_000);
  await startNewGame(page);

  // A tree blocks the corridor right of the spawn: face it and chop it down
  // (two hits at 50 damage each, waiting out the attack cooldown between)
  await press(page, 'ArrowRight', 1);
  await page.keyboard.press(' ');
  await page.waitForTimeout(600);
  await page.keyboard.press(' ');
  await page.waitForTimeout(200);

  // Walk the level 1 maze by holding keys: east along the top corridor,
  // south along the right corridor, west along the bottom corridor, then
  // north to the exit.
  const at = () => gameState(page).then((s) => s.position);
  expect(await holdKeyUntil(page, 'ArrowRight', async () => (await at()).x >= 706)).toBe(true);
  expect(await holdKeyUntil(page, 'ArrowDown', async () => (await at()).y >= 440)).toBe(true);
  expect(await holdKeyUntil(page, 'ArrowLeft', async () => (await at()).x <= 585)).toBe(true);
  await holdKeyUntil(
    page,
    'ArrowUp',
    () => page.locator('#level-completed-screen').isVisible()
  );

  await expect(page.locator('#level-completed-screen')).toBeVisible();
  await expect(page.getByText('Level Completed!')).toBeVisible();

  const completed = await gameState(page);
  expect(completed.level).toBe(2);
  expect(completed.score).toBeGreaterThanOrEqual(100);

  await page.getByRole('button', { name: 'Next Level' }).click();
  await expect(page.locator('canvas')).toBeVisible();
  const next = await gameState(page);
  expect(next.paused).toBe(false);
  expect(next.level).toBe(2);
  // Level 2 spawn is the top-left corner of its maze
  expect(next.position).toEqual({ x: 64, y: 64 });
});
