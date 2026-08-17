import { SYL_BANKING_COVERAGE_POLICY_V3 } from "./banking-source-profile-v3";

export const SYL_BANKING_COVERAGE_POLICY_V4 = Object.freeze({
  ...SYL_BANKING_COVERAGE_POLICY_V3,
  authorityId: "SYL_001_BANKING_COVERAGE_POLICY_V4",
  supersedes: "SYL_001_BANKING_COVERAGE_POLICY_V3",
  evidenceItemCount:
    SYL_BANKING_COVERAGE_POLICY_V3.reviewedMemoryBasedQuestionLevelItems
    + SYL_BANKING_COVERAGE_POLICY_V3.reviewedRepresentativeSolvedSets
    + SYL_BANKING_COVERAGE_POLICY_V3.reviewedConceptGuidanceSets,
});
