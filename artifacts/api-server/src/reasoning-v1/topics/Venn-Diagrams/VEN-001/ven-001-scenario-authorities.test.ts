import assert from "node:assert/strict";
import { VEN_001_SCENARIO_AUTHORITIES } from "./ven-001-scenario-authorities.ts";
import {
  relationForPair,
  validateVennTopology,
} from "./logical-venn-topology.ts";

assert.equal(VEN_001_SCENARIO_AUTHORITIES.length, 34);
assert.equal(
  new Set(VEN_001_SCENARIO_AUTHORITIES.map((entry) => entry.authorityId)).size,
  34,
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
    const nestedPair = setIds.flatMap((left, index) =>
      setIds.slice(index + 1).flatMap((right) => {
        const relation = relationForPair(witness, left, right);
        return relation === "LEFT_SUBSET_RIGHT" || relation === "RIGHT_SUBSET_LEFT"
          ? [{ left, right }]
          : [];
      }),
    )[0];
    const nestedPairTopology = nestedPair && (() => {
      const separate = setIds.find((setId) => setId !== nestedPair.left && setId !== nestedPair.right)!;
      return relationForPair(witness, nestedPair.left, separate) === "DISJOINT" &&
        relationForPair(witness, nestedPair.right, separate) === "DISJOINT"
        ? "THREE_ONE_NESTED_PAIR_ONE_SEPARATE"
        : null;
    })();
    let expectedTopology: string | null = nestedPairTopology;
    if (!expectedTopology) {
      const outer = setIds.find((candidate) =>
        setIds.filter((other) => other !== candidate).every(
          (other) => relationForPair(witness, other, candidate) === "LEFT_SUBSET_RIGHT",
        ),
      );
      assert.ok(outer, `${authority.authorityId}: expected one outer set`);
      const children = setIds.filter((setId) => setId !== outer);
      const childRelation = relationForPair(witness, children[0]!, children[1]!);
      expectedTopology = childRelation === "DISJOINT"
        ? "THREE_TWO_DISJOINT_SUBSETS"
        : childRelation === "PARTIAL_OVERLAP"
          ? "THREE_PARTIAL_OVERLAP_INSIDE_SUPERSET"
          : childRelation === "LEFT_SUBSET_RIGHT" || childRelation === "RIGHT_SUBSET_LEFT"
            ? "THREE_NESTED"
            : null;
    }
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
  "ASTRONOMY_CLASSIFICATION",
  "FOOD_CLASSIFICATION",
  "GENERAL_CLASSIFICATION",
  "GEOMETRY",
  "LANGUAGE_CLASSIFICATION",
  "NUMBER_CLASSIFICATION",
]);
assert.ok(
  VEN_001_SCENARIO_AUTHORITIES.every(
    (entry) => entry.reviewStatus === "PENDING_TRILINGUAL_HUMAN_REVIEW",
  ),
);


const polygonAuthority = VEN_001_SCENARIO_AUTHORITIES.find(
  (entry) => entry.authorityId === "VEN-AUTH-018-PENTAGON-HEXAGON-POLYGON",
);
assert.ok(polygonAuthority, "the corrected polygon authority must remain registered");
assert.deepEqual(
  polygonAuthority.relations.find((relation) => relation.left === "A" && relation.right === "B")?.relation,
  "DISJOINT",
  "pentagons and hexagons must remain separate classes",
);

const expandedAuthorityIds = [
  "VEN-AUTH-023-ELECTRIC-CAR-ROAD-VEHICLE",
  "VEN-AUTH-024-SCREWDRIVER-HAND-TOOL-TOOL",
  "VEN-AUTH-025-RIGHT-TRIANGLE-POLYGON",
  "VEN-AUTH-026-ADULT-WOMEN-PEOPLE",
  "VEN-AUTH-027-MULTIPLES-18-6-INTEGERS",
  "VEN-AUTH-028-PLANETS-DWARF-PLANETS-SS-BODIES",
  "VEN-AUTH-029-VOWEL-CONSONANT-ENGLISH-LETTERS",
  "VEN-AUTH-030-METAL-NONMETAL-CHEMICAL-ELEMENTS",
  "VEN-AUTH-031-RIGHT-SCALENE-TRIANGLES",
  "VEN-AUTH-032-ODD-SQUARE-NATURAL",
  "VEN-AUTH-033-EVEN-SQUARE-NATURAL",
  "VEN-AUTH-034-TRIANGLES-REGULAR-POLYGONS",
] as const;
assert.ok(
  expandedAuthorityIds.every((id) =>
    VEN_001_SCENARIO_AUTHORITIES.some((entry) => entry.authorityId === id),
  ),
  "all twelve CP003 expansion authorities must remain in the pool",
);
const expandedTopologyCounts = VEN_001_SCENARIO_AUTHORITIES.reduce<Record<string, number>>(
  (counts, entry) => {
    counts[entry.topologyId] = (counts[entry.topologyId] ?? 0) + 1;
    return counts;
  },
  {},
);
assert.deepEqual(expandedTopologyCounts, {
  THREE_NESTED: 10,
  THREE_TWO_DISJOINT_SUBSETS: 12,
  THREE_PARTIAL_OVERLAP_INSIDE_SUPERSET: 11,
  THREE_ONE_NESTED_PAIR_ONE_SEPARATE: 1,
});

console.log("PASS_VEN_001_AUTHORITY_TOPOLOGY_PROOF");
