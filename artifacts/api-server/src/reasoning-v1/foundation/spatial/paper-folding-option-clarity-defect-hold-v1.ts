export const PFC_001_OPTION_CLARITY_DEFECT_HOLD_V1 = Object.freeze({
  authorityId: "PFC-001-OPTION-CLARITY-DEFECT-HOLD-V1" as const,
  defectClass: "SAME_PATTERN_DIFFERING_MAINLY_BY_SMALL_SPACING_OR_TRANSLATION" as const,
  detectedOnReviewAuthority: "PFC-TPF-FINAL-COMBINED-ENGLISH-REVIEW-V1.1" as const,
  productOwnerObservation: "Some punch/cut choices look effectively the same to students and differ mainly in spacing." as const,
  remediationRule: "DISTRACTORS_MUST_DIFFER_BY_REASONING_STRUCTURE_NOT_MERE_PATTERN_SCALE_OR_SMALL_TRANSLATION" as const,
  prohibitedDistractorFamilies: [
    "UNIFORM_SCALE_OF_CORRECT_MARK_PATTERN",
    "SMALL_TRANSLATION_OF_CORRECT_MARK_PATTERN",
    "SAME_MARK_COUNT_SAME_ORIENTATION_SPACING_ONLY_VARIANT",
  ] as const,
  preferredDistractorFamilies: [
    "WRONG_LAYER_COUNT",
    "PARTIAL_UNFOLD",
    "WRONG_FOLD_AXIS_OR_ORIENTATION",
    "WRONG_TOPOLOGY",
    "MISSING_SECTOR_OR_EXTRA_SECTOR",
  ] as const,
  englishFreezeAllowed: false,
  localizationAllowed: false,
  questionStudioAllowed: false,
  automaticPublication: false,
  status: "ACTIVE_UNTIL_FINAL_COMBINED_V1_2_HUMAN_APPROVAL" as const,
} as const);
