import { runNumCp005PermanentPipeline } from "../permanent/runtime";
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

function ql054LegacyParserStem(
  english: ReturnType<typeof runNumCp005PermanentPipeline>,
): string {
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

export function generateNumCp005LocalizedQuestion(
  input: NumCp005LocalizedRuntimeInput,
): NumCp005LocalizedQuestion {
  const english = runNumCp005PermanentPipeline({
    questionLanguageId: input.questionLanguageId,
    seed: input.seed,
    language: "en",
  });

  const localisationEnglish = english.questionLanguageId === "NUM-QL-054"
    ? Object.freeze({
        ...english,
        stem: ql054LegacyParserStem(english),
      })
    : english;

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

  return applyNumCp005FinalLearnerTextCleanup(
    hardenNumCp005LocalizedQuestion(english, localized),
  );
}
