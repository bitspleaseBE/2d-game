import Entity from "./entity.js";

// Door entity class
// - A locked wooden door that blocks a corridor inside the maze ('D' tile)
// - Blocks the player and guards like a wall while locked
// - Walking into it while carrying a key unlocks it (see Game.checkDoorUnlock);
//   once open it disappears and the corridor is free
class Door extends Entity {
  constructor(x, y, assets) {
    super(x, y, "door", assets);
    this.locked = true;
  }

  selectSprites(assets) {
    return { door: assets.door };
  }

  unlock() {
    this.locked = false;
  }

  draw(ctx) {
    if (!this.locked) return; // an opened door leaves a free passage

    ctx.drawImage(
      this._sprites.door,
      this._position.x,
      this._position.y,
      this._width,
      this._height
    );

    // A padlock signals that the door needs a key
    const lockX = this._position.x + this._width / 2 - 9;
    const lockY = this._position.y + this._height / 2 - 2;
    ctx.save();
    // Shackle
    ctx.strokeStyle = "#cfd8dc";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(lockX + 9, lockY + 2, 6, Math.PI, 0);
    ctx.stroke();
    // Body
    ctx.fillStyle = "#ffd54f";
    ctx.fillRect(lockX, lockY + 2, 18, 14);
    // Keyhole
    ctx.fillStyle = "#5d4037";
    ctx.fillRect(lockX + 7, lockY + 6, 4, 7);
    ctx.restore();
  }
}

export default Door;
