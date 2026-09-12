import { strict as assert } from "node:assert";
import { GEO_RIV_001_CP008_REVIEW_BATCH_V4, auditGeoRiv001Cp008ReviewBatchV4 } from "./geo-riv-001-cp008-review-batch-v4";

const audit = auditGeoRiv001Cp008ReviewBatchV4();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.questionCount, 54);
assert.deepEqual(audit.difficultyCounts, { Easy: 18, Medium: 30, Hard: 6 });
assert.deepEqual(audit.answerPositions, { 0: 14, 1: 14, 2: 13, 3: 13 });
assert.equal(audit.editorialAndDifficultyOverlayOnly, true);

for (const question of GEO_RIV_001_CP008_REVIEW_BATCH_V4) {
  assert.equal(question.options.length, 4);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);
  assert.ok(question.sourceFactIds.length > 0);
  assert.ok(question.upstreamFactIds.length > 0);
  assert.equal(question.upstreamFactIds.some((id) => id.includes("cp006")), false);
  const learnerText = `${question.stem} ${question.options.join(" ")} ${question.explanation}`;
  assert.doesNotMatch(learnerText, /near near|has a estuary|has a delta|at near|associated with the source|matches the reviewed relation|listed among|joining relation|Therefore,/i);
}

const ql070 = GEO_RIV_001_CP008_REVIEW_BATCH_V4.filter((q) => q.qlId === "GEO-RIV-001-QL-070");
assert.equal(ql070.length, 6);
for (const question of ql070) {
  assert.match(question.explanation, /^The pair is incorrect\. /);
  assert.doesNotMatch(question.explanation, /—.* is incorrect\./);
}

const ql071 = GEO_RIV_001_CP008_REVIEW_BATCH_V4.filter((q) => q.qlId === "GEO-RIV-001-QL-071");
assert.equal(ql071.length, 6);
for (const question of ql071) assert.equal(question.difficulty, "Medium");

const hard = GEO_RIV_001_CP008_REVIEW_BATCH_V4.filter((q) => q.difficulty === "Hard");
assert.equal(hard.length, 6);
assert.ok(hard.every((q) => q.qlId === "GEO-RIV-001-QL-073"));

console.log(JSON.stringify(audit, null, 2));
