import { GEO_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1 } from "./geometry-permanent-english-runtime-v1";

if (GEO_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.permanentQlCount !== 75) {
  throw new Error(`Geometry English review proof requires 75 permanent QLs; got ${GEO_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.permanentQlCount}.`);
}
if (GEO_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.mappedVariantCount !== 81) {
  throw new Error(`Geometry English review proof requires 81 mapped prototype variants; got ${GEO_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.mappedVariantCount}.`);
}

export const GEO_PERMANENT_ENGLISH_REVIEW_PROOF_V1 = Object.freeze({
  authorityId: "GEO-PERMANENT-ENGLISH-REVIEW-PROOF-V1",
  authorityRevision: 3,
  status: "PERMANENT_ENGLISH_REVIEW_PROVEN_AND_EXACT_ARTIFACT_APPROVED",
  proof: Object.freeze({
    headSha: "95407299aacb20f343c4d35b35db97a2b90e21d1",
    workflowRunId: 33155481065,
    workflowJobId: 98797121604,
    workflowJobName: "validate-geometry-permanent-english-review",
    artifactId: 9679418692,
    artifactName: "geometry-permanent-english-review-v1",
    artifactSizeBytes: 87713,
    artifactDigest: "sha256:e59f80ea2e1a532a15bd2b9520acf98ceba368e788c9a2a8c044457a688e562b",
  }),
  provenClaims: Object.freeze({
    permanentQlCount: 75,
    mappedPrototypeVariantCount: 81,
    deterministicReviewSampleCount: 81,
    stressSampleCount: 972,
    diagramReviewItemCount: 57,
    language: "en",
    locale: "en-IN",
    reviewArtifactContainsJson: true,
    reviewArtifactContainsMarkdown: true,
    reviewArtifactContainsHtml: true,
  }),
  approval: Object.freeze({
    authority: "EXPLICIT_PRODUCT_OWNER_ARTIFACT_APPROVAL",
    approvalDate: "2026-08-28",
    approvalEvidence: "ACTIVE_SESSION_USER_APPROVED_EXACT_GEOMETRY_ENGLISH_REVIEW_ARTIFACT",
    approvedArtifactId: 9679418692,
    approvedArtifactDigest: "sha256:e59f80ea2e1a532a15bd2b9520acf98ceba368e788c9a2a8c044457a688e562b",
    approvedHeadSha: "95407299aacb20f343c4d35b35db97a2b90e21d1",
  }),
  lifecycle: Object.freeze({
    solveModeFreezeProven: true,
    englishRuntimeProven: true,
    exactEnglishReviewArtifactApproved: true,
    englishFreezeAllowed: true,
    englishImplementationFrozen: false,
    localizationAllowed: false,
    questionStudioActivationAllowed: false,
    questionBankWriteAllowed: false,
    testEligibilityAllowed: false,
    publicPublicationAllowed: false,
    prMergeAuthorized: false,
  }),
  nextGate: "ENGLISH_IMPLEMENTATION_FREEZE",
} as const);
