import assert from "node:assert/strict";
import {
  TSD_CP001_DISCOVERY_AUTHORITIES,
  TSD_CP001_DISCOVERY_SOLVE_MODES,
  TSD_CP001_SOURCE_CANDIDATES,
} from "./discovery-registry";

const provisionalIds = new Set(TSD_CP001_DISCOVERY_AUTHORITIES.map((entry) => entry.provisionalId));
assert.equal(provisionalIds.size, TSD_CP001_DISCOVERY_AUTHORITIES.length, "provisional IDs must be unique");

const solveModes = new Set(TSD_CP001_DISCOVERY_AUTHORITIES.map((entry) => entry.solveMode));
assert.equal(solveModes.size, TSD_CP001_DISCOVERY_AUTHORITIES.length, "solve modes must be unique");
assert.deepEqual([...solveModes].sort(), [...TSD_CP001_DISCOVERY_SOLVE_MODES].sort());

const dispositions = new Map<string, number>();
for (const authority of TSD_CP001_DISCOVERY_AUTHORITIES) {
  assert.equal(authority.discoveryStatus, "PROVISIONAL");
  assert.equal(authority.publiclyPublishable, false);
  assert.ok(!authority.provisionalId.includes("TSD-QL-"), "discovery must not allocate a permanent QL");
  assert.ok(authority.sourceCandidates.length > 0, `${authority.provisionalId} must own at least one source candidate`);
  for (const candidate of authority.sourceCandidates) {
    dispositions.set(candidate, (dispositions.get(candidate) ?? 0) + 1);
  }
}

assert.equal(dispositions.size, TSD_CP001_SOURCE_CANDIDATES.length, "every source candidate needs a disposition");
for (const candidate of TSD_CP001_SOURCE_CANDIDATES) {
  assert.equal(dispositions.get(candidate), 1, `${candidate} must be dispositioned exactly once`);
}

console.log(JSON.stringify({
  status: "PASS",
  suite: "TSD-CP-001 provisional merge-split registry",
  sourceCandidates: TSD_CP001_SOURCE_CANDIDATES.length,
  provisionalAuthorities: TSD_CP001_DISCOVERY_AUTHORITIES.length,
  permanentQlCount: 0,
}, null, 2));
