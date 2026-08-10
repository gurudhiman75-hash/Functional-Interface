import {
  generateSerCp007QuestionStudioReadinessProjection,
  generateSerCp007QuestionStudioReadinessSweep,
  type SerCp007QuestionStudioReadinessInput,
  type SerCp007QuestionStudioReadinessProjection,
} from "../SER-CP-007-QUESTION-STUDIO-READINESS/ser-cp-007-question-studio-readiness";

export const SER_CP007_QUESTION_STUDIO_RUNTIME_AUTHORITY =
  "SER_CP007_QUESTION_STUDIO_REVIEW_RUNTIME_V1" as const;

export const SER_CP007_QUESTION_STUDIO_RUNTIME_MODE =
  "FROZEN_REVIEW" as const;

export const SER_CP007_QUESTION_STUDIO_REVIEW_STATUS =
  "APPROVED_MULTILINGUAL_FROZEN" as const;

export type SerCp007QuestionStudioReviewProjection = ReturnType<
  typeof activateSerCp007QuestionStudioReview
>;

function activateSerCp007QuestionStudioReview(
  source: SerCp007QuestionStudioReadinessProjection,
) {
  const questionId = [
    source.packageId,
    source.temporaryTemplateId,
    source.seed,
    source.language,
    SER_CP007_QUESTION_STUDIO_RUNTIME_MODE,
  ].join(":");

  const generationContext = Object.freeze({
    ...source.generationContext,
    generationDomain: "reasoning-v1" as const,
    topic: "Reasoning" as const,
    subtopic: "Series" as const,
    patternId: source.permanentQlId,
    questionId,
    integrationAuthority: SER_CP007_QUESTION_STUDIO_RUNTIME_AUTHORITY,
    integrationStatus: "QUESTION_STUDIO_ACTIVE_REVIEW_ONLY" as const,
    runtimeMode: SER_CP007_QUESTION_STUDIO_RUNTIME_MODE,
    reviewStatus: SER_CP007_QUESTION_STUDIO_REVIEW_STATUS,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    active: true as const,
    questionStudioDiscoverable: true as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
    sourceLifecycle: Object.freeze({
      active: source.active,
      questionStudioDiscoverable: source.questionStudioDiscoverable,
      questionBankWritable: source.questionBankWritable,
      testEligible: source.testEligible,
      publiclyPublishable: source.publiclyPublishable,
    }),
  });

  return Object.freeze({
    ...source,
    questionId,
    patternId: source.permanentQlId,
    topic: "Reasoning" as const,
    subtopic: "Series" as const,
    difficultyLabel: source.difficulty,
    correct: source.correctIndex,
    integrationAuthority: SER_CP007_QUESTION_STUDIO_RUNTIME_AUTHORITY,
    integrationStatus: "QUESTION_STUDIO_ACTIVE_REVIEW_ONLY" as const,
    runtimeMode: SER_CP007_QUESTION_STUDIO_RUNTIME_MODE,
    reviewStatus: SER_CP007_QUESTION_STUDIO_REVIEW_STATUS,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    active: true as const,
    questionStudioDiscoverable: true as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
    generationContext,
    traceability: Object.freeze({
      questionId,
      packageId: source.packageId,
      canonicalProblemId: source.canonicalProblemId,
      permanentQlId: source.permanentQlId,
      questionLanguageId: source.questionLanguageId,
      temporaryTemplateId: source.temporaryTemplateId,
      seed: source.seed,
      language: source.language,
      locale: source.locale,
      authorityId: source.authorityId,
      subtypeId: source.subtypeId,
      learnerRenderer: source.learnerRenderer,
      taskKind: source.taskKind,
      generationMode: SER_CP007_QUESTION_STUDIO_RUNTIME_MODE,
      reviewStatus: SER_CP007_QUESTION_STUDIO_REVIEW_STATUS,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
    }),
    validation: Object.freeze({
      valid: true as const,
      ok: true as const,
      checks: Object.freeze([
        ...source.validation.checks,
        Object.freeze({
          name: "question-studio-review-activation",
          passed: true as const,
          message:
            "The frozen multilingual item is active only on the Question Studio review surface.",
        }),
        Object.freeze({
          name: "downstream-release-lock",
          passed: true as const,
          message:
            "Question Bank, test assembly and public publication remain blocked.",
        }),
      ]),
    }),
  });
}

export function generateSerCp007QuestionStudioReview(
  input: SerCp007QuestionStudioReadinessInput,
) {
  return activateSerCp007QuestionStudioReview(
    generateSerCp007QuestionStudioReadinessProjection(input),
  );
}

export function generateSerCp007QuestionStudioReviewSweep(seed: number) {
  return Object.freeze(
    generateSerCp007QuestionStudioReadinessSweep(seed).map(
      activateSerCp007QuestionStudioReview,
    ),
  );
}

export const SER_CP007_QUESTION_STUDIO_RUNTIME_STATE = Object.freeze({
  authority: SER_CP007_QUESTION_STUDIO_RUNTIME_AUTHORITY,
  packageId: "SER-001" as const,
  canonicalProblemId: "SER-CP-007" as const,
  runtimeMode: SER_CP007_QUESTION_STUDIO_RUNTIME_MODE,
  reviewStatus: SER_CP007_QUESTION_STUDIO_REVIEW_STATUS,
  active: true as const,
  questionStudioDiscoverable: true as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});
