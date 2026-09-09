import { strict as assert } from "node:assert";

import {
  auditGeoRiv001Cp001ReviewBatchV2E,
  GEO_RIV_001_CP001_REVIEW_BATCH_V2E,
} from "./geo-riv-001-cp001-review-batch-v2e";
import { generateGeoRiv001Cp001ReviewV2E } from "./geo-riv-001-cp001-review-generator-v2e";

const audit = auditGeoRiv001Cp001ReviewBatchV2E();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.questionCount, 54);
assert.equal(audit.semanticUniqueCount, 54);
assert.equal(audit.difficultyCounts.Easy, 16);
assert.equal(audit.difficultyCounts.Medium, 32);
assert.equal(audit.difficultyCounts.Hard, 6);

const qlCounts = new Map<string, number>();
for (const question of GEO_RIV_001_CP001_REVIEW_BATCH_V2E) {
  qlCounts.set(question.qlId, (qlCounts.get(question.qlId) ?? 0) + 1);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
  assert.ok(question.sourceIds.length >= 1);
  assert.ok(question.sourceFactIds.length >= 1);
  assert.ok(question.explanation.length >= 30);
  assert.match(question.stem, /^[^A-Za-z]*[A-Z]/);
}

assert.deepEqual(
  Object.fromEntries([...qlCounts.entries()].sort()),
  {
    "GEO-RIV-001-QL-001": 4,
    "GEO-RIV-001-QL-002": 4,
    "GEO-RIV-001-QL-003": 6,
    "GEO-RIV-001-QL-004": 6,
    "GEO-RIV-001-QL-005": 8,
    "GEO-RIV-001-QL-006": 7,
    "GEO-RIV-001-QL-007": 7,
    "GEO-RIV-001-QL-008": 6,
    "GEO-RIV-001-QL-009": 6,
  },
);

const ql008 = GEO_RIV_001_CP001_REVIEW_BATCH_V2E.filter(
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

const ql009 = GEO_RIV_001_CP001_REVIEW_BATCH_V2E.filter(
  (question) => question.qlId === "GEO-RIV-001-QL-009",
);
assert.deepEqual(
  new Set(ql009.map((question) => question.canonicalAnswer)),
  new Set(["None", "One", "Two", "Three"]),
);

const replayA = generateGeoRiv001Cp001ReviewV2E(
  "GEO-RIV-001-QL-009",
  "geo-riv-001-v2e-replay-proof",
);
const replayB = generateGeoRiv001Cp001ReviewV2E(
  "GEO-RIV-001-QL-009",
  "geo-riv-001-v2e-replay-proof",
);
assert.deepEqual(replayA, replayB);

assert.throws(
  () => generateGeoRiv001Cp001ReviewV2E("GEO-RIV-001-QL-999", "seed"),
  /Unknown GEO-RIV-001 CP001 V2C QL/,
);
