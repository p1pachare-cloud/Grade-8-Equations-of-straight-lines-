import { formatEquation } from '../engine/lineMath';
import { randInt, shuffle } from '../engine/rng';

export function generateQ3ReadSlopeIntercept(rng) {
  let m = randInt(-4, 4, rng);
  if (m === 0) m = 2;
  const c = randInt(-6, 6, rng);

  const eq = formatEquation(m, c);
  const correct = `m = ${m}, c = ${c}`;

  const candidates = [
    `m = ${m}, c = ${c}`,
    `m = ${c}, c = ${m}`,          // swapped misconception
    `m = ${-m}, c = ${c}`,         // sign slip on m
    `m = ${m}, c = ${-c}`,         // sign slip on c
  ];

  const options = shuffle([...new Set(candidates)], rng);

  return {
    type: 'Q3',
    format: 'mcq',
    tags: ['intercept', 'read_equation'],
    title: 'Read Slope & Intercept',
    text: `For the linear equation ${eq}, what are the slope (m) and the y-intercept (c)?`,
    spokenText: `For the linear equation ${eq.replace('=', 'equals')}, what are the slope and the y-intercept?`,
    correctAnswer: correct,
    options,
    hint: `Compare directly with y = mx + c. The coefficient in front of x is the slope m, and the constant term is the y-intercept c.`,
    explanation: `In the equation ${eq}, the number multiplying x is m = ${m}, and the constant is c = ${c}.`,
  };
}
