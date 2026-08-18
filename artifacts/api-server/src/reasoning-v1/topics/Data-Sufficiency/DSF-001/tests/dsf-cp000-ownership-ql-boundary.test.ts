import assert from "node:assert/strict";
import {
  DSF_IDENTITY_GOVERNANCE,
  DSF_OWNERSHIP_RECONCILIATION,
  dsfOwnershipSummary,
} from "../discovery/ownership-reconciliation.ts";
import {
  DSF_INITIAL_QL_ALLOCATION_PLAN,
  DSF_QL_BOUNDARY_CANDIDATES,
} from "../discovery/ql-boundary-candidates.ts";

assert.equal(DSF_OWNERSHIP_RECONCILIATION.length, 4);
assert.deepEqual(dsfOwnershipSummary(), {
  PRESERVE_FROZEN_SOURCE_QLS: 1,
  ADAPT_SOURCE_CAPABILITY_BEFORE_PERMANENT_ID: 1,
  REJECT_LOCAL_ANSWER_CONTRACT: 1,
  SOURCE_SOLVER_ONLY: 1,
});
assert.equal(DSF_IDENTITY_GOVERNANCE.canonicalSufficiencyOwner, "DSF-001");
assert.equal(DSF_IDENTITY_GOVERNANCE.permanentSourceIdsAreImmutable, true);
assert.equal(DSF_IDENTITY_GOVERNANCE.duplicateQlForSameFrozenTaskAllowed, false);
assert.equal(DSF_IDENTITY_GOVERNANCE.sourceAncestryRequired, true);

const tmw = DSF_OWNERSHIP_RECONCILIATION.find((entry) => entry.sourceChapter.includes("TMW-001"))!;
assert.equal(tmw.sourceIdentityState, "FROZEN_PERMANENT_QL");
assert.equal(tmw.disposition, "PRESERVE_FROZEN_SOURCE_QLS");
assert.match(tmw.identityPolicy, /TMW-QL-216\.\.223/);

const sap = DSF_OWNERSHIP_RECONCILIATION.find((entry) => entry.sourceChapter.includes("SAP-001"))!;
assert.equal(sap.disposition, "REJECT_LOCAL_ANSWER_CONTRACT");
assert.match(sap.identityPolicy, /EACH_STATEMENT_ALONE/);

assert.equal(DSF_QL_BOUNDARY_CANDIDATES.length, 2);
const twoStatement = DSF_QL_BOUNDARY_CANDIDATES.find((candidate) => candidate.statementCount === 2)!;
const threeStatement = DSF_QL_BOUNDARY_CANDIDATES.find((candidate) => candidate.statementCount === 3)!;
assert.equal(twoStatement.status, "PERMANENTLY_ALLOCATED");
assert.equal(twoStatement.permanentQlId, "DSF-QL-001");
assert.equal(twoStatement.taskContract, "TWO_STATEMENT_TARGET_DETERMINACY");
assert.equal(twoStatement.answerSemantic, "SUFFICIENCY_CLASS");
assert(twoStatement.supportedTargetFamilies.includes("SCALAR_OR_EXACT_VALUE"));
assert(twoStatement.supportedTargetFamilies.includes("BOOLEAN_OR_CATEGORICAL_PROPERTY"));
assert(twoStatement.supportedTargetFamilies.includes("RANK_OR_POSITION"));
assert.equal(threeStatement.status, "DEFERRED_FUTURE_CONTRACT");
assert.equal(threeStatement.permanentQlId, null);
assert.equal(threeStatement.answerSemantic, "MINIMAL_SUFFICIENT_STATEMENT_SUBSET");

assert.deepEqual(DSF_INITIAL_QL_ALLOCATION_PLAN.candidateIds, ["DSF-QL-CAND-001"]);
assert.deepEqual(DSF_INITIAL_QL_ALLOCATION_PLAN.permanentQlIds, ["DSF-QL-001"]);
assert.equal(DSF_INITIAL_QL_ALLOCATION_PLAN.permanentQlCount, 1);
assert.deepEqual(DSF_INITIAL_QL_ALLOCATION_PLAN.deferredCandidateIds, ["DSF-QL-CAND-002"]);
assert.equal(DSF_INITIAL_QL_ALLOCATION_PLAN.permanentIdsAllocated, true);
assert.equal(DSF_INITIAL_QL_ALLOCATION_PLAN.nextAvailableQlId, "DSF-QL-002");

console.log(JSON.stringify({
  status: "PASS_DSF_CP_000_OWNERSHIP_QL_BOUNDARY",
  ownership: dsfOwnershipSummary(),
  qlBoundary: {
    permanentQlId: twoStatement.permanentQlId,
    initialPermanentQlCount: DSF_INITIAL_QL_ALLOCATION_PLAN.permanentQlCount,
    deferredCandidate: threeStatement.candidateId,
    permanentIdsAllocated: DSF_INITIAL_QL_ALLOCATION_PLAN.permanentIdsAllocated,
  },
}, null, 2));
