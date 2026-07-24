import type { Pnc001Cp006SolveMode, Pnc001IndependentVerification, Pnc001Parameters, Pnc001ReasoningEvidence, Pnc001SolverResult } from "./types";

const CONCEPT_IDS: Record<Pnc001Cp006SolveMode, string> = {
  selectThenAssignDistinctRoles: "MIXED_SELECTION_THEN_DISTINCT_ROLES",
  selectThenArrangeAllSelected: "MIXED_SELECTION_THEN_FULL_ARRANGEMENT",
  findRoleAssignmentMultiplier: "MIXED_ROLE_ASSIGNMENT_MULTIPLIER",
  recoverSelectionRoleParameter: "MIXED_SELECTION_ROLE_INVERSE_SEARCH",
};

export function buildPnc001Cp006ReasoningEvidence(
  parameters: Pnc001Parameters,
  solver: Pnc001SolverResult,
  verification: Pnc001IndependentVerification,
): Pnc001ReasoningEvidence {
  const mode = parameters.solveMode as unknown as Pnc001Cp006SolveMode;
  const evidence = solver.evidence;
  const intermediateValues: Record<string, string | number> = {};
  for (const [key, value] of Object.entries({
    totalObjects: evidence.mixedTotalObjects,
    selectedObjects: evidence.mixedSelectedObjects,
    roleCount: evidence.mixedRoleCount,
    selectionCount: evidence.mixedSelectionCount,
    roleAssignmentCount: evidence.mixedRoleAssignmentCount,
    equivalentPermutationCount: evidence.mixedEquivalentPermutationCount,
    target: evidence.mixedTarget,
    searchMinimum: evidence.mixedSearchMinimum,
    searchMaximum: evidence.mixedSearchMaximum,
    recoveredParameter: evidence.recoveredMixedParameter,
  })) if (value !== undefined) intermediateValues[key] = value;

  return {
    conceptId: CONCEPT_IDS[mode],
    givens: { ...parameters.renderVariables },
    equations: [solver.equation],
    intermediateValues,
    decisiveCalculation: solver.equation,
    verification: `${verification.method}: ${verification.answer}`,
  };
}
