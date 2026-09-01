import { strict as assert } from "node:assert";

import { COM003_QUESTION_STUDIO_REVIEW_ONLY_FREEZE_V1 as freeze } from "./com003-question-studio-review-only-freeze-v1.ts";

assert.equal(freeze.authorityId, "COM-003-QUESTION-STUDIO-REVIEW-ONLY-FREEZE-V1");
assert.equal(freeze.packageId, "COM-003");
assert.equal(freeze.validatedHeadSha, "9475e3def9c17d2bd4635e09e1068cf4d49de7b5");
assert.equal(freeze.validation.workflow, "COM-003 Review Synthesis One-Off");
assert.equal(freeze.validation.runId, 33464545614);
assert.equal(freeze.validation.jobId, 99721580146);
assert.equal(freeze.validation.conclusion, "success");
assert.equal(freeze.validation.apiBuild, true);
assert.equal(freeze.validation.adminBuild, true);
assert.equal(freeze.validation.questionStudioGateChainPassed, true);
assert.equal(freeze.validation.reviewOnlyAdapterPassed, true);
assert.equal(freeze.validation.reviewOnlyRegistryPassed, true);
assert.equal(freeze.validation.reviewOnlyRouteContractPassed, true);
assert.equal(freeze.validation.sourceControlledReviewContractPassed, true);
assert.equal(freeze.validation.approvalNoConversionContractPassed, true);
assert.equal(freeze.validation.regenerationLockContractPassed, true);

assert.equal(freeze.corpus.permanentQlCount, 19);
assert.equal(freeze.corpus.canonicalCpCount, 4);
assert.equal(freeze.corpus.englishQuestions, 228);
assert.equal(freeze.corpus.hindiQuestions, 228);
assert.equal(freeze.corpus.punjabiQuestions, 228);
assert.equal(freeze.corpus.frozenQuestionLanguageArtifacts, 684);
assert.deepEqual(freeze.corpus.languages, ["en", "hi", "pa"]);
assert.equal(freeze.corpus.sourceMode, "FROZEN_CANONICAL_CORPUS");

assert.equal(freeze.questionStudio.engineId, "knowledge-v1");
assert.equal(freeze.questionStudio.lifecycle, "REVIEW_ONLY");
assert.equal(freeze.questionStudio.registered, true);
assert.equal(freeze.questionStudio.reviewRunGenerationAuthorized, true);
assert.equal(freeze.questionStudio.reviewRunPersistenceAuthorized, true);
assert.equal(freeze.questionStudio.deterministicReplayRequired, true);
assert.equal(freeze.questionStudio.immutableFrozenArtifacts, true);
assert.equal(freeze.questionStudio.revisionPolicy, "SOURCE_GENERATOR_ONLY");
assert.equal(freeze.questionStudio.inlineRevisionAllowed, false);
assert.equal(freeze.questionStudio.regenerationAllowed, false);
assert.equal(freeze.questionStudio.approvalMode, "review_only");
assert.equal(freeze.questionStudio.expectedQuestionBankConversionCount, 0);

for (const [gate, value] of Object.entries(freeze.difficulty)) {
  if (gate === "implicitMediumFallbackAllowed" || gate === "explicitEasyMediumHardRequestsAllowed" || gate === "auditedAuthorityPresent" || gate === "supported") {
    assert.equal(value, false, `COM-003 REVIEW_ONLY freeze unexpectedly opens difficulty gate ${gate}.`);
  }
}

for (const [gate, value] of Object.entries(freeze.downstreamLocks)) {
  assert.equal(value, false, `COM-003 REVIEW_ONLY freeze unexpectedly opens downstream gate ${gate}.`);
}

assert.match(freeze.correctionRule, /governed source corpus/i);
assert.match(freeze.replacementRule, /new versioned authority/i);
assert.match(freeze.nextGate, /difficulty authority/i);
assert.match(freeze.nextGate, /BANK_ONLY/i);

console.log("[COM003-QUESTION-STUDIO-REVIEW-ONLY-FREEZE-V1]", {
  valid: true,
  authorityId: freeze.authorityId,
  validationRun: freeze.validation.runId,
  validationJob: freeze.validation.jobId,
  lifecycle: freeze.questionStudio.lifecycle,
  qlCount: freeze.corpus.permanentQlCount,
  cpCount: freeze.corpus.canonicalCpCount,
  artifactCount: freeze.corpus.frozenQuestionLanguageArtifacts,
  questionBankWritable: freeze.downstreamLocks.questionBankWritable,
  difficultySupported: freeze.difficulty.supported,
});
