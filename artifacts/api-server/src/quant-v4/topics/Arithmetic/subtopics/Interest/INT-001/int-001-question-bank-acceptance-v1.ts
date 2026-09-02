export const INT_001_QUESTION_BANK_ACCEPTANCE_AUTHORITY =
  "INT-001-BANK-ONLY-ACCEPTANCE-v1" as const;

export const INT_001_QUESTION_BANK_ACCEPTANCE_V1 = Object.freeze({
  authorityId: INT_001_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
  packageId: "INT-001" as const,
  status: "BANK_ONLY_ACTIVATED_FOR_NEW_REVIEW_ITEMS" as const,
  activationScope: "NEWLY_GENERATED_QUESTION_STUDIO_ITEMS_ONLY" as const,
  historicalReviewItemMigrationAuthorized: false as const,
  historicalReviewItemsMutated: false as const,

  questionStudioDiscoverable: true as const,
  questionStudioRegistrationStatus: "REGISTERED_REVIEW_REQUIRED" as const,
  questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
  manualApprovalRequired: true as const,

  questionBankStatus: "READY_FOR_STORAGE" as const,
  questionBankWritable: true as const,
  questionBankAcceptanceMode: "BANK_ONLY" as const,
  questionBankAcceptanceAuthority:
    INT_001_QUESTION_BANK_ACCEPTANCE_AUTHORITY,

  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,

  directQuestionBankInsertAllowed: false as const,
  conversionPath: "SHARED_MANUAL_REVIEW_APPROVAL_CONVERTER" as const,
  enablesQuestionBankAfterManualApproval: true as const,
  enablesTests: false as const,
  enablesMocks: false as const,
  enablesPublication: false as const,
  nextGate: "INT_001_TEST_ELIGIBILITY_REQUIRES_SEPARATE_EXPLICIT_CHECKPOINT" as const,
});
