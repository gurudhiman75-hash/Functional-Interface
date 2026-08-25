import { COM001_ENGLISH_FREEZE_AUTHORITY_V2 } from "../../knowledge-v1/computer-awareness/com001-english-freeze-v2";
import { COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2 } from "../../knowledge-v1/computer-awareness/com001-hi-pa-localization-freeze-v2";
import { COM001_QUESTION_STUDIO_REVIEW_INTEGRATION_AUTHORITY_V1 } from "./com001-question-studio-review-integration-v1";

export const COM001_QUESTION_STUDIO_REVIEW_INTEGRATION_AUTHORITY_V2 = Object.freeze({
  authorityId: "COM-001-QUESTION-STUDIO-REVIEW-INTEGRATION-V2" as const,
  chapterId: "COM-001" as const,
  cpId: "COM-001-CP-001" as const,
  status: "HUMAN_REVIEWED_V2_REVIEW_ONLY_QUESTION_STUDIO_INTEGRATION_APPROVED" as const,
  supersedesLearnerContentBinding:
    COM001_QUESTION_STUDIO_REVIEW_INTEGRATION_AUTHORITY_V1.authorityId,
  engineId: "knowledge-v1" as const,
  packageId: "COM-001" as const,
  runtimeMode: "review-only" as const,
  contentAuthorityVersion: "V2" as const,
  permanentQlRange: "COM-001-QL-001..COM-001-QL-009" as const,
  permanentQlCount: 9,
  supportedLanguages: ["en", "hi", "pa"] as const,
  supportedLocales: ["en-IN", "hi-IN", "pa-IN"] as const,
  contentAuthorities: {
    englishFreezeAuthorityId: COM001_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
    englishCombinedFingerprint:
      COM001_ENGLISH_FREEZE_AUTHORITY_V2.fingerprints.combinedFingerprint,
    localizationFreezeAuthorityId:
      COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.authorityId,
    localizationCombinedFingerprint:
      COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.fingerprints.combinedFingerprint,
    humanReviewStatus: "APPROVED" as const,
    humanReviewApprovedOn: "2026-08-24" as const,
  },
  exactReviewedImplementation: {
    headSha: "5bb31a8b6b1684f7c698d9eaa01ce15f204bc4e7" as const,
    adapterBlobSha: "9a5406a2d11b1f528b68d3ed12fe55d56876e43e" as const,
    batchAuditBlobSha: "13304b5b33f733497fbaba916f4f331cb2c0505a" as const,
    contentEngineWorkflowName:
      "Validate Question Studio Content Engine Foundation V1" as const,
    contentEngineRunNumber: 156,
    contentEngineRunId: 32738340620,
    contentEngineJobId: 97466580358,
    integratedAdminWorkflowName: "Validate integrated admin panel" as const,
    integratedAdminRunNumber: 8924,
    integratedAdminRunId: 32738340438,
    integratedAdminJobId: 97466512457,
    reviewVerdict:
      "APPROVED_V2_REVIEW_ONLY_SWITCH_WITH_ALL_PRODUCTION_LIFECYCLE_LOCKS_PRESERVED" as const,
  },
  adminSurfaceContinuity: {
    adminSurfaceChangedForV2Switch: false,
    preservesAdminSurfaceAuthorityId:
      COM001_QUESTION_STUDIO_REVIEW_INTEGRATION_AUTHORITY_V1.authorityId,
    dedicatedComputerReviewSurfacePreserved: true,
    legacyQuantCockpitIsolationPreserved: true,
    sourceControlledRecoveryRetryExcluded: true,
    exactSwitchedHeadPassedIntegratedAdminWorkflow: true,
  },
  auditCoverage: {
    explicitQlLanguageQuestions: 1080,
    explicitQuestionsPerQlPerLanguage: 40,
    mixedReviewBatchQuestions: 50,
    hindiPunjabiParityQuestions: 720,
    englishV2AuditQuestions: 360,
    deterministicReplayRequired: true,
    allPermanentQlsCovered: true,
    allSupportedLanguagesCovered: true,
    v2RelationalSurfaceCoverageRequired: true,
    ql007RdxExclusionRequired: true,
    ql009DualConventionCoverageRequired: true,
    heldAndRejectedFactExclusionRequired: true,
  },
  learnerSurfaceV2: {
    grammarSafeQl002Ql003Explanations: true,
    ql001To005ForwardInverseOrMatchedPairCoverage: true,
    ql007RdxLearnerSurfaceRemoved: true,
    ql007MagneticTapePyqWeighting: true,
    ql009TraditionalExam1024ConventionAdded: true,
    ql009StrictSiIecModeRetainedSeparately: true,
    answerPositionSpreadHardened: true,
    hindiPunjabiSemanticParityFrozen: true,
  },
  editorSafety: {
    approvalDisposition: "REVIEW_ONLY" as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false,
    revisionPolicy: "SOURCE_GENERATOR_ONLY" as const,
    manualFreeTextRevisionAllowed: false,
    regenerationStatus: "LOCKED_UNTIL_ENGINE_AWARE_REGENERATION" as const,
    sourceCorrectionRequiredForRegeneration: true,
    reviewRunPersistenceAllowed: true,
    canonicalQuestionPersistenceAllowed: false,
  },
  difficulty: {
    filterSupported: false,
    requestedDifficultyRecorded: true,
    selectionStatus: "NOT_APPLIED_IN_REVIEW_ONLY_PILOT" as const,
    productionDifficultyClaimsAuthorized: false,
  },
  lifecycle: {
    questionStudioDiscoverable: true,
    questionStudioRegistrationStatus: "REVIEW_ONLY_REGISTERED_V2" as const,
    v2LearnerSurfaceActiveInReviewStudio: true,
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
    "Any material change to the bound English V2/localization V2 authorities, COM-001 review adapter, permanent QL scope, V2 learner-facing generation, review payload lifecycle flags, approval disposition, revision/regeneration policy, or admin isolation requires a new integration authority version and exact-head CI proof.",
  nextGate:
    "COM001_V2_ADMIN_HUMAN_STUDIO_REVIEW_AND_DIFFICULTY_ROUTING_DECISION" as const,
});
