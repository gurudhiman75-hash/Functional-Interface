import {
  CLS_CP002_QL_ID,
  type ClsCp002QlId,
} from "./cp002-permanent-contract";
import { generateClsCp002Question } from "./cp002-multilingual-runtime";
import type { ClsCp002Locale } from "./localization/cp002-language-pack";

export function toClsCp002LearnerReviewV2<
  T extends ReturnType<typeof generateClsCp002Question>,
>(question: T) {
  return {
    ...question,
    explanation: {
      coreConcept: question.explanation.coreConcept,
      stepByStep: question.explanation.stepByStep,
      examSpeedShortcut: [] as readonly string[],
      commonTrapWarning: [] as readonly string[],
    },
    metadata: {
      ...question.metadata,
      learnerReviewVersion: "cls-cp002-learner-review-v2" as const,
      learnerEditorialVersion: "compact-explanation-no-boilerplate-v2" as const,
    },
  };
}

export function generateClsCp002LearnerReviewV2(
  qlId: ClsCp002QlId = CLS_CP002_QL_ID,
  locale: ClsCp002Locale = "en-IN",
  seed = 0,
) {
  return toClsCp002LearnerReviewV2(generateClsCp002Question(qlId, locale, seed));
}
