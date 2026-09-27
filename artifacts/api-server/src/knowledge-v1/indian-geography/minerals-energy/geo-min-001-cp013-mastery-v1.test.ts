import assert from "node:assert/strict";
import {
  GEO_MIN_001_CP013_MASTERY_V1,
  auditGeoMin001Cp013MasteryV1,
  auditGeoMin001ChapterClosureV1,
} from "./geo-min-001-cp013-mastery-v1";
import { GEO_MIN_001_OWNING_POOL_V1 } from "./geo-min-001-owning-pool-v1";

const mastery = auditGeoMin001Cp013MasteryV1();
assert.equal(mastery.valid, true, mastery.issues.join("\n"));
assert.equal(mastery.questionCount, 122);
assert.equal(mastery.permanentQlCount, 122);
assert.equal(mastery.stemCount, 122);
assert.equal(mastery.explanationCount, 122);
assert.equal(mastery.answerPositions.reduce((a,b)=>a+b,0), 122);

for (const q of GEO_MIN_001_CP013_MASTERY_V1) {
  assert.equal(q.options.length, 4);
  assert.equal(new Set(q.options).size, 4);
  assert.equal(q.options[q.correctIndex], q.canonicalAnswer);
  assert.equal(q.reviewOnly, true);
  assert.equal(q.runtimeRegistered, false);
}

const closure = auditGeoMin001ChapterClosureV1();
assert.equal(closure.valid, true, closure.issues.join("\n"));
assert.equal(closure.owningQuestionCount, 732);
assert.equal(closure.permanentQlCount, 122);
assert.equal(closure.stemCount, 732);
assert.equal(closure.explanationCount, 732);
assert.equal(closure.runtimeRegistered, false);
assert.equal(GEO_MIN_001_OWNING_POOL_V1.length, 732);

console.log(JSON.stringify({ mastery, closure }, null, 2));
