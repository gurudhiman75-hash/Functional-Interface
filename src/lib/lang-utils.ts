import type { Question } from "@/lib/data";

export type Language = "en" | "hi" | "pa";

/**
 * Returns the localized text, options, and explanation for a question.
 * Falls back through pa → hi → en when the requested language has no content.
 */
export function getLocalizedQuestion(
  q: Question,
  lang: Language,
): { text: string; options: string[]; explanation: string } {
  // Priority: requested lang → pa → hi → en → whatever is non-null
  const tryLang = (l: Language) => {
    if (l === "pa" && q.textPa)
      return {
        text: q.textPa,
        options: q.optionsPa && q.optionsPa.length > 0 ? q.optionsPa : q.options,
        explanation: q.explanationPa ?? q.explanationHi ?? q.explanation ?? "",
      };
    if (l === "hi" && q.textHi)
      return {
        text: q.textHi,
        options: q.optionsHi && q.optionsHi.length > 0 ? q.optionsHi : q.options,
        explanation: q.explanationHi ?? q.explanation ?? "",
      };
    if (l === "en" && q.text)
      return { text: q.text, options: q.options, explanation: q.explanation ?? "" };
    return null;
  };

  const fallbackOrder: Language[] = [lang, "pa", "hi", "en"].filter(
    (v, i, a) => a.indexOf(v) === i,
  ) as Language[];

  for (const l of fallbackOrder) {
    const result = tryLang(l);
    if (result) return result;
  }

  // Last resort — return whatever non-null content exists
  return {
    text: q.textPa ?? q.textHi ?? q.text ?? "(no text)",
    options: q.optionsPa ?? q.optionsHi ?? q.options,
    explanation: q.explanationPa ?? q.explanationHi ?? q.explanation ?? "",
  };
}

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  hi: "हिंदी",
  pa: "ਪੰਜਾਬੀ",
};
