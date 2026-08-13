export const RNK_CP002_PROTOTYPE_IDS = [
  'RNK-CP002-PROT-PEOPLE-BETWEEN-SAME-END-RANKS',
  'RNK-CP002-PROT-POSITION-GAP-SAME-END-RANKS',
  'RNK-CP002-PROT-SECOND-RANK-FROM-RELATIVE-OFFSET',
  'RNK-CP002-PROT-PEOPLE-BETWEEN-MIXED-END-RANKS',
  'RNK-CP002-PROT-TOTAL-FROM-MIXED-END-RANKS-KNOWN-ORDER',
  'RNK-CP002-PROT-EXTREME-TOTAL-FROM-MIXED-END-RANKS-UNKNOWN-ORDER',
] as const;

export type RnkCp002PrototypeId = (typeof RNK_CP002_PROTOTYPE_IDS)[number];
export type RnkCp002ContextId = 'MERIT_LIST' | 'HORIZONTAL_ROW' | 'QUEUE';
export type RnkCp002Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type RnkCp002AnswerSemantic = 'RANK' | 'COUNT' | 'TOTAL';
export type RnkSide = 'START' | 'END';
export type RnkDirection = 'TOWARD_START' | 'TOWARD_END';

export interface RnkCp002NormalizedState {
  readonly total: number;
  readonly firstRankFromStart: number;
  readonly firstRankFromEnd: number;
  readonly secondRankFromStart: number;
  readonly secondRankFromEnd: number;
  readonly positionGap: number;
  readonly betweenCount: number;
  readonly firstToSecondDirection: RnkDirection;
}

export type RnkCp002DisplayedEvidence =
  | { readonly kind: 'SAME_END_TWO_RANKS'; readonly side: RnkSide; readonly firstRank: number; readonly secondRank: number; readonly requested: 'BETWEEN_COUNT' | 'POSITION_GAP' }
  | { readonly kind: 'SECOND_RANK_FROM_RELATIVE_OFFSET'; readonly side: RnkSide; readonly firstRank: number; readonly offset: number; readonly direction: RnkDirection }
  | { readonly kind: 'BETWEEN_FROM_MIXED_END_RANKS'; readonly total: number; readonly firstRankFromStart: number; readonly secondRankFromEnd: number }
  | { readonly kind: 'TOTAL_FROM_MIXED_END_RANKS_KNOWN_ORDER'; readonly firstRankFromStart: number; readonly secondRankFromEnd: number; readonly betweenCount: number; readonly direction: RnkDirection }
  | { readonly kind: 'EXTREME_TOTAL_FROM_MIXED_END_RANKS_UNKNOWN_ORDER'; readonly firstRankFromStart: number; readonly secondRankFromEnd: number; readonly betweenCount: number; readonly requestedExtreme: 'MINIMUM' | 'MAXIMUM' };

export interface RnkCp002Option {
  readonly value: number;
  readonly label: string;
  readonly misconceptionId: string;
  readonly explanation: string;
}

export interface RnkCp002Question {
  readonly packageId: 'RNK-001';
  readonly checkpointId: 'RNK-CP-002';
  readonly prototypeId: RnkCp002PrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: 'en-IN';
  readonly contextId: RnkCp002ContextId;
  readonly firstName: string;
  readonly secondName: string;
  readonly stem: string;
  readonly displayedEvidence: RnkCp002DisplayedEvidence;
  readonly answerSemantic: RnkCp002AnswerSemantic;
  readonly answer: number;
  readonly options: readonly RnkCp002Option[];
  readonly correctIndex: number;
  readonly difficulty: RnkCp002Difficulty;
  readonly normalizedState: RnkCp002NormalizedState;
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

export interface RnkCp002ContextVocabulary {
  readonly id: RnkCp002ContextId;
  readonly group: string;
  readonly startPhrase: string;
  readonly endPhrase: string;
  readonly towardStartRelation: string;
  readonly towardEndRelation: string;
  readonly memberSingular: string;
  readonly memberPlural: string;
}

export const RNK_CP002_CONTEXTS: readonly RnkCp002ContextVocabulary[] = [
  { id: 'MERIT_LIST', group: 'merit list', startPhrase: 'from the top', endPhrase: 'from the bottom', towardStartRelation: 'ranked above', towardEndRelation: 'ranked below', memberSingular: 'candidate', memberPlural: 'candidates' },
  { id: 'HORIZONTAL_ROW', group: 'row', startPhrase: 'from the left', endPhrase: 'from the right', towardStartRelation: 'standing to the left of', towardEndRelation: 'standing to the right of', memberSingular: 'person', memberPlural: 'people' },
  { id: 'QUEUE', group: 'queue', startPhrase: 'from the front', endPhrase: 'from the back', towardStartRelation: 'standing ahead of', towardEndRelation: 'standing behind', memberSingular: 'person', memberPlural: 'people' },
] as const;

export const RNK_CP002_NAMES = ['Aman', 'Ananya', 'Gurpreet', 'Harleen', 'Ishaan', 'Jaspreet', 'Karan', 'Mehak', 'Navdeep', 'Pooja', 'Riya', 'Simran'] as const;

export function hashText(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createRng(prototypeId: RnkCp002PrototypeId, seed: number): () => number {
  let state = (hashText(`${prototypeId}:${seed}`) || 0x9e3779b9) >>> 0;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x100000000;
  };
}

export function randomInt(rng: () => number, minimum: number, maximum: number): number {
  if (!Number.isInteger(minimum) || !Number.isInteger(maximum) || maximum < minimum) throw new Error(`Invalid integer range ${minimum}..${maximum}`);
  return minimum + Math.floor(rng() * (maximum - minimum + 1));
}

function stateFromPositions(total: number, firstStart: number, secondStart: number): RnkCp002NormalizedState {
  if (firstStart === secondStart) throw new Error('Two-person state requires distinct positions');
  return {
    total,
    firstRankFromStart: firstStart,
    firstRankFromEnd: total - firstStart + 1,
    secondRankFromStart: secondStart,
    secondRankFromEnd: total - secondStart + 1,
    positionGap: Math.abs(firstStart - secondStart),
    betweenCount: Math.abs(firstStart - secondStart) - 1,
    firstToSecondDirection: secondStart < firstStart ? 'TOWARD_START' : 'TOWARD_END',
  };
}

function buildGeneralState(rng: () => number, seed: number): RnkCp002NormalizedState {
  const total = randomInt(rng, 10, 80);
  const selector = Math.abs(seed) % 12;
  let firstStart: number;
  let secondStart: number;
  if (selector === 0) [firstStart, secondStart] = [1, 2];
  else if (selector === 1) [firstStart, secondStart] = [total, total - 1];
  else if (selector === 2) [firstStart, secondStart] = [1, total];
  else if (selector === 3) [firstStart, secondStart] = [total, 1];
  else if (selector === 4) [firstStart, secondStart] = [2, total - 1];
  else if (selector === 5) [firstStart, secondStart] = [total - 1, 2];
  else {
    firstStart = randomInt(rng, 1, total);
    do secondStart = randomInt(rng, 1, total); while (secondStart === firstStart);
  }
  return stateFromPositions(total, firstStart, secondStart);
}

function buildUnknownOrderState(rng: () => number, seed: number): RnkCp002NormalizedState {
  const betweenCount = Math.abs(seed) % 7;
  const firstRankFromStart = randomInt(rng, betweenCount + 2, betweenCount + 26);
  const secondRankFromEnd = randomInt(rng, betweenCount + 2, betweenCount + 26);
  const high = firstRankFromStart + secondRankFromEnd + betweenCount;
  const low = firstRankFromStart + secondRankFromEnd - betweenCount - 2;
  const total = Math.abs(seed) % 2 === 0 ? high : low;
  return stateFromPositions(total, firstRankFromStart, total - secondRankFromEnd + 1);
}

export function buildCp002State(prototypeId: RnkCp002PrototypeId, rng: () => number, seed: number): RnkCp002NormalizedState {
  return prototypeId === 'RNK-CP002-PROT-EXTREME-TOTAL-FROM-MIXED-END-RANKS-UNKNOWN-ORDER'
    ? buildUnknownOrderState(rng, seed)
    : buildGeneralState(rng, seed);
}

export function evidenceForCp002(
  prototypeId: RnkCp002PrototypeId,
  state: RnkCp002NormalizedState,
  rng: () => number,
  seed: number,
): RnkCp002DisplayedEvidence {
  if (prototypeId === 'RNK-CP002-PROT-PEOPLE-BETWEEN-SAME-END-RANKS' || prototypeId === 'RNK-CP002-PROT-POSITION-GAP-SAME-END-RANKS') {
    const side: RnkSide = rng() < 0.5 ? 'START' : 'END';
    return {
      kind: 'SAME_END_TWO_RANKS',
      side,
      firstRank: side === 'START' ? state.firstRankFromStart : state.firstRankFromEnd,
      secondRank: side === 'START' ? state.secondRankFromStart : state.secondRankFromEnd,
      requested: prototypeId.includes('PEOPLE-BETWEEN') ? 'BETWEEN_COUNT' : 'POSITION_GAP',
    };
  }
  if (prototypeId === 'RNK-CP002-PROT-SECOND-RANK-FROM-RELATIVE-OFFSET') {
    const side: RnkSide = rng() < 0.5 ? 'START' : 'END';
    return { kind: 'SECOND_RANK_FROM_RELATIVE_OFFSET', side, firstRank: side === 'START' ? state.firstRankFromStart : state.firstRankFromEnd, offset: state.positionGap, direction: state.firstToSecondDirection };
  }
  if (prototypeId === 'RNK-CP002-PROT-PEOPLE-BETWEEN-MIXED-END-RANKS') {
    return { kind: 'BETWEEN_FROM_MIXED_END_RANKS', total: state.total, firstRankFromStart: state.firstRankFromStart, secondRankFromEnd: state.secondRankFromEnd };
  }
  if (prototypeId === 'RNK-CP002-PROT-TOTAL-FROM-MIXED-END-RANKS-KNOWN-ORDER') {
    return { kind: 'TOTAL_FROM_MIXED_END_RANKS_KNOWN_ORDER', firstRankFromStart: state.firstRankFromStart, secondRankFromEnd: state.secondRankFromEnd, betweenCount: state.betweenCount, direction: state.firstToSecondDirection };
  }
  return { kind: 'EXTREME_TOTAL_FROM_MIXED_END_RANKS_UNKNOWN_ORDER', firstRankFromStart: state.firstRankFromStart, secondRankFromEnd: state.secondRankFromEnd, betweenCount: state.betweenCount, requestedExtreme: Math.abs(seed) % 2 === 0 ? 'MAXIMUM' : 'MINIMUM' };
}

export function solveCp002Independently(evidence: RnkCp002DisplayedEvidence): number {
  switch (evidence.kind) {
    case 'SAME_END_TWO_RANKS': {
      const gap = Math.abs(evidence.firstRank - evidence.secondRank);
      return evidence.requested === 'BETWEEN_COUNT' ? gap - 1 : gap;
    }
    case 'SECOND_RANK_FROM_RELATIVE_OFFSET': {
      const adds = (evidence.side === 'START' && evidence.direction === 'TOWARD_END') || (evidence.side === 'END' && evidence.direction === 'TOWARD_START');
      return evidence.firstRank + (adds ? evidence.offset : -evidence.offset);
    }
    case 'BETWEEN_FROM_MIXED_END_RANKS': {
      const secondStart = evidence.total - evidence.secondRankFromEnd + 1;
      return Math.abs(evidence.firstRankFromStart - secondStart) - 1;
    }
    case 'TOTAL_FROM_MIXED_END_RANKS_KNOWN_ORDER':
      return evidence.direction === 'TOWARD_END'
        ? evidence.firstRankFromStart + evidence.secondRankFromEnd + evidence.betweenCount
        : evidence.firstRankFromStart + evidence.secondRankFromEnd - evidence.betweenCount - 2;
    case 'EXTREME_TOTAL_FROM_MIXED_END_RANKS_UNKNOWN_ORDER': {
      const high = evidence.firstRankFromStart + evidence.secondRankFromEnd + evidence.betweenCount;
      const low = evidence.firstRankFromStart + evidence.secondRankFromEnd - evidence.betweenCount - 2;
      return evidence.requestedExtreme === 'MAXIMUM' ? high : low;
    }
  }
}

export function solveCp002Canonical(prototypeId: RnkCp002PrototypeId, state: RnkCp002NormalizedState, evidence: RnkCp002DisplayedEvidence): number {
  if (prototypeId === 'RNK-CP002-PROT-PEOPLE-BETWEEN-SAME-END-RANKS' || prototypeId === 'RNK-CP002-PROT-PEOPLE-BETWEEN-MIXED-END-RANKS') return state.betweenCount;
  if (prototypeId === 'RNK-CP002-PROT-POSITION-GAP-SAME-END-RANKS') return state.positionGap;
  if (prototypeId === 'RNK-CP002-PROT-SECOND-RANK-FROM-RELATIVE-OFFSET') {
    if (evidence.kind !== 'SECOND_RANK_FROM_RELATIVE_OFFSET') throw new Error('Evidence mismatch');
    return evidence.side === 'START' ? state.secondRankFromStart : state.secondRankFromEnd;
  }
  if (prototypeId === 'RNK-CP002-PROT-TOTAL-FROM-MIXED-END-RANKS-KNOWN-ORDER') return state.total;
  return solveCp002Independently(evidence);
}

export function answerSemanticForCp002(prototypeId: RnkCp002PrototypeId): RnkCp002AnswerSemantic {
  if (prototypeId === 'RNK-CP002-PROT-SECOND-RANK-FROM-RELATIVE-OFFSET') return 'RANK';
  if (prototypeId.includes('TOTAL-FROM')) return 'TOTAL';
  return 'COUNT';
}
