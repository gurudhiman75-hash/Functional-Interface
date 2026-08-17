import assert from "node:assert/strict";
import {
  SAP_CP009_FROZEN_REGISTRY_ENTRIES,
  SAP_CP009_PRODUCT_OWNER_FREEZE,
} from "./SAP-CP009-PERMANENT-FREEZE";

const ids = SAP_CP009_FROZEN_REGISTRY_ENTRIES.map((entry) => entry.permanentQlId);
assert.deepEqual(ids, Array.from({ length: 19 }, (_, index) => `SAP-QL-${String(147 + index).padStart(3, "0")}`));
assert.equal(new Set(ids).size, 19);
assert.equal(SAP_CP009_PRODUCT_OWNER_FREEZE.allocatedRange, "SAP-QL-147..SAP-QL-165");
assert.equal(SAP_CP009_PRODUCT_OWNER_FREEZE.allocatedCount, 19);
assert.equal(SAP_CP009_PRODUCT_OWNER_FREEZE.nextAvailableId, "SAP-QL-166");
assert.equal(SAP_CP009_PRODUCT_OWNER_FREEZE.sourceHead, "e5878e942da5dc02920be85d2aa56a10825ef1bf");
assert.equal(SAP_CP009_PRODUCT_OWNER_FREEZE.reviewVersion, "CP009-EXAM-STANDARD-V3");

for (const entry of SAP_CP009_FROZEN_REGISTRY_ENTRIES) {
  assert.equal(entry.packageId, "SAP-002");
  assert.equal(entry.checkpointId, "SAP-CP-009");
  assert.equal(entry.sourceHead, SAP_CP009_PRODUCT_OWNER_FREEZE.sourceHead);
  assert.equal(entry.allocationStatus, "PERMANENT_ID_ALLOCATED_INACTIVE");
  assert.equal(entry.englishStatus, "ENGLISH_PRODUCT_OWNER_FREEZE_APPROVED");
  assert.equal(entry.allocationApproval, "PRODUCT_OWNER_APPROVED_CP009_2026_08_13");
  assert.equal(entry.active, false);
  assert.equal(entry.questionStudioDiscoverable, false);
  assert.equal(entry.questionBankWritable, false);
  assert.equal(entry.testEligible, false);
  assert.equal(entry.publiclyPublishable, false);
}

assert.equal(SAP_CP009_PRODUCT_OWNER_FREEZE.activeQlCount, 0);
assert.equal(SAP_CP009_PRODUCT_OWNER_FREEZE.questionStudioDiscoverableCount, 0);
assert.equal(SAP_CP009_PRODUCT_OWNER_FREEZE.questionBankWritableCount, 0);
assert.equal(SAP_CP009_PRODUCT_OWNER_FREEZE.testEligibleCount, 0);
assert.equal(SAP_CP009_PRODUCT_OWNER_FREEZE.publiclyPublishableCount, 0);
assert.equal(SAP_CP009_PRODUCT_OWNER_FREEZE.mergeAuthorization, false);

console.log("SAP CP009 product-owner freeze passed: 19 inactive permanent identities SAP-QL-147..165; next SAP-QL-166; all delivery surfaces remain off.");
