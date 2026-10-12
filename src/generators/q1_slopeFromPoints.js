import { calcSlope } from '../engine/lineMath';
import { randInt, pick } from '../engine/rng';
import { CHARACTER_NAMES } from '../data/namesAndPlaces';
import { generateSlopeDistractors } from './distractors';

export function generateQ1SlopeFromPoints(rng, difficulty = 'easy') {
  const name = pick(CHARACTER_NAMES, rng);

  let x1 = randInt(-5, 5, rng);
  let y1 = randInt(-5, 5, rng);
  let dx = randInt(1, 4, rng);
  let dy;

  if (difficulty === 'easy') {
    // Integer slope, positive or simple negative
    const mInt = randInt(-3, 3, rng);
    dy = mInt * dx;
  } else {
    // Fractional or negative slope
    dy = randInt(-5, 5, rng);
  }

  const x2 = x1 + dx;
  const y2 = y1 + dy;
  const slope = calcSlope(x1, y1, x2, y2);
  const slopeStr = slope.toString();

  const options = generateSlopeDistractors(slope, rng);

  return {
    type: 'Q1',
    format: 'mcq',
    tags: ['slope', slope.n < 0 || slope.d > 1 ? 'fraction_negative' : 'standard'],
    title: `Liam Plots Coordinates`,
    text: `${name} plots the points (${x1}, ${y1}) and (${x2}, ${y2}). What is the slope of the line passing through them?`,
    spokenText: `${name} plots the points ${x1}, ${y1} and ${x2}, ${y2}. What is the slope of the line passing through them?`,
    correctAnswer: slopeStr,
    options,
    points: [{ x: x1, y: y1 }, { x: x2, y: y2 }],
    hint: `Use the slope formula: m = (y₂ − y₁) / (x₂ − x₁). Calculate rise (${y2} − ${y1}) and run (${x2} − ${x1}).`,
    explanation: `Slope m = (${y2} − ${y1}) / (${x2} − ${x1}) = ${dy} / ${dx} = ${slopeStr}.`,
  };
}
