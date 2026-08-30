import {
  BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
  BLR_CP007_QUESTION_STUDIO_REVIEW_PACKAGE,
  assertBlrCp007QuestionStudioPersistenceAllowed,
  previewBlrCp007QuestionStudioReview,
  type BlrCp007QuestionStudioReviewRequest,
} from "./topics/Blood-Relations/BLR-001/BLR-CP-007/question-studio-review-adapter";
import {
  DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewDsf001NormalQuestionStudioReview,
  type DsfCp017QuestionStudioInput,
} from "./topics/Data-Sufficiency/DSF-001/DSF-CP-017/question-studio-review-v1";
import {
  SYL_001_QUESTION_STUDIO_PACKAGE,
  SYL_001_QUESTION_STUDIO_PACKAGE_ID,
  assertSyl001QuestionStudioPersistenceAllowed,
  previewSyl001QuestionStudio,
  type Syl001QuestionStudioRequest,
} from "./topics/Syllogism/SYL-001/question-studio-adapter";
import {
  STA_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  assertSta001QuestionStudioPersistenceAllowed,
  previewSta001QuestionStudioReview,
  type PreviewSta001QuestionStudioInput,
} from "./topics/Statement-and-Assumption/STA-001/question-studio-review";
import {
  STC_001_QUESTION_STUDIO_REVIEW_PACKAGE as STC_001_V1_QUESTION_STUDIO_REVIEW_PACKAGE,
  assertStc001QuestionStudioPersistenceAllowed as assertStc001V1QuestionStudioPersistenceAllowed,
  previewStc001QuestionStudioReview as previewStc001V1QuestionStudioReview,
  type PreviewStc001QuestionStudioInput as PreviewStc001V1QuestionStudioInput,
} from "./topics/Statement-and-Conclusion/STC-001/question-studio-review";
import {
  STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE,
  assertStc001V2QuestionStudioPersistenceAllowed,
  previewStc001V2QuestionStudioReview,
  type PreviewStc001V2QuestionStudioInput,
} from "./topics/Statement-and-Conclusion/STC-001/question-studio-review-v2";
import {
  STC_001_V22_QUESTION_STUDIO_REVIEW_PACKAGE,
  assertStc001V22QuestionStudioPersistenceAllowed,
  previewStc001V22QuestionStudioReview,
  type PreviewStc001V22QuestionStudioInput,
} from "./topics/Statement-and-Conclusion/STC-001/question-studio-review-v2-2";
import {
  WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewWor001QuestionStudioReview,
  type PreviewWor001QuestionStudioInput,
} from "./topics/Word-Dictionary-Order/WOR-001/question-studio-review";

export type ReasoningV1QuestionStudioReviewPackageId =
  | typeof BLR_CP007_QUESTION_STUDIO_PACKAGE_ID
  | typeof DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.packageId
  | typeof SYL_001_QUESTION_STUDIO_PACKAGE_ID
  | typeof STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.packageId
  | typeof STC_001_V1_QUESTION_STUDIO_REVIEW_PACKAGE.packageId
  | typeof STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.packageId
  | typeof STC_001_V22_QUESTION_STUDIO_REVIEW_PACKAGE.packageId
  | typeof WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.packageId;

export type ReasoningV1QuestionStudioReviewRequest =
  | (BlrCp007QuestionStudioReviewRequest & Readonly<{ packageId: typeof BLR_CP007_QUESTION_STUDIO_PACKAGE_ID }>)
  | (DsfCp017QuestionStudioInput & Readonly<{ packageId: typeof DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.packageId }>)
  | (Syl001QuestionStudioRequest & Readonly<{ packageId: typeof SYL_001_QUESTION_STUDIO_PACKAGE_ID }>)
  | (PreviewSta001QuestionStudioInput & Readonly<{ packageId: typeof STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.packageId }>)
  | (PreviewStc001V1QuestionStudioInput & Readonly<{ packageId: typeof STC_001_V1_QUESTION_STUDIO_REVIEW_PACKAGE.packageId }>)
  | (PreviewStc001V2QuestionStudioInput & Readonly<{ packageId: typeof STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.packageId }>)
  | (PreviewStc001V22QuestionStudioInput & Readonly<{ packageId: typeof STC_001_V22_QUESTION_STUDIO_REVIEW_PACKAGE.packageId }>)
  | (PreviewWor001QuestionStudioInput & Readonly<{ packageId: typeof WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.packageId }>);

const REVIEW_PACKAGES = [
  BLR_CP007_QUESTION_STUDIO_REVIEW_PACKAGE,
  DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE,
  SYL_001_QUESTION_STUDIO_PACKAGE,
  STA_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  STC_001_V22_QUESTION_STUDIO_REVIEW_PACKAGE,
  STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE,
  STC_001_V1_QUESTION_STUDIO_REVIEW_PACKAGE,
  WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE,
] as const;

export function listReasoningV1QuestionStudioReviewPackages() {
  return REVIEW_PACKAGES.map((entry) => ({ ...entry }));
}

export function listEnabledReasoningV1QuestionStudioPackages() {
  return REVIEW_PACKAGES.filter((entry) => "enabled" in entry ? entry.enabled : entry.questionStudioVisible);
}

export function previewReasoningV1QuestionStudioReview(request: ReasoningV1QuestionStudioReviewRequest) {
  if (request.packageId === BLR_CP007_QUESTION_STUDIO_PACKAGE_ID) {
    return previewBlrCp007QuestionStudioReview(request);
  }
  if (request.packageId === DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.packageId) {
    const { packageId: _packageId, ...input } = request;
    return previewDsf001NormalQuestionStudioReview(input);
  }
  if (request.packageId === SYL_001_QUESTION_STUDIO_PACKAGE_ID) {
    return previewSyl001QuestionStudio(request);
  }
  if (request.packageId === STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.packageId) {
    const { packageId: _packageId, ...input } = request;
    return previewSta001QuestionStudioReview(input);
  }
  if (request.packageId === STC_001_V22_QUESTION_STUDIO_REVIEW_PACKAGE.packageId) {
    const { packageId: _packageId, ...input } = request;
    return previewStc001V22QuestionStudioReview(input);
  }
  if (request.packageId === STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.packageId) {
    const { packageId: _packageId, ...input } = request;
    return previewStc001V2QuestionStudioReview(input);
  }
  if (request.packageId === STC_001_V1_QUESTION_STUDIO_REVIEW_PACKAGE.packageId) {
    const { packageId: _packageId, ...input } = request;
    return previewStc001V1QuestionStudioReview(input);
  }
  if (request.packageId === WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.packageId) {
    const { packageId: _packageId, ...input } = request;
    return previewWor001QuestionStudioReview(input);
  }
  throw new Error(`Unknown Reasoning V1 Question Studio package '${String((request as { packageId?: unknown }).packageId)}'.`);
}

export function persistReasoningV1QuestionStudioReview(request: ReasoningV1QuestionStudioReviewRequest): never {
  if (request.packageId === BLR_CP007_QUESTION_STUDIO_PACKAGE_ID) {
    return assertBlrCp007QuestionStudioPersistenceAllowed();
  }
  if (request.packageId === DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.packageId) {
    throw new Error("DSF-001 persistence is enabled only through the authenticated shared Question Studio /runs route so RBAC, audit events, review status and downstream release locks are preserved.");
  }
  if (request.packageId === SYL_001_QUESTION_STUDIO_PACKAGE_ID) {
    return assertSyl001QuestionStudioPersistenceAllowed();
  }
  if (request.packageId === STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.packageId) {
    return assertSta001QuestionStudioPersistenceAllowed();
  }
  if (request.packageId === STC_001_V22_QUESTION_STUDIO_REVIEW_PACKAGE.packageId) {
    return assertStc001V22QuestionStudioPersistenceAllowed();
  }
  if (request.packageId === STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.packageId) {
    return assertStc001V2QuestionStudioPersistenceAllowed();
  }
  if (request.packageId === STC_001_V1_QUESTION_STUDIO_REVIEW_PACKAGE.packageId) {
    return assertStc001V1QuestionStudioPersistenceAllowed();
  }
  if (request.packageId === WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.packageId) {
    throw new Error("WOR-001 persistence is enabled only through the authenticated shared Question Studio review-run route so RBAC, audit events and release locks are preserved.");
  }
  throw new Error(`Unknown Reasoning V1 Question Studio package '${String((request as { packageId?: unknown }).packageId)}'.`);
}
