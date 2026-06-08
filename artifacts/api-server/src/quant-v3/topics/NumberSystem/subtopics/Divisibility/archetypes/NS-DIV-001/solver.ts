import {
  NS_DIV_001_ARCHETYPE_ID,
  NS_DIV_001_CP_002_CANONICAL_PROBLEM_ID,
  NS_DIV_001_CP_003_CANONICAL_PROBLEM_ID,
  NS_DIV_001_CP_004_CANONICAL_PROBLEM_ID,
  NS_DIV_001_CP_005_CANONICAL_PROBLEM_ID,
  NS_DIV_001_CP_006_CANONICAL_PROBLEM_ID,
  NS_DIV_001_CP_007_CANONICAL_PROBLEM_ID,
  NS_DIV_001_CANONICAL_PROBLEM_ID,
  type Cp001Parameters,
  type Cp001SolverResult,
  type Cp002Parameters,
  type Cp002SolverResult,
  type Cp003Parameters,
  type Cp003SolverResult,
  type Cp004Parameters,
  type Cp005Parameters,
  type Cp006Parameters,
  type Cp007Parameters,
  type ValidDigitSetParameters,
} from "./types";
import { assertNsDiv001DivisorCapabilityAllowed } from "./realism-library";

export function solveCp001(parameters: Cp001Parameters): Cp001SolverResult {
  if (parameters.archetypeId !== NS_DIV_001_ARCHETYPE_ID) {
    throw new Error("NS-DIV-001 solver received an unsupported archetype.");
  }
  if (parameters.canonicalProblemId !== NS_DIV_001_CANONICAL_PROBLEM_ID) {
    throw new Error("NS-DIV-001 solver only supports CP-001 in the reference slice.");
  }
  const divisorCapability = assertNsDiv001DivisorCapabilityAllowed(parameters.divisor, parameters.canonicalProblemId);

  const knownDigitSum = parameters.knownDigits.reduce((sum, digit) => sum + digit, 0);
  const validCandidates = parameters.candidateDomain.filter((candidate) => {
    const resolvedNumber = Number(parameters.numberExpression.replace(parameters.missingDigitSymbol, String(candidate)));
    return resolvedNumber % parameters.divisor === 0;
  });

  if (validCandidates.length !== 1) {
    throw new Error("CP-001 parameter set must resolve to exactly one valid missing digit.");
  }

  const answerDigit = validCandidates[0];
  const resolvedNumber = Number(parameters.numberExpression.replace(parameters.missingDigitSymbol, String(answerDigit)));
  const digitSum = knownDigitSum + answerDigit;

  return {
    archetypeId: NS_DIV_001_ARCHETYPE_ID,
    canonicalProblemId: NS_DIV_001_CANONICAL_PROBLEM_ID,
    reasoningPatternId: divisorCapability.reasoningPattern.id,
    knownDigitSum,
    validCandidates,
    answerDigit,
    resolvedNumber,
    verification: {
      digitSum,
      divisor: parameters.divisor,
      isDivisible: resolvedNumber % parameters.divisor === 0,
    },
  };
}

export function solveCp002(parameters: Cp002Parameters): Cp002SolverResult {
  if (parameters.archetypeId !== NS_DIV_001_ARCHETYPE_ID) {
    throw new Error("NS-DIV-001 solver received an unsupported archetype.");
  }
  if (parameters.canonicalProblemId !== NS_DIV_001_CP_002_CANONICAL_PROBLEM_ID) {
    throw new Error("NS-DIV-001 CP-002 solver received an unsupported canonical problem.");
  }
  const divisorCapability = assertNsDiv001DivisorCapabilityAllowed(parameters.divisor, parameters.canonicalProblemId);
  const knownDigitSum = parameters.knownDigits.reduce((sum, digit) => sum + digit, 0);
  const candidateDigitSet = [...parameters.candidateDomain];
  const candidateEvaluations = candidateDigitSet.map((candidate) => {
    const resolvedNumber = Number(parameters.numberExpression.replace(parameters.missingDigitSymbol, String(candidate)));
    return {
      candidate,
      resolvedNumber,
      isValid: resolvedNumber % parameters.divisor === 0,
    };
  });
  const validDigitSet = candidateEvaluations.filter((candidate) => candidate.isValid).map((candidate) => candidate.candidate);
  const sortedValidDigitSet = [...validDigitSet].sort((left, right) => left - right);

  if (sortedValidDigitSet.length < 1) {
    throw new Error("CP-002 valid digit set must contain at least one digit.");
  }

  const largestValidDigit = sortedValidDigitSet[sortedValidDigitSet.length - 1];
  const resolvedNumber = Number(parameters.numberExpression.replace(parameters.missingDigitSymbol, String(largestValidDigit)));

  return {
    archetypeId: NS_DIV_001_ARCHETYPE_ID,
    canonicalProblemId: NS_DIV_001_CP_002_CANONICAL_PROBLEM_ID,
    reasoningPatternId: divisorCapability.reasoningPattern.id,
    knownDigitSum,
    candidateDigitSet,
    candidateEvaluations,
    validDigitSet,
    sortedValidDigitSet,
    largestValidDigit,
    answerDigit: largestValidDigit,
    resolvedNumber,
    selectionMetadata: {
      sortingOrder: "Ascending",
      selectionRule: "Select maximum element.",
      validSetSize: sortedValidDigitSet.length,
    },
    verification: {
      divisor: parameters.divisor,
      isDivisible: resolvedNumber % parameters.divisor === 0,
      selectedDigitIsMaximum: largestValidDigit === Math.max(...validDigitSet),
    },
  };
}

export function solveCp003(parameters: Cp003Parameters): Cp003SolverResult {
  return solveValidDigitSetCp(parameters);
}

export function solveCp004(parameters: Cp004Parameters): Cp003SolverResult {
  return solveValidDigitSetCp(parameters);
}

export function solveCp005(parameters: Cp005Parameters): Cp003SolverResult {
  return solveValidDigitSetCp(parameters);
}

export function solveCp006(parameters: Cp006Parameters): Cp003SolverResult {
  return solveValidDigitSetCp(parameters);
}

export function solveCp007(parameters: Cp007Parameters): Cp003SolverResult {
  return solveValidDigitSetCp(parameters);
}

function solveValidDigitSetCp(parameters: ValidDigitSetParameters): Cp003SolverResult {
  if (parameters.archetypeId !== NS_DIV_001_ARCHETYPE_ID) {
    throw new Error("NS-DIV-001 solver received an unsupported archetype.");
  }
  if (!isValidDigitSetCanonicalProblem(parameters.canonicalProblemId)) {
    throw new Error("NS-DIV-001 valid digit set solver received an unsupported canonical problem.");
  }
  const divisorCapability = assertNsDiv001DivisorCapabilityAllowed(parameters.divisor, parameters.canonicalProblemId);
  const knownDigitSum = parameters.knownDigits.reduce((sum, digit) => sum + digit, 0);
  const candidateDigitSet = [...parameters.candidateDomain];
  const candidateEvaluations = candidateDigitSet.map((candidate) => {
    const resolvedNumber = Number(parameters.numberExpression.replace(parameters.missingDigitSymbol, String(candidate)));
    return {
      candidate,
      resolvedNumber,
      isValid: resolvedNumber % parameters.divisor === 0,
    };
  });
  const validDigitSet = candidateEvaluations.filter((candidate) => candidate.isValid).map((candidate) => candidate.candidate);
  const sortedValidDigitSet = [...validDigitSet].sort((left, right) => left - right);

  if (sortedValidDigitSet.length < 1) {
    throw new Error("CP-003 valid digit set must contain at least one digit.");
  }

  const smallestValidDigit = sortedValidDigitSet[0];
  const largestValidDigit = sortedValidDigitSet[sortedValidDigitSet.length - 1];
  const selectedDigit =
    parameters.canonicalProblemId === NS_DIV_001_CP_006_CANONICAL_PROBLEM_ID ? largestValidDigit : smallestValidDigit;
  const resolvedNumber = Number(parameters.numberExpression.replace(parameters.missingDigitSymbol, String(selectedDigit)));
  const answer = extractValidDigitSetAnswer(parameters, sortedValidDigitSet, smallestValidDigit, largestValidDigit, resolvedNumber);

  return {
    archetypeId: NS_DIV_001_ARCHETYPE_ID,
    canonicalProblemId: parameters.canonicalProblemId,
    reasoningPatternId: divisorCapability.reasoningPattern.id,
    knownDigitSum,
    candidateDigitSet,
    candidateEvaluations,
    validDigitSet,
    sortedValidDigitSet,
    selectedDigit,
    smallestValidDigit,
    largestValidDigit,
    answer,
    answerDigit: answer,
    resolvedNumber,
    selectionMetadata: {
      sortingOrder: "Ascending",
      selectionRule: selectionRule(parameters.canonicalProblemId),
      validSetSize: sortedValidDigitSet.length,
    },
    verification: {
      divisor: parameters.divisor,
      isDivisible:
        parameters.canonicalProblemId === NS_DIV_001_CP_004_CANONICAL_PROBLEM_ID ||
        parameters.canonicalProblemId === NS_DIV_001_CP_005_CANONICAL_PROBLEM_ID ||
        resolvedNumber % parameters.divisor === 0,
      answerRuleSatisfied: answerRuleSatisfied(parameters.canonicalProblemId, answer, sortedValidDigitSet, resolvedNumber),
    },
  };
}

function isValidDigitSetCanonicalProblem(canonicalProblemId: string) {
  return [
    NS_DIV_001_CP_003_CANONICAL_PROBLEM_ID,
    NS_DIV_001_CP_004_CANONICAL_PROBLEM_ID,
    NS_DIV_001_CP_005_CANONICAL_PROBLEM_ID,
    NS_DIV_001_CP_006_CANONICAL_PROBLEM_ID,
    NS_DIV_001_CP_007_CANONICAL_PROBLEM_ID,
  ].includes(canonicalProblemId as typeof NS_DIV_001_CP_003_CANONICAL_PROBLEM_ID);
}

function extractValidDigitSetAnswer(
  parameters: ValidDigitSetParameters,
  sortedValidDigitSet: readonly number[],
  smallestValidDigit: number,
  largestValidDigit: number,
  resolvedNumber: number,
) {
  switch (parameters.canonicalProblemId) {
    case NS_DIV_001_CP_003_CANONICAL_PROBLEM_ID:
      return smallestValidDigit;
    case NS_DIV_001_CP_004_CANONICAL_PROBLEM_ID:
      return sortedValidDigitSet.length;
    case NS_DIV_001_CP_005_CANONICAL_PROBLEM_ID:
      return sortedValidDigitSet.reduce((sum, digit) => sum + digit, 0);
    case NS_DIV_001_CP_006_CANONICAL_PROBLEM_ID:
      return Number(parameters.numberExpression.replace(parameters.missingDigitSymbol, String(largestValidDigit)));
    case NS_DIV_001_CP_007_CANONICAL_PROBLEM_ID:
      return resolvedNumber;
    default:
      throw new Error("Unsupported valid digit set answer extraction.");
  }
}

function selectionRule(canonicalProblemId: ValidDigitSetParameters["canonicalProblemId"]) {
  switch (canonicalProblemId) {
    case NS_DIV_001_CP_003_CANONICAL_PROBLEM_ID:
      return "Minimum(Valid Digit Set)";
    case NS_DIV_001_CP_004_CANONICAL_PROBLEM_ID:
      return "Count(Valid Digit Set)";
    case NS_DIV_001_CP_005_CANONICAL_PROBLEM_ID:
      return "Sum(Valid Digit Set)";
    case NS_DIV_001_CP_006_CANONICAL_PROBLEM_ID:
      return "Number formed using Maximum(Valid Digit Set)";
    case NS_DIV_001_CP_007_CANONICAL_PROBLEM_ID:
      return "Number formed using Minimum(Valid Digit Set)";
  }
}

function answerRuleSatisfied(
  canonicalProblemId: ValidDigitSetParameters["canonicalProblemId"],
  answer: number,
  sortedValidDigitSet: readonly number[],
  resolvedNumber: number,
) {
  switch (canonicalProblemId) {
    case NS_DIV_001_CP_003_CANONICAL_PROBLEM_ID:
      return answer === sortedValidDigitSet[0];
    case NS_DIV_001_CP_004_CANONICAL_PROBLEM_ID:
      return answer === sortedValidDigitSet.length;
    case NS_DIV_001_CP_005_CANONICAL_PROBLEM_ID:
      return answer === sortedValidDigitSet.reduce((sum, digit) => sum + digit, 0);
    case NS_DIV_001_CP_006_CANONICAL_PROBLEM_ID:
    case NS_DIV_001_CP_007_CANONICAL_PROBLEM_ID:
      return answer === resolvedNumber;
  }
}
