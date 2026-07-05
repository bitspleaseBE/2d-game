// Persistent high scores, stored in localStorage.
// Every accessor is wrapped so a blocked/absent localStorage (private
// browsing, storage quota) degrades to an empty list instead of crashing.

const STORAGE_KEY = 'wandertrap.highScores';
const MAX_SCORES = 10;

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
        name: (name || 'Anonymous').slice(0, 16),
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
