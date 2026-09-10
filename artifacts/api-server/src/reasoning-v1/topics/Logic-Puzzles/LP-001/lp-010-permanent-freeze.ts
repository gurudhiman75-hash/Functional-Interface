import { LP_010_REVIEW_PACKAGE } from "./lp-010.ts";

export const LP_010_PERMANENT_QL_ALLOCATIONS = Object.freeze([
  Object.freeze({
    qlId: "LP-QL-037" as const,
    authorityId: "PERSON_TO_DAY_TIME_LOOKUP" as const,
    task: "Identify the day and time assigned to a stated person.",
  }),
  Object.freeze({
    qlId: "LP-QL-038" as const,
    authorityId: "DAY_TIME_TO_PERSON_LOOKUP" as const,
    task: "Identify the person assigned to a stated day-time slot.",
  }),
  Object.freeze({
    qlId: "LP-QL-039" as const,
    authorityId: "DAY_TIME_PAIR_MATCH" as const,
    task: "Identify the option that correctly matches two people with their day-time slots.",
  }),
  Object.freeze({
    qlId: "LP-QL-040" as const,
    authorityId: "IMMEDIATE_NEXT_PERSON_LOOKUP" as const,
    task: "Identify the person scheduled in the immediately following chronological slot.",
  }),
] as const);

export const LP_010_ENGLISH_FREEZE_V1 = Object.freeze({
  authorityId: "LP_010_ENGLISH_FREEZE_V1" as const,
  packageId: LP_010_REVIEW_PACKAGE.packageId,
  checkpointId: LP_010_REVIEW_PACKAGE.checkpointId,
  approvedEditorialAuthority: "LP-010-ENGLISH-EDITORIAL-APPROVAL-V4" as const,
  permanentQlIds: LP_010_REVIEW_PACKAGE.qlIds,
  permanentQlCount: LP_010_PERMANENT_QL_ALLOCATIONS.length,
  permanentQlAllocationStatus: "ALLOCATED" as const,
  englishFreezeStatus: "FROZEN" as const,
  learnerLanguage: "en" as const,
  nextAvailableQlId: "LP-QL-041" as const,
  runtimeMode: "REVIEW_ONLY" as const,
  reviewOnly: true as const,
  localizationStatus: "NOT_STARTED" as const,
  questionStudioStatus: "PENDING_LOCALIZATION" as const,
  freezeGuardScope: Object.freeze([
    "PERMANENT_QL_SET",
    "QUERY_CONTRACT_OWNERSHIP",
    "SOLVER_UNIQUENESS",
    "ANSWER_SLOT_BALANCE",
    "APPROVED_V4_TIME_LAYOUT_DIVERSITY",
    "APPROVED_V4_EXPLANATION_CONTRACT",
    "SHARED_QUESTION_STUDIO_HANDOFF",
  ] as const),
});
