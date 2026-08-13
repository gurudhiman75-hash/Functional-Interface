import assert from "node:assert/strict";
import { NUM_CP001_WAVE01_PROTOTYPE_IDS } from "../wave01/types";
import { NUM_CP001_WAVE02_PROTOTYPE_IDS } from "../wave02/types";
import { NUM_CP001_WAVE03_PROTOTYPE_IDS } from "../wave03/types";
import { NUM_CP001_WAVE04_PROTOTYPE_IDS } from "../wave04/types";
import {
  NUM_CP001_AUDIT_STATUS,
  NUM_CP001_PROPOSED_AUTHORITIES,
} from "./merge-split-registry";

const discoveredPrototypeIds = [
  ...NUM_CP001_WAVE01_PROTOTYPE_IDS,
  ...NUM_CP001_WAVE02_PROTOTYPE_IDS,
  ...NUM_CP001_WAVE03_PROTOTYPE_IDS,
  ...NUM_CP001_WAVE04_PROTOTYPE_IDS,
];
const dispositionedPrototypeIds = NUM_CP001_PROPOSED_AUTHORITIES.flatMap(
  (authority) => authority.prototypeIds,
);

assert.equal(discoveredPrototypeIds.length, 26);
assert.equal(new Set(discoveredPrototypeIds).size, 26);
assert.equal(dispositionedPrototypeIds.length, 26);
assert.equal(
  new Set(dispositionedPrototypeIds).size,
  26,
  "Every temporary prototype must be dispositioned exactly once",
);
assert.deepEqual(
  [...dispositionedPrototypeIds].sort(),
  [...discoveredPrototypeIds].sort(),
  "The merge-split proposal must cover the exact four-wave prototype inventory",
);

assert.equal(NUM_CP001_PROPOSED_AUTHORITIES.length, 21);
assert.equal(
  new Set(NUM_CP001_PROPOSED_AUTHORITIES.map((entry) => entry.proposalId)).size,
  21,
);
assert.equal(
  NUM_CP001_PROPOSED_AUTHORITIES.filter((entry) => entry.disposition === "MERGE_AS_PARAMETERS").length,
  4,
);
assert.equal(
  NUM_CP001_PROPOSED_AUTHORITIES.filter((entry) => entry.disposition === "RETAIN").length,
  17,
);
assert.equal(
  NUM_CP001_PROPOSED_AUTHORITIES.reduce(
    (reduction, entry) => reduction + Math.max(0, entry.prototypeIds.length - 1),
    0,
  ),
  5,
);
assert.ok(NUM_CP001_PROPOSED_AUTHORITIES.every((entry) => entry.permanentQlId === null));
assert.ok(NUM_CP001_PROPOSED_AUTHORITIES.every((entry) => entry.title.length > 12));
assert.ok(NUM_CP001_PROPOSED_AUTHORITIES.every((entry) => entry.governingInvariant.length > 35));
assert.ok(NUM_CP001_PROPOSED_AUTHORITIES.every((entry) => entry.splitReason.length > 35));

const mergedGroups = NUM_CP001_PROPOSED_AUTHORITIES
  .filter((entry) => entry.disposition === "MERGE_AS_PARAMETERS")
  .map((entry) => [...entry.prototypeIds]);
assert.deepEqual(mergedGroups, [
  ["NUM-CP001-PROT-003", "NUM-CP001-PROT-018"],
  ["NUM-CP001-PROT-005", "NUM-CP001-PROT-011"],
  ["NUM-CP001-PROT-008", "NUM-CP001-PROT-016", "NUM-CP001-PROT-021"],
  ["NUM-CP001-PROT-015", "NUM-CP001-PROT-020"],
]);

const singletonPrototypeIds = NUM_CP001_PROPOSED_AUTHORITIES
  .filter((entry) => entry.disposition === "RETAIN")
  .map((entry) => entry.prototypeIds[0]);
assert.equal(singletonPrototypeIds.length, 17);
assert.ok(singletonPrototypeIds.includes("NUM-CP001-PROT-001"));
assert.ok(singletonPrototypeIds.includes("NUM-CP001-PROT-004"));
assert.ok(singletonPrototypeIds.includes("NUM-CP001-PROT-012"));
assert.ok(singletonPrototypeIds.includes("NUM-CP001-PROT-014"));
assert.ok(singletonPrototypeIds.includes("NUM-CP001-PROT-017"));
assert.ok(singletonPrototypeIds.includes("NUM-CP001-PROT-019"));
assert.ok(singletonPrototypeIds.includes("NUM-CP001-PROT-022"));
assert.ok(singletonPrototypeIds.includes("NUM-CP001-PROT-023"));
assert.ok(singletonPrototypeIds.includes("NUM-CP001-PROT-024"));
assert.ok(singletonPrototypeIds.includes("NUM-CP001-PROT-025"));
assert.ok(singletonPrototypeIds.includes("NUM-CP001-PROT-026"));

assert.deepEqual(NUM_CP001_AUDIT_STATUS, {
  discoveredPrototypeCount: 26,
  proposedAuthorityCount: 21,
  mergedAuthorityCount: 4,
  singletonAuthorityCount: 17,
  prototypeReduction: 5,
  permanentQlCount: 0,
  nextAvailableQl: "NUM-QL-124",
  proposalStatus: "AWAITING_EXPLICIT_COUNT_APPROVAL",
  routineSourceGapCount: 0,
});

console.log(JSON.stringify({
  status: "PASS_NUM_CP001_WAVE05_MERGE_SPLIT_AUDIT",
  discoveredPrototypeCount: discoveredPrototypeIds.length,
  proposedAuthorityCount: NUM_CP001_AUDIT_STATUS.proposedAuthorityCount,
  mergedAuthorityCount: NUM_CP001_AUDIT_STATUS.mergedAuthorityCount,
  singletonAuthorityCount: NUM_CP001_AUDIT_STATUS.singletonAuthorityCount,
  prototypeReduction: NUM_CP001_AUDIT_STATUS.prototypeReduction,
  mergedGroups,
  permanentQlCount: NUM_CP001_AUDIT_STATUS.permanentQlCount,
  nextAvailableQl: NUM_CP001_AUDIT_STATUS.nextAvailableQl,
  proposalStatus: NUM_CP001_AUDIT_STATUS.proposalStatus,
  routineSourceGapCount: NUM_CP001_AUDIT_STATUS.routineSourceGapCount,
}, null, 2));