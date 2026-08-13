import {
  generateRnkCp001SourceWaveQuestion as generateRawQuestion,
  RNK_CP001_SOURCE_WAVE_PROTOTYPE_IDS,
  solveRnkCp001SourceWaveCanonical,
  solveRnkCp001SourceWaveIndependently,
  type RnkCp001SourceWaveContextId,
  type RnkCp001SourceWaveDifficulty,
  type RnkCp001SourceWavePrototypeId,
  type RnkCp001SourceWaveQuestion,
} from './cp001-source-wave';

export {
  RNK_CP001_SOURCE_WAVE_PROTOTYPE_IDS,
  solveRnkCp001SourceWaveCanonical,
  solveRnkCp001SourceWaveIndependently,
};
export type {
  RnkCp001SourceWaveContextId,
  RnkCp001SourceWaveDifficulty,
  RnkCp001SourceWavePrototypeId,
  RnkCp001SourceWaveQuestion,
};

interface ReviewedContext {
  readonly group: string;
  readonly beforeRelation: string;
  readonly afterRelation: string;
}

const REVIEWED_CONTEXTS: Readonly<Record<RnkCp001SourceWaveContextId, ReviewedContext>> = {
  MERIT_LIST: {
    group: 'merit list',
    beforeRelation: 'ranked above',
    afterRelation: 'ranked below',
  },
  HORIZONTAL_ROW: {
    group: 'row',
    beforeRelation: 'standing to the left of',
    afterRelation: 'standing to the right of',
  },
  QUEUE: {
    group: 'queue',
    beforeRelation: 'standing ahead of',
    afterRelation: 'standing behind',
  },
};

function relationClause(count: number, relation: string, name: string): string {
  if (count === 0) return `No one is ${relation} ${name}`;
  if (count === 1) return `One person is ${relation} ${name}`;
  return `${count} people are ${relation} ${name}`;
}

function lowerInitial(text: string): string {
  if (text.length === 0) return text;
  return `${text[0].toLowerCase()}${text.slice(1)}`;
}

function stripInternalMisconceptionTag(line: string): string {
  return line.replace(/\s+\[[A-Z0-9_]+\]\s*$/, '');
}

function reviewedStem(question: RnkCp001SourceWaveQuestion): string {
  const evidence = question.displayedEvidence;
  if (evidence.kind !== 'TOTAL_FROM_BEFORE_AFTER_COUNTS') return question.stem;

  const context = REVIEWED_CONTEXTS[question.contextId];
  const beforeClause = relationClause(evidence.beforeCount, context.beforeRelation, question.targetName);
  const afterClause = relationClause(evidence.afterCount, context.afterRelation, question.targetName);

  return `In a ${context.group}, ${lowerInitial(beforeClause)}; ${lowerInitial(afterClause)}. How many people are there altogether?`;
}

function reviewedExplanation(question: RnkCp001SourceWaveQuestion): RnkCp001SourceWaveQuestion['explanation'] {
  const stepByStepSolution =
    question.displayedEvidence.kind === 'TOTAL_FROM_MIDDLE_RANK'
      ? question.explanation.stepByStepSolution.map((step) =>
          step.replace(' x ', ' × ').replace(' - 1', ' − 1'),
        )
      : question.explanation.stepByStepSolution;

  return {
    ...question.explanation,
    stepByStepSolution,
    optionAnalysis: question.explanation.optionAnalysis.map(stripInternalMisconceptionTag),
  };
}

export function generateRnkCp001SourceWaveReviewedQuestion(
  prototypeId: RnkCp001SourceWavePrototypeId,
  seed: number,
): RnkCp001SourceWaveQuestion {
  const question = generateRawQuestion(prototypeId, seed);
  return {
    ...question,
    stem: reviewedStem(question),
    explanation: reviewedExplanation(question),
  };
}
