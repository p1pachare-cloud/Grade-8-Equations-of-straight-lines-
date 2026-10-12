import { formatEquation, formatStandardForm } from '../engine/lineMath';
import { randInt, shuffle } from '../engine/rng';

export function generateQ8StandardForm(rng) {
  let m = randInt(-3, 3, rng);
  if (m === 0) m = 2;
  const c = randInt(-5, 5, rng);

  const slopeForm = formatEquation(m, c);
  const standardForm = formatStandardForm(m, c);

  // Distractors
  const distractors = [
    standardForm.replace('+', '-'),
    standardForm.replace('-', '+'),
    formatStandardForm(-m, c),
    formatStandardForm(m, -c),
  ];

  const options = shuffle([...new Set([standardForm, ...distractors])], rng).slice(0, 4);

  return {
    type: 'Q8',
    format: 'mcq',
    tags: ['standard_form', 'extension'],
    title: 'Standard Form Ax + By = C',
    text: `Convert the equation ${slopeForm} into standard form Ax + By = C with integer coefficients (where A ≥ 0).`,
    spokenText: `Convert the equation ${slopeForm.replace('=', 'equals')} into standard form A x plus B y equals C.`,
    correctAnswer: standardForm,
    options,
    hint: `Rearrange terms so that x and y terms are on the left side and the constant is on the right side. Ensure A ≥ 0.`,
    explanation: `Starting from ${slopeForm}, move the x term to the left: ${standardForm}.`,
  };
}
