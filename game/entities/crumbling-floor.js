import Entity from './entity.js';
import { trapSettings } from '../utils/settings.js';

// Crumbling floor ('F') — cracks when the player steps on it, then collapses
// into an impassable pit.
// - Only the player triggers it (guards path around a finished pit).
// - The blocking rule lives in Game.canPlayerMoveTo and is "enter-only", so a
//   player standing over the tile at the moment it collapses can always step
//   off it — never sealed in.
// - Drawn procedurally, no sprite needed.

class CrumblingFloor extends Entity {
  #state = 'intact'; // intact -> cracking -> collapsed
  #crackMs = trapSettings.crumbleDelayMs;

  constructor(x, y) {
    super(x, y, 'crumbling-floor');
  }

  isCollapsed() {
    return this.#state === 'collapsed';
  }

  // Trigger on the player's centre, not mere overlap, so brushing an edge tile
  // while running past does not start the collapse.
  #playerOnTile(playerHitBox) {
    const cx = playerHitBox.x + playerHitBox.width / 2;
    const cy = playerHitBox.y + playerHitBox.height / 2;
    return (
      cx >= this._position.x &&
      cx < this._position.x + this._width &&
      cy >= this._position.y &&
      cy < this._position.y + this._height
    );
  }

  // Returns true on the exact frame it collapses, so the game can deal collapse
  // damage if the player is still standing on the tile.
  update(playerHitBox, deltaMs = 1000 / 60) {
    switch (this.#state) {
      case 'intact':
        if (playerHitBox && this.#playerOnTile(playerHitBox)) this.#state = 'cracking';
        break;
      case 'cracking':
        this.#crackMs -= deltaMs;
        if (this.#crackMs <= 0) {
          this.#state = 'collapsed';
          return true;
        }
        break;
    }
    return false;
  }

  draw(ctx) {
    const { x, y } = this._position;
    const w = this._width;
    const h = this._height;

    ctx.save();
    if (this.#state === 'collapsed') {
      const cx = x + w / 2;
      const cy = y + h / 2;
      const gradient = ctx.createRadialGradient(cx, cy, 4, cx, cy, w / 2);
      gradient.addColorStop(0, '#05050a');
      gradient.addColorStop(1, '#161622');
      ctx.fillStyle = gradient;
      ctx.fillRect(x + 3, y + 3, w - 6, h - 6);
      ctx.strokeStyle = 'rgba(90, 90, 110, 0.6)';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 3, y + 3, w - 6, h - 6);
      ctx.restore();
      return;
    }

    // Shake while cracking
    if (this.#state === 'cracking') {
      const flip = Math.floor(this.#crackMs / 50) % 2 === 0 ? 1 : -1;
      ctx.translate(2 * flip, -2 * flip);
    }

    const dense = this.#state === 'cracking';
    ctx.strokeStyle = dense ? 'rgba(20, 18, 24, 0.85)' : 'rgba(40, 38, 46, 0.5)';
    ctx.lineWidth = dense ? 2 : 1;
    const cx = x + w / 2;
    const cy = y + h / 2;
    const arms = dense ? 7 : 4;
    for (let i = 0; i < arms; i += 1) {
      const angle = (i / arms) * Math.PI * 2 + (i % 2) * 0.4;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * w * 0.45, cy + Math.sin(angle) * h * 0.45);
      ctx.stroke();
    }
    if (dense) {
      ctx.fillStyle = 'rgba(120, 110, 100, 0.4)';
      for (let i = 0; i < 5; i += 1) {
        ctx.fillRect(x + ((i * 37) % w), y + ((i * 53) % h), 2, 2);
      }
    }
    ctx.restore();
  }
}

export default CrumblingFloor;
