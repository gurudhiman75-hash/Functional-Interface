import assert from "node:assert/strict";
import {
  SAP_CP004_008_FROZEN_REGISTRY_ENTRIES,
  SAP_CP004_008_PRODUCT_OWNER_FREEZE,
} from "./SAP-CP004-008-PERMANENT-FREEZE";

const expectedIds = Array.from({ length: 94 }, (_, index) => `SAP-QL-${String(53 + index).padStart(3, "0")}`);
const actualIds = SAP_CP004_008_FROZEN_REGISTRY_ENTRIES.map((entry) => entry.permanentQlId);
assert.deepEqual(actualIds, expectedIds);
assert.equal(new Set(actualIds).size, 94);
assert.equal(SAP_CP004_008_PRODUCT_OWNER_FREEZE.allocatedCount, 94);
assert.equal(SAP_CP004_008_PRODUCT_OWNER_FREEZE.allocatedRange, "SAP-QL-053..SAP-QL-146");
assert.equal(SAP_CP004_008_PRODUCT_OWNER_FREEZE.nextAvailableId, "SAP-QL-147");

const checkpointCounts = new Map<string, number>();
for (const entry of SAP_CP004_008_FROZEN_REGISTRY_ENTRIES) {
  checkpointCounts.set(entry.checkpointId, (checkpointCounts.get(entry.checkpointId) ?? 0) + 1);
  assert.equal(entry.allocationStatus, "PERMANENT_ID_ALLOCATED_INACTIVE");
  assert.equal(entry.englishStatus, "ENGLISH_PRODUCT_OWNER_FREEZE_APPROVED");
  assert.equal(entry.allocationApproval, "PRODUCT_OWNER_APPROVED_CP004_CP008_2026_08_12");
  assert.equal(entry.active, false);
  assert.equal(entry.questionStudioDiscoverable, false);
  assert.equal(entry.questionBankWritable, false);
  assert.equal(entry.testEligible, false);
  assert.equal(entry.publiclyPublishable, false);
  assert.equal(entry.prototypeAncestry.length, 2);
  assert.ok(entry.prototypeAncestry[0]?.includes(entry.permanentQlId));
  if (["SAP-CP-007", "SAP-CP-008"].includes(entry.checkpointId)) assert.equal(entry.packageId, "SAP-002");
  else assert.equal(entry.packageId, "SAP-001");
}

assert.deepEqual(Object.fromEntries(checkpointCounts), {
  "SAP-CP-004": 19,
  "SAP-CP-005": 20,
  "SAP-CP-006": 21,
  "SAP-CP-007": 16,
  "SAP-CP-008": 18,
});
assert.equal(SAP_CP004_008_PRODUCT_OWNER_FREEZE.activeQlCount, 0);
assert.equal(SAP_CP004_008_PRODUCT_OWNER_FREEZE.questionStudioDiscoverableCount, 0);
assert.equal(SAP_CP004_008_PRODUCT_OWNER_FREEZE.questionBankWritableCount, 0);
assert.equal(SAP_CP004_008_PRODUCT_OWNER_FREEZE.testEligibleCount, 0);
assert.equal(SAP_CP004_008_PRODUCT_OWNER_FREEZE.publiclyPublishableCount, 0);
assert.equal(SAP_CP004_008_PRODUCT_OWNER_FREEZE.mergeAuthorization, false);

console.log("SAP CP004-CP008 product-owner freeze passed: 94 inactive permanent coordinates SAP-QL-053..146; next SAP-QL-147; no delivery surface enabled.");
