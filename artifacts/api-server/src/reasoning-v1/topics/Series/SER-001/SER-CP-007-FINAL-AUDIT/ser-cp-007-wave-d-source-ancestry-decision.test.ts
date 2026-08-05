import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const path =
  "src/reasoning-v1/topics/Series/SER-001/SER-CP-007-FINAL-AUDIT/ser-cp-007-wave-d-source-ancestry-decision.md";
const decision = readFileSync(path, "utf8");

const probes = [
  "PAIRWISE_ADJACENT_SWAP_PERMUTATION",
  "FULL_REVERSAL_PERMUTATION",
  "ODD_EVEN_POSITION_REORDERING",
  "ALPHABET_COMPLEMENT_CLUSTER",
  "ALPHABET_COMPLEMENT_WITH_ROTATION",
  "CENTER_INSERTION_GROWTH",
  "ALTERNATING_INTERIOR_INSERTION_GROWTH",
  "FOUR_INTERLEAVED_CLUSTER_ROWS",
] as const;

for (const probe of probes) {
  assert.ok(decision.includes(`\`${probe}\``), `missing Wave-D probe: ${probe}`);
}

for (const authority of [
  "FIXED_POSITION_PERMUTATION_CLUSTER",
  "ALPHABET_COMPLEMENT_CLUSTER_SEQUENCE",
  "PATTERNED_INTERIOR_INSERTION_GROWTH",
  "K_INTERLEAVED_CLUSTER_SERIES",
]) {
  assert.ok(decision.includes(`\`${authority}\``), `missing authority: ${authority}`);
}

for (const required of [
  "Wave-D source-shaped probes reviewed:       8",
  "Direct autonomous Series ancestry found:   0",
  "Final SATURATION_ONLY_SERIES decisions:     7",
  "Final SATURATION_ONLY_SERIES_COLLISION:     1",
  "Unresolved Wave-D ancestry decisions:       0",
  "Permanent QLs:                              0",
  "Unresolved traced exam record: DISHA-VNV item 195",
  "Mathematical saturation:       PENDING_ITEM_195_RESOLUTION",
  "Source-ledger completeness:    BLOCKED",
  "English discovery freeze:      BLOCKED",
  "CP-008:                        BLOCKED",
  "SER_CP007_ITEM_195_RESOLUTION_AND_SOURCE_LEDGER_CLOSE",
]) {
  assert.ok(decision.includes(required), `missing ancestry state: ${required}`);
}

assert.equal((decision.match(/`SATURATION_ONLY_SERIES`/g) ?? []).length >= 8, true);
assert.ok(decision.includes("`SATURATION_ONLY_SERIES_COLLISION`"));
assert.doesNotMatch(decision, /Direct autonomous Series ancestry found:\s+[1-9]/);
assert.doesNotMatch(decision, /Unresolved Wave-D ancestry decisions:\s+[1-9]/);

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_CP007_WAVE_D_FINAL_SATURATION_ONLY_ANCESTRY_DECISIONS",
      reviewedProbes: 8,
      directSeriesAncestryFound: 0,
      saturationOnlySeriesDecisions: 7,
      saturationOnlySeriesCollisionDecisions: 1,
      unresolvedWaveDAncestryDecisions: 0,
      unresolvedTracedExamRecords: 1,
      unresolvedRecord: "DISHA-VNV item 195",
      mathematicalSaturation: "PENDING_ITEM_195_RESOLUTION",
      englishDiscoveryFreeze: "BLOCKED",
      permanentQls: 0,
      cp008Status: "BLOCKED",
      nextAuthority: "SER_CP007_ITEM_195_RESOLUTION_AND_SOURCE_LEDGER_CLOSE",
    },
    null,
    2,
  ),
);
