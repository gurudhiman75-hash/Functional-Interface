import { runNumCp005PermanentPipeline } from "../permanent/runtime";
import { applyNumCp005FinalLearnerTextCleanup } from "./final-learner-text-cleanup";
import { hardenNumCp005LocalizedQuestion } from "./linguistic-hardening";
import { localizeNumCp005Question } from "./localizer";
import type {
  NumCp005LocalizedQuestion,
  NumCp005LocalizedRuntimeInput,
  NumCp005TranslatedLocale,
} from "./types";

interface PrimePowerState {
  readonly prime: number;
  readonly exponent: number;
}

type EnglishQuestion = ReturnType<typeof runNumCp005PermanentPipeline>;

function ql054LegacyParserStem(english: EnglishQuestion): string {
  const hiddenPrime = Number(english.hiddenState.hiddenPrime);
  const targetDivisorCount = String(english.hiddenState.targetDivisorCount);
  const factorState = english.hiddenState.factorState;
  if (!Number.isInteger(hiddenPrime) || !Array.isArray(factorState)) {
    throw new Error(
      `${english.questionLanguageId}/${english.seed}: incomplete QL-054 localisation state`,
    );
  }

  const expression = (factorState as readonly PrimePowerState[])
    .map(({ prime, exponent }) => {
      if (prime === hiddenPrime) return `${prime}^x`;
      return exponent === 1 ? String(prime) : `${prime}^${exponent}`;
    })
    .join(" × ");

  return `n = ${expression} has exactly ${targetDivisorCount} positive divisors, find x.`;
}

function expressionParserCompatibleEnglish(english: EnglishQuestion): EnglishQuestion {
  if (english.questionLanguageId === "NUM-QL-054") {
    return Object.freeze({
      ...english,
      stem: ql054LegacyParserStem(english),
    });
  }

  if (
    english.questionLanguageId === "NUM-QL-064"
    || english.questionLanguageId === "NUM-QL-065"
  ) {
    const maximumExponent = Number(english.hiddenState.maximumExponent);
    const targetDivisorCount = Number(english.hiddenState.targetDivisorCount);
    if (!Number.isInteger(maximumExponent) || !Number.isInteger(targetDivisorCount)) {
      throw new Error(
        `${english.questionLanguageId}/${english.seed}: incomplete exponent-pair localisation state`,
      );
    }
    return Object.freeze({
      ...english,
      stem: `For n = p^x × q^y, where 0 ≤ x,y ≤ ${maximumExponent}, use target divisor count ${targetDivisorCount}.`,
    });
  }

  return english;
}

function localizeQl068ComparisonAnalysis(
  analysis: string,
  locale: NumCp005TranslatedLocale,
): string {
  const match = analysis.match(
    /A has (.+?); B has (.+?); (Number A has more\.|Number B has more\.|Both numbers have the same value\.|Cannot determine\.)/u,
  );
  if (!match) {
    throw new Error(`NUM-QL-068 comparison analysis format changed: ${analysis}`);
  }

  const valueA = match[1]!;
  const valueB = match[2]!;
  const outcome = match[3]!;
  const hi = locale === "hi-IN";
  const outcomeText = outcome === "Number A has more."
    ? hi ? "A का मान अधिक है।" : "A ਦਾ ਮੁੱਲ ਵੱਧ ਹੈ।"
    : outcome === "Number B has more."
      ? hi ? "B का मान अधिक है।" : "B ਦਾ ਮੁੱਲ ਵੱਧ ਹੈ।"
      : outcome === "Both numbers have the same value."
        ? hi ? "A और B दोनों का मान समान है।" : "A ਅਤੇ B ਦੋਵਾਂ ਦਾ ਮੁੱਲ ਇੱਕੋ ਹੈ।"
        : outcome === "Cannot determine."
          ? hi ? "दिए गए मानों से निर्णय नहीं किया जा सकता।" : "ਦਿੱਤੇ ਮੁੱਲਾਂ ਤੋਂ ਫੈਸਲਾ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ।"
          : null;

  if (!outcomeText) {
    throw new Error(`NUM-QL-068 comparison outcome format changed: ${outcome}`);
  }

  const translatedComparison = hi
    ? `A का मान ${valueA} है; B का मान ${valueB} है; ${outcomeText}`
    : `A ਦਾ ਮੁੱਲ ${valueA} ਹੈ; B ਦਾ ਮੁੱਲ ${valueB} ਹੈ; ${outcomeText}`;

  return analysis.replace(match[0], translatedComparison);
}

function localizeQl068OptionAnalyses(
  question: NumCp005LocalizedQuestion,
): NumCp005LocalizedQuestion {
  if (question.questionLanguageId !== "NUM-QL-068") return question;

  return Object.freeze({
    ...question,
    options: Object.freeze(question.options.map((option) => Object.freeze({
      ...option,
      analysis: localizeQl068ComparisonAnalysis(option.analysis, question.locale),
    }))),
  });
}

export function generateNumCp005LocalizedQuestion(
  input: NumCp005LocalizedRuntimeInput,
): NumCp005LocalizedQuestion {
  const english = runNumCp005PermanentPipeline({
    questionLanguageId: input.questionLanguageId,
    seed: input.seed,
    language: "en",
  });

  const localisationEnglish = expressionParserCompatibleEnglish(english);

  const sumStateKey = english.questionLanguageId === "NUM-QL-061"
    ? "propertyKind"
    : english.questionLanguageId === "NUM-QL-068" ? "metricKind" : null;
  const requiresSumLabel = sumStateKey !== null
    && english.hiddenState[sumStateKey] === "DIVISOR_SUM";

  let localized: NumCp005LocalizedQuestion;
  if (requiresSumLabel && sumStateKey) {
    const adaptedEnglish = Object.freeze({
      ...localisationEnglish,
      hiddenState: Object.freeze({
        ...english.hiddenState,
        [sumStateKey]: "TOTAL_DIVISORS",
      }),
    });
    const adaptedLocalized = localizeNumCp005Question(adaptedEnglish, input.locale);
    const countLabel = input.locale === "hi-IN"
      ? "धनात्मक भाजकों की संख्या"
      : "ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦੀ ਗਿਣਤੀ";
    const sumLabel = input.locale === "hi-IN"
      ? "धनात्मक भाजकों का योग"
      : "ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦਾ ਜੋੜ";
    localized = Object.freeze({
      ...adaptedLocalized,
      hiddenState: english.hiddenState,
      stem: adaptedLocalized.stem.replace(countLabel, sumLabel),
    });
  } else {
    localized = localizeNumCp005Question(localisationEnglish, input.locale);
  }

  const hardened = applyNumCp005FinalLearnerTextCleanup(
    hardenNumCp005LocalizedQuestion(english, localized),
  );
  return localizeQl068OptionAnalyses(hardened);
}
