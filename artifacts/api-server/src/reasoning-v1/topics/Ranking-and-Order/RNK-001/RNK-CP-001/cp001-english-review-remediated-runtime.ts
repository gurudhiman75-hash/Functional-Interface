import {
  generateRnkCp001EnglishReviewedAuthorityQuestion as generateHumanizedQuestion,
  generateRnkCp001EnglishReviewedAuthoritySet as generateHumanizedSet,
  type RnkCp001ProvisionalAuthorityReviewQuestion,
} from './cp001-english-reviewed-authority-runtime';
import type { RnkCp001ProvisionalAuthorityId } from './cp001-provisional-consolidation';

export type { RnkCp001ProvisionalAuthorityReviewQuestion } from './cp001-english-reviewed-authority-runtime';

type UnderlyingQuestion = RnkCp001ProvisionalAuthorityReviewQuestion['question'];

interface ReviewContext {
  readonly singular: 'candidate' | 'person';
  readonly plural: 'candidates' | 'people';
  readonly beforeRelation: string;
  readonly afterRelation: string;
}

function reviewContext(question: UnderlyingQuestion): ReviewContext {
  switch (question.contextId) {
    case 'MERIT_LIST':
      return {
        singular: 'candidate',
        plural: 'candidates',
        beforeRelation: 'ranked above',
        afterRelation: 'ranked below',
      };
    case 'HORIZONTAL_ROW':
      return {
        singular: 'person',
        plural: 'people',
        beforeRelation: 'standing to the left of',
        afterRelation: 'standing to the right of',
      };
    case 'QUEUE':
      return {
        singular: 'person',
        plural: 'people',
        beforeRelation: 'standing ahead of',
        afterRelation: 'standing behind',
      };
  }
}

function polishLearnerText(text: string, question: UnderlyingQuestion): string {
  const context = reviewContext(question);
  const name = question.targetName;

  return text
    .replace(
      new RegExp(`${name}'s from the (top|bottom|left|right|front|back) rank`, 'g'),
      `${name}'s rank from the $1`,
    )
    .replace(
      /\bgives (\d+) from the (top|bottom|left|right|front|back)\b/g,
      'gives a rank of $1 from the $2',
    )
    .replace(
      `For the count ${context.beforeRelation} ${name}, reduce rank`,
      `To count the ${context.plural} ${context.beforeRelation} ${name}, reduce the rank`,
    )
    .replace(
      `For the count ${context.afterRelation} ${name}, reduce rank`,
      `To count the ${context.plural} ${context.afterRelation} ${name}, reduce the rank`,
    )
    .replace(
      new RegExp(`Once the 0 positions after ${name} are removed`, 'g'),
      `With no positions after ${name}`,
    )
    .replace(
      new RegExp(`Once the 1 positions after ${name} are removed`, 'g'),
      `After removing the one position after ${name}`,
    )
    .replace(
      new RegExp(`= 1 remain (${context.beforeRelation}|${context.afterRelation}) ${name}`, 'g'),
      `= one ${context.singular} remains $1 ${name}`,
    )
    .replace(
      new RegExp(`= 0 remain (${context.beforeRelation}|${context.afterRelation}) ${name}`, 'g'),
      `= no ${context.plural} remain $1 ${name}`,
    )
    .replace(/\b1 candidates\b/g, 'one candidate')
    .replace(/\b1 people\b/g, 'one person')
    .replace(/\b1 positions\b/g, 'one position')
    .replace(/\b0 candidates\b/g, 'no candidates')
    .replace(/\b0 people\b/g, 'no people')
    .replace(/\b0 positions\b/g, 'no positions')
    .replace(/(\d|\))\s*\/\s*(\d)/g, '$1 ÷ $2');
}

function remediateReviewQuestion(
  reviewQuestion: RnkCp001ProvisionalAuthorityReviewQuestion,
): RnkCp001ProvisionalAuthorityReviewQuestion {
  const question = reviewQuestion.question;
  return {
    ...reviewQuestion,
    question: {
      ...question,
      stem: polishLearnerText(question.stem, question),
      explanation: {
        keyRule: polishLearnerText(question.explanation.keyRule, question),
        stepByStepSolution: question.explanation.stepByStepSolution.map((step) =>
          polishLearnerText(step, question),
        ),
        examSpeedShortcut: polishLearnerText(
          question.explanation.examSpeedShortcut,
          question,
        ),
        optionAnalysis: question.explanation.optionAnalysis.map((line) =>
          polishLearnerText(line, question),
        ),
        conclusion: polishLearnerText(question.explanation.conclusion, question),
      },
    },
  };
}

export function generateRnkCp001EnglishReviewedAuthorityQuestion(
  authorityId: RnkCp001ProvisionalAuthorityId,
  seed: number,
): RnkCp001ProvisionalAuthorityReviewQuestion {
  return remediateReviewQuestion(generateHumanizedQuestion(authorityId, seed));
}

export function generateRnkCp001EnglishReviewedAuthoritySet(
  seed: number,
): readonly RnkCp001ProvisionalAuthorityReviewQuestion[] {
  return generateHumanizedSet(seed).map(remediateReviewQuestion);
}
