export const RNK_CP001_FINAL_INVERSE_PROTOTYPE_ID =
  'RNK-CP001-PROT-END-RANK-FROM-COUNT-BEFORE-AND-TOTAL' as const;

export type RnkCp001FinalInversePrototypeId = typeof RNK_CP001_FINAL_INVERSE_PROTOTYPE_ID;
export type RnkCp001FinalInverseContextId = 'MERIT_LIST' | 'HORIZONTAL_ROW' | 'QUEUE';
export type RnkCp001FinalInverseDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface RnkCp001FinalInverseState {
  readonly total: number;
  readonly rankFromStart: number;
  readonly rankFromEnd: number;
  readonly beforeCount: number;
  readonly afterCount: number;
}

export interface RnkCp001FinalInverseEvidence {
  readonly kind: 'END_RANK_FROM_COUNT_BEFORE_AND_TOTAL';
  readonly total: number;
  readonly beforeCount: number;
}

export interface RnkCp001FinalInverseOption {
  readonly value: number;
  readonly label: string;
  readonly misconceptionId: string;
  readonly explanation: string;
}

export interface RnkCp001FinalInverseQuestion {
  readonly packageId: 'RNK-001';
  readonly checkpointId: 'RNK-CP-001';
  readonly waveId: 'FINAL_MIRRORED_INVERSE_ADDENDUM';
  readonly prototypeId: RnkCp001FinalInversePrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: 'en-IN';
  readonly contextId: RnkCp001FinalInverseContextId;
  readonly targetName: string;
  readonly stem: string;
  readonly displayedEvidence: RnkCp001FinalInverseEvidence;
  readonly answerSemantic: 'RANK';
  readonly answer: number;
  readonly options: readonly RnkCp001FinalInverseOption[];
  readonly correctIndex: number;
  readonly difficulty: RnkCp001FinalInverseDifficulty;
  readonly normalizedState: RnkCp001FinalInverseState;
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
  readonly id: RnkCp001FinalInverseContextId;
  readonly group: string;
  readonly endPhrase: string;
  readonly beforeRelation: string;
}

const CONTEXTS: readonly ContextVocabulary[] = [
  {
    id: 'MERIT_LIST',
    group: 'merit list',
    endPhrase: 'from the bottom',
    beforeRelation: 'ranked above',
  },
  {
    id: 'HORIZONTAL_ROW',
    group: 'row',
    endPhrase: 'from the right',
    beforeRelation: 'standing to the left of',
  },
  {
    id: 'QUEUE',
    group: 'queue',
    endPhrase: 'from the back',
    beforeRelation: 'standing ahead of',
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

function createRng(seed: number): () => number {
  let state = (hashText(`${RNK_CP001_FINAL_INVERSE_PROTOTYPE_ID}:${seed}`) || 0x9e3779b9) >>> 0;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x100000000;
  };
}

function randomInt(rng: () => number, minimum: number, maximum: number): number {
  return minimum + Math.floor(rng() * (maximum - minimum + 1));
}

function relationClause(count: number, relation: string, name: string): string {
  if (count === 0) return `No one is ${relation} ${name}`;
  if (count === 1) return `One person is ${relation} ${name}`;
  return `${count} people are ${relation} ${name}`;
}

function buildState(rng: () => number, seed: number): RnkCp001FinalInverseState {
  const total = randomInt(rng, 8, 75);
  const selector = Math.abs(seed) % 12;
  let rankFromStart: number;

  if (selector === 0) rankFromStart = 1;
  else if (selector === 1) rankFromStart = total;
  else if (selector === 2) rankFromStart = 2;
  else if (selector === 3) rankFromStart = total - 1;
  else rankFromStart = randomInt(rng, 2, total - 1);

  return {
    total,
    rankFromStart,
    rankFromEnd: total - rankFromStart + 1,
    beforeCount: rankFromStart - 1,
    afterCount: total - rankFromStart,
  };
}

export function solveRnkCp001FinalInverseIndependently(
  evidence: RnkCp001FinalInverseEvidence,
): number {
  return evidence.total - evidence.beforeCount;
}

export function solveRnkCp001FinalInverseCanonical(
  state: RnkCp001FinalInverseState,
): number {
  return state.rankFromEnd;
}

function buildOptions(
  evidence: RnkCp001FinalInverseEvidence,
  answer: number,
  correctIndex: number,
): readonly RnkCp001FinalInverseOption[] {
  const candidates = [
    {
      value: evidence.total - evidence.beforeCount + 1,
      id: 'COUNTED_TARGET_TWICE',
      explanation: 'This adds one after the target is already included in the total-minus-before calculation.',
    },
    {
      value: evidence.total - evidence.beforeCount - 1,
      id: 'REMOVED_TARGET_TWICE',
      explanation: 'This subtracts one extra position after removing everyone before the target.',
    },
    {
      value: evidence.beforeCount + 1,
      id: 'RETURNED_START_RANK',
      explanation: 'This converts the before-count into the rank from the start, not the requested rank from the end.',
    },
  ];

  const used = new Set<number>([answer]);
  const wrong: RnkCp001FinalInverseOption[] = [];
  for (const candidate of candidates) {
    if (candidate.value < 1 || used.has(candidate.value)) continue;
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
      if (value < 1 || used.has(value)) continue;
      used.add(value);
      wrong.push({
        value,
        label: String(value),
        misconceptionId: 'NEARBY_ARITHMETIC_MISS',
        explanation: `This nearby value does not satisfy total minus people before; the exact answer is ${answer}.`,
      });
    }
    distance += 1;
  }

  const options: RnkCp001FinalInverseOption[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      options.push({
        value: answer,
        label: String(answer),
        misconceptionId: 'CORRECT',
        explanation: 'This value exactly equals total people minus the count before the target.',
      });
    } else {
      options.push(wrong[wrongIndex]);
      wrongIndex += 1;
    }
  }
  return options;
}

function difficultyFor(
  state: RnkCp001FinalInverseState,
  context: ContextVocabulary,
): RnkCp001FinalInverseDifficulty {
  let score = 0;
  if (state.total >= 28) score += 1;
  if (state.total >= 52) score += 1;
  if (context.id !== 'MERIT_LIST') score += 1;
  if (state.beforeCount > 0 && state.afterCount > 0) score += 1;
  if (score <= 1) return 'EASY';
  if (score <= 3) return 'MEDIUM';
  return 'HARD';
}

export function generateRnkCp001FinalInverseQuestion(seed: number): RnkCp001FinalInverseQuestion {
  if (!Number.isInteger(seed)) throw new Error(`Seed must be an integer: ${seed}`);

  const rng = createRng(seed);
  const context = CONTEXTS[randomInt(rng, 0, CONTEXTS.length - 1)];
  const targetName = NAMES[randomInt(rng, 0, NAMES.length - 1)];
  const state = buildState(rng, seed);
  const evidence: RnkCp001FinalInverseEvidence = {
    kind: 'END_RANK_FROM_COUNT_BEFORE_AND_TOTAL',
    total: state.total,
    beforeCount: state.beforeCount,
  };
  const canonicalAnswer = solveRnkCp001FinalInverseCanonical(state);
  const independentAnswer = solveRnkCp001FinalInverseIndependently(evidence);
  if (canonicalAnswer !== independentAnswer) {
    throw new Error(`Seed ${seed}: canonical and independent solvers disagree`);
  }

  const correctIndex = Math.abs(seed) % 4;
  const options = buildOptions(evidence, canonicalAnswer, correctIndex);
  const stem = `A ${context.group} has ${state.total} people. ${relationClause(
    state.beforeCount,
    context.beforeRelation,
    targetName,
  )}. What is ${targetName}'s rank ${context.endPhrase}?`;

  return {
    packageId: 'RNK-001',
    checkpointId: 'RNK-CP-001',
    waveId: 'FINAL_MIRRORED_INVERSE_ADDENDUM',
    prototypeId: RNK_CP001_FINAL_INVERSE_PROTOTYPE_ID,
    permanentQlId: null,
    seed,
    locale: 'en-IN',
    contextId: context.id,
    targetName,
    stem,
    displayedEvidence: evidence,
    answerSemantic: 'RANK',
    answer: canonicalAnswer,
    options,
    correctIndex,
    difficulty: difficultyFor(state, context),
    normalizedState: state,
    explanation: {
      keyRule: 'Rank from the end = total people − people before the target. The target remains inside the total.',
      stepByStepSolution: [
        `Total people = ${state.total}; people before = ${state.beforeCount}.`,
        `Rank from the end = ${state.total} - ${state.beforeCount}.`,
        `Therefore, rank from the end = ${canonicalAnswer}.`,
      ],
      examSpeedShortcut: 'Remove everyone before the target from the total; the remaining count is the target’s rank from the end.',
      optionAnalysis: options.map(
        (option, index) =>
          `Option ${index + 1} (${option.label}): ${option.explanation} [${option.misconceptionId}]`,
      ),
      conclusion: `The correct answer is ${canonicalAnswer}.`,
    },
    mathematicalFingerprint: `${evidence.kind}|total=${state.total}|before=${state.beforeCount}`,
    lifecycle: {
      reviewStatus: 'UNREVIEWED',
      questionStudioDiscoverable: false,
      questionBankStatus: 'NOT_STORED',
      testEligibility: 'INELIGIBLE',
      publiclyPublishable: false,
    },
  };
}
