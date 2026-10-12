import { Frac } from '../engine/frac';
import { shuffle } from '../engine/rng';

/**
 * Generates misconception-driven distractors for slopes
 * e.g. inverted (run/rise), negative sign mistake, wrong subtractions
 */
export function generateSlopeDistractors(m, rng) {
  const frac = Frac.from(m);
  const options = new Set();
  const correctStr = frac.toString();
  options.add(correctStr);

  // Misconception 1: Inverted (Run / Rise)
  if (frac.n !== 0) {
    options.add(new Frac(frac.d, frac.n).toString());
  }

  // Misconception 2: Wrong sign
  options.add(new Frac(-frac.n, frac.d).toString());

  // Misconception 3: Inverted with wrong sign
  if (frac.n !== 0) {
    options.add(new Frac(-frac.d, frac.n).toString());
  }

  // Misconception 4: Off by 1 in numerator or denominator
  options.add(new Frac(frac.n + 1, frac.d).toString());
  options.add(new Frac(frac.n - 1, frac.d).toString());

  const arr = Array.from(options).filter((val) => val !== correctStr);
  const picked = shuffle(arr, rng).slice(0, 3);
  return shuffle([correctStr, ...picked], rng);
}

/**
 * Generates distractors for multiple choice options
 */
export function pickDistractors(correctAnswer, candidatePool, rng, count = 3) {
  const cleanCorrect = String(correctAnswer).trim();
  const filtered = candidatePool.filter((c) => String(c).trim() !== cleanCorrect);
  const selected = shuffle(filtered, rng).slice(0, count);
  return shuffle([correctAnswer, ...selected], rng);
}
