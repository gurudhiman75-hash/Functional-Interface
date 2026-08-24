import { formatRational, rational, type Rational } from "./rational";
import { formatRationalExponent, type RationalExponent } from "./rational-exponent";
import type { SquareSurd } from "./square-surd";
import type { SurdSum } from "./surd-sum";

export function formatRationalLatex(value: Rational): string {
  if (value.denominator === 1n) return value.numerator.toString();
  return `\\frac{${value.numerator}}{${value.denominator}}`;
}

export function formatExponentLatex(value: RationalExponent): string {
  if (value.denominator === 1n) return value.numerator.toString();
  return `\\frac{${value.numerator}}{${value.denominator}}`;
}

export function formatPowerLatex(base: string | bigint | number, exponent: RationalExponent): string {
  return `${base}^{${formatExponentLatex(exponent)}}`;
}

export function formatSquareSurdLatex(value: SquareSurd): string {
  if (value.coefficient.numerator === 0n) return "0";
  if (value.radicand === 1n) return formatRationalLatex(value.coefficient);
  const coefficient = value.coefficient;
  const absoluteCoefficient = rational(coefficient.numerator < 0n ? -coefficient.numerator : coefficient.numerator, coefficient.denominator);
  const sign = coefficient.numerator < 0n ? "-" : "";
  const coefficientText = absoluteCoefficient.numerator === absoluteCoefficient.denominator
    ? ""
    : absoluteCoefficient.denominator === 1n
      ? absoluteCoefficient.numerator.toString()
      : `\\frac{${absoluteCoefficient.numerator}}{${absoluteCoefficient.denominator}}`;
  return `${sign}${coefficientText}\\sqrt{${value.radicand}}`;
}

export function formatSurdSumLatex(value: SurdSum): string {
  if (value.terms.length === 0) return "0";
  return value.terms.map((term, index) => {
    const rendered = formatSquareSurdLatex(term);
    if (index === 0) return rendered;
    return rendered.startsWith("-") ? `- ${rendered.slice(1)}` : `+ ${rendered}`;
  }).join(" ");
}

export function formatRationalDebug(value: Rational): string {
  return formatRational(value);
}

export function formatExponentDebug(value: RationalExponent): string {
  return formatRationalExponent(value);
}
