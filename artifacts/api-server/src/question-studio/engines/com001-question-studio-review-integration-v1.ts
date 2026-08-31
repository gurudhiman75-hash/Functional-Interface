import { COM001_ENGLISH_FREEZE_AUTHORITY_V1 } from "../../knowledge-v1/computer-awareness/com001-english-freeze-v1";
import { COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1 } from "../../knowledge-v1/computer-awareness/com001-hi-pa-localization-freeze-v1";

export const COM001_QUESTION_STUDIO_REVIEW_INTEGRATION_AUTHORITY_V1 = Object.freeze({
  authorityId: "COM-001-QUESTION-STUDIO-REVIEW-INTEGRATION-V1" as const,
  chapterId: "COM-001" as const,
  cpId: "COM-001-CP-001" as const,
  status: "REVIEW_ONLY_QUESTION_STUDIO_INTEGRATION_APPROVED" as const,
  engineId: "knowledge-v1" as const,
  packageId: "COM-001" as const,
  runtimeMode: "review-only" as const,
  permanentQlRange: "COM-001-QL-001..COM-001-QL-009" as const,
  permanentQlCount: 9,
  supportedLanguages: ["en", "hi", "pa"] as const,
  supportedLocales: ["en-IN", "hi-IN", "pa-IN"] as const,
  contentAuthorities: {
    englishFreezeAuthorityId: COM001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
    englishCombinedFingerprint:
      COM001_ENGLISH_FREEZE_AUTHORITY_V1.fingerprints.combinedFingerprint,
    localizationFreezeAuthorityId:
      COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
    localizationCombinedFingerprint:
      COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.fingerprints.combinedFingerprint,
  },
  exactReviewedImplementation: {
    headSha: "33ac2340054f9e305c6922bc559fcfd3ab634029" as const,
    adapterBlobSha: "bf6a11a64431796008f5aa73f48aacebd4471251" as const,
    batchAuditBlobSha: "0d94f2b233f4b4cac42a537511c83882c6100956" as const,
    contentEngineWorkflowName:
      "Validate Question Studio Content Engine Foundation V1" as const,
    contentEngineRunNumber: 105,
    contentEngineRunId: 32712018180,
    contentEngineJobId: 97385257923,
    integratedAdminWorkflowName: "Validate integrated admin panel" as const,
    integratedAdminRunNumber: 8820,
    integratedAdminRunId: 32712018318,
    integratedAdminJobId: 97385258528,
    reviewVerdict:
      "APPROVED_REVIEW_ONLY_INTEGRATION_WITH_PRODUCTION_LIFECYCLE_LOCKS" as const,
  },
  exactReviewedAdminSurface: {
    headSha: "ddb8e698c10473a35f2b0090f9efd02a7b4fec5f" as const,
    computerReviewPanelBlobSha:
      "6eaf09b18babbab3d65786e42e62226272404b6c" as const,
    legacyCockpitIsolationBlobSha:
      "ac6d8b9e70f815cde7da739b6924949c2627e989" as const,
    recoveryDockBlobSha:
      "5512d2546dfc49ca11a91d0fed087792361c4c51" as const,
    operationsPageBlobSha:
      "fa39e40c5a722f1a8cb05b82bdef6fbc589ed1e2" as const,
    contentEngineWorkflowName:
      "Validate Question Studio Content Engine Foundation V1" as const,
    contentEngineRunNumber: 115,
    contentEngineRunId: 32714703196,
    contentEngineJobId: 97393368261,
    integratedAdminWorkflowName: "Validate integrated admin panel" as const,
    integratedAdminRunNumber: 8854,
    integratedAdminRunId: 32714703185,
    integratedAdminJobId: 97393368579,
    verifiedChecks: [
      "CANONICAL_DATABASE_FREEZE",
      "CANONICAL_ADMIN_SURFACE",
      "TRUTHFUL_FRONTEND_SURFACE",
      "QUESTION_STUDIO_PRODUCTION_GATE",
      "API_SERVER_BUILD_AND_ROUTE_BUNDLE",
      "ADMIN_RBAC_AND_CONTENT_RULES",
      "ADMIN_TYPESCRIPT_TYPECHECK",
      "ADMIN_APPLICATION_TESTS",
      "ADMIN_APPLICATION_BUILD",
      "STUDENT_APPLICATION_BUILD",
      "SINGLE_SITE_HOSTING_ASSEMBLY",
    ] as const,
    reviewVerdict:
      "APPROVED_DEDICATED_COMPUTER_REVIEW_SURFACE_WITH_LEGACY_COCKPIT_ISOLATION" as const,
  },
  auditCoverage: {
    explicitQlLanguageQuestions: 1080,
    explicitQuestionsPerQlPerLanguage: 40,
    mixedReviewBatchQuestions: 50,
    deterministicReplayRequired: true,
    allPermanentQlsCovered: true,
    allSupportedLanguagesCovered: true,
    diversityAndAnswerPositionAuditRequired: true,
    heldAndRejectedFactExclusionRequired: true,
  },
  editorSafety: {
    approvalDisposition: "REVIEW_ONLY" as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false,
    revisionPolicy: "SOURCE_GENERATOR_ONLY" as const,
    manualFreeTextRevisionAllowed: false,
    regenerationStatus: "LOCKED_UNTIL_ENGINE_AWARE_REGENERATION" as const,
    sourceCorrectionRequiredForRegeneration: true,
    dedicatedAdminReviewSurface: true,
    legacyQuantCockpitIsolationRequired: true,
    sourceControlledRecoveryRetryExcluded: true,
  },
  difficulty: {
    filterSupported: false,
    requestedDifficultyRecorded: true,
    selectionStatus: "NOT_APPLIED_IN_REVIEW_ONLY_PILOT" as const,
    productionDifficultyClaimsAuthorized: false,
  },
  lifecycle: {
    questionStudioDiscoverable: true,
    questionStudioRegistrationStatus: "REVIEW_ONLY_REGISTERED" as const,
    reviewRunPersistenceAllowed: true,
    canonicalQuestionPersistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    productionReleaseAuthorized: false,
  },
  invalidationRule:
    "Any material change to COM-001 engine/package routing, review payload lifecycle flags, approval disposition, revision policy, regeneration lock, dedicated admin review surface, legacy cockpit isolation, recovery retry isolation, bound English/localization authority, permanent QL scope, or learner-facing generation requires a new integration authority version and exact-head CI proof.",
  nextGate:
    "COM001_ADMIN_HUMAN_STUDIO_REVIEW_AND_DIFFICULTY_ROUTING_DECISION" as const,
});
