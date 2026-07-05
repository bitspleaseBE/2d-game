import { canvasSettings } from '../utils/settings.js';

class Entity {
  _position;
  _width;
  _height;
  _sprites;
  _type;

  constructor(x, y, type, assets, width = canvasSettings.cellWidth, height = canvasSettings.cellHeight) {
    this._position = { x, y };
    this._width = width;
    this._height = height;
    this._type = type;
    this._sprites = this.selectSprites(assets);
  }

  getPosition() {
    return { ...this._position };
  }

  setPosition(x, y) {
    this._position = { x, y };
  }

  getType() {
    return this._type;
  }

  getHitBox() {
    return {
      x: this._position.x,
      y: this._position.y,
      width: this._width,
      height: this._height,
    };
  }

  selectSprites(assets) {
    // This method should be overridden by subclasses to select appropriate sprites
    return {};
  }

  update() {
    // Abstract method to be implemented by subclasses
  }

  draw(ctx) {
    // Abstract method to be implemented by subclasses
  }
}

export default Entity;
