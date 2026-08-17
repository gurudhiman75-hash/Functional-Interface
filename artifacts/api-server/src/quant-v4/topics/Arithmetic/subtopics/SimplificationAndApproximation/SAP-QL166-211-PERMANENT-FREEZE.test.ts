import assert from "node:assert/strict";
import {
  SAP_CP010_FINAL_FROZEN_ENTRIES,
  SAP_CP011_FINAL_FROZEN_ENTRIES,
  SAP_CP012_FINAL_FROZEN_ENTRIES,
  SAP_E1_FINAL_FROZEN_ENTRIES,
  SAP_FINAL_PRODUCT_OWNER_FREEZE,
  SAP_QL166_211_FINAL_FROZEN_ENTRIES,
} from "./SAP-QL166-211-PERMANENT-FREEZE";
import { SAP_CP010_CATALOGUE, SAP_CP010_PROTOTYPE_IDS } from "./SAP-002/SAP-CP-010/runtime";
import { SAP_CP011_E2_STRUCTURES } from "./SAP-002/SAP-CP-011/runtime-release-r6";
import { SAP_CP012_E2_STRUCTURES } from "./SAP-002/SAP-CP-012/runtime-release-e3";
import { SAP_CP004_E1_NESTED_ADDITIVE_CANDIDATE_ID } from "./SAP-001/SAP-CP-004/e1-runtime";
import { SAP_CP005_E1_TELESCOPING_CANDIDATE_ID } from "./SAP-001/SAP-CP-005/e1-runtime";
import { SAP_CP007_E1_SIGFIG_CANDIDATE_ID } from "./SAP-001/SAP-CP-007/e1-runtime";
import { SAP_CP010_E1_SUPPLIED_ROOT_CANDIDATE_ID } from "./SAP-002/SAP-CP-010/e1-runtime";

function ql(number: number): string { return `SAP-QL-${String(number).padStart(3, "0")}`; }

assert.equal(SAP_FINAL_PRODUCT_OWNER_FREEZE.approvalInstruction, "approved");
assert.equal(SAP_FINAL_PRODUCT_OWNER_FREEZE.approvalDate, "2026-08-16");
assert.equal(SAP_FINAL_PRODUCT_OWNER_FREEZE.approvedProposalHead, "728f038c194b8868063b0a3c53b9d6f854328dfc");
assert.equal(SAP_FINAL_PRODUCT_OWNER_FREEZE.sourceSaturationEvidenceHead, "b66075169a8a98f8ee21a920bc755c3673ee54c5");
assert.equal(SAP_FINAL_PRODUCT_OWNER_FREEZE.sourceSaturation, true);
assert.equal(SAP_FINAL_PRODUCT_OWNER_FREEZE.priorFrozenThrough, "SAP-QL-165");
assert.equal(SAP_FINAL_PRODUCT_OWNER_FREEZE.allocatedRange, "SAP-QL-166..SAP-QL-211");
assert.equal(SAP_FINAL_PRODUCT_OWNER_FREEZE.allocatedCount, 46);
assert.equal(SAP_FINAL_PRODUCT_OWNER_FREEZE.nextAvailableId, "SAP-QL-212");
assert.equal(SAP_FINAL_PRODUCT_OWNER_FREEZE.mergeAuthorization, false);

const entries = SAP_QL166_211_FINAL_FROZEN_ENTRIES;
assert.equal(entries.length, 46);
assert.deepEqual(entries.map((x) => x.permanentQlId), Array.from({ length: 46 }, (_, i) => ql(166 + i)));
assert.equal(new Set(entries.map((x) => x.permanentQlId)).size, 46);
assert.equal(new Set(entries.map((x) => x.sourceIdentity)).size, 46);

for (const item of entries) {
  assert.equal(item.allocationStatus, "PERMANENT_ID_ALLOCATED_INACTIVE");
  assert.equal(item.englishStatus, "ENGLISH_PRODUCT_OWNER_FREEZE_APPROVED");
  assert.equal(item.allocationApproval, "PRODUCT_OWNER_APPROVED_FINAL_SAP_2026_08_16");
  assert.equal(item.active, false);
  assert.equal(item.questionStudioDiscoverable, false);
  assert.equal(item.questionBankWritable, false);
  assert.equal(item.testEligible, false);
  assert.equal(item.publiclyPublishable, false);
}

assert.equal(SAP_FINAL_PRODUCT_OWNER_FREEZE.activeQlCount, 0);
assert.equal(SAP_FINAL_PRODUCT_OWNER_FREEZE.questionStudioDiscoverableCount, 0);
assert.equal(SAP_FINAL_PRODUCT_OWNER_FREEZE.questionBankWritableCount, 0);
assert.equal(SAP_FINAL_PRODUCT_OWNER_FREEZE.testEligibleCount, 0);
assert.equal(SAP_FINAL_PRODUCT_OWNER_FREEZE.publiclyPublishableCount, 0);

// CP010 preserves the mature provisional 166..182 sequence exactly.
assert.equal(SAP_CP010_FINAL_FROZEN_ENTRIES.length, 17);
assert.deepEqual(SAP_CP010_FINAL_FROZEN_ENTRIES.map((x) => x.sourceIdentity), [...SAP_CP010_PROTOTYPE_IDS]);
assert.deepEqual(SAP_CP010_FINAL_FROZEN_ENTRIES.map((x) => x.permanentQlId), SAP_CP010_CATALOGUE.map((x) => x.proposedPermanentQlId));
assert.equal(SAP_CP010_FINAL_FROZEN_ENTRIES[14]!.permanentQlId, "SAP-QL-180");
assert.equal(SAP_CP010_FINAL_FROZEN_ENTRIES[14]!.title, "Nearest option for a power estimate");

// Four E1 additions occupy 183..186 exactly as approved.
assert.equal(SAP_E1_FINAL_FROZEN_ENTRIES.length, 4);
assert.deepEqual(SAP_E1_FINAL_FROZEN_ENTRIES.map((x) => x.permanentQlId), ["SAP-QL-183", "SAP-QL-184", "SAP-QL-185", "SAP-QL-186"]);
assert.deepEqual(SAP_E1_FINAL_FROZEN_ENTRIES.map((x) => x.sourceIdentity), [
  SAP_CP004_E1_NESTED_ADDITIVE_CANDIDATE_ID,
  SAP_CP005_E1_TELESCOPING_CANDIDATE_ID,
  SAP_CP007_E1_SIGFIG_CANDIDATE_ID,
  SAP_CP010_E1_SUPPLIED_ROOT_CANDIDATE_ID,
]);

// CP011 and CP012 are frozen in reviewed release order.
assert.equal(SAP_CP011_FINAL_FROZEN_ENTRIES.length, 12);
assert.deepEqual(SAP_CP011_FINAL_FROZEN_ENTRIES.map((x) => x.sourceIdentity), [...SAP_CP011_E2_STRUCTURES]);
assert.deepEqual(SAP_CP011_FINAL_FROZEN_ENTRIES.map((x) => x.permanentQlId), Array.from({ length: 12 }, (_, i) => ql(187 + i)));

assert.equal(SAP_CP012_FINAL_FROZEN_ENTRIES.length, 13);
assert.deepEqual(SAP_CP012_FINAL_FROZEN_ENTRIES.map((x) => x.sourceIdentity), [...SAP_CP012_E2_STRUCTURES]);
assert.deepEqual(SAP_CP012_FINAL_FROZEN_ENTRIES.map((x) => x.permanentQlId), Array.from({ length: 13 }, (_, i) => ql(199 + i)));
assert.equal(SAP_CP012_FINAL_FROZEN_ENTRIES.at(-1)!.permanentQlId, "SAP-QL-211");
assert.equal(SAP_CP012_FINAL_FROZEN_ENTRIES.at(-1)!.sourceIdentity, "CP012-E2-MIXED-ROOT-POWER-SYNTHESIS");

const checkpointCounts = Object.fromEntries([...new Set(entries.map((x) => x.checkpointId))].map((cp) => [cp, entries.filter((x) => x.checkpointId === cp).length]));
assert.deepEqual(checkpointCounts, {
  "SAP-CP-010": 18,
  "SAP-CP-004": 1,
  "SAP-CP-005": 1,
  "SAP-CP-007": 1,
  "SAP-CP-011": 12,
  "SAP-CP-012": 13,
});

console.log(JSON.stringify({
  authority: "SAP-QL166-211-PERMANENT-INACTIVE-FREEZE",
  approval: "PRODUCT_OWNER_APPROVED_FINAL_SAP_2026_08_16",
  allocatedRange: SAP_FINAL_PRODUCT_OWNER_FREEZE.allocatedRange,
  allocatedCount: entries.length,
  nextAvailable: SAP_FINAL_PRODUCT_OWNER_FREEZE.nextAvailableId,
  checkpointCounts,
  sourceSaturation: true,
  ql180: "POWER_ONLY_NEAREST_OPTION",
  lifecycle: "ALL_DELIVERY_SURFACES_OFF",
}));
