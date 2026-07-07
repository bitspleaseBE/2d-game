import Entity from "./entity.js";
import { canvasSettings, combatSettings } from "../utils/settings.js";

class Projectile extends Entity {
  #direction;
  #distanceTravelled = 0;
  #maxDistance;
  #damage;
  #owner;
  #done = false;

  constructor(x, y, direction, assets, { owner, damage, speed = combatSettings.projectileSpeed } = {}) {
    super(x, y, "arrow", assets, 24, 12);
    const length = Math.hypot(direction.x, direction.y) || 1;
    this.#direction = { x: direction.x / length, y: direction.y / length };
    this.#owner = owner;
    this.#damage = damage;
    this.speed = speed;
    this.#maxDistance = combatSettings.projectileRangeCells * canvasSettings.cellWidth;
  }

  selectSprites(assets) {
    return { arrow: assets.arrow };
  }

  get owner() {
    return this.#owner;
  }

  get damage() {
    return this.#damage;
  }

  update(deltaMs = 1000 / 60) {
    if (this.#done) return;
    const distance = this.speed * (deltaMs / 1000);
    this._position.x += this.#direction.x * distance;
    this._position.y += this.#direction.y * distance;
    this.#distanceTravelled += distance;
    if (this.#distanceTravelled >= this.#maxDistance) this.#done = true;
  }

  isDone() {
    return this.#done;
  }

  destroy() {
    this.#done = true;
  }

  draw(ctx) {
    if (this.#done) return;
    const angle = Math.atan2(this.#direction.y, this.#direction.x);
    const centerX = this._position.x + this._width / 2;
    const centerY = this._position.y + this._height / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    ctx.drawImage(
      this._sprites.arrow,
      -canvasSettings.cellWidth / 2,
      -canvasSettings.cellHeight / 2,
      canvasSettings.cellWidth,
      canvasSettings.cellHeight
    );
    ctx.restore();
  }
}

export default Projectile;
