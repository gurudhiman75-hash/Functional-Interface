import { strict as assert } from "node:assert";

import {
  GEO_RIV_001_CP001_REVIEW_BATCH_V2G,
  auditGeoRiv001Cp001ReviewBatchV2G,
} from "./geo-riv-001-cp001-review-batch-v2g";
import { generateGeoRiv001Cp001ReviewV2G } from "./geo-riv-001-cp001-review-generator-v2g";

const audit = auditGeoRiv001Cp001ReviewBatchV2G();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.questionCount, 54);
assert.equal(audit.editorialSemanticUniqueCount, 54);
assert.equal(audit.difficultyCounts.Easy, 16);
assert.equal(audit.difficultyCounts.Medium, 32);
assert.equal(audit.difficultyCounts.Hard, 6);

const expectedPerQl: Record<string, number> = {
  "GEO-RIV-001-QL-001": 3,
  "GEO-RIV-001-QL-002": 3,
  "GEO-RIV-001-QL-003": 4,
  "GEO-RIV-001-QL-004": 4,
  "GEO-RIV-001-QL-005": 10,
  "GEO-RIV-001-QL-006": 9,
  "GEO-RIV-001-QL-007": 9,
  "GEO-RIV-001-QL-008": 6,
  "GEO-RIV-001-QL-009": 6,
};

for (const [qlId, expected] of Object.entries(expectedPerQl)) {
  assert.equal(
    GEO_RIV_001_CP001_REVIEW_BATCH_V2G.filter((question) => question.qlId === qlId).length,
    expected,
    `${qlId} count`,
  );
}

for (const qlId of ["GEO-RIV-001-QL-001", "GEO-RIV-001-QL-002"]) {
  const questions = GEO_RIV_001_CP001_REVIEW_BATCH_V2G.filter((question) => question.qlId === qlId);
  assert.equal(new Set(questions.map((question) => question.canonicalAnswer)).size, 3);
}

for (const qlId of ["GEO-RIV-001-QL-003", "GEO-RIV-001-QL-004"]) {
  const questions = GEO_RIV_001_CP001_REVIEW_BATCH_V2G.filter((question) => question.qlId === qlId);
  assert.equal(new Set(questions.map((question) => question.canonicalAnswer)).size, 4);
}

for (const question of GEO_RIV_001_CP001_REVIEW_BATCH_V2G) {
  assert.equal(question.questionId.includes("CP001-V2G"), true, question.questionId);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
  assert.equal(question.sourceIds.length > 0, true);
  assert.equal(question.sourceFactIds.length > 0, true);
  assert.equal(question.explanation.length >= 45, true, question.questionId);
  assert.equal(/is correct because it is/i.test(question.explanation), false, question.questionId);
}

for (const question of GEO_RIV_001_CP001_REVIEW_BATCH_V2G.filter(
  (entry) => entry.qlId === "GEO-RIV-001-QL-003" || entry.qlId === "GEO-RIV-001-QL-004",
)) {
  assert.equal(/The following description refers to which drainage pattern/i.test(question.stem), false);
}

const replayA = generateGeoRiv001Cp001ReviewV2G(
  "GEO-RIV-001-QL-005",
  "geo-riv-001-v2g-replay",
);
const replayB = generateGeoRiv001Cp001ReviewV2G(
  "GEO-RIV-001-QL-005",
  "geo-riv-001-v2g-replay",
);
assert.deepEqual(replayA, replayB);

assert.throws(
  () => generateGeoRiv001Cp001ReviewV2G("GEO-RIV-001-QL-999", "unknown-ql"),
  /Unknown|Unsupported|does not own/i,
);
