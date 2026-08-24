import { strict as assert } from "node:assert";
import { SRI_RETAINED_CONTRACTS_R1 } from "../retained-contracts-r1";
import { SRI_ALL_EXECUTABLE_DISCOVERY_CANDIDATES } from "../saturation-registry";

const EXPECTED_GROUPS = 59;
const EXPECTED_PROTOTYPES = 93;
const EXPECTED_OWNER_COUNTS = new Map([
  ["SRI-CP-001", 6], ["SRI-CP-002", 6], ["SRI-CP-003", 3],
  ["SRI-CP-004", 4], ["SRI-CP-005", 6], ["SRI-CP-006", 4],
  ["SRI-CP-007", 4], ["SRI-CP-008", 6], ["SRI-CP-009", 4],
  ["SRI-CP-010", 4], ["SRI-CP-011", 8], ["SRI-CP-012", 4],
]);
const ALLOWED_CROSS_OWNER_MOVES = new Set(["C003-D", "C009-I"]);

assert.equal(SRI_RETAINED_CONTRACTS_R1.length, EXPECTED_GROUPS);
assert.equal(new Set(SRI_RETAINED_CONTRACTS_R1.map((group) => group.retainedGroupId)).size, EXPECTED_GROUPS, "retained group IDs must be unique");
assert.equal(new Set(SRI_RETAINED_CONTRACTS_R1.map((group) => group.title)).size, EXPECTED_GROUPS, "retained group titles must be unique");
assert.ok(SRI_RETAINED_CONTRACTS_R1.every((group) => group.memberCandidateIds.length > 0), "retained groups cannot be empty");

const descriptors = new Map(SRI_ALL_EXECUTABLE_DISCOVERY_CANDIDATES.map((item) => [item.candidateId, item] as const));
const flattened = SRI_RETAINED_CONTRACTS_R1.flatMap((group) => group.memberCandidateIds);
assert.equal(flattened.length, EXPECTED_PROTOTYPES, "compression partition must account for all 93 prototypes exactly once");
assert.equal(new Set(flattened).size, EXPECTED_PROTOTYPES, "a provisional prototype is assigned to more than one retained contract");
assert.deepEqual([...new Set(flattened)].sort(), [...descriptors.keys()].sort(), "compression partition must equal the executable saturation registry");

const crossOwnerMoves = new Set<string>();
for (const group of SRI_RETAINED_CONTRACTS_R1) {
  for (const candidateId of group.memberCandidateIds) {
    const descriptor = descriptors.get(candidateId);
    assert.ok(descriptor, `${candidateId} is not executable discovery evidence`);
    if (descriptor.checkpointId !== group.ownerCheckpointId) crossOwnerMoves.add(candidateId);
  }
}
assert.deepEqual([...crossOwnerMoves].sort(), [...ALLOWED_CROSS_OWNER_MOVES].sort(), "only explicit cross-CP collision closures may change owner checkpoint");

for (const [checkpointId, expected] of EXPECTED_OWNER_COUNTS) {
  assert.equal(SRI_RETAINED_CONTRACTS_R1.filter((group) => group.ownerCheckpointId === checkpointId).length, expected, `${checkpointId} retained-contract count mismatch`);
}

// `sourceGated` on the compression authority records discovery-time provenance.
// R1 resolution is applied separately by source-gate-resolution-r1.ts; one of these
// two provenance-marked groups (RG-047) is source-backed after R1, while RG-039 remains held.
const discoverySourceGatedGroups = SRI_RETAINED_CONTRACTS_R1.filter((group) => group.sourceGated);
assert.equal(discoverySourceGatedGroups.length, 2, "R1 compression must preserve exactly two discovery-time source-gated provenance groups");
assert.deepEqual(discoverySourceGatedGroups.map((group) => group.retainedGroupId).sort(), ["SRI-RG-039", "SRI-RG-047"]);
for (const group of discoverySourceGatedGroups) {
  for (const candidateId of group.memberCandidateIds) {
    assert.equal(descriptors.get(candidateId)?.sourceDisposition, "SOURCE_GATED", `${candidateId} source-gate provenance drift`);
  }
}
assert.equal(SRI_RETAINED_CONTRACTS_R1.filter((group) => !group.sourceGated).length, 57);

console.log(JSON.stringify({
  status: "PASS",
  executablePrototypes: EXPECTED_PROTOTYPES,
  retainedContractsR1: EXPECTED_GROUPS,
  contractsWithoutDiscoverySourceGate: 57,
  discoverySourceGatedContracts: discoverySourceGatedGroups.map((group) => ({ id: group.retainedGroupId, members: group.memberCandidateIds })),
  crossOwnerMoves: [...crossOwnerMoves].sort(),
  ownerCounts: Object.fromEntries(EXPECTED_OWNER_COUNTS),
}, null, 2));
