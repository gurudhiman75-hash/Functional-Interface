import {
  RNK_CP003_CONTEXTS,
  RNK_CP003_NAMES,
  fromStartRank,
  toStartRank,
  type RnkCp003ContextVocabulary,
  type RnkMovementDirection,
  type RnkSide,
} from './cp003-model';
import {
  generateRnkCp003SourceQuestion,
  type RnkCp003SourceEvidence,
  type RnkCp003SourcePrototypeId,
  type RnkCp003SourceQuestion,
} from './cp003-source-wave';

type MembershipKind = 'INSERT' | 'REMOVE';
type MembershipSide = 'START' | 'END';

interface RankState {
  readonly total: number;
  readonly rankFromStart: number;
}

function contextFor(question: RnkCp003SourceQuestion): RnkCp003ContextVocabulary {
  const context = RNK_CP003_CONTEXTS.find((candidate) => candidate.id === question.contextId);
  if (!context) throw new Error(`Unknown CP-003 context ${question.contextId}`);
  return context;
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

function boundaryForSide(context: RnkCp003ContextVocabulary, side: RnkSide): string {
  return phraseForSide(context, side).replace('from the ', '');
}

function namesInStem(stem: string): readonly string[] {
  const pattern = new RegExp(`\\b(${RNK_CP003_NAMES.join('|')})\\b`, 'g');
  const matches = stem.match(pattern) ?? [];
  return matches.filter((name, index) => matches.indexOf(name) === index);
}

function movementDescription(
  context: RnkCp003ContextVocabulary,
  name: string,
  direction: RnkMovementDirection,
  distance: number,
): string {
  const movement = direction === 'TOWARD_START'
    ? context.towardStartMovement
    : context.towardEndMovement;
  return `${name} ${movement} by ${distance} ${distance === 1 ? 'place' : 'places'}`;
}

function membershipDescription(
  context: RnkCp003ContextVocabulary,
  kind: MembershipKind,
  side: MembershipSide,
  count: number,
): string {
  const member = count === 1 ? context.memberSingular : context.memberPlural;
  const verb = kind === 'INSERT'
    ? count === 1 ? 'joins' : 'join'
    : count === 1 ? 'leaves' : 'leave';
  const preposition = kind === 'INSERT' ? 'at' : 'from';
  const prefix = kind === 'INSERT' ? 'new ' : '';
  return `${count} ${prefix}${member} ${verb} ${preposition} the ${boundaryForSide(context, side)}`;
}

function applyMovement(
  state: RankState,
  direction: RnkMovementDirection,
  distance: number,
): RankState {
  return {
    total: state.total,
    rankFromStart: state.rankFromStart + (direction === 'TOWARD_START' ? -distance : distance),
  };
}

function applyMembership(
  state: RankState,
  kind: MembershipKind,
  side: MembershipSide,
  count: number,
): RankState {
  if (kind === 'INSERT') {
    return {
      total: state.total + count,
      rankFromStart: side === 'START' ? state.rankFromStart + count : state.rankFromStart,
    };
  }
  return {
    total: state.total - count,
    rankFromStart: side === 'START' ? state.rankFromStart - count : state.rankFromStart,
  };
}

function targetAfterAnotherMove(
  targetOriginalStart: number,
  moverOriginalStart: number,
  moverFinalStart: number,
): number {
  let target = targetOriginalStart;
  if (moverOriginalStart < target) target -= 1;
  if (moverFinalStart <= target) target += 1;
  return target;
}

function crossingDescription(
  targetOriginalStart: number,
  moverOriginalStart: number,
  moverFinalStart: number,
): string {
  if (moverOriginalStart < targetOriginalStart && moverFinalStart >= targetOriginalStart) {
    return 'The moving person crosses the target from ahead to behind, so the target improves by one position.';
  }
  if (moverOriginalStart > targetOriginalStart && moverFinalStart <= targetOriginalStart) {
    return 'The moving person crosses the target from behind to ahead, so the target drops by one position.';
  }
  return 'The moving person does not cross the target, so the target keeps the same position.';
}

function reviewOtherPersonQuestion(
  question: RnkCp003SourceQuestion,
  evidence: Extract<
    RnkCp003SourceEvidence,
    {
      kind:
        | 'TARGET_RANK_AFTER_ANOTHER_PERSON_MOVES'
        | 'ORIGINAL_TARGET_RANK_BEFORE_ANOTHER_PERSON_MOVED';
    }
  >,
  context: RnkCp003ContextVocabulary,
): RnkCp003SourceQuestion {
  const names = namesInStem(question.stem);
  const isDirect = evidence.kind === 'TARGET_RANK_AFTER_ANOTHER_PERSON_MOVES';
  const targetName = isDirect ? names[0] : names[1];
  const moverName = isDirect ? names[1] : names[0];
  if (!targetName || !moverName) throw new Error(`Could not recover names from ${question.prototypeId}:${question.seed}`);

  const originalStart = isDirect
    ? toStartRank(evidence.total, evidence.targetOriginalRank, evidence.targetOriginalSide)
    : toStartRank(evidence.total, question.answer, evidence.requestedSide);
  const finalStart = targetAfterAnotherMove(
    originalStart,
    evidence.moverOriginalRankFromStart,
    evidence.moverFinalRankFromStart,
  );
  const targetDisplayedRank = isDirect ? evidence.targetOriginalRank : evidence.targetFinalRank;
  const targetDisplayedSide = isDirect ? evidence.targetOriginalSide : evidence.targetFinalSide;

  const stem = isDirect
    ? `In a ${context.group} of ${evidence.total} ${context.memberPlural}, ${targetName} is ${ordinal(targetDisplayedRank)} ${phraseForSide(context, targetDisplayedSide)}. ${moverName}, who is ${ordinal(evidence.moverOriginalRankFromStart)} ${context.startPhrase}, moves to the ${ordinal(evidence.moverFinalRankFromStart)} position ${context.startPhrase}. What is ${targetName}'s new rank ${phraseForSide(context, evidence.requestedSide)}?`
    : `In a ${context.group} of ${evidence.total} ${context.memberPlural}, ${moverName}, who was ${ordinal(evidence.moverOriginalRankFromStart)} ${context.startPhrase}, moved to the ${ordinal(evidence.moverFinalRankFromStart)} position ${context.startPhrase}. After this change, ${targetName} is ${ordinal(targetDisplayedRank)} ${phraseForSide(context, targetDisplayedSide)}. What was ${targetName}'s original rank ${phraseForSide(context, evidence.requestedSide)}?`;

  const startBoundary = boundaryForSide(context, 'START');
  const explanation = {
    keyRule: 'When one person changes position, another person shifts by one place only when the moving person crosses that person. Otherwise, the other person’s rank remains unchanged.',
    stepByStepSolution: [
      isDirect
        ? `${targetName}'s original position from the ${startBoundary} is ${originalStart}.`
        : `${targetName}'s final position from the ${startBoundary} is ${finalStart}.`,
      `${moverName} changes from position ${evidence.moverOriginalRankFromStart} to position ${evidence.moverFinalRankFromStart} from the ${startBoundary}.`,
      crossingDescription(originalStart, evidence.moverOriginalRankFromStart, evidence.moverFinalRankFromStart),
      isDirect
        ? `Therefore, ${targetName} is ${finalStart} from the ${startBoundary}; converting to the requested end gives ${question.answer}.`
        : `Reversing this one-place effect gives ${targetName}'s original position as ${originalStart} from the ${startBoundary}; converting to the requested end gives ${question.answer}.`,
    ],
    examSpeedShortcut: 'Check whether the moving person crosses the target. A crossing changes the target by exactly one place; no crossing means no change.',
    optionAnalysis: question.explanation.optionAnalysis.map((analysis) =>
      analysis
        .replace('complete transformation replay and requested reference end', 'complete position change and requested end')
        .replace('opposite reference end', 'opposite end'),
    ),
    conclusion: `Therefore, ${targetName}'s ${isDirect ? 'new' : 'original'} rank is ${question.answer}.`,
  };

  return { ...question, stem, explanation };
}

function reviewMixedQuestion(
  question: RnkCp003SourceQuestion,
  evidence: Extract<
    RnkCp003SourceEvidence,
    {
      kind:
        | 'FINAL_RANK_AFTER_MOVEMENT_AND_MEMBERSHIP_CHANGE'
        | 'ORIGINAL_RANK_FROM_FINAL_AFTER_MOVEMENT_AND_MEMBERSHIP_CHANGE';
    }
  >,
  context: RnkCp003ContextVocabulary,
): RnkCp003SourceQuestion {
  const targetName = namesInStem(question.stem)[0];
  if (!targetName) throw new Error(`Could not recover target name from ${question.prototypeId}:${question.seed}`);
  const isDirect = evidence.kind === 'FINAL_RANK_AFTER_MOVEMENT_AND_MEMBERSHIP_CHANGE';
  const originalStart = isDirect
    ? toStartRank(evidence.totalBefore, evidence.originalRank, evidence.originalSide)
    : toStartRank(evidence.totalBefore, question.answer, evidence.requestedSide);
  const moveText = movementDescription(
    context,
    targetName,
    evidence.movementDirection,
    evidence.movementDistance,
  );
  const membershipText = membershipDescription(
    context,
    evidence.membershipKind,
    evidence.membershipSide,
    evidence.membershipCount,
  );
  const firstText = evidence.operationOrder === 'MOVE_THEN_CHANGE' ? moveText : membershipText;
  const secondText = evidence.operationOrder === 'MOVE_THEN_CHANGE' ? membershipText : moveText;
  const displayedRank = isDirect ? evidence.originalRank : evidence.finalRank;
  const displayedSide = isDirect ? evidence.originalSide : evidence.finalSide;
  const stem = isDirect
    ? `There are initially ${evidence.totalBefore} ${context.memberPlural} in a ${context.group}. ${targetName} is ${ordinal(displayedRank)} ${phraseForSide(context, displayedSide)}. First, ${firstText}; then ${secondText}. What is ${targetName}'s final rank ${phraseForSide(context, evidence.requestedSide)}?`
    : `There are initially ${evidence.totalBefore} ${context.memberPlural} in a ${context.group}. First, ${firstText}; then ${secondText}. After both changes, ${targetName} is ${ordinal(displayedRank)} ${phraseForSide(context, displayedSide)}. What was ${targetName}'s original rank ${phraseForSide(context, evidence.requestedSide)}?`;

  const initial: RankState = { total: evidence.totalBefore, rankFromStart: originalStart };
  const afterFirst = evidence.operationOrder === 'MOVE_THEN_CHANGE'
    ? applyMovement(initial, evidence.movementDirection, evidence.movementDistance)
    : applyMembership(initial, evidence.membershipKind, evidence.membershipSide, evidence.membershipCount);
  const afterSecond = evidence.operationOrder === 'MOVE_THEN_CHANGE'
    ? applyMembership(afterFirst, evidence.membershipKind, evidence.membershipSide, evidence.membershipCount)
    : applyMovement(afterFirst, evidence.movementDirection, evidence.movementDistance);
  const startBoundary = boundaryForSide(context, 'START');

  const explanation = {
    keyRule: `Keep both the current total and ${targetName}'s position from the ${startBoundary}. Apply the two changes in the exact order stated.`,
    stepByStepSolution: [
      `${targetName}'s original position from the ${startBoundary} is ${originalStart}, and the initial total is ${evidence.totalBefore}.`,
      `After the first change (${firstText}), the position is ${afterFirst.rankFromStart} from the ${startBoundary} and the total is ${afterFirst.total}.`,
      `After the second change (${secondText}), the position is ${afterSecond.rankFromStart} from the ${startBoundary} and the total is ${afterSecond.total}.`,
      isDirect
        ? `Convert ${afterSecond.rankFromStart} from the ${startBoundary} to the requested end. The answer is ${question.answer}.`
        : `This final state matches the displayed rank. Converting the recovered original position to the requested end gives ${question.answer}.`,
    ],
    examSpeedShortcut: 'Maintain a two-number ledger: current total and current rank from one fixed end. Update both after each change.',
    optionAnalysis: question.explanation.optionAnalysis.map((analysis) =>
      analysis
        .replace('complete transformation replay and requested reference end', 'complete two-step change and requested end')
        .replace('opposite reference end', 'opposite end'),
    ),
    conclusion: `Therefore, ${targetName}'s ${isDirect ? 'final' : 'original'} rank is ${question.answer}.`,
  };

  return { ...question, stem, explanation };
}

export function generateRnkCp003ReviewedSourceQuestion(
  prototypeId: RnkCp003SourcePrototypeId,
  seed: number,
): RnkCp003SourceQuestion {
  const question = generateRnkCp003SourceQuestion(prototypeId, seed);
  const context = contextFor(question);
  if (
    question.displayedEvidence.kind === 'TARGET_RANK_AFTER_ANOTHER_PERSON_MOVES'
    || question.displayedEvidence.kind === 'ORIGINAL_TARGET_RANK_BEFORE_ANOTHER_PERSON_MOVED'
  ) {
    return reviewOtherPersonQuestion(question, question.displayedEvidence, context);
  }
  return reviewMixedQuestion(question, question.displayedEvidence, context);
}
