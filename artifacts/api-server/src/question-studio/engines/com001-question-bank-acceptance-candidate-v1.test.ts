import { strict as assert } from "node:assert";

import { getGeneratedItemApprovalDisposition } from "../../lib/admin-question-studio-approval-policy";
import {
  getGeneratedQuestionBankAcceptanceMode,
  getGeneratedQuestionBankEligibilityIssue,
} from "../../lib/admin-question-conversion";
import { COM001_QUESTION_STUDIO_REVIEW_DIFFICULTY_AUTHORITY_V1 } from "./com001-question-studio-review-difficulty-authority-v1";
import { COM001_QUESTION_STUDIO_REVIEW_INTEGRATION_AUTHORITY_V2 } from "./com001-question-studio-review-integration-v2";
import { COM001_QUESTION_BANK_ACCEPTANCE_CANDIDATE_AUTHORITY_V1 } from "./com001-question-bank-acceptance-candidate-v1";
import {
  COM001_REVIEW_ONLY_PACKAGE,
  knowledgeV1Com001QuestionStudioAdapter,
} from "./knowledge-v1-com001-adapter";

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

// Candidate authority must not silently mutate the registered live package.
assert.equal(COM001_REVIEW_ONLY_PACKAGE.runtimeMode, "review-only");
assert.equal(COM001_REVIEW_ONLY_PACKAGE.questionBankStatus, "NOT_STORED");
assert.equal(COM001_REVIEW_ONLY_PACKAGE.metadata?.questionBankWritable, false);
assert.equal(COM001_REVIEW_ONLY_PACKAGE.metadata?.canonicalQuestionPersistenceAllowed, false);
assert.equal(COM001_REVIEW_ONLY_PACKAGE.metadata?.testEligible, false);
assert.equal(COM001_REVIEW_ONLY_PACKAGE.publiclyPublishable, false);

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

let generatedProofs = 0;
for (const language of ["en", "hi", "pa"] as const) {
  const generated = await knowledgeV1Com001QuestionStudioAdapter.generate({
    engineId: "knowledge-v1",
    packageId: "COM-001",
    language,
    runtimeMode: "review-only",
    difficulty: "Mixed",
    count: 9,
    seed: `com001-bank-acceptance-candidate:${language}`,
  });
  assert.equal(generated.questions.length, 9);
  for (const rawQuestion of generated.questions) {
    const question = rawQuestion as Record<string, any>;
    generatedProofs += 1;
    assert.equal(question.questionBankStatus, "NOT_STORED");
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.automaticStudentPublication, false);
    assert.equal(question.questionStudioReview.productionDifficultyClaimAuthorized, false);
  }
}
assert.equal(generatedProofs, 27);

console.log("[COM001-QUESTION-BANK-ACCEPTANCE-CANDIDATE-V1]", {
  authorityId: authority.authorityId,
  status: authority.status,
  liveActivationAuthorized: authority.liveActivationAuthorized,
  dryRunQuestions: authority.readinessProof.auditedQuestionCount,
  generatedLiveLockProofs: generatedProofs,
  candidateAcceptanceMode: authority.candidateQuestionBankLifecycle.acceptanceMode,
  liveQuestionBankStatus: COM001_REVIEW_ONLY_PACKAGE.questionBankStatus,
  downstreamLifecycleLocked: true,
});
