import { COM001_ENGLISH_FREEZE_AUTHORITY_V2 } from "../../knowledge-v1/computer-awareness/com001-english-freeze-v2";
import { COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2 } from "../../knowledge-v1/computer-awareness/com001-hi-pa-localization-freeze-v2";
import {
  COM001_QUESTION_BANK_DRY_RUN_AUTHORITY,
  COM001_REQUIRED_BANK_PROVENANCE_FIELDS,
} from "./com001-question-bank-readiness-v1";
import { COM001_QUESTION_STUDIO_REVIEW_DIFFICULTY_AUTHORITY_V1 } from "./com001-question-studio-review-difficulty-authority-v1";
import { COM001_QUESTION_STUDIO_REVIEW_INTEGRATION_AUTHORITY_V2 } from "./com001-question-studio-review-integration-v2";
import {
  COM001_QUESTION_STUDIO_PACKAGE_ID,
  COM001_REVISION_POLICY,
} from "./knowledge-v1-com001-adapter";

export const COM001_QUESTION_BANK_ACCEPTANCE_CANDIDATE_AUTHORITY_V1 = Object.freeze({
  authorityId: "COM-001-QUESTION-BANK-ACCEPTANCE-CANDIDATE-V1" as const,
  chapterId: "COM-001" as const,
  cpId: "COM-001-CP-001" as const,
  packageId: COM001_QUESTION_STUDIO_PACKAGE_ID,
  engineId: "knowledge-v1" as const,
  status: "BANK_ONLY_ACCEPTANCE_CANDIDATE_PROVEN_NOT_ACTIVATED" as const,
  liveActivationAuthorized: false as const,
  productionReleaseAuthorized: false as const,

  authorityChain: {
    englishFreezeAuthorityId: COM001_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
    englishCombinedFingerprint:
      COM001_ENGLISH_FREEZE_AUTHORITY_V2.fingerprints.combinedFingerprint,
    localizationFreezeAuthorityId:
      COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.authorityId,
    localizationCombinedFingerprint:
      COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.fingerprints.combinedFingerprint,
    reviewIntegrationAuthorityId:
      COM001_QUESTION_STUDIO_REVIEW_INTEGRATION_AUTHORITY_V2.authorityId,
    reviewDifficultyAuthorityId:
      COM001_QUESTION_STUDIO_REVIEW_DIFFICULTY_AUTHORITY_V1.authorityId,
    dryRunAuthorityId: COM001_QUESTION_BANK_DRY_RUN_AUTHORITY,
  },

  readinessProof: {
    exactHeadSha: "08107480611319898272d6c4e6f4697b4f8da830" as const,
    sharedConverterBlobSha:
      "dadae221ed4439f95ae94ffb6106a4f5c8934af2" as const,
    contentEngineRunNumber: 177,
    contentEngineRunId: 32763035770,
    integratedAdminRunNumber: 9002,
    integratedAdminRunId: 32763035880,
    existingBankOnlyRegressionWorkflow:
      "Validate DSF-CP-004 Question Bank Acceptance" as const,
    existingBankOnlyRegressionRunNumber: 57,
    existingBankOnlyRegressionRunId: 32763035823,
    auditedQuestionCount: 270,
    permanentQlCount: 9,
    languages: ["en", "hi", "pa"] as const,
    semanticNormalizationPreserved: true,
    normalizedProvenanceFieldCount:
      COM001_REQUIRED_BANK_PROVENANCE_FIELDS.length,
    missingNormalizedProvenanceFieldCount: 0,
    existingApprovedBankOnlyPathRegressionFree: true,
  },

  candidateQuestionBankLifecycle: {
    statusBeforeAcceptance: "READY_FOR_STORAGE" as const,
    writable: true as const,
    acceptanceMode: "BANK_ONLY" as const,
    manualGenerationApprovalRequired: true as const,
    acceptedQuestionStatus: "approved" as const,
    idempotentByGenerationItem: true as const,
    canonicalAnswerPreservedInAnswerModel: true,
    provenancePreservedInAnswerModel: true,
    revisionPolicy: COM001_REVISION_POLICY,
  },

  downstreamLifecycleMustRemainLocked: {
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    productionDifficultyClaimsAuthorized: false as const,
    productionReleaseAuthorized: false as const,
    testActivationRequiresSeparateAuthority: true as const,
    publicationRequiresSeparateAuthority: true as const,
  },

  livePackageBeforeActivation: {
    runtimeMode: "review-only" as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    canonicalQuestionPersistenceAllowed: false as const,
  },

  activationConditions: {
    candidateAuthorityTestGreen: true as const,
    exactHeadContentEngineRequired: true as const,
    exactHeadIntegratedAdminRequired: true as const,
    sharedConverterBankOnlyRegressionProofRequired: true as const,
    liveAdapterChangeMustBeSeparateCommit: true as const,
    liveActivationMustBindThisAuthorityId: true as const,
    downstreamLocksMayNotChangeDuringBankActivation: true as const,
  },

  invalidationRule:
    "Any material change to frozen V2 content authorities, difficulty authority, shared Question Bank normalization/provenance semantics, permanent QL/language scope, or downstream lifecycle locks requires a new COM-001 Question Bank acceptance candidate authority.",
  nextGate:
    "SEPARATE_LIVE_BANK_ONLY_ADAPTER_ACTIVATION_BOUND_TO_THIS_AUTHORITY" as const,
});
