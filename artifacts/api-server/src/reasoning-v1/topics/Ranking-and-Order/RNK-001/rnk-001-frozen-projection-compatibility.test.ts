import assert from "node:assert/strict";

import {
  buildRnkCp004PermanentRuntime,
  RNK_CP004_EXPECTED_PROJECTION_SHA256,
  rnkCp004PermanentProjectionSha256,
} from "./RNK-CP-004/cp004-permanent-runtime-v1";
import {
  buildRnkCp005PermanentRuntime,
  RNK_CP005_EXPECTED_PERMANENT_PROJECTION_SHA256,
  rnkCp005PermanentProjectionSha256,
} from "./RNK-CP-005/cp005-permanent-runtime-v1";
import {
  buildRnkCp006PermanentRuntime,
  RNK_CP006_EXPECTED_PERMANENT_PROJECTION_SHA256,
  rnkCp006PermanentProjectionSha256,
} from "./RNK-CP-006/cp006-permanent-runtime-v1";
import { RNK_PERSON_POOL_V2 } from "./foundation/rnk-object-pool-v2";

const cp004 = buildRnkCp004PermanentRuntime();
const cp005 = buildRnkCp005PermanentRuntime();
const cp006 = buildRnkCp006PermanentRuntime();

const cp004Projection = rnkCp004PermanentProjectionSha256(cp004);
const cp005Projection = rnkCp005PermanentProjectionSha256(cp005);
const cp006Projection = rnkCp006PermanentProjectionSha256(cp006);

assert.equal(cp004.length, 1728);
assert.equal(cp005.length, 576);
assert.equal(cp006.length, 576);
assert.equal(cp004Projection, RNK_CP004_EXPECTED_PROJECTION_SHA256);
assert.equal(cp005Projection, RNK_CP005_EXPECTED_PERMANENT_PROJECTION_SHA256);
assert.equal(cp006Projection, RNK_CP006_EXPECTED_PERMANENT_PROJECTION_SHA256);
assert.ok(RNK_PERSON_POOL_V2.length >= 96);

console.log(JSON.stringify({
  status: "PASS",
  expandedPoolPeople: RNK_PERSON_POOL_V2.length,
  frozenProjectionAdoption: false,
  frozenRuntimes: {
    cp004: { questions: cp004.length, projection: cp004Projection },
    cp005: { questions: cp005.length, projection: cp005Projection },
    cp006: { questions: cp006.length, projection: cp006Projection },
  },
}, null, 2));
