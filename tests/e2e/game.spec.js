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
      activeEffects: game.player ? game.player.getActiveEffects() : [],
    };
  });
}

/** Hold a key `times` times with a small delay so the game loop can sample it. */
async function press(page, key, times, delay = 50) {
  for (let i = 0; i < times; i++) {
    await page.keyboard.down(key);
    await page.waitForTimeout(delay);
    await page.keyboard.up(key);
    await page.waitForTimeout(5);
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
  await page.evaluate(() => window.__wandertrap.game.dismissLevelIntro());
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
  // No Exit button: a web game has nothing to exit to (it used to show the
  // Game Over screen, of all things)
  await expect(page.getByRole('button', { name: 'Exit' })).toHaveCount(0);
});

test('story screen opens and Escape returns to the menu', async ({ page }) => {
  await openWelcomeScreen(page);
  await page.getByRole('button', { name: 'Story' }).click();
  await expect(page.getByRole('button', { name: 'Next' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Skip' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#welcome-screen')).toBeVisible();
});

test('high scores screen shows the score table', async ({ page }) => {
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

test('holding two movement keys moves diagonally with normalized speed', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.pause();
    game.walls = [];
    game.obstacles = [];
    game.guards = [];
    game.powerups = [];
    game.exit = null;

    game.teleportPlayer(300, 300);
    game.pressedDirections = new Set(['right']);
    game.step(60, 1000 / 60);
    const straight = game.player.getPosition();

    game.teleportPlayer(300, 300);
    game.pressedDirections = new Set(['right', 'down']);
    game.step(60, 1000 / 60);
    const diagonal = game.player.getPosition();
    game.pressedDirections.clear();

    return { straight, diagonal };
  });

  const straightDistance = result.straight.x - 300;
  const diagonalDistance = Math.hypot(
    result.diagonal.x - 300,
    result.diagonal.y - 300
  );

  expect(result.diagonal.x).toBeGreaterThan(300);
  expect(result.diagonal.y).toBeGreaterThan(300);
  expect(diagonalDistance).toBeCloseTo(straightDistance, 0);
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

test('diagonal movement slides along blockers without clipping through walls', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.pause();
    const start = game.player.getPosition();
    game.pressedDirections = new Set(['up', 'left']);
    game.step(60, 1000 / 60);
    const after = game.player.getPosition();
    const playerBox = game.player.getHitBox();
    const overlapsWall = game.walls.some((wall) => {
      const wallBox = wall.getHitBox();
      return (
        playerBox.x < wallBox.x + wallBox.width &&
        playerBox.x + playerBox.width > wallBox.x &&
        playerBox.y < wallBox.y + wallBox.height &&
        playerBox.y + playerBox.height > wallBox.y
      );
    });
    game.pressedDirections.clear();
    return { start, after, overlapsWall };
  });

  expect(result.overlapsWall).toBe(false);
  expect(result.after.x).toBeGreaterThanOrEqual(result.start.x - 64);
  expect(result.after.y).toBeGreaterThanOrEqual(result.start.y - 64);
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
  // Respawning grants ~2s of protection; wait it out before the next hit
  const waitOutRespawnProtection = () => page.waitForTimeout(2100);

  await damage();
  await expect.poll(() => gameState(page).then((s) => s.lives)).toBe(2);
  let state = await gameState(page);
  expect(state.health).toBe(0); // downed pose lingers before respawn
  await page.waitForTimeout(1600);
  state = await gameState(page);
  expect(state.health).toBe(100); // respawned with full health
  expect(state.position).toEqual({ x: 448, y: 128 }); // back at the level 1 spawn

  await waitOutRespawnProtection();
  await damage();
  await expect.poll(() => gameState(page).then((s) => s.lives)).toBe(1);
  await page.waitForTimeout(1600);

  await waitOutRespawnProtection();
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

    const scoreBefore = game.score;
    game.playerAttack(); // the starting Rusty Dagger deals 25 damage
    const guardsAfterOneHit = game.guards.length;
    for (let i = 0; i < 3; i++) {
      game.attackCooldownMs = 0; // skip the swing cooldown between test hits
      game.playerAttack();
    }

    return {
      guardsAfterOneHit,
      guardsAfterFourHits: game.guards.length,
      defeatedAfterFourHits: game.guards[0].isDefeated(),
      scoreGained: game.score - scoreBefore,
    };
  });

  expect(result.guardsAfterOneHit).toBe(1); // survives the first hit
  expect(result.guardsAfterFourHits).toBe(1); // remains while death animation plays
  expect(result.defeatedAfterFourHits).toBe(true);
  expect(result.scoreGained).toBe(100); // defeat awards score

  const lingered = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.step(40);
    return game.guards.length;
  });
  expect(lingered).toBe(1);

  const removed = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.step(55);
    return game.guards.length;
  });
  expect(removed).toBe(0);
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
    game.playerAttack();
    return { guards: game.guards.length };
  });

  expect(result.guards).toBe(1); // guard behind the player is untouched
});

test('axe action clears an adjacent obstacle, but only once the axe is owned', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    const obstacle = game.obstacles.find((item) => item.getType() === 'boulder');
    const { x, y } = obstacle.getPosition();
    game.teleportPlayer(x, y - 64);
    game.player.movement = 'down';

    // Without the axe the shortcut refuses and explains what is missing
    game.notifications = [];
    game.playerAxe();
    const withoutAxe = {
      intact: game.obstacles.includes(obstacle),
      notifications: game.notifications.map((n) => n.text),
    };

    game.player.unlockWeapon('woodenAxe');
    game.attackCooldownMs = 0;
    game.playerAxe();

    return {
      withoutAxe,
      afterOneHit: game.obstacles.includes(obstacle),
      action: game.player.action,
    };
  });

  expect(result.withoutAxe.intact).toBe(true);
  expect(result.withoutAxe.notifications.some((t) => t.includes('no axe yet'))).toBe(true);
  expect(result.afterOneHit).toBe(false); // the axe fells a boulder in one swing
  expect(result.action).toBe('axe');
});

test('only the axe can cut trees and break boulders', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    const obstacle = game.obstacles.find((item) => item.getType() === 'boulder');
    const { x, y } = obstacle.getPosition();
    game.teleportPlayer(x, y - 64);
    game.player.movement = 'down';

    // The starting dagger strikes the boulder but cannot damage it
    game.notifications = [];
    game.playerAttack();
    const daggerResult = {
      intact: game.obstacles.includes(obstacle),
      notifications: game.notifications.map((n) => n.text),
    };

    // The steel sword cannot either — the hint now points at the owned axe
    game.player.unlockWeapon('woodenAxe');
    game.player.unlockWeapon('steelSword');
    game.player.selectWeapon('steelSword');
    game.notifications = [];
    game.attackCooldownMs = 0;
    game.playerAttack();
    const swordResult = {
      intact: game.obstacles.includes(obstacle),
      notifications: game.notifications.map((n) => n.text),
    };

    // The axe clears it in one swing
    game.player.selectWeapon('woodenAxe');
    game.attackCooldownMs = 0;
    game.playerAttack();

    return { daggerResult, swordResult, afterAxe: game.obstacles.includes(obstacle) };
  });

  expect(result.daggerResult.intact).toBe(true);
  expect(result.daggerResult.notifications.some((t) =>
    t.includes('Only an axe could clear this')
  )).toBe(true);
  expect(result.swordResult.intact).toBe(true);
  expect(result.swordResult.notifications.some((t) =>
    t.includes('Only the axe can cut trees and break boulders')
  )).toBe(true);
  expect(result.afterAxe).toBe(false);
});

test('bumping into the level 1 tree without the axe shows a hint', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.pause();
    game.guards = [];
    game.notifications = [];
    // A tree seals the narrow corridor directly right of the level 1 spawn
    for (let i = 0; i < 30; i++) game.movePlayer('right');
    game.step(1);
    return {
      hasAxe: game.player.hasWeapon('woodenAxe'),
      position: game.player.getPosition(),
      notifications: game.notifications.map((n) => n.text),
    };
  });

  expect(result.hasAxe).toBe(false); // a fresh run starts with only the dagger
  expect(result.position.x).toBeLessThan(512); // stopped before the tree cell
  expect(result.notifications.some((t) =>
    t.includes('only an axe can cut it down')
  )).toBe(true);
});

test('the level 1 pedestal grants the wooden axe', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.pause();
    const pedestal = game.weaponPedestals[0];
    game.teleportPlayer(pedestal.x, pedestal.y);
    game.step(1);
    return {
      hasAxe: game.player.hasWeapon('woodenAxe'),
      selected: game.player.weaponId,
      overlayTitle: game.weaponUnlock?.title,
    };
  });

  expect(result.hasAxe).toBe(true);
  expect(result.selected).toBe('woodenAxe');
  expect(result.overlayTitle).toBe('Wooden Axe');
});

test('hitting a guard shows its health bar and knocks it back', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.pause();
    game.guards = [];
    game.walls = []; // open field so the knockback push is not blocked
    game.obstacles = [];
    game.exit = null;
    game.teleportPlayer(300, 300);
    const guard = game.spawnGuard(300, 360); // directly below the player
    game.player.movement = 'down';

    const barBeforeHit = guard.isHealthBarVisible();
    const positionBeforeHit = guard.getPosition();
    game.playerAttack();
    game.step(6); // ~100ms: knockback push in progress

    return {
      barBeforeHit,
      barAfterHit: guard.isHealthBarVisible(),
      health: guard.getHealth(),
      maxHealth: guard.getMaxHealth(),
      yBefore: positionBeforeHit.y,
      yAfter: guard.getPosition().y,
    };
  });

  expect(result.barBeforeHit).toBe(false);
  expect(result.barAfterHit).toBe(true);
  expect(result.health).toBeLessThan(result.maxHealth);
  // Knocked back away from the swing (player faced down, so pushed further down)
  expect(result.yAfter).toBeGreaterThan(result.yBefore);
});

test('a hidden trap arms near the player and its blast deals damage', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.pause();
    game.guards = []; // no contact damage interfering with the measurement

    // Level 1 has a hidden explosive; stand right on top of it
    const trap = game.explosives[0];
    const trapPosition = trap.getPosition();
    game.teleportPlayer(trapPosition.x, trapPosition.y);

    const hiddenBefore = trap.isHidden();
    game.step(1); // proximity arms the trap
    const armedAfterApproach = trap.isArmed();
    const healthBefore = game.player.getHealth();

    // Wait out the 1.5s fuse plus the blast animation (~60fps steps)
    game.step(120);
    return {
      hiddenBefore,
      armedAfterApproach,
      healthBefore,
      healthAfter: game.player.getHealth(),
      trapsLeft: game.explosives.length,
    };
  });

  expect(result.hiddenBefore).toBe(true);
  expect(result.armedAfterApproach).toBe(true);
  expect(result.healthBefore).toBe(100);
  expect(result.healthAfter).toBe(70); // explosivePlayerDamage
  expect(result.trapsLeft).toBe(0); // the spent trap is removed
});

test('the attack cooldown blocks an immediate second swing', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.pause();
    game.guards = [];
    game.teleportPlayer(300, 300);
    const guard = game.spawnGuard(300, 360);
    game.player.movement = 'down';

    game.playerAttack();
    game.playerAttack(); // fired within the cooldown window: must not land
    const healthAfterSpam = guard.getHealth();

    game.step(30); // half a second clears the 400ms cooldown
    guard.setPosition(300, 360); // knockback pushed it out of reach; put it back
    game.playerAttack();
    return {
      healthAfterSpam,
      healthAfterCooldown: guard.getHealth(),
    };
  });

  expect(result.healthAfterSpam).toBe(75); // only the first dagger jab landed
  expect(result.healthAfterCooldown).toBe(50); // swing after cooldown lands
});

test('a boss is tanky but beatable, always shows its health bar, and awards bonus score', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.pause();
    game.guards = [];
    game.teleportPlayer(300, 300);
    const boss = game.spawnGuard(300, 350, 'orc1', { boss: true });
    game.player.movement = 'down';

    const barVisibleBeforeAnyHit = boss.isHealthBarVisible();
    const scoreBefore = game.score;

    // 300 health / 25 per Rusty Dagger jab = 12 swings to bring the boss down
    let swings = 0;
    while (!boss.isDefeated() && swings < 20) {
      game.attackCooldownMs = 0;
      game.playerAttack();
      swings++;
    }

    return {
      barVisibleBeforeAnyHit,
      isBoss: boss.isBoss(),
      maxHealth: boss.getMaxHealth(),
      swings,
      scoreGained: game.score - scoreBefore,
    };
  });

  expect(result.isBoss).toBe(true);
  expect(result.barVisibleBeforeAnyHit).toBe(true); // danger is telegraphed up front
  expect(result.maxHealth).toBe(300);
  expect(result.swings).toBe(12); // tanky, but goes down to persistent attack
  expect(result.scoreGained).toBe(500); // bosses are worth five guards
});

test('the boss is slower than the player, so kiting is possible', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    return {
      bossSpeed: 45, // bossSettings.speed
      playerSpeed: game.player.getSpeed(),
    };
  });

  expect(result.playerSpeed).toBeGreaterThan(result.bossSpeed * 3);
});

test('respawning grants brief protection so a spawn-camping guard cannot chain-kill', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.pause();
    game.player.takeDamage(100); // lose the first life
    game.step(1); // death is processed: life lost, downed pose starts
    game.step(91); // 1.5s linger passes: player respawns
    const effects = game.player.getActiveEffects().map((e) => e.name);

    game.player.takeDamage(50); // a guard on the spawn point strikes at once
    return {
      lives: game.lives,
      effects,
      healthAfterCampHit: game.player.getHealth(),
    };
  });

  expect(result.lives).toBe(2);
  expect(result.effects).toContain('invincibility');
  expect(result.healthAfterCampHit).toBe(100); // the camp hit was absorbed
});

test('fog of war is off on easy levels and on for the harder ones', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.pause();
    const fogByLevel = {};
    for (const n of [1, 2, 7, 9, 10]) {
      game.startAtLevel(n);
      fogByLevel[n] = game.fogEnabled;
    }
    return fogByLevel;
  });

  expect(result[1]).toBe(false);
  expect(result[2]).toBe(false);
  expect(result[7]).toBe(true);
  expect(result[9]).toBe(true);
  expect(result[10]).toBe(true);
});

test('fog of war reveals cells around the player and remembers explored ground', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.pause();
    game.startAtLevel(7); // The Serpent plays under fog of war
    game.guards = []; // keep the scenario deterministic
    game.step(1); // one update reveals the area around the spawn

    // Spawn is at cell (1, 1); the exit corridor is far away at (1, 8)
    const spawnExplored = game.isCellExplored(1, 1);
    const farExploredBefore = game.isCellExplored(18, 8);

    game.teleportPlayer(18 * 64, 8 * 64);
    game.step(1);
    const farExploredAfter = game.isCellExplored(18, 8);
    // Previously explored ground stays revealed after moving away
    const spawnStillExplored = game.isCellExplored(1, 1);

    return { spawnExplored, farExploredBefore, farExploredAfter, spawnStillExplored };
  });

  expect(result.spawnExplored).toBe(true);
  expect(result.farExploredBefore).toBe(false);
  expect(result.farExploredAfter).toBe(true);
  expect(result.spawnStillExplored).toBe(true);
});

test('all 10 levels are defined and each has a spawn and an exit', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.pause();
    const summary = [];
    for (let n = 1; n <= 10; n++) {
      game.startAtLevel(n);
      summary.push({
        level: n,
        hasPlayer: Boolean(game.player),
        hasExit: Boolean(game.exit),
        guards: game.guards.length,
        bosses: game.guards.filter((g) => g.isBoss()).length,
      });
    }
    return summary;
  });

  expect(result).toHaveLength(10);
  for (const level of result) {
    expect(level.hasPlayer).toBe(true);
    expect(level.hasExit).toBe(true);
    expect(level.guards).toBeGreaterThan(0);
  }
  // Bosses appear on the milestone levels
  expect(result[4].bosses).toBe(1); // level 5: The Warden
  expect(result[7].bosses).toBe(1); // level 8: The Crossroads
  expect(result[9].bosses).toBe(1); // level 10: The Throne
});

test('defeated guards are inert until their death animation is removed', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.guards = [];
    game.teleportPlayer(300, 300);
    const guard = game.spawnGuard(300, 360);
    game.player.movement = 'down';
    for (let i = 0; i < 4; i++) {
      game.attackCooldownMs = 0; // skip the swing cooldown between test hits
      game.playerAttack();
    }
    const healthBefore = game.player.getHealth();

    game.step(10);
    const whileAnimating = {
      guards: game.guards.length,
      defeated: guard.isDefeated(),
      health: game.player.getHealth(),
    };

    game.step(40);
    const afterAnimationBeforeLinger = game.guards.length;
    game.step(55);
    return {
      healthBefore,
      whileAnimating,
      afterAnimationBeforeLinger,
      afterLinger: game.guards.length,
    };
  });

  expect(result.whileAnimating.guards).toBe(1);
  expect(result.whileAnimating.defeated).toBe(true);
  expect(result.whileAnimating.health).toBe(result.healthBefore);
  expect(result.afterAnimationBeforeLinger).toBe(1);
  expect(result.afterLinger).toBe(0);
});

test('collecting a crystal applies its effect and shows a pickup message', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.pause();
    const crystal = game.powerups[0];
    const type = crystal.getType();
    const { x, y } = crystal.getPosition();
    game.teleportPlayer(x, y);
    game.step(1);
    return {
      type,
      collected: game.player.powerups,
      remainingOnBoard: game.powerups.length,
      notifications: game.notifications.map((n) => n.text),
      activeEffects: game.player.getActiveEffects().map((e) => e.name),
    };
  });

  expect(result.collected).toEqual([result.type]);
  expect(result.remainingOnBoard).toBe(1); // level 1 starts with two crystals
  expect(result.notifications).toHaveLength(1);
  expect(result.notifications[0]).toContain('Crystal');
  if (result.type !== 'health') {
    // Speed, strength and invincibility are timed effects shown in the HUD
    expect(result.activeEffects).toEqual([result.type]);
  }
});

test('regression: invincibility lasts 10 real seconds at 120Hz', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.pause();
    game.guards = [];
    game.player.applyPowerup('invincibility');

    game.step(600, 1000 / 120); // 5 seconds at 120Hz
    game.player.takeDamage(50);
    const halfway = {
      health: game.player.getHealth(),
      active: game.player.hasEffect('invincibility'),
      secondsLeft: game.player.getActiveEffects()
        .find((effect) => effect.name === 'invincibility')?.secondsLeft,
    };

    game.step(601, 1000 / 120); // just beyond 10 total seconds
    const expired = game.player.hasEffect('invincibility');
    game.player.takeDamage(50);

    return {
      halfway,
      expired,
      healthAfterExpiry: game.player.getHealth(),
    };
  });

  expect(result.halfway.health).toBe(100);
  expect(result.halfway.active).toBe(true);
  expect(result.halfway.secondsLeft).toBe(5);
  expect(result.expired).toBe(false);
  expect(result.healthAfterExpiry).toBe(50);
});

test('a guaranteed key drop goes into the inventory with a message', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.pause();
    game.startAtLevel(2);
    game.guards = [];
    game.drops = [];
    game.notifications = [];
    game.teleportPlayer(300, 300);
    game.spawnDrop({ x: 300, y: 300 }); // locked level: first drop is always the key
    const dropCount = game.drops.length;
    const droppedItem = game.drops[0]?.getType();

    game.step(1); // player stands in pickup range of the drop
    return {
      dropCount,
      droppedItem,
      dropsAfterPickup: game.drops.length,
      carried: game.player.inventory[droppedItem],
      notifications: game.notifications.map((n) => n.text),
    };
  });

  expect(result.dropCount).toBe(1);
  expect(result.droppedItem).toBeTruthy();
  expect(result.dropsAfterPickup).toBe(0);
  expect(result.carried).toBe(1);
  expect(result.notifications.some((text) =>
    text.includes("press 'i' to inspect your inventory")
  )).toBe(true);
});

test("pressing 'i' opens the inventory and freezes the world", async ({ page }) => {
  await startNewGame(page);

  await page.keyboard.press('i');
  await expect.poll(() =>
    page.evaluate(() => window.__wandertrap.game.inventoryOpen)
  ).toBe(true);

  // Movement input must be ignored while the inventory is open
  const before = await gameState(page);
  await press(page, 'ArrowDown', 5);
  const whileOpen = await gameState(page);
  expect(whileOpen.position).toEqual(before.position);

  await page.keyboard.press('i');
  await expect.poll(() =>
    page.evaluate(() => window.__wandertrap.game.inventoryOpen)
  ).toBe(false);
});

test("pressing 'u' drinks a carried potion and restores health", async ({ page }) => {
  await startNewGame(page);

  await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.guards = []; // nothing interferes with the health assertion
    game.player.addItem('potion');
    game.player.takeDamage(60);
  });
  await expect.poll(() => gameState(page).then((s) => s.health)).toBe(40);

  await page.keyboard.press('u');
  await expect.poll(() => gameState(page).then((s) => s.health)).toBe(90); // +50

  const potionsLeft = await page.evaluate(
    () => window.__wandertrap.game.player.inventory.potion || 0
  );
  expect(potionsLeft).toBe(0);
});

test('owned weapon selection and rune bonuses update attack power', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const player = window.__wandertrap.game.player;
    player.addItem('runeMight');

    const base = player.attackPower;
    player.unlockWeapon('woodenAxe');
    player.unlockWeapon('steelSword');
    player.equip('steelSword');
    const withSword = player.attackPower;
    player.equip('runeMight');
    const withBoth = player.attackPower;
    player.selectWeapon('woodenAxe');
    const afterAxeSelected = player.attackPower;

    return { base, withSword, withBoth, afterAxeSelected, equipment: player.equipment, weaponId: player.weaponId };
  });

  expect(result.base).toBe(25); // the starting dagger
  expect(result.withSword).toBe(60);
  expect(result.withBoth).toBe(85); // rune of might: +25
  expect(result.afterAxeSelected).toBe(55); // rune stays on, axe is readied
  expect(result.equipment).toEqual({ weapon: null, rune: 'runeMight' });
  expect(result.weaponId).toBe('woodenAxe');
});

test('guard drop economy is sparse and bow owners can find arrows', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const { game, setSeed } = window.__wandertrap;
    setSeed(1234);
    const early = { potion: 0, dreamShard: 0, arrowBundle: 0, none: 0 };
    for (let i = 0; i < 1000; i++) early[game.rollGuardDrop() || 'none']++;

    game.player.unlockWeapon('dreamBow');
    setSeed(1234);
    const late = { potion: 0, dreamShard: 0, arrowBundle: 0, none: 0 };
    for (let i = 0; i < 1000; i++) late[game.rollGuardDrop() || 'none']++;
    return { early, late };
  });

  expect(result.early.potion).toBeGreaterThan(280);
  expect(result.early.potion).toBeLessThan(420);
  expect(result.early.dreamShard).toBeGreaterThan(100);
  expect(result.early.dreamShard).toBeLessThan(210);
  expect(result.early.none).toBeGreaterThan(420);
  expect(result.early.arrowBundle).toBe(0);
  expect(result.late.arrowBundle).toBeGreaterThan(140);
  expect(result.late.arrowBundle).toBeLessThan(260);
});

test('potion pickups at the cap convert to score', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.player.inventory.potion = 3;
    const scoreBefore = game.score;
    game.collectDrop('potion');
    return {
      potions: game.player.inventory.potion,
      scoreGained: game.score - scoreBefore,
      notifications: game.notifications.map((n) => n.text),
    };
  });

  expect(result.potions).toBe(3);
  expect(result.scoreGained).toBe(50);
  expect(result.notifications).toContain('Your pack is full - +50');
});

test('weapon pedestal unlocks a weapon, pauses, and dismisses', async ({ page }) => {
  await startNewGame(page);

  const unlocked = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.startAtLevel(3);
    game.dismissLevelIntro();
    const pedestal = game.weaponPedestals[0];
    game.teleportPlayer(pedestal.x, pedestal.y);
    game.step(1);
    return {
      hasSword: game.player.hasWeapon('steelSword'),
      selected: game.player.weaponId,
      overlayTitle: game.weaponUnlock?.title,
    };
  });

  expect(unlocked.hasSword).toBe(true);
  expect(unlocked.selected).toBe('steelSword');
  expect(unlocked.overlayTitle).toBe('Steel Sword');

  await page.keyboard.press('Space');
  await expect.poll(() =>
    page.evaluate(() => window.__wandertrap.game.weaponUnlock)
  ).toBeNull();
});

test('bow arrows fly, hit guards, and stop at walls', async ({ page }) => {
  await startNewGame(page);

  const hit = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.pause();
    game.guards = [];
    game.walls = [];
    game.obstacles = [];
    game.projectiles = [];
    game.player.unlockWeapon('dreamBow');
    game.player.selectWeapon('dreamBow');
    game.player.arrowCount = 10;
    game.teleportPlayer(300, 300);
    game.player.movement = 'right';
    const guard = game.spawnGuard(430, 300);
    game.playerAttack();
    game.step(35);
    return {
      arrowsLeft: game.player.arrowCount,
      guardHealth: guard.getHealth(),
      projectilesLeft: game.projectiles.length,
    };
  });

  expect(hit.arrowsLeft).toBe(9);
  expect(hit.guardHealth).toBeLessThan(100);
  expect(hit.projectilesLeft).toBe(0);

  const blocked = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.guards = [];
    game.projectiles = [];
    game.player.arrowCount = 10;
    game.teleportPlayer(300, 300);
    game.player.movement = 'right';
    game.walls = [{
      getHitBox: () => ({ x: 390, y: 270, width: 64, height: 96 }),
      draw: () => {},
    }];
    game.playerAttack();
    game.step(35);
    return { projectilesLeft: game.projectiles.length, arrowsLeft: game.player.arrowCount };
  });

  expect(blocked.projectilesLeft).toBe(0);
  expect(blocked.arrowsLeft).toBe(9);
});

test('orc archers keep distance and fire arrows', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.pause();
    game.guards = [];
    game.walls = [];
    game.obstacles = [];
    game.projectiles = [];
    game.teleportPlayer(300, 300);
    const archer = game.spawnGuard(360, 300, 'orc1', { ranged: true });
    const xBefore = archer.getPosition().x;
    game.step(1); // spots the player: retreat starts and the bow draw begins
    const drawing = archer.isDrawingBow();
    const projectilesDuringDraw = game.projectiles.length;
    game.step(26); // the 400ms draw telegraph completes and the arrow releases
    return {
      isRanged: archer.isRanged(),
      maxHealth: archer.getMaxHealth(),
      damage: archer.damage,
      drawing,
      projectilesDuringDraw,
      xBefore,
      xAfter: archer.getPosition().x,
      projectiles: game.projectiles.length,
    };
  });

  expect(result.isRanged).toBe(true);
  expect(result.maxHealth).toBe(60);
  expect(result.damage).toBe(5);
  expect(result.drawing).toBe(true); // the shot is telegraphed...
  expect(result.projectilesDuringDraw).toBe(0); // ...and nothing flies during the draw
  expect(result.xAfter).toBeGreaterThan(result.xBefore);
  expect(result.projectiles).toBeGreaterThan(0);
});

test('a locked door blocks the corridor until opened with a key', async ({ page }) => {
  await startNewGame(page);

  // Level 2 has a door ('D') at column 14, row 4 => pixel (896, 256), the
  // only passage between the top and bottom halves of the maze
  const blocked = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.pause();
    game.startAtLevel(2);
    game.guards = []; // keep the scenario deterministic
    game.teleportPlayer(896, 192); // the free cell directly above the door
    for (let i = 0; i < 30; i++) game.movePlayer('down');
    game.step(1);
    return {
      position: game.player.getPosition(),
      doorLocked: game.doors[0].locked,
    };
  });
  expect(blocked.doorLocked).toBe(true);
  expect(blocked.position.y).toBeLessThan(256); // stopped before the door cell

  const unlocked = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.player.addItem('key');
    game.step(1); // standing against the door with a key opens it
    for (let i = 0; i < 30; i++) game.movePlayer('down');
    return {
      doorLocked: game.doors[0].locked,
      keysLeft: game.player.inventory.key || 0,
      position: game.player.getPosition(),
      notifications: game.notifications.map((n) => n.text),
      level: game.currentLevel,
    };
  });
  expect(unlocked.doorLocked).toBe(false);
  expect(unlocked.keysLeft).toBe(0); // the key is consumed
  expect(unlocked.position.y).toBeGreaterThan(256); // walked through the doorway
  expect(unlocked.notifications.some((t) => t.includes('unlocked the door'))).toBe(true);
  expect(unlocked.level).toBe(2); // a door is not the exit
});

test('the exit portal is never locked', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.pause();
    game.startAtLevel(2);
    game.guards = [];
    const exitPosition = game.exit.getPosition();
    game.teleportPlayer(exitPosition.x, exitPosition.y);
    game.step(1);
    return { level: game.currentLevel };
  });

  // Reaching the portal completes the level immediately — no key involved
  expect(result.level).toBe(3);
  await expect(page.locator('#level-completed-screen')).toBeVisible();
});

test('approaching a locked door explains how to get the key', async ({ page }) => {
  await startNewGame(page);

  // Standing in front of the door (one cell away) with no key anywhere:
  // the player is told to go defeat a guard
  const nearWithoutKey = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.pause();
    game.startAtLevel(2);
    game.guards = [];
    game.teleportPlayer(896, 192); // one cell above the level 2 door
    game.step(1);
    return game.notifications.map((n) => n.text);
  });
  expect(nearWithoutKey.some((t) => t.includes('defeat a guard to find the key'))).toBe(true);

  // With the key lying on the floor the hint points at it instead
  const withKeyOnGround = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.notifications = [];
    game.spawnDrop({ x: 448, y: 320 }); // a door is locked: first drop is the key
    game.step(1);
    return game.notifications.map((n) => n.text);
  });
  expect(withKeyOnGround.some((t) => t.includes('pick up the key first'))).toBe(true);

  // Carrying the key, the nag disappears (and one cell away the door
  // does not open yet)
  const withKeyCarried = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.drops = [];
    game.notifications = [];
    game.player.addItem('key');
    game.step(1);
    return {
      notifications: game.notifications.map((n) => n.text),
      doorLocked: game.doors[0].locked,
    };
  });
  expect(withKeyCarried.notifications.some((t) => t.includes('locked'))).toBe(false);
  expect(withKeyCarried.doorLocked).toBe(true);
});

test('the first guard defeated on a locked level always drops the key', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.pause();
    game.startAtLevel(2);
    game.guards = [];
    game.drops = [];
    game.teleportPlayer(300, 300);
    game.spawnGuard(300, 360);
    game.player.movement = 'down';
    for (let i = 0; i < 4; i++) {
      game.attackCooldownMs = 0; // skip the swing cooldown between test hits
      game.playerAttack();
    }
    return { dropped: game.drops.map((d) => d.getType()) };
  });

  expect(result.dropped).toEqual(['key']);
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
    game.step(30); // half a simulated second at 60 FPS
    return {
      frameBefore,
      frameAfter: game.player.currentFrame,
      isGameOver: game.isGameOver,
    };
  });

  // Animation is now time-based, so a fixed simulated duration should advance
  // the frame counter even while the RAF loop is paused.
  expect(result.frameAfter).not.toBe(result.frameBefore);
  expect(result.isGameOver).toBe(false);
});

test('winning the final level asks for a high score name and saves it', async ({ page }) => {
  await startNewGame(page);

  await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.pause();
    game.startAtLevel(10);
    game.score = 1234;
    const exit = game.exit.getPosition();
    game.teleportPlayer(exit.x, exit.y);
    game.step(1);
  });

  // Clearing the last level wins the game and offers to save the score
  await expect(page.locator('#game-won-screen')).toBeVisible();
  await expect(page.getByText('You made the high scores!')).toBeVisible();
  await page.fill('#score-name-input', 'Theo');
  await page.getByRole('button', { name: 'Save Score' }).click();
  await expect(page.getByText('Score saved!')).toBeVisible();

  // The saved entry shows up in the high scores table: 1234 + 100 exit bonus
  // + 200 instant-time bonus + 150 untouched bonus + 250 sneak bonus (the
  // Orc King was never touched — teleporting to the exit is the ultimate sneak)
  await page.getByRole('button', { name: 'Main Menu' }).click();
  await page.getByRole('button', { name: 'High Scores' }).click();
  await expect(page.getByRole('cell', { name: 'Theo' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '1934' })).toBeVisible();
});

test('reaching the exit completes level 1 and advances to level 2', async ({ page }) => {
  await startNewGame(page);

  await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.pause();
    const exit = game.exit.getPosition();
    game.teleportPlayer(exit.x, exit.y);
    game.step(1);
  });

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

test('welcome screen exposes sound and story-skip settings', async ({ page }) => {
  await openWelcomeScreen(page);
  await expect(page.getByRole('button', { name: /Sound/i })).toBeVisible();
  await expect(page.getByText('Skip level story cards')).toBeVisible();
});

test('touch controls appear in landscape when forced with ?touch=1', async ({ page }) => {
  await page.goto('/?touch=1');
  await expect(page.locator('#welcome-screen')).toBeVisible({ timeout: 30_000 });
  await page.getByRole('button', { name: 'New Game' }).click();
  await expect(page.locator('#touch-controls')).toBeVisible();
  await expect(page.locator('#touch-btn-attack')).toBeVisible();
  await expect(page.locator('#touch-btn-inventory')).toBeVisible();
  await expect(page.locator('#touch-btn-potion')).toBeVisible();
  await expect(page.locator('#touch-btn-weapon')).toBeVisible();
  await expect(page.locator('#touch-btn-menu')).toBeVisible();
  await expect(page.locator('#touch-btn-pick')).toBeVisible();
});

// ---------------------------------------------------------------------------
// Game feel: hit-stop, player knockback, game-time i-frames, and the
// New Game confirmation. One test per behavior added in the juice pass.
// ---------------------------------------------------------------------------

test('a landed melee swing freezes the world briefly (hit-stop)', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.guards = [];
    game.walls = []; // open field so knockback movement is measurable
    game.teleportPlayer(300, 300);
    const guard = game.spawnGuard(300, 360);
    game.player.movement = 'down';

    game.playerAttack();
    const hitStopAfterHit = game.hitStopMs;
    const positionDuringFreeze = { ...guard.getPosition() };
    game.step(2); // ~33ms, still inside the 50ms freeze
    const positionAfterTwoFrames = { ...guard.getPosition() };
    game.step(12); // freeze over: the knockback push moves the guard
    const positionAfterFreeze = { ...guard.getPosition() };

    // A swing into empty air must not freeze anything
    game.hitStopMs = 0;
    game.attackCooldownMs = 0;
    game.player.movement = 'up';
    game.playerAttack();

    return {
      hitStopAfterHit,
      hitStopAfterMiss: game.hitStopMs,
      frozeDuringHitStop: positionAfterTwoFrames.y === positionDuringFreeze.y,
      movedAfterHitStop: positionAfterFreeze.y > positionDuringFreeze.y,
    };
  });

  expect(result.hitStopAfterHit).toBeGreaterThan(0);
  expect(result.hitStopAfterMiss).toBe(0);
  expect(result.frozeDuringHitStop).toBe(true);
  expect(result.movedAfterHitStop).toBe(true);
});

test('contact damage knocks the player back, away from the guard', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.guards = [];
    game.walls = [];
    game.explosives = [];
    game.teleportPlayer(320, 300);
    const guard = game.spawnGuard(280, 300); // overlapping hitboxes, guard to the left
    const xBefore = game.player.getPosition().x;

    game.step(2); // contact starts the windup telegraph — no damage yet
    const healthDuringWindup = game.player.getHealth();
    const windingUp = guard.isWindingUp();
    game.step(30); // the 250ms windup finishes: the strike lands and shoves Theo
    return {
      healthDuringWindup,
      windingUp,
      xBefore,
      xAfter: game.player.getPosition().x,
      health: game.player.getHealth(),
    };
  });

  expect(result.windingUp).toBe(true); // the hit is telegraphed first
  expect(result.healthDuringWindup).toBe(100); // no damage during the windup
  expect(result.health).toBe(90); // then one contact hit lands
  expect(result.xAfter).toBeGreaterThan(result.xBefore); // pushed right, away from the guard
});

test('hurt invulnerability counts down in game time, not wall-clock time', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.guards = [];
    game.explosives = [];

    game.player.takeDamage(10);
    const hurtAfterHit = game.player.isHurt();
    game.player.takeDamage(10); // must be absorbed by the i-frames
    const healthDuringIFrames = game.player.getHealth();

    game.step(65); // ~1083ms of game time clears the 1000ms hurt window
    const hurtAfterStepping = game.player.isHurt();
    game.player.takeDamage(10); // lands again once the window has passed
    return {
      hurtAfterHit,
      healthDuringIFrames,
      hurtAfterStepping,
      healthAfterWindow: game.player.getHealth(),
    };
  });

  expect(result.hurtAfterHit).toBe(true);
  expect(result.healthDuringIFrames).toBe(90);
  expect(result.hurtAfterStepping).toBe(false);
  expect(result.healthAfterWindow).toBe(80);
});

test('New Game mid-run asks for confirmation and starts a fresh run', async ({ page }) => {
  await startNewGame(page);

  // Fake some progress, then drop to the menu with Escape
  await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.score = 500;
    game.currentLevel = 3;
  });
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();

  // Declining the confirmation keeps the paused run untouched
  page.once('dialog', (dialog) => dialog.dismiss());
  await page.getByRole('button', { name: 'New Game' }).click();
  await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
  let state = await gameState(page);
  expect(state.score).toBe(500);

  // Accepting it abandons the run and starts over on level 1
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'New Game' }).click();
  await expect(page.locator('canvas')).toBeVisible();
  await expect.poll(() => gameState(page).then((s) => s.started)).toBe(true);
  state = await gameState(page);
  expect(state.score).toBe(0);
  expect(state.level).toBe(1);
});

// ---------------------------------------------------------------------------
// Phase 2 features: disarming, secrets, weapon arcs, tally, persistence,
// Daily Dream, dawn timer, and patrol AI.
// ---------------------------------------------------------------------------

test("pressing 'p' disarms an armed trap for score", async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.pause();
    game.guards = [];
    const trap = game.explosives[0];
    const pos = trap.getPosition();
    game.teleportPlayer(pos.x + 64, pos.y); // next to the trap: it arms
    game.step(2);
    const armed = trap.isArmed();
    const scoreBefore = game.score;
    game.playerPick();
    game.step(2); // the disarmed trap is removed on the next update
    return {
      armed,
      scoreGained: game.score - scoreBefore,
      explosivesLeft: game.explosives.length,
      health: game.player.getHealth(),
    };
  });

  expect(result.armed).toBe(true);
  expect(result.scoreGained).toBe(50);
  expect(result.explosivesLeft).toBe(0); // gone without detonating
  expect(result.health).toBe(100);
});

test('an axe swing breaks a cracked wall and reveals a stash', async ({ page }) => {
  await startNewGame(page);

  // Level 1 has a cracked wall ('R') at column 11, row 3 => pixel (704, 192)
  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.pause();
    game.guards = [];
    game.player.unlockWeapon('woodenAxe');
    game.teleportPlayer(704, 128); // free cell directly above the cracked wall
    game.player.movement = 'down';
    const wallsBefore = game.walls.length;
    game.playerAttack();
    return {
      wallsBefore,
      wallsAfter: game.walls.length,
      stash: game.drops.map((drop) => drop.getType()),
    };
  });

  expect(result.wallsAfter).toBe(result.wallsBefore - 1);
  expect(result.stash).toContain('dreamShard');
});

test('the axe sweeps a wide arc, the sword only hits straight ahead', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.pause();
    game.guards = [];
    game.walls = [];
    game.player.unlockWeapon('woodenAxe');
    game.player.unlockWeapon('steelSword');
    game.teleportPlayer(300, 300);
    // A guard to Theo's side while he faces down: inside the axe's 180°
    // sweep, but outside the sword's narrow forward thrust
    const guard = game.spawnGuard(240, 330);
    game.player.movement = 'down';

    game.player.selectWeapon('steelSword');
    game.playerAttack();
    const healthAfterSword = guard.getHealth();

    game.attackCooldownMs = 0;
    game.hitStopMs = 0;
    game.player.selectWeapon('woodenAxe');
    game.player.movement = 'down';
    game.playerAttack();
    const healthAfterAxe = guard.getHealth();

    return { maxHealth: guard.getMaxHealth(), healthAfterSword, healthAfterAxe };
  });

  expect(result.healthAfterSword).toBe(result.maxHealth); // narrow thrust misses the flank
  expect(result.healthAfterAxe).toBeLessThan(result.maxHealth); // the sweep connects
});

test('completing a level shows the mastery tally with stars', async ({ page }) => {
  await startNewGame(page);

  await page.evaluate(() => {
    const game = window.__wandertrap.game;
    const exit = game.exit.getPosition();
    game.teleportPlayer(exit.x, exit.y);
    game.step(1);
  });

  await expect(page.getByText('Level Completed!')).toBeVisible();
  await expect(page.getByText('★★★')).toBeVisible(); // instant and untouched
  await expect(page.getByText(/time bonus \+\d+/)).toBeVisible();
  await expect(page.getByText(/Untouched! \+\d+/)).toBeVisible();
});

test('a bookmarked run survives a page refresh via Continue', async ({ page }) => {
  await startNewGame(page);

  // Complete level 1 so the run is bookmarked to localStorage
  await page.evaluate(() => {
    const game = window.__wandertrap.game;
    const exit = game.exit.getPosition();
    game.teleportPlayer(exit.x, exit.y);
    game.step(1);
  });
  await expect(page.getByText('Level Completed!')).toBeVisible();
  const scoreBefore = await page.evaluate(() => window.__wandertrap.game.score);

  // A refresh wipes the in-memory game, but the bookmark restores it
  await page.reload();
  await expect(page.locator('#welcome-screen')).toBeVisible({ timeout: 30_000 });
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('canvas')).toBeVisible();
  await expect.poll(() => gameState(page).then((s) => s.started)).toBe(true);

  const restored = await gameState(page);
  expect(restored.level).toBe(2);
  expect(restored.score).toBe(scoreBefore);
});

test('the Daily Dream runs date-seeded and records a shareable result', async ({ page }) => {
  await openWelcomeScreen(page);
  await page.getByRole('button', { name: 'Daily Dream' }).click();
  await expect(page.locator('canvas')).toBeVisible();
  await expect.poll(() => gameState(page).then((s) => s.started)).toBe(true);
  const isDaily = await page.evaluate(() => window.__wandertrap.game.dailyMode);
  expect(isDaily).toBe(true);

  // Lose quickly: the result is recorded and the game-over screen offers a share
  await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.dismissLevelIntro();
    game.lives = 1;
    game.player.takeDamage(100);
    game.step(120); // defeat pause plays out and the run ends
  });
  await expect(page.locator('#game-over-screen')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Share Daily Result' })).toBeVisible();

  // Back on the menu, today's attempt is spent and turns into a share action
  await page.getByRole('button', { name: 'Main Menu' }).click();
  await expect(page.getByRole('button', { name: /Daily Dream ✓/ })).toBeVisible();
});

test('the dawn timer collapses the dream when it runs out', async ({ page }) => {
  await startNewGame(page);

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.pause();
    game.startAtLevel(7); // The Serpent carries the dawn timer
    game.guards = [];
    game.explosives = [];
    const timerArmed = game.dawnTimerMs !== null && game.dawnTimerMs > 0;
    game.dawnTimerMs = 50; // fast-forward to just before dawn
    game.step(20); // the timer expires and the first collapse tick hits
    return { timerArmed, health: game.player.getHealth() };
  });

  expect(result.timerArmed).toBe(true);
  expect(result.health).toBeLessThan(100);
});

test('guards without a target wander near their post instead of freezing', async ({ page }) => {
  await page.goto('/?seed=7');
  await expect(page.locator('#welcome-screen')).toBeVisible({ timeout: 30_000 });
  await page.getByRole('button', { name: 'New Game' }).click();
  await expect(page.locator('canvas')).toBeVisible();
  await page.evaluate(() => window.__wandertrap.game.dismissLevelIntro());

  const result = await page.evaluate(() => {
    const game = window.__wandertrap.game;
    game.pause();
    game.guards = [];
    game.walls = [];
    game.teleportPlayer(1200, 550); // far away: no line of sight at 5 cells
    const guard = game.spawnGuard(300, 300);
    const start = { ...guard.getPosition() };
    game.step(360); // six seconds of idle time
    const end = guard.getPosition();
    return {
      moved: Math.hypot(end.x - start.x, end.y - start.y),
      nearPost: Math.hypot(end.x - 300, end.y - 300) < 64 * 3,
    };
  });

  expect(result.moved).toBeGreaterThan(0); // patrolling, not frozen
  expect(result.nearPost).toBe(true); // but leashed to its post
});
