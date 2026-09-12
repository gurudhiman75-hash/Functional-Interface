import { strict as assert } from "node:assert";
import { GEO_RIV_001_CP009_REVIEW_BATCH_V2, auditGeoRiv001Cp009ReviewBatchV2 } from "./geo-riv-001-cp009-review-batch-v2";

const audit = auditGeoRiv001Cp009ReviewBatchV2();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.questionCount, 54);
assert.equal(audit.semanticUniqueCount, 54);
assert.deepEqual(audit.difficultyCounts, { Easy: 18, Medium: 30, Hard: 6 });
assert.deepEqual(audit.answerPositions, { 0: 14, 1: 14, 2: 13, 3: 13 });
assert.equal(audit.sourceRiverCount, 6);
assert.equal(audit.reverseStateCount, 6);
assert.equal(audit.correctPairTargetCount, 6);
assert.equal(audit.incorrectPairTargetCount, 6);
assert.equal(new Set(audit.representedCoreRivers).size, 9);

for (let ql = 74; ql <= 82; ql += 1) {
  const id = `GEO-RIV-001-QL-${String(ql).padStart(3, "0")}`;
  assert.equal(audit.qlCounts[id], 6);
}

for (const question of GEO_RIV_001_CP009_REVIEW_BATCH_V2) {
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);
  assert.ok(question.sourceIds.length > 0);
  assert.ok(question.sourceFactIds.length > 0);
  const learnerText = `${question.stem} ${question.options.join(" ")} ${question.explanation}`;
  assert.doesNotMatch(learnerText, /state set|reviewed Indian course|associated with|linked with|matches the reviewed relation|Correct fact:|The pair is incorrect\.|exam trap|shortcut|Therefore,/i);
}

const hard = GEO_RIV_001_CP009_REVIEW_BATCH_V2.filter((question) => question.difficulty === "Hard");
assert.equal(hard.length, 6);
assert.ok(hard.every((question) => question.qlId === "GEO-RIV-001-QL-082"));

console.log(JSON.stringify(audit, null, 2));
