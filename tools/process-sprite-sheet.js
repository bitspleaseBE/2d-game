const { chromium } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

// Post-process a generated sprite sheet image so it matches the sheet
// contract used by the game (see assets/prompts/sheets/*). Generated sheets
// come back at arbitrary sizes (e.g. 1536x1024) with a near-white background,
// so this tool:
// - keys the background out to transparency with an edge flood fill
//   (character pixels and gray drop shadows survive)
// - splits the source into a uniform grid of cells
// - re-draws every cell's content onto an exact target grid (e.g. 8x4 cells
//   of 64x64), using one global scale for the whole sheet, centered
//   horizontally per cell and bottom-anchored to a shared foot baseline so
//   frames animate without wobble
// Companion to process-sprite.js, which does the same for single sprites.
// Validate the result with validate-sprite-sheet.js.

function readArg(name, fallback = null) {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? fallback : process.argv[index + 1];
}

const input = readArg("input");
const output = readArg("output");
const frameWidth = Number(readArg("frame-width", 64));
const frameHeight = Number(readArg("frame-height", 64));
const columns = Number(readArg("columns", 8));
const rows = Number(readArg("rows", 4));

if (!input || !output) {
  console.error("Usage: node tools/process-sprite-sheet.js --input <png> --output <png> [--frame-width 64 --frame-height 64 --columns 8 --rows 4]");
  process.exit(1);
}

function mimeFor(filePath) {
  return path.extname(filePath).toLowerCase() === ".jpg" ? "image/jpeg" : "image/png";
}

async function main() {
  const absoluteInput = path.resolve(input);
  const absoluteOutput = path.resolve(output);
  const dataUrl = `data:${mimeFor(absoluteInput)};base64,${fs.readFileSync(absoluteInput).toString("base64")}`;

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const result = await page.evaluate(async ({ dataUrl, frameWidth, frameHeight, columns, rows }) => {
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = dataUrl;
    });

    // Near-white pixels count as background; gray drop shadows survive
    function isBackground(r, g, b, a) {
      if (a < 16) return true;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      return max > 220 && max - min < 24;
    }

    const source = document.createElement("canvas");
    source.width = image.naturalWidth;
    source.height = image.naturalHeight;
    const sourceCtx = source.getContext("2d");
    sourceCtx.drawImage(image, 0, 0);

    // Key the background out with a flood fill from every edge
    const imageData = sourceCtx.getImageData(0, 0, source.width, source.height);
    const { data } = imageData;
    const visited = new Uint8Array(source.width * source.height);
    const stack = [];
    function push(x, y) {
      if (x < 0 || y < 0 || x >= source.width || y >= source.height) return;
      const index = y * source.width + x;
      if (visited[index]) return;
      const offset = index * 4;
      if (!isBackground(data[offset], data[offset + 1], data[offset + 2], data[offset + 3])) return;
      visited[index] = 1;
      stack.push([x, y]);
    }
    for (let x = 0; x < source.width; x++) {
      push(x, 0);
      push(x, source.height - 1);
    }
    for (let y = 0; y < source.height; y++) {
      push(0, y);
      push(source.width - 1, y);
    }
    while (stack.length) {
      const [x, y] = stack.pop();
      data[(y * source.width + x) * 4 + 3] = 0;
      push(x + 1, y);
      push(x - 1, y);
      push(x, y + 1);
      push(x, y - 1);
    }
    sourceCtx.putImageData(imageData, 0, 0);

    // Generated sheets rarely sit on a perfectly uniform grid, so find the
    // actual row/column bands from the content: project the alpha channel
    // onto each axis and split on gaps, merging gaps smaller than a threshold.
    function findBands(length, countAt, expected, mergeGap) {
      const bands = [];
      let start = null;
      for (let i = 0; i < length; i++) {
        const filled = countAt(i) > 0;
        if (filled && start === null) start = i;
        if (!filled && start !== null) {
          bands.push({ start, end: i - 1 });
          start = null;
        }
      }
      if (start !== null) bands.push({ start, end: length - 1 });
      // Merge bands separated by tiny gaps (stray pixels, touching limbs)
      const merged = [];
      for (const band of bands) {
        const previous = merged[merged.length - 1];
        if (previous && band.start - previous.end <= mergeGap) {
          previous.end = band.end;
        } else {
          merged.push({ ...band });
        }
      }
      // Keep the `expected` widest bands (drops speckle noise)
      if (merged.length > expected) {
        merged.sort((a, b) => (b.end - b.start) - (a.end - a.start));
        merged.length = expected;
        merged.sort((a, b) => a.start - b.start);
      }
      return merged;
    }

    function alphaAt(x, y) {
      return data[(y * source.width + x) * 4 + 3];
    }

    const rowCounts = new Array(source.height).fill(0);
    for (let y = 0; y < source.height; y++) {
      for (let x = 0; x < source.width; x++) {
        if (alphaAt(x, y) > 16) rowCounts[y]++;
      }
    }
    const rowBands = findBands(source.height, (y) => rowCounts[y], rows, Math.round(source.height / rows / 8));
    if (rowBands.length !== rows) {
      return { error: `Expected ${rows} sprite rows, detected ${rowBands.length}` };
    }

    const cells = [];
    rowBands.forEach((rowBand, rowIndex) => {
      const columnCounts = new Array(source.width).fill(0);
      for (let x = 0; x < source.width; x++) {
        for (let y = rowBand.start; y <= rowBand.end; y++) {
          if (alphaAt(x, y) > 16) columnCounts[x]++;
        }
      }
      const columnBands = findBands(source.width, (x) => columnCounts[x], columns, Math.round(source.width / columns / 8));
      columnBands.forEach((columnBand, columnIndex) => {
        // Tight content bounds inside the detected band
        let minX = Infinity, minY = Infinity, maxX = -1, maxY = -1;
        for (let y = rowBand.start; y <= rowBand.end; y++) {
          for (let x = columnBand.start; x <= columnBand.end; x++) {
            if (alphaAt(x, y) > 16) {
              minX = Math.min(minX, x);
              minY = Math.min(minY, y);
              maxX = Math.max(maxX, x);
              maxY = Math.max(maxY, y);
            }
          }
        }
        if (maxX === -1) return;
        // When fewer bands than columns were found, map by horizontal
        // position instead of index so frames land in the right column
        const col = columnBands.length === columns
          ? columnIndex
          : Math.min(columns - 1, Math.round(((minX + maxX) / 2 / source.width) * columns - 0.5));
        cells.push({ row: rowIndex, col, startX: 0, startY: 0, minX, minY, maxX, maxY, empty: false });
      });
    });

    const filled = cells;
    if (filled.length === 0) return { error: "No content found in any cell" };

    // One global scale so relative frame sizes stay consistent; leave a
    // small margin so nothing touches the frame edge
    const maxContent = Math.max(
      ...filled.map((cell) => Math.max(cell.maxX - cell.minX + 1, cell.maxY - cell.minY + 1))
    );
    const scale = (Math.min(frameWidth, frameHeight) - 8) / maxContent;

    const target = document.createElement("canvas");
    target.width = frameWidth * columns;
    target.height = frameHeight * rows;
    const targetCtx = target.getContext("2d");
    targetCtx.imageSmoothingEnabled = false;

    const baselineY = frameHeight - 5; // shared foot/shadow anchor
    for (const cell of filled) {
      const contentWidth = (cell.maxX - cell.minX + 1) * scale;
      const contentHeight = (cell.maxY - cell.minY + 1) * scale;
      const destX = cell.col * frameWidth + (frameWidth - contentWidth) / 2;
      const destY = cell.row * frameHeight + baselineY - contentHeight;
      targetCtx.drawImage(
        source,
        cell.startX + cell.minX,
        cell.startY + cell.minY,
        cell.maxX - cell.minX + 1,
        cell.maxY - cell.minY + 1,
        destX,
        destY,
        contentWidth,
        contentHeight
      );
    }

    const missing = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        if (!filled.some((cell) => cell.row === row && cell.col === col)) {
          missing.push(`row ${row + 1}, col ${col + 1}`);
        }
      }
    }
    return {
      png: target.toDataURL("image/png").split(",")[1],
      emptyCells: missing,
    };
  }, { dataUrl, frameWidth, frameHeight, columns, rows });

  await browser.close();

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }
  if (result.emptyCells.length > 0) {
    console.warn(`Warning: empty cells: ${result.emptyCells.join("; ")}`);
  }
  fs.mkdirSync(path.dirname(absoluteOutput), { recursive: true });
  fs.writeFileSync(absoluteOutput, Buffer.from(result.png, "base64"));
  console.log(`Wrote ${absoluteOutput}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
