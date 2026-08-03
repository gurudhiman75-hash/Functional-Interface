import {
  RNK_CP003_CONTEXTS,
  RNK_CP003_NAMES,
  fromStartRank,
  hashText,
  randomInt,
  toStartRank,
  type RnkCp003ContextVocabulary,
  type RnkMovementDirection,
  type RnkSide,
} from './cp003-model';

export const RNK_CP003_SOURCE_PROTOTYPE_IDS = [
  'RNK-CP003-PROT-TARGET-RANK-AFTER-ANOTHER-PERSON-MOVES',
  'RNK-CP003-PROT-ORIGINAL-TARGET-RANK-BEFORE-ANOTHER-PERSON-MOVED',
  'RNK-CP003-PROT-FINAL-RANK-AFTER-MOVEMENT-AND-MEMBERSHIP-CHANGE',
  'RNK-CP003-PROT-ORIGINAL-RANK-FROM-FINAL-AFTER-MOVEMENT-AND-MEMBERSHIP-CHANGE',
] as const;

export type RnkCp003SourcePrototypeId = (typeof RNK_CP003_SOURCE_PROTOTYPE_IDS)[number];
type MembershipKind = 'INSERT' | 'REMOVE';
type MembershipSide = 'START' | 'END';
type OperationOrder = 'MOVE_THEN_CHANGE' | 'CHANGE_THEN_MOVE';

export type RnkCp003SourceEvidence =
  | {
      readonly kind: 'TARGET_RANK_AFTER_ANOTHER_PERSON_MOVES';
      readonly total: number;
      readonly moverOriginalRankFromStart: number;
      readonly moverFinalRankFromStart: number;
      readonly targetOriginalRank: number;
      readonly targetOriginalSide: RnkSide;
      readonly requestedSide: RnkSide;
    }
  | {
      readonly kind: 'ORIGINAL_TARGET_RANK_BEFORE_ANOTHER_PERSON_MOVED';
      readonly total: number;
      readonly moverOriginalRankFromStart: number;
      readonly moverFinalRankFromStart: number;
      readonly targetFinalRank: number;
      readonly targetFinalSide: RnkSide;
      readonly requestedSide: RnkSide;
    }
  | {
      readonly kind: 'FINAL_RANK_AFTER_MOVEMENT_AND_MEMBERSHIP_CHANGE';
      readonly totalBefore: number;
      readonly originalRank: number;
      readonly originalSide: RnkSide;
      readonly movementDirection: RnkMovementDirection;
      readonly movementDistance: number;
      readonly membershipKind: MembershipKind;
      readonly membershipSide: MembershipSide;
      readonly membershipCount: number;
      readonly operationOrder: OperationOrder;
      readonly requestedSide: RnkSide;
    }
  | {
      readonly kind: 'ORIGINAL_RANK_FROM_FINAL_AFTER_MOVEMENT_AND_MEMBERSHIP_CHANGE';
      readonly totalBefore: number;
      readonly finalRank: number;
      readonly finalSide: RnkSide;
      readonly movementDirection: RnkMovementDirection;
      readonly movementDistance: number;
      readonly membershipKind: MembershipKind;
      readonly membershipSide: MembershipSide;
      readonly membershipCount: number;
      readonly operationOrder: OperationOrder;
      readonly requestedSide: RnkSide;
    };

export interface RnkCp003SourceOption {
  readonly answer: number;
  readonly label: string;
  readonly misconceptionId: string;
  readonly explanation: string;
}

export interface RnkCp003SourceQuestion {
  readonly packageId: 'RNK-001';
  readonly checkpointId: 'RNK-CP-003';
  readonly prototypeId: RnkCp003SourcePrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: 'en-IN';
  readonly contextId: string;
  readonly stem: string;
  readonly displayedEvidence: RnkCp003SourceEvidence;
  readonly answer: number;
  readonly options: readonly RnkCp003SourceOption[];
  readonly correctIndex: number;
  readonly difficulty: 'EASY' | 'MEDIUM' | 'HARD';
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

interface MixedOperationState {
  readonly total: number;
  readonly targetStart: number;
}

function createSourceRng(prototypeId: RnkCp003SourcePrototypeId, seed: number): () => number {
  let state = (hashText(`${prototypeId}:${seed}:source-wave`) || 0x9e3779b9) >>> 0;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x100000000;
  };
}

function sideFor(seed: number, offset: number): RnkSide {
  return (Math.abs(seed) + offset) % 2 === 0 ? 'START' : 'END';
}

function assertRank(total: number, rank: number, label: string): void {
  if (!Number.isInteger(total) || total < 2) throw new Error(`Invalid total ${total}`);
  if (!Number.isInteger(rank) || rank < 1 || rank > total) throw new Error(`${label} ${rank} is outside 1..${total}`);
}

function movementDelta(direction: RnkMovementDirection, distance: number): number {
  if (!Number.isInteger(distance) || distance < 1) throw new Error(`Invalid movement distance ${distance}`);
  return direction === 'TOWARD_START' ? -distance : distance;
}

function targetAfterAnotherMove(
  total: number,
  targetOriginalStart: number,
  moverOriginalStart: number,
  moverFinalStart: number,
): number {
  assertRank(total, targetOriginalStart, 'target original rank');
  assertRank(total, moverOriginalStart, 'mover original rank');
  assertRank(total, moverFinalStart, 'mover final rank');
  if (moverOriginalStart === moverFinalStart) throw new Error('The moving person must change rank');
  if (targetOriginalStart === moverOriginalStart) throw new Error('The target cannot be the moving person');
  let target = targetOriginalStart;
  if (moverOriginalStart < target) target -= 1;
  if (moverFinalStart <= target) target += 1;
  return target;
}

function applyMembershipChange(
  state: MixedOperationState,
  kind: MembershipKind,
  side: MembershipSide,
  count: number,
): MixedOperationState {
  if (!Number.isInteger(count) || count < 1) throw new Error(`Invalid membership count ${count}`);
  if (kind === 'INSERT') {
    return {
      total: state.total + count,
      targetStart: side === 'START' ? state.targetStart + count : state.targetStart,
    };
  }
  if (state.total - count < 2) throw new Error('Removal leaves too few people');
  if (side === 'START') {
    if (count >= state.targetStart) throw new Error('Removal from the start would remove the target');
    return { total: state.total - count, targetStart: state.targetStart - count };
  }
  if (count > state.total - state.targetStart) throw new Error('Removal from the end would remove the target');
  return { total: state.total - count, targetStart: state.targetStart };
}

function applyMovement(
  state: MixedOperationState,
  direction: RnkMovementDirection,
  distance: number,
): MixedOperationState {
  const targetStart = state.targetStart + movementDelta(direction, distance);
  assertRank(state.total, targetStart, 'rank after movement');
  return { total: state.total, targetStart };
}

export function replayMixedTransformations(
  totalBefore: number,
  originalStart: number,
  direction: RnkMovementDirection,
  distance: number,
  kind: MembershipKind,
  side: MembershipSide,
  count: number,
  order: OperationOrder,
): MixedOperationState {
  let state: MixedOperationState = { total: totalBefore, targetStart: originalStart };
  assertRank(totalBefore, originalStart, 'original rank');
  if (order === 'MOVE_THEN_CHANGE') {
    state = applyMovement(state, direction, distance);
    state = applyMembershipChange(state, kind, side, count);
  } else {
    state = applyMembershipChange(state, kind, side, count);
    state = applyMovement(state, direction, distance);
  }
  return state;
}

function solveOriginalTargetRank(
  evidence: Extract<RnkCp003SourceEvidence, { kind: 'ORIGINAL_TARGET_RANK_BEFORE_ANOTHER_PERSON_MOVED' }>,
): number {
  const targetFinalStart = toStartRank(evidence.total, evidence.targetFinalRank, evidence.targetFinalSide);
  const candidates = Array.from({ length: evidence.total }, (_, index) => index + 1).filter((candidate) => {
    if (candidate === evidence.moverOriginalRankFromStart) return false;
    try {
      return targetAfterAnotherMove(
        evidence.total,
        candidate,
        evidence.moverOriginalRankFromStart,
        evidence.moverFinalRankFromStart,
      ) === targetFinalStart;
    } catch {
      return false;
    }
  });
  if (candidates.length !== 1) throw new Error(`Expected one original target rank, found ${candidates.length}`);
  return fromStartRank(evidence.total, candidates[0], evidence.requestedSide);
}

function finalTotalForMixed(
  evidence: Extract<
    RnkCp003SourceEvidence,
    {
      kind:
        | 'FINAL_RANK_AFTER_MOVEMENT_AND_MEMBERSHIP_CHANGE'
        | 'ORIGINAL_RANK_FROM_FINAL_AFTER_MOVEMENT_AND_MEMBERSHIP_CHANGE';
    }
  >,
): number {
  return evidence.membershipKind === 'INSERT'
    ? evidence.totalBefore + evidence.membershipCount
    : evidence.totalBefore - evidence.membershipCount;
}

function solveOriginalMixedRank(
  evidence: Extract<
    RnkCp003SourceEvidence,
    { kind: 'ORIGINAL_RANK_FROM_FINAL_AFTER_MOVEMENT_AND_MEMBERSHIP_CHANGE' }
  >,
): number {
  const totalAfter = finalTotalForMixed(evidence);
  const finalStart = toStartRank(totalAfter, evidence.finalRank, evidence.finalSide);
  const candidates = Array.from({ length: evidence.totalBefore }, (_, index) => index + 1).filter((candidate) => {
    try {
      return replayMixedTransformations(
        evidence.totalBefore,
        candidate,
        evidence.movementDirection,
        evidence.movementDistance,
        evidence.membershipKind,
        evidence.membershipSide,
        evidence.membershipCount,
        evidence.operationOrder,
      ).targetStart === finalStart;
    } catch {
      return false;
    }
  });
  if (candidates.length !== 1) throw new Error(`Expected one original mixed rank, found ${candidates.length}`);
  return fromStartRank(evidence.totalBefore, candidates[0], evidence.requestedSide);
}

export function solveCp003SourceIndependently(evidence: RnkCp003SourceEvidence): number {
  switch (evidence.kind) {
    case 'TARGET_RANK_AFTER_ANOTHER_PERSON_MOVES': {
      const targetStart = toStartRank(evidence.total, evidence.targetOriginalRank, evidence.targetOriginalSide);
      const finalStart = targetAfterAnotherMove(
        evidence.total,
        targetStart,
        evidence.moverOriginalRankFromStart,
        evidence.moverFinalRankFromStart,
      );
      return fromStartRank(evidence.total, finalStart, evidence.requestedSide);
    }
    case 'ORIGINAL_TARGET_RANK_BEFORE_ANOTHER_PERSON_MOVED':
      return solveOriginalTargetRank(evidence);
    case 'FINAL_RANK_AFTER_MOVEMENT_AND_MEMBERSHIP_CHANGE': {
      const originalStart = toStartRank(evidence.totalBefore, evidence.originalRank, evidence.originalSide);
      const finalState = replayMixedTransformations(
        evidence.totalBefore,
        originalStart,
        evidence.movementDirection,
        evidence.movementDistance,
        evidence.membershipKind,
        evidence.membershipSide,
        evidence.membershipCount,
        evidence.operationOrder,
      );
      return fromStartRank(finalState.total, finalState.targetStart, evidence.requestedSide);
    }
    case 'ORIGINAL_RANK_FROM_FINAL_AFTER_MOVEMENT_AND_MEMBERSHIP_CHANGE':
      return solveOriginalMixedRank(evidence);
  }
}

function buildOtherMoveEvidence(
  prototypeId: RnkCp003SourcePrototypeId,
  rng: () => number,
  seed: number,
): RnkCp003SourceEvidence {
  const total = randomInt(rng, 12, 70);
  let moverOriginal = randomInt(rng, 1, total);
  let moverFinal = randomInt(rng, 1, total);
  if (moverFinal === moverOriginal) moverFinal = moverFinal === total ? moverFinal - 1 : moverFinal + 1;
  let targetOriginal = randomInt(rng, 1, total);
  while (targetOriginal === moverOriginal) targetOriginal = randomInt(rng, 1, total);
  if (Math.abs(seed) % 6 === 0) {
    moverOriginal = 1;
    moverFinal = total;
    targetOriginal = randomInt(rng, 2, total - 1);
  }
  const targetFinal = targetAfterAnotherMove(total, targetOriginal, moverOriginal, moverFinal);
  if (prototypeId === 'RNK-CP003-PROT-TARGET-RANK-AFTER-ANOTHER-PERSON-MOVES') {
    const targetOriginalSide = sideFor(seed, 0);
    return {
      kind: 'TARGET_RANK_AFTER_ANOTHER_PERSON_MOVES',
      total,
      moverOriginalRankFromStart: moverOriginal,
      moverFinalRankFromStart: moverFinal,
      targetOriginalRank: fromStartRank(total, targetOriginal, targetOriginalSide),
      targetOriginalSide,
      requestedSide: sideFor(seed, 1),
    };
  }
  const targetFinalSide = sideFor(seed, 0);
  return {
    kind: 'ORIGINAL_TARGET_RANK_BEFORE_ANOTHER_PERSON_MOVED',
    total,
    moverOriginalRankFromStart: moverOriginal,
    moverFinalRankFromStart: moverFinal,
    targetFinalRank: fromStartRank(total, targetFinal, targetFinalSide),
    targetFinalSide,
    requestedSide: sideFor(seed, 1),
  };
}

interface BuiltMixedCase {
  readonly totalBefore: number;
  readonly originalStart: number;
  readonly movementDirection: RnkMovementDirection;
  readonly movementDistance: number;
  readonly membershipKind: MembershipKind;
  readonly membershipSide: MembershipSide;
  readonly membershipCount: number;
  readonly operationOrder: OperationOrder;
  readonly finalState: MixedOperationState;
}

function buildMixedCase(rng: () => number, seed: number): BuiltMixedCase {
  const totalBefore = randomInt(rng, 24, 70);
  const originalStart = randomInt(rng, 10, totalBefore - 9);
  const membershipKind: MembershipKind = Math.abs(seed) % 4 < 2 ? 'INSERT' : 'REMOVE';
  const membershipSide: MembershipSide = Math.abs(seed) % 2 === 0 ? 'START' : 'END';
  const membershipCount = randomInt(rng, 1, 4);
  const operationOrder: OperationOrder = Math.abs(seed) % 3 === 0 ? 'CHANGE_THEN_MOVE' : 'MOVE_THEN_CHANGE';
  const movementDirection: RnkMovementDirection = sideFor(seed, 2) === 'START' ? 'TOWARD_START' : 'TOWARD_END';
  const movementDistance = randomInt(rng, 1, 4);
  const finalState = replayMixedTransformations(
    totalBefore,
    originalStart,
    movementDirection,
    movementDistance,
    membershipKind,
    membershipSide,
    membershipCount,
    operationOrder,
  );
  return {
    totalBefore,
    originalStart,
    movementDirection,
    movementDistance,
    membershipKind,
    membershipSide,
    membershipCount,
    operationOrder,
    finalState,
  };
}

function buildMixedEvidence(
  prototypeId: RnkCp003SourcePrototypeId,
  rng: () => number,
  seed: number,
): RnkCp003SourceEvidence {
  const built = buildMixedCase(rng, seed);
  if (prototypeId === 'RNK-CP003-PROT-FINAL-RANK-AFTER-MOVEMENT-AND-MEMBERSHIP-CHANGE') {
    const originalSide = sideFor(seed, 0);
    return {
      kind: 'FINAL_RANK_AFTER_MOVEMENT_AND_MEMBERSHIP_CHANGE',
      totalBefore: built.totalBefore,
      originalRank: fromStartRank(built.totalBefore, built.originalStart, originalSide),
      originalSide,
      movementDirection: built.movementDirection,
      movementDistance: built.movementDistance,
      membershipKind: built.membershipKind,
      membershipSide: built.membershipSide,
      membershipCount: built.membershipCount,
      operationOrder: built.operationOrder,
      requestedSide: sideFor(seed, 1),
    };
  }
  const finalSide = sideFor(seed, 0);
  return {
    kind: 'ORIGINAL_RANK_FROM_FINAL_AFTER_MOVEMENT_AND_MEMBERSHIP_CHANGE',
    totalBefore: built.totalBefore,
    finalRank: fromStartRank(built.finalState.total, built.finalState.targetStart, finalSide),
    finalSide,
    movementDirection: built.movementDirection,
    movementDistance: built.movementDistance,
    membershipKind: built.membershipKind,
    membershipSide: built.membershipSide,
    membershipCount: built.membershipCount,
    operationOrder: built.operationOrder,
    requestedSide: sideFor(seed, 1),
  };
}

function evidenceForSource(
  prototypeId: RnkCp003SourcePrototypeId,
  rng: () => number,
  seed: number,
): RnkCp003SourceEvidence {
  return prototypeId.includes('ANOTHER-PERSON')
    ? buildOtherMoveEvidence(prototypeId, rng, seed)
    : buildMixedEvidence(prototypeId, rng, seed);
}

function ordinal(rank: number): string {
  const mod100 = rank % 100;
  const suffix = mod100 >= 11 && mod100 <= 13
    ? 'th'
    : rank % 10 === 1
      ? 'st'
      : rank % 10 === 2
        ? 'nd'
        : rank % 10 === 3
          ? 'rd'
          : 'th';
  return `${rank}${suffix}`;
}

function phraseForSide(context: RnkCp003ContextVocabulary, side: RnkSide): string {
  return side === 'START' ? context.startPhrase : context.endPhrase;
}

function boundaryForSide(context: RnkCp003ContextVocabulary, side: MembershipSide): string {
  return phraseForSide(context, side).replace('from the ', '');
}

function movementPhrase(
  context: RnkCp003ContextVocabulary,
  direction: RnkMovementDirection,
  distance: number,
): string {
  return `${direction === 'TOWARD_START' ? context.towardStartMovement : context.towardEndMovement} by ${distance} ${distance === 1 ? 'place' : 'places'}`;
}

function membershipPhrase(
  context: RnkCp003ContextVocabulary,
  kind: MembershipKind,
  side: MembershipSide,
  count: number,
): string {
  const boundary = boundaryForSide(context, side);
  if (kind === 'INSERT') {
    return `${count} new ${count === 1 ? context.memberSingular : context.memberPlural} ${count === 1 ? 'joins' : 'join'} at the ${boundary}`;
  }
  return `${count} ${count === 1 ? context.memberSingular : context.memberPlural} ${count === 1 ? 'leaves' : 'leave'} from the ${boundary}`;
}

function stemForSource(
  evidence: RnkCp003SourceEvidence,
  context: RnkCp003ContextVocabulary,
  moverName: string,
  targetName: string,
): string {
  switch (evidence.kind) {
    case 'TARGET_RANK_AFTER_ANOTHER_PERSON_MOVES':
      return `In a ${context.group} of ${evidence.total} ${context.memberPlural}, ${targetName} is ${ordinal(evidence.targetOriginalRank)} ${phraseForSide(context, evidence.targetOriginalSide)}. ${moverName} moves from ${ordinal(evidence.moverOriginalRankFromStart)} ${context.startPhrase} to ${ordinal(evidence.moverFinalRankFromStart)} ${context.startPhrase}. What is ${targetName}'s new rank ${phraseForSide(context, evidence.requestedSide)}?`;
    case 'ORIGINAL_TARGET_RANK_BEFORE_ANOTHER_PERSON_MOVED':
      return `In a ${context.group} of ${evidence.total} ${context.memberPlural}, ${moverName} moved from ${ordinal(evidence.moverOriginalRankFromStart)} ${context.startPhrase} to ${ordinal(evidence.moverFinalRankFromStart)} ${context.startPhrase}. After this, ${targetName} is ${ordinal(evidence.targetFinalRank)} ${phraseForSide(context, evidence.targetFinalSide)}. What was ${targetName}'s original rank ${phraseForSide(context, evidence.requestedSide)}?`;
    case 'FINAL_RANK_AFTER_MOVEMENT_AND_MEMBERSHIP_CHANGE': {
      const move = `${targetName} ${movementPhrase(context, evidence.movementDirection, evidence.movementDistance)}`;
      const change = membershipPhrase(context, evidence.membershipKind, evidence.membershipSide, evidence.membershipCount);
      const sequence = evidence.operationOrder === 'MOVE_THEN_CHANGE'
        ? `First, ${move}; then ${change}`
        : `First, ${change}; then ${move}`;
      return `A ${context.group} initially has ${evidence.totalBefore} ${context.memberPlural}. ${targetName} is ${ordinal(evidence.originalRank)} ${phraseForSide(context, evidence.originalSide)}. ${sequence}. What is ${targetName}'s final rank ${phraseForSide(context, evidence.requestedSide)}?`;
    }
    case 'ORIGINAL_RANK_FROM_FINAL_AFTER_MOVEMENT_AND_MEMBERSHIP_CHANGE': {
      const move = `${targetName} ${movementPhrase(context, evidence.movementDirection, evidence.movementDistance)}`;
      const change = membershipPhrase(context, evidence.membershipKind, evidence.membershipSide, evidence.membershipCount);
      const sequence = evidence.operationOrder === 'MOVE_THEN_CHANGE'
        ? `First, ${move}; then ${change}`
        : `First, ${change}; then ${move}`;
      return `A ${context.group} initially has ${evidence.totalBefore} ${context.memberPlural}. ${sequence}. After both changes, ${targetName} is ${ordinal(evidence.finalRank)} ${phraseForSide(context, evidence.finalSide)}. What was ${targetName}'s original rank ${phraseForSide(context, evidence.requestedSide)}?`;
    }
  }
}

function rangeForEvidence(
  evidence: RnkCp003SourceEvidence,
): { readonly minimum: number; readonly maximum: number } {
  if (evidence.kind === 'ORIGINAL_RANK_FROM_FINAL_AFTER_MOVEMENT_AND_MEMBERSHIP_CHANGE') {
    return { minimum: 1, maximum: evidence.totalBefore };
  }
  if (evidence.kind === 'FINAL_RANK_AFTER_MOVEMENT_AND_MEMBERSHIP_CHANGE') {
    return { minimum: 1, maximum: finalTotalForMixed(evidence) };
  }
  return { minimum: 1, maximum: evidence.total };
}

function buildOptions(
  evidence: RnkCp003SourceEvidence,
  answer: number,
  correctIndex: number,
): readonly RnkCp003SourceOption[] {
  const { minimum, maximum } = rangeForEvidence(evidence);
  const candidates: Array<[number, string, string]> = [];
  const add = (value: number, misconceptionId: string, explanation: string): void => {
    if (value < minimum || value > maximum || value === answer || candidates.some(([existing]) => existing === value)) return;
    candidates.push([value, misconceptionId, explanation]);
  };

  if (evidence.kind === 'TARGET_RANK_AFTER_ANOTHER_PERSON_MOVES') {
    add(
      fromStartRank(
        evidence.total,
        toStartRank(evidence.total, evidence.targetOriginalRank, evidence.targetOriginalSide),
        evidence.requestedSide,
      ),
      'IGNORED_OTHER_PERSON_MOVEMENT',
      'keeps the target at the old position and ignores whether the moving person crosses it',
    );
  } else if (evidence.kind === 'ORIGINAL_TARGET_RANK_BEFORE_ANOTHER_PERSON_MOVED') {
    add(
      fromStartRank(
        evidence.total,
        toStartRank(evidence.total, evidence.targetFinalRank, evidence.targetFinalSide),
        evidence.requestedSide,
      ),
      'REPORTED_FINAL_AS_ORIGINAL',
      'reports the displayed final rank without reversing the other person’s movement',
    );
  } else {
    const displayedTotal = evidence.kind === 'FINAL_RANK_AFTER_MOVEMENT_AND_MEMBERSHIP_CHANGE'
      ? evidence.totalBefore
      : finalTotalForMixed(evidence);
    const displayedRank = evidence.kind === 'FINAL_RANK_AFTER_MOVEMENT_AND_MEMBERSHIP_CHANGE'
      ? evidence.originalRank
      : evidence.finalRank;
    const displayedSide = evidence.kind === 'FINAL_RANK_AFTER_MOVEMENT_AND_MEMBERSHIP_CHANGE'
      ? evidence.originalSide
      : evidence.finalSide;
    add(
      fromStartRank(displayedTotal, toStartRank(displayedTotal, displayedRank, displayedSide), evidence.requestedSide),
      'IGNORED_BOTH_TRANSFORMATIONS',
      'keeps the displayed rank and ignores both transformations',
    );
  }

  add(answer - 1, 'OFF_BY_ONE_LOW', 'stops one position before the correctly replayed rank');
  add(answer + 1, 'OFF_BY_ONE_HIGH', 'moves one position beyond the correctly replayed rank');
  add(maximum - answer + 1, 'REVERSED_REFERENCE_END', 'reads the position from the opposite reference end');
  for (let delta = 2; candidates.length < 3 && delta <= maximum; delta += 1) {
    add(answer - delta, 'NEARBY_VALID_RANK', 'is nearby but does not match the complete transformation ledger');
    add(answer + delta, 'NEARBY_VALID_RANK', 'is nearby but does not match the complete transformation ledger');
  }
  if (candidates.length < 3) throw new Error(`Unable to construct three distractors for ${answer}`);
  const wrong = candidates.slice(0, 3).map(([value, misconceptionId, explanation]) => ({
    answer: value,
    label: String(value),
    misconceptionId,
    explanation,
  }));
  const correct: RnkCp003SourceOption = {
    answer,
    label: String(answer),
    misconceptionId: 'CORRECT',
    explanation: 'matches the complete transformation replay and requested reference end',
  };
  const options = [...wrong];
  options.splice(correctIndex, 0, correct);
  return options;
}

function explanationForSource(
  evidence: RnkCp003SourceEvidence,
  context: RnkCp003ContextVocabulary,
  targetName: string,
  answer: number,
): RnkCp003SourceQuestion['explanation'] {
  if (
    evidence.kind === 'TARGET_RANK_AFTER_ANOTHER_PERSON_MOVES'
    || evidence.kind === 'ORIGINAL_TARGET_RANK_BEFORE_ANOTHER_PERSON_MOVED'
  ) {
    const isDirect = evidence.kind === 'TARGET_RANK_AFTER_ANOTHER_PERSON_MOVES';
    const originalStart = isDirect
      ? toStartRank(evidence.total, evidence.targetOriginalRank, evidence.targetOriginalSide)
      : toStartRank(evidence.total, solveOriginalTargetRank(evidence), evidence.requestedSide);
    const finalStart = targetAfterAnotherMove(
      evidence.total,
      originalStart,
      evidence.moverOriginalRankFromStart,
      evidence.moverFinalRankFromStart,
    );
    return {
      keyRule: 'When one person changes position, another person shifts by one place only if the moving person crosses that person; otherwise the other person’s rank is unchanged.',
      stepByStepSolution: [
        `${targetName}'s original position from the ${boundaryForSide(context, 'START')} is ${originalStart}.`,
        `The moving person changes from position ${evidence.moverOriginalRankFromStart} to position ${evidence.moverFinalRankFromStart}.`,
        `Removing that person and inserting them at the new position places ${targetName} at position ${finalStart}.`,
        isDirect
          ? `Convert position ${finalStart} to the requested end to get ${answer}.`
          : `Reverse the one-place effect and convert the recovered original position to get ${answer}.`,
      ],
      examSpeedShortcut: 'Check only whether the moving person crosses the target: crossed means a one-place shift; not crossed means no shift.',
      optionAnalysis: [],
      conclusion: `Therefore, ${targetName}'s ${isDirect ? 'new' : 'original'} rank is ${answer}.`,
    };
  }

  const originalStart = evidence.kind === 'FINAL_RANK_AFTER_MOVEMENT_AND_MEMBERSHIP_CHANGE'
    ? toStartRank(evidence.totalBefore, evidence.originalRank, evidence.originalSide)
    : toStartRank(evidence.totalBefore, solveOriginalMixedRank(evidence), evidence.requestedSide);
  const finalState = replayMixedTransformations(
    evidence.totalBefore,
    originalStart,
    evidence.movementDirection,
    evidence.movementDistance,
    evidence.membershipKind,
    evidence.membershipSide,
    evidence.membershipCount,
    evidence.operationOrder,
  );
  const movementSign = evidence.movementDirection === 'TOWARD_START' ? '-' : '+';
  const membershipEffect = evidence.membershipKind === 'INSERT'
    ? evidence.membershipSide === 'START'
      ? `adds ${evidence.membershipCount} to the rank from the reference start`
      : 'does not change the rank from the reference start'
    : evidence.membershipSide === 'START'
      ? `subtracts ${evidence.membershipCount} from the rank from the reference start`
      : 'does not change the rank from the reference start';
  const isDirect = evidence.kind === 'FINAL_RANK_AFTER_MOVEMENT_AND_MEMBERSHIP_CHANGE';
  return {
    keyRule: 'For mixed changes, keep one running rank from the same reference end and apply the operations in the exact stated order.',
    stepByStepSolution: [
      `The original position from the reference start is ${originalStart}.`,
      `The movement contributes ${movementSign}${evidence.movementDistance}; the membership change ${membershipEffect}.`,
      `Applying the stated order gives position ${finalState.targetStart} in a group of ${finalState.total}.`,
      isDirect
        ? `Convert the final position to the requested end to get ${answer}.`
        : `Only one valid original position produces the displayed final position; it converts to ${answer}.`,
    ],
    examSpeedShortcut: 'Use a two-entry ledger—current total and current rank—and update both after each operation.',
    optionAnalysis: [],
    conclusion: `Therefore, ${targetName}'s ${isDirect ? 'final' : 'original'} rank is ${answer}.`,
  };
}

function difficultyForSource(evidence: RnkCp003SourceEvidence): 'EASY' | 'MEDIUM' | 'HARD' {
  if (evidence.kind.includes('ANOTHER_PERSON')) {
    return evidence.moverOriginalRankFromStart < evidence.moverFinalRankFromStart ? 'MEDIUM' : 'EASY';
  }
  return evidence.operationOrder === 'CHANGE_THEN_MOVE' || evidence.membershipKind === 'REMOVE'
    ? 'HARD'
    : 'MEDIUM';
}

export function generateRnkCp003SourceQuestion(
  prototypeId: RnkCp003SourcePrototypeId,
  seed: number,
): RnkCp003SourceQuestion {
  const rng = createSourceRng(prototypeId, seed);
  const contexts = RNK_CP003_CONTEXTS.filter((context) => context.id !== 'RACE_ORDER');
  const context = contexts[randomInt(rng, 0, contexts.length - 1)];
  const moverIndex = randomInt(rng, 0, RNK_CP003_NAMES.length - 1);
  let targetIndex = randomInt(rng, 0, RNK_CP003_NAMES.length - 1);
  if (targetIndex === moverIndex) targetIndex = (targetIndex + 1) % RNK_CP003_NAMES.length;
  const moverName = RNK_CP003_NAMES[moverIndex];
  const targetName = RNK_CP003_NAMES[targetIndex];
  const evidence = evidenceForSource(prototypeId, rng, seed);
  const answer = solveCp003SourceIndependently(evidence);
  const correctIndex = hashText(`${prototypeId}:${seed}:correct`) % 4;
  const options = buildOptions(evidence, answer, correctIndex);
  const baseExplanation = explanationForSource(evidence, context, targetName, answer);

  return {
    packageId: 'RNK-001',
    checkpointId: 'RNK-CP-003',
    prototypeId,
    permanentQlId: null,
    seed,
    locale: 'en-IN',
    contextId: context.id,
    stem: stemForSource(evidence, context, moverName, targetName),
    displayedEvidence: evidence,
    answer,
    options,
    correctIndex,
    difficulty: difficultyForSource(evidence),
    explanation: {
      ...baseExplanation,
      optionAnalysis: options.map(
        (option, index) => `Option ${index + 1} (${option.label}): ${option.explanation}.`,
      ),
    },
    mathematicalFingerprint: `${evidence.kind}|${JSON.stringify(evidence)}|answer=${answer}`,
    lifecycle: {
      reviewStatus: 'UNREVIEWED',
      questionStudioDiscoverable: false,
      questionBankStatus: 'NOT_STORED',
      testEligibility: 'INELIGIBLE',
      publiclyPublishable: false,
    },
  };
}
