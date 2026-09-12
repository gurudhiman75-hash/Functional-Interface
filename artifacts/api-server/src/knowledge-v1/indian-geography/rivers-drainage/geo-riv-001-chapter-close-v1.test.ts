import assert from "node:assert/strict";
import { GEO_RIV_001_CP001_FROZEN_QUESTIONS_V1 } from "./geo-riv-001-cp001-freeze-v1";
import { GEO_RIV_001_CP002_FROZEN_QUESTIONS_V1 } from "./geo-riv-001-cp002-freeze-v1";
import { GEO_RIV_001_CP003_FROZEN_QUESTIONS_V1 } from "./geo-riv-001-cp003-freeze-v1";
import { GEO_RIV_001_CP004_FROZEN_QUESTIONS_V1 } from "./geo-riv-001-cp004-freeze-v1";
import { GEO_RIV_001_CP005_FROZEN_QUESTIONS_V1 } from "./geo-riv-001-cp005-freeze-v1";
import { GEO_RIV_001_CP008_FROZEN_QUESTIONS_V1 } from "./geo-riv-001-cp008-freeze-v1";
import {
  GEO_RIV_001_CHAPTER_CLOSE_AUTHORITY_V1,
  GEO_RIV_001_LATE_SEMANTIC_FREEZE_AUTHORITIES_V1,
  GEO_RIV_001_CP006_FROZEN_QUESTIONS_V1,
  GEO_RIV_001_CP007_FROZEN_QUESTIONS_V1,
  GEO_RIV_001_CP009_FROZEN_QUESTIONS_V1,
  GEO_RIV_001_CP010_FROZEN_QUESTIONS_V1,
  GEO_RIV_001_CP011_FROZEN_QUESTIONS_V1,
  GEO_RIV_001_CP012_FROZEN_QUESTIONS_V1,
  GEO_RIV_001_CP013_FROZEN_QUESTIONS_V1,
  GEO_RIV_001_CP014_FROZEN_QUESTIONS_V1,
  GEO_RIV_001_CP015_MASTERY_FREEZE_AUTHORITY_V1,
  GEO_RIV_001_CP015_MASTERY_FROZEN_QUESTIONS_V1,
} from "./geo-riv-001-chapter-close-v1";

const semanticQuestions = [
  ...GEO_RIV_001_CP001_FROZEN_QUESTIONS_V1,
  ...GEO_RIV_001_CP002_FROZEN_QUESTIONS_V1,
  ...GEO_RIV_001_CP003_FROZEN_QUESTIONS_V1,
  ...GEO_RIV_001_CP004_FROZEN_QUESTIONS_V1,
  ...GEO_RIV_001_CP005_FROZEN_QUESTIONS_V1,
  ...GEO_RIV_001_CP006_FROZEN_QUESTIONS_V1,
  ...GEO_RIV_001_CP007_FROZEN_QUESTIONS_V1,
  ...GEO_RIV_001_CP008_FROZEN_QUESTIONS_V1,
  ...GEO_RIV_001_CP009_FROZEN_QUESTIONS_V1,
  ...GEO_RIV_001_CP010_FROZEN_QUESTIONS_V1,
  ...GEO_RIV_001_CP011_FROZEN_QUESTIONS_V1,
  ...GEO_RIV_001_CP012_FROZEN_QUESTIONS_V1,
  ...GEO_RIV_001_CP013_FROZEN_QUESTIONS_V1,
  ...GEO_RIV_001_CP014_FROZEN_QUESTIONS_V1,
];

assert.equal(GEO_RIV_001_CHAPTER_CLOSE_AUTHORITY_V1.semanticCpCount, 14);
assert.equal(GEO_RIV_001_CHAPTER_CLOSE_AUTHORITY_V1.permanentQlCount, 127);
assert.equal(GEO_RIV_001_CHAPTER_CLOSE_AUTHORITY_V1.masteryQuestionCount, 60);
assert.equal(GEO_RIV_001_CHAPTER_CLOSE_AUTHORITY_V1.questionStudioPolicy, "CP001-CP014_SEMANTIC_FREEZES_ONLY");
assert.equal(GEO_RIV_001_CHAPTER_CLOSE_AUTHORITY_V1.lifecycle.runtimeStage, "REVIEW_ONLY");
assert.equal(GEO_RIV_001_CHAPTER_CLOSE_AUTHORITY_V1.lifecycle.questionBankWritable, false);
assert.equal(GEO_RIV_001_CHAPTER_CLOSE_AUTHORITY_V1.lifecycle.testEligible, false);
assert.equal(GEO_RIV_001_CHAPTER_CLOSE_AUTHORITY_V1.lifecycle.mockTestEligible, false);

assert.equal(GEO_RIV_001_LATE_SEMANTIC_FREEZE_AUTHORITIES_V1.length, 8);
for (const authority of GEO_RIV_001_LATE_SEMANTIC_FREEZE_AUTHORITIES_V1) {
  assert.equal(authority.approval.status, "APPROVED");
  assert.equal(authority.approval.mode, "EXPLICIT_HUMAN_EDITORIAL_APPROVAL");
  assert.equal(authority.lifecycle.runtimeStage, "REVIEW_ONLY");
  assert.equal(authority.lifecycle.questionBankWritable, false);
  assert.equal(authority.lifecycle.testEligible, false);
  assert.equal(authority.lifecycle.mockTestEligible, false);
  assert.match(authority.authorityId, /^GEO-RIV-001-CP(?:006|007|009|010|011|012|013|014)-ENGLISH-FREEZE-V1$/);
}

assert.equal(semanticQuestions.length, 762);
assert.equal(new Set(semanticQuestions.map((question) => question.questionId)).size, 762);
assert.equal(new Set(semanticQuestions.map((question) => question.qlId)).size, 127);
assert.equal(new Set(semanticQuestions.map((question) => question.cpId)).size, 14);

for (const question of semanticQuestions) {
  assert.equal(question.authoringReviewApproved, true);
  assert.equal(question.immutableCorpus, true);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);
  assert.equal(Object.isFrozen(question), true);
  assert.equal(Object.isFrozen(question.options), true);
  assert.equal(Object.isFrozen(question.sourceIds), true);
  assert.equal(Object.isFrozen(question.sourceFactIds), true);
  assert.equal(question.options.length, 4);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
  assert.ok(question.sourceIds.length > 0);
  assert.ok(question.sourceFactIds.length > 0);
}

assert.equal(GEO_RIV_001_CP015_MASTERY_FREEZE_AUTHORITY_V1.role, "CHAPTER_MASTERY_PROOF");
assert.equal(GEO_RIV_001_CP015_MASTERY_FREEZE_AUTHORITY_V1.permanentQlOwner, false);
assert.equal(GEO_RIV_001_CP015_MASTERY_FREEZE_AUTHORITY_V1.lifecycle.questionStudioDiscoverable, false);
assert.equal(GEO_RIV_001_CP015_MASTERY_FREEZE_AUTHORITY_V1.lifecycle.questionStudioGenerationEnabled, false);
assert.equal(GEO_RIV_001_CP015_MASTERY_FROZEN_QUESTIONS_V1.length, 60);
assert.equal(new Set(GEO_RIV_001_CP015_MASTERY_FROZEN_QUESTIONS_V1.map((question) => question.qlId)).size, 60);
assert.equal(new Set(GEO_RIV_001_CP015_MASTERY_FROZEN_QUESTIONS_V1.map((question) => question.sourceCpId)).size, 14);

console.log(JSON.stringify({
  valid: true,
  chapterCloseAuthorityId: GEO_RIV_001_CHAPTER_CLOSE_AUTHORITY_V1.authorityId,
  semanticCpCount: new Set(semanticQuestions.map((question) => question.cpId)).size,
  permanentQlCount: new Set(semanticQuestions.map((question) => question.qlId)).size,
  semanticQuestionCount: semanticQuestions.length,
  masteryQuestionCount: GEO_RIV_001_CP015_MASTERY_FROZEN_QUESTIONS_V1.length,
}, null, 2));
