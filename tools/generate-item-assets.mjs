// Generates the item icon PNGs used by the inventory, HUD and guard drops.
// Pure Node (no dependencies): each icon is 16x16 pixel art scaled 4x to a
// 64x64 RGBA PNG. Run with: node tools/generate-item-assets.mjs
//
// These are placeholder pixel-art renders; they can be replaced by
// gpt-image-2 art later as long as the filenames stay the same.

import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "assets",
  "images",
  "generated",
  "items"
);

// ---------------------------------------------------------------------------
// Minimal PNG encoder (8-bit RGBA, no interlace)
// ---------------------------------------------------------------------------

const CRC_TABLE = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});

function crc32(bytes) {
  let c = 0xffffffff;
  for (const byte of bytes) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const typeAndData = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData));
  return Buffer.concat([length, typeAndData, crc]);
}

function encodePng(pixels, width, height) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  // compression, filter and interlace stay 0

  // Every scanline is prefixed with filter type 0 (None)
  const raw = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    const rowStart = y * (1 + width * 4);
    raw[rowStart] = 0;
    pixels.copy(raw, rowStart + 1, y * width * 4, (y + 1) * width * 4);
  }

  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ---------------------------------------------------------------------------
// Pixel-art rendering: 16x16 character grids, palette per icon, 4x upscale
// ---------------------------------------------------------------------------

const SCALE = 4;

function renderIcon(name, grid, palette) {
  const size = 16;
  if (grid.length !== size || grid.some((row) => row.length !== size)) {
    throw new Error(`Grid for ${name} is not 16x16`);
  }
  const pixels = Buffer.alloc(size * SCALE * size * SCALE * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const color = palette[grid[y][x]];
      if (!color) continue; // '.' and unknown chars stay transparent
      const [r, g, b, a = 255] = color;
      for (let sy = 0; sy < SCALE; sy++) {
        for (let sx = 0; sx < SCALE; sx++) {
          const px = (y * SCALE + sy) * size * SCALE + x * SCALE + sx;
          pixels[px * 4] = r;
          pixels[px * 4 + 1] = g;
          pixels[px * 4 + 2] = b;
          pixels[px * 4 + 3] = a;
        }
      }
    }
  }
  const file = join(OUT_DIR, `${name}.png`);
  writeFileSync(file, encodePng(pixels, size * SCALE, size * SCALE));
  console.log(`wrote ${file}`);
}

// Shared colors
const GOLD = [255, 213, 79];
const GOLD_DARK = [138, 109, 26];
const GOLD_LIGHT = [255, 243, 196];
const STEEL = [176, 190, 197];
const STEEL_EDGE = [236, 239, 241];
const BROWN = [121, 85, 72];
const BROWN_DARK = [78, 52, 46];
const STONE = [158, 158, 158];
const STONE_DARK = [66, 66, 66];

const icons = {
  key: {
    palette: { D: GOLD_DARK, G: GOLD, W: GOLD_LIGHT },
    grid: [
      "................",
      "................",
      "..DDDD..........",
      ".DGWWGD.........",
      ".DG..GDGGGGGGGG.",
      ".DG..GDDDDDDDDD.",
      ".DGGGGD...GG.GG.",
      "..DDDD....GG.GG.",
      "..........DD.DD.",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
    ],
  },

  potion: {
    palette: {
      C: BROWN,
      c: BROWN_DARK,
      G: [207, 216, 220],
      R: [229, 57, 53],
      r: [183, 28, 28],
      W: [255, 205, 210],
    },
    grid: [
      "................",
      "......cCCc......",
      "......CCCC......",
      "......CCCC......",
      ".....G....G.....",
      ".....G....G.....",
      "....G......G....",
      "...G........G...",
      "..G...RRRR...G..",
      ".G..RRRRRRRR..G.",
      ".G.RRRRRRRRRR.G.",
      ".G.WRRRRRRRRr.G.",
      ".G.WRRRRRRRRr.G.",
      "..G.RRRRRRRr.G..",
      "...GGGGGGGGGG...",
      "................",
    ],
  },

  explosive: {
    palette: {
      B: [38, 38, 44],
      h: [104, 109, 118],
      f: BROWN_DARK,
      s: [255, 152, 0],
      S: [255, 235, 59],
    },
    grid: [
      "................",
      "...........sS...",
      "..........Ss....",
      ".........f......",
      "........f.......",
      ".......f........",
      "....BBBB........",
      "...BBBBBB.......",
      "..BBhhBBBB......",
      "..BhhBBBBB......",
      "..BBBBBBBB......",
      "..BBBBBBBB......",
      "...BBBBBB.......",
      "....BBBB........",
      "................",
      "................",
    ],
  },

  // The dagger: a stubby sibling of the steel sword with a rusty blade
  sword_dagger: {
    palette: {
      W: STEEL_EDGE,
      S: [188, 129, 100], // rusted steel
      G: GOLD,
      b: BROWN,
      d: BROWN_DARK,
    },
    grid: [
      "................",
      "................",
      "................",
      ".......W........",
      ".......WS.......",
      ".......WS.......",
      ".......WS.......",
      ".......WS.......",
      ".......WS.......",
      ".....GGGGGG.....",
      ".......bb.......",
      ".......bb.......",
      ".......dd.......",
      "......GGGG......",
      "................",
      "................",
    ],
  },

  sword_steel: {
    palette: { W: STEEL_EDGE, S: STEEL, G: GOLD, b: BROWN, d: BROWN_DARK },
    grid: [
      ".......W........",
      ".......WS.......",
      ".......WS.......",
      ".......WS.......",
      ".......WS.......",
      ".......WS.......",
      ".......WS.......",
      ".......WS.......",
      ".......WS.......",
      ".....GGGGGG.....",
      ".......bb.......",
      ".......bb.......",
      ".......bb.......",
      ".......dd.......",
      "......GGGG......",
      "................",
    ],
  },

  axe_war: {
    palette: { W: STEEL_EDGE, S: STEEL, b: BROWN, d: BROWN_DARK },
    grid: [
      "................",
      "....SS..bb..SS..",
      "..SSSS..bb..SSSS",
      ".WSSSS..bb..SSSS",
      ".WSSSSSSbbSSSSSS",
      "..SSSSSSbbSSSSS.",
      "....SSSSbbSSS...",
      "........bb......",
      "........bb......",
      "........bb......",
      "........bb......",
      "........bb......",
      "........bb......",
      "........dd......",
      "................",
      "................",
    ],
  },

  // Not an inventory item: the locked door tile that gates parts of the maze
  door: {
    palette: {
      D: [62, 39, 35],
      d: [93, 64, 55],
      W: [141, 110, 99],
      H: GOLD,
    },
    grid: [
      "DDDDDDDDDDDDDDDD",
      "DWWWWdWWWWdWWWWD",
      "DWWWWdWWWWdWWWWD",
      "DWWWWdWWWWdWWWWD",
      "DWWWWdWWWWdWWWWD",
      "DWWWWdWWWWdWWWWD",
      "DWWWWdWWWWdWWWWD",
      "DWWWWdWWWWdHHWWD",
      "DWWWWdWWWWdHHWWD",
      "DWWWWdWWWWdWWWWD",
      "DWWWWdWWWWdWWWWD",
      "DWWWWdWWWWdWWWWD",
      "DWWWWdWWWWdWWWWD",
      "DWWWWdWWWWdWWWWD",
      "DWWWWdWWWWdWWWWD",
      "DDDDDDDDDDDDDDDD",
    ],
  },

  rune_haste: {
    palette: { O: STONE_DARK, T: STONE, X: [77, 208, 225] },
    grid: [
      "................",
      "....OOOOOOOO....",
      "...OTTTTTTTTO...",
      "..OTTTTTTTTTTO..",
      "..OTTTTXXTTTTO..",
      "..OTTTXXTTTTTO..",
      "..OTTXXXXTTTTO..",
      "..OTTTTXXTTTTO..",
      "..OTTTXXTTTTTO..",
      "..OTTXXTTTTTTO..",
      "..OTTTTTTTTTTO..",
      "..OTTTTTTTTTTO..",
      "...OTTTTTTTTO...",
      "....OOOOOOOO....",
      "................",
      "................",
    ],
  },

  rune_might: {
    palette: { O: STONE_DARK, T: STONE, X: [255, 112, 67] },
    grid: [
      "................",
      "....OOOOOOOO....",
      "...OTTTTTTTTO...",
      "..OTTTTTTTTTTO..",
      "..OTTTTXXTTTTO..",
      "..OTTTXXXXTTTO..",
      "..OTTXXXXXXTTO..",
      "..OTTTTXXTTTTO..",
      "..OTTTTXXTTTTO..",
      "..OTTTTXXTTTTO..",
      "..OTTTTXXTTTTO..",
      "..OTTTTTTTTTTO..",
      "...OTTTTTTTTO...",
      "....OOOOOOOO....",
      "................",
      "................",
    ],
  },

  rune_warding: {
    palette: { O: STONE_DARK, T: STONE, X: [102, 187, 106] },
    grid: [
      "................",
      "....OOOOOOOO....",
      "...OTTTTTTTTO...",
      "..OTTTTTTTTTTO..",
      "..OTTXXXXXXTTO..",
      "..OTTXTTTTXTTO..",
      "..OTTXTTTTXTTO..",
      "..OTTXTTTTXTTO..",
      "..OTTTXTTXTTTO..",
      "..OTTTTXXTTTTO..",
      "..OTTTTTTTTTTO..",
      "..OTTTTTTTTTTO..",
      "...OTTTTTTTTO...",
      "....OOOOOOOO....",
      "................",
      "................",
    ],
  },
};

mkdirSync(OUT_DIR, { recursive: true });
for (const [name, { grid, palette }] of Object.entries(icons)) {
  renderIcon(name, grid, palette);
}
