import { strict as assert } from "node:assert";
import { SRI_RETAINED_CONTRACTS_R1 } from "../retained-contracts-r1";
import { SRI_ALL_EXECUTABLE_DISCOVERY_CANDIDATES } from "../saturation-registry";
import {
  SRI_R1_RESOLVED_SOURCE_GATES,
  SRI_R1_UNRESOLVED_SOURCE_GATES,
  SRI_SOURCE_GATE_RESOLUTIONS_R1,
} from "../source-gate-resolution-r1";

const sourceGatedDiscovery = SRI_ALL_EXECUTABLE_DISCOVERY_CANDIDATES.filter((item) => item.sourceDisposition === "SOURCE_GATED");
assert.deepEqual(sourceGatedDiscovery.map((item) => item.candidateId).sort(), ["C008-I", "C010-F"]);
assert.equal(SRI_SOURCE_GATE_RESOLUTIONS_R1.length, sourceGatedDiscovery.length, "every discovery source gate requires an explicit R1 resolution");
assert.deepEqual(SRI_SOURCE_GATE_RESOLUTIONS_R1.map((item) => item.candidateId).sort(), sourceGatedDiscovery.map((item) => item.candidateId).sort());
assert.equal(SRI_R1_RESOLVED_SOURCE_GATES.length, 1);
assert.equal(SRI_R1_RESOLVED_SOURCE_GATES[0]?.candidateId, "C010-F");
assert.equal(SRI_R1_UNRESOLVED_SOURCE_GATES.length, 1);
assert.equal(SRI_R1_UNRESOLVED_SOURCE_GATES[0]?.candidateId, "C008-I");
assert.ok(SRI_SOURCE_GATE_RESOLUTIONS_R1.every((item) => item.evidence.length > 0 && item.note.trim().length > 0));

const groups = new Map(SRI_RETAINED_CONTRACTS_R1.map((group) => [group.retainedGroupId, group] as const));
for (const resolution of SRI_SOURCE_GATE_RESOLUTIONS_R1) {
  const group = groups.get(resolution.retainedGroupId as `SRI-RG-${string}`);
  assert.ok(group, `${resolution.retainedGroupId} must exist in the R1 retained partition`);
  assert.ok(group.memberCandidateIds.includes(resolution.candidateId), `${resolution.candidateId} must belong to ${resolution.retainedGroupId}`);
}

const unresolvedGroupIds = new Set(SRI_R1_UNRESOLVED_SOURCE_GATES.map((item) => item.retainedGroupId));
const effectiveReleaseEligibleContracts = SRI_RETAINED_CONTRACTS_R1.filter((group) => !unresolvedGroupIds.has(group.retainedGroupId));
assert.equal(effectiveReleaseEligibleContracts.length, 58, "R1 has 58 source-supported retained contracts before English/collision/freeze review");

console.log(JSON.stringify({
  status: "PASS",
  discoverySourceGates: sourceGatedDiscovery.map((item) => item.candidateId),
  resolvedKeep: SRI_R1_RESOLVED_SOURCE_GATES.map((item) => item.candidateId),
  unresolvedHold: SRI_R1_UNRESOLVED_SOURCE_GATES.map((item) => item.candidateId),
  retainedContractsR1: SRI_RETAINED_CONTRACTS_R1.length,
  effectiveSourceSupportedContracts: effectiveReleaseEligibleContracts.length,
}, null, 2));
