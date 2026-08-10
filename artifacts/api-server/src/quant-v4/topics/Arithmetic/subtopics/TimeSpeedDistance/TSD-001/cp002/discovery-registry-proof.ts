import {
  TSD_CP002_DISCOVERY_AUTHORITIES,
  TSD_CP002_INTERNAL_AUTHORITIES,
  TSD_CP002_LEARNER_AUTHORITIES,
  TSD_CP002_SOURCE_CANDIDATES,
} from "./discovery-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(TSD_CP002_SOURCE_CANDIDATES.length === 34, "Unexpected CP-002 source-candidate count");
assert(new Set(TSD_CP002_SOURCE_CANDIDATES).size === 34, "Duplicate CP-002 source candidate");
assert(TSD_CP002_DISCOVERY_AUTHORITIES.length === 16, "Unexpected CP-002 authority count");
assert(TSD_CP002_LEARNER_AUTHORITIES.length === 14, "Unexpected CP-002 learner authority count");
assert(TSD_CP002_INTERNAL_AUTHORITIES.length === 2, "Unexpected CP-002 internal authority count");
assert(new Set(TSD_CP002_DISCOVERY_AUTHORITIES.map((entry) => entry.solveMode)).size === 16, "Duplicate CP-002 solve mode");
assert(new Set(TSD_CP002_DISCOVERY_AUTHORITIES.map((entry) => entry.provisionalId)).size === 16, "Duplicate CP-002 provisional ID");

const owners = new Map<string, string[]>();
for (const authority of TSD_CP002_DISCOVERY_AUTHORITIES) {
  assert(authority.discoveryStatus === "FROZEN", `${authority.solveMode}: discovery status is not frozen`);
  assert(!authority.publiclyPublishable, `${authority.solveMode}: publication lock failed`);
  assert(authority.sourceCandidates.length > 0, `${authority.solveMode}: authority has no source evidence`);
  for (const candidate of authority.sourceCandidates) {
    owners.set(candidate, [...(owners.get(candidate) ?? []), authority.solveMode]);
  }
}

for (const candidate of TSD_CP002_SOURCE_CANDIDATES) {
  const candidateOwners = owners.get(candidate) ?? [];
  assert(candidateOwners.length === 1, `${candidate}: expected exactly one authority owner, received ${candidateOwners.join(", ") || "none"}`);
}
assert(owners.size === TSD_CP002_SOURCE_CANDIDATES.length, "Unknown source candidate entered CP-002 registry");

const generalAverage = TSD_CP002_DISCOVERY_AUTHORITIES.find((entry) => entry.solveMode === "averageSpeedFromSegments");
assert(generalAverage?.sourceCandidates.includes("findAverageSpeedForEqualDistances"), "Equal-distance average was incorrectly split into a duplicate QL");
assert(generalAverage?.sourceCandidates.includes("findAverageSpeedForEqualTimes"), "Equal-time average was incorrectly split into a duplicate QL");
assert(generalAverage?.sourceCandidates.includes("findAverageSpeedWithMixedUnits"), "Mixed-unit average was not retained as a representation state");
assert(generalAverage?.sourceCandidates.includes("reconstructSegmentedJourneyFromTable"), "Table average was not retained as a representation state");
assert(generalAverage?.sourceCandidates.includes("findAverageSpeedAfterRouteReversal"), "Route reversal was not retained as a segmented representation state");

const allocation = TSD_CP002_DISCOVERY_AUTHORITIES.find((entry) => entry.solveMode === "segmentAllocationFromTotalsAndSpeeds");
assert(allocation?.sourceCandidates.length === 4, "Segment-distance/time reconstruction was not merged into one two-equation authority");
const share = TSD_CP002_DISCOVERY_AUTHORITIES.find((entry) => entry.solveMode === "unknownSegmentShareFromAverage");
assert(share?.sourceCandidates.length === 2, "Distance-share and time-share inverses were not grouped under one representation-aware authority");

console.log(JSON.stringify({
  status: "PASS",
  canonicalProblemId: "TSD-CP-002",
  sourceCandidates: TSD_CP002_SOURCE_CANDIDATES.length,
  frozenAuthorities: TSD_CP002_DISCOVERY_AUTHORITIES.length,
  learnerAuthorities: TSD_CP002_LEARNER_AUTHORITIES.length,
  internalQaAuthorities: TSD_CP002_INTERNAL_AUTHORITIES.length,
  uncoveredCandidates: 0,
  multiplyOwnedCandidates: 0,
}, null, 2));
