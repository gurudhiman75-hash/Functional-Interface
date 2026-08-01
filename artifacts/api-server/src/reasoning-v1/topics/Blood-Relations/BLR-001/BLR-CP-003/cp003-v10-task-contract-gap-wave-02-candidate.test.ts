import assert from "node:assert/strict";

import {
  BLR_CP003_V10_TASK_CONTRACT_GAP_WAVE_02_CANDIDATE_VERSION,
  BLR_CP003_V10_TASK_CONTRACT_GAP_WAVE_02_VERSION,
  generateBlrCp003V10TaskContractGapWave02Candidates,
} from "./cp003-v10-task-contract-gap-wave-02-candidate";

const records = generateBlrCp003V10TaskContractGapWave02Candidates();
const authorities = new Map<string, number>();
const contracts = new Map<string, number>();
const prototypes = new Map<string, number>();
const topologies = new Map<string, number>();
const groups = new Set<string>();
const answerPositions = [0, 0, 0, 0];
const fingerprints = new Set<string>();

assert.equal(
  BLR_CP003_V10_TASK_CONTRACT_GAP_WAVE_02_VERSION,
  "BLR_CP003_V10_TASK_CONTRACT_GAP_WAVE_02_V1",
);
assert.equal(
  BLR_CP003_V10_TASK_CONTRACT_GAP_WAVE_02_CANDIDATE_VERSION,
  "BLR_CP003_V10_TASK_CONTRACT_GAP_WAVE_02_CANDIDATE_V1",
);
assert.equal(records.length, 48);

for (const record of records) {
  authorities.set(
    record.provisionalAuthority,
    (authorities.get(record.provisionalAuthority) ?? 0) + 1,
  );
  contracts.set(
    record.metadata.taskContract,
    (contracts.get(record.metadata.taskContract) ?? 0) + 1,
  );
  prototypes.set(
    record.prototypeId,
    (prototypes.get(record.prototypeId) ?? 0) + 1,
  );
  topologies.set(record.topologyId, (topologies.get(record.topologyId) ?? 0) + 1);
  groups.add(`${record.scenarioId}::${record.seed}`);
  answerPositions[record.correctIndex] += 1;

  assert.equal(record.options.length, 4);
  assert.equal(record.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(record.options[record.correctIndex]!.semanticKey, record.answerSemanticKey);
  assert.equal(new Set(record.options.map((option) => option.text)).size, 4);
  assert.equal(new Set(record.options.map((option) => option.semanticKey)).size, 4);
  assert.equal(record.answerType, "PERSON_NAME");
  assert.equal(record.permanentQlId, null);
  assert.equal(record.prototypeOnly, true);
  assert.equal(record.reviewOnly, true);
  assert.equal(record.publiclyPublishable, false);
  assert.equal(record.questionStudioVisible, false);
  assert.equal(record.questionBankEligible, false);
  assert.equal(record.mockTestEligible, false);
  assert.equal(record.metadata.approvalInheritanceSanitised, true);
  assert.equal(record.metadata.humanReviewApproved, false);
  assert.equal(record.metadata.wave01StructuralStagingApproved, false);
  assert.equal(record.metadata.taskWave02StructuralStagingApproved, false);
  assert.equal(record.metadata.structuralSaturationApproved, false);
  assert.equal(record.metadata.productionStagingApproved, false);
  assert.equal(record.metadata.silenceDoesNotImplyUnmarried, true);
  assert.equal(record.metadata.contentDerivedFromApprovedWave01Graph, true);
  assert.ok(record.editorial.solutionPhases.length === 4);
  assert.ok(record.proceduralLogic.nodes.length > 0);
  assert.ok(record.proceduralLogic.edges.length > 0);
  assert.ok(!fingerprints.has(record.metadata.semanticFingerprint));
  fingerprints.add(record.metadata.semanticFingerprint);

  const metadata = record.metadata as Record<string, unknown>;
  for (const forbidden of [
    "structuralStagingApprovalVersion",
    "approvalScope",
    "approvedReviewVersion",
    "approvalDate",
    "approvedBy",
  ]) {
    assert.equal(forbidden in metadata, false, `${record.itemId} retained ${forbidden}`);
  }

  if (record.metadata.taskContract === "NEGATIVE_RELATION_EXCLUSION") {
    assert.equal(record.provisionalAuthority, "IDENTIFY_MEMBER_BY_EXCLUSION");
    assert.equal(record.metadata.negativeClueCount, 1);
    assert.equal(record.metadata.openWorldBoundaryApplied, false);
    assert.match(record.stem, /\b(?:not|but not)\b/i);
    assert.ok(record.editorial.commonTraps.some((trap) => /not/i.test(trap)));
  } else {
    assert.equal(
      record.provisionalAuthority,
      "IDENTIFY_MEMBER_WITH_UNDETERMINED_MARITAL_STATUS",
    );
    assert.equal(record.metadata.negativeClueCount, 0);
    assert.equal(record.metadata.openWorldBoundaryApplied, true);
    assert.match(record.stem, /(?:cannot be determined|not established|undetermined)/i);
    assert.ok(
      record.editorial.examShortcut.includes("unknown, not unmarried"),
    );
  }
}

assert.deepEqual(Object.fromEntries(authorities), {
  IDENTIFY_MEMBER_BY_EXCLUSION: 24,
  IDENTIFY_MEMBER_WITH_UNDETERMINED_MARITAL_STATUS: 24,
});
assert.deepEqual(Object.fromEntries(contracts), {
  NEGATIVE_RELATION_EXCLUSION: 24,
  OPEN_WORLD_STATUS_BOUNDARY: 24,
});
assert.equal(prototypes.size, 6);
assert.ok([...prototypes.values()].every((count) => count === 8));
assert.deepEqual(Object.fromEntries(topologies), {
  MULTI_MARRIED_SIBLING_IN_LAW: 16,
  MATERNAL_PATERNAL_DUAL_BRANCH: 16,
  FOUR_GENERATION_ASYMMETRIC_LINEAGE: 16,
});
assert.equal(groups.size, 24);
assert.deepEqual(answerPositions, [12, 12, 12, 12]);
assert.equal(fingerprints.size, 48);

console.log(
  JSON.stringify(
    {
      waveVersion: BLR_CP003_V10_TASK_CONTRACT_GAP_WAVE_02_VERSION,
      candidateVersion: BLR_CP003_V10_TASK_CONTRACT_GAP_WAVE_02_CANDIDATE_VERSION,
      candidateRecords: records.length,
      passageGroups: groups.size,
      reusedApprovedTopologies: topologies.size,
      newTaskPrototypes: prototypes.size,
      authorities: Object.fromEntries(authorities),
      contracts: Object.fromEntries(contracts),
      answerPositions,
      approvalInheritanceSanitised: true,
      humanReviewApproved: false,
      structuralSaturationApproved: false,
      permanentQlCount: 0,
      verdict:
        "BLR-CP-003 V10 WAVE 02 ADDS NEGATIVE-EXCLUSION AND OPEN-WORLD STATUS CONTRACTS WITHOUT CLAIMING NEW TOPOLOGIES OR INHERITING WAVE 01 APPROVAL",
    },
    null,
    2,
  ),
);
