import type { GeneratedBlrCp007EditorialV4Question } from "./cp007-editorial-v4-model";
import { generateBlrCp007EditorialV4Wave3FinalBank } from "./cp007-editorial-v4-wave3-final";

export const BLR_CP007_ENGLISH_FREEZE_DECISION_AUTHORITY =
  "BLR_CP007_ENGLISH_FREEZE_DECISION_CANDIDATE" as const;

export const BLR_CP007_ENGLISH_FREEZE_REVIEW_NOTE =
  "Product-owner approved the learner-facing corpus. The renewed English audit passed with zero residual blockers or warnings. Manual English-freeze decision remains pending; localisation and product delivery remain locked." as const;

export function generateBlrCp007EnglishFreezeDecisionCandidateBank(): readonly GeneratedBlrCp007EditorialV4Question[] {
  return generateBlrCp007EditorialV4Wave3FinalBank().map((question) => ({
    ...question,
    reviewProof: {
      ...question.reviewProof,
      reviewerNote: BLR_CP007_ENGLISH_FREEZE_REVIEW_NOTE,
    },
    metadata: {
      ...question.metadata,
      activeEditorialBlockers: ["ENGLISH_FREEZE_PENDING"],
    },
    v4ReviewProof: {
      ...question.v4ReviewProof,
      activeEditorialBlockers: ["ENGLISH_FREEZE_PENDING"],
      humanReviewRequired: true,
    },
  }));
}

function learnerProjection(question: GeneratedBlrCp007EditorialV4Question): unknown {
  return {
    itemId: question.itemId,
    qlId: question.qlId,
    sharedPrompt: question.sharedPrompt,
    stem: question.stem,
    options: question.options.map((option) => ({
      text: option.text,
      studentExplanation: option.studentExplanation,
      isCorrectAnswerForTask: option.isCorrectAnswerForTask,
    })),
    correctIndex: question.correctIndex,
    answer: question.answer,
    explanation: question.explanation,
    delivery: question.delivery,
  };
}

export function learnerCorpusIsUnchanged(): boolean {
  const source = generateBlrCp007EditorialV4Wave3FinalBank();
  const candidate = generateBlrCp007EnglishFreezeDecisionCandidateBank();
  return JSON.stringify(source.map(learnerProjection)) === JSON.stringify(candidate.map(learnerProjection));
}
