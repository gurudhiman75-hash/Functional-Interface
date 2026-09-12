import { strict as assert } from "node:assert";
import { GEO_RIV_001_CP011_AUTHORITY_V1, GEO_RIV_001_CP011_BASIN_ROWS_V1, GEO_RIV_001_CP011_PATTERN_ROWS_V1 } from "./geo-riv-001-cp011-facts";
import { GEO_RIV_001_CP011_REVIEW_BATCH_V1, auditGeoRiv001Cp011ReviewBatchV1 } from "./geo-riv-001-cp011-review-batch-v1";
import { GEO_RIV_001_CP011_QL_IDS_V1 } from "./geo-riv-001-cp011-review-generator-v1";

const audit = auditGeoRiv001Cp011ReviewBatchV1();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(GEO_RIV_001_CP011_AUTHORITY_V1.basinMembershipCount, 17);
assert.equal(GEO_RIV_001_CP011_AUTHORITY_V1.basinCount, 5);
assert.equal(GEO_RIV_001_CP011_AUTHORITY_V1.patternCount, 4);
assert.equal(GEO_RIV_001_CP011_AUTHORITY_V1.learnerFacingRiverPrefixRequired, true);
assert.equal(GEO_RIV_001_CP011_AUTHORITY_V1.distinguishesBasinFromStateDrainage, true);
assert.equal(GEO_RIV_001_CP011_AUTHORITY_V1.reviewOnly, true);
assert.equal(new Set(GEO_RIV_001_CP011_BASIN_ROWS_V1.map((row) => row.river)).size, 17);
assert.equal(new Set(GEO_RIV_001_CP011_PATTERN_ROWS_V1.map((row) => row.pattern)).size, 4);
assert.equal(audit.questionCount, 54);
assert.deepEqual(audit.difficultyCounts, { Easy: 12, Medium: 36, Hard: 6 });
assert.deepEqual(audit.answerPositions, { 0: 14, 1: 14, 2: 13, 3: 13 });
for (const qlId of GEO_RIV_001_CP011_QL_IDS_V1) assert.equal(audit.qlCounts[qlId], 6);

for (const question of GEO_RIV_001_CP011_REVIEW_BATCH_V1) {
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
  assert.ok(question.sourceIds.length >= 1);
  assert.ok(question.sourceFactIds.length >= 1);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);
}

console.log(JSON.stringify(audit, null, 2));