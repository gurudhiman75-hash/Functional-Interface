import assert from "node:assert/strict";

import { COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1 } from "./com002-english-human-review-integrity-v1";

assert.equal(
  COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.status,
  "BLOCKED_PENDING_V3_REVIEW_PACK_EXECUTION_AND_EXPLICIT_APPROVAL",
);
assert.equal(
  COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.reviewCandidate.generatorVersion,
  "COM-002-ENGLISH-GENERATOR-V3-CANDIDATE-1",
);
assert.equal(
  COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.reviewCandidate.samplerTestPath,
  "artifacts/api-server/src/knowledge-v1/computer-awareness/com002-human-review-wave1-v3.test.ts",
);
assert.equal(
  COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.reviewCandidate.intendedPackTitle,
  "COM-002-HUMAN-REVIEW-WAVE-1-V3.md",
);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.reviewCandidate.questionCount, 26);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.reviewCandidate.qlCount, 13);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.reviewCandidate.questionsPerQl, 2);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.reviewCandidate.materializedPackAvailable, false);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.reviewCandidate.observedStatus, "AWAITING_EXECUTED_V3_SAMPLER");
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.v3SafetyRemediation.ql004KernelCoreProvenanceRebound, true);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.v3SafetyRemediation.ql004PrincipalRoleAmbiguityReduced, true);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.v3SafetyRemediation.ql013HierarchicalClassificationFalseSwapRemoved, true);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.v3SafetyRemediation.ql013SafeRelationFamiliesOnly, true);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.automatedEvidence.v3AuditDefined, true);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.automatedEvidence.v3SamplerDefined, true);
assert.equal(COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.automatedEvidence.v3ExecutedGreen, false);
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

console.log("[COM002-ENGLISH-HUMAN-REVIEW-INTEGRITY-V1] PASS failClosed=true candidate=V3");
