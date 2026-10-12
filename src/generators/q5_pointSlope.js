import { calcYIntercept, formatEquation } from '../engine/lineMath';
import { randInt, shuffle } from '../engine/rng';

export function generateQ5PointSlope(rng) {
  let m = randInt(-3, 3, rng);
  if (m === 0) m = 2;
  const x1 = randInt(-4, 4, rng);
  const y1 = randInt(-4, 4, rng);

  const c = calcYIntercept(x1, y1, m);
  const correct = formatEquation(m, c);

  // Common misconceptions:
  // 1) c = y1 + m * x1 (sign mistake)
  const wrongC1 = y1 + m * x1;
  // 2) forgetting to multiply x1: c = y1
  const wrongC2 = y1;
  // 3) swapping slope sign
  const wrongM = -m;

  const options = shuffle(
    [
      ...new Set([
        correct,
        formatEquation(m, wrongC1),
        formatEquation(m, wrongC2),
        formatEquation(wrongM, c),
      ]),
    ],
    rng
  ).slice(0, 4);

  return {
    type: 'Q5',
    format: 'mcq',
    tags: ['point_slope', m < 0 ? 'fraction_negative' : 'standard'],
    title: 'Point & Slope Form',
    text: `A line has slope m = ${m} and passes through the point (${x1}, ${y1}). What is its equation in the form y = mx + c?`,
    spokenText: `A line has slope ${m} and passes through the point ${x1}, ${y1}. What is its equation?`,
    correctAnswer: correct,
    options,
    point: { x: x1, y: y1 },
    slope: m,
    hint: `Substitute the point into y = mx + c: ${y1} = (${m})(${x1}) + c, then solve for c.`,
    explanation: `Using y = mx + c with (${x1}, ${y1}) and m = ${m}: ${y1} = ${m * x1} + c → c = ${y1} − (${m * x1}) = ${c.toString()}. Thus the equation is ${correct}.`,
  };
}
