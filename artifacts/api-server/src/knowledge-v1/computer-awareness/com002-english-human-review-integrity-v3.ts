import { COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2 } from "./com002-english-human-review-integrity-v2";
import { COM002_ENGLISH_HUMAN_REVIEW_PACK_V4 } from "./com002-english-human-review-pack-v4";
import { COM002_ENGLISH_GENERATOR_VERSION_V4 } from "./com002-review-synthesis-v4";

/**
 * Executed V4 English review integrity authority.
 *
 * Canonical Content Engine run #452 proved the 520-question English V4 corpus,
 * exact 26-question V4 sampler, V4-bound Localization V3 corpus/sampler and
 * fail-closed pre-bank chain. This authority records execution evidence only.
 * Human/product-owner approval remains an independent blocking gate.
 */
export const COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3 = Object.freeze({
  authorityId: "COM-002-ENGLISH-HUMAN-REVIEW-INTEGRITY-V3" as const,
  chapterId: "COM-002" as const,
  supersedes: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.authorityId,
  status: "BLOCKED_PENDING_EXPLICIT_PRODUCT_OWNER_APPROVAL_OF_EXECUTED_V4_PACK" as const,
  reviewPack: {
    packId: COM002_ENGLISH_HUMAN_REVIEW_PACK_V4.packId,
    generatorVersion: COM002_ENGLISH_GENERATOR_VERSION_V4,
    repositoryPath:
      "artifacts/api-server/src/knowledge-v1/computer-awareness/com002-english-human-review-pack-v4.ts" as const,
    samplerTestPath:
      "artifacts/api-server/src/knowledge-v1/computer-awareness/com002-human-review-wave1-v4.test.ts" as const,
    exactSeedFamily: COM002_ENGLISH_HUMAN_REVIEW_PACK_V4.seedFamily,
    questionCount: 26,
    qlCount: 13,
    questionsPerQl: 2,
    language: "en" as const,
    materializedPackAvailable: true,
    observedStatus: "EXECUTED_GREEN_AWAITING_EXPLICIT_APPROVAL" as const,
  },
  exactExecutedEvidence: COM002_ENGLISH_HUMAN_REVIEW_PACK_V4.executionEvidence,
  v4EditorialRemediation: {
    ql004KernelCoreClassificationRoleMismatchRemoved: true,
    correctedCoreDescriptionCasesInCorpus: 6,
    knownProblemSeedCorrected: true,
    localizationV3PurposeGrammarRegressionLocked: true,
    localizationV3PunjabiPurposeOrthographyCorrected: true,
  },
  automatedEvidence: {
    v4AuditDefined: true,
    v4SamplerDefined: true,
    v4ExecutedGreen: true,
    localizationV3ExecutedGreen: true,
    exactPackMaterialized: true,
    humanApprovalSubstitutableByAutomation: false,
  },
  humanReview: {
    explicitApprovalVerified: false,
    approvalSource: null,
    approvedOn: null,
  },
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
    "The product owner must explicitly approve the exact 26-question COM-002 English V4 review pack. Only then may an operational English V4 freeze bind approval plus machine fingerprints; Localization V3 freeze and Question Studio activation remain subsequent independent gates.",
});
