export interface Rational {
  readonly numerator: bigint;
  readonly denominator: bigint;
}

export interface ExactAngle extends Rational {
  readonly unit: "DEGREE";
}

const ZERO: Rational = Object.freeze({ numerator: 0n, denominator: 1n });
const ONE: Rational = Object.freeze({ numerator: 1n, denominator: 1n });

function absBigInt(value: bigint): bigint {
  return value < 0n ? -value : value;
}

export function gcdBigInt(a: bigint, b: bigint): bigint {
  let x = absBigInt(a);
  let y = absBigInt(b);
  while (y !== 0n) {
    const remainder = x % y;
    x = y;
    y = remainder;
  }
  return x === 0n ? 1n : x;
}

export function rational(
  numerator: bigint | number,
  denominator: bigint | number = 1n,
): Rational {
  const n = typeof numerator === "number" ? BigInt(numerator) : numerator;
  const d = typeof denominator === "number" ? BigInt(denominator) : denominator;
  if (d === 0n) throw new Error("Rational denominator cannot be zero");
  if (n === 0n) return ZERO;
  const divisor = gcdBigInt(n, d);
  const sign = d < 0n ? -1n : 1n;
  return Object.freeze({
    numerator: sign * (n / divisor),
    denominator: absBigInt(d / divisor),
  });
}

export function angle(
  numerator: bigint | number,
  denominator: bigint | number = 1n,
): ExactAngle {
  const value = rational(numerator, denominator);
  return Object.freeze({ ...value, unit: "DEGREE" as const });
}

export function add(a: Rational, b: Rational): Rational {
  return rational(
    a.numerator * b.denominator + b.numerator * a.denominator,
    a.denominator * b.denominator,
  );
}

export function negate(value: Rational): Rational {
  return rational(-value.numerator, value.denominator);
}

export function subtract(a: Rational, b: Rational): Rational {
  return add(a, negate(b));
}

export function multiply(a: Rational, b: Rational): Rational {
  return rational(a.numerator * b.numerator, a.denominator * b.denominator);
}

export function divide(a: Rational, b: Rational): Rational {
  if (b.numerator === 0n) throw new Error("Cannot divide by zero");
  return rational(a.numerator * b.denominator, a.denominator * b.numerator);
}

export function square(value: Rational): Rational {
  return multiply(value, value);
}

export function absRational(value: Rational): Rational {
  return rational(absBigInt(value.numerator), value.denominator);
}

export function compare(a: Rational, b: Rational): -1 | 0 | 1 {
  const delta = a.numerator * b.denominator - b.numerator * a.denominator;
  return delta < 0n ? -1 : delta > 0n ? 1 : 0;
}

export function equals(a: Rational, b: Rational): boolean {
  return a.numerator === b.numerator && a.denominator === b.denominator;
}

export function isZero(value: Rational): boolean {
  return value.numerator === 0n;
}

export function isPositive(value: Rational): boolean {
  return value.numerator > 0n;
}

export function toNumber(value: Rational): number {
  return Number(value.numerator) / Number(value.denominator);
}

export function toCanonicalString(value: Rational): string {
  return `${value.numerator}/${value.denominator}`;
}

export function sum(values: readonly Rational[]): Rational {
  return values.reduce<Rational>((total, value) => add(total, value), ZERO);
}

export const RATIONAL_ZERO = ZERO;
export const RATIONAL_ONE = ONE;
export const ANGLE_180 = angle(180);
export const ANGLE_360 = angle(360);
