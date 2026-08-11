import { factor, type Rational } from "./cp003-exam-model";
import { decimal, fractionLatex } from "./cp003-exam-support";

function hasTerminatingDecimal(denominator: bigint): boolean {
  let value = denominator < 0n ? -denominator : denominator;
  while (value % 2n === 0n) value /= 2n;
  while (value % 5n === 0n) value /= 5n;
  return value === 1n;
}

export function groundedAnnualFactorText(ratePercent: Rational): string {
  const annualFactor = factor(ratePercent);
  if (annualFactor.denominator === 1n) return `$${annualFactor.numerator}$`;
  const fraction = fractionLatex(annualFactor);
  if (!hasTerminatingDecimal(annualFactor.denominator)) return `$${fraction}$`;
  return `$${decimal(annualFactor, 6)}= ${fraction}$`;
}
