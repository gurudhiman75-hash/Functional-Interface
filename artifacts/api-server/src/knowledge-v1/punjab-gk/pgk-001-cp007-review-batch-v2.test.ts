import assert from "node:assert/strict";
import {
  PGK_001_CP007_REVIEW_BATCH_V2,
  auditPgk001Cp007ReviewBatchV2,
} from "./pgk-001-cp007-review-batch-v2";

const audit = auditPgk001Cp007ReviewBatchV2();
assert.equal(audit.valid, true, audit.issues.join(" | "));
assert.equal(PGK_001_CP007_REVIEW_BATCH_V2.length, 42);

const learnerText = PGK_001_CP007_REVIEW_BATCH_V2
  .map((question) => `${question.stem}\n${question.explanation}`)
  .join("\n")
  .toLowerCase();

for (const banned of [
  "associated with",
  "closely associated",
  "most closely associated",
  "linked with",
  "closely linked",
  "well known for",
  "especially associated",
  "is protected in punjab as",
  "which combination correctly links",
]) {
  assert.equal(learnerText.includes(banned), false, `CP007 V2 learner text contains banned phrase: ${banned}`);
}

for (const question of PGK_001_CP007_REVIEW_BATCH_V2) {
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);
  assert.ok(question.stem.length <= 260, `${question.questionId} stem is too long`);
  assert.ok(question.explanation.split(/(?<=[.!?])\s+/).length <= 3, `${question.questionId} explanation is too long`);
}
