import { mulberry32, shuffle } from '../engine/rng';
import { generateQ1SlopeFromPoints } from './q1_slopeFromPoints';
import { generateQ2SlopeFromGraph } from './q2_slopeFromGraph';
import { generateQ3ReadSlopeIntercept } from './q3_readSlopeIntercept';
import { generateQ4WriteEquation } from './q4_writeEquation';
import { generateQ5PointSlope } from './q5_pointSlope';
import { generateQ6TwoPoints } from './q6_twoPoints';
import { generateQ7PointOnLine } from './q7_pointOnLine';
import { generateQ8StandardForm } from './q8_standardForm';
import { generateQ9ParallelPerpendicular } from './q9_parallelPerpendicular';
import { generateQ10WordModel } from './q10_wordModel';

const WORLD_BLUEPRINTS = [
  // World 1: London (3 Q1, 4 Q2, 3 Q3)
  [
    ...Array(3).fill('Q1'),
    ...Array(4).fill('Q2'),
    ...Array(3).fill('Q3'),
  ],
  // World 2: New York (4 Q1, 3 Q2, 3 Q3)
  [
    ...Array(4).fill('Q1'),
    ...Array(3).fill('Q2'),
    ...Array(3).fill('Q3'),
  ],
  // World 3: Paris (1 Q2, 4 Q3, 3 Q4, 2 Q7)
  [
    'Q2',
    ...Array(4).fill('Q3'),
    ...Array(3).fill('Q4'),
    ...Array(2).fill('Q7'),
  ],
  // World 4: Tokyo (3 Q3, 4 Q4, 3 Q7)
  [
    ...Array(3).fill('Q3'),
    ...Array(4).fill('Q4'),
    ...Array(3).fill('Q7'),
  ],
  // World 5: Sydney (1 Q3, 3 Q4, 2 Q7, 4 Q10)
  [
    'Q3',
    ...Array(3).fill('Q4'),
    ...Array(2).fill('Q7'),
    ...Array(4).fill('Q10'),
  ],
  // World 6: Cairo (1 Q1, 2 Q4, 5 Q5, 2 Q7)
  [
    'Q1',
    ...Array(2).fill('Q4'),
    ...Array(5).fill('Q5'),
    ...Array(2).fill('Q7'),
  ],
  // World 7: Rio de Janeiro (2 Q1, 2 Q5, 5 Q6, 1 Q7)
  [
    ...Array(2).fill('Q1'),
    ...Array(2).fill('Q5'),
    ...Array(5).fill('Q6'),
    'Q7',
  ],
  // World 8: Cape Town (1 Q3, 1 Q6, 2 Q7, 6 Q8)
  [
    'Q3',
    'Q6',
    ...Array(2).fill('Q7'),
    ...Array(6).fill('Q8'),
  ],
  // World 9: Mumbai (1 Q1, 1 Q4, 2 Q6, 6 Q9)
  [
    'Q1',
    'Q4',
    ...Array(2).fill('Q6'),
    ...Array(6).fill('Q9'),
  ],
  // World 10: Reykjavik (1 Q4, 1 Q5, 2 Q6, 1 Q8, 2 Q9, 3 Q10)
  [
    'Q4',
    'Q5',
    ...Array(2).fill('Q6'),
    'Q8',
    ...Array(2).fill('Q9'),
    ...Array(3).fill('Q10'),
  ],
];

export function buildSession(seed = Date.now()) {
  const rng = mulberry32(seed & 0xffffffff);
  const all100Questions = [];

  WORLD_BLUEPRINTS.forEach((types, worldIndex) => {
    const shuffledTypes = shuffle(types, rng);
    shuffledTypes.forEach((type, slotIndex) => {
      let q;
      switch (type) {
        case 'Q1':
          q = generateQ1SlopeFromPoints(rng, worldIndex < 2 ? 'easy' : 'medium');
          break;
        case 'Q2':
          q = generateQ2SlopeFromGraph(rng, worldIndex < 2 ? 'easy' : 'medium');
          break;
        case 'Q3':
          q = generateQ3ReadSlopeIntercept(rng);
          break;
        case 'Q4':
          // World 10 has special vertical/horizontal lines
          q = generateQ4WriteEquation(rng, worldIndex === 9 && slotIndex === 0);
          break;
        case 'Q5':
          q = generateQ5PointSlope(rng);
          break;
        case 'Q6':
          q = generateQ6TwoPoints(rng);
          break;
        case 'Q7':
          q = generateQ7PointOnLine(rng);
          break;
        case 'Q8':
          q = generateQ8StandardForm(rng);
          break;
        case 'Q9':
          q = generateQ9ParallelPerpendicular(rng);
          break;
        case 'Q10':
        default:
          q = generateQ10WordModel(rng);
          break;
      }
      q.id = `w${worldIndex + 1}_s${slotIndex + 1}_${Date.now()}_${Math.floor(rng() * 1000)}`;
      q.worldIndex = worldIndex;
      q.slotIndex = slotIndex;
      all100Questions.push(q);
    });
  });

  return all100Questions;
}
