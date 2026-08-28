import assert from "node:assert/strict";

import { NUM_CP012_PERMANENT_QL_IDS } from "../NUM-CP-012/permanent-allocation.ts";
import {
  NUM_CP013_ALLOCATION_STATUS,
  NUM_CP013_PERMANENT_ALLOCATION,
  NUM_CP013_PERMANENT_QL_IDS,
} from "./permanent-allocation.ts";
import { NUM_CP013_AUTHORITY_PROPOSAL, NUM_CP013_DISCOVERY_PROTOTYPE_IDS } from "./wave04/merge-split-proposal.ts";

assert.equal(NUM_CP013_PERMANENT_ALLOCATION.length, 11, "CP013 authority count drift");
assert.equal(new Set(NUM_CP013_PERMANENT_QL_IDS).size, 11, "CP013 permanent QLs are not unique");
assert.deepEqual(
  NUM_CP013_PERMANENT_QL_IDS,
  Array.from({ length: 11 }, (_, index) => `NUM-QL-${237 + index}`),
  "CP013 permanent range must be contiguous NUM-QL-237..247",
);
assert.equal(NUM_CP012_PERMANENT_QL_IDS.at(-1), "NUM-QL-236", "CP012 boundary drift");
assert.equal(NUM_CP013_PERMANENT_QL_IDS[0], "NUM-QL-237", "CP013 must start immediately after CP012");
assert.equal(NUM_CP013_ALLOCATION_STATUS.nextAvailableQl, "NUM-QL-248", "Next-free QL drift");
assert.equal(NUM_CP013_ALLOCATION_STATUS.approvedAuthorityCount, 11);
assert.equal(NUM_CP013_ALLOCATION_STATUS.discoveryPrototypeCount, 22);
assert.equal(NUM_CP013_ALLOCATION_STATUS.certifiedDiscoveryHead, "3025065dbe9ffbfc3ea6ab1554465fc129a4aa4b");

const authorityIds = NUM_CP013_PERMANENT_ALLOCATION.map((item) => item.authorityId);
assert.equal(new Set(authorityIds).size, 11, "CP013 authority IDs are not unique");
assert.deepEqual(
  authorityIds,
  Array.from({ length: 11 }, (_, index) => `NUM-CP013-AUTH-${String(index + 1).padStart(3, "0")}`),
  "CP013 authority sequence drift",
);
assert.deepEqual(
  authorityIds,
  NUM_CP013_AUTHORITY_PROPOSAL.map((item) => item.authorityId),
  "Permanent allocation authority order drifted from certified merge-split proposal",
);

const sourceCoverage = new Set(NUM_CP013_PERMANENT_ALLOCATION.flatMap((item) => [...item.sourcePrototypes]));
assert.deepEqual(
  [...sourceCoverage].sort(),
  [...NUM_CP013_DISCOVERY_PROTOTYPE_IDS].sort(),
  "Permanent authority map does not cover all 22 certified discovery prototypes",
);

for (const allocation of NUM_CP013_PERMANENT_ALLOCATION) {
  const proposal = NUM_CP013_AUTHORITY_PROPOSAL.find((item) => item.authorityId === allocation.authorityId);
  assert.ok(proposal, `${allocation.authorityId}: missing Wave04 proposal`);
  assert.equal(allocation.label, proposal.label, `${allocation.authorityId}: label drift from Wave04`);
  assert.deepEqual([...allocation.sourcePrototypes], [...proposal.sourcePrototypes], `${allocation.authorityId}: source prototype drift from Wave04`);
}

assert.equal(NUM_CP013_ALLOCATION_STATUS.questionStudioDiscoverable, false);
assert.equal(NUM_CP013_ALLOCATION_STATUS.questionBankWritable, false);
assert.equal(NUM_CP013_ALLOCATION_STATUS.testEligible, false);
assert.equal(NUM_CP013_ALLOCATION_STATUS.mockTestEligible, false);
assert.equal(NUM_CP013_ALLOCATION_STATUS.publiclyPublishable, false);
assert.equal(NUM_CP013_ALLOCATION_STATUS.automaticStudentPublication, false);

console.log(JSON.stringify({
  status: "PASS_NUM_CP013_PERMANENT_ALLOCATION",
  authorities: NUM_CP013_PERMANENT_ALLOCATION.length,
  permanentRange: `${NUM_CP013_PERMANENT_QL_IDS[0]}..${NUM_CP013_PERMANENT_QL_IDS.at(-1)}`,
  nextAvailableQl: NUM_CP013_ALLOCATION_STATUS.nextAvailableQl,
  discoveryPrototypeCoverage: sourceCoverage.size,
  certifiedDiscoveryHead: NUM_CP013_ALLOCATION_STATUS.certifiedDiscoveryHead,
}, null, 2));
