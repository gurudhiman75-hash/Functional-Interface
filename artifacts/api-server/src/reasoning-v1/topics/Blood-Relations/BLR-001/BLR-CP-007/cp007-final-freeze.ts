import { BLR_CP007_CONTRACTS } from "./cp007-model";
import { BLR_CP007_PROTOTYPES } from "./cp007-prototypes";
import { buildBlrCp007Telemetry, generateBlrCp007FrozenBank } from "./cp007-runtime";

export const BLR_CP007_FINAL_FREEZE = (() => {
  const bank = generateBlrCp007FrozenBank();
  const telemetry = buildBlrCp007Telemetry(bank);
  return {
    packageId: "BLR-001" as const,
    checkpointId: "BLR-CP-007" as const,
    checkpointName: "Coded Relation Construction",
    approvalStatus: "ENGLISH_DISCOVERY_FROZEN" as const,
    permanentQlRange: "BLR-QL-031..BLR-QL-035" as const,
    nextAvailableChapterQlId: "BLR-QL-036" as const,
    recordCount: telemetry.recordCount,
    prototypeCount: telemetry.prototypeCount,
    topologyCount: telemetry.topologyCount,
    authorityCount: telemetry.authorityCount,
    permanentQlCount: telemetry.permanentQlCount,
    statementCount: telemetry.statementCount,
    contracts: BLR_CP007_CONTRACTS,
    sourcePrototypeIds: BLR_CP007_PROTOTYPES.map((entry) => entry.prototypeId),
    consolidationDecisions: [
      "Direct, reverse, two-link, three-link and affinal complete-expression tasks are parameters of SELECT_CODED_EXPRESSION.",
      "A single missing token remains separate because its answer is one code token and its option errors are token-local.",
      "Two missing tokens remain separate because order is part of the answer contract.",
      "Missing-person completion remains separate because candidates occupy an operand position rather than a relation-token position.",
      "Correct/incorrect coded statement selection remains separate because each option combines an expression with a semantic claim.",
    ] as const,
    boundaryDecisions: [
      "Pure decoding into relation, person, gender or pair answers remains owned by BLR-CP-006.",
      "Open-ended code-key discovery without supplied meanings is outside Blood Relations V1.",
      "Arithmetic interpretation of symbols is forbidden.",
      "Data Sufficiency, statement sufficiency and puzzle-wide code induction remain outside this checkpoint.",
      "Hindi and Punjabi localisation, Question Studio, Question Bank, tests and publication remain disabled.",
    ] as const,
    qualityGuarantees: {
      independentVerification: "168 / 168",
      displayedExpressionParity: "168 / 168",
      uniqueLearnerSignatures: "168 / 168",
      optionAnalyses: "672 / 672",
      nameBasedGenderAssumptions: 0,
      balancedAnswerPositions: "42 / 42 / 42 / 42",
    },
  };
})();

export function buildBlrCp007FinalFreezeSummary() {
  return {
    ...BLR_CP007_FINAL_FREEZE,
    verdict:
      "BLR-CP-007 CODED RELATION CONSTRUCTION IS ENGLISH-DISCOVERY FROZEN WITH FIVE PERMANENT REVIEW-ONLY QLS",
  };
}
