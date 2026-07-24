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
} as const;

export function buildPnc001ReasoningEvidence(
  parameters: Pnc001Parameters,
  solver: Pnc001SolverResult,
  verification: Pnc001IndependentVerification,
): Pnc001ReasoningEvidence {
  const intermediateValues: Record<string, string | number> = {};
  if (solver.evidence.totalCount !== undefined) intermediateValues.totalCount = solver.evidence.totalCount;
  if (solver.evidence.invalidCount !== undefined) intermediateValues.invalidCount = solver.evidence.invalidCount;
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
