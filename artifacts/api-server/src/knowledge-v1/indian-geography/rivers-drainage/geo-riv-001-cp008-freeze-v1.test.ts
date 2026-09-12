import assert from "node:assert/strict";
import {
  GEO_RIV_001_CP008_FREEZE_AUTHORITY_V1,
  GEO_RIV_001_CP008_FROZEN_QUESTIONS_V1,
} from "./geo-riv-001-cp008-freeze-v1";

const authority = GEO_RIV_001_CP008_FREEZE_AUTHORITY_V1;
const questions = GEO_RIV_001_CP008_FROZEN_QUESTIONS_V1;

assert.equal(authority.authorityId, "GEO-RIV-001-CP008-ENGLISH-FREEZE-V1");
assert.equal(authority.approval.status, "APPROVED");
assert.equal(authority.approval.mode, "EXPLICIT_HUMAN_EDITORIAL_APPROVAL");
assert.equal(authority.approval.language, "en");
assert.equal(authority.approval.visualPolicy, "OPTIONAL_MANUAL_EDITORIAL_ATTACHMENT");
assert.equal(authority.lifecycle.runtimeStage, "REVIEW_ONLY");
assert.equal(authority.lifecycle.readOnly, true);
assert.equal(authority.lifecycle.questionBankWritable, false);
assert.equal(authority.lifecycle.testEligible, false);
assert.equal(authority.lifecycle.mockTestEligible, false);
assert.equal(authority.lifecycle.publiclyPublishable, false);
assert.equal(authority.lifecycle.productionReleaseAuthorized, false);
assert.equal(authority.corpus.cp006HeldOutAtFreeze, true);
assert.equal(authority.corpus.questionCount, 54);
assert.equal(authority.corpus.qlCount, 9);
assert.deepEqual(authority.corpus.difficultyCounts, { Easy: 18, Medium: 30, Hard: 6 });
assert.equal(authority.corpus.semanticUniqueCount, 54);
assert.equal(questions.length, 54);

const qlIds = new Set(questions.map((question) => question.qlId));
assert.deepEqual(
  [...qlIds].sort(),
  Array.from({ length: 9 }, (_, index) => `GEO-RIV-001-QL-${String(65 + index).padStart(3, "0")}`),
);

for (const question of questions) {
  assert.equal(question.cpId, "GEO-RIV-001-CP008");
  assert.equal(question.freezeAuthorityId, authority.authorityId);
  assert.equal(question.authoringReviewApproved, true);
  assert.equal(question.immutableCorpus, true);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);
  assert.equal(Object.isFrozen(question), true);
  assert.equal(Object.isFrozen(question.options), true);
  assert.equal(Object.isFrozen(question.sourceIds), true);
  assert.equal(Object.isFrozen(question.sourceFactIds), true);
  assert.equal(Object.isFrozen(question.upstreamFactIds), true);
  assert.equal(question.options.length, 4);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
  assert.ok(question.sourceIds.length > 0);
  assert.ok(question.sourceFactIds.length > 0);
  assert.ok(question.upstreamFactIds.length > 0);
  assert.ok(!question.upstreamFactIds.some((id) => id.includes("cp006")));
}

console.log(JSON.stringify({
  valid: true,
  authorityId: authority.authorityId,
  questionCount: questions.length,
  qlCount: qlIds.size,
  difficultyCounts: authority.corpus.difficultyCounts,
}, null, 2));
