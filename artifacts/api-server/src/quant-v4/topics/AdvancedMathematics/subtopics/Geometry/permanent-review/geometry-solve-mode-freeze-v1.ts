import { GEO_PERMANENT_QL_ALLOCATION_PROOF_V1 } from "./geometry-permanent-ql-allocation-proof-v1";
import {
  GEO_PERMANENT_QL_ALLOCATION_AUTHORITY_V1,
  GEO_PERMANENT_QL_ALLOCATIONS_V1,
} from "./geometry-permanent-ql-allocation-v1";

export type GeometryCanonicalSolveModeFamilyIdV1 = `GEO-SM-${string}`;

export interface GeometrySolveModeFreezeV1 {
  readonly canonicalSolveModeFamilyId: GeometryCanonicalSolveModeFamilyIdV1;
  readonly permanentQlId: string;
  readonly proposalKey: string;
  readonly cpId: string;
  readonly learnerDecision: string;
  readonly candidateIds: readonly string[];
  readonly prototypeSolveModes: readonly string[];
  readonly freezeKind: "SINGLE_AUTHORITY" | "PARAMETERIZED_MULTI_AUTHORITY";
  readonly solveModeContractStatus: "FROZEN_FOR_ENGLISH_RUNTIME_IMPLEMENTATION";
  readonly frozen: true;
}

if (!GEO_PERMANENT_QL_ALLOCATION_PROOF_V1.lifecycle.solveModeFreezeAllowed) {
  throw new Error("Geometry solve-mode freeze is not authorized by permanent QL allocation proof.");
}
if (GEO_PERMANENT_QL_ALLOCATIONS_V1.length !== 75) {
  throw new Error(`Geometry solve-mode freeze requires exactly 75 permanent QLs; got ${GEO_PERMANENT_QL_ALLOCATIONS_V1.length}.`);
}

function canonicalSolveModeFamilyIdForIndex(index: number): GeometryCanonicalSolveModeFamilyIdV1 {
  return `GEO-SM-${String(index + 1).padStart(3, "0")}`;
}

for (const allocation of GEO_PERMANENT_QL_ALLOCATIONS_V1) {
  if (allocation.candidateIds.length === 0) {
    throw new Error(`${allocation.permanentQlId} has no temporary authority provenance.`);
  }
  if (allocation.solveModes.length === 0) {
    throw new Error(`${allocation.permanentQlId} has no prototype solve-mode provenance to freeze.`);
  }
}

export const GEO_SOLVE_MODE_FREEZE_V1: readonly GeometrySolveModeFreezeV1[] = Object.freeze(
  GEO_PERMANENT_QL_ALLOCATIONS_V1.map((allocation, index) =>
    Object.freeze({
      canonicalSolveModeFamilyId: canonicalSolveModeFamilyIdForIndex(index),
      permanentQlId: allocation.permanentQlId,
      proposalKey: allocation.proposalKey,
      cpId: allocation.cpId,
      learnerDecision: allocation.learnerDecision,
      candidateIds: allocation.candidateIds,
      prototypeSolveModes: allocation.solveModes,
      freezeKind: allocation.candidateIds.length > 1 ? "PARAMETERIZED_MULTI_AUTHORITY" : "SINGLE_AUTHORITY",
      solveModeContractStatus: "FROZEN_FOR_ENGLISH_RUNTIME_IMPLEMENTATION",
      frozen: true,
    } satisfies GeometrySolveModeFreezeV1),
  ),
);

export const GEO_SOLVE_MODE_FREEZE_AUTHORITY_V1 = Object.freeze({
  authorityId: "GEO-SOLVE-MODE-FREEZE-V1",
  authorityRevision: 3,
  allocationAuthorityId: GEO_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.authorityId,
  allocationProofAuthorityId: GEO_PERMANENT_QL_ALLOCATION_PROOF_V1.authorityId,
  status: "PERMANENT_75_SOLVE_MODE_FAMILIES_FROZEN__CI_PROOF_PENDING",
  canonicalSolveModeFamilies: GEO_SOLVE_MODE_FREEZE_V1,
  canonicalSolveModeFamilyCount: GEO_SOLVE_MODE_FREEZE_V1.length,
  canonicalSolveModeFamilyRange: "GEO-SM-001..GEO-SM-075",
  nextAvailableCanonicalSolveModeFamilyId: "GEO-SM-076",
  chapterCounts: GEO_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.chapterCounts,
  lifecycle: Object.freeze({
    permanentQlAllocationProven: true,
    solveModeFreezeImplemented: true,
    solveModeFreezeProven: false,
    solveModesFrozenInAuthority: true,
    englishRuntimeImplementationAllowed: false,
    englishRuntimeImplemented: false,
    englishFreezeAllowed: false,
    englishImplementationFrozen: false,
    localizationAllowed: false,
    questionStudioActivationAllowed: false,
    questionStudioDiscoverable: false,
    questionBankWriteAllowed: false,
    questionBankWritable: false,
    testEligibilityAllowed: false,
    testEligible: false,
    publicPublicationAllowed: false,
    publiclyPublishable: false,
    prMergeAuthorized: false,
  }),
  currentGate: "SOLVE_MODE_FREEZE_PROOF",
  postProofNextGate: "ENGLISH_RUNTIME_REVIEW",
} as const);
