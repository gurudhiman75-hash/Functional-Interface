import { renderAlpExplanationV2 as renderBaseExplanation, renderAlpStemV2 } from "./editorial-v2";
import type { AlpExplanation, AlpInstanceData, AlpLocale, AlpOption, AlpQuestionLogic, AlpSolverResult } from "./types";

function localizeStructuralText(locale: AlpLocale, value: string): string {
  if (locale === "en-IN") return value;
  const replacements: readonly (readonly [RegExp, string])[] = locale === "hi-IN"
    ? [
      [/Right rank/gi, "दायाँ स्थान"],
      [/Left rank/gi, "बायाँ स्थान"],
      [/right position/gi, "दायाँ स्थान"],
      [/left position/gi, "बायाँ स्थान"],
      [/forward rank/gi, "सीधा स्थान"],
      [/starting letter/gi, "प्रारंभिक अक्षर"],
      [/required result/gi, "आवश्यक परिणाम"],
      [/required count/gi, "आवश्यक गिनती"],
      [/position-distance/gi, "स्थान-दूरी"],
      [/Position/gi, "स्थान"],
      [/Original/gi, "मूल क्रम"],
      [/Changed/gi, "नया क्रम"],
      [/Answer/gi, "उत्तर"],
      [/distance/gi, "दूरी"],
      [/change/gi, "परिवर्तन"],
      [/rank/gi, "स्थान"],
      [/net/gi, "शुद्ध"],
      [/left/gi, "बायाँ"],
      [/right/gi, "दायाँ"],
      [/sum/gi, "योग"],
      [/move/gi, "चाल"],
      [/apply/gi, "लागू करें"],
      [/count/gi, "गिनती"],
      [/result/gi, "परिणाम"],
      [/required/gi, "आवश्यक"],
      [/starting/gi, "प्रारंभिक"],
      [/letter/gi, "अक्षर"],
      [/word/gi, "शब्द"],
      [/therefore/gi, "अतः"],
      [/\sand\s/gi, " और "],
    ]
    : [
      [/Right rank/gi, "ਸੱਜੀ ਥਾਂ"],
      [/Left rank/gi, "ਖੱਬੀ ਥਾਂ"],
      [/right position/gi, "ਸੱਜੀ ਥਾਂ"],
      [/left position/gi, "ਖੱਬੀ ਥਾਂ"],
      [/forward rank/gi, "ਸਿੱਧੀ ਥਾਂ"],
      [/starting letter/gi, "ਸ਼ੁਰੂਆਤੀ ਅੱਖਰ"],
      [/required result/gi, "ਲੋੜੀਂਦਾ ਨਤੀਜਾ"],
      [/required count/gi, "ਲੋੜੀਂਦੀ ਗਿਣਤੀ"],
      [/position-distance/gi, "ਥਾਂ-ਦੂਰੀ"],
      [/Position/gi, "ਥਾਂ"],
      [/Original/gi, "ਮੂਲ ਕ੍ਰਮ"],
      [/Changed/gi, "ਨਵਾਂ ਕ੍ਰਮ"],
      [/Answer/gi, "ਜਵਾਬ"],
      [/distance/gi, "ਦੂਰੀ"],
      [/change/gi, "ਬਦਲਾਅ"],
      [/rank/gi, "ਥਾਂ"],
      [/net/gi, "ਕੁੱਲ"],
      [/left/gi, "ਖੱਬਾ"],
      [/right/gi, "ਸੱਜਾ"],
      [/sum/gi, "ਜੋੜ"],
      [/move/gi, "ਚਾਲ"],
      [/apply/gi, "ਲਗਾਓ"],
      [/count/gi, "ਗਿਣਤੀ"],
      [/result/gi, "ਨਤੀਜਾ"],
      [/required/gi, "ਲੋੜੀਂਦਾ"],
      [/starting/gi, "ਸ਼ੁਰੂਆਤੀ"],
      [/letter/gi, "ਅੱਖਰ"],
      [/word/gi, "ਸ਼ਬਦ"],
      [/therefore/gi, "ਇਸ ਲਈ"],
      [/\sand\s/gi, " ਅਤੇ "],
    ];
  return replacements.reduce((current, [pattern, replacement]) => current.replace(pattern, replacement), value);
}

function localizeWithProtectedValues(locale: AlpLocale, value: string, protectedValues: readonly string[]): string {
  if (locale === "en-IN") return value;
  let protectedText = value;
  const stored: string[] = [];
  for (const token of [...new Set(protectedValues.filter(Boolean))].sort((a, b) => b.length - a.length)) {
    const placeholder = `§§${stored.length}§§`;
    stored.push(token);
    protectedText = protectedText.split(token).join(placeholder);
  }
  const localized = localizeStructuralText(locale, protectedText);
  return stored.reduce((current, token, index) => current.split(`§§${index}§§`).join(token), localized);
}

function localizeExplanation(locale: AlpLocale, explanation: AlpExplanation, answer: string): AlpExplanation {
  if (locale === "en-IN") return explanation;
  return {
    ...explanation,
    coreConcept: localizeStructuralText(locale, explanation.coreConcept),
    ruleStatement: localizeStructuralText(locale, explanation.ruleStatement),
    steps: explanation.steps.map((step) => localizeStructuralText(locale, step)),
    visualWorking: explanation.visualWorking.map((line) => localizeStructuralText(locale, line)),
    examShortcut: localizeStructuralText(locale, explanation.examShortcut),
    conclusion: localizeWithProtectedValues(locale, explanation.conclusion, [answer]),
    distractorAnalyses: explanation.distractorAnalyses.map((analysis) => ({
      ...analysis,
      explanation: localizeWithProtectedValues(locale, analysis.explanation, [analysis.optionValue]),
    })),
    closestTrapRejection: localizeStructuralText(locale, explanation.closestTrapRejection),
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
  return localizeExplanation(locale, renderBaseExplanation(ql, data, solved, options, correctIndex, locale), solved.answer);
}

export { renderAlpStemV2 };
