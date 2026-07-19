// Orthogonal wall autotile masks for Wandertrap.
//
// Each wall cell picks a 64×64 region from a 4×4 atlas using a 4-bit NESW mask:
//   N = 1, E = 2, S = 4, W = 8
//   index = N | E | S | W
//   atlas column = index % 4, row = Math.floor(index / 4)

export const WALL_DIR = {
  N: 1,
  E: 2,
  S: 4,
  W: 8,
};

export const WALL_ATLAS_COLUMNS = 4;
export const WALL_TILE_SIZE = 64;

/** Cells that participate in wall connectivity. Locked doors count until opened. */
export function isWallConnector(cell, open = false) {
  if (cell === "#" || cell === "R") return true;
  if (cell === "D") return !open;
  return false;
}

/**
 * Compute the NESW bitmask for the wall at (x, y).
 * @param {string[][]} layout - row-major level grid
 * @param {number} x - column
 * @param {number} y - row
 * @param {{ openDoors?: Set<string> }} [options]
 *   openDoors keys are `"col,row"` for unlocked doors
 */
export function getWallMask(layout, x, y, options = {}) {
  const openDoors = options.openDoors || null;

  const connected = (cx, cy) => {
    if (cy < 0 || cx < 0 || cy >= layout.length) return false;
    const row = layout[cy];
    if (!row || cx >= row.length) return false;
    const cell = row[cx];
    const doorOpen = openDoors ? openDoors.has(`${cx},${cy}`) : false;
    return isWallConnector(cell, doorOpen);
  };

  let mask = 0;
  if (connected(x, y - 1)) mask |= WALL_DIR.N;
  if (connected(x + 1, y)) mask |= WALL_DIR.E;
  if (connected(x, y + 1)) mask |= WALL_DIR.S;
  if (connected(x - 1, y)) mask |= WALL_DIR.W;
  return mask;
}

/** Source rectangle inside a 256×256 (or N×64) wall atlas for a given mask. */
export function atlasRectForMask(mask, tileSize = WALL_TILE_SIZE) {
  const index = mask & 0xf;
  const col = index % WALL_ATLAS_COLUMNS;
  const row = Math.floor(index / WALL_ATLAS_COLUMNS);
  return {
    sx: col * tileSize,
    sy: row * tileSize,
    sw: tileSize,
    sh: tileSize,
  };
}
