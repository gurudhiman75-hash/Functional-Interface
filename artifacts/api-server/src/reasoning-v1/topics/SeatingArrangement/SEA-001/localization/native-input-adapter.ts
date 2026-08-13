import type { AuditCaselet } from "../saturation/corpus.ts";
import type { Sea001TranslatedLocale } from "./readiness.ts";
import { sea001CanonicalParityFingerprint } from "./readiness.ts";
import type { Sea001LocalizedReviewCaselet } from "./candidate-localizer.ts";
import { buildSea001NativeReviewV2 } from "./native-review-v2.ts";

const WORD_ORDINALS: Readonly<Record<string, string>> = Object.freeze({
  first: "1st",
  second: "2nd",
  third: "3rd",
  fourth: "4th",
  fifth: "5th",
  sixth: "6th",
  seventh: "7th",
  eighth: "8th",
  ninth: "9th",
  tenth: "10th",
});

function normalizeNativeClueInput(clue: string): string {
  let normalized = clue.startsWith("Exactly 1 person sits between ")
    ? clue.replace("Exactly 1 person sits between ", "Exactly 1 persons sit between ")
    : clue;

  normalized = normalized.replace(
    / sits (first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) to the (left|right) of /,
    (_match, ordinal: string, side: string) => ` sits ${WORD_ORDINALS[ordinal]} to the ${side} of `,
  );

  return normalized;
}

export function buildSea001NativeCandidate(source: AuditCaselet, locale: Sea001TranslatedLocale): Sea001LocalizedReviewCaselet {
  const clueTexts = source.clueTexts.map(normalizeNativeClueInput);
  const rendered = buildSea001NativeReviewV2({ ...source, clueTexts }, locale);
  return { ...rendered, canonicalCaseletId: source.caseletId, canonicalParityFingerprint: sea001CanonicalParityFingerprint(source) };
}
