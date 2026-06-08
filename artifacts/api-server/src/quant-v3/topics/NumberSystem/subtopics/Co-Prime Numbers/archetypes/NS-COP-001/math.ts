import type { NsCop001MathJaxFields, NsCop001Pair, NsCop001Parameters } from "./types";

export const NS_COP_001_MATHJAX_KEYS = [
  "hcfLatex",
  "coprimeCheckLatex",
  "candidateEvaluationLatex",
  "pairEvaluationLatex",
  "consecutivePropertyLatex",
  "ratioReductionLatex",
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
  return numbers.reduce((current, value) => gcd(current, value));
}

export function factorsOf(number: number) {
  const factors: number[] = [];
  for (let factor = 1; factor <= number; factor += 1) {
    if (number % factor === 0) factors.push(factor);
  }
  return factors;
}

export function commonFactors(a: number, b: number) {
  return factorsOf(gcd(a, b));
}

export function isPrime(number: number) {
  if (!Number.isInteger(number) || number < 2) return false;
  for (let factor = 2; factor * factor <= number; factor += 1) {
    if (number % factor === 0) return false;
  }
  return true;
}

export function unorderedPairs(values: readonly number[]) {
  const pairs: NsCop001Pair[] = [];
  for (let i = 0; i < values.length; i += 1) {
    for (let j = i + 1; j < values.length; j += 1) pairs.push({ a: values[i], b: values[j] });
  }
  return pairs;
}

export function formatNumberList(values: readonly number[]) {
  return values.join(", ");
}

export function reduceRatio(a: number, b: number) {
  const hcf = gcd(a, b);
  return { hcf, left: a / hcf, right: b / hcf, ratio: `${a / hcf}:${b / hcf}` };
}

export function hcfBucket(value: number | undefined) {
  if (typeof value !== "number") return "not-applicable";
  if (value === 1) return "hcfEquals1";
  if (value <= 10) return "smallHcf";
  return "largeHcf";
}

export function commonFactorBucket(count: number) {
  if (count <= 1) return "oneCommonFactor";
  if (count <= 3) return "fewCommonFactors";
  return "manyCommonFactors";
}

export function hcfSize(value: number | undefined) {
  if (typeof value !== "number") return "not-applicable";
  if (value === 1) return "one";
  if (value <= 10) return "small";
  return "large";
}

export function density(valid: number, total: number) {
  if (total === 0) return "low";
  const ratio = valid / total;
  if (ratio < 0.34) return "low";
  if (ratio < 0.67) return "medium";
  return "high";
}

export function buildMathJax(parameters: NsCop001Parameters, input: {
  hcf?: number;
  commonFactors?: readonly number[];
  listEvaluations?: readonly { value: number; hcf: number; valid: boolean }[];
  candidateEvaluations?: readonly { value: number; hcf: number; valid: boolean }[];
  pairEvaluations?: readonly { pair: NsCop001Pair; hcf: number; valid: boolean }[];
  reducedRatio?: string;
}): NsCop001MathJaxFields {
  const hcf = input.hcf ?? 1;
  return {
    hcfLatex: parameters.a && parameters.b ? `\\operatorname{HCF}(${parameters.a}, ${parameters.b}) = ${hcf}` : "\\text{HCF evidence is not required}",
    coprimeCheckLatex: input.listEvaluations && input.listEvaluations.length > 0 ? input.listEvaluations.map((entry) => `${entry.value}: \\operatorname{HCF}(${parameters.targetNumber}, ${entry.value})=${entry.hcf}${entry.valid ? "\\ \\checkmark" : "\\ \\times"}`).join("\\\\") : "\\text{List check is not required}",
    candidateEvaluationLatex: input.candidateEvaluations && input.candidateEvaluations.length > 0 ? input.candidateEvaluations.map((entry) => `${entry.value}: \\operatorname{HCF}(${parameters.number}, ${entry.value})=${entry.hcf}${entry.valid ? "\\ \\checkmark" : "\\ \\times"}`).join("\\\\") : "\\text{Candidate check is not required}",
    pairEvaluationLatex: input.pairEvaluations && input.pairEvaluations.length > 0 ? input.pairEvaluations.map((entry) => `(${entry.pair.a}, ${entry.pair.b}): \\operatorname{HCF}=${entry.hcf}${entry.valid ? "\\ \\checkmark" : "\\ \\times"}`).join("\\\\") : "\\text{Pair check is not required}",
    consecutivePropertyLatex: parameters.number && parameters.nextNumber ? `\\operatorname{HCF}(${parameters.number}, ${parameters.nextNumber}) = 1` : "\\operatorname{HCF}(n,n+1)=1",
    ratioReductionLatex: parameters.a && parameters.b && input.reducedRatio ? `${parameters.a}:${parameters.b} = ${input.reducedRatio}` : "\\text{Ratio reduction is not required}",
  };
}

export function mathJaxPresent(fields: NsCop001MathJaxFields) {
  return NS_COP_001_MATHJAX_KEYS.every((key) => typeof fields[key] === "string" && fields[key].length > 0);
}
