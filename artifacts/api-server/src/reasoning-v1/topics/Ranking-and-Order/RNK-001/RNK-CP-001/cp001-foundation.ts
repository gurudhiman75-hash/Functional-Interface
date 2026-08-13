export const RNK_CP001_PROTOTYPE_IDS = [
  'RNK-CP001-PROT-OPPOSITE-END-RANK',
  'RNK-CP001-PROT-TOTAL-FROM-TWO-END-RANKS',
  'RNK-CP001-PROT-COUNT-BEFORE-FROM-RANK',
  'RNK-CP001-PROT-COUNT-AFTER-FROM-TOTAL-AND-RANK',
  'RNK-CP001-PROT-RANK-FROM-COUNT-BEFORE',
  'RNK-CP001-PROT-RANK-FROM-COUNT-AFTER-AND-TOTAL',
] as const;

export type RnkCp001PrototypeId = (typeof RNK_CP001_PROTOTYPE_IDS)[number];
export type RnkContextId = 'MERIT_LIST' | 'HORIZONTAL_ROW' | 'QUEUE';
export type RnkDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type RnkAnswerSemantic = 'RANK' | 'COUNT' | 'TOTAL';

export interface RnkNormalizedState {
  readonly total: number;
  readonly rankFromStart: number;
  readonly rankFromEnd: number;
  readonly beforeCount: number;
  readonly afterCount: number;
}

export type RnkDisplayedEvidence =
  | {
      readonly kind: 'OPPOSITE_END_RANK';
      readonly total: number;
      readonly knownSide: 'START' | 'END';
      readonly knownRank: number;
    }
  | {
      readonly kind: 'TOTAL_FROM_TWO_END_RANKS';
      readonly rankFromStart: number;
      readonly rankFromEnd: number;
    }
  | {
      readonly kind: 'COUNT_BEFORE_FROM_RANK';
      readonly rankFromStart: number;
    }
  | {
      readonly kind: 'COUNT_AFTER_FROM_TOTAL_AND_RANK';
      readonly total: number;
      readonly rankFromStart: number;
    }
  | {
      readonly kind: 'RANK_FROM_COUNT_BEFORE';
      readonly beforeCount: number;
    }
  | {
      readonly kind: 'RANK_FROM_COUNT_AFTER_AND_TOTAL';
      readonly total: number;
      readonly afterCount: number;
    };

export interface RnkOption {
  readonly value: number;
  readonly label: string;
  readonly misconceptionId: string;
  readonly explanation: string;
}

export interface RnkCp001Question {
  readonly packageId: 'RNK-001';
  readonly checkpointId: 'RNK-CP-001';
  readonly prototypeId: RnkCp001PrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: 'en-IN';
  readonly contextId: RnkContextId;
  readonly targetName: string;
  readonly stem: string;
  readonly displayedEvidence: RnkDisplayedEvidence;
  readonly answerSemantic: RnkAnswerSemantic;
  readonly answer: number;
  readonly options: readonly RnkOption[];
  readonly correctIndex: number;
  readonly difficulty: RnkDifficulty;
  readonly normalizedState: RnkNormalizedState;
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
  readonly id: RnkContextId;
  readonly group: string;
  readonly startPhrase: string;
  readonly endPhrase: string;
  readonly beforeRelation: string;
  readonly afterRelation: string;
}

const CONTEXTS: readonly ContextVocabulary[] = [
  {
    id: 'MERIT_LIST',
    group: 'merit list',
    startPhrase: 'from the top',
    endPhrase: 'from the bottom',
    beforeRelation: 'ranked above',
    afterRelation: 'ranked below',
  },
  {
    id: 'HORIZONTAL_ROW',
    group: 'row',
    startPhrase: 'from the left',
    endPhrase: 'from the right',
    beforeRelation: 'standing to the left of',
    afterRelation: 'standing to the right of',
  },
  {
    id: 'QUEUE',
    group: 'queue',
    startPhrase: 'from the front',
    endPhrase: 'from the back',
    beforeRelation: 'standing ahead of',
    afterRelation: 'standing behind',
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

function createRng(prototypeId: RnkCp001PrototypeId, seed: number): () => number {
  let state = (hashText(`${prototypeId}:${seed}`) || 0x9e3779b9) >>> 0;
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

function buildNormalizedState(rng: () => number, seed: number): RnkNormalizedState {
  const total = randomInt(rng, 8, 60);
  const boundarySelector = Math.abs(seed) % 10;
  let rankFromStart: number;

  if (boundarySelector === 0) {
    rankFromStart = 1;
  } else if (boundarySelector === 1) {
    rankFromStart = total;
  } else if (boundarySelector === 2) {
    rankFromStart = 2;
  } else if (boundarySelector === 3) {
    rankFromStart = total - 1;
  } else {
    rankFromStart = randomInt(rng, 2, total - 1);
  }

  return {
    total,
    rankFromStart,
    rankFromEnd: total - rankFromStart + 1,
    beforeCount: rankFromStart - 1,
    afterCount: total - rankFromStart,
  };
}

function evidenceFor(
  prototypeId: RnkCp001PrototypeId,
  state: RnkNormalizedState,
  rng: () => number,
): RnkDisplayedEvidence {
  switch (prototypeId) {
    case 'RNK-CP001-PROT-OPPOSITE-END-RANK': {
      const knownSide = rng() < 0.5 ? 'START' : 'END';
      return {
        kind: 'OPPOSITE_END_RANK',
        total: state.total,
        knownSide,
        knownRank: knownSide === 'START' ? state.rankFromStart : state.rankFromEnd,
      };
    }
    case 'RNK-CP001-PROT-TOTAL-FROM-TWO-END-RANKS':
      return {
        kind: 'TOTAL_FROM_TWO_END_RANKS',
        rankFromStart: state.rankFromStart,
        rankFromEnd: state.rankFromEnd,
      };
    case 'RNK-CP001-PROT-COUNT-BEFORE-FROM-RANK':
      return { kind: 'COUNT_BEFORE_FROM_RANK', rankFromStart: state.rankFromStart };
    case 'RNK-CP001-PROT-COUNT-AFTER-FROM-TOTAL-AND-RANK':
      return {
        kind: 'COUNT_AFTER_FROM_TOTAL_AND_RANK',
        total: state.total,
        rankFromStart: state.rankFromStart,
      };
    case 'RNK-CP001-PROT-RANK-FROM-COUNT-BEFORE':
      return { kind: 'RANK_FROM_COUNT_BEFORE', beforeCount: state.beforeCount };
    case 'RNK-CP001-PROT-RANK-FROM-COUNT-AFTER-AND-TOTAL':
      return {
        kind: 'RANK_FROM_COUNT_AFTER_AND_TOTAL',
        total: state.total,
        afterCount: state.afterCount,
      };
  }
}

export function solveCp001Independently(evidence: RnkDisplayedEvidence): number {
  switch (evidence.kind) {
    case 'OPPOSITE_END_RANK':
      return evidence.total - evidence.knownRank + 1;
    case 'TOTAL_FROM_TWO_END_RANKS':
      return evidence.rankFromStart + evidence.rankFromEnd - 1;
    case 'COUNT_BEFORE_FROM_RANK':
      return evidence.rankFromStart - 1;
    case 'COUNT_AFTER_FROM_TOTAL_AND_RANK':
      return evidence.total - evidence.rankFromStart;
    case 'RANK_FROM_COUNT_BEFORE':
      return evidence.beforeCount + 1;
    case 'RANK_FROM_COUNT_AFTER_AND_TOTAL':
      return evidence.total - evidence.afterCount;
  }
}

function answerSemanticFor(prototypeId: RnkCp001PrototypeId): RnkAnswerSemantic {
  if (prototypeId === 'RNK-CP001-PROT-TOTAL-FROM-TWO-END-RANKS') return 'TOTAL';
  if (
    prototypeId === 'RNK-CP001-PROT-COUNT-BEFORE-FROM-RANK' ||
    prototypeId === 'RNK-CP001-PROT-COUNT-AFTER-FROM-TOTAL-AND-RANK'
  ) {
    return 'COUNT';
  }
  return 'RANK';
}

export function solveCp001Canonical(
  prototypeId: RnkCp001PrototypeId,
  state: RnkNormalizedState,
  evidence: RnkDisplayedEvidence,
): number {
  switch (prototypeId) {
    case 'RNK-CP001-PROT-OPPOSITE-END-RANK':
      if (evidence.kind !== 'OPPOSITE_END_RANK') throw new Error('Evidence mismatch');
      return evidence.knownSide === 'START' ? state.rankFromEnd : state.rankFromStart;
    case 'RNK-CP001-PROT-TOTAL-FROM-TWO-END-RANKS':
      return state.total;
    case 'RNK-CP001-PROT-COUNT-BEFORE-FROM-RANK':
      return state.beforeCount;
    case 'RNK-CP001-PROT-COUNT-AFTER-FROM-TOTAL-AND-RANK':
      return state.afterCount;
    case 'RNK-CP001-PROT-RANK-FROM-COUNT-BEFORE':
    case 'RNK-CP001-PROT-RANK-FROM-COUNT-AFTER-AND-TOTAL':
      return state.rankFromStart;
  }
}

function stemFor(
  prototypeId: RnkCp001PrototypeId,
  evidence: RnkDisplayedEvidence,
  context: ContextVocabulary,
  name: string,
): string {
  switch (prototypeId) {
    case 'RNK-CP001-PROT-OPPOSITE-END-RANK': {
      if (evidence.kind !== 'OPPOSITE_END_RANK') throw new Error('Evidence mismatch');
      const knownPhrase = evidence.knownSide === 'START' ? context.startPhrase : context.endPhrase;
      const askedPhrase = evidence.knownSide === 'START' ? context.endPhrase : context.startPhrase;
      return `${name} is ${ordinal(evidence.knownRank)} ${knownPhrase} in a ${context.group} of ${evidence.total} people. What is ${name}'s rank ${askedPhrase}?`;
    }
    case 'RNK-CP001-PROT-TOTAL-FROM-TWO-END-RANKS':
      if (evidence.kind !== 'TOTAL_FROM_TWO_END_RANKS') throw new Error('Evidence mismatch');
      return `${name} is ${ordinal(evidence.rankFromStart)} ${context.startPhrase} and ${ordinal(evidence.rankFromEnd)} ${context.endPhrase}. How many people are in the ${context.group}?`;
    case 'RNK-CP001-PROT-COUNT-BEFORE-FROM-RANK':
      if (evidence.kind !== 'COUNT_BEFORE_FROM_RANK') throw new Error('Evidence mismatch');
      return `${name} is ${ordinal(evidence.rankFromStart)} ${context.startPhrase}. How many people are ${context.beforeRelation} ${name}?`;
    case 'RNK-CP001-PROT-COUNT-AFTER-FROM-TOTAL-AND-RANK':
      if (evidence.kind !== 'COUNT_AFTER_FROM_TOTAL_AND_RANK') throw new Error('Evidence mismatch');
      return `There are ${evidence.total} people in a ${context.group}. ${name} is ${ordinal(evidence.rankFromStart)} ${context.startPhrase}. How many people are ${context.afterRelation} ${name}?`;
    case 'RNK-CP001-PROT-RANK-FROM-COUNT-BEFORE':
      if (evidence.kind !== 'RANK_FROM_COUNT_BEFORE') throw new Error('Evidence mismatch');
      return `${evidence.beforeCount} people are ${context.beforeRelation} ${name}. What is ${name}'s rank ${context.startPhrase}?`;
    case 'RNK-CP001-PROT-RANK-FROM-COUNT-AFTER-AND-TOTAL':
      if (evidence.kind !== 'RANK_FROM_COUNT_AFTER_AND_TOTAL') throw new Error('Evidence mismatch');
      return `A ${context.group} has ${evidence.total} people, and ${evidence.afterCount} people are ${context.afterRelation} ${name}. What is ${name}'s rank ${context.startPhrase}?`;
  }
}

function misconceptionCandidates(
  prototypeId: RnkCp001PrototypeId,
  evidence: RnkDisplayedEvidence,
  answer: number,
): Array<{ value: number; id: string; explanation: string }> {
  switch (prototypeId) {
    case 'RNK-CP001-PROT-OPPOSITE-END-RANK': {
      if (evidence.kind !== 'OPPOSITE_END_RANK') throw new Error('Evidence mismatch');
      return [
        {
          value: evidence.total - evidence.knownRank,
          id: 'FORGOT_PLUS_ONE',
          explanation: 'This subtracts the known rank from the total but forgets that the target person is counted from both ends.',
        },
        {
          value: evidence.knownRank,
          id: 'USED_SAME_END_RANK',
          explanation: 'This repeats the given rank instead of converting it to the opposite end.',
        },
        {
          value: evidence.total - evidence.knownRank + 2,
          id: 'ADDED_ONE_TWICE',
          explanation: 'This applies the shared-person adjustment twice.',
        },
      ];
    }
    case 'RNK-CP001-PROT-TOTAL-FROM-TWO-END-RANKS': {
      if (evidence.kind !== 'TOTAL_FROM_TWO_END_RANKS') throw new Error('Evidence mismatch');
      return [
        {
          value: evidence.rankFromStart + evidence.rankFromEnd,
          id: 'FORGOT_SHARED_PERSON_SUBTRACTION',
          explanation: 'This adds both ranks but counts the same person twice.',
        },
        {
          value: evidence.rankFromStart + evidence.rankFromEnd - 2,
          id: 'SUBTRACTED_SHARED_PERSON_TWICE',
          explanation: 'This removes two positions even though only one duplicated person must be removed.',
        },
        {
          value: Math.abs(evidence.rankFromStart - evidence.rankFromEnd) + 1,
          id: 'USED_RANK_DIFFERENCE',
          explanation: 'This uses the difference between the two ranks, which does not give the total group size.',
        },
      ];
    }
    case 'RNK-CP001-PROT-COUNT-BEFORE-FROM-RANK': {
      if (evidence.kind !== 'COUNT_BEFORE_FROM_RANK') throw new Error('Evidence mismatch');
      return [
        {
          value: evidence.rankFromStart,
          id: 'COUNTED_TARGET_AS_BEFORE',
          explanation: 'This includes the target person among the people before them.',
        },
        {
          value: evidence.rankFromStart - 2,
          id: 'SUBTRACTED_ONE_TWICE',
          explanation: 'This removes two places instead of removing only the target position.',
        },
        {
          value: evidence.rankFromStart + 1,
          id: 'ADDED_INSTEAD_OF_SUBTRACTED',
          explanation: 'This moves away from the required count by adding one to the rank.',
        },
      ];
    }
    case 'RNK-CP001-PROT-COUNT-AFTER-FROM-TOTAL-AND-RANK': {
      if (evidence.kind !== 'COUNT_AFTER_FROM_TOTAL_AND_RANK') throw new Error('Evidence mismatch');
      return [
        {
          value: evidence.total - evidence.rankFromStart + 1,
          id: 'COUNTED_TARGET_AS_AFTER',
          explanation: 'This includes the target person among those after them.',
        },
        {
          value: evidence.total - evidence.rankFromStart - 1,
          id: 'SUBTRACTED_ONE_TWICE',
          explanation: 'This removes one extra person after already subtracting the target rank.',
        },
        {
          value: evidence.rankFromStart - 1,
          id: 'COUNTED_BEFORE_INSTEAD_OF_AFTER',
          explanation: 'This calculates the people before the target rather than after the target.',
        },
      ];
    }
    case 'RNK-CP001-PROT-RANK-FROM-COUNT-BEFORE': {
      if (evidence.kind !== 'RANK_FROM_COUNT_BEFORE') throw new Error('Evidence mismatch');
      return [
        {
          value: evidence.beforeCount,
          id: 'FORGOT_PLUS_ONE',
          explanation: 'This reports the number before the target without adding the target position.',
        },
        {
          value: evidence.beforeCount + 2,
          id: 'ADDED_ONE_TWICE',
          explanation: 'This adds two positions although the target occupies only the next one.',
        },
        {
          value: Math.max(1, evidence.beforeCount - 1),
          id: 'MOVED_IN_WRONG_DIRECTION',
          explanation: 'This reduces the count instead of moving to the next rank.',
        },
      ];
    }
    case 'RNK-CP001-PROT-RANK-FROM-COUNT-AFTER-AND-TOTAL': {
      if (evidence.kind !== 'RANK_FROM_COUNT_AFTER_AND_TOTAL') throw new Error('Evidence mismatch');
      return [
        {
          value: evidence.total - evidence.afterCount + 1,
          id: 'COUNTED_TARGET_TWICE',
          explanation: 'This adds one after the total-minus-after calculation even though the target is already included.',
        },
        {
          value: evidence.total - evidence.afterCount - 1,
          id: 'REMOVED_TARGET_TWICE',
          explanation: 'This subtracts one extra position after removing the people behind the target.',
        },
        {
          value: evidence.afterCount + 1,
          id: 'REVERSED_START_AND_END',
          explanation: 'This converts the after-count into a rank from the opposite end, not the requested start end.',
        },
      ];
    }
  }
}

function minimumAllowed(semantic: RnkAnswerSemantic): number {
  return semantic === 'COUNT' ? 0 : 1;
}

function buildOptions(
  prototypeId: RnkCp001PrototypeId,
  evidence: RnkDisplayedEvidence,
  answer: number,
  answerSemantic: RnkAnswerSemantic,
  correctIndex: number,
): readonly RnkOption[] {
  const candidates = misconceptionCandidates(prototypeId, evidence, answer);
  const used = new Set<number>([answer]);
  const wrong: RnkOption[] = [];
  const minimum = minimumAllowed(answerSemantic);

  for (const candidate of candidates) {
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
        explanation: `This is a nearby value, but it does not satisfy the displayed rank equation; the exact result is ${answer}.`,
      });
    }
    distance += 1;
  }

  const options: RnkOption[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      options.push({
        value: answer,
        label: String(answer),
        misconceptionId: 'CORRECT',
        explanation: 'This value satisfies the rank equation exactly.',
      });
    } else {
      options.push(wrong[wrongIndex]);
      wrongIndex += 1;
    }
  }
  return options;
}

function calculationFor(evidence: RnkDisplayedEvidence): {
  keyRule: string;
  steps: readonly string[];
  shortcut: string;
} {
  switch (evidence.kind) {
    case 'OPPOSITE_END_RANK':
      return {
        keyRule: 'Opposite-end rank = total people − known rank + 1. The +1 keeps the target person in both counts.',
        steps: [
          `Total people = ${evidence.total}; known rank = ${evidence.knownRank}.`,
          `Opposite-end rank = ${evidence.total} - ${evidence.knownRank} + 1.`,
          `Therefore, the required rank is ${evidence.total - evidence.knownRank + 1}.`,
        ],
        shortcut: 'For opposite-end rank, subtract the given rank from the total and immediately add 1.',
      };
    case 'TOTAL_FROM_TWO_END_RANKS':
      return {
        keyRule: 'Total people = rank from one end + rank from the other end − 1. Subtract 1 because the target person appears in both ranks.',
        steps: [
          `Ranks are ${evidence.rankFromStart} and ${evidence.rankFromEnd}.`,
          `Total = ${evidence.rankFromStart} + ${evidence.rankFromEnd} - 1.`,
          `Therefore, total people = ${evidence.rankFromStart + evidence.rankFromEnd - 1}.`,
        ],
        shortcut: 'Add the two end-ranks and remove the one person counted twice.',
      };
    case 'COUNT_BEFORE_FROM_RANK':
      return {
        keyRule: 'People before = rank from the start − 1, because the rank itself includes the target person.',
        steps: [
          `Rank from the start = ${evidence.rankFromStart}.`,
          `People before = ${evidence.rankFromStart} - 1.`,
          `Therefore, people before = ${evidence.rankFromStart - 1}.`,
        ],
        shortcut: 'To convert a rank into the count before it, subtract 1.',
      };
    case 'COUNT_AFTER_FROM_TOTAL_AND_RANK':
      return {
        keyRule: 'People after = total people − rank from the start.',
        steps: [
          `Total people = ${evidence.total}; rank from the start = ${evidence.rankFromStart}.`,
          `People after = ${evidence.total} - ${evidence.rankFromStart}.`,
          `Therefore, people after = ${evidence.total - evidence.rankFromStart}.`,
        ],
        shortcut: 'Subtract the start-rank directly from the total; do not add or subtract another 1.',
      };
    case 'RANK_FROM_COUNT_BEFORE':
      return {
        keyRule: 'Rank from the start = people before + 1, because the target occupies the next position.',
        steps: [
          `People before = ${evidence.beforeCount}.`,
          `Rank = ${evidence.beforeCount} + 1.`,
          `Therefore, the rank is ${evidence.beforeCount + 1}.`,
        ],
        shortcut: 'The target stands immediately after everyone counted before, so add 1.',
      };
    case 'RANK_FROM_COUNT_AFTER_AND_TOTAL':
      return {
        keyRule: 'Rank from the start = total people − people after. The target remains included in the total.',
        steps: [
          `Total people = ${evidence.total}; people after = ${evidence.afterCount}.`,
          `Rank from the start = ${evidence.total} - ${evidence.afterCount}.`,
          `Therefore, the rank is ${evidence.total - evidence.afterCount}.`,
        ],
        shortcut: 'Remove everyone behind the target from the total; the remaining count is the target rank.',
      };
  }
}

function difficultyFor(
  prototypeId: RnkCp001PrototypeId,
  state: RnkNormalizedState,
  context: ContextVocabulary,
  evidence: RnkDisplayedEvidence,
): RnkDifficulty {
  let score = 0;
  if (state.total >= 28) score += 1;
  if (state.total >= 46) score += 1;
  if (context.id !== 'MERIT_LIST') score += 1;
  if (state.rankFromStart > 2 && state.rankFromEnd > 2) score += 1;
  if (prototypeId === 'RNK-CP001-PROT-TOTAL-FROM-TWO-END-RANKS') score += 1;
  if (evidence.kind === 'OPPOSITE_END_RANK' && evidence.knownSide === 'END') score += 1;
  if (score <= 1) return 'EASY';
  if (score <= 3) return 'MEDIUM';
  return 'HARD';
}

function fingerprint(
  prototypeId: RnkCp001PrototypeId,
  contextId: RnkContextId,
  evidence: RnkDisplayedEvidence,
  answer: number,
): string {
  return `RNK-001|RNK-CP-001|${prototypeId}|${contextId}|${JSON.stringify(evidence)}|A=${answer}`;
}

export function generateRnkCp001Question(
  prototypeId: RnkCp001PrototypeId,
  seed: number,
): RnkCp001Question {
  if (!Number.isSafeInteger(seed)) throw new Error('Seed must be a safe integer');
  const rng = createRng(prototypeId, seed);
  const context = CONTEXTS[randomInt(rng, 0, CONTEXTS.length - 1)];
  const targetName = NAMES[randomInt(rng, 0, NAMES.length - 1)];
  const state = buildNormalizedState(rng, seed);
  const displayedEvidence = evidenceFor(prototypeId, state, rng);
  const answer = solveCp001Canonical(prototypeId, state, displayedEvidence);
  const independentlySolved = solveCp001Independently(displayedEvidence);
  if (answer !== independentlySolved) {
    throw new Error(`Canonical/independent disagreement: ${answer} vs ${independentlySolved}`);
  }

  const answerSemantic = answerSemanticFor(prototypeId);
  const correctIndex = hashText(`${prototypeId}:${seed}:correct`) % 4;
  const options = buildOptions(prototypeId, displayedEvidence, answer, answerSemantic, correctIndex);
  const calculation = calculationFor(displayedEvidence);

  return {
    packageId: 'RNK-001',
    checkpointId: 'RNK-CP-001',
    prototypeId,
    permanentQlId: null,
    seed,
    locale: 'en-IN',
    contextId: context.id,
    targetName,
    stem: stemFor(prototypeId, displayedEvidence, context, targetName),
    displayedEvidence,
    answerSemantic,
    answer,
    options,
    correctIndex,
    difficulty: difficultyFor(prototypeId, state, context, displayedEvidence),
    normalizedState: state,
    explanation: {
      keyRule: calculation.keyRule,
      stepByStepSolution: calculation.steps,
      examSpeedShortcut: calculation.shortcut,
      optionAnalysis: options.map(
        (option, index) =>
          `Option ${index + 1} (${option.label}): ${option.misconceptionId === 'CORRECT' ? 'Correct. ' : ''}${option.explanation}`,
      ),
      conclusion: `The correct answer is ${answer}.`,
    },
    mathematicalFingerprint: fingerprint(prototypeId, context.id, displayedEvidence, answer),
    lifecycle: {
      reviewStatus: 'UNREVIEWED',
      questionStudioDiscoverable: false,
      questionBankStatus: 'NOT_STORED',
      testEligibility: 'INELIGIBLE',
      publiclyPublishable: false,
    },
  };
}
