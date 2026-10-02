import assert from "node:assert/strict";

import { REASONING_V1_NOVELTY_INVENTORY_V1 } from "../shared/reasoning-novelty-inventory-v1";
import { REASONING_V1_NOVELTY_PROVIDERS_V1 } from "../shared/reasoning-novelty-provider-registry-v1";
import { CLS_CP001_PERMANENT_CONTRACTS } from "../topics/Classification/CLS-001/CLS-CP-001/cp001-permanent-contracts";
import { CLS_CP007_PERMANENT_QLS } from "../topics/Classification/CLS-001/CLS-CP-007/cp007-english-contracts";

const inventory = REASONING_V1_NOVELTY_INVENTORY_V1.find(
  (entry) => entry.topicDirectory === "Classification",
);

assert.ok(inventory, "Classification novelty inventory entry missing");
assert.equal(inventory?.chapterId, "CLS-001");
assert.equal(
  inventory?.status,
  "DEDICATED_NOVELTY_AUDIT_COMPLETE_NO_ADMISSIBLE_PROVIDER",
);
assert.equal(inventory?.countsTowardControlledNovelTargetNow, false);
assert.ok((inventory?.evidence.length ?? 0) >= 4);

const clsProviders = REASONING_V1_NOVELTY_PROVIDERS_V1.filter(
  (provider) => provider.chapterId === "CLS-001",
);
assert.deepEqual(
  clsProviders,
  [],
  "CLS-001 must not gain a controlled-novel provider without reopening its explicit audit authority.",
);

assert.deepEqual(
  CLS_CP001_PERMANENT_CONTRACTS.map((contract) => contract.qlId),
  ["CLS-QL-001", "CLS-QL-002", "CLS-QL-003"],
);
assert.deepEqual(CLS_CP007_PERMANENT_QLS, ["CLS-QL-012", "CLS-QL-013"]);

console.log(JSON.stringify({
  status: "PASS_CLS_001_CONTROLLED_NOVELTY_AUDIT_CLOSURE_20261002",
  noveltyStatus: inventory?.status,
  providerCount: clsProviders.length,
  cp001PermanentContracts: CLS_CP001_PERMANENT_CONTRACTS.map((contract) => contract.qlId),
  cp007PermanentQls: CLS_CP007_PERMANENT_QLS,
}, null, 2));
