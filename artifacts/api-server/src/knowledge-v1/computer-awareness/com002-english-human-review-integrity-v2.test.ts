import assert from "node:assert/strict";

import { COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2 } from "./com002-english-human-review-integrity-v2";

assert.equal(
  COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.status,
  "BLOCKED_PENDING_EXPLICIT_PRODUCT_OWNER_APPROVAL_OF_EXECUTED_V3_PACK",
);
assert.equal(
  COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.reviewPack.generatorVersion,
  "COM-002-ENGLISH-GENERATOR-V3-CANDIDATE-1",
);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.reviewPack.materializedPackAvailable, true);
assert.equal(
  COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.reviewPack.observedStatus,
  "EXECUTED_GREEN_AWAITING_EXPLICIT_APPROVAL",
);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.reviewPack.questionCount, 26);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.reviewPack.qlCount, 13);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.exactExecutedEvidence.workflowRunId, 33053333684);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.exactExecutedEvidence.workflowJobId, 98453914630);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.exactExecutedEvidence.conclusion, "SUCCESS");
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.exactExecutedEvidence.englishV3CorpusQuestions, 520);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.exactExecutedEvidence.englishV3SamplerQuestions, 26);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.exactExecutedEvidence.localizationV2ParityQuestions, 1040);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.exactExecutedEvidence.preBankCandidateQuestions, 390);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.automatedEvidence.v3ExecutedGreen, true);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.automatedEvidence.exactPackMaterialized, true);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.automatedEvidence.humanApprovalSubstitutableByAutomation, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.humanReview.explicitApprovalVerified, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.operationalEnglishFreezeAllowed, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.localizationFreezePromotionAllowed, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.questionStudioActivationAllowed, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.lifecycle.questionStudioDiscoverable, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.lifecycle.questionBankWritable, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.lifecycle.testEligible, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.lifecycle.mockTestEligible, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.lifecycle.publiclyPublishable, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.lifecycle.productionReleaseAuthorized, false);

console.log("[COM002-ENGLISH-HUMAN-REVIEW-INTEGRITY-V2] PASS executed=true materialized=true approval=false");
