import { compileSea001TeachingExplanationFromUnknown } from "../explanation/checkpoint-teaching.ts";
import type { AuditCaselet } from "../saturation/corpus.ts";
import type { Sea001LocalizedReviewCaselet } from "./candidate-localizer.ts";
import { polishSea001ExplanationParityFidelity } from "./explanation-parity-fidelity-polish.ts";
import { polishSea001ExplanationParityScript } from "./explanation-parity-script-polish.ts";
import { applySea001CanonicalExplanationParity } from "./explanation-parity.ts";
import { buildSea001NativeCandidate } from "./native-input-adapter.ts";
import type { Sea001TranslatedLocale } from "./readiness.ts";

/** Reproduce the exact shared explanation presentation used by the approved English review exporter. */
export function sea001EnglishExplanationAuthority(source: AuditCaselet): AuditCaselet {
  return { ...source, sharedExplanation: compileSea001TeachingExplanationFromUnknown(source) };
}

/**
 * Final Hindi/Punjabi review candidate: proven native stems/clues/questions,
 * followed by translation of the approved English explanation authority,
 * source-driven fidelity polishing, then script-only rendering of inherited
 * English case-direction / grouped-clue labels.
 */
export function buildSea001ExplanationParityCandidate(
  source: AuditCaselet,
  locale: Sea001TranslatedLocale,
): Sea001LocalizedReviewCaselet {
  const nativeCandidate = buildSea001NativeCandidate(source, locale);
  const englishAuthority = sea001EnglishExplanationAuthority(source);
  const parityCandidate = applySea001CanonicalExplanationParity(englishAuthority, nativeCandidate, locale);
  const fidelityCandidate = polishSea001ExplanationParityFidelity(englishAuthority, parityCandidate, locale);
  return polishSea001ExplanationParityScript(fidelityCandidate, locale);
}
