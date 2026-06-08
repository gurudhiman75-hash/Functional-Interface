import type { NsFac001FactorModel, NsFac001FactorTerm, NsFac001MathJaxFields } from "./types";

export const HIGHLY_COMPOSITE_NUMBERS = [60, 120, 180, 240, 360, 720, 840] as const;

export function isPrime(value: number) {
  if (!Number.isInteger(value) || value < 2) return false;
  if (value === 2) return true;
  if (value % 2 === 0) return false;
  for (let factor = 3; factor * factor <= value; factor += 2) {
    if (value % factor === 0) return false;
  }
  return true;
}

export function primeFactorize(number: number): NsFac001FactorTerm[] {
  if (!Number.isInteger(number) || number < 2) throw new Error(`NS-FAC-001 number must be an integer greater than 1: ${number}`);
  let remainder = number;
  const terms: NsFac001FactorTerm[] = [];
  for (let factor = 2; factor * factor <= remainder; factor += factor === 2 ? 1 : 2) {
    if (remainder % factor !== 0) continue;
    let exponent = 0;
    let power = 1;
    while (remainder % factor === 0) {
      remainder /= factor;
      exponent += 1;
      power *= factor;
    }
    terms.push({ prime: factor, exponent, power });
  }
  if (remainder > 1) terms.push({ prime: remainder, exponent: 1, power: remainder });
  return terms;
}

export function buildFactorModel(number: number, k?: number, position?: number): NsFac001FactorModel {
  const primeFactorization = primeFactorize(number);
  const factorList = enumerateFactors(primeFactorization).sort((a, b) => a - b);
  const factorsIncreasing = factorList;
  const factorsDecreasing = [...factorList].reverse();
  const factorCount = factorList.length;
  const factorSum = factorList.reduce((sum, factor) => sum + factor, 0);
  const factorProductString = factorList.reduce((product, factor) => product * BigInt(factor), 1n).toString();
  const isPrimeInput = isPrime(number);
  const isPerfectSquare = Number.isInteger(Math.sqrt(number));
  const mathJax = buildMathJaxFields({
    number,
    primeFactorization,
    factorList,
    factorsIncreasing,
    factorsDecreasing,
    factorCount,
    factorSum,
    factorProductString,
    k,
    position,
  });

  return {
    number,
    primeFactorization,
    factorCount,
    factorSum,
    factorProduct: factorProductString,
    factorProductString,
    productDigitCount: factorProductString.length,
    factorList,
    factorsIncreasing,
    factorsDecreasing,
    largestPrimeFactor: primeFactorization[primeFactorization.length - 1].prime,
    smallestPrimeFactor: primeFactorization[0].prime,
    greatestProperFactor: isPrimeInput ? 1 : number / primeFactorization[0].prime,
    isPrimeInput,
    isCompositeInput: !isPrimeInput,
    isPerfectSquare,
    isPrimePower: primeFactorization.length === 1,
    isMixedPrime: primeFactorization.length >= 2,
    isHighlyCompositeNumber: HIGHLY_COMPOSITE_NUMBERS.includes(number as (typeof HIGHLY_COMPOSITE_NUMBERS)[number]),
    ...mathJax,
  };
}

export function enumerateFactors(terms: readonly NsFac001FactorTerm[]) {
  let factors = [1];
  for (const term of terms) {
    const next: number[] = [];
    for (const base of factors) {
      let power = 1;
      for (let exponent = 0; exponent <= term.exponent; exponent += 1) {
        next.push(base * power);
        power *= term.prime;
      }
    }
    factors = next;
  }
  return factors;
}

export function factorsDivisibleBy(factors: readonly number[], k: number) {
  return factors.filter((factor) => factor % k === 0);
}

export function factorsNotDivisibleBy(factors: readonly number[], k: number) {
  return factors.filter((factor) => factor % k !== 0);
}

export function ordinalDisplay(position: number) {
  const mod100 = position % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${position}th`;
  switch (position % 10) {
    case 1:
      return `${position}st`;
    case 2:
      return `${position}nd`;
    case 3:
      return `${position}rd`;
    default:
      return `${position}th`;
  }
}

export function positionClass(position: number | undefined, factorCount: number) {
  if (typeof position !== "number") return "not-applicable";
  if (position === 1) return "first";
  if (position === 2) return "second";
  if (position === factorCount) return "last";
  if (position === factorCount - 1) return "penultimate";
  if (Math.abs(position - Math.ceil(factorCount / 2)) <= 1) return "middle";
  return "general";
}

export function factorCountBucket(factorCount: number) {
  if (factorCount <= 12) return "small";
  if (factorCount <= 48) return "medium";
  return "large";
}

export function kBucket(k: number | undefined) {
  if (typeof k !== "number") return "not-applicable";
  if (k <= 20) return "small";
  if (k <= 200) return "medium";
  return "large";
}

export function positionBucket(position: number | undefined) {
  if (typeof position !== "number") return "not-applicable";
  if (position <= 6) return "small";
  if (position <= 24) return "medium";
  return "large";
}

export function productDigitCountBucket(productDigitCount: number) {
  if (productDigitCount <= 15) return "small";
  if (productDigitCount <= 60) return "medium";
  if (productDigitCount <= 150) return "large";
  return "very_large";
}

export function mathJaxValuesPresent(fields: NsFac001MathJaxFields) {
  return MATHJAX_FIELD_KEYS.every((key) => typeof fields[key] === "string" && fields[key].length > 0);
}

const MATHJAX_FIELD_KEYS = [
  "primeFactorizationLatex",
  "factorCountFormulaLatex",
  "factorSumFormulaLatex",
  "factorProductFormulaLatex",
  "factorListLatex",
  "factorsIncreasingLatex",
  "factorsDecreasingLatex",
  "kPrimeFactorizationLatex",
  "divisibleFactorConstraintLatex",
  "complementFormulaLatex",
  "selectedPositionFormulaLatex",
  "greatestProperFactorFormulaLatex",
  "perfectSquareRuleLatex",
] as const;

function buildMathJaxFields(input: {
  number: number;
  primeFactorization: readonly NsFac001FactorTerm[];
  factorList: readonly number[];
  factorsIncreasing: readonly number[];
  factorsDecreasing: readonly number[];
  factorCount: number;
  factorSum: number;
  factorProductString: string;
  k?: number;
  position?: number;
}): NsFac001MathJaxFields {
  const primeFactorizationLatex = `${input.number} = ${input.primeFactorization.map(formatTermLatex).join(" \\times ")}`;
  const factorCountFormulaLatex = `d(${input.number}) = ${input.primeFactorization.map((term) => `(${term.exponent}+1)`).join("")} = ${input.factorCount}`;
  const factorSumFormulaLatex = `\\sigma(${input.number}) = ${input.primeFactorization.map(formatSumComponentLatex).join("")} = ${input.factorSum}`;
  const factorProductFormulaLatex = `${input.number}^{d(${input.number})/2} = ${input.factorProductString}`;
  const factorListLatex = `\\{${input.factorList.join(", ")}\\}`;
  const factorsIncreasingLatex = `\\{${input.factorsIncreasing.join(", ")}\\}`;
  const factorsDecreasingLatex = `\\{${input.factorsDecreasing.join(", ")}\\}`;
  const kPrimeFactorizationLatex = typeof input.k === "number" ? `${input.k} = ${primeFactorize(input.k).map(formatTermLatex).join(" \\times ")}` : "k = \\text{not applicable}";
  const divisibleFactorConstraintLatex =
    typeof input.k === "number" ? `f \\mid ${input.number},\\ ${input.k} \\mid f` : "k = \\text{not applicable}";
  const complementFormulaLatex =
    typeof input.k === "number" ? `\\text{not divisible count} = d(${input.number}) - \\text{divisible by } ${input.k}` : "k = \\text{not applicable}";
  const selectedPositionFormulaLatex =
    typeof input.position === "number" ? `\\text{selected factor} = f_{${input.position}}` : "\\text{position not applicable}";
  const greatestProperFactorFormulaLatex = `\\text{greatest proper factor} < ${input.number}`;
  const perfectSquareRuleLatex = `\\sqrt{${input.number}} ${Number.isInteger(Math.sqrt(input.number)) ? "\\in \\mathbb{Z}" : "\\notin \\mathbb{Z}"}`;

  return {
    primeFactorizationLatex,
    factorCountFormulaLatex,
    factorSumFormulaLatex,
    factorProductFormulaLatex,
    factorListLatex,
    factorsIncreasingLatex,
    factorsDecreasingLatex,
    kPrimeFactorizationLatex,
    divisibleFactorConstraintLatex,
    complementFormulaLatex,
    selectedPositionFormulaLatex,
    greatestProperFactorFormulaLatex,
    perfectSquareRuleLatex,
  };
}

function formatTermLatex(term: NsFac001FactorTerm) {
  return term.exponent === 1 ? String(term.prime) : `${term.prime}^{${term.exponent}}`;
}

function formatSumComponentLatex(term: NsFac001FactorTerm) {
  const powers: string[] = [];
  let value = 1;
  for (let index = 0; index <= term.exponent; index += 1) {
    powers.push(String(value));
    value *= term.prime;
  }
  return `(${powers.join("+")})`;
}
