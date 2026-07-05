import Entity from './entity.js';

// Powerup entity class
// - Represents the powerups in the game
// - Can be collected by the player
// - Can be dropped by guards
// - Can be dropped by obstacles
// - Properties: position, type, collected
// - Methods: collect (mark as collected), update, draw
class Powerup extends Entity {
  #collected;

  constructor(x, y, type, assets) {
    super(x, y, type, assets);
    this.#collected = false;
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

  // ... rest of the Powerup class methods ...

  draw(ctx) {
    if (!this.#collected) {
      ctx.drawImage(
        this._sprites.crystal,
        this._position.x,
        this._position.y,
        this._width,
        this._height
      );
    }
  }
}

export default Powerup;