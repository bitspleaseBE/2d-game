// Normalizes generated theme art into the 64x64 PNGs used by the game.
//
// Usage:
//   node tools/process-theme-assets.mjs desert:floor=/path/to/source.png ...
//
// Sources must be PNGs under the repository root. For one-off generated files
// elsewhere, set THEME_ASSET_INPUT_ROOT=/that/source/folder.
//
// Valid keys are theme:asset, for example:
//   desert:floor, desert:wall, desert:tree_1, desert:tree_2, desert:boulder, desert:exit

import { chromium } from "@playwright/test";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const EXTRA_INPUT_ROOT = process.env.THEME_ASSET_INPUT_ROOT
  ? resolve(process.env.THEME_ASSET_INPUT_ROOT)
  : null;
const ALLOWED_INPUT_ROOTS = [resolve(ROOT), EXTRA_INPUT_ROOT].filter(Boolean);

const OUTPUTS = {
  "desert:floor": "assets/images/themes/desert/floor.png",
  "desert:wall": "assets/images/themes/desert/wall.png",
  "desert:tree_1": "assets/images/themes/desert/tree_1.png",
  "desert:tree_2": "assets/images/themes/desert/tree_2.png",
  "desert:boulder": "assets/images/themes/desert/boulder.png",
  "desert:exit": "assets/images/themes/desert/exit.png",

  "snow:floor": "assets/images/themes/snow/floor.png",
  "snow:wall": "assets/images/themes/snow/wall.png",
  "snow:tree_1": "assets/images/themes/snow/tree_1.png",
  "snow:tree_2": "assets/images/themes/snow/tree_2.png",
  "snow:boulder": "assets/images/themes/snow/boulder.png",
  "snow:exit": "assets/images/themes/snow/exit.png",

  "dungeon:floor": "assets/images/themes/dungeon/floor.png",
  "dungeon:wall": "assets/images/themes/dungeon/wall.png",
  "dungeon:obstacle_1": "assets/images/themes/dungeon/obstacle_1.png",
  "dungeon:obstacle_2": "assets/images/themes/dungeon/obstacle_2.png",
  "dungeon:boulder": "assets/images/themes/dungeon/boulder.png",
  "dungeon:exit": "assets/images/themes/dungeon/exit.png",
};

const OPAQUE_ASSETS = new Set(["floor", "wall"]);

function isInside(root, target) {
  const pathFromRoot = relative(root, target);
  return pathFromRoot === "" || (!pathFromRoot.startsWith("..") && !isAbsolute(pathFromRoot));
}

function resolveInputPath(rawPath) {
  const inputPath = resolve(rawPath);
  if (extname(inputPath).toLowerCase() !== ".png") {
    throw new Error(`Theme asset source must be a PNG: ${rawPath}`);
  }
  if (!ALLOWED_INPUT_ROOTS.some((root) => isInside(root, inputPath))) {
    throw new Error(
      `Theme asset source is outside allowed roots. Set THEME_ASSET_INPUT_ROOT for generated sources: ${rawPath}`
    );
  }
  return inputPath;
}

function parseEntries(args) {
  if (args.length === 0) {
    throw new Error("No assets provided. Pass entries like desert:floor=/path/to/source.png");
  }

  return args.map((arg) => {
    const splitAt = arg.indexOf("=");
    if (splitAt === -1) throw new Error(`Invalid entry: ${arg}`);
    const key = arg.slice(0, splitAt);
    const inputPath = resolveInputPath(arg.slice(splitAt + 1));
    if (!OUTPUTS[key]) throw new Error(`Unknown theme asset key: ${key}`);

    const asset = key.split(":")[1];
    const bytes = readFileSync(inputPath);
    return {
      key,
      inputPath,
      outputPath: join(ROOT, OUTPUTS[key]),
      transparent: !OPAQUE_ASSETS.has(asset),
      dataUrl: `data:image/png;base64,${bytes.toString("base64")}`,
    };
  });
}

function pngBufferFromDataUrl(dataUrl) {
  const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
  return Buffer.from(base64, "base64");
}

const entries = parseEntries(process.argv.slice(2));
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
