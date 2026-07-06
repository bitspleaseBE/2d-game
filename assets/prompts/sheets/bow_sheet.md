# Bow Attack Sprite Sheet Prompt (hero and orc archer)

Used to generate `assets/images/player/Player_Bow.png` and the
`assets/images/enemies/orc4/` sheets. Always pass an existing orc sheet
(e.g. `assets/images/enemies/orc1/orc1_attack_full.png`) as an input image
and ask for an **edit**, so frame positions, foot anchors and shadows stay
identical to the sheets the game already renders.

## Sheet Contract

- Transparent PNG sprite sheet
- Exact frame size: 64x64 pixels
- Exact grid: 8 columns x 4 rows (512x256 total)
- Rows: down, up, left, right (matches `guardSpriteManifest`)
- Columns: rest, raise bow, nock arrow, half draw, full draw, release
  (empty string, arms extended), lower bow, rest
- No arrow flying through the air — the projectile is a separate sprite
  (`assets/images/projectiles/arrow.png`) drawn by the game
- The full character holding the bow must appear in all 32 frames
- Keep feet anchored consistently in every frame

## Character Rules

- Hero sheet: match `assets/images/player/Player.png` — small boy, shaggy
  brown hair, teal pyjama shirt, blue pyjama pants, barefoot, chibi
  proportions; wooden shortbow
- Orc archer sheet (orc4): match the orc1 reference; replace the sickle
  with a wooden shortbow, remove the white slash arcs

## Style Rules

- Pixel art only, crisp nearest-neighbor look
- No text, labels, borders, or grid lines
- Plain pure white background (keyed out in post-processing)

## Post-processing and Validation

Generated images come back oversized with a white background. Normalize
them onto the exact grid, then validate:

```bash
node tools/process-sprite-sheet.js --input <raw.png> --output <sheet.png> \
  --frame-width 64 --frame-height 64 --columns 8 --rows 4
node tools/validate-sprite-sheet.js --input <sheet.png> \
  --frame-width 64 --frame-height 64 --columns 8 --rows 4 --alpha-required true
```
