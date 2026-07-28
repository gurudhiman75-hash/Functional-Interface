import {
  ALPHABET,
  boundedShift,
  cyclicShift,
  exclusiveGap,
  leftRank,
  letterAtLeftRank,
  letterAtRightRank,
  midpointLetters,
  oppositeLetter,
  rightRank,
} from "./foundation/alphabet";
import { intBetween, pick, shuffle } from "./foundation/prng";
import { applyAlphabetTransform } from "./foundation/sequence";
import {
  WORD_BANK,
  applyWordTransformRefs,
  occurrenceAtPosition,
  occurrenceRefs,
  refsToWord,
  unchangedRefs,
} from "./foundation/word";
import type { AlpInstanceData, AlpQuestionLogic, AlpWordTransformId } from "./types";

function seedKey(ql: AlpQuestionLogic, seed: number, salt: string): string {
  return `${ql.qlId}:${seed}:${salt}`;
}

function distinctPair(first: string, second: string): readonly [string, string] {
  if (first === second) throw new Error("Expected two distinct letters.");
  return [first, second] as const;
}

function generateCp001(ql: AlpQuestionLogic, seed: number): AlpInstanceData {
  const rank = intBetween(2, 25, seedKey(ql, seed, "rank"));
  const letter = letterAtLeftRank(rank);
  switch (ql.solveMode) {
    case "LETTER_AT_LEFT_RANK":
    case "RIGHT_RANK_FROM_LEFT_RANK":
    case "OPPOSITE_OF_LEFT_RANK":
      return { rank };
    case "LETTER_AT_RIGHT_RANK":
    case "LEFT_RANK_FROM_RIGHT_RANK":
    case "OPPOSITE_OF_RIGHT_RANK":
      return { rank };
    case "LEFT_RANK_OF_LETTER":
    case "RIGHT_RANK_OF_LETTER":
    case "OPPOSITE_OF_LETTER":
    case "BOTH_RANKS_OF_LETTER":
      return { letter };
    case "IDENTIFY_LETTER_FROM_RANK_PAIR":
      return { rank: leftRank(letter), secondRank: rightRank(letter) };
    case "IDENTIFY_OPPOSITE_PAIR": {
      const correctLeft = letter;
      const correct = [correctLeft, oppositeLetter(correctLeft)] as const;
      const candidates: (readonly [string, string])[] = [correct];
      for (const candidateLeft of shuffle(ALPHABET, seedKey(ql, seed, "pair-lefts"))) {
        const wrongCandidates = [
          cyclicShift(candidateLeft, 1),
          cyclicShift(candidateLeft, -1),
          cyclicShift(oppositeLetter(candidateLeft), 1),
          cyclicShift(oppositeLetter(candidateLeft), -1),
        ];
        for (const candidateRight of wrongCandidates) {
          if (candidateRight === oppositeLetter(candidateLeft)) continue;
          if (candidates.some(([left, right]) => left === candidateLeft && right === candidateRight)) continue;
          candidates.push([candidateLeft, candidateRight]);
          if (candidates.length === 4) break;
        }
        if (candidates.length === 4) break;
      }
      return { pairOptions: shuffle(candidates, seedKey(ql, seed, "pair-order")) };
    }
    default:
      throw new Error(`Unsupported CP-001 mode ${ql.solveMode}.`);
  }
}

function safeBoundedAnchor(direction: "LEFT" | "RIGHT", offset: number, ql: AlpQuestionLogic, seed: number): string {
  const min = direction === "RIGHT" ? 2 : offset + 1;
  const max = direction === "RIGHT" ? 26 - offset : 25;
  return letterAtLeftRank(intBetween(min, max, seedKey(ql, seed, `anchor-${direction}-${offset}`)));
}

function generateCp002(ql: AlpQuestionLogic, seed: number): AlpInstanceData {
  const offset = intBetween(2, 8, seedKey(ql, seed, "offset"));
  switch (ql.solveMode) {
    case "SHIFT_RIGHT_FROM_LETTER_BOUNDED":
      return { letter: safeBoundedAnchor("RIGHT", offset, ql, seed), offset, direction: "RIGHT" };
    case "SHIFT_LEFT_FROM_LETTER_BOUNDED":
      return { letter: safeBoundedAnchor("LEFT", offset, ql, seed), offset, direction: "LEFT" };
    case "SHIFT_RIGHT_FROM_LEFT_RANK": {
      const letter = safeBoundedAnchor("RIGHT", offset, ql, seed);
      return { rank: leftRank(letter), offset, direction: "RIGHT" };
    }
    case "SHIFT_LEFT_FROM_LEFT_RANK": {
      const letter = safeBoundedAnchor("LEFT", offset, ql, seed);
      return { rank: leftRank(letter), offset, direction: "LEFT" };
    }
    case "SHIFT_RIGHT_FROM_RIGHT_RANK": {
      const letter = safeBoundedAnchor("RIGHT", offset, ql, seed);
      return { rank: rightRank(letter), offset, direction: "RIGHT" };
    }
    case "SHIFT_LEFT_FROM_RIGHT_RANK": {
      const letter = safeBoundedAnchor("LEFT", offset, ql, seed);
      return { rank: rightRank(letter), offset, direction: "LEFT" };
    }
    case "RECOVER_ANCHOR_FROM_RIGHT_SHIFT": {
      const anchor = safeBoundedAnchor("RIGHT", offset, ql, seed);
      return { targetLetter: boundedShift(anchor, offset)!, offset, direction: "RIGHT" };
    }
    case "RECOVER_ANCHOR_FROM_LEFT_SHIFT": {
      const anchor = safeBoundedAnchor("LEFT", offset, ql, seed);
      return { targetLetter: boundedShift(anchor, -offset)!, offset, direction: "LEFT" };
    }
    case "FIND_FORWARD_OFFSET": {
      const first = safeBoundedAnchor("RIGHT", offset, ql, seed);
      return { letter: first, targetLetter: boundedShift(first, offset)!, direction: "RIGHT" };
    }
    case "FIND_BACKWARD_OFFSET": {
      const first = safeBoundedAnchor("LEFT", offset, ql, seed);
      return { letter: first, targetLetter: boundedShift(first, -offset)!, direction: "LEFT" };
    }
    case "FIND_SIGNED_DIRECTION_AND_OFFSET": {
      const direction = pick(["LEFT", "RIGHT"] as const, seedKey(ql, seed, "direction"));
      const first = safeBoundedAnchor(direction, offset, ql, seed);
      return {
        letter: first,
        targetLetter: boundedShift(first, direction === "RIGHT" ? offset : -offset)!,
        direction,
      };
    }
    case "TWO_STAGE_RIGHT_THEN_LEFT": {
      const secondOffset = intBetween(1, offset - 1, seedKey(ql, seed, "second-offset"));
      const letter = safeBoundedAnchor("RIGHT", offset, ql, seed);
      return { letter, offset, secondOffset, direction: "RIGHT" };
    }
    case "TWO_STAGE_LEFT_THEN_RIGHT": {
      const secondOffset = intBetween(1, offset - 1, seedKey(ql, seed, "second-offset"));
      const letter = safeBoundedAnchor("LEFT", offset, ql, seed);
      return { letter, offset, secondOffset, direction: "LEFT" };
    }
    case "POSITION_AFTER_SHIFT_FROM_LEFT": {
      const direction = pick(["LEFT", "RIGHT"] as const, seedKey(ql, seed, "direction"));
      const letter = safeBoundedAnchor(direction, offset, ql, seed);
      return { letter, offset, direction };
    }
    case "POSITION_AFTER_SHIFT_FROM_RIGHT": {
      const direction = pick(["LEFT", "RIGHT"] as const, seedKey(ql, seed, "direction"));
      const letter = safeBoundedAnchor(direction, offset, ql, seed);
      return { letter, offset, direction };
    }
    case "CYCLIC_SHIFT_RIGHT_FROM_LETTER": {
      const startRank = intBetween(27 - offset, 26, seedKey(ql, seed, "wrap-right"));
      return { letter: letterAtLeftRank(startRank), offset, direction: "RIGHT" };
    }
    case "CYCLIC_SHIFT_LEFT_FROM_LETTER": {
      const startRank = intBetween(1, offset, seedKey(ql, seed, "wrap-left"));
      return { letter: letterAtLeftRank(startRank), offset, direction: "LEFT" };
    }
    case "RECOVER_ANCHOR_CYCLIC": {
      const direction = pick(["LEFT", "RIGHT"] as const, seedKey(ql, seed, "direction"));
      const anchorRank = direction === "RIGHT"
        ? intBetween(27 - offset, 26, seedKey(ql, seed, "anchor-rank"))
        : intBetween(1, offset, seedKey(ql, seed, "anchor-rank"));
      const anchor = letterAtLeftRank(anchorRank);
      return { targetLetter: cyclicShift(anchor, direction === "RIGHT" ? offset : -offset), offset, direction };
    }
    default:
      throw new Error(`Unsupported CP-002 mode ${ql.solveMode}.`);
  }
}

function intervalPair(ql: AlpQuestionLogic, seed: number, parity: "EVEN_SUM" | "ODD_SUM" | "ANY" = "ANY"): readonly [string, string] {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const firstRank = intBetween(2, 19, seedKey(ql, seed, `interval-first-${attempt}`));
    const distance = intBetween(3, Math.min(10, 26 - firstRank), seedKey(ql, seed, `interval-distance-${attempt}`));
    const secondRank = firstRank + distance;
    const sumEven = (firstRank + secondRank) % 2 === 0;
    if (parity === "EVEN_SUM" && !sumEven) continue;
    if (parity === "ODD_SUM" && sumEven) continue;
    return [letterAtLeftRank(firstRank), letterAtLeftRank(secondRank)];
  }
  throw new Error(`Unable to create interval for ${ql.qlId}.`);
}

function buildPairOptions(
  correct: readonly [string, string],
  targetValue: number,
  valueKind: "GAP" | "DISTANCE",
  ql: AlpQuestionLogic,
  seed: number,
): readonly (readonly [string, string])[] {
  const options: (readonly [string, string])[] = [correct];
  for (const first of shuffle(ALPHABET, seedKey(ql, seed, "option-first"))) {
    for (const second of shuffle(ALPHABET, seedKey(ql, seed, `option-second-${first}`))) {
      if (first === second) continue;
      const value = valueKind === "GAP" ? exclusiveGap(first, second) : Math.abs(leftRank(first) - leftRank(second));
      if (value === targetValue) continue;
      if (options.some(([a, b]) => a === first && b === second)) continue;
      options.push([first, second]);
      if (options.length === 4) return shuffle(options, seedKey(ql, seed, "option-order"));
    }
  }
  throw new Error("Unable to build pair options.");
}

function generateCp003(ql: AlpQuestionLogic, seed: number): AlpInstanceData {
  switch (ql.solveMode) {
    case "MIDPOINT_SINGLE":
    case "MIDPOINT_DISTANCE_FROM_ENDPOINTS":
    case "EQUAL_SIDE_GAP": {
      const [letter, secondLetter] = intervalPair(ql, seed, "EVEN_SUM");
      return { letter, secondLetter };
    }
    case "MIDPOINT_PAIR": {
      const [letter, secondLetter] = intervalPair(ql, seed, "ODD_SUM");
      return { letter, secondLetter };
    }
    case "IDENTIFY_PAIR_WITH_GAP": {
      const [letter, secondLetter] = intervalPair(ql, seed);
      const gap = exclusiveGap(letter, secondLetter);
      return { rank: gap, pairOptions: buildPairOptions([letter, secondLetter], gap, "GAP", ql, seed) };
    }
    case "IDENTIFY_PAIR_WITH_DISTANCE": {
      const [letter, secondLetter] = intervalPair(ql, seed);
      const distance = Math.abs(leftRank(letter) - leftRank(secondLetter));
      return { rank: distance, pairOptions: buildPairOptions([letter, secondLetter], distance, "DISTANCE", ql, seed) };
    }
    case "RECOVER_RIGHT_ENDPOINT_FROM_GAP": {
      const [letter, secondLetter] = intervalPair(ql, seed);
      return { letter, rank: exclusiveGap(letter, secondLetter), direction: "RIGHT" };
    }
    case "RECOVER_LEFT_ENDPOINT_FROM_GAP": {
      const [letter, secondLetter] = intervalPair(ql, seed);
      return { letter: secondLetter, rank: exclusiveGap(letter, secondLetter), direction: "LEFT" };
    }
    case "RECOVER_ENDPOINT_FROM_DISTANCE_AND_DIRECTION": {
      const [left, right] = intervalPair(ql, seed);
      const direction = pick(["LEFT", "RIGHT"] as const, seedKey(ql, seed, "endpoint-direction"));
      return direction === "RIGHT"
        ? { letter: left, rank: Math.abs(leftRank(left) - leftRank(right)), direction }
        : { letter: right, rank: Math.abs(leftRank(left) - leftRank(right)), direction };
    }
    case "RECOVER_ENDPOINTS_FROM_MIDPOINT_AND_DISTANCE": {
      const midpointRank = intBetween(7, 20, seedKey(ql, seed, "mid-rank"));
      const halfDistance = intBetween(2, Math.min(5, midpointRank - 1, 26 - midpointRank), seedKey(ql, seed, "half-distance"));
      return { midpoint: letterAtLeftRank(midpointRank), rank: halfDistance };
    }
    case "COMPARE_TWO_GAPS": {
      const pairA = intervalPair(ql, seed);
      let pairB: readonly [string, string] | null = null;
      for (let attempt = 1; attempt <= 20; attempt += 1) {
        const candidate = intervalPair(ql, seed + attempt * 1009);
        if (exclusiveGap(...pairA) !== exclusiveGap(...candidate)) {
          pairB = candidate;
          break;
        }
      }
      if (!pairB) throw new Error(`Unable to create two different gaps for ${ql.qlId}.`);
      return { pairA, pairB };
    }
    case "EXCLUSIVE_GAP":
    case "INCLUSIVE_SPAN":
    case "ABSOLUTE_POSITION_DISTANCE":
    case "COUNT_LETTERS_OUTSIDE_INTERVAL":
    case "COUNT_LETTERS_BEFORE_AND_AFTER": {
      const [letter, secondLetter] = intervalPair(ql, seed);
      return { letter, secondLetter };
    }
    default:
      throw new Error(`Unsupported CP-003 mode ${ql.solveMode}.`);
  }
}

function generateCp004(ql: AlpQuestionLogic, seed: number): AlpInstanceData {
  const transformId = ql.transformId!;
  const rotationStart = transformId === "ROTATE_TO_START"
    ? letterAtLeftRank(intBetween(4, 22, seedKey(ql, seed, "rotation")))
    : undefined;
  const transformedSequence = applyAlphabetTransform(transformId, rotationStart);
  if (ql.solveMode === "LETTER_AT_TRANSFORMED_POSITION") {
    return {
      sequence: ALPHABET,
      transformedSequence,
      transformId,
      rotationStart,
      position: intBetween(1, transformedSequence.length, seedKey(ql, seed, "position")),
    };
  }
  if (ql.solveMode === "TRANSFORMED_POSITION_OF_LETTER") {
    const targetLetter = pick(transformedSequence, seedKey(ql, seed, "letter"));
    return { sequence: ALPHABET, transformedSequence, transformId, rotationStart, targetLetter };
  }
  throw new Error(`Unsupported CP-004 mode ${ql.solveMode}.`);
}

function wordTransformForMode(mode: AlpQuestionLogic["solveMode"], ql: AlpQuestionLogic, seed: number): AlpWordTransformId | undefined {
  if (mode.includes("REVERSE_RANGE")) return "REVERSE_RANGE";
  if (mode.includes("ASC")) return "ASC_SORT";
  if (mode.includes("DESC")) return "DESC_SORT";
  if (mode.includes("VOWELS_FIRST")) return "VOWELS_FIRST";
  if (mode.includes("CONSONANTS_FIRST")) return "CONSONANTS_FIRST";
  if (mode.includes("ODD_THEN_EVEN")) return "ODD_THEN_EVEN";
  if (mode.includes("EVEN_THEN_ODD")) return "EVEN_THEN_ODD";
  if (mode.includes("SWAP_ADJACENT")) return "SWAP_ADJACENT";
  if (mode.includes("REVERSE")) return "REVERSE";
  if (mode === "WORD_COUNT_UNCHANGED_SELECTED_TRANSFORM") {
    return pick(["REVERSE", "ASC_SORT", "DESC_SORT", "VOWELS_FIRST", "CONSONANTS_FIRST", "ODD_THEN_EVEN", "EVEN_THEN_ODD", "SWAP_ADJACENT"] as const, seedKey(ql, seed, "selected-transform"));
  }
  return undefined;
}

function pickWordForMode(ql: AlpQuestionLogic, seed: number): string {
  const candidates = WORD_BANK.filter((word) => {
    if (ql.solveMode === "WORD_MIDDLE_SINGLE" && word.length % 2 !== 1) return false;
    if (ql.solveMode === "WORD_MIDDLE_PAIR" && word.length % 2 !== 0) return false;
    if (ql.solveMode.includes("VOWELS_FIRST") || ql.solveMode.includes("CONSONANTS_FIRST")) {
      const vowels = [...word].filter((letter) => "AEIOU".includes(letter)).length;
      if (vowels === 0 || vowels === word.length) return false;
    }
    return word.length >= 6;
  });
  return pick(candidates, seedKey(ql, seed, "word"));
}

function generateCp005(ql: AlpQuestionLogic, seed: number): AlpInstanceData {
  let word = pickWordForMode(ql, seed);
  const length = word.length;
  const directPosition = intBetween(2, Math.max(2, length - 1), seedKey(ql, seed, "direct-position"));
  switch (ql.solveMode) {
    case "WORD_LETTER_FROM_LEFT": return { word, position: directPosition };
    case "WORD_LETTER_FROM_RIGHT": return { word, position: directPosition };
    case "WORD_LEFT_POSITION_OF_LETTER":
    case "WORD_RIGHT_POSITION_OF_LETTER": {
      const position = directPosition;
      return { word, occurrenceRef: occurrenceAtPosition(word, position) };
    }
    case "WORD_RELATIVE_RIGHT": {
      const offset = intBetween(1, 3, seedKey(ql, seed, "word-offset"));
      const position = intBetween(1, length - offset, seedKey(ql, seed, "word-anchor"));
      return { word, occurrenceRef: occurrenceAtPosition(word, position), offset, direction: "RIGHT" };
    }
    case "WORD_RELATIVE_LEFT": {
      const offset = intBetween(1, 3, seedKey(ql, seed, "word-offset"));
      const position = intBetween(offset + 1, length, seedKey(ql, seed, "word-anchor"));
      return { word, occurrenceRef: occurrenceAtPosition(word, position), offset, direction: "LEFT" };
    }
    case "WORD_MIDDLE_SINGLE":
    case "WORD_MIDDLE_PAIR": return { word };
    default: {
      const wordTransformId = wordTransformForMode(ql.solveMode, ql, seed);
      if (!wordTransformId) throw new Error(`Unsupported CP-005 mode ${ql.solveMode}.`);
      let rangeStart: number | undefined;
      let rangeEnd: number | undefined;
      if (wordTransformId === "REVERSE_RANGE") {
        rangeStart = intBetween(2, length - 3, seedKey(ql, seed, "range-start"));
        rangeEnd = intBetween(rangeStart + 2, length - 1, seedKey(ql, seed, "range-end"));
      }
      let transformedRefs = applyWordTransformRefs(word, wordTransformId, rangeStart, rangeEnd);
      let unchanged = unchangedRefs(word, wordTransformId, rangeStart, rangeEnd);
      if (ql.solveMode === "WORD_IDENTIFY_UNCHANGED_ASC" && unchanged.length === 0) {
        const fallback = WORD_BANK.find((candidate) => unchangedRefs(candidate, "ASC_SORT").length > 0);
        if (!fallback) throw new Error("Word bank has no unchanged ascending-sort example.");
        word = fallback;
        transformedRefs = applyWordTransformRefs(word, wordTransformId, rangeStart, rangeEnd);
        unchanged = unchangedRefs(word, wordTransformId, rangeStart, rangeEnd);
      }
      const transformedWord = refsToWord(transformedRefs);
      const payload: AlpInstanceData = {
        word,
        transformedWord,
        wordTransformId,
        rangeStart,
        rangeEnd,
        selectedTransformLabel: wordTransformId,
      };
      if (ql.solveMode.includes("POSITION") && !ql.solveMode.startsWith("WORD_POSITION_AFTER")) {
        return { ...payload, position: intBetween(1, transformedWord.length, seedKey(ql, seed, "transformed-position")) };
      }
      if (ql.solveMode.startsWith("WORD_POSITION_AFTER")) {
        const originalRefs = occurrenceRefs(word);
        return { ...payload, occurrenceRef: pick(originalRefs, seedKey(ql, seed, "occurrence")) };
      }
      return payload;
    }
  }
}

export function generateAlpInstance(ql: AlpQuestionLogic, seed: number): AlpInstanceData {
  if (!Number.isInteger(seed)) throw new Error(`ALP-001 seed must be an integer: ${seed}`);
  switch (ql.checkpointId) {
    case "ALP-CP-001": return generateCp001(ql, seed);
    case "ALP-CP-002": return generateCp002(ql, seed);
    case "ALP-CP-003": return generateCp003(ql, seed);
    case "ALP-CP-004": return generateCp004(ql, seed);
    case "ALP-CP-005": return generateCp005(ql, seed);
  }
}
