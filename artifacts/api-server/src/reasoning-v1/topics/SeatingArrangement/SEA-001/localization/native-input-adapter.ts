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

const WORD_ORDINAL_PATTERN = "first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth";

function normalizeDirectionalCountToClockwise(clue: string): string {
  const match = clue.match(
    /^Exactly (\d+) (person sits|persons sit) between ([A-Z][a-z]+) and ([A-Z][a-z]+) when counted anticlockwise from ([A-Z][a-z]+)\.$/,
  );
  if (!match || match[3] !== match[5]) return clue;

  const count = match[1]!;
  const grammar = match[2]!;
  const first = match[3]!;
  const second = match[4]!;
  return `Exactly ${count} ${grammar} between ${second} and ${first} when counted clockwise from ${second}.`;
}

function normalizeNativeClueInput(clue: string): string {
  let normalized = normalizeDirectionalCountToClockwise(clue);

  // The generic non-directional between renderer accepts "persons sit", while the
  // directional clockwise renderer owns the grammatical singular form.
  if (
    normalized.startsWith("Exactly 1 person sits between ") &&
    !normalized.includes(" when counted clockwise from ")
  ) {
    normalized = normalized.replace("Exactly 1 person sits between ", "Exactly 1 persons sit between ");
  }

  normalized = normalized.replace(
    new RegExp(` sits (${WORD_ORDINAL_PATTERN}) to the (left|right) of `),
    (_match, ordinal: string, side: string) => ` sits ${WORD_ORDINALS[ordinal]} to the ${side} of `,
  );

  normalized = normalized.replace(
    new RegExp(` sits (${WORD_ORDINAL_PATTERN}) (clockwise|anticlockwise) from `),
    (_match, ordinal: string, direction: string) => ` sits ${WORD_ORDINALS[ordinal]} ${direction} from `,
  );

  return normalized;
}

export function buildSea001NativeCandidate(source: AuditCaselet, locale: Sea001TranslatedLocale): Sea001LocalizedReviewCaselet {
  const clueTexts = source.clueTexts.map(normalizeNativeClueInput);
  const rendered = buildSea001NativeReviewV2({ ...source, clueTexts }, locale);
  return { ...rendered, canonicalCaseletId: source.caseletId, canonicalParityFingerprint: sea001CanonicalParityFingerprint(source) };
}
