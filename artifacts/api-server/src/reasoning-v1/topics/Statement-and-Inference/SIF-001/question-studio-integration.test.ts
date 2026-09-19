import assert from "node:assert/strict";
import { listEnabledReasoningV1QuestionStudioPackages, listReasoningV1QuestionStudioReviewPackages, persistReasoningV1QuestionStudioReview, previewReasoningV1QuestionStudioReview } from "../../../question-studio-review-registry.ts";
import { SIF_001_QUESTION_STUDIO_PACKAGE_ID, SIF_001_QUESTION_STUDIO_REVIEW_PACKAGE } from "./question-studio-review.ts";

assert.equal(SIF_001_QUESTION_STUDIO_REVIEW_PACKAGE.cpCount, 17);
assert.equal(SIF_001_QUESTION_STUDIO_REVIEW_PACKAGE.lifecycleStatus, "REVIEW_ONLY");
assert.ok(listReasoningV1QuestionStudioReviewPackages().some((entry) => entry.packageId === SIF_001_QUESTION_STUDIO_PACKAGE_ID));
assert.ok(listEnabledReasoningV1QuestionStudioPackages().some((entry) => entry.packageId === SIF_001_QUESTION_STUDIO_PACKAGE_ID));

const preview = previewReasoningV1QuestionStudioReview({ packageId: SIF_001_QUESTION_STUDIO_PACKAGE_ID, cpId: "SIF-CP010", locale: "pa-IN", seed: 1010 });
assert.equal(preview.packageId, SIF_001_QUESTION_STUDIO_PACKAGE_ID);
assert.equal(preview.lifecycleStatus, "REVIEW_ONLY");
assert.equal(preview.question.cpId, "SIF-CP010");
assert.equal(preview.question.metadata.questionBankWritable, false);

assert.throws(() => persistReasoningV1QuestionStudioReview({ packageId: SIF_001_QUESTION_STUDIO_PACKAGE_ID, cpId: "SIF-CP001", locale: "en-IN", seed: 1 }), /review only.*delivery remain locked/i);
console.log("PASS_SIF_001_QUESTION_STUDIO_REVIEW_INTEGRATION");
