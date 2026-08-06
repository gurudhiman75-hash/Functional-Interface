import type { SerCp007EditorialQuestion } from "./adaptive-review";
import {
  buildAdaptiveSerCp007ReviewV6,
  type SerCp007AdaptiveReviewV6,
} from "./adaptive-review-v6";

function normalizeLearnerWording(value: string): string {
  return value
    .replace(/move the first 1 letters?/gi, "move the first letter")
    .replace(/first 1 letters?/gi, "first letter");
}

export function buildAdaptiveSerCp007ReviewV6Final(
  question: SerCp007EditorialQuestion,
): SerCp007AdaptiveReviewV6 {
  const review = buildAdaptiveSerCp007ReviewV6(question);
  return {
    ...review,
    review: normalizeLearnerWording(review.review),
    workedSteps: review.workedSteps.map(normalizeLearnerWording),
  };
}
