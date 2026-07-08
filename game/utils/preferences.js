// Player preferences and light campaign progress in localStorage.
// Every accessor is wrapped so blocked storage never crashes the game.

import { soundSettings } from './settings.js';

const KEYS = {
  soundMuted: 'wandertrap.soundMuted',
  skipLevelIntros: 'wandertrap.skipLevelIntros',
  seenLevelIntros: 'wandertrap.seenLevelIntros',
  campaignComplete: 'wandertrap.campaignComplete',
};

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable — preference just isn't persisted
  }
}

export function loadSoundPreferences() {
  try {
    const raw = localStorage.getItem(KEYS.soundMuted);
    if (raw !== null) soundSettings.mute = raw === 'true';
  } catch {
    // Keep default
  }
}

export function isSoundMuted() {
  return soundSettings.mute;
}

export function setSoundMuted(mute) {
  soundSettings.mute = Boolean(mute);
  try {
    localStorage.setItem(KEYS.soundMuted, String(soundSettings.mute));
  } catch {
    // best-effort
  }
}

export function toggleSoundMuted() {
  setSoundMuted(!soundSettings.mute);
  return soundSettings.mute;
}

export function getSkipLevelIntros() {
  try {
    return localStorage.getItem(KEYS.skipLevelIntros) === 'true';
  } catch {
    return false;
  }
}

export function setSkipLevelIntros(skip) {
  try {
    localStorage.setItem(KEYS.skipLevelIntros, String(Boolean(skip)));
  } catch {
    // best-effort
  }
}

function getSeenLevelIntroSet() {
  const seen = readJson(KEYS.seenLevelIntros, []);
  return new Set(Array.isArray(seen) ? seen : []);
}

export function hasSeenLevelIntro(levelNumber) {
  return getSeenLevelIntroSet().has(levelNumber);
}

export function markLevelIntroSeen(levelNumber) {
  const seen = getSeenLevelIntroSet();
  seen.add(levelNumber);
  writeJson(KEYS.seenLevelIntros, [...seen]);
}

export function shouldShowLevelIntro(levelNumber) {
  if (getSkipLevelIntros()) return false;
  return !hasSeenLevelIntro(levelNumber);
}

export function isCampaignComplete() {
  try {
    return localStorage.getItem(KEYS.campaignComplete) === 'true';
  } catch {
    return false;
  }
}

export function setCampaignComplete() {
  try {
    localStorage.setItem(KEYS.campaignComplete, 'true');
  } catch {
    // best-effort
  }
}
