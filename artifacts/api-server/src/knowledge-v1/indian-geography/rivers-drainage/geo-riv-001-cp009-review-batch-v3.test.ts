import { strict as assert } from "node:assert";
import { GEO_RIV_001_CP009_REVIEW_BATCH_V2 } from "./geo-riv-001-cp009-review-batch-v2";
import { GEO_RIV_001_CP009_REVIEW_BATCH_V3, auditGeoRiv001Cp009ReviewBatchV3 } from "./geo-riv-001-cp009-review-batch-v3";
import { GEO_RIV_001_CP009_REVIEW_SCOPE_V1, auditGeoRiv001Cp009ScopeV1 } from "./geo-riv-001-cp009-scope";

const scopeAudit = auditGeoRiv001Cp009ScopeV1();
assert.equal(scopeAudit.valid, true, scopeAudit.issues.join("\n"));
assert.equal(scopeAudit.courseFactCount, 25);
assert.equal(scopeAudit.uniqueCoursePairCount, 25);
assert.equal(scopeAudit.riverCount, 9);
assert.equal(scopeAudit.stateCount, 15);
assert.equal(GEO_RIV_001_CP009_REVIEW_SCOPE_V1.closedWorldForIncludedRiverCourseQuestions, true);
assert.equal(GEO_RIV_001_CP009_REVIEW_SCOPE_V1.completeForIncludedRiversMainCourseInIndia, true);
assert.equal(GEO_RIV_001_CP009_REVIEW_SCOPE_V1.universalGeographyCompletenessClaim, false);
assert.equal(GEO_RIV_001_CP009_REVIEW_SCOPE_V1.excludedRelation, "drains_state");
assert.equal(GEO_RIV_001_CP009_REVIEW_SCOPE_V1.basinStateConflationForbidden, true);

const audit = auditGeoRiv001Cp009ReviewBatchV3();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.baselineAuditValid, true);
assert.equal(audit.answerMatrixPreserved, true);
assert.equal(audit.questionCount, 54);
assert.deepEqual(audit.difficultyCounts, { Easy: 18, Medium: 30, Hard: 6 });
assert.deepEqual(audit.answerPositions, { 0: 14, 1: 14, 2: 13, 3: 13 });

for (let ql = 74; ql <= 82; ql += 1) {
  const id = `GEO-RIV-001-QL-${String(ql).padStart(3, "0")}`;
  assert.equal(audit.qlCounts[id], 6);
}

GEO_RIV_001_CP009_REVIEW_BATCH_V3.forEach((question, index) => {
  const v2 = GEO_RIV_001_CP009_REVIEW_BATCH_V2[index];
  assert.equal(question.stem, v2.stem);
  assert.deepEqual(question.options, v2.options);
  assert.equal(question.correctIndex, v2.correctIndex);
  assert.equal(question.canonicalAnswer, v2.canonicalAnswer);
  assert.equal(question.difficulty, v2.difficulty);
  assert.equal(question.solverAuthority, v2.solverAuthority);
  assert.deepEqual(question.sourceIds, v2.sourceIds);
  assert.deepEqual(question.sourceFactIds, v2.sourceFactIds);
  assert.deepEqual(question.upstreamFactIds, v2.upstreamFactIds);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);
  assert.ok(question.explanation.length >= 95);
  assert.doesNotMatch(question.explanation, /CP009|V[123]|reviewed|sourceFact|state set|associated with|linked with|exam trap|shortcut|Therefore,/i);
});

console.log(JSON.stringify(audit, null, 2));
