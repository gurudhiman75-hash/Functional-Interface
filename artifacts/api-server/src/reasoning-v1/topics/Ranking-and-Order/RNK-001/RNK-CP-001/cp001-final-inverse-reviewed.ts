import {
  generateRnkCp001FinalInverseQuestion as generateRawQuestion,
  RNK_CP001_FINAL_INVERSE_PROTOTYPE_ID,
  solveRnkCp001FinalInverseCanonical,
  solveRnkCp001FinalInverseIndependently,
  type RnkCp001FinalInverseQuestion,
} from './cp001-final-inverse-gap';

export {
  RNK_CP001_FINAL_INVERSE_PROTOTYPE_ID,
  solveRnkCp001FinalInverseCanonical,
  solveRnkCp001FinalInverseIndependently,
};
export type { RnkCp001FinalInverseQuestion };

function stripInternalMisconceptionTag(line: string): string {
  return line.replace(/\s+\[[A-Z0-9_]+\]\s*$/, '');
}

export function generateRnkCp001FinalInverseReviewedQuestion(
  seed: number,
): RnkCp001FinalInverseQuestion {
  const question = generateRawQuestion(seed);
  return {
    ...question,
    explanation: {
      ...question.explanation,
      optionAnalysis: question.explanation.optionAnalysis.map(stripInternalMisconceptionTag),
    },
  };
}
