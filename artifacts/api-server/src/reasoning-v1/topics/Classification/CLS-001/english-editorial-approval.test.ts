import assert from "node:assert/strict";

import { CLS001_ENGLISH_EDITORIAL_APPROVAL as approval } from "./english-editorial-approval";

assert.equal(approval.chapterId, "CLS-001");
assert.equal(approval.locale, "en-IN");
assert.equal(approval.status, "APPROVED");
assert.equal(
  approval.approvalAuthority,
  "EXPLICIT_USER_EDITORIAL_SIGN_OFF",
);
assert.equal(approval.permanentQlRange.first, "CLS-QL-001");
assert.equal(approval.permanentQlRange.last, "CLS-QL-013");
assert.equal(approval.permanentQlRange.count, 13);
assert.equal(Object.keys(approval.qlQuestionCounts).length, 13);

const checkpointTotal = Object.values(approval.checkpointQuestionCounts).reduce(
  (sum, count) => sum + count,
  0,
);
const qlTotal = Object.values(approval.qlQuestionCounts).reduce(
  (sum, count) => sum + count,
  0,
);
const artifactTotal = approval.sourceArtifacts.reduce(
  (sum, artifact) => sum + artifact.questionCount,
  0,
);

assert.equal(checkpointTotal, 494);
assert.equal(qlTotal, 494);
assert.equal(artifactTotal, 494);
assert.equal(approval.reviewQuestionCount, 494);
assert.equal(approval.checkpointQuestionCounts["CLS-CP-008"], 0);

const expectedQls = Array.from(
  { length: 13 },
  (_, index) => `CLS-QL-${String(index + 1).padStart(3, "0")}`,
);
assert.deepEqual(Object.keys(approval.qlQuestionCounts), expectedQls);

assert.equal(approval.lifecycle.questionStudioDiscoverable, false);
assert.equal(approval.lifecycle.questionBankWritable, false);
assert.equal(approval.lifecycle.testEligible, false);
assert.equal(approval.lifecycle.publiclyPublishable, false);
assert.equal(approval.localisation.hindiApprovedByThisDecision, false);
assert.equal(approval.localisation.punjabiApprovedByThisDecision, false);
assert.ok(approval.reopenOnlyFor.length >= 6);

for (const artifact of approval.sourceArtifacts) {
  assert.match(artifact.digest, /^sha256:[a-f0-9]{64}$/);
  assert.ok(Number.isInteger(artifact.artifactId));
  assert.ok(artifact.questionCount > 0);
}

console.log("CLS-001 English editorial approval guard passed.", {
  approvedAtUtc: approval.approvedAtUtc,
  permanentQls: approval.permanentQlRange.count,
  reviewQuestions: approval.reviewQuestionCount,
  lifecycle: approval.lifecycle,
});
