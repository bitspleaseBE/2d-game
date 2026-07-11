import Entity from './entity.js';
import { canvasSettings, trapSettings } from '../utils/settings.js';

// Dart shooter ('^ v < >') — a wall-mounted launcher.
// - Fires a dart along its facing direction on a cooldown, but only while the
//   player is within activation range (so idle rooms stay quiet).
// - The cell itself is a solid wall (added in Game.initializeBoard); this
//   entity only draws the port and returns a shot descriptor to spawn a dart.
// - Darts reuse the projectile system with owner "guard": they hit only the
//   player and are stopped by walls/doors/obstacles, all for free.

const MUZZLE_FLASH_MS = 120;

class DartShooter extends Entity {
  #direction;
  #cooldownMs = 0;
  #flashMs = 0;

  constructor(x, y, direction) {
    super(x, y, 'dart-shooter');
    this.#direction = direction;
  }

  getCenter() {
    return {
      x: this._position.x + this._width / 2,
      y: this._position.y + this._height / 2,
    };
  }

  // Returns a shot descriptor on the frame it fires, else null.
  update(playerCenter, deltaMs = 1000 / 60) {
    this.#cooldownMs = Math.max(0, this.#cooldownMs - deltaMs);
    this.#flashMs = Math.max(0, this.#flashMs - deltaMs);
    if (!playerCenter || this.#cooldownMs > 0) return null;

    const center = this.getCenter();
    const distance = Math.hypot(playerCenter.x - center.x, playerCenter.y - center.y);
    if (distance > trapSettings.dartActivationRangeCells * canvasSettings.cellWidth) return null;

    this.#cooldownMs = trapSettings.dartCooldownMs;
    this.#flashMs = MUZZLE_FLASH_MS;
    // Spawn fully outside our own wall hitbox, else the dart would collide with
    // this very wall on its first frame and be destroyed immediately. The
    // projectile's hitbox is 24x12 and never rotates, so clear the widest half
    // (12px) plus the half-cell wall (32px) with margin to spare.
    const offset = canvasSettings.cellWidth * 0.8;
    return {
      x: center.x + this.#direction.x * offset,
      y: center.y + this.#direction.y * offset,
      direction: { ...this.#direction },
      damage: trapSettings.dartDamage,
      speed: trapSettings.dartSpeed,
      rangeCells: trapSettings.dartRangeCells,
    };
  }

  draw(ctx) {
    const center = this.getCenter();
    ctx.save();
    // Dark port set into the wall tile
    ctx.fillStyle = '#1c1c1c';
    ctx.beginPath();
    ctx.arc(center.x, center.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(90, 90, 100, 0.9)';
    ctx.lineWidth = 2;
    ctx.stroke();
    // A notch pointing the way it fires
    ctx.strokeStyle = '#3a3a3a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(center.x + this.#direction.x * 12, center.y + this.#direction.y * 12);
    ctx.stroke();
    // Brief muzzle flash just after firing
    if (this.#flashMs > 0) {
      const alpha = this.#flashMs / MUZZLE_FLASH_MS;
      ctx.fillStyle = `rgba(255, 200, 90, ${alpha})`;
      ctx.beginPath();
      ctx.arc(center.x + this.#direction.x * 14, center.y + this.#direction.y * 14, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

export default DartShooter;
