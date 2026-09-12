import { CND_001_QUESTION_STUDIO_BANK_ONLY_ACTIVATION_AUTHORITY_V1 } from "./cubes-dice-question-studio-bank-activation-v1";

const BANK = CND_001_QUESTION_STUDIO_BANK_ONLY_ACTIVATION_AUTHORITY_V1;

if (BANK.status !== "ACTIVE_INTERNAL_BANK_ONLY") {
  throw new Error("CND Test Builder activation requires the bank-only activation first.");
}
if (!BANK.persistenceAllowed || !BANK.questionBankWritable || BANK.questionBankAcceptanceMode !== "BANK_ONLY") {
  throw new Error("CND Test Builder activation requires the Question Studio persistence and Question Bank boundary first.");
}
if (BANK.testEligible || BANK.testBuilderEligible || BANK.mockTestEligible) {
  throw new Error("CND Test Builder activation requires the previous delivery gates to still be closed.");
}

export const CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1 = Object.freeze({
  authorityId: "CND-001-INTERNAL-TEST-BUILDER-ACTIVATION-V1" as const,
  chapterCode: "CND-001" as const,
  sourceBankActivationAuthorityId: BANK.authorityId,
  permanentQlIds: BANK.permanentQlIds,
  supportedLanguages: BANK.supportedLanguages,
  status: "ACTIVE_INTERNAL_TEST_BUILDER" as const,
  activationReason: "USER_DIRECTED_CONTINUATION_AFTER_CND_BANK_ONLY_ACTIVATION" as const,
  activationScope: "QUESTION_STUDIO_QUESTION_BANK_AND_INTERNAL_TEST_BUILDER" as const,
  questionStudioDiscoverable: true,
  previewGenerationAuthorized: true,
  persistenceAllowed: true,
  internalReviewRunsWritable: true,
  questionBankStatus: "READY_FOR_STORAGE" as const,
  questionBankWritable: true,
  questionBankAcceptanceMode: "FULL_RELEASE" as const,
  manualApprovalRequired: true,
  manualQuestionPublicationRequired: true,
  testEligibility: "ELIGIBLE" as const,
  testEligible: true,
  testBuilderEligible: true,
  questionPublicationTarget: "INTERNAL_TEST_BUILDER" as const,
  mockTestEligible: false,
  publiclyPublishable: true,
  publicReleaseAuthorized: false,
  studentDeliveryAuthorized: false,
  automaticStudentPublication: false,
  contentMutationAuthorized: false,
  nextGate: "CND_001_INTERNAL_MOCK_TEST_ELIGIBILITY_ACTIVATION" as const,
});
