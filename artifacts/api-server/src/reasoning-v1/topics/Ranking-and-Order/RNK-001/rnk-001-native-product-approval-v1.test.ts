import assert from "node:assert/strict";
import { RNK_001_NATIVE_PRODUCT_APPROVAL_V1 as approval } from "./rnk-001-native-product-approval-v1";

assert.equal(approval.chapterId, "RNK-001");
assert.equal(approval.checkpoints.length, 7);
assert.deepEqual(approval.checkpoints.map((entry) => entry.cpId), [
  "RNK-CP-001", "RNK-CP-002", "RNK-CP-003", "RNK-CP-004", "RNK-CP-005", "RNK-CP-006", "RNK-CP-007",
]);
assert.deepEqual(approval.checkpoints.map((entry) => entry.pr).sort((a, b) => a - b), [792, 793, 798, 803, 839, 879, 895]);
for (const checkpoint of approval.checkpoints) {
  assert.match(checkpoint.head, /^[0-9a-f]{40}$/u);
  assert.equal(checkpoint.hindiApproved, true);
  assert.equal(checkpoint.punjabiApproved, true);
}
assert.equal(approval.approvedNativeReviewSurface.pr, 921);
assert.equal(approval.approvedNativeReviewSurface.head, "d905d72a71d36794984e67d30fd7581eb5c3f60d");
assert.equal(approval.approvedNativeReviewSurface.hindiApproved, true);
assert.equal(approval.approvedNativeReviewSurface.punjabiApproved, true);
assert.equal(approval.postApprovalTechnicalOnlyHead.nativeSurfaceChanged, false);
assert.equal(approval.lifecycle.formalNativeProductApproval, true);
assert.equal(approval.lifecycle.hindiApproved, true);
assert.equal(approval.lifecycle.punjabiApproved, true);
assert.equal(approval.lifecycle.combinedTreeBuilt, false);
assert.equal(approval.lifecycle.combinedTreeGreen, false);
assert.equal(approval.lifecycle.multilingualFreeze, false);
assert.equal(approval.lifecycle.questionStudioMultilingualEnabled, false);
assert.equal(approval.lifecycle.questionBankWritable, false);
assert.equal(approval.lifecycle.mockTestEligible, false);
assert.equal(approval.lifecycle.publiclyPublishable, false);
assert.equal(approval.nextQl, "RNK-QL-043");
assert.equal(approval.nextQlAllocated, false);

console.log(JSON.stringify({
  status: "PASS",
  approvalVersion: approval.approvalVersion,
  checkpointsApproved: approval.checkpoints.length,
  hindiApproved: approval.lifecycle.hindiApproved,
  punjabiApproved: approval.lifecycle.punjabiApproved,
  multilingualFreeze: approval.lifecycle.multilingualFreeze,
  combinedTreeBuilt: approval.lifecycle.combinedTreeBuilt,
}, null, 2));
