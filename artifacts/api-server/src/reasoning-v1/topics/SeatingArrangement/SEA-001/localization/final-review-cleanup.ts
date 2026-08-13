import type { AuditCaselet, AuditChild, AuditOption } from "../saturation/corpus.ts";
import type { Sea001TranslatedLocale } from "./readiness.ts";
import { type Sea001LocalizedReviewCaselet } from "./candidate-localizer.ts";
import { buildSea001LocalizedReviewCandidate } from "./review-projection.ts";

const FINAL_RESIDUAL_WORDS: Readonly<Record<string, readonly [string, string]>> = Object.freeze({
  early: ["पहले", "ਪਹਿਲਾਂ"],
  rotation: ["घुमाव", "ਘੁੰਮਾਵ"],
  occupant: ["बैठा व्यक्ति", "ਬੈਠਾ ਵਿਅਕਤੀ"],
  occupants: ["बैठे व्यक्ति", "ਬੈਠੇ ਵਿਅਕਤੀ"],
  note: ["ध्यान दें", "ਧਿਆਨ ਦਿਓ"],
  observer: ["देखने वाला", "ਵੇਖਣ ਵਾਲਾ"],
  while: ["जबकि", "ਜਦਕਿ"],
  on: ["पर", "'ਤੇ"],
  someone: ["कोई व्यक्ति", "ਕੋਈ ਵਿਅਕਤੀ"],
  lists: ["क्रम बताता है", "ਕ੍ਰਮ ਦੱਸਦਾ ਹੈ"],
  exactly: ["ठीक", "ਠੀਕ"],
  out: ["बाहर", "ਬਾਹਰ"],
  fixes: ["तय करता है", "ਤੈਅ ਕਰਦਾ ਹੈ"],
  beside: ["बगल में", "ਨਾਲ"],
  lies: ["स्थित है", "ਸਥਿਤ ਹੈ"],
  when: ["जब", "ਜਦੋਂ"],
  into: ["में", "ਵਿੱਚ"],
  own: ["स्वयं", "ਆਪਣਾ"],
  ly: ["", ""],
  ing: ["", ""],
  d: ["", ""],
});

function localeValue(locale: Sea001TranslatedLocale, values: readonly [string, string]): string {
  return locale === "hi-IN" ? values[0] : values[1];
}

function replaceWholeWord(text: string, word: string, replacement: string): string {
  return text.replace(new RegExp(`\\b${word}\\b`, "gi"), replacement);
}

function cleanText(text: string, locale: Sea001TranslatedLocale): string {
  let output = text;
  for (const [word, values] of Object.entries(FINAL_RESIDUAL_WORDS)) {
    output = replaceWholeWord(output, word, localeValue(locale, values));
  }
  if (locale === "hi-IN") {
    output = output
      .replaceAll("direct", "सीधे")
      .replaceAll("strict", "ठीक")
      .replaceAll("immediate", "ठीक अगला")
      .replaceAll("convenient", "सुविधाजनक");
  } else {
    output = output
      .replaceAll("direct", "ਸਿੱਧੇ")
      .replaceAll("strict", "ਠੀਕ")
      .replaceAll("immediate", "ਬਿਲਕੁਲ ਅਗਲਾ")
      .replaceAll("convenient", "ਸੁਵਿਧਾਜਨਕ");
  }
  return output
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/ {2,}/g, " ")
    .replace(/\n {1,}/g, "\n")
    .trim();
}

function cleanOption(option: AuditOption, locale: Sea001TranslatedLocale): AuditOption {
  return {
    ...option,
    display: cleanText(option.display, locale),
    explanation: cleanText(option.explanation, locale),
  };
}

function cleanChild(child: AuditChild, locale: Sea001TranslatedLocale): AuditChild {
  return {
    ...child,
    text: cleanText(child.text, locale),
    explanation: cleanText(child.explanation, locale),
    options: child.options.map((option) => cleanOption(option, locale)),
  };
}

export function buildSea001FinalLocalizedReviewCandidate(
  canonical: AuditCaselet,
  locale: Sea001TranslatedLocale,
): Sea001LocalizedReviewCaselet {
  const candidate = buildSea001LocalizedReviewCandidate(canonical, locale);
  const diagramText = candidate.diagramText ? cleanText(candidate.diagramText, locale) : candidate.diagramText;
  const diagram = candidate.diagram
    ? {
        ...candidate.diagram,
        text: candidate.diagram.text ? cleanText(candidate.diagram.text, locale) : candidate.diagram.text,
      }
    : candidate.diagram;
  return {
    ...candidate,
    setupText: cleanText(candidate.setupText, locale),
    clueTexts: candidate.clueTexts.map((clue) => cleanText(clue, locale)),
    sharedExplanation: cleanText(candidate.sharedExplanation, locale),
    diagramText,
    diagram,
    children: candidate.children.map((child) => cleanChild(child, locale)),
  };
}
