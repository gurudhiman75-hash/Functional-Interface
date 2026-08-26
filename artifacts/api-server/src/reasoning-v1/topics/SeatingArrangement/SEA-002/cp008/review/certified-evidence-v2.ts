import { SEA002_CP008_PREFREEZE_AUTHORITY_V2 } from "./prefreeze-authority-v2.ts";

export const SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2 = Object.freeze({
  certifiedReviewHeadSha: "beaf04d30859d7ccba36fd7552ea950e185fe50d" as const,
  combinedPrefreezeRunId: 32931533629,
  artifactId: 9593510830,
  artifactDigest: "sha256:b08f4add0b11e1e5e846d61815bc64f933de6bed6c78cefbc1c822693c8442d2" as const,
  englishReviewFingerprint: "15a7cdb915a7d9f5e8764f56c574dbc316da27126907648a39c53f737b0b23e9" as const,
  localizationReviewFingerprint: "3d27b845b60779f6c26a4218ab3dd701d06c4b9bf7dd934c8d8a0501c762cf2b" as const,
  englishCanonicalSurfaces: 42,
  localizedSurfaces: 84,
  certificationStatus: "CI_CERTIFIED_REVIEW_CONTENT" as const,
});

export function assertSea002Cp008CertifiedEvidenceV2(): void {
  const evidence = SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2;
  if (evidence.englishReviewFingerprint !== SEA002_CP008_PREFREEZE_AUTHORITY_V2.english.reviewFingerprint) {
    throw new Error("SEA-CP-008 certified English evidence no longer matches the current V2 review candidate.");
  }
  if (evidence.localizationReviewFingerprint !== SEA002_CP008_PREFREEZE_AUTHORITY_V2.localization.reviewFingerprint) {
    throw new Error("SEA-CP-008 certified localization evidence no longer matches the current V2 review candidate.");
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
