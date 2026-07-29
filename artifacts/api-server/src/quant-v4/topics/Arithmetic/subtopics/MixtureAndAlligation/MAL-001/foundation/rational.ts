import type { Rational } from "./types";

function abs(value: bigint): bigint {
  return value < 0n ? -value : value;
}

function gcd(a: bigint, b: bigint): bigint {
  let x = abs(a);
  let y = abs(b);
  while (y !== 0n) {
    const remainder = x % y;
    x = y;
    y = remainder;
  }
  return x === 0n ? 1n : x;
}

function lcm(a: bigint, b: bigint): bigint {
  return abs((a / gcd(a, b)) * b);
}

export function rational(numerator: bigint | number, denominator: bigint | number = 1): Rational {
  const n = BigInt(numerator);
  const d = BigInt(denominator);
  if (d === 0n) throw new Error("Rational denominator cannot be zero.");
  const sign = d < 0n ? -1n : 1n;
  const divisor = gcd(n, d);
  return {
    numerator: (n / divisor) * sign,
    denominator: abs(d / divisor),
  };
}

export function addRational(a: Rational, b: Rational): Rational {
  return rational(
    a.numerator * b.denominator + b.numerator * a.denominator,
    a.denominator * b.denominator,
  );
}

export function subtractRational(a: Rational, b: Rational): Rational {
  return rational(
    a.numerator * b.denominator - b.numerator * a.denominator,
    a.denominator * b.denominator,
  );
}

export function multiplyRational(a: Rational, b: Rational): Rational {
  return rational(a.numerator * b.numerator, a.denominator * b.denominator);
}

export function divideRational(a: Rational, b: Rational): Rational {
  if (b.numerator === 0n) throw new Error("Cannot divide by zero.");
  return rational(a.numerator * b.denominator, a.denominator * b.numerator);
}

export function negateRational(value: Rational): Rational {
  return rational(-value.numerator, value.denominator);
}

export function absoluteRational(value: Rational): Rational {
  return rational(abs(value.numerator), value.denominator);
}

export function compareRational(a: Rational, b: Rational): -1 | 0 | 1 {
  const left = a.numerator * b.denominator;
  const right = b.numerator * a.denominator;
  return left < right ? -1 : left > right ? 1 : 0;
}

export function equalsRational(a: Rational, b: Rational): boolean {
  return compareRational(a, b) === 0;
}

export function isPositiveRational(value: Rational): boolean {
  return value.numerator > 0n;
}

export function isWholeRational(value: Rational): boolean {
  return value.denominator === 1n;
}

export function sumRationals(values: readonly Rational[]): Rational {
  return values.reduce(addRational, rational(0));
}

export function rationalKey(value: Rational): string {
  return `${value.numerator}/${value.denominator}`;
}

export function rationalToNumber(value: Rational): number {
  return Number(value.numerator) / Number(value.denominator);
}

export function formatRational(value: Rational): string {
  if (value.denominator === 1n) return String(value.numerator);
  const sign = value.numerator < 0n ? "-" : "";
  const numerator = abs(value.numerator);
  if (numerator > value.denominator) {
    const whole = numerator / value.denominator;
    const remainder = numerator % value.denominator;
    return remainder === 0n
      ? `${sign}${whole}`
      : `${sign}${whole} ${remainder}/${value.denominator}`;
  }
  return `${sign}${numerator}/${value.denominator}`;
}

export function toLatex(value: Rational): string {
  if (value.denominator === 1n) return String(value.numerator);
  const sign = value.numerator < 0n ? "-" : "";
  return `${sign}\\frac{${abs(value.numerator)}}{${value.denominator}}`;
}

export function reduceRationalRatio(first: Rational, second: Rational): [Rational, Rational] {
  if (!isPositiveRational(first) || !isPositiveRational(second)) {
    throw new Error("Ratio parts must be positive.");
  }
  const commonDenominator = lcm(first.denominator, second.denominator);
  const firstInteger = first.numerator * (commonDenominator / first.denominator);
  const secondInteger = second.numerator * (commonDenominator / second.denominator);
  const divisor = gcd(firstInteger, secondInteger);
  return [rational(firstInteger / divisor), rational(secondInteger / divisor)];
}
