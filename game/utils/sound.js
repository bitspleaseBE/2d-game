import { soundSettings } from './settings.js';

// Tiny synthesized sound effects via the Web Audio API — no audio assets
// needed. The AudioContext is created lazily on the first sound, which always
// happens after a user gesture (a key press or button click), so autoplay
// policies never block it. Every call is wrapped so a missing/blocked audio
// backend can never break the game.

let ctx = null;

function getContext() {
  if (soundSettings.mute) return null;
  try {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      ctx = new AudioCtx();
    }
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  } catch {
    return null;
  }
}

// Play a simple tone: oscillator + exponential decay envelope
function tone({ type = 'square', from = 440, to = from, duration = 0.1, volume = 0.3, delay = 0 }) {
  const audio = getContext();
  if (!audio) return;
  try {
    const t0 = audio.currentTime + delay;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), t0 + duration);
    gain.gain.setValueAtTime(volume * soundSettings.volume, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
    osc.connect(gain).connect(audio.destination);
    osc.start(t0);
    osc.stop(t0 + duration);
  } catch {
    // Audio is best-effort; never let it break gameplay
  }
}

// A burst of filtered noise, for impacts and explosions
function noise({ duration = 0.3, volume = 0.4, delay = 0 }) {
  const audio = getContext();
  if (!audio) return;
  try {
    const t0 = audio.currentTime + delay;
    const buffer = audio.createBuffer(1, audio.sampleRate * duration, audio.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }
    const src = audio.createBufferSource();
    src.buffer = buffer;
    const gain = audio.createGain();
    gain.gain.setValueAtTime(volume * soundSettings.volume, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
    src.connect(gain).connect(audio.destination);
    src.start(t0);
  } catch {
    // best-effort
  }
}

export const sfx = {
  swing: () => tone({ type: 'sawtooth', from: 300, to: 80, duration: 0.08, volume: 0.15 }),
  hit: () => tone({ type: 'square', from: 150, to: 60, duration: 0.12, volume: 0.25 }),
  hurt: () => tone({ type: 'triangle', from: 220, to: 110, duration: 0.25, volume: 0.3 }),
  pickup: () => {
    tone({ type: 'sine', from: 660, to: 880, duration: 0.08, volume: 0.25 });
    tone({ type: 'sine', from: 880, to: 1320, duration: 0.1, volume: 0.2, delay: 0.08 });
  },
  fuse: () => tone({ type: 'square', from: 1200, to: 1200, duration: 0.05, volume: 0.08 }),
  explosion: () => {
    noise({ duration: 0.5, volume: 0.5 });
    tone({ type: 'sine', from: 100, to: 30, duration: 0.5, volume: 0.4 });
  },
  guardDown: () => tone({ type: 'sawtooth', from: 200, to: 40, duration: 0.35, volume: 0.3 }),
  unlock: () => {
    tone({ type: 'square', from: 500, to: 500, duration: 0.06, volume: 0.2 });
    tone({ type: 'square', from: 750, to: 750, duration: 0.1, volume: 0.2, delay: 0.08 });
  },
  disarm: () => tone({ type: 'sine', from: 900, to: 300, duration: 0.25, volume: 0.2 }),
  gulp: () => {
    tone({ type: 'sine', from: 300, to: 150, duration: 0.1, volume: 0.25 });
    tone({ type: 'sine', from: 350, to: 180, duration: 0.12, volume: 0.25, delay: 0.12 });
  },
  chop: () => tone({ type: 'square', from: 120, to: 50, duration: 0.15, volume: 0.3 }),
  levelComplete: () => {
    [523, 659, 784, 1047].forEach((f, i) =>
      tone({ type: 'triangle', from: f, to: f, duration: 0.15, volume: 0.25, delay: i * 0.12 })
    );
  },
  gameOver: () => {
    [392, 330, 262, 196].forEach((f, i) =>
      tone({ type: 'triangle', from: f, to: f, duration: 0.25, volume: 0.25, delay: i * 0.2 })
    );
  },
};
