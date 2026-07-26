import type { Rational } from "../types";

function assertInteger(value: number, label: string): void {
  if (!Number.isSafeInteger(value)) throw new Error(`${label} must be a safe integer; received ${value}.`);
}

export function gcd(left: number, right: number): number {
  assertInteger(left, "left");
  assertInteger(right, "right");
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b !== 0) [a, b] = [b, a % b];
  return a || 1;
}

export function rational(numerator: number, denominator = 1): Rational {
  assertInteger(numerator, "numerator");
  assertInteger(denominator, "denominator");
  if (denominator === 0) throw new Error("Rational denominator cannot be zero.");
  const sign = denominator < 0 ? -1 : 1;
  const divisor = gcd(numerator, denominator);
  return {
    numerator: sign * (numerator / divisor),
    denominator: Math.abs(denominator / divisor),
  };
}

export function add(left: Rational, right: Rational): Rational {
  return rational(
    left.numerator * right.denominator + right.numerator * left.denominator,
    left.denominator * right.denominator,
  );
}

export function subtract(left: Rational, right: Rational): Rational {
  return rational(
    left.numerator * right.denominator - right.numerator * left.denominator,
    left.denominator * right.denominator,
  );
}

export function multiply(left: Rational, right: Rational): Rational {
  return rational(left.numerator * right.numerator, left.denominator * right.denominator);
}

export function divide(left: Rational, right: Rational): Rational {
  if (right.numerator === 0) throw new Error("Cannot divide by zero.");
  return rational(left.numerator * right.denominator, left.denominator * right.numerator);
}

export function reciprocal(value: Rational): Rational {
  if (value.numerator === 0) throw new Error("Zero has no reciprocal.");
  return rational(value.denominator, value.numerator);
}

export function compare(left: Rational, right: Rational): number {
  return Math.sign(left.numerator * right.denominator - right.numerator * left.denominator);
}

export function equals(left: Rational, right: Rational): boolean {
  return left.numerator === right.numerator && left.denominator === right.denominator;
}

export function isPositive(value: Rational): boolean {
  return value.numerator > 0;
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

export function formatImproperFraction(value: Rational): string {
  if (value.denominator === 1) return String(value.numerator);
  return `${value.numerator}/${value.denominator}`;
}

export function percentOf(value: Rational): Rational {
  return multiply(value, rational(100));
}
