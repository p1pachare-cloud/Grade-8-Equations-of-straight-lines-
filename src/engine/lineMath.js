import { Frac } from './frac';

/**
 * Calculates slope between (x1, y1) and (x2, y2).
 * Returns Frac instance, or null if vertical (undefined slope).
 */
export function calcSlope(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  if (dx === 0) return null; // vertical line, undefined slope
  return new Frac(dy, dx);
}

/**
 * Calculates y-intercept c = y1 - m * x1 given point and slope.
 */
export function calcYIntercept(x, y, m) {
  if (m === null) return null; // vertical line has no y-intercept (unless x=0)
  const slope = Frac.from(m);
  return new Frac(y, 1).sub(slope.mul(new Frac(x, 1)));
}

/**
 * Formats y = mx + c into a clean standard string:
 * e.g., 'y = 2x + 3', 'y = -x - 4', 'y = 3', 'x = 5'
 */
export function formatEquation(m, c, isVertical = false, xVal = 0) {
  if (isVertical) {
    return `x = ${xVal}`;
  }
  const slope = Frac.from(m);
  const intercept = Frac.from(c);

  if (slope.isZero()) {
    return `y = ${intercept.toString()}`;
  }

  let slopePart = '';
  if (slope.equals(new Frac(1, 1))) {
    slopePart = 'x';
  } else if (slope.equals(new Frac(-1, 1))) {
    slopePart = '-x';
  } else {
    slopePart = `${slope.toString()}x`;
  }

  if (intercept.isZero()) {
    return `y = ${slopePart}`;
  }

  if (intercept.n > 0) {
    return `y = ${slopePart} + ${intercept.toString()}`;
  } else {
    return `y = ${slopePart} - ${Math.abs(intercept.n)}${intercept.d > 1 ? `/${intercept.d}` : ''}`;
  }
}

/**
 * Formats Standard Form Ax + By = C with integer coefficients and A >= 0.
 */
export function formatStandardForm(m, c) {
  const slope = Frac.from(m);
  const intercept = Frac.from(c);
  // y = (n/d)x + (cn/cd)
  // Multiply by common denominator
  const L = slope.d * intercept.d;
  // L * y = (slope.n * intercept.d) * x + (intercept.n * slope.d)
  // -(slope.n * intercept.d) * x + L * y = (intercept.n * slope.d)
  let A = -slope.n * intercept.d;
  let B = L;
  let C = intercept.n * slope.d;

  if (A < 0) {
    A = -A;
    B = -B;
    C = -C;
  }
  const gcd3 = (a, b) => {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { const t = b; b = a % b; a = t; }
    return a;
  };
  const g = gcd3(gcd3(A, B), C);
  if (g > 1) {
    A /= g; B /= g; C /= g;
  }

  let left = '';
  if (A === 1) left += 'x';
  else if (A > 1) left += `${A}x`;

  if (B !== 0) {
    if (A !== 0) {
      if (B === 1) left += ' + y';
      else if (B === -1) left += ' - y';
      else if (B > 0) left += ` + ${B}y`;
      else left += ` - ${Math.abs(B)}y`;
    } else {
      if (B === 1) left += 'y';
      else if (B === -1) left += '-y';
      else left += `${B}y`;
    }
  }

  return `${left} = ${C}`;
}

/**
 * Tests if point (x, y) lies on line y = mx + c.
 */
export function isPointOnLine(x, y, m, c, isVertical = false, xVal = 0) {
  if (isVertical) return x === xVal;
  const slope = Frac.from(m);
  const intercept = Frac.from(c);
  const expectedY = slope.mul(new Frac(x, 1)).add(intercept);
  return expectedY.equals(new Frac(y, 1));
}

/**
 * Canonical equation parser to test equivalence.
 * Checks whether user input matches the target line equation.
 */
export function checkEquationEquivalence(userInput, targetM, targetC, isVertical = false, xVal = 0) {
  if (!userInput) return false;
  const clean = userInput.replace(/\s+/g, '').toLowerCase();

  if (isVertical) {
    return clean === `x=${xVal}` || clean === `x-${xVal}=0`;
  }

  const targetSlope = Frac.from(targetM);
  const targetIntercept = Frac.from(targetC);

  // Test with two test points x=0 and x=4
  const testPoints = [
    { x: 0, y: targetIntercept.toNumber() },
    { x: 4, y: targetSlope.mul(new Frac(4, 1)).add(targetIntercept).toNumber() },
  ];

  // Try direct string patterns
  const expectedStr = formatEquation(targetM, targetC).replace(/\s+/g, '').toLowerCase();
  if (clean === expectedStr) return true;

  // Pattern y = mx + c or y = c + mx
  const eqSplit = clean.split('=');
  if (eqSplit.length !== 2) return false;

  const [left, right] = eqSplit;

  // Evaluator function for simple expressions of x and y
  const evaluate = (expr, x, y) => {
    let replaced = expr
      .replace(/(\d+)x/g, '($1*$2)')
      .replace(/x/g, `(${x})`)
      .replace(/(\d+)y/g, '($1*$2)')
      .replace(/y/g, `(${y})`);
    try {
      // safe eval with numbers and basic operators only
      if (!/^[\d\.\+\-\*\/\(\)\s]+$/.test(replaced)) return NaN;
      // eslint-disable-next-line no-new-func
      return Function(`"use strict"; return (${replaced});`)();
    } catch {
      return NaN;
    }
  };

  for (const pt of testPoints) {
    const lVal = evaluate(left, pt.x, pt.y);
    const rVal = evaluate(right, pt.x, pt.y);
    if (isNaN(lVal) || isNaN(rVal) || Math.abs(lVal - rVal) > 0.0001) {
      return false;
    }
  }

  return true;
}
