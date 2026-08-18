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
assert.equal(new Set(NUM_CP001_PERMANENT_ALLOCATION.map((entry) => entry.solveModeId)).size, 21);

for (const [index, entry] of NUM_CP001_PERMANENT_ALLOCATION.entries()) {
  const expectedQlId = `NUM-QL-${String(124 + index).padStart(3, "0")}`;
  const expectedSolveModeId = `NUM-CP001-SM-${String(index + 1).padStart(3, "0")}`;
  const proposal = NUM_CP001_PROPOSED_AUTHORITIES[index]!;

  assert.equal(entry.qlId, expectedQlId);
  assert.equal(entry.solveModeId, expectedSolveModeId);
  assert.equal(entry.proposalId, proposal.proposalId);
  assert.deepEqual(entry.prototypeIds, proposal.prototypeIds);
  assert.equal(entry.governingInvariant, proposal.governingInvariant);
  assert.equal(entry.mergeDisposition, proposal.disposition);
  assert.equal(entry.packageId, "NUM-001");
  assert.equal(entry.cpId, "NUM-CP-001");
  assert.equal(entry.language, "en");
  assert.equal(entry.permanentIdentityFrozen, true);
  assert.equal(entry.solveModeFrozen, true);
  assert.equal(entry.englishImplementationFrozen, true);
  assert.equal(entry.allocationStatus, "PRODUCT_OWNER_APPROVED_INACTIVE_MULTILINGUAL_IMPLEMENTATION");
  assert.equal(entry.maturity, "MULTILINGUAL_IMPLEMENTATION_FROZEN");
  assert.equal(entry.reviewStatus, "PRODUCT_OWNER_COMPLETION_AUTHORISED");
  assert.equal(entry.active, false);
  assert.equal(entry.questionStudioDiscoverable, false);
  assert.equal(entry.questionBankWritable, false);
  assert.equal(entry.testEligible, false);
  assert.equal(entry.publiclyPublishable, false);
  assert.ok(entry.sourceEvidence.includes("PRODUCT-OWNER-21-AUTHORITY-APPROVAL-2026-08-13"));
  assert.ok(entry.sourceEvidence.includes("NUM-CP-001-PERMANENT-ENGLISH-FREEZE"));
  assert.ok(entry.sourceEvidence.includes("NUM-CP-001-HINDI-PUNJABI-MULTILINGUAL-FREEZE"));
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
// The chapter-wide next coordinate advances as later checkpoints are allocated.
// CP001 only owns the invariant that every later allocation remains above QL144.
assert.ok(NUMBER_SYSTEM_NEXT_PERMANENT_QL_NUMBER_CURRENT > 144);

console.log(JSON.stringify({
  status: "PASS_NUM_CP001_MULTILINGUAL_FROZEN_ALLOCATION",
  approvedAuthorityCount: NUM_CP001_PROPOSED_AUTHORITIES.length,
  permanentQlCount: NUM_CP001_PERMANENT_ALLOCATION.length,
  solveModeCount: new Set(NUM_CP001_PERMANENT_ALLOCATION.map((entry) => entry.solveModeId)).size,
  permanentQlRange: "NUM-QL-124..NUM-QL-144",
  mergedAuthorityCount: 4,
  singletonAuthorityCount: 17,
  solveModeFrozen: true,
  englishImplementationFrozen: true,
  multilingualImplementationFrozen: true,
  nextPermanentQlAtCp001Freeze: "NUM-QL-145",
  currentChapterNextPermanentQl: `NUM-QL-${String(NUMBER_SYSTEM_NEXT_PERMANENT_QL_NUMBER_CURRENT).padStart(3, "0")}`,
  deliveryExposure: 0,
}, null, 2));
