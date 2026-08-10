import assert from "node:assert/strict";

import {
  BLR_CP003_PERMANENT_RUNTIME_VERSION,
  blrCp003PermanentGroupCount,
  generateBlrCp003Question,
  generateBlrCp003QuestionGroup,
} from "./cp003-permanent-runtime";
import { BLR_CP003_PERMANENT_CONTRACTS } from "./cp003-permanent-contracts";

assert.equal(
  BLR_CP003_PERMANENT_RUNTIME_VERSION,
  "blr-cp003-permanent-runtime-v1",
);
assert.equal(blrCp003PermanentGroupCount(), 102);
assert.equal(BLR_CP003_PERMANENT_CONTRACTS.length, 4);

for (const contract of BLR_CP003_PERMANENT_CONTRACTS) {
  for (const seed of [0, 1, 2, 3, 17, 44, 89, 179, -1]) {
    const question = generateBlrCp003Question(contract.qlId, seed);
    assert.equal(question.packageId, "BLR-001");
    assert.equal(question.checkpointId, "BLR-CP-003");
    assert.equal(question.qlId, contract.qlId);
    assert.equal(question.permanentQlId, contract.qlId);
    assert.equal(question.finalAuthority, contract.solveAuthority);
    assert.equal(question.prototypeOnly, false);
    assert.equal(question.reviewOnly, true);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.questionStudioVisible, false);
    assert.equal(question.questionBankEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.ok(!("prototypeId" in question));
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((option) => option.semanticKey)).size, 4);
    assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(question.options[question.correctIndex]?.isCorrect, true);
    assert.equal(
      question.metadata.permanentRuntimeVersion,
      BLR_CP003_PERMANENT_RUNTIME_VERSION,
    );
    assert.equal(question.metadata.solveAuthority, contract.solveAuthority);
    assert.equal(question.metadata.contractStatus, "ENGLISH_DISCOVERY_FROZEN");
    assert.equal(question.metadata.finalDiscoveryFreezeApproved, true);
    assert.equal(question.metadata.productionStagingApproved, false);
  }
}

for (const seed of [0, 1, 2, 3, 17, 44, 89, 101, -1]) {
  const group = generateBlrCp003QuestionGroup(seed);
  assert.equal(group.packageId, "BLR-001");
  assert.equal(group.checkpointId, "BLR-CP-003");
  assert.equal(group.prototypeOnly, false);
  assert.equal(group.reviewOnly, true);
  assert.equal(group.publiclyPublishable, false);
  assert.equal(group.questionStudioVisible, false);
  assert.equal(group.questionBankEligible, false);
  assert.equal(group.mockTestEligible, false);
  assert.ok(group.questions.length >= 2);
  assert.equal(group.metadata.itemCount, group.questions.length);
  assert.equal(group.metadata.sharedPromptSolvedOnce, true);
  assert.equal(group.metadata.allItemsIndependentlySolved, true);
  assert.equal(group.metadata.finalDiscoveryFreezeApproved, true);
  assert.ok(
    group.questions.every(
      (question) =>
        question.sharedPrompt === group.sharedPrompt &&
        question.scenarioId === group.scenarioId &&
        question.topologyId === group.topologyId &&
        question.sourceBank === group.sourceBank &&
        question.seed === group.seed,
    ),
  );
  assert.deepEqual(
    [...new Set(group.questions.map((question) => question.permanentQlId))],
    group.permanentQlIds,
  );
}

const unresolvedProbe = Array.from({ length: 1000 }, (_, seed) =>
  generateBlrCp003Question("BLR-QL-011", seed),
).find(
  (question) =>
    question.originalAuthority ===
    "IDENTIFY_MEMBER_WITH_UNRESOLVED_MARITAL_STATUS",
);
assert.ok(unresolvedProbe);
assert.equal(unresolvedProbe.permanentQlId, "BLR-QL-011");
assert.equal(
  unresolvedProbe.finalAuthority,
  "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
);

console.log(
  JSON.stringify(
    {
      runtimeVersion: BLR_CP003_PERMANENT_RUNTIME_VERSION,
      permanentQlIds: BLR_CP003_PERMANENT_CONTRACTS.map(
        (contract) => contract.qlId,
      ),
      permanentGroupCount: blrCp003PermanentGroupCount(),
      unresolvedStatusMergedInto: "BLR-QL-011",
      releaseSurfacesLocked: true,
      verdict:
        "BLR-CP-003 PERMANENT ENGLISH REVIEW RUNTIME GENERATES FROZEN QL ITEMS AND SHARED-PASSAGE GROUPS DETERMINISTICALLY",
    },
    null,
    2,
  ),
);
