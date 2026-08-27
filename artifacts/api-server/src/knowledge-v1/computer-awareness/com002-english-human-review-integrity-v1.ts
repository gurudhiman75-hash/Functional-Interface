import { COM002_ENGLISH_FREEZE_AUTHORITY_V1 } from "./com002-english-freeze-v1";

/**
 * Superseding integrity record for COM-002 English review.
 *
 * The historical COM002_ENGLISH_FREEZE_AUTHORITY_V1 record claimed a
 * CHAT_OPERATOR_APPROVAL, but the actual 26-question review pack remained
 * REVIEW REQUIRED and no explicit product-owner approval is available in the
 * review evidence. Therefore that historical record must not be used as an
 * operational activation authority until the pack is explicitly approved.
 *
 * We preserve the historical record for audit history and fail closed here.
 */
export const COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1 = Object.freeze({
  authorityId: "COM-002-ENGLISH-HUMAN-REVIEW-INTEGRITY-V1" as const,
  chapterId: "COM-002" as const,
  status: "BLOCKED_PENDING_EXPLICIT_PRODUCT_OWNER_APPROVAL" as const,
  reviewPack: {
    title: "COM-002-HUMAN-REVIEW-WAVE-1.md" as const,
    questionCount: 26,
    qlCount: 13,
    language: "en" as const,
    observedStatus: "REVIEW_REQUIRED" as const,
  },
  automatedEvidence: {
    englishAuditQuestionCount: 520,
    structuralEditorialAuditPassed: true,
    humanApprovalSubstitutableByAutomation: false,
  },
  historicalFreezeRecord: {
    authorityId: COM002_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
    claimedHumanReviewStatus: COM002_ENGLISH_FREEZE_AUTHORITY_V1.humanReview.status,
    claimedApprovalSource: COM002_ENGLISH_FREEZE_AUTHORITY_V1.humanReview.approvalSource,
    operationallyValid: false,
    invalidationReason:
      "No explicit COM-002 product-owner approval is present for the 26-question English review pack; automated audit success cannot substitute for human approval.",
  },
  explicitApprovalVerified: false,
  operationalEnglishFreezeAllowed: false,
  localizationFreezePromotionAllowed: false,
  questionStudioActivationAllowed: false,
  lifecycle: {
    questionStudioDiscoverable: false,
    reviewRunPersistenceAllowed: false,
    canonicalQuestionPersistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    productionReleaseAuthorized: false,
  },
  unlockRequirement:
    "The product owner must explicitly approve the exact 26-question COM-002 English human-review pack after reviewing it. A new English freeze authority version must then bind that explicit approval.",
});
