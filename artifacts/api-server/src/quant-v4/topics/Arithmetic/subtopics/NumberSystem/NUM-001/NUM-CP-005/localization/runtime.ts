import { runNumCp005PermanentPipeline } from "../permanent/runtime";
import { translateNumCp005LocalizedOptionValue } from "./dynamic-option-translation";
import { applyNumCp005FinalLearnerTextCleanup } from "./final-learner-text-cleanup";
import { hardenNumCp005LocalizedQuestion } from "./linguistic-hardening";
import { localizeNumCp005Question } from "./localizer";
import type {
  NumCp005LocalizedQuestion,
  NumCp005LocalizedRuntimeInput,
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

function replaceDynamicOptionText(
  text: string,
  replacements: readonly (readonly [string, string])[],
): string {
  return replacements.reduce(
    (result, [english, localized]) => result.replaceAll(english, localized),
    text,
  );
}

function localizeDynamicOptionText(
  english: EnglishQuestion,
  question: NumCp005LocalizedQuestion,
): NumCp005LocalizedQuestion {
  if (
    english.questionLanguageId !== "NUM-QL-068"
    && english.questionLanguageId !== "NUM-QL-069"
  ) return question;

  const replacements = english.options.map((option) => Object.freeze([
    option.value,
    translateNumCp005LocalizedOptionValue(
      english.questionLanguageId,
      option.value,
      question.locale,
    ),
  ] as const));
  const replace = (text: string) => replaceDynamicOptionText(text, replacements);
  const canonicalAnswer = translateNumCp005LocalizedOptionValue(
    english.questionLanguageId,
    english.canonicalAnswer,
    question.locale,
  );
  const verifierAnswer = translateNumCp005LocalizedOptionValue(
    english.questionLanguageId,
    english.verifierAnswer,
    question.locale,
  );

  return Object.freeze({
    ...question,
    options: Object.freeze(question.options.map((option, index) => Object.freeze({
      ...option,
      value: replacements[index]![1],
      analysis: replace(option.analysis),
    }))),
    canonicalAnswer,
    verifierAnswer,
    explanation: Object.freeze({
      ...question.explanation,
      coreConcept: replace(question.explanation.coreConcept),
      givenDataAndStrategy: replace(question.explanation.givenDataAndStrategy),
      stepByStep: Object.freeze(question.explanation.stepByStep.map(replace)),
      examSpeedMethod: replace(question.explanation.examSpeedMethod),
      commonTraps: Object.freeze(question.explanation.commonTraps.map(replace)),
      finalAnswer: replace(question.explanation.finalAnswer),
    }),
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
  return localizeDynamicOptionText(english, hardened);
}
