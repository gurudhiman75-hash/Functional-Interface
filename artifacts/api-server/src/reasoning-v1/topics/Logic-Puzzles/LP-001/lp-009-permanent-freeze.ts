import { LP_009_REVIEW_PACKAGE } from "./lp-009.ts";

export const LP_009_PERMANENT_QL_ALLOCATIONS = Object.freeze([
  Object.freeze({
    qlId: "LP-QL-033" as const,
    authorityId: "VALUE_TO_ENTITY_LOOKUP" as const,
    task: "Identify the person or entity assigned to a stated month or year.",
  }),
  Object.freeze({
    qlId: "LP-QL-034" as const,
    authorityId: "ENTITY_TO_VALUE_LOOKUP" as const,
    task: "Identify the month or year assigned to a stated person or entity.",
  }),
  Object.freeze({
    qlId: "LP-QL-035" as const,
    authorityId: "ORDERED_PAIR_MATCH" as const,
    task: "Identify the correct ordered pair of values for two stated people or entities.",
  }),
  Object.freeze({
    qlId: "LP-QL-036" as const,
    authorityId: "ORDERED_POSITION_ENTITY_LOOKUP" as const,
    task: "Identify the entity occupying a position derived from the completed ordered schedule.",
  }),
] as const);

export const LP_009_ENGLISH_FREEZE_V1 = Object.freeze({
  authorityId: "LP_009_ENGLISH_FREEZE_V1" as const,
  packageId: LP_009_REVIEW_PACKAGE.packageId,
  checkpointId: LP_009_REVIEW_PACKAGE.checkpointId,
  approvedEditorialAuthority: "LP-009-ENGLISH-EDITORIAL-APPROVAL-V2" as const,
  permanentQlIds: LP_009_REVIEW_PACKAGE.qlIds,
  permanentQlCount: LP_009_PERMANENT_QL_ALLOCATIONS.length,
  permanentQlAllocationStatus: "ALLOCATED" as const,
  englishFreezeStatus: "FROZEN" as const,
  learnerLanguage: "en" as const,
  nextAvailableQlId: "LP-QL-037" as const,
  runtimeMode: "REVIEW_ONLY" as const,
  reviewOnly: true as const,
  localizationStatus: "NOT_STARTED" as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  freezeGuardScope: Object.freeze([
    "PERMANENT_QL_SET",
    "QUERY_CONTRACT_OWNERSHIP",
    "SOLVER_UNIQUENESS",
    "ANSWER_SLOT_BALANCE",
    "APPROVED_V2_EXPLANATION_CONTRACT",
    "REVIEW_ONLY_LIFECYCLE",
  ] as const),
});
