import Entity from "./entity.js";
import { randomInt } from "../utils/rng.js";

// Obstacle entity class
// - Represents the obstacles in the game (boulders and trees)
// - Blocks the player until destroyed (two sword hits)
// - Tree sprite varies with the level theme so levels look distinct

class Obstacle extends Entity {
  #health;

  constructor(x, y, type, assets, theme = "forest") {
    super(x, y, type, assets);
    this.#health = 100;
    if (type === "boulder") {
      this._sprite = assets.rock;
    } else if (type === "tree") {
      switch (theme) {
        case "sand":
          this._sprite = assets.tree3;
          break;
        case "snow":
          this._sprite = assets.tree1;
          break;
        case "dark":
          this._sprite = assets.tree2;
          break;
        default: {
          const randomTree = randomInt(1, 2);
          this._sprite = assets[`palm${randomTree}`];
        }
      }
    }
  }

  takeDamage(amount) {
    this.#health -= amount;
  }

  isDestroyed() {
    return this.#health <= 0;
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
