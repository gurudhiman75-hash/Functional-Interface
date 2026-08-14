import type { AuditCaselet } from "../saturation/corpus.ts";
import type { Sea001TranslatedLocale } from "./readiness.ts";
import { sea001CanonicalParityFingerprint } from "./readiness.ts";
import type { Sea001LocalizedReviewCaselet } from "./candidate-localizer.ts";
import { localizedSea001Name } from "./name-pack.ts";
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

type ConditionalFacingOverride = {
  readonly text: string;
  readonly action: string;
};

function tr(locale: Sea001TranslatedLocale, hi: string, pa: string): string {
  return locale === "hi-IN" ? hi : pa;
}

function facingLabel(value: "the centre" | "outward", locale: Sea001TranslatedLocale): string {
  return value === "the centre"
    ? tr(locale, "केंद्र की ओर", "ਕੇਂਦਰ ਵੱਲ")
    : tr(locale, "बाहर की ओर", "ਬਾਹਰ ਵੱਲ");
}

function conditionalFacingOverride(clue: string, locale: Sea001TranslatedLocale): ConditionalFacingOverride | undefined {
  const match = clue.match(
    /^If ([A-Z][a-z]+) faces (the centre|outward), ([A-Z][a-z]+) faces (the centre|outward); otherwise, ([A-Z][a-z]+) faces (the centre|outward)\.$/,
  );
  if (!match || match[3] !== match[5]) return undefined;

  const conditionPerson = localizedSea001Name(match[1]!, locale);
  const targetPerson = localizedSea001Name(match[3]!, locale);
  const conditionFacing = facingLabel(match[2]! as "the centre" | "outward", locale);
  const thenFacing = facingLabel(match[4]! as "the centre" | "outward", locale);
  const elseFacing = facingLabel(match[6]! as "the centre" | "outward", locale);

  return {
    text: tr(
      locale,
      `यदि ${conditionPerson} का मुख ${conditionFacing} है, तो ${targetPerson} का मुख ${thenFacing} होगा; अन्यथा ${targetPerson} का मुख ${elseFacing} होगा।`,
      `ਜੇ ${conditionPerson} ਦਾ ਮੂੰਹ ${conditionFacing} ਹੈ, ਤਾਂ ${targetPerson} ਦਾ ਮੂੰਹ ${thenFacing} ਹੋਵੇਗਾ; ਨਹੀਂ ਤਾਂ ${targetPerson} ਦਾ ਮੂੰਹ ${elseFacing} ਹੋਵੇਗਾ।`,
    ),
    action: tr(
      locale,
      `पहले ${conditionPerson} की मुख-दिशा तय करें। यदि वह ${conditionFacing} है, तो ${targetPerson} को ${thenFacing} रखें; नहीं तो ${elseFacing} रखें।`,
      `ਪਹਿਲਾਂ ${conditionPerson} ਦੀ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਤੈਅ ਕਰੋ। ਜੇ ਉਹ ${conditionFacing} ਹੈ, ਤਾਂ ${targetPerson} ਨੂੰ ${thenFacing} ਰੱਖੋ; ਨਹੀਂ ਤਾਂ ${elseFacing} ਰੱਖੋ।`,
    ),
  };
}

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
  const overrides = source.clueTexts.map((clue) => conditionalFacingOverride(clue, locale));
  const clueTexts = source.clueTexts.map((clue, index) => {
    if (overrides[index]) {
      const match = clue.match(/^If ([A-Z][a-z]+) faces .+?, ([A-Z][a-z]+) faces /);
      if (!match) throw new Error(`${source.caseletId}: conditional facing placeholder parse failed`);
      return `${match[2]} sits opposite ${match[1]}.`;
    }
    return normalizeNativeClueInput(clue);
  });

  const rendered = buildSea001NativeReviewV2({ ...source, clueTexts }, locale);
  const finalClueTexts = [...rendered.clueTexts];
  const explanationLines = rendered.sharedExplanation.split("\n");

  overrides.forEach((override, index) => {
    if (!override) return;
    finalClueTexts[index] = override.text;
    const clueLineIndex = 2 + (index * 2);
    const actionLineIndex = clueLineIndex + 1;
    explanationLines[clueLineIndex] = `${index + 1}. ${override.text}`;
    explanationLines[actionLineIndex] = `   ${tr(locale, "करें", "ਕਰੋ")}: ${override.action}`;
  });

  return {
    ...rendered,
    clueTexts: finalClueTexts,
    sharedExplanation: explanationLines.join("\n"),
    canonicalCaseletId: source.caseletId,
    canonicalParityFingerprint: sea001CanonicalParityFingerprint(source),
  };
}
