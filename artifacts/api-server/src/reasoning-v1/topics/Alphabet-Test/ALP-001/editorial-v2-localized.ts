import {
  renderAlpExplanationV2 as renderQualityExplanation,
  renderAlpStemV2,
} from "./editorial-v2-quality";
import type {
  AlpDistractorAnalysis,
  AlpExplanation,
  AlpInstanceData,
  AlpLocale,
  AlpOption,
  AlpQuestionLogic,
  AlpSolverResult,
} from "./types";

function text(locale: AlpLocale, en: string, hi: string, pa: string): string {
  return locale === "en-IN" ? en : locale === "hi-IN" ? hi : pa;
}

const rejectedResidualTrapPhrases = [
  "does not reproduce the complete worked condition that leads to",
  "पूरी हल की गई शर्त को पूरा नहीं करता",
  "ਪੂਰੀ ਹੱਲ ਕੀਤੀ ਸ਼ਰਤ ਨੂੰ ਪੂਰਾ ਨਹੀਂ ਕਰਦਾ",
] as const;

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

function refineResidualTrap(
  analysis: AlpDistractorAnalysis,
  solved: AlpSolverResult,
  locale: AlpLocale,
): AlpDistractorAnalysis {
  if (!["POSITION_MISCOUNT", "FALLBACK_RELATION_MISMATCH", "UNCLASSIFIED_DISTRACTOR"].includes(analysis.errorLabel)) {
    return analysis;
  }

  const value = analysis.optionValue;
  const correct = solved.answer;
  const prefix = text(
    locale,
    `Option ${analysis.optionIndex + 1} (${value})`,
    `विकल्प ${analysis.optionIndex + 1} (${value})`,
    `ਵਿਕਲਪ ${analysis.optionIndex + 1} (${value})`,
  );
  const numericValue = /^\d+$/.test(value) ? Number(value) : undefined;
  const numericCorrect = /^\d+$/.test(correct) ? Number(correct) : undefined;

  if (numericValue !== undefined && numericCorrect !== undefined) {
    const difference = Math.abs(numericValue - numericCorrect);
    const direction = numericValue > numericCorrect
      ? text(locale, "above", "अधिक", "ਵੱਧ")
      : text(locale, "below", "कम", "ਘੱਟ");
    return {
      ...analysis,
      explanation: text(
        locale,
        `${prefix} is ${difference} ${difference === 1 ? "unit" : "units"} ${direction} the verified result ${correct}; it comes from a broader position miscount rather than the worked calculation.`,
        `${prefix} सत्यापित परिणाम ${correct} से ${difference} ${direction} है; यह पूरी गणना के बजाय व्यापक स्थान-गिनती की त्रुटि से बनता है।`,
        `${prefix} ਪੱਕੇ ਨਤੀਜੇ ${correct} ਤੋਂ ${difference} ${direction} ਹੈ; ਇਹ ਪੂਰੀ ਗਿਣਤੀ ਦੀ ਬਜਾਏ ਵੱਡੀ ਥਾਂ-ਗਿਣਤੀ ਦੀ ਗਲਤੀ ਨਾਲ ਬਣਦਾ ਹੈ।`,
      ),
    };
  }

  if (/^[A-Z]$/.test(value) && /^[A-Z]$/.test(correct)) {
    const valueRank = value.charCodeAt(0) - 64;
    const correctRank = correct.charCodeAt(0) - 64;
    return {
      ...analysis,
      explanation: text(
        locale,
        `${prefix} has forward rank ${valueRank}, whereas the complete operation reaches ${correct} at rank ${correctRank}.`,
        `${prefix} का सीधा स्थान ${valueRank} है, जबकि पूरी क्रिया स्थान ${correctRank} वाले ${correct} तक पहुँचती है।`,
        `${prefix} ਦੀ ਸਿੱਧੀ ਥਾਂ ${valueRank} ਹੈ, ਜਦਕਿ ਪੂਰੀ ਕਿਰਿਆ ਥਾਂ ${correctRank} ਵਾਲੇ ${correct} ਤੱਕ ਪਹੁੰਚਦੀ ਹੈ।`,
      ),
    };
  }

  return {
    ...analysis,
    explanation: text(
      locale,
      `${prefix} uses the displayed value ${value}, but the completed condition evaluates to ${correct}.`,
      `${prefix} दिखाया मान ${value} लेता है, जबकि पूरी शर्त का परिणाम ${correct} है।`,
      `${prefix} ਦਿਖਾਇਆ ਮੁੱਲ ${value} ਲੈਂਦਾ ਹੈ, ਜਦਕਿ ਪੂਰੀ ਸ਼ਰਤ ਦਾ ਨਤੀਜਾ ${correct} ਹੈ।`,
    ),
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
  const explanation = renderQualityExplanation(ql, data, solved, options, correctIndex, locale);
  const distractorAnalyses = explanation.distractorAnalyses.map((analysis) => refineResidualTrap(analysis, solved, locale));
  for (const analysis of distractorAnalyses) {
    if (rejectedResidualTrapPhrases.some((phrase) => analysis.explanation.includes(phrase))) {
      throw new Error(`${ql.qlId} retained a residual generic trap explanation for option ${analysis.optionIndex + 1}.`);
    }
  }
  return {
    ...explanation,
    visualWorking: explanation.visualWorking.map((line) => localizeVisualLine(locale, line)),
    examShortcut: strengthenShortcut(locale, explanation.examShortcut),
    distractorAnalyses,
    closestTrapRejection: distractorAnalyses[0]?.explanation ?? explanation.closestTrapRejection,
  };
}

export { renderAlpStemV2 };
