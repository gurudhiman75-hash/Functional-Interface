import assert from "node:assert/strict";
import {
  NUM_CP002_PROPOSED_AUTHORITIES,
  NUM_CP002_SOURCE_SATURATION_PROPOSAL,
} from "../merge-split/proposal";
import {
  NUM_CP002_PERMANENT_ALLOCATION,
  NUM_CP002_PERMANENT_QL_IDS,
} from "./allocation";
import {
  NUMBER_SYSTEM_NEXT_PERMANENT_QL_NUMBER_CURRENT,
} from "../../../design/number-system-current-allocation-registry";

assert.equal(NUM_CP002_SOURCE_SATURATION_PROPOSAL.sourceSaturated, true);
assert.equal(NUM_CP002_SOURCE_SATURATION_PROPOSAL.proposedPermanentAuthorityCount, 21);
assert.equal(NUM_CP002_PROPOSED_AUTHORITIES.length, 21);
assert.equal(NUM_CP002_PERMANENT_QL_IDS.length, 21);
assert.equal(NUM_CP002_PERMANENT_ALLOCATION.length, 21);
assert.equal(new Set(NUM_CP002_PERMANENT_QL_IDS).size, 21);
assert.equal(new Set(NUM_CP002_PERMANENT_ALLOCATION.map((entry) => entry.solveModeId)).size, 21);
assert.equal(new Set(NUM_CP002_PERMANENT_ALLOCATION.map((entry) => entry.qlTemplateId)).size, 21);

for (const [index, entry] of NUM_CP002_PERMANENT_ALLOCATION.entries()) {
  const expectedQlId = `NUM-QL-${String(145 + index).padStart(3, "0")}`;
  const expectedSolveModeId = `NUM-CP002-SM-${String(index + 1).padStart(3, "0")}`;
  const authority = NUM_CP002_PROPOSED_AUTHORITIES[index]!;

  assert.equal(entry.qlId, expectedQlId);
  assert.equal(entry.solveModeId, expectedSolveModeId);
  assert.equal(entry.authorityId, authority.authorityId);
  assert.deepEqual(entry.corePrototypeIds, authority.corePrototypeIds);
  assert.deepEqual(entry.adapterPrototypeIds, authority.adapterPrototypeIds);
  assert.equal(entry.governingInference, authority.governingInference);
  assert.equal(entry.packageId, "NUM-001");
  assert.equal(entry.cpId, "NUM-CP-002");
  assert.equal(entry.permanentIdentityFrozen, true);
  assert.equal(entry.solveModeFrozen, true);
  assert.equal(entry.englishImplementationFrozen, true);
  assert.equal(entry.allocationStatus, "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION");
  assert.equal(entry.maturity, "ENGLISH_IMPLEMENTATION_FROZEN");
  assert.equal(entry.reviewStatus, "AWAITING_PRODUCT_OWNER_EDITORIAL_REVIEW");
  assert.equal(entry.active, false);
  assert.equal(entry.questionStudioDiscoverable, false);
  assert.equal(entry.questionBankWritable, false);
  assert.equal(entry.testEligible, false);
  assert.equal(entry.publiclyPublishable, false);
  assert.ok(entry.sourceEvidence.includes("PRODUCT-OWNER-21-AUTHORITY-APPROVAL-2026-08-14"));
  assert.ok(entry.sourceEvidence.includes("PR-785-MERGED-abdabe1c996e6460e7c820503f0c2860fd17bb0b"));
  assert.ok(entry.sourceEvidence.includes("NUM-CP-002-PERMANENT-ENGLISH-FREEZE"));
}

assert.equal(
  NUM_CP002_PERMANENT_ALLOCATION.filter((entry) => entry.mergeDisposition === "MERGE_AS_PARAMETERS").length,
  7,
);
assert.equal(
  NUM_CP002_PERMANENT_ALLOCATION.filter((entry) => entry.mergeDisposition === "RETAIN").length,
  14,
);

assert.equal(NUM_CP002_PERMANENT_QL_IDS[0], "NUM-QL-145");
assert.equal(NUM_CP002_PERMANENT_QL_IDS[20], "NUM-QL-165");
assert.equal(NUMBER_SYSTEM_NEXT_PERMANENT_QL_NUMBER_CURRENT, 166);

console.log(JSON.stringify({
  status: "PASS_NUM_CP002_PERMANENT_ENGLISH_FROZEN_ALLOCATION",
  approvedAuthorityCount: NUM_CP002_PROPOSED_AUTHORITIES.length,
  permanentQlCount: NUM_CP002_PERMANENT_ALLOCATION.length,
  solveModeCount: new Set(NUM_CP002_PERMANENT_ALLOCATION.map((entry) => entry.solveModeId)).size,
  permanentQlRange: "NUM-QL-145..NUM-QL-165",
  mergedOrAdapterAuthorityCount: 7,
  singletonAuthorityCount: 14,
  solveModeFrozen: true,
  englishImplementationFrozen: true,
  nextPermanentQl: "NUM-QL-166",
  deliveryExposure: 0,
}, null, 2));
