import assert from "node:assert/strict";

import { TRG_001_POST_FINAL5_APPROVAL_AUTHORIZATION_EVIDENCE } from "./post-final5-human-approval-record-v1";
import { TRG_001_POST_FINAL5_FREEZE_V1 } from "./post-final5-freeze-v1";
import { TRG_001_POST_FINAL5_FREEZE_READINESS } from "./post-final5-freeze-readiness";

const freeze = TRG_001_POST_FINAL5_FREEZE_V1;

assert.equal(TRG_001_POST_FINAL5_APPROVAL_AUTHORIZATION_EVIDENCE.newEnglishFreezeAuthorizedByRecord, true);
assert.equal(TRG_001_POST_FINAL5_APPROVAL_AUTHORIZATION_EVIDENCE.multilingualFreezeAuthorizedByRecord, true);
assert.equal(freeze.status, "FROZEN");
assert.equal(freeze.frozenAtIso, "2026-08-31T16:50:24+05:30");
assert.equal(freeze.approvalRecord.mergedApprovalCommit, "cbc89cde637cf9ebff353ba3d043613a45fd6994");
assert.deepEqual(freeze.candidate, TRG_001_POST_FINAL5_FREEZE_READINESS.candidate);
assert.deepEqual(freeze.evidence, TRG_001_POST_FINAL5_FREEZE_READINESS.evidence);
assert.equal(freeze.english.qls, 144);
assert.deepEqual(freeze.english.changedQlIds, ["TRG-001-QL-093"]);
assert.equal(freeze.english.historicalFreezeInherited, false);
assert.equal(freeze.english.freezeStatus, "FROZEN");
assert.equal(freeze.english.frozen, true);
assert.equal(freeze.localization.qls, 144);
assert.deepEqual(freeze.localization.locales, ["hi-IN", "pa-IN"]);
assert.equal(freeze.localization.localizedSurfaces, 288);
assert.deepEqual(freeze.localization.remediatedQlIds, TRG_001_POST_FINAL5_FREEZE_READINESS.localizedScope.remediatedQlIds);
assert.equal(freeze.localization.freezeStatus, "FROZEN");
assert.equal(freeze.localization.frozen, true);
assert.equal(freeze.execution.newEnglishFreezeGranted, true);
assert.equal(freeze.execution.multilingualFreezeGranted, true);
assert.equal(freeze.execution.freezeAuthorized, true);
assert.equal(freeze.execution.internalActivationAuthorizedByApproval, true);
assert.equal(freeze.execution.internalActivationExecuted, false);
assert.equal(freeze.execution.questionStudioEnabled, false);
assert.equal(freeze.execution.questionBankWritable, false);
assert.equal(freeze.execution.testBuilderEligible, false);
assert.equal(freeze.execution.publiclyPublishable, false);
assert.equal(freeze.execution.publicReleaseAuthorized, false);

console.log(JSON.stringify({
  status: "TRG001_POST_FINAL5_FREEZE_V1_PASS",
  frozenAtIso: freeze.frozenAtIso,
  englishFreeze: freeze.english.freezeStatus,
  multilingualFreeze: freeze.localization.freezeStatus,
  internalActivationExecuted: freeze.execution.internalActivationExecuted,
  publicReleaseAuthorized: freeze.execution.publicReleaseAuthorized,
}, null, 2));
