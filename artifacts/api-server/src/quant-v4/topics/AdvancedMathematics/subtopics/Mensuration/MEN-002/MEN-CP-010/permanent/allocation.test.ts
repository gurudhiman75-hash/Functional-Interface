import assert from "node:assert/strict";
import { MEN_CP_010_PROTOTYPES } from "../../cp010-foundation/registry";
import { MEN_CP_010_DISCOVERY_V2_CANDIDATES } from "../../cp010-foundation/discovery-v2-ledger";
import { MEN_CP_010_SATURATION_V3_ROWS } from "../../cp010-foundation/saturation-v3-ledger";
import {
  MEN_CP_010_CANONICAL_CLUSTERS,
  MEN_CP_010_DEFERRED_SOURCE_GATED,
  MEN_CP_010_REASSIGNED_OWNERSHIP,
  auditMenCp010MergeSplitV4,
} from "../../cp010-foundation/merge-split-v4";
import {
  MEN_CP_010_PERMANENT_ALLOCATION,
  auditMenCp010PermanentAllocation,
} from "./allocation";

const mergeAudit = auditMenCp010MergeSplitV4();
assert.equal(mergeAudit.canonicalClusterCount, 26);
assert.equal(mergeAudit.uniqueCanonicalClusterCount, 26);
assert.equal(mergeAudit.deferredSourceGatedCount, 2);
assert.equal(mergeAudit.reassignedOwnershipCount, 3);
assert.equal(mergeAudit.unresolvedCount, 0);
assert.equal(mergeAudit.productLocked, true);

const allocationAudit = auditMenCp010PermanentAllocation();
assert.equal(allocationAudit.permanentQlCount, 26);
assert.equal(allocationAudit.uniqueQlCount, 26);
assert.equal(allocationAudit.uniqueClusterCount, 26);
assert.equal(allocationAudit.firstQlId, "MEN-002-QL-124");
assert.equal(allocationAudit.lastQlId, "MEN-002-QL-149");
assert.equal(allocationAudit.contiguousQlRange, true);
assert.equal(allocationAudit.englishImplementationFrozen, true);
assert.equal(allocationAudit.lifecycleLocked, true);

const allocatedEvidence = new Set(
  MEN_CP_010_CANONICAL_CLUSTERS.flatMap((row) => [
    ...row.coreEvidenceIds,
    ...row.representationEvidenceIds,
  ]),
);

// Wave 01: every temporary prototype must be absorbed by a permanent reasoning family.
for (const prototype of MEN_CP_010_PROTOTYPES) {
  assert.equal(
    allocatedEvidence.has(prototype.prototypeId),
    true,
    `Wave 01 prototype not represented in permanent allocation: ${prototype.prototypeId}`,
  );
}

// Wave 02: all 21 executable discovery candidates must be represented.
const wave02Executable = MEN_CP_010_DISCOVERY_V2_CANDIDATES.filter((row) => row.executable);
assert.equal(wave02Executable.length, 21);
for (const candidate of wave02Executable) {
  assert.equal(
    allocatedEvidence.has(candidate.id),
    true,
    `Wave 02 executable candidate not represented in permanent allocation: ${candidate.id}`,
  );
}

// Wave 03: all 11 executable saturation candidates must be represented.
const wave03Executable = MEN_CP_010_SATURATION_V3_ROWS.filter((row) => row.executable);
assert.equal(wave03Executable.length, 11);
for (const candidate of wave03Executable) {
  assert.equal(
    allocatedEvidence.has(candidate.id),
    true,
    `Wave 03 executable candidate not represented in permanent allocation: ${candidate.id}`,
  );
}

// Higher-algebra inverse forms are intentionally source-gated, not silently dropped.
assert.deepEqual(
  [...MEN_CP_010_DEFERRED_SOURCE_GATED].sort(),
  [
    "V3-RADIUS-FROM-FRUSTUM-VOLUME-QUADRATIC",
    "V3-SIDE-FROM-FRUSTUM-VOLUME-QUADRATIC",
  ].sort(),
);

// Neighboring transformations remain outside CP-010.
assert.deepEqual(MEN_CP_010_REASSIGNED_OWNERSHIP, [
  ["V3-HOLLOW-OPEN-FRUSTUM", "MEN-CP-011"],
  ["V3-RECAST-PYRAMID-FRUSTUM", "MEN-CP-012"],
  ["V3-COMPOSITE-INSCRIBED-FRUSTUM", "MEN-CP-013"],
]);

assert.equal(
  MEN_CP_010_PERMANENT_ALLOCATION.every((row) =>
    row.qlId >= "MEN-002-QL-124" && row.qlId <= "MEN-002-QL-149"),
  true,
);

console.log(JSON.stringify({
  authority: allocationAudit.authority,
  permanentQlCount: allocationAudit.permanentQlCount,
  qlRange: `${allocationAudit.firstQlId}..${allocationAudit.lastQlId}`,
  wave01PrototypeCount: MEN_CP_010_PROTOTYPES.length,
  wave02ExecutableCount: wave02Executable.length,
  wave03ExecutableCount: wave03Executable.length,
  deferredSourceGatedCount: mergeAudit.deferredSourceGatedCount,
  reassignedOwnershipCount: mergeAudit.reassignedOwnershipCount,
  englishImplementationFrozen: allocationAudit.englishImplementationFrozen,
  lifecycleLocked: allocationAudit.lifecycleLocked,
}, null, 2));
