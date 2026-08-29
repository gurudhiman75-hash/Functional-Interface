import * as ReviewCandidate from "./question-studio-review-v4-1.ts";

export * from "./question-studio-review-v4-1.ts";

export const STA_001_QUESTION_STUDIO_REVIEW_AUTHORITY = "STA-001-QUESTION-STUDIO-EXAM-REALNESS-V4-1-FROZEN" as const;
export const STA_001_QUESTION_STUDIO_REVIEW_STATUS = "EXAM_REALNESS_V4_1_FROZEN_REVIEW_ONLY" as const;
export const STA_001_QUESTION_STUDIO_RELEASE_FREEZE = "STA-001-V4-1-FROZEN" as const;
export const STA_001_QUESTION_STUDIO_RUNTIME_MODE = ReviewCandidate.STA_001_QUESTION_STUDIO_RUNTIME_MODE;
export const STA_001_V41_PERMANENT_QL_IDS = ReviewCandidate.STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.candidateQlIds;

export const STA_001_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  ...ReviewCandidate.STA_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  permanentQlCount: 6 as const,
  permanentQlIds: STA_001_V41_PERMANENT_QL_IDS,
  candidateQlCount: 6 as const,
  candidateQlIds: STA_001_V41_PERMANENT_QL_IDS,
  permanentQlAllocationStatus: "V4_1_SIX_QL_FROZEN" as const,
  candidateQlAllocationStatus: "V4_1_FROZEN_AUTHORITY" as const,
  qls: Object.freeze(ReviewCandidate.STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.qls.map((entry) => Object.freeze({
    ...entry,
    status: "V4_1_FROZEN" as const,
  }))),
  reviewStatus: STA_001_QUESTION_STUDIO_REVIEW_STATUS,
  integrationAuthority: STA_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
  releaseFreezeStatus: STA_001_QUESTION_STUDIO_RELEASE_FREEZE,
  multilingualChapterFrozen: true as const,
  questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
  questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
  questionStudioVisible: true as const,
  reviewOnly: true as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  manualApprovalRequired: true as const,
  sourceRuntimeQuestionStudioDiscoverable: false as const,
});

type ReviewCandidateQuestion = ReviewCandidate.StaQuestionStudioReviewQuestion;
export type StaQuestionStudioReviewQuestion = Omit<
  ReviewCandidateQuestion,
  "permanentQlId" | "integrationAuthority" | "reviewStatus" | "validation" | "source"
> & {
  readonly permanentQlId: ReviewCandidateQuestion["qlId"];
  readonly integrationAuthority: typeof STA_001_QUESTION_STUDIO_REVIEW_AUTHORITY;
  readonly reviewStatus: typeof STA_001_QUESTION_STUDIO_REVIEW_STATUS;
  readonly validation: Omit<ReviewCandidateQuestion["validation"], "multilingualFrozen"> & {
    readonly multilingualFrozen: true;
  };
  readonly source: Omit<ReviewCandidateQuestion["source"], "freezeId"> & {
    readonly freezeId: typeof STA_001_QUESTION_STUDIO_RELEASE_FREEZE;
  };
};

function freezeReviewQuestion(question: ReviewCandidateQuestion): StaQuestionStudioReviewQuestion {
  return Object.freeze({
    ...question,
    permanentQlId: question.qlId,
    integrationAuthority: STA_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
    reviewStatus: STA_001_QUESTION_STUDIO_REVIEW_STATUS,
    validation: Object.freeze({
      ...question.validation,
      multilingualFrozen: true as const,
    }),
    source: Object.freeze({
      ...question.source,
      freezeId: STA_001_QUESTION_STUDIO_RELEASE_FREEZE,
    }),
  });
}

export function previewSta001QuestionStudioReview(input: ReviewCandidate.PreviewSta001QuestionStudioInput = {}) {
  const preview = ReviewCandidate.previewSta001QuestionStudioReview(input);
  return Object.freeze({
    questions: Object.freeze(preview.questions.map(freezeReviewQuestion)),
    integrationAuthority: STA_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
    reviewOnly: true as const,
  });
}

export function assertSta001QuestionStudioPersistenceAllowed(): never {
  throw new Error("STA-001 V4.1 is frozen for Question Studio review only; Question Bank/test/mock/public delivery remains locked until a separate release approval.");
}
