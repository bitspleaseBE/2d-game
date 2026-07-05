import Entity from './entity.js';

// Key entity — collected on touch, used automatically when the player bumps
// into a locked door. Drawn procedurally (golden key that gently bobs).

class Key extends Entity {
  #collected = false;

  constructor(x, y) {
    super(x, y, 'key');
    this.bobFrame = 0;
  }

  collect() {
    if (this.#collected) return false;
    this.#collected = true;
    return true;
  }

  isCollected() {
    return this.#collected;
  }

  update() {
    this.bobFrame = (this.bobFrame + 1) % 120;
  }

  draw(ctx) {
    if (this.#collected) return;
    const bob = Math.sin((this.bobFrame / 120) * Math.PI * 2) * 3;
    const cx = this._position.x + this._width / 2;
    const cy = this._position.y + this._height / 2 + bob;
    ctx.save();
    ctx.strokeStyle = '#ffd54f';
    ctx.fillStyle = '#ffd54f';
    ctx.lineWidth = 4;
    // Bow (ring)
    ctx.beginPath();
    ctx.arc(cx - 10, cy, 8, 0, Math.PI * 2);
    ctx.stroke();
    // Shaft
    ctx.beginPath();
    ctx.moveTo(cx - 2, cy);
    ctx.lineTo(cx + 16, cy);
    ctx.stroke();
    // Teeth
    ctx.fillRect(cx + 8, cy, 3, 7);
    ctx.fillRect(cx + 13, cy, 3, 9);
    // Sparkle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(cx - 13, cy - 6, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export default Key;
