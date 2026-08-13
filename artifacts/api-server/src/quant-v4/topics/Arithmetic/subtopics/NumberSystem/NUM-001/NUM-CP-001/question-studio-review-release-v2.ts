import * as v1 from "./question-studio-review-release-v1";
import { applyNumCp001EditorialV2 } from "./editorial-v2-surface";

export const NUM_CP001_QUESTION_STUDIO_REVIEW_RELEASE = Object.freeze({
  ...v1.NUM_CP001_QUESTION_STUDIO_REVIEW_RELEASE,
  releaseId: "NUM-001-CP001-MULTI-QS-REVIEW-v2",
  reviewStatus: "EDITORIAL_V2_CONTROLLED_REVIEW" as const,
});

function explanationLines(explanation: any, language: "en" | "hi" | "pa") {
  const labels = language === "hi" ? ["मुख्य अवधारणा", "हल", "उत्तर"] : language === "pa" ? ["ਮੁੱਖ ਧਾਰਨਾ", "ਹੱਲ", "ਉੱਤਰ"] : ["Concept", "Solution", "Answer"];
  const concept = Array.isArray(explanation.coreConcept) ? explanation.coreConcept.join(" ") : "";
  const steps = Array.isArray(explanation.stepByStep) ? explanation.stepByStep : [];
  return Object.freeze([
    concept ? `**${labels[0]}:** ${concept}` : "",
    ...steps.map((step: string, index: number) => `**${labels[1]}${steps.length > 1 ? ` ${index + 1}` : ""}:** ${step}`),
    `**${labels[2]}:** ${explanation.finalAnswer}`,
  ].filter(Boolean));
}

export function getNumCp001QuestionStudioReviewQlIds() {
  return v1.getNumCp001QuestionStudioReviewQlIds();
}

export function runNumCp001QuestionStudioReview(input: v1.NumCp001QuestionStudioReviewInput = {}) {
  const source = v1.runNumCp001QuestionStudioReview(input) as any;
  const editorial = applyNumCp001EditorialV2(source, source.language, Number(source.seed));
  if (editorial.options.length !== 4 || new Set(editorial.options).size !== 4 || editorial.options[editorial.correctIndex] !== editorial.answer) {
    throw new Error("NUM-CP-001 Editorial V2 integrity failure");
  }
  return Object.freeze({
    ...source,
    ...editorial,
    explanationId: `${source.questionLanguageId}-${source.language.toUpperCase()}-QS-EDITORIAL-V2`,
    explanation: Object.freeze({ ...editorial.explanation, lines: explanationLines(editorial.explanation, source.language) }),
    reviewStatus: NUM_CP001_QUESTION_STUDIO_REVIEW_RELEASE.reviewStatus,
    allocationStatus: "QUESTION_STUDIO_EDITORIAL_V2_REVIEW" as const,
    traceability: Object.freeze({
      ...source.traceability,
      releaseId: NUM_CP001_QUESTION_STUDIO_REVIEW_RELEASE.releaseId,
      editorialVersion: editorial.editorialVersion,
      sourceReviewReleaseId: v1.NUM_CP001_QUESTION_STUDIO_REVIEW_RELEASE.releaseId,
    }),
  });
}

export type NumCp001QuestionStudioReviewDifficulty = v1.NumCp001QuestionStudioReviewDifficulty;
export type NumCp001QuestionStudioReviewInput = v1.NumCp001QuestionStudioReviewInput;
export type NumCp001QuestionStudioReviewLanguage = v1.NumCp001QuestionStudioReviewLanguage;
