import { COM002_ENGLISH_FREEZE_AUTHORITY_V1 } from "../../knowledge-v1/computer-awareness/com002-english-freeze-v1";
import { COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1 } from "../../knowledge-v1/computer-awareness/com002-english-human-review-integrity-v1";
import { COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V1 } from "../../knowledge-v1/computer-awareness/com002-hi-pa-localization-freeze-v1";

/**
 * Fail-closed pre-integration authority.
 *
 * The historical English V1 freeze is audit history only. The V3 English
 * candidate contains later QL-004/QL-013 safety remediation and must execute,
 * be materialized as an exact 26-question pack, receive explicit product-owner
 * approval, and then receive a new freeze authority. Localization must then be
 * rebased to that approved V3 authority before Question Studio can activate.
 */
export const COM002_QUESTION_STUDIO_ACTIVATION_GATE_V1 = Object.freeze({
  authorityId: "COM-002-QUESTION-STUDIO-ACTIVATION-GATE-V1" as const,
  chapterId: "COM-002" as const,
  packageId: "COM-002" as const,
  engineId: "knowledge-v1" as const,
  status: "BLOCKED_PENDING_V3_ENGLISH_APPROVAL_AND_REBASED_LOCALIZATION" as const,
  englishAuthority: {
    historicalAuthorityId: COM002_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
    historicalCombinedFingerprint: COM002_ENGLISH_FREEZE_AUTHORITY_V1.fingerprints.combinedFingerprint,
    historicalAuthorityOperationallyValid: false,
    integrityAuthorityId: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.authorityId,
    integrityStatus: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.status,
    candidateGeneratorVersion: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.reviewCandidate.generatorVersion,
    v3PackMaterialized: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.reviewCandidate.materializedPackAvailable,
    explicitApprovalVerified: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.explicitApprovalVerified,
    operationallyValid: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.operationalEnglishFreezeAllowed,
    frozen: false,
  },
  localizationAuthority: {
    historicalCandidateId: COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V1.candidateId,
    historicalCandidateStatus: COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V1.status,
    requiresV3Rebase: true,
    frozen: false,
    fingerprintsPinnedAgainstApprovedV3: false,
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
    "COM002_V3_520_ENGLISH_AUDIT_EXECUTED_GREEN",
    "COM002_V3_26_ENGLISH_REVIEW_PACK_MATERIALIZED",
    "COM002_V3_26_ENGLISH_REVIEW_PACK_EXPLICITLY_APPROVED",
    "COM002_NEW_ENGLISH_FREEZE_AUTHORITY_BINDS_APPROVED_V3_PACK",
    "COM002_LOCALIZATION_V2_REBASED_TO_APPROVED_V3_AUTHORITY",
    "COM002_V2_LOCALIZATION_PARITY_EXECUTED_GREEN",
    "COM002_V2_BILINGUAL_REVIEW_SAMPLER_ACCEPTED",
    "COM002_V2_LOCALIZATION_FINGERPRINTS_PINNED",
    "COM002_V2_LOCALIZATION_FREEZE_AUTHORITY_CREATED",
    "COM002_REVIEW_ONLY_ADAPTER_AUDITED_AGAINST_NEW_AUTHORITIES",
  ] as const,
  invalidationRule:
    "This blocker may only be superseded by an authority chain that binds the executed and explicitly approved COM-002 English V3 pack, then a V3-bound Hindi/Punjabi localization freeze, while preserving all bank/test/mock/public release locks during review-only Question Studio activation.",
});
