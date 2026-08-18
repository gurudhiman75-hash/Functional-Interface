import assert from "node:assert/strict";
import { DSF_CP000_FREEZE_AUTHORITY } from "../foundation/cp000-freeze-authority.ts";
import {
  DSF_NEXT_AVAILABLE_QL_ID,
  DSF_PERMANENT_QL_REGISTRY,
  getDsfPermanentQl,
} from "../foundation/permanent-ql-registry.ts";
import {
  DSF_INITIAL_QL_ALLOCATION_PLAN,
  DSF_QL_BOUNDARY_CANDIDATES,
} from "../discovery/ql-boundary-candidates.ts";
import { DSF_PERMANENT_QL_ALLOCATION_DECISION } from "../discovery/merge-split-audit.ts";

assert.equal(DSF_CP000_FREEZE_AUTHORITY.status, "FROZEN");
assert.equal(DSF_CP000_FREEZE_AUTHORITY.frozenPermanentQlAllocation.candidateId, "DSF-QL-CAND-001");
assert.equal(DSF_CP000_FREEZE_AUTHORITY.frozenPermanentQlAllocation.qlId, "DSF-QL-001");
assert.equal(DSF_CP000_FREEZE_AUTHORITY.frozenPermanentQlAllocation.nextAvailableQlId, "DSF-QL-002");
assert.equal(DSF_CP000_FREEZE_AUTHORITY.semanticFreeze.completeWorldUniquenessRequired, false);
assert.equal(DSF_CP000_FREEZE_AUTHORITY.semanticFreeze.canonicalClassCount, 5);
assert.equal(DSF_CP000_FREEZE_AUTHORITY.lifecycle.questionStudioDiscoverable, false);
assert.equal(DSF_CP000_FREEZE_AUTHORITY.lifecycle.questionBankWritable, false);
assert.equal(DSF_CP000_FREEZE_AUTHORITY.lifecycle.testEligible, false);
assert.equal(DSF_CP000_FREEZE_AUTHORITY.lifecycle.publiclyPublishable, false);

assert.equal(DSF_PERMANENT_QL_REGISTRY.length, 1);
assert.equal(new Set(DSF_PERMANENT_QL_REGISTRY.map((entry) => entry.qlId)).size, 1);
const ql001 = getDsfPermanentQl("DSF-QL-001");
assert(ql001);
assert.equal(ql001.allocatedFromCandidateId, "DSF-QL-CAND-001");
assert.equal(ql001.implementationCheckpoint, "DSF-CP-001");
assert.equal(ql001.taskContract, "TWO_STATEMENT_TARGET_DETERMINACY");
assert.equal(ql001.answerSemantic, "SUFFICIENCY_CLASS");
assert.equal(ql001.statementCount, 2);
assert.equal(ql001.lifecycle.englishContentStatus, "NOT_PRODUCTION_GENERATED");
assert.equal(ql001.lifecycle.questionStudioDiscoverable, false);
assert.equal(DSF_NEXT_AVAILABLE_QL_ID, "DSF-QL-002");

const allocatedCandidate = DSF_QL_BOUNDARY_CANDIDATES.find((entry) => entry.candidateId === "DSF-QL-CAND-001")!;
const deferredCandidate = DSF_QL_BOUNDARY_CANDIDATES.find((entry) => entry.candidateId === "DSF-QL-CAND-002")!;
assert.equal(allocatedCandidate.status, "PERMANENTLY_ALLOCATED");
assert.equal(allocatedCandidate.permanentQlId, "DSF-QL-001");
assert.equal(deferredCandidate.status, "DEFERRED_FUTURE_CONTRACT");
assert.equal(deferredCandidate.permanentQlId, null);

assert.equal(DSF_INITIAL_QL_ALLOCATION_PLAN.permanentIdsAllocated, true);
assert.deepEqual(DSF_INITIAL_QL_ALLOCATION_PLAN.permanentQlIds, ["DSF-QL-001"]);
assert.equal(DSF_INITIAL_QL_ALLOCATION_PLAN.nextAvailableQlId, "DSF-QL-002");
assert.equal(DSF_PERMANENT_QL_ALLOCATION_DECISION.status, "CP000_FROZEN_INITIAL_QL_ALLOCATED");
assert.equal(DSF_PERMANENT_QL_ALLOCATION_DECISION.permanentQlId, "DSF-QL-001");

console.log(JSON.stringify({
  status: "PASS_DSF_CP_000_FREEZE_ALLOCATION",
  freezeAuthority: DSF_CP000_FREEZE_AUTHORITY.authorityId,
  permanentQlIds: DSF_PERMANENT_QL_REGISTRY.map((entry) => entry.qlId),
  nextAvailableQlId: DSF_NEXT_AVAILABLE_QL_ID,
  cp001ReadyForProductionGeneration: true,
}, null, 2));
