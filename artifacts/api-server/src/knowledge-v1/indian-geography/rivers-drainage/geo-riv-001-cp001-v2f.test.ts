import { strict as assert } from "node:assert";

import {
  auditGeoRiv001Cp001ReviewBatchV2F,
  GEO_RIV_001_CP001_REVIEW_BATCH_V2F,
} from "./geo-riv-001-cp001-review-batch-v2f";
import { generateGeoRiv001Cp001ReviewV2F } from "./geo-riv-001-cp001-review-generator-v2f";

const audit = auditGeoRiv001Cp001ReviewBatchV2F();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.questionCount, 54);
assert.equal(audit.semanticUniqueCount, 54);
assert.equal(audit.difficultyCounts.Easy, 16);
assert.equal(audit.difficultyCounts.Medium, 32);
assert.equal(audit.difficultyCounts.Hard, 6);

for (const question of GEO_RIV_001_CP001_REVIEW_BATCH_V2F) {
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
  assert.ok(question.sourceIds.length > 0);
  assert.ok(question.sourceFactIds.length > 0);
  assert.ok(question.explanation.length >= 30);
}

const ql008 = GEO_RIV_001_CP001_REVIEW_BATCH_V2F.filter(
  (question) => question.qlId === "GEO-RIV-001-QL-008",
);
assert.deepEqual(
  new Set(ql008.map((question) => question.canonicalAnswer)),
  new Set([
    "Both Statement I and Statement II are correct",
    "Only Statement I is correct",
    "Only Statement II is correct",
    "Neither Statement I nor Statement II is correct",
  ]),
);

const ql009 = GEO_RIV_001_CP001_REVIEW_BATCH_V2F.filter(
  (question) => question.qlId === "GEO-RIV-001-QL-009",
);
assert.deepEqual(
  new Set(ql009.map((question) => question.canonicalAnswer)),
  new Set(["None", "One", "Two", "Three"]),
);

const replayA = generateGeoRiv001Cp001ReviewV2F(
  "GEO-RIV-001-QL-009",
  "geo-riv-001-v2f-replay-proof",
);
const replayB = generateGeoRiv001Cp001ReviewV2F(
  "GEO-RIV-001-QL-009",
  "geo-riv-001-v2f-replay-proof",
);
assert.deepEqual(replayA, replayB);

assert.throws(
  () => generateGeoRiv001Cp001ReviewV2F("GEO-RIV-001-QL-999", "seed"),
  /Unknown GEO-RIV-001 CP001 V2C QL/,
);
