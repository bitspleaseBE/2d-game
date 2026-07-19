# Forest Theme Asset Contract

Use the existing forest assets as the style reference:

- `assets/images/generated/grass_tile.png`
- `assets/images/generated/stone_wall.png`
- `assets/images/generated/palm_a.png`
- `assets/images/generated/exit_ruin.png`

The forest theme is the baseline and has its own files under `assets/images/themes/forest/`. If regenerating it later, keep the same filenames and silhouettes so early levels remain familiar.

## Style

- Top-down 2D pixel-art fantasy game asset.
- 64x64 target size.
- Chunky readable shapes, limited palette, no text, no labels.
- Match the current Wandertrap assets: soft shadows, slightly goofy fantasy mood, crisp edges.

## Assets

- `floor.png` — seamless grass tile.
- `wall.png` — grey stone dungeon wall tile (flat fallback).
- `wall_atlas.png` — 4×4 perspective autotile sheet (256×256, sixteen 64×64 cells). Index = NESW bitmask (`N=1 E=2 S=4 W=8`); column = index % 4, row = floor(index / 4). Each cell is a 3/4 top-down wall piece (top face + south front face) with transparent empty areas. Prefer regenerating via `node tools/generate-wall-atlases.mjs` from `wall.png`.
- `tree_1.png` — palm-like choppable tree on transparent background.
- `tree_2.png` — alternate palm/tree obstacle on transparent background.
- `boulder.png` — round grey boulder on transparent background.
- `exit.png` — golden ruin/portal on transparent background.
