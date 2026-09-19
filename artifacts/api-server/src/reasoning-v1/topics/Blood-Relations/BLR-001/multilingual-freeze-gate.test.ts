import { strict as assert } from "node:assert";
import { BLR_001_MULTILINGUAL_APPROVAL_RECEIPT } from "./multilingual-freeze-approval";
import {
  assertBlr001MultilingualFreezeApproved,
  buildBlr001MultilingualFreezeReadiness,
  validateBlr001MultilingualApprovalReceipt,
} from "./multilingual-freeze-gate";

assert.deepEqual(validateBlr001MultilingualApprovalReceipt(undefined), ["PRODUCT_OWNER_APPROVAL_RECEIPT_MISSING"]);
assert.doesNotThrow(() => assertBlr001MultilingualFreezeApproved(BLR_001_MULTILINGUAL_APPROVAL_RECEIPT));
assert.deepEqual(validateBlr001MultilingualApprovalReceipt(BLR_001_MULTILINGUAL_APPROVAL_RECEIPT), []);

const staleDigest = { ...BLR_001_MULTILINGUAL_APPROVAL_RECEIPT, reviewArtifactDigest: "sha256:stale" };
assert.deepEqual(validateBlr001MultilingualApprovalReceipt(staleDigest as any), ["REVIEW_ARTIFACT_DIGEST_MISMATCH"]);

const readiness = buildBlr001MultilingualFreezeReadiness(BLR_001_MULTILINGUAL_APPROVAL_RECEIPT);
assert.equal(readiness.freezeEligible, true);
assert.equal(readiness.approvalReceiptAccepted, true);
assert.deepEqual(readiness.approvalBlockers, []);
assert.equal(readiness.releaseState.questionBankWritable, false);
assert.equal(readiness.releaseState.testEligible, false);
assert.equal(readiness.releaseState.mockTestEligible, false);
assert.equal(readiness.releaseState.publiclyPublishable, false);
assert.equal(readiness.releaseState.automaticStudentPublication, false);

console.log(JSON.stringify({
  verdict: "BLR_001_MULTILINGUAL_FREEZE_APPROVAL_RECEIPT_PROVED",
  approvalReceiptAccepted: true,
  reviewedSourceCommit: readiness.reviewedSourceCommit,
  reviewArtifactDigest: readiness.reviewArtifactDigest,
  freezeIsNotRelease: true,
}, null, 2));
