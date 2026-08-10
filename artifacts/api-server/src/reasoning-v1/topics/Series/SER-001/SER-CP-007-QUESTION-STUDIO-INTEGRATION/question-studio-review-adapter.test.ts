import assert from "node:assert/strict";

import {
  SER_CP007_PERMANENT_QL_IDS,
} from "../SER-PERMANENT-QL-REGISTRY";
import {
  generateSerCp007QuestionStudioReviewSweep,
} from "./ser-cp-007-question-studio-runtime";
import {
  SER_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewSer001QuestionStudioReview,
} from "./question-studio-review-adapter";

assert.equal(SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.reviewOnly, true);
assert.equal(SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankStatus, "NOT_STORED");
assert.equal(SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);
assert.equal(SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.frozenTemplateCount, 140);
assert.equal(SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.multilingualProofPayloadCount, 420);
assert.deepEqual(SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.qlIds, [...SER_CP007_PERMANENT_QL_IDS]);

const first = previewSer001QuestionStudioReview({
  language: "en",
  seed: "ser-current-main-proof",
  count: 5,
});
const second = previewSer001QuestionStudioReview({
  language: "en",
  seed: "ser-current-main-proof",
  count: 5,
});
assert.equal(first.questions.length, 5);
assert.deepEqual(
  first.questions.map((question) => question.questionId),
  second.questions.map((question) => question.questionId),
);
for (const question of first.questions) {
  assert.equal(question.validation.valid, true);
  assert.equal(question.safety.reviewOnly, true);
  assert.equal(question.questionBankStatus, "NOT_STORED");
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.options.length, 4);
  assert.equal(question.options[question.correctIndex], question.answer);
}

for (const language of ["en", "hi", "pa"] as const) {
  const preview = previewSer001QuestionStudioReview({
    language,
    qlId: "SER-QL-001",
    seed: `ser-${language}-proof`,
    count: 2,
  });
  assert.equal(preview.questions.length, 2);
  assert.ok(preview.questions.every((question) => question.qlId === "SER-QL-001"));
  assert.ok(preview.questions.every((question) => question.language === language));
}

const sweep = generateSerCp007QuestionStudioReviewSweep(37);
assert.equal(sweep.length, 420);
assert.ok(sweep.every((question) => question.questionBankWritable === false));
assert.ok(sweep.every((question) => question.testEligible === false));
assert.ok(sweep.every((question) => question.publiclyPublishable === false));

console.log("SER-001 current-main Question Studio review adapter: PASS");
