// Seedable random number generator (mulberry32)
// - Drop-in replacement for Math.random so game runs can be reproduced
// - Pass ?seed=123 in the URL (used by automated tests) for deterministic runs
// - Without a seed the generator is seeded randomly, as before

let state = 0;

function mulberry32() {
  state |= 0;
  state = (state + 0x6d2b79f5) | 0;
  let t = Math.imul(state ^ (state >>> 15), 1 | state);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export function setSeed(seed) {
  state = seed | 0;
}

// Returns a float in [0, 1), like Math.random
export function random() {
  return mulberry32();
}

// Returns an integer in [min, max] (inclusive)
export function randomInt(min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function initialSeed() {
  if (typeof window !== 'undefined') {
    const seedParam = new URLSearchParams(window.location.search).get('seed');
    if (seedParam !== null && seedParam !== '' && !Number.isNaN(Number(seedParam))) {
      return Number(seedParam);
    }
  }
  return Math.floor(Math.random() * 2 ** 31);
}

setSeed(initialSeed());
