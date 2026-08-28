import assert from "node:assert/strict";
import {
  GEO_TEMPORARY_CANDIDATE_IDS_V1,
  GEO_TEMPORARY_CANDIDATE_REGISTRY_V1,
} from "../permanent-review/geometry-temporary-candidate-registry-v1";
import {
  GEO_MERGE_SPLIT_PROPOSAL_STATE_V1,
  GEO_MERGE_SPLIT_PROPOSAL_V1,
} from "../permanent-review/geometry-merge-split-proposal-v1";
import { GEO_PERMANENT_FAMILY_APPROVAL_V1 } from "../permanent-review/geometry-permanent-family-approval-v1";
import {
  GEO_PERMANENT_QL_ALLOCATION_AUTHORITY_V1,
  GEO_PERMANENT_QL_ALLOCATIONS_V1,
} from "../permanent-review/geometry-permanent-ql-allocation-v1";

assert.equal(GEO_TEMPORARY_CANDIDATE_REGISTRY_V1.length, 81);
assert.equal(GEO_MERGE_SPLIT_PROPOSAL_V1.length, 75);
assert.equal(GEO_PERMANENT_FAMILY_APPROVAL_V1.status, "EXPLICIT_PRODUCT_OWNER_APPROVAL_RECORDED");
assert.equal(GEO_PERMANENT_FAMILY_APPROVAL_V1.approvedProposal.semanticFamilyCount, 75);
assert.equal(GEO_PERMANENT_FAMILY_APPROVAL_V1.proof.workflowRunId, 33136861208);
assert.equal(GEO_PERMANENT_FAMILY_APPROVAL_V1.proof.workflowJobId, 98738647609);
assert.equal(GEO_PERMANENT_FAMILY_APPROVAL_V1.proof.artifactId, 9673884272);
assert.equal(GEO_PERMANENT_FAMILY_APPROVAL_V1.approvalScope.permanentQlAllocationAllowed, true);

// Proposal V1 remains immutable historical evidence; approval is layered above it.
assert.equal(GEO_MERGE_SPLIT_PROPOSAL_STATE_V1.permanentQlCount, 0);
assert.equal(GEO_MERGE_SPLIT_PROPOSAL_STATE_V1.permanentQlIdsReserved, false);
assert.equal(GEO_MERGE_SPLIT_PROPOSAL_STATE_V1.permanentAllocationAuthorized, false);

assert.equal(GEO_PERMANENT_QL_ALLOCATIONS_V1.length, 75, "Permanent Geometry QL count drifted");
assert.equal(GEO_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.permanentQlRange, "GEO-QL-001..GEO-QL-075");
assert.equal(GEO_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.nextAvailablePermanentQlId, "GEO-QL-076");

const permanentQlIds = GEO_PERMANENT_QL_ALLOCATIONS_V1.map((entry) => entry.permanentQlId);
const expectedPermanentQlIds = Array.from({ length: 75 }, (_, index) => `GEO-QL-${String(index + 1).padStart(3, "0")}`);
assert.deepEqual(permanentQlIds, expectedPermanentQlIds, "Permanent Geometry QL IDs must be a contiguous stable range");
assert.equal(new Set(permanentQlIds).size, 75, "Permanent Geometry QL IDs must be unique");

assert.deepEqual(
  GEO_PERMANENT_QL_ALLOCATIONS_V1.map((entry) => entry.proposalKey),
  GEO_MERGE_SPLIT_PROPOSAL_V1.map((family) => family.proposalKey),
  "Permanent QL allocation must preserve the proven family order exactly",
);

for (let index = 0; index < GEO_PERMANENT_QL_ALLOCATIONS_V1.length; index += 1) {
  const allocation = GEO_PERMANENT_QL_ALLOCATIONS_V1[index]!;
  const family = GEO_MERGE_SPLIT_PROPOSAL_V1[index]!;
  assert.equal(allocation.proposalKey, family.proposalKey);
  assert.equal(allocation.cpId, family.cpId);
  assert.equal(allocation.learnerDecision, family.learnerDecision);
  assert.deepEqual(allocation.candidateIds, family.candidateIds);
  assert.deepEqual(allocation.solveModes, family.solveModes);
  assert.equal(allocation.mergeRationale, family.mergeRationale);
  assert.equal(allocation.allocationStatus, "PERMANENT_QL_ALLOCATED_SOLVE_MODE_REVIEW_PENDING");
  assert.equal(allocation.solveModeFreezeStatus, "NOT_FROZEN");
  assert.equal(allocation.englishRuntimeImplemented, false);
  assert.equal(allocation.englishImplementationFrozen, false);
  assert.equal(allocation.questionStudioDiscoverable, false);
  assert.equal(allocation.questionBankWritable, false);
  assert.equal(allocation.testEligible, false);
  assert.equal(allocation.publiclyPublishable, false);
}

const allocatedCandidateIds = GEO_PERMANENT_QL_ALLOCATIONS_V1.flatMap((entry) => entry.candidateIds);
assert.equal(allocatedCandidateIds.length, 81, "Permanent allocation must preserve all 81 temporary authorities");
assert.equal(new Set(allocatedCandidateIds).size, 81, "A temporary authority cannot land in multiple permanent QLs");
assert.deepEqual([...allocatedCandidateIds].sort(), [...GEO_TEMPORARY_CANDIDATE_IDS_V1].sort());

const mergedAllocations = GEO_PERMANENT_QL_ALLOCATIONS_V1.filter((entry) => entry.candidateIds.length > 1);
assert.equal(mergedAllocations.length, 6, "Exactly six permanent QLs may represent intentional merge groups");
assert.equal(mergedAllocations.reduce((sum, entry) => sum + entry.candidateIds.length - 1, 0), 6);

for (const [cpId, expectedCount] of Object.entries(GEO_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.chapterCounts)) {
  assert.equal(GEO_PERMANENT_QL_ALLOCATIONS_V1.filter((entry) => entry.cpId === cpId).length, expectedCount, `${cpId} permanent QL count drifted`);
}

const lifecycle = GEO_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.lifecycle;
assert.equal(lifecycle.permanentFamilyArchitectureApproved, true);
assert.equal(lifecycle.permanentQlIdsReserved, true);
assert.equal(lifecycle.permanentQlAllocationComplete, true);
assert.equal(lifecycle.solveModeFreezeAuthorized, false);
assert.equal(lifecycle.solveModesFrozen, false);
assert.equal(lifecycle.englishFreezeAuthorized, false);
assert.equal(lifecycle.localizationAuthorized, false);
assert.equal(lifecycle.questionStudioActivationAuthorized, false);
assert.equal(lifecycle.questionBankWriteAuthorized, false);
assert.equal(lifecycle.testEligibilityAuthorized, false);
assert.equal(lifecycle.publicPublicationAuthorized, false);
assert.equal(lifecycle.prMergeAuthorized, false);
assert.equal(GEO_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.nextGate, "SOLVE_MODE_FREEZE_REVIEW");

console.log(JSON.stringify({
  status: "PASS_GEOMETRY_PERMANENT_75_QL_ALLOCATION_V1",
  temporaryCandidates: allocatedCandidateIds.length,
  semanticFamilies: GEO_MERGE_SPLIT_PROPOSAL_V1.length,
  permanentQlCount: GEO_PERMANENT_QL_ALLOCATIONS_V1.length,
  permanentQlRange: GEO_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.permanentQlRange,
  intentionalMergeGroups: mergedAllocations.length,
  familiesByCp: GEO_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.chapterCounts,
  nextGate: GEO_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.nextGate,
}, null, 2));
