import { COM002_ENGLISH_FREEZE_AUTHORITY_V1 } from "./com002-english-freeze-v1";
import { COM002_ENGLISH_GENERATOR_VERSION_V3 } from "./com002-review-synthesis-v3";

/**
 * Superseding integrity record for COM-002 English review.
 *
 * The historical V1 freeze claimed chat approval without an explicit
 * product-owner approval of the exact review pack. Subsequent safety review
 * also found QL-004 provenance/ambiguity risk and QL-013 hierarchical false-
 * statement risk. Those are remediated only in the V3 candidate generator.
 *
 * Therefore no materialized pack is currently approvable until the V3 sampler
 * executes and is captured exactly. All downstream promotion stays fail-closed.
 */
export const COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1 = Object.freeze({
  authorityId: "COM-002-ENGLISH-HUMAN-REVIEW-INTEGRITY-V1" as const,
  chapterId: "COM-002" as const,
  status: "BLOCKED_PENDING_V3_REVIEW_PACK_EXECUTION_AND_EXPLICIT_APPROVAL" as const,
  reviewCandidate: {
    generatorVersion: COM002_ENGLISH_GENERATOR_VERSION_V3,
    samplerTestPath:
      "artifacts/api-server/src/knowledge-v1/computer-awareness/com002-human-review-wave1-v3.test.ts" as const,
    intendedPackTitle: "COM-002-HUMAN-REVIEW-WAVE-1-V3.md" as const,
    exactSeedFamily: "human-review-wave1:COM-002-QL-001..013:{A|B}" as const,
    questionCount: 26,
    qlCount: 13,
    questionsPerQl: 2,
    language: "en" as const,
    materializedPackAvailable: false,
    observedStatus: "AWAITING_EXECUTED_V3_SAMPLER" as const,
  },
  v3SafetyRemediation: {
    ql004KernelCoreProvenanceRebound: true,
    ql004PrincipalRoleAmbiguityReduced: true,
    ql013HierarchicalClassificationFalseSwapRemoved: true,
    ql013SafeRelationFamiliesOnly: true,
    exactV3CorpusAuditQuestionCount: 520,
    exactV3SamplerQuestionCount: 26,
  },
  automatedEvidence: {
    historicalV2EnglishAuditQuestionCount: 520,
    v3AuditDefined: true,
    v3SamplerDefined: true,
    v3ExecutedGreen: false,
    humanApprovalSubstitutableByAutomation: false,
  },
  historicalFreezeRecord: {
    authorityId: COM002_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
    claimedHumanReviewStatus: COM002_ENGLISH_FREEZE_AUTHORITY_V1.humanReview.status,
    claimedApprovalSource: COM002_ENGLISH_FREEZE_AUTHORITY_V1.humanReview.approvalSource,
    operationallyValid: false,
    invalidationReasons: [
      "No explicit product-owner approval of the exact 26-question COM-002 English pack is evidenced.",
      "V3 safety remediation supersedes V2 learner content for QL-004 and QL-013.",
    ] as const,
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
    "Execute the 520-question V3 audit and exact 26-question V3 sampler, materialize that exact V3 review pack, obtain explicit product-owner approval of it, then create a new English freeze authority bound to the approved V3 corpus before rebasing and freezing localization or activating Question Studio.",
});
