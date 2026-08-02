import { runNumCp005PermanentPipeline } from "../permanent/runtime";
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

  if (
    english.questionLanguageId === "NUM-QL-068"
    && english.hiddenState.metricKind === "DIVISOR_SUM"
  ) {
    const adaptedEnglish = Object.freeze({
      ...english,
      hiddenState: Object.freeze({
        ...english.hiddenState,
        metricKind: "TOTAL_DIVISORS",
      }),
    });
    const localized = localizeNumCp005Question(adaptedEnglish, input.locale);
    const countLabel = input.locale === "hi-IN"
      ? "धनात्मक भाजकों की संख्या"
      : "ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦੀ ਗਿਣਤੀ";
    const sumLabel = input.locale === "hi-IN"
      ? "धनात्मक भाजकों का योग"
      : "ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦਾ ਜੋੜ";
    return Object.freeze({
      ...localized,
      hiddenState: english.hiddenState,
      stem: localized.stem.replace(countLabel, sumLabel),
    });
  }

  return localizeNumCp005Question(english, input.locale);
}
