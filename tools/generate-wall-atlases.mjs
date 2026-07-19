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

      // Same top/front layout for every mask (avoids T-stub checkering), but
      // open E/W edges get light/dark bevels so wall ends read as shadowed sides.
      function drawTile(ctx, mask, palette, texture, size) {
        const frontH = Math.round(size * 0.62);
        const topH = size - frontH;
        const hasE = (mask & 2) !== 0;
        const hasW = (mask & 8) !== 0;
        const topMid = shade(palette.mid, 0.58);
        const topDark = shade(palette.dark, 0.68);
        const topLight = shade(palette.light, 0.75);
        const edgeDark = shade(palette.dark, 0.55);
        const edgeLight = shade(palette.light, 1.08);

        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, size, size);

        // Top ledge — flat, quieter than the upright brick face
        const topCanvas = document.createElement("canvas");
        topCanvas.width = size;
        topCanvas.height = topH;
        const topCtx = topCanvas.getContext("2d");
        topCtx.imageSmoothingEnabled = false;
        const tw = texture.naturalWidth || texture.width;
        const th = texture.naturalHeight || texture.height;
        topCtx.drawImage(texture, 0, 0, tw, th, 0, 0, size, topH);
        topCtx.fillStyle = "rgba(0,0,0,0.38)";
        topCtx.fillRect(0, 0, size, topH);
        const topData = topCtx.getImageData(0, 0, size, topH).data;
        const out = ctx.createImageData(size, size);

        for (let y = 0; y < topH; y++) {
          for (let x = 0; x < size; x++) {
            const i = (y * size + x) * 4;
            const si = (y * size + x) * 4;
            const base = ((x + y) & 1) === 0 ? topMid : topDark;
            out.data[i] = Math.round(topData[si] * 0.3 + base[0] * 0.7);
            out.data[i + 1] = Math.round(topData[si + 1] * 0.3 + base[1] * 0.7);
            out.data[i + 2] = Math.round(topData[si + 2] * 0.3 + base[2] * 0.7);
            out.data[i + 3] = 255;
          }
        }
        // North rim highlight on the ledge
        for (let x = 0; x < size; x++) {
          const i = x * 4;
          out.data[i] = topLight[0];
          out.data[i + 1] = topLight[1];
          out.data[i + 2] = topLight[2];
        }
        // Soft shadow where top meets the front face
        for (let x = 0; x < size; x++) {
          const i = ((topH - 1) * size + x) * 4;
          out.data[i] = Math.round(out.data[i] * 0.55);
          out.data[i + 1] = Math.round(out.data[i + 1] * 0.55);
          out.data[i + 2] = Math.round(out.data[i + 2] * 0.55);
        }

        // Tall front face — the shadowed vertical side (keep brick texture)
        const faceCanvas = document.createElement("canvas");
        faceCanvas.width = size;
        faceCanvas.height = frontH;
        const faceCtx = faceCanvas.getContext("2d");
        faceCtx.imageSmoothingEnabled = false;
        faceCtx.drawImage(texture, 0, 0, tw, th, 0, 0, size, frontH);
        faceCtx.fillStyle = "rgba(0,0,0,0.18)";
        faceCtx.fillRect(0, 0, size, frontH);
        const faceData = faceCtx.getImageData(0, 0, size, frontH).data;
        const bevel = Math.max(2, Math.round(size * 0.06));

        for (let fy = 0; fy < frontH; fy++) {
          for (let x = 0; x < size; x++) {
            const src = (fy * size + x) * 4;
            const dst = ((topH + fy) * size + x) * 4;
            let r = faceData[src];
            let g = faceData[src + 1];
            let b = faceData[src + 2];
            // Soft vertical AO — darker toward the floor
            const depth = 0.92 - (fy / frontH) * 0.22;
            r = Math.round(r * depth);
            g = Math.round(g * depth);
            b = Math.round(b * depth);
            if (fy === 0) {
              r = Math.min(255, Math.round(r * 0.9 + 18));
              g = Math.min(255, Math.round(g * 0.9 + 18));
              b = Math.min(255, Math.round(b * 0.9 + 18));
            }
            if (fy >= frontH - 2) {
              const t = fy === frontH - 1 ? 0.5 : 0.72;
              r = Math.round(r * t);
              g = Math.round(g * t);
              b = Math.round(b * t);
            }
            out.data[dst] = r;
            out.data[dst + 1] = g;
            out.data[dst + 2] = b;
            out.data[dst + 3] = 255;
          }
        }

        // Open-edge bevels (only when not connected) — restores shadowed sides
        // without painting seams between adjacent wall cells.
        function blendColumn(x, color, strength) {
          for (let y = 0; y < size; y++) {
            const i = (y * size + x) * 4;
            const t = strength;
            out.data[i] = Math.round(out.data[i] * (1 - t) + color[0] * t);
            out.data[i + 1] = Math.round(out.data[i + 1] * (1 - t) + color[1] * t);
            out.data[i + 2] = Math.round(out.data[i + 2] * (1 - t) + color[2] * t);
          }
        }

        if (!hasW) {
          for (let x = 0; x < bevel; x++) {
            blendColumn(x, edgeLight, 0.55 * (1 - x / bevel));
          }
        }
        if (!hasE) {
          for (let x = 0; x < bevel; x++) {
            blendColumn(size - 1 - x, edgeDark, 0.65 * (1 - x / bevel));
          }
        }

        ctx.putImageData(out, 0, 0);
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
