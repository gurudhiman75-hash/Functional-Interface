import {
  DSF_CP004_QUESTION_BANK_ACCEPTANCE,
  DSF_CP004_QUESTION_STUDIO_PACKAGE,
} from "../DSF-CP-004/question-bank-acceptance-v1.ts";

export const DSF_CP005_CHECKPOINT_ID = "DSF-CP-005" as const;
export const DSF_CP005_TEST_RELEASE_AUTHORITY = "DSF_CP005_MANUAL_TEST_RELEASE_V1" as const;

export const DSF_CP005_TEST_RELEASE = Object.freeze({
  authorityId: DSF_CP005_TEST_RELEASE_AUTHORITY,
  checkpointId: DSF_CP005_CHECKPOINT_ID,
  status: "MANUAL_TEST_RELEASE_ENABLED" as const,
  packageId: "DSF-001" as const,
  permanentQlId: "DSF-QL-001" as const,
  nextAvailableQlId: "DSF-QL-002" as const,
  questionBankAcceptanceAuthority: DSF_CP004_QUESTION_BANK_ACCEPTANCE.authorityId,
  acceptedProfileIds: DSF_CP004_QUESTION_BANK_ACCEPTANCE.acceptedProfileIds,
  release: {
    questionBankStatus: "READY_FOR_STORAGE" as const,
    questionBankWritable: true as const,
    questionBankAcceptanceMode: "FULL_RELEASE" as const,
    manualGenerationApprovalRequired: true as const,
    manualQuestionPublicationRequired: true as const,
    testEligibility: "ELIGIBLE" as const,
    testEligible: true as const,
    publiclyPublishable: true as const,
    mockTestEligible: false as const,
    automaticStudentPublication: false as const,
  },
  boundaries: {
    questionPublicationIsManual: true as const,
    testAssemblyRequiresPublishedQuestionVersion: true as const,
    mockTestActivationRequiresSeparateCheckpoint: true as const,
    automaticStudentPublication: false as const,
    punjabSpecificProfileEnabled: false as const,
    hindiEnabled: false as const,
    punjabiEnabled: false as const,
    newPermanentQlAllocated: false as const,
  },
  nextGate: "MOCK_TEST_AND_AUTOMATIC_STUDENT_DELIVERY_REQUIRES_SEPARATE_CHECKPOINT" as const,
});

export const DSF_CP005_QUESTION_STUDIO_PACKAGE = Object.freeze({
  ...DSF_CP004_QUESTION_STUDIO_PACKAGE,
  label: "Data Sufficiency · Manual Question Bank publish + test eligible",
  testReleaseCheckpointId: DSF_CP005_CHECKPOINT_ID,
  testReleaseAuthority: DSF_CP005_TEST_RELEASE_AUTHORITY,
  questionBankStatus: "READY_FOR_STORAGE" as const,
  questionBankWritable: true as const,
  questionBankAcceptanceMode: "FULL_RELEASE" as const,
  testEligibility: "ELIGIBLE" as const,
  testEligible: true as const,
  publiclyPublishable: true as const,
  mockTestEligible: false as const,
  automaticStudentPublication: false as const,
  reviewStatus: "QUESTION_STUDIO_MANUAL_TEST_RELEASE" as const,
});
