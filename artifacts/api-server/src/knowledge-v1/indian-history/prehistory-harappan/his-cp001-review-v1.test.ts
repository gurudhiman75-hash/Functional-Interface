import assert from "node:assert/strict";
import {
  HIS_CP001_REQUIRED_FACTS_V1,
  HIS_CP001_REVIEW_BATCH_V1,
  auditHisCp001ReviewBatchV1,
} from "./his-cp001-review-v1";

const audit = auditHisCp001ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join(" | "));
assert.equal(audit.questionCount, 54);
assert.equal(audit.semanticCount, 54);
assert.deepEqual(audit.difficultyCounts, { Easy: 18, Medium: 24, Hard: 12 });
assert.equal(Object.keys(audit.qlCounts).length, 9);
assert.ok(Object.values(audit.qlCounts).every((count) => count === 6));
assert.ok(Math.max(...audit.answerPositions) - Math.min(...audit.answerPositions) <= 1);
assert.ok(HIS_CP001_REQUIRED_FACTS_V1.length >= 30);
assert.equal(HIS_CP001_REVIEW_BATCH_V1.every((q) => q.reviewOnly && !q.runtimeRegistered), true);
console.log(JSON.stringify(audit, null, 2));
