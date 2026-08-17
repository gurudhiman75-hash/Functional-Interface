import assert from "node:assert/strict";
import {
  SYL_EXAM_TARGET_MIX_V1,
  SYL_QL_CLOSEOUT_DECISIONS_V1,
  SYL_SOURCE_PROFILE_CLOSEOUT_V1,
  SYL_SOURCE_SNAPSHOTS_V1,
} from "../source-authority/source-profile-closeout-v1";
import { SYL_QL_REGISTRY } from "./ql-registry";
import { SYL_SCENARIOS } from "./scenarios";

function countBy(values: readonly string[]): Record<string, number> {
  return values.reduce<Record<string, number>>((result, value) => {
    result[value] = (result[value] ?? 0) + 1;
    return result;
  }, {});
}

const snapshotIds = SYL_SOURCE_SNAPSHOTS_V1.map((entry) => entry.snapshotId);
assert.equal(new Set(snapshotIds).size, snapshotIds.length, "source snapshot ids must be unique");

for (const snapshot of SYL_SOURCE_SNAPSHOTS_V1) {
  if (snapshot.status === "VERIFIED_CURRENT_PAGE") {
    assert.ok(snapshot.evidenceUrls.length > 0, `${snapshot.snapshotId}: verified snapshot needs a URL`);
    assert.ok(snapshot.observedShapes.length > 0, `${snapshot.snapshotId}: verified snapshot needs observed shapes`);
  } else {
    assert.equal(snapshot.examProfile, "PUNJAB");
    assert.equal(snapshot.evidenceUrls.length, 0);
  }
}

const targetMixTotals: Record<string, number> = {};
for (const profile of SYL_EXAM_TARGET_MIX_V1) {
  const total = profile.entries.reduce((sum, entry) => sum + entry.weight, 0);
  targetMixTotals[profile.profile] = total;
  if (profile.status === "PROVISIONAL_SOURCE_BACKED") {
    assert.equal(total, 100, `${profile.profile}: provisional target mix must sum to 100`);
    assert.ok(profile.entries.every((entry) => entry.weight > 0));
    for (const entry of profile.entries) {
      assert.ok(entry.sourceSnapshotIds.length > 0, `${entry.familyId}: weighted family needs source support`);
      entry.sourceSnapshotIds.forEach((id) => assert.ok(snapshotIds.includes(id), `${entry.familyId}: unknown snapshot ${id}`));
    }
  } else {
    assert.equal(profile.profile, "PUNJAB");
    assert.equal(total, 0);
    assert.equal(profile.entries.length, 0);
  }
}

const registryIds = SYL_QL_REGISTRY.map((entry) => entry.qlId).sort();
const decisionIds = SYL_QL_CLOSEOUT_DECISIONS_V1.map((entry) => entry.qlId).sort();
assert.deepEqual(decisionIds, registryIds, "every current QL must have exactly one closeout decision");
assert.equal(new Set(decisionIds).size, decisionIds.length, "QL closeout decisions must be unique");

for (const decision of SYL_QL_CLOSEOUT_DECISIONS_V1) {
  decision.sourceSnapshotIds.forEach((id) => assert.ok(snapshotIds.includes(id), `${decision.qlId}: unknown snapshot ${id}`));
  if (decision.role === "MOCK_AUTHENTIC") {
    assert.ok(decision.sourceSnapshotIds.length > 0, `${decision.qlId}: mock-authentic QL must have source support`);
  }
  if (decision.role === "TRAINING_DIAGNOSTIC") {
    assert.equal(decision.action, "KEEP_TRAINING_ONLY");
  }
}

const qlRoles = countBy(SYL_QL_CLOSEOUT_DECISIONS_V1.map((entry) => entry.role));
const qlActions = countBy(SYL_QL_CLOSEOUT_DECISIONS_V1.map((entry) => entry.action));
assert.deepEqual(qlRoles, {
  MOCK_AUTHENTIC: 5,
  PRACTICE_AUTHENTIC_VARIANT: 7,
  TRAINING_DIAGNOSTIC: 6,
});
assert.deepEqual(qlActions, {
  RETAIN: 4,
  REMODEL_BEFORE_MOCK: 1,
  MERGE_CANDIDATE: 7,
  KEEP_TRAINING_ONLY: 6,
});

const scenarioGroups = countBy(SYL_SCENARIOS.map((entry) => entry.group));
const scenarioDifficulties = countBy(SYL_SCENARIOS.map((entry) => entry.baseDifficulty));
const scenarioSourcePatterns = countBy(SYL_SCENARIOS.map((entry) => entry.sourcePatternId));
const scenarioTopologies = countBy(SYL_SCENARIOS.map((entry) => entry.topology));

assert.equal(SYL_SCENARIOS.length, 36);
assert.deepEqual(scenarioGroups, {
  CORE: 12,
  ONLY: 8,
  FEW: 8,
  MIXED: 8,
});
assert.deepEqual(scenarioDifficulties, {
  EASY: 4,
  MEDIUM: 12,
  HARD: 20,
});
assert.equal(scenarioSourcePatterns["SYL-SRC-SSC-CORE-001"], 4);
assert.equal(scenarioSourcePatterns["SYL-SRC-BANK-CORE-001"], 5);
assert.equal(scenarioSourcePatterns["SYL-SRC-BANK-ONLY-001"], 5);
assert.equal(scenarioSourcePatterns["SYL-SRC-BANK-FEW-001"], 6);
assert.equal(scenarioSourcePatterns["SYL-SRC-MULTILINGUAL-MIXED-001"], 4);
assert.equal(scenarioSourcePatterns["SYL-SRC-CROSS-ADV-001"], 12);

const hardShare = scenarioDifficulties.HARD / SYL_SCENARIOS.length;
const crossAdvancedShare = scenarioSourcePatterns["SYL-SRC-CROSS-ADV-001"] / SYL_SCENARIOS.length;
assert.ok(hardShare > 0.5, "baseline audit expects the current pool to be hard-skewed");
assert.ok(crossAdvancedShare >= 1 / 3, "baseline audit expects high cross-advanced representation");
assert.equal(SYL_SOURCE_PROFILE_CLOSEOUT_V1.mockWeightingFrozen, false);
assert.equal(SYL_SOURCE_PROFILE_CLOSEOUT_V1.permanentQlFreezePermitted, false);

console.log(JSON.stringify({
  status: "PASS_SYL_001_SOURCE_PROFILE_CLOSEOUT_BASELINE_AUDIT",
  authority: SYL_SOURCE_PROFILE_CLOSEOUT_V1.authorityId,
  sourceSnapshots: {
    total: SYL_SOURCE_SNAPSHOTS_V1.length,
    byProfile: countBy(SYL_SOURCE_SNAPSHOTS_V1.map((entry) => entry.examProfile)),
    byStatus: countBy(SYL_SOURCE_SNAPSHOTS_V1.map((entry) => entry.status)),
  },
  targetMixTotals,
  currentScenarioPool: {
    total: SYL_SCENARIOS.length,
    groups: scenarioGroups,
    difficulty: scenarioDifficulties,
    sourcePatterns: scenarioSourcePatterns,
    topologies: scenarioTopologies,
    hardShare: Number(hardShare.toFixed(4)),
    crossAdvancedShare: Number(crossAdvancedShare.toFixed(4)),
    examProfileWeightingImplemented: false,
    generatedQuestionDifficultyCalibrationImplemented: false,
    punjabDirectScenarioAuthority: false,
  },
  qlCloseout: {
    total: SYL_QL_CLOSEOUT_DECISIONS_V1.length,
    roles: qlRoles,
    actions: qlActions,
    directRetains: SYL_QL_CLOSEOUT_DECISIONS_V1
      .filter((entry) => entry.action === "RETAIN")
      .map((entry) => entry.qlId),
    mergeCandidates: SYL_QL_CLOSEOUT_DECISIONS_V1
      .filter((entry) => entry.action === "MERGE_CANDIDATE")
      .map((entry) => entry.qlId),
    trainingOnly: SYL_QL_CLOSEOUT_DECISIONS_V1
      .filter((entry) => entry.role === "TRAINING_DIAGNOSTIC")
      .map((entry) => entry.qlId),
  },
  freeze: {
    mockWeightingFrozen: false,
    permanentQlFreezePermitted: false,
    blockers: SYL_SOURCE_PROFILE_CLOSEOUT_V1.blockers,
  },
}, null, 2));
