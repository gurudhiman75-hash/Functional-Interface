import { runNumCp005PermanentPipeline } from "../permanent/runtime";
import { applyNumCp005FinalLearnerTextCleanup } from "./final-learner-text-cleanup";
import { hardenNumCp005LocalizedQuestion } from "./linguistic-hardening";
import { localizeNumCp005Question } from "./localizer";
import type {
  NumCp005LocalizedQuestion,
  NumCp005LocalizedRuntimeInput,
} from "./types";

export function generateNumCp005LocalizedQuestion(
  input: NumCp005LocalizedRuntimeInput,
): NumCp005LocalizedQuestion {
  const english = runNumCp005PermanentPipeline({
    questionLanguageId: input.questionLanguageId,
    seed: input.seed,
    language: "en",
  });

  const sumStateKey = english.questionLanguageId === "NUM-QL-061"
    ? "propertyKind"
    : english.questionLanguageId === "NUM-QL-068" ? "metricKind" : null;
  const requiresSumLabel = sumStateKey !== null
    && english.hiddenState[sumStateKey] === "DIVISOR_SUM";

  let localized: NumCp005LocalizedQuestion;
  if (requiresSumLabel && sumStateKey) {
    const adaptedEnglish = Object.freeze({
      ...english,
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
    localized = localizeNumCp005Question(english, input.locale);
  }

  return applyNumCp005FinalLearnerTextCleanup(
    hardenNumCp005LocalizedQuestion(english, localized),
  );
}
