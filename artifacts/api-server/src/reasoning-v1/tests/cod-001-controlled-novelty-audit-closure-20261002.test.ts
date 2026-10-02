import assert from "node:assert/strict";

import { REASONING_V1_NOVELTY_INVENTORY_V1 } from "../shared/reasoning-novelty-inventory-v1";
import { REASONING_V1_NOVELTY_PROVIDERS_V1 } from "../shared/reasoning-novelty-provider-registry-v1";
import { COD_SOURCE_GAP_PERMANENT_CONTRACTS } from "../topics/Coding-Decoding/COD-001/source-gap-permanent-contracts";

const inventory = REASONING_V1_NOVELTY_INVENTORY_V1.find(
  (entry) => entry.topicDirectory === "Coding-Decoding",
);

assert.ok(inventory, "Coding-Decoding novelty inventory entry missing");
assert.equal(inventory?.chapterId, "COD-001");
assert.equal(
  inventory?.status,
  "DEDICATED_NOVELTY_AUDIT_COMPLETE_NO_ADMISSIBLE_PROVIDER",
);
assert.equal(inventory?.countsTowardControlledNovelTargetNow, false);
assert.ok((inventory?.evidence.length ?? 0) >= 4);

const codProviders = REASONING_V1_NOVELTY_PROVIDERS_V1.filter(
  (provider) => provider.chapterId === "COD-001",
);
assert.deepEqual(
  codProviders,
  [],
  "COD-001 must not gain a controlled-novel provider without reopening its explicit audit authority.",
);

assert.deepEqual(
  COD_SOURCE_GAP_PERMANENT_CONTRACTS.map((contract) => contract.qlId),
  ["COD-QL-200", "COD-QL-201", "COD-QL-202", "COD-QL-203"],
);

console.log(JSON.stringify({
  status: "PASS_COD_001_CONTROLLED_NOVELTY_AUDIT_CLOSURE_20261002",
  noveltyStatus: inventory?.status,
  providerCount: codProviders.length,
  sourceGapQls: COD_SOURCE_GAP_PERMANENT_CONTRACTS.map((contract) => contract.qlId),
}, null, 2));
