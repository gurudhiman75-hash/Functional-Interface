import assert from "node:assert/strict";

import { COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1 } from "./com002-english-human-review-integrity-v1";

assert.equal(
  COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.status,
  "BLOCKED_PENDING_EXPLICIT_PRODUCT_OWNER_APPROVAL",
);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.reviewPack.questionCount, 26);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.reviewPack.qlCount, 13);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.reviewPack.observedStatus, "REVIEW_REQUIRED");
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.automatedEvidence.englishAuditQuestionCount, 520);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.automatedEvidence.humanApprovalSubstitutableByAutomation, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.historicalFreezeRecord.operationallyValid, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.explicitApprovalVerified, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.operationalEnglishFreezeAllowed, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.localizationFreezePromotionAllowed, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.questionStudioActivationAllowed, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.lifecycle.questionStudioDiscoverable, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.lifecycle.reviewRunPersistenceAllowed, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.lifecycle.canonicalQuestionPersistenceAllowed, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.lifecycle.questionBankWritable, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.lifecycle.testEligible, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.lifecycle.mockTestEligible, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.lifecycle.publiclyPublishable, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.lifecycle.productionReleaseAuthorized, false);

console.log("[COM002-ENGLISH-HUMAN-REVIEW-INTEGRITY-V1] PASS failClosed=true");
