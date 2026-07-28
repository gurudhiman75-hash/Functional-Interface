import { ALPHABET, cyclicShift, oppositeLetter } from "./foundation/alphabet";
import { shuffle } from "./foundation/prng";
import { findOccurrencePosition, occurrenceLabel, occurrenceRefs } from "./foundation/word";
import type { AlpInstanceData, AlpOption, AlpQuestionLogic, AlpSolverResult } from "./types";

interface Candidate {
  readonly value: string;
  readonly errorLabel: string;
}

function uniqueCandidates(candidates: readonly Candidate[], correct: string): Candidate[] {
  const seen = new Set<string>();
  const result: Candidate[] = [];
  for (const candidate of candidates) {
    if (!candidate.value.trim() || candidate.value === correct || seen.has(candidate.value)) continue;
    seen.add(candidate.value);
    result.push(candidate);
  }
  return result;
}

function numericBounds(ql: AlpQuestionLogic, data: AlpInstanceData): readonly [number, number] {
  if (ql.checkpointId === "ALP-CP-005") {
    const length = data.word?.length ?? 26;
    if (ql.solveMode.includes("COUNT_UNCHANGED")) return [0, length];
    return [1, length];
  }
  if (
    ql.solveMode === "EXCLUSIVE_GAP"
    || ql.solveMode === "COMPARE_TWO_GAPS"
    || ql.solveMode === "COUNT_LETTERS_OUTSIDE_INTERVAL"
    || ql.solveMode === "EQUAL_SIDE_GAP"
  ) return [0, 25];
  if (ql.solveMode === "ABSOLUTE_POSITION_DISTANCE" || ql.solveMode === "MIDPOINT_DISTANCE_FROM_ENDPOINTS") return [1, 25];
  return [1, 26];
}

function numericDistractors(ql: AlpQuestionLogic, correct: number, data: AlpInstanceData): Candidate[] {
  const [minimum, maximum] = numericBounds(ql, data);
  const candidates: Candidate[] = [
    { value: String(correct - 1), errorLabel: "OFF_BY_ONE_ENDPOINT" },
    { value: String(correct + 1), errorLabel: "OFF_BY_ONE_ENDPOINT" },
    { value: String(correct - 2), errorLabel: "TWO_STEP_MISCOUNT" },
    { value: String(correct + 2), errorLabel: "TWO_STEP_MISCOUNT" },
    { value: String(27 - correct), errorLabel: "WRONG_REFERENCE_END" },
  ];

  if (data.rank !== undefined) candidates.push({ value: String(data.rank), errorLabel: "USED_GIVEN_RANK_AS_ANSWER" });
  if (data.offset !== undefined) candidates.push({ value: String(data.offset), errorLabel: "USED_SHIFT_AS_FINAL_POSITION" });
  if (data.secondOffset !== undefined) candidates.push({ value: String(data.secondOffset), errorLabel: "USED_SECOND_SHIFT_ONLY" });
  if (data.position !== undefined) candidates.push({ value: String(data.position), errorLabel: "USED_QUERIED_POSITION_AS_ANSWER" });

  if (ql.checkpointId === "ALP-CP-005" && data.word && data.occurrenceRef) {
    const originalLeft = findOccurrencePosition(data.word, data.occurrenceRef);
    const originalRight = data.word.length - originalLeft + 1;
    candidates.push(
      { value: String(originalLeft), errorLabel: "USED_ORIGINAL_LEFT_POSITION" },
      { value: String(originalRight), errorLabel: "USED_ORIGINAL_RIGHT_POSITION" },
    );
  }

  for (let delta = 3; delta <= Math.max(6, maximum - minimum); delta += 1) {
    candidates.push(
      { value: String(correct - delta), errorLabel: "POSITION_MISCOUNT" },
      { value: String(correct + delta), errorLabel: "POSITION_MISCOUNT" },
    );
  }

  return uniqueCandidates(
    candidates.filter((candidate) => {
      const value = Number(candidate.value);
      return Number.isInteger(value) && value >= minimum && value <= maximum;
    }),
    String(correct),
  );
}

function letterDistractors(correct: string, data: AlpInstanceData): Candidate[] {
  const candidates: Candidate[] = [
    { value: cyclicShift(correct, 1), errorLabel: "STOPPED_ONE_STEP_LATE" },
    { value: cyclicShift(correct, -1), errorLabel: "STOPPED_ONE_STEP_EARLY" },
    { value: cyclicShift(correct, 2), errorLabel: "STOPPED_TWO_STEPS_LATE" },
    { value: cyclicShift(correct, -2), errorLabel: "STOPPED_TWO_STEPS_EARLY" },
    { value: oppositeLetter(correct), errorLabel: "USED_OPPOSITE_OR_REFERENCE_END" },
  ];
  if (data.letter) candidates.push({ value: data.letter, errorLabel: "RETAINED_SOURCE_LETTER" });
  if (data.secondLetter) candidates.push({ value: data.secondLetter, errorLabel: "USED_OTHER_ENDPOINT" });
  if (data.targetLetter) candidates.push({ value: data.targetLetter, errorLabel: "RETAINED_TARGET_LETTER" });
  return uniqueCandidates(candidates.filter((candidate) => /^[A-Z]$/.test(candidate.value)), correct);
}

function pairDistractors(correct: string): Candidate[] {
  const letters = correct.match(/[A-Z]/g) ?? [];
  if (letters.length >= 2) {
    const [first, second] = letters;
    return uniqueCandidates([
      { value: `${second}, ${first}`, errorLabel: "REVERSED_PAIR_ORDER" },
      { value: `${cyclicShift(first!, 1)}, ${second}`, errorLabel: "FIRST_MEMBER_OFF_BY_ONE" },
      { value: `${first}, ${cyclicShift(second!, 1)}`, errorLabel: "SECOND_MEMBER_OFF_BY_ONE" },
      { value: `${cyclicShift(first!, -1)}, ${second}`, errorLabel: "FIRST_MEMBER_OFF_BY_ONE" },
      { value: `${first}, ${cyclicShift(second!, -1)}`, errorLabel: "SECOND_MEMBER_OFF_BY_ONE" },
    ], correct);
  }
  const numbers = correct.match(/\d+/g)?.map(Number) ?? [];
  if (numbers.length >= 2) {
    const [first, second] = numbers;
    return uniqueCandidates([
      { value: `${second}, ${first}`, errorLabel: "REVERSED_PAIR_ORDER" },
      { value: `${Math.max(0, first! - 1)}, ${second}`, errorLabel: "FIRST_COUNT_OFF_BY_ONE" },
      { value: `${first! + 1}, ${second}`, errorLabel: "FIRST_COUNT_OFF_BY_ONE" },
      { value: `${first}, ${Math.max(0, second! - 1)}`, errorLabel: "SECOND_COUNT_OFF_BY_ONE" },
      { value: `${first}, ${second! + 1}`, errorLabel: "SECOND_COUNT_OFF_BY_ONE" },
    ], correct);
  }
  return [];
}

function letterSetDistractors(correct: string, data: AlpInstanceData): Candidate[] {
  const refs = occurrenceRefs(data.word!).map(occurrenceLabel);
  const candidates: Candidate[] = [
    { value: "None", errorLabel: "ASSUMED_NO_UNCHANGED_OCCURRENCE" },
    { value: refs[0] ?? "", errorLabel: "CHECKED_FIRST_POSITION_ONLY" },
    { value: refs.at(-1) ?? "", errorLabel: "CHECKED_LAST_POSITION_ONLY" },
    { value: refs.slice(0, 2).join("; "), errorLabel: "PARTIAL_POSITION_COMPARISON" },
    { value: refs.slice(-2).join("; "), errorLabel: "PARTIAL_POSITION_COMPARISON" },
    { value: refs.filter((_, index) => index % 2 === 0).slice(0, 3).join("; "), errorLabel: "CHECKED_ALTERNATE_POSITIONS_ONLY" },
  ];
  return uniqueCandidates(candidates, correct);
}

function directionDistractors(correct: string): Candidate[] {
  const match = correct.match(/^(\d+) to the (left|right)$/);
  if (!match) return [];
  const amount = Number(match[1]);
  const direction = match[2];
  const opposite = direction === "left" ? "right" : "left";
  return uniqueCandidates([
    { value: `${amount} to the ${opposite}`, errorLabel: "CORRECT_DISTANCE_WRONG_DIRECTION" },
    { value: `${Math.max(1, amount - 1)} to the ${direction}`, errorLabel: "DISTANCE_OFF_BY_ONE" },
    { value: `${amount + 1} to the ${direction}`, errorLabel: "DISTANCE_OFF_BY_ONE" },
    { value: `${Math.max(1, amount - 1)} to the ${opposite}`, errorLabel: "WRONG_DIRECTION_AND_DISTANCE" },
    { value: `${amount + 1} to the ${opposite}`, errorLabel: "WRONG_DIRECTION_AND_DISTANCE" },
  ], correct);
}

function fallbackCandidates(ql: AlpQuestionLogic, correct: string, data: AlpInstanceData): Candidate[] {
  if (/^[A-Z]$/.test(correct)) return letterDistractors(correct, data);
  if (/^\d+$/.test(correct)) return numericDistractors(ql, Number(correct), data);
  return ALPHABET.slice(0, 10)
    .filter((value) => value !== correct)
    .map((value) => ({ value, errorLabel: "FALLBACK_RELATION_MISMATCH" }));
}

export function buildAlpOptions(
  ql: AlpQuestionLogic,
  data: AlpInstanceData,
  solved: AlpSolverResult,
  seed: number,
): readonly AlpOption[] {
  const correct = solved.answer;

  if (ql.answerType === "PAIR_SELECTION") {
    const values = data.pairOptions!.map(([first, second]) => `${first} : ${second}`);
    const options = values.map((value) => ({ value, errorLabel: value === correct ? null : "PAIR_RELATION_MISMATCH" }));
    if (options.length !== 4 || options.filter((option) => option.errorLabel === null).length !== 1) {
      throw new Error(`${ql.qlId} pair options do not have exactly one correct answer.`);
    }
    const correctOption = options.find((option) => option.errorLabel === null)!;
    const wrongOptions = shuffle(options.filter((option) => option.errorLabel !== null), `${ql.qlId}:${seed}:pair-wrong-order`);
    const qlNumber = Number.parseInt(ql.qlId.slice(-3), 10);
    const desiredCorrectIndex = ((Math.abs(seed) % 4) + (qlNumber % 4)) % 4;
    wrongOptions.splice(desiredCorrectIndex, 0, correctOption);
    return wrongOptions;
  }

  let candidates: Candidate[] = [];
  if (ql.answerType === "NUMBER") candidates = numericDistractors(ql, Number(solved.canonicalValue), data);
  else if (ql.answerType === "LETTER") candidates = letterDistractors(correct, data);
  else if (ql.answerType === "LETTER_PAIR" || ql.answerType === "NUMBER_PAIR") candidates = pairDistractors(correct);
  else if (ql.answerType === "LETTER_SET") candidates = letterSetDistractors(correct, data);
  else if (ql.answerType === "DIRECTION_OFFSET") candidates = directionDistractors(correct);

  candidates = uniqueCandidates([...candidates, ...fallbackCandidates(ql, correct, data)], correct);
  if (candidates.length < 3) throw new Error(`${ql.qlId} cannot produce three distinct distractors for ${correct}.`);
  const wrong = shuffle(candidates, `${ql.qlId}:${seed}:distractors`).slice(0, 3);
  const options: AlpOption[] = [
    { value: correct, errorLabel: null },
    ...wrong.map((candidate) => ({ value: candidate.value, errorLabel: candidate.errorLabel })),
  ];

  const qlNumber = Number.parseInt(ql.qlId.slice(-3), 10);
  const desiredCorrectIndex = ((Math.abs(seed) % 4) + (qlNumber % 4)) % 4;
  const correctOption = options.shift()!;
  const shuffledWrong = shuffle(options, `${ql.qlId}:${seed}:wrong-order`);
  shuffledWrong.splice(desiredCorrectIndex, 0, correctOption);
  return shuffledWrong;
}

export function validateAlpOptions(options: readonly AlpOption[], correctAnswer: string): number {
  if (options.length !== 4) throw new Error(`Expected four options, received ${options.length}.`);
  if (new Set(options.map((option) => option.value)).size !== 4) throw new Error("Option values are not unique.");
  const correctIndices = options
    .map((option, index) => option.value === correctAnswer ? index : -1)
    .filter((index) => index >= 0);
  if (correctIndices.length !== 1) throw new Error(`Expected one correct option, found ${correctIndices.length}.`);
  if (options.filter((option) => option.errorLabel === null).length !== 1) throw new Error("Correctness marker is not unique.");
  if (options[correctIndices[0]!]!.errorLabel !== null) throw new Error("Correct option has an error label.");
  return correctIndices[0]!;
}
