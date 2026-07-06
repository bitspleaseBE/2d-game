import Entity from './entity.js';
import { entitySettings } from '../utils/settings.js';

// Explosive entity — a hidden trap
// - Starts hidden. When the player comes close it reveals itself and arms:
//   a short fuse starts burning (the bomb flashes faster and faster).
// - When the fuse runs out it detonates, damaging the player AND any guards
//   inside the blast radius. The game reads the blast via consumeBlast().
// - An armed trap can be disarmed with the pick action before it blows.
// - Drawn procedurally (bomb + fuse spark + expanding blast), no sprite needed.

const EXPLOSION_ANIMATION_MS = 350;

class Explosive extends Entity {
  #state = 'hidden'; // hidden -> armed -> exploding -> done
  #fuseMs = entitySettings.explosiveFuseMs;
  #explosionMs = EXPLOSION_ANIMATION_MS;
  #blastConsumed = false;

  constructor(x, y) {
    super(x, y, 'explosive');
  }

  isHidden() {
    return this.#state === 'hidden';
  }

  isArmed() {
    return this.#state === 'armed';
  }

  isExploding() {
    return this.#state === 'exploding';
  }

  // Finished exploding; safe to remove from the game
  isDone() {
    return this.#state === 'done';
  }

  getCenter() {
    return {
      x: this._position.x + this._width / 2,
      y: this._position.y + this._height / 2,
    };
  }

  // The blast is applied exactly once, on the frame the fuse runs out.
  // Returns the blast circle on that frame, null otherwise.
  consumeBlast() {
    if (this.#state !== 'exploding' || this.#blastConsumed) return null;
    this.#blastConsumed = true;
    return { ...this.getCenter(), radius: entitySettings.explosiveBlastRadius };
  }

  update(playerHitBox, deltaMs = 1000 / 60) {
    switch (this.#state) {
      case 'hidden': {
        if (!playerHitBox) break;
        const center = this.getCenter();
        const px = playerHitBox.x + playerHitBox.width / 2;
        const py = playerHitBox.y + playerHitBox.height / 2;
        const distance = Math.hypot(px - center.x, py - center.y);
        if (distance <= entitySettings.explosiveTriggerRange) {
          this.#state = 'armed';
        }
        break;
      }
      case 'armed':
        this.#fuseMs -= deltaMs;
        if (this.#fuseMs <= 0) this.#state = 'exploding';
        break;
      case 'exploding':
        this.#explosionMs -= deltaMs;
        if (this.#explosionMs <= 0) this.#state = 'done';
        break;
    }
  }

  draw(ctx) {
    if (this.#state === 'hidden' || this.#state === 'done') return;

    const center = this.getCenter();
    ctx.save();

    if (this.#state === 'armed') {
      // Bomb body
      ctx.fillStyle = '#1c1c1c';
      ctx.beginPath();
      ctx.arc(center.x, center.y + 6, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Fuse
      ctx.strokeStyle = '#8B4513';
      ctx.beginPath();
      ctx.moveTo(center.x, center.y - 10);
      ctx.quadraticCurveTo(center.x + 10, center.y - 20, center.x + 14, center.y - 14);
      ctx.stroke();
      // Spark, flickering
      ctx.fillStyle = Math.floor(this.#fuseMs / 130) % 2 === 0 ? '#ffd54f' : '#ff7043';
      ctx.beginPath();
      ctx.arc(center.x + 14, center.y - 14, 4, 0, Math.PI * 2);
      ctx.fill();
      // Red warning flash that speeds up as the fuse burns down
      const flashPeriodMs = this.#fuseMs > entitySettings.explosiveFuseMs / 2 ? 330 : 130;
      if (this.#fuseMs % flashPeriodMs < flashPeriodMs / 2) {
        ctx.fillStyle = 'rgba(255, 40, 40, 0.25)';
        ctx.beginPath();
        ctx.arc(center.x, center.y, entitySettings.explosiveBlastRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Expanding blast rings
      const progress = 1 - this.#explosionMs / EXPLOSION_ANIMATION_MS;
      const radius = entitySettings.explosiveBlastRadius * progress;
      const alpha = 1 - progress;
      ctx.fillStyle = `rgba(255, 160, 30, ${alpha * 0.7})`;
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(255, 240, 120, ${alpha})`;
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius * 0.55, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

export default Explosive;
