import { SEA002_CP008_PREFREEZE_AUTHORITY_V2 } from "./prefreeze-authority-v2.ts";

export const SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2 = Object.freeze({
  certifiedReviewHeadSha: "410e1671b1abbc2398b42caa20afa6ace4703c2a" as const,
  combinedPrefreezeRunId: 32957499088,
  artifactId: 9602601997,
  artifactDigest: "sha256:d91eacc7689b8d8cc61a260e63a5360be65348b5c2456dee35bb9231328a2410" as const,
  renderer: "EXAM_REAL_SQUARE_PRODUCTION_GRAPH_V3_EDITORIAL_V2" as const,
  productionGraphVersion: "EXAM_REAL_PRODUCTION_GRAPH_V3" as const,
  difficultyPolicy: "STRUCTURAL_DEDUCTION_DEPTH_NOT_LABEL_ONLY" as const,
  discoveryConstraintSpineUsed: false as const,
  englishReviewFingerprint: "94661766e62e4c528d3eab4d05acb3165b009057113e338a7f0036a110860f28" as const,
  localizationReviewFingerprint: "9b7f3a60f38e84b7e093d4f035dfc0beb2123655aef9897dbbc791e4183a02de" as const,
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
    || evidence.discoveryConstraintSpineUsed !== SEA002_CP008_PREFREEZE_AUTHORITY_V2.english.discoveryConstraintSpineUsed) {
    throw new Error("SEA-CP-008 certified V3 renderer/graph identity drifted from the current review authority.");
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
