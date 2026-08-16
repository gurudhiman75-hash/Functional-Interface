import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  SPATIAL_HUMAN_REVIEW_APPROVAL_V1,
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1,
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V1,
} from "../foundation/spatial";

const EXPECTED_PROPOSALS = [
  "MIR-PQL-01", "MIR-PQL-02", "MIR-PQL-03",
  "WAT-PQL-01", "WAT-PQL-02",
  "FAN-PQL-01", "FAN-PQL-02", "FAN-PQL-03", "FAN-PQL-04",
  "FAN-PQL-05", "FAN-PQL-06", "FAN-PQL-07", "FAN-PQL-08",
  "FCL-PQL-01", "FCL-PQL-02", "FCL-PQL-03", "FCL-PQL-04",
  "FCL-PQL-05", "FCL-PQL-06", "FCL-PQL-07", "FCL-PQL-08", "FCL-PQL-09",
  "FSR-PQL-01", "FSR-PQL-02", "FSR-PQL-03", "FSR-PQL-04",
  "FSR-PQL-05", "FSR-PQL-06", "FSR-PQL-07", "FSR-PQL-08",
] as const;

const EXPECTED_HEAD = "5bd56352a6f2394df9f4f83d09f90638292f05bc";
const EXPECTED_DIGEST =
  "sha256:b565bd45cb003a362bd927e0115a1c3303563050955577c0dbf1c2669b88a428";

assert.equal(SPATIAL_HUMAN_REVIEW_APPROVAL_V1.status, "APPROVED");
assert.equal(SPATIAL_HUMAN_REVIEW_APPROVAL_V1.approvedAt, "2026-08-15");
assert.equal(SPATIAL_HUMAN_REVIEW_APPROVAL_V1.approvedReview.sourceHead, EXPECTED_HEAD);
assert.equal(SPATIAL_HUMAN_REVIEW_APPROVAL_V1.approvedReview.workflowRunId, 31879721096);
assert.equal(SPATIAL_HUMAN_REVIEW_APPROVAL_V1.approvedReview.artifactId, 9245701817);
assert.equal(SPATIAL_HUMAN_REVIEW_APPROVAL_V1.approvedReview.artifactDigest, EXPECTED_DIGEST);
assert.equal(SPATIAL_HUMAN_REVIEW_APPROVAL_V1.approvedReview.activeProposedQls, 30);
assert.equal(SPATIAL_HUMAN_REVIEW_APPROVAL_V1.approvedReview.reviewedQuestions, 120);
assert.equal(SPATIAL_HUMAN_REVIEW_APPROVAL_V1.authorization.permanentQlAllocationAllowed, true);
assert.equal(SPATIAL_HUMAN_REVIEW_APPROVAL_V1.authorization.englishImplementationFreezeAllowed, true);
assert.equal(SPATIAL_HUMAN_REVIEW_APPROVAL_V1.authorization.questionStudioActivationAllowed, false);

assert.equal(SPATIAL_PERMANENT_QL_ALLOCATIONS_V1.length, 30);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.permanentQlCount, 30);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.nextAvailablePermanentQlId, "SPA-QL-031");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.approvedReviewHead, EXPECTED_HEAD);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.status, "PERMANENT_ENGLISH_IMPLEMENTATION_FROZEN");

const expectedIds = Array.from({ length: 30 }, (_, index) =>
  `SPA-QL-${String(index + 1).padStart(3, "0")}`,
);
assert.deepEqual(
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V1.map((entry) => entry.permanentQlId),
  expectedIds,
  "Spatial permanent IDs must be continuous SPA-QL-001..030.",
);
assert.deepEqual(
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V1.map((entry) => entry.proposalId),
  EXPECTED_PROPOSALS,
  "Every approved PQL must map exactly once in approved chapter order.",
);
assert.equal(new Set(expectedIds).size, 30);
assert.equal(
  new Set(SPATIAL_PERMANENT_QL_ALLOCATIONS_V1.map((entry) => entry.proposalId)).size,
  30,
);

const chapterCounts = SPATIAL_PERMANENT_QL_ALLOCATIONS_V1.reduce<Record<string, number>>(
  (counts, entry) => {
    counts[entry.chapterCode] = (counts[entry.chapterCode] ?? 0) + 1;
    return counts;
  },
  {},
);
assert.deepEqual(chapterCounts, {
  "MIR-001": 3,
  "WAT-001": 2,
  "FAN-001": 8,
  "FCL-001": 9,
  "FSR-001": 8,
});

const allocatedProposalIds = new Set(
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V1.map((entry) => entry.proposalId),
);
for (const hold of SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.holdsUnallocated) {
  assert.equal(
    allocatedProposalIds.has(hold),
    false,
    `${hold} must remain outside permanent allocation.`,
  );
}

for (const entry of SPATIAL_PERMANENT_QL_ALLOCATIONS_V1) {
  assert.equal(entry.englishImplementationFrozen, true);
  assert.equal(entry.approvedReviewHead, EXPECTED_HEAD);
  assert.equal(entry.allocationStatus, "PERMANENT_ENGLISH_IMPLEMENTATION_FROZEN");
  assert.equal(entry.active, false);
  assert.equal(entry.questionStudioDiscoverable, false);
  assert.equal(entry.questionStudioRegistrationStatus, "NOT_REGISTERED");
  assert.equal(entry.questionBankWritable, false);
  assert.equal(entry.testEligible, false);
  assert.equal(entry.publiclyPublishable, false);
  assert.equal(entry.hindiPunjabiGeneration, false);
}

const lifecycle = SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.lifecycle;
assert.equal(lifecycle.active, false);
assert.equal(lifecycle.questionStudioDiscoverable, false);
assert.equal(lifecycle.questionStudioRegistrationStatus, "NOT_REGISTERED");
assert.equal(lifecycle.questionBankWritable, false);
assert.equal(lifecycle.testEligible, false);
assert.equal(lifecycle.publiclyPublishable, false);
assert.equal(lifecycle.hindiPunjabiGeneration, false);
assert.equal(
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.nextGate,
  "SPATIAL_QUESTION_STUDIO_ACTIVATION_APPROVAL_V1",
);

assert.equal(SPATIAL_HUMAN_REVIEW_APPROVAL_V1.sourceScope.BANKING, "NOT_ESTABLISHED");
assert.equal(SPATIAL_HUMAN_REVIEW_APPROVAL_V1.sourceScope.PUNJAB_STATE, "NOT_ESTABLISHED");

const evidence = {
  status: "PASS_SPA_FND_001_PERMANENT_QL_ALLOCATION_V1",
  approval: {
    approvalId: SPATIAL_HUMAN_REVIEW_APPROVAL_V1.approvalId,
    approvedReviewHead: EXPECTED_HEAD,
    workflowRunId: 31879721096,
    artifactId: 9245701817,
    artifactDigest: EXPECTED_DIGEST,
  },
  allocation: {
    permanentQls: 30,
    range: "SPA-QL-001..SPA-QL-030",
    nextAvailable: "SPA-QL-031",
    chapterCounts,
    holdsUnallocated: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.holdsUnallocated,
  },
  checks: {
    exactApprovedReviewPinned: true,
    continuousPermanentIds: true,
    allThirtyApprovedPqlsMappedOnce: true,
    englishImplementationFrozen: true,
    holdsRemainUnallocated: true,
    questionStudioStillDisabled: true,
    questionBankStillDisabled: true,
    testsAndPublicationStillDisabled: true,
    hindiPunjabiStillDisabled: true,
    bankingAndPunjabSourceScopeNotOverclaimed: true,
  },
  nextGate: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.nextGate,
};

const out = "dist/reasoning-v1/spatial";
mkdirSync(out, { recursive: true });
writeFileSync(
  `${out}/spa-permanent-ql-allocation-v1-evidence.json`,
  JSON.stringify(evidence, null, 2),
);
console.log(JSON.stringify(evidence, null, 2));
