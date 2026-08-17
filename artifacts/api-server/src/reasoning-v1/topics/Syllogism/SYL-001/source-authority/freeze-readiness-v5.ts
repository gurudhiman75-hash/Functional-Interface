import { SYL_BANKING_COVERAGE_POLICY_V4 } from "./banking-source-profile-v4";
import { SYL_FREEZE_READINESS_V3 } from "./freeze-readiness-v3";

export const SYL_FREEZE_READINESS_V5 = Object.freeze({
  authorityId: "SYL_001_FREEZE_READINESS_V5",
  status: "NOT_READY_FOR_PROFILE_OR_QL_FREEZE",
  supersedes: "SYL_001_FREEZE_READINESS_V3",
  priorCounts: SYL_FREEZE_READINESS_V3.counts,
  counts: { MET: 4, PARTIAL: 4, BLOCKED: 3 } as const,
  bankingRemodelBlockerClosed: true,
  bankingFamilySourceCoverageClosed: true,
  bankingCoverageAuthority: SYL_BANKING_COVERAGE_POLICY_V4.authorityId,
  bankingEvidenceItemCount: SYL_BANKING_COVERAGE_POLICY_V4.evidenceItemCount,
  bankingExactWeightingFrozen: false,
  permanentQlFreezePermitted: false,
  profileActivationPermitted: false,
  generatorIntegrationPermitted: false,
  difficultyActivationPermitted: false,
  prMergeRecommended: false,
});
