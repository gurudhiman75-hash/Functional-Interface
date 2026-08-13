import assert from "node:assert/strict";
import { NUM_CP001_PROPOSED_AUTHORITIES } from "../audit/merge-split-registry";
import {
  NUM_CP001_PERMANENT_ALLOCATION,
  NUM_CP001_PERMANENT_QL_IDS,
} from "./allocation";
import {
  NUMBER_SYSTEM_NEXT_PERMANENT_QL_NUMBER_CURRENT,
} from "../../../design/number-system-current-allocation-registry";

assert.equal(NUM_CP001_PROPOSED_AUTHORITIES.length, 21);
assert.equal(NUM_CP001_PERMANENT_QL_IDS.length, 21);
assert.equal(NUM_CP001_PERMANENT_ALLOCATION.length, 21);
assert.equal(new Set(NUM_CP001_PERMANENT_QL_IDS).size, 21);

for (const [index, entry] of NUM_CP001_PERMANENT_ALLOCATION.entries()) {
  const expectedQlId = `NUM-QL-${String(124 + index).padStart(3, "0")}`;
  const proposal = NUM_CP001_PROPOSED_AUTHORITIES[index]!;

  assert.equal(entry.qlId, expectedQlId);
  assert.equal(entry.proposalId, proposal.proposalId);
  assert.deepEqual(entry.prototypeIds, proposal.prototypeIds);
  assert.equal(entry.governingInvariant, proposal.governingInvariant);
  assert.equal(entry.mergeDisposition, proposal.disposition);
  assert.equal(entry.packageId, "NUM-001");
  assert.equal(entry.cpId, "NUM-CP-001");
  assert.equal(entry.permanentIdentityFrozen, true);
  assert.equal(entry.solveModeFrozen, false);
  assert.equal(entry.englishImplementationFrozen, false);
  assert.equal(entry.allocationStatus, "PRODUCT_OWNER_APPROVED_INACTIVE_PERMANENT_ALLOCATION");
  assert.equal(entry.maturity, "PERMANENT_ALLOCATION_APPROVED");
  assert.equal(entry.reviewStatus, "ENGLISH_IMPLEMENTATION_PENDING");
  assert.equal(entry.active, false);
  assert.equal(entry.questionStudioDiscoverable, false);
  assert.equal(entry.questionBankWritable, false);
  assert.equal(entry.testEligible, false);
  assert.equal(entry.publiclyPublishable, false);
  assert.ok(entry.sourceEvidence.includes("PRODUCT-OWNER-21-AUTHORITY-APPROVAL-2026-08-13"));
}

assert.equal(
  NUM_CP001_PERMANENT_ALLOCATION.filter((entry) => entry.mergeDisposition === "MERGE_AS_PARAMETERS").length,
  4,
);
assert.equal(
  NUM_CP001_PERMANENT_ALLOCATION.filter((entry) => entry.mergeDisposition === "RETAIN").length,
  17,
);
assert.deepEqual(
  NUM_CP001_PERMANENT_ALLOCATION.filter((entry) => entry.mergeDisposition === "MERGE_AS_PARAMETERS").map((entry) => entry.prototypeIds),
  [
    ["NUM-CP001-PROT-003", "NUM-CP001-PROT-018"],
    ["NUM-CP001-PROT-005", "NUM-CP001-PROT-011"],
    ["NUM-CP001-PROT-008", "NUM-CP001-PROT-016", "NUM-CP001-PROT-021"],
    ["NUM-CP001-PROT-015", "NUM-CP001-PROT-020"],
  ],
);

assert.equal(NUM_CP001_PERMANENT_QL_IDS[0], "NUM-QL-124");
assert.equal(NUM_CP001_PERMANENT_QL_IDS[20], "NUM-QL-144");
assert.equal(NUMBER_SYSTEM_NEXT_PERMANENT_QL_NUMBER_CURRENT, 145);

console.log(JSON.stringify({
  status: "PASS_NUM_CP001_PERMANENT_ALLOCATION",
  approvedAuthorityCount: NUM_CP001_PROPOSED_AUTHORITIES.length,
  permanentQlCount: NUM_CP001_PERMANENT_ALLOCATION.length,
  permanentQlRange: "NUM-QL-124..NUM-QL-144",
  mergedAuthorityCount: 4,
  singletonAuthorityCount: 17,
  solveModeFrozen: false,
  englishImplementationFrozen: false,
  nextPermanentQl: "NUM-QL-145",
  deliveryExposure: 0,
}, null, 2));
