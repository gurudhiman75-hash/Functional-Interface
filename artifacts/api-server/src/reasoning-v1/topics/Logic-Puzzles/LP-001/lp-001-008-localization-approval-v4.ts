import { LP_001_008_HI_PA_LOCALIZATION_REVIEW_V4 } from "./lp-001-008-localization-v4.ts";

export const LP_001_008_HI_PA_LOCALIZATION_APPROVAL_V4 = Object.freeze({
  authorityId: "LP_001_008_HI_PA_LOCALIZATION_APPROVAL_V4" as const,
  approvedSourceAuthority: LP_001_008_HI_PA_LOCALIZATION_REVIEW_V4.authorityId,
  approvedCommit: "df2000ce92b5dddf293f6f912dbbed821e6c0692" as const,
  approvalStatus: "PRODUCT_OWNER_APPROVED" as const,
  approvedLanguages: Object.freeze(["hi", "pa"] as const),
  approvedLocales: Object.freeze(["hi-IN", "pa-IN"] as const),
  approvedPackages: Object.freeze([
    "LP-001", "LP-002", "LP-003", "LP-004", "LP-005", "LP-006", "LP-007", "LP-008",
  ] as const),
  approvedQlRange: Object.freeze(["LP-QL-001", "LP-QL-032"] as const),
  approvedContracts: Object.freeze([
    "SEMANTIC_PARITY_WITH_FROZEN_ENGLISH_V4_2",
    "SAME_QUESTION_TARGET_AND_CORRECT_OPTION_INDEX",
    "DEPENDENCY_DRIVEN_EXPLANATION_ORDER",
    "PROGRESSIVE_PLACEHOLDER_AND_GENUINE_CASE_TABLES",
    "NATIVE_HINDI_PUNJABI_OPTION_AND_LABEL_COPY",
    "LP003_NATIVE_ORDINAL_CASE_AND_PLURAL_GRAMMAR",
    "LP004_GENDER_NEUTRAL_SELECTION_LANGUAGE",
    "NO_OPTION_BY_OPTION_ANALYSIS",
  ] as const),
  localizationFreezeStatus: "READY_TO_FREEZE" as const,
  questionStudioStatus: "READY_FOR_MULTILINGUAL_INTEGRATION" as const,
  mergeStatus: "NOT_MERGED" as const,
});
