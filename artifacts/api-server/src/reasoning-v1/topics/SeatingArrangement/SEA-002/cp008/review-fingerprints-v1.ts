import { createHash } from "node:crypto";

import { SEA002_CP008_ENGLISH_REVIEW_SET_V1 } from "./production-review-v1.ts";
import { SEA002_CP008_LOCALIZED_REVIEW_SET_V1 } from "./localization-v1.ts";

export const SEA002_CP008_ENGLISH_REVIEW_FINGERPRINT_V1 = createHash("sha256")
  .update(SEA002_CP008_ENGLISH_REVIEW_SET_V1.map((candidate) => candidate.fingerprint).sort().join("|"))
  .digest("hex");

export const SEA002_CP008_LOCALIZATION_REVIEW_FINGERPRINT_V1 = createHash("sha256")
  .update(SEA002_CP008_LOCALIZED_REVIEW_SET_V1.map((candidate) => candidate.localizedFingerprint).sort().join("|"))
  .digest("hex");

export const SEA002_CP008_REVIEW_FINGERPRINT_AUTHORITY_V1 = Object.freeze({
  englishCanonicalSurfaces: SEA002_CP008_ENGLISH_REVIEW_SET_V1.length,
  localizedSurfaces: SEA002_CP008_LOCALIZED_REVIEW_SET_V1.length,
  englishReviewFingerprint: SEA002_CP008_ENGLISH_REVIEW_FINGERPRINT_V1,
  localizationReviewFingerprint: SEA002_CP008_LOCALIZATION_REVIEW_FINGERPRINT_V1,
  englishHumanApproval: "PENDING" as const,
  localizationHumanApproval: "PENDING" as const,
});
