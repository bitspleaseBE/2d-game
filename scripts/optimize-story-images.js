/**
 * Compress story cinematics for web delivery.
 * Generates WebP variants and re-compresses PNG fallbacks in assets/images/story/.
 */

const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");

const STORY_DIR = path.join(__dirname, "../assets/images/story");
const STORY_FILES = [
  "intro_bedroom.png",
  "intro_doorway.png",
  "intro_orcs.png",
  "intro_throne.png",
  "intro_step_forward.png",
  "ending_dawn.png",
];

const WEBP_QUALITY = 82;
const WEBP_EFFORT = 6;

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function optimizeStoryImage(filename) {
  const inputPath = path.join(STORY_DIR, filename);
  const webpPath = inputPath.replace(/\.png$/i, ".webp");
  const tempPngPath = `${inputPath}.optimized`;

  const beforeBytes = (await fs.stat(inputPath)).size;
  const image = sharp(inputPath);

  await image
    .clone()
    .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT })
    .toFile(webpPath);

  await image
    .clone()
    .png({ compressionLevel: 9, palette: true, quality: 80, effort: 10 })
    .toFile(tempPngPath);

  await fs.rename(tempPngPath, inputPath);

  const afterPngBytes = (await fs.stat(inputPath)).size;
  const afterWebpBytes = (await fs.stat(webpPath)).size;

  console.log(
    `${filename}: ${formatBytes(beforeBytes)} -> PNG ${formatBytes(afterPngBytes)}, WebP ${formatBytes(afterWebpBytes)}`
  );
}

async function main() {
  console.log(`Optimizing ${STORY_FILES.length} story images in ${STORY_DIR}`);

  for (const filename of STORY_FILES) {
    await optimizeStoryImage(filename);
  }

  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
