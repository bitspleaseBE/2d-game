# Goofy Powerful Orc Sprite Sheet Prompt

Generate only after `assets/prompts/characters/orc_goofy_powerful.md` has
produced an approved orc reference image. Use that approved reference as an
input image.

## Sheet Contract
- Transparent PNG sprite sheet
- Exact frame size: 64x64 pixels
- Exact grid: 4 columns x 4 rows
- Rows: down, up, left, right
- Columns: animation frames 1-4
- Orc must match the approved reference in every frame
- Keep feet anchored consistently in every frame
- Keep weapon and body inside each 64x64 frame

## Suggested Sheet Variants
Use this same contract for:
- idle
- walk
- attack
- hurt
- defeated

Each variant should be generated as a separate sheet so gameplay can mix and
replace states independently.

## Style Rules
- Pixel art only, crisp nearest-neighbor look
- Goofy expression, powerful posture
- Strong contrast against grass and stone
- No text, labels, borders, shadows outside frame bounds, or background

## Validation Must Pass
The generated sheet must pass `tools/validate-sprite-sheet.js` with:

```bash
node tools/validate-sprite-sheet.js --input <sheet.png> --frame-width 64 --frame-height 64 --columns 4 --rows 4 --alpha-required true
```
