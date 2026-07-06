import Entity from './entity.js';

// Wall entity class
// - Represents the walls in the game
// - Defines properties such as position, width, height
// - May include methods for rendering the wall
// - Could include collision detection logic specific to walls
// - Might have different types of walls (e.g., breakable, unbreakable)
// - Could include methods for special wall behaviors (e.g., secret passages)

class Wall extends Entity {
  #type;

  constructor(x, y, type, assets) {
    super(x, y);
    this.#type = type; // 'normal', 'breakable', 'secret'
    this._sprite = assets.wall;
  }

  getType() {
    return this.#type;
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
  }
}

export default Wall;
