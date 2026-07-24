import type {
  Pnc001IndependentVerification,
  Pnc001Parameters,
  Pnc001ReasoningEvidence,
  Pnc001SolverResult,
} from "./types";

const CONCEPT_IDS = {
  countSequentialIndependentChoices: "FUNDAMENTAL_COUNTING_PRODUCT",
  countMutuallyExclusiveAlternatives: "FUNDAMENTAL_COUNTING_SUM",
  countDisjointCasePartition: "DISJOINT_CASE_PARTITION",
  countUsingSimpleComplement: "SIMPLE_COMPLEMENT",
  recoverMissingStageChoiceCount: "EXACT_FACTOR_RECOVERY",
  evaluateFactorialValue: "FACTORIAL_DEFINITION",
  evaluateFactorialUnitExpression: "FACTORIAL_ZERO_ONE_IDENTITY",
  simplifyFactorialQuotient: "FACTORIAL_CANCELLATION",
  recoverFactorialArgument: "FACTORIAL_INVERSE_SEARCH",
  recoverFactorialQuotientArgument: "FACTORIAL_QUOTIENT_INVERSE_SEARCH",
} as const;

export function buildPnc001ReasoningEvidence(
  parameters: Pnc001Parameters,
  solver: Pnc001SolverResult,
  verification: Pnc001IndependentVerification,
): Pnc001ReasoningEvidence {
  const intermediateValues: Record<string, string | number> = {};
  if (solver.evidence.totalCount !== undefined) intermediateValues.totalCount = solver.evidence.totalCount;
  if (solver.evidence.invalidCount !== undefined) intermediateValues.invalidCount = solver.evidence.invalidCount;
  if (solver.evidence.factorialArgument !== undefined) intermediateValues.factorialArgument = solver.evidence.factorialArgument;
  if (solver.evidence.factorialValue !== undefined) intermediateValues.factorialValue = solver.evidence.factorialValue;
  if (solver.evidence.factorialUpper !== undefined) intermediateValues.factorialUpper = solver.evidence.factorialUpper;
  if (solver.evidence.factorialLower !== undefined) intermediateValues.factorialLower = solver.evidence.factorialLower;
  if (solver.evidence.factorialTarget !== undefined) intermediateValues.factorialTarget = solver.evidence.factorialTarget;
  if (solver.evidence.matchedFactorialArgument !== undefined) {
    intermediateValues.matchedFactorialArgument = solver.evidence.matchedFactorialArgument;
  }
  for (const item of solver.evidence.caseCounts ?? []) intermediateValues[`case${item.label}Count`] = item.count;

  return {
    conceptId: CONCEPT_IDS[parameters.solveMode],
    givens: { ...parameters.renderVariables },
    equations: [solver.equation],
    intermediateValues,
    decisiveCalculation: solver.equation,
    verification: `${verification.method}: ${verification.answer}`,
  };
}