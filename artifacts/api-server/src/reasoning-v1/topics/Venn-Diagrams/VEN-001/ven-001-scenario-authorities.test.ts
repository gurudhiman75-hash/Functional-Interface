import assert from "node:assert/strict";
import { VEN_001_SCENARIO_AUTHORITIES } from "./ven-001-scenario-authorities.ts";
import { validateVennTopology } from "./logical-venn-topology.ts";

assert.equal(VEN_001_SCENARIO_AUTHORITIES.length, 8);
assert.equal(new Set(VEN_001_SCENARIO_AUTHORITIES.map((entry) => entry.authorityId)).size, 8);

for (const authority of VEN_001_SCENARIO_AUTHORITIES) {
  const setIds = authority.sets.map((entry) => entry.setId);
  assert.equal(new Set(setIds).size, setIds.length);
  assert.ok(setIds.length === 2 || setIds.length === 3);
  assert.ok(authority.rationale.trim().length > 20);
  for (const locale of ["en-IN", "hi-IN", "pa-IN"] as const) {
    assert.ok(authority.sets.every((entry) => entry.labels[locale].trim().length > 0));
  }
  validateVennTopology(setIds, authority.relations, authority.threeWayIntersection);
}

const domains = new Set(VEN_001_SCENARIO_AUTHORITIES.map((entry) => entry.domain));
assert.deepEqual([...domains].sort(), ["ANIMAL_CLASSIFICATION", "GEOMETRY", "NUMBER_CLASSIFICATION"]);
assert.ok(VEN_001_SCENARIO_AUTHORITIES.every((entry) => entry.reviewStatus === "PENDING_TRILINGUAL_HUMAN_REVIEW"));

console.log("PASS_VEN_001_AUTHORITY_TOPOLOGY_PROOF");
