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
      default:
        console.warn(`Unknown powerup type "${this._type}", rendering as blue crystal`);
        return { crystal: assets.blueCrystal };
    }
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
    ctx.drawImage(
      this._sprites.crystal,
      this._position.x,
      this._position.y + bob,
      this._width,
      this._height
    );
  }
}

export default Powerup;
