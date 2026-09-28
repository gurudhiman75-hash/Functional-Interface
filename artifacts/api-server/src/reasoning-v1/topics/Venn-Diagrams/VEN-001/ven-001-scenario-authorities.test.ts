import assert from "node:assert/strict";
import { VEN_001_SCENARIO_AUTHORITIES } from "./ven-001-scenario-authorities.ts";
import {
  relationForPair,
  validateVennTopology,
} from "./logical-venn-topology.ts";

assert.equal(VEN_001_SCENARIO_AUTHORITIES.length, 19);
assert.equal(
  new Set(VEN_001_SCENARIO_AUTHORITIES.map((entry) => entry.authorityId)).size,
  19,
);

for (const authority of VEN_001_SCENARIO_AUTHORITIES) {
  const setIds = authority.sets.map((entry) => entry.setId);
  assert.equal(new Set(setIds).size, setIds.length);
  assert.ok(setIds.length === 2 || setIds.length === 3);
  assert.ok(authority.rationale.trim().length > 20);
  for (const locale of ["en-IN", "hi-IN", "pa-IN"] as const) {
    assert.ok(
      authority.sets.every((entry) => entry.labels[locale].trim().length > 0),
    );
  }
  const witness = validateVennTopology(
    setIds,
    authority.relations,
    authority.threeWayIntersection,
  );
  if (setIds.length === 3) {
    const outer = setIds.find((candidate) =>
      setIds
        .filter((other) => other !== candidate)
        .every(
          (other) =>
            relationForPair(witness, other, candidate) === "LEFT_SUBSET_RIGHT",
        ),
    );
    assert.ok(outer, `${authority.authorityId}: expected one outer set`);
    const children = setIds.filter((setId) => setId !== outer);
    const childRelation = relationForPair(witness, children[0]!, children[1]!);
    const expectedTopology =
      childRelation === "DISJOINT"
        ? "THREE_TWO_DISJOINT_SUBSETS"
        : childRelation === "PARTIAL_OVERLAP"
          ? "THREE_PARTIAL_OVERLAP_INSIDE_SUPERSET"
          : childRelation === "LEFT_SUBSET_RIGHT" ||
              childRelation === "RIGHT_SUBSET_LEFT"
            ? "THREE_NESTED"
            : null;
    assert.equal(
      authority.topologyId,
      expectedTopology,
      `${authority.authorityId}: topology ID must match its exact set relations`,
    );
  }
}

const domains = new Set(
  VEN_001_SCENARIO_AUTHORITIES.map((entry) => entry.domain),
);
assert.deepEqual([...domains].sort(), [
  "ANIMAL_CLASSIFICATION",
  "GEOMETRY",
  "LANGUAGE_CLASSIFICATION",
  "NUMBER_CLASSIFICATION",
]);
assert.ok(
  VEN_001_SCENARIO_AUTHORITIES.every(
    (entry) => entry.reviewStatus === "PENDING_TRILINGUAL_HUMAN_REVIEW",
  ),
);

console.log("PASS_VEN_001_AUTHORITY_TOPOLOGY_PROOF");
