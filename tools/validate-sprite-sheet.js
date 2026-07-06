const { chromium } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

function arg(name, fallback = null) {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? fallback : process.argv[index + 1];
}

const input = arg("input");
const frameWidth = Number(arg("frame-width"));
const frameHeight = Number(arg("frame-height"));
const columns = Number(arg("columns"));
const rows = Number(arg("rows"));
const alphaRequired = arg("alpha-required", "true") !== "false";

if (!input || !frameWidth || !frameHeight || !columns || !rows) {
  console.error("Usage: node tools/validate-sprite-sheet.js --input <png> --frame-width N --frame-height N --columns N --rows N [--alpha-required true]");
  process.exit(1);
}

function mimeFor(filePath) {
  return path.extname(filePath).toLowerCase() === ".jpg" ? "image/jpeg" : "image/png";
}

async function main() {
  const absoluteInput = path.resolve(input);
  const dataUrl = `data:${mimeFor(absoluteInput)};base64,${fs.readFileSync(absoluteInput).toString("base64")}`;

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const result = await page.evaluate(async (options) => {
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = options.dataUrl;
    });

    const expectedWidth = options.frameWidth * options.columns;
    const expectedHeight = options.frameHeight * options.rows;
    const errors = [];

    if (image.naturalWidth !== expectedWidth || image.naturalHeight !== expectedHeight) {
      errors.push(`Expected ${expectedWidth}x${expectedHeight}, got ${image.naturalWidth}x${image.naturalHeight}`);
    }

    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    function alphaAt(x, y) {
      return pixels[(y * canvas.width + x) * 4 + 3];
    }

    if (options.alphaRequired) {
      const corners = [
        alphaAt(0, 0),
        alphaAt(canvas.width - 1, 0),
        alphaAt(0, canvas.height - 1),
        alphaAt(canvas.width - 1, canvas.height - 1),
      ];
      if (corners.some((alpha) => alpha > 8)) {
        errors.push("Expected transparent sheet corners; background may not be keyed out");
      }
    }

    const boxes = [];
    for (let row = 0; row < options.rows; row++) {
      for (let col = 0; col < options.columns; col++) {
        const startX = col * options.frameWidth;
        const startY = row * options.frameHeight;
        let minX = options.frameWidth;
        let minY = options.frameHeight;
        let maxX = -1;
        let maxY = -1;

        for (let y = 0; y < options.frameHeight; y++) {
          for (let x = 0; x < options.frameWidth; x++) {
            if (alphaAt(startX + x, startY + y) > 16) {
              minX = Math.min(minX, x);
              minY = Math.min(minY, y);
              maxX = Math.max(maxX, x);
              maxY = Math.max(maxY, y);
            }
          }
        }

        if (maxX === -1) {
          errors.push(`Frame row ${row + 1}, col ${col + 1} is empty`);
          continue;
        }

        const width = maxX - minX + 1;
        const height = maxY - minY + 1;
        if (width > options.frameWidth * 0.95 || height > options.frameHeight * 0.95) {
          errors.push(`Frame row ${row + 1}, col ${col + 1} nearly fills frame; likely clipped`);
        }

        boxes.push({ row, col, minX, minY, maxX, maxY, footX: (minX + maxX) / 2, footY: maxY });
      }
    }

    for (let row = 0; row < options.rows; row++) {
      const rowBoxes = boxes.filter((box) => box.row === row);
      if (rowBoxes.length < 2) continue;
      const avgFootY = rowBoxes.reduce((sum, box) => sum + box.footY, 0) / rowBoxes.length;
      rowBoxes.forEach((box) => {
        if (Math.abs(box.footY - avgFootY) > 4) {
          errors.push(`Frame row ${row + 1}, col ${box.col + 1} foot anchor drifts by more than 4px`);
        }
      });
    }

    return { ok: errors.length === 0, errors };
  }, { dataUrl, frameWidth, frameHeight, columns, rows, alphaRequired });

  await browser.close();

  if (!result.ok) {
    console.error(result.errors.join("\n"));
    process.exit(1);
  }

  console.log(`Sprite sheet OK: ${absoluteInput}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
