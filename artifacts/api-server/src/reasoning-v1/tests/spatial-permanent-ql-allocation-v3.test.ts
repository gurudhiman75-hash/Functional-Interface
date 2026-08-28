import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V2,
} from "../foundation/spatial/spatial-permanent-ql-allocation-v2";
import {
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V3,
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V3,
  SPATIAL_PFC_PERMANENT_QL_ALLOCATIONS_V3,
} from "../foundation/spatial/spatial-permanent-ql-allocation-v3";
import { PFC_001_REPRESENTATION_CATALOG_V1 } from "../foundation/spatial/paper-folding-discovery-v1";

assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V3.permanentQlCount, 38);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V3.permanentQlRange, "SPA-QL-001..SPA-QL-038");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V3.nextAvailablePermanentQlId, "SPA-QL-039");
assert.equal(SPATIAL_PFC_PERMANENT_QL_ALLOCATIONS_V3.length, 4);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATIONS_V3.length, 38);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V3.chapterCounts["PFC-001"], 4);

// Existing 34 permanent QLs are immutable field-for-field.
assert.deepEqual(
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V3.slice(0, 34),
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V2,
);

assert.deepEqual(
  SPATIAL_PFC_PERMANENT_QL_ALLOCATIONS_V3.map((entry) => entry.permanentQlId),
  ["SPA-QL-035", "SPA-QL-036", "SPA-QL-037", "SPA-QL-038"],
);
assert.deepEqual(
  SPATIAL_PFC_PERMANENT_QL_ALLOCATIONS_V3.map((entry) => entry.name),
  [
    "Axial and repeated-fold unfolding",
    "Compound multi-axis unfolding",
    "Diagonal and corner-fold unfolding",
    "Multiple-cut and edge-notch unfolding",
  ],
);

const catalogIds = new Set(PFC_001_REPRESENTATION_CATALOG_V1.map((entry) => entry.id));
const allocatedRepresentationIds = SPATIAL_PFC_PERMANENT_QL_ALLOCATIONS_V3.flatMap(
  (entry) => [...entry.representationIds],
);
assert.equal(allocatedRepresentationIds.length, 10);
assert.equal(new Set(allocatedRepresentationIds).size, 10);
assert.deepEqual([...new Set(allocatedRepresentationIds)].sort(), [...catalogIds].sort());

const allQlIds = SPATIAL_PERMANENT_QL_ALLOCATIONS_V3.map((entry) => entry.permanentQlId);
assert.equal(new Set(allQlIds).size, allQlIds.length);

for (const allocation of SPATIAL_PFC_PERMANENT_QL_ALLOCATIONS_V3) {
  assert.equal(allocation.allocationStatus, "PERMANENT_QL_ALLOCATED_ENGLISH_RUNTIME_PENDING");
  assert.equal(allocation.englishRuntimeImplemented, false);
  assert.equal(allocation.englishImplementationFrozen, false);
  assert.equal(allocation.active, false);
  assert.equal(allocation.questionStudioDiscoverable, false);
  assert.equal(allocation.questionStudioRegistrationStatus, "NOT_REGISTERED");
  assert.equal(allocation.questionBankWritable, false);
  assert.equal(allocation.testEligible, false);
  assert.equal(allocation.publiclyPublishable, false);
  assert.equal(allocation.hindiPunjabiGeneration, false);
}

const evidence = {
  authority: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V3,
  status: "PASS_SPA_PFC_001_PERMANENT_QL_ALLOCATION_V3",
  guarantees: {
    existingQl001To034PreservedFieldForField: true,
    pfcPermanentQlCount: 4,
    allTenDiscoveryRepresentationsAllocatedExactlyOnce: true,
    nextAvailablePermanentQlId: "SPA-QL-039",
    englishRuntimePending: true,
    questionStudioNotRegistered: true,
  },
};
mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-pfc-001-permanent-ql-allocation-v3-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(evidence));
