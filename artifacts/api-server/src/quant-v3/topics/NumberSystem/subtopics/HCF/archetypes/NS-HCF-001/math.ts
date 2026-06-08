import type { NsHcf001FactorTerm, NsHcf001MathJaxFields, NsHcf001Parameters } from "./types";

export const NS_HCF_001_MATHJAX_KEYS = [
  "operandFactorizationLatex",
  "commonPrimeIntersectionLatex",
  "minimumExponentSelectionLatex",
  "hcfLatex",
  "hcfFactorCountFormulaLatex",
  "candidateEvaluationLatex",
  "groupingInterpretationLatex",
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

export function hcfOf(numbers: readonly number[]) {
  assertPositiveIntegers(numbers);
  return numbers.reduce((current, value) => gcd(current, value));
}

export function primeFactorize(number: number): NsHcf001FactorTerm[] {
  if (!Number.isInteger(number) || number < 1) throw new Error(`NS-HCF-001 number must be a positive integer: ${number}`);
  if (number === 1) return [];
  const terms: NsHcf001FactorTerm[] = [];
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

export function factorCount(number: number) {
  return primeFactorize(number).reduce((product, term) => product * (term.exponent + 1), 1);
}

export function buildMathJax(parameters: NsHcf001Parameters, answer: number, validCandidates: readonly number[] = []): NsHcf001MathJaxFields {
  const numbers = parameters.canonicalProblemId === "CP-003" ? [...(parameters.knownOperands ?? []), answer] : parameters.numbers;
  const hcfValue = parameters.canonicalProblemId === "CP-003" ? parameters.targetHcf ?? hcfOf(numbers) : hcfOf(numbers);
  const factorizations = numbers.map((number) => primeFactorize(number));
  return {
    operandFactorizationLatex: operandFactorizationLatex(numbers),
    commonPrimeIntersectionLatex: commonPrimeIntersectionLatex(numbers),
    minimumExponentSelectionLatex: minimumExponentSelectionLatex(numbers),
    hcfLatex: `\\operatorname{HCF}(${numbers.join(", ")}) = ${hcfValue}`,
    hcfFactorCountFormulaLatex: hcfFactorCountFormulaLatex(hcfValue),
    candidateEvaluationLatex: candidateEvaluationLatex(parameters, validCandidates),
    groupingInterpretationLatex: `\\text{Required number} = \\operatorname{HCF}(${parameters.numbers.join(", ")})`,
  };
}

export function operandFactorizationLatex(numbers: readonly number[]) {
  return numbers.map((number) => `${number} = ${formatFactorization(primeFactorize(number))}`).join("\\\\");
}

export function commonPrimeIntersectionLatex(numbers: readonly number[]) {
  const common = commonTerms(numbers);
  if (common.length === 0) return "\\text{No common prime factor except }1";
  return `\\text{Common prime factors: } ${common.map((term) => term.prime).join(", ")}`;
}

export function minimumExponentSelectionLatex(numbers: readonly number[]) {
  const common = commonTerms(numbers);
  if (common.length === 0) return "\\operatorname{HCF}=1";
  return common.map((term) => `${term.prime}^{${term.exponent}}`).join(" \\times ");
}

export function hcfFactorCountFormulaLatex(hcfValue: number) {
  const terms = primeFactorize(hcfValue);
  if (terms.length === 0) return `d(${hcfValue}) = 1`;
  const formula = terms.map((term) => `(${term.exponent}+1)`).join("");
  return `d(${hcfValue}) = ${formula} = ${factorCount(hcfValue)}`;
}

export function formatNumberList(values: readonly number[]) {
  if (values.length <= 1) return values.join("");
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")} and ${values[values.length - 1]}`;
}

export function mathJaxPresent(fields: NsHcf001MathJaxFields) {
  return NS_HCF_001_MATHJAX_KEYS.every((key) => typeof fields[key] === "string" && fields[key].length > 0);
}

function candidateEvaluationLatex(parameters: NsHcf001Parameters, validCandidates: readonly number[]) {
  if (parameters.canonicalProblemId !== "CP-003") return "\\text{Not applicable}";
  const values = parameters.candidateValues ?? [];
  const known = parameters.knownOperands ?? [];
  const rows = values.map((value) => {
    const hcfValue = hcfOf([...known, value]);
    const ok = validCandidates.includes(value) ? "\\checkmark" : "\\times";
    return `${value}: \\operatorname{HCF}(${[...known, value].join(", ")})=${hcfValue}\\ ${ok}`;
  });
  return rows.length > 0 ? rows.join("\\\\") : "\\text{No possible values}";
}

function commonTerms(numbers: readonly number[]) {
  if (numbers.length === 0) return [];
  const factorMaps = numbers.map((number) => new Map(primeFactorize(number).map((term) => [term.prime, term.exponent])));
  const common: NsHcf001FactorTerm[] = [];
  for (const [prime, exponent] of factorMaps[0]) {
    if (!factorMaps.every((map) => map.has(prime))) continue;
    const minExponent = Math.min(...factorMaps.map((map) => map.get(prime) ?? 0));
    common.push({ prime, exponent: minExponent, power: prime ** minExponent });
  }
  return common;
}

function formatFactorization(terms: readonly NsHcf001FactorTerm[]) {
  if (terms.length === 0) return "1";
  return terms.map((term) => (term.exponent === 1 ? `${term.prime}` : `${term.prime}^{${term.exponent}}`)).join(" \\times ");
}

function assertPositiveIntegers(numbers: readonly number[]) {
  if (numbers.length === 0) throw new Error("NS-HCF-001 requires at least one number.");
  for (const number of numbers) {
    if (!Number.isInteger(number) || number < 1) throw new Error(`NS-HCF-001 number must be a positive integer: ${number}`);
  }
}
