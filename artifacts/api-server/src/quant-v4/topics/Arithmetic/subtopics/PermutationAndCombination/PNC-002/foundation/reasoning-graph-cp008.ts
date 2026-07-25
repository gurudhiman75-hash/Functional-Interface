import type {
  Pnc002IndependentVerification,
  Pnc002AnyParameters,
  Pnc002ReasoningEvidence,
  Pnc002SolverResult,
} from "./types";

export function buildPnc002Cp008ReasoningEvidence(
  parameters: Pnc002AnyParameters,
  solver: Pnc002SolverResult,
  verification: Pnc002IndependentVerification,
): Pnc002ReasoningEvidence {
  const e = solver.evidence;
  const conceptId: Record<string, string> = {
    countObjectAtExactPosition: "PNC-LINEAR-EXACT-POSITION",
    countObjectAtEitherEnd: "PNC-LINEAR-EITHER-END",
    countSpecifiedObjectsAtBothEnds: "PNC-LINEAR-BOTH-ENDS",
    countObjectExcludedFromEnds: "PNC-LINEAR-EXCLUDED-ENDS",
    countPrescribedRelativeOrder: "PNC-LINEAR-RELATIVE-ORDER",
    countIndependentRelativeOrderChains: "PNC-LINEAR-INDEPENDENT-ORDER-CHAINS",
    countStrictAlternation: "PNC-LINEAR-ALTERNATION",
    countNoTwoCategoryMembersAdjacent: "PNC-LINEAR-GAP-PLACEMENT",
    countExactGapBetweenPair: "PNC-LINEAR-EXACT-GAP",
    countAtLeastGapBetweenPair: "PNC-LINEAR-AT-LEAST-GAP",
    countSpecifiedObjectsInPositionClass: "PNC-LINEAR-POSITION-CLASS",
    recoverPositionGapParameter: "PNC-LINEAR-GAP-INVERSE",
  };
  return {
    conceptId: conceptId[parameters.solveMode] ?? "PNC-LINEAR-POSITION-GAP",
    givens: {
      totalObjects: e.totalObjects,
      restriction: parameters.constraintProfile,
      scenario: parameters.scenarioFamily,
    },
    equations: [`\\(${solver.mathJax}\\)`],
    intermediateValues: {
      fixedPosition: e.fixedPosition ?? "",
      allowedPositionCount: e.allowedPositionCount ?? "",
      chainLengths: e.chainLengths?.join(", ") ?? "",
      relativeOrderDivisor: e.relativeOrderDivisor ?? "",
      largeCount: e.largeCount ?? "",
      smallCount: e.smallCount ?? "",
      orientationCount: e.orientationCount ?? "",
      gapSlotCount: e.gapSlotCount ?? "",
      gapCount: e.gapCount ?? "",
      minimumGap: e.minimumGap ?? "",
      orderedPositionPairCount: e.orderedPositionPairCount ?? "",
      specifiedCount: e.specifiedCount ?? "",
      requiredInClass: e.requiredInClass ?? "",
      eligibleClassPositions: e.eligibleClassPositions ?? "",
      target: e.target ?? "",
    },
    decisiveCalculation: `\\(${solver.mathJax}\\)`,
    verification: `${verification.method}; verified answer ${verification.answer}.`,
  };
}
