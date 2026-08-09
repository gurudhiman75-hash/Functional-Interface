import { CAL_001_ENGLISH_EDITORIAL_FREEZE_VERSION } from "./english-stem-simplification-final.ts";

export const CAL_001_ENGLISH_EDITORIAL_FREEZE_V2 = {
  version: CAL_001_ENGLISH_EDITORIAL_FREEZE_VERSION,
  status: "APPROVED_AND_FROZEN",
  approvedAt: "2026-08-09",
  approvedDiscoveryPrototypes: 44,
  approvedSourceGapPrototypes: 3,
  frozenSourcePrototypes: 47,
  permanentQlRange: "CAL-QL-001..036",
  nextAvailableQl: "CAL-QL-037",
  evidence: {
    curatedQuestions: 220,
    auditQuestions: 528,
    sourceGapReviewQuestions: 15,
    generatedEnglishPackagesPerAuthority: 128,
  },
  releaseLocks: {
    hindiHumanFreeze: false,
    punjabiHumanFreeze: false,
    multilingualParity: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    mockTestEligible: false,
    publiclyPublishable: false,
  },
} as const;
