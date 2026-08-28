import {
  GEO_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1,
  GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1,
  generateGeometryPermanentEnglishCandidateV1,
  type GeometryPermanentEnglishCandidateItemV1,
} from "./geometry-permanent-english-runtime-v1";
import { GEO_PERMANENT_ENGLISH_REVIEW_PROOF_V1 } from "./geometry-permanent-english-review-proof-v1";

if (!GEO_PERMANENT_ENGLISH_REVIEW_PROOF_V1.lifecycle.englishFreezeAllowed) {
  throw new Error("Geometry English freeze is not authorized by the approved review artifact proof.");
}
if (GEO_PERMANENT_ENGLISH_REVIEW_PROOF_V1.approval.approvedArtifactId !== 9679418692) {
  throw new Error("Geometry English freeze approval artifact drifted.");
}
if (GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1.length !== 75) {
  throw new Error("Geometry English freeze requires exactly 75 permanent QLs.");
}

export interface GeometryPermanentEnglishFrozenItemV1 extends Omit<
  GeometryPermanentEnglishCandidateItemV1,
  "maturity" | "reviewStatus" | "englishImplementationFrozen" | "active" | "questionStudioDiscoverable" | "questionBankWritable" | "testEligible" | "publiclyPublishable"
> {
  readonly freezeAuthorityId: "GEO-PERMANENT-ENGLISH-FREEZE-V1";
  readonly approvedReviewArtifactId: 9679418692;
  readonly approvedReviewArtifactDigest: "sha256:e59f80ea2e1a532a15bd2b9520acf98ceba368e788c9a2a8c044457a688e562b";
  readonly maturity: "PERMANENT_ENGLISH_IMPLEMENTATION_FROZEN";
  readonly reviewStatus: "EXACT_REVIEW_ARTIFACT_APPROVED_AND_FROZEN";
  readonly englishImplementationFrozen: true;
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}

export function generateGeometryPermanentEnglishFrozenV1(
  qlId: string,
  seed: string,
  requestedVariantIndex?: number,
): GeometryPermanentEnglishFrozenItemV1 {
  const reviewed = generateGeometryPermanentEnglishCandidateV1(qlId, seed, requestedVariantIndex);
  if (
    reviewed.englishImplementationFrozen
    || reviewed.active
    || reviewed.questionStudioDiscoverable
    || reviewed.questionBankWritable
    || reviewed.testEligible
    || reviewed.publiclyPublishable
  ) {
    throw new Error(`${qlId}: reviewed Geometry English source crossed its pre-freeze lifecycle boundary.`);
  }
  return Object.freeze({
    ...reviewed,
    freezeAuthorityId: "GEO-PERMANENT-ENGLISH-FREEZE-V1",
    approvedReviewArtifactId: 9679418692,
    approvedReviewArtifactDigest: "sha256:e59f80ea2e1a532a15bd2b9520acf98ceba368e788c9a2a8c044457a688e562b",
    maturity: "PERMANENT_ENGLISH_IMPLEMENTATION_FROZEN",
    reviewStatus: "EXACT_REVIEW_ARTIFACT_APPROVED_AND_FROZEN",
    englishImplementationFrozen: true,
    active: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  } satisfies GeometryPermanentEnglishFrozenItemV1);
}

export const GEO_PERMANENT_ENGLISH_FREEZE_AUTHORITY_V1 = Object.freeze({
  authorityId: "GEO-PERMANENT-ENGLISH-FREEZE-V1",
  authorityRevision: 3,
  status: "PERMANENT_ENGLISH_IMPLEMENTATION_FROZEN__CI_PROOF_PENDING",
  sourceRuntimeAuthorityId: GEO_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.authorityId,
  reviewProofAuthorityId: GEO_PERMANENT_ENGLISH_REVIEW_PROOF_V1.authorityId,
  approvedReviewArtifactId: GEO_PERMANENT_ENGLISH_REVIEW_PROOF_V1.approval.approvedArtifactId,
  approvedReviewArtifactDigest: GEO_PERMANENT_ENGLISH_REVIEW_PROOF_V1.approval.approvedArtifactDigest,
  permanentQlCount: GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1.length,
  mappedPrototypeVariantCount: GEO_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.mappedVariantCount,
  language: "en",
  locale: "en-IN",
  lifecycle: Object.freeze({
    englishRuntimeProven: true,
    exactEnglishReviewArtifactApproved: true,
    englishImplementationFrozen: true,
    englishFreezeProven: false,
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
  postProofNextGate: "HINDI_PUNJABI_LOCALIZATION_IMPLEMENTATION",
} as const);
