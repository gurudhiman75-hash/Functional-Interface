import { cyclicShift } from "./foundation/alphabet";
import { occurrenceLabel, occurrenceRefs } from "./foundation/word";
import { buildAlpOptions as buildBaseOptions, validateAlpOptions as validateBaseOptions } from "./distractors";
import type {
  AlpAnswerType,
  AlpInstanceData,
  AlpOption,
  AlpQuestionLogic,
  AlpSolverResult,
} from "./types";

interface RepairCandidate {
  readonly value: string;
  readonly errorLabel: string;
}

function optionMatchesAnswerType(answerType: AlpAnswerType, value: string): boolean {
  switch (answerType) {
    case "LETTER":
      return /^[A-Z]$/.test(value);
    case "NUMBER":
      return /^\d+$/.test(value);
    case "NUMBER_PAIR":
      return /^\d+\s*,\s*\d+$/.test(value);
    case "LETTER_PAIR":
      return /^[A-Z]\s*(?:,|:)\s*[A-Z]$/.test(value);
    case "PAIR_SELECTION":
      return /^[A-Z]\s*:\s*[A-Z]$/.test(value);
    case "DIRECTION_OFFSET":
      return /^\d+ to the (?:left|right)$/.test(value);
    case "LETTER_SET":
      return value === "None"
        || /^(?:(?:first|second|third|\d+th) [A-Z])(?:; (?:first|second|third|\d+th) [A-Z])*$/.test(value);
  }
}

function pairParts(value: string): readonly [string, string] | undefined {
  const parts = value.split(/\s*(?:,|:)\s*/);
  return parts.length === 2 && parts[0] && parts[1] ? [parts[0], parts[1]] : undefined;
}

function uniqueRepairCandidates(
  candidates: readonly RepairCandidate[],
  correct: string,
): RepairCandidate[] {
  const seen = new Set<string>([correct]);
  const result: RepairCandidate[] = [];
  for (const candidate of candidates) {
    if (!candidate.value.trim() || seen.has(candidate.value)) continue;
    seen.add(candidate.value);
    result.push(candidate);
  }
  return result;
}

function numberBounds(ql: AlpQuestionLogic, data: AlpInstanceData): readonly [number, number] {
  if (ql.checkpointId === "ALP-CP-005") {
    const maximum = data.word?.length ?? 26;
    return ql.solveMode.includes("COUNT_UNCHANGED") ? [0, maximum] : [1, maximum];
  }
  return [0, 26];
}

function repairCandidates(
  ql: AlpQuestionLogic,
  data: AlpInstanceData,
  solved: AlpSolverResult,
): RepairCandidate[] {
  const correct = solved.answer;

  if (ql.answerType === "LETTER") {
    return uniqueRepairCandidates([
      { value: cyclicShift(correct, 1), errorLabel: "STOPPED_ONE_STEP_LATE" },
      { value: cyclicShift(correct, -1), errorLabel: "STOPPED_ONE_STEP_EARLY" },
      { value: cyclicShift(correct, 2), errorLabel: "STOPPED_TWO_STEPS_LATE" },
      { value: cyclicShift(correct, -2), errorLabel: "STOPPED_TWO_STEPS_EARLY" },
    ], correct);
  }

  if (ql.answerType === "NUMBER") {
    const numeric = Number(correct);
    const [minimum, maximum] = numberBounds(ql, data);
    return uniqueRepairCandidates([
      { value: String(numeric - 1), errorLabel: "OFF_BY_ONE_ENDPOINT" },
      { value: String(numeric + 1), errorLabel: "OFF_BY_ONE_ENDPOINT" },
      { value: String(numeric - 2), errorLabel: "TWO_STEP_MISCOUNT" },
      { value: String(numeric + 2), errorLabel: "TWO_STEP_MISCOUNT" },
      { value: String(Math.max(minimum, minimum + maximum - numeric)), errorLabel: "POSITION_MISCOUNT" },
    ].filter((candidate) => {
      const value = Number(candidate.value);
      return Number.isInteger(value) && value >= minimum && value <= maximum;
    }), correct);
  }

  if (ql.answerType === "NUMBER_PAIR") {
    const parts = pairParts(correct)?.map(Number);
    if (!parts || parts.some((value) => !Number.isInteger(value))) return [];
    const [first, second] = parts;
    return uniqueRepairCandidates([
      { value: `${second}, ${first}`, errorLabel: "REVERSED_PAIR_ORDER" },
      { value: `${Math.max(0, first - 1)}, ${second}`, errorLabel: "FIRST_COUNT_OFF_BY_ONE" },
      { value: `${first + 1}, ${second}`, errorLabel: "FIRST_COUNT_OFF_BY_ONE" },
      { value: `${first}, ${Math.max(0, second - 1)}`, errorLabel: "SECOND_COUNT_OFF_BY_ONE" },
      { value: `${first}, ${second + 1}`, errorLabel: "SECOND_COUNT_OFF_BY_ONE" },
    ], correct);
  }

  if (ql.answerType === "LETTER_PAIR" || ql.answerType === "PAIR_SELECTION") {
    const parts = pairParts(correct);
    if (!parts || !parts.every((value) => /^[A-Z]$/.test(value))) return [];
    const [first, second] = parts;
    const separator = ql.answerType === "PAIR_SELECTION" || correct.includes(":") ? " : " : ", ";
    return uniqueRepairCandidates([
      { value: `${second}${separator}${first}`, errorLabel: "REVERSED_PAIR_ORDER" },
      { value: `${cyclicShift(first, 1)}${separator}${second}`, errorLabel: "FIRST_MEMBER_OFF_BY_ONE" },
      { value: `${cyclicShift(first, -1)}${separator}${second}`, errorLabel: "FIRST_MEMBER_OFF_BY_ONE" },
      { value: `${first}${separator}${cyclicShift(second, 1)}`, errorLabel: "SECOND_MEMBER_OFF_BY_ONE" },
      { value: `${first}${separator}${cyclicShift(second, -1)}`, errorLabel: "SECOND_MEMBER_OFF_BY_ONE" },
    ], correct);
  }

  if (ql.answerType === "DIRECTION_OFFSET") {
    const match = correct.match(/^(\d+) to the (left|right)$/);
    if (!match) return [];
    const amount = Number(match[1]);
    const direction = match[2];
    const opposite = direction === "left" ? "right" : "left";
    return uniqueRepairCandidates([
      { value: `${amount} to the ${opposite}`, errorLabel: "CORRECT_DISTANCE_WRONG_DIRECTION" },
      { value: `${Math.max(1, amount - 1)} to the ${direction}`, errorLabel: "DISTANCE_OFF_BY_ONE" },
      { value: `${amount + 1} to the ${direction}`, errorLabel: "DISTANCE_OFF_BY_ONE" },
      { value: `${Math.max(1, amount - 1)} to the ${opposite}`, errorLabel: "WRONG_DIRECTION_AND_DISTANCE" },
      { value: `${amount + 1} to the ${opposite}`, errorLabel: "WRONG_DIRECTION_AND_DISTANCE" },
    ], correct);
  }

  if (ql.answerType === "LETTER_SET") {
    const answerRefs = correct === "None" ? [] : correct.split("; ");
    const wordRefs = data.word ? occurrenceRefs(data.word).map(occurrenceLabel) : [];
    return uniqueRepairCandidates([
      { value: "None", errorLabel: "ASSUMED_NO_UNCHANGED_OCCURRENCE" },
      { value: answerRefs[0] ?? wordRefs[0] ?? "", errorLabel: "CHECKED_FIRST_POSITION_ONLY" },
      { value: answerRefs.at(-1) ?? wordRefs.at(-1) ?? "", errorLabel: "CHECKED_LAST_POSITION_ONLY" },
      { value: answerRefs.slice(0, Math.max(1, answerRefs.length - 1)).join("; "), errorLabel: "PARTIAL_POSITION_COMPARISON" },
      { value: [...answerRefs].reverse().join("; "), errorLabel: "REVERSED_PAIR_ORDER" },
      { value: wordRefs.filter((_, index) => index % 2 === 0).slice(0, 3).join("; "), errorLabel: "CHECKED_ALTERNATE_POSITIONS_ONLY" },
    ], correct);
  }

  return [];
}

export function buildAlpOptions(
  ql: AlpQuestionLogic,
  data: AlpInstanceData,
  solved: AlpSolverResult,
  seed: number,
): readonly AlpOption[] {
  const baseOptions = buildBaseOptions(ql, data, solved, seed);
  if (baseOptions.every((option) => option.errorLabel === null || optionMatchesAnswerType(ql.answerType, option.value))) {
    return baseOptions;
  }

  const used = new Set(
    baseOptions
      .filter((option) => option.errorLabel === null || optionMatchesAnswerType(ql.answerType, option.value))
      .map((option) => option.value),
  );
  const pool = repairCandidates(ql, data, solved)
    .filter((candidate) => optionMatchesAnswerType(ql.answerType, candidate.value) && !used.has(candidate.value));
  let poolIndex = 0;

  const repaired = baseOptions.map((option): AlpOption => {
    if (option.errorLabel === null || optionMatchesAnswerType(ql.answerType, option.value)) return option;
    while (poolIndex < pool.length && used.has(pool[poolIndex]!.value)) poolIndex += 1;
    const replacement = pool[poolIndex++];
    if (!replacement) {
      throw new Error(`${ql.qlId} cannot repair answer-type mismatch for ${ql.answerType}.`);
    }
    used.add(replacement.value);
    return replacement;
  });

  validateBaseOptions(repaired, solved.answer);
  if (!repaired.every((option) => option.errorLabel === null || optionMatchesAnswerType(ql.answerType, option.value))) {
    throw new Error(`${ql.qlId} retained an answer-type mismatch after repair.`);
  }
  return repaired;
}

export function validateAlpOptions(options: readonly AlpOption[], correctAnswer: string): number {
  return validateBaseOptions(options, correctAnswer);
}
