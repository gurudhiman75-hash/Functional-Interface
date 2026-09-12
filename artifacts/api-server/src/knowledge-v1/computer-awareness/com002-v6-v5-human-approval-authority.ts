import { COM002_LOCALIZATION_VERSION_V5 } from "./com002-localization-v5";
import { COM002_ENGLISH_GENERATOR_VERSION_V6 } from "./com002-review-synthesis-v6";

/**
 * Product-owner acceptance of the latest reviewed COM-002 learner-facing
 * surfaces. This records human acceptance only. Machine fingerprints and
 * operational freezes are separate authorities and remain fail-closed until
 * pinned from a green canonical run.
 */
export const COM002_V6_V5_HUMAN_APPROVAL_AUTHORITY = Object.freeze({
  authorityId: "COM-002-V6-V5-HUMAN-APPROVAL-AUTHORITY" as const,
  chapterId: "COM-002" as const,
  approvedSurface: "ENGLISH_V6_HI_PA_LOCALIZATION_V5" as const,
  englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V6,
  localizationVersion: COM002_LOCALIZATION_VERSION_V5,
  approval: Object.freeze({
    explicitApprovalVerified: true,
    approvalSource: "PRODUCT_OWNER_CHAT_EXPLICIT_APPROVAL" as const,
    approvedOn: "2026-08-30" as const,
    scope: "LATEST_REVIEWED_LEARNER_FACING_ENGLISH_HINDI_PUNJABI_SURFACES" as const,
  }),
  lifecycle: Object.freeze({
    humanReviewAccepted: true,
    machineFingerprintsPinned: false,
    englishV6Frozen: false,
    localizationV5Frozen: false,
    questionStudioActive: false,
    reviewRunPersistenceAllowed: false,
    canonicalQuestionPersistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    productionReleaseAuthorized: false,
  }),
  nextGate: "GREEN_V6_V5_FINGERPRINT_MANIFEST_THEN_OPERATIONAL_FREEZE" as const,
});
