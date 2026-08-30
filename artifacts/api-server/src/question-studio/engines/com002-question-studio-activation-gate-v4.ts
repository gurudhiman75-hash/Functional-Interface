import { COM002_V6_V5_APPROVED_FREEZE_CANDIDATE } from "../../knowledge-v1/computer-awareness/com002-v6-v5-approved-freeze-candidate";
import { COM002_V6_V5_HUMAN_APPROVAL_AUTHORITY } from "../../knowledge-v1/computer-awareness/com002-v6-v5-human-approval-authority";
import { COM002_QUESTION_STUDIO_ACTIVATION_GATE_V3 } from "./com002-question-studio-activation-gate-v3";

/**
 * Latest COM-002 activation authority.
 *
 * Human review of English V6 + Hindi/Punjabi Localization V5 is complete and
 * bound to the green run #585 artifact. The gate remains fail-closed only for
 * the deterministic full-corpus fingerprint/promotion step. It intentionally
 * does not inherit the stale English V5 + Localization V4 unlock requirements.
 */
export const COM002_QUESTION_STUDIO_ACTIVATION_GATE_V4 = Object.freeze({
  authorityId: "COM-002-QUESTION-STUDIO-ACTIVATION-GATE-V4" as const,
  chapterId: "COM-002" as const,
  packageId: "COM-002" as const,
  engineId: "knowledge-v1" as const,
  supersedes: COM002_QUESTION_STUDIO_ACTIVATION_GATE_V3.authorityId,
  status: "BLOCKED_ONLY_ON_V6_V5_FULL_CORPUS_FINGERPRINT_AND_OPERATIONAL_FREEZE" as const,
  approvedChain: Object.freeze({
    approvalAuthorityId: COM002_V6_V5_HUMAN_APPROVAL_AUTHORITY.authorityId,
    approvedSurface: COM002_V6_V5_HUMAN_APPROVAL_AUTHORITY.approvedSurface,
    explicitHumanApprovalVerified:
      COM002_V6_V5_HUMAN_APPROVAL_AUTHORITY.approval.explicitApprovalVerified,
    englishGeneratorVersion: COM002_V6_V5_APPROVED_FREEZE_CANDIDATE.englishGeneratorVersion,
    localizationVersion: COM002_V6_V5_APPROVED_FREEZE_CANDIDATE.localizationVersion,
    canonicalExecutionGreen:
      COM002_V6_V5_APPROVED_FREEZE_CANDIDATE.executionEvidence.conclusion === "SUCCESS",
    canonicalWorkflowRunNumber:
      COM002_V6_V5_APPROVED_FREEZE_CANDIDATE.executionEvidence.workflowRunNumber,
    exactBilingualReviewArtifactPinned:
      COM002_V6_V5_APPROVED_FREEZE_CANDIDATE.guarantees.exactBilingualReviewArtifactPinned,
    exactBilingualReviewFingerprintPinned:
      COM002_V6_V5_APPROVED_FREEZE_CANDIDATE.guarantees.exactBilingualReviewFingerprintPinned,
    fullCorpusFingerprintsPinned:
      COM002_V6_V5_APPROVED_FREEZE_CANDIDATE.guarantees.fullCorpusFingerprintsPinned,
    operationalFreezePromotable:
      COM002_V6_V5_APPROVED_FREEZE_CANDIDATE.lifecycle.machineFreezePromotable,
  }),
  activation: Object.freeze({
    questionStudioDiscoverable: false,
    questionStudioRegistrationAllowed: false,
    reviewOnlySwitchAllowed: false,
    reviewRunPersistenceAllowed: false,
    canonicalQuestionPersistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    productionReleaseAuthorized: false,
  }),
  alreadySatisfiedEvidence: [
    "COM002_LATEST_ENGLISH_V6_SURFACE_REVIEWED",
    "COM002_LATEST_HINDI_PUNJABI_LOCALIZATION_V5_SURFACE_REVIEWED",
    "COM002_PRODUCT_OWNER_EXPLICIT_V6_V5_APPROVAL_RECORDED_2026_08_30",
    "COM002_V6_V5_CANONICAL_CONTENT_SUITE_GREEN_RUN_585",
    "COM002_EXACT_RUN_585_BILINGUAL_REVIEW_ARTIFACT_PINNED",
    "COM002_EXACT_BILINGUAL_V5_REVIEW_FINGERPRINT_PINNED",
  ] as const,
  remainingUnlockRequirements: [
    "COM002_ENGLISH_V6_520_CORPUS_FINGERPRINT_PINNED",
    "COM002_ENGLISH_V6_EXACT_REVIEW_FINGERPRINT_PINNED",
    "COM002_HINDI_V5_520_CORPUS_FINGERPRINT_PINNED",
    "COM002_PUNJABI_V5_520_CORPUS_FINGERPRINT_PINNED",
    "COM002_V6_V5_COMBINED_FINGERPRINTS_PINNED",
    "COM002_V6_V5_OPERATIONAL_FREEZE_AUTHORITY_CREATED",
    "COM002_V6_V5_REVIEW_ONLY_ADAPTER_AUDITED",
  ] as const,
  invalidationRule:
    "Any post-approval V6/V5 learner-facing, semantic, option-order, correct-index, source-provenance or solver-authority drift invalidates the current review binding and keeps COM-002 non-discoverable until a new exact authority is approved and pinned.",
});
