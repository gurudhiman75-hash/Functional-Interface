import type { FractionInput, MixedFractionInput, NsFracdec001MathJaxFields, RationalToken } from "./types";

export const NS_FRACDEC_001_MATHJAX_KEYS = [
  "fractionReductionLatex",
  "mixedFractionConversionLatex",
  "fractionArithmeticLatex",
  "comparisonWorkingLatex",
  "fractionToDecimalLatex",
  "decimalToFractionLatex",
  "recurringDecimalConversionLatex",
  "terminatingCheckLatex",
  "fractionHcfLcmLatex",
] as const;

export const EMPTY_FRACDEC_MATHJAX: NsFracdec001MathJaxFields = {
  fractionReductionLatex: "",
  mixedFractionConversionLatex: "",
  fractionArithmeticLatex: "",
  comparisonWorkingLatex: "",
  fractionToDecimalLatex: "",
  decimalToFractionLatex: "",
  recurringDecimalConversionLatex: "",
  terminatingCheckLatex: "",
  fractionHcfLcmLatex: "",
};

export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x || 1;
}

export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

export function simplifyFraction(fraction: FractionInput): FractionInput {
  if (fraction.denominator === 0) throw new Error("Denominator cannot be zero.");
  const sign = fraction.denominator < 0 ? -1 : 1;
  const numerator = fraction.numerator * sign;
  const denominator = Math.abs(fraction.denominator);
  const divisor = gcd(numerator, denominator);
  return { numerator: numerator / divisor, denominator: denominator / divisor };
}

export function fractionToString(fraction: FractionInput): string {
  const simple = simplifyFraction(fraction);
  if (simple.denominator === 1) return String(simple.numerator);
  return `${simple.numerator}/${simple.denominator}`;
}

export function parseFraction(text: string): FractionInput {
  if (!text.includes("/")) {
    const whole = Number(text.trim());
    if (!Number.isFinite(whole)) throw new Error(`Invalid fraction ${text}.`);
    return { numerator: whole, denominator: 1 };
  }
  const [n, d] = text.split("/").map((part) => Number(part.trim()));
  if (!Number.isFinite(n) || !Number.isFinite(d)) throw new Error(`Invalid fraction ${text}.`);
  return { numerator: n, denominator: d };
}

export function improperToMixed(fraction: FractionInput): string {
  const simple = simplifyFraction(fraction);
  const whole = Math.trunc(simple.numerator / simple.denominator);
  const remainder = Math.abs(simple.numerator % simple.denominator);
  if (remainder === 0) return String(whole);
  if (whole === 0) return fractionToString(simple);
  return `${whole} ${remainder}/${simple.denominator}`;
}

export function mixedToImproper(mixed: MixedFractionInput): FractionInput {
  return simplifyFraction({ numerator: mixed.whole * mixed.denominator + mixed.numerator, denominator: mixed.denominator });
}

export function addFractions(a: FractionInput, b: FractionInput): FractionInput {
  return simplifyFraction({ numerator: a.numerator * b.denominator + b.numerator * a.denominator, denominator: a.denominator * b.denominator });
}

export function subtractFractions(a: FractionInput, b: FractionInput): FractionInput {
  return simplifyFraction({ numerator: a.numerator * b.denominator - b.numerator * a.denominator, denominator: a.denominator * b.denominator });
}

export function multiplyFractions(a: FractionInput, b: FractionInput): FractionInput {
  return simplifyFraction({ numerator: a.numerator * b.numerator, denominator: a.denominator * b.denominator });
}

export function divideFractions(a: FractionInput, b: FractionInput): FractionInput {
  return simplifyFraction({ numerator: a.numerator * b.denominator, denominator: a.denominator * b.numerator });
}

export function rationalToFraction(value: RationalToken): FractionInput {
  return typeof value === "number" ? { numerator: value, denominator: 1 } : value;
}

export function evaluateRationalExpression(operands: RationalToken[], operation: string): FractionInput {
  const fractions = operands.map(rationalToFraction);
  if (operation === "addition") return fractions.slice(1).reduce(addFractions, fractions[0]);
  if (operation === "subtraction") return fractions.slice(1).reduce(subtractFractions, fractions[0]);
  if (operation === "multiplication") return fractions.slice(1).reduce(multiplyFractions, fractions[0]);
  if (operation === "division") return fractions.slice(1).reduce(divideFractions, fractions[0]);
  return divideFractions(multiplyFractions(addFractions(fractions[0], fractions[1]), fractions[2]), fractions[3] ?? { numerator: 1, denominator: 1 });
}

export function terminatingDecimalInfo(fraction: FractionInput) {
  const simple = simplifyFraction(fraction);
  let denominator = simple.denominator;
  while (denominator % 2 === 0) denominator /= 2;
  while (denominator % 5 === 0) denominator /= 5;
  return { terminates: denominator === 1, denominatorProfile: denominator === 1 ? "denominator factors only 2 and 5" : "denominator contains other prime factors" };
}

export function fractionToDecimal(fraction: FractionInput): string {
  const simple = simplifyFraction(fraction);
  const sign = simple.numerator < 0 ? "-" : "";
  let numerator = Math.abs(simple.numerator);
  const denominator = simple.denominator;
  const integer = Math.trunc(numerator / denominator);
  let remainder = numerator % denominator;
  if (remainder === 0) return `${sign}${integer}`;
  const seen = new Map<number, number>();
  const digits: string[] = [];
  while (remainder !== 0 && !seen.has(remainder)) {
    seen.set(remainder, digits.length);
    remainder *= 10;
    digits.push(String(Math.trunc(remainder / denominator)));
    remainder %= denominator;
  }
  if (remainder === 0) return `${sign}${integer}.${digits.join("")}`;
  const start = seen.get(remainder) ?? 0;
  return `${sign}${integer}.${digits.slice(0, start).join("")}(${digits.slice(start).join("")})`;
}

export function decimalToFraction(decimal: string): FractionInput {
  const places = decimal.includes(".") ? decimal.split(".")[1].length : 0;
  const denominator = 10 ** places;
  const numerator = Math.round(Number(decimal) * denominator);
  return simplifyFraction({ numerator, denominator });
}

export function recurringDecimalToFraction(decimal: string): FractionInput {
  const match = decimal.match(/^(\d*)\.(\d*)\((\d+)\)$/);
  if (!match) throw new Error(`Invalid recurring decimal ${decimal}.`);
  const integer = Number(match[1] || "0");
  const nonRepeat = match[2] ?? "";
  const repeat = match[3];
  const nonRepeatScale = 10 ** nonRepeat.length;
  const repeatScale = 10 ** repeat.length;
  const full = Number(`${integer}${nonRepeat}${repeat}`);
  const prefix = Number(`${integer}${nonRepeat || "0"}`);
  const denominator = nonRepeatScale * (repeatScale - 1);
  return simplifyFraction({ numerator: full - prefix, denominator });
}

export function fractionHcf(fractions: FractionInput[]): FractionInput {
  const simple = fractions.map(simplifyFraction);
  const numeratorHcf = simple.map((f) => Math.abs(f.numerator)).reduce(gcd);
  const denominatorLcm = simple.map((f) => f.denominator).reduce(lcm);
  return simplifyFraction({ numerator: numeratorHcf, denominator: denominatorLcm });
}

export function fractionLcm(fractions: FractionInput[]): FractionInput {
  const simple = fractions.map(simplifyFraction);
  const numeratorLcm = simple.map((f) => Math.abs(f.numerator)).reduce(lcm);
  const denominatorHcf = simple.map((f) => f.denominator).reduce(gcd);
  return simplifyFraction({ numerator: numeratorLcm, denominator: denominatorHcf });
}

export function compareFractions(a: FractionInput, b: FractionInput) {
  return a.numerator * b.denominator - b.numerator * a.denominator;
}

export function placeholderMathJax(overrides: Partial<NsFracdec001MathJaxFields>): NsFracdec001MathJaxFields {
  return { ...EMPTY_FRACDEC_MATHJAX, ...overrides };
}
