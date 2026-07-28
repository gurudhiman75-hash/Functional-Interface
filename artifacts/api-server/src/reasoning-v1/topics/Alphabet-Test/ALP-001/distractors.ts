import { ALPHABET, cyclicShift, leftRank, letterAtLeftRank, oppositeLetter } from "./foundation/alphabet";
import { shuffle } from "./foundation/prng";
import { occurrenceLabel, occurrenceRefs } from "./foundation/word";
import type { AlpInstanceData, AlpOption, AlpQuestionLogic, AlpSolverResult } from "./types";

function uniqueWrong(candidates: readonly string[], correct: string): string[] {
  return candidates.filter((value, index, all) => value !== correct && value.trim().length > 0 && all.indexOf(value) === index);
}

function numericDistractors(correct: number, data: AlpInstanceData): string[] {
  const candidates = [
    correct - 1,
    correct + 1,
    correct - 2,
    correct + 2,
    correct - 3,
    correct + 3,
    correct - 4,
    correct + 4,
    27 - correct,
    data.rank,
    data.offset,
    data.secondOffset,
  ].filter((value): value is number => Number.isInteger(value) && value! >= 0 && value! <= 26);
  return uniqueWrong(candidates.map(String), String(correct));
}

function letterDistractors(correct: string, data: AlpInstanceData): string[] {
  const candidates = [
    cyclicShift(correct, 1),
    cyclicShift(correct, -1),
    cyclicShift(correct, 2),
    cyclicShift(correct, -2),
    oppositeLetter(correct),
    data.letter,
    data.secondLetter,
    data.targetLetter,
  ].filter((value): value is string => typeof value === "string" && /^[A-Z]$/.test(value));
  return uniqueWrong(candidates, correct);
}

function pairDistractors(correct: string, data: AlpInstanceData): string[] {
  const letters = correct.match(/[A-Z]/g) ?? [];
  if (letters.length >= 2) {
    const [first, second] = letters;
    return uniqueWrong([
      `${second}, ${first}`,
      `${cyclicShift(first!, 1)}, ${second}`,
      `${first}, ${cyclicShift(second!, 1)}`,
      `${cyclicShift(first!, -1)}, ${second}`,
      `${first}, ${cyclicShift(second!, -1)}`,
    ], correct);
  }
  const numbers = correct.match(/\d+/g)?.map(Number) ?? [];
  if (numbers.length >= 2) {
    const [first, second] = numbers;
    return uniqueWrong([
      `${second}, ${first}`,
      `${Math.max(0, first! - 1)}, ${second}`,
      `${first! + 1}, ${second}`,
      `${first}, ${Math.max(0, second! - 1)}`,
      `${first}, ${second! + 1}`,
    ], correct);
  }
  return [];
}

function letterSetDistractors(correct: string, data: AlpInstanceData): string[] {
  const refs = occurrenceRefs(data.word!).map(occurrenceLabel);
  const candidates = [
    "None",
    refs[0],
    refs.at(-1),
    refs.slice(0, 2).join("; "),
    refs.slice(-2).join("; "),
    refs.filter((_, index) => index % 2 === 0).slice(0, 3).join("; "),
  ].filter((value): value is string => Boolean(value));
  return uniqueWrong(candidates, correct);
}

function directionDistractors(correct: string): string[] {
  const match = correct.match(/^(\d+) to the (left|right)$/);
  if (!match) return [];
  const amount = Number(match[1]);
  const direction = match[2];
  const opposite = direction === "left" ? "right" : "left";
  return uniqueWrong([
    `${amount} to the ${opposite}`,
    `${Math.max(1, amount - 1)} to the ${direction}`,
    `${amount + 1} to the ${direction}`,
    `${Math.max(1, amount - 1)} to the ${opposite}`,
    `${amount + 1} to the ${opposite}`,
  ], correct);
}

function fallbackCandidates(correct: string): string[] {
  if (/^[A-Z]$/.test(correct)) return letterDistractors(correct, {});
  if (/^\d+$/.test(correct)) return numericDistractors(Number(correct), {});
  return ALPHABET.slice(0, 8).filter((value) => value !== correct);
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

  let candidates: string[] = [];
  if (ql.answerType === "NUMBER") candidates = numericDistractors(Number(solved.canonicalValue), data);
  else if (ql.answerType === "LETTER") candidates = letterDistractors(correct, data);
  else if (ql.answerType === "LETTER_PAIR" || ql.answerType === "NUMBER_PAIR") candidates = pairDistractors(correct, data);
  else if (ql.answerType === "LETTER_SET") candidates = letterSetDistractors(correct, data);
  else if (ql.answerType === "DIRECTION_OFFSET") candidates = directionDistractors(correct);

  candidates = uniqueWrong([...candidates, ...fallbackCandidates(correct)], correct);
  if (candidates.length < 3) throw new Error(`${ql.qlId} cannot produce three distinct distractors for ${correct}.`);
  const wrong = shuffle(candidates, `${ql.qlId}:${seed}:distractors`).slice(0, 3);
  const options: AlpOption[] = [
    { value: correct, errorLabel: null },
    ...wrong.map((value, index) => ({ value, errorLabel: ["OFF_BY_ONE_OR_ENDPOINT_INCLUDED", "WRONG_DIRECTION_OR_REFERENCE_END", "PRE_TRANSFORM_OR_PARTIAL_TRANSFORM"][index]! })),
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
