import assert from "node:assert/strict";

import {
  TRG_001_POST_FINAL5_APPROVAL_AUTHORIZATION_EVIDENCE,
  TRG_001_POST_FINAL5_APPROVAL_EXECUTION_STATE,
  TRG_001_POST_FINAL5_HUMAN_APPROVAL_RECORD_V1,
} from "./post-final5-human-approval-record-v1";
import {
  TRG_001_POST_FINAL5_REQUIRED_APPROVAL_STATEMENT,
  validateTrg001PostFinal5HumanApprovalRecord,
} from "./post-final5-human-approval-boundary";

const record = TRG_001_POST_FINAL5_HUMAN_APPROVAL_RECORD_V1;
const validated = validateTrg001PostFinal5HumanApprovalRecord(record);

assert.equal(validated.status, "APPROVAL_RECORD_VALID");
assert.equal(record.decision, "APPROVED");
assert.equal(record.approvalStatement, TRG_001_POST_FINAL5_REQUIRED_APPROVAL_STATEMENT);
assert.equal(record.reviewer, "gurudhiman75-hash");
assert.equal(record.approvedAtIso, "2026-08-31T16:46:20+05:30");
assert.equal(TRG_001_POST_FINAL5_APPROVAL_AUTHORIZATION_EVIDENCE.newEnglishFreezeAuthorizedByRecord, true);
assert.equal(TRG_001_POST_FINAL5_APPROVAL_AUTHORIZATION_EVIDENCE.multilingualFreezeAuthorizedByRecord, true);
assert.equal(TRG_001_POST_FINAL5_APPROVAL_AUTHORIZATION_EVIDENCE.internalActivationAuthorizedByRecord, true);
assert.equal(TRG_001_POST_FINAL5_APPROVAL_AUTHORIZATION_EVIDENCE.publicReleaseAuthorizedByRecord, false);

assert.equal(TRG_001_POST_FINAL5_APPROVAL_EXECUTION_STATE.approvalRecordPresent, true);
assert.equal(TRG_001_POST_FINAL5_APPROVAL_EXECUTION_STATE.humanReview, "APPROVED");
assert.equal(TRG_001_POST_FINAL5_APPROVAL_EXECUTION_STATE.newEnglishFreezeExecuted, false);
assert.equal(TRG_001_POST_FINAL5_APPROVAL_EXECUTION_STATE.multilingualFreezeExecuted, false);
assert.equal(TRG_001_POST_FINAL5_APPROVAL_EXECUTION_STATE.internalActivationExecuted, false);
assert.equal(TRG_001_POST_FINAL5_APPROVAL_EXECUTION_STATE.questionStudioEnabled, false);
assert.equal(TRG_001_POST_FINAL5_APPROVAL_EXECUTION_STATE.questionBankWritable, false);
assert.equal(TRG_001_POST_FINAL5_APPROVAL_EXECUTION_STATE.testBuilderEligible, false);
assert.equal(TRG_001_POST_FINAL5_APPROVAL_EXECUTION_STATE.publiclyPublishable, false);
assert.equal(TRG_001_POST_FINAL5_APPROVAL_EXECUTION_STATE.publicReleaseAuthorized, false);

console.log(JSON.stringify({
  status: "TRG001_POST_FINAL5_HUMAN_APPROVAL_RECORD_PASS",
  reviewer: record.reviewer,
  approvedAtIso: record.approvedAtIso,
  approvalRecordValid: true,
  newEnglishFreezeAuthorizedByRecord: true,
  multilingualFreezeAuthorizedByRecord: true,
  internalActivationAuthorizedByRecord: true,
  freezeExecuted: false,
  activationExecuted: false,
  publicReleaseAuthorized: false,
}, null, 2));
