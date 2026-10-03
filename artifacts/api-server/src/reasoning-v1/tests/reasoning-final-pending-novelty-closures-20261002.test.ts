import assert from "node:assert/strict";

import { REASONING_V1_NOVELTY_INVENTORY_V1 } from "../shared/reasoning-novelty-inventory-v1";
import { REASONING_V1_NOVELTY_PROVIDERS_V1 } from "../shared/reasoning-novelty-provider-registry-v1";
import {
  SER_PERMANENT_QL_IDS_V4,
  SER_PERMANENT_QL_REGISTRY_V4_STATE,
} from "../topics/Series/SER-001/SER-PERMANENT-QL-REGISTRY-V4";

const closedTopics = [
  ["Data-Sufficiency", "DSF-001"],
  ["InputOutput", "IOP-001"],
  ["Missing-Number", "MIS-001"],
  ["SeatingArrangement", "SEA-001 / SEA-002 / SEA-003"],
  ["Series", "SER-001"],
  ["Statement-and-Assumption", "STA-001"],
  ["Statement-and-Conclusion", "STC-001"],
  ["Syllogism", "SYL-001"],
  ["Word-Dictionary-Order", "WOR-001"],
  ["Word-Formation", "WFM-001"],
] as const;

const pending = REASONING_V1_NOVELTY_INVENTORY_V1.filter(
  (entry) => entry.status === "DEDICATED_NOVELTY_AUDIT_PENDING",
);
assert.deepEqual(
  pending,
  [],
  "No dedicated novelty audit may remain pending after the final batch closure.",
);

for (const [topicDirectory, chapterId] of closedTopics) {
  const entry = REASONING_V1_NOVELTY_INVENTORY_V1.find(
    (candidate) => candidate.topicDirectory === topicDirectory,
  );
  assert.ok(entry, `Missing novelty inventory entry for ${topicDirectory}`);
  assert.equal(entry?.chapterId, chapterId);
  assert.equal(
    entry?.status,
    "DEDICATED_NOVELTY_AUDIT_COMPLETE_NO_ADMISSIBLE_PROVIDER",
  );
  assert.equal(entry?.countsTowardControlledNovelTargetNow, false);
  assert.ok((entry?.evidence.length ?? 0) >= 3);

  const providers = REASONING_V1_NOVELTY_PROVIDERS_V1.filter(
    (provider) => provider.chapterId === chapterId,
  );
  assert.deepEqual(
    providers,
    [],
    `${chapterId} must not gain a controlled-novel provider without explicit audit reopening.`,
  );
}

const series = REASONING_V1_NOVELTY_INVENTORY_V1.find(
  (entry) => entry.topicDirectory === "Series",
);
assert.ok(series, "Series novelty inventory entry must exist.");
assert.equal(SER_PERMANENT_QL_IDS_V4.length, 29);
assert.equal(SER_PERMANENT_QL_REGISTRY_V4_STATE.allocatedRange, "SER-QL-001..SER-QL-029");
assert.equal(SER_PERMANENT_QL_REGISTRY_V4_STATE.nextAvailableId, "SER-QL-030");
assert.ok(
  series?.evidence.some((line) => line.includes("SER-QL-014..029")),
  "Series inventory must acknowledge the completed 16-QL source-backed promotion.",
);
assert.ok(
  series?.nextGate.includes("Source-backed promotion is complete"),
  "Series next gate must not claim that the already-completed promotion is still pending.",
);

console.log(JSON.stringify({
  status: "PASS_REASONING_FINAL_PENDING_NOVELTY_CLOSURES_20261002",
  inventoryCount: REASONING_V1_NOVELTY_INVENTORY_V1.length,
  dedicatedPendingCount: pending.length,
  batchClosedTopics: closedTopics.map(([topic]) => topic),
  noveltyProviderCount: REASONING_V1_NOVELTY_PROVIDERS_V1.length,
}, null, 2));
