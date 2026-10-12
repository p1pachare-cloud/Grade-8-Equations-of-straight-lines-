import { calcSlope, calcYIntercept, formatEquation } from '../engine/lineMath';
import { randInt, shuffle } from '../engine/rng';

export function generateQ6TwoPoints(rng) {
  let m = randInt(-3, 3, rng);
  if (m === 0) m = 1;
  const cVal = randInt(-4, 4, rng);

  const x1 = randInt(-4, 0, rng);
  const y1 = m * x1 + cVal;

  const dx = randInt(1, 3, rng);
  const x2 = x1 + dx;
  const y2 = m * x2 + cVal;

  const slope = calcSlope(x1, y1, x2, y2);
  const intercept = calcYIntercept(x1, y1, slope);
  const correct = formatEquation(slope, intercept);

  // Distractors
  const options = shuffle(
    [
      ...new Set([
        correct,
        formatEquation(-slope.toNumber(), intercept),
        formatEquation(slope, intercept.toNumber() + 2),
        formatEquation(slope, intercept.toNumber() - 2),
      ]),
    ],
    rng
  ).slice(0, 4);

  return {
    type: 'Q6',
    format: 'mcq',
    tags: ['two_points', slope.n < 0 ? 'fraction_negative' : 'standard'],
    title: 'Equation Through Two Points',
    text: `A line passes through (${x1}, ${y1}) and (${x2}, ${y2}). What is its equation in the form y = mx + c?`,
    spokenText: `A line passes through the point ${x1}, ${y1} and ${x2}, ${y2}. What is its equation?`,
    correctAnswer: correct,
    options,
    points: [{ x: x1, y: y1 }, { x: x2, y: y2 }],
    hint: `First find the slope m = (${y2} − ${y1}) / (${x2} − ${x1}). Then substitute either point to solve for c.`,
    explanation: `Slope m = (${y2} − ${y1}) / (${x2} − ${x1}) = ${slope.toString()}. Using point (${x1}, ${y1}): ${y1} = (${slope.toString()})(${x1}) + c → c = ${intercept.toString()}. The equation is ${correct}.`,
  };
}
