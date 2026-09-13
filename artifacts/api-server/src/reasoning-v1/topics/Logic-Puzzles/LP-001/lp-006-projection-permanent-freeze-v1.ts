import { LP_006_PROJECTION_EXTENSION_V2 } from "./lp-006-projection-extension-v2.ts";

export const LP_006_PROJECTION_PERMANENT_QL_ALLOCATIONS = Object.freeze([
  Object.freeze({ qlId: "LP-QL-045" as const, authorityId: "CROSS_ATTRIBUTE_PROJECTION_LOOKUP" as const, task: "Given one non-person value, identify its linked person or value in another column." }),
  Object.freeze({ qlId: "LP-QL-046" as const, authorityId: "STATEMENT_TRUTH_SELECTION" as const, task: "Identify the uniquely correct or uniquely incorrect statement about the solved multi-attribute table." }),
] as const);

export const LP_006_PROJECTION_ENGLISH_FREEZE_V1 = Object.freeze({
  authorityId: "LP_006_PROJECTION_ENGLISH_FREEZE_V1" as const,
  parentAuthorityId: LP_006_PROJECTION_EXTENSION_V2.authorityId,
  packageId: "LP-006" as const,
  checkpointId: "LP-CP-006-PROJECTION" as const,
  permanentQlIds: Object.freeze(LP_006_PROJECTION_PERMANENT_QL_ALLOCATIONS.map((entry) => entry.qlId)),
  permanentQlCount: LP_006_PROJECTION_PERMANENT_QL_ALLOCATIONS.length,
  permanentQlAllocationStatus: "ALLOCATED" as const,
  englishFreezeStatus: "FROZEN" as const,
  learnerLanguage: "en" as const,
  runtimeMode: "REVIEW_ONLY" as const,
  reviewOnly: true as const,
  changesHiddenState: false as const,
  changesExistingClues: false as const,
  localizationStatus: "PENDING" as const,
  questionStudioStatus: "ENGLISH_REVIEW_ACTIVE" as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
  nextAvailableQlId: "LP-QL-047" as const,
});
