import type { TmwCp005GeneratedQuestion } from "./cp005-types";
import { cp005Actor } from "./localization-cp005-language";
import type {
  TmwLocalizedLanguage,
  TmwLocalizedQuestion,
  TmwLocalizedValue,
} from "./localization-types";
import { applyTmwCp005EditorialReviewRemediation as applyReviewedLayer } from "./cp005-editorial-review-remediation-v2";

export function applyTmwCp005EditorialReviewRemediation(
  question: TmwLocalizedQuestion<TmwLocalizedValue>,
  source: TmwCp005GeneratedQuestion,
  language: TmwLocalizedLanguage,
): TmwLocalizedQuestion<TmwLocalizedValue> {
  const reviewed = applyReviewedLayer(question, source, language);
  if (source.solveMode !== "findUnknownTimeFromAlternatingCompletion") return reviewed;

  const actorB = cp005Actor(source.parameters, language, "actorB");
  return {
    ...reviewed,
    explanation: {
      ...reviewed.explanation,
      conclusion: language === "hi"
        ? `अतः ${actorB} के अकेले काम करने का कुल समय ${reviewed.solution.answerText} होगा।`
        : `ਇਸ ਲਈ ${actorB} ਦੇ ਇਕੱਲੇ ਕੰਮ ਕਰਨ ਦਾ ਕੁੱਲ ਸਮਾਂ ${reviewed.solution.answerText} ਹੋਵੇਗਾ।`,
    },
  };
}
