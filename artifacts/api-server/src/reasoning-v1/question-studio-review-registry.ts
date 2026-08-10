import {
  BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
  BLR_CP007_QUESTION_STUDIO_REVIEW_PACKAGE,
  assertBlrCp007QuestionStudioPersistenceAllowed,
  previewBlrCp007QuestionStudioReview,
  type BlrCp007QuestionStudioDifficulty,
  type BlrCp007QuestionStudioLanguage,
  type BlrCp007QuestionStudioQlId,
} from "./topics/Blood-Relations/BLR-001/BLR-CP-007/question-studio-review-adapter";
import {
  CAL_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewCal001QuestionStudioReview,
} from "./topics/Calendar/CAL-001/question-studio-review-adapter.ts";
import {
  CAL_001_PACKAGE_ID,
  type Cal001QuestionStudioDifficulty,
  type Cal001QuestionStudioLanguage,
} from "./topics/Calendar/CAL-001/question-studio-runtime.ts";
import type { CalendarPermanentQlId } from "./topics/Calendar/CAL-001/permanent-contracts.ts";

export type ReasoningV1QuestionStudioReviewPackageId =
  | typeof BLR_CP007_QUESTION_STUDIO_PACKAGE_ID
  | typeof CAL_001_PACKAGE_ID;

export type ReasoningV1QuestionStudioReviewRequest = Readonly<{
  packageId: ReasoningV1QuestionStudioReviewPackageId;
  language?: BlrCp007QuestionStudioLanguage | Cal001QuestionStudioLanguage;
  qlId?: BlrCp007QuestionStudioQlId | CalendarPermanentQlId | string;
  difficulty?: BlrCp007QuestionStudioDifficulty | Cal001QuestionStudioDifficulty;
  canonicalItemId?: string;
  questionLanguageId?: string;
  seed?: string;
  count?: number;
}>;

const REVIEW_PACKAGES = [
  BLR_CP007_QUESTION_STUDIO_REVIEW_PACKAGE,
  CAL_001_QUESTION_STUDIO_REVIEW_PACKAGE,
] as const;

export function listReasoningV1QuestionStudioReviewPackages() {
  return REVIEW_PACKAGES.map((entry) => ({ ...entry }));
}

export function listEnabledReasoningV1QuestionStudioPackages() {
  return REVIEW_PACKAGES.filter((entry) => entry.enabled);
}

export async function previewReasoningV1QuestionStudioReview(
  request: ReasoningV1QuestionStudioReviewRequest,
) {
  if (request.packageId === BLR_CP007_QUESTION_STUDIO_PACKAGE_ID) {
    return previewBlrCp007QuestionStudioReview({
      language: request.language as BlrCp007QuestionStudioLanguage | undefined,
      qlId: request.qlId as BlrCp007QuestionStudioQlId | undefined,
      difficulty: request.difficulty as BlrCp007QuestionStudioDifficulty | undefined,
      canonicalItemId: request.canonicalItemId,
      questionLanguageId: request.questionLanguageId,
      seed: request.seed,
      count: request.count,
    });
  }

  if (request.packageId === CAL_001_PACKAGE_ID) {
    return previewCal001QuestionStudioReview({
      language: request.language as Cal001QuestionStudioLanguage | undefined,
      qlId: request.qlId as CalendarPermanentQlId | undefined,
      difficulty: request.difficulty as Cal001QuestionStudioDifficulty | undefined,
      seed: request.seed,
      count: request.count,
    });
  }

  throw new Error(
    `Unknown Reasoning V1 Question Studio package '${String(request.packageId)}'.`,
  );
}

export function persistReasoningV1QuestionStudioReview(
  request: ReasoningV1QuestionStudioReviewRequest,
): never {
  if (request.packageId === BLR_CP007_QUESTION_STUDIO_PACKAGE_ID) {
    return assertBlrCp007QuestionStudioPersistenceAllowed();
  }

  throw new Error(
    `Reasoning V1 package '${String(request.packageId)}' persists only through the audited production-review route.`,
  );
}
