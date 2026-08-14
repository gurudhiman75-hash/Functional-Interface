import type { AuditCaselet } from "../saturation/corpus.ts";
import type { Sea001LocalizedReviewCaselet } from "./candidate-localizer.ts";
import { applySea001CanonicalExplanationParity } from "./explanation-parity.ts";
import { buildSea001NativeCandidate } from "./native-input-adapter.ts";
import type { Sea001TranslatedLocale } from "./readiness.ts";

/**
 * Final review candidate authority for Hindi/Punjabi explanations.
 * Stems/clues/questions retain the proven native renderer; every explanation
 * is then replaced from the frozen canonical English explanation authority.
 */
export function buildSea001ExplanationParityCandidate(
  source: AuditCaselet,
  locale: Sea001TranslatedLocale,
): Sea001LocalizedReviewCaselet {
  const nativeCandidate = buildSea001NativeCandidate(source, locale);
  return applySea001CanonicalExplanationParity(source, nativeCandidate, locale);
}
