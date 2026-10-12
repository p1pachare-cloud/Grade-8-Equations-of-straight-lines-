import { Frac } from '../engine/frac';
import { calcYIntercept, formatEquation } from '../engine/lineMath';
import { randInt, shuffle } from '../engine/rng';

export function generateQ9ParallelPerpendicular(rng) {
  const isPerp = randInt(0, 1, rng) === 1;
  const m1 = randInt(1, 3, rng) * (randInt(0, 1, rng) === 0 ? 1 : -1);
  const c1 = randInt(-4, 4, rng);
  const baseLine = formatEquation(m1, c1);

  const x0 = randInt(-3, 3, rng);
  const y0 = randInt(-3, 3, rng);

  let targetSlope;
  if (isPerp) {
    // negative reciprocal: -1 / m1
    targetSlope = new Frac(-1, m1);
  } else {
    // same slope: m1
    targetSlope = new Frac(m1, 1);
  }

  const targetC = calcYIntercept(x0, y0, targetSlope);
  const correct = formatEquation(targetSlope, targetC);

  const wrongSlope = isPerp ? new Frac(m1, 1) : new Frac(-1, m1);
  const wrongEq1 = formatEquation(wrongSlope, targetC);
  const wrongEq2 = formatEquation(targetSlope, targetC.add(new Frac(2, 1)));
  const wrongEq3 = formatEquation(targetSlope.neg(), targetC);

  const options = shuffle([...new Set([correct, wrongEq1, wrongEq2, wrongEq3])], rng).slice(0, 4);

  return {
    type: 'Q9',
    format: 'mcq',
    tags: ['parallel_perpendicular', 'extension', isPerp ? 'fraction_negative' : 'standard'],
    title: isPerp ? 'Perpendicular Line Equation' : 'Parallel Line Equation',
    text: isPerp
      ? `Find the equation of the line perpendicular to ${baseLine} that passes through the point (${x0}, ${y0}).`
      : `Find the equation of the line parallel to ${baseLine} that passes through the point (${x0}, ${y0}).`,
    spokenText: isPerp
      ? `Find the equation of the line perpendicular to ${baseLine.replace('=', 'equals')} through ${x0}, ${y0}.`
      : `Find the equation of the line parallel to ${baseLine.replace('=', 'equals')} through ${x0}, ${y0}.`,
    correctAnswer: correct,
    options,
    hint: isPerp
      ? `Perpendicular lines have negative reciprocal slopes: m₂ = −1 / m₁ = −1 / (${m1}) = ${targetSlope.toString()}. Then substitute (${x0}, ${y0}) to find c.`
      : `Parallel lines have identical slopes: m₂ = m₁ = ${m1}. Then substitute (${x0}, ${y0}) into y = mx + c.`,
    explanation: isPerp
      ? `The slope of ${baseLine} is ${m1}. The perpendicular slope is −1 / (${m1}) = ${targetSlope.toString()}. Substituting (${x0}, ${y0}) gives c = ${targetC.toString()}, so the line is ${correct}.`
      : `The slope of ${baseLine} is ${m1}. A parallel line has the exact same slope ${m1}. Substituting (${x0}, ${y0}) gives c = ${targetC.toString()}, so the line is ${correct}.`,
  };
}
