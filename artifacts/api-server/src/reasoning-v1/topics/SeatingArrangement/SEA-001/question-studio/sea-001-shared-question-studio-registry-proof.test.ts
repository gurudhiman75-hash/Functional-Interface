import assert from "node:assert/strict";

import {
  listEnabledReasoningV1QuestionStudioPackages,
  listReasoningV1QuestionStudioReviewPackages,
  persistReasoningV1QuestionStudioReview,
  previewReasoningV1QuestionStudioReview,
} from "../../../../question-studio-review-registry.ts";
import { SEA001_PERMANENT_QL_IDS } from "../permanent/registry.ts";
import { SEA001_STRUCTURAL_HARDENING_ENGLISH_REVIEW_PIN } from "../review/structural-hardening-english-review-pins.ts";
import { SEA001_STRUCTURAL_HARDENING_MULTILINGUAL_FREEZE } from "../review/structural-hardening-multilingual-freeze.ts";
import { SEA001_QUESTION_STUDIO_PACKAGE_ID } from "./seating-question-studio-runtime.ts";

const packages = listReasoningV1QuestionStudioReviewPackages();
const seaPackage = packages.find((entry) => entry.packageId === SEA001_QUESTION_STUDIO_PACKAGE_ID);
assert.ok(seaPackage, "SEA-001 is missing from shared Reasoning Question Studio registry");
assert.equal(seaPackage.enabled, true);
assert.equal(seaPackage.questionStudioVisible, true);
assert.equal(seaPackage.questionBankEligible, false);
assert.equal(seaPackage.mockTestEligible, false);
assert.equal(seaPackage.publiclyPublishable, false);

const enabled = listEnabledReasoningV1QuestionStudioPackages();
assert.ok(enabled.some((entry) => entry.packageId === SEA001_QUESTION_STUDIO_PACKAGE_ID));

for (const language of ["en", "hi", "pa"] as const) {
  const preview = previewReasoningV1QuestionStudioReview({
    packageId: SEA001_QUESTION_STUDIO_PACKAGE_ID,
    language,
    count: 20,
    seed: `sea001-shared-registry-proof:${language}`,
  });
  assert.equal(preview.questions.length, 20);
  assert.equal(new Set(preview.questions.map((question) => question.qlId)).size, SEA001_PERMANENT_QL_IDS.length);
  assert.equal(preview.generationContext.sourceEnglishFreeze, SEA001_STRUCTURAL_HARDENING_ENGLISH_REVIEW_PIN.candidateFingerprint);
  assert.equal(preview.generationContext.sourceLocalizationFreeze, SEA001_STRUCTURAL_HARDENING_MULTILINGUAL_FREEZE.authority);
  assert.equal(preview.generationContext.questionBankStatus, "NOT_STORED");
  assert.equal(preview.generationContext.mockTestEligible, false);
  assert.equal(preview.generationContext.publiclyPublishable, false);
  assert.ok(preview.questions.every((question) => question.safety.reviewOnly));
  assert.ok(preview.questions.every((question) => !question.safety.questionBankEligible));
  assert.ok(preview.questions.every((question) => !question.safety.mockTestEligible));
  assert.ok(preview.questions.every((question) => !question.safety.publiclyPublishable));
}

assert.throws(
  () => persistReasoningV1QuestionStudioReview({
    packageId: SEA001_QUESTION_STUDIO_PACKAGE_ID,
    language: "en",
    count: 1,
    seed: "sea001-persistence-lock-proof",
  }),
  /review-only/,
);

console.log("PASS_SEA001_SHARED_QUESTION_STUDIO_REGISTRY");
console.log("package", SEA001_QUESTION_STUDIO_PACKAGE_ID);
console.log("QLs", SEA001_PERMANENT_QL_IDS.length);
console.log("languages", "en,hi,pa");
console.log("shared registry enabled", true);
console.log("shared persistence gate locked", true);
console.log("Question Bank/mock/public", false, false, false);
