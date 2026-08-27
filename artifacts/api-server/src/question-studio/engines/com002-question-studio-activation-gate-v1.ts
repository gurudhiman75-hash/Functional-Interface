import { COM002_ENGLISH_FREEZE_AUTHORITY_V1 } from "../../knowledge-v1/computer-awareness/com002-english-freeze-v1";
import { COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1 } from "../../knowledge-v1/computer-awareness/com002-english-human-review-integrity-v1";
import { COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V1 } from "../../knowledge-v1/computer-awareness/com002-hi-pa-localization-freeze-v1";

/**
 * Fail-closed pre-integration authority.
 *
 * COM-002 must not become discoverable merely because automated English audits
 * or localization generation exist. The historical English freeze record is
 * operationally invalidated by COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1 until
 * the product owner explicitly approves the exact 26-question English pack.
 */
export const COM002_QUESTION_STUDIO_ACTIVATION_GATE_V1 = Object.freeze({
  authorityId: "COM-002-QUESTION-STUDIO-ACTIVATION-GATE-V1" as const,
  chapterId: "COM-002" as const,
  packageId: "COM-002" as const,
  engineId: "knowledge-v1" as const,
  status: "BLOCKED_PENDING_EXPLICIT_ENGLISH_HUMAN_REVIEW" as const,
  englishAuthority: {
    historicalAuthorityId: COM002_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
    historicalCombinedFingerprint: COM002_ENGLISH_FREEZE_AUTHORITY_V1.fingerprints.combinedFingerprint,
    integrityAuthorityId: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.authorityId,
    explicitApprovalVerified: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.explicitApprovalVerified,
    operationallyValid: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.operationalEnglishFreezeAllowed,
    frozen: false,
  },
  localizationAuthority: {
    candidateId: COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V1.candidateId,
    status: COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V1.status,
    frozen: false,
    fingerprintsPinned: false,
    humanReviewAccepted: false,
    promotionAllowed: false,
  },
  activation: {
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
  },
  unlockRequirements: [
    "COM002_26_ENGLISH_REVIEW_SAMPLER_EXPLICITLY_APPROVED",
    "COM002_NEW_ENGLISH_FREEZE_AUTHORITY_BINDS_EXPLICIT_APPROVAL",
    "COM002_1040_LOCALIZATION_PARITY_EXECUTED_GREEN",
    "COM002_26_BILINGUAL_REVIEW_SAMPLER_ACCEPTED",
    "COM002_LOCALIZATION_FINGERPRINTS_PINNED",
    "COM002_LOCALIZATION_FREEZE_AUTHORITY_CREATED",
    "COM002_REVIEW_ONLY_ADAPTER_AUDITED",
  ] as const,
  invalidationRule:
    "This blocker may only be superseded by a new authority chain that first binds explicit product-owner approval of the exact COM-002 English 26-question review pack, then binds the audited localization freeze, while preserving all bank/test/mock/public release locks during review-only Question Studio activation.",
});
