import {
  ALPHABET_SIZE,
  boundedShift,
  cyclicShift,
  exclusiveGap,
  inclusiveSpan,
  leftRank,
  letterAtLeftRank,
  letterAtRightRank,
  midpointLetters,
  oppositeLetter,
  positionDistance,
  rightRank,
} from "./foundation/alphabet";
import { applyAlphabetTransform, transformedPosition } from "./foundation/sequence";
import {
  applyWordTransformRefs,
  findOccurrencePosition,
  occurrenceLabel,
  refsToWord,
  transformedOccurrencePosition,
  unchangedRefs,
} from "./foundation/word";
import type { AlpInstanceData, AlpQuestionLogic, AlpSolverResult } from "./types";

function asAnswer(value: string | number): AlpSolverResult {
  return { answer: String(value), canonicalValue: value, trace: [] };
}

function solveCp001(ql: AlpQuestionLogic, data: AlpInstanceData): AlpSolverResult {
  switch (ql.solveMode) {
    case "LETTER_AT_LEFT_RANK": {
      const answer = letterAtLeftRank(data.rank!);
      return { ...asAnswer(answer), trace: [`Left rank ${data.rank} corresponds to ${answer}.`] };
    }
    case "LETTER_AT_RIGHT_RANK": {
      const answer = letterAtRightRank(data.rank!);
      return { ...asAnswer(answer), trace: [`Right rank ${data.rank} converts to left rank ${27 - data.rank!}, which is ${answer}.`] };
    }
    case "LEFT_RANK_OF_LETTER": {
      const answer = leftRank(data.letter!);
      return { ...asAnswer(answer), trace: [`${data.letter} is at position ${answer} from the left.`] };
    }
    case "RIGHT_RANK_OF_LETTER": {
      const answer = rightRank(data.letter!);
      return { ...asAnswer(answer), trace: [`Right rank = 27 − ${leftRank(data.letter!)} = ${answer}.`] };
    }
    case "RIGHT_RANK_FROM_LEFT_RANK": {
      const answer = 27 - data.rank!;
      return { ...asAnswer(answer), trace: [`For the same letter, left rank + right rank = 27.`, `27 − ${data.rank} = ${answer}.`] };
    }
    case "LEFT_RANK_FROM_RIGHT_RANK": {
      const answer = 27 - data.rank!;
      return { ...asAnswer(answer), trace: [`For the same letter, left rank + right rank = 27.`, `27 − ${data.rank} = ${answer}.`] };
    }
    case "OPPOSITE_OF_LETTER": {
      const answer = oppositeLetter(data.letter!);
      return { ...asAnswer(answer), trace: [`Opposite positions add to 27.`, `${leftRank(data.letter!)} + ${leftRank(answer)} = 27.`] };
    }
    case "OPPOSITE_OF_LEFT_RANK": {
      const source = letterAtLeftRank(data.rank!);
      const answer = oppositeLetter(source);
      return { ...asAnswer(answer), trace: [`The ${data.rank}th letter from the left is ${source}.`, `Its opposite is ${answer}.`] };
    }
    case "OPPOSITE_OF_RIGHT_RANK": {
      const source = letterAtRightRank(data.rank!);
      const answer = oppositeLetter(source);
      return { ...asAnswer(answer), trace: [`The ${data.rank}th letter from the right is ${source}.`, `Its opposite is ${answer}.`] };
    }
    case "BOTH_RANKS_OF_LETTER": {
      const left = leftRank(data.letter!);
      const right = rightRank(data.letter!);
      return { ...asAnswer(`${left}, ${right}`), trace: [`${data.letter} has left rank ${left} and right rank ${right}.`] };
    }
    case "IDENTIFY_LETTER_FROM_RANK_PAIR": {
      if (data.rank! + data.secondRank! !== 27) throw new Error("Rank pair must identify one letter.");
      const answer = letterAtLeftRank(data.rank!);
      return { ...asAnswer(answer), trace: [`The left rank is ${data.rank}; the matching right rank is ${data.secondRank}.`, `Therefore the letter is ${answer}.`] };
    }
    case "IDENTIFY_OPPOSITE_PAIR": {
      const matching = data.pairOptions!.filter(([first, second]) => oppositeLetter(first) === second);
      if (matching.length !== 1) throw new Error(`Expected one opposite pair, found ${matching.length}.`);
      const answer = `${matching[0]![0]} : ${matching[0]![1]}`;
      return { ...asAnswer(answer), trace: [`In an opposite pair, the two left ranks add to 27.`, `${matching[0]![0]} and ${matching[0]![1]} satisfy this condition.`] };
    }
    default:
      throw new Error(`Unsupported CP-001 solve mode ${ql.solveMode}.`);
  }
}

function sourceLetterFromRankReference(ql: AlpQuestionLogic, data: AlpInstanceData): string {
  if (ql.solveMode === "SHIFT_RIGHT_FROM_LEFT_RANK" || ql.solveMode === "SHIFT_LEFT_FROM_LEFT_RANK") {
    return letterAtLeftRank(data.rank!);
  }
  if (ql.solveMode === "SHIFT_RIGHT_FROM_RIGHT_RANK" || ql.solveMode === "SHIFT_LEFT_FROM_RIGHT_RANK") {
    return letterAtRightRank(data.rank!);
  }
  return data.letter!;
}

function solveCp002(ql: AlpQuestionLogic, data: AlpInstanceData): AlpSolverResult {
  switch (ql.solveMode) {
    case "SHIFT_RIGHT_FROM_LETTER_BOUNDED":
    case "SHIFT_LEFT_FROM_LETTER_BOUNDED":
    case "SHIFT_RIGHT_FROM_LEFT_RANK":
    case "SHIFT_LEFT_FROM_LEFT_RANK":
    case "SHIFT_RIGHT_FROM_RIGHT_RANK":
    case "SHIFT_LEFT_FROM_RIGHT_RANK": {
      const source = sourceLetterFromRankReference(ql, data);
      const signed = data.direction === "RIGHT" ? data.offset! : -data.offset!;
      const answer = boundedShift(source, signed);
      if (!answer) throw new Error("Bounded offset crossed the alphabet boundary.");
      return { ...asAnswer(answer), trace: [`${source} has left rank ${leftRank(source)}.`, `${leftRank(source)} ${signed >= 0 ? "+" : "−"} ${Math.abs(signed)} = ${leftRank(answer)}, so the answer is ${answer}.`] };
    }
    case "RECOVER_ANCHOR_FROM_RIGHT_SHIFT":
    case "RECOVER_ANCHOR_FROM_LEFT_SHIFT": {
      const inverse = data.direction === "RIGHT" ? -data.offset! : data.offset!;
      const answer = boundedShift(data.targetLetter!, inverse);
      if (!answer) throw new Error("Inverse bounded offset crossed the alphabet boundary.");
      return { ...asAnswer(answer), trace: [`Undo the stated movement from ${data.targetLetter}.`, `Moving ${data.offset} places ${data.direction === "RIGHT" ? "left" : "right"} reaches ${answer}.`] };
    }
    case "FIND_FORWARD_OFFSET": {
      const answer = leftRank(data.targetLetter!) - leftRank(data.letter!);
      if (answer <= 0) throw new Error("Forward offset must be positive.");
      return { ...asAnswer(answer), trace: [`${data.targetLetter} is at ${leftRank(data.targetLetter!)} and ${data.letter} is at ${leftRank(data.letter!)}.`, `${leftRank(data.targetLetter!)} − ${leftRank(data.letter!)} = ${answer}.`] };
    }
    case "FIND_BACKWARD_OFFSET": {
      const answer = leftRank(data.letter!) - leftRank(data.targetLetter!);
      if (answer <= 0) throw new Error("Backward offset must be positive.");
      return { ...asAnswer(answer), trace: [`${data.letter} is at ${leftRank(data.letter!)} and ${data.targetLetter} is at ${leftRank(data.targetLetter!)}.`, `${leftRank(data.letter!)} − ${leftRank(data.targetLetter!)} = ${answer}.`] };
    }
    case "FIND_SIGNED_DIRECTION_AND_OFFSET": {
      const difference = leftRank(data.targetLetter!) - leftRank(data.letter!);
      const direction = difference > 0 ? "right" : "left";
      const answer = `${Math.abs(difference)} to the ${direction}`;
      return { ...asAnswer(answer), trace: [`Compare left ranks ${leftRank(data.letter!)} and ${leftRank(data.targetLetter!)}.`, `The change is ${Math.abs(difference)} places to the ${direction}.`] };
    }
    case "TWO_STAGE_RIGHT_THEN_LEFT":
    case "TWO_STAGE_LEFT_THEN_RIGHT": {
      const firstSigned = ql.solveMode === "TWO_STAGE_RIGHT_THEN_LEFT" ? data.offset! : -data.offset!;
      const secondSigned = ql.solveMode === "TWO_STAGE_RIGHT_THEN_LEFT" ? -data.secondOffset! : data.secondOffset!;
      const interim = boundedShift(data.letter!, firstSigned);
      const answer = interim ? boundedShift(interim, secondSigned) : null;
      if (!interim || !answer) throw new Error("Composite bounded offset crossed the alphabet boundary.");
      return { ...asAnswer(answer), trace: [`First movement: ${data.letter} → ${interim}.`, `Second movement: ${interim} → ${answer}.`] };
    }
    case "POSITION_AFTER_SHIFT_FROM_LEFT":
    case "POSITION_AFTER_SHIFT_FROM_RIGHT": {
      const signed = data.direction === "RIGHT" ? data.offset! : -data.offset!;
      const target = boundedShift(data.letter!, signed);
      if (!target) throw new Error("Position query crossed the alphabet boundary.");
      const answer = ql.solveMode === "POSITION_AFTER_SHIFT_FROM_LEFT" ? leftRank(target) : rightRank(target);
      return { ...asAnswer(answer), trace: [`After the movement, ${data.letter} reaches ${target}.`, `${target} is ${answer}th from the ${ql.solveMode.endsWith("LEFT") ? "left" : "right"}.`] };
    }
    case "CYCLIC_SHIFT_RIGHT_FROM_LETTER":
    case "CYCLIC_SHIFT_LEFT_FROM_LETTER": {
      const signed = data.direction === "RIGHT" ? data.offset! : -data.offset!;
      const answer = cyclicShift(data.letter!, signed);
      return { ...asAnswer(answer), trace: [`Use cyclic movement, so the count continues after Z at A or before A at Z.`, `${data.letter} shifted ${Math.abs(signed)} places ${signed > 0 ? "right" : "left"} gives ${answer}.`] };
    }
    case "RECOVER_ANCHOR_CYCLIC": {
      const inverse = data.direction === "RIGHT" ? -data.offset! : data.offset!;
      const answer = cyclicShift(data.targetLetter!, inverse);
      return { ...asAnswer(answer), trace: [`Reverse the cyclic movement from ${data.targetLetter}.`, `The original letter is ${answer}.`] };
    }
    default:
      throw new Error(`Unsupported CP-002 solve mode ${ql.solveMode}.`);
  }
}

function pairText(pair: readonly [string, string]): string {
  return `${pair[0]} : ${pair[1]}`;
}

function solveCp003(ql: AlpQuestionLogic, data: AlpInstanceData): AlpSolverResult {
  switch (ql.solveMode) {
    case "EXCLUSIVE_GAP": {
      const answer = exclusiveGap(data.letter!, data.secondLetter!);
      return { ...asAnswer(answer), trace: [`Position difference = ${positionDistance(data.letter!, data.secondLetter!)}.`, `Letters strictly between = ${positionDistance(data.letter!, data.secondLetter!)} − 1 = ${answer}.`] };
    }
    case "INCLUSIVE_SPAN": {
      const answer = inclusiveSpan(data.letter!, data.secondLetter!);
      return { ...asAnswer(answer), trace: [`Inclusive positions = distance + 1.`, `${positionDistance(data.letter!, data.secondLetter!)} + 1 = ${answer}.`] };
    }
    case "ABSOLUTE_POSITION_DISTANCE": {
      const answer = positionDistance(data.letter!, data.secondLetter!);
      return { ...asAnswer(answer), trace: [`Take the absolute difference of left ranks.`, `|${leftRank(data.secondLetter!)} − ${leftRank(data.letter!)}| = ${answer}.`] };
    }
    case "MIDPOINT_SINGLE": {
      const middle = midpointLetters(data.letter!, data.secondLetter!);
      if (middle.length !== 1) throw new Error("Single-midpoint question has two middle letters.");
      return { ...asAnswer(middle[0]!), trace: [`Average the endpoint ranks: (${leftRank(data.letter!)} + ${leftRank(data.secondLetter!)}) ÷ 2 = ${leftRank(middle[0]!)}.`, `That rank is ${middle[0]}.`] };
    }
    case "MIDPOINT_PAIR": {
      const middle = midpointLetters(data.letter!, data.secondLetter!);
      if (middle.length !== 2) throw new Error("Double-midpoint question has one middle letter.");
      const answer = `${middle[0]}, ${middle[1]}`;
      return { ...asAnswer(answer), trace: [`The centre falls between ranks ${leftRank(middle[0]!)} and ${leftRank(middle[1]!)}.`, `The two middle letters are ${answer}.`] };
    }
    case "IDENTIFY_PAIR_WITH_GAP": {
      const matching = data.pairOptions!.filter(([first, second]) => exclusiveGap(first, second) === data.rank);
      if (matching.length !== 1) throw new Error(`Expected one pair with gap ${data.rank}, found ${matching.length}.`);
      return { ...asAnswer(pairText(matching[0]!)), trace: [`Check position difference minus 1 for each pair.`, `${pairText(matching[0]!)} has exactly ${data.rank} letters between.`] };
    }
    case "IDENTIFY_PAIR_WITH_DISTANCE": {
      const matching = data.pairOptions!.filter(([first, second]) => positionDistance(first, second) === data.rank);
      if (matching.length !== 1) throw new Error(`Expected one pair with distance ${data.rank}, found ${matching.length}.`);
      return { ...asAnswer(pairText(matching[0]!)), trace: [`Check the absolute position difference for each pair.`, `${pairText(matching[0]!)} has distance ${data.rank}.`] };
    }
    case "RECOVER_RIGHT_ENDPOINT_FROM_GAP":
    case "RECOVER_LEFT_ENDPOINT_FROM_GAP": {
      const signedDistance = data.direction === "RIGHT" ? data.rank! + 1 : -(data.rank! + 1);
      const answer = boundedShift(data.letter!, signedDistance);
      if (!answer) throw new Error("Recovered endpoint is outside the alphabet.");
      return { ...asAnswer(answer), trace: [`A gap of ${data.rank} letters means an endpoint distance of ${data.rank! + 1}.`, `Move ${data.rank! + 1} places ${data.direction?.toLowerCase()} from ${data.letter} to reach ${answer}.`] };
    }
    case "RECOVER_ENDPOINT_FROM_DISTANCE_AND_DIRECTION": {
      const signed = data.direction === "RIGHT" ? data.rank! : -data.rank!;
      const answer = boundedShift(data.letter!, signed);
      if (!answer) throw new Error("Recovered distance endpoint is outside the alphabet.");
      return { ...asAnswer(answer), trace: [`Move ${data.rank} alphabet positions ${data.direction?.toLowerCase()} from ${data.letter}.`, `The endpoint is ${answer}.`] };
    }
    case "MIDPOINT_DISTANCE_FROM_ENDPOINTS": {
      const distance = positionDistance(data.letter!, data.secondLetter!);
      if (distance % 2 !== 0) throw new Error("Midpoint distance requires an even endpoint distance.");
      const answer = distance / 2;
      return { ...asAnswer(answer), trace: [`The endpoint distance is ${distance}.`, `The middle letter is ${answer} positions from each endpoint.`] };
    }
    case "RECOVER_ENDPOINTS_FROM_MIDPOINT_AND_DISTANCE": {
      const centre = leftRank(data.midpoint!);
      const first = letterAtLeftRank(centre - data.rank!);
      const second = letterAtLeftRank(centre + data.rank!);
      const answer = `${first}, ${second}`;
      return { ...asAnswer(answer), trace: [`Move ${data.rank} positions on each side of ${data.midpoint}.`, `The endpoints are ${first} and ${second}.`] };
    }
    case "COMPARE_TWO_GAPS": {
      const gapA = exclusiveGap(...data.pairA!);
      const gapB = exclusiveGap(...data.pairB!);
      const answer = Math.abs(gapA - gapB);
      return { ...asAnswer(answer), trace: [`${pairText(data.pairA!)} has gap ${gapA}; ${pairText(data.pairB!)} has gap ${gapB}.`, `The difference is ${answer}.`] };
    }
    case "COUNT_LETTERS_OUTSIDE_INTERVAL": {
      const answer = ALPHABET_SIZE - inclusiveSpan(data.letter!, data.secondLetter!);
      return { ...asAnswer(answer), trace: [`The inclusive interval occupies ${inclusiveSpan(data.letter!, data.secondLetter!)} positions.`, `Outside it: 26 − ${inclusiveSpan(data.letter!, data.secondLetter!)} = ${answer}.`] };
    }
    case "COUNT_LETTERS_BEFORE_AND_AFTER": {
      const low = Math.min(leftRank(data.letter!), leftRank(data.secondLetter!));
      const high = Math.max(leftRank(data.letter!), leftRank(data.secondLetter!));
      const before = low - 1;
      const after = ALPHABET_SIZE - high;
      return { ...asAnswer(`${before}, ${after}`), trace: [`There are ${before} letters before the earlier endpoint.`, `There are ${after} letters after the later endpoint.`] };
    }
    case "EQUAL_SIDE_GAP": {
      const distance = positionDistance(data.letter!, data.secondLetter!);
      if (distance % 2 !== 0) throw new Error("Equal-side gap requires a single midpoint.");
      const answer = distance / 2 - 1;
      return { ...asAnswer(answer), trace: [`Each endpoint is ${distance / 2} positions from the midpoint.`, `Therefore ${answer} letters lie strictly between the midpoint and either endpoint.`] };
    }
    default:
      throw new Error(`Unsupported CP-003 solve mode ${ql.solveMode}.`);
  }
}

function solveCp004(ql: AlpQuestionLogic, data: AlpInstanceData): AlpSolverResult {
  const sequence = applyAlphabetTransform(data.transformId!, data.rotationStart);
  if (data.transformedSequence && sequence.join("") !== data.transformedSequence.join("")) {
    throw new Error("Stored transformed alphabet does not match independent reconstruction.");
  }
  if (ql.solveMode === "LETTER_AT_TRANSFORMED_POSITION") {
    const answer = sequence[data.position! - 1];
    if (!answer) throw new Error("Transformed position is out of range.");
    return { answer, canonicalValue: answer, trace: [`Construct the transformed order: ${sequence.join(" ")}.`, `Position ${data.position} contains ${answer}.`], workingSequence: sequence };
  }
  if (ql.solveMode === "TRANSFORMED_POSITION_OF_LETTER") {
    const answer = transformedPosition(sequence, data.targetLetter!);
    return { ...asAnswer(answer), trace: [`Construct the transformed order: ${sequence.join(" ")}.`, `${data.targetLetter} appears at position ${answer}.`], workingSequence: sequence };
  }
  throw new Error(`Unsupported CP-004 solve mode ${ql.solveMode}.`);
}

function transformedWordResult(data: AlpInstanceData): { refs: ReturnType<typeof applyWordTransformRefs>; word: string } {
  const refs = applyWordTransformRefs(data.word!, data.wordTransformId!, data.rangeStart, data.rangeEnd);
  const word = refsToWord(refs);
  if (data.transformedWord && data.transformedWord !== word) {
    throw new Error("Stored transformed word does not match independent reconstruction.");
  }
  return { refs, word };
}

function solveCp005(ql: AlpQuestionLogic, data: AlpInstanceData): AlpSolverResult {
  const word = data.word!;
  switch (ql.solveMode) {
    case "WORD_LETTER_FROM_LEFT": {
      const answer = word[data.position! - 1]!;
      return { ...asAnswer(answer), trace: [`Count ${data.position} positions from the left in ${word}.`, `The letter is ${answer}.`] };
    }
    case "WORD_LETTER_FROM_RIGHT": {
      const index = word.length - data.position!;
      const answer = word[index]!;
      return { ...asAnswer(answer), trace: [`The ${data.position}th position from the right is left position ${index + 1}.`, `The letter is ${answer}.`] };
    }
    case "WORD_LEFT_POSITION_OF_LETTER": {
      const answer = findOccurrencePosition(word, data.occurrenceRef!);
      return { ...asAnswer(answer), trace: [`Track the ${occurrenceLabel(data.occurrenceRef!)} in ${word}.`, `It is at position ${answer} from the left.`] };
    }
    case "WORD_RIGHT_POSITION_OF_LETTER": {
      const left = findOccurrencePosition(word, data.occurrenceRef!);
      const answer = word.length - left + 1;
      return { ...asAnswer(answer), trace: [`The ${occurrenceLabel(data.occurrenceRef!)} is at left position ${left}.`, `Right position = ${word.length} − ${left} + 1 = ${answer}.`] };
    }
    case "WORD_RELATIVE_RIGHT":
    case "WORD_RELATIVE_LEFT": {
      const anchor = findOccurrencePosition(word, data.occurrenceRef!);
      const target = ql.solveMode === "WORD_RELATIVE_RIGHT" ? anchor + data.offset! : anchor - data.offset!;
      const answer = word[target - 1]!;
      return { ...asAnswer(answer), trace: [`The ${occurrenceLabel(data.occurrenceRef!)} is at position ${anchor}.`, `Move ${data.offset} place(s) ${data.direction?.toLowerCase()} to position ${target}; the letter is ${answer}.`] };
    }
    case "WORD_MIDDLE_SINGLE": {
      if (word.length % 2 !== 1) throw new Error("Single-middle word must have odd length.");
      const position = (word.length + 1) / 2;
      const answer = word[position - 1]!;
      return { ...asAnswer(answer), trace: [`Middle position = (${word.length} + 1) ÷ 2 = ${position}.`, `The middle letter is ${answer}.`] };
    }
    case "WORD_MIDDLE_PAIR": {
      if (word.length % 2 !== 0) throw new Error("Middle-pair word must have even length.");
      const left = word.length / 2;
      const answer = `${word[left - 1]}, ${word[left]}`;
      return { ...asAnswer(answer), trace: [`The two middle positions are ${left} and ${left + 1}.`, `Their letters are ${answer}.`] };
    }
    case "WORD_AFTER_REVERSE_POSITION":
    case "WORD_AFTER_ASC_SORT_POSITION":
    case "WORD_AFTER_DESC_SORT_POSITION":
    case "WORD_VOWELS_FIRST_POSITION":
    case "WORD_CONSONANTS_FIRST_POSITION":
    case "WORD_ODD_THEN_EVEN_POSITION":
    case "WORD_EVEN_THEN_ODD_POSITION":
    case "WORD_SWAP_ADJACENT_POSITION":
    case "WORD_REVERSE_RANGE_POSITION": {
      const transformed = transformedWordResult(data);
      const answer = transformed.word[data.position! - 1]!;
      return { ...asAnswer(answer), trace: [`The rearranged word is ${transformed.word}.`, `Position ${data.position} contains ${answer}.`], workingSequence: [...transformed.word] };
    }
    case "WORD_POSITION_AFTER_REVERSE":
    case "WORD_POSITION_AFTER_ASC_SORT":
    case "WORD_POSITION_AFTER_DESC_SORT":
    case "WORD_POSITION_AFTER_VOWELS_FIRST":
    case "WORD_POSITION_AFTER_CONSONANTS_FIRST":
    case "WORD_POSITION_AFTER_ODD_THEN_EVEN":
    case "WORD_POSITION_AFTER_EVEN_THEN_ODD":
    case "WORD_POSITION_AFTER_SWAP_ADJACENT":
    case "WORD_POSITION_AFTER_REVERSE_RANGE": {
      const transformed = transformedWordResult(data);
      const answer = transformedOccurrencePosition(word, data.wordTransformId!, data.occurrenceRef!, data.rangeStart, data.rangeEnd);
      return { ...asAnswer(answer), trace: [`The rearranged word is ${transformed.word}.`, `The ${occurrenceLabel(data.occurrenceRef!)} is at position ${answer}.`], workingSequence: [...transformed.word] };
    }
    case "WORD_COUNT_UNCHANGED_ASC":
    case "WORD_COUNT_UNCHANGED_DESC":
    case "WORD_COUNT_UNCHANGED_SELECTED_TRANSFORM": {
      const transformed = transformedWordResult(data);
      const unchanged = unchangedRefs(word, data.wordTransformId!, data.rangeStart, data.rangeEnd);
      const answer = unchanged.length;
      return { ...asAnswer(answer), trace: [`Original: ${word}; rearranged: ${transformed.word}.`, `${answer} occurrence(s) remain in exactly the same position.`], workingSequence: [...transformed.word] };
    }
    case "WORD_IDENTIFY_UNCHANGED_ASC": {
      const transformed = transformedWordResult(data);
      const unchanged = unchangedRefs(word, data.wordTransformId!, data.rangeStart, data.rangeEnd);
      const answer = unchanged.length === 0 ? "None" : unchanged.map(occurrenceLabel).join("; ");
      return { ...asAnswer(answer), trace: [`Original: ${word}; alphabetically arranged: ${transformed.word}.`, `Unchanged occurrence(s): ${answer}.`], workingSequence: [...transformed.word] };
    }
    default:
      throw new Error(`Unsupported CP-005 solve mode ${ql.solveMode}.`);
  }
}

export function solveAlpInstance(ql: AlpQuestionLogic, data: AlpInstanceData): AlpSolverResult {
  switch (ql.checkpointId) {
    case "ALP-CP-001": return solveCp001(ql, data);
    case "ALP-CP-002": return solveCp002(ql, data);
    case "ALP-CP-003": return solveCp003(ql, data);
    case "ALP-CP-004": return solveCp004(ql, data);
    case "ALP-CP-005": return solveCp005(ql, data);
  }
}
