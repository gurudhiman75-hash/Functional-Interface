import {
  buildMathJax,
  countCommonMultiplesInRange,
  firstCommonMultipleGreaterThan,
  lcmOf,
  lcmTerms,
  mathJaxPresent,
  pairwiseCoprime,
  primeFactorize,
} from "./math";
import type { NsLcm001Parameters, NsLcm001SolverResult } from "./types";

export function solveNsLcm001(parameters: NsLcm001Parameters): NsLcm001SolverResult {
  const answer = answerFor(parameters);
  const validCandidates = parameters.canonicalProblemId === "CP-003" ? validCp003Candidates(parameters) : [];
  const numbers = numbersFor(parameters, answer);
  const lcm = parameters.canonicalProblemId === "CP-003" ? parameters.targetLcm ?? lcmOf(numbers) : lcmOf(numbers);
  const mathJax = buildMathJax(parameters, answer, validCandidates);
  const terms = lcmTerms(numbers);
  const rangeWidth = parameters.canonicalProblemId === "CP-004" && typeof parameters.lowerBound === "number" && typeof parameters.upperBound === "number" ? parameters.upperBound - parameters.lowerBound + 1 : undefined;
  const thresholdIsMultiple = parameters.canonicalProblemId === "CP-005" && typeof parameters.threshold === "number" ? parameters.threshold % lcm === 0 : undefined;
  const result: NsLcm001SolverResult = {
    archetypeId: parameters.archetypeId,
    canonicalProblemId: parameters.canonicalProblemId,
    topology: parameters.topology,
    numbers,
    cycleLengths: parameters.cycleLengths,
    cycleContext: parameters.cycleContext,
    knownNumbers: parameters.knownNumbers,
    targetLcm: parameters.targetLcm,
    cp003Family: parameters.cp003Family,
    candidateValues: parameters.candidateValues ?? [],
    validCandidates,
    missingNumber: parameters.canonicalProblemId === "CP-003" ? answer : undefined,
    lowerBound: parameters.lowerBound,
    upperBound: parameters.upperBound,
    threshold: parameters.threshold,
    lcm,
    answer,
    operandPrimeFactorizations: numbers.map((number) => primeFactorize(number)),
    lcmPrimeFactorization: primeFactorize(lcm),
    distinctPrimeBaseCount: terms.length,
    maximumExponent: terms.reduce((max, term) => Math.max(max, term.exponent), 0),
    operandCount: numbers.length,
    pairwiseCoprime: pairwiseCoprime(numbers),
    nonCoprime: !pairwiseCoprime(numbers),
    rangeWidth,
    zeroCountCase: parameters.canonicalProblemId === "CP-004" ? answer === 0 : undefined,
    positiveCountCase: parameters.canonicalProblemId === "CP-004" ? answer > 0 : undefined,
    thresholdIsMultiple,
    thresholdNotMultiple: typeof thresholdIsMultiple === "boolean" ? !thresholdIsMultiple : undefined,
    exactLcmMatch: parameters.canonicalProblemId === "CP-003" ? validCandidates.length === 1 && lcmOf([...(parameters.knownNumbers ?? []), validCandidates[0]]) === parameters.targetLcm : undefined,
    ...mathJax,
    verification: {
      inputValid: numbers.every((number) => Number.isInteger(number) && number > 0),
      lcmValid: numbers.every((number) => lcm % number === 0),
      countValid: parameters.canonicalProblemId !== "CP-004" || answer === countCommonMultiplesInRange(parameters.numbers, parameters.lowerBound ?? 1, parameters.upperBound ?? 1),
      thresholdValid: parameters.canonicalProblemId !== "CP-005" || answer === firstCommonMultipleGreaterThan(parameters.numbers, parameters.threshold ?? 0),
      uniquenessValid: parameters.canonicalProblemId !== "CP-003" || validCandidates.length === 1,
      mathJaxValid: mathJaxPresent(mathJax),
      answerRuleSatisfied: answerRuleSatisfied(parameters, answer, lcm, validCandidates),
    },
  };
  return result;
}

export function validCp003Candidates(parameters: NsLcm001Parameters) {
  if (parameters.canonicalProblemId !== "CP-003") return [];
  const known = parameters.knownNumbers ?? [];
  const target = parameters.targetLcm;
  if (!target) return [];
  return (parameters.candidateValues ?? []).filter((value) => lcmOf([...known, value]) === target && satisfiesExtraCondition(parameters, value));
}

function answerFor(parameters: NsLcm001Parameters) {
  switch (parameters.canonicalProblemId) {
    case "CP-001":
      return lcmOf(parameters.numbers);
    case "CP-002":
      return lcmOf(parameters.cycleLengths ?? parameters.numbers);
    case "CP-003": {
      const candidates = validCp003Candidates(parameters);
      if (candidates.length !== 1) throw new Error(`NS-LCM-001 CP-003 must have exactly one valid answer; found ${candidates.length}.`);
      return candidates[0];
    }
    case "CP-004":
      return countCommonMultiplesInRange(parameters.numbers, parameters.lowerBound ?? 1, parameters.upperBound ?? 1);
    case "CP-005":
      return firstCommonMultipleGreaterThan(parameters.numbers, parameters.threshold ?? 0);
  }
}

function numbersFor(parameters: NsLcm001Parameters, answer: number) {
  if (parameters.canonicalProblemId === "CP-002") return parameters.cycleLengths ?? parameters.numbers;
  if (parameters.canonicalProblemId === "CP-003") return [...(parameters.knownNumbers ?? []), answer];
  return parameters.numbers;
}

function satisfiesExtraCondition(parameters: NsLcm001Parameters, value: number) {
  switch (parameters.cp003Family) {
    case "candidate_list":
      return (parameters.candidateValues ?? []).includes(value);
    case "bounded_range":
      return Boolean(typeof parameters.lowerBound === "number" && typeof parameters.upperBound === "number" && value >= parameters.lowerBound && value <= parameters.upperBound);
    case "divisibility_condition":
      return Boolean(parameters.divisor && value % parameters.divisor === 0);
    case "arithmetic_condition":
      return Boolean(typeof parameters.upperBound === "number" && value % 2 === 0 && value < parameters.upperBound);
    default:
      return true;
  }
}

function answerRuleSatisfied(parameters: NsLcm001Parameters, answer: number, lcm: number, validCandidates: readonly number[]) {
  switch (parameters.canonicalProblemId) {
    case "CP-001":
    case "CP-002":
      return answer === lcm;
    case "CP-003":
      return validCandidates.length === 1 && validCandidates[0] === answer && lcm === parameters.targetLcm;
    case "CP-004":
      return answer === countCommonMultiplesInRange(parameters.numbers, parameters.lowerBound ?? 1, parameters.upperBound ?? 1);
    case "CP-005":
      return answer === firstCommonMultipleGreaterThan(parameters.numbers, parameters.threshold ?? 0);
  }
}
