import { SEA002_CP008_PREFREEZE_AUTHORITY_V2 } from "./prefreeze-authority-v2.ts";

export const SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2 = Object.freeze({
  certifiedReviewHeadSha: "227f40d0f77ba532ca9e1389c97bc25c1329c885" as const,
  combinedPrefreezeRunId: 32958232723,
  artifactId: 9603115135,
  artifactDigest: "sha256:fb03b69164c762efa480788dc7ab5557f042ddff472119428f8ed565b2b942a7" as const,
  renderer: "EXAM_REAL_SQUARE_PRODUCTION_GRAPH_V3_EDITORIAL_V2" as const,
  productionGraphVersion: "EXAM_REAL_PRODUCTION_GRAPH_V3" as const,
  difficultyPolicy: "STRUCTURAL_DEDUCTION_DEPTH_NOT_LABEL_ONLY" as const,
  explanationPolicy: "HUMAN_COMPLETED_ARRANGEMENT_NO_GRAPH_JARGON" as const,
  discoveryConstraintSpineUsed: false as const,
  englishReviewFingerprint: "35d93c2044e10a8d1593b60be8dbf24b1c36ec724a827bf16b4ab4d2187641d8" as const,
  localizationReviewFingerprint: "6fcffe858c0a3be0447cbc36a87c76dea2fafe4fbb565b89d1cced8b9acd4ca3" as const,
  englishCanonicalSurfaces: 42,
  localizedSurfaces: 84,
  certificationStatus: "CI_CERTIFIED_REVIEW_CONTENT_V3" as const,
});

export function assertSea002Cp008CertifiedEvidenceV2(): void {
  const evidence = SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2;
  if (evidence.englishReviewFingerprint !== SEA002_CP008_PREFREEZE_AUTHORITY_V2.english.reviewFingerprint) {
    throw new Error("SEA-CP-008 certified English evidence no longer matches the current V3 review candidate.");
  }
  if (evidence.localizationReviewFingerprint !== SEA002_CP008_PREFREEZE_AUTHORITY_V2.localization.reviewFingerprint) {
    throw new Error("SEA-CP-008 certified localization evidence no longer matches the current V3 review candidate.");
  }
  if (evidence.renderer !== SEA002_CP008_PREFREEZE_AUTHORITY_V2.english.renderer
    || evidence.productionGraphVersion !== SEA002_CP008_PREFREEZE_AUTHORITY_V2.english.productionGraphVersion
    || evidence.difficultyPolicy !== SEA002_CP008_PREFREEZE_AUTHORITY_V2.english.difficultyPolicy
    || evidence.explanationPolicy !== SEA002_CP008_PREFREEZE_AUTHORITY_V2.english.explanationPolicy
    || evidence.discoveryConstraintSpineUsed !== SEA002_CP008_PREFREEZE_AUTHORITY_V2.english.discoveryConstraintSpineUsed) {
    throw new Error("SEA-CP-008 certified V3 renderer/graph/explanation identity drifted from the current review authority.");
  }
  if (evidence.englishCanonicalSurfaces !== SEA002_CP008_PREFREEZE_AUTHORITY_V2.english.canonicalSurfaces
    || evidence.localizedSurfaces !== SEA002_CP008_PREFREEZE_AUTHORITY_V2.localization.localizedSurfaces) {
    throw new Error("SEA-CP-008 certified evidence surface counts drifted from the current review authority.");
  }
  if (!/^[0-9a-f]{40}$/u.test(evidence.certifiedReviewHeadSha)
    || !/^sha256:[0-9a-f]{64}$/u.test(evidence.artifactDigest)
    || !Number.isInteger(evidence.combinedPrefreezeRunId)
    || !Number.isInteger(evidence.artifactId)) {
    throw new Error("SEA-CP-008 certified evidence metadata is malformed.");
  }
}
