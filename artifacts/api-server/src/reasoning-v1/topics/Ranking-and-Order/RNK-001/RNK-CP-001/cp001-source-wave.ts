export const RNK_CP001_SOURCE_WAVE_PROTOTYPE_IDS = [
  'RNK-CP001-PROT-MIDDLE-RANK-FROM-TOTAL',
  'RNK-CP001-PROT-TOTAL-FROM-MIDDLE-RANK',
  'RNK-CP001-PROT-TOTAL-FROM-BEFORE-AFTER-COUNTS',
  'RNK-CP001-PROT-COUNT-BEFORE-FROM-TOTAL-END-RANK',
  'RNK-CP001-PROT-COUNT-AFTER-FROM-END-RANK',
  'RNK-CP001-PROT-END-RANK-FROM-COUNT-AFTER',
] as const;

export type RnkCp001SourceWavePrototypeId =
  (typeof RNK_CP001_SOURCE_WAVE_PROTOTYPE_IDS)[number];
export type RnkCp001SourceWaveContextId = 'MERIT_LIST' | 'HORIZONTAL_ROW' | 'QUEUE';
export type RnkCp001SourceWaveDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type RnkCp001SourceWaveAnswerSemantic = 'RANK' | 'COUNT' | 'TOTAL';

export interface RnkCp001SourceWaveState {
  readonly total: number;
  readonly rankFromStart: number;
  readonly rankFromEnd: number;
  readonly beforeCount: number;
  readonly afterCount: number;
  readonly isExactMiddle: boolean;
}

export type RnkCp001SourceWaveEvidence =
  | {
      readonly kind: 'MIDDLE_RANK_FROM_TOTAL';
      readonly total: number;
    }
  | {
      readonly kind: 'TOTAL_FROM_MIDDLE_RANK';
      readonly middleRank: number;
    }
  | {
      readonly kind: 'TOTAL_FROM_BEFORE_AFTER_COUNTS';
      readonly beforeCount: number;
      readonly afterCount: number;
    }
  | {
      readonly kind: 'COUNT_BEFORE_FROM_TOTAL_END_RANK';
      readonly total: number;
      readonly rankFromEnd: number;
    }
  | {
      readonly kind: 'COUNT_AFTER_FROM_END_RANK';
      readonly rankFromEnd: number;
    }
  | {
      readonly kind: 'END_RANK_FROM_COUNT_AFTER';
      readonly afterCount: number;
    };

export interface RnkCp001SourceWaveOption {
  readonly value: number;
  readonly label: string;
  readonly misconceptionId: string;
  readonly explanation: string;
}

export interface RnkCp001SourceWaveQuestion {
  readonly packageId: 'RNK-001';
  readonly checkpointId: 'RNK-CP-001';
  readonly waveId: 'SOURCE_AND_INVERSE_GAP_WAVE';
  readonly prototypeId: RnkCp001SourceWavePrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: 'en-IN';
  readonly contextId: RnkCp001SourceWaveContextId;
  readonly targetName: string;
  readonly stem: string;
  readonly displayedEvidence: RnkCp001SourceWaveEvidence;
  readonly answerSemantic: RnkCp001SourceWaveAnswerSemantic;
  readonly answer: number;
  readonly options: readonly RnkCp001SourceWaveOption[];
  readonly correctIndex: number;
  readonly difficulty: RnkCp001SourceWaveDifficulty;
  readonly normalizedState: RnkCp001SourceWaveState;
  readonly explanation: {
    readonly keyRule: string;
    readonly stepByStepSolution: readonly string[];
    readonly examSpeedShortcut: string;
    readonly optionAnalysis: readonly string[];
    readonly conclusion: string;
  };
  readonly mathematicalFingerprint: string;
  readonly lifecycle: {
    readonly reviewStatus: 'UNREVIEWED';
    readonly questionStudioDiscoverable: false;
    readonly questionBankStatus: 'NOT_STORED';
    readonly testEligibility: 'INELIGIBLE';
    readonly publiclyPublishable: false;
  };
}

interface ContextVocabulary {
  readonly id: RnkCp001SourceWaveContextId;
  readonly group: string;
  readonly startPhrase: string;
  readonly endPhrase: string;
  readonly beforeRelation: string;
  readonly afterRelation: string;
  readonly middlePhrase: string;
}

const CONTEXTS: readonly ContextVocabulary[] = [
  {
    id: 'MERIT_LIST',
    group: 'merit list',
    startPhrase: 'from the top',
    endPhrase: 'from the bottom',
    beforeRelation: 'ranked above',
    afterRelation: 'ranked below',
    middlePhrase: 'exactly in the middle of the merit list',
  },
  {
    id: 'HORIZONTAL_ROW',
    group: 'row',
    startPhrase: 'from the left',
    endPhrase: 'from the right',
    beforeRelation: 'standing to the left of',
    afterRelation: 'standing to the right of',
    middlePhrase: 'at the exact middle position in the row',
  },
  {
    id: 'QUEUE',
    group: 'queue',
    startPhrase: 'from the front',
    endPhrase: 'from the back',
    beforeRelation: 'standing ahead of',
    afterRelation: 'standing behind',
    middlePhrase: 'at the exact middle position in the queue',
  },
] as const;

const NAMES = [
  'Aman',
  'Ananya',
  'Gurpreet',
  'Harleen',
  'Ishaan',
  'Jaspreet',
  'Karan',
  'Mehak',
  'Navdeep',
  'Pooja',
  'Riya',
  'Simran',
] as const;

function hashText(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(prototypeId: RnkCp001SourceWavePrototypeId, seed: number): () => number {
  let state = (hashText(`${prototypeId}:${seed}:source-wave`) || 0x9e3779b9) >>> 0;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x100000000;
  };
}

function randomInt(rng: () => number, minimum: number, maximum: number): number {
  if (!Number.isInteger(minimum) || !Number.isInteger(maximum) || maximum < minimum) {
    throw new Error(`Invalid integer range ${minimum}..${maximum}`);
  }
  return minimum + Math.floor(rng() * (maximum - minimum + 1));
}

function ordinal(value: number): string {
  const modulo100 = value % 100;
  if (modulo100 >= 11 && modulo100 <= 13) return `${value}th`;
  const modulo10 = value % 10;
  if (modulo10 === 1) return `${value}st`;
  if (modulo10 === 2) return `${value}nd`;
  if (modulo10 === 3) return `${value}rd`;
  return `${value}th`;
}

function relationClause(count: number, relation: string, name: string): string {
  if (count === 0) return `No one is ${relation} ${name}`;
  if (count === 1) return `One person is ${relation} ${name}`;
  return `${count} people are ${relation} ${name}`;
}

function buildGeneralState(rng: () => number, seed: number): RnkCp001SourceWaveState {
  const total = randomInt(rng, 8, 75);
  const selector = Math.abs(seed) % 12;
  let rankFromStart: number;

  if (selector === 0) rankFromStart = 1;
  else if (selector === 1) rankFromStart = total;
  else if (selector === 2) rankFromStart = 2;
  else if (selector === 3) rankFromStart = total - 1;
  else rankFromStart = randomInt(rng, 2, total - 1);

  const rankFromEnd = total - rankFromStart + 1;
  return {
    total,
    rankFromStart,
    rankFromEnd,
    beforeCount: rankFromStart - 1,
    afterCount: rankFromEnd - 1,
    isExactMiddle: rankFromStart === rankFromEnd,
  };
}

function buildMiddleState(rng: () => number): RnkCp001SourceWaveState {
  const total = 9 + 2 * randomInt(rng, 0, 33);
  const middleRank = (total + 1) / 2;
  return {
    total,
    rankFromStart: middleRank,
    rankFromEnd: middleRank,
    beforeCount: middleRank - 1,
    afterCount: middleRank - 1,
    isExactMiddle: true,
  };
}

function stateFor(
  prototypeId: RnkCp001SourceWavePrototypeId,
  rng: () => number,
  seed: number,
): RnkCp001SourceWaveState {
  if (
    prototypeId === 'RNK-CP001-PROT-MIDDLE-RANK-FROM-TOTAL' ||
    prototypeId === 'RNK-CP001-PROT-TOTAL-FROM-MIDDLE-RANK'
  ) {
    return buildMiddleState(rng);
  }
  return buildGeneralState(rng, seed);
}

function evidenceFor(
  prototypeId: RnkCp001SourceWavePrototypeId,
  state: RnkCp001SourceWaveState,
): RnkCp001SourceWaveEvidence {
  switch (prototypeId) {
    case 'RNK-CP001-PROT-MIDDLE-RANK-FROM-TOTAL':
      return { kind: 'MIDDLE_RANK_FROM_TOTAL', total: state.total };
    case 'RNK-CP001-PROT-TOTAL-FROM-MIDDLE-RANK':
      return { kind: 'TOTAL_FROM_MIDDLE_RANK', middleRank: state.rankFromStart };
    case 'RNK-CP001-PROT-TOTAL-FROM-BEFORE-AFTER-COUNTS':
      return {
        kind: 'TOTAL_FROM_BEFORE_AFTER_COUNTS',
        beforeCount: state.beforeCount,
        afterCount: state.afterCount,
      };
    case 'RNK-CP001-PROT-COUNT-BEFORE-FROM-TOTAL-END-RANK':
      return {
        kind: 'COUNT_BEFORE_FROM_TOTAL_END_RANK',
        total: state.total,
        rankFromEnd: state.rankFromEnd,
      };
    case 'RNK-CP001-PROT-COUNT-AFTER-FROM-END-RANK':
      return { kind: 'COUNT_AFTER_FROM_END_RANK', rankFromEnd: state.rankFromEnd };
    case 'RNK-CP001-PROT-END-RANK-FROM-COUNT-AFTER':
      return { kind: 'END_RANK_FROM_COUNT_AFTER', afterCount: state.afterCount };
  }
}

export function solveRnkCp001SourceWaveIndependently(
  evidence: RnkCp001SourceWaveEvidence,
): number {
  switch (evidence.kind) {
    case 'MIDDLE_RANK_FROM_TOTAL':
      if (evidence.total % 2 === 0) throw new Error('Exact middle requires an odd total');
      return (evidence.total + 1) / 2;
    case 'TOTAL_FROM_MIDDLE_RANK':
      return 2 * evidence.middleRank - 1;
    case 'TOTAL_FROM_BEFORE_AFTER_COUNTS':
      return evidence.beforeCount + evidence.afterCount + 1;
    case 'COUNT_BEFORE_FROM_TOTAL_END_RANK':
      return evidence.total - evidence.rankFromEnd;
    case 'COUNT_AFTER_FROM_END_RANK':
      return evidence.rankFromEnd - 1;
    case 'END_RANK_FROM_COUNT_AFTER':
      return evidence.afterCount + 1;
  }
}

export function solveRnkCp001SourceWaveCanonical(
  prototypeId: RnkCp001SourceWavePrototypeId,
  state: RnkCp001SourceWaveState,
): number {
  switch (prototypeId) {
    case 'RNK-CP001-PROT-MIDDLE-RANK-FROM-TOTAL':
      return state.rankFromStart;
    case 'RNK-CP001-PROT-TOTAL-FROM-MIDDLE-RANK':
    case 'RNK-CP001-PROT-TOTAL-FROM-BEFORE-AFTER-COUNTS':
      return state.total;
    case 'RNK-CP001-PROT-COUNT-BEFORE-FROM-TOTAL-END-RANK':
      return state.beforeCount;
    case 'RNK-CP001-PROT-COUNT-AFTER-FROM-END-RANK':
      return state.afterCount;
    case 'RNK-CP001-PROT-END-RANK-FROM-COUNT-AFTER':
      return state.rankFromEnd;
  }
}

function answerSemanticFor(
  prototypeId: RnkCp001SourceWavePrototypeId,
): RnkCp001SourceWaveAnswerSemantic {
  if (
    prototypeId === 'RNK-CP001-PROT-TOTAL-FROM-MIDDLE-RANK' ||
    prototypeId === 'RNK-CP001-PROT-TOTAL-FROM-BEFORE-AFTER-COUNTS'
  ) {
    return 'TOTAL';
  }
  if (
    prototypeId === 'RNK-CP001-PROT-COUNT-BEFORE-FROM-TOTAL-END-RANK' ||
    prototypeId === 'RNK-CP001-PROT-COUNT-AFTER-FROM-END-RANK'
  ) {
    return 'COUNT';
  }
  return 'RANK';
}

function stemFor(
  prototypeId: RnkCp001SourceWavePrototypeId,
  evidence: RnkCp001SourceWaveEvidence,
  context: ContextVocabulary,
  name: string,
): string {
  switch (prototypeId) {
    case 'RNK-CP001-PROT-MIDDLE-RANK-FROM-TOTAL':
      if (evidence.kind !== 'MIDDLE_RANK_FROM_TOTAL') throw new Error('Evidence mismatch');
      return `There are ${evidence.total} people in a ${context.group}. ${name} is ${context.middlePhrase}. What is ${name}'s rank ${context.startPhrase}?`;
    case 'RNK-CP001-PROT-TOTAL-FROM-MIDDLE-RANK':
      if (evidence.kind !== 'TOTAL_FROM_MIDDLE_RANK') throw new Error('Evidence mismatch');
      return `${name} is ${context.middlePhrase} and ranks ${ordinal(evidence.middleRank)} ${context.startPhrase}. How many people are in the ${context.group}?`;
    case 'RNK-CP001-PROT-TOTAL-FROM-BEFORE-AFTER-COUNTS':
      if (evidence.kind !== 'TOTAL_FROM_BEFORE_AFTER_COUNTS') throw new Error('Evidence mismatch');
      return `In a ${context.group}, ${relationClause(evidence.beforeCount, context.beforeRelation, name)}; ${relationClause(evidence.afterCount, context.afterRelation, name).toLowerCase()}. How many people are there altogether?`;
    case 'RNK-CP001-PROT-COUNT-BEFORE-FROM-TOTAL-END-RANK':
      if (evidence.kind !== 'COUNT_BEFORE_FROM_TOTAL_END_RANK') throw new Error('Evidence mismatch');
      return `A ${context.group} has ${evidence.total} people. ${name} is ${ordinal(evidence.rankFromEnd)} ${context.endPhrase}. How many people are ${context.beforeRelation} ${name}?`;
    case 'RNK-CP001-PROT-COUNT-AFTER-FROM-END-RANK':
      if (evidence.kind !== 'COUNT_AFTER_FROM_END_RANK') throw new Error('Evidence mismatch');
      return `${name} is ${ordinal(evidence.rankFromEnd)} ${context.endPhrase}. How many people are ${context.afterRelation} ${name}?`;
    case 'RNK-CP001-PROT-END-RANK-FROM-COUNT-AFTER':
      if (evidence.kind !== 'END_RANK_FROM_COUNT_AFTER') throw new Error('Evidence mismatch');
      return `${relationClause(evidence.afterCount, context.afterRelation, name)}. What is ${name}'s rank ${context.endPhrase}?`;
  }
}

function misconceptionCandidates(
  prototypeId: RnkCp001SourceWavePrototypeId,
  evidence: RnkCp001SourceWaveEvidence,
): Array<{ value: number; id: string; explanation: string }> {
  switch (prototypeId) {
    case 'RNK-CP001-PROT-MIDDLE-RANK-FROM-TOTAL':
      if (evidence.kind !== 'MIDDLE_RANK_FROM_TOTAL') throw new Error('Evidence mismatch');
      return [
        {
          value: Math.floor(evidence.total / 2),
          id: 'OMITTED_MIDDLE_PERSON',
          explanation: 'This halves the remaining places but does not include the middle person.',
        },
        {
          value: Math.floor(evidence.total / 2) + 2,
          id: 'ADDED_MIDDLE_PERSON_TWICE',
          explanation: 'This moves one position beyond the unique middle rank.',
        },
        {
          value: evidence.total - 1,
          id: 'CONFUSED_MIDDLE_WITH_NEAR_END',
          explanation: 'This selects a position near the end instead of dividing the order around one centre.',
        },
      ];
    case 'RNK-CP001-PROT-TOTAL-FROM-MIDDLE-RANK':
      if (evidence.kind !== 'TOTAL_FROM_MIDDLE_RANK') throw new Error('Evidence mismatch');
      return [
        {
          value: 2 * evidence.middleRank,
          id: 'COUNTED_MIDDLE_TWICE',
          explanation: 'This doubles the middle rank and counts the middle person once on each side.',
        },
        {
          value: 2 * evidence.middleRank - 2,
          id: 'REMOVED_MIDDLE_TWICE',
          explanation: 'This subtracts two positions although only one duplicated middle person must be removed.',
        },
        {
          value: 2 * evidence.middleRank + 1,
          id: 'ADDED_EXTRA_PAIR',
          explanation: 'This adds an unnecessary extra pair around the stated middle rank.',
        },
      ];
    case 'RNK-CP001-PROT-TOTAL-FROM-BEFORE-AFTER-COUNTS':
      if (evidence.kind !== 'TOTAL_FROM_BEFORE_AFTER_COUNTS') throw new Error('Evidence mismatch');
      return [
        {
          value: evidence.beforeCount + evidence.afterCount,
          id: 'OMITTED_TARGET_PERSON',
          explanation: 'This adds the people on both sides but leaves out the target person.',
        },
        {
          value: evidence.beforeCount + evidence.afterCount + 2,
          id: 'COUNTED_TARGET_TWICE',
          explanation: 'This adds two central positions although only one target person exists.',
        },
        {
          value: Math.abs(evidence.beforeCount - evidence.afterCount) + 1,
          id: 'USED_SIDE_DIFFERENCE',
          explanation: 'This uses the difference between the side counts instead of combining the whole order.',
        },
      ];
    case 'RNK-CP001-PROT-COUNT-BEFORE-FROM-TOTAL-END-RANK':
      if (evidence.kind !== 'COUNT_BEFORE_FROM_TOTAL_END_RANK') throw new Error('Evidence mismatch');
      return [
        {
          value: evidence.total - evidence.rankFromEnd + 1,
          id: 'COUNTED_TARGET_AS_BEFORE',
          explanation: 'This includes the target person among those before them.',
        },
        {
          value: evidence.total - evidence.rankFromEnd - 1,
          id: 'REMOVED_ONE_TWICE',
          explanation: 'This removes one extra place after the end-rank has already included the target.',
        },
        {
          value: evidence.rankFromEnd - 1,
          id: 'COUNTED_AFTER_INSTEAD_OF_BEFORE',
          explanation: 'This gives the count after the target, not the count before the target.',
        },
      ];
    case 'RNK-CP001-PROT-COUNT-AFTER-FROM-END-RANK':
      if (evidence.kind !== 'COUNT_AFTER_FROM_END_RANK') throw new Error('Evidence mismatch');
      return [
        {
          value: evidence.rankFromEnd,
          id: 'COUNTED_TARGET_AS_AFTER',
          explanation: 'This reports the end-rank itself and includes the target among the people after them.',
        },
        {
          value: evidence.rankFromEnd + 1,
          id: 'ADDED_INSTEAD_OF_SUBTRACTED',
          explanation: 'This moves away from the required count by adding one.',
        },
        {
          value: Math.max(0, evidence.rankFromEnd - 2),
          id: 'SUBTRACTED_ONE_TWICE',
          explanation: 'This removes two places even though only the target position must be removed.',
        },
      ];
    case 'RNK-CP001-PROT-END-RANK-FROM-COUNT-AFTER':
      if (evidence.kind !== 'END_RANK_FROM_COUNT_AFTER') throw new Error('Evidence mismatch');
      return [
        {
          value: evidence.afterCount,
          id: 'OMITTED_TARGET_POSITION',
          explanation: 'This reports only the people after the target and omits the target position.',
        },
        {
          value: evidence.afterCount + 2,
          id: 'ADDED_TARGET_TWICE',
          explanation: 'This adds two positions although the target occupies only the next position.',
        },
        {
          value: Math.max(1, evidence.afterCount - 1),
          id: 'MOVED_IN_WRONG_DIRECTION',
          explanation: 'This reduces the after-count instead of moving to the target rank.',
        },
      ];
  }
}

function minimumAllowed(semantic: RnkCp001SourceWaveAnswerSemantic): number {
  return semantic === 'COUNT' ? 0 : 1;
}

function buildOptions(
  prototypeId: RnkCp001SourceWavePrototypeId,
  evidence: RnkCp001SourceWaveEvidence,
  answer: number,
  answerSemantic: RnkCp001SourceWaveAnswerSemantic,
  correctIndex: number,
): readonly RnkCp001SourceWaveOption[] {
  const minimum = minimumAllowed(answerSemantic);
  const used = new Set<number>([answer]);
  const wrong: RnkCp001SourceWaveOption[] = [];

  for (const candidate of misconceptionCandidates(prototypeId, evidence)) {
    if (!Number.isInteger(candidate.value) || candidate.value < minimum || used.has(candidate.value)) continue;
    used.add(candidate.value);
    wrong.push({
      value: candidate.value,
      label: String(candidate.value),
      misconceptionId: candidate.id,
      explanation: candidate.explanation,
    });
  }

  let distance = 1;
  while (wrong.length < 3) {
    for (const value of [answer - distance, answer + distance]) {
      if (wrong.length >= 3) break;
      if (value < minimum || used.has(value)) continue;
      used.add(value);
      wrong.push({
        value,
        label: String(value),
        misconceptionId: 'NEARBY_ARITHMETIC_MISS',
        explanation: `This nearby value does not satisfy the displayed rank equation; the exact result is ${answer}.`,
      });
    }
    distance += 1;
  }

  const options: RnkCp001SourceWaveOption[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      options.push({
        value: answer,
        label: String(answer),
        misconceptionId: 'CORRECT',
        explanation: 'This value satisfies the displayed rank equation exactly.',
      });
    } else {
      options.push(wrong[wrongIndex]);
      wrongIndex += 1;
    }
  }
  return options;
}

function calculationFor(evidence: RnkCp001SourceWaveEvidence): {
  readonly keyRule: string;
  readonly steps: readonly string[];
  readonly shortcut: string;
} {
  switch (evidence.kind) {
    case 'MIDDLE_RANK_FROM_TOTAL':
      return {
        keyRule: 'For one exact middle position, the total must be odd and middle rank = (total + 1) ÷ 2.',
        steps: [
          `Total people = ${evidence.total}, which is odd.`,
          `Middle rank = (${evidence.total} + 1) / 2.`,
          `Therefore, middle rank = ${(evidence.total + 1) / 2}.`,
        ],
        shortcut: 'For an odd total, add 1 and halve; that immediately gives the unique middle rank.',
      };
    case 'TOTAL_FROM_MIDDLE_RANK':
      return {
        keyRule: 'If one person is exactly in the middle, total people = 2 × middle rank − 1.',
        steps: [
          `Middle rank = ${evidence.middleRank}.`,
          `Total = 2 x ${evidence.middleRank} - 1.`,
          `Therefore, total people = ${2 * evidence.middleRank - 1}.`,
        ],
        shortcut: 'Double the stated middle rank and subtract 1 for the person counted on both sides.',
      };
    case 'TOTAL_FROM_BEFORE_AFTER_COUNTS':
      return {
        keyRule: 'Total people = people before + the target person + people after.',
        steps: [
          `People before = ${evidence.beforeCount}; people after = ${evidence.afterCount}.`,
          `Total = ${evidence.beforeCount} + 1 + ${evidence.afterCount}.`,
          `Therefore, total people = ${evidence.beforeCount + evidence.afterCount + 1}.`,
        ],
        shortcut: 'Add both side counts and then add 1 for the target person.',
      };
    case 'COUNT_BEFORE_FROM_TOTAL_END_RANK':
      return {
        keyRule: 'People before = total people − rank from the end.',
        steps: [
          `Total people = ${evidence.total}; rank from the end = ${evidence.rankFromEnd}.`,
          `People before = ${evidence.total} - ${evidence.rankFromEnd}.`,
          `Therefore, people before = ${evidence.total - evidence.rankFromEnd}.`,
        ],
        shortcut: 'Subtract the end-rank directly from the total; the target is already included in the end-rank.',
      };
    case 'COUNT_AFTER_FROM_END_RANK':
      return {
        keyRule: 'People after = rank from the end − 1, because the end-rank includes the target person.',
        steps: [
          `Rank from the end = ${evidence.rankFromEnd}.`,
          `People after = ${evidence.rankFromEnd} - 1.`,
          `Therefore, people after = ${evidence.rankFromEnd - 1}.`,
        ],
        shortcut: 'Convert an end-rank into the count after it by subtracting 1.',
      };
    case 'END_RANK_FROM_COUNT_AFTER':
      return {
        keyRule: 'Rank from the end = people after + 1, because the target occupies the next position.',
        steps: [
          `People after = ${evidence.afterCount}.`,
          `Rank from the end = ${evidence.afterCount} + 1.`,
          `Therefore, rank from the end = ${evidence.afterCount + 1}.`,
        ],
        shortcut: 'The target comes immediately before everyone counted after them, so add 1.',
      };
  }
}

function difficultyFor(
  prototypeId: RnkCp001SourceWavePrototypeId,
  state: RnkCp001SourceWaveState,
  context: ContextVocabulary,
): RnkCp001SourceWaveDifficulty {
  let score = 0;
  if (state.total >= 30) score += 1;
  if (state.total >= 55) score += 1;
  if (context.id !== 'MERIT_LIST') score += 1;
  if (
    prototypeId === 'RNK-CP001-PROT-TOTAL-FROM-MIDDLE-RANK' ||
    prototypeId === 'RNK-CP001-PROT-TOTAL-FROM-BEFORE-AFTER-COUNTS' ||
    prototypeId === 'RNK-CP001-PROT-COUNT-BEFORE-FROM-TOTAL-END-RANK'
  ) {
    score += 1;
  }
  if (score <= 1) return 'EASY';
  if (score <= 3) return 'MEDIUM';
  return 'HARD';
}

function fingerprintFor(evidence: RnkCp001SourceWaveEvidence): string {
  switch (evidence.kind) {
    case 'MIDDLE_RANK_FROM_TOTAL':
      return `${evidence.kind}|total=${evidence.total}`;
    case 'TOTAL_FROM_MIDDLE_RANK':
      return `${evidence.kind}|middle=${evidence.middleRank}`;
    case 'TOTAL_FROM_BEFORE_AFTER_COUNTS':
      return `${evidence.kind}|before=${evidence.beforeCount}|after=${evidence.afterCount}`;
    case 'COUNT_BEFORE_FROM_TOTAL_END_RANK':
      return `${evidence.kind}|total=${evidence.total}|end=${evidence.rankFromEnd}`;
    case 'COUNT_AFTER_FROM_END_RANK':
      return `${evidence.kind}|end=${evidence.rankFromEnd}`;
    case 'END_RANK_FROM_COUNT_AFTER':
      return `${evidence.kind}|after=${evidence.afterCount}`;
  }
}

export function generateRnkCp001SourceWaveQuestion(
  prototypeId: RnkCp001SourceWavePrototypeId,
  seed: number,
): RnkCp001SourceWaveQuestion {
  if (!RNK_CP001_SOURCE_WAVE_PROTOTYPE_IDS.includes(prototypeId)) {
    throw new Error(`Unknown RNK CP-001 source-wave prototype: ${prototypeId}`);
  }
  if (!Number.isInteger(seed)) throw new Error(`Seed must be an integer: ${seed}`);

  const rng = createRng(prototypeId, seed);
  const context = CONTEXTS[randomInt(rng, 0, CONTEXTS.length - 1)];
  const targetName = NAMES[randomInt(rng, 0, NAMES.length - 1)];
  const state = stateFor(prototypeId, rng, seed);
  const evidence = evidenceFor(prototypeId, state);
  const answer = solveRnkCp001SourceWaveCanonical(prototypeId, state);
  const independentlySolved = solveRnkCp001SourceWaveIndependently(evidence);
  if (answer !== independentlySolved) {
    throw new Error(`${prototypeId} seed ${seed}: canonical and independent solvers disagree`);
  }

  const answerSemantic = answerSemanticFor(prototypeId);
  const prototypeIndex = RNK_CP001_SOURCE_WAVE_PROTOTYPE_IDS.indexOf(prototypeId);
  const correctIndex = (Math.abs(seed) + prototypeIndex) % 4;
  const options = buildOptions(prototypeId, evidence, answer, answerSemantic, correctIndex);
  const calculation = calculationFor(evidence);

  return {
    packageId: 'RNK-001',
    checkpointId: 'RNK-CP-001',
    waveId: 'SOURCE_AND_INVERSE_GAP_WAVE',
    prototypeId,
    permanentQlId: null,
    seed,
    locale: 'en-IN',
    contextId: context.id,
    targetName,
    stem: stemFor(prototypeId, evidence, context, targetName),
    displayedEvidence: evidence,
    answerSemantic,
    answer,
    options,
    correctIndex,
    difficulty: difficultyFor(prototypeId, state, context),
    normalizedState: state,
    explanation: {
      keyRule: calculation.keyRule,
      stepByStepSolution: calculation.steps,
      examSpeedShortcut: calculation.shortcut,
      optionAnalysis: options.map(
        (option, index) =>
          `Option ${index + 1} (${option.label}): ${option.explanation} [${option.misconceptionId}]`,
      ),
      conclusion: `The correct answer is ${answer}.`,
    },
    mathematicalFingerprint: fingerprintFor(evidence),
    lifecycle: {
      reviewStatus: 'UNREVIEWED',
      questionStudioDiscoverable: false,
      questionBankStatus: 'NOT_STORED',
      testEligibility: 'INELIGIBLE',
      publiclyPublishable: false,
    },
  };
}
