import type { SerCp007EditorialQuestion } from "./adaptive-review";
import {
  buildAdaptiveSerCp007ReviewV7,
  type SerCp007AdaptiveReviewV7,
} from "./adaptive-review-v7";

function renderWithQuestionOptions(
  review: string,
  stem: string,
  question: SerCp007EditorialQuestion,
): string {
  const marker = "### Explanation";
  const markerIndex = review.indexOf(marker);
  const explanation =
    markerIndex >= 0 ? review.slice(markerIndex).trim() : marker;
  const optionLines = question.options.map(
    (option, index) =>
      `${index === question.correctIndex ? "✓" : " "} ${index + 1}. ${option}`,
  );
  return [
    stem,
    "",
    ...optionLines,
    "",
    `**Answer:** ${question.correctIndex + 1}. ${question.correctAnswer}`,
    "",
    explanation,
  ].join("\n");
}

export function buildAdaptiveSerCp007ReviewV7Final(
  question: SerCp007EditorialQuestion,
): SerCp007AdaptiveReviewV7 {
  const base = buildAdaptiveSerCp007ReviewV7(question);
  const conciseReview = renderWithQuestionOptions(
    base.conciseReview,
    base.stem,
    question,
  );
  const expandedSource =
    question.sourceRuleId === "UNIFORM_FRAME_CASE_MARKER_ROTATION"
      ? base.conciseReview
      : base.expandedReview;
  const expandedReview = renderWithQuestionOptions(
    expandedSource,
    base.stem,
    question,
  );
  if (
    conciseReview.includes("x→X (0)") ||
    conciseReview.includes("X→x (0)") ||
    expandedReview.includes("x→X (0)") ||
    expandedReview.includes("X→x (0)")
  ) {
    throw new Error(
      `Legacy zero-delta marker explanation survived in ${question.temporaryTemplateId}:${question.seed}`,
    );
  }
  return {
    ...base,
    review: conciseReview,
    conciseReview,
    expandedReview,
    options: question.options,
  };
}
