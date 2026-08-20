import {
  BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
  BLR_CP007_QUESTION_STUDIO_REVIEW_PACKAGE,
  assertBlrCp007QuestionStudioPersistenceAllowed,
  previewBlrCp007QuestionStudioReview,
  type BlrCp007QuestionStudioReviewRequest,
} from "./topics/Blood-Relations/BLR-001/BLR-CP-007/question-studio-review-adapter";
import {
  SEA001_QUESTION_STUDIO_PACKAGE_ID,
  SEA001_QUESTION_STUDIO_PACKAGE,
  generateSea001QuestionStudioBatch,
  type Sea001QuestionStudioRequest,
} from "./topics/SeatingArrangement/SEA-001/question-studio/seating-question-studio-runtime.ts";

export type ReasoningV1QuestionStudioReviewPackageId =
  | typeof BLR_CP007_QUESTION_STUDIO_PACKAGE_ID
  | typeof SEA001_QUESTION_STUDIO_PACKAGE_ID;

export type ReasoningV1QuestionStudioReviewRequest =
  | (BlrCp007QuestionStudioReviewRequest & Readonly<{
      packageId: typeof BLR_CP007_QUESTION_STUDIO_PACKAGE_ID;
    }>)
  | (Sea001QuestionStudioRequest & Readonly<{
      packageId: typeof SEA001_QUESTION_STUDIO_PACKAGE_ID;
    }>);

const REVIEW_PACKAGES = [
  BLR_CP007_QUESTION_STUDIO_REVIEW_PACKAGE,
  SEA001_QUESTION_STUDIO_PACKAGE,
] as const;

export function listReasoningV1QuestionStudioReviewPackages() {
  return REVIEW_PACKAGES.map((entry) => ({ ...entry }));
}

export function listEnabledReasoningV1QuestionStudioPackages() {
  return REVIEW_PACKAGES.filter((entry) => entry.enabled);
}

export function previewReasoningV1QuestionStudioReview(
  request: ReasoningV1QuestionStudioReviewRequest,
) {
  if (request.packageId === BLR_CP007_QUESTION_STUDIO_PACKAGE_ID) {
    const { packageId: _packageId, ...blrRequest } = request;
    return previewBlrCp007QuestionStudioReview(blrRequest);
  }
  if (request.packageId === SEA001_QUESTION_STUDIO_PACKAGE_ID) {
    const { packageId: _packageId, ...seaRequest } = request;
    return generateSea001QuestionStudioBatch(seaRequest);
  }
  const exhaustive: never = request;
  throw new Error(`Unknown Reasoning V1 Question Studio package '${String((exhaustive as { packageId?: unknown }).packageId)}'.`);
}

export function persistReasoningV1QuestionStudioReview(
  request: ReasoningV1QuestionStudioReviewRequest,
): never {
  if (request.packageId === BLR_CP007_QUESTION_STUDIO_PACKAGE_ID) {
    return assertBlrCp007QuestionStudioPersistenceAllowed();
  }
  if (request.packageId === SEA001_QUESTION_STUDIO_PACKAGE_ID) {
    throw new Error(
      "SEA-001 Question Studio integration is review-only at the shared registry gate; Question Bank persistence, mock-test eligibility, staging and publication require separate explicit approval.",
    );
  }
  const exhaustive: never = request;
  throw new Error(`Unknown Reasoning V1 Question Studio package '${String((exhaustive as { packageId?: unknown }).packageId)}'.`);
}
