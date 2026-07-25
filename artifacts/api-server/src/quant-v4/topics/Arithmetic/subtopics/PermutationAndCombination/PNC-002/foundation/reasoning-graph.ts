import type {
  Pnc002IndependentVerification,
  Pnc002Parameters,
  Pnc002ReasoningEvidence,
  Pnc002SolverResult,
} from "./types";

export function buildPnc002ReasoningEvidence(
  parameters: Pnc002Parameters,
  solver: Pnc002SolverResult,
  verification: Pnc002IndependentVerification,
): Pnc002ReasoningEvidence {
  const evidence = solver.evidence;
  const conceptId = {
    countSingleBlockTogether: "PNC-LINEAR-SINGLE-BLOCK",
    countSingleBlockNotTogether: "PNC-LINEAR-BLOCK-COMPLEMENT",
    countMultipleBlocksTogether: "PNC-LINEAR-MULTIPLE-BLOCKS",
    countBlockWithExternalPairApart: "PNC-LINEAR-BLOCK-AND-APART",
    recoverBlockRestrictionParameter: "PNC-LINEAR-BLOCK-INVERSE",
  }[parameters.solveMode];

  return {
    conceptId,
    givens: {
      totalObjects: evidence.totalObjects,
      blockSizes: evidence.blockSizes.join(", "),
      restriction: parameters.constraintProfile,
    },
    equations: [`\\(${solver.mathJax}\\)`],
    intermediateValues: {
      unitCount: evidence.unitCount,
      externalArrangementCount: evidence.externalArrangementCount,
      internalArrangementMultiplier: evidence.internalArrangementMultiplier,
      unrestrictedCount: evidence.unrestrictedCount ?? "",
      forbiddenTogetherCount: evidence.forbiddenTogetherCount ?? "",
      validUnitArrangementCount: evidence.validUnitArrangementCount ?? "",
      target: evidence.target ?? "",
    },
    decisiveCalculation: `\\(${solver.mathJax}\\)`,
    verification: `${verification.method}; verified answer ${verification.answer}.`,
  };
}
