import assert from "node:assert/strict";

import { COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3 } from "./com002-english-human-review-integrity-v3";

assert.equal(
  COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.status,
  "BLOCKED_PENDING_EXPLICIT_PRODUCT_OWNER_APPROVAL_OF_EXECUTED_V4_PACK",
);
assert.equal(
  COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.reviewPack.generatorVersion,
  "COM-002-ENGLISH-GENERATOR-V4-CANDIDATE-1",
);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.reviewPack.materializedPackAvailable, true);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.reviewPack.questionCount, 26);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.reviewPack.qlCount, 13);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.exactExecutedEvidence.workflowRunId, 33090114122);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.exactExecutedEvidence.workflowJobId, 98580358004);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.exactExecutedEvidence.conclusion, "SUCCESS");
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.exactExecutedEvidence.englishV4CorpusQuestions, 520);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.exactExecutedEvidence.englishV4SamplerQuestions, 26);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.exactExecutedEvidence.localizationV3ParityQuestions, 1040);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.exactExecutedEvidence.localizationV3SamplerQuestions, 26);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.exactExecutedEvidence.preBankCandidateQuestions, 390);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.v4EditorialRemediation.correctedCoreDescriptionCasesInCorpus, 6);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.automatedEvidence.v4ExecutedGreen, true);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.automatedEvidence.localizationV3ExecutedGreen, true);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.automatedEvidence.exactPackMaterialized, true);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.automatedEvidence.humanApprovalSubstitutableByAutomation, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.humanReview.explicitApprovalVerified, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.operationalEnglishFreezeAllowed, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.localizationFreezePromotionAllowed, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.questionStudioActivationAllowed, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.lifecycle.questionStudioDiscoverable, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.lifecycle.questionBankWritable, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.lifecycle.testEligible, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.lifecycle.mockTestEligible, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.lifecycle.publiclyPublishable, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.lifecycle.productionReleaseAuthorized, false);

console.log("[COM002-ENGLISH-HUMAN-REVIEW-INTEGRITY-V3] PASS executed=true materialized=true approval=false");
