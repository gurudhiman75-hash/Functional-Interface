import { SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2 } from "./certified-evidence-v2.ts";
import { buildSea002Cp008FrozenAuthorityV2 } from "./freeze-contract-v2.ts";

export const SEA002_CP008_EXPLICIT_PRODUCT_APPROVAL_V1 = Object.freeze({
  approvedBy: "PRODUCT_OWNER" as const,
  approvedAt: "2026-08-26T14:08:29Z" as const,
  englishReviewFingerprint: "35d93c2044e10a8d1593b60be8dbf24b1c36ec724a827bf16b4ab4d2187641d8" as const,
  localizationReviewFingerprint: "6fcffe858c0a3be0447cbc36a87c76dea2fafe4fbb565b89d1cced8b9acd4ca3" as const,
  certifiedReviewArtifactId: 9603115135,
  certifiedReviewArtifactDigest: "sha256:fb03b69164c762efa480788dc7ab5557f042ddff472119428f8ed565b2b942a7" as const,
});

export function assertSea002Cp008ExplicitProductApprovalV1(): void {
  const approval = SEA002_CP008_EXPLICIT_PRODUCT_APPROVAL_V1;
  const evidence = SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2;
  if (approval.englishReviewFingerprint !== evidence.englishReviewFingerprint
    || approval.localizationReviewFingerprint !== evidence.localizationReviewFingerprint
    || approval.certifiedReviewArtifactId !== evidence.artifactId
    || approval.certifiedReviewArtifactDigest !== evidence.artifactDigest) {
    throw new Error("SEA-CP-008 product approval does not match the exact certified review evidence.");
  }
}

assertSea002Cp008ExplicitProductApprovalV1();

export const SEA002_CP008_APPROVED_FROZEN_AUTHORITY_V1 = Object.freeze(
  buildSea002Cp008FrozenAuthorityV2(SEA002_CP008_EXPLICIT_PRODUCT_APPROVAL_V1),
);
