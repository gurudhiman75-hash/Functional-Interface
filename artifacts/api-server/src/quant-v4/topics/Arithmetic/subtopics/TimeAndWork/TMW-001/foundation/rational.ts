import type { Rational } from "./types";

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x || 1;
}

export function rational(numerator: number, denominator = 1): Rational {
  if (!Number.isInteger(numerator) || !Number.isInteger(denominator)) throw new Error("Rational values must be integers");
  if (denominator === 0) throw new Error("Rational denominator cannot be zero");
  const sign = denominator < 0 ? -1 : 1;
  const divisor = gcd(numerator, denominator);
  return { numerator: sign * numerator / divisor, denominator: Math.abs(denominator) / divisor };
}

export function add(a: Rational, b: Rational): Rational {
  return rational(a.numerator * b.denominator + b.numerator * a.denominator, a.denominator * b.denominator);
}

export function subtract(a: Rational, b: Rational): Rational {
  return rational(a.numerator * b.denominator - b.numerator * a.denominator, a.denominator * b.denominator);
}

export function multiply(a: Rational, b: Rational): Rational {
  return rational(a.numerator * b.numerator, a.denominator * b.denominator);
}

export function divide(a: Rational, b: Rational): Rational {
  if (b.numerator === 0) throw new Error("Cannot divide by zero");
  return rational(a.numerator * b.denominator, a.denominator * b.numerator);
}

export function reciprocal(value: Rational): Rational {
  if (value.numerator === 0) throw new Error("Zero has no reciprocal");
  return rational(value.denominator, value.numerator);
}

export function compare(a: Rational, b: Rational): number {
  return Math.sign(a.numerator * b.denominator - b.numerator * a.denominator);
}

export function equals(a: Rational, b: Rational): boolean {
  return compare(a, b) === 0;
}

export function toNumber(value: Rational): number {
  return value.numerator / value.denominator;
}

export function formatRational(value: Rational): string {
  if (value.denominator === 1) return String(value.numerator);
  const absolute = Math.abs(value.numerator);
  if (absolute > value.denominator) {
    const whole = Math.trunc(value.numerator / value.denominator);
    const remainder = absolute % value.denominator;
    if (remainder === 0) return String(whole);
    return `${whole} ${remainder}/${value.denominator}`;
  }
  return `${value.numerator}/${value.denominator}`;
}

export function toLatex(value: Rational): string {
  if (value.denominator === 1) return String(value.numerator);
  return `\\frac{${value.numerator}}{${value.denominator}}`;
}
