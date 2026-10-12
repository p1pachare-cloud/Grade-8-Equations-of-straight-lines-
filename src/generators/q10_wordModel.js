import { randInt, pick, shuffle } from '../engine/rng';
import { CHARACTER_NAMES, CITIES_AND_CURRENCIES, REAL_WORLD_CONTEXTS } from '../data/namesAndPlaces';

export function generateQ10WordModel(rng) {
  const name = pick(CHARACTER_NAMES, rng);
  const place = pick(CITIES_AND_CURRENCIES, rng);
  const ctx = pick(REAL_WORLD_CONTEXTS, rng);

  const baseRate = randInt(10, 40, rng);
  const hourlyRate = randInt(5, 15, rng);
  const hours = randInt(2, 5, rng);

  const totalCost = hourlyRate * hours + baseRate;
  const correct = `${totalCost} ${place.currency}`;

  const wrong1 = `${(hourlyRate + 2) * hours + baseRate} ${place.currency}`;
  const wrong2 = `${hourlyRate * hours} ${place.currency}`; // forgot base rate
  const wrong3 = `${hourlyRate * (hours + 1) + baseRate} ${place.currency}`;

  const options = shuffle([...new Set([correct, wrong1, wrong2, wrong3])], rng).slice(0, 4);

  return {
    type: 'Q10',
    format: 'mcq',
    tags: ['linear_model', 'real_world'],
    title: 'Linear Model in Real Life',
    text: `${name} in ${place.city} ${ctx.intro} with ${ctx.baseText} ${baseRate} ${place.currency} plus ${hourlyRate} ${place.currency} ${ctx.rateText}. What is the total ${ctx.yUnit} for ${hours} ${ctx.xUnit}?`,
    spokenText: `${name} in ${place.city} pays a base fee of ${baseRate} plus ${hourlyRate} per unit. What is the total after ${hours} units?`,
    correctAnswer: correct,
    options,
    hint: `Write the linear model: y = ${hourlyRate}x + ${baseRate}, then evaluate for x = ${hours}.`,
    explanation: `The linear equation is y = ${hourlyRate}x + ${baseRate}. When x = ${hours}, y = (${hourlyRate} × ${hours}) + ${baseRate} = ${hourlyRate * hours} + ${baseRate} = ${totalCost} ${place.currency}.`,
  };
}
