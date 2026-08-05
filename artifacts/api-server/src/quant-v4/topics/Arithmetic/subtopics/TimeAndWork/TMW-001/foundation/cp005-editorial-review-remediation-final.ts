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

  if (source.solveMode === "findCompletionWithPeriodicNegativeWork") {
    return {
      ...reviewed,
      explanation: {
        ...reviewed.explanation,
        opening: language === "hi"
          ? "दो काम वाले दिनों में हुआ काम जोड़ें और बिगाड़ वाले दिन बिगड़े हुए काम को घटाएँ। एक चक्र में हुआ वास्तविक काम दोहराएँ; फिर अंतिम दिन अलग जाँचें।"
          : "ਦੋ ਕੰਮ ਵਾਲੇ ਦਿਨਾਂ ਵਿੱਚ ਹੋਇਆ ਕੰਮ ਜੋੜੋ ਅਤੇ ਖਰਾਬੀ ਵਾਲੇ ਦਿਨ ਖਰਾਬ ਹੋਇਆ ਕੰਮ ਘਟਾਓ। ਇੱਕ ਚੱਕਰ ਵਿੱਚ ਹੋਇਆ ਅਸਲ ਕੰਮ ਦੁਹਰਾਓ; ਫਿਰ ਆਖ਼ਰੀ ਦਿਨ ਵੱਖ ਜਾਂਚੋ।",
      },
    };
  }

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
