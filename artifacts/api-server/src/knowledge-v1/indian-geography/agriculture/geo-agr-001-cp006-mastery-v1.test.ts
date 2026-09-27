import assert from "node:assert/strict";
import {
  GEO_AGR_001_CP006_MASTERY_V1,
  GEO_AGR_001_OWNING_POOL_V1,
  auditGeoAgr001Cp006MasteryV1,
  auditGeoAgr001ChapterClosureV1,
} from "./geo-agr-001-cp006-mastery-v1";

const mastery = auditGeoAgr001Cp006MasteryV1();
assert.equal(mastery.valid, true, mastery.issues.join("\n"));
assert.equal(mastery.questionCount, 108);
assert.equal(mastery.permanentQlCount, 108);
assert.equal(mastery.stemCount, 108);
assert.equal(mastery.explanationCount, 108);
assert.deepEqual(mastery.difficultyCounts, { Easy: 36, Medium: 60, Hard: 12 });
assert.deepEqual(mastery.answerPositions, [27, 27, 27, 27]);

for (let n = 1; n <= 108; n += 1) {
  const qlId = "GEO-AGR-001-QL-" + String(n).padStart(3, "0");
  assert.equal(mastery.qlCounts[qlId], 1);
}
for (const q of GEO_AGR_001_CP006_MASTERY_V1) {
  assert.equal(q.options[q.correctIndex], q.canonicalAnswer);
  assert.equal(new Set(q.options).size, 4);
  assert.equal(q.reviewOnly, true);
  assert.equal(q.runtimeRegistered, false);
}

const closure = auditGeoAgr001ChapterClosureV1();
assert.equal(closure.valid, true, closure.issues.join("\n"));
assert.equal(closure.owningQuestionCount, 648);
assert.equal(closure.permanentQlCount, 108);
assert.equal(closure.stemCount, 648);
assert.equal(closure.explanationCount, 648);
assert.deepEqual(closure.difficultyCounts, { Easy: 216, Medium: 360, Hard: 72 });
assert.deepEqual(closure.answerPositions, [168, 168, 156, 156]);
assert.equal(closure.runtimeRegistered, false);
assert.equal(GEO_AGR_001_OWNING_POOL_V1.length, 648);

for (let n = 1; n <= 108; n += 1) {
  const qlId = "GEO-AGR-001-QL-" + String(n).padStart(3, "0");
  assert.equal(closure.qlCounts[qlId], 6);
}

console.log(JSON.stringify({ mastery, closure }, null, 2));
