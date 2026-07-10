import { getDailyResult, recordDailyResult } from './preferences.js';
import { gameSettings } from './settings.js';

// The Daily Dream: one date-seeded attempt per day. Everyone playing on the
// same date gets the same seed (same orc types, crystals and drop rolls),
// and the result can be shared as a Wordle-style text string — all local,
// no backend anywhere.

export function todayKey(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

// Deterministic 32-bit hash of the date string, used as the day's RNG seed
export function dailySeed(dateKey = todayKey()) {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (Math.imul(31, hash) + dateKey.charCodeAt(i)) | 0;
  }
  return hash | 0;
}

export function getTodayResult() {
  return getDailyResult(todayKey());
}

// One attempt per day: the first recorded result stands
export function recordTodayResult({ score, levelReached, won }) {
  if (getTodayResult()) return;
  recordDailyResult({
    date: todayKey(),
    score,
    levelReached,
    won: Boolean(won),
  });
}

export function shareString(result = getTodayResult()) {
  if (!result) return null;
  const progress = result.won
    ? 'woke at dawn ☀️'
    : `Dream ${result.levelReached}/${gameSettings.maxLevels} 🌙`;
  return `🌙 Wandertrap Daily ${result.date} — ${progress} — ${result.score} pts`;
}

// Copy the share string to the clipboard; returns false when blocked so the
// caller can fall back to showing the text
export async function copyShareString(result) {
  const text = shareString(result);
  if (!text) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
