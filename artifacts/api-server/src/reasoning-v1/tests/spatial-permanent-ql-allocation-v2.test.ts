import assert from "node:assert/strict";
import {
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1,
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V1,
} from "../foundation/spatial/spatial-permanent-ql-allocation-v1";
import {
  SPATIAL_FGC_PERMANENT_QL_ALLOCATIONS_V2,
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2,
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V2,
} from "../foundation/spatial/spatial-permanent-ql-allocation-v2";
import {
  FGC_001_CANDIDATE_AUTHORITIES_V1,
  FGC_001_EXECUTABLE_PROTOTYPES_V1,
} from "../foundation/spatial/figure-completion-merge-split-proposal-v1";
import { FGC_001_SOURCE_SATURATION_AUTHORITY_V1 } from "../foundation/spatial/figure-completion-source-saturation-v1";

assert.equal(SPATIAL_PERMANENT_QL_ALLOCATIONS_V1.length, 30, "Frozen P0 authority must remain exactly 30 QLs.");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.nextAvailablePermanentQlId, "SPA-QL-031");
assert.equal(SPATIAL_FGC_PERMANENT_QL_ALLOCATIONS_V2.length, 4, "FGC must allocate four anti-duplicated reasoning authorities.");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATIONS_V2.length, 34, "Combined Spatial V2 allocation must contain 34 QLs.");

assert.deepEqual(
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V2.slice(0, 30),
  [...SPATIAL_PERMANENT_QL_ALLOCATIONS_V1],
  "V2 must preserve frozen SPA-QL-001..030 byte-for-byte/field-for-field.",
);

const expectedIds = Array.from({ length: 34 }, (_, index) => `SPA-QL-${String(index + 1).padStart(3, "0")}`);
assert.deepEqual(
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V2.map((entry) => entry.permanentQlId),
  expectedIds,
  "Spatial V2 permanent IDs must be continuous SPA-QL-001..034.",
);
assert.equal(new Set(expectedIds).size, 34);

assert.deepEqual(
  SPATIAL_FGC_PERMANENT_QL_ALLOCATIONS_V2.map((entry) => entry.permanentQlId),
  ["SPA-QL-031", "SPA-QL-032", "SPA-QL-033", "SPA-QL-034"],
);
assert.deepEqual(
  SPATIAL_FGC_PERMANENT_QL_ALLOCATIONS_V2.map((entry) => entry.proposalId),
  ["FGC-PQL-01", "FGC-PQL-02", "FGC-PQL-03", "FGC-PQL-04"],
);
assert.deepEqual(
  SPATIAL_FGC_PERMANENT_QL_ALLOCATIONS_V2.map((entry) => entry.candidateAuthorityId),
  FGC_001_CANDIDATE_AUTHORITIES_V1.map((entry) => entry.candidateId),
  "Each FGC candidate reasoning authority must map exactly once to a permanent QL.",
);
assert.equal(
  new Set(SPATIAL_FGC_PERMANENT_QL_ALLOCATIONS_V2.map((entry) => entry.candidateAuthorityId)).size,
  4,
  "FGC candidate authority allocation must be one-to-one.",
);

assert.equal(FGC_001_EXECUTABLE_PROTOTYPES_V1.length, 10);
assert.equal(FGC_001_CANDIDATE_AUTHORITIES_V1.length, 4);
assert.ok(
  FGC_001_EXECUTABLE_PROTOTYPES_V1.length > SPATIAL_FGC_PERMANENT_QL_ALLOCATIONS_V2.length,
  "Visual prototypes must not be allocated one permanent QL each.",
);
for (const allocation of SPATIAL_FGC_PERMANENT_QL_ALLOCATIONS_V2) {
  const authority = FGC_001_CANDIDATE_AUTHORITIES_V1.find((entry) => entry.candidateId === allocation.candidateAuthorityId);
  assert.ok(authority, `${allocation.permanentQlId}: missing candidate reasoning authority.`);
  assert.ok(authority.executablePrototypes.length >= 2, `${allocation.permanentQlId}: allocation should own a merged representation family, not a single visual prototype.`);
}

assert.equal(FGC_001_SOURCE_SATURATION_AUTHORITY_V1.permanentQlProposal.allowed, true);
assert.equal(FGC_001_SOURCE_SATURATION_AUTHORITY_V1.permanentQlProposal.proposedCount, 4);
assert.equal(FGC_001_SOURCE_SATURATION_AUTHORITY_V1.permanentQlProposal.proposedFirstCoordinate, "SPA-QL-031");
assert.equal(FGC_001_SOURCE_SATURATION_AUTHORITY_V1.sourceScope.SSC.status, "CONTROLLED_TAXONOMY_SATURATED_FOR_CURRENT_FGC_SCOPE");
assert.equal(FGC_001_SOURCE_SATURATION_AUTHORITY_V1.sourceScope.Banking.status, "NOT_ESTABLISHED_FOR_FGC_001");
assert.equal(FGC_001_SOURCE_SATURATION_AUTHORITY_V1.sourceScope.PunjabState.status, "DIRECT_FGC_EVIDENCE_PRESENT_RULE_CLASSIFICATION_PENDING");

for (const entry of SPATIAL_FGC_PERMANENT_QL_ALLOCATIONS_V2) {
  assert.equal(entry.chapterCode, "FGC-001");
  assert.equal(entry.allocationStatus, "PERMANENT_QL_ALLOCATED_RUNTIME_PENDING");
  assert.equal(entry.sourceSaturationAuthorityVersion, FGC_001_SOURCE_SATURATION_AUTHORITY_V1.version);
  assert.equal(entry.humanReviewedDiscoveryHead, "1c14d6b54b53622c09285436fec50ded0ecae22e");
  assert.equal(entry.humanReviewedWorkflowRunId, 32007652999);
  assert.equal(entry.humanReviewedArtifactId, 9280591062);
  assert.equal(entry.englishRuntimeImplemented, false);
  assert.equal(entry.englishImplementationFrozen, false);
  assert.equal(entry.active, false);
  assert.equal(entry.questionStudioDiscoverable, false);
  assert.equal(entry.questionStudioRegistrationStatus, "NOT_REGISTERED");
  assert.equal(entry.questionBankWritable, false);
  assert.equal(entry.testEligible, false);
  assert.equal(entry.publiclyPublishable, false);
  assert.equal(entry.hindiPunjabiGeneration, false);
}

assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.frozenBaseAuthorityId, SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.authorityId);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.frozenBasePermanentQlCount, 30);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.permanentQlCount, 34);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.permanentQlRange, "SPA-QL-001..SPA-QL-034");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.nextAvailablePermanentQlId, "SPA-QL-035");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.chapterCounts["FGC-001"], 4);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.sourceScope.Banking.status, "NOT_ESTABLISHED_FOR_FGC_001");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.sourceScope.PunjabState.status, "DIRECT_FGC_EVIDENCE_PRESENT_RULE_CLASSIFICATION_PENDING");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.lifecycle.fgcEnglishRuntimeImplemented, false);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.lifecycle.fgcEnglishImplementationFrozen, false);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.lifecycle.questionStudioDiscoverable, false);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.lifecycle.questionBankWritable, false);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.lifecycle.testEligible, false);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.lifecycle.publiclyPublishable, false);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.lifecycle.hindiPunjabiGeneration, false);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.nextGate, "FGC_001_ENGLISH_RUNTIME_IMPLEMENTATION_AND_REVIEW");

console.log(JSON.stringify({
  status: "PASS_SPATIAL_PERMANENT_QL_ALLOCATION_V2",
  frozenBase: {
    authorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.frozenBaseAuthorityId,
    count: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.frozenBasePermanentQlCount,
    range: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.frozenBaseRange,
  },
  fgc: {
    permanentQls: SPATIAL_FGC_PERMANENT_QL_ALLOCATIONS_V2.map((entry) => ({
      permanentQlId: entry.permanentQlId,
      proposalId: entry.proposalId,
      candidateAuthorityId: entry.candidateAuthorityId,
      allocationStatus: entry.allocationStatus,
    })),
    sourceSaturationStatus: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.sourceSaturationStatus,
  },
  combined: {
    count: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.permanentQlCount,
    range: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.permanentQlRange,
    nextAvailable: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.nextAvailablePermanentQlId,
  },
  nextGate: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.nextGate,
}, null, 2));
