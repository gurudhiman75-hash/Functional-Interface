import {
  INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE,
  INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE_ID,
  INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_VERSION,
  generateInt001ChapterAdminQuestionStudioBatch,
  listInt001ChapterAdminQuestionStudioCheckpoints,
  ownerOfInt001PermanentQl,
  type Int001ChapterAdminRequest,
} from "./int-001-chapter-question-studio-admin-adapter-v1";
import {
  INT_001_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
  INT_001_QUESTION_BANK_ACCEPTANCE_V1,
} from "./int-001-question-bank-acceptance-v1";

export const INT_001_CHAPTER_ADMIN_BANK_ONLY_VERSION =
  "INT-001-CHAPTER-ADMIN-BANK-ONLY-v2" as const;

const acceptance = INT_001_QUESTION_BANK_ACCEPTANCE_V1;

function activateQuestionForBankOnly<T extends Record<string, any>>(question: T) {
  if (question.questionBankWritable !== false || question.questionBankStatus !== "NOT_STORED") {
    throw new Error(`${question.qlId ?? "INT-001"}: source admin question is not at the certified review-only boundary.`);
  }
  if (question.testEligible !== false || question.mockTestEligible !== false || question.publiclyPublishable !== false) {
    throw new Error(`${question.qlId ?? "INT-001"}: source admin question has an unexpected downstream release flag.`);
  }

  return Object.freeze({
    ...question,
    questionStudioRegistrationStatus: acceptance.questionStudioRegistrationStatus,
    questionStudioStagingStatus: acceptance.questionStudioStagingStatus,
    questionBankStatus: acceptance.questionBankStatus,
    questionBankWritable: acceptance.questionBankWritable,
    questionBankAcceptanceMode: acceptance.questionBankAcceptanceMode,
    questionBankAcceptanceAuthority: acceptance.questionBankAcceptanceAuthority,
    testEligibility: acceptance.testEligibility,
    testEligible: acceptance.testEligible,
    mockTestEligible: acceptance.mockTestEligible,
    publiclyPublishable: acceptance.publiclyPublishable,
    automaticStudentPublication: acceptance.automaticStudentPublication,
    manualApprovalRequired: acceptance.manualApprovalRequired,
    bankOnlyActivationAuthority: INT_001_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
    traceability: Object.freeze({
      ...(question.traceability ?? {}),
      sourceChapterIntegrationAuthority: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_VERSION,
      bankOnlyActivationAuthority: INT_001_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
      bankOnlyActivationScope: acceptance.activationScope,
      historicalReviewItemMigrationAuthorized: acceptance.historicalReviewItemMigrationAuthorized,
    }),
  });
}

export const INT_001_CHAPTER_ADMIN_BANK_ONLY_PACKAGE = Object.freeze({
  ...INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE,
  runtimeMode: "QUESTION_STUDIO_ACTIVE" as const,
  reviewOnly: false as const,
  reviewRequired: true as const,
  questionStudioRegistrationStatus: acceptance.questionStudioRegistrationStatus,
  questionStudioStagingStatus: acceptance.questionStudioStagingStatus,
  questionBankStatus: acceptance.questionBankStatus,
  questionBankWritable: acceptance.questionBankWritable,
  questionBankAcceptanceMode: acceptance.questionBankAcceptanceMode,
  questionBankAcceptanceAuthority: acceptance.questionBankAcceptanceAuthority,
  manualApprovalRequired: acceptance.manualApprovalRequired,
  testEligibility: acceptance.testEligibility,
  testEligible: acceptance.testEligible,
  mockTestEligible: acceptance.mockTestEligible,
  publiclyPublishable: acceptance.publiclyPublishable,
  automaticStudentPublication: acceptance.automaticStudentPublication,
  bankOnlyActivationAuthority: INT_001_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
  bankOnlyActivationScope: acceptance.activationScope,
  historicalReviewItemMigrationAuthorized: acceptance.historicalReviewItemMigrationAuthorized,
  integrationAuthority: INT_001_CHAPTER_ADMIN_BANK_ONLY_VERSION,
  sourceChapterIntegrationAuthority: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_VERSION,
});

export async function generateInt001ChapterAdminBankOnlyBatch(
  request: Int001ChapterAdminRequest = {},
) {
  const source = await generateInt001ChapterAdminQuestionStudioBatch(request);
  const questions = Object.freeze(source.questions.map((question) => activateQuestionForBankOnly(question)));
  const result = Object.freeze({
    ...source,
    integrationAuthority: INT_001_CHAPTER_ADMIN_BANK_ONLY_VERSION,
    sourceChapterIntegrationAuthority: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_VERSION,
    bankOnlyActivationAuthority: INT_001_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
    questionBankAcceptanceMode: acceptance.questionBankAcceptanceMode,
    questions,
  });
  JSON.stringify(result);
  return result;
}

export {
  INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE_ID,
  listInt001ChapterAdminQuestionStudioCheckpoints,
  ownerOfInt001PermanentQl,
};
