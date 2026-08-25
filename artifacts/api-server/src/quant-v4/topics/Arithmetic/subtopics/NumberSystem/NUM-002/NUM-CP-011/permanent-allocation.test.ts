import assert from "node:assert/strict";

import {
  NUM_CP011_ALLOCATION_STATUS,
  NUM_CP011_PERMANENT_ALLOCATION,
  NUM_CP011_PERMANENT_QL_IDS,
} from "./permanent-allocation.ts";
import { NUM_CP011_WAVE01_PROTOTYPE_IDS } from "./wave01/types.ts";
import { NUM_CP011_WAVE02_PROTOTYPE_IDS } from "./wave02/types.ts";
import { NUM_CP011_WAVE03_PROTOTYPE_IDS } from "./wave03/types.ts";

const expectedQlIds = Array.from({ length: 13 }, (_, index) => `NUM-QL-${213 + index}`);
const expectedPrototypeIds = [
  ...NUM_CP011_WAVE01_PROTOTYPE_IDS,
  ...NUM_CP011_WAVE02_PROTOTYPE_IDS,
  ...NUM_CP011_WAVE03_PROTOTYPE_IDS,
];

assert.equal(NUM_CP011_PERMANENT_ALLOCATION.length, 13, "Expected exactly 13 permanent CP011 authorities");
assert.deepEqual(NUM_CP011_PERMANENT_QL_IDS, expectedQlIds, "CP011 permanent QL range must be NUM-QL-213..225");
assert.equal(new Set(NUM_CP011_PERMANENT_QL_IDS).size, 13, "Duplicate permanent QL identity");

const authorityIds = NUM_CP011_PERMANENT_ALLOCATION.map((item) => item.authorityId);
assert.equal(new Set(authorityIds).size, 13, "Duplicate permanent authority identity");

const assignedPrototypes = NUM_CP011_PERMANENT_ALLOCATION.flatMap((item) => [...item.sourcePrototypes]);
assert.equal(assignedPrototypes.length, 13, "Expected exactly 13 prototype assignments");
assert.equal(new Set(assignedPrototypes).size, 13, "A discovery prototype is assigned more than once");
assert.deepEqual([...assignedPrototypes].sort(), [...expectedPrototypeIds].sort(), "Every CP011 prototype must be allocated exactly once");

for (let index = 0; index < NUM_CP011_PERMANENT_ALLOCATION.length; index += 1) {
  const allocation = NUM_CP011_PERMANENT_ALLOCATION[index]!;
  assert.equal(allocation.qlId, `NUM-QL-${213 + index}`);
  assert.equal(allocation.authorityId, `NUM-CP011-AUTH-${String(index + 1).padStart(3, "0")}`);
  assert.equal(allocation.sourcePrototypes.length, 1, `${allocation.qlId}: CP011 final merge/split is one-to-one`);
  assert.equal(allocation.sourcePrototypes[0], `NUM-CP011-PROT-${String(index + 1).padStart(3, "0")}`);
}

assert.equal(NUM_CP011_ALLOCATION_STATUS.authorizationDate, "2026-08-23");
assert.equal(NUM_CP011_ALLOCATION_STATUS.authorizationStatus, "PROCEED_INSTRUCTION_AFTER_COUNT_PROPOSAL");
assert.equal(NUM_CP011_ALLOCATION_STATUS.approvedAuthorityCount, 13);
assert.equal(NUM_CP011_ALLOCATION_STATUS.firstPermanentQl, "NUM-QL-213");
assert.equal(NUM_CP011_ALLOCATION_STATUS.lastPermanentQl, "NUM-QL-225");
assert.equal(NUM_CP011_ALLOCATION_STATUS.nextAvailableQl, "NUM-QL-226");
assert.equal(NUM_CP011_ALLOCATION_STATUS.allocationState, "PERMANENT_ENGLISH_FREEZE_CANDIDATE");
assert.equal(NUM_CP011_ALLOCATION_STATUS.questionStudioDiscoverable, false);
assert.equal(NUM_CP011_ALLOCATION_STATUS.questionBankWritable, false);
assert.equal(NUM_CP011_ALLOCATION_STATUS.testEligible, false);
assert.equal(NUM_CP011_ALLOCATION_STATUS.publiclyPublishable, false);

console.log(JSON.stringify({
  status: "PASS_NUM_CP011_PERMANENT_ALLOCATION",
  permanentAuthorities: NUM_CP011_PERMANENT_ALLOCATION.length,
  firstQl: NUM_CP011_PERMANENT_QL_IDS[0],
  lastQl: NUM_CP011_PERMANENT_QL_IDS.at(-1),
  nextAvailableQl: NUM_CP011_ALLOCATION_STATUS.nextAvailableQl,
  sourcePrototypesAssignedExactlyOnce: assignedPrototypes.length,
}, null, 2));
