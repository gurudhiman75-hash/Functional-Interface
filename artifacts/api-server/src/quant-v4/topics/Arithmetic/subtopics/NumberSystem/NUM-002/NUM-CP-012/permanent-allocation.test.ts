import assert from "node:assert/strict";

import { NUM_CP011_PERMANENT_QL_IDS } from "../NUM-CP-011/permanent-allocation.ts";
import {
  NUM_CP012_ALLOCATION_STATUS,
  NUM_CP012_PERMANENT_ALLOCATION,
  NUM_CP012_PERMANENT_QL_IDS,
} from "./permanent-allocation.ts";

assert.equal(NUM_CP012_PERMANENT_ALLOCATION.length, 11, "CP012 authority count drift");
assert.equal(new Set(NUM_CP012_PERMANENT_QL_IDS).size, 11, "CP012 permanent QLs are not unique");
assert.deepEqual(
  NUM_CP012_PERMANENT_QL_IDS,
  Array.from({ length: 11 }, (_, index) => `NUM-QL-${226 + index}`),
  "CP012 permanent range must be contiguous NUM-QL-226..236",
);
assert.equal(NUM_CP011_PERMANENT_QL_IDS.at(-1), "NUM-QL-225", "CP011 boundary drift");
assert.equal(NUM_CP012_PERMANENT_QL_IDS[0], "NUM-QL-226", "CP012 must start immediately after CP011");
assert.equal(NUM_CP012_ALLOCATION_STATUS.nextAvailableQl, "NUM-QL-237", "Next-free QL drift");
assert.equal(NUM_CP012_ALLOCATION_STATUS.approvedAuthorityCount, 11);

const authorityIds = NUM_CP012_PERMANENT_ALLOCATION.map((item) => item.authorityId);
assert.equal(new Set(authorityIds).size, 11, "CP012 authority IDs are not unique");
assert.deepEqual(
  authorityIds,
  Array.from({ length: 11 }, (_, index) => `NUM-CP012-AUTH-${String(index + 1).padStart(3, "0")}`),
  "CP012 authority sequence drift",
);

const sourceCoverage = new Set(NUM_CP012_PERMANENT_ALLOCATION.flatMap((item) => [...item.sourcePrototypes]));
assert.deepEqual(
  [...sourceCoverage].sort(),
  Array.from({ length: 14 }, (_, index) => `NUM-CP012-PROT-${String(index + 1).padStart(3, "0")}`),
  "Permanent authority map does not cover all 14 retained discovery prototypes",
);

assert.equal(NUM_CP012_ALLOCATION_STATUS.questionStudioDiscoverable, false);
assert.equal(NUM_CP012_ALLOCATION_STATUS.questionBankWritable, false);
assert.equal(NUM_CP012_ALLOCATION_STATUS.testEligible, false);
assert.equal(NUM_CP012_ALLOCATION_STATUS.publiclyPublishable, false);

console.log(JSON.stringify({
  status: "PASS_NUM_CP012_PERMANENT_ALLOCATION",
  authorities: NUM_CP012_PERMANENT_ALLOCATION.length,
  permanentRange: `${NUM_CP012_PERMANENT_QL_IDS[0]}..${NUM_CP012_PERMANENT_QL_IDS.at(-1)}`,
  nextAvailableQl: NUM_CP012_ALLOCATION_STATUS.nextAvailableQl,
  discoveryPrototypeCoverage: sourceCoverage.size,
}, null, 2));
