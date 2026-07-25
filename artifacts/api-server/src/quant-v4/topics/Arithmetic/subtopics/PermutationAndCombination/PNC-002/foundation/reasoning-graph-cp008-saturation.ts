import type {
  Pnc002AnyParameters,
  Pnc002IndependentVerification,
  Pnc002ReasoningEvidence,
  Pnc002SolverResult,
} from "./types";

export function buildPnc002Cp008SaturationReasoningEvidence(
  parameters: Pnc002AnyParameters,
  solver: Pnc002SolverResult,
  verification: Pnc002IndependentVerification,
): Pnc002ReasoningEvidence {
  const e = solver.evidence;
  const conceptId: Record<string, string> = {
    countObjectsAtPrescribedPositions: "PNC-LINEAR-MULTIPLE-PRESCRIBED-POSITIONS",
    countSpecifiedSetInPositionSet: "PNC-LINEAR-SPECIFIED-SET-POSITIONS",
    countAtMostGapBetweenPair: "PNC-LINEAR-AT-MOST-GAP",
    countDirectionalExactGapBetweenPair: "PNC-LINEAR-DIRECTIONAL-EXACT-GAP",
    countAtLeastSpecifiedObjectsInPositionClass: "PNC-LINEAR-AT-LEAST-POSITION-CLASS",
  };

  return {
    conceptId: conceptId[parameters.solveMode] ?? "PNC-LINEAR-POSITION-GAP-SATURATION",
    givens: {
      totalObjects: e.totalObjects,
      restriction: parameters.constraintProfile,
      scenario: parameters.scenarioFamily,
    },
    equations: [`\\(${solver.mathJax}\\)`],
    intermediateValues: {
      prescribedObjectCount: e.prescribedObjectCount ?? "",
      remainingObjects: e.remainingObjects ?? "",
      positionSetAssignmentCount: e.positionSetAssignmentCount ?? "",
      maximumGap: e.maximumGap ?? "",
      gapCount: e.gapCount ?? "",
      orderedPositionPairCount: e.orderedPositionPairCount ?? "",
      directionalPositionPairCount: e.directionalPositionPairCount ?? "",
      specifiedCount: e.specifiedCount ?? "",
      minimumInClass: e.minimumInClass ?? "",
      eligibleClassPositions: e.eligibleClassPositions ?? "",
      acceptedClassCounts: e.acceptedClassCounts?.join(", ") ?? "",
      positionClassCaseCounts: e.positionClassCaseCounts?.join(" + ") ?? "",
    },
    decisiveCalculation: `\\(${solver.mathJax}\\)`,
    verification: `${verification.method}; verified answer ${verification.answer}.`,
  };
}
