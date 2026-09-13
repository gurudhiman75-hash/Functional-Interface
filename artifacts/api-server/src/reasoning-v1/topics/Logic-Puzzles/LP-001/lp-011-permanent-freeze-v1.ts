import { LP_011_REVIEW_PACKAGE } from "./lp-011.ts";
import { LP_011_STABILIZED_V1_3 } from "./lp-011-stabilized-v1-3.ts";

export const LP_011_PERMANENT_QL_ALLOCATIONS = Object.freeze([
  Object.freeze({ qlId: "LP-QL-041" as const, authorityId: "BOX_TO_ATTRIBUTE_LOOKUP" as const, task: "Identify the attribute linked to a stated box." }),
  Object.freeze({ qlId: "LP-QL-042" as const, authorityId: "ATTRIBUTE_TO_BOX_LOOKUP" as const, task: "Identify the box linked to a stated attribute." }),
  Object.freeze({ qlId: "LP-QL-043" as const, authorityId: "ATTRIBUTE_TO_POSITION_LOOKUP" as const, task: "Identify the stack position of a stated attribute." }),
  Object.freeze({ qlId: "LP-QL-044" as const, authorityId: "BOX_ATTRIBUTE_POSITION_MATCH" as const, task: "Identify the option that correctly matches box, attribute and stack position." }),
] as const);

export const LP_011_ENGLISH_FREEZE_V1 = Object.freeze({
  authorityId: "LP_011_ENGLISH_FREEZE_V1" as const,
  packageId: LP_011_REVIEW_PACKAGE.packageId,
  checkpointId: LP_011_REVIEW_PACKAGE.checkpointId,
  approvedEditorialAuthority: LP_011_STABILIZED_V1_3.authorityId,
  permanentQlIds: Object.freeze(LP_011_PERMANENT_QL_ALLOCATIONS.map((entry) => entry.qlId)),
  permanentQlCount: LP_011_PERMANENT_QL_ALLOCATIONS.length,
  permanentQlAllocationStatus: "ALLOCATED" as const,
  englishFreezeStatus: "FROZEN" as const,
  learnerLanguage: "en" as const,
  runtimeMode: "REVIEW_ONLY" as const,
  reviewOnly: true as const,
  localizationStatus: "PENDING" as const,
  questionStudioStatus: "ENGLISH_REVIEW_ACTIVE" as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
  nextAvailableQlId: "LP-QL-045" as const,
});
