export interface Rational {
  numerator: bigint;
  denominator: bigint;
}

function abs(value: bigint): bigint {
  return value < 0n ? -value : value;
}

function gcd(a: bigint, b: bigint): bigint {
  let x = abs(a);
  let y = abs(b);
  while (y !== 0n) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x === 0n ? 1n : x;
}

export function rational(numerator: bigint | number, denominator: bigint | number = 1n): Rational {
  let n = BigInt(numerator);
  let d = BigInt(denominator);
  if (d === 0n) throw new Error("Rational denominator cannot be zero");
  if (n === 0n) return { numerator: 0n, denominator: 1n };
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  const divisor = gcd(n, d);
  return { numerator: n / divisor, denominator: d / divisor };
}

export const ZERO = rational(0n);
export const ONE = rational(1n);
export const TWO = rational(2n);

export function addRational(a: Rational, b: Rational): Rational {
  return rational(a.numerator * b.denominator + b.numerator * a.denominator, a.denominator * b.denominator);
}

export function subtractRational(a: Rational, b: Rational): Rational {
  return rational(a.numerator * b.denominator - b.numerator * a.denominator, a.denominator * b.denominator);
}

export function multiplyRational(a: Rational, b: Rational): Rational {
  return rational(a.numerator * b.numerator, a.denominator * b.denominator);
}

export function divideRational(a: Rational, b: Rational): Rational {
  if (b.numerator === 0n) throw new Error("Cannot divide by zero");
  return rational(a.numerator * b.denominator, a.denominator * b.numerator);
}

export function negateRational(value: Rational): Rational {
  return rational(-value.numerator, value.denominator);
}

export function reciprocalRational(value: Rational): Rational {
  if (value.numerator === 0n) throw new Error("Zero has no reciprocal");
  return rational(value.denominator, value.numerator);
}

export function compareRational(a: Rational, b: Rational): -1 | 0 | 1 {
  const difference = a.numerator * b.denominator - b.numerator * a.denominator;
  return difference < 0n ? -1 : difference > 0n ? 1 : 0;
}

export function equalsRational(a: Rational, b: Rational): boolean {
  return compareRational(a, b) === 0;
}

export function isZeroRational(value: Rational): boolean {
  return value.numerator === 0n;
}

export function isIntegerRational(value: Rational): boolean {
  return value.denominator === 1n;
}

export function absRational(value: Rational): Rational {
  return rational(abs(value.numerator), value.denominator);
}

export function powRational(value: Rational, exponent: number): Rational {
  if (!Number.isInteger(exponent) || exponent < 0) throw new Error("Rational exponent must be a non-negative integer");
  if (exponent === 0) return ONE;
  let base = value;
  let power = exponent;
  let result = ONE;
  while (power > 0) {
    if (power % 2 === 1) result = multiplyRational(result, base);
    power = Math.floor(power / 2);
    if (power > 0) base = multiplyRational(base, base);
  }
  return result;
}

export function rationalKey(value: Rational): string {
  return `${value.numerator}/${value.denominator}`;
}

export function formatRational(value: Rational): string {
  if (value.denominator === 1n) return value.numerator.toString();
  return `${value.numerator}/${value.denominator}`;
}
