import assert from "node:assert/strict";

import {
  RNK_OBJECT_POOL_V2_EXPECTED_SHA256,
  RNK_OBJECT_POOL_V2_MANIFEST_VERSION,
  rnkObjectPoolV2ManifestSha256,
} from "./rnk-object-pool-v2-manifest";

const digest = rnkObjectPoolV2ManifestSha256();
assert.match(digest, /^[a-f0-9]{64}$/);
const pinned = RNK_OBJECT_POOL_V2_EXPECTED_SHA256 !== "UNPINNED";
if (pinned) assert.equal(digest, RNK_OBJECT_POOL_V2_EXPECTED_SHA256);

console.log(JSON.stringify({
  status: "PASS",
  manifestVersion: RNK_OBJECT_POOL_V2_MANIFEST_VERSION,
  digest,
  pinned,
}, null, 2));
