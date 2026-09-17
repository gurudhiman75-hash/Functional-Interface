import type { ClsCp001QlId } from "./cp001-permanent-contracts";
import { generateClsCp001Question } from "./cp001-multilingual-runtime";
import type { ClsCp001Locale } from "./localization/cp001-language-pack";

export function toClsCp001LearnerReviewV2<
  T extends ReturnType<typeof generateClsCp001Question>,
>(question: T) {
  return {
    ...question,
    explanation: {
      coreRule: question.explanation.coreRule,
      optionChecks: question.explanation.optionChecks,
      examSpeedShortcut: [] as readonly string[],
      commonTraps: [] as readonly string[],
    },
    metadata: {
      ...question.metadata,
      learnerReviewVersion: "cls-cp001-learner-review-v2" as const,
      learnerEditorialVersion: "compact-explanation-no-boilerplate-v2" as const,
    },
  };
}

export function generateClsCp001LearnerReviewV2(
  qlId: ClsCp001QlId,
  locale: ClsCp001Locale = "en-IN",
  seed = 0,
) {
  return toClsCp001LearnerReviewV2(generateClsCp001Question(qlId, locale, seed));
}
