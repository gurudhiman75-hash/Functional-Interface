import {
  buildMathJax,
  factorCount,
  factorialExpressionZeros,
  largestPowerOfFiveReached,
  mathJaxPresent,
  nBucket,
  powerMagnitude,
  primeFactorize,
  smallestFactorialWithZeros,
  trailingZerosFactorial,
} from "./math";
import type { NsTrail001Parameters, NsTrail001SolverResult } from "./types";

export function solveNsTrail001(parameters: NsTrail001Parameters): NsTrail001SolverResult {
  const computed = answerFor(parameters);
  const twoCount = twoCountFor(parameters);
  const fiveCount = fiveCountFor(parameters);
  const pairCount = typeof twoCount === "number" && typeof fiveCount === "number" ? Math.min(twoCount, fiveCount) : undefined;
  const mathJax = buildMathJax(parameters, {
    answer: computed.answer,
    twoCount,
    fiveCount,
    searchIterations: computed.searchIterations,
  });

  return {
    archetypeId: parameters.archetypeId,
    canonicalProblemId: parameters.canonicalProblemId,
    topology: parameters.topology,
    answer: computed.answer,
    nBucket: parameters.nBucket ?? nBucket(parameters.n),
    largestPowerOfFiveReached: parameters.largestPowerOfFiveReached ?? largestPowerOfFiveReached(parameters.n),
    expressionType: parameters.expressionType,
    factorialTermCount:
      parameters.canonicalProblemId === "CP-002" ? (parameters.numeratorTerms ?? []).length + (parameters.denominatorTerms ?? []).length : undefined,
    targetZeroBucket: parameters.targetZeroBucket,
    searchIterations: computed.searchIterations,
    baseFactorizationType: parameters.baseFactorizationType,
    powerMagnitude: powerMagnitude(parameters.base, parameters.exponent),
    productType: parameters.productType,
    twoCount,
    fiveCount,
    pairCount,
    ...mathJax,
    verification: {
      inputValid: inputValid(parameters),
      answerRecomputed: computed.answer === recomputeAnswer(parameters, computed.answer),
      smallestExactMatch: smallestExactMatch(parameters, computed.answer),
      mathJaxValid: mathJaxPresent(mathJax),
      answerRuleSatisfied: answerRuleSatisfied(parameters, computed.answer),
    },
  };
}

function answerFor(parameters: NsTrail001Parameters) {
  switch (parameters.canonicalProblemId) {
    case "CP-001":
      return { answer: trailingZerosFactorial(required(parameters.n, "n")) };
    case "CP-002":
      return { answer: factorialExpressionZeros(parameters.numeratorTerms ?? [], parameters.denominatorTerms ?? []) };
    case "CP-003": {
      const result = smallestFactorialWithZeros(required(parameters.zeroCount, "zeroCount"));
      return { answer: result.n, searchIterations: result.iterations };
    }
    case "CP-004": {
      const twoCount = factorCount(required(parameters.base, "base"), 2) * required(parameters.exponent, "exponent");
      const fiveCount = factorCount(required(parameters.base, "base"), 5) * required(parameters.exponent, "exponent");
      return { answer: Math.min(twoCount, fiveCount) };
    }
    case "CP-005": {
      const twoCount = factorCount(required(parameters.numberA, "numberA"), 2) + factorCount(required(parameters.numberB, "numberB"), 2);
      const fiveCount = factorCount(required(parameters.numberA, "numberA"), 5) + factorCount(required(parameters.numberB, "numberB"), 5);
      return { answer: Math.min(twoCount, fiveCount) };
    }
  }
}

function recomputeAnswer(parameters: NsTrail001Parameters, answer: number) {
  switch (parameters.canonicalProblemId) {
    case "CP-001":
      return trailingZerosFactorial(required(parameters.n, "n"));
    case "CP-002":
      return factorialExpressionZeros(parameters.numeratorTerms ?? [], parameters.denominatorTerms ?? []);
    case "CP-003":
      return trailingZerosFactorial(answer) === parameters.zeroCount ? answer : -1;
    case "CP-004":
    case "CP-005":
      return Math.min(twoCountFor(parameters) ?? 0, fiveCountFor(parameters) ?? 0);
  }
}

function inputValid(parameters: NsTrail001Parameters) {
  switch (parameters.canonicalProblemId) {
    case "CP-001":
      return integerAtLeast(parameters.n, 0);
    case "CP-002":
      return (parameters.numeratorTerms ?? []).every((value) => integerAtLeast(value, 0)) && (parameters.denominatorTerms ?? []).every((value) => integerAtLeast(value, 0));
    case "CP-003":
      return integerAtLeast(parameters.zeroCount, 0);
    case "CP-004":
      return integerAtLeast(parameters.base, 1) && integerAtLeast(parameters.exponent, 1);
    case "CP-005":
      return integerAtLeast(parameters.numberA, 1) && integerAtLeast(parameters.numberB, 1);
  }
}

function smallestExactMatch(parameters: NsTrail001Parameters, answer: number) {
  if (parameters.canonicalProblemId !== "CP-003") return true;
  const target = required(parameters.zeroCount, "zeroCount");
  if (trailingZerosFactorial(answer) !== target) return false;
  for (let value = 0; value < answer; value += 1) {
    if (trailingZerosFactorial(value) === target) return false;
  }
  return true;
}

function answerRuleSatisfied(parameters: NsTrail001Parameters, answer: number) {
  switch (parameters.canonicalProblemId) {
    case "CP-001":
      return answer === trailingZerosFactorial(required(parameters.n, "n"));
    case "CP-002":
      return answer === factorialExpressionZeros(parameters.numeratorTerms ?? [], parameters.denominatorTerms ?? []);
    case "CP-003":
      return smallestExactMatch(parameters, answer);
    case "CP-004":
    case "CP-005":
      return answer === Math.min(twoCountFor(parameters) ?? 0, fiveCountFor(parameters) ?? 0);
  }
}

function twoCountFor(parameters: NsTrail001Parameters) {
  if (parameters.canonicalProblemId === "CP-004") return factorCount(required(parameters.base, "base"), 2) * required(parameters.exponent, "exponent");
  if (parameters.canonicalProblemId === "CP-005") return factorCount(required(parameters.numberA, "numberA"), 2) + factorCount(required(parameters.numberB, "numberB"), 2);
  return undefined;
}

function fiveCountFor(parameters: NsTrail001Parameters) {
  if (parameters.canonicalProblemId === "CP-004") return factorCount(required(parameters.base, "base"), 5) * required(parameters.exponent, "exponent");
  if (parameters.canonicalProblemId === "CP-005") return factorCount(required(parameters.numberA, "numberA"), 5) + factorCount(required(parameters.numberB, "numberB"), 5);
  return undefined;
}

export function factorizationObject(number: number) {
  return Object.fromEntries(primeFactorize(number));
}

function required(value: number | undefined, name: string) {
  if (typeof value !== "number") throw new Error(`NS-TRAIL-001 missing required parameter ${name}.`);
  return value;
}

function integerAtLeast(value: number | undefined, minimum: number) {
  return typeof value === "number" && Number.isInteger(value) && value >= minimum;
}
