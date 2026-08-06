import assert from "node:assert/strict";
import { NUM_CP005_WAVE01_PROTOTYPE_IDS } from "../wave01/types";
import { NUM_CP005_WAVE02_PROTOTYPE_IDS } from "../wave02/types";
import { NUM_CP005_WAVE03_PROTOTYPE_IDS } from "../wave03/types";
import { NUM_CP005_WAVE04_PROTOTYPE_IDS } from "../wave04/types";
import {
  NUM_CP005_AUDIT_STATUS,
  NUM_CP005_PROPOSED_AUTHORITIES,
  NUM_CP005_SOURCE_GAP_DISPOSITIONS,
} from "./merge-split-registry";

const discoveredPrototypeIds = [
  ...NUM_CP005_WAVE01_PROTOTYPE_IDS,
  ...NUM_CP005_WAVE02_PROTOTYPE_IDS,
  ...NUM_CP005_WAVE03_PROTOTYPE_IDS,
  ...NUM_CP005_WAVE04_PROTOTYPE_IDS,
];
const dispositionedPrototypeIds = NUM_CP005_PROPOSED_AUTHORITIES.flatMap(
  (authority) => authority.prototypeIds,
);

assert.equal(discoveredPrototypeIds.length, 32);
assert.equal(new Set(discoveredPrototypeIds).size, 32);
assert.equal(dispositionedPrototypeIds.length, 32);
assert.equal(new Set(dispositionedPrototypeIds).size, 32,
  "Every temporary prototype must be dispositioned exactly once");
assert.deepEqual(
  [...dispositionedPrototypeIds].sort(),
  [...discoveredPrototypeIds].sort(),
  "The merge-split registry must cover the exact four-wave prototype inventory",
);

assert.equal(NUM_CP005_PROPOSED_AUTHORITIES.length, 24);
assert.equal(new Set(NUM_CP005_PROPOSED_AUTHORITIES.map((entry) => entry.proposalId)).size, 24);
assert.equal(
  NUM_CP005_PROPOSED_AUTHORITIES.filter((entry) => entry.disposition === "MERGE_AS_PARAMETERS").length,
  6,
);
assert.equal(
  NUM_CP005_PROPOSED_AUTHORITIES.filter((entry) => entry.disposition === "RETAIN").length,
  18,
);
assert.equal(
  NUM_CP005_PROPOSED_AUTHORITIES.reduce(
    (reduction, entry) => reduction + Math.max(0, entry.prototypeIds.length - 1),
    0,
  ),
  8,
);
assert.ok(NUM_CP005_PROPOSED_AUTHORITIES.every((entry) => entry.permanentQlId === null));
assert.ok(NUM_CP005_PROPOSED_AUTHORITIES.every((entry) => entry.title.length > 10));
assert.ok(NUM_CP005_PROPOSED_AUTHORITIES.every((entry) => entry.governingInvariant.length > 20));
assert.ok(NUM_CP005_PROPOSED_AUTHORITIES.every((entry) => entry.splitReason.length > 20));

const mergedGroups = NUM_CP005_PROPOSED_AUTHORITIES
  .filter((entry) => entry.disposition === "MERGE_AS_PARAMETERS")
  .map((entry) => [...entry.prototypeIds]);
assert.deepEqual(mergedGroups, [
  ["NUM-CP005-PROT-001", "NUM-CP005-PROT-002"],
  ["NUM-CP005-PROT-003", "NUM-CP005-PROT-004"],
  ["NUM-CP005-PROT-005", "NUM-CP005-PROT-009"],
  ["NUM-CP005-PROT-006", "NUM-CP005-PROT-010", "NUM-CP005-PROT-011"],
  ["NUM-CP005-PROT-007", "NUM-CP005-PROT-012"],
  ["NUM-CP005-PROT-016", "NUM-CP005-PROT-023", "NUM-CP005-PROT-024"],
]);

const routineRows = NUM_CP005_SOURCE_GAP_DISPOSITIONS.filter(
  (entry) => entry.status === "COVERED",
);
const openRoutineRows = NUM_CP005_SOURCE_GAP_DISPOSITIONS.filter(
  (entry) => entry.status.includes("OPEN"),
);
assert.equal(routineRows.length, 8);
assert.equal(openRoutineRows.length, 0);
assert.ok(NUM_CP005_SOURCE_GAP_DISPOSITIONS.some(
  (entry) => entry.status === "ADVANCED_ENRICHMENT_HOLD",
));
assert.ok(NUM_CP005_SOURCE_GAP_DISPOSITIONS.some(
  (entry) => entry.status === "REASSIGNED_TO_NUM_CP006",
));
assert.ok(NUM_CP005_SOURCE_GAP_DISPOSITIONS.some(
  (entry) => entry.status === "REASSIGNED_TO_NUM_CP012",
));
assert.ok(NUM_CP005_SOURCE_GAP_DISPOSITIONS.some(
  (entry) => entry.status === "REASSIGNED_TO_PNC",
));

assert.deepEqual(NUM_CP005_AUDIT_STATUS, {
  discoveredPrototypeCount: 32,
  proposedAuthorityCount: 24,
  mergedAuthorityCount: 6,
  singletonAuthorityCount: 18,
  prototypeReduction: 8,
  permanentQlCount: 0,
  nextAvailableQl: "NUM-QL-046",
  proposalStatus: "AWAITING_EXPLICIT_COUNT_APPROVAL",
  routineSourceGapCount: 0,
});

console.log(JSON.stringify({
  status: "PASS_NUM_CP005_SOURCE_GAP_MERGE_SPLIT_AUDIT",
  discoveredPrototypeCount: discoveredPrototypeIds.length,
  proposedAuthorityCount: NUM_CP005_PROPOSED_AUTHORITIES.length,
  mergedAuthorityCount: NUM_CP005_AUDIT_STATUS.mergedAuthorityCount,
  singletonAuthorityCount: NUM_CP005_AUDIT_STATUS.singletonAuthorityCount,
  prototypeReduction: NUM_CP005_AUDIT_STATUS.prototypeReduction,
  routineSourceGapCount: NUM_CP005_AUDIT_STATUS.routineSourceGapCount,
  mergedGroups,
  advancedOrOwnershipDispositions: NUM_CP005_SOURCE_GAP_DISPOSITIONS
    .filter((entry) => entry.status !== "COVERED"),
  permanentQlCount: 0,
  nextAvailableQl: NUM_CP005_AUDIT_STATUS.nextAvailableQl,
  proposalStatus: NUM_CP005_AUDIT_STATUS.proposalStatus,
}, null, 2));
