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

test('reaching the exit completes level 1 and advances to level 2', async ({ page }) => {
  test.setTimeout(120_000);
  await startNewGame(page);

  // Walk the level 1 maze: east along the top corridor, south along the
  // right corridor, west along the bottom corridor, then north to the exit.
  await press(page, 'ArrowRight', 52);
  await press(page, 'ArrowDown', 64);
  await press(page, 'ArrowLeft', 27);
  await press(page, 'ArrowUp', 40);

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
