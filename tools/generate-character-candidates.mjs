import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";

const OUTPUT_ROOT = path.resolve("assets/images/generated/characters");

function pngBuffer(dataUrl) {
  return Buffer.from(dataUrl.split(",")[1], "base64");
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const outputs = await page.evaluate(() => {
    const outputs = [];

    function add(relativePath, canvas) {
      outputs.push({ relativePath, dataUrl: canvas.toDataURL("image/png") });
    }

    function makeCanvas(width, height) {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      return { canvas, ctx };
    }

    function rect(ctx, x, y, width, height, color) {
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
    }

    function withFrameClip(ctx, ox, oy, width, height, draw) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(ox, oy, width, height);
      ctx.clip();
      draw();
      ctx.restore();
    }

    function flipFrame(ctx, ox, oy, size) {
      const source = ctx.getImageData(ox, oy, size, size);
      const temp = document.createElement("canvas");
      temp.width = size;
      temp.height = size;
      temp.getContext("2d").putImageData(source, 0, 0);
      ctx.clearRect(ox, oy, size, size);
      ctx.save();
      ctx.translate(ox + size, oy);
      ctx.scale(-1, 1);
      ctx.drawImage(temp, 0, 0);
      ctx.restore();
    }

    function drawHero(ctx, ox, oy, size, direction, frame, state = "idle") {
      const scale = size / 32;
      const x = (value) => ox + value * scale;
      const y = (value) => oy + value * scale;
      const s = (value) => Math.max(1, value * scale);
      const step = frame % 4;
      const moving = state === "walk";
      const bob = moving ? [0, -1, 0, 1][step] : state === "idle" ? [0, -1, 0, 0, -1, 0][frame % 6] : 0;
      const stride = moving || state === "attack" ? [-1, 0, 1, 0][step] : 0;
      const hairLift = moving ? [-1, -2, 0, -2][step] : state === "attack" ? -1 : 0;
      const hairSweep = moving ? [-1, 0, 1, 0][step] : 0;
      const skin = "#f2bf91";
      const cheek = "#c47a61";
      const hair = "#5a321d";
      const hairDark = "#2d1a12";
      const pajama = "#4aa4ff";
      const pajamaDark = "#1d4f9e";
      const pajamaLight = "#bfe9ff";
      const star = "#ffe27a";
      const dreamGlow = "#78e6ff";
      const slipper = "#f2dfc4";
      const outline = "#11182a";
      const wood = "#8a5a31";
      const axeHead = "#dbe7f2";
      const axeShade = "#8796a5";

      if (state === "dead") {
        rect(ctx, x(6), y(22), s(20), s(4), outline);
        rect(ctx, x(8), y(20), s(16), s(6), pajamaDark);
        rect(ctx, x(11), y(17), s(9), s(6), skin);
        rect(ctx, x(9), y(16), s(12), s(3), hairDark);
        rect(ctx, x(19), y(25), s(6), s(2), slipper);
        rect(ctx, x(10), y(23), s(3), s(2), dreamGlow);
        return;
      }

      rect(ctx, x(9 + stride), y(27), s(6), s(2), outline);
      rect(ctx, x(18 - stride), y(27), s(6), s(2), outline);
      rect(ctx, x(10 + stride), y(26), s(5), s(2), slipper);
      rect(ctx, x(18 - stride), y(26), s(5), s(2), slipper);
      rect(ctx, x(11 + stride), y(21), s(4), s(6), pajamaDark);
      rect(ctx, x(18 - stride), y(21), s(4), s(6), pajamaDark);

      if (direction === "up") {
        rect(ctx, x(8), y(12 + bob), s(16), s(11), outline);
        rect(ctx, x(10), y(12 + bob), s(12), s(11), pajama);
        rect(ctx, x(12), y(16 + bob), s(8), s(2), pajamaLight);
        rect(ctx, x(12), y(7 + bob + hairLift), s(9), s(8), hair);
        rect(ctx, x(9 + hairSweep), y(8 + bob + hairLift), s(14), s(4), hairDark);
        rect(ctx, x(13), y(18 + bob), s(2), s(2), star);
        rect(ctx, x(18), y(17 + bob), s(2), s(2), dreamGlow);
      } else if (direction === "right") {
        rect(ctx, x(9), y(13 + bob), s(15), s(10), outline);
        rect(ctx, x(11), y(13 + bob), s(12), s(10), pajama);
        rect(ctx, x(12), y(17 + bob), s(9), s(2), pajamaLight);
        rect(ctx, x(14), y(7 + bob), s(9), s(9), skin);
        rect(ctx, x(11 + hairSweep), y(6 + bob + hairLift), s(12), s(4), hairDark);
        rect(ctx, x(13 + hairSweep), y(8 + bob + hairLift), s(8), s(3), hair);
        rect(ctx, x(20), y(11 + bob), s(2), s(2), "#11151d");
        rect(ctx, x(21), y(14 + bob), s(2), s(1), cheek);
        rect(ctx, x(16), y(18 + bob), s(2), s(2), star);
        rect(ctx, x(20), y(17 + bob), s(2), s(2), dreamGlow);
      } else {
        rect(ctx, x(8), y(13 + bob), s(16), s(10), outline);
        rect(ctx, x(10), y(13 + bob), s(12), s(10), pajama);
        rect(ctx, x(12), y(17 + bob), s(9), s(2), pajamaLight);
        rect(ctx, x(11), y(7 + bob), s(10), s(9), skin);
        rect(ctx, x(9 + hairSweep), y(6 + bob + hairLift), s(14), s(4), hairDark);
        rect(ctx, x(11 + hairSweep), y(8 + bob + hairLift), s(10), s(3), hair);
        rect(ctx, x(13), y(11 + bob), s(2), s(2), "#11151d");
        rect(ctx, x(18), y(11 + bob), s(2), s(2), "#11151d");
        rect(ctx, x(15), y(14 + bob), s(4), s(1), cheek);
        rect(ctx, x(14), y(18 + bob), s(2), s(2), star);
        rect(ctx, x(18), y(17 + bob), s(2), s(2), dreamGlow);
      }

      if (state === "attack") {
        if (direction === "up") {
          rect(ctx, x(22), y(7), s(2), s(15), wood);
          rect(ctx, x(19), y(5), s(8), s(4), axeHead);
          rect(ctx, x(20), y(6), s(6), s(2), axeShade);
        } else if (direction === "right") {
          const reach = Math.min(step * 2, 4);
          rect(ctx, x(21), y(13), s(7 + reach), s(2), wood);
          rect(ctx, x(27 + reach), y(10), s(4), s(7), axeHead);
          rect(ctx, x(28 + reach), y(11), s(2), s(5), axeShade);
        } else {
          const reach = Math.min(step * 2, 4);
          rect(ctx, x(20), y(17 + reach), s(2), s(8), wood);
          rect(ctx, x(17), y(23 + reach), s(7), s(4), axeHead);
          rect(ctx, x(18), y(24 + reach), s(5), s(2), axeShade);
        }
      } else {
        rect(ctx, x(6), y(16 + stride), s(4), s(6), pajamaDark);
        rect(ctx, x(22), y(16 - stride), s(4), s(6), pajamaDark);
        rect(ctx, x(7), y(21 + stride), s(2), s(2), skin);
        rect(ctx, x(23), y(21 - stride), s(2), s(2), skin);
      }
    }

    function drawHeroAction(ctx, ox, oy, direction, frame, action) {
      drawHero(ctx, ox + 8, oy + 8, 32, direction, frame, action === "axe" ? "attack" : "idle");

      if (action === "pick") {
        const bend = frame === 0 ? 0 : 4;
        rect(ctx, ox + 21, oy + 28 + bend, 8, 3, "#1d4f9e");
        rect(ctx, ox + 24, oy + 31 + bend, 3, 3, "#78e6ff");
        rect(ctx, ox + 23, oy + 30 + bend, 5, 1, "#eafaff");
      }

      if (action === "potion") {
        const lift = frame === 0 ? 0 : -5;
        rect(ctx, ox + 28, oy + 22 + lift, 5, 7, "#8c2b67");
        rect(ctx, ox + 29, oy + 20 + lift, 3, 2, "#ffd0ef");
        rect(ctx, ox + 30, oy + 24 + lift, 2, 2, "#78e6ff");
      }
    }

    function makePlayerMovement() {
      const frameSize = 32;
      const columns = 6;
      const rows = 10;
      const { canvas, ctx } = makeCanvas(frameSize * columns, frameSize * rows);
      const rowPlan = [
        ["down", "idle"],
        ["right", "idle"],
        ["up", "idle"],
        ["down", "idle"],
        ["right", "walk"],
        ["up", "walk"],
        ["down", "attack"],
        ["right", "attack"],
        ["up", "attack"],
        ["down", "dead"],
      ];

      rowPlan.forEach(([direction, state], row) => {
        for (let col = 0; col < columns; col += 1) {
          withFrameClip(ctx, col * frameSize, row * frameSize, frameSize, frameSize, () => {
            drawHero(ctx, col * frameSize, row * frameSize, frameSize, direction, col, state);
          });
        }
      });

      add("player/Player.png", canvas);
    }

    function makePlayerActions() {
      const frameSize = 48;
      const columns = 2;
      const rows = 11;
      const { canvas, ctx } = makeCanvas(frameSize * columns, frameSize * rows);
      const rowPlan = [
        ["right", "pick"],
        ["down", "pick"],
        ["up", "pick"],
        ["down", "axe"],
        ["up", "axe"],
        ["right", "axe"],
        ["left", "axe"],
        ["down", "idle"],
        ["right", "idle"],
        ["down", "potion"],
        ["up", "potion"],
      ];

      rowPlan.forEach(([direction, action], row) => {
        for (let col = 0; col < columns; col += 1) {
          const ox = col * frameSize;
          const oy = row * frameSize;
          const drawDirection = direction === "left" ? "right" : direction;
          withFrameClip(ctx, ox, oy, frameSize, frameSize, () => {
            drawHeroAction(ctx, ox, oy, drawDirection, col, action);
          });
          if (direction === "left") flipFrame(ctx, ox, oy, frameSize);
        }
      });

      add("player/Player_Actions.png", canvas);
    }

    function drawAxe(ctx, x, y, direction, swing, palette) {
      const haft = palette.weaponHaft;
      const head = palette.weaponHead;
      const edge = palette.weaponEdge;

      if (direction === "up") {
        rect(ctx, x + 36, y + 8 - swing, 4, 27, haft);
        rect(ctx, x + 31, y + 5 - swing, 12, 8, head);
        rect(ctx, x + 29, y + 7 - swing, 16, 3, edge);
      } else if (direction === "right") {
        rect(ctx, x + 38, y + 30, 19 + swing, 4, haft);
        rect(ctx, x + 53 + swing, y + 25, 8, 12, head);
        rect(ctx, x + 57 + swing, y + 23, 3, 16, edge);
      } else if (direction === "left") {
        rect(ctx, x + 7 - swing, y + 30, 19 + swing, 4, haft);
        rect(ctx, x + 3 - swing, y + 25, 8, 12, head);
        rect(ctx, x + 4 - swing, y + 23, 3, 16, edge);
      } else {
        rect(ctx, x + 38, y + 31 + swing, 4, 22, haft);
        rect(ctx, x + 33, y + 48 + swing, 12, 8, head);
        rect(ctx, x + 31, y + 51 + swing, 16, 3, edge);
      }
    }

    function drawOrc(ctx, ox, oy, direction, frame, state, palette) {
      const step = frame % 4;
      const moving = ["walk", "run", "walkAttack", "runAttack"].includes(state);
      const attack = ["attack", "walkAttack", "runAttack"].includes(state);
      const stride = moving ? [-2, 0, 2, 0][step] : 0;
      const swing = attack ? Math.min(step * 2, 5) : 0;
      const skin = state === "hurt" ? palette.hurtSkin : palette.skin;
      const skinShade = state === "hurt" ? palette.hurtMark : palette.skinShade;
      const outline = "#121915";
      const armor = palette.armor;
      const armorDark = palette.armorDark;
      const trim = palette.trim;
      const shard = palette.shard;
      const shardCore = palette.shardCore;

      if (state === "dead") {
        rect(ctx, ox + 13, oy + 45, 38, 7, outline);
        rect(ctx, ox + 16, oy + 40, 31, 11, skinShade);
        rect(ctx, ox + 20, oy + 36, 18, 11, skin);
        rect(ctx, ox + 19, oy + 39, 22, 4, armorDark);
        rect(ctx, ox + 30, oy + 41, 4, 3, shard);
        rect(ctx, ox + 31, oy + 41, 2, 2, shardCore);
        rect(ctx, ox + 24, oy + 36, 3, 2, "#080a08");
        rect(ctx, ox + 35, oy + 36, 3, 2, "#080a08");
        rect(ctx, ox + 28, oy + 42, 7, 1, "#080a08");
        rect(ctx, ox + 14, oy + 51, 12, 3, armor);
        rect(ctx, ox + 37, oy + 51, 12, 3, armor);
        return;
      }

      rect(ctx, ox + 19 + stride, oy + 51, 11, 5, outline);
      rect(ctx, ox + 35 - stride, oy + 51, 11, 5, outline);
      rect(ctx, ox + 20 + stride, oy + 50, 9, 5, armorDark);
      rect(ctx, ox + 36 - stride, oy + 50, 9, 5, armorDark);

      if (direction === "up") {
        rect(ctx, ox + 18, oy + 24, 29, 25, outline);
        rect(ctx, ox + 21, oy + 25, 23, 23, armor);
        rect(ctx, ox + 20, oy + 31, 25, 4, trim);
        rect(ctx, ox + 30, oy + 35, 5, 5, shard);
        rect(ctx, ox + 31, oy + 36, 3, 3, shardCore);
        rect(ctx, ox + 15, oy + 25 + stride, 9, 17, armorDark);
        rect(ctx, ox + 42, oy + 25 - stride, 9, 17, armorDark);
        rect(ctx, ox + 19, oy + 14, 27, 20, outline);
        rect(ctx, ox + 21, oy + 13, 23, 20, skin);
        rect(ctx, ox + 22, oy + 15, 20, 5, palette.hair);
        rect(ctx, ox + 24, oy + 11, 16, 3, armorDark);
        rect(ctx, ox + 18, oy + 17, 5, 6, trim);
        rect(ctx, ox + 42, oy + 17, 5, 6, trim);
      } else if (direction === "right") {
        rect(ctx, ox + 19, oy + 24, 29, 25, outline);
        rect(ctx, ox + 22, oy + 25, 22, 23, armor);
        rect(ctx, ox + 20, oy + 31, 24, 4, trim);
        rect(ctx, ox + 31, oy + 35, 5, 5, shard);
        rect(ctx, ox + 32, oy + 36, 3, 3, shardCore);
        rect(ctx, ox + 14, oy + 27 + stride, 10, 15, armorDark);
        rect(ctx, ox + 43, oy + 27 - stride, 10, 15, armorDark);
        rect(ctx, ox + 24, oy + 13, 23, 22, outline);
        rect(ctx, ox + 25, oy + 13, 21, 21, skin);
        rect(ctx, ox + 39, oy + 22, 6, 3, "#d8cfaa");
        rect(ctx, ox + 38, oy + 19, 2, 2, "#070907");
        rect(ctx, ox + 21, oy + 16, 10, 5, skinShade);
        rect(ctx, ox + 27, oy + 11, 15, 4, armorDark);
        rect(ctx, ox + 43, oy + 13, 4, 6, trim);
      } else if (direction === "left") {
        rect(ctx, ox + 16, oy + 24, 29, 25, outline);
        rect(ctx, ox + 20, oy + 25, 22, 23, armor);
        rect(ctx, ox + 20, oy + 31, 24, 4, trim);
        rect(ctx, ox + 29, oy + 35, 5, 5, shard);
        rect(ctx, ox + 30, oy + 36, 3, 3, shardCore);
        rect(ctx, ox + 12, oy + 27 - stride, 10, 15, armorDark);
        rect(ctx, ox + 40, oy + 27 + stride, 10, 15, armorDark);
        rect(ctx, ox + 17, oy + 13, 23, 22, outline);
        rect(ctx, ox + 18, oy + 13, 21, 21, skin);
        rect(ctx, ox + 18, oy + 22, 6, 3, "#d8cfaa");
        rect(ctx, ox + 25, oy + 19, 2, 2, "#070907");
        rect(ctx, ox + 34, oy + 16, 10, 5, skinShade);
        rect(ctx, ox + 22, oy + 11, 15, 4, armorDark);
        rect(ctx, ox + 17, oy + 13, 4, 6, trim);
      } else {
        rect(ctx, ox + 17, oy + 24, 30, 25, outline);
        rect(ctx, ox + 20, oy + 25, 24, 23, armor);
        rect(ctx, ox + 20, oy + 31, 24, 4, trim);
        rect(ctx, ox + 30, oy + 35, 5, 5, shard);
        rect(ctx, ox + 31, oy + 36, 3, 3, shardCore);
        rect(ctx, ox + 13, oy + 27 + stride, 10, 16, armorDark);
        rect(ctx, ox + 42, oy + 27 - stride, 10, 16, armorDark);
        rect(ctx, ox + 18, oy + 13, 28, 22, outline);
        rect(ctx, ox + 20, oy + 12, 24, 22, skin);
        rect(ctx, ox + 23, oy + 20, 3, 3, "#070907");
        rect(ctx, ox + 38, oy + 20, 3, 3, "#070907");
        rect(ctx, ox + 27, oy + 27, 10, 2, "#273022");
        rect(ctx, ox + 17, oy + 24, 6, 4, "#d8cfaa");
        rect(ctx, ox + 42, oy + 24, 6, 4, "#d8cfaa");
        rect(ctx, ox + 18, oy + 14, 5, 7, trim);
        rect(ctx, ox + 41, oy + 14, 5, 7, trim);
        rect(ctx, ox + 23, oy + 11, 18, 4, armorDark);
      }

      rect(ctx, ox + 23, oy + 35, 18, 3, armorDark);
      rect(ctx, ox + 27, oy + 35, 10, 2, trim);
      if (attack) drawAxe(ctx, ox, oy, direction, swing, palette);
    }

    function makeOrcSheets() {
      const palettes = {
        orc1: {
          skin: "#5c8f45",
          skinShade: "#284f2c",
          hurtSkin: "#91ad58",
          hurtMark: "#8d2d35",
          armor: "#28324d",
          armorDark: "#141a2f",
          trim: "#6b4e91",
          hair: "#18281d",
          shard: "#2dd8ff",
          shardCore: "#effcff",
          weaponHaft: "#4c2f24",
          weaponHead: "#4e5b76",
          weaponEdge: "#cbd8f4",
        },
        orc2: {
          skin: "#3f8062",
          skinShade: "#1f4638",
          hurtSkin: "#70a06e",
          hurtMark: "#8d303b",
          armor: "#2c2745",
          armorDark: "#17142a",
          trim: "#8b6acf",
          hair: "#172d28",
          shard: "#5c7cff",
          shardCore: "#eef2ff",
          weaponHaft: "#4a3428",
          weaponHead: "#4f566f",
          weaponEdge: "#d7dcf0",
        },
        orc3: {
          skin: "#7d8537",
          skinShade: "#42491e",
          hurtSkin: "#adb15a",
          hurtMark: "#9f3a30",
          armor: "#35253a",
          armorDark: "#1d1424",
          trim: "#bd7d36",
          hair: "#31351b",
          shard: "#b164ff",
          shardCore: "#fff1ff",
          weaponHaft: "#5b3f2a",
          weaponHead: "#66546d",
          weaponEdge: "#dfc9ea",
        },
      };
      const states = [
        ["attack_full", "attack"],
        ["death_full", "dead"],
        ["hurt_full", "hurt"],
        ["idle_full", "idle"],
        ["run_full", "run"],
        ["run_attack_full", "runAttack"],
        ["walk_full", "walk"],
        ["walk_attack_full", "walkAttack"],
      ];
      const directions = ["down", "up", "left", "right"];

      Object.entries(palettes).forEach(([orcId, palette]) => {
        states.forEach(([filenameState, state]) => {
          const frameSize = 64;
          const { canvas, ctx } = makeCanvas(frameSize * 4, frameSize * 4);
          directions.forEach((direction, row) => {
            for (let col = 0; col < 4; col += 1) {
              withFrameClip(ctx, col * frameSize, row * frameSize, frameSize, frameSize, () => {
                drawOrc(ctx, col * frameSize, row * frameSize, direction, col, state, palette);
              });
            }
          });

          const frontSuffix = orcId === "orc1" && (filenameState === "run_attack_full" || filenameState === "walk_attack_full")
            ? "_front"
            : "";
          const filename = `${orcId}_${filenameState.replace("_full", `${frontSuffix}_full`)}.png`;
          add(`enemies/${orcId}/${filename}`, canvas);
        });
      });
    }

    makePlayerMovement();
    makePlayerActions();
    makeOrcSheets();

    return outputs;
  });

  await browser.close();

  for (const output of outputs) {
    const destination = path.join(OUTPUT_ROOT, output.relativePath);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, pngBuffer(output.dataUrl));
    console.log(`Wrote ${destination}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
