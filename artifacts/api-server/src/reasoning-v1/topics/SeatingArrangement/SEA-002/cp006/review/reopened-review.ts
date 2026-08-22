import { SEA002_CP006_APPROVED_REVIEW, SEA002_CP006_PREVIOUS_APPROVED_REVIEW } from "./approved-review.ts";

export const SEA002_CP006_REOPENED_ENGLISH_REVIEW = Object.freeze({
  status: "CLOSED_AFTER_CORRECTED_ARTIFACT_REAPPROVAL" as const,
  previousApprovedReviewFingerprint: SEA002_CP006_PREVIOUS_APPROVED_REVIEW.approvedReviewFingerprint,
  previousApprovedArtifactId: SEA002_CP006_PREVIOUS_APPROVED_REVIEW.artifactId,
  currentReviewCandidateFingerprint: SEA002_CP006_APPROVED_REVIEW.approvedReviewFingerprint,
  currentApprovedArtifactId: SEA002_CP006_APPROVED_REVIEW.artifactId,
  currentApprovedArtifactSha256: SEA002_CP006_APPROVED_REVIEW.artifactSha256,
  reasonCode: "SELF_REFERENCE_DISTRACTOR_RATIONALE_ERRATA" as const,
  affectedRationaleCount: 84 as const,
  affectedQueryContracts: Object.freeze({
    "SEA-QC-003": 41,
    "SEA-QC-010": 34,
    "SEA-QC-012": 9,
  } as const),
  semanticAnswerChanges: 0 as const,
  queryContractChanges: 0 as const,
  solveAuthorityChanges: 0 as const,
  permanentQlIdentityChanges: 0 as const,
  currentReviewApproved: true as const,
  approvalRequired: false as const,
  localizationMayProceed: true as const,
  questionStudioMayProceed: false as const,
  note: "The original signed approval remains immutable historical evidence. The corrected learner text now has its own explicit signed approval and is the active English authority for localization.",
});
