import { strict as assert } from "node:assert";
import { GEO_RIV_001_CP006_REVIEW_BATCH_V1, auditGeoRiv001Cp006ReviewBatchV1 } from "./geo-riv-001-cp006-review-batch-v1";

const audit = auditGeoRiv001Cp006ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join(", "));
assert.equal(audit.questionCount, 54);
assert.equal(audit.semanticUniqueCount, 54);
assert.deepEqual(audit.qlCounts, {
  "GEO-RIV-001-QL-046": 7,
  "GEO-RIV-001-QL-047": 6,
  "GEO-RIV-001-QL-048": 8,
  "GEO-RIV-001-QL-049": 6,
  "GEO-RIV-001-QL-050": 7,
  "GEO-RIV-001-QL-051": 7,
  "GEO-RIV-001-QL-052": 4,
  "GEO-RIV-001-QL-053": 5,
  "GEO-RIV-001-QL-054": 4,
});
assert.deepEqual(audit.answerPositions, { 0: 14, 1: 14, 2: 13, 3: 13 });
assert.deepEqual(audit.difficultyCounts, { Easy: 15, Medium: 31, Hard: 8 });
assert.equal(new Set(GEO_RIV_001_CP006_REVIEW_BATCH_V1.map((q) => q.questionId)).size, 54);
for (const q of GEO_RIV_001_CP006_REVIEW_BATCH_V1) {
  assert.equal(q.options.length, 4);
  assert.equal(q.options[q.correctIndex], q.canonicalAnswer);
  assert.doesNotMatch(`${q.stem}\n${q.explanation}`, /associated with|both banks|neither bank|matches the reviewed relation|exam trap|shortcut/i);
}
