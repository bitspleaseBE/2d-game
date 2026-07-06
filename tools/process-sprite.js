const { chromium } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const input = readArg("input");
const output = readArg("output");
const mode = readArg("mode");

if (!input || !output || !["tile", "wall", "sprite"].includes(mode)) {
  console.error("Usage: node tools/process-sprite.js --input <png> --output <png> --mode <tile|wall|sprite>");
  process.exit(1);
}

function readArg(name) {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? null : process.argv[index + 1];
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
  const pngBase64 = await page.evaluate(async ({ dataUrl, mode }) => {
    const targetSize = 64;

    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = dataUrl;
    });

    function isBackground(r, g, b, a) {
      if (a < 16) return true;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      return max > 220 && max - min < 24;
    }

    function contentBounds(ctx, width, height) {
      const pixels = ctx.getImageData(0, 0, width, height).data;
      let minX = width;
      let minY = height;
      let maxX = -1;
      let maxY = -1;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const offset = (y * width + x) * 4;
          if (!isBackground(pixels[offset], pixels[offset + 1], pixels[offset + 2], pixels[offset + 3])) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }

      if (maxX === -1) {
        const size = Math.min(width, height);
        return { x: (width - size) / 2, y: (height - size) / 2, width: size, height: size };
      }

      const contentWidth = maxX - minX + 1;
      const contentHeight = maxY - minY + 1;
      const padding = mode === "sprite" ? Math.round(Math.max(contentWidth, contentHeight) * 0.08) : 0;
      const size = Math.min(Math.max(contentWidth, contentHeight) + padding * 2, Math.min(width, height));
      const centerX = minX + contentWidth / 2;
      const centerY = minY + contentHeight / 2;
      return {
        x: Math.max(0, Math.min(width - size, Math.round(centerX - size / 2))),
        y: Math.max(0, Math.min(height - size, Math.round(centerY - size / 2))),
        width: size,
        height: size,
      };
    }

    function floodTransparent(canvas) {
      const ctx = canvas.getContext("2d");
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data, width, height } = imageData;
      const visited = new Uint8Array(width * height);
      const stack = [];

      function push(x, y) {
        if (x < 0 || y < 0 || x >= width || y >= height) return;
        const index = y * width + x;
        if (visited[index]) return;
        const offset = index * 4;
        if (!isBackground(data[offset], data[offset + 1], data[offset + 2], data[offset + 3])) return;
        visited[index] = 1;
        stack.push([x, y]);
      }

      for (let x = 0; x < width; x++) {
        push(x, 0);
        push(x, height - 1);
      }
      for (let y = 0; y < height; y++) {
        push(0, y);
        push(width - 1, y);
      }

      while (stack.length) {
        const [x, y] = stack.pop();
        data[(y * width + x) * 4 + 3] = 0;
        push(x + 1, y);
        push(x - 1, y);
        push(x, y + 1);
        push(x, y - 1);
      }

      ctx.putImageData(imageData, 0, 0);
    }

    const source = document.createElement("canvas");
    source.width = image.naturalWidth;
    source.height = image.naturalHeight;
    const sourceCtx = source.getContext("2d");
    sourceCtx.drawImage(image, 0, 0);

    let crop;
    if (mode === "tile" || mode === "wall") {
      const size = Math.min(image.naturalWidth, image.naturalHeight);
      crop = {
        x: Math.round((image.naturalWidth - size) / 2),
        y: Math.round((image.naturalHeight - size) / 2),
        width: size,
        height: size,
      };
    } else {
      crop = contentBounds(sourceCtx, image.naturalWidth, image.naturalHeight);
    }

    const outputCanvas = document.createElement("canvas");
    outputCanvas.width = targetSize;
    outputCanvas.height = targetSize;
    const outputCtx = outputCanvas.getContext("2d");
    outputCtx.imageSmoothingEnabled = false;
    outputCtx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, targetSize, targetSize);

    if (mode === "sprite") floodTransparent(outputCanvas);

    return outputCanvas.toDataURL("image/png").split(",")[1];
  }, { dataUrl, mode });

  await browser.close();
  fs.mkdirSync(path.dirname(absoluteOutput), { recursive: true });
  fs.writeFileSync(absoluteOutput, Buffer.from(pngBase64, "base64"));
  console.log(`Wrote ${absoluteOutput}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
