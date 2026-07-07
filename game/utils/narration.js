import { soundSettings } from './settings.js';

// Narration is optional: if the ElevenLabs MP3s are missing, blocked by the
// browser, or muted, story screens still advance using their text timers.

let currentAudio = null;

function narrationSrc(audioId) {
  return `assets/audio/narration/${audioId}.mp3`;
}

export function stopNarration() {
  if (!currentAudio) return;
  currentAudio.pause();
  currentAudio.currentTime = 0;
  currentAudio = null;
}

export function playNarration(audioId, { onEnded, onError } = {}) {
  stopNarration();
  if (soundSettings.mute || !audioId || typeof Audio === 'undefined') return false;

  try {
    const audio = new Audio(narrationSrc(audioId));
    audio.volume = soundSettings.volume;
    audio.addEventListener('ended', () => {
      if (currentAudio === audio) currentAudio = null;
      if (onEnded) onEnded();
    }, { once: true });
    audio.addEventListener('error', () => {
      if (currentAudio === audio) currentAudio = null;
      if (onError) onError();
    }, { once: true });

    currentAudio = audio;
    audio.play().catch(() => {
      if (currentAudio === audio) currentAudio = null;
      if (onError) onError();
    });
    return true;
  } catch {
    currentAudio = null;
    return false;
  }
}
