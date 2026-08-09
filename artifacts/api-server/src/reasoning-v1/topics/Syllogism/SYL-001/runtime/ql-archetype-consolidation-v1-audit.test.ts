import assert from "node:assert/strict";
import {
  SYL_CANONICAL_ARCHETYPES_V2,
  SYL_LEGACY_QL_COMPATIBILITY_V2,
  SYL_QL_ARCHETYPE_CONSOLIDATION_V2,
} from "../source-authority/ql-archetype-consolidation-v2";
import { SYL_SOURCE_SNAPSHOTS_V2 } from "../source-authority/source-profile-closeout-v2";
import { SYL_QL_REGISTRY } from "./ql-registry";

function countBy(values: readonly string[]): Record<string, number> {
  return values.reduce<Record<string, number>>((result, value) => {
    result[value] = (result[value] ?? 0) + 1;
    return result;
  }, {});
}

const archetypeIds = SYL_CANONICAL_ARCHETYPES_V2.map((entry) => entry.archetypeId);
const sourceSnapshotIds = SYL_SOURCE_SNAPSHOTS_V2.map((entry) => entry.snapshotId);
const registryIds = SYL_QL_REGISTRY.map((entry) => entry.qlId).sort();
const compatibilityIds = SYL_LEGACY_QL_COMPATIBILITY_V2.map((entry) => entry.qlId).sort();

assert.equal(SYL_CANONICAL_ARCHETYPES_V2.length, 10);
assert.equal(new Set(archetypeIds).size, archetypeIds.length);
assert.equal(new Set(compatibilityIds).size, compatibilityIds.length);
assert.deepEqual(compatibilityIds, registryIds, "every current QL must have one compatibility decision");

for (const archetype of SYL_CANONICAL_ARCHETYPES_V2) {
  archetype.sourceSnapshotIds.forEach((id) => {
    assert.ok(sourceSnapshotIds.includes(id), `${archetype.archetypeId}: unknown source snapshot ${id}`);
  });
  if (archetype.status === "ACTIVE_MOCK_ARCHETYPE") {
    assert.ok(archetype.mockProfiles.length > 0, `${archetype.archetypeId}: active mock archetype needs a profile`);
    assert.ok(archetype.canonicalLegacyQlId, `${archetype.archetypeId}: active archetype needs a retained legacy QL`);
  }
  if (archetype.status === "TRAINING_ONLY" || archetype.status === "PRACTICE_ONLY") {
    assert.equal(archetype.mockProfiles.length, 0);
  }
}

for (const compatibility of SYL_LEGACY_QL_COMPATIBILITY_V2) {
  assert.ok(archetypeIds.includes(compatibility.targetArchetypeId));
  assert.equal(compatibility.lessonEligible, true);
  assert.equal(compatibility.adaptivePracticeEligible, true);
  assert.ok(compatibility.legacyMockWeight === 0 || compatibility.legacyMockWeight === 1);
  if (compatibility.disposition !== "CANONICAL_RETAIN") {
    assert.equal(compatibility.legacyMockWeight, 0, `${compatibility.qlId}: non-canonical legacy QL must have zero mock weight`);
  }
  if (compatibility.disposition === "TRAINING_ONLY") {
    const target = SYL_CANONICAL_ARCHETYPES_V2.find(
      (entry) => entry.archetypeId === compatibility.targetArchetypeId,
    );
    assert.equal(target?.status, "TRAINING_ONLY");
  }
}

const statusCounts = countBy(SYL_CANONICAL_ARCHETYPES_V2.map((entry) => entry.status));
const dispositionCounts = countBy(SYL_LEGACY_QL_COMPATIBILITY_V2.map((entry) => entry.disposition));
const activeArchetypes = SYL_CANONICAL_ARCHETYPES_V2.filter(
  (entry) => entry.status === "ACTIVE_MOCK_ARCHETYPE",
);
const activeByProfile = countBy(activeArchetypes.flatMap((entry) => entry.mockProfiles));
const legacyMockWeight = SYL_LEGACY_QL_COMPATIBILITY_V2.reduce(
  (sum, entry) => sum + entry.legacyMockWeight,
  0,
);

assert.deepEqual(statusCounts, {
  ACTIVE_MOCK_ARCHETYPE: 4,
  FUTURE_REMODEL_REQUIRED: 1,
  PRACTICE_ONLY: 2,
  TRAINING_ONLY: 3,
});
assert.deepEqual(dispositionCounts, {
  CANONICAL_RETAIN: 4,
  REMODEL_TO_CANONICAL: 2,
  TRAINING_ONLY: 6,
  COMPATIBILITY_ALIAS: 6,
});
assert.deepEqual(activeByProfile, {
  SSC: 2,
  PUNJAB_POLICE: 2,
  BANKING: 2,
  CROSS_EXAM: 1,
});
assert.equal(legacyMockWeight, 4);
assert.equal(SYL_QL_ARCHETYPE_CONSOLIDATION_V2.status, "COMPATIBILITY_OVERLAY_NOT_ACTIVE");
assert.equal(SYL_QL_ARCHETYPE_CONSOLIDATION_V2.activationPermitted, false);

const threeConclusion = SYL_CANONICAL_ARCHETYPES_V2.find(
  (entry) => entry.archetypeId === "SYL-A-FOUR-OPTION-THREE-CONCLUSION",
);
assert.ok(threeConclusion?.mockProfiles.includes("BANKING"));
assert.ok(threeConclusion?.sourceSnapshotIds.includes("SYL-SNAPSHOT-BANK-RBI-GRADE-B-2026"));
assert.ok(threeConclusion?.sourceSnapshotIds.includes("SYL-SNAPSHOT-BANK-NABARD-2026"));

const canonicalMockQlIds = SYL_LEGACY_QL_COMPATIBILITY_V2
  .filter((entry) => entry.legacyMockWeight === 1)
  .map((entry) => entry.qlId);
assert.deepEqual(canonicalMockQlIds, [
  "SYL-QL-001",
  "SYL-QL-003",
  "SYL-QL-004",
  "SYL-QL-008",
]);

console.log(JSON.stringify({
  status: "PASS_SYL_001_QL_ARCHETYPE_CONSOLIDATION_AUDIT",
  authority: SYL_QL_ARCHETYPE_CONSOLIDATION_V2.authorityId,
  archetypes: {
    total: SYL_CANONICAL_ARCHETYPES_V2.length,
    byStatus: statusCounts,
    activeByProfile,
  },
  legacyCompatibility: {
    total: SYL_LEGACY_QL_COMPATIBILITY_V2.length,
    byDisposition: dispositionCounts,
    canonicalMockQlIds,
    zeroWeightAliases: SYL_LEGACY_QL_COMPATIBILITY_V2
      .filter((entry) => entry.disposition === "COMPATIBILITY_ALIAS")
      .map((entry) => entry.qlId),
    remodelRequired: SYL_LEGACY_QL_COMPATIBILITY_V2
      .filter((entry) => entry.disposition === "REMODEL_TO_CANONICAL")
      .map((entry) => entry.qlId),
    trainingOnly: SYL_LEGACY_QL_COMPATIBILITY_V2
      .filter((entry) => entry.disposition === "TRAINING_ONLY")
      .map((entry) => entry.qlId),
  },
  activation: {
    status: SYL_QL_ARCHETYPE_CONSOLIDATION_V2.status,
    permitted: SYL_QL_ARCHETYPE_CONSOLIDATION_V2.activationPermitted,
    currentRuntimeChanged: false,
    currentQlIdsRemoved: false,
  },
}, null, 2));
