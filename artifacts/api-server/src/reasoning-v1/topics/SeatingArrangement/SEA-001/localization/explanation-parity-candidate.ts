import { compileSea001TeachingExplanationFromUnknown } from "../explanation/checkpoint-teaching.ts";
import type { AuditCaselet } from "../saturation/corpus.ts";
import type { Sea001LocalizedReviewCaselet } from "./candidate-localizer.ts";
import { applySea001CanonicalExplanationParity } from "./explanation-parity.ts";
import { buildSea001NativeCandidate } from "./native-input-adapter.ts";
import type { Sea001TranslatedLocale } from "./readiness.ts";

/**
 * Reproduce the exact English explanation presentation used by
 * sea-001-review-export.ts. This is the English explanation authority that was
 * manually reviewed and frozen; raw generator sharedExplanation is not enough.
 */
export function sea001EnglishExplanationAuthority(source: AuditCaselet): AuditCaselet {
  return {
    ...source,
    sharedExplanation: compileSea001TeachingExplanationFromUnknown(source),
  };
}

/**
 * Final review candidate authority for Hindi/Punjabi explanations.
 * Stems/clues/questions retain the proven native renderer; every explanation
 * is then translated from the same final English teaching presentation that
 * was exposed in the approved English review artifact.
 */
export function buildSea001ExplanationParityCandidate(
  source: AuditCaselet,
  locale: Sea001TranslatedLocale,
): Sea001LocalizedReviewCaselet {
  const nativeCandidate = buildSea001NativeCandidate(source, locale);
  const englishAuthority = sea001EnglishExplanationAuthority(source);
  return applySea001CanonicalExplanationParity(englishAuthority, nativeCandidate, locale);
}
