export const PGK_001_FULL_RELEASE_AUTHORITY_V1 =
  "PGK-001-FULL-QUESTION-STUDIO-RELEASE-2026-09-26" as const;

export const PGK_001_FULL_RELEASE_LIFECYCLE_V1 = Object.freeze({
  authorityId: PGK_001_FULL_RELEASE_AUTHORITY_V1,
  status: "PRODUCTION_READY_FROZEN" as const,
  runtimeMode: "CANONICAL_REVIEW" as const,
  reviewStatus: "APPROVED_EDITORIAL_CANONICAL" as const,

  questionStudioDiscoverable: true as const,
  questionStudioGeneratable: true as const,
  reviewAndRevisionEnabled: true as const,
  regenerationEnabled: true as const,
  persistenceAllowed: true as const,
  databaseWriteEnabled: true as const,

  questionBankStatus: "READY_FOR_STORAGE" as const,
  questionBankEligible: true as const,
  questionBankWritable: true as const,
  questionBankAcceptanceMode: "FULL_RELEASE" as const,
  questionBankAcceptanceAuthority: PGK_001_FULL_RELEASE_AUTHORITY_V1,

  testEligibility: "ELIGIBLE" as const,
  testEligible: true as const,
  testBuilderEligible: true as const,
  mockTestEligible: true as const,

  publiclyPublishable: true as const,
  publicReleaseAuthorized: true as const,
  studentDeliveryAuthorized: true as const,
  productionReleaseAuthorized: true as const,

  manualApprovalRequired: true as const,
  manualQuestionPublicationRequired: true as const,
  futureGeneratedItemsAutomaticallyApproved: false as const,
  automaticStudentPublication: false as const,

  contentFreezeImmutable: true as const,
  frozenEnglishQuestionCount: 1092 as const,
  multilingualSurfaceCount: 3276 as const,
  matchingConceptCount: 24 as const,
  currentScopeClosed: true as const,
  futureCodeCheckpointRequiredForCurrentScope: false as const,
});
