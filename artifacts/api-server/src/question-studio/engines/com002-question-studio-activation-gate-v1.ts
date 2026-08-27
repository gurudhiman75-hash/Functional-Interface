import { COM002_ENGLISH_FREEZE_AUTHORITY_V1 } from "../../knowledge-v1/computer-awareness/com002-english-freeze-v1";
import { COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V1 } from "../../knowledge-v1/computer-awareness/com002-hi-pa-localization-freeze-v1";

/**
 * Fail-closed pre-integration authority. COM-002 must not become discoverable
 * in Question Studio merely because localization generation exists. The gate
 * can only be superseded by a real pinned localization-freeze authority and a
 * separately reviewed review-only integration switch.
 */
export const COM002_QUESTION_STUDIO_ACTIVATION_GATE_V1 = Object.freeze({
  authorityId: "COM-002-QUESTION-STUDIO-ACTIVATION-GATE-V1" as const,
  chapterId: "COM-002" as const,
  packageId: "COM-002" as const,
  engineId: "knowledge-v1" as const,
  status: "BLOCKED_PENDING_LOCALIZATION_FREEZE" as const,
  englishAuthority: {
    authorityId: COM002_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
    combinedFingerprint: COM002_ENGLISH_FREEZE_AUTHORITY_V1.fingerprints.combinedFingerprint,
    frozen: true,
  },
  localizationAuthority: {
    candidateId: COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V1.candidateId,
    status: COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V1.status,
    frozen: false,
    fingerprintsPinned: false,
    humanReviewAccepted: false,
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
    "COM002_1040_LOCALIZATION_PARITY_EXECUTED_GREEN",
    "COM002_26_BILINGUAL_REVIEW_SAMPLER_ACCEPTED",
    "COM002_LOCALIZATION_FINGERPRINTS_PINNED",
    "COM002_LOCALIZATION_FREEZE_AUTHORITY_CREATED",
    "COM002_REVIEW_ONLY_ADAPTER_AUDITED",
  ] as const,
  invalidationRule:
    "This blocker may only be superseded by a new authority that binds a pinned COM-002 Hindi/Punjabi localization freeze and preserves all bank/test/mock/public release locks during review-only Question Studio activation.",
});
