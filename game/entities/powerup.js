import Entity from './entity.js';

// Powerup entity class
// - Represents the powerups in the game
// - Can be collected by the player
// - Can be dropped by guards when defeated
// - Types: health (red), speed (blue), strength (green), invincibility (yellow)
class Powerup extends Entity {
  #collected;

  constructor(x, y, type, assets) {
    super(x, y, type, assets);
    this.#collected = false;
    this.bobFrame = 0;
  }

  selectSprites(assets) {
    switch (this._type) {
      case "health":
        return { crystal: assets.redCrystal };
      case "speed":
        return { crystal: assets.blueCrystal };
      case "strength":
        return { crystal: assets.greenCrystal };
      case "invincibility":
        return { crystal: assets.yellowCrystal };
      case "potion":
        return {}; // drawn procedurally (flask)
      default:
        console.warn(`Unknown powerup type "${this._type}", rendering as blue crystal`);
        return { crystal: assets.blueCrystal };
    }
  }

  // Healing flask, drawn procedurally — no sprite asset exists for it
  #drawFlask(ctx, bob) {
    const cx = this._position.x + this._width / 2;
    const cy = this._position.y + this._height / 2 + bob;
    ctx.save();
    // Body
    ctx.fillStyle = 'rgba(230, 240, 255, 0.5)';
    ctx.strokeStyle = '#cfd8dc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy + 6, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Liquid
    ctx.fillStyle = '#e53935';
    ctx.beginPath();
    ctx.arc(cx, cy + 6, 9, 0, Math.PI * 2);
    ctx.fill();
    // Neck + cork
    ctx.fillStyle = 'rgba(230, 240, 255, 0.6)';
    ctx.fillRect(cx - 4, cy - 12, 8, 8);
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(cx - 5, cy - 16, 10, 5);
    ctx.restore();
  }

  #drawSprite(ctx, bob) {
    ctx.drawImage(
      this._sprites.crystal,
      this._position.x,
      this._position.y + bob,
      this._width,
      this._height
    );
  }

  collect() {
    if (!this.#collected) {
      this.#collected = true;
      return this._type;
    }
    return null;
  }

  update() {
    this.bobFrame = (this.bobFrame + 1) % 120;
  }

  draw(ctx) {
    if (this.#collected) return;
    // Gentle bobbing so pickups stand out from the scenery
    const bob = Math.sin((this.bobFrame / 120) * Math.PI * 2) * 4;
    if (this._type === 'potion') {
      this.#drawFlask(ctx, bob);
    } else {
      this.#drawSprite(ctx, bob);
    }
  }
}

export default Powerup;
