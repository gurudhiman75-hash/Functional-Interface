import type { ExactAngle, Rational } from "./exact";

export function formatRational(value: Rational): string {
  if (value.denominator === 1n) return String(value.numerator);
  return `${value.numerator}/${value.denominator}`;
}

export function formatAngle(value: ExactAngle): string {
  return `${formatRational(value)}°`;
}
