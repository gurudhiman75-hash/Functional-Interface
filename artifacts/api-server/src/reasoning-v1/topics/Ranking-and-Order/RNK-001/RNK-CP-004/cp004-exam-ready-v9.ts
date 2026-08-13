import type { RnkCp004Query } from './cp004-foundation';
import {
  RNK_CP004_DEFINITELY_TRUE_AUTHORITY_ID,
  RNK_CP004_DIFFICULTY_MODEL_V2_ID,
  RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID,
  RNK_CP004_REMODEL_V6_PROTOTYPE_IDS,
  countTopologicalOrders,
  generateRnkCp004ExamReadyQuestion as generateV6Base,
  type RnkCp004ContextFamily,
  type RnkCp004ExamReadyQuestion,
  type RnkCp004RemodelV6PrototypeId,
} from './cp004-exam-ready-v8';

export {
  RNK_CP004_DEFINITELY_TRUE_AUTHORITY_ID,
  RNK_CP004_DIFFICULTY_MODEL_V2_ID,
  RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID,
  RNK_CP004_REMODEL_V6_PROTOTYPE_IDS,
  countTopologicalOrders,
};
export type { RnkCp004ExamReadyQuestion, RnkCp004RemodelV6PrototypeId };

type Phrase = (higher: string, lower: string) => string;

interface ContextConfig {
  readonly intro: (count: number) => string;
  readonly direct: readonly Phrase[];
  readonly reversed: readonly Phrase[];
}

const CONTEXT_CONFIG: Record<RnkCp004ContextFamily, ContextConfig> = {
  SELECTION_TEST: {
    intro: (count) => `${count} candidates received different ranks in a selection test.`,
    direct: [
      (higher, lower) => `${higher} secured a better rank than ${lower}.`,
      (higher, lower) => `${higher} was ranked above ${lower}.`,
      (higher, lower) => `${higher} was placed ahead of ${lower}.`,
      (higher, lower) => `${higher} obtained a higher position than ${lower}.`,
    ],
    reversed: [
      (higher, lower) => `${lower} secured a lower rank than ${higher}.`,
      (higher, lower) => `${lower} was ranked below ${higher}.`,
      (higher, lower) => `${lower} was placed after ${higher}.`,
      (higher, lower) => `${lower} obtained a lower position than ${higher}.`,
    ],
  },
  MERIT_LIST: {
    intro: (count) => `${count} candidates occupied different positions in a merit list.`,
    direct: [
      (higher, lower) => `${higher} appeared above ${lower} in the merit list.`,
      (higher, lower) => `${higher} held a better position than ${lower}.`,
      (higher, lower) => `${higher} was placed higher than ${lower}.`,
      (higher, lower) => `${higher} stood ahead of ${lower} in the merit order.`,
    ],
    reversed: [
      (higher, lower) => `${lower} appeared below ${higher} in the merit list.`,
      (higher, lower) => `${lower} held a lower position than ${higher}.`,
      (higher, lower) => `${lower} was placed below ${higher}.`,
      (higher, lower) => `${lower} stood behind ${higher} in the merit order.`,
    ],
  },
  COMPETITION_STANDINGS: {
    intro: (count) => `${count} participants finished at different positions in a competition.`,
    direct: [
      (higher, lower) => `${higher} finished ahead of ${lower}.`,
      (higher, lower) => `${higher} secured a better finishing position than ${lower}.`,
      (higher, lower) => `${higher} was placed above ${lower} in the final standings.`,
      (higher, lower) => `${higher} ended the competition before ${lower}.`,
    ],
    reversed: [
      (higher, lower) => `${lower} finished behind ${higher}.`,
      (higher, lower) => `${lower} secured a lower finishing position than ${higher}.`,
      (higher, lower) => `${lower} was placed below ${higher} in the final standings.`,
      (higher, lower) => `${lower} ended the competition after ${higher}.`,
    ],
  },
  PERFORMANCE_REVIEW: {
    intro: (count) => `${count} employees received distinct performance ranks.`,
    direct: [
      (higher, lower) => `${higher} was rated above ${lower}.`,
      (higher, lower) => `${higher} received a better performance rank than ${lower}.`,
      (higher, lower) => `${higher} was placed higher than ${lower} in the assessment.`,
      (higher, lower) => `${higher} achieved a stronger performance position than ${lower}.`,
    ],
    reversed: [
      (higher, lower) => `${lower} was rated below ${higher}.`,
      (higher, lower) => `${lower} received a lower performance rank than ${higher}.`,
      (higher, lower) => `${lower} was placed below ${higher} in the assessment.`,
      (higher, lower) => `${lower} achieved a weaker performance position than ${higher}.`,
    ],
  },
  INTERVIEW_SHORTLIST: {
    intro: (count) => `${count} applicants received different positions in an interview shortlist.`,
    direct: [
      (higher, lower) => `${higher} was placed above ${lower} in the shortlist.`,
      (higher, lower) => `${higher} received a better shortlist position than ${lower}.`,
      (higher, lower) => `${higher} ranked higher than ${lower} after the interview.`,
      (higher, lower) => `${higher} appeared before ${lower} in the final shortlist.`,
    ],
    reversed: [
      (higher, lower) => `${lower} was placed below ${higher} in the shortlist.`,
      (higher, lower) => `${lower} received a lower shortlist position than ${higher}.`,
      (higher, lower) => `${lower} ranked below ${higher} after the interview.`,
      (higher, lower) => `${lower} appeared after ${higher} in the final shortlist.`,
    ],
  },
  NEUTRAL_RANKING: {
    intro: (count) => `${count} people were ranked from highest to lowest, with no ties.`,
    direct: [
      (higher, lower) => `${higher} ranks above ${lower}.`,
      (higher, lower) => `${higher} is ranked higher than ${lower}.`,
      (higher, lower) => `${higher} holds a better position than ${lower}.`,
      (higher, lower) => `${higher} is placed before ${lower}.`,
    ],
    reversed: [
      (higher, lower) => `${lower} ranks below ${higher}.`,
      (higher, lower) => `${lower} is ranked lower than ${higher}.`,
      (higher, lower) => `${lower} holds a lower position than ${higher}.`,
      (higher, lower) => `${lower} is placed after ${higher}.`,
    ],
  },
};

function ordinal(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

function queryText(query: RnkCp004Query, prototypeId: RnkCp004RemodelV6PrototypeId): string {
  switch (query.kind) {
    case 'HIGHEST_ENTITY': return 'Who secured the highest rank?';
    case 'LOWEST_ENTITY': return 'Who was placed lowest?';
    case 'ENTITY_AT_EXACT_RANK': return `Who is ${ordinal(query.rankFromTop)} from the top?`;
    case 'RANK_OF_NAMED_ENTITY': return `What is ${query.target}'s rank from the top?`;
    case 'MIDDLE_ENTITY': return 'Who occupies the middle position?';
    case 'COMPLETE_ORDER': return 'Which option shows the complete order from highest to lowest?';
    case 'RELATIVE_ORDER_OF_PAIR':
      return prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID
        ? `Which option correctly gives the rank difference and direction between ${query.first} and ${query.second}?`
        : `Which statement correctly describes the relative position of ${query.first} and ${query.second}?`;
    case 'IMMEDIATE_NEIGHBOUR': return `Who is ranked immediately ${query.direction === 'ABOVE' ? 'above' : 'below'} ${query.target}?`;
    case 'VALID_RANK_STATEMENT': return 'Which of the following statements is definitely true?';
    case 'MISSING_COMPARISON': return 'Which additional information is sufficient to fix the complete order uniquely?';
  }
}

export function generateRnkCp004ExamReadyQuestion(
  prototypeId: RnkCp004RemodelV6PrototypeId,
  seed: number,
  correctIndexOverride?: number,
): RnkCp004ExamReadyQuestion {
  const base = generateV6Base(prototypeId, seed, correctIndexOverride);
  const family = base.reviewMetadata.languageProfile.contextFamily;
  const config = CONTEXT_CONFIG[family];
  const priorIds = base.reviewMetadata.languageProfile.clueTemplateIds;
  let directCursor = Math.abs(seed) % config.direct.length;
  let reversedCursor = Math.abs(seed + 1) % config.reversed.length;
  const templateIds: string[] = [];
  const rendered = base.displayedEvidence.clues.map((clue, index) => {
    const isReversed = priorIds[index]?.includes(':R') ?? false;
    const templateIndex = isReversed ? reversedCursor : directCursor;
    if (isReversed) reversedCursor = (reversedCursor + 1) % config.reversed.length;
    else directCursor = (directCursor + 1) % config.direct.length;
    templateIds.push(`${family}:${isReversed ? 'R' : 'D'}${templateIndex}`);
    return (isReversed ? config.reversed : config.direct)[templateIndex](clue.higher, clue.lower);
  });
  const counts = new Map<string, number>();
  for (const id of templateIds) counts.set(id, (counts.get(id) ?? 0) + 1);
  const maximumPhraseRepeat = Math.max(...counts.values());
  const stem = [
    config.intro(base.displayedEvidence.entities.length),
    '',
    ...rendered.map((clue) => `- ${clue}`),
    '',
    queryText(base.displayedEvidence.query, prototypeId),
  ].join('\n');

  return {
    ...base,
    stem,
    mathematicalFingerprint: `${base.mathematicalFingerprint}:V6_LANGUAGE_FIX_V1`,
    reviewMetadata: {
      ...base.reviewMetadata,
      languageProfile: {
        ...base.reviewMetadata.languageProfile,
        clueTemplateIds: templateIds,
        maximumPhraseRepeat,
      },
      normalizedSemanticFingerprint: `${base.reviewMetadata.normalizedSemanticFingerprint}|V6_LANGUAGE_FIX_V1`,
    },
  };
}
