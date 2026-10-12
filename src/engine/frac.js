/**
 * Exact Rational Arithmetic (Frac)
 * Ensures zero rounding error in slope, intercept, and equation checking.
 */

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

export class Frac {
  constructor(n = 0, d = 1) {
    if (d === 0) {
      throw new Error('Denominator cannot be zero');
    }
    if (d < 0) {
      n = -n;
      d = -d;
    }
    const g = gcd(n, d);
    this.n = Math.round(n / g);
    this.d = Math.round(d / g);
    if (this.n === 0) {
      this.d = 1;
    }
  }

  static from(val) {
    if (val instanceof Frac) return val;
    if (typeof val === 'number') {
      if (Number.isInteger(val)) return new Frac(val, 1);
      // convert decimal to fraction with precision up to 1000
      const d = 1000;
      const n = Math.round(val * d);
      return new Frac(n, d);
    }
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed.includes('/')) {
        const [nStr, dStr] = trimmed.split('/');
        const n = parseInt(nStr, 10);
        const d = parseInt(dStr, 10);
        if (!isNaN(n) && !isNaN(d) && d !== 0) {
          return new Frac(n, d);
        }
      }
      const num = parseFloat(trimmed);
      if (!isNaN(num)) return Frac.from(num);
    }
    return new Frac(0, 1);
  }

  add(other) {
    const o = Frac.from(other);
    return new Frac(this.n * o.d + o.n * this.d, this.d * o.d);
  }

  sub(other) {
    const o = Frac.from(other);
    return new Frac(this.n * o.d - o.n * this.d, this.d * o.d);
  }

  mul(other) {
    const o = Frac.from(other);
    return new Frac(this.n * o.n, this.d * o.d);
  }

  div(other) {
    const o = Frac.from(other);
    if (o.n === 0) throw new Error('Division by zero fraction');
    return new Frac(this.n * o.d, this.d * o.n);
  }

  neg() {
    return new Frac(-this.n, this.d);
  }

  reciprocal() {
    if (this.n === 0) throw new Error('Zero has no reciprocal');
    return new Frac(this.d, this.n);
  }

  negativeReciprocal() {
    if (this.n === 0) throw new Error('Zero has no perpendicular slope');
    return new Frac(-this.d, this.n);
  }

  equals(other) {
    const o = Frac.from(other);
    return this.n === o.n && this.d === o.d;
  }

  isZero() {
    return this.n === 0;
  }

  isInteger() {
    return this.d === 1;
  }

  toNumber() {
    return this.n / this.d;
  }

  toString() {
    if (this.d === 1) return `${this.n}`;
    return `${this.n}/${this.d}`;
  }

  toDisplay() {
    if (this.d === 1) return `${this.n}`;
    return `${this.n}/${this.d}`;
  }

  toSpoken() {
    if (this.d === 1) {
      if (this.n < 0) return `negative ${Math.abs(this.n)}`;
      return `${this.n}`;
    }
    const prefix = this.n < 0 ? 'negative ' : '';
    const num = Math.abs(this.n);
    const denMap = { 2: 'half', 3: 'third', 4: 'quarter', 5: 'fifth', 6: 'sixth' };
    const densMap = { 2: 'halves', 3: 'thirds', 4: 'quarters', 5: 'fifths', 6: 'sixths' };
    const denomWord = num === 1 ? (denMap[this.d] || `over ${this.d}`) : (densMap[this.d] || `over ${this.d}`);
    return `${prefix}${num} ${denomWord}`;
  }
}
