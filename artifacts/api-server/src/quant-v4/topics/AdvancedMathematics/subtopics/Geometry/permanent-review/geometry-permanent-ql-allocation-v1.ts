import { GEO_MERGE_SPLIT_PROPOSAL_V1 } from "./geometry-merge-split-proposal-v1";
import { GEO_PERMANENT_FAMILY_APPROVAL_V1 } from "./geometry-permanent-family-approval-v1";

export type GeometryPermanentQlIdV1 = `GEO-QL-${string}`;

export interface GeometryPermanentQlAllocationV1 {
  readonly permanentQlId: GeometryPermanentQlIdV1;
  readonly proposalKey: string;
  readonly cpId: string;
  readonly learnerDecision: string;
  readonly candidateIds: readonly string[];
  readonly solveModes: readonly string[];
  readonly mergeRationale: string;
  readonly allocationStatus: "PERMANENT_QL_ALLOCATED_SOLVE_MODE_REVIEW_PENDING";
  readonly solveModeFreezeStatus: "NOT_FROZEN";
  readonly englishRuntimeImplemented: false;
  readonly englishImplementationFrozen: false;
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionStudioRegistrationStatus: "NOT_REGISTERED";
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
  readonly hindiPunjabiGeneration: false;
}

if (!GEO_PERMANENT_FAMILY_APPROVAL_V1.approvalScope.permanentQlAllocationAllowed) {
  throw new Error("Geometry permanent QL allocation is not approved.");
}
if (GEO_MERGE_SPLIT_PROPOSAL_V1.length !== 75) {
  throw new Error(`Geometry permanent QL allocation requires exactly 75 proven families; got ${GEO_MERGE_SPLIT_PROPOSAL_V1.length}.`);
}

function permanentQlIdForIndex(index: number): GeometryPermanentQlIdV1 {
  return `GEO-QL-${String(index + 1).padStart(3, "0")}`;
}

export const GEO_PERMANENT_QL_ALLOCATIONS_V1: readonly GeometryPermanentQlAllocationV1[] = Object.freeze(
  GEO_MERGE_SPLIT_PROPOSAL_V1.map((family, index) =>
    Object.freeze({
      permanentQlId: permanentQlIdForIndex(index),
      proposalKey: family.proposalKey,
      cpId: family.cpId,
      learnerDecision: family.learnerDecision,
      candidateIds: family.candidateIds,
      solveModes: family.solveModes,
      mergeRationale: family.mergeRationale,
      allocationStatus: "PERMANENT_QL_ALLOCATED_SOLVE_MODE_REVIEW_PENDING",
      solveModeFreezeStatus: "NOT_FROZEN",
      englishRuntimeImplemented: false,
      englishImplementationFrozen: false,
      active: false,
      questionStudioDiscoverable: false,
      questionStudioRegistrationStatus: "NOT_REGISTERED",
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
      hindiPunjabiGeneration: false,
    } satisfies GeometryPermanentQlAllocationV1),
  ),
);

export const GEO_PERMANENT_QL_ALLOCATION_AUTHORITY_V1 = Object.freeze({
  authorityId: "GEO-PERMANENT-QL-ALLOCATION-V1",
  authorityRevision: 3,
  approvalAuthorityId: GEO_PERMANENT_FAMILY_APPROVAL_V1.authorityId,
  status: "PERMANENT_75_QL_ALLOCATION_COMPLETE__SOLVE_MODE_REVIEW_PENDING",
  allocations: GEO_PERMANENT_QL_ALLOCATIONS_V1,
  permanentQlCount: GEO_PERMANENT_QL_ALLOCATIONS_V1.length,
  permanentQlRange: "GEO-QL-001..GEO-QL-075",
  nextAvailablePermanentQlId: "GEO-QL-076",
  chapterCounts: Object.freeze({
    "GEO-CP-001": 4,
    "GEO-CP-002": 3,
    "GEO-CP-003": 7,
    "GEO-CP-004": 4,
    "GEO-CP-005": 6,
    "GEO-CP-006": 9,
    "GEO-CP-007": 3,
    "GEO-CP-008": 5,
    "GEO-CP-009": 7,
    "GEO-CP-010": 5,
    "GEO-CP-011": 6,
    "GEO-CP-012": 5,
    "GEO-CP-013": 4,
    "GEO-CP-014": 7,
  }),
  lifecycle: Object.freeze({
    permanentFamilyArchitectureApproved: true,
    permanentQlIdsReserved: true,
    permanentQlAllocationComplete: true,
    solveModeFreezeAuthorized: false,
    solveModesFrozen: false,
    englishFreezeAuthorized: false,
    englishRuntimeImplemented: false,
    englishImplementationFrozen: false,
    localizationAuthorized: false,
    questionStudioActivationAuthorized: false,
    questionStudioDiscoverable: false,
    questionStudioRegistrationStatus: "NOT_REGISTERED",
    questionBankWriteAuthorized: false,
    questionBankWritable: false,
    testEligibilityAuthorized: false,
    testEligible: false,
    publicPublicationAuthorized: false,
    publiclyPublishable: false,
    hindiPunjabiGeneration: false,
    prMergeAuthorized: false,
  }),
  nextGate: "SOLVE_MODE_FREEZE_REVIEW",
} as const);
