import {
  COM002_ENGLISH_GENERATOR_VERSION_V5,
  COM002_V5_APPROVED_REVIEW_SEEDS,
} from "./com002-review-synthesis-v5";

/**
 * Product-owner approval record for the simplified English review surface.
 *
 * Approval was given after reviewing the 26-question simplified browser pack
 * on 2026-08-28. The reviewed wording is now encoded as the exact V5 sampler
 * surface. Approval alone cannot authorize a freeze until canonical CI proves
 * the V5 generator and exact 26-question sampler execute green.
 */
export const COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V4 = Object.freeze({
  authorityId: "COM-002-ENGLISH-HUMAN-REVIEW-INTEGRITY-V4" as const,
  chapterId: "COM-002" as const,
  status: "EXPLICIT_APPROVAL_RECORDED_AWAITING_V5_CANONICAL_EXECUTION" as const,
  englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V5,
  reviewPackId: "COM-002-ENGLISH-SIMPLIFIED-HUMAN-REVIEW-PACK-V5" as const,
  reviewedArtifactName: "COM002-English-V4-Simplified-Review-Pack.html" as const,
  reviewSeedFamily: "human-review-wave1:COM-002-QL-001..013:{A|B}" as const,
  qlCount: 13,
  questionsPerQl: 2,
  reviewQuestionCount: 26,
  exactReviewSeeds: COM002_V5_APPROVED_REVIEW_SEEDS,
  explicitApprovalVerified: true,
  approvalSource: "PRODUCT_OWNER_CHAT_EXPLICIT_APPROVAL" as const,
  approvedOn: "2026-08-28" as const,
  approvedSurface: "SIMPLIFIED_ENGLISH_V5" as const,
  v5CorpusAuditDefined: true,
  v5SamplerAuditDefined: true,
  v5ExecutedGreen: false,
  operationalEnglishFreezeAllowed: false,
  localizationFreezePromotionAllowed: false,
  questionStudioActivationAllowed: false,
  canonicalPersistenceAllowed: false,
  questionBankWritable: false,
  testEligibilityAllowed: false,
  mockEligibilityAllowed: false,
  publicEligibilityAllowed: false,
  productionReleaseAuthorized: false,
  nextGate: "EXECUTE_CANONICAL_V5_520_AND_EXACT_26_GREEN_THEN_CREATE_PINNED_ENGLISH_FREEZE" as const,
});
