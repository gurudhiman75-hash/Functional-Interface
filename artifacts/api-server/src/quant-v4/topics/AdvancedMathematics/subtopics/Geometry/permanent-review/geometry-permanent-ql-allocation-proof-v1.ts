import { GEO_PERMANENT_QL_ALLOCATION_AUTHORITY_V1 } from "./geometry-permanent-ql-allocation-v1";

if (GEO_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.permanentQlCount !== 75) {
  throw new Error(
    `Geometry solve-mode review requires the proven 75-QL allocation; got ${GEO_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.permanentQlCount}.`,
  );
}

export const GEO_PERMANENT_QL_ALLOCATION_PROOF_V1 = Object.freeze({
  authorityId: "GEO-PERMANENT-QL-ALLOCATION-PROOF-V1",
  authorityRevision: 3,
  status: "PERMANENT_75_QL_ALLOCATION_PROVEN",
  proof: Object.freeze({
    headSha: "b67e602105efda7bd2f0a67d4fc6698daaa3c4aa",
    workflowRunId: 33154550293,
    workflowJobId: 98794102972,
    workflowJobName: "validate-geometry-permanent-75-ql-allocation",
    artifactId: 9679061402,
    artifactName: "geometry-permanent-ql-allocation-v1",
    artifactSizeBytes: 22015,
    artifactDigest: "sha256:f6811e00ee39805a32b0cba9ac24bd74d36701e5aa2630a959e1e86c45af5831",
  }),
  provenClaims: Object.freeze({
    temporaryCandidateCount: 81,
    semanticFamilyCount: 75,
    permanentQlCount: 75,
    permanentQlRange: "GEO-QL-001..GEO-QL-075",
    intentionalMergeGroupCount: 6,
    everyTemporaryAuthorityAllocatedExactlyOnce: true,
    permanentQlIdsContiguousAndUnique: true,
    proposalOrderPreserved: true,
  }),
  lifecycle: Object.freeze({
    permanentFamilyArchitectureApproved: true,
    permanentQlAllocationProven: true,
    permanentQlIdsReserved: true,
    solveModeFreezeAllowed: true,
    solveModeFreezeProven: false,
    englishRuntimeImplementationAllowed: false,
    englishFreezeAllowed: false,
    localizationAllowed: false,
    questionStudioActivationAllowed: false,
    questionBankWriteAllowed: false,
    testEligibilityAllowed: false,
    publicPublicationAllowed: false,
    prMergeAuthorized: false,
  }),
  nextGate: "SOLVE_MODE_FREEZE_PROOF",
} as const);
