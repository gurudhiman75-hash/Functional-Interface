import {
  NS_REM_001_ARCHETYPE_ID,
  NS_REM_001_CP_001,
  NS_REM_001_CP_002,
  NS_REM_001_CP_003,
  NS_REM_001_CP_004,
  NS_REM_001_CP_005,
  NS_REM_001_CP_006,
  NS_REM_001_CP_007,
  NS_REM_001_REASONING_PATTERN_ID,
  type NsRem001Parameters,
  type NsRem001SolverResult,
} from "./types";

export function solveNsRem001(parameters: NsRem001Parameters): NsRem001SolverResult {
  if (parameters.archetypeId !== NS_REM_001_ARCHETYPE_ID) {
    throw new Error("NS-REM-001 solver received an unsupported archetype.");
  }

  const candidateDigitSet = [...parameters.candidateDomain];
  const candidateEvaluations = candidateDigitSet.map((candidate) => {
    const resolvedNumber = Number(parameters.numberExpression.replace(parameters.missingDigitSymbol, String(candidate)));
    const remainder = resolvedNumber % parameters.divisor;
    return {
      candidate,
      resolvedNumber,
      remainder,
      isValid: remainder === parameters.targetRemainder,
    };
  });
  const validValueSet = candidateEvaluations.filter((entry) => entry.isValid).map((entry) => entry.candidate);
  const sortedValidValueSet = [...validValueSet].sort((left, right) => left - right);

  if (parameters.canonicalProblemId === NS_REM_001_CP_001 && sortedValidValueSet.length !== 1) {
    throw new Error("CP-001 requires exactly one valid value.");
  }
  if (sortedValidValueSet.length < 1) {
    throw new Error(`${parameters.canonicalProblemId} requires at least one valid value.`);
  }

  const smallestValidValue = sortedValidValueSet[0];
  const greatestValidValue = sortedValidValueSet[sortedValidValueSet.length - 1];
  const selectedValue = selectedValueFor(parameters.canonicalProblemId, smallestValidValue, greatestValidValue);
  const resolvedNumber = Number(parameters.numberExpression.replace(parameters.missingDigitSymbol, String(selectedValue)));
  const answer = answerFor(parameters, sortedValidValueSet, smallestValidValue, greatestValidValue, resolvedNumber);

  return {
    archetypeId: NS_REM_001_ARCHETYPE_ID,
    canonicalProblemId: parameters.canonicalProblemId,
    reasoningPatternId: NS_REM_001_REASONING_PATTERN_ID,
    candidateDigitSet,
    candidateEvaluations,
    validValueSet,
    sortedValidValueSet,
    selectedValue,
    smallestValidValue,
    greatestValidValue,
    formedNumber: isNumberFormationCp(parameters.canonicalProblemId) ? resolvedNumber : undefined,
    answer,
    answerDigit: answer,
    resolvedNumber,
    selectionMetadata: {
      sortingOrder: "Ascending",
      selectionRule: selectionRule(parameters.canonicalProblemId),
      validSetSize: sortedValidValueSet.length,
    },
    verification: {
      divisor: parameters.divisor,
      targetRemainder: parameters.targetRemainder,
      resolvedNumberRemainder: resolvedNumber % parameters.divisor,
      targetRemainderSatisfied: resolvedNumber % parameters.divisor === parameters.targetRemainder,
      answerRuleSatisfied: answerRuleSatisfied(parameters, answer, sortedValidValueSet, smallestValidValue, greatestValidValue, resolvedNumber),
    },
  };
}

export const solveCp001 = solveNsRem001;
export const solveCp002 = solveNsRem001;
export const solveCp003 = solveNsRem001;
export const solveCp004 = solveNsRem001;
export const solveCp005 = solveNsRem001;
export const solveCp006 = solveNsRem001;
export const solveCp007 = solveNsRem001;

function isNumberFormationCp(canonicalProblemId: string) {
  return canonicalProblemId === NS_REM_001_CP_006 || canonicalProblemId === NS_REM_001_CP_007;
}

function selectedValueFor(canonicalProblemId: string, smallestValidValue: number, greatestValidValue: number) {
  if (canonicalProblemId === NS_REM_001_CP_003 || canonicalProblemId === NS_REM_001_CP_007) return greatestValidValue;
  return smallestValidValue;
}

function answerFor(
  parameters: NsRem001Parameters,
  sortedValidValueSet: readonly number[],
  smallestValidValue: number,
  greatestValidValue: number,
  resolvedNumber: number,
) {
  switch (parameters.canonicalProblemId) {
    case NS_REM_001_CP_001:
      return sortedValidValueSet[0];
    case NS_REM_001_CP_002:
      return smallestValidValue;
    case NS_REM_001_CP_003:
      return greatestValidValue;
    case NS_REM_001_CP_004:
      return sortedValidValueSet.length;
    case NS_REM_001_CP_005:
      return sortedValidValueSet.reduce((sum, value) => sum + value, 0);
    case NS_REM_001_CP_006:
    case NS_REM_001_CP_007:
      return resolvedNumber;
  }
}

function selectionRule(canonicalProblemId: string) {
  switch (canonicalProblemId) {
    case NS_REM_001_CP_001:
      return "Unique Valid Value";
    case NS_REM_001_CP_002:
      return "Minimum(Valid Value Set)";
    case NS_REM_001_CP_003:
      return "Maximum(Valid Value Set)";
    case NS_REM_001_CP_004:
      return "Count(Valid Value Set)";
    case NS_REM_001_CP_005:
      return "Sum(Valid Value Set)";
    case NS_REM_001_CP_006:
      return "Number formed using Minimum(Valid Value Set)";
    case NS_REM_001_CP_007:
      return "Number formed using Maximum(Valid Value Set)";
    default:
      return "Unsupported";
  }
}

function answerRuleSatisfied(
  parameters: NsRem001Parameters,
  answer: number,
  sortedValidValueSet: readonly number[],
  smallestValidValue: number,
  greatestValidValue: number,
  resolvedNumber: number,
) {
  switch (parameters.canonicalProblemId) {
    case NS_REM_001_CP_001:
      return sortedValidValueSet.length === 1 && answer === sortedValidValueSet[0];
    case NS_REM_001_CP_002:
      return answer === smallestValidValue;
    case NS_REM_001_CP_003:
      return answer === greatestValidValue;
    case NS_REM_001_CP_004:
      return answer === sortedValidValueSet.length;
    case NS_REM_001_CP_005:
      return answer === sortedValidValueSet.reduce((sum, value) => sum + value, 0);
    case NS_REM_001_CP_006:
    case NS_REM_001_CP_007:
      return answer === resolvedNumber && resolvedNumber % parameters.divisor === parameters.targetRemainder;
  }
}
