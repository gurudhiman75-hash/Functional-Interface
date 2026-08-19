import assert from "node:assert/strict";
import {
  NUM_CP008_ADVANCED_DISPOSITIONS,
  NUM_CP008_DISCOVERED_PROTOTYPE_IDS,
  NUM_CP008_OWNERSHIP_HOLDS,
  NUM_CP008_POST_WAVE03_AUDIT,
  NUM_CP008_POST_WAVE03_MATERIAL_GAPS,
} from "./post-wave03-gap-audit.ts";

assert.equal(NUM_CP008_DISCOVERED_PROTOTYPE_IDS.length, 24);
assert.equal(new Set(NUM_CP008_DISCOVERED_PROTOTYPE_IDS).size, 24);
for (let index = 1; index <= 24; index++) {
  assert.ok(
    NUM_CP008_DISCOVERED_PROTOTYPE_IDS.includes(`NUM-CP008-PROT-${String(index).padStart(3, "0")}`),
    `Missing CP008 discovered prototype ${index}.`,
  );
}

assert.equal(NUM_CP008_POST_WAVE03_MATERIAL_GAPS.length, 2);
assert.deepEqual(
  NUM_CP008_POST_WAVE03_MATERIAL_GAPS.map((item) => item.proposedPrototypeId),
  ["NUM-CP008-PROT-025", "NUM-CP008-PROT-026"],
);
assert.ok(
  NUM_CP008_POST_WAVE03_MATERIAL_GAPS.every(
    (item) => item.disposition === "WAVE04_EXECUTABLE_DISCOVERY_REQUIRED",
  ),
);

assert.equal(NUM_CP008_ADVANCED_DISPOSITIONS.length, 4);
for (const required of [
  "DIRECT_MODULAR_INVERSE_AS_FINAL_TARGET",
  "UNRESTRICTED_GENERAL_CRT_THEOREM",
  "FERMAT_EULER_REDUCTION",
  "WILSON_THEOREM",
]) {
  assert.ok(NUM_CP008_ADVANCED_DISPOSITIONS.some((item) => item.form === required));
}

assert.equal(NUM_CP008_OWNERSHIP_HOLDS.length, 5);
assert.ok(NUM_CP008_OWNERSHIP_HOLDS.some((item) => item.owner === "NUM-CP-007"));
assert.ok(NUM_CP008_OWNERSHIP_HOLDS.some((item) => item.owner === "NUM-CP-009"));
assert.ok(NUM_CP008_OWNERSHIP_HOLDS.some((item) => item.owner === "NUM-CP-006"));
assert.ok(NUM_CP008_OWNERSHIP_HOLDS.some((item) => item.owner === "PNC"));
assert.ok(NUM_CP008_OWNERSHIP_HOLDS.some((item) => item.owner === "ALGEBRA"));

assert.equal(NUM_CP008_POST_WAVE03_AUDIT.discoveredPrototypeCount, 24);
assert.equal(NUM_CP008_POST_WAVE03_AUDIT.materialWave04GapCount, 2);
assert.equal(NUM_CP008_POST_WAVE03_AUDIT.permanentQlCount, 0);
assert.equal(NUM_CP008_POST_WAVE03_AUDIT.nextAvailableQl, "NUM-QL-166");
assert.equal(NUM_CP008_POST_WAVE03_AUDIT.sourceSaturation, false);
assert.equal(NUM_CP008_POST_WAVE03_AUDIT.countProposalAllowed, false);
assert.equal(NUM_CP008_POST_WAVE03_AUDIT.active, false);
assert.equal(NUM_CP008_POST_WAVE03_AUDIT.questionStudioDiscoverable, false);
assert.equal(NUM_CP008_POST_WAVE03_AUDIT.questionBankWritable, false);
assert.equal(NUM_CP008_POST_WAVE03_AUDIT.testEligible, false);
assert.equal(NUM_CP008_POST_WAVE03_AUDIT.publiclyPublishable, false);

console.log(JSON.stringify({
  status: "PASS_NUM_CP008_POST_WAVE03_GAP_AUDIT",
  discoveredPrototypes: NUM_CP008_DISCOVERED_PROTOTYPE_IDS.length,
  materialWave04Gaps: NUM_CP008_POST_WAVE03_MATERIAL_GAPS.length,
  wave04PrototypeIds: NUM_CP008_POST_WAVE03_MATERIAL_GAPS.map((item) => item.proposedPrototypeId),
  advancedHolds: NUM_CP008_ADVANCED_DISPOSITIONS.length,
  ownershipHolds: NUM_CP008_OWNERSHIP_HOLDS.length,
  permanentQlCount: NUM_CP008_POST_WAVE03_AUDIT.permanentQlCount,
  nextAvailableQl: NUM_CP008_POST_WAVE03_AUDIT.nextAvailableQl,
  nextGate: NUM_CP008_POST_WAVE03_AUDIT.nextGate,
}, null, 2));
