export const COM003_REVIEW_ONLY_ACTIVATION_AUTHORITY_V1 = Object.freeze({
  authorityId: "COM-003-QUESTION-STUDIO-REVIEW-ONLY-ACTIVATION-V1" as const,
  packageId: "COM-003" as const,
  chapterTitle: "Office & Productivity Software" as const,
  authorizedAt: "2026-09-01" as const,
  readinessEvidence: Object.freeze({
    workflow: "COM-003 Review Synthesis One-Off" as const,
    runId: 33463308433,
    jobId: 99710110472,
    conclusion: "success" as const,
    auditedQuestionLanguageArtifacts: 684,
    permanentQlCount: 19,
    cpCount: 4,
    semanticNormalizationProven: true,
    provenanceComplete: true,
    frozenCorpusIntegrityProven: true,
  }),
  authorization: Object.freeze({
    standardLifecycleId: "QUESTION-STUDIO-STANDARD-REVIEW-ONLY-V1" as const,
    lifecycleStage: "REVIEW_ONLY" as const,
    questionStudioDiscoverable: true,
    questionStudioGenerationEnabled: true,
    reviewRunPersistenceAllowed: true,
    runtimeMode: "review-only" as const,
    frozenCorpusOnly: true,
    deterministicSelectionWithoutReplacement: true,
    supportedLanguages: Object.freeze(["en", "hi", "pa"] as const),
    difficultyFilterSupported: false,
    productionDifficultyClaimAuthorized: false,
  }),
  locks: Object.freeze({
    canonicalQuestionPersistenceAllowed: false,
    questionBankWritable: false,
    questionBankAcceptanceAuthority: null,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    productionReleaseAuthorized: false,
  }),
  scope:
    "Authorize COM-003 frozen-corpus generation through the standard multi-engine Question Studio REVIEW_ONLY route, including generation-run/item/version persistence plus audit/outbox records. No canonical Question Bank conversion or downstream release is authorized." as const,
  replacementRule:
    "Question Bank acceptance, difficulty filtering, test eligibility, publication, corpus replacement, or lifecycle escalation each require a separate audited authority." as const,
});

export type Com003ReviewOnlyActivationAuthorityV1 =
  typeof COM003_REVIEW_ONLY_ACTIVATION_AUTHORITY_V1;
