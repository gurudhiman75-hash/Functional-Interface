import { renderAlpExplanationV2 as renderBaseExplanation, renderAlpStemV2 } from "./editorial-v2";
import type { AlpExplanation, AlpInstanceData, AlpLocale, AlpOption, AlpQuestionLogic, AlpSolverResult } from "./types";

function localizeStructuralText(locale: AlpLocale, value: string): string {
  if (locale === "en-IN") return value;
  const replacements: readonly (readonly [RegExp, string])[] = locale === "hi-IN"
    ? [
      [/\bRight rank\b/gi, "दायाँ स्थान"],
      [/\bLeft rank\b/gi, "बायाँ स्थान"],
      [/\bright position\b/gi, "दायाँ स्थान"],
      [/\bleft position\b/gi, "बायाँ स्थान"],
      [/\bforward rank\b/gi, "सीधा स्थान"],
      [/\bstarting letter\b/gi, "प्रारंभिक अक्षर"],
      [/\brequired result\b/gi, "आवश्यक परिणाम"],
      [/\brequired count\b/gi, "आवश्यक गिनती"],
      [/\bposition-distance\b/gi, "स्थान-दूरी"],
      [/\bPosition\b/gi, "स्थान"],
      [/\bOriginal\b/gi, "मूल क्रम"],
      [/\bChanged\b/gi, "नया क्रम"],
      [/\bAnswer\b/gi, "उत्तर"],
      [/\bdistance\b/gi, "दूरी"],
      [/\bchange\b/gi, "परिवर्तन"],
      [/\brank\b/gi, "स्थान"],
      [/\bnet\b/gi, "शुद्ध"],
      [/\bleft\b/gi, "बायाँ"],
      [/\bright\b/gi, "दायाँ"],
      [/\bsum\b/gi, "योग"],
      [/\bmove\b/gi, "चाल"],
      [/\bapply\b/gi, "लागू करें"],
      [/\bcount\b/gi, "गिनती"],
      [/\bresult\b/gi, "परिणाम"],
      [/\brequired\b/gi, "आवश्यक"],
      [/\bstarting\b/gi, "प्रारंभिक"],
      [/\bletter\b/gi, "अक्षर"],
      [/\bword\b/gi, "शब्द"],
      [/\btherefore\b/gi, "अतः"],
      [/\sand\s/gi, " और "],
    ]
    : [
      [/\bRight rank\b/gi, "ਸੱਜੀ ਥਾਂ"],
      [/\bLeft rank\b/gi, "ਖੱਬੀ ਥਾਂ"],
      [/\bright position\b/gi, "ਸੱਜੀ ਥਾਂ"],
      [/\bleft position\b/gi, "ਖੱਬੀ ਥਾਂ"],
      [/\bforward rank\b/gi, "ਸਿੱਧੀ ਥਾਂ"],
      [/\bstarting letter\b/gi, "ਸ਼ੁਰੂਆਤੀ ਅੱਖਰ"],
      [/\brequired result\b/gi, "ਲੋੜੀਂਦਾ ਨਤੀਜਾ"],
      [/\brequired count\b/gi, "ਲੋੜੀਂਦੀ ਗਿਣਤੀ"],
      [/\bposition-distance\b/gi, "ਥਾਂ-ਦੂਰੀ"],
      [/\bPosition\b/gi, "ਥਾਂ"],
      [/\bOriginal\b/gi, "ਮੂਲ ਕ੍ਰਮ"],
      [/\bChanged\b/gi, "ਨਵਾਂ ਕ੍ਰਮ"],
      [/\bAnswer\b/gi, "ਜਵਾਬ"],
      [/\bdistance\b/gi, "ਦੂਰੀ"],
      [/\bchange\b/gi, "ਬਦਲਾਅ"],
      [/\brank\b/gi, "ਥਾਂ"],
      [/\bnet\b/gi, "ਕੁੱਲ"],
      [/\bleft\b/gi, "ਖੱਬਾ"],
      [/\bright\b/gi, "ਸੱਜਾ"],
      [/\bsum\b/gi, "ਜੋੜ"],
      [/\bmove\b/gi, "ਚਾਲ"],
      [/\bapply\b/gi, "ਲਗਾਓ"],
      [/\bcount\b/gi, "ਗਿਣਤੀ"],
      [/\bresult\b/gi, "ਨਤੀਜਾ"],
      [/\brequired\b/gi, "ਲੋੜੀਂਦਾ"],
      [/\bstarting\b/gi, "ਸ਼ੁਰੂਆਤੀ"],
      [/\bletter\b/gi, "ਅੱਖਰ"],
      [/\bword\b/gi, "ਸ਼ਬਦ"],
      [/\btherefore\b/gi, "ਇਸ ਲਈ"],
      [/\sand\s/gi, " ਅਤੇ "],
    ];
  return replacements.reduce((current, [pattern, replacement]) => current.replace(pattern, replacement), value);
}

function localizeWithProtectedValues(locale: AlpLocale, value: string, protectedValues: readonly string[]): string {
  if (locale === "en-IN") return value;
  let protectedText = value;
  const stored: string[] = [];
  const tokens = [...new Set(protectedValues.filter((token) => token.length > 1))].sort((a, b) => b.length - a.length);
  for (const token of tokens) {
    const placeholder = `§§${stored.length}§§`;
    stored.push(token);
    protectedText = protectedText.split(token).join(placeholder);
  }
  const localized = localizeStructuralText(locale, protectedText);
  return stored.reduce((current, token, index) => current.split(`§§${index}§§`).join(token), localized);
}

function protectedDataValues(data: AlpInstanceData, solved: AlpSolverResult, options: readonly AlpOption[]): string[] {
  return [
    solved.answer,
    data.word ?? "",
    data.transformedWord ?? "",
    data.selectedTransformLabel ?? "",
    ...options.map((option) => option.value),
  ].filter(Boolean);
}

function localizeExplanation(
  locale: AlpLocale,
  explanation: AlpExplanation,
  data: AlpInstanceData,
  solved: AlpSolverResult,
  options: readonly AlpOption[],
): AlpExplanation {
  if (locale === "en-IN") return explanation;
  const protectedValues = protectedDataValues(data, solved, options);
  const localize = (value: string, extra: readonly string[] = []) => localizeWithProtectedValues(locale, value, [...protectedValues, ...extra]);
  return {
    ...explanation,
    coreConcept: localize(explanation.coreConcept),
    ruleStatement: localize(explanation.ruleStatement),
    steps: explanation.steps.map((step) => localize(step)),
    visualWorking: explanation.visualWorking.map((line) => localize(line)),
    examShortcut: localize(explanation.examShortcut),
    conclusion: localize(explanation.conclusion, [solved.answer]),
    distractorAnalyses: explanation.distractorAnalyses.map((analysis) => ({
      ...analysis,
      explanation: localize(analysis.explanation, [analysis.optionValue]),
    })),
    closestTrapRejection: localize(explanation.closestTrapRejection),
  };
}

export function renderAlpExplanationV2(
  ql: AlpQuestionLogic,
  data: AlpInstanceData,
  solved: AlpSolverResult,
  options: readonly AlpOption[],
  correctIndex: number,
  locale: AlpLocale,
): AlpExplanation {
  return localizeExplanation(locale, renderBaseExplanation(ql, data, solved, options, correctIndex, locale), data, solved, options);
}

export { renderAlpStemV2 };
