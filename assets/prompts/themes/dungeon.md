# Dungeon Theme Asset Contract

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
- Dungeon palette: dark stone, mossy green accents, charcoal cracks, dull gold highlights for the exit.
- Floor and wall assets should fill the whole square. Obstacles and exits should have transparent backgrounds.

## Assets

- `floor.png` — seamless cracked stone floor tile, darker than the current grass levels.
- `wall.png` — dark mossy brick wall tile, high enough contrast against the floor (flat fallback).
- `wall_atlas.png` — 4×4 perspective autotile sheet (256×256, sixteen 64×64 cells). Index = NESW bitmask (`N=1 E=2 S=4 W=8`); column = index % 4, row = floor(index / 4). Each cell is a 3/4 top-down wall piece (top face + south front face) with transparent empty areas. Prefer regenerating via `node tools/generate-wall-atlases.mjs` from `wall.png`.
- `obstacle_1.png` — broken stone pillar obstacle, transparent background.
- `obstacle_2.png` — burned stump or shattered wooden barricade obstacle, transparent background.
- `boulder.png` — dark dungeon rubble boulder, transparent background.
- `exit.png` — ominous dark ruin portal with a small gold/green glow, transparent background.
