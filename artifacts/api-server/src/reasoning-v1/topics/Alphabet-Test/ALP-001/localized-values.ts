import type {
  AlpAnswerType,
  AlpDistractorAnalysis,
  AlpExplanation,
  AlpLocale,
  AlpOption,
} from "./types";

function hindiOrdinal(word: string): string {
  if (word === "first") return "पहला";
  if (word === "second") return "दूसरा";
  if (word === "third") return "तीसरा";
  const value = Number.parseInt(word, 10);
  if (value === 4) return "चौथा";
  if (value === 5) return "पाँचवाँ";
  return `${value}वाँ`;
}

function punjabiOrdinal(word: string): string {
  if (word === "first") return "ਪਹਿਲਾ";
  if (word === "second") return "ਦੂਜਾ";
  if (word === "third") return "ਤੀਜਾ";
  const value = Number.parseInt(word, 10);
  if (value === 4) return "ਚੌਥਾ";
  if (value === 5) return "ਪੰਜਵਾਂ";
  return `${value}ਵਾਂ`;
}

function localizeOccurrenceValue(value: string, locale: Exclude<AlpLocale, "en-IN">): string {
  if (value === "None") return locale === "hi-IN" ? "कोई नहीं" : "ਕੋਈ ਨਹੀਂ";
  return value
    .split("; ")
    .map((part) => {
      const match = part.match(/^(first|second|third|\d+th) ([A-Z])$/);
      if (!match) return part;
      const ordinal = locale === "hi-IN" ? hindiOrdinal(match[1]!) : punjabiOrdinal(match[1]!);
      return `${ordinal} ${match[2]}`;
    })
    .join("; ");
}

function localizeDirectionValue(value: string, locale: Exclude<AlpLocale, "en-IN">): string {
  const match = value.match(/^(\d+) to the (left|right)$/);
  if (!match) return value;
  const amount = Number(match[1]);
  const direction = match[2];
  if (locale === "hi-IN") {
    return `${amount} स्थान ${direction === "left" ? "बाईं" : "दाईं"} ओर`;
  }
  const unit = amount === 1 ? "ਥਾਂ" : "ਥਾਵਾਂ";
  return `${amount} ${unit} ${direction === "left" ? "ਖੱਬੇ" : "ਸੱਜੇ"} ਪਾਸੇ`;
}

export function localizeAlpDisplayValue(
  answerType: AlpAnswerType,
  value: string,
  locale: AlpLocale,
): string {
  if (locale === "en-IN") return value;
  if (answerType === "DIRECTION_OFFSET") return localizeDirectionValue(value, locale);
  if (answerType === "LETTER_SET") return localizeOccurrenceValue(value, locale);
  return value;
}

function replaceMappedValues(value: string, replacements: readonly (readonly [string, string])[]): string {
  return replacements.reduce(
    (current, [canonical, localized]) => current.split(canonical).join(localized),
    value,
  );
}

function localizeAnalysis(
  analysis: AlpDistractorAnalysis,
  answerType: AlpAnswerType,
  locale: AlpLocale,
  replacements: readonly (readonly [string, string])[],
): AlpDistractorAnalysis {
  return {
    ...analysis,
    optionValue: localizeAlpDisplayValue(answerType, analysis.optionValue, locale),
    explanation: replaceMappedValues(analysis.explanation, replacements),
  };
}

export function localizeAlpAnswerSurface(
  answerType: AlpAnswerType,
  canonicalAnswer: string,
  canonicalOptions: readonly AlpOption[],
  explanation: AlpExplanation,
  locale: AlpLocale,
): {
  readonly answer: string;
  readonly options: readonly AlpOption[];
  readonly explanation: AlpExplanation;
} {
  if (locale === "en-IN" || (answerType !== "DIRECTION_OFFSET" && answerType !== "LETTER_SET")) {
    return { answer: canonicalAnswer, options: canonicalOptions, explanation };
  }

  const values = [canonicalAnswer, ...canonicalOptions.map((option) => option.value)];
  const replacements = [...new Set(values)]
    .map((value) => [value, localizeAlpDisplayValue(answerType, value, locale)] as const)
    .filter(([canonical, localized]) => canonical !== localized)
    .sort(([first], [second]) => second.length - first.length);
  const options = canonicalOptions.map((option) => ({
    ...option,
    value: localizeAlpDisplayValue(answerType, option.value, locale),
  }));
  const distractorAnalyses = explanation.distractorAnalyses.map((analysis) => localizeAnalysis(
    analysis,
    answerType,
    locale,
    replacements,
  ));
  const localizedExplanation: AlpExplanation = {
    ...explanation,
    coreConcept: replaceMappedValues(explanation.coreConcept, replacements),
    ruleStatement: replaceMappedValues(explanation.ruleStatement, replacements),
    steps: explanation.steps.map((step) => replaceMappedValues(step, replacements)),
    visualWorking: explanation.visualWorking.map((line) => replaceMappedValues(line, replacements)),
    examShortcut: replaceMappedValues(explanation.examShortcut, replacements),
    conclusion: replaceMappedValues(explanation.conclusion, replacements),
    distractorAnalyses,
    closestTrapRejection: replaceMappedValues(explanation.closestTrapRejection, replacements),
  };
  const answer = localizeAlpDisplayValue(answerType, canonicalAnswer, locale);
  if (new Set(options.map((option) => option.value)).size !== options.length) {
    throw new Error(`Localized ${answerType} options are not unique in ${locale}.`);
  }
  return { answer, options, explanation: localizedExplanation };
}
