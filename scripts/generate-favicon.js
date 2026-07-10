/**
 * Build favicon assets from existing game sprites.
 */

const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "assets");
const PLAYER_SHEET = path.join(
  ROOT,
  "assets/images/generated/characters/player/Player.png"
);
const CRYSTAL = path.join(ROOT, "assets/images/powerups/Green_crystal2.png");

const FRAME_SIZE = 32;
const BG_COLOR = { r: 17, g: 9, b: 20, alpha: 255 };

async function extractPlayerFrame() {
  return sharp(PLAYER_SHEET)
    .extract({ left: 0, top: 0, width: FRAME_SIZE, height: FRAME_SIZE })
    .png()
    .toBuffer();
}

async function extractCrystal() {
  return sharp(CRYSTAL)
    .resize(14, 14, { kernel: sharp.kernel.nearest })
    .png()
    .toBuffer();
}

async function buildFavicon(size) {
  const player = await extractPlayerFrame();
  const crystal = await extractCrystal();
  const playerSize = size <= 16 ? 14 : Math.round(size * 0.72);
  const playerOffset = Math.round((size - playerSize) / 2) + (size <= 16 ? 1 : 0);
  const crystalOffset = size <= 16 ? 1 : 2;

  const resizedPlayer = await sharp(player)
    .resize(playerSize, playerSize, { kernel: sharp.kernel.nearest })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BG_COLOR,
    },
  })
    .composite([
      { input: resizedPlayer, left: playerOffset, top: playerOffset - 1 },
      { input: crystal, left: size - 14 - crystalOffset, top: crystalOffset },
    ])
    .png()
    .toBuffer();
}

async function writePng(filename, size) {
  const buffer = await buildFavicon(size);
  const outputPath = path.join(OUT_DIR, filename);
  await sharp(buffer).png().toFile(outputPath);
  console.log(`Wrote ${outputPath} (${size}x${size})`);
}

async function main() {
  await writePng("favicon-16.png", 16);
  await writePng("favicon-32.png", 32);
  await writePng("favicon-180.png", 180);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
