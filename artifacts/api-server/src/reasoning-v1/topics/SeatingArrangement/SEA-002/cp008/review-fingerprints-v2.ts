import { createHash } from "node:crypto";

import {
  SEA002_CP008_ENGLISH_EDITORIAL_V2,
  SEA002_CP008_ENGLISH_REVIEW_SET_V2,
} from "./production-review-v2.ts";
import { SEA002_CP008_LOCALIZED_REVIEW_SET_V2 } from "./localization-v2.ts";

export const SEA002_CP008_ENGLISH_REVIEW_FINGERPRINT_V2 = createHash("sha256")
  .update(SEA002_CP008_ENGLISH_REVIEW_SET_V2.map((candidate) => candidate.fingerprint).sort().join("|"))
  .digest("hex");

export const SEA002_CP008_LOCALIZATION_REVIEW_FINGERPRINT_V2 = createHash("sha256")
  .update(SEA002_CP008_LOCALIZED_REVIEW_SET_V2.map((candidate) => candidate.localizedFingerprint).sort().join("|"))
  .digest("hex");

export const SEA002_CP008_REVIEW_FINGERPRINT_AUTHORITY_V2 = Object.freeze({
  renderer: SEA002_CP008_ENGLISH_EDITORIAL_V2.renderer,
  productionGraphVersion: SEA002_CP008_ENGLISH_EDITORIAL_V2.productionGraphVersion,
  difficultyPolicy: SEA002_CP008_ENGLISH_EDITORIAL_V2.difficultyPolicy,
  explanationPolicy: SEA002_CP008_ENGLISH_EDITORIAL_V2.explanationPolicy,
  discoveryConstraintSpineUsed: SEA002_CP008_ENGLISH_EDITORIAL_V2.discoveryConstraintSpineUsed,
  englishCanonicalSurfaces: SEA002_CP008_ENGLISH_REVIEW_SET_V2.length,
  localizedSurfaces: SEA002_CP008_LOCALIZED_REVIEW_SET_V2.length,
  englishReviewFingerprint: SEA002_CP008_ENGLISH_REVIEW_FINGERPRINT_V2,
  localizationReviewFingerprint: SEA002_CP008_LOCALIZATION_REVIEW_FINGERPRINT_V2,
  englishHumanApproval: "PENDING" as const,
  localizationHumanApproval: "PENDING" as const,
});
