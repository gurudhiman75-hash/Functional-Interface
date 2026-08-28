import { GEO_SOLVE_MODE_FREEZE_AUTHORITY_V1 } from "./geometry-solve-mode-freeze-v1";

if (GEO_SOLVE_MODE_FREEZE_AUTHORITY_V1.canonicalSolveModeFamilyCount !== 75) {
  throw new Error(
    `Geometry English runtime review requires 75 frozen solve-mode families; got ${GEO_SOLVE_MODE_FREEZE_AUTHORITY_V1.canonicalSolveModeFamilyCount}.`,
  );
}

export const GEO_SOLVE_MODE_FREEZE_PROOF_V1 = Object.freeze({
  authorityId: "GEO-SOLVE-MODE-FREEZE-PROOF-V1",
  authorityRevision: 3,
  status: "PERMANENT_75_SOLVE_MODE_FAMILIES_PROVEN",
  proof: Object.freeze({
    headSha: "53317e88b88e2fec800e11d375eeae79e6dbbe7d",
    workflowRunId: 33155000056,
    workflowJobId: 98795564529,
    workflowJobName: "validate-geometry-permanent-solve-mode-freeze",
    artifactId: 9679234386,
    artifactName: "geometry-solve-mode-freeze-v1",
    artifactSizeBytes: 16835,
    artifactDigest: "sha256:56c81abad2fc5da23cb2850bded0f24afa5f0627142eae0a0989b824e30ad497",
  }),
  provenClaims: Object.freeze({
    temporaryCandidateAuthorityCount: 81,
    permanentQlCount: 75,
    canonicalSolveModeFamilyCount: 75,
    canonicalSolveModeFamilyRange: "GEO-SM-001..GEO-SM-075",
    parameterizedMultiAuthorityFamilyCount: 6,
    qlToCanonicalSolveModeFamilyIsOneToOne: true,
    prototypeSolveModeProvenancePreserved: true,
    regressionSplitsPreserved: true,
  }),
  lifecycle: Object.freeze({
    permanentQlAllocationProven: true,
    solveModeFreezeProven: true,
    englishRuntimeImplementationAllowed: true,
    englishRuntimeImplemented: false,
    englishFreezeAllowed: false,
    localizationAllowed: false,
    questionStudioActivationAllowed: false,
    questionBankWriteAllowed: false,
    testEligibilityAllowed: false,
    publicPublicationAllowed: false,
    prMergeAuthorized: false,
  }),
  nextGate: "ENGLISH_RUNTIME_REVIEW",
} as const);
