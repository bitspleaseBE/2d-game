# Snow Theme Asset Contract

Generate with gpt-image-2 using the current forest assets as style references:

- `assets/images/generated/grass_tile.png`
- `assets/images/generated/stone_wall.png`
- `assets/images/generated/palm_a.png`
- `assets/images/generated/boulder.png`
- `assets/images/generated/exit_ruin.png`

## Style

- Top-down 2D pixel-art fantasy dungeon asset.
- 64x64 target size.
- Match the current Wandertrap assets: crisp pixel edges, readable at game scale, soft tiny shadows, no text, no labels.
- Snow palette: cold blue-white snow, ice highlights, blue-grey stone, muted violet shadows.
- Floor and wall assets should fill the whole square. Obstacles and exits should have transparent backgrounds.

## Assets

- `floor.png` — seamless snow floor tile with packed snow, light blue shadows, and tiny ice specks.
- `wall.png` — icy stone wall tile with snow collected on top edges (flat fallback).
- `wall_atlas.png` — 4×4 perspective autotile sheet (256×256, sixteen 64×64 cells). Index = NESW bitmask (`N=1 E=2 S=4 W=8`); column = index % 4, row = floor(index / 4). Each cell is a 3/4 top-down wall piece (top face + south front face) with transparent empty areas. Prefer regenerating via `node tools/generate-wall-atlases.mjs` from `wall.png`.
- `tree_1.png` — bare frosted tree obstacle, transparent background.
- `tree_2.png` — snow-covered stump or dead winter shrub obstacle, transparent background.
- `boulder.png` — icy boulder with snow cap, transparent background.
- `exit.png` — frozen ruin portal with blue-white frost, transparent background.
