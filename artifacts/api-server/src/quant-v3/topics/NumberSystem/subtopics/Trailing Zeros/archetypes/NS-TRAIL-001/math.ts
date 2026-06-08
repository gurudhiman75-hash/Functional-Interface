import type { NsTrail001MathJaxFields, NsTrail001Parameters } from "./types";

export const NS_TRAIL_001_MATHJAX_KEYS = [
  "factorFiveCountLatex",
  "factorialExpressionLatex",
  "searchProcessLatex",
  "powerFactorizationLatex",
  "productFactorizationLatex",
] as const;

export function trailingZerosFactorial(n: number) {
  let total = 0;
  for (let power = 5; power <= n; power *= 5) total += Math.floor(n / power);
  return total;
}

export function largestPowerOfFiveReached(n: number | undefined) {
  if (!n || n < 25) return "below25";
  if (n < 125) return "crosses25";
  if (n < 625) return "crosses125";
  return "crosses625";
}

export function nBucket(n: number | undefined) {
  if (!n) return "not-applicable";
  if (n <= 50) return "smallFactorial";
  if (n <= 500) return "mediumFactorial";
  return "largeFactorial";
}

export function factorCount(number: number, prime: number) {
  let count = 0;
  let value = number;
  while (value % prime === 0) {
    count += 1;
    value /= prime;
  }
  return count;
}

export function primeFactorize(number: number) {
  const factors = new Map<number, number>();
  let value = number;
  for (let factor = 2; factor * factor <= value; factor += factor === 2 ? 1 : 2) {
    while (value % factor === 0) {
      factors.set(factor, (factors.get(factor) ?? 0) + 1);
      value /= factor;
    }
  }
  if (value > 1) factors.set(value, (factors.get(value) ?? 0) + 1);
  return factors;
}

export function factorialExpressionZeros(numeratorTerms: readonly number[], denominatorTerms: readonly number[]) {
  return numeratorTerms.reduce((sum, term) => sum + trailingZerosFactorial(term), 0) - denominatorTerms.reduce((sum, term) => sum + trailingZerosFactorial(term), 0);
}

export function smallestFactorialWithZeros(target: number) {
  let iterations = 0;
  for (let n = 0; n <= Math.max(5, target * 6 + 100); n += 1) {
    iterations += 1;
    const zeros = trailingZerosFactorial(n);
    if (zeros === target) return { n, iterations };
    if (zeros > target) break;
  }
  throw new Error(`NS-TRAIL-001 target zero count is not attainable: ${target}`);
}

export function powerMagnitude(base: number | undefined, exponent: number | undefined) {
  if (!base || !exponent) return "not-applicable";
  const magnitude = Math.log10(base) * exponent;
  if (magnitude <= 5) return "small";
  if (magnitude <= 20) return "medium";
  return "large";
}

export function buildMathJax(parameters: NsTrail001Parameters, input: { answer: number; twoCount?: number; fiveCount?: number; searchIterations?: number }): NsTrail001MathJaxFields {
  return {
    factorFiveCountLatex: parameters.n ? factorFiveLatex(parameters.n, input.answer) : "\\text{Factor-of-5 count is not required}",
    factorialExpressionLatex: parameters.expression ? factorialExpressionLatex(parameters, input.answer) : "\\text{Factorial expression is not required}",
    searchProcessLatex: typeof parameters.zeroCount === "number" ? `\\text{Search target }${parameters.zeroCount};\\ \\text{iterations }=${input.searchIterations ?? 0};\\ n=${input.answer}` : "\\text{Search is not required}",
    powerFactorizationLatex: parameters.base && parameters.exponent ? powerFactorizationLatex(parameters.base, parameters.exponent, input.twoCount ?? 0, input.fiveCount ?? 0) : "\\text{Power factorization is not required}",
    productFactorizationLatex: parameters.numberA && parameters.numberB ? productFactorizationLatex(parameters.numberA, parameters.numberB, input.twoCount ?? 0, input.fiveCount ?? 0) : "\\text{Product factorization is not required}",
  };
}

export function mathJaxPresent(fields: NsTrail001MathJaxFields) {
  return NS_TRAIL_001_MATHJAX_KEYS.every((key) => typeof fields[key] === "string" && fields[key].length > 0);
}

function factorFiveLatex(n: number, answer: number) {
  const terms: string[] = [];
  for (let power = 5; power <= n; power *= 5) terms.push(`\\left\\lfloor\\frac{${n}}{${power}}\\right\\rfloor`);
  return `${terms.join(" + ")} = ${answer}`;
}

function factorialExpressionLatex(parameters: NsTrail001Parameters, answer: number) {
  const numerator = (parameters.numeratorTerms ?? []).map((term) => `Z(${term}!)`).join(" + ") || "0";
  const denominator = (parameters.denominatorTerms ?? []).map((term) => `Z(${term}!)`).join(" + ") || "0";
  return `${numerator} - (${denominator}) = ${answer}`;
}

function powerFactorizationLatex(base: number, exponent: number, twos: number, fives: number) {
  return `${base}^{${exponent}}:\\ \\#2=${twos},\\ \\#5=${fives}`;
}

function productFactorizationLatex(a: number, b: number, twos: number, fives: number) {
  return `${a}\\times ${b}:\\ \\#2=${twos},\\ \\#5=${fives}`;
}
