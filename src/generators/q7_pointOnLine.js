import { formatEquation } from '../engine/lineMath';
import { randInt, shuffle } from '../engine/rng';

export function generateQ7PointOnLine(rng) {
  const isFindK = randInt(0, 1, rng) === 0;
  let m = randInt(-3, 3, rng);
  if (m === 0) m = 2;
  const c = randInt(-4, 4, rng);
  const eq = formatEquation(m, c);

  if (isFindK) {
    const xVal = randInt(-3, 3, rng);
    const correctK = m * xVal + c;
    const options = shuffle(
      [
        String(correctK),
        String(correctK + 2),
        String(correctK - 2),
        String(-correctK),
      ],
      rng
    );

    return {
      type: 'Q7',
      format: 'mcq',
      tags: ['point_on_line', 'solve_k'],
      title: 'Find Missing Coordinate',
      text: `The point (${xVal}, k) lies on the line ${eq}. What is the value of k?`,
      spokenText: `The point ${xVal}, k lies on the line ${eq.replace('=', 'equals')}. What is the value of k?`,
      correctAnswer: String(correctK),
      options,
      hint: `Substitute x = ${xVal} into the line equation and calculate y.`,
      explanation: `Substitute x = ${xVal}: k = (${m})(${xVal}) + (${c}) = ${m * xVal + c} = ${correctK}.`,
    };
  }

  // True / False check
  const xVal = randInt(-3, 3, rng);
  const actuallyOnLine = randInt(0, 1, rng) === 1;
  const yVal = actuallyOnLine ? m * xVal + c : m * xVal + c + (randInt(0, 1, rng) === 0 ? 1 : -1);

  return {
    type: 'Q7',
    format: 'mcq',
    tags: ['point_on_line', 'true_false'],
    title: 'Check Point on Line',
    text: `Does the point (${xVal}, ${yVal}) lie on the line ${eq}?`,
    spokenText: `Does the point ${xVal}, ${yVal} lie on the line ${eq.replace('=', 'equals')}?`,
    correctAnswer: actuallyOnLine ? 'Yes' : 'No',
    options: ['Yes', 'No'],
    hint: `Substitute x = ${xVal} and check if y equals ${yVal}.`,
    explanation: `When x = ${xVal}, y = (${m})(${xVal}) + (${c}) = ${m * xVal + c}. Since ${yVal} ${
      actuallyOnLine ? '==' : '≠'
    } ${m * xVal + c}, the answer is ${actuallyOnLine ? 'Yes' : 'No'}.`,
  };
}
