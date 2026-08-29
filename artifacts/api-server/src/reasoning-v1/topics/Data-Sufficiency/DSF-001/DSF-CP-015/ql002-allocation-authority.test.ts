import assert from "node:assert/strict";
import {
  DSF_NEXT_AVAILABLE_QL_ID,
  DSF_PERMANENT_QL_REGISTRY,
  getDsfPermanentQl,
} from "../foundation/permanent-ql-registry.ts";
import {
  DSF_CURRENT_NEXT_AVAILABLE_QL_ID,
  DSF_CURRENT_PERMANENT_QL_REGISTRY,
  DSF_QL_002_PERMANENT_ENTRY,
  getCurrentDsfPermanentQl,
} from "../foundation/current-permanent-ql-registry.ts";
import { DSF_QL_BOUNDARY_CANDIDATES } from "../discovery/ql-boundary-candidates.ts";
import { DSF_CP015_QL002_ALLOCATION_AUTHORITY } from "./ql002-allocation-authority.ts";

// Historical CP000 snapshot remains frozen exactly as it was.
assert.equal(DSF_PERMANENT_QL_REGISTRY.length, 1);
assert.equal(DSF_PERMANENT_QL_REGISTRY[0]?.qlId, "DSF-QL-001");
assert.equal(getDsfPermanentQl("DSF-QL-002"), undefined);
assert.equal(DSF_NEXT_AVAILABLE_QL_ID, "DSF-QL-002");

const historicalCandidate = DSF_QL_BOUNDARY_CANDIDATES.find((entry) => entry.candidateId === "DSF-QL-CAND-002");
assert(historicalCandidate);
assert.equal(historicalCandidate.status, "DEFERRED_FUTURE_CONTRACT");
assert.equal(historicalCandidate.permanentQlId, null);
assert.equal(historicalCandidate.statementCount, 3);
assert.equal(historicalCandidate.taskContract, "THREE_STATEMENT_MINIMAL_SUFFICIENT_SUBSETS");
assert.equal(historicalCandidate.ruleId, "INFORMATION_SUFFICIENCY_SUBSET_LATTICE");
assert.equal(historicalCandidate.answerSemantic, "MINIMAL_SUFFICIENT_STATEMENT_SUBSET");

// Current registry layers CP015 allocation on top of that immutable snapshot.
assert.equal(DSF_CURRENT_PERMANENT_QL_REGISTRY.length, 2);
assert.deepEqual(DSF_CURRENT_PERMANENT_QL_REGISTRY.map((entry) => entry.qlId), ["DSF-QL-001", "DSF-QL-002"]);
assert.equal(new Set(DSF_CURRENT_PERMANENT_QL_REGISTRY.map((entry) => entry.qlId)).size, 2);
assert.equal(getCurrentDsfPermanentQl("DSF-QL-001")?.qlId, "DSF-QL-001");
assert.equal(getCurrentDsfPermanentQl("DSF-QL-002")?.qlId, "DSF-QL-002");
assert.equal(DSF_CURRENT_NEXT_AVAILABLE_QL_ID, "DSF-QL-003");

assert.equal(DSF_QL_002_PERMANENT_ENTRY.allocatedFromCandidateId, "DSF-QL-CAND-002");
assert.equal(DSF_QL_002_PERMANENT_ENTRY.implementationCheckpoint, "DSF-CP-015");
assert.equal(DSF_QL_002_PERMANENT_ENTRY.statementCount, 3);
assert.equal(DSF_QL_002_PERMANENT_ENTRY.semanticStateCount, 19);
assert.equal(DSF_QL_002_PERMANENT_ENTRY.taskContract, historicalCandidate.taskContract);
assert.equal(DSF_QL_002_PERMANENT_ENTRY.ruleId, historicalCandidate.ruleId);
assert.equal(DSF_QL_002_PERMANENT_ENTRY.answerSemantic, historicalCandidate.answerSemantic);
assert.deepEqual(DSF_QL_002_PERMANENT_ENTRY.lifecycle.sourceBackedPrototypeChapters, ["NUM-001"]);
assert.equal(DSF_QL_002_PERMANENT_ENTRY.lifecycle.questionStudioDiscoverable, false);
assert.equal(DSF_QL_002_PERMANENT_ENTRY.lifecycle.questionBankWritable, false);
assert.equal(DSF_QL_002_PERMANENT_ENTRY.lifecycle.testEligible, false);
assert.equal(DSF_QL_002_PERMANENT_ENTRY.lifecycle.mockTestEligible, false);
assert.equal(DSF_QL_002_PERMANENT_ENTRY.lifecycle.publiclyPublishable, false);

assert.equal(DSF_CP015_QL002_ALLOCATION_AUTHORITY.currentStatus, "PERMANENTLY_ALLOCATED_CP015");
assert.equal(DSF_CP015_QL002_ALLOCATION_AUTHORITY.historicalCp000Status, "DEFERRED_FUTURE_CONTRACT");
assert.equal(DSF_CP015_QL002_ALLOCATION_AUTHORITY.permanentQlId, "DSF-QL-002");
assert.equal(DSF_CP015_QL002_ALLOCATION_AUTHORITY.semanticStateCount, 19);
assert.equal(DSF_CP015_QL002_ALLOCATION_AUTHORITY.validatedCandidateHead, "0b160a22e093451dcb3b5f0da347b9dc039327a8");
assert.equal(DSF_CP015_QL002_ALLOCATION_AUTHORITY.validatedRunId, 33058017319);
assert.equal(DSF_CP015_QL002_ALLOCATION_AUTHORITY.nextAvailableQlId, "DSF-QL-003");
assert.equal(DSF_CP015_QL002_ALLOCATION_AUTHORITY.lifecycle.questionStudioDiscoverable, false);
assert.equal(DSF_CP015_QL002_ALLOCATION_AUTHORITY.lifecycle.questionBankWritable, false);
assert.equal(DSF_CP015_QL002_ALLOCATION_AUTHORITY.lifecycle.testEligible, false);
assert.equal(DSF_CP015_QL002_ALLOCATION_AUTHORITY.lifecycle.mockTestEligible, false);
assert.equal(DSF_CP015_QL002_ALLOCATION_AUTHORITY.lifecycle.publiclyPublishable, false);

console.log(JSON.stringify({
  status: "PASS_DSF_CP015_QL002_ADDITIVE_PERMANENT_ALLOCATION",
  historicalPermanentQlIds: DSF_PERMANENT_QL_REGISTRY.map((entry) => entry.qlId),
  currentPermanentQlIds: DSF_CURRENT_PERMANENT_QL_REGISTRY.map((entry) => entry.qlId),
  allocatedQlId: DSF_CP015_QL002_ALLOCATION_AUTHORITY.permanentQlId,
  validatedCandidateRunId: DSF_CP015_QL002_ALLOCATION_AUTHORITY.validatedRunId,
  nextAvailableQlId: DSF_CURRENT_NEXT_AVAILABLE_QL_ID,
  lifecycleLocked: true,
}, null, 2));
