import {
  RNK_001_QUESTION_STUDIO_RELEASE_FREEZE,
  RNK_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
  RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  RNK_001_QUESTION_STUDIO_REVIEW_STATUS,
  type RnkQuestionStudioReviewQuestion,
} from "./question-studio-review";
import { declutterRnkExplanation } from "./rnk-001-explanation-declutter-v1";

export const RNK_001_QUESTION_STUDIO_REVISION_POLICY = "FROZEN_AUTHORITY_REGENERATION_ONLY" as const;

function sourceFingerprint(question: RnkQuestionStudioReviewQuestion): string {
  const source = question.source as Record<string, any>;
  return String(
    source.permanentRuntimeFingerprint
      ?? source.mathematicalFingerprint
      ?? source.normalizedLearnerFingerprint
      ?? source.learnerFingerprint
      ?? question.questionId,
  );
}

function learnerExplanation(question: RnkQuestionStudioReviewQuestion): string {
  const source = question.source as Record<string, any>;
  return declutterRnkExplanation({
    explanation: source.explanation ?? question.explanation,
    qlId: question.qlId,
    locale: question.locale,
    answer: question.answer,
  });
}

export function buildRnk001QuestionStudioPayload(question: RnkQuestionStudioReviewQuestion) {
  return {
    text: question.displayStem,
    stem: question.displayStem,
    options: question.options,
    optionDetails: question.optionDetails,
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    answer: question.answer,
    canonicalAnswer: question.answer,
    explanation: learnerExplanation(question),
    renderer: "STRUCTURED_TEXT" as const,
    difficulty: question.difficultyBand,
    difficultyLabel: question.difficultyBand,
    patternId: question.patternId,
    qlId: question.qlId,
    permanentQlId: question.permanentQlId,
    permanentQlAllocationStatus: "ALLOCATED_FROZEN" as const,
    packageId: question.packageId,
    chapterId: question.chapterId,
    checkpointId: question.checkpointId,
    canonicalProblemId: question.qlId,
    canonicalItemId: `${question.checkpointId}:${question.qlId}`,
    questionLanguageId: question.questionId,
    questionId: question.questionId,
    topic: "Reasoning",
    subtopic: "Ranking & Order",
    subject: "Reasoning Ability",
    language: question.language,
    locale: question.locale,
    seed: String(question.seed),
    runtimeMode: RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE.runtimeMode,
    reviewStatus: RNK_001_QUESTION_STUDIO_REVIEW_STATUS,
    lifecycleStatus: question.lifecycleStatus,
    questionStudioVisible: true as const,
    questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
    questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
    revisionPolicy: RNK_001_QUESTION_STUDIO_REVISION_POLICY,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    manualApprovalRequired: true as const,
    automaticStudentPublication: false as const,
    releaseFreezeStatus: RNK_001_QUESTION_STUDIO_RELEASE_FREEZE,
    integrationAuthority: RNK_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
    examProfileId: question.examProfileId,
    realismTier: question.realismTier,
    optionCount: question.optionCount,
    sourceFingerprint: sourceFingerprint(question),
    sourceValidation: question.validation,
    generationContext: {
      generationDomain: "reasoning-v1" as const,
      packageId: "RNK-001" as const,
      chapterId: "RNK-001" as const,
      checkpointId: question.checkpointId,
      permanentQlId: question.permanentQlId,
      examProfileId: question.examProfileId,
      realismTier: question.realismTier,
      optionCount: question.optionCount,
      runtimeMode: RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE.runtimeMode,
      reviewStatus: RNK_001_QUESTION_STUDIO_REVIEW_STATUS,
      lifecycleStatus: "REVIEW_ONLY" as const,
      reviewOnly: true as const,
      englishOnlyUntilMultilingualConsolidation: true as const,
      percentageAdapterStatus: RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE.percentageAdapterStatus,
      explanationPresentation: "DECLUTTERED_V1" as const,
      reviewRunPersistenceAllowed: true as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
      releaseFreezeStatus: RNK_001_QUESTION_STUDIO_RELEASE_FREEZE,
    },
  };
}
