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

const HINDI_OBLIQUE_ORDINALS: Readonly<Record<string, string>> = Object.freeze({
  "पहला": "पहले",
  "दूसरा": "दूसरे",
  "तीसरा": "तीसरे",
  "चौथा": "चौथे",
  "पाँचवाँ": "पाँचवें",
  "छठा": "छठे",
  "सातवाँ": "सातवें",
  "आठवाँ": "आठवें",
  "नौवाँ": "नौवें",
  "दसवाँ": "दसवें",
});

const PUNJABI_OBLIQUE_ORDINALS: Readonly<Record<string, string>> = Object.freeze({
  "ਪਹਿਲਾ": "ਪਹਿਲੇ",
  "ਦੂਜਾ": "ਦੂਜੇ",
  "ਤੀਜਾ": "ਤੀਜੇ",
  "ਚੌਥਾ": "ਚੌਥੇ",
  "ਪੰਜਵਾਂ": "ਪੰਜਵੇਂ",
  "ਛੇਵਾਂ": "ਛੇਵੇਂ",
  "ਸੱਤਵਾਂ": "ਸੱਤਵੇਂ",
  "ਅੱਠਵਾਂ": "ਅੱਠਵੇਂ",
  "ਨੌਵਾਂ": "ਨੌਵੇਂ",
  "ਦਸਵਾਂ": "ਦਸਵੇਂ",
});

type NativeClueOverride = {
  readonly placeholder: string;
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

function facingRelationOverride(clue: string, locale: Sea001TranslatedLocale): NativeClueOverride | undefined {
  let match = clue.match(/^([A-Z][a-z]+) and ([A-Z][a-z]+) face (?:the )?same direction\.$/);
  if (match) {
    const first = localizedSea001Name(match[1]!, locale);
    const second = localizedSea001Name(match[2]!, locale);
    return {
      placeholder: `${match[2]} sits opposite ${match[1]}.`,
      text: tr(
        locale,
        `${first} और ${second} एक ही दिशा में मुख किए हैं।`,
        `${first} ਅਤੇ ${second} ਇੱਕੋ ਦਿਸ਼ਾ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ।`,
      ),
      action: tr(
        locale,
        `${first} और ${second} की मुख-दिशा एक जैसी रखें।`,
        `${first} ਅਤੇ ${second} ਦੀ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਇੱਕੋ ਜਿਹੀ ਰੱਖੋ।`,
      ),
    };
  }

  match = clue.match(/^([A-Z][a-z]+) and ([A-Z][a-z]+) face opposite directions\.$/);
  if (match) {
    const first = localizedSea001Name(match[1]!, locale);
    const second = localizedSea001Name(match[2]!, locale);
    return {
      placeholder: `${match[2]} sits opposite ${match[1]}.`,
      text: tr(
        locale,
        `${first} और ${second} विपरीत दिशाओं में मुख किए हैं।`,
        `${first} ਅਤੇ ${second} ਉਲਟ ਦਿਸ਼ਾਵਾਂ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ।`,
      ),
      action: tr(
        locale,
        `इन दोनों में से एक का मुख केंद्र की ओर हो, तो दूसरे का मुख बाहर की ओर रखें।`,
        `ਇਨ੍ਹਾਂ ਦੋਵਾਂ ਵਿੱਚੋਂ ਇੱਕ ਦਾ ਮੂੰਹ ਕੇਂਦਰ ਵੱਲ ਹੋਵੇ, ਤਾਂ ਦੂਜੇ ਦਾ ਮੂੰਹ ਬਾਹਰ ਵੱਲ ਰੱਖੋ।`,
      ),
    };
  }

  match = clue.match(
    /^If ([A-Z][a-z]+) faces (the centre|outward), ([A-Z][a-z]+) faces (the centre|outward); otherwise, ([A-Z][a-z]+) faces (the centre|outward)\.$/,
  );
  if (!match || match[3] !== match[5]) return undefined;

  const conditionPerson = localizedSea001Name(match[1]!, locale);
  const targetPerson = localizedSea001Name(match[3]!, locale);
  const conditionFacing = facingLabel(match[2]! as "the centre" | "outward", locale);
  const thenFacing = facingLabel(match[4]! as "the centre" | "outward", locale);
  const elseFacing = facingLabel(match[6]! as "the centre" | "outward", locale);

  return {
    placeholder: `${match[3]} sits opposite ${match[1]}.`,
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

  normalized = normalized.replace(/^([A-Z][a-z]+) faces the centre\.$/, "$1 faces centre.");

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

function polishNativeLearnerText(text: string, locale: Sea001TranslatedLocale): string {
  let output = text;
  const ordinalMap = locale === "hi-IN" ? HINDI_OBLIQUE_ORDINALS : PUNJABI_OBLIQUE_ORDINALS;
  const locationSuffix = locale === "hi-IN" ? "स्थान (?:पर|तक)" : "ਸਥਾਨ (?:'ਤੇ|ਤੱਕ)";
  for (const [plain, oblique] of Object.entries(ordinalMap)) {
    output = output.replace(new RegExp(`${plain}(?= ${locationSuffix})`, "g"), oblique);
  }

  if (locale === "hi-IN") {
    output = output
      .replaceAll(" मुख किए है।", " मुख करके बैठा है।")
      .replace(/([^\s,।\n]+) (उत्तर की ओर|दक्षिण की ओर|केंद्र की ओर|बाहर की ओर) मुख करके बैठा है/g, "$1 का मुख $2 है")
      .replaceAll(" बैठा है", " है");
  } else {
    output = output
      .replace(/([^\s,।\n]+) (ਉੱਤਰ ਵੱਲ|ਦੱਖਣ ਵੱਲ|ਕੇਂਦਰ ਵੱਲ|ਬਾਹਰ ਵੱਲ) ਮੂੰਹ ਕਰਕੇ ਬੈਠਾ ਹੈ/g, "$1 ਦਾ ਮੂੰਹ $2 ਹੈ")
      .replaceAll(" ਬੈਠਾ ਹੈ", " ਹੈ");
  }
  return output;
}

function polishNativeCandidate(candidate: Sea001LocalizedReviewCaselet, locale: Sea001TranslatedLocale): Sea001LocalizedReviewCaselet {
  const diagramText = candidate.diagramText ? polishNativeLearnerText(candidate.diagramText, locale) : candidate.diagramText;
  const diagram = candidate.diagram
    ? {
        ...candidate.diagram,
        text: candidate.diagram.text ? polishNativeLearnerText(candidate.diagram.text, locale) : candidate.diagram.text,
      }
    : candidate.diagram;

  return {
    ...candidate,
    setupText: polishNativeLearnerText(candidate.setupText, locale),
    clueTexts: candidate.clueTexts.map((clue) => polishNativeLearnerText(clue, locale)),
    sharedExplanation: polishNativeLearnerText(candidate.sharedExplanation, locale),
    diagramText,
    diagram,
    children: candidate.children.map((child) => ({
      ...child,
      text: polishNativeLearnerText(child.text, locale),
      explanation: polishNativeLearnerText(child.explanation, locale),
      options: child.options.map((option) => ({
        ...option,
        display: polishNativeLearnerText(option.display, locale),
        explanation: polishNativeLearnerText(option.explanation, locale),
      })),
    })),
  };
}

export function buildSea001NativeCandidate(source: AuditCaselet, locale: Sea001TranslatedLocale): Sea001LocalizedReviewCaselet {
  const overrides = source.clueTexts.map((clue) => facingRelationOverride(clue, locale));
  const clueTexts = source.clueTexts.map((clue, index) => overrides[index]?.placeholder ?? normalizeNativeClueInput(clue));

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

  return polishNativeCandidate({
    ...rendered,
    clueTexts: finalClueTexts,
    sharedExplanation: explanationLines.join("\n"),
    canonicalCaseletId: source.caseletId,
    canonicalParityFingerprint: sea001CanonicalParityFingerprint(source),
  }, locale);
}
