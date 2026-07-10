import { soundSettings } from './settings.js';
import { getAudioContext } from './sound.js';

// Procedural lullaby: a slow, low-pass filtered pentatonic music box, built
// entirely from Web Audio oscillators — no audio assets. Each level theme
// gets its own key, scale and tempo, and while a boss is alive the melody
// drops to sparse low minor notes. Like the SFX, every call is best-effort:
// blocked audio can never break gameplay.

// Scales are semitone offsets from the theme's root note. All are pentatonic
// (or close) so any note order sounds gentle — dream music, not battle music.
const THEMES = {
  forest: { root: 262, tempoMs: 500, scale: [0, 2, 4, 7, 9, 12, 14], type: 'sine' },
  desert: { root: 294, tempoMs: 540, scale: [0, 2, 3, 7, 8, 12, 14], type: 'triangle' },
  snow: { root: 330, tempoMs: 640, scale: [0, 2, 4, 7, 9, 12, 16], type: 'sine' },
  dungeon: { root: 220, tempoMs: 580, scale: [0, 3, 5, 7, 10, 12, 15], type: 'triangle' },
  boss: { root: 147, tempoMs: 760, scale: [0, 1, 3, 6, 7, 12], type: 'triangle' },
};

// A wandering-but-gentle arpeggio pattern over the scale degrees; the
// occasional -1 is a rest so the lullaby breathes
const PATTERN = [0, 2, 4, 2, 5, -1, 4, 2, 1, 3, -1, 2, 6, 4, 2, -1];

let timer = null;
let step = 0;
let themeName = 'forest';
let bossActive = false;

function noteFrequency(root, semitones) {
  return root * Math.pow(2, semitones / 12);
}

function playNote(frequency, { duration, volume, type }) {
  const audio = getAudioContext();
  if (!audio) return;
  try {
    const t0 = audio.currentTime;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    const filter = audio.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, t0);
    // Soft music-box envelope: quick pluck, long release
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(filter).connect(gain).connect(audio.destination);
    osc.start(t0);
    osc.stop(t0 + duration);
  } catch {
    // best-effort
  }
}

function tick() {
  if (soundSettings.mute) return;
  const theme = bossActive ? THEMES.boss : THEMES[themeName] || THEMES.forest;
  const musicVolume = soundSettings.volume * soundSettings.musicVolume;

  // A soft bass root every bar keeps the lullaby anchored
  if (step % 8 === 0) {
    playNote(theme.root / 2, {
      duration: (theme.tempoMs / 1000) * 6,
      volume: musicVolume * 0.5,
      type: 'sine',
    });
  }

  const degree = PATTERN[step % PATTERN.length];
  // While a boss is alive the melody thins out: only every other pattern
  // slot plays, so the dream feels like it is holding its breath
  const rest = degree < 0 || (bossActive && step % 2 === 1);
  if (!rest) {
    const semitones = theme.scale[degree % theme.scale.length];
    playNote(noteFrequency(theme.root, semitones), {
      duration: (theme.tempoMs / 1000) * 2.4,
      volume: musicVolume,
      type: theme.type,
    });
  }
  step += 1;
}

// (Re)start the scheduler at the current theme's tempo
function schedule() {
  if (timer) clearInterval(timer);
  const theme = bossActive ? THEMES.boss : THEMES[themeName] || THEMES.forest;
  timer = setInterval(tick, theme.tempoMs);
}

export const music = {
  start(theme = themeName) {
    themeName = theme;
    step = 0;
    schedule();
  },
  setTheme(theme) {
    if (!THEMES[theme] || theme === themeName) return;
    themeName = theme;
    if (timer) schedule();
  },
  setBossActive(active) {
    const next = Boolean(active);
    if (next === bossActive) return;
    bossActive = next;
    if (timer) schedule();
  },
  stop() {
    if (timer) clearInterval(timer);
    timer = null;
  },
  isPlaying() {
    return timer !== null;
  },
};
