// Persistent high scores, stored in localStorage.
// Every accessor is wrapped so a blocked/absent localStorage (private
// browsing, storage quota) degrades to an empty list instead of crashing.

const STORAGE_KEY = 'wandertrap.highScores';
const MAX_SCORES = 10;
const NAME_MAX_LENGTH = 16;

// Strip control chars and markup-ish characters; keep letters, numbers,
// spaces, and a small set of name punctuation. Used for ?name= and saves.
export function sanitizeScoreName(name) {
    return String(name || '')
        .normalize('NFKC')
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
        .replace(/[^\p{L}\p{N} _.'-]/gu, '')
        .trim()
        .slice(0, NAME_MAX_LENGTH);
}

export function getHighScores() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const scores = raw ? JSON.parse(raw) : [];
        return Array.isArray(scores) ? scores : [];
    } catch {
        return [];
    }
}

// True when a score would make the top-10 list
export function qualifiesForHighScore(score) {
    if (score <= 0) return false;
    const scores = getHighScores();
    if (scores.length < MAX_SCORES) return true;
    return score > scores[scores.length - 1].score;
}

export function addHighScore(name, score) {
    const scores = getHighScores();
    scores.push({
        name: sanitizeScoreName(name) || 'Anonymous',
        score,
        timestamp: new Date().toISOString(),
    });
    scores.sort((a, b) => b.score - a.score);
    const top = scores.slice(0, MAX_SCORES);
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(top));
    } catch {
        // Storage unavailable; the score just isn't persisted
    }
    return top;
}
