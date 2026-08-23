import { DSF_CP005_TEST_RELEASE } from "../DSF-CP-005/test-release-v1.ts";

export const DSF_CP006_CHECKPOINT_ID = "DSF-CP-006" as const;
export const DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY =
  "DSF_CP006_MOCK_TEST_RELEASE_V1" as const;

export const DSF_CP006_MOCK_TEST_RELEASE = Object.freeze({
  authorityId: DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY,
  checkpointId: DSF_CP006_CHECKPOINT_ID,
  status: "MOCK_TEST_RELEASE_ENABLED" as const,
  packageId: "DSF-001" as const,
  permanentQlId: "DSF-QL-001" as const,
  nextAvailableQlId: "DSF-QL-002" as const,
  testReleaseAuthority: DSF_CP005_TEST_RELEASE.authorityId,
  acceptedProfileIds: DSF_CP005_TEST_RELEASE.acceptedProfileIds,
  release: {
    questionBankStatus: "READY_FOR_STORAGE" as const,
    questionBankWritable: true as const,
    questionBankAcceptanceMode: "FULL_RELEASE" as const,
    manualGenerationApprovalRequired: true as const,
    manualQuestionPublicationRequired: true as const,
    testEligibility: "ELIGIBLE" as const,
    testEligible: true as const,
    publiclyPublishable: true as const,
    mockTestEligible: true as const,
    automaticStudentPublication: false as const,
  },
  assessmentPipeline: {
    canonicalPublishedQuestionVersionRequired: true as const,
    canonicalTestValidationRequired: true as const,
    canonicalTestQaOrReleaseRequiredForSeries: true as const,
    parallelDsfMockEndpointAdded: false as const,
  },
  boundaries: {
    cp001SemanticRuntimeReopened: false as const,
    cp003ProfileSemanticsRewritten: false as const,
    legacyCp004BankOnlyPayloadsUpgraded: false as const,
    legacyCp005MockIneligiblePayloadsUpgraded: false as const,
    automaticStudentPublication: false as const,
    punjabSpecificProfileEnabled: false as const,
    hindiEnabled: false as const,
    punjabiEnabled: false as const,
    newPermanentQlAllocated: false as const,
  },
  nextGate: "AUTOMATIC_STUDENT_DELIVERY_REQUIRES_SEPARATE_CHECKPOINT" as const,
});

export const DSF_CP006_QUESTION_STUDIO_PACKAGE = Object.freeze({
  ...DSF_CP005_TEST_RELEASE,
  authorityId: DSF_CP006_MOCK_TEST_RELEASE_AUTHORITY,
  checkpointId: DSF_CP006_CHECKPOINT_ID,
  status: "MOCK_TEST_RELEASE_ENABLED" as const,
  questionBankStatus: "READY_FOR_STORAGE" as const,
  questionBankWritable: true as const,
  questionBankAcceptanceMode: "FULL_RELEASE" as const,
  testEligibility: "ELIGIBLE" as const,
  testEligible: true as const,
  publiclyPublishable: true as const,
  mockTestEligible: true as const,
  automaticStudentPublication: false as const,
});
