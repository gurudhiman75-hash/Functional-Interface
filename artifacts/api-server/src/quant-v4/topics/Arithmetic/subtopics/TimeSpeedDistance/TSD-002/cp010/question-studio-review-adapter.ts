import {
  TSD_CP010_STUDIO_CANDIDATE_DIFFICULTIES,
  TSD_CP010_STUDIO_CANDIDATE_LANGUAGES,
  TSD_CP010_STUDIO_CANDIDATE_PACKAGE as FROZEN_CANDIDATE_PACKAGE,
  TSD_CP010_STUDIO_CANDIDATE_RUNTIME_MODE,
  previewTsdCp010StudioCandidate as previewFrozenCandidate,
  type TsdCp010StudioCandidateDifficulty,
  type TsdCp010StudioCandidateLanguage,
  type TsdCp010StudioCandidateRequest,
} from "./question-studio-candidate-adapter-exam-real";
import { TSD_CP010_ENGLISH_FREEZE_APPROVAL } from "./english-freeze-registry";
import { TSD_CP010_LOCALIZATION_FREEZE_APPROVAL } from "./localization-freeze-registry";
import { TSD_CP010_PERMANENT_QL_IDS, type TsdCp010QlId } from "./ql-allocation";

export const TSD_CP010_QUESTION_STUDIO_PACKAGE_ID = "TSD-002" as const;
export const TSD_CP010_QUESTION_STUDIO_CHECKPOINT_ID = "TSD-CP-010" as const;
export const TSD_CP010_QUESTION_STUDIO_LANGUAGES = TSD_CP010_STUDIO_CANDIDATE_LANGUAGES;
export const TSD_CP010_QUESTION_STUDIO_DIFFICULTIES = TSD_CP010_STUDIO_CANDIDATE_DIFFICULTIES;
export const TSD_CP010_QUESTION_STUDIO_RUNTIME_MODE = TSD_CP010_STUDIO_CANDIDATE_RUNTIME_MODE;
export const TSD_CP010_QUESTION_STUDIO_INTEGRATION_AUTHORITY = `TSD-CP-010:${TSD_CP010_ENGLISH_FREEZE_APPROVAL.approvedSourceHead}:REGISTERED_REVIEW_ONLY-v1` as const;

export type TsdCp010QuestionStudioLanguage = TsdCp010StudioCandidateLanguage;
export type TsdCp010QuestionStudioDifficulty = TsdCp010StudioCandidateDifficulty;
export type TsdCp010QuestionStudioQlId = TsdCp010QlId;
export type TsdCp010QuestionStudioReviewRequest = TsdCp010StudioCandidateRequest;

export const TSD_CP010_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  ...FROZEN_CANDIDATE_PACKAGE,
  packageId: TSD_CP010_QUESTION_STUDIO_PACKAGE_ID,
  checkpointId: TSD_CP010_QUESTION_STUDIO_CHECKPOINT_ID,
  runtimeMode: TSD_CP010_QUESTION_STUDIO_RUNTIME_MODE,
  permanentQlIds: TSD_CP010_PERMANENT_QL_IDS,
  supportedLanguages: TSD_CP010_QUESTION_STUDIO_LANGUAGES,
  supportedDifficulties: TSD_CP010_QUESTION_STUDIO_DIFFICULTIES,
  deterministicReviewCombinations: FROZEN_CANDIDATE_PACKAGE.deterministicMultilingualCombinations,
  sourceStatus: "APPROVED_FREEZE_PLUS_REGISTERED_REVIEW_ONLY_ADAPTER" as const,
  productOwnerApprovalStatus: "APPROVED" as const,
  questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
  questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
  productionSelectorVisible: true as const,
  routeMounted: true as const,
  persistenceAllowed: true as const,
  databasePersistence: "QUESTION_STUDIO_REVIEW_QUEUE_ONLY" as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  manualApprovalRequired: true as const,
  integrationAuthority: TSD_CP010_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
});

if (TSD_CP010_ENGLISH_FREEZE_APPROVAL.englishFreezeStatus !== "FROZEN") {
  throw new Error("TSD-CP-010 English content must be frozen before Studio registration");
}
if (TSD_CP010_LOCALIZATION_FREEZE_APPROVAL.hindi !== "FROZEN" || TSD_CP010_LOCALIZATION_FREEZE_APPROVAL.punjabi !== "FROZEN") {
  throw new Error("TSD-CP-010 native content must be frozen before Studio registration");
}

export function previewTsdCp010QuestionStudioReview(request: TsdCp010QuestionStudioReviewRequest = {}) {
  const preview = previewFrozenCandidate(request);
  const questions = preview.questions.map((question) => Object.freeze({
    ...question,
    reviewStatus: "FROZEN_REVIEW_ONLY" as const,
    questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
    questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
    persistenceAllowed: true as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    manualApprovalRequired: true as const,
    integrationAuthority: TSD_CP010_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  }));

  return Object.freeze({
    ...preview,
    package: TSD_CP010_QUESTION_STUDIO_REVIEW_PACKAGE,
    integrationAuthority: TSD_CP010_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
    activationMode: "REVIEW_ONLY" as const,
    questions: Object.freeze(questions),
  });
}
