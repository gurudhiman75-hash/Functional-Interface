import { DSF_CP001_FREEZE_AUTHORITY } from "../DSF-CP-001/cp001-freeze-authority.ts";
import { DSF_CP002_ENGLISH_REVIEW_APPROVAL } from "../DSF-CP-002/english-review-approval-v1.ts";
import { DSF_CP003_EXAM_PROFILE_REVIEW_APPROVAL } from "../DSF-CP-003/exam-answer-profiles-approval-v1.ts";
import { DSF_CP004_QUESTION_BANK_ACCEPTANCE } from "../DSF-CP-004/question-bank-acceptance-v1.ts";
import { DSF_CP005_TEST_RELEASE } from "../DSF-CP-005/test-release-v1.ts";
import {
  DSF_CP006_MOCK_TEST_RELEASE,
  DSF_CP006_QUESTION_STUDIO_PACKAGE,
} from "../DSF-CP-006/mock-test-release-v1.ts";

export const DSF_CP007_CHECKPOINT_ID = "DSF-CP-007" as const;
export const DSF_CP007_PRODUCTION_READINESS_FREEZE_AUTHORITY =
  "DSF_CP007_PRODUCTION_READINESS_FREEZE_V1" as const;

export const DSF_CP007_PRODUCTION_READINESS_FREEZE = Object.freeze({
  authorityId: DSF_CP007_PRODUCTION_READINESS_FREEZE_AUTHORITY,
  checkpointId: DSF_CP007_CHECKPOINT_ID,
  status: "PRODUCTION_READY_FROZEN" as const,
  packageId: "DSF-001" as const,
  learnerChapter: "Data Sufficiency" as const,
  permanentQlIds: ["DSF-QL-001"] as const,
  nextAvailableQlId: "DSF-QL-002" as const,

  pinnedAuthorities: {
    semanticSourceFreeze: DSF_CP001_FREEZE_AUTHORITY.authorityId,
    genericEnglishApproval: DSF_CP002_ENGLISH_REVIEW_APPROVAL.authorityId,
    examProfileApproval: DSF_CP003_EXAM_PROFILE_REVIEW_APPROVAL.authorityId,
    questionBankAcceptance: DSF_CP004_QUESTION_BANK_ACCEPTANCE.authorityId,
    scoredTestRelease: DSF_CP005_TEST_RELEASE.authorityId,
    mockTestRelease: DSF_CP006_MOCK_TEST_RELEASE.authorityId,
  },

  productionScope: {
    language: "en" as const,
    locale: "en-IN" as const,
    supportedExamFamilies: ["BANKING", "SSC"] as const,
    productionDomains: [
      "NUMBER_SYSTEM",
      "RATIO_PROPORTION",
      "PERCENTAGE",
      "ALGEBRA",
    ] as const,
    solveModeCount: 8 as const,
    answerProfileCount: 5 as const,
    canonicalSemanticClassCount: 5 as const,
  },

  releaseLifecycle: {
    questionStudioDiscoverable: true as const,
    persistenceAllowed: true as const,
    manualGenerationApprovalRequired: true as const,
    questionBankStatus: "READY_FOR_STORAGE" as const,
    questionBankWritable: true as const,
    questionBankAcceptanceMode: "FULL_RELEASE" as const,
    manualQuestionPublicationRequired: true as const,
    testEligibility: "ELIGIBLE" as const,
    testEligible: true as const,
    publiclyPublishable: true as const,
    mockTestEligible: true as const,
    automaticStudentPublication: false as const,
  },

  studentDelivery: {
    mode: "CANONICAL_MANUAL_TEST_PUBLICATION" as const,
    generatedQuestionAutoPublish: false as const,
    questionMustBePublished: true as const,
    testMustPassCanonicalValidation: true as const,
    testMustPassQaOrReleaseLifecycle: true as const,
    studentSeriesRequiresLivePublishedTest: true as const,
    directDsfStudentEndpointAdded: false as const,
  },

  boundaries: {
    cp001SemanticRuntimeReopened: false as const,
    newPermanentQlAllocated: false as const,
    sscUnrepresentableClassRemappingAllowed: false as const,
    punjabSpecificProfileEnabled: false as const,
    hindiEnabled: false as const,
    punjabiEnabled: false as const,
    automaticStudentPublicationEnabled: false as const,
    manualSafetyGatesBypassed: false as const,
  },

  closure: {
    currentApprovedScopeExamReady: true as const,
    currentApprovedScopeProductionReady: true as const,
    currentApprovedScopeClosed: true as const,
    futureExpansionRequiresNewCheckpoint: true as const,
    expansionCandidates: [
      "PUNJAB_OFFICIAL_ANSWER_PROFILE_EVIDENCE",
      "HINDI_LOCALIZATION",
      "PUNJABI_LOCALIZATION",
      "THREE_STATEMENT_DATA_SUFFICIENCY",
      "REASONING_WORLD_ADAPTERS",
    ] as const,
  },
});

export const DSF_CP007_PRODUCTION_PACKAGE = Object.freeze({
  ...DSF_CP006_QUESTION_STUDIO_PACKAGE,
  productionReadinessCheckpointId: DSF_CP007_CHECKPOINT_ID,
  productionReadinessAuthority: DSF_CP007_PRODUCTION_READINESS_FREEZE_AUTHORITY,
  productionReadinessStatus: "PRODUCTION_READY_FROZEN" as const,
  chapterClosedForCurrentApprovedScope: true as const,
  automaticStudentPublication: false as const,
});
