import {
  BLR_CP006_QUESTION_STUDIO_PACKAGE_ID,
  BLR_CP006_QUESTION_STUDIO_REVIEW_PACKAGE,
  assertBlrCp006QuestionStudioPersistenceAllowed,
  previewBlrCp006QuestionStudioReview,
  type BlrCp006QuestionStudioReviewRequest,
} from "./topics/Blood-Relations/BLR-001/BLR-CP-006/question-studio-review-adapter";
import { BLR_CP006_MULTILINGUAL_FREEZE_AUTHORITY } from "./topics/Blood-Relations/BLR-001/BLR-CP-006/cp006-multilingual-frozen";
import {
  BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
  BLR_CP007_QUESTION_STUDIO_REVIEW_PACKAGE,
  assertBlrCp007QuestionStudioPersistenceAllowed,
  previewBlrCp007QuestionStudioReview,
  type BlrCp007QuestionStudioReviewRequest,
} from "./topics/Blood-Relations/BLR-001/BLR-CP-007/question-studio-review-adapter";

export const BLR_CP007_QUESTION_STUDIO_RELEASE_AUTHORITY =
  "BLR_CP007_PRODUCT_RELEASE_APPROVED_2026_08_09" as const;

export type ReasoningV1QuestionStudioReviewPackageId =
  | typeof BLR_CP006_QUESTION_STUDIO_PACKAGE_ID
  | typeof BLR_CP007_QUESTION_STUDIO_PACKAGE_ID;

export type ReasoningV1QuestionStudioReviewRequest = Readonly<{
  packageId: ReasoningV1QuestionStudioReviewPackageId;
  language?: "en" | "hi" | "pa";
  qlId?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  canonicalItemId?: string;
  questionLanguageId?: string;
  seed?: string;
  count?: number;
}>;

const REVIEW_PACKAGES = [
  BLR_CP007_QUESTION_STUDIO_REVIEW_PACKAGE,
  BLR_CP006_QUESTION_STUDIO_REVIEW_PACKAGE,
] as const;

export function listReasoningV1QuestionStudioReviewPackages() {
  return REVIEW_PACKAGES.map((entry) => ({ ...entry }));
}

export function listEnabledReasoningV1QuestionStudioPackages() {
  return REVIEW_PACKAGES.filter((entry) => entry.enabled);
}

export function getReasoningV1QuestionStudioReviewPackage(
  packageId: ReasoningV1QuestionStudioReviewPackageId,
) {
  const found = REVIEW_PACKAGES.find((entry) => entry.packageId === packageId);
  if (!found) throw new Error("Unknown Reasoning V1 Question Studio package.");
  return found;
}

export function getReasoningV1QuestionStudioReleaseAuthority(
  packageId: ReasoningV1QuestionStudioReviewPackageId,
) {
  if (packageId === BLR_CP006_QUESTION_STUDIO_PACKAGE_ID) {
    return BLR_CP006_MULTILINGUAL_FREEZE_AUTHORITY;
  }
  return BLR_CP007_QUESTION_STUDIO_RELEASE_AUTHORITY;
}

export function previewReasoningV1QuestionStudioReview(
  request: ReasoningV1QuestionStudioReviewRequest,
) {
  if (request.packageId === BLR_CP006_QUESTION_STUDIO_PACKAGE_ID) {
    return previewBlrCp006QuestionStudioReview(
      request as BlrCp006QuestionStudioReviewRequest,
    );
  }
  return previewBlrCp007QuestionStudioReview(
    request as BlrCp007QuestionStudioReviewRequest,
  );
}

export function persistReasoningV1QuestionStudioReview(
  request: ReasoningV1QuestionStudioReviewRequest,
): never {
  if (request.packageId === BLR_CP006_QUESTION_STUDIO_PACKAGE_ID) {
    return assertBlrCp006QuestionStudioPersistenceAllowed();
  }
  return assertBlrCp007QuestionStudioPersistenceAllowed();
}
