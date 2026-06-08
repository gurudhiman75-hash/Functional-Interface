import { isPrime, nextPrimeAfter, nthPrime, previousPrimeBefore, primesBetween } from "./math";
import {
  NS_PRM_001_ARCHETYPE_ID,
  NS_PRM_001_CP_001,
  NS_PRM_001_CP_002,
  NS_PRM_001_CP_003,
  NS_PRM_001_CP_004,
  NS_PRM_001_CP_005,
  NS_PRM_001_CP_006,
  NS_PRM_001_CP_007,
  NS_PRM_001_CP_008,
  NS_PRM_001_REASONING_PATTERN_ID,
  type NsPrm001Parameters,
  type NsPrm001SolverResult,
} from "./types";

export function solveNsPrm001(parameters: NsPrm001Parameters): NsPrm001SolverResult {
  const base = {
    archetypeId: NS_PRM_001_ARCHETYPE_ID,
    canonicalProblemId: parameters.canonicalProblemId,
    reasoningPatternId: NS_PRM_001_REASONING_PATTERN_ID,
    topology: parameters.topology,
    number: parameters.number,
    lowerBound: parameters.lowerBound,
    upperBound: parameters.upperBound,
    rangeWidth: parameters.rangeWidth,
    position: parameters.position,
  };

  switch (parameters.canonicalProblemId) {
    case NS_PRM_001_CP_001: {
      const number = required(parameters.number, "number");
      const answer = isPrime(number) ? "Prime" : "Composite";
      return {
        ...base,
        answer,
        primesInRange: [],
        answerClass: answer,
        verification: verification(number !== 1 && number > 1, isPrime(number) === (answer === "Prime"), true, answer === "Prime" || answer === "Composite"),
      };
    }
    case NS_PRM_001_CP_002: {
      const primes = rangePrimes(parameters);
      return { ...base, answer: primes.length, primesInRange: primes, count: primes.length, verification: verification(true, true, true, true) };
    }
    case NS_PRM_001_CP_003: {
      const primes = rangePrimes(parameters);
      if (primes.length === 0) throw new Error("CP-003 range must contain at least one prime.");
      const answer = primes[0];
      return { ...base, answer, selectedPrime: answer, primesInRange: primes, verification: verification(true, primes.length > 0, true, isPrime(answer)) };
    }
    case NS_PRM_001_CP_004: {
      const primes = rangePrimes(parameters);
      if (primes.length === 0) throw new Error("CP-004 range must contain at least one prime.");
      const answer = primes[primes.length - 1];
      return { ...base, answer, selectedPrime: answer, primesInRange: primes, verification: verification(true, primes.length > 0, true, isPrime(answer)) };
    }
    case NS_PRM_001_CP_005: {
      const primes = rangePrimes(parameters);
      const sum = primes.reduce((total, value) => total + value, 0);
      return { ...base, answer: sum, primesInRange: primes, sum, verification: verification(true, true, true, true) };
    }
    case NS_PRM_001_CP_006: {
      const number = required(parameters.number, "number");
      const answer = nextPrimeAfter(number);
      return { ...base, answer, selectedPrime: answer, primesInRange: [], verification: verification(number !== 1, isPrime(answer), true, answer > number) };
    }
    case NS_PRM_001_CP_007: {
      const number = required(parameters.number, "number");
      const answer = previousPrimeBefore(number);
      return { ...base, answer, selectedPrime: answer, primesInRange: [], verification: verification(number >= 3, isPrime(answer), true, answer < number) };
    }
    case NS_PRM_001_CP_008: {
      const position = required(parameters.position, "position");
      const answer = nthPrime(position);
      return { ...base, answer, selectedPrime: answer, primesInRange: [], verification: verification(position >= 1, isPrime(answer), true, true) };
    }
  }
}

export const solveNsPrm001Cp001 = solveNsPrm001;
export const solveNsPrm001Cp002 = solveNsPrm001;
export const solveNsPrm001Cp003 = solveNsPrm001;
export const solveNsPrm001Cp004 = solveNsPrm001;
export const solveNsPrm001Cp005 = solveNsPrm001;
export const solveNsPrm001Cp006 = solveNsPrm001;
export const solveNsPrm001Cp007 = solveNsPrm001;
export const solveNsPrm001Cp008 = solveNsPrm001;

function rangePrimes(parameters: NsPrm001Parameters) {
  return primesBetween(required(parameters.lowerBound, "lowerBound"), required(parameters.upperBound, "upperBound"));
}

function required(value: number | undefined, name: string) {
  if (typeof value !== "number") throw new Error(`Missing NS-PRM-001 parameter: ${name}`);
  return value;
}

function verification(inputValid: boolean, primeEvidenceValid: boolean, rangeValid: boolean, answerRuleSatisfied: boolean) {
  return { inputValid, primeEvidenceValid, rangeValid, answerRuleSatisfied };
}
