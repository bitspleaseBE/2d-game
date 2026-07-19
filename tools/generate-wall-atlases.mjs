// Builds 3/4-perspective wall autotile atlases from each theme's existing
// flat wall.png. Pure JS + Playwright canvas (no external image API).
//
// Output:
//   assets/generated-theme-sources/{theme}_wall_atlas_source.png  (512×512)
//   assets/images/themes/{theme}/wall_atlas.png                   (256×256)
//
// Atlas layout is a 4×4 grid indexed by NESW bitmask:
//   N=1, E=2, S=4, W=8  →  tile index = N|E|S|W
//   column = index % 4, row = floor(index / 4)
//
// Usage: node tools/generate-wall-atlases.mjs

import { chromium } from "@playwright/test";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const THEMES = ["forest", "desert", "snow", "dungeon"];

const TILE = 64;
const ATLAS_TILES = 4;
const SOURCE_TILE = 128; // higher-res source cells before downscale
const SOURCE_SIZE = SOURCE_TILE * ATLAS_TILES;
const OUTPUT_SIZE = TILE * ATLAS_TILES;

function pngBufferFromDataUrl(dataUrl) {
  const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
  return Buffer.from(base64, "base64");
}

const themeEntries = THEMES.map((theme) => {
  const wallPath = join(ROOT, "assets", "images", "themes", theme, "wall.png");
  const bytes = readFileSync(wallPath);
  return {
    theme,
    wallDataUrl: `data:image/png;base64,${bytes.toString("base64")}`,
    sourcePath: join(ROOT, "assets", "generated-theme-sources", `${theme}_wall_atlas_source.png`),
    outputPath: join(ROOT, "assets", "images", "themes", theme, "wall_atlas.png"),
  };
});

const browser = await chromium.launch();

try {
  const page = await browser.newPage();
  const results = await page.evaluate(
    async ({ themes, SOURCE_TILE, SOURCE_SIZE, OUTPUT_SIZE, TILE, ATLAS_TILES }) => {
      function loadImage(dataUrl) {
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = () => reject(new Error("Failed to decode wall texture"));
          image.src = dataUrl;
        });
      }

      function samplePalette(image) {
        const c = document.createElement("canvas");
        c.width = image.naturalWidth;
        c.height = image.naturalHeight;
        const ctx = c.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(image, 0, 0);
        const { data } = ctx.getImageData(0, 0, c.width, c.height);
        let r = 0;
        let g = 0;
        let b = 0;
        let n = 0;
        let minL = 255;
        let maxL = 0;
        let dark = [0, 0, 0];
        let light = [255, 255, 255];
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 200) continue;
          const pr = data[i];
          const pg = data[i + 1];
          const pb = data[i + 2];
          r += pr;
          g += pg;
          b += pb;
          n++;
          const l = (pr + pg + pb) / 3;
          if (l < minL) {
            minL = l;
            dark = [pr, pg, pb];
          }
          if (l > maxL) {
            maxL = l;
            light = [pr, pg, pb];
          }
        }
        if (!n) {
          return {
            mid: [120, 110, 90],
            dark: [60, 50, 40],
            light: [180, 170, 140],
            mortar: [40, 30, 25],
          };
        }
        return {
          mid: [Math.round(r / n), Math.round(g / n), Math.round(b / n)],
          dark,
          light,
          mortar: [
            Math.max(0, dark[0] - 20),
            Math.max(0, dark[1] - 20),
            Math.max(0, dark[2] - 20),
          ],
        };
      }

      function rgb([r, g, b], a = 255) {
        return `rgba(${r},${g},${b},${a / 255})`;
      }

      function shade(rgbArr, factor) {
        return rgbArr.map((c) => Math.max(0, Math.min(255, Math.round(c * factor))));
      }

      // Solid dark brick for every mask. Top/front splits made T-stubs look
      // checkered (full-top cells next to front-faced cells); keep one look.
      function drawTile(ctx, _mask, _palette, texture, size) {
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(texture, 0, 0, size, size);
        ctx.fillStyle = "rgba(0,0,0,0.22)";
        ctx.fillRect(0, 0, size, size);
      }

      const outputs = [];

      for (const entry of themes) {
        const texture = await loadImage(entry.wallDataUrl);
        const palette = samplePalette(texture);

        const source = document.createElement("canvas");
        source.width = SOURCE_SIZE;
        source.height = SOURCE_SIZE;
        const sourceCtx = source.getContext("2d");
        sourceCtx.imageSmoothingEnabled = false;
        sourceCtx.clearRect(0, 0, SOURCE_SIZE, SOURCE_SIZE);

        for (let mask = 0; mask < 16; mask++) {
          const col = mask % ATLAS_TILES;
          const row = Math.floor(mask / ATLAS_TILES);
          const tile = document.createElement("canvas");
          tile.width = SOURCE_TILE;
          tile.height = SOURCE_TILE;
          const tileCtx = tile.getContext("2d");
          tileCtx.imageSmoothingEnabled = false;
          tileCtx.clearRect(0, 0, SOURCE_TILE, SOURCE_TILE);
          drawTile(tileCtx, mask, palette, texture, SOURCE_TILE);
          sourceCtx.drawImage(tile, col * SOURCE_TILE, row * SOURCE_TILE);
        }

        const output = document.createElement("canvas");
        output.width = OUTPUT_SIZE;
        output.height = OUTPUT_SIZE;
        const outputCtx = output.getContext("2d");
        outputCtx.imageSmoothingEnabled = false;
        outputCtx.clearRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
        outputCtx.drawImage(source, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

        outputs.push({
          theme: entry.theme,
          sourcePath: entry.sourcePath,
          outputPath: entry.outputPath,
          sourceDataUrl: source.toDataURL("image/png"),
          outputDataUrl: output.toDataURL("image/png"),
        });
      }

      return outputs;
    },
    {
      themes: themeEntries,
      SOURCE_TILE,
      SOURCE_SIZE,
      OUTPUT_SIZE,
      TILE,
      ATLAS_TILES,
    }
  );

  for (const result of results) {
    mkdirSync(dirname(result.sourcePath), { recursive: true });
    mkdirSync(dirname(result.outputPath), { recursive: true });
    writeFileSync(result.sourcePath, pngBufferFromDataUrl(result.sourceDataUrl));
    writeFileSync(result.outputPath, pngBufferFromDataUrl(result.outputDataUrl));
    console.log(`wrote ${result.sourcePath}`);
    console.log(`wrote ${result.outputPath}`);
  }
} finally {
  await browser.close();
}
