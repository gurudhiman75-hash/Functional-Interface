import { RNK_CP003_CONTEXTS } from './cp003-model';
import {
  type RnkCp003SourcePrototypeId,
  type RnkCp003SourceQuestion,
} from './cp003-source-wave';
import { generateRnkCp003ReviewedSourceQuestion } from './cp003-source-wave-reviewed';

export function generateRnkCp003FinalSourceQuestion(
  prototypeId: RnkCp003SourcePrototypeId,
  seed: number,
): RnkCp003SourceQuestion {
  const question = generateRnkCp003ReviewedSourceQuestion(prototypeId, seed);
  if (!question.displayedEvidence.kind.includes('MEMBERSHIP_CHANGE')) return question;

  const context = RNK_CP003_CONTEXTS.find((candidate) => candidate.id === question.contextId);
  if (!context) throw new Error(`Unknown CP-003 context ${question.contextId}`);
  const startBoundary = context.startPhrase.replace('from the ', '');

  return {
    ...question,
    explanation: {
      ...question.explanation,
      examSpeedShortcut: `After each change, write two numbers: the total number of ${context.memberPlural} and the person's rank from the ${startBoundary}.`,
    },
  };
}
