import Entity from './entity.js';
import { trapSettings } from '../utils/settings.js';

// Spike trap ('S') — a telegraphed floor hazard.
// - Cycles retracted -> warning -> extended on a loop.
// - While extended it damages the player and any guard standing on it; a guard
//   is hurt at most once per extension cycle (tracked in #hurtGuards).
// - Always visible: the danger is in the timing, not in hiding.
// - Drawn procedurally, no sprite needed.

const CYCLE_MS =
  trapSettings.spikeRetractedMs + trapSettings.spikeWarningMs + trapSettings.spikeExtendedMs;

class SpikeTrap extends Entity {
  #elapsedMs;
  #hurtGuards = new Set();
  #wasExtended = false;

  // A phase offset staggers neighbouring spikes so a row does not fire in unison
  constructor(x, y, { phaseMs = 0 } = {}) {
    super(x, y, 'spike');
    this.#elapsedMs = ((phaseMs % CYCLE_MS) + CYCLE_MS) % CYCLE_MS;
  }

  #phase() {
    const t = this.#elapsedMs % CYCLE_MS;
    if (t < trapSettings.spikeRetractedMs) return 'retracted';
    if (t < trapSettings.spikeRetractedMs + trapSettings.spikeWarningMs) return 'warning';
    return 'extended';
  }

  isExtended() {
    return this.#phase() === 'extended';
  }

  // Inset so grazing a tile corner does not count as standing on the spikes
  getDamageBox() {
    return {
      x: this._position.x + 12,
      y: this._position.y + 12,
      width: this._width - 24,
      height: this._height - 24,
    };
  }

  canHurtGuard(guard) {
    return !this.#hurtGuards.has(guard);
  }

  markGuardHurt(guard) {
    this.#hurtGuards.add(guard);
  }

  update(deltaMs = 1000 / 60) {
    this.#elapsedMs += deltaMs;
    const extended = this.isExtended();
    if (extended && !this.#wasExtended) this.#hurtGuards.clear(); // a fresh cycle began
    this.#wasExtended = extended;
  }

  draw(ctx) {
    const phase = this.#phase();
    const { x, y } = this._position;
    const w = this._width;
    const h = this._height;

    ctx.save();
    // Base plate with four slots the spikes rise from
    ctx.fillStyle = 'rgba(20, 22, 28, 0.55)';
    const slotW = w * 0.12;
    for (let i = 0; i < 4; i += 1) {
      ctx.fillRect(x + w * (0.18 + i * 0.2), y + h * 0.3, slotW, h * 0.4);
    }

    if (phase === 'warning') {
      const t = (this.#elapsedMs % CYCLE_MS) - trapSettings.spikeRetractedMs;
      const grow = Math.min(1, t / trapSettings.spikeWarningMs);
      this.#drawSpikes(ctx, x, y, w, h, 0.2 + grow * 0.2);
    } else if (phase === 'extended') {
      this.#drawSpikes(ctx, x, y, w, h, 0.7);
    }
    ctx.restore();
  }

  #drawSpikes(ctx, x, y, w, h, heightFrac) {
    const spikeW = w * 0.16;
    const spikeH = h * heightFrac;
    const baseY = y + h * 0.72;
    for (let i = 0; i < 4; i += 1) {
      const cx = x + w * (0.2 + i * 0.2);
      ctx.fillStyle = '#b0bec5';
      ctx.beginPath();
      ctx.moveTo(cx - spikeW / 2, baseY);
      ctx.lineTo(cx, baseY - spikeH);
      ctx.lineTo(cx + spikeW / 2, baseY);
      ctx.closePath();
      ctx.fill();
      // Shaded right face for a little depth
      ctx.fillStyle = 'rgba(120, 144, 156, 0.8)';
      ctx.beginPath();
      ctx.moveTo(cx, baseY - spikeH);
      ctx.lineTo(cx + spikeW / 2, baseY);
      ctx.lineTo(cx, baseY);
      ctx.closePath();
      ctx.fill();
    }
  }
}

export default SpikeTrap;
