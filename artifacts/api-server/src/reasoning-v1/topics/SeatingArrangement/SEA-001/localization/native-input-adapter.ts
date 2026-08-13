import type { AuditCaselet } from "../saturation/corpus.ts";
import type { Sea001TranslatedLocale } from "./readiness.ts";
import { sea001CanonicalParityFingerprint } from "./readiness.ts";
import type { Sea001LocalizedReviewCaselet } from "./candidate-localizer.ts";
import { buildSea001NativeReviewV2 } from "./native-review-v2.ts";

export function buildSea001NativeCandidate(source: AuditCaselet, locale: Sea001TranslatedLocale): Sea001LocalizedReviewCaselet {
  const clueTexts = source.clueTexts.map((clue) => clue.startsWith("Exactly 1 person sits between ") ? clue.replace("Exactly 1 person sits between ", "Exactly 1 persons sit between ") : clue);
  const rendered = buildSea001NativeReviewV2({ ...source, clueTexts }, locale);
  return { ...rendered, canonicalCaseletId: source.caseletId, canonicalParityFingerprint: sea001CanonicalParityFingerprint(source) };
}
