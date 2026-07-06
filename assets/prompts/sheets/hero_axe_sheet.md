# Theo Axe Sprite Sheet Prompt

Generate only after `assets/prompts/characters/theo_pyjamas.md` has produced an
approved Theo reference image. Use that approved reference as an input image.

## Sheet Contract
- Transparent PNG sprite sheet
- Exact frame size: 48x48 pixels
- Exact grid: 2 columns x 4 rows
- Rows: down, up, right, left
- Columns: windup, strike
- Theo must match the approved reference: same pyjamas, hair, face, body size
- Axe should be wooden-handled, toy-like but readable, with bright metal head
- Keep Theo anchored at the same foot position in every frame
- Keep weapon inside each 48x48 frame

## Style Rules
- Pixel art only, crisp nearest-neighbor look
- No anti-aliased blur
- Strong silhouette contrast
- No text, labels, borders, shadows outside frame bounds, or background

## Validation Must Pass
The generated sheet must pass `tools/validate-sprite-sheet.js` with:

```bash
node tools/validate-sprite-sheet.js --input <sheet.png> --frame-width 48 --frame-height 48 --columns 2 --rows 4 --alpha-required true
```
