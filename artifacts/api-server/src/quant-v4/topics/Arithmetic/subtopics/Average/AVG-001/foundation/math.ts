import type { Avg001DisplayPolicy, Rational } from "./types";

function assertInteger(value: number, label: string) {
  if (!Number.isSafeInteger(value)) throw new Error(`${label} must be a safe integer`);
}

export function gcd(a: number, b: number) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

export function rational(numerator: number, denominator = 1): Rational {
  assertInteger(numerator, "numerator");
  assertInteger(denominator, "denominator");
  if (!denominator) throw new Error("denominator must not be zero");
  const sign = denominator < 0 ? -1 : 1;
  const divisor = gcd(numerator, denominator);
  return {
    numerator: (sign * numerator) / divisor,
    denominator: Math.abs(denominator) / divisor,
  };
}

export function add(a: Rational, b: Rational) {
  return rational(
    a.numerator * b.denominator + b.numerator * a.denominator,
    a.denominator * b.denominator,
  );
}

export function subtract(a: Rational, b: Rational) {
  return rational(
    a.numerator * b.denominator - b.numerator * a.denominator,
    a.denominator * b.denominator,
  );
}

export function multiply(a: Rational, b: Rational) {
  return rational(a.numerator * b.numerator, a.denominator * b.denominator);
}

export function divide(a: Rational, b: Rational) {
  if (!b.numerator) throw new Error("division by zero");
  return rational(a.numerator * b.denominator, a.denominator * b.numerator);
}

export function equals(a: Rational, b: Rational) {
  return a.numerator === b.numerator && a.denominator === b.denominator;
}

export function isInteger(a: Rational) {
  return a.denominator === 1;
}

export function toNumber(a: Rational) {
  return a.numerator / a.denominator;
}

export function formatRational(value: Rational, policy: Avg001DisplayPolicy): string {
  if (policy === "EXACT_INTEGER") {
    if (!isInteger(value)) {
      throw new Error(`Expected integer, got ${value.numerator}/${value.denominator}`);
    }
    return String(value.numerator);
  }
  if (policy === "EXACT_FRACTION") {
    return isInteger(value)
      ? String(value.numerator)
      : `${value.numerator}/${value.denominator}`;
  }
  const places = policy === "EXACT_DECIMAL_1" ? 1 : 2;
  const scaled = (value.numerator * 10 ** places) / value.denominator;
  if (!Number.isInteger(scaled)) {
    throw new Error(
      `Value ${value.numerator}/${value.denominator} is not exact at ${places} decimal places`,
    );
  }
  return (scaled / 10 ** places).toFixed(places);
}

export function latex(value: Rational) {
  return isInteger(value)
    ? String(value.numerator)
    : `\\frac{${value.numerator}}{${value.denominator}}`;
}
