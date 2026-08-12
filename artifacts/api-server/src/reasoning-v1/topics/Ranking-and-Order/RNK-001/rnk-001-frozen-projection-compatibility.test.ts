import assert from "node:assert/strict";

import {
  RNK_CP004_EXPECTED_PROJECTION_SHA256,
  RNK_CP004_PERMANENT_AUTHORITY_ASSIGNMENTS,
} from "./RNK-CP-004/cp004-permanent-runtime-v1";
import {
  RNK_CP005_EXPECTED_PERMANENT_PROJECTION_SHA256,
  RNK_CP005_PERMANENT_AUTHORITY_ASSIGNMENTS,
} from "./RNK-CP-005/cp005-permanent-runtime-v1";
import {
  RNK_CP006_EXPECTED_PERMANENT_PROJECTION_SHA256,
  RNK_CP006_PERMANENT_AUTHORITY_ASSIGNMENTS,
} from "./RNK-CP-006/cp006-permanent-runtime-v1";
import { RNK_PERSON_POOL_V2 } from "./foundation/rnk-object-pool-v2";

// This manifest gate is deliberately cheap. The exact frozen runtimes are
// independently rebuilt and hash-checked by their dedicated freeze tests in
// the same workflow. Rebuilding all three here would duplicate that work.
assert.equal(RNK_CP004_EXPECTED_PROJECTION_SHA256, "39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f");
assert.equal(RNK_CP005_EXPECTED_PERMANENT_PROJECTION_SHA256, "f6759445937626e6777f322f9b8217bc7aaa12f6a96ee180a24ca3350bd42717");
assert.equal(RNK_CP006_EXPECTED_PERMANENT_PROJECTION_SHA256, "7043ecd80798ed9b60529d6052f4bc6fd4e678a98d06cc3e0332a3d10028d819");
assert.equal(RNK_CP004_PERMANENT_AUTHORITY_ASSIGNMENTS.length, 9);
assert.equal(RNK_CP005_PERMANENT_AUTHORITY_ASSIGNMENTS.length, 3);
assert.equal(RNK_CP006_PERMANENT_AUTHORITY_ASSIGNMENTS.length, 3);
assert.ok(RNK_PERSON_POOL_V2.length >= 96);

console.log(JSON.stringify({
  status: "PASS",
  expandedPoolPeople: RNK_PERSON_POOL_V2.length,
  frozenProjectionAdoption: false,
  dedicatedRuntimeRebuildsRequired: true,
  frozenProjectionManifest: {
    cp004: RNK_CP004_EXPECTED_PROJECTION_SHA256,
    cp005: RNK_CP005_EXPECTED_PERMANENT_PROJECTION_SHA256,
    cp006: RNK_CP006_EXPECTED_PERMANENT_PROJECTION_SHA256,
  },
}, null, 2));
