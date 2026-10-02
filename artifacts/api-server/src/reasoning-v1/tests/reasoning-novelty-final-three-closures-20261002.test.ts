import assert from "node:assert/strict";
import { REASONING_V1_NOVELTY_INVENTORY_V1 } from "../shared/reasoning-novelty-inventory-v1";
import { REASONING_V1_NOVELTY_PROVIDERS_V1 } from "../shared/reasoning-novelty-provider-registry-v1";

for (const [topic, chapterId] of [
  ["Logic-Puzzles", "LP-001"],
  ["Statement-and-Arguments", "ARG-001"],
  ["Statement-and-Inference", "SIF-001"],
] as const) {
  const entry = REASONING_V1_NOVELTY_INVENTORY_V1.find((x) => x.topicDirectory === topic);
  assert.ok(entry, "Missing novelty inventory entry for " + topic);
  assert.equal(entry?.chapterId, chapterId);
  assert.equal(entry?.status, "DEDICATED_NOVELTY_AUDIT_COMPLETE_NO_ADMISSIBLE_PROVIDER");
  assert.equal(entry?.countsTowardControlledNovelTargetNow, false);
  assert.deepEqual(
    REASONING_V1_NOVELTY_PROVIDERS_V1.filter((p) => p.chapterId === chapterId),
    [],
    chapterId + " must not have a registered controlled-novel provider",
  );
}

const lp = REASONING_V1_NOVELTY_INVENTORY_V1.find((x) => x.topicDirectory === "Logic-Puzzles");
assert.ok(lp?.nextGate.includes("source/freeze reconciliation"));
assert.ok(lp?.nextGate.includes("production-readiness source saturation"));

const unresolvedSemanticStatuses = REASONING_V1_NOVELTY_INVENTORY_V1.filter((entry) =>
  [
    "DIVERSITY_PROVEN_NOVELTY_NOT_YET_PROVEN",
    "SEMANTIC_NOVELTY_PROVEN_NEEDS_STANDARDIZATION",
    "NOVELTY_GATE_PRESENT_NEEDS_EXPANSION",
  ].includes(entry.status),
);
assert.deepEqual(unresolvedSemanticStatuses, []);

console.log(JSON.stringify({
  status: "PASS_REASONING_NOVELTY_FINAL_THREE_CLOSURES_20261002",
  unresolvedSemanticNoveltyStatuses: unresolvedSemanticStatuses.length,
}, null, 2));
