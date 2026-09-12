import { LP_001_008_STABILIZED_ENGLISH_V4_2 } from "./lp-001-008-stabilized-english-v4-2.ts";

export const LP_001_008_ENGLISH_APPROVAL_V4_2 = Object.freeze({
  authorityId: "LP_001_008_ENGLISH_APPROVAL_V4_2" as const,
  approvedSourceAuthority: LP_001_008_STABILIZED_ENGLISH_V4_2.authorityId,
  approvedCommit: "8424fe7767918827f16d216d477e346587756a0f" as const,
  approvalStatus: "PRODUCT_OWNER_APPROVED" as const,
  approvedLanguage: "en" as const,
  approvedPackages: Object.freeze([
    "LP-001", "LP-002", "LP-003", "LP-004", "LP-005", "LP-006", "LP-007", "LP-008",
  ] as const),
  approvedQlRange: Object.freeze(["LP-QL-001", "LP-QL-032"] as const),
  approvedContracts: Object.freeze([
    "COMPLETE_VARIABLE_DOMAINS_IN_STEM",
    "DEPENDENCY_DRIVEN_SOLVING_ORDER",
    "PROGRESSIVE_PLACEHOLDER_TABLES",
    "GENUINE_CASE_TABLES_WHEN_NEEDED",
    "SIMPLE_VARIED_EXPLANATION_LANGUAGE",
    "LP001_CLUB_REPETITIONS_ONLY",
    "V2_OPTION_INTEGRITY_REPAIRS",
  ] as const),
  localizationStatus: "READY_TO_START" as const,
  mergeStatus: "NOT_MERGED" as const,
});
