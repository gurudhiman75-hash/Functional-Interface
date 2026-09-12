import {
  INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE,
  INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_VERSION,
  generateInt001ChapterAdminQuestionStudioBatch,
} from "./int-001-chapter-question-studio-admin-adapter-v1";

export const INT_001_QUESTION_BANK_READINESS_AUTHORITY =
  "INT-001-QUESTION-BANK-READINESS-v1" as const;

export const INT_001_PROPOSED_BANK_ONLY_ACCEPTANCE_AUTHORITY =
  "INT-001-PROPOSED-BANK-ONLY-ACCEPTANCE-v1" as const;

export const INT_001_QUESTION_BANK_READINESS_V1 = Object.freeze({
  authorityId: INT_001_QUESTION_BANK_READINESS_AUTHORITY,
  packageId: "INT-001" as const,
  sourceQuestionStudioAuthority: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_VERSION,
  status: "READINESS_CERTIFICATION_ONLY" as const,
  permanentQlCount: 133 as const,
  qlLanguageSurfaceCount: 399 as const,
  supportedLanguages: Object.freeze(["en", "hi", "pa"] as const),

  currentLifecycle: Object.freeze({
    questionStudioDiscoverable: true as const,
    questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
    questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
  }),

  proposedBankOnlyLifecycle: Object.freeze({
    questionBankStatus: "READY_FOR_STORAGE" as const,
    questionBankWritable: true as const,
    questionBankAcceptanceMode: "BANK_ONLY" as const,
    questionBankAcceptanceAuthority:
      INT_001_PROPOSED_BANK_ONLY_ACCEPTANCE_AUTHORITY,
    manualApprovalRequired: true as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
  }),

  activationAuthorized: false as const,
  mutatesLiveQuestionStudioPayloads: false as const,
  mutatesPersistedReviewItems: false as const,
  enablesQuestionBankWrites: false as const,
  enablesTests: false as const,
  enablesMocks: false as const,
  enablesPublication: false as const,
  nextGate: "EXPLICIT_INT_001_BANK_ONLY_ACTIVATION_REQUIRES_SEPARATE_CHECKPOINT" as const,
});

type ChapterQuestion = Awaited<
  ReturnType<typeof generateInt001ChapterAdminQuestionStudioBatch>
>["questions"][number];

/**
 * Build the exact lifecycle/payload envelope that a future explicit BANK_ONLY
 * activation would need to emit. This helper is audit-only: no production
 * Interest adapter or persisted review item imports or invokes it.
 */
export function buildInt001BankOnlyReadinessProbe(question: ChapterQuestion) {
  const lifecycle = INT_001_QUESTION_BANK_READINESS_V1.proposedBankOnlyLifecycle;
  const explanation = question.explanationLines.join("\n");
  return Object.freeze({
    text: question.stem,
    stem: question.stem,
    options: question.options,
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    answer: question.answer,
    canonicalAnswer: question.answer,
    explanation,
    richExplanation: Object.freeze({
      steps: question.explanationLines,
      conclusion: question.answer,
    }),
    difficulty: question.difficultyBand,
    difficultyLabel: question.difficultyBand,
    patternId: question.qlId,
    qlId: question.qlId,
    permanentQlId: question.qlId,
    packageId: "INT-001" as const,
    chapterId: "INT-001" as const,
    canonicalProblemId: question.checkpointId,
    checkpointId: question.checkpointId,
    sourceCanonicalProblemId: question.sourceCanonicalProblemId,
    canonicalItemId: question.canonicalItemId,
    questionLanguageId: question.questionLanguageId,
    questionId: question.questionId,
    topic: "Arithmetic" as const,
    subtopic: "Interest" as const,
    subject: "Quantitative Aptitude" as const,
    language: question.language,
    locale: question.locale,
    seed: question.seed,
    runtimeMode: question.runtimeMode,
    reviewStatus: "QUESTION_STUDIO_REVIEW_WITH_BANK_ONLY_READINESS_PROBE" as const,
    questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
    questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
    questionBankStatus: lifecycle.questionBankStatus,
    questionBankWritable: lifecycle.questionBankWritable,
    questionBankAcceptanceMode: lifecycle.questionBankAcceptanceMode,
    questionBankAcceptanceAuthority: lifecycle.questionBankAcceptanceAuthority,
    testEligibility: lifecycle.testEligibility,
    testEligible: lifecycle.testEligible,
    mockTestEligible: lifecycle.mockTestEligible,
    publiclyPublishable: lifecycle.publiclyPublishable,
    automaticStudentPublication: lifecycle.automaticStudentPublication,
    manualApprovalRequired: lifecycle.manualApprovalRequired,
    integrationAuthority: question.integrationAuthority,
    chapterIntegrationAuthority: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_VERSION,
    readinessAuthority: INT_001_QUESTION_BANK_READINESS_AUTHORITY,
    generationContext: Object.freeze({
      generationDomain: "quant-v4" as const,
      packageId: "INT-001" as const,
      chapterId: "INT-001" as const,
      checkpointId: question.checkpointId,
      permanentQlId: question.qlId,
      qlId: question.qlId,
      sourceCanonicalProblemId: question.sourceCanonicalProblemId,
      runtimeMode: question.runtimeMode,
      reviewStatus: "QUESTION_STUDIO_REVIEW_WITH_BANK_ONLY_READINESS_PROBE" as const,
      questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
      questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
      questionBankStatus: lifecycle.questionBankStatus,
      questionBankWritable: lifecycle.questionBankWritable,
      questionBankAcceptanceMode: lifecycle.questionBankAcceptanceMode,
      questionBankAcceptanceAuthority: lifecycle.questionBankAcceptanceAuthority,
      testEligibility: lifecycle.testEligibility,
      testEligible: lifecycle.testEligible,
      mockTestEligible: lifecycle.mockTestEligible,
      publiclyPublishable: lifecycle.publiclyPublishable,
      automaticStudentPublication: lifecycle.automaticStudentPublication,
      manualApprovalRequired: lifecycle.manualApprovalRequired,
      integrationAuthority: question.integrationAuthority,
      chapterIntegrationAuthority: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_VERSION,
      readinessAuthority: INT_001_QUESTION_BANK_READINESS_AUTHORITY,
    }),
  });
}

if (INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE.questionBankWritable !== false) {
  throw new Error("INT-001 readiness module loaded while live Question Bank writes are already enabled.");
}
