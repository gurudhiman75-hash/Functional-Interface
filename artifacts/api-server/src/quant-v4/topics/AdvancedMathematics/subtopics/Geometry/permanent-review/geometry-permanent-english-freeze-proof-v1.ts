import { GEO_PERMANENT_ENGLISH_FREEZE_AUTHORITY_V1 } from "./geometry-permanent-english-freeze-v1";

if (GEO_PERMANENT_ENGLISH_FREEZE_AUTHORITY_V1.permanentQlCount !== 75) {
  throw new Error("Geometry English freeze proof requires 75 permanent QLs.");
}
if (GEO_PERMANENT_ENGLISH_FREEZE_AUTHORITY_V1.mappedPrototypeVariantCount !== 81) {
  throw new Error("Geometry English freeze proof requires 81 mapped prototype variants.");
}

export const GEO_PERMANENT_ENGLISH_FREEZE_PROOF_V1 = Object.freeze({
  authorityId: "GEO-PERMANENT-ENGLISH-FREEZE-PROOF-V1",
  authorityRevision: 3,
  status: "PERMANENT_ENGLISH_IMPLEMENTATION_PROVEN_FROZEN",
  proof: Object.freeze({
    headSha: "2e72d10a14fff53195f3b077e1c5bc2619b8a3a9",
    workflowRunId: 33159181373,
    workflowJobId: 98809211590,
    workflowJobName: "validate-geometry-permanent-english-freeze",
    artifactId: 9680899337,
    artifactName: "geometry-permanent-english-freeze-v1",
    artifactSizeBytes: 1752,
    artifactDigest: "sha256:96b16c81e3ae365e69618711a0752e21fc4c81dc8f27730f31135b4504e274e7",
  }),
  provenClaims: Object.freeze({
    permanentQlCount: 75,
    mappedPrototypeVariantCount: 81,
    deterministicContentEqualitySamples: 81,
    stressContentEqualitySamples: 972,
    approvedReviewArtifactId: 9679418692,
    approvedReviewArtifactDigest: "sha256:e59f80ea2e1a532a15bd2b9520acf98ceba368e788c9a2a8c044457a688e562b",
    learnerFacingContentUnchangedByFreeze: true,
  }),
  lifecycle: Object.freeze({
    englishRuntimeProven: true,
    exactEnglishReviewArtifactApproved: true,
    englishImplementationFrozen: true,
    englishFreezeProven: true,
    localizationAllowed: true,
    multilingualImplementationFrozen: false,
    questionStudioActivationAllowed: false,
    questionBankWriteAllowed: false,
    testEligibilityAllowed: false,
    publicPublicationAllowed: false,
    prMergeAuthorized: false,
  }),
  nextGate: "HINDI_PUNJABI_LOCALIZATION_REVIEW",
} as const);
