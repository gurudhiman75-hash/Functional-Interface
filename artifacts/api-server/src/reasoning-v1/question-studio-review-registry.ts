import {
  BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
  BLR_CP007_QUESTION_STUDIO_REVIEW_PACKAGE,
  assertBlrCp007QuestionStudioPersistenceAllowed,
  previewBlrCp007QuestionStudioReview,
  type BlrCp007QuestionStudioReviewRequest,
} from "./topics/Blood-Relations/BLR-001/BLR-CP-007/question-studio-review-adapter";

export type ReasoningV1QuestionStudioReviewPackageId =
  typeof BLR_CP007_QUESTION_STUDIO_PACKAGE_ID;

export type ReasoningV1QuestionStudioReviewRequest =
  BlrCp007QuestionStudioReviewRequest & Readonly<{
    packageId: ReasoningV1QuestionStudioReviewPackageId;
  }>;

const REVIEW_PACKAGES = [BLR_CP007_QUESTION_STUDIO_REVIEW_PACKAGE] as const;

export function listReasoningV1QuestionStudioReviewPackages() {
  return REVIEW_PACKAGES.map((entry) => ({ ...entry }));
}

export function listEnabledReasoningV1QuestionStudioPackages() {
  return REVIEW_PACKAGES.filter((entry) => entry.enabled);
}

export function previewReasoningV1QuestionStudioReview(
  request: ReasoningV1QuestionStudioReviewRequest,
) {
  if (request.packageId !== BLR_CP007_QUESTION_STUDIO_PACKAGE_ID) {
    throw new Error(`Unknown Reasoning V1 Question Studio package '${request.packageId}'.`);
  }
  return previewBlrCp007QuestionStudioReview(request);
}

export function persistReasoningV1QuestionStudioReview(
  request: ReasoningV1QuestionStudioReviewRequest,
): never {
  if (request.packageId !== BLR_CP007_QUESTION_STUDIO_PACKAGE_ID) {
    throw new Error(`Unknown Reasoning V1 Question Studio package '${request.packageId}'.`);
  }
  return assertBlrCp007QuestionStudioPersistenceAllowed();
}
