import { SEA002_CP006_APPROVED_REVIEW } from "./approved-review.ts";

export const SEA002_CP006_REOPENED_ENGLISH_REVIEW = Object.freeze({
  status: "REVIEW_REQUIRED_AFTER_EDITORIAL_ERRATA" as const,
  previousApprovedReviewFingerprint: SEA002_CP006_APPROVED_REVIEW.approvedReviewFingerprint,
  previousApprovedArtifactId: SEA002_CP006_APPROVED_REVIEW.artifactId,
  currentReviewCandidateFingerprint: "21e815257a510a943092cffb69f3c5f44222c7e332ffe171e36eadbca0b83621",
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
  currentReviewApproved: false as const,
  approvalRequired: true as const,
  localizationMayProceed: false as const,
  questionStudioMayProceed: false as const,
  note: "The previous signed approval remains an immutable historical record for its exact artifact. It cannot authorize the corrected learner text; the corrected fingerprint requires a fresh explicit review approval.",
});
