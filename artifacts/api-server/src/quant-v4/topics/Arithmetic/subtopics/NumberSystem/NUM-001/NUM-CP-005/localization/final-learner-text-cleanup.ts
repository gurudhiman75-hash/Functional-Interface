import type {
  NumCp005LocalizedOption,
  NumCp005LocalizedQuestion,
  NumCp005TranslatedLocale,
} from "./types";

function cleanText(value: string, locale: NumCp005TranslatedLocale): string {
  const replacements: readonly (readonly [string, string])[] = locale === "hi-IN"
    ? [
        ["है है", "है"],
        ["एक लघु विवरण में ", ""],
      ]
    : [
        ["ਢੰਗ ਦੇ ਭਾਜਕਾਂ", "n ਤੋਂ ਛੋਟੇ ਭਾਜਕਾਂ"],
        ["ਢੰਗ ਦੇ ਭਾਜਕ", "n ਤੋਂ ਛੋਟੇ ਭਾਜਕ"],
        ["ਸੰਖਿਆ ਨੂੰ ਆਪ ਨੂੰ", "ਸੰਖਿਆ ਨੂੰ ਆਪ"],
        ["ਕਰਣੀਆਂ", "ਕਰਨੀਆਂ"],
        ["ਲਕਸ਼", "ਲੋੜੀਂਦਾ ਮੁੱਲ"],
        ["ਸਾਂਝਾ ਮਿਲਾਪ", "ਦੋਵਾਂ ਸ਼ਰਤਾਂ ਨਾਲ ਮਿਲਦਾ ਨਤੀਜਾ"],
        ["ਨਿਯਮ-ਮੁੱਲ", "ਕੱਢਿਆ ਹੋਇਆ ਮੁੱਲ"],
        ["ਇੱਕ ਛੋਟੇ ਵੇਰਵੇ ਵਿੱਚ ", ""],
        ["ਨਾਲ ਭਾਜਯ ਨਹੀਂ ਹਨ", "ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਨਹੀਂ ਵੰਡੇ ਜਾਂਦੇ"],
        ["ਨਾਲ ਭਾਜਯ ਹਨ", "ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਵੰਡੇ ਜਾਂਦੇ ਹਨ"],
        ["ਨਾਲ ਭਾਜਯ ਨਹੀਂ ਹੈ", "ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਨਹੀਂ ਵੰਡੀ ਜਾਂਦੀ"],
        ["ਨਾਲ ਭਾਜਯ ਹੈ", "ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਵੰਡਿਆ ਜਾਂਦਾ ਹੈ"],
        ["ਪੂਰਨ rਵੀਂ", "ਪੂਰਨ r-ਵੀਂ"],
        ["ਹੈ ਹੈ", "ਹੈ"],
      ];

  return replacements.reduce(
    (text, [from, to]) => text.replaceAll(from, to),
    value,
  );
}

function cleanOption(
  option: NumCp005LocalizedOption,
  locale: NumCp005TranslatedLocale,
): NumCp005LocalizedOption {
  return Object.freeze({
    ...option,
    analysis: cleanText(option.analysis, locale),
  });
}

export function applyNumCp005FinalLearnerTextCleanup(
  question: NumCp005LocalizedQuestion,
): NumCp005LocalizedQuestion {
  const locale = question.locale;
  const options = Object.freeze(
    question.options.map((option) => cleanOption(option, locale)),
  );
  const commonTraps = Object.freeze(
    options.filter((option) => !option.isCorrect).map((option) => option.analysis),
  );

  return Object.freeze({
    ...question,
    stem: cleanText(question.stem, locale),
    options,
    explanation: Object.freeze({
      ...question.explanation,
      coreConcept: cleanText(question.explanation.coreConcept, locale),
      givenDataAndStrategy: cleanText(
        question.explanation.givenDataAndStrategy,
        locale,
      ),
      stepByStep: Object.freeze(
        question.explanation.stepByStep.map((step) => cleanText(step, locale)),
      ),
      examSpeedMethod: cleanText(question.explanation.examSpeedMethod, locale),
      commonTraps,
      finalAnswer: cleanText(question.explanation.finalAnswer, locale),
    }),
  });
}
