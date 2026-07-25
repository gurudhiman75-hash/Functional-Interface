import type {
  Pnc002AnyParameters,
  Pnc002IndependentVerification,
  Pnc002ReasoningEvidence,
  Pnc002SolverResult,
} from "./types";

export function buildPnc002Cp009SaturationReasoningEvidence(
  parameters: Pnc002AnyParameters,
  solver: Pnc002SolverResult,
  verification: Pnc002IndependentVerification,
): Pnc002ReasoningEvidence {
  const e = solver.evidence;
  return {
    conceptId: parameters.solveMode === "countSpecifiedMemberRange"
      ? "PNC-SELECTION-SPECIFIED-RANGE"
      : "PNC-SELECTION-TWO-CATEGORY-RANGE",
    givens: {
      totalObjects: e.totalObjects,
      committeeSize: e.committeeSize ?? "",
      restriction: parameters.constraintProfile,
      scenario: parameters.scenarioFamily,
    },
    equations: [`\\(${solver.mathJax}\\)`],
    intermediateValues: {
      specifiedCount: e.specifiedCount ?? "",
      minimumSpecified: e.minimumSpecified ?? "",
      maximumSpecified: e.maximumSpecified ?? "",
      categorySizes: e.categorySizes?.join(", ") ?? "",
      minimumFromA: e.minimumFromA ?? "",
      maximumFromA: e.maximumFromA ?? "",
      minimumFromB: e.minimumFromB ?? "",
      acceptedSelectionCounts: e.acceptedSelectionCounts?.join(", ") ?? "",
      selectionCaseCounts: e.selectionCaseCounts?.join(" + ") ?? "",
    },
    decisiveCalculation: `\\(${solver.mathJax}\\)`,
    verification: `${verification.method}; verified answer ${verification.answer}.`,
  };
}
