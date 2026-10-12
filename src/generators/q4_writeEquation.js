import { formatEquation } from '../engine/lineMath';
import { randInt, shuffle } from '../engine/rng';

export function generateQ4WriteEquation(rng, isSpecial = false) {
  if (isSpecial) {
    // Horizontal or vertical line
    const isHorizontal = randInt(0, 1, rng) === 0;
    const val = randInt(-5, 5, rng);
    const correct = isHorizontal ? `y = ${val}` : `x = ${val}`;
    const options = shuffle(
      [
        correct,
        isHorizontal ? `x = ${val}` : `y = ${val}`,
        isHorizontal ? `y = ${-val}` : `x = ${-val}`,
        isHorizontal ? `y = x + ${val}` : `y = -x + ${val}`,
      ],
      rng
    );

    return {
      type: 'Q4',
      format: 'mcq',
      tags: ['equation', 'horizontal_vertical'],
      title: isHorizontal ? 'Horizontal Line' : 'Vertical Line',
      text: isHorizontal
        ? `What is the equation of the horizontal line with zero slope passing through (0, ${val})?`
        : `What is the equation of the vertical line with undefined slope passing through (${val}, 0)?`,
      spokenText: isHorizontal
        ? `What is the equation of the horizontal line passing through the point zero, ${val}?`
        : `What is the equation of the vertical line passing through the point ${val}, zero?`,
      correctAnswer: correct,
      options,
      hint: isHorizontal
        ? 'A horizontal line has slope 0, so y stays constant for every value of x.'
        : 'A vertical line has an undefined slope, so x stays constant for every value of y.',
      explanation: isHorizontal
        ? `Since the line is horizontal and crosses y at ${val}, its equation is y = ${val}.`
        : `Since the line is vertical and passes through x = ${val}, its equation is x = ${val}.`,
    };
  }

  let m = randInt(-3, 3, rng);
  if (m === 0) m = 1;
  const c = randInt(-5, 5, rng);

  const correct = formatEquation(m, c);
  const distractors = [
    formatEquation(c, m),
    formatEquation(-m, c),
    formatEquation(m, -c),
    formatEquation(m + 1, c),
  ];

  const options = shuffle([...new Set([correct, ...distractors])], rng).slice(0, 4);

  return {
    type: 'Q4',
    format: 'mcq',
    tags: ['equation', m < 0 ? 'fraction_negative' : 'standard'],
    title: 'Write Linear Equation',
    text: `A line has slope m = ${m} and y-intercept c = ${c}. What is its equation in the form y = mx + c?`,
    spokenText: `A line has slope ${m} and y-intercept ${c}. What is its equation?`,
    correctAnswer: correct,
    options,
    hint: `Substitute m = ${m} and c = ${c} into the formula y = mx + c.`,
    explanation: `Substituting m = ${m} and c = ${c} directly yields ${correct}.`,
  };
}
