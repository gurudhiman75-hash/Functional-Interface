import { strict as assert } from "node:assert";

import { validateKnowledgeFactEligibility } from "../../eligibility";
import { auditGeoRiv001Cp001EditorialReviewV2, GEO_RIV_001_CP001_APPROVED_FACTS_V2 } from "./geo-riv-001-cp001-editorial-review-v2";
import { auditGeoRiv001Cp001ReviewBatchV2D, GEO_RIV_001_CP001_REVIEW_BATCH_V2D } from "./geo-riv-001-cp001-review-batch-v2d";
import { generateGeoRiv001Cp001ReviewV2D } from "./geo-riv-001-cp001-review-generator-v2d";

const editorial = auditGeoRiv001Cp001EditorialReviewV2();
assert.equal(editorial.valid, true, editorial.issues.join("\n"));
assert.equal(editorial.reviewableFactCount, 37);
assert.equal(editorial.approvedFactCount, 37);
assert.equal(editorial.relationCounts.defined_as, 3);
assert.equal(editorial.relationCounts.drainage_pattern_defined_as, 4);
assert.equal(editorial.relationCounts.classified_as_river_group, 9);
assert.equal(editorial.relationCounts.has_flow_direction, 6);
assert.equal(editorial.relationCounts.drains_into, 7);
assert.equal(editorial.relationCounts.has_mouth_type, 6);
assert.equal(editorial.relationCounts.has_group_characteristic, 2);

for (const fact of GEO_RIV_001_CP001_APPROVED_FACTS_V2) {
  const eligibility = validateKnowledgeFactEligibility(fact, {
    asOf: "2026-09-09T08:30:00.000Z",
  });
  assert.equal(
    eligibility.eligible,
    true,
    `${fact.factId}: ${eligibility.issues.map((issue) => issue.code).join(", ")}`,
  );
}

const batchAudit = auditGeoRiv001Cp001ReviewBatchV2D();
assert.equal(batchAudit.valid, true, batchAudit.issues.join("\n"));
assert.equal(batchAudit.questionCount, 54);
assert.equal(batchAudit.difficultyCounts.Easy, 16);
assert.equal(batchAudit.difficultyCounts.Medium, 32);
assert.equal(batchAudit.difficultyCounts.Hard, 6);
assert.ok(batchAudit.uniqueStemCount >= 35);

for (const question of GEO_RIV_001_CP001_REVIEW_BATCH_V2D) {
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);
  assert.ok(question.sourceIds.length >= 1);
  assert.ok(question.sourceFactIds.length >= 1);
  assert.ok(question.explanation.length >= 30);
}

const replayA = generateGeoRiv001Cp001ReviewV2D(
  "GEO-RIV-001-QL-009",
  "geo-riv-001-cp001-v2d-replay-proof",
);
const replayB = generateGeoRiv001Cp001ReviewV2D(
  "GEO-RIV-001-QL-009",
  "geo-riv-001-cp001-v2d-replay-proof",
);
assert.deepEqual(replayA, replayB);

assert.throws(
  () => generateGeoRiv001Cp001ReviewV2D("GEO-RIV-001-QL-999", "seed"),
  /Unknown GEO-RIV-001 CP001 V2C QL/,
);
