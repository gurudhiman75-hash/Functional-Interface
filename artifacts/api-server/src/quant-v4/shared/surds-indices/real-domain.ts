import { compareRational, rational, type Rational } from "./rational";
import { rationalExponent, type RationalExponent } from "./rational-exponent";

export interface DomainCheck {
  readonly valid: boolean;
  readonly reason: string;
}

export function validateRationalPowerDomain(base: Rational, exponent: RationalExponent): DomainCheck {
  const e = rationalExponent(exponent.numerator, exponent.denominator);
  if (e.numerator === 0n && base.numerator === 0n) return { valid: false, reason: "0^0 is undefined" };
  if (e.numerator < 0n && base.numerator === 0n) return { valid: false, reason: "negative exponent requires a non-zero base" };
  if (base.numerator < 0n && e.denominator % 2n === 0n) return { valid: false, reason: "negative base has no real even-denominator rational power" };
  return { valid: true, reason: "real-domain conditions satisfied" };
}

export function validateRadicandDomain(value: Rational, rootIndex: number): DomainCheck {
  if (!Number.isInteger(rootIndex) || rootIndex < 2) return { valid: false, reason: "root index must be an integer >= 2" };
  if (rootIndex % 2 === 0 && compareRational(value, rational(0n)) < 0) return { valid: false, reason: "even root requires a non-negative radicand" };
  return { valid: true, reason: "radicand is admissible in the real numbers" };
}

export function requireNonZero(value: Rational, context = "value"): void {
  if (value.numerator === 0n) throw new Error(`${context} must be non-zero`);
}

export function requireDomain(check: DomainCheck): void {
  if (!check.valid) throw new Error(check.reason);
}
