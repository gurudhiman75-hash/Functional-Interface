import { GEO_PERMANENT_MULTILINGUAL_FREEZE_AUTHORITY_V1 } from "./geometry-permanent-multilingual-freeze-v1";

if (GEO_PERMANENT_MULTILINGUAL_FREEZE_AUTHORITY_V1.permanentQlCount !== 75) {
  throw new Error("Geometry multilingual freeze proof requires 75 permanent QLs.");
}
if (GEO_PERMANENT_MULTILINGUAL_FREEZE_AUTHORITY_V1.mappedPrototypeVariantCount !== 81) {
  throw new Error("Geometry multilingual freeze proof requires 81 mapped prototype variants.");
}

export const GEO_PERMANENT_MULTILINGUAL_FREEZE_PROOF_V1 = Object.freeze({
  authorityId: "GEO-PERMANENT-MULTILINGUAL-FREEZE-PROOF-V1",
  authorityRevision: 3,
  status: "PERMANENT_HINDI_PUNJABI_IMPLEMENTATION_PROVEN_FROZEN",
  proof: Object.freeze({
    headSha: "37159dda9df002a144de2f2a51290b8cfa892926",
    workflowRunId: 33185991437,
    workflowJobId: 98899017638,
    workflowJobName: "validate-geometry-permanent-multilingual-freeze",
    artifactId: 9691767855,
    artifactName: "geometry-permanent-multilingual-freeze-v1",
    artifactSizeBytes: 2029,
    artifactDigest: "sha256:78c91fa134661080513549a9350d02e2d5a1345d84063688c84da82bb9d8b426",
  }),
  provenClaims: Object.freeze({
    permanentQlCount: 75,
    mappedPrototypeVariantCount: 81,
    locales: Object.freeze(["hi-IN", "pa-IN"] as const),
    deterministicContentEqualitySamples: 162,
    stressContentEqualitySamples: 972,
    approvedReviewArtifactId: 9690420669,
    approvedReviewArtifactDigest: "sha256:090ef5809e9a9b3f49df6be8e073786347d8427012eecd16b960f742a97292b6",
    learnerFacingContentUnchangedByFreeze: true,
    answerIndexesPreserved: true,
    diagramFingerprintsPreserved: true,
  }),
  lifecycle: Object.freeze({
    englishFreezeProven: true,
    localizationV2Proven: true,
    exactMultilingualV2ReviewArtifactApproved: true,
    multilingualImplementationFrozen: true,
    multilingualFreezeProven: true,
    questionStudioIntegrationAllowed: true,
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
  nextGate: "QUESTION_STUDIO_INTEGRATION_IMPLEMENTATION",
} as const);
