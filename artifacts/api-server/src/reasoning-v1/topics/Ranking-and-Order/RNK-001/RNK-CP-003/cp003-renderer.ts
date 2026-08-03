import {
  fromStartRank,
  solveCp003Independently,
  toStartRank,
  type RnkCp003AnswerSemantic,
  type RnkCp003ContextVocabulary,
  type RnkCp003Difficulty,
  type RnkCp003DisplayedEvidence,
  type RnkCp003Option,
  type RnkMovementDirection,
  type RnkSide,
} from './cp003-model';

function sidePhrase(context: RnkCp003ContextVocabulary, side: RnkSide): string {
  return side === 'START' ? context.startPhrase : context.endPhrase;
}

function movementPhrase(context: RnkCp003ContextVocabulary, direction: RnkMovementDirection): string {
  return direction === 'TOWARD_START' ? context.towardStartMovement : context.towardEndMovement;
}

function pairFromKey(key: string): readonly [number, number] {
  const parts = key.split('|').map(Number);
  if (parts.length !== 2 || parts.some((value) => !Number.isInteger(value) || value < 1)) throw new Error(`Invalid pair key ${key}`);
  return [parts[0], parts[1]];
}

export function formatCp003Answer(answerKey: string, semantic: RnkCp003AnswerSemantic, firstName: string, secondName: string): string {
  if (semantic === 'RANK_PAIR') {
    const [first, second] = pairFromKey(answerKey);
    return `${firstName}: ${first}; ${secondName}: ${second}`;
  }
  return answerKey;
}

function ordinalSuffix(value: number): string {
  const lastTwo = value % 100;
  if (lastTwo >= 11 && lastTwo <= 13) return 'th';
  if (value % 10 === 1) return 'st';
  if (value % 10 === 2) return 'nd';
  if (value % 10 === 3) return 'rd';
  return 'th';
}

export function stemForCp003(evidence: RnkCp003DisplayedEvidence, context: RnkCp003ContextVocabulary, firstName: string, secondName: string): string {
  switch (evidence.kind) {
    case 'FINAL_RANKS_AFTER_INTERCHANGE':
      return `In a ${context.group} of ${evidence.total} ${context.memberPlural}, ${firstName} is ${evidence.firstOriginalRank}${ordinalSuffix(evidence.firstOriginalRank)} ${sidePhrase(context, evidence.firstOriginalSide)} and ${secondName} is ${evidence.secondOriginalRank}${ordinalSuffix(evidence.secondOriginalRank)} ${sidePhrase(context, evidence.secondOriginalSide)}. They interchange their positions. What are ${firstName}'s rank ${sidePhrase(context, evidence.firstRequestedSide)} and ${secondName}'s rank ${sidePhrase(context, evidence.secondRequestedSide)}, respectively?`;
    case 'ORIGINAL_RANKS_FROM_FINAL_INTERCHANGE':
      return `After ${firstName} and ${secondName} interchange positions in a ${context.group} of ${evidence.total} ${context.memberPlural}, ${firstName} is ${evidence.firstFinalRank}${ordinalSuffix(evidence.firstFinalRank)} ${sidePhrase(context, evidence.firstFinalSide)} and ${secondName} is ${evidence.secondFinalRank}${ordinalSuffix(evidence.secondFinalRank)} ${sidePhrase(context, evidence.secondFinalSide)}. What were ${firstName}'s original rank ${sidePhrase(context, evidence.firstRequestedSide)} and ${secondName}'s original rank ${sidePhrase(context, evidence.secondRequestedSide)}, respectively?`;
    case 'TOTAL_FROM_INTERCHANGE_RANK_CHANGE':
      return `In a ${context.group}, ${firstName} is originally ${evidence.firstOriginalRankFromStart}${ordinalSuffix(evidence.firstOriginalRankFromStart)} ${context.startPhrase}, while ${secondName} is ${evidence.secondOriginalRankFromEnd}${ordinalSuffix(evidence.secondOriginalRankFromEnd)} ${context.endPhrase}. After they interchange positions, ${firstName} becomes ${evidence.firstFinalRankFromStart}${ordinalSuffix(evidence.firstFinalRankFromStart)} ${context.startPhrase}. How many ${context.memberPlural} are in the ${context.group}?`;
    case 'FINAL_RANK_AFTER_SINGLE_MOVEMENT':
      return `In a ${context.group} of ${evidence.total} ${context.memberPlural}, ${firstName} is ${evidence.originalRank}${ordinalSuffix(evidence.originalRank)} ${sidePhrase(context, evidence.originalSide)}. ${firstName} ${movementPhrase(context, evidence.direction)} by ${evidence.distance} places. What is ${firstName}'s new rank ${sidePhrase(context, evidence.requestedSide)}?`;
    case 'PEOPLE_PASSED_FROM_RANK_CHANGE':
      return `In a ${context.group} of ${evidence.total} ${context.memberPlural}, ${firstName}'s rank changes from ${evidence.originalRank}${ordinalSuffix(evidence.originalRank)} ${sidePhrase(context, evidence.originalSide)} to ${evidence.finalRank}${ordinalSuffix(evidence.finalRank)} ${sidePhrase(context, evidence.finalSide)}. How many ${context.memberPlural} did ${firstName} pass or get passed by?`;
    case 'ORIGINAL_RANK_FROM_FINAL_AND_MOVEMENT':
      return `In a ${context.group} of ${evidence.total} ${context.memberPlural}, ${firstName} ${movementPhrase(context, evidence.direction)} by ${evidence.distance} places and then stands ${evidence.finalRank}${ordinalSuffix(evidence.finalRank)} ${sidePhrase(context, evidence.finalSide)}. What was ${firstName}'s original rank ${sidePhrase(context, evidence.requestedSide)}?`;
    case 'TARGET_RANK_AFTER_INSERTION':
      return `A ${context.group} initially has ${evidence.totalBefore} ${context.memberPlural}. ${firstName} is ${evidence.targetOriginalRank}${ordinalSuffix(evidence.targetOriginalRank)} ${sidePhrase(context, evidence.targetOriginalSide)}. A new ${context.memberSingular} is inserted at the position that becomes ${evidence.insertedFinalRank}${ordinalSuffix(evidence.insertedFinalRank)} ${sidePhrase(context, evidence.insertedFinalSide)} in the new ${context.group}. What is ${firstName}'s new rank ${sidePhrase(context, evidence.requestedSide)}?`;
    case 'TARGET_RANK_AFTER_REMOVAL':
      return `A ${context.group} has ${evidence.totalBefore} ${context.memberPlural}. ${firstName} is ${evidence.targetOriginalRank}${ordinalSuffix(evidence.targetOriginalRank)} ${sidePhrase(context, evidence.targetOriginalSide)}. The ${context.memberSingular} at ${evidence.removedOriginalRank}${ordinalSuffix(evidence.removedOriginalRank)} ${sidePhrase(context, evidence.removedOriginalSide)} leaves the ${context.group}. What is ${firstName}'s new rank ${sidePhrase(context, evidence.requestedSide)}?`;
    case 'FINAL_RANK_AFTER_SEQUENTIAL_MOVES':
      return `In a ${context.group} of ${evidence.total} ${context.memberPlural}, ${firstName} is ${evidence.originalRank}${ordinalSuffix(evidence.originalRank)} ${sidePhrase(context, evidence.originalSide)}. First, ${firstName} ${movementPhrase(context, evidence.firstDirection)} by ${evidence.firstDistance} places; then ${movementPhrase(context, evidence.secondDirection)} by ${evidence.secondDistance} places. What is the final rank ${sidePhrase(context, evidence.requestedSide)}?`;
  }
}

function normalizeDescription(total: number, rank: number, side: RnkSide, context: RnkCp003ContextVocabulary): string {
  const start = toStartRank(total, rank, side);
  return side === 'START'
    ? `${rank} ${context.startPhrase} is already position ${start} ${context.startPhrase}`
    : `${rank} ${context.endPhrase} becomes ${total} - ${rank} + 1 = ${start} ${context.startPhrase}`;
}

export function explanationForCp003(evidence: RnkCp003DisplayedEvidence, context: RnkCp003ContextVocabulary, firstName: string, secondName: string, answer: string): { readonly keyRule: string; readonly steps: readonly string[]; readonly shortcut: string; readonly conclusion: string } {
  switch (evidence.kind) {
    case 'FINAL_RANKS_AFTER_INTERCHANGE': {
      const firstStart = toStartRank(evidence.total, evidence.firstOriginalRank, evidence.firstOriginalSide);
      const secondStart = toStartRank(evidence.total, evidence.secondOriginalRank, evidence.secondOriginalSide);
      const firstFinal = fromStartRank(evidence.total, secondStart, evidence.firstRequestedSide);
      const secondFinal = fromStartRank(evidence.total, firstStart, evidence.secondRequestedSide);
      return {
        keyRule: 'When two people interchange positions, each person takes the other person’s exact position. Convert ranks only when the question asks from a different end.',
        steps: [
          `${firstName}: ${normalizeDescription(evidence.total, evidence.firstOriginalRank, evidence.firstOriginalSide, context)}.`,
          `${secondName}: ${normalizeDescription(evidence.total, evidence.secondOriginalRank, evidence.secondOriginalSide, context)}.`,
          `After interchange, ${firstName} occupies position ${secondStart} ${context.startPhrase} and ${secondName} occupies position ${firstStart} ${context.startPhrase}.`,
          `Convert to the requested ends: ${firstName} = ${firstFinal}, ${secondName} = ${secondFinal}.`,
        ],
        shortcut: 'Swap positions first; then convert each swapped position to the end requested in the question.',
        conclusion: `Therefore, the required ranks are ${answer}.`,
      };
    }
    case 'ORIGINAL_RANKS_FROM_FINAL_INTERCHANGE': {
      const firstFinalStart = toStartRank(evidence.total, evidence.firstFinalRank, evidence.firstFinalSide);
      const secondFinalStart = toStartRank(evidence.total, evidence.secondFinalRank, evidence.secondFinalSide);
      const firstOriginal = fromStartRank(evidence.total, secondFinalStart, evidence.firstRequestedSide);
      const secondOriginal = fromStartRank(evidence.total, firstFinalStart, evidence.secondRequestedSide);
      return {
        keyRule: 'Interchange is reversible: before the swap, each person occupied the final position now held by the other person.',
        steps: [
          `${firstName}'s final position is ${firstFinalStart} ${context.startPhrase}.`,
          `${secondName}'s final position is ${secondFinalStart} ${context.startPhrase}.`,
          `Reverse the interchange: ${firstName}'s original position was ${secondFinalStart}, while ${secondName}'s was ${firstFinalStart}.`,
          `Convert to the requested ends: ${firstName} = ${firstOriginal}, ${secondName} = ${secondOriginal}.`,
        ],
        shortcut: 'For an inverse interchange question, swap the final positions back once; do not apply an extra movement.',
        conclusion: `Therefore, the original ranks were ${answer}.`,
      };
    }
    case 'TOTAL_FROM_INTERCHANGE_RANK_CHANGE': {
      const total = evidence.firstFinalRankFromStart + evidence.secondOriginalRankFromEnd - 1;
      return {
        keyRule: 'After interchange, the first person’s new position is the second person’s old position. A person’s ranks from opposite ends add to total + 1.',
        steps: [
          `${firstName}'s new rank ${evidence.firstFinalRankFromStart} ${context.startPhrase} is ${secondName}'s original rank ${context.startPhrase}.`,
          `${secondName}'s original ranks are therefore ${evidence.firstFinalRankFromStart} ${context.startPhrase} and ${evidence.secondOriginalRankFromEnd} ${context.endPhrase}.`,
          `Total = ${evidence.firstFinalRankFromStart} + ${evidence.secondOriginalRankFromEnd} - 1 = ${total}.`,
          `${firstName}'s old rank confirms that the two original positions were different; it is not added again.`,
        ],
        shortcut: 'Use the swapped-in rank with the other person’s opposite-end rank, then subtract 1.',
        conclusion: `Therefore, the ${context.group} contains ${answer} ${context.memberPlural}.`,
      };
    }
    case 'FINAL_RANK_AFTER_SINGLE_MOVEMENT': {
      const originalStart = toStartRank(evidence.total, evidence.originalRank, evidence.originalSide);
      const finalStart = originalStart + (evidence.direction === 'TOWARD_START' ? -evidence.distance : evidence.distance);
      const finalRequested = fromStartRank(evidence.total, finalStart, evidence.requestedSide);
      return {
        keyRule: 'Normalize the original rank to one reference end. Moving toward that end reduces the rank; moving away increases it.',
        steps: [
          `${normalizeDescription(evidence.total, evidence.originalRank, evidence.originalSide, context)}.`,
          `${firstName} ${movementPhrase(context, evidence.direction)} by ${evidence.distance} places changes the rank ${context.startPhrase} from ${originalStart} to ${finalStart}.`,
          `Convert ${finalStart} ${context.startPhrase} to the requested end: ${finalRequested}.`,
        ],
        shortcut: 'Movement toward the reference end means subtract; movement away means add. Convert ends only once.',
        conclusion: `Therefore, ${firstName}'s new rank is ${answer}.`,
      };
    }
    case 'PEOPLE_PASSED_FROM_RANK_CHANGE': {
      const originalStart = toStartRank(evidence.total, evidence.originalRank, evidence.originalSide);
      const finalStart = toStartRank(evidence.total, evidence.finalRank, evidence.finalSide);
      const passed = Math.abs(originalStart - finalStart);
      return {
        keyRule: 'The number of people crossed equals the absolute difference between the old and new positions after both ranks are measured from the same end.',
        steps: [`Old position ${context.startPhrase} = ${originalStart}.`, `New position ${context.startPhrase} = ${finalStart}.`, `People crossed = |${originalStart} - ${finalStart}| = ${passed}.`],
        shortcut: 'Convert mixed-end ranks to the same end, then subtract. Do not subtract an extra 1.',
        conclusion: `Therefore, ${firstName} crossed ${answer} ${context.memberPlural}.`,
      };
    }
    case 'ORIGINAL_RANK_FROM_FINAL_AND_MOVEMENT': {
      const finalStart = toStartRank(evidence.total, evidence.finalRank, evidence.finalSide);
      const originalStart = finalStart - (evidence.direction === 'TOWARD_START' ? -evidence.distance : evidence.distance);
      const originalRequested = fromStartRank(evidence.total, originalStart, evidence.requestedSide);
      return {
        keyRule: 'To recover an original rank, reverse the stated movement before converting to the requested end.',
        steps: [`Final position ${context.startPhrase} = ${finalStart}.`, `Reverse the movement of ${evidence.distance} places: original position ${context.startPhrase} = ${originalStart}.`, `Convert ${originalStart} to the requested end: ${originalRequested}.`],
        shortcut: 'Undo the move: add back a move toward the front/top/left, or subtract back a move toward the back/bottom/right.',
        conclusion: `Therefore, ${firstName}'s original rank was ${answer}.`,
      };
    }
    case 'TARGET_RANK_AFTER_INSERTION': {
      const totalAfter = evidence.totalBefore + 1;
      const targetStart = toStartRank(evidence.totalBefore, evidence.targetOriginalRank, evidence.targetOriginalSide);
      const insertedStart = toStartRank(totalAfter, evidence.insertedFinalRank, evidence.insertedFinalSide);
      const targetFinalStart = insertedStart <= targetStart ? targetStart + 1 : targetStart;
      const requested = fromStartRank(totalAfter, targetFinalStart, evidence.requestedSide);
      return {
        keyRule: 'An insertion shifts the target one place away from the reference end only when the new person is inserted at or before the target’s old position.',
        steps: [
          `Before insertion, ${firstName}'s position ${context.startPhrase} is ${targetStart}.`,
          `After insertion, the new person occupies position ${insertedStart} ${context.startPhrase} in a group of ${totalAfter}.`,
          insertedStart <= targetStart ? `Because ${insertedStart} is at or before ${targetStart}, ${firstName} shifts to ${targetFinalStart}.` : `Because ${insertedStart} is after ${targetStart}, ${firstName} remains at ${targetFinalStart}.`,
          `Convert the final position to the requested end: ${requested}.`,
        ],
        shortcut: 'Insertion before the target: add 1 to the rank from the reference end. Insertion after it: no change.',
        conclusion: `Therefore, ${firstName}'s new rank is ${answer}.`,
      };
    }
    case 'TARGET_RANK_AFTER_REMOVAL': {
      const targetStart = toStartRank(evidence.totalBefore, evidence.targetOriginalRank, evidence.targetOriginalSide);
      const removedStart = toStartRank(evidence.totalBefore, evidence.removedOriginalRank, evidence.removedOriginalSide);
      const targetFinalStart = removedStart < targetStart ? targetStart - 1 : targetStart;
      const requested = fromStartRank(evidence.totalBefore - 1, targetFinalStart, evidence.requestedSide);
      return {
        keyRule: 'A removal shifts the target one place toward the reference end only when the removed person was before the target.',
        steps: [
          `Before removal, ${firstName}'s position ${context.startPhrase} is ${targetStart}.`,
          `The leaving ${context.memberSingular} is at position ${removedStart} ${context.startPhrase}.`,
          removedStart < targetStart ? `Because the removed position is before ${firstName}, the new position ${context.startPhrase} is ${targetFinalStart}.` : `Because the removed position is after ${firstName}, the position ${context.startPhrase} remains ${targetFinalStart}.`,
          `The new total is ${evidence.totalBefore - 1}; converting to the requested end gives ${requested}.`,
        ],
        shortcut: 'Removal before the target: subtract 1 from the rank measured from the reference end. Removal after it: no change.',
        conclusion: `Therefore, ${firstName}'s new rank is ${answer}.`,
      };
    }
    case 'FINAL_RANK_AFTER_SEQUENTIAL_MOVES': {
      const originalStart = toStartRank(evidence.total, evidence.originalRank, evidence.originalSide);
      const afterFirst = originalStart + (evidence.firstDirection === 'TOWARD_START' ? -evidence.firstDistance : evidence.firstDistance);
      const afterSecond = afterFirst + (evidence.secondDirection === 'TOWARD_START' ? -evidence.secondDistance : evidence.secondDistance);
      const requested = fromStartRank(evidence.total, afterSecond, evidence.requestedSide);
      return {
        keyRule: 'Replay movements in the exact stated order on one rank line; every intermediate position must remain valid.',
        steps: [`Original position ${context.startPhrase} = ${originalStart}.`, `After the first move: ${originalStart} ${evidence.firstDirection === 'TOWARD_START' ? '-' : '+'} ${evidence.firstDistance} = ${afterFirst}.`, `After the second move: ${afterFirst} ${evidence.secondDirection === 'TOWARD_START' ? '-' : '+'} ${evidence.secondDistance} = ${afterSecond}.`, `Convert ${afterSecond} to the requested end: ${requested}.`],
        shortcut: 'Treat moves toward the reference end as negative and moves away as positive, checking each intermediate rank.',
        conclusion: `Therefore, ${firstName}'s final rank is ${answer}.`,
      };
    }
  }
}

function numericCandidates(evidence: RnkCp003DisplayedEvidence, correct: number): Array<readonly [number, string, string]> {
  const candidates: Array<readonly [number, string, string]> = [];
  const add = (value: number, misconceptionId: string, explanation: string): void => {
    if (Number.isInteger(value) && value >= 0 && value !== correct) candidates.push([value, misconceptionId, explanation]);
  };
  switch (evidence.kind) {
    case 'TOTAL_FROM_INTERCHANGE_RANK_CHANGE':
      add(evidence.firstFinalRankFromStart + evidence.secondOriginalRankFromEnd, 'FORGOT_SHARED_PERSON_SUBTRACTION', 'adds opposite-end ranks but forgets that the same person is counted twice');
      add(evidence.firstOriginalRankFromStart + evidence.secondOriginalRankFromEnd - 1, 'USED_OLD_RANK_AFTER_INTERCHANGE', 'uses the first person’s old rank instead of the position received after interchange');
      add(Math.abs(evidence.firstFinalRankFromStart - evidence.secondOriginalRankFromEnd), 'SUBTRACTED_OPPOSITE_END_RANKS', 'subtracts opposite-end ranks instead of combining them');
      break;
    case 'FINAL_RANK_AFTER_SINGLE_MOVEMENT': {
      const originalStart = toStartRank(evidence.total, evidence.originalRank, evidence.originalSide);
      const wrongDirection = originalStart + (evidence.direction === 'TOWARD_START' ? evidence.distance : -evidence.distance);
      if (wrongDirection >= 1 && wrongDirection <= evidence.total) add(fromStartRank(evidence.total, wrongDirection, evidence.requestedSide), 'MOVED_IN_WRONG_DIRECTION', 'applies the movement in the opposite direction');
      add(fromStartRank(evidence.total, originalStart, evidence.requestedSide), 'USED_OLD_RANK_AFTER_MOVEMENT', 'keeps the old position and ignores the movement');
      add(correct + 1, 'OFF_BY_ONE_BOUNDARY', 'introduces an unnecessary one-place boundary adjustment');
      add(correct - 1, 'OFF_BY_ONE_BOUNDARY', 'drops one place through an off-by-one error');
      break;
    }
    case 'PEOPLE_PASSED_FROM_RANK_CHANGE':
      add(correct - 1, 'FORGOT_MOVEMENT_ENDPOINT', 'subtracts one as though counting only people strictly between two fixed positions');
      add(correct + 1, 'COUNTED_TARGET_TWICE', 'counts one endpoint in addition to the people crossed');
      add(Math.abs(evidence.originalRank - evidence.finalRank), 'USED_MIXED_END_RANKS_DIRECTLY', 'subtracts the displayed numbers without first normalizing their ends');
      break;
    case 'ORIGINAL_RANK_FROM_FINAL_AND_MOVEMENT': {
      const finalStart = toStartRank(evidence.total, evidence.finalRank, evidence.finalSide);
      const wrong = finalStart + (evidence.direction === 'TOWARD_START' ? -evidence.distance : evidence.distance);
      if (wrong >= 1 && wrong <= evidence.total) add(fromStartRank(evidence.total, wrong, evidence.requestedSide), 'REAPPLIED_MOVEMENT_INSTEAD_OF_REVERSING', 'applies the movement again instead of reversing it');
      add(fromStartRank(evidence.total, finalStart, evidence.requestedSide), 'USED_FINAL_AS_ORIGINAL', 'reports the final position as the original position');
      add(correct + 1, 'OFF_BY_ONE_BOUNDARY', 'adds an unnecessary one-place correction');
      add(correct - 1, 'OFF_BY_ONE_BOUNDARY', 'subtracts an unnecessary one-place correction');
      break;
    }
    case 'TARGET_RANK_AFTER_INSERTION': {
      const totalAfter = evidence.totalBefore + 1;
      const targetStart = toStartRank(evidence.totalBefore, evidence.targetOriginalRank, evidence.targetOriginalSide);
      add(fromStartRank(totalAfter, targetStart, evidence.requestedSide), 'IGNORED_INSERTION_SHIFT', 'assumes insertion never changes the target’s position');
      if (targetStart + 1 <= totalAfter) add(fromStartRank(totalAfter, targetStart + 1, evidence.requestedSide), 'SHIFTED_WITHOUT_POSITION_CHECK', 'always shifts the target even when insertion occurs after it');
      if (targetStart > 1) add(fromStartRank(totalAfter, targetStart - 1, evidence.requestedSide), 'SHIFTED_IN_WRONG_DIRECTION', 'moves the target toward the reference end after an insertion');
      add(correct + 1, 'USED_OLD_TOTAL_FOR_END_CONVERSION', 'converts the final rank with the old total');
      break;
    }
    case 'TARGET_RANK_AFTER_REMOVAL': {
      const totalAfter = evidence.totalBefore - 1;
      const targetStart = toStartRank(evidence.totalBefore, evidence.targetOriginalRank, evidence.targetOriginalSide);
      if (targetStart <= totalAfter) add(fromStartRank(totalAfter, targetStart, evidence.requestedSide), 'IGNORED_REMOVAL_SHIFT', 'assumes removal never changes the target’s position');
      if (targetStart > 1) add(fromStartRank(totalAfter, targetStart - 1, evidence.requestedSide), 'SHIFTED_WITHOUT_POSITION_CHECK', 'always shifts the target even when the removed person was after it');
      if (targetStart + 1 <= totalAfter) add(fromStartRank(totalAfter, targetStart + 1, evidence.requestedSide), 'SHIFTED_IN_WRONG_DIRECTION', 'moves the target away from the reference end after a removal');
      add(correct + 1, 'USED_OLD_TOTAL_FOR_END_CONVERSION', 'converts with the old group size instead of the reduced total');
      break;
    }
    case 'FINAL_RANK_AFTER_SEQUENTIAL_MOVES': {
      const originalStart = toStartRank(evidence.total, evidence.originalRank, evidence.originalSide);
      const firstOnly = originalStart + (evidence.firstDirection === 'TOWARD_START' ? -evidence.firstDistance : evidence.firstDistance);
      add(fromStartRank(evidence.total, firstOnly, evidence.requestedSide), 'APPLIED_ONLY_FIRST_MOVEMENT', 'stops after the first movement');
      const secondOnly = originalStart + (evidence.secondDirection === 'TOWARD_START' ? -evidence.secondDistance : evidence.secondDistance);
      if (secondOnly >= 1 && secondOnly <= evidence.total) add(fromStartRank(evidence.total, secondOnly, evidence.requestedSide), 'APPLIED_ONLY_SECOND_MOVEMENT', 'ignores the first movement');
      const bothSameDirection = originalStart + (evidence.firstDirection === 'TOWARD_START' ? -1 : 1) * (evidence.firstDistance + evidence.secondDistance);
      if (bothSameDirection >= 1 && bothSameDirection <= evidence.total) add(fromStartRank(evidence.total, bothSameDirection, evidence.requestedSide), 'TREATED_BOTH_MOVES_AS_SAME_DIRECTION', 'combines both distances under the first direction');
      add(correct + 1, 'OFF_BY_ONE_BOUNDARY', 'introduces an unnecessary one-place adjustment');
      break;
    }
    default:
      add(correct + 1, 'OFF_BY_ONE_BOUNDARY', 'adds one unnecessarily');
      add(correct - 1, 'OFF_BY_ONE_BOUNDARY', 'subtracts one unnecessarily');
  }
  for (let offset = 1; candidates.length < 8 && offset <= 12; offset += 1) {
    add(correct + offset, 'COLLISION_SAFE_NEARBY_VALUE', `uses a nearby but unsupported value ${offset} place${offset === 1 ? '' : 's'} above the correct result`);
    add(correct - offset, 'COLLISION_SAFE_NEARBY_VALUE', `uses a nearby but unsupported value ${offset} place${offset === 1 ? '' : 's'} below the correct result`);
  }
  return candidates;
}

function pairCandidates(evidence: RnkCp003DisplayedEvidence, correctKey: string): Array<readonly [string, string, string]> {
  const [correctFirst, correctSecond] = pairFromKey(correctKey);
  const candidates: Array<readonly [string, string, string]> = [];
  const total = evidence.kind === 'FINAL_RANKS_AFTER_INTERCHANGE' || evidence.kind === 'ORIGINAL_RANKS_FROM_FINAL_INTERCHANGE' ? evidence.total : Number.MAX_SAFE_INTEGER;
  const add = (first: number, second: number, misconceptionId: string, explanation: string): void => {
    if (first < 1 || second < 1 || first > total || second > total) return;
    const key = `${first}|${second}`;
    if (key !== correctKey) candidates.push([key, misconceptionId, explanation]);
  };
  if (evidence.kind === 'FINAL_RANKS_AFTER_INTERCHANGE') {
    const firstStart = toStartRank(evidence.total, evidence.firstOriginalRank, evidence.firstOriginalSide);
    const secondStart = toStartRank(evidence.total, evidence.secondOriginalRank, evidence.secondOriginalSide);
    add(fromStartRank(evidence.total, firstStart, evidence.firstRequestedSide), fromStartRank(evidence.total, secondStart, evidence.secondRequestedSide), 'USED_OLD_RANKS_AFTER_INTERCHANGE', 'keeps both original positions and ignores the interchange');
    add(correctSecond, correctFirst, 'REVERSED_PERSON_LABELS', 'finds the two swapped ranks but assigns them to the wrong people');
    if (correctFirst < evidence.total && correctSecond < evidence.total) add(correctFirst + 1, correctSecond + 1, 'OFF_BY_ONE_BOTH_RANKS', 'adds one to both correct ranks');
    if (correctFirst > 1 && correctSecond > 1) add(correctFirst - 1, correctSecond - 1, 'OFF_BY_ONE_BOTH_RANKS', 'subtracts one from both correct ranks');
  } else if (evidence.kind === 'ORIGINAL_RANKS_FROM_FINAL_INTERCHANGE') {
    const firstFinalStart = toStartRank(evidence.total, evidence.firstFinalRank, evidence.firstFinalSide);
    const secondFinalStart = toStartRank(evidence.total, evidence.secondFinalRank, evidence.secondFinalSide);
    add(fromStartRank(evidence.total, firstFinalStart, evidence.firstRequestedSide), fromStartRank(evidence.total, secondFinalStart, evidence.secondRequestedSide), 'USED_FINAL_RANKS_AS_ORIGINAL', 'reports the final positions without reversing the interchange');
    add(correctSecond, correctFirst, 'REVERSED_PERSON_LABELS', 'recovers the two original positions but assigns them to the wrong people');
    if (correctFirst < evidence.total && correctSecond < evidence.total) add(correctFirst + 1, correctSecond + 1, 'OFF_BY_ONE_BOTH_RANKS', 'adds one to both recovered ranks');
    if (correctFirst > 1 && correctSecond > 1) add(correctFirst - 1, correctSecond - 1, 'OFF_BY_ONE_BOTH_RANKS', 'subtracts one from both recovered ranks');
  }
  for (let offset = 1; candidates.length < 8 && offset <= 8; offset += 1) {
    add(correctFirst + offset, correctSecond, 'COLLISION_SAFE_NEARBY_PAIR', 'changes only the first person’s rank without transformation evidence');
    add(correctFirst - offset, correctSecond, 'COLLISION_SAFE_NEARBY_PAIR', 'lowers only the first person’s rank without transformation evidence');
    add(correctFirst, correctSecond + offset, 'COLLISION_SAFE_NEARBY_PAIR', 'changes only the second person’s rank without transformation evidence');
    add(correctFirst, correctSecond - offset, 'COLLISION_SAFE_NEARBY_PAIR', 'lowers only the second person’s rank without transformation evidence');
    add(correctFirst + offset, correctSecond - offset, 'COLLISION_SAFE_NEARBY_PAIR', 'uses a nearby pair that does not match the exchanged positions');
    add(correctFirst - offset, correctSecond + offset, 'COLLISION_SAFE_NEARBY_PAIR', 'uses another nearby pair that does not match the exchanged positions');
  }
  return candidates;
}

export function buildCp003Options(evidence: RnkCp003DisplayedEvidence, answerKey: string, answerSemantic: RnkCp003AnswerSemantic, correctIndex: number, firstName: string, secondName: string): readonly RnkCp003Option[] {
  const maximumNumericAnswer = (() => {
    if (answerSemantic === 'TOTAL') return Number.MAX_SAFE_INTEGER;
    if (answerSemantic === 'COUNT') return evidence.kind === 'PEOPLE_PASSED_FROM_RANK_CHANGE' ? evidence.total - 1 : Number.MAX_SAFE_INTEGER;
    switch (evidence.kind) {
      case 'FINAL_RANK_AFTER_SINGLE_MOVEMENT':
      case 'ORIGINAL_RANK_FROM_FINAL_AND_MOVEMENT':
      case 'FINAL_RANK_AFTER_SEQUENTIAL_MOVES': return evidence.total;
      case 'TARGET_RANK_AFTER_INSERTION': return evidence.totalBefore + 1;
      case 'TARGET_RANK_AFTER_REMOVAL': return evidence.totalBefore - 1;
      default: return Number.MAX_SAFE_INTEGER;
    }
  })();
  const wrong = answerSemantic === 'RANK_PAIR'
    ? pairCandidates(evidence, answerKey).map(([key, id, explanation]) => ({ answerKey: key, misconceptionId: id, explanation }))
    : numericCandidates(evidence, Number(answerKey)).filter(([value]) => value >= (answerSemantic === 'RANK' ? 1 : 0) && value <= maximumNumericAnswer).map(([value, id, explanation]) => ({ answerKey: String(value), misconceptionId: id, explanation }));
  const uniqueWrong: Array<{ answerKey: string; misconceptionId: string; explanation: string }> = [];
  const seen = new Set<string>([answerKey]);
  for (const candidate of wrong) {
    if (seen.has(candidate.answerKey)) continue;
    seen.add(candidate.answerKey);
    uniqueWrong.push(candidate);
    if (uniqueWrong.length === 3) break;
  }
  if (answerSemantic !== 'RANK_PAIR' && uniqueWrong.length < 3) {
    const correct = Number(answerKey);
    const minimum = answerSemantic === 'RANK' ? 1 : 0;
    for (let offset = 1; uniqueWrong.length < 3 && offset <= 24; offset += 1) {
      for (const value of [correct - offset, correct + offset]) {
        const key = String(value);
        if (value < minimum || value > maximumNumericAnswer || seen.has(key)) continue;
        seen.add(key);
        uniqueWrong.push({ answerKey: key, misconceptionId: 'COLLISION_SAFE_NEARBY_VALUE', explanation: 'uses a nearby value that is not supported by the transformation replay' });
        if (uniqueWrong.length === 3) break;
      }
    }
  }
  if (uniqueWrong.length !== 3) throw new Error(`Could not construct three unique distractors for ${evidence.kind}:${answerKey}`);
  const options: RnkCp003Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) options.push({ answerKey, label: formatCp003Answer(answerKey, answerSemantic, firstName, secondName), misconceptionId: 'CORRECT', explanation: 'matches the independently replayed transformation and requested rank direction' });
    else {
      const candidate = uniqueWrong[wrongIndex++];
      options.push({ ...candidate, label: formatCp003Answer(candidate.answerKey, answerSemantic, firstName, secondName) });
    }
  }
  return options;
}

export function difficultyForCp003(evidence: RnkCp003DisplayedEvidence): RnkCp003Difficulty {
  switch (evidence.kind) {
    case 'FINAL_RANK_AFTER_SINGLE_MOVEMENT':
      if (evidence.originalSide === evidence.requestedSide && evidence.distance <= 5) return 'EASY';
      return evidence.originalSide !== evidence.requestedSide && evidence.distance >= 8 ? 'HARD' : 'MEDIUM';
    case 'PEOPLE_PASSED_FROM_RANK_CHANGE': return evidence.originalSide === evidence.finalSide ? 'EASY' : 'MEDIUM';
    case 'FINAL_RANKS_AFTER_INTERCHANGE':
    case 'ORIGINAL_RANKS_FROM_FINAL_INTERCHANGE': {
      const mixedEvidence = evidence.kind === 'FINAL_RANKS_AFTER_INTERCHANGE' ? evidence.firstOriginalSide !== evidence.secondOriginalSide : evidence.firstFinalSide !== evidence.secondFinalSide;
      const mixedRequest = evidence.firstRequestedSide !== evidence.secondRequestedSide;
      return mixedEvidence && mixedRequest ? 'HARD' : mixedEvidence || mixedRequest ? 'MEDIUM' : 'EASY';
    }
    case 'TOTAL_FROM_INTERCHANGE_RANK_CHANGE': return 'MEDIUM';
    case 'ORIGINAL_RANK_FROM_FINAL_AND_MOVEMENT': return evidence.finalSide !== evidence.requestedSide ? 'HARD' : 'MEDIUM';
    case 'TARGET_RANK_AFTER_INSERTION':
    case 'TARGET_RANK_AFTER_REMOVAL': return evidence.targetOriginalSide !== evidence.requestedSide ? 'HARD' : 'MEDIUM';
    case 'FINAL_RANK_AFTER_SEQUENTIAL_MOVES': return evidence.firstDirection !== evidence.secondDirection && evidence.originalSide === evidence.requestedSide ? 'MEDIUM' : 'HARD';
  }
}

export function fingerprintForCp003(evidence: RnkCp003DisplayedEvidence): string {
  return `RANK_TRANSFORMATION|${evidence.kind}|${JSON.stringify(evidence)}`;
}

export function validateRenderedAnswer(evidence: RnkCp003DisplayedEvidence, answerKey: string): void {
  const independentlySolved = solveCp003Independently(evidence);
  if (independentlySolved !== answerKey) throw new Error(`Rendered answer ${answerKey} disagrees with independent solver ${independentlySolved}`);
}
