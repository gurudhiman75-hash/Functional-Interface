import { PFC_001_POLYGON_SOURCE_SATURATION_AUTHORITY_V3 } from "./paper-folding-polygon-source-saturation-v3";

export const PFC_001_POLYGON_SOURCE_SATURATION_AUTHORITY_V4 = Object.freeze({
  authorityId: "PFC-001-POLYGON-SUBSTRATE-SOURCE-SATURATION-V4" as const,
  supersedes: PFC_001_POLYGON_SOURCE_SATURATION_AUTHORITY_V3.authorityId,
  status: "SOURCE_GAP_CONFIRMED_TRIANGLE_AND_HEXAGON_REQUIRED" as const,
  decisionRule: PFC_001_POLYGON_SOURCE_SATURATION_AUTHORITY_V3.decisionRule,
  newEvidence: {
    evidenceId: "PFC-POLY-E05" as const,
    shape: "HEXAGON" as const,
    sourceClass: "DIRECT_INDEXED_SSC_PAPER" as const,
    exam: "SSC CGL Tier 1" as const,
    year: 2016,
    source: "Testbook indexed SSC CGL Tier 1 (2016) paper-folding/cutting item" as const,
    url: "https://testbook.com/question-answer/a-paper-is-folded-and-cut-description-a-hexagon--69e0bc9f4490059d7115698b" as const,
    statement: "A hexagonal paper is folded twice, a circle is punched in the folded sector, and the unfolded answer has six circles arranged around the hexagon." as const,
    decision: "ACTIVATE_IN_PFC_LEARNER_REVIEW" as const,
  },
  shapeDecisions: {
    SQUARE: "ACTIVE",
    RECTANGLE: "ACTIVE",
    CIRCLE: "ACTIVE",
    TRIANGLE: "ACTIVE_SOURCE_BACKED_POLYGON_APPROVED",
    HEXAGON: "ACTIVE_SOURCE_BACKED_POLYGON_REVIEW_REQUIRED",
    PENTAGON: "HOLD_NO_DIRECT_PFC_TARGET_EVIDENCE",
    GENERAL_CONVEX_POLYGON: "ENGINE_CAPABILITY_ONLY",
    IRREGULAR_OR_CONCAVE_POLYGON: "HOLD_UNTIL_SOURCE_AND_PHYSICAL_VALIDATION",
  } as const,
  governance: {
    permanentQlAllocationAllowed: false,
    englishFreezeAllowed: false,
    localizationAllowed: false,
    questionStudioAllowed: false,
  },
  nextGate: "PFC_001_HEXAGON_DISCOVERY_AND_HUMAN_REVIEW_V1" as const,
} as const);
