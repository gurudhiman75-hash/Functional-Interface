import assert from "node:assert/strict";

import { NUM_CP013_PERMANENT_QL_IDS } from "../NUM-CP-013/permanent-allocation.ts";
import {
  NUM_CP014_ALLOCATION_STATUS,
  NUM_CP014_PERMANENT_ALLOCATION,
  NUM_CP014_PERMANENT_QL_IDS,
} from "./permanent-allocation.ts";
import { NUM_CP014_AUTHORITY_PROPOSAL, NUM_CP014_DISCOVERY_PROTOTYPE_IDS } from "./wave04/merge-split-proposal.ts";

assert.equal(NUM_CP014_PERMANENT_ALLOCATION.length, 6, "CP014 authority count drift");
assert.equal(new Set(NUM_CP014_PERMANENT_QL_IDS).size, 6, "CP014 permanent QLs are not unique");
assert.deepEqual(
  NUM_CP014_PERMANENT_QL_IDS,
  Array.from({ length: 6 }, (_, index) => `NUM-QL-${248 + index}`),
  "CP014 permanent range must be contiguous NUM-QL-248..253",
);
assert.equal(NUM_CP013_PERMANENT_QL_IDS.at(-1), "NUM-QL-247", "CP013 boundary drift");
assert.equal(NUM_CP014_PERMANENT_QL_IDS[0], "NUM-QL-248", "CP014 must start immediately after CP013");
assert.equal(NUM_CP014_ALLOCATION_STATUS.nextAvailableQl, "NUM-QL-254", "Next-free QL drift");
assert.equal(NUM_CP014_ALLOCATION_STATUS.approvedAuthorityCount, 6);
assert.equal(NUM_CP014_ALLOCATION_STATUS.discoveryPrototypeCount, 20);
assert.equal(NUM_CP014_ALLOCATION_STATUS.certifiedDiscoveryHead, "0d807794ce3fc9d3393df278b074c2fb4d65662d");
assert.equal(NUM_CP014_ALLOCATION_STATUS.certifiedCumulativeRun, 33144489296);
assert.equal(NUM_CP014_ALLOCATION_STATUS.sourceSelectionModel, "DECOUPLED_AUTHORITY_SEED_AND_SOURCE_SEED_V1");

const authorityIds = NUM_CP014_PERMANENT_ALLOCATION.map((item) => item.authorityId);
assert.deepEqual(authorityIds, NUM_CP014_AUTHORITY_PROPOSAL.map((item) => item.authorityId), "allocation authority order drifted from Wave04");
assert.equal(new Set(authorityIds).size, 6, "CP014 authority IDs are not unique");

const sourceCoverage = new Set(NUM_CP014_PERMANENT_ALLOCATION.flatMap((item) => [...item.sourcePrototypes]));
assert.deepEqual(
  [...sourceCoverage].sort(),
  [...NUM_CP014_DISCOVERY_PROTOTYPE_IDS].sort(),
  "Permanent map does not cover all 20 certified CP014 discovery prototypes",
);

for (const allocation of NUM_CP014_PERMANENT_ALLOCATION) {
  const proposal = NUM_CP014_AUTHORITY_PROPOSAL.find((item) => item.authorityId === allocation.authorityId);
  assert.ok(proposal, `${allocation.authorityId}: missing Wave04 proposal`);
  assert.deepEqual([...allocation.sourcePrototypes], [...proposal.sourcePrototypeIds], `${allocation.authorityId}: source prototype drift from Wave04`);
}

assert.equal(NUM_CP014_ALLOCATION_STATUS.questionStudioDiscoverable, false);
assert.equal(NUM_CP014_ALLOCATION_STATUS.questionBankWritable, false);
assert.equal(NUM_CP014_ALLOCATION_STATUS.testEligible, false);
assert.equal(NUM_CP014_ALLOCATION_STATUS.mockTestEligible, false);
assert.equal(NUM_CP014_ALLOCATION_STATUS.publiclyPublishable, false);
assert.equal(NUM_CP014_ALLOCATION_STATUS.automaticStudentPublication, false);

console.log(JSON.stringify({
  status: "PASS_NUM_CP014_PERMANENT_ALLOCATION",
  authorities: NUM_CP014_PERMANENT_ALLOCATION.length,
  permanentRange: `${NUM_CP014_PERMANENT_QL_IDS[0]}..${NUM_CP014_PERMANENT_QL_IDS.at(-1)}`,
  nextAvailableQl: NUM_CP014_ALLOCATION_STATUS.nextAvailableQl,
  discoveryPrototypeCoverage: sourceCoverage.size,
  certifiedDiscoveryHead: NUM_CP014_ALLOCATION_STATUS.certifiedDiscoveryHead,
  certifiedCumulativeRun: NUM_CP014_ALLOCATION_STATUS.certifiedCumulativeRun,
}, null, 2));
