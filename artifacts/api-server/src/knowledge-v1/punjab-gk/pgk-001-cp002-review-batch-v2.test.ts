import assert from "node:assert/strict";
import {
  PGK_001_CP002_REVIEW_BATCH_V2,
  PGK_001_CP002_STEMS_V2,
  auditPgk001Cp002ReviewBatchV2,
} from "./pgk-001-cp002-review-batch-v2";

const audit = auditPgk001Cp002ReviewBatchV2();
assert.equal(audit.valid, true, audit.issues.join(" | "));
assert.equal(PGK_001_CP002_REVIEW_BATCH_V2.length, 42);
assert.equal(PGK_001_CP002_STEMS_V2.length, 42);

const allStems = PGK_001_CP002_REVIEW_BATCH_V2.map((question) => question.stem.toLowerCase()).join("\n");
for (const banned of [
  "this district was",
  "its headquarters is",
  "identify it",
  "which list gives",
  "which of these",
  "is administered under which",
  "falls under which administrative division",
]) {
  assert.equal(allStems.includes(banned), false, `V2 must not contain non-exam stem phrase: ${banned}`);
}

assert.ok(PGK_001_CP002_REVIEW_BATCH_V2.some((question) => question.stem.startsWith("Consider the following")));
assert.ok(PGK_001_CP002_REVIEW_BATCH_V2.some((question) => question.stem.startsWith("Arrange the following")));
assert.ok(PGK_001_CP002_REVIEW_BATCH_V2.some((question) => question.stem.includes("correctly matched")));
