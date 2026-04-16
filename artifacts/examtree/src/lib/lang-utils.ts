import type { Question } from "@/lib/data";

export type Language = "en" | "hi" | "pa";

/**
 * Returns the localized text, options, and explanation for a question.
 * Falls back to English if the requested language translation is not available.
 */
export function getLocalizedQuestion(
  q: Question,
  lang: Language,
): { text: string; options: string[]; explanation: string } {
  if (lang === "hi" && q.textHi) {
    return {
      text: q.textHi,
      options: q.optionsHi && q.optionsHi.length > 0 ? q.optionsHi : q.options,
      explanation: q.explanationHi ?? q.explanation,
    };
  }
  if (lang === "pa" && q.textPa) {
    return {
      text: q.textPa,
      options: q.optionsPa && q.optionsPa.length > 0 ? q.optionsPa : q.options,
      explanation: q.explanationPa ?? q.explanation,
    };
  }
  return { text: q.text, options: q.options, explanation: q.explanation };
}

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  hi: "हिंदी",
  pa: "ਪੰਜਾਬੀ",
};
