import Entity from './entity.js';

// Wall entity class
// - 'normal' walls are permanent
// - 'breakable' walls ('R' in level layouts) show hairline cracks and fall
//   to a single axe swing, hiding shard stashes and secret shortcuts

class Wall extends Entity {
  #type;

  constructor(x, y, type, assets) {
    super(x, y);
    this.#type = type; // 'normal' or 'breakable'
    this._sprite = assets.wall;
  }

  getType() {
    return this.#type;
  }

  isBreakable() {
    return this.#type === 'breakable';
  }

  update() {
    // Update wall state if needed (e.g., for breakable walls)
  }

  draw(ctx) {
    ctx.drawImage(
      this._sprite,
      this._position.x,
      this._position.y,
      this._width,
      this._height
    );
    if (this.#type === 'breakable') this.#drawCracks(ctx);
  }

  // Hairline cracks so an observant player can spot the weak wall
  #drawCracks(ctx) {
    const { x, y } = this._position;
    const w = this._width;
    const h = this._height;
    ctx.save();
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
