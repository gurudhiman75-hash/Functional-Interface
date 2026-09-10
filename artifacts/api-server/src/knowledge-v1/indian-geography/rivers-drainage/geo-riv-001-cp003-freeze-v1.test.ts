import { strict as assert } from "node:assert";

import {
  GEO_RIV_001_CP003_FREEZE_AUTHORITY_V1,
  GEO_RIV_001_CP003_FROZEN_QUESTIONS_V1,
} from "./geo-riv-001-cp003-freeze-v1";

const authority = GEO_RIV_001_CP003_FREEZE_AUTHORITY_V1;
assert.equal(authority.authorityId, "GEO-RIV-001-CP003-ENGLISH-FREEZE-V1");
assert.equal(authority.cpId, "GEO-RIV-001-CP003");
assert.equal(authority.approval.status, "APPROVED");
assert.equal(authority.approval.mode, "EXPLICIT_HUMAN_EDITORIAL_APPROVAL");
assert.equal(authority.approval.language, "en");
assert.equal(authority.approval.wordingStandard, "SIMPLE_EXAM_LIKE");
assert.equal(authority.approval.visualPolicy, "OPTIONAL_MANUAL_EDITORIAL_ATTACHMENT");
assert.equal(authority.corpus.questionCount, 54);
assert.equal(authority.corpus.qlCount, 9);
assert.deepEqual(authority.corpus.difficultyCounts, { Easy: 11, Medium: 34, Hard: 9 });
assert.equal(authority.corpus.semanticUniqueCount, 54);
assert.equal(authority.lifecycle.runtimeStage, "REVIEW_ONLY");
assert.equal(authority.lifecycle.readOnly, true);
assert.equal(authority.lifecycle.questionBankWritable, false);
assert.equal(authority.lifecycle.testEligible, false);
assert.equal(authority.lifecycle.mockTestEligible, false);
assert.equal(authority.lifecycle.publiclyPublishable, false);
assert.equal(authority.lifecycle.productionReleaseAuthorized, false);

assert.equal(GEO_RIV_001_CP003_FROZEN_QUESTIONS_V1.length, 54);
assert.equal(new Set(GEO_RIV_001_CP003_FROZEN_QUESTIONS_V1.map((q) => q.questionId)).size, 54);
assert.equal(new Set(GEO_RIV_001_CP003_FROZEN_QUESTIONS_V1.map((q) => q.qlId)).size, 9);
for (const question of GEO_RIV_001_CP003_FROZEN_QUESTIONS_V1) {
  assert.equal(question.freezeAuthorityId, authority.authorityId);
  assert.equal(question.authoringReviewApproved, true);
  assert.equal(question.immutableCorpus, true);
  assert.equal(Object.isFrozen(question), true);
  assert.equal(Object.isFrozen(question.options), true);
  assert.equal(Object.isFrozen(question.sourceIds), true);
  assert.equal(Object.isFrozen(question.sourceFactIds), true);
}
