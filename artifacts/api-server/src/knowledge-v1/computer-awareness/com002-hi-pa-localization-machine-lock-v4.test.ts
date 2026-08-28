import assert from "node:assert/strict";

import {
  COM002_HI_PA_LOCALIZATION_MACHINE_LOCK_V4,
  COM002_HI_PA_LOCALIZATION_V4_MACHINE_PINS,
  auditCom002HiPaLocalizationMachineLockV4,
} from "./com002-hi-pa-localization-machine-lock-v4";

const audit = auditCom002HiPaLocalizationMachineLockV4();

assert.equal(audit.valid, true, audit.issues.join(" | "));
assert.deepEqual(audit.actual.terminologyFingerprint, COM002_HI_PA_LOCALIZATION_V4_MACHINE_PINS.terminologyFingerprint);
assert.deepEqual(audit.actual.localizedCorpusFingerprint, COM002_HI_PA_LOCALIZATION_V4_MACHINE_PINS.localizedCorpusFingerprint);
assert.deepEqual(audit.actual.reviewSamplerFingerprint, COM002_HI_PA_LOCALIZATION_V4_MACHINE_PINS.reviewSamplerFingerprint);
assert.deepEqual(audit.actual.combinedFingerprint, COM002_HI_PA_LOCALIZATION_V4_MACHINE_PINS.combinedFingerprint);
assert.equal(audit.actual.localizedQuestionCount, 1040);
assert.equal(audit.actual.reviewSamplerQuestionCount, 26);
assert.equal(audit.actual.qlCount, 13);
assert.equal(COM002_HI_PA_LOCALIZATION_MACHINE_LOCK_V4.canonicalExecution.workflowRunNumber, 530);
assert.equal(COM002_HI_PA_LOCALIZATION_MACHINE_LOCK_V4.canonicalExecution.workflowRunId, 33154212289);
assert.equal(COM002_HI_PA_LOCALIZATION_MACHINE_LOCK_V4.canonicalExecution.workflowJobId, 98793019865);
assert.equal(COM002_HI_PA_LOCALIZATION_MACHINE_LOCK_V4.canonicalExecution.conclusion, "SUCCESS");
assert.equal(COM002_HI_PA_LOCALIZATION_MACHINE_LOCK_V4.lifecycle.localizationV4ExecutedGreen, true);
assert.equal(COM002_HI_PA_LOCALIZATION_MACHINE_LOCK_V4.lifecycle.localizationFingerprintsPinned, true);
assert.equal(COM002_HI_PA_LOCALIZATION_MACHINE_LOCK_V4.lifecycle.localizationMachineLocked, true);
assert.equal(COM002_HI_PA_LOCALIZATION_MACHINE_LOCK_V4.humanReview.accepted, false);
assert.equal(COM002_HI_PA_LOCALIZATION_MACHINE_LOCK_V4.lifecycle.localizationFrozen, false);
assert.equal(COM002_HI_PA_LOCALIZATION_MACHINE_LOCK_V4.lifecycle.questionStudioActive, false);
assert.equal(COM002_HI_PA_LOCALIZATION_MACHINE_LOCK_V4.lifecycle.questionBankWritable, false);
assert.equal(COM002_HI_PA_LOCALIZATION_MACHINE_LOCK_V4.lifecycle.testEligible, false);
assert.equal(COM002_HI_PA_LOCALIZATION_MACHINE_LOCK_V4.lifecycle.mockTestEligible, false);
assert.equal(COM002_HI_PA_LOCALIZATION_MACHINE_LOCK_V4.lifecycle.publiclyPublishable, false);
assert.equal(COM002_HI_PA_LOCALIZATION_MACHINE_LOCK_V4.lifecycle.productionReleaseAuthorized, false);

console.log("[COM002-HI-PA-LOCALIZATION-MACHINE-LOCK-V4] PASS fingerprintsPinned=true run=530 humanAccepted=false localizationFrozen=false");
