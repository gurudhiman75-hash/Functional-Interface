import type { NsLastdig001MathJaxFields, NsLastdig001PowerTerm } from "./types";

export const NS_LASTDIG_001_MATHJAX_KEYS = [
  "cycleLatex",
  "cyclePositionLatex",
  "effectiveExponentLatex",
  "productLastDigitLatex",
  "towerReductionLatex",
] as const;

const CYCLES: Record<number, number[]> = {
  0: [0],
  1: [1],
  2: [2, 4, 8, 6],
  3: [3, 9, 7, 1],
  4: [4, 6],
  5: [5],
  6: [6],
  7: [7, 9, 3, 1],
  8: [8, 4, 2, 6],
  9: [9, 1],
};

export function lastDigit(value: number) {
  return Math.abs(value) % 10;
}

export function cycleForBase(base: number) {
  return [...CYCLES[lastDigit(base)]];
}

export function cyclePosition(exponent: number, cycleLength: number) {
  const remainder = exponent % cycleLength;
  return remainder === 0 ? cycleLength : remainder;
}

export function lastDigitOfPower(base: number, exponent: number) {
  const cycle = cycleForBase(base);
  return cycle[cyclePosition(exponent, cycle.length) - 1];
}

export function lastDigitOfProduct(terms: readonly NsLastdig001PowerTerm[]) {
  return terms.reduce((product, term) => (product * lastDigitOfPower(term.base, term.exponent)) % 10, 1);
}

export function towerModulo(bases: readonly number[], modulus: number): number {
  if (modulus === 1) return 0;
  if (bases.length === 1) return bases[0] % modulus;
  const exponent = towerValueCapped(bases.slice(1), 64);
  return modularPow(bases[0], exponent, modulus);
}

export function towerValueCapped(bases: readonly number[], cap: number): number {
  if (bases.length === 0) return 1;
  if (bases.length === 1) return Math.min(bases[0], cap);
  const exponent = towerValueCapped(bases.slice(1), 16);
  let value = 1;
  for (let i = 0; i < exponent; i += 1) {
    value *= bases[0];
    if (value > cap) return cap;
  }
  return value;
}

export function lastDigitOfTower(bases: readonly number[]) {
  const cycle = cycleForBase(bases[0]);
  const effective = towerModulo(bases.slice(1), cycle.length);
  const position = effective === 0 ? cycle.length : effective;
  return cycle[position - 1];
}

export function cyclePattern(base: number) {
  return cycleForBase(base).join(", ");
}

export function validExponentOptions(base: number, targetLastDigit: number, options: readonly number[]) {
  return options.filter((option) => lastDigitOfPower(base, option) === targetLastDigit);
}

export function cycleLengthBucket(base: number) {
  return `cycleLength${cycleForBase(base).length}`;
}

export function exponentMagnitude(exponent: number) {
  if (exponent <= 20) return "smallExponent";
  if (exponent <= 500) return "mediumExponent";
  if (exponent <= 100000) return "largeExponent";
  return "veryLargeExponent";
}

export function buildMathJax(input: {
  base?: number;
  exponent?: number;
  cycle?: readonly number[];
  cyclePositionValue?: number;
  effectiveExponent?: number;
  powerTerms?: readonly NsLastdig001PowerTerm[];
  termLastDigits?: readonly number[];
  towerBases?: readonly number[];
  productLastDigit?: number;
}): NsLastdig001MathJaxFields {
  const cycle = input.cycle ?? (input.base ? cycleForBase(input.base) : []);
  return {
    cycleLatex: cycle.length ? `\\text{Cycle}=(${cycle.join(", ")})` : "\\text{Cycle not required}",
    cyclePositionLatex:
      input.exponent && input.cyclePositionValue
        ? `${input.exponent}\\equiv ${input.cyclePositionValue}\\pmod{${cycle.length}}`
        : input.cyclePositionValue
          ? `\\text{Cycle position}=${input.cyclePositionValue}`
          : "\\text{Cycle position not required}",
    effectiveExponentLatex:
      typeof input.effectiveExponent === "number" ? `\\text{Effective exponent position}=${input.effectiveExponent}` : "\\text{Effective exponent not required}",
    productLastDigitLatex:
      input.termLastDigits?.length
        ? `${input.termLastDigits.join("\\times")}\\equiv ${input.productLastDigit ?? 0}\\pmod{10}`
        : "\\text{Product last digit not required}",
    towerReductionLatex:
      input.towerBases?.length && typeof input.effectiveExponent === "number"
        ? `${formatTower(input.towerBases.slice(1))}\\Rightarrow ${input.effectiveExponent}`
        : "\\text{Tower reduction not required}",
  };
}

export function mathJaxPresent(fields: NsLastdig001MathJaxFields) {
  return NS_LASTDIG_001_MATHJAX_KEYS.every((key) => fields[key].length > 0);
}

export function formatPower(base: number, exponent: number) {
  return `${base}^${exponent}`;
}

export function formatTower(bases: readonly number[]) {
  return bases.join("^");
}

function modularPow(base: number, exponent: number, modulus: number) {
  let result = 1 % modulus;
  let current = base % modulus;
  let exp = exponent;
  while (exp > 0) {
    if (exp % 2 === 1) result = (result * current) % modulus;
    current = (current * current) % modulus;
    exp = Math.floor(exp / 2);
  }
  return result;
}
