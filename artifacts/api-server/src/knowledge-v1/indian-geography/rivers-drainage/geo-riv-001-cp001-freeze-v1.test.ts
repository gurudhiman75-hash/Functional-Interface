import { strict as assert } from "node:assert";

import {
  GEO_RIV_001_CP001_FREEZE_AUTHORITY_V1,
  GEO_RIV_001_CP001_FROZEN_QUESTIONS_V1,
} from "./geo-riv-001-cp001-freeze-v1";

const authority = GEO_RIV_001_CP001_FREEZE_AUTHORITY_V1;
const questions = GEO_RIV_001_CP001_FROZEN_QUESTIONS_V1;

assert.equal(authority.approval.status, "APPROVED");
assert.equal(authority.approval.wordingStandard, "SIMPLE_EXAM_LIKE");
assert.equal(authority.lifecycle.runtimeStage, "REVIEW_ONLY");
assert.equal(authority.lifecycle.questionBankWritable, false);
assert.equal(authority.lifecycle.testEligible, false);
assert.equal(authority.lifecycle.mockTestEligible, false);
assert.equal(authority.lifecycle.publiclyPublishable, false);
assert.equal(authority.corpus.questionCount, 54);
assert.equal(authority.corpus.qlCount, 9);
assert.equal(authority.corpus.editorialSemanticUniqueCount, 54);
assert.equal(authority.corpus.difficultyCounts.Easy, 16);
assert.equal(authority.corpus.difficultyCounts.Medium, 32);
assert.equal(authority.corpus.difficultyCounts.Hard, 6);

assert.equal(questions.length, 54);
assert.equal(new Set(questions.map((question) => question.questionId)).size, 54);
assert.equal(new Set(questions.map((question) => question.qlId)).size, 9);
assert.equal(questions.every((question) => question.authoringReviewApproved), true);
assert.equal(questions.every((question) => question.immutableCorpus), true);
assert.equal(
  questions.every(
    (question) => question.freezeAuthorityId === authority.authorityId,
  ),
  true,
);
assert.equal(
  questions.every((question) => question.options[question.correctIndex] === question.canonicalAnswer),
  true,
);
