import { GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2 } from "./geometry-permanent-multilingual-review-v2";

if (GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.permanentQlCount !== 75) {
  throw new Error("Geometry multilingual V2 review proof requires 75 permanent QLs.");
}
if (GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.mappedPrototypeVariantCount !== 81) {
  throw new Error("Geometry multilingual V2 review proof requires 81 mapped prototype variants.");
}
if (GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.additionalSourceVariantTemplateCount !== 91) {
  throw new Error("Geometry multilingual V2 review proof requires 91 additional source-variant templates.");
}

export const GEO_PERMANENT_MULTILINGUAL_REVIEW_PROOF_V2 = Object.freeze({
  authorityId: "GEO-PERMANENT-MULTILINGUAL-REVIEW-PROOF-V2",
  authorityRevision: 3,
  status: "HINDI_PUNJABI_V2_REVIEW_PROVEN_AND_EXACT_ARTIFACT_APPROVED",
  proof: Object.freeze({
    headSha: "aa94efa28a51724f1c0f5416a4d4f9bee9703f19",
    workflowRunId: 33182824118,
    workflowJobId: 98888110972,
    workflowJobName: "validate-geometry-hindi-punjabi-localisation-review-v2",
    artifactId: 9690420669,
    artifactName: "geometry-permanent-multilingual-review-v2",
    artifactSizeBytes: 156382,
    artifactDigest: "sha256:090ef5809e9a9b3f49df6be8e073786347d8427012eecd16b960f742a97292b6",
  }),
  provenClaims: Object.freeze({
    permanentQlCount: 75,
    mappedPrototypeVariantCount: 81,
    sourceSeedsPerPrototype: 96,
    prototypesWithQuestionVariation: 33,
    prototypesWithExplanationVariation: 8,
    observedQuestionPatternCount: 146,
    observedExplanationPatternCount: 207,
    additionalSourceVariantTemplateCount: 91,
    deterministicReviewSampleCount: 162,
    stressSampleCount: 972,
    englishProseLeakCount: 0,
    unresolvedNumericPlaceholderCount: 0,
    locales: Object.freeze(["hi-IN", "pa-IN"] as const),
    answerIndexesPreserved: true,
    diagramFingerprintsPreserved: true,
    frozenEnglishSemanticsPreserved: true,
  }),
  approval: Object.freeze({
    authority: "EXPLICIT_PRODUCT_OWNER_ARTIFACT_APPROVAL",
    approvalDate: "2026-08-28",
    approvalEvidence: "ACTIVE_SESSION_USER_APPROVED_EXACT_GEOMETRY_HINDI_PUNJABI_V2_REVIEW_ARTIFACT",
    approvedArtifactId: 9690420669,
    approvedArtifactDigest: "sha256:090ef5809e9a9b3f49df6be8e073786347d8427012eecd16b960f742a97292b6",
    approvedHeadSha: "aa94efa28a51724f1c0f5416a4d4f9bee9703f19",
  }),
  lifecycle: Object.freeze({
    englishFreezeProven: true,
    localizationV1EditoriallyRejected: true,
    localizationV2Proven: true,
    exactMultilingualV2ReviewArtifactApproved: true,
    multilingualFreezeAllowed: true,
    multilingualImplementationFrozen: false,
    multilingualFreezeProven: false,
    questionStudioActivationAllowed: false,
    questionBankWriteAllowed: false,
    testEligibilityAllowed: false,
    publicPublicationAllowed: false,
    prMergeAuthorized: false,
  }),
  nextGate: "MULTILINGUAL_IMPLEMENTATION_FREEZE",
} as const);
