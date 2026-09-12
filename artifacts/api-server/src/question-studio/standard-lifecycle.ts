export const QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 = Object.freeze({
  lifecycleId: "QUESTION-STUDIO-STANDARD-REVIEW-ONLY-V1" as const,
  stage: "REVIEW_ONLY" as const,
  reviewSurfaceRequired: true as const,
  reviewRunPersistenceAllowed: true as const,
  canonicalQuestionPersistenceAllowed: false as const,
  manualApprovalRequired: true as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  questionBankAcceptanceMode: null,
  questionBankAcceptanceAuthority: null,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  productionReleaseAuthorized: false as const,
});

export const QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1 = Object.freeze({
  lifecycleId: "QUESTION-STUDIO-STANDARD-BANK-ONLY-V1" as const,
  stage: "BANK_ONLY" as const,
  reviewSurfaceRequired: true as const,
  reviewRunPersistenceAllowed: true as const,
  canonicalQuestionPersistenceAllowed: true as const,
  manualApprovalRequired: true as const,
  questionBankStatus: "READY_FOR_STORAGE" as const,
  questionBankWritable: true as const,
  questionBankAcceptanceMode: "BANK_ONLY" as const,
  questionBankAcceptanceAuthority:
    "QUESTION-STUDIO-STANDARD-BANK-ONLY-V1" as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  productionReleaseAuthorized: false as const,
});

export type StandardQuestionStudioLifecycle =
  | typeof QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1
  | typeof QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1;

export function getStandardQuestionStudioLifecycle(
  stage: "REVIEW_ONLY" | "BANK_ONLY",
): StandardQuestionStudioLifecycle {
  return stage === "BANK_ONLY"
    ? QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1
    : QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
}
