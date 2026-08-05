import type { SylLocale } from "../foundation/types";
import { learnerCopyV4 } from "./learner-v4-localization";
import type { SylLearnerPresentationV4 } from "./learner-v4-types";

function countWords(values: readonly string[]): number {
  return values.join(" ").trim().split(/\s+/u).filter(Boolean).length;
}

function finish(value: string, locale: SylLocale): string {
  const cleaned = value
    .replace(/([.!?।])\1+/gu, "$1")
    .replace(/\s+/gu, " ")
    .replace(/\s+([,.!?।])/gu, "$1")
    .trim();
  if (!cleaned) return cleaned;
  if (/[.!?।]$/u.test(cleaned)) return cleaned;
  return locale === "en-IN" ? `${cleaned}.` : `${cleaned}।`;
}

function polishEnglish(value: string): string {
  return value
    .replace(/\bNo ([A-Za-z][A-Za-z-]*s) is ([A-Za-z][A-Za-z-]*s)\b/gu, "No $1 are $2")
    .replace(/\b([A-Za-z][A-Za-z-]*s) is completely separate from ([A-Za-z][A-Za-z-]*s)\b/gu, "$1 are completely separate from $2");
}

function polishHindi(value: string): string {
  return value
    .replace(/([^।,.!?]+?) का हर सदस्य ([^।,.!?]+?) के अंदर है/gu, "सभी $1, $2 हैं")
    .replace(/([^।,.!?]+?) और ([^।,.!?]+?) को पूरी तरह अलग होना होगा संभव नहीं है/gu, "$1 और $2 पूरी तरह अलग नहीं हो सकते")
    .replace(/([^।,.!?]+?) को पूरी तरह अलग होना होगा संभव नहीं है/gu, "$1 पूरी तरह अलग नहीं हो सकते")
    .replace(/के अंदर रखना अनिवार्य नहीं करते/gu, "के अंदर होना अनिवार्य नहीं बनाते");
}

function polishPunjabi(value: string): string {
  return value
    .replace(/([^।,.!?]+?) ਦਾ ਹਰ ਮੈਂਬਰ ([^।,.!?]+?) ਦੇ ਅੰਦਰ ਹੈ/gu, "ਸਾਰੇ $1, $2 ਹਨ")
    .replace(/([^।,.!?]+?) ਅਤੇ ([^।,.!?]+?) ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਵੱਖ ਹੋਣਾ ਪਵੇਗਾ ਸੰਭਵ ਨਹੀਂ ਹੈ/gu, "$1 ਅਤੇ $2 ਪੂਰੀ ਤਰ੍ਹਾਂ ਵੱਖ ਨਹੀਂ ਹੋ ਸਕਦੇ")
    .replace(/([^।,.!?]+?) ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਵੱਖ ਹੋਣਾ ਪਵੇਗਾ ਸੰਭਵ ਨਹੀਂ ਹੈ/gu, "$1 ਪੂਰੀ ਤਰ੍ਹਾਂ ਵੱਖ ਨਹੀਂ ਹੋ ਸਕਦੇ")
    .replace(/ਦੇ ਅੰਦਰ ਰੱਖਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਕਰਦੇ/gu, "ਦੇ ਅੰਦਰ ਹੋਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਬਣਾਉਂਦੇ");
}

function polish(value: string | null, locale: SylLocale): string | null {
  if (value === null) return null;
  const transformed = locale === "hi-IN"
    ? polishHindi(value)
    : locale === "pa-IN"
      ? polishPunjabi(value)
      : polishEnglish(value);
  return finish(transformed, locale);
}

export function polishLearnerPresentationV4(
  presentation: SylLearnerPresentationV4,
): SylLearnerPresentationV4 {
  const locale = presentation.locale;
  const copy = learnerCopyV4(locale);
  const shortReasoning = presentation.learnerExplanation.shortReasoning
    .map((line) => polish(line, locale) ?? "")
    .filter(Boolean);
  const conclusionResults = presentation.learnerExplanation.conclusionResults.map((entry) => ({
    ...entry,
    label: polish(entry.label, locale)?.replace(/[.!?।]+$/u, "") ?? entry.label,
    text: polish(entry.text, locale)?.replace(/[.!?।]+$/u, "") ?? entry.text,
    shortReason: polish(entry.shortReason, locale),
  }));
  const conclusion = polish(presentation.learnerExplanation.conclusion, locale) ?? presentation.learnerExplanation.conclusion;
  const shortcut = polish(presentation.learnerExplanation.shortcut, locale);
  const existenceNote = polish(presentation.learnerExplanation.existenceNote, locale);

  return {
    ...presentation,
    answer: {
      ...presentation.answer,
      label: polish(presentation.answer.label, locale)?.replace(/[.!?।]+$/u, "") ?? presentation.answer.label,
      text: polish(presentation.answer.text, locale)?.replace(/[.!?।]+$/u, "") ?? presentation.answer.text,
    },
    learnerExplanation: {
      ...presentation.learnerExplanation,
      shortReasoning,
      conclusionResults,
      conclusion,
      shortcut,
      existenceNote,
      wordCount: countWords([
        ...shortReasoning,
        ...conclusionResults.map((entry) => `${entry.label} ${entry.follows ? copy.follows : copy.doesNotFollow} ${entry.shortReason ?? ""}`),
        conclusion,
      ]),
    },
    optionAnalysis: presentation.optionAnalysis.map((entry) => ({
      ...entry,
      text: polish(entry.text, locale)?.replace(/[.!?।]+$/u, "") ?? entry.text,
      verdictLabel: polish(entry.verdictLabel, locale)?.replace(/[.!?।]+$/u, "") ?? entry.verdictLabel,
      studentReason: polish(entry.studentReason, locale) ?? entry.studentReason,
    })),
    diagram: {
      ...presentation.diagram,
      caption: polish(presentation.diagram.caption, locale),
      accessibleDescription: polish(presentation.diagram.accessibleDescription, locale),
    },
  };
}
