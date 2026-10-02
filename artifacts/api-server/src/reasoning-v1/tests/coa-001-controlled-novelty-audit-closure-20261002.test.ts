import assert from "node:assert/strict";

import { REASONING_V1_NOVELTY_INVENTORY_V1 } from "../shared/reasoning-novelty-inventory-v1";
import { REASONING_V1_NOVELTY_PROVIDERS_V1 } from "../shared/reasoning-novelty-provider-registry-v1";
import {
  COA_CP006_OWNED_QL_IDS,
  COA_CP007_OWNED_QL_IDS,
} from "../topics/Course-of-Action/COA-001/english-authorities";

const inventory = REASONING_V1_NOVELTY_INVENTORY_V1.find(
  (entry) => entry.topicDirectory === "Course-of-Action",
);

assert.ok(inventory, "Course-of-Action novelty inventory entry missing");
assert.equal(inventory?.chapterId, "COA-001");
assert.equal(
  inventory?.status,
  "DEDICATED_NOVELTY_AUDIT_COMPLETE_NO_ADMISSIBLE_PROVIDER",
);
assert.equal(inventory?.countsTowardControlledNovelTargetNow, false);
assert.ok((inventory?.evidence.length ?? 0) >= 4);

const coaProviders = REASONING_V1_NOVELTY_PROVIDERS_V1.filter(
  (provider) => provider.chapterId === "COA-001",
);
assert.deepEqual(
  coaProviders,
  [],
  "COA-001 must not gain a controlled-novel provider without reopening its explicit audit authority.",
);

assert.deepEqual(COA_CP006_OWNED_QL_IDS, ["COA-QL-008"]);
assert.deepEqual(COA_CP007_OWNED_QL_IDS, ["COA-QL-009"]);

console.log(JSON.stringify({
  status: "PASS_COA_001_CONTROLLED_NOVELTY_AUDIT_CLOSURE_20261002",
  noveltyStatus: inventory?.status,
  providerCount: coaProviders.length,
  orderedReasoningQls: COA_CP006_OWNED_QL_IDS,
  integratedReasoningQls: COA_CP007_OWNED_QL_IDS,
}, null, 2));
