export * from "./question-studio-review-v4-1.ts";

import {
  previewSta001QuestionStudioReview as previewSemanticReview,
  type PreviewSta001QuestionStudioInput,
} from "./question-studio-review-v4-1.ts";
import { generateStaV4Question } from "./exam-realness-v4-1-editorial-runtime.ts";

export function previewSta001QuestionStudioReview(input: PreviewSta001QuestionStudioInput = {}) {
  const review = previewSemanticReview(input);
  const questions = review.questions.map((question) => {
    const editorial = generateStaV4Question({
      seed: question.seed,
      locale: question.locale,
      profileId: question.presentationProfile,
      qlId: question.qlId,
    });
    if (editorial.canonicalItemId !== question.canonicalItemId || editorial.contentFingerprint !== question.contentFingerprint) {
      throw new Error(`${question.questionId}: editorial surface changed canonical semantic identity`);
    }
    const textByCandidateId = new Map(editorial.candidates.map((candidate) => [candidate.candidateId, candidate.text] as const));
    const candidates = question.candidates.map((candidate) => Object.freeze({
      ...candidate,
      text: textByCandidateId.get(candidate.candidateId) ?? candidate.text,
    }));
    const displayStem = [editorial.statement, ...candidates.map((candidate) => `${candidate.label}. ${candidate.text}`)].join("\n");
    return Object.freeze({
      ...question,
      displayStem,
      statement: editorial.statement,
      candidates: Object.freeze(candidates),
      explanation: editorial.explanation,
    });
  });
  return Object.freeze({ ...review, questions: Object.freeze(questions) });
}
