import { calcSlope } from '../engine/lineMath';
import { randInt } from '../engine/rng';
import { generateSlopeDistractors } from './distractors';

export function generateQ2SlopeFromGraph(rng, difficulty = 'easy') {
  let mInt = randInt(-3, 3, rng);
  if (mInt === 0) mInt = 1;
  const c = randInt(-4, 4, rng);

  const x1 = randInt(-4, 0, rng);
  const y1 = mInt * x1 + c;

  const dx = randInt(1, 3, rng);
  const x2 = x1 + dx;
  const y2 = mInt * x2 + c;

  const slope = calcSlope(x1, y1, x2, y2);
  const slopeStr = slope.toString();

  const options = generateSlopeDistractors(slope, rng);

  return {
    type: 'Q2',
    format: 'graph_mcq',
    tags: ['slope', 'graph', slope.n < 0 ? 'fraction_negative' : 'standard'],
    title: 'Slope from Visual Grid',
    text: `A line is drawn on the coordinate plane passing through highlighted points (${x1}, ${y1}) and (${x2}, ${y2}). What is the slope of this line?`,
    spokenText: `A line is drawn on the coordinate plane. What is the slope of this line?`,
    correctAnswer: slopeStr,
    options,
    points: [{ x: x1, y: y1 }, { x: x2, y: y2 }],
    line: { m: slope, c, x1, y1, x2, y2 },
    hint: `Count the vertical change (rise = ${y2 - y1}) and the horizontal change (run = ${x2 - x1}). Slope is rise divided by run.`,
    explanation: `From (${x1}, ${y1}) to (${x2}, ${y2}), rise = ${y2 - y1} and run = ${x2 - x1}. Slope = ${y2 - y1} / ${x2 - x1} = ${slopeStr}.`,
  };
}
