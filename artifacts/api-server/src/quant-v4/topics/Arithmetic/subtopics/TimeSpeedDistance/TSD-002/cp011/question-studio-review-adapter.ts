import {
  TSD_CP011_STUDIO_CANDIDATE_PACKAGE as FROZEN_CANDIDATE_PACKAGE,
  TSD_CP011_STUDIO_CANDIDATE_RUNTIME_MODE,
  TSD_CP011_STUDIO_REVIEWED_COMBINATIONS_PER_LOCALE,
  TSD_CP011_STUDIO_REVIEWED_MULTILINGUAL_COMBINATIONS,
  previewTsdCp011StudioCandidate as previewFrozenCandidate,
  type TsdCp011StudioDifficulty,
  type TsdCp011StudioLanguage,
  type TsdCp011StudioRequest,
} from "./question-studio-candidate";
import { TSD_CP011_ENGLISH_FREEZE_APPROVAL } from "./english-freeze-registry";
import { TSD_CP011_LOCALIZATION_FREEZE_APPROVAL } from "./localization-freeze-registry";
import { TSD_CP011_PERMANENT_QL_IDS, type TsdCp011QlId } from "./ql-allocation";

export const TSD_CP011_QUESTION_STUDIO_PACKAGE_ID = "TSD-002" as const;
export const TSD_CP011_QUESTION_STUDIO_CHECKPOINT_ID = "TSD-CP-011" as const;
export const TSD_CP011_QUESTION_STUDIO_LANGUAGES = ["en", "hi", "pa"] as const;
export const TSD_CP011_QUESTION_STUDIO_DIFFICULTIES = ["EASY", "MEDIUM"] as const;
export const TSD_CP011_QUESTION_STUDIO_RUNTIME_MODE = TSD_CP011_STUDIO_CANDIDATE_RUNTIME_MODE;
export const TSD_CP011_QUESTION_STUDIO_INTEGRATION_AUTHORITY = `TSD-CP-011:${TSD_CP011_ENGLISH_FREEZE_APPROVAL.approvedSourceHead}:REGISTERED_REVIEW_ONLY-v1` as const;

export type TsdCp011QuestionStudioLanguage = TsdCp011StudioLanguage;
export type TsdCp011QuestionStudioDifficulty = TsdCp011StudioDifficulty;
export type TsdCp011QuestionStudioQlId = TsdCp011QlId;
export type TsdCp011QuestionStudioReviewRequest = TsdCp011StudioRequest;

export const TSD_CP011_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  ...FROZEN_CANDIDATE_PACKAGE,
  packageId: TSD_CP011_QUESTION_STUDIO_PACKAGE_ID,
  checkpointId: TSD_CP011_QUESTION_STUDIO_CHECKPOINT_ID,
  runtimeMode: TSD_CP011_QUESTION_STUDIO_RUNTIME_MODE,
  permanentQlIds: TSD_CP011_PERMANENT_QL_IDS,
  supportedLanguages: TSD_CP011_QUESTION_STUDIO_LANGUAGES,
  supportedDifficulties: TSD_CP011_QUESTION_STUDIO_DIFFICULTIES,
  reviewedCombinationsPerLocale: TSD_CP011_STUDIO_REVIEWED_COMBINATIONS_PER_LOCALE,
  reviewedMultilingualCombinations: TSD_CP011_STUDIO_REVIEWED_MULTILINGUAL_COMBINATIONS,
  deterministicReviewCombinations: TSD_CP011_STUDIO_REVIEWED_MULTILINGUAL_COMBINATIONS,
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
  integrationAuthority: TSD_CP011_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
});

if (TSD_CP011_ENGLISH_FREEZE_APPROVAL.englishFreezeStatus !== "FROZEN") {
  throw new Error("TSD-CP-011 English content must be frozen before Studio registration");
}
if (TSD_CP011_LOCALIZATION_FREEZE_APPROVAL.hindi !== "FROZEN" || TSD_CP011_LOCALIZATION_FREEZE_APPROVAL.punjabi !== "FROZEN") {
  throw new Error("TSD-CP-011 native content must be frozen before Studio registration");
}

export function previewTsdCp011QuestionStudioReview(request: TsdCp011QuestionStudioReviewRequest = {}) {
  const preview = previewFrozenCandidate(request);
  const questions = preview.questions.map((question) => Object.freeze({
    ...question,
    answer: question.options[question.correctIndex]!,
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
    integrationAuthority: TSD_CP011_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  }));

  return Object.freeze({
    ...preview,
    package: TSD_CP011_QUESTION_STUDIO_REVIEW_PACKAGE,
    integrationAuthority: TSD_CP011_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
    activationMode: "REVIEW_ONLY" as const,
    questions: Object.freeze(questions),
  });
}
