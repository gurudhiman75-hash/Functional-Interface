import type { NsLcm001FactorTerm, NsLcm001MathJaxFields, NsLcm001Parameters } from "./types";

export const NS_LCM_001_MATHJAX_KEYS = [
  "operandFactorizationLatex",
  "primeUnionLatex",
  "maximumExponentSelectionLatex",
  "lcmLatex",
  "synchronizationInterpretationLatex",
  "candidateEvaluationLatex",
  "rangeCountFormulaLatex",
  "thresholdSelectionFormulaLatex",
] as const;

export function gcd(a: number, b: number) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x;
}

export function lcm2(a: number, b: number) {
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b < 1) throw new Error("NS-LCM-001 LCM inputs must be positive integers.");
  return Math.abs((a / gcd(a, b)) * b);
}

export function lcmOf(numbers: readonly number[]) {
  assertPositiveIntegers(numbers);
  return numbers.reduce((current, value) => lcm2(current, value), 1);
}

export function primeFactorize(number: number): NsLcm001FactorTerm[] {
  if (!Number.isInteger(number) || number < 1) throw new Error(`NS-LCM-001 number must be a positive integer: ${number}`);
  if (number === 1) return [];
  const terms: NsLcm001FactorTerm[] = [];
  let remainder = number;
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

export function buildMathJax(parameters: NsLcm001Parameters, answer: number, validCandidates: readonly number[] = []): NsLcm001MathJaxFields {
  const numbers = numbersFor(parameters, answer);
  const lcm = parameters.canonicalProblemId === "CP-003" ? parameters.targetLcm ?? lcmOf(numbers) : lcmOf(numbers);
  return {
    operandFactorizationLatex: operandFactorizationLatex(numbers),
    primeUnionLatex: primeUnionLatex(numbers),
    maximumExponentSelectionLatex: maximumExponentSelectionLatex(numbers),
    lcmLatex: `\\operatorname{LCM}(${numbers.join(", ")}) = ${lcm}`,
    synchronizationInterpretationLatex: `\\text{Together again after } \\operatorname{LCM}(${(parameters.cycleLengths ?? numbers).join(", ")})`,
    candidateEvaluationLatex: candidateEvaluationLatex(parameters, validCandidates),
    rangeCountFormulaLatex: rangeCountFormulaLatex(parameters),
    thresholdSelectionFormulaLatex: thresholdSelectionFormulaLatex(parameters, answer),
  };
}

export function operandFactorizationLatex(numbers: readonly number[]) {
  return numbers.map((number) => `${number} = ${formatFactorization(primeFactorize(number))}`).join("\\\\");
}

export function primeUnionLatex(numbers: readonly number[]) {
  const union = lcmTerms(numbers);
  return `\\text{Prime factors used: } ${union.map((term) => term.prime).join(", ")}`;
}

export function maximumExponentSelectionLatex(numbers: readonly number[]) {
  const union = lcmTerms(numbers);
  if (union.length === 0) return "\\operatorname{LCM}=1";
  return union.map((term) => `${term.prime}^{${term.exponent}}`).join(" \\times ");
}

export function lcmTerms(numbers: readonly number[]) {
  const exponentMap = new Map<number, number>();
  for (const number of numbers) {
    for (const term of primeFactorize(number)) {
      exponentMap.set(term.prime, Math.max(exponentMap.get(term.prime) ?? 0, term.exponent));
    }
  }
  return [...exponentMap.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([prime, exponent]) => ({ prime, exponent, power: prime ** exponent }));
}

export function countCommonMultiplesInRange(numbers: readonly number[], lowerBound: number, upperBound: number) {
  const lcm = lcmOf(numbers);
  return Math.floor(upperBound / lcm) - Math.floor((lowerBound - 1) / lcm);
}

export function firstCommonMultipleGreaterThan(numbers: readonly number[], threshold: number) {
  const lcm = lcmOf(numbers);
  return (Math.floor(threshold / lcm) + 1) * lcm;
}

export function formatNumberList(values: readonly number[]) {
  if (values.length <= 1) return values.join("");
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")} and ${values[values.length - 1]}`;
}

export function pairwiseCoprime(numbers: readonly number[]) {
  for (let i = 0; i < numbers.length; i += 1) {
    for (let j = i + 1; j < numbers.length; j += 1) {
      if (gcd(numbers[i], numbers[j]) !== 1) return false;
    }
  }
  return true;
}

export function lcmSizeBucket(value: number) {
  if (value <= 100) return "small";
  if (value <= 2000) return "medium";
  return "large";
}

export function rangeWidthBucket(width: number | undefined) {
  if (typeof width !== "number") return "not-applicable";
  if (width <= 100) return "small";
  if (width <= 1000) return "medium";
  return "large";
}

export function mathJaxPresent(fields: NsLcm001MathJaxFields) {
  return NS_LCM_001_MATHJAX_KEYS.every((key) => typeof fields[key] === "string" && fields[key].length > 0);
}

function rangeCountFormulaLatex(parameters: NsLcm001Parameters) {
  if (parameters.canonicalProblemId !== "CP-004" || typeof parameters.lowerBound !== "number" || typeof parameters.upperBound !== "number") return "\\text{Not applicable}";
  const lcm = lcmOf(parameters.numbers);
  const count = countCommonMultiplesInRange(parameters.numbers, parameters.lowerBound, parameters.upperBound);
  return `\\left\\lfloor\\frac{${parameters.upperBound}}{${lcm}}\\right\\rfloor - \\left\\lfloor\\frac{${parameters.lowerBound - 1}}{${lcm}}\\right\\rfloor = ${count}`;
}

function thresholdSelectionFormulaLatex(parameters: NsLcm001Parameters, answer: number) {
  if (parameters.canonicalProblemId !== "CP-005" || typeof parameters.threshold !== "number") return "\\text{Not applicable}";
  const lcm = lcmOf(parameters.numbers);
  return `\\left(\\left\\lfloor\\frac{${parameters.threshold}}{${lcm}}\\right\\rfloor + 1\\right)\\times ${lcm} = ${answer}`;
}

function candidateEvaluationLatex(parameters: NsLcm001Parameters, validCandidates: readonly number[]) {
  if (parameters.canonicalProblemId !== "CP-003") return "\\text{Not applicable}";
  const known = parameters.knownNumbers ?? [];
  const values = parameters.candidateValues ?? [];
  const rows = values.map((value) => {
    const lcm = lcmOf([...known, value]);
    const ok = validCandidates.includes(value) ? "\\checkmark" : "\\times";
    return `${value}: \\operatorname{LCM}(${[...known, value].join(", ")})=${lcm}\\ ${ok}`;
  });
  return rows.length > 0 ? rows.join("\\\\") : "\\text{No possible values}";
}

function numbersFor(parameters: NsLcm001Parameters, answer: number) {
  if (parameters.canonicalProblemId === "CP-002") return parameters.cycleLengths ?? parameters.numbers;
  if (parameters.canonicalProblemId === "CP-003") return [...(parameters.knownNumbers ?? []), answer];
  return parameters.numbers;
}

function formatFactorization(terms: readonly NsLcm001FactorTerm[]) {
  if (terms.length === 0) return "1";
  return terms.map((term) => (term.exponent === 1 ? `${term.prime}` : `${term.prime}^{${term.exponent}}`)).join(" \\times ");
}

function assertPositiveIntegers(numbers: readonly number[]) {
  if (numbers.length === 0) throw new Error("NS-LCM-001 requires at least one number.");
  for (const number of numbers) {
    if (!Number.isInteger(number) || number < 1) throw new Error(`NS-LCM-001 number must be a positive integer: ${number}`);
  }
}
