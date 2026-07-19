import Entity from './entity.js';
import { atlasRectForMask, WALL_TILE_SIZE } from '../utils/wall-mask.js';

// Wall entity class
// - 'normal' walls are permanent
// - 'breakable' walls ('R' in level layouts) show hairline cracks and fall
//   to a single axe swing, hiding shard stashes and secret shortcuts
// - Visuals come from a 4×4 NESW autotile atlas when available

class Wall extends Entity {
  #type;
  #gridX;
  #gridY;
  #mask;
  #atlas;

  constructor(x, y, type, assets, gridX, gridY, mask = 0) {
    super(x, y);
    this.#type = type; // 'normal' or 'breakable'
    this.#gridX = gridX;
    this.#gridY = gridY;
    this.#mask = mask & 0xf;
    this.#atlas = assets.wallAtlas || null;
    this._sprite = assets.wall;
  }

  getType() {
    return this.#type;
  }

  isBreakable() {
    return this.#type === 'breakable';
  }

  getGridX() {
    return this.#gridX;
  }

  getGridY() {
    return this.#gridY;
  }

  getMask() {
    return this.#mask;
  }

  setMask(mask) {
    this.#mask = mask & 0xf;
  }

  update() {
    // Update wall state if needed (e.g., for breakable walls)
  }

  draw(ctx) {
    const { x, y } = this._position;
    const w = this._width;
    const h = this._height;

    if (this.#atlas) {
      const { sx, sy, sw, sh } = atlasRectForMask(this.#mask, WALL_TILE_SIZE);
      ctx.drawImage(this.#atlas, sx, sy, sw, sh, x, y, w, h);
    } else if (this._sprite) {
      ctx.drawImage(this._sprite, x, y, w, h);
    }

    if (this.#type === 'breakable') this.#drawCracks(ctx);
  }

  // Hairline cracks so an observant player can spot the weak wall
  #drawCracks(ctx) {
    const { x, y } = this._position;
    const w = this._width;
    const h = this._height;
    ctx.save();
    // Keep cracks inside the wall cell artwork
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.5, y + h * 0.12);
    ctx.lineTo(x + w * 0.38, y + h * 0.4);
    ctx.lineTo(x + w * 0.56, y + h * 0.56);
    ctx.lineTo(x + w * 0.42, y + h * 0.86);
    ctx.moveTo(x + w * 0.56, y + h * 0.56);
    ctx.lineTo(x + w * 0.76, y + h * 0.7);
    ctx.moveTo(x + w * 0.38, y + h * 0.4);
    ctx.lineTo(x + w * 0.2, y + h * 0.52);
    ctx.stroke();
    ctx.restore();
  }
}

export default Wall;
