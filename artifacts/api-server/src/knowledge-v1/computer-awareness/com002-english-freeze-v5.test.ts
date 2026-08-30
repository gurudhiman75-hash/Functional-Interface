import assert from "node:assert/strict";

import {
  COM002_ENGLISH_FREEZE_AUTHORITY_V5,
  auditCom002EnglishFreezeV5,
} from "./com002-english-freeze-v5";

const audit = auditCom002EnglishFreezeV5();

assert.equal(audit.valid, true, audit.issues.join(" | "));
assert.deepEqual(audit.issues, []);
assert.equal(audit.candidateAudit.promotable, true);
assert.equal(COM002_ENGLISH_FREEZE_AUTHORITY_V5.status, "ENGLISH_V5_EXPLICITLY_APPROVED_EXECUTED_PINNED_FROZEN");
assert.equal(COM002_ENGLISH_FREEZE_AUTHORITY_V5.humanReview.status, "APPROVED");
assert.equal(COM002_ENGLISH_FREEZE_AUTHORITY_V5.humanReview.approvalBindingCommentId, 5447757851);
assert.equal(
  COM002_ENGLISH_FREEZE_AUTHORITY_V5.humanReview.exactApprovedBrowserPackFingerprint,
  "afbfa579bb22ca0e8a7663bf58c16bef4fc33aab7fec957d04b6082bc00d1ef7",
);
assert.equal(COM002_ENGLISH_FREEZE_AUTHORITY_V5.canonicalExecution.workflowRunNumber, 502);
assert.equal(COM002_ENGLISH_FREEZE_AUTHORITY_V5.canonicalExecution.workflowRunId, 33136710464);
assert.equal(COM002_ENGLISH_FREEZE_AUTHORITY_V5.canonicalExecution.workflowJobId, 98738191160);
assert.equal(COM002_ENGLISH_FREEZE_AUTHORITY_V5.canonicalExecution.englishCorpusQuestions, 520);
assert.equal(COM002_ENGLISH_FREEZE_AUTHORITY_V5.canonicalExecution.exactApprovedReviewQuestions, 26);
assert.equal(COM002_ENGLISH_FREEZE_AUTHORITY_V5.lifecycle.englishV5AuthorityFrozen, true);
assert.equal(COM002_ENGLISH_FREEZE_AUTHORITY_V5.lifecycle.v5BoundLocalizationCandidateDevelopmentAllowed, true);
assert.equal(COM002_ENGLISH_FREEZE_AUTHORITY_V5.lifecycle.hindiPunjabiV5BoundLocalizationFrozen, false);
assert.equal(COM002_ENGLISH_FREEZE_AUTHORITY_V5.lifecycle.questionStudioActive, false);
assert.equal(COM002_ENGLISH_FREEZE_AUTHORITY_V5.lifecycle.canonicalQuestionPersistenceAllowed, false);
assert.equal(COM002_ENGLISH_FREEZE_AUTHORITY_V5.lifecycle.questionBankWritable, false);
assert.equal(COM002_ENGLISH_FREEZE_AUTHORITY_V5.lifecycle.testEligible, false);
assert.equal(COM002_ENGLISH_FREEZE_AUTHORITY_V5.lifecycle.mockTestEligible, false);
assert.equal(COM002_ENGLISH_FREEZE_AUTHORITY_V5.lifecycle.publiclyPublishable, false);
assert.equal(COM002_ENGLISH_FREEZE_AUTHORITY_V5.lifecycle.productionReleaseAuthorized, false);

console.log(
  `[COM002-ENGLISH-FREEZE-V5] PASS frozen=${COM002_ENGLISH_FREEZE_AUTHORITY_V5.lifecycle.englishV5AuthorityFrozen} run=${COM002_ENGLISH_FREEZE_AUTHORITY_V5.canonicalExecution.workflowRunNumber}`,
);
