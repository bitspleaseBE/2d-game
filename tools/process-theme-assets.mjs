// Normalizes generated theme art into the 64x64 PNGs used by the game.
//
// Usage:
//   node tools/process-theme-assets.mjs
//
// Source PNGs are read from assets/generated-theme-sources/ with names like
// desert_floor_source.png and dungeon_obstacle_1_source.png.

import { chromium } from "@playwright/test";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_DIR = join(ROOT, "assets", "generated-theme-sources");

const OPAQUE_ASSETS = new Set(["floor", "wall"]);

function themeAsset(theme, asset, outputName = asset) {
  return {
    key: `${theme}:${asset}`,
    asset,
    inputPath: join(SOURCE_DIR, `${theme}_${asset}_source.png`),
    outputPath: join(ROOT, "assets", "images", "themes", theme, `${outputName}.png`),
  };
}

const SOURCE_ASSETS = [
  themeAsset("desert", "floor"),
  themeAsset("desert", "wall"),
  themeAsset("desert", "tree_1"),
  themeAsset("desert", "tree_2"),
  themeAsset("desert", "boulder"),
  themeAsset("desert", "exit"),

  themeAsset("snow", "floor"),
  themeAsset("snow", "wall"),
  themeAsset("snow", "tree_1"),
  themeAsset("snow", "tree_2"),
  themeAsset("snow", "boulder"),
  themeAsset("snow", "exit"),

  themeAsset("dungeon", "floor"),
  themeAsset("dungeon", "wall"),
  themeAsset("dungeon", "obstacle_1"),
  themeAsset("dungeon", "obstacle_2"),
  themeAsset("dungeon", "boulder"),
  themeAsset("dungeon", "exit"),
];

function parseEntries() {
  return SOURCE_ASSETS.map(({ key, asset, inputPath, outputPath }) => {
    const bytes = readFileSync(inputPath);
    return {
      key,
      inputPath,
      outputPath,
      transparent: !OPAQUE_ASSETS.has(asset),
      dataUrl: `data:image/png;base64,${bytes.toString("base64")}`,
    };
  });
}

function pngBufferFromDataUrl(dataUrl) {
  const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
  return Buffer.from(base64, "base64");
}

const entries = parseEntries();
const browser = await chromium.launch();

try {
  const page = await browser.newPage();
  const results = await page.evaluate(async (assets) => {
    const SIZE = 64;

    function loadImage(dataUrl) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("Failed to decode generated image"));
        image.src = dataUrl;
      });
    }

    function isBackgroundPixel(data, index) {
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const a = data[index + 3];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);

      if (a < 16) return true;
      // gpt-image-2 often renders transparent previews as edge-connected
      // white/grey checkerboards. Remove those only by flood-filling from
      // the edges so white details inside a sprite are preserved.
      return max > 214 && max - min < 28;
    }

    function removeEdgeBackground(sourceCanvas) {
      const ctx = sourceCanvas.getContext("2d");
      const { width, height } = sourceCanvas;
      const imageData = ctx.getImageData(0, 0, width, height);
      const { data } = imageData;
      const seen = new Uint8Array(width * height);
      const queue = [];

      function enqueue(x, y) {
        if (x < 0 || y < 0 || x >= width || y >= height) return;
        const pos = y * width + x;
        if (seen[pos]) return;
        const i = pos * 4;
        if (!isBackgroundPixel(data, i)) return;
        seen[pos] = 1;
        queue.push([x, y]);
      }

      for (let x = 0; x < width; x++) {
        enqueue(x, 0);
        enqueue(x, height - 1);
      }
      for (let y = 0; y < height; y++) {
        enqueue(0, y);
        enqueue(width - 1, y);
      }

      while (queue.length) {
        const [x, y] = queue.pop();
        const i = (y * width + x) * 4;
        data[i + 3] = 0;
        enqueue(x + 1, y);
        enqueue(x - 1, y);
        enqueue(x, y + 1);
        enqueue(x, y - 1);
      }

      ctx.putImageData(imageData, 0, 0);
    }

    function contentBounds(canvas) {
      const ctx = canvas.getContext("2d");
      const { width, height } = canvas;
      const { data } = ctx.getImageData(0, 0, width, height);
      let minX = width;
      let minY = height;
      let maxX = -1;
      let maxY = -1;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const alpha = data[(y * width + x) * 4 + 3];
          if (alpha < 12) continue;
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }

      if (maxX === -1) return { x: 0, y: 0, width, height };
      const padding = Math.ceil(Math.max(maxX - minX + 1, maxY - minY + 1) * 0.08);
      minX = Math.max(0, minX - padding);
      minY = Math.max(0, minY - padding);
      maxX = Math.min(width - 1, maxX + padding);
      maxY = Math.min(height - 1, maxY + padding);

      const boxWidth = maxX - minX + 1;
      const boxHeight = maxY - minY + 1;
      const side = Math.min(width, height, Math.max(boxWidth, boxHeight));
      const centerX = minX + boxWidth / 2;
      const centerY = minY + boxHeight / 2;

      return {
        x: Math.max(0, Math.min(width - side, Math.round(centerX - side / 2))),
        y: Math.max(0, Math.min(height - side, Math.round(centerY - side / 2))),
        width: side,
        height: side,
      };
    }

    async function normalize(asset) {
      const image = await loadImage(asset.dataUrl);
      const source = document.createElement("canvas");
      source.width = image.naturalWidth;
      source.height = image.naturalHeight;
      const sourceCtx = source.getContext("2d");
      sourceCtx.imageSmoothingEnabled = false;
      sourceCtx.drawImage(image, 0, 0);

      if (asset.transparent) removeEdgeBackground(source);

      const bounds = asset.transparent
        ? contentBounds(source)
        : { x: 0, y: 0, width: source.width, height: source.height };

      const target = document.createElement("canvas");
      target.width = SIZE;
      target.height = SIZE;
      const targetCtx = target.getContext("2d");
      targetCtx.imageSmoothingEnabled = false;
      targetCtx.clearRect(0, 0, SIZE, SIZE);
      targetCtx.drawImage(
        source,
        bounds.x,
        bounds.y,
        bounds.width,
        bounds.height,
        0,
        0,
        SIZE,
        SIZE
      );

      return { key: asset.key, outputPath: asset.outputPath, dataUrl: target.toDataURL("image/png") };
    }

    return Promise.all(assets.map(normalize));
  }, entries);

  for (const result of results) {
    mkdirSync(dirname(result.outputPath), { recursive: true });
    writeFileSync(result.outputPath, pngBufferFromDataUrl(result.dataUrl));
    console.log(`wrote ${result.outputPath}`);
  }
} finally {
  await browser.close();
}
