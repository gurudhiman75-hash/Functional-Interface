import assert from "node:assert/strict";
import { NUM_CP008_PROPOSED_AUTHORITIES } from "./post-wave04-authority-proposal.ts";
import { NUM_CP008_ALLOCATION_STATUS, NUM_CP008_PERMANENT_ALLOCATION } from "./permanent-allocation.ts";

assert.equal(NUM_CP008_PERMANENT_ALLOCATION.length, 19);
assert.equal(new Set(NUM_CP008_PERMANENT_ALLOCATION.map((item) => item.qlId)).size, 19);
assert.equal(new Set(NUM_CP008_PERMANENT_ALLOCATION.map((item) => item.authorityId)).size, 19);
assert.deepEqual(
  NUM_CP008_PERMANENT_ALLOCATION.map((item) => item.qlId),
  Array.from({ length: 19 }, (_, index) => `NUM-QL-${String(166 + index).padStart(3, "0")}`),
);

for (let index = 0; index < NUM_CP008_PERMANENT_ALLOCATION.length; index += 1) {
  const allocated = NUM_CP008_PERMANENT_ALLOCATION[index]!;
  const approved = NUM_CP008_PROPOSED_AUTHORITIES[index]!;
  assert.equal(allocated.authorityId, approved.authorityId);
  assert.equal(allocated.label, approved.label);
  assert.deepEqual([...allocated.prototypes], [...approved.prototypes]);
}

const flattened = NUM_CP008_PERMANENT_ALLOCATION.flatMap((item) => [...item.prototypes]);
assert.equal(flattened.length, 26);
assert.equal(new Set(flattened).size, 26);

assert.equal(NUM_CP008_ALLOCATION_STATUS.approvalStatus, "EXPLICIT_COUNT_APPROVAL_RECEIVED");
assert.equal(NUM_CP008_ALLOCATION_STATUS.permanentQlCount, 19);
assert.equal(NUM_CP008_ALLOCATION_STATUS.firstPermanentQl, "NUM-QL-166");
assert.equal(NUM_CP008_ALLOCATION_STATUS.lastPermanentQl, "NUM-QL-184");
assert.equal(NUM_CP008_ALLOCATION_STATUS.nextAvailableQl, "NUM-QL-185");
assert.equal(NUM_CP008_ALLOCATION_STATUS.permanentIdentitiesAllocated, true);
assert.equal(NUM_CP008_ALLOCATION_STATUS.englishRuntimeFrozen, false);
for (const locked of [
  NUM_CP008_ALLOCATION_STATUS.active,
  NUM_CP008_ALLOCATION_STATUS.questionStudioDiscoverable,
  NUM_CP008_ALLOCATION_STATUS.questionBankWritable,
  NUM_CP008_ALLOCATION_STATUS.testEligible,
  NUM_CP008_ALLOCATION_STATUS.publiclyPublishable,
]) assert.equal(locked, false);

console.log(JSON.stringify({
  status: "PASS_NUM_CP008_PERMANENT_ALLOCATION",
  permanentQlCount: NUM_CP008_PERMANENT_ALLOCATION.length,
  firstPermanentQl: NUM_CP008_ALLOCATION_STATUS.firstPermanentQl,
  lastPermanentQl: NUM_CP008_ALLOCATION_STATUS.lastPermanentQl,
  nextAvailableQl: NUM_CP008_ALLOCATION_STATUS.nextAvailableQl,
  sourcePrototypeCount: flattened.length,
}, null, 2));
