import {
  classifyInput,
  exponentOfPrime,
  formatFactorizationAnswer,
  isPrime,
  numberShape,
  primeFactorize,
  primePower,
  validateFactorizationProduct,
} from "./math";
import {
  NS_PF_001_ARCHETYPE_ID,
  NS_PF_001_CP_001,
  NS_PF_001_CP_002,
  NS_PF_001_CP_003,
  NS_PF_001_CP_004,
  NS_PF_001_CP_005,
  NS_PF_001_CP_006,
  NS_PF_001_CP_007,
  type NsPf001Parameters,
  type NsPf001SolverResult,
} from "./types";

export function solveNsPf001(parameters: NsPf001Parameters): NsPf001SolverResult {
  const factorization = primeFactorize(parameters.number);
  const selectedPrime = parameters.prime;
  const selectedExponent = typeof selectedPrime === "number" ? exponentOfPrime(factorization, selectedPrime) : undefined;
  const selectedPrimePower =
    typeof selectedPrime === "number" && typeof selectedExponent === "number" && selectedExponent > 0
      ? primePower(selectedPrime, selectedExponent)
      : undefined;

  const base = {
    archetypeId: NS_PF_001_ARCHETYPE_ID,
    canonicalProblemId: parameters.canonicalProblemId,
    topology: parameters.topology,
    number: parameters.number,
    prime: parameters.prime,
    factorization,
    factorizationText: factorization.factorizationText,
    factorizationLatex: factorization.factorizationLatex,
    selectedPrime,
    selectedExponent,
    selectedPrimePower,
    inputClass: classifyInput(parameters.number),
    numberShape: numberShape(factorization),
  };

  switch (parameters.canonicalProblemId) {
    case NS_PF_001_CP_001:
      return withVerification({ ...base, answer: formatFactorizationAnswer(factorization) });
    case NS_PF_001_CP_002:
      return withVerification({ ...base, answer: factorization.totalPrimeFactorCount });
    case NS_PF_001_CP_003:
      return withVerification({ ...base, answer: factorization.distinctPrimeFactorCount });
    case NS_PF_001_CP_004:
      return withVerification({ ...base, answer: factorization.largestPrimeFactor });
    case NS_PF_001_CP_005:
      return withVerification({ ...base, answer: factorization.smallestPrimeFactor });
    case NS_PF_001_CP_006:
      assertSelectedPrime(parameters.number, selectedPrime, selectedExponent, selectedPrimePower);
      return withVerification({ ...base, answer: selectedPrimePower });
    case NS_PF_001_CP_007:
      assertSelectedPrime(parameters.number, selectedPrime, selectedExponent, selectedPrimePower);
      return withVerification({ ...base, answer: selectedExponent });
  }
}

export const solveNsPf001Cp001 = solveNsPf001;
export const solveNsPf001Cp002 = solveNsPf001;
export const solveNsPf001Cp003 = solveNsPf001;
export const solveNsPf001Cp004 = solveNsPf001;
export const solveNsPf001Cp005 = solveNsPf001;
export const solveNsPf001Cp006 = solveNsPf001;
export const solveNsPf001Cp007 = solveNsPf001;

function withVerification(input: Omit<NsPf001SolverResult, "verification">): NsPf001SolverResult {
  return {
    ...input,
    verification: {
      inputValid: Number.isInteger(input.number) && input.number > 1,
      factorizationCorrect: validateFactorizationProduct(input.factorization),
      selectedPrimeValid: selectedPrimeValid(input),
      answerRuleSatisfied: answerRuleSatisfied(input),
      mathJaxValid: input.factorizationLatex.includes("=") && (input.factorization.terms.length === 1 || input.factorizationLatex.includes("\\times")),
    },
  };
}

function assertSelectedPrime(number: number, selectedPrime: number | undefined, selectedExponent: number | undefined, selectedPrimePower: number | undefined) {
  if (typeof selectedPrime !== "number") throw new Error("NS-PF-001 selected prime is required.");
  if (!isPrime(selectedPrime)) throw new Error(`NS-PF-001 selected prime must be prime: ${selectedPrime}`);
  if (typeof selectedExponent !== "number" || selectedExponent < 1) {
    throw new Error(`NS-PF-001 selected prime must divide ${number}: ${selectedPrime}`);
  }
  if (typeof selectedPrimePower !== "number" || number % selectedPrimePower !== 0) {
    throw new Error("NS-PF-001 selected prime power is invalid.");
  }
}

function selectedPrimeValid(input: Omit<NsPf001SolverResult, "verification">) {
  if (input.canonicalProblemId !== NS_PF_001_CP_006 && input.canonicalProblemId !== NS_PF_001_CP_007) return true;
  return (
    typeof input.selectedPrime === "number" &&
    isPrime(input.selectedPrime) &&
    typeof input.selectedExponent === "number" &&
    input.selectedExponent > 0 &&
    input.number % input.selectedPrime === 0
  );
}

function answerRuleSatisfied(input: Omit<NsPf001SolverResult, "verification">) {
  switch (input.canonicalProblemId) {
    case NS_PF_001_CP_001:
      return input.answer === formatFactorizationAnswer(input.factorization);
    case NS_PF_001_CP_002:
      return input.answer === input.factorization.totalPrimeFactorCount;
    case NS_PF_001_CP_003:
      return input.answer === input.factorization.distinctPrimeFactorCount;
    case NS_PF_001_CP_004:
      return input.answer === input.factorization.largestPrimeFactor;
    case NS_PF_001_CP_005:
      return input.answer === input.factorization.smallestPrimeFactor;
    case NS_PF_001_CP_006:
      return input.answer === input.selectedPrimePower && input.answer !== input.selectedExponent;
    case NS_PF_001_CP_007:
      return input.answer === input.selectedExponent;
  }
}
