import assert from "node:assert/strict";

import { RNK_001_MULTILINGUAL_FREEZE_V1 as freeze } from "./rnk-001-multilingual-freeze-v1";

assert.equal(freeze.chapterId, "RNK-001");
assert.equal(freeze.version, "RNK_001_MULTILINGUAL_FREEZE_V1");
assert.equal(freeze.state, "MULTILINGUAL_FROZEN");
assert.equal(freeze.english.status, "FROZEN");
assert.equal(freeze.permanentQlRange, "RNK-QL-001..042");
assert.equal(freeze.permanentQlCount, 42);
assert.equal(freeze.nextAvailableQl, "RNK-QL-043");
assert.equal(freeze.ql043Allocated, false);

assert.equal(freeze.nativeProductApproval.hindi, true);
assert.equal(freeze.nativeProductApproval.punjabi, true);
assert.equal(freeze.nativeProductApproval.approvalPr, 934);
assert.match(freeze.nativeProductApproval.approvedNativeSurfaceHead, /^[0-9a-f]{40}$/u);
assert.match(freeze.nativeProductApproval.exactGreenPresentationHead, /^[0-9a-f]{40}$/u);
assert.match(freeze.nativeProductApproval.presentationArtifactDigest, /^sha256:[0-9a-f]{64}$/u);

assert.equal(freeze.approvedLocaleSources.length, 7);
assert.deepEqual(
  freeze.approvedLocaleSources.map((entry) => entry.cpId),
  ["RNK-CP-001", "RNK-CP-002", "RNK-CP-003", "RNK-CP-004", "RNK-CP-005", "RNK-CP-006", "RNK-CP-007"],
);
assert.deepEqual(
  freeze.approvedLocaleSources.map((entry) => entry.pr),
  [793, 798, 803, 839, 879, 895, 792],
);
assert.equal(new Set(freeze.approvedLocaleSources.map((entry) => entry.head)).size, 7);
for (const entry of freeze.approvedLocaleSources) assert.match(entry.head, /^[0-9a-f]{40}$/u);

assert.equal(freeze.combinedTreeProof.integrationPr, 938);
assert.equal(freeze.combinedTreeProof.exactHead, "07ed844d248411ddd385ec0d620d56cb2692571f");
assert.equal(freeze.combinedTreeProof.runId, 32327889203);
assert.equal(freeze.combinedTreeProof.status, "SUCCESS");
assert.equal(freeze.combinedTreeProof.artifactId, 9392687777);
assert.equal(freeze.combinedTreeProof.exactApprovedLocaleOverlayFileCount, 68);
assert.match(freeze.combinedTreeProof.artifactDigest, /^sha256:[0-9a-f]{64}$/u);

assert.equal(freeze.lifecycle.formalNativeApproval, true);
assert.equal(freeze.lifecycle.combinedTreeGreen, true);
assert.equal(freeze.lifecycle.multilingualFreeze, true);

// A content freeze must not silently become a delivery release.
assert.equal(freeze.lifecycle.questionStudioMultilingualEnabled, false);
assert.equal(freeze.lifecycle.questionBankWritable, false);
assert.equal(freeze.lifecycle.testEligible, false);
assert.equal(freeze.lifecycle.mockTestEligible, false);
assert.equal(freeze.lifecycle.publiclyPublishable, false);
assert.equal(freeze.lifecycle.automaticStudentPublication, false);
assert.equal(freeze.lifecycle.manualActivationRequired, true);

console.log(JSON.stringify({
  status: "PASS",
  version: freeze.version,
  nativeApproval: true,
  combinedTreeGreen: true,
  multilingualFreeze: true,
  qls: freeze.permanentQlCount,
  ql043Allocated: freeze.ql043Allocated,
  productDeliveryActivated: false,
}, null, 2));
