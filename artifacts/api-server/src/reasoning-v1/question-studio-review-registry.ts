import {
  BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
  BLR_CP007_QUESTION_STUDIO_REVIEW_PACKAGE,
  assertBlrCp007QuestionStudioPersistenceAllowed,
  previewBlrCp007QuestionStudioReview,
  type BlrCp007QuestionStudioReviewRequest,
} from "./topics/Blood-Relations/BLR-001/BLR-CP-007/question-studio-review-adapter";
import {
  WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewWor001QuestionStudioReview,
  type PreviewWor001QuestionStudioInput,
} from "./topics/Word-Dictionary-Order/WOR-001/question-studio-review";

export type ReasoningV1QuestionStudioReviewPackageId =
  | typeof BLR_CP007_QUESTION_STUDIO_PACKAGE_ID
  | typeof WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.packageId;

export type ReasoningV1QuestionStudioReviewRequest =
  | (BlrCp007QuestionStudioReviewRequest & Readonly<{
      packageId: typeof BLR_CP007_QUESTION_STUDIO_PACKAGE_ID;
    }>)
  | (PreviewWor001QuestionStudioInput & Readonly<{
      packageId: typeof WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.packageId;
    }>);

const REVIEW_PACKAGES = [
  BLR_CP007_QUESTION_STUDIO_REVIEW_PACKAGE,
  WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE,
] as const;

export function listReasoningV1QuestionStudioReviewPackages() {
  return REVIEW_PACKAGES.map((entry) => ({ ...entry }));
}

export function listEnabledReasoningV1QuestionStudioPackages() {
  return REVIEW_PACKAGES.filter((entry) =>
    "enabled" in entry ? entry.enabled : entry.questionStudioVisible,
  );
}

export function previewReasoningV1QuestionStudioReview(
  request: ReasoningV1QuestionStudioReviewRequest,
) {
  if (request.packageId === BLR_CP007_QUESTION_STUDIO_PACKAGE_ID) {
    return previewBlrCp007QuestionStudioReview(request);
  }
  if (request.packageId === WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.packageId) {
    const { packageId: _packageId, ...input } = request;
    return previewWor001QuestionStudioReview(input);
  }
  throw new Error(`Unknown Reasoning V1 Question Studio package '${String((request as { packageId?: unknown }).packageId)}'.`);
}

export function persistReasoningV1QuestionStudioReview(
  request: ReasoningV1QuestionStudioReviewRequest,
): never {
  if (request.packageId === BLR_CP007_QUESTION_STUDIO_PACKAGE_ID) {
    return assertBlrCp007QuestionStudioPersistenceAllowed();
  }
  if (request.packageId === WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.packageId) {
    throw new Error(
      "WOR-001 persistence is enabled only through the authenticated shared Question Studio review-run route so RBAC, audit events and release locks are preserved.",
    );
  }
  throw new Error(`Unknown Reasoning V1 Question Studio package '${String((request as { packageId?: unknown }).packageId)}'.`);
}
