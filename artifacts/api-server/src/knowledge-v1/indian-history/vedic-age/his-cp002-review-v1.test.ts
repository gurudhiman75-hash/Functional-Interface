import assert from "node:assert/strict";
import {
  HIS_CP002_REQUIRED_FACTS_V1,
  HIS_CP002_REVIEW_BATCH_V1,
  auditHisCp002ReviewBatchV1,
} from "./his-cp002-review-v1";

const audit = auditHisCp002ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join(" | "));
assert.equal(audit.questionCount, 60);
assert.equal(audit.semanticCount, 60);
assert.deepEqual(audit.difficultyCounts, { Easy: 18, Medium: 24, Hard: 18 });
assert.equal(Object.keys(audit.qlCounts).length, 10);
assert.ok(Object.values(audit.qlCounts).every((count) => count === 6));
assert.ok(Math.max(...audit.answerPositions) - Math.min(...audit.answerPositions) <= 1);
assert.ok(HIS_CP002_REQUIRED_FACTS_V1.length >= 45);
assert.equal(HIS_CP002_REVIEW_BATCH_V1.every((q) => q.reviewOnly && !q.runtimeRegistered), true);
console.log(JSON.stringify(audit, null, 2));
