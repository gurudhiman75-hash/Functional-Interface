import assert from "node:assert/strict";

import { REASONING_V1_NOVELTY_INVENTORY_V1 } from "../shared/reasoning-novelty-inventory-v1";
import { REASONING_V1_NOVELTY_PROVIDERS_V1 } from "../shared/reasoning-novelty-provider-registry-v1";
import { DSF_CURRENT_NEXT_AVAILABLE_QL_ID } from "../topics/Data-Sufficiency/DSF-001/foundation/current-permanent-ql-registry";
import { DSF_CP015_THREE_STATEMENT_SEMANTIC_KEYS } from "../topics/Data-Sufficiency/DSF-001/DSF-CP-015/three-statement-answer-profile";
import { DSF_CP028_REASONING_QL002_DOMAINS } from "../topics/Data-Sufficiency/DSF-001/DSF-CP-028/reasoning-ql002-consolidation-v1";

const inventory = REASONING_V1_NOVELTY_INVENTORY_V1.find(
  (entry) => entry.topicDirectory === "Data-Sufficiency",
);

assert.ok(inventory, "Data Sufficiency novelty inventory entry missing");
assert.equal(inventory?.chapterId, "DSF-001");
assert.equal(
  inventory?.status,
  "DEDICATED_NOVELTY_AUDIT_COMPLETE_NO_ADMISSIBLE_PROVIDER",
);
assert.equal(inventory?.countsTowardControlledNovelTargetNow, false);
assert.ok((inventory?.evidence.length ?? 0) >= 4);

const dsfProviders = REASONING_V1_NOVELTY_PROVIDERS_V1.filter(
  (provider) => provider.chapterId === "DSF-001",
);
assert.deepEqual(
  dsfProviders,
  [],
  "DSF-001 must not gain a controlled-novel provider without reopening its explicit audit authority.",
);

assert.equal(DSF_CURRENT_NEXT_AVAILABLE_QL_ID, "DSF-QL-003");
assert.equal(DSF_CP015_THREE_STATEMENT_SEMANTIC_KEYS.length, 19);
assert.equal(DSF_CP028_REASONING_QL002_DOMAINS.length, 7);

for (const key of [
  "I|II|III",
  "I+II|I+III|II+III",
  "I+II+III",
  "I|II+III",
  "II|I+III",
  "III|I+II",
]) {
  assert.ok(
    (DSF_CP015_THREE_STATEMENT_SEMANTIC_KEYS as readonly string[]).includes(key),
    "Expected frozen DSF semantic topology missing: " + key,
  );
}

console.log(JSON.stringify({
  status: "PASS_DSF_001_CONTROLLED_NOVELTY_AUDIT_CLOSURE_20261002",
  noveltyStatus: inventory?.status,
  providerCount: dsfProviders.length,
  nextQlId: DSF_CURRENT_NEXT_AVAILABLE_QL_ID,
  semanticStateCount: DSF_CP015_THREE_STATEMENT_SEMANTIC_KEYS.length,
  ql002ReasoningDomainCount: DSF_CP028_REASONING_QL002_DOMAINS.length,
}, null, 2));
