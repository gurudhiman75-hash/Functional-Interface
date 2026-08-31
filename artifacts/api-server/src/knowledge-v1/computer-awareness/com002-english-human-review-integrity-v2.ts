import { COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1 } from "./com002-english-human-review-integrity-v1";
import { COM002_ENGLISH_GENERATOR_VERSION_V3 } from "./com002-review-synthesis-v3";

/**
 * Executed V3 English review integrity authority.
 *
 * The V3 corpus and exact 26-question sampler have now executed green and the
 * exact learner-facing pack has been materialized in-repo. This authority does
 * NOT claim human approval. It moves the only remaining English review blocker
 * from execution/materialization to explicit product-owner approval.
 */
export const COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2 = Object.freeze({
  authorityId: "COM-002-ENGLISH-HUMAN-REVIEW-INTEGRITY-V2" as const,
  chapterId: "COM-002" as const,
  supersedes: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.authorityId,
  status: "BLOCKED_PENDING_EXPLICIT_PRODUCT_OWNER_APPROVAL_OF_EXECUTED_V3_PACK" as const,
  reviewPack: {
    generatorVersion: COM002_ENGLISH_GENERATOR_VERSION_V3,
    title: "COM-002-HUMAN-REVIEW-WAVE-1-V3.md" as const,
    repositoryPath:
      "artifacts/api-server/src/knowledge-v1/computer-awareness/COM-002-HUMAN-REVIEW-WAVE-1-V3.md" as const,
    samplerTestPath:
      "artifacts/api-server/src/knowledge-v1/computer-awareness/com002-human-review-wave1-v3.test.ts" as const,
    exactSeedFamily: "human-review-wave1:COM-002-QL-001..013:{A|B}" as const,
    questionCount: 26,
    qlCount: 13,
    questionsPerQl: 2,
    language: "en" as const,
    materializedPackAvailable: true,
    observedStatus: "EXECUTED_GREEN_AWAITING_EXPLICIT_APPROVAL" as const,
  },
  exactExecutedEvidence: {
    featureHeadSha: "d1d8629f896fb8c4643b61ee69d12301c0442fe9" as const,
    pullRequestNumber: 1019,
    pullRequestMergeSha: "75946fbdb5732986b4e6f75a6e51e7665088184c" as const,
    workflowName: "Validate Question Studio Content Engine Foundation V1" as const,
    workflowRunNumber: 404,
    workflowRunId: 33053333684,
    workflowJobId: 98453914630,
    conclusion: "SUCCESS" as const,
    englishV3CorpusQuestions: 520,
    englishV3SamplerQuestions: 26,
    localizationV2ParityQuestions: 1040,
    localizationV2SamplerQuestions: 26,
    preBankCandidateQuestions: 390,
  },
  v3SafetyRemediation: {
    ql004KernelCoreProvenanceRebound: true,
    ql004PrincipalRoleAmbiguityReduced: true,
    ql013HierarchicalClassificationFalseSwapRemoved: true,
    ql013SafeRelationFamiliesOnly: true,
  },
  automatedEvidence: {
    v3AuditDefined: true,
    v3SamplerDefined: true,
    v3ExecutedGreen: true,
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
    "The product owner must explicitly approve the materialized exact 26-question COM-002 English V3 pack. A new operational English V3 freeze authority must then bind that approval and the pinned V3 machine fingerprints before localization freeze or Question Studio promotion.",
});
