import assert from "node:assert/strict";
import { SCI_CP003_REVIEW_BATCH_V1, auditSciCp003ReviewBatchV1 } from "./sci-cp003-review-v1";

const audit = auditSciCp003ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join(" | "));
assert.equal(audit.questionCount, 60);
assert.equal(audit.semanticCount, 60);
assert.deepEqual(audit.difficultyCounts, { Easy: 18, Medium: 30, Hard: 12 });
assert.deepEqual(audit.answerPositions, [15, 15, 15, 15]);
assert.equal(Object.keys(audit.qlCounts).length, 10);
assert.equal(SCI_CP003_REVIEW_BATCH_V1.every((question) => question.reviewOnly && !question.runtimeRegistered), true);

console.log("SCI-CP-003 review qualification passed", audit);
