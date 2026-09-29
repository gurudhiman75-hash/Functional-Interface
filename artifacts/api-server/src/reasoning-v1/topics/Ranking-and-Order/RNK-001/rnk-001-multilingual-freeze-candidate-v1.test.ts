import assert from "node:assert/strict";

import {
  RNK_001_MULTILINGUAL_CHECKPOINT_CANDIDATES,
  RNK_001_MULTILINGUAL_FREEZE_CANDIDATE,
} from "./rnk-001-multilingual-freeze-candidate-v1";

assert.equal(RNK_001_MULTILINGUAL_CHECKPOINT_CANDIDATES.length, 7);
assert.deepEqual(
  RNK_001_MULTILINGUAL_CHECKPOINT_CANDIDATES.map((entry) => entry.checkpointId),
  [
    "RNK-CP-001",
    "RNK-CP-002",
    "RNK-CP-003",
    "RNK-CP-004",
    "RNK-CP-005",
    "RNK-CP-006",
    "RNK-CP-007",
  ],
);

const coveredQls: number[] = [];
const artifactIds = new Set<number>();
for (const entry of RNK_001_MULTILINGUAL_CHECKPOINT_CANDIDATES) {
  assert.equal(entry.technicalStatus, "REVIEW_READY", entry.checkpointId);
  assert.equal(entry.assistantLearnerArtifactAudit, "PASS", entry.checkpointId);
  assert.equal(entry.formalNativeApproval, false, entry.checkpointId);
  assert.match(entry.headSha, /^[0-9a-f]{40}$/u, entry.checkpointId);
  assert.ok(entry.workflowRunId > 0, entry.checkpointId);
  assert.ok(entry.artifacts.length > 0, entry.checkpointId);
  for (const artifact of entry.artifacts) {
    assert.equal(artifact.headSha, entry.headSha, `${entry.checkpointId}/${artifact.name}`);
    assert.equal(artifact.retained, true, `${entry.checkpointId}/${artifact.name}`);
    assert.match(artifact.digest, /^sha256:[0-9a-f]{64}$/u, artifact.name);
    assert.equal(artifactIds.has(artifact.artifactId), false, `duplicate artifact ${artifact.artifactId}`);
    artifactIds.add(artifact.artifactId);
  }
  for (let ql = entry.qlStart; ql <= entry.qlEnd; ql += 1) coveredQls.push(ql);
}

assert.deepEqual(
  coveredQls,
  Array.from({ length: 42 }, (_, index) => index + 1),
  "multilingual candidate must cover every permanent QL exactly once",
);
assert.equal(coveredQls.includes(43), false);
assert.equal(RNK_001_MULTILINGUAL_FREEZE_CANDIDATE.permanentQlRange, "RNK-QL-001..042");
assert.equal(RNK_001_MULTILINGUAL_FREEZE_CANDIDATE.ql043Allocated, false);
assert.equal(RNK_001_MULTILINGUAL_FREEZE_CANDIDATE.englishAuthorityFrozen, true);
assert.equal(RNK_001_MULTILINGUAL_FREEZE_CANDIDATE.hindiTechnicalCoverage, "REVIEW_READY");
assert.equal(RNK_001_MULTILINGUAL_FREEZE_CANDIDATE.punjabiTechnicalCoverage, "REVIEW_READY");
assert.equal(RNK_001_MULTILINGUAL_FREEZE_CANDIDATE.allCheckpointCandidatesArtifactPinned, true);

assert.equal(RNK_001_MULTILINGUAL_FREEZE_CANDIDATE.formalNativeApprovalComplete, false);
assert.equal(RNK_001_MULTILINGUAL_FREEZE_CANDIDATE.chapterMultilingualFreeze, false);
assert.equal(RNK_001_MULTILINGUAL_FREEZE_CANDIDATE.questionStudioMultilingualDeliveryEnabled, false);
assert.equal(RNK_001_MULTILINGUAL_FREEZE_CANDIDATE.questionBankWritable, false);
assert.equal(RNK_001_MULTILINGUAL_FREEZE_CANDIDATE.testEligible, false);
assert.equal(RNK_001_MULTILINGUAL_FREEZE_CANDIDATE.publiclyPublishable, false);
assert.equal(RNK_001_MULTILINGUAL_FREEZE_CANDIDATE.productDeliveryUnlocked, false);

console.log(JSON.stringify({
  status: "PASS",
  checkpoints: RNK_001_MULTILINGUAL_CHECKPOINT_CANDIDATES.length,
  permanentQlsCoveredExactlyOnce: coveredQls.length,
  artifactCount: artifactIds.size,
  ql043Allocated: false,
  formalNativeApprovalComplete: false,
  chapterMultilingualFreeze: false,
  questionStudioMultilingualDeliveryEnabled: false,
}, null, 2));
