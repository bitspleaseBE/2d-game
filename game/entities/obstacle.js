import Entity from "./entity.js";
import { randomInt } from "../utils/rng.js";

// Obstacle entity class
// - Represents the obstacles in the game
// - Can be destroyed by the player
// - Can drop powerups when destroyed
// - Can drop explosives when destroyed
// - Can drop keys when destroyed
// - Can drop keys when destroyed

class Obstacle extends Entity {
  #health;

  constructor(x, y, type, assets) {
    super(x, y, type, assets);
    this.#health = 100;
    if (type === "boulder") {
      this._sprite = assets.boulder;
    } else if (type === "tree") {
      const trees = assets.trees || [assets.palm1, assets.palm2].filter(Boolean);
      this._sprite = trees.length ? trees[randomInt(1, trees.length) - 1] : assets.boulder;
    }
  }

  takeDamage(amount) {
    this.#health -= amount;
    if (this.#health <= 0) {
      return this.destroy();
    }
    return null;
  }

  isDestroyed() {
    return this.#health <= 0;
  }

  destroy() {
    // Implement destruction logic
    console.log("Obstacle destroyed!");
    // Return dropped items (powerups, explosives, keys)
  }

  update() {
    // Update obstacle state if needed
  }

  draw(ctx) {
    if (this.#health > 0) {
      ctx.drawImage(
        this._sprite,
        this._position.x,
        this._position.y,
        this._width,
        this._height
      );
    }
  }
}

export default Obstacle;
