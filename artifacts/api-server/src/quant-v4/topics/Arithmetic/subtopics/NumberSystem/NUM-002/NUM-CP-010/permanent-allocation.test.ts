import assert from "node:assert/strict";

import {
  NUM_CP010_ALLOCATION_STATUS,
  NUM_CP010_PERMANENT_ALLOCATION,
  NUM_CP010_PERMANENT_QL_IDS,
} from "./permanent-allocation.ts";
import { NUM_CP010_ID_FREE_AUTHORITY_PROPOSAL } from "./post-wave04-authority-proposal.ts";

const expectedQlIds = Array.from({ length: 16 }, (_, index) => `NUM-QL-${197 + index}`);
const expectedPrototypeIds = Array.from({ length: 26 }, (_, index) =>
  `NUM-CP010-PROT-${String(index + 1).padStart(3, "0")}`,
);

assert.equal(NUM_CP010_PERMANENT_ALLOCATION.length, 16, "Expected 16 approved permanent authorities");
assert.deepEqual(NUM_CP010_PERMANENT_QL_IDS, expectedQlIds, "CP010 permanent QL range must be contiguous NUM-QL-197..212");
assert.equal(new Set(NUM_CP010_PERMANENT_QL_IDS).size, 16, "Duplicate permanent QL identity");

const authorityIds = NUM_CP010_PERMANENT_ALLOCATION.map((item) => item.authorityId);
assert.equal(new Set(authorityIds).size, 16, "Duplicate permanent authority identity");

const assignedPrototypes = NUM_CP010_PERMANENT_ALLOCATION.flatMap((item) => [...item.sourcePrototypes]);
assert.equal(assignedPrototypes.length, 26, "Expected exactly 26 source prototype assignments");
assert.equal(new Set(assignedPrototypes).size, 26, "A discovery prototype is assigned more than once");
assert.deepEqual([...assignedPrototypes].sort(), [...expectedPrototypeIds].sort(), "Every P001..P026 prototype must be allocated exactly once");

assert.equal(NUM_CP010_ID_FREE_AUTHORITY_PROPOSAL.length, 16, "Approved proposal count drift");
for (let index = 0; index < NUM_CP010_PERMANENT_ALLOCATION.length; index += 1) {
  const allocation = NUM_CP010_PERMANENT_ALLOCATION[index]!;
  const proposal = NUM_CP010_ID_FREE_AUTHORITY_PROPOSAL[index]!;
  assert.equal(allocation.label, proposal.label, `${allocation.qlId}: approved label drift`);
  assert.deepEqual(allocation.sourcePrototypes, proposal.prototypes, `${allocation.qlId}: approved prototype ancestry drift`);
  assert.equal(allocation.authorityId, `NUM-CP010-AUTH-${String(index + 1).padStart(3, "0")}`);
}

assert.equal(NUM_CP010_ALLOCATION_STATUS.approvalDate, "2026-08-22");
assert.equal(NUM_CP010_ALLOCATION_STATUS.approvalStatus, "EXPLICIT_COUNT_APPROVAL_RECEIVED");
assert.equal(NUM_CP010_ALLOCATION_STATUS.approvedAuthorityCount, 16);
assert.equal(NUM_CP010_ALLOCATION_STATUS.firstPermanentQl, "NUM-QL-197");
assert.equal(NUM_CP010_ALLOCATION_STATUS.lastPermanentQl, "NUM-QL-212");
assert.equal(NUM_CP010_ALLOCATION_STATUS.nextAvailableQl, "NUM-QL-213");
assert.equal(NUM_CP010_ALLOCATION_STATUS.permanentIdentitiesAllocated, true);
assert.equal(NUM_CP010_ALLOCATION_STATUS.englishRuntimeFrozen, true);
assert.equal(NUM_CP010_ALLOCATION_STATUS.active, false);
assert.equal(NUM_CP010_ALLOCATION_STATUS.questionStudioDiscoverable, false);
assert.equal(NUM_CP010_ALLOCATION_STATUS.questionBankWritable, false);
assert.equal(NUM_CP010_ALLOCATION_STATUS.testEligible, false);
assert.equal(NUM_CP010_ALLOCATION_STATUS.publiclyPublishable, false);

console.log(JSON.stringify({
  status: "PASS_NUM_CP010_PERMANENT_ALLOCATION",
  permanentAuthorities: NUM_CP010_PERMANENT_ALLOCATION.length,
  permanentRange: `${NUM_CP010_PERMANENT_QL_IDS[0]}..${NUM_CP010_PERMANENT_QL_IDS.at(-1)}`,
  prototypeAssignments: assignedPrototypes.length,
  uniquePrototypeAssignments: new Set(assignedPrototypes).size,
  nextAvailableQl: NUM_CP010_ALLOCATION_STATUS.nextAvailableQl,
  downstreamActivations: 0,
}, null, 2));
