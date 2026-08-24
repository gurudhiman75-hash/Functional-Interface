import { strict as assert } from "node:assert";

import { getGeneratedItemApprovalDisposition } from "../../lib/admin-question-studio-approval-policy";
import {
  getGeneratedQuestionBankAcceptanceMode,
  getGeneratedQuestionBankEligibilityIssue,
} from "../../lib/admin-question-conversion";
import { COM001_QUESTION_STUDIO_REVIEW_DIFFICULTY_AUTHORITY_V1 } from "./com001-question-studio-review-difficulty-authority-v1";
import { COM001_QUESTION_STUDIO_REVIEW_INTEGRATION_AUTHORITY_V2 } from "./com001-question-studio-review-integration-v2";
import { COM001_QUESTION_BANK_ACCEPTANCE_CANDIDATE_AUTHORITY_V1 } from "./com001-question-bank-acceptance-candidate-v1";

const authority = COM001_QUESTION_BANK_ACCEPTANCE_CANDIDATE_AUTHORITY_V1;

assert.equal(authority.status, "BANK_ONLY_ACCEPTANCE_CANDIDATE_PROVEN_NOT_ACTIVATED");
assert.equal(authority.liveActivationAuthorized, false);
assert.equal(authority.productionReleaseAuthorized, false);
assert.equal(authority.packageId, "COM-001");
assert.equal(authority.engineId, "knowledge-v1");
assert.equal(authority.readinessProof.auditedQuestionCount, 270);
assert.equal(authority.readinessProof.permanentQlCount, 9);
assert.deepEqual(authority.readinessProof.languages, ["en", "hi", "pa"]);
assert.equal(authority.readinessProof.normalizedProvenanceFieldCount, 13);
assert.equal(authority.readinessProof.missingNormalizedProvenanceFieldCount, 0);
assert.equal(authority.readinessProof.existingApprovedBankOnlyPathRegressionFree, true);
assert.equal(
  authority.authorityChain.reviewIntegrationAuthorityId,
  COM001_QUESTION_STUDIO_REVIEW_INTEGRATION_AUTHORITY_V2.authorityId,
);
assert.equal(
  authority.authorityChain.reviewDifficultyAuthorityId,
  COM001_QUESTION_STUDIO_REVIEW_DIFFICULTY_AUTHORITY_V1.authorityId,
);

assert.equal(authority.candidateQuestionBankLifecycle.statusBeforeAcceptance, "READY_FOR_STORAGE");
assert.equal(authority.candidateQuestionBankLifecycle.writable, true);
assert.equal(authority.candidateQuestionBankLifecycle.acceptanceMode, "BANK_ONLY");
assert.equal(authority.candidateQuestionBankLifecycle.manualGenerationApprovalRequired, true);
assert.equal(authority.downstreamLifecycleMustRemainLocked.testEligible, false);
assert.equal(authority.downstreamLifecycleMustRemainLocked.mockTestEligible, false);
assert.equal(authority.downstreamLifecycleMustRemainLocked.publiclyPublishable, false);
assert.equal(authority.downstreamLifecycleMustRemainLocked.automaticStudentPublication, false);
assert.equal(authority.downstreamLifecycleMustRemainLocked.productionDifficultyClaimsAuthorized, false);
assert.equal(authority.downstreamLifecycleMustRemainLocked.productionReleaseAuthorized, false);

// Historical pre-activation package state remains frozen in the candidate authority.
assert.deepEqual(authority.livePackageBeforeActivation, {
  runtimeMode: "review-only",
  questionBankStatus: "NOT_STORED",
  questionBankWritable: false,
  canonicalQuestionPersistenceAllowed: false,
});

const bankOnlyLifecycle = {
  questionBankStatus: "READY_FOR_STORAGE",
  questionBankWritable: true,
  questionBankAcceptanceMode: "BANK_ONLY",
  questionBankAcceptanceAuthority: authority.authorityId,
  testEligibility: "INELIGIBLE",
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
};
assert.equal(getGeneratedQuestionBankAcceptanceMode(bankOnlyLifecycle), "BANK_ONLY");
assert.equal(getGeneratedQuestionBankEligibilityIssue(bankOnlyLifecycle), null);
assert.deepEqual(getGeneratedItemApprovalDisposition(bankOnlyLifecycle), {
  mode: "question_bank",
  reason: null,
});

console.log("[COM001-QUESTION-BANK-ACCEPTANCE-CANDIDATE-V1]", {
  authorityId: authority.authorityId,
  status: authority.status,
  liveActivationAuthorized: authority.liveActivationAuthorized,
  dryRunQuestions: authority.readinessProof.auditedQuestionCount,
  candidateAcceptanceMode: authority.candidateQuestionBankLifecycle.acceptanceMode,
  historicalPreActivationBankStatus: authority.livePackageBeforeActivation.questionBankStatus,
  downstreamLifecycleLocked: true,
});
