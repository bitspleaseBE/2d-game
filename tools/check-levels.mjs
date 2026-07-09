// Level sanity checker: verifies every level is well-formed and beatable.
//
//   node tools/check-levels.mjs
//
// Checks per level:
// - rectangular 10x20 grid of known symbols
// - exactly one player spawn and one exit
// - the exit is reachable from the spawn (trees/boulders count as passable
//   because they can be chopped once the axe is owned; locked doors count as
//   passable because a guard always drops the key)
// - every crystal, explosive and guard is reachable too, so no content is
//   walled off by accident
// - a level with a locked door has at least one reachable guard to drop the key
// - only the wooden axe chops trees and boulders, so the pedestal that grants
//   it must be reachable without chopping, and every level before it must be
//   beatable without chopping too

import levelData from '../game/levels/level-data.js';

const KNOWN = new Set(['#', ' ', 'P', 'X', 'T', 'O', 'G', 'A', 'B', 'C', 'E', 'D', 'W', 'H', 'V', 'M', 'R']);
// Cells the player can eventually occupy or clear out of the way
// ('R' cracked walls break to an axe swing, like trees and boulders)
const PASSABLE = new Set([' ', 'P', 'X', 'T', 'O', 'G', 'A', 'B', 'C', 'E', 'D', 'W', 'H', 'V', 'M', 'R']);
// Same, but before the axe is found: trees, boulders and cracked walls are hard walls
const PASSABLE_WITHOUT_AXE = new Set([...PASSABLE].filter((c) => c !== 'T' && c !== 'O' && c !== 'R'));

// The level whose pedestal grants the axe; earlier levels get no chopping
const axeLevelNumber = (() => {
  for (let number = 1; ; number++) {
    const level = levelData.getLevel(number);
    if (!level) return Infinity;
    if (level.weaponReward === 'woodenAxe') return number;
  }
})();

let failures = 0;
const fail = (level, message) => {
  failures++;
  console.error(`  FAIL level ${level.number} (${level.name}): ${message}`);
};

for (let number = 1; ; number++) {
  const level = levelData.getLevel(number);
  if (!level) break;
  const { layout } = level;
  console.log(`Level ${number}: ${level.name} [${level.difficulty}]`);

  if (layout.length !== 10) fail(level, `expected 10 rows, got ${layout.length}`);
  layout.forEach((row, y) => {
    if (row.length !== 20) fail(level, `row ${y} has ${row.length} cells, expected 20`);
    row.forEach((cell, x) => {
      if (!KNOWN.has(cell)) fail(level, `unknown symbol '${cell}' at (${x}, ${y})`);
    });
  });

  const positionsOf = (symbol) => {
    const found = [];
    layout.forEach((row, y) => row.forEach((cell, x) => {
      if (cell === symbol) found.push({ x, y });
    }));
    return found;
  };

  const spawns = positionsOf('P');
  const exits = positionsOf('X');
  if (spawns.length !== 1) fail(level, `expected 1 spawn, found ${spawns.length}`);
  if (exits.length !== 1) fail(level, `expected 1 exit, found ${exits.length}`);
  if (spawns.length !== 1 || exits.length !== 1) continue;

  // Flood fill from the spawn across everything the player can pass or clear
  const floodFill = (passable) => {
    const reached = new Set();
    const queue = [spawns[0]];
    while (queue.length > 0) {
      const { x, y } = queue.pop();
      const key = `${x},${y}`;
      if (reached.has(key)) continue;
      if (y < 0 || y >= layout.length || x < 0 || x >= layout[y].length) continue;
      if (!passable.has(layout[y][x])) continue;
      reached.add(key);
      queue.push({ x: x + 1, y }, { x: x - 1, y }, { x, y: y + 1 }, { x, y: y - 1 });
    }
    return reached;
  };
  const reachable = floodFill(PASSABLE);

  // Chopping needs the axe: before its pedestal level the exit must be
  // reachable with trees/boulders as walls; on the pedestal level itself,
  // the pedestal must be reachable that way
  const reachableWithoutAxe = floodFill(PASSABLE_WITHOUT_AXE);
  if (level.number < axeLevelNumber) {
    for (const p of positionsOf('X')) {
      if (!reachableWithoutAxe.has(`${p.x},${p.y}`)) {
        fail(level, `exit at (${p.x}, ${p.y}) needs chopping, but the axe is not available yet`);
      }
    }
  }
  if (level.weaponReward === 'woodenAxe') {
    for (const p of positionsOf('W')) {
      if (!reachableWithoutAxe.has(`${p.x},${p.y}`)) {
        fail(level, `axe pedestal at (${p.x}, ${p.y}) is walled off behind choppable obstacles`);
      }
    }
  }

  const requireReachable = (symbol, label) => {
    for (const p of positionsOf(symbol)) {
      if (!reachable.has(`${p.x},${p.y}`)) {
        fail(level, `${label} at (${p.x}, ${p.y}) is not reachable from the spawn`);
      }
    }
  };
  requireReachable('X', 'exit');
  requireReachable('C', 'crystal');
  requireReachable('E', 'explosive');
  requireReachable('G', 'guard');
  requireReachable('A', 'archer');
  requireReachable('B', 'boss');
  requireReachable('W', 'weapon pedestal');
  requireReachable('H', 'haste rune');
  requireReachable('V', 'warding rune');
  requireReachable('M', 'might rune');

  if (positionsOf('D').length > 0) {
    const fighters = [...positionsOf('G'), ...positionsOf('A'), ...positionsOf('B')]
      .filter((p) => reachable.has(`${p.x},${p.y}`));
    if (fighters.length === 0) {
      fail(level, 'has a locked door but no reachable guard to drop the key');
    }
  }
}

if (failures > 0) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log('\nAll levels are well-formed and beatable.');
