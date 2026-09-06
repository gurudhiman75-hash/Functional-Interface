import { COM003_DIFFICULTY_AUTHORITY_VERSION_V1, COM003_HARD_DIFFICULTY_STATUS_V1 } from "../../knowledge-v1/computer-awareness/com003-difficulty-authority-v1";
import { COM003_ENGLISH_FREEZE_AUTHORITY_V2 } from "../../knowledge-v1/computer-awareness/com003-english-freeze-v2";
import { COM003_LOCALIZATION_V2_CHAPTER_FREEZE_AUTHORITY_V1 } from "../../knowledge-v1/computer-awareness/com003-localization-v2-chapter-freeze-v1";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";
import { COM003_REVIEW_ONLY_ACTIVATION_AUTHORITY_V1 } from "./com003-review-only-activation-authority-v1";

/**
 * Final chapter-completion authority for COM-003 Office & Productivity Software.
 *
 * "Complete" here means the governed content package is frozen, localized,
 * difficulty-audited and operational in the standard Question Studio
 * REVIEW_ONLY lifecycle. It deliberately does NOT grant canonical Question
 * Bank writes, test/mock eligibility, publication or production release.
 */
export const COM003_CHAPTER_COMPLETION_AUTHORITY_V1 = Object.freeze({
  authorityId: "COM-003-CHAPTER-COMPLETION-V1" as const,
  chapterId: "COM-003" as const,
  packageId: "COM-003" as const,
  chapterTitle: "Office & Productivity Software" as const,
  status: "COMPLETE_STANDARD_REVIEW_ONLY" as const,
  completedAt: "2026-09-06" as const,
  completionBaselineHeadSha: "0dbfd6e0b9248a54da493880f3ad0153ee0bb38d" as const,
  contentAuthority: Object.freeze({
    englishFreezeAuthorityId: COM003_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
    localizationFreezeAuthorityId: COM003_LOCALIZATION_V2_CHAPTER_FREEZE_AUTHORITY_V1.authorityId,
    difficultyAuthorityVersion: COM003_DIFFICULTY_AUTHORITY_VERSION_V1,
    baseReviewOnlyActivationAuthorityId: COM003_REVIEW_ONLY_ACTIVATION_AUTHORITY_V1.authorityId,
    qlCount: 19,
    cpCount: 4,
    englishQuestionCount: 228,
    hindiQuestionCount: 228,
    punjabiQuestionCount: 228,
    questionLanguageArtifactCount: 684,
    languages: ["en", "hi", "pa"] as const,
    questionsPerQlPerLanguage: 12,
  }),
  difficultyAuthorization: Object.freeze({
    filterAuthorizedInReviewOnly: true,
    supportedDifficulties: ["Easy", "Medium"] as const,
    hardDifficultyAuthorized: COM003_HARD_DIFFICULTY_STATUS_V1.authorized,
    productionDifficultyClaimAuthorized: false,
  }),
  verificationEvidence: Object.freeze({
    semanticEditorialAudit: Object.freeze({
      workflowName: "COM-003 Localization V2 Semantic Editorial Audit" as const,
      workflowRunId: 33980455084,
      conclusion: "success" as const,
    }),
    localizationFreeze: Object.freeze({
      workflowName: "COM-003 Localization V2 Chapter Freeze V1" as const,
      workflowRunId: 33980455048,
      conclusion: "success" as const,
    }),
    difficultyAuthority: Object.freeze({
      workflowName: "COM-003 Difficulty Authority V1" as const,
      workflowRunId: 33980455042,
      workflowJobId: 101344632403,
      conclusion: "success" as const,
    }),
    questionStudioRuntime: Object.freeze({
      workflowName: "COM-003 Question Studio V2 Runtime" as const,
      workflowRunId: 33980454990,
      workflowJobId: 101344632075,
      conclusion: "success" as const,
    }),
  }),
  operationalLifecycle: Object.freeze({
    lifecycleId: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.lifecycleId,
    lifecycleStage: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.stage,
    questionStudioDiscoverable: true,
    questionStudioGenerationEnabled: true,
    reviewRunPersistenceAllowed:
      QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.reviewRunPersistenceAllowed,
    canonicalQuestionPersistenceAllowed:
      QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.canonicalQuestionPersistenceAllowed,
    questionBankWritable: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.questionBankWritable,
    testEligible: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.testEligible,
    mockTestEligible: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.mockTestEligible,
    publiclyPublishable: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.publiclyPublishable,
    automaticStudentPublication:
      QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.automaticStudentPublication,
    productionReleaseAuthorized:
      QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.productionReleaseAuthorized,
  }),
  remainingLocks: Object.freeze({
    canonicalQuestionPersistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    productionReleaseAuthorized: false,
  }),
  nextLifecycleGate: "STANDARD_MANUAL_REVIEW_AND_EXPLICIT_QUESTION_BANK_ACCEPTANCE" as const,
  invalidationRule:
    "Any drift in the COM-003 English V2 freeze, Localization V2 freeze, audited difficulty authority, REVIEW_ONLY registry contract or generated semantics invalidates this completion authority and requires a new governed completion version." as const,
});

export type Com003ChapterCompletionAuthorityV1 =
  typeof COM003_CHAPTER_COMPLETION_AUTHORITY_V1;
