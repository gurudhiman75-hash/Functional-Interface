import assert from "node:assert/strict";

import {
  RNK_CP007_MANUAL_REVIEW_VERDICT,
  RNK_CP007_OWNERSHIP_DECISIONS,
  RNK_CP007_POST_V11_ARCHITECTURE,
  RNK_CP007_POST_V11_OWNERSHIP_AUDIT_VERSION,
} from "./cp007-post-v11-ownership-audit-v1";

assert.equal(RNK_CP007_MANUAL_REVIEW_VERDICT.questionsReviewed, 28);
assert.equal(RNK_CP007_MANUAL_REVIEW_VERDICT.wrongKeys, 0);
assert.equal(RNK_CP007_MANUAL_REVIEW_VERDICT.ambiguousItems, 0);
assert.equal(RNK_CP007_MANUAL_REVIEW_VERDICT.invalidExplanations, 0);
assert.equal(RNK_CP007_MANUAL_REVIEW_VERDICT.editorialVerdict, "PASS");

const byId = new Map(RNK_CP007_OWNERSHIP_DECISIONS.map((entry) => [entry.candidateId, entry]));
assert.equal(byId.size, 5);
assert.equal(byId.get("CATEGORY_COMPOSITION_AROUND_RANK")?.disposition, "KEEP_SEPARATE_PROVISIONAL_AUTHORITY");
assert.equal(byId.get("TRANSFER_BALANCE_ORDER")?.disposition, "DERIVATION_ADAPTER_TO_CP004");
assert.equal(byId.get("SCALED_OBJECT_ORDER")?.disposition, "DERIVATION_ADAPTER_TO_RNK_QL_038_INVERSE_VARIANT");
assert.equal(byId.get("NUMERIC_VALUE_CONSTRAINED_ORDER")?.disposition, "HOLD_AS_DERIVATION_ADAPTER");
assert.equal(byId.get("RELATIONAL_SIDE_COUNT_EQUATION")?.disposition, "REDIRECT_CP001_EXTENSION");

assert.deepEqual(RNK_CP007_POST_V11_ARCHITECTURE.newAuthorityCandidates, ["CATEGORY_COMPOSITION_AROUND_RANK"]);
assert.equal(RNK_CP007_POST_V11_ARCHITECTURE.derivedQuantityQlRejected, true);
assert.equal(RNK_CP007_POST_V11_ARCHITECTURE.ql038InverseVariantRequired, true);
assert.equal(RNK_CP007_POST_V11_ARCHITECTURE.cp001ExtensionRequired, true);
assert.equal(RNK_CP007_POST_V11_ARCHITECTURE.ql042Allocated, false);
assert.equal(RNK_CP007_POST_V11_ARCHITECTURE.nextAvailableQl, "RNK-QL-042");
assert.equal(RNK_CP007_POST_V11_ARCHITECTURE.questionStudio, "DISABLED");
assert.equal(RNK_CP007_POST_V11_ARCHITECTURE.persistence, "DISABLED");
assert.equal(RNK_CP007_POST_V11_ARCHITECTURE.publicPublication, false);
assert.equal(RNK_CP007_OWNERSHIP_DECISIONS.some((entry) => entry.permanentQlAllocated), false);

console.log(JSON.stringify({
  status: "PASS",
  auditVersion: RNK_CP007_POST_V11_OWNERSHIP_AUDIT_VERSION,
  manualReview: RNK_CP007_MANUAL_REVIEW_VERDICT,
  ownershipDecisions: RNK_CP007_OWNERSHIP_DECISIONS.map(({ candidateId, disposition, permanentQlAllocated }) => ({
    candidateId,
    disposition,
    permanentQlAllocated,
  })),
  architecture: RNK_CP007_POST_V11_ARCHITECTURE,
}, null, 2));
