export type SylBankingSourceFamilyV3 =
  | "BANK_TWO_CONCLUSION_FIVE_OPTION"
  | "BANK_EITHER_OR_COMPLEMENTARY"
  | "BANK_POSSIBILITY_IN_CONCLUSION_SET"
  | "BANK_ONLY_AND_ONLY_A_FEW"
  | "BANK_THREE_CONCLUSION_ADVANCED";

export const SYL_BANKING_COVERAGE_POLICY_V3 = Object.freeze({
  authorityId: "SYL_001_BANKING_COVERAGE_POLICY_V3",
  status: "SOURCE_EXPANDED_BUT_WEIGHTING_NOT_FROZEN",
  reviewedMemoryBasedQuestionLevelItems: 7,
  reviewedRepresentativeSolvedSets: 1,
  reviewedConceptGuidanceSets: 1,
  familyEvidenceCounts: {
    BANK_TWO_CONCLUSION_FIVE_OPTION: 5,
    BANK_EITHER_OR_COMPLEMENTARY: 2,
    BANK_POSSIBILITY_IN_CONCLUSION_SET: 7,
    BANK_ONLY_AND_ONLY_A_FEW: 7,
    BANK_THREE_CONCLUSION_ADVANCED: 2,
  } as const,
  familyPolicy: {
    BANK_TWO_CONCLUSION_FIVE_OPTION: "DOMINANT_CORE",
    BANK_EITHER_OR_COMPLEMENTARY: "REQUIRED_RECURRING",
    BANK_POSSIBILITY_IN_CONCLUSION_SET: "REQUIRED_RECURRING",
    BANK_ONLY_AND_ONLY_A_FEW: "REQUIRED_RECURRING_PREMISE_VARIANT",
    BANK_THREE_CONCLUSION_ADVANCED: "MINORITY_ADVANCED",
  } as const,
  productionWeightingPolicy: "DO_NOT_FREEZE_EXACT_PERCENTAGES_FROM_CURATED_SECONDARY_SAMPLE",
  prototypeGenerationCountsAreFrequencyEvidence: false,
  exactHistoricalFrequencyClaimPermitted: false,
  sourceMixFrozen: false,
  permanentQlFreezePermitted: false,
  profileActivationPermitted: false,
  evidenceBoundary: [
    "All five planned Banking families are directly represented in the reviewed Banking-oriented question/source sample.",
    "The reviewed sample is curated and secondary, not a complete paper census.",
    "Presence and relative product role may be frozen now; exact historical percentages may not.",
  ] as const,
});
