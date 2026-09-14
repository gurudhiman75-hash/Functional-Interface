import assert from "node:assert/strict";
import {
  PGK_001_CP003_REVIEW_BATCH_V2,
  auditPgk001Cp003ReviewBatchV2,
} from "./pgk-001-cp003-review-batch-v2";

const audit = auditPgk001Cp003ReviewBatchV2();
assert.equal(audit.valid, true, audit.issues.join(" | "));
assert.equal(PGK_001_CP003_REVIEW_BATCH_V2.length, 42);
assert.equal(new Set(PGK_001_CP003_REVIEW_BATCH_V2.map((question) => question.qlId)).size, 7);

const learnerText = PGK_001_CP003_REVIEW_BATCH_V2
  .map((question) => `${question.qlName}\n${question.stem}\n${question.options.join("\n")}\n${question.explanation}`)
  .join("\n")
  .toLowerCase();

for (const banned of [
  "puadh",
  "government of punjab",
  "know punjab",
  "puda",
  "master plan",
  "regional plan",
  "planning area",
  "state profile",
  "pau",
]) {
  assert.equal(learnerText.includes(banned), false, `learner-facing CP003 contains banned source/region term: ${banned}`);
}

assert.ok(learnerText.includes("majha"));
assert.ok(learnerText.includes("doaba"));
assert.ok(learnerText.includes("malwa"));

for (const question of PGK_001_CP003_REVIEW_BATCH_V2) {
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);
}
