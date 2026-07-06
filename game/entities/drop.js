import Entity from "./entity.js";
import { itemCatalog } from "../items.js";

// Drop entity class
// - An item lying on the ground after a guard is defeated
// - Bobs gently so it stands out from the scenery
// - Picked up (into the player's inventory) on contact; see Game.checkCollisions
class Drop extends Entity {
  #ageMs = 0;

  constructor(x, y, itemId, itemAssets) {
    super(x, y, itemId, itemAssets);
  }

  selectSprites(assets) {
    return { icon: assets[itemCatalog[this._type].icon] };
  }

  update(deltaMs = 1000 / 60) {
    this.#ageMs += deltaMs;
  }

  draw(ctx) {
    // Drawn smaller than a full cell so it reads as loot, not scenery
    const size = 40;
    const bob = Math.sin(this.#ageMs / 300) * 3;
    ctx.drawImage(
      this._sprites.icon,
      this._position.x + (this._width - size) / 2,
      this._position.y + (this._height - size) / 2 + bob,
      size,
      size
    );
  }
}

export default Drop;
