import Entity from "./entity.js";
import { random } from "../utils/rng.js";

// Exit entity class
// - Represents the exit in the game
// - Reached by the player to complete the level
// - Ruin sprite matches the level theme (sand/snow/golden)

class Exit extends Entity {
  constructor(x, y, assets, theme = 'forest') {
    super(x, y, 'exit', assets);
    switch (theme) {
      case 'sand':
        this._sprite = assets.sandRuin;
        break;
      case 'snow':
        this._sprite = assets.snowRuin;
        break;
      default:
        this._sprite = assets.yellowRuin;
    }
    this._sparkles = this._createSparkles();
  }

  _createSparkles() {
    const sparkleCount = 20;
    const sparkles = [];
    for (let i = 0; i < sparkleCount; i++) {
      sparkles.push({
        x: this._position.x + random() * this._width,
        y: this._position.y + random() * this._height,
        vy: -0.5 + random() * 0.5 // vertical velocity
      });
    }
    return sparkles;
  }

  _updateSparkles() {
    for (const sparkle of this._sparkles) {
      sparkle.y += sparkle.vy;
      if (sparkle.y < this._position.y) {
        sparkle.y = this._position.y + this._height;
      }
    }
  }

  draw(ctx) {
    // Draw a semi-transparent dark rectangle over the current cell
    // Create a radial gradient
    const gradient = ctx.createRadialGradient(
      this._position.x + this._width / 2,
      this._position.y + this._height / 2,
      0,
      this._position.x + this._width / 2,
      this._position.y + this._height / 2,
      Math.max(this._width, this._height) / 2
    );
    gradient.addColorStop(0, 'rgba(255, 255, 200, 0.5)'); // Lighter in the middle
    gradient.addColorStop(1, 'rgba(255, 255, 200, 0.1)'); // Darker at the edges

    ctx.fillStyle = gradient;
    ctx.fillRect(
      this._position.x,
      this._position.y,
      this._width,
      this._height
    );
    // Draw the exit sprite
    ctx.drawImage(
      this._sprite,
      this._position.x,
      this._position.y,
      this._width,
      this._height
    );

    // Update and draw sparkles
    this._updateSparkles();
    const sparkleSize = 1;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (const sparkle of this._sparkles) {
      ctx.beginPath();
      ctx.arc(sparkle.x, sparkle.y, sparkleSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export default Exit;
