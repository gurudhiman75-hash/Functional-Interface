import assert from "node:assert/strict";

import { TRG_001_POST_FINAL5_FREEZE_V1 } from "./post-final5-freeze-v1";
import { TRG_001_POST_FINAL5_QUESTION_STUDIO_ACTIVATION_V1 } from "./post-final5-question-studio-activation-v1";

const activation = TRG_001_POST_FINAL5_QUESTION_STUDIO_ACTIVATION_V1;
const freeze = TRG_001_POST_FINAL5_FREEZE_V1;

assert.equal(freeze.status, "FROZEN");
assert.equal(freeze.execution.newEnglishFreezeGranted, true);
assert.equal(freeze.execution.multilingualFreezeGranted, true);
assert.equal(freeze.execution.internalActivationAuthorizedByApproval, true);

assert.equal(activation.version, "TRG001_POST_FINAL5_QUESTION_STUDIO_ACTIVATION_V1");
assert.equal(activation.packageId, "TRG-001");
assert.equal(activation.status, "ACTIVE_INTERNAL_QUESTION_STUDIO");
assert.equal(activation.activationScope, "QUESTION_STUDIO_ONLY");
assert.deepEqual(activation.languages, ["en", "hi", "pa"]);
assert.deepEqual(activation.localeMap, { en: "en-IN", hi: "hi-IN", pa: "pa-IN" });
assert.equal(activation.authority.freezeVersion, freeze.version);
assert.equal(activation.authority.englishRemediationVersion, freeze.candidate.englishRemediationVersion);
assert.equal(activation.authority.localizationVersion, freeze.candidate.localizationVersion);
assert.equal(activation.authority.reviewedSourceHead, freeze.candidate.reviewedSourceHead);
assert.equal(activation.authority.mergedRemediationCommit, freeze.candidate.mergedCommit);
assert.equal(activation.authority.evidenceWorkflowRunId, freeze.evidence.workflowRunId);
assert.equal(activation.authority.evidenceArtifactId, freeze.evidence.artifactId);
assert.equal(activation.authority.evidenceArtifactDigest, freeze.evidence.artifactDigest);

assert.equal(activation.execution.questionStudioActivationExecuted, true);
assert.equal(activation.execution.questionStudioEnabled, true);
assert.equal(activation.execution.questionStudioDiscoverable, true);
assert.equal(activation.execution.internalReviewRunsWritable, true);
assert.equal(activation.execution.questionBankWritable, false);
assert.equal(activation.execution.testBuilderEligible, false);
assert.equal(activation.execution.mockTestEligible, false);
assert.equal(activation.execution.publiclyPublishable, false);
assert.equal(activation.execution.publicReleaseAuthorized, false);
assert.equal(activation.execution.automaticStudentPublication, false);
assert.equal(activation.execution.contentMutationAuthorized, false);

console.log(JSON.stringify({
  status: "PASS_TRG001_POST_FINAL5_QUESTION_STUDIO_ACTIVATION_V1",
  packageId: activation.packageId,
  languages: activation.languages,
  questionStudioEnabled: activation.execution.questionStudioEnabled,
  questionBankWritable: activation.execution.questionBankWritable,
  testBuilderEligible: activation.execution.testBuilderEligible,
  publicReleaseAuthorized: activation.execution.publicReleaseAuthorized,
}, null, 2));
