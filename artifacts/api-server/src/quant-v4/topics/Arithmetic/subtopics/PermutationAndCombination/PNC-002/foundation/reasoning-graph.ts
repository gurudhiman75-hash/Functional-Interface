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
    countTwoBlocksTogetherNotAdjacent: "PNC-LINEAR-SEPARATED-BLOCKS",
    countBlockWithOutsiderNotAdjacent: "PNC-LINEAR-BLOCK-OUTSIDER-SEPARATION",
    countOneBlockTogetherOtherNotTogether: "PNC-LINEAR-ONE-BLOCK-OTHER-BROKEN",
    countNotAllSpecifiedBlocksTogether: "PNC-LINEAR-MULTIPLE-BLOCK-COMPLEMENT",
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
      forbiddenAdjacentUnitCount: evidence.forbiddenAdjacentUnitCount ?? "",
      validUnitArrangementCount: evidence.validUnitArrangementCount ?? "",
      primaryRestrictionCount: evidence.primaryRestrictionCount ?? "",
      allSpecifiedBlocksTogetherCount: evidence.allSpecifiedBlocksTogetherCount ?? "",
      target: evidence.target ?? "",
    },
    decisiveCalculation: `\\(${solver.mathJax}\\)`,
    verification: `${verification.method}; verified answer ${verification.answer}.`,
  };
}
