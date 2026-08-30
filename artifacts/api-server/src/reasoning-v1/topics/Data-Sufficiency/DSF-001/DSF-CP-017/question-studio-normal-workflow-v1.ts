import {
  DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewDsf001NormalQuestionStudioReview,
  type DsfCp017QuestionStudioInput,
} from "./question-studio-review-v1.ts";

export const DSF_CP017_NORMAL_WORKFLOW_AUTHORITY = "DSF_CP017_NORMAL_QUESTION_STUDIO_BANK_ONLY_V1" as const;
export const DSF_CP017_QUESTION_BANK_ACCEPTANCE_AUTHORITY = "DSF_CP017_BANK_ONLY_AFTER_MANUAL_APPROVAL_V1" as const;

export const DSF_CP017_NORMAL_QUESTION_STUDIO_PACKAGE = Object.freeze({
  ...DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE,
  integrationAuthority: DSF_CP017_NORMAL_WORKFLOW_AUTHORITY,
  runtimeMode: "NORMAL_QUESTION_STUDIO_REVIEW_BANK_ONLY" as const,
  reviewStatus: "QUESTION_STUDIO_REVIEW_CONNECTED_BANK_ONLY" as const,
  reviewOnly: true as const,
  manualApprovalRequired: true as const,
  questionBankStatus: "READY_FOR_STORAGE" as const,
  questionBankWritable: true as const,
  questionBankAcceptanceMode: "BANK_ONLY" as const,
  questionBankAcceptanceAuthority: DSF_CP017_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
});

function bankOnlyQuestion(question: Readonly<Record<string, any>>) {
  return Object.freeze({
    ...question,
    integrationAuthority: DSF_CP017_NORMAL_WORKFLOW_AUTHORITY,
    runtimeMode: DSF_CP017_NORMAL_QUESTION_STUDIO_PACKAGE.runtimeMode,
    reviewStatus: DSF_CP017_NORMAL_QUESTION_STUDIO_PACKAGE.reviewStatus,
    reviewOnly: true as const,
    manualApprovalRequired: true as const,
    questionBankStatus: "READY_FOR_STORAGE" as const,
    questionBankWritable: true as const,
    questionBankAcceptanceMode: "BANK_ONLY" as const,
    questionBankAcceptanceAuthority: DSF_CP017_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    generationContext: Object.freeze({
      ...(question.generationContext ?? {}),
      integrationAuthority: DSF_CP017_NORMAL_WORKFLOW_AUTHORITY,
      runtimeMode: DSF_CP017_NORMAL_QUESTION_STUDIO_PACKAGE.runtimeMode,
      reviewStatus: DSF_CP017_NORMAL_QUESTION_STUDIO_PACKAGE.reviewStatus,
      reviewOnly: true as const,
      manualApprovalRequired: true as const,
      questionBankStatus: "READY_FOR_STORAGE" as const,
      questionBankWritable: true as const,
      questionBankAcceptanceMode: "BANK_ONLY" as const,
      questionBankAcceptanceAuthority: DSF_CP017_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    }),
  });
}

export function generateDsf001NormalQuestionStudioWorkflow(input: DsfCp017QuestionStudioInput = {}) {
  const review = previewDsf001NormalQuestionStudioReview(input);
  const questions = Object.freeze(review.questions.map((question) => bankOnlyQuestion(question)));
  return Object.freeze({
    ...review,
    integrationAuthority: DSF_CP017_NORMAL_WORKFLOW_AUTHORITY,
    generationContext: Object.freeze({
      ...review.generationContext,
      integrationAuthority: DSF_CP017_NORMAL_WORKFLOW_AUTHORITY,
      runtimeMode: DSF_CP017_NORMAL_QUESTION_STUDIO_PACKAGE.runtimeMode,
      reviewStatus: DSF_CP017_NORMAL_QUESTION_STUDIO_PACKAGE.reviewStatus,
      reviewOnly: true as const,
      manualApprovalRequired: true as const,
      questionBankStatus: "READY_FOR_STORAGE" as const,
      questionBankWritable: true as const,
      questionBankAcceptanceMode: "BANK_ONLY" as const,
      questionBankAcceptanceAuthority: DSF_CP017_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    }),
    questions,
  });
}
