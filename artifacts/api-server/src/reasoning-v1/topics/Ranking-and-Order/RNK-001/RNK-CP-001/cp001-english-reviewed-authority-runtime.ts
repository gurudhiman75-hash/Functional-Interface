import {
  generateRnkCp001ProvisionalAuthorityReviewQuestion as generateRawReviewQuestion,
  generateRnkCp001ProvisionalAuthorityReviewSet as generateRawReviewSet,
  type RnkCp001ProvisionalAuthorityReviewQuestion,
} from './cp001-provisional-authority-runtime';
import type { RnkCp001ProvisionalAuthorityId } from './cp001-provisional-consolidation';

export type { RnkCp001ProvisionalAuthorityReviewQuestion } from './cp001-provisional-authority-runtime';

interface ReviewedContext {
  readonly group: string;
  readonly memberSingular: string;
  readonly memberPlural: string;
  readonly startPhrase: string;
  readonly endPhrase: string;
  readonly beforeRelation: string;
  readonly afterRelation: string;
}

const REVIEWED_CONTEXTS = {
  MERIT_LIST: {
    group: 'merit list',
    memberSingular: 'candidate',
    memberPlural: 'candidates',
    startPhrase: 'from the top',
    endPhrase: 'from the bottom',
    beforeRelation: 'ranked above',
    afterRelation: 'ranked below',
  },
  HORIZONTAL_ROW: {
    group: 'row',
    memberSingular: 'person',
    memberPlural: 'people',
    startPhrase: 'from the left',
    endPhrase: 'from the right',
    beforeRelation: 'standing to the left of',
    afterRelation: 'standing to the right of',
  },
  QUEUE: {
    group: 'queue',
    memberSingular: 'person',
    memberPlural: 'people',
    startPhrase: 'from the front',
    endPhrase: 'from the back',
    beforeRelation: 'standing ahead of',
    afterRelation: 'standing behind',
  },
} as const;

type ReviewedContextId = keyof typeof REVIEWED_CONTEXTS;
type UnderlyingQuestion = RnkCp001ProvisionalAuthorityReviewQuestion['question'];
type ReviewedExplanation = UnderlyingQuestion['explanation'];

function ordinal(value: number): string {
  const modulo100 = value % 100;
  if (modulo100 >= 11 && modulo100 <= 13) return `${value}th`;
  const modulo10 = value % 10;
  if (modulo10 === 1) return `${value}st`;
  if (modulo10 === 2) return `${value}nd`;
  if (modulo10 === 3) return `${value}rd`;
  return `${value}th`;
}

function choose(seed: number, values: readonly string[]): string {
  return values[Math.abs(seed) % values.length];
}

function contextFor(question: UnderlyingQuestion): ReviewedContext {
  return REVIEWED_CONTEXTS[question.contextId as ReviewedContextId];
}

function adaptContextNouns(text: string, question: UnderlyingQuestion): string {
  if (question.contextId !== 'MERIT_LIST') return text;

  return text
    .replace(/\bNo one\b/g, 'No candidate')
    .replace(/\bno one\b/g, 'no candidate')
    .replace(/\bOne person\b/g, 'One candidate')
    .replace(/\bone person\b/g, 'one candidate')
    .replace(/\bPeople\b/g, 'Candidates')
    .replace(/\bpeople\b/g, 'candidates')
    .replace(/\bPerson\b/g, 'Candidate')
    .replace(/\bperson\b/g, 'candidate');
}

function normalizeMath(text: string): string {
  return text.replace(/\s-\s/g, ' − ').replace(/\sx\s/g, ' × ');
}

function relationSentence(
  count: number,
  relation: string,
  name: string,
  context: ReviewedContext,
): string {
  if (count === 0) {
    return context.memberSingular === 'candidate'
      ? `No candidate is ${relation} ${name}.`
      : `No one is ${relation} ${name}.`;
  }
  if (count === 1) return `One ${context.memberSingular} is ${relation} ${name}.`;
  return `${count} ${context.memberPlural} are ${relation} ${name}.`;
}

function totalConclusion(total: number, context: ReviewedContext): string {
  return `The ${context.group} contains ${total} ${context.memberPlural}.`;
}

function rankConclusion(name: string, rank: number, phrase: string): string {
  return `${name} is ${ordinal(rank)} ${phrase}.`;
}

function humanizedExplanation(
  reviewQuestion: RnkCp001ProvisionalAuthorityReviewQuestion,
): ReviewedExplanation {
  const question = reviewQuestion.question;
  const evidence = question.displayedEvidence;
  const context = contextFor(question);
  const name = question.targetName;
  const answer = question.answer;
  const wordingSeed = reviewQuestion.seed * 17 + answer + name.length + question.contextId.length;

  let keyRule: string;
  let examSpeedShortcut: string;
  let conclusion: string;

  switch (evidence.kind) {
    case 'OPPOSITE_END_RANK': {
      const knownPhrase = evidence.knownSide === 'START' ? context.startPhrase : context.endPhrase;
      const askedPhrase = evidence.knownSide === 'START' ? context.endPhrase : context.startPhrase;
      keyRule = choose(wordingSeed, [
        `${name}'s opposite-end rank is ${evidence.total} − ${evidence.knownRank} + 1 = ${answer}. The +1 keeps ${name}'s position in both end-counts.`,
        `To change ${name}'s ${knownPhrase} rank into a rank ${askedPhrase}, use total − known rank + 1: ${evidence.total} − ${evidence.knownRank} + 1 = ${answer}.`,
        `The two end-ranks overlap at ${name}, so ${evidence.total} − ${evidence.knownRank} + 1 gives ${answer} ${askedPhrase}.`,
      ]);
      examSpeedShortcut = `Write ${evidence.total} − ${evidence.knownRank} + 1; ${answer} is the rank ${askedPhrase}.`;
      conclusion = rankConclusion(name, answer, askedPhrase);
      break;
    }
    case 'TOTAL_FROM_TWO_END_RANKS': {
      keyRule = choose(wordingSeed, [
        `${name} is included in both ranks, so add ${evidence.rankFromStart} and ${evidence.rankFromEnd}, then remove one duplicate: ${evidence.rankFromStart} + ${evidence.rankFromEnd} − 1 = ${answer}.`,
        `Both end-ranks meet at ${name}. Therefore, the total is ${evidence.rankFromStart} + ${evidence.rankFromEnd} − 1 = ${answer}.`,
        `Add the two inclusive ranks and count ${name} only once: ${evidence.rankFromStart} + ${evidence.rankFromEnd} − 1 = ${answer}.`,
      ]);
      examSpeedShortcut = `${evidence.rankFromStart} + ${evidence.rankFromEnd} − 1 = ${answer}; subtract one because ${name} appears in both ranks.`;
      conclusion = totalConclusion(answer, context);
      break;
    }
    case 'COUNT_BEFORE_FROM_RANK': {
      keyRule = choose(wordingSeed, [
        `${name}'s ${ordinal(evidence.rankFromStart)} rank ${context.startPhrase} already includes ${name}; ${evidence.rankFromStart} − 1 leaves ${answer} ${context.memberPlural} before that position.`,
        `A rank of ${evidence.rankFromStart} ${context.startPhrase} means ${evidence.rankFromStart} − 1 = ${answer} ${context.memberPlural} are ${context.beforeRelation} ${name}.`,
        `Remove ${name}'s own place from rank ${evidence.rankFromStart}: ${evidence.rankFromStart} − 1 = ${answer}.`,
      ]);
      examSpeedShortcut = `For the count ${context.beforeRelation} ${name}, reduce rank ${evidence.rankFromStart} by one: ${answer}.`;
      conclusion = relationSentence(answer, context.beforeRelation, name, context);
      break;
    }
    case 'COUNT_AFTER_FROM_END_RANK': {
      keyRule = choose(wordingSeed, [
        `${name}'s ${ordinal(evidence.rankFromEnd)} rank ${context.endPhrase} includes ${name}; ${evidence.rankFromEnd} − 1 = ${answer} ${context.memberPlural} remain on that side.`,
        `A rank of ${evidence.rankFromEnd} ${context.endPhrase} leaves ${evidence.rankFromEnd} − 1 = ${answer} ${context.memberPlural} ${context.afterRelation} ${name}.`,
        `Remove ${name}'s own place from the end-rank: ${evidence.rankFromEnd} − 1 = ${answer}.`,
      ]);
      examSpeedShortcut = `Convert the end-rank into an exclusive count by subtracting one: ${evidence.rankFromEnd} − 1 = ${answer}.`;
      conclusion = relationSentence(answer, context.afterRelation, name, context);
      break;
    }
    case 'COUNT_AFTER_FROM_TOTAL_AND_RANK': {
      keyRule = choose(wordingSeed, [
        `The first ${evidence.rankFromStart} positions, including ${name}, are already counted; ${evidence.total} − ${evidence.rankFromStart} = ${answer} remain ${context.afterRelation} ${name}.`,
        `Subtract ${name}'s start-rank from the total: ${evidence.total} − ${evidence.rankFromStart} = ${answer}.`,
        `After position ${evidence.rankFromStart}, the ${context.group} has ${evidence.total} − ${evidence.rankFromStart} = ${answer} positions left.`,
      ]);
      examSpeedShortcut = `Total minus start-rank gives the count after ${name}: ${evidence.total} − ${evidence.rankFromStart} = ${answer}.`;
      conclusion = relationSentence(answer, context.afterRelation, name, context);
      break;
    }
    case 'COUNT_BEFORE_FROM_TOTAL_END_RANK': {
      keyRule = choose(wordingSeed, [
        `The last ${evidence.rankFromEnd} positions, including ${name}, are accounted for; ${evidence.total} − ${evidence.rankFromEnd} = ${answer} lie before ${name}.`,
        `Subtract ${name}'s end-rank from the total: ${evidence.total} − ${evidence.rankFromEnd} = ${answer}.`,
        `Everything outside the final ${evidence.rankFromEnd} positions is ${context.beforeRelation} ${name}, so the count is ${answer}.`,
      ]);
      examSpeedShortcut = `Total minus end-rank gives the opposite-side count: ${evidence.total} − ${evidence.rankFromEnd} = ${answer}.`;
      conclusion = relationSentence(answer, context.beforeRelation, name, context);
      break;
    }
    case 'RANK_FROM_COUNT_BEFORE': {
      keyRule = choose(wordingSeed, [
        `${evidence.beforeCount} ${context.memberPlural} are ${context.beforeRelation} ${name}, so ${name} takes the next position: ${evidence.beforeCount} + 1 = ${answer}.`,
        `The rank is one more than the count before ${name}: ${evidence.beforeCount} + 1 = ${answer}.`,
        `Place ${name} immediately after the ${evidence.beforeCount} counted ${context.memberPlural}; the resulting rank is ${answer}.`,
      ]);
      examSpeedShortcut = `Count before + 1 gives ${name}'s rank: ${evidence.beforeCount} + 1 = ${answer}.`;
      conclusion = rankConclusion(name, answer, context.startPhrase);
      break;
    }
    case 'END_RANK_FROM_COUNT_AFTER': {
      keyRule = choose(wordingSeed, [
        `${evidence.afterCount} ${context.memberPlural} are ${context.afterRelation} ${name}, so ${name}'s end-rank is ${evidence.afterCount} + 1 = ${answer}.`,
        `The rank ${context.endPhrase} is one more than the count beyond ${name}: ${evidence.afterCount} + 1 = ${answer}.`,
        `Starting from the ${evidence.afterCount} positions after ${name}, include ${name} once to get end-rank ${answer}.`,
      ]);
      examSpeedShortcut = `Count after + 1 gives the end-rank: ${evidence.afterCount} + 1 = ${answer}.`;
      conclusion = rankConclusion(name, answer, context.endPhrase);
      break;
    }
    case 'RANK_FROM_COUNT_AFTER_AND_TOTAL': {
      keyRule = choose(wordingSeed, [
        `Remove the ${evidence.afterCount} ${context.memberPlural} ${context.afterRelation} ${name} from the total: ${evidence.total} − ${evidence.afterCount} = ${answer}, which is ${name}'s rank ${context.startPhrase}.`,
        `${name}'s start-rank includes everyone up to ${name}; ${evidence.total} − ${evidence.afterCount} = ${answer}.`,
        `Once the ${evidence.afterCount} positions after ${name} are removed, ${answer} positions remain through ${name}.`,
      ]);
      examSpeedShortcut = `Total minus the count after ${name}: ${evidence.total} − ${evidence.afterCount} = ${answer}.`;
      conclusion = rankConclusion(name, answer, context.startPhrase);
      break;
    }
    case 'END_RANK_FROM_COUNT_BEFORE_AND_TOTAL': {
      keyRule = choose(wordingSeed, [
        `Remove the ${evidence.beforeCount} ${context.memberPlural} ${context.beforeRelation} ${name} from the total: ${evidence.total} − ${evidence.beforeCount} = ${answer}, the rank ${context.endPhrase}.`,
        `${name}'s end-rank contains ${name} and everyone after that position; ${evidence.total} − ${evidence.beforeCount} = ${answer}.`,
        `After excluding the ${evidence.beforeCount} positions before ${name}, ${answer} positions remain from ${name} to the opposite end.`,
      ]);
      examSpeedShortcut = `Total minus the count before ${name}: ${evidence.total} − ${evidence.beforeCount} = ${answer}.`;
      conclusion = rankConclusion(name, answer, context.endPhrase);
      break;
    }
    case 'MIDDLE_RANK_FROM_TOTAL': {
      keyRule = choose(wordingSeed, [
        `${evidence.total} is odd, so there is one exact middle position: (${evidence.total} + 1) ÷ 2 = ${answer}.`,
        `An odd ${context.group} has the same number of positions on both sides of the middle; (${evidence.total} + 1) ÷ 2 = ${answer}.`,
        `Add one to the odd total and halve it: (${evidence.total} + 1) ÷ 2 = ${answer}, the unique middle rank.`,
      ]);
      examSpeedShortcut = `Odd total ${evidence.total}: add one and divide by two to get middle rank ${answer}.`;
      conclusion = rankConclusion(name, answer, context.startPhrase);
      break;
    }
    case 'TOTAL_FROM_MIDDLE_RANK': {
      keyRule = choose(wordingSeed, [
        `Middle rank ${evidence.middleRank} leaves ${evidence.middleRank - 1} positions on each side, so 2 × ${evidence.middleRank} − 1 = ${answer}.`,
        `Double the exact middle rank and remove the duplicated middle position: 2 × ${evidence.middleRank} − 1 = ${answer}.`,
        `${name} is ${ordinal(evidence.middleRank)} ${context.startPhrase} and exactly central; therefore the odd total is 2 × ${evidence.middleRank} − 1 = ${answer}.`,
      ]);
      examSpeedShortcut = `Double ${evidence.middleRank} and subtract one: ${answer} ${context.memberPlural}.`;
      conclusion = totalConclusion(answer, context);
      break;
    }
    case 'TOTAL_FROM_BEFORE_AFTER_COUNTS': {
      keyRule = choose(wordingSeed, [
        `Combine the ${evidence.beforeCount} before ${name}, ${name}'s own position, and the ${evidence.afterCount} after: ${evidence.beforeCount} + 1 + ${evidence.afterCount} = ${answer}.`,
        `The whole ${context.group} is before + ${name} + after: ${evidence.beforeCount} + 1 + ${evidence.afterCount} = ${answer}.`,
        `Both side-counts exclude ${name}, so add one target position: ${evidence.beforeCount} + ${evidence.afterCount} + 1 = ${answer}.`,
      ]);
      examSpeedShortcut = `Add both side-counts and one for ${name}: ${evidence.beforeCount} + ${evidence.afterCount} + 1 = ${answer}.`;
      conclusion = totalConclusion(answer, context);
      break;
    }
  }

  return {
    keyRule: adaptContextNouns(normalizeMath(keyRule), question),
    stepByStepSolution: question.explanation.stepByStepSolution.map((step) =>
      adaptContextNouns(normalizeMath(step), question),
    ),
    examSpeedShortcut: adaptContextNouns(normalizeMath(examSpeedShortcut), question),
    optionAnalysis: question.explanation.optionAnalysis.map((line) =>
      adaptContextNouns(normalizeMath(line), question),
    ),
    conclusion: adaptContextNouns(conclusion, question),
  };
}

function applyEnglishReview(
  reviewQuestion: RnkCp001ProvisionalAuthorityReviewQuestion,
): RnkCp001ProvisionalAuthorityReviewQuestion {
  const question = reviewQuestion.question;
  return {
    ...reviewQuestion,
    question: {
      ...question,
      stem: adaptContextNouns(question.stem, question),
      explanation: humanizedExplanation(reviewQuestion),
    },
  };
}

export function generateRnkCp001EnglishReviewedAuthorityQuestion(
  authorityId: RnkCp001ProvisionalAuthorityId,
  seed: number,
): RnkCp001ProvisionalAuthorityReviewQuestion {
  return applyEnglishReview(generateRawReviewQuestion(authorityId, seed));
}

export function generateRnkCp001EnglishReviewedAuthoritySet(
  seed: number,
): readonly RnkCp001ProvisionalAuthorityReviewQuestion[] {
  return generateRawReviewSet(seed).map(applyEnglishReview);
}
