import { strict as assert } from "node:assert";
import {
  GEO_RIV_001_CP015_REVIEW_BATCH_V1,
  GEO_RIV_001_CP015_SOURCE_CP_QUOTAS_V1,
  auditGeoRiv001Cp015ReviewBatchV1,
} from "./geo-riv-001-cp015-review-batch-v1";

const audit = auditGeoRiv001Cp015ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join(" | "));
assert.equal(audit.questionCount, 60);
assert.equal(audit.inheritedQlCount, 60);
assert.equal(audit.semanticUniqueCount, 60);
assert.deepEqual(audit.difficultyCounts, { Easy: 14, Medium: 32, Hard: 14 });
assert.deepEqual(audit.answerPositions, [15, 15, 15, 15]);
assert.equal(new Set(GEO_RIV_001_CP015_REVIEW_BATCH_V1.map((q) => q.sourceQuestionId)).size, 60);
assert.equal(new Set(GEO_RIV_001_CP015_REVIEW_BATCH_V1.map((q) => q.qlId)).size, 60);
assert.equal(new Set(GEO_RIV_001_CP015_REVIEW_BATCH_V1.map((q) => `${q.stem}::${q.canonicalAnswer}`)).size, 60);

for (const [cpId, quota] of Object.entries(GEO_RIV_001_CP015_SOURCE_CP_QUOTAS_V1)) {
  assert.equal(audit.cpCounts[cpId], quota, cpId);
}

for (const question of GEO_RIV_001_CP015_REVIEW_BATCH_V1) {
  assert.equal(question.cpId, "GEO-RIV-001-CP015");
  assert.equal(question.sourceQlId, question.qlId);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
  assert.ok(question.sourceIds.length > 0);
  assert.ok(question.sourceFactIds.length > 0);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);
}

console.log(JSON.stringify(audit, null, 2));
