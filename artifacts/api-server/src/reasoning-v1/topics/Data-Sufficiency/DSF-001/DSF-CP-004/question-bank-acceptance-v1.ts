import { DSF_CP001_FREEZE_AUTHORITY } from "../DSF-CP-001/cp001-freeze-authority.ts";
import { DSF_CP002_ENGLISH_REVIEW_APPROVAL } from "../DSF-CP-002/english-review-approval-v1.ts";
import { DSF_CP002_QUESTION_STUDIO_PACKAGE } from "../DSF-CP-002/question-studio-integration-v1.ts";
import {
  DSF_CP003_APPROVED_EXAM_PROFILE_IDS,
  DSF_CP003_EXAM_PROFILE_REVIEW_APPROVAL,
} from "../DSF-CP-003/exam-answer-profiles-approval-v1.ts";
import {
  DSF_CP003_EXAM_PROFILE_AUTHORITY,
  DSF_CP003_QUESTION_STUDIO_PACKAGE,
} from "../DSF-CP-003/exam-answer-profiles-v1.ts";

export const DSF_CP004_CHECKPOINT_ID = "DSF-CP-004" as const;
export const DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY =
  "DSF_CP004_QUESTION_BANK_ACCEPTANCE_V1" as const;

export const DSF_CP004_QUESTION_BANK_PROFILE_IDS = [
  "GENERIC_DS_STANDARD_5_EN",
  ...DSF_CP003_APPROVED_EXAM_PROFILE_IDS,
] as const;

export type DsfCp004QuestionBankProfileId =
  (typeof DSF_CP004_QUESTION_BANK_PROFILE_IDS)[number];

export const DSF_CP004_QUESTION_BANK_ACCEPTANCE = Object.freeze({
  authorityId: DSF_CP004_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
  checkpointId: DSF_CP004_CHECKPOINT_ID,
  status: "QUESTION_BANK_ACCEPTANCE_ENABLED" as const,
  packageId: "DSF-001" as const,
  permanentQlId: "DSF-QL-001" as const,
  nextAvailableQlId: "DSF-QL-002" as const,

  sourceCheckpointId: "DSF-CP-001" as const,
  integrationCheckpointId: "DSF-CP-002" as const,
  profileCheckpointId: "DSF-CP-003" as const,
  sourceFreezeAuthority: DSF_CP001_FREEZE_AUTHORITY.authorityId,
  questionStudioAuthority: DSF_CP002_QUESTION_STUDIO_PACKAGE.integrationAuthority,
  profileDeliveryAuthority: DSF_CP003_EXAM_PROFILE_AUTHORITY,
  genericEnglishApprovalAuthority: DSF_CP002_ENGLISH_REVIEW_APPROVAL.authorityId,
  examProfileApprovalAuthority: DSF_CP003_EXAM_PROFILE_REVIEW_APPROVAL.authorityId,

  acceptedProfileIds: DSF_CP004_QUESTION_BANK_PROFILE_IDS,
  supportedLanguages: ["en"] as const,
  supportedLocale: "en-IN" as const,
  productionDomainCount: 4 as const,
  solveModeCount: 8 as const,

  questionBank: {
    statusBeforeAcceptance: "READY_FOR_STORAGE" as const,
    writable: true as const,
    acceptanceMode: "BANK_ONLY" as const,
    manualGenerationApprovalRequired: true as const,
    acceptedQuestionStatus: "approved" as const,
    acceptedQuestionVersionStatus: "approved_version" as const,
    idempotentByGenerationItem: true as const,
    canonicalSemanticAnswerPreservedInAnswerModel: true as const,
    deliveryProfilePreservedInAnswerModel: true as const,
  },

  downstreamLifecycle: {
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    publicationRequiresSeparateCheckpoint: true as const,
    testActivationRequiresSeparateCheckpoint: true as const,
  },

  boundaries: {
    cp001SemanticRuntimeReopened: false as const,
    cp002QuestionStudioContractReplaced: false as const,
    cp003ProfileSemanticsRewritten: false as const,
    sscUnrepresentableClassRemappingAllowed: false as const,
    punjabSpecificProfileEnabled: false as const,
    hindiEnabled: false as const,
    punjabiEnabled: false as const,
    newPermanentQlAllocated: false as const,
    approvedProfileCount: DSF_CP004_QUESTION_BANK_PROFILE_IDS.length,
    sourceProfileCount: DSF_CP003_QUESTION_STUDIO_PACKAGE.supportedAnswerProfiles.length,
  },

  nextGate: "TEST_AND_PUBLICATION_LIFECYCLE_ACTIVATION_REQUIRES_SEPARATE_CHECKPOINT" as const,
});
