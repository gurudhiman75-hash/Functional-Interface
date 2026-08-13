export const RNK_CP003_PROTOTYPE_IDS = [
  'RNK-CP003-PROT-FINAL-RANKS-AFTER-INTERCHANGE',
  'RNK-CP003-PROT-ORIGINAL-RANKS-FROM-FINAL-INTERCHANGE',
  'RNK-CP003-PROT-TOTAL-FROM-INTERCHANGE-RANK-CHANGE',
  'RNK-CP003-PROT-FINAL-RANK-AFTER-SINGLE-MOVEMENT',
  'RNK-CP003-PROT-PEOPLE-PASSED-FROM-RANK-CHANGE',
  'RNK-CP003-PROT-ORIGINAL-RANK-FROM-FINAL-AND-MOVEMENT',
  'RNK-CP003-PROT-TARGET-RANK-AFTER-INSERTION',
  'RNK-CP003-PROT-TARGET-RANK-AFTER-REMOVAL',
  'RNK-CP003-PROT-FINAL-RANK-AFTER-SEQUENTIAL-MOVES',
] as const;

export type RnkCp003PrototypeId = (typeof RNK_CP003_PROTOTYPE_IDS)[number];
export type RnkCp003ContextId = 'MERIT_LIST' | 'HORIZONTAL_ROW' | 'QUEUE' | 'RACE_ORDER';
export type RnkCp003Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type RnkCp003AnswerSemantic = 'RANK' | 'COUNT' | 'TOTAL' | 'RANK_PAIR';
export type RnkSide = 'START' | 'END';
export type RnkMovementDirection = 'TOWARD_START' | 'TOWARD_END';

export interface RnkCp003ContextVocabulary {
  readonly id: RnkCp003ContextId;
  readonly group: string;
  readonly startPhrase: string;
  readonly endPhrase: string;
  readonly towardStartMovement: string;
  readonly towardEndMovement: string;
  readonly memberSingular: string;
  readonly memberPlural: string;
}

export const RNK_CP003_CONTEXTS: readonly RnkCp003ContextVocabulary[] = [
  { id: 'MERIT_LIST', group: 'merit list', startPhrase: 'from the top', endPhrase: 'from the bottom', towardStartMovement: 'moves upward', towardEndMovement: 'moves downward', memberSingular: 'candidate', memberPlural: 'candidates' },
  { id: 'HORIZONTAL_ROW', group: 'row', startPhrase: 'from the left', endPhrase: 'from the right', towardStartMovement: 'moves to the left', towardEndMovement: 'moves to the right', memberSingular: 'person', memberPlural: 'people' },
  { id: 'QUEUE', group: 'queue', startPhrase: 'from the front', endPhrase: 'from the back', towardStartMovement: 'moves toward the front', towardEndMovement: 'moves toward the back', memberSingular: 'person', memberPlural: 'people' },
  { id: 'RACE_ORDER', group: 'race finishing order', startPhrase: 'from the front', endPhrase: 'from the back', towardStartMovement: 'moves ahead', towardEndMovement: 'drops back', memberSingular: 'runner', memberPlural: 'runners' },
] as const;

export const RNK_CP003_NAMES = ['Aman', 'Ananya', 'Gurpreet', 'Harleen', 'Ishaan', 'Jaspreet', 'Karan', 'Mehak', 'Navdeep', 'Pooja', 'Riya', 'Simran'] as const;

export type RnkCp003DisplayedEvidence =
  | { readonly kind: 'FINAL_RANKS_AFTER_INTERCHANGE'; readonly total: number; readonly firstOriginalRank: number; readonly firstOriginalSide: RnkSide; readonly secondOriginalRank: number; readonly secondOriginalSide: RnkSide; readonly firstRequestedSide: RnkSide; readonly secondRequestedSide: RnkSide }
  | { readonly kind: 'ORIGINAL_RANKS_FROM_FINAL_INTERCHANGE'; readonly total: number; readonly firstFinalRank: number; readonly firstFinalSide: RnkSide; readonly secondFinalRank: number; readonly secondFinalSide: RnkSide; readonly firstRequestedSide: RnkSide; readonly secondRequestedSide: RnkSide }
  | { readonly kind: 'TOTAL_FROM_INTERCHANGE_RANK_CHANGE'; readonly firstOriginalRankFromStart: number; readonly secondOriginalRankFromEnd: number; readonly firstFinalRankFromStart: number }
  | { readonly kind: 'FINAL_RANK_AFTER_SINGLE_MOVEMENT'; readonly total: number; readonly originalRank: number; readonly originalSide: RnkSide; readonly direction: RnkMovementDirection; readonly distance: number; readonly requestedSide: RnkSide }
  | { readonly kind: 'PEOPLE_PASSED_FROM_RANK_CHANGE'; readonly total: number; readonly originalRank: number; readonly originalSide: RnkSide; readonly finalRank: number; readonly finalSide: RnkSide }
  | { readonly kind: 'ORIGINAL_RANK_FROM_FINAL_AND_MOVEMENT'; readonly total: number; readonly finalRank: number; readonly finalSide: RnkSide; readonly direction: RnkMovementDirection; readonly distance: number; readonly requestedSide: RnkSide }
  | { readonly kind: 'TARGET_RANK_AFTER_INSERTION'; readonly totalBefore: number; readonly targetOriginalRank: number; readonly targetOriginalSide: RnkSide; readonly insertedFinalRank: number; readonly insertedFinalSide: RnkSide; readonly requestedSide: RnkSide }
  | { readonly kind: 'TARGET_RANK_AFTER_REMOVAL'; readonly totalBefore: number; readonly targetOriginalRank: number; readonly targetOriginalSide: RnkSide; readonly removedOriginalRank: number; readonly removedOriginalSide: RnkSide; readonly requestedSide: RnkSide }
  | { readonly kind: 'FINAL_RANK_AFTER_SEQUENTIAL_MOVES'; readonly total: number; readonly originalRank: number; readonly originalSide: RnkSide; readonly firstDirection: RnkMovementDirection; readonly firstDistance: number; readonly secondDirection: RnkMovementDirection; readonly secondDistance: number; readonly requestedSide: RnkSide };

export interface RnkCp003Option {
  readonly answerKey: string;
  readonly label: string;
  readonly misconceptionId: string;
  readonly explanation: string;
}

export interface RnkCp003Question {
  readonly packageId: 'RNK-001';
  readonly checkpointId: 'RNK-CP-003';
  readonly prototypeId: RnkCp003PrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: 'en-IN';
  readonly contextId: RnkCp003ContextId;
  readonly firstName: string;
  readonly secondName: string;
  readonly stem: string;
  readonly displayedEvidence: RnkCp003DisplayedEvidence;
  readonly answerSemantic: RnkCp003AnswerSemantic;
  readonly answerKey: string;
  readonly answer: string;
  readonly options: readonly RnkCp003Option[];
  readonly correctIndex: number;
  readonly difficulty: RnkCp003Difficulty;
  readonly explanation: { readonly keyRule: string; readonly stepByStepSolution: readonly string[]; readonly examSpeedShortcut: string; readonly optionAnalysis: readonly string[]; readonly conclusion: string };
  readonly mathematicalFingerprint: string;
  readonly lifecycle: { readonly reviewStatus: 'UNREVIEWED'; readonly questionStudioDiscoverable: false; readonly questionBankStatus: 'NOT_STORED'; readonly testEligibility: 'INELIGIBLE'; readonly publiclyPublishable: false };
}

export function hashText(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createRng(prototypeId: RnkCp003PrototypeId, seed: number): () => number {
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

export function assertRank(total: number, rank: number, label: string): void {
  if (!Number.isInteger(total) || total < 2) throw new Error(`Invalid total ${total}`);
  if (!Number.isInteger(rank) || rank < 1 || rank > total) throw new Error(`${label} ${rank} is outside 1..${total}`);
}

export function toStartRank(total: number, rank: number, side: RnkSide): number {
  assertRank(total, rank, 'rank');
  return side === 'START' ? rank : total - rank + 1;
}

export function fromStartRank(total: number, rankFromStart: number, side: RnkSide): number {
  assertRank(total, rankFromStart, 'rankFromStart');
  return side === 'START' ? rankFromStart : total - rankFromStart + 1;
}

function signedDelta(direction: RnkMovementDirection, distance: number): number {
  if (!Number.isInteger(distance) || distance < 1) throw new Error(`Invalid movement distance ${distance}`);
  return direction === 'TOWARD_START' ? -distance : distance;
}

function numericKey(value: number): string {
  if (!Number.isInteger(value) || value < 0) throw new Error(`Invalid numeric answer ${value}`);
  return String(value);
}

function pairKey(first: number, second: number): string {
  if (!Number.isInteger(first) || first < 1 || !Number.isInteger(second) || second < 1) throw new Error(`Invalid pair answer ${first}|${second}`);
  return `${first}|${second}`;
}

export function answerSemanticForCp003(prototypeId: RnkCp003PrototypeId): RnkCp003AnswerSemantic {
  if (prototypeId === 'RNK-CP003-PROT-FINAL-RANKS-AFTER-INTERCHANGE' || prototypeId === 'RNK-CP003-PROT-ORIGINAL-RANKS-FROM-FINAL-INTERCHANGE') return 'RANK_PAIR';
  if (prototypeId === 'RNK-CP003-PROT-TOTAL-FROM-INTERCHANGE-RANK-CHANGE') return 'TOTAL';
  if (prototypeId === 'RNK-CP003-PROT-PEOPLE-PASSED-FROM-RANK-CHANGE') return 'COUNT';
  return 'RANK';
}

export function solveCp003Independently(evidence: RnkCp003DisplayedEvidence): string {
  switch (evidence.kind) {
    case 'FINAL_RANKS_AFTER_INTERCHANGE': {
      const firstStart = toStartRank(evidence.total, evidence.firstOriginalRank, evidence.firstOriginalSide);
      const secondStart = toStartRank(evidence.total, evidence.secondOriginalRank, evidence.secondOriginalSide);
      if (firstStart === secondStart) throw new Error('Interchange requires distinct original positions');
      return pairKey(fromStartRank(evidence.total, secondStart, evidence.firstRequestedSide), fromStartRank(evidence.total, firstStart, evidence.secondRequestedSide));
    }
    case 'ORIGINAL_RANKS_FROM_FINAL_INTERCHANGE': {
      const firstFinalStart = toStartRank(evidence.total, evidence.firstFinalRank, evidence.firstFinalSide);
      const secondFinalStart = toStartRank(evidence.total, evidence.secondFinalRank, evidence.secondFinalSide);
      if (firstFinalStart === secondFinalStart) throw new Error('Interchange requires distinct final positions');
      return pairKey(fromStartRank(evidence.total, secondFinalStart, evidence.firstRequestedSide), fromStartRank(evidence.total, firstFinalStart, evidence.secondRequestedSide));
    }
    case 'TOTAL_FROM_INTERCHANGE_RANK_CHANGE':
      if (evidence.firstOriginalRankFromStart === evidence.firstFinalRankFromStart) throw new Error('Interchange must change the first person’s rank');
      return numericKey(evidence.firstFinalRankFromStart + evidence.secondOriginalRankFromEnd - 1);
    case 'FINAL_RANK_AFTER_SINGLE_MOVEMENT': {
      const originalStart = toStartRank(evidence.total, evidence.originalRank, evidence.originalSide);
      const finalStart = originalStart + signedDelta(evidence.direction, evidence.distance);
      assertRank(evidence.total, finalStart, 'final rank after movement');
      return numericKey(fromStartRank(evidence.total, finalStart, evidence.requestedSide));
    }
    case 'PEOPLE_PASSED_FROM_RANK_CHANGE': {
      const originalStart = toStartRank(evidence.total, evidence.originalRank, evidence.originalSide);
      const finalStart = toStartRank(evidence.total, evidence.finalRank, evidence.finalSide);
      if (originalStart === finalStart) throw new Error('Rank change must be non-zero');
      return numericKey(Math.abs(originalStart - finalStart));
    }
    case 'ORIGINAL_RANK_FROM_FINAL_AND_MOVEMENT': {
      const finalStart = toStartRank(evidence.total, evidence.finalRank, evidence.finalSide);
      const originalStart = finalStart - signedDelta(evidence.direction, evidence.distance);
      assertRank(evidence.total, originalStart, 'original rank before movement');
      return numericKey(fromStartRank(evidence.total, originalStart, evidence.requestedSide));
    }
    case 'TARGET_RANK_AFTER_INSERTION': {
      const totalAfter = evidence.totalBefore + 1;
      const targetStart = toStartRank(evidence.totalBefore, evidence.targetOriginalRank, evidence.targetOriginalSide);
      const insertedStart = toStartRank(totalAfter, evidence.insertedFinalRank, evidence.insertedFinalSide);
      const targetFinalStart = insertedStart <= targetStart ? targetStart + 1 : targetStart;
      return numericKey(fromStartRank(totalAfter, targetFinalStart, evidence.requestedSide));
    }
    case 'TARGET_RANK_AFTER_REMOVAL': {
      const targetStart = toStartRank(evidence.totalBefore, evidence.targetOriginalRank, evidence.targetOriginalSide);
      const removedStart = toStartRank(evidence.totalBefore, evidence.removedOriginalRank, evidence.removedOriginalSide);
      if (targetStart === removedStart) throw new Error('The target person cannot also be the removed person');
      const targetFinalStart = removedStart < targetStart ? targetStart - 1 : targetStart;
      return numericKey(fromStartRank(evidence.totalBefore - 1, targetFinalStart, evidence.requestedSide));
    }
    case 'FINAL_RANK_AFTER_SEQUENTIAL_MOVES': {
      const originalStart = toStartRank(evidence.total, evidence.originalRank, evidence.originalSide);
      const afterFirst = originalStart + signedDelta(evidence.firstDirection, evidence.firstDistance);
      assertRank(evidence.total, afterFirst, 'rank after first movement');
      const afterSecond = afterFirst + signedDelta(evidence.secondDirection, evidence.secondDistance);
      assertRank(evidence.total, afterSecond, 'rank after second movement');
      return numericKey(fromStartRank(evidence.total, afterSecond, evidence.requestedSide));
    }
  }
}

export function buildCp003Evidence(prototypeId: RnkCp003PrototypeId, rng: () => number, seed: number): RnkCp003DisplayedEvidence {
  const side = (offset: number): RnkSide => ((Math.abs(seed) + offset) % 2 === 0 ? 'START' : 'END');

  if (prototypeId === 'RNK-CP003-PROT-FINAL-RANKS-AFTER-INTERCHANGE' || prototypeId === 'RNK-CP003-PROT-ORIGINAL-RANKS-FROM-FINAL-INTERCHANGE') {
    const total = randomInt(rng, 12, 64);
    const selector = Math.abs(seed) % 8;
    let firstStart: number;
    let secondStart: number;
    if (selector === 0) [firstStart, secondStart] = [1, total];
    else if (selector === 1) [firstStart, secondStart] = [2, total - 1];
    else if (selector === 2) [firstStart, secondStart] = [1, Math.min(total, 6)];
    else if (selector === 3) [firstStart, secondStart] = [Math.max(1, total - 5), total];
    else {
      firstStart = randomInt(rng, 1, total);
      do secondStart = randomInt(rng, 1, total); while (secondStart === firstStart);
    }
    const firstEvidenceSide = side(0);
    const secondEvidenceSide = side(1 + (selector % 3 === 0 ? 1 : 0));
    const firstRequestedSide = side(2);
    const secondRequestedSide = side(3 + (selector % 4 === 0 ? 1 : 0));
    if (prototypeId === 'RNK-CP003-PROT-FINAL-RANKS-AFTER-INTERCHANGE') {
      return { kind: 'FINAL_RANKS_AFTER_INTERCHANGE', total, firstOriginalRank: fromStartRank(total, firstStart, firstEvidenceSide), firstOriginalSide: firstEvidenceSide, secondOriginalRank: fromStartRank(total, secondStart, secondEvidenceSide), secondOriginalSide: secondEvidenceSide, firstRequestedSide, secondRequestedSide };
    }
    return { kind: 'ORIGINAL_RANKS_FROM_FINAL_INTERCHANGE', total, firstFinalRank: fromStartRank(total, secondStart, firstEvidenceSide), firstFinalSide: firstEvidenceSide, secondFinalRank: fromStartRank(total, firstStart, secondEvidenceSide), secondFinalSide: secondEvidenceSide, firstRequestedSide, secondRequestedSide };
  }

  if (prototypeId === 'RNK-CP003-PROT-TOTAL-FROM-INTERCHANGE-RANK-CHANGE') {
    const total = randomInt(rng, 18, 78);
    let firstStart = randomInt(rng, 1, total);
    let secondStart = randomInt(rng, 1, total);
    if (firstStart === secondStart) secondStart = secondStart === total ? secondStart - 1 : secondStart + 1;
    if (Math.abs(seed) % 6 === 0) [firstStart, secondStart] = [1, total];
    return { kind: 'TOTAL_FROM_INTERCHANGE_RANK_CHANGE', firstOriginalRankFromStart: firstStart, secondOriginalRankFromEnd: total - secondStart + 1, firstFinalRankFromStart: secondStart };
  }

  if (prototypeId === 'RNK-CP003-PROT-FINAL-RANK-AFTER-SINGLE-MOVEMENT' || prototypeId === 'RNK-CP003-PROT-ORIGINAL-RANK-FROM-FINAL-AND-MOVEMENT') {
    const total = randomInt(rng, 12, 70);
    const direction: RnkMovementDirection = side(0) === 'START' ? 'TOWARD_START' : 'TOWARD_END';
    const distance = randomInt(rng, 1, Math.min(12, total - 1));
    const originalStart = direction === 'TOWARD_START' ? randomInt(rng, distance + 1, total) : randomInt(rng, 1, total - distance);
    const finalStart = originalStart + signedDelta(direction, distance);
    const evidenceSide = side(1);
    const requestedSide = side(2 + (Math.abs(seed) % 3 === 0 ? 1 : 0));
    if (prototypeId === 'RNK-CP003-PROT-FINAL-RANK-AFTER-SINGLE-MOVEMENT') return { kind: 'FINAL_RANK_AFTER_SINGLE_MOVEMENT', total, originalRank: fromStartRank(total, originalStart, evidenceSide), originalSide: evidenceSide, direction, distance, requestedSide };
    return { kind: 'ORIGINAL_RANK_FROM_FINAL_AND_MOVEMENT', total, finalRank: fromStartRank(total, finalStart, evidenceSide), finalSide: evidenceSide, direction, distance, requestedSide };
  }

  if (prototypeId === 'RNK-CP003-PROT-PEOPLE-PASSED-FROM-RANK-CHANGE') {
    const total = randomInt(rng, 12, 70);
    let originalStart = randomInt(rng, 1, total);
    let finalStart = randomInt(rng, 1, total);
    if (finalStart === originalStart) finalStart = finalStart === total ? finalStart - 1 : finalStart + 1;
    if (Math.abs(seed) % 7 === 0) [originalStart, finalStart] = [total, 1];
    const originalSide = side(0);
    const finalSide = side(Math.abs(seed) % 3 === 0 ? 0 : 1);
    return { kind: 'PEOPLE_PASSED_FROM_RANK_CHANGE', total, originalRank: fromStartRank(total, originalStart, originalSide), originalSide, finalRank: fromStartRank(total, finalStart, finalSide), finalSide };
  }

  if (prototypeId === 'RNK-CP003-PROT-TARGET-RANK-AFTER-INSERTION') {
    const totalBefore = randomInt(rng, 10, 60);
    const targetStart = randomInt(rng, 1, totalBefore);
    const insertedStart = randomInt(rng, 1, totalBefore + 1);
    const targetOriginalSide = side(0);
    const insertedFinalSide = side(1);
    const requestedSide = side(2 + (Math.abs(seed) % 4 === 0 ? 1 : 0));
    return { kind: 'TARGET_RANK_AFTER_INSERTION', totalBefore, targetOriginalRank: fromStartRank(totalBefore, targetStart, targetOriginalSide), targetOriginalSide, insertedFinalRank: fromStartRank(totalBefore + 1, insertedStart, insertedFinalSide), insertedFinalSide, requestedSide };
  }

  if (prototypeId === 'RNK-CP003-PROT-TARGET-RANK-AFTER-REMOVAL') {
    const totalBefore = randomInt(rng, 11, 61);
    const targetStart = randomInt(rng, 1, totalBefore);
    let removedStart = randomInt(rng, 1, totalBefore);
    if (removedStart === targetStart) removedStart = removedStart === totalBefore ? removedStart - 1 : removedStart + 1;
    const targetOriginalSide = side(0);
    const removedOriginalSide = side(1);
    const requestedSide = side(2 + (Math.abs(seed) % 4 === 0 ? 1 : 0));
    return { kind: 'TARGET_RANK_AFTER_REMOVAL', totalBefore, targetOriginalRank: fromStartRank(totalBefore, targetStart, targetOriginalSide), targetOriginalSide, removedOriginalRank: fromStartRank(totalBefore, removedStart, removedOriginalSide), removedOriginalSide, requestedSide };
  }

  const total = randomInt(rng, 14, 72);
  const originalStart = randomInt(rng, 3, total - 2);
  const firstDirection: RnkMovementDirection = side(0) === 'START' ? 'TOWARD_START' : 'TOWARD_END';
  const firstRoom = firstDirection === 'TOWARD_START' ? originalStart - 1 : total - originalStart;
  const firstDistance = randomInt(rng, 1, Math.min(8, firstRoom));
  const afterFirst = originalStart + signedDelta(firstDirection, firstDistance);
  let secondDirection: RnkMovementDirection = side(1) === 'START' ? 'TOWARD_START' : 'TOWARD_END';
  let secondRoom = secondDirection === 'TOWARD_START' ? afterFirst - 1 : total - afterFirst;
  if (secondRoom < 1) {
    secondDirection = secondDirection === 'TOWARD_START' ? 'TOWARD_END' : 'TOWARD_START';
    secondRoom = secondDirection === 'TOWARD_START' ? afterFirst - 1 : total - afterFirst;
  }
  const secondDistance = randomInt(rng, 1, Math.min(8, secondRoom));
  const originalSide = side(2);
  const requestedSide = side(3 + (Math.abs(seed) % 3 === 0 ? 1 : 0));
  return { kind: 'FINAL_RANK_AFTER_SEQUENTIAL_MOVES', total, originalRank: fromStartRank(total, originalStart, originalSide), originalSide, firstDirection, firstDistance, secondDirection, secondDistance, requestedSide };
}

export function contextsForPrototype(prototypeId: RnkCp003PrototypeId): readonly RnkCp003ContextVocabulary[] {
  if (prototypeId === 'RNK-CP003-PROT-TARGET-RANK-AFTER-INSERTION' || prototypeId === 'RNK-CP003-PROT-TARGET-RANK-AFTER-REMOVAL') return RNK_CP003_CONTEXTS.filter((context) => context.id !== 'RACE_ORDER');
  return RNK_CP003_CONTEXTS;
}
