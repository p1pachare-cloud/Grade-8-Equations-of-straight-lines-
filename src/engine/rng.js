/**
 * Seeded PRNG and sampling helpers
 */

export function mulberry32(seed) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let defaultRng = mulberry32(Date.now() & 0xffffffff);

export function setGlobalSeed(seed) {
  defaultRng = mulberry32(seed);
}

export function randomFloat(rng = defaultRng) {
  return rng();
}

export function randInt(min, max, rng = defaultRng) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function pick(array, rng = defaultRng) {
  if (!array || array.length === 0) return null;
  return array[Math.floor(rng() * array.length)];
}

export function shuffle(array, rng = defaultRng) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
