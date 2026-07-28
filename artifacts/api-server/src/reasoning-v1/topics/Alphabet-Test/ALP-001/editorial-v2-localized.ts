import {
  renderAlpExplanationV2 as renderQualityExplanation,
  renderAlpStemV2,
} from "./editorial-v2-quality";
import type {
  AlpExplanation,
  AlpInstanceData,
  AlpLocale,
  AlpOption,
  AlpQuestionLogic,
  AlpSolverResult,
} from "./types";

function localizeVisualLine(locale: AlpLocale, value: string): string {
  if (locale === "en-IN") return value;
  const replacements: readonly (readonly [RegExp, string])[] = locale === "hi-IN"
    ? [
      [/\bgap\b/gi, "बीच के अक्षर"],
      [/\bdistance\b/gi, "स्थान-दूरी"],
      [/\bdifference\b/gi, "अंतर"],
      [/\btotal\b/gi, "कुल"],
      [/\binside\b/gi, "अंदर"],
      [/\boutside\b/gi, "बाहर"],
      [/\bbefore\b/gi, "पहले"],
      [/\bafter\b/gi, "बाद"],
    ]
    : [
      [/\bgap\b/gi, "ਵਿਚਕਾਰਲੇ ਅੱਖਰ"],
      [/\bdistance\b/gi, "ਥਾਂ-ਦੂਰੀ"],
      [/\bdifference\b/gi, "ਫਰਕ"],
      [/\btotal\b/gi, "ਕੁੱਲ"],
      [/\binside\b/gi, "ਅੰਦਰ"],
      [/\boutside\b/gi, "ਬਾਹਰ"],
      [/\bbefore\b/gi, "ਪਹਿਲਾਂ"],
      [/\bafter\b/gi, "ਬਾਅਦ"],
    ];
  return replacements.reduce((current, [pattern, replacement]) => current.replace(pattern, replacement), value);
}

function strengthenShortcut(locale: AlpLocale, value: string): string {
  if (value.length >= 25) return value;
  const extension = locale === "en-IN"
    ? " Apply this check to every option."
    : locale === "hi-IN"
      ? " इसे हर विकल्प पर जाँचें।"
      : " ਇਸ ਨੂੰ ਹਰ ਵਿਕਲਪ ਉੱਤੇ ਜਾਂਚੋ।";
  return `${value}${extension}`;
}

export function renderAlpExplanationV2(
  ql: AlpQuestionLogic,
  data: AlpInstanceData,
  solved: AlpSolverResult,
  options: readonly AlpOption[],
  correctIndex: number,
  locale: AlpLocale,
): AlpExplanation {
  const explanation = renderQualityExplanation(ql, data, solved, options, correctIndex, locale);
  return {
    ...explanation,
    visualWorking: explanation.visualWorking.map((line) => localizeVisualLine(locale, line)),
    examShortcut: strengthenShortcut(locale, explanation.examShortcut),
  };
}

export { renderAlpStemV2 };
