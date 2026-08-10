import { divide, equals, multiply, rational, type Rational } from "../foundation/rational";
import { convertDistance, convertTime } from "../foundation/units";
import type { TsdCp001Solution, TsdCp001SolveInput } from "./canonical-solver";
import type { TsdCp001DiscoveryAuthority } from "./discovery-registry";
import type { DisplayContract, TsdCp001MisconceptionId, TsdCp001OptionAudit } from "./runtime-types";
import { authorityOrdinal, formatAnswer, trailingSeedOrdinal } from "./runtime-support";

interface WrongValue {
  readonly value: Rational;
  readonly misconceptionId: TsdCp001MisconceptionId;
}

function paceTimeUnit(input: Extract<TsdCp001SolveInput, { solveMode: "distanceFromPaceAndTime" }>): "SECOND" | "MINUTE" {
  return input.paceUnit === "SECOND_PER_KM" ? "SECOND" : "MINUTE";
}

function speedFromPaceWrongValues(
  input: Extract<TsdCp001SolveInput, { solveMode: "speedFromPace" }>,
): readonly WrongValue[] {
  if (input.outputUnit === "KMPH" && input.paceUnit === "MINUTE_PER_KM") {
    return [
      { value: input.pace, misconceptionId: "FAIL_TO_INVERT_PACE" },
      { value: multiply(rational(60), input.pace), misconceptionId: "MULTIPLY_INSTEAD_OF_DIVIDE" },
      { value: divide(rational(1), input.pace), misconceptionId: "OMIT_UNIT_CONVERSION" },
    ];
  }
  if (input.outputUnit === "MPS" && input.paceUnit === "SECOND_PER_KM") {
    return [
      { value: input.pace, misconceptionId: "FAIL_TO_INVERT_PACE" },
      { value: divide(input.pace, rational(1000)), misconceptionId: "REVERSE_DIVISION" },
      { value: divide(rational(1000), multiply(input.pace, rational(60))), misconceptionId: "TREAT_SECONDS_AS_MINUTES" },
    ];
  }
  if (input.outputUnit === "KMPH") {
    return [
      { value: input.pace, misconceptionId: "FAIL_TO_INVERT_PACE" },
      { value: divide(rational(1000), input.pace), misconceptionId: "OMIT_UNIT_CONVERSION" },
      { value: divide(rational(60), input.pace), misconceptionId: "USE_WRONG_CONVERSION_FACTOR" },
    ];
  }
  return [
    { value: input.pace, misconceptionId: "FAIL_TO_INVERT_PACE" },
    { value: divide(rational(1000), input.pace), misconceptionId: "OMIT_UNIT_CONVERSION" },
    { value: divide(rational(60), input.pace), misconceptionId: "USE_WRONG_CONVERSION_FACTOR" },
  ];
}

function paceFromSpeedWrongValues(
  input: Extract<TsdCp001SolveInput, { solveMode: "paceFromSpeed" }>,
): readonly WrongValue[] {
  if (input.outputUnit === "MINUTE_PER_KM" && input.speedUnit === "KMPH") {
    return [
      { value: input.speed, misconceptionId: "FAIL_TO_INVERT_PACE" },
      { value: multiply(rational(60), input.speed), misconceptionId: "MULTIPLY_INSTEAD_OF_DIVIDE" },
      { value: divide(rational(1), input.speed), misconceptionId: "OMIT_UNIT_CONVERSION" },
    ];
  }
  if (input.outputUnit === "SECOND_PER_KM" && input.speedUnit === "MPS") {
    return [
      { value: input.speed, misconceptionId: "FAIL_TO_INVERT_PACE" },
      { value: divide(rational(100), input.speed), misconceptionId: "USE_WRONG_CONVERSION_FACTOR" },
      { value: divide(rational(1000), multiply(input.speed, rational(60))), misconceptionId: "TREAT_SECONDS_AS_MINUTES" },
    ];
  }
  if (input.outputUnit === "MINUTE_PER_KM") {
    return [
      { value: input.speed, misconceptionId: "FAIL_TO_INVERT_PACE" },
      { value: divide(rational(1000), input.speed), misconceptionId: "OMIT_UNIT_CONVERSION" },
      { value: divide(rational(60), input.speed), misconceptionId: "USE_WRONG_CONVERSION_FACTOR" },
    ];
  }
  return [
    { value: input.speed, misconceptionId: "FAIL_TO_INVERT_PACE" },
    { value: divide(rational(60), input.speed), misconceptionId: "OMIT_UNIT_CONVERSION" },
    { value: divide(rational(1000), input.speed), misconceptionId: "USE_WRONG_CONVERSION_FACTOR" },
  ];
}

function distanceFromPaceWrongValues(
  input: Extract<TsdCp001SolveInput, { solveMode: "distanceFromPaceAndTime" }>,
): readonly WrongValue[] {
  const matchingDuration = convertTime(input.duration, input.timeUnit, paceTimeUnit(input));
  const distanceKm = divide(matchingDuration, input.pace);
  const reversedKm = divide(input.pace, matchingDuration);

  if (input.outputUnit === "M") {
    return [
      { value: distanceKm, misconceptionId: "OMIT_UNIT_CONVERSION" },
      { value: convertDistance(reversedKm, "KM", "M"), misconceptionId: "REVERSE_DIVISION" },
      { value: input.duration, misconceptionId: "USE_SECOND_QUANTITY_ONLY" },
    ];
  }
  if (input.outputUnit === "KM") {
    return [
      { value: input.pace, misconceptionId: "USE_FIRST_QUANTITY_ONLY" },
      { value: input.duration, misconceptionId: "USE_SECOND_QUANTITY_ONLY" },
      { value: reversedKm, misconceptionId: "REVERSE_DIVISION" },
    ];
  }
  return [
    { value: convertDistance(input.pace, "KM", input.outputUnit), misconceptionId: "USE_FIRST_QUANTITY_ONLY" },
    { value: convertDistance(input.duration, "KM", input.outputUnit), misconceptionId: "USE_SECOND_QUANTITY_ONLY" },
    { value: convertDistance(reversedKm, "KM", input.outputUnit), misconceptionId: "REVERSE_DIVISION" },
  ];
}

function wrongValues(
  input: Extract<TsdCp001SolveInput, { solveMode: "speedFromPace" | "paceFromSpeed" | "distanceFromPaceAndTime" }>,
): readonly WrongValue[] {
  if (input.solveMode === "speedFromPace") return speedFromPaceWrongValues(input);
  if (input.solveMode === "paceFromSpeed") return paceFromSpeedWrongValues(input);
  return distanceFromPaceWrongValues(input);
}

export function paceOptionPackage(
  authority: TsdCp001DiscoveryAuthority,
  seed: string,
  input: TsdCp001SolveInput,
  solution: TsdCp001Solution,
  display: DisplayContract,
): { options: readonly string[]; optionAudit: readonly TsdCp001OptionAudit[]; correctIndex: number } | null {
  if (
    input.solveMode !== "speedFromPace"
    && input.solveMode !== "paceFromSpeed"
    && input.solveMode !== "distanceFromPaceAndTime"
  ) return null;
  if (
    solution.answerKind === "CLOCK_TIME"
    || solution.answerKind === "CLASSIFICATION"
    || solution.answerKind === "BOOLEAN"
  ) throw new Error(`${input.solveMode}: expected a scalar pace solution`);

  const correct = solution.value;
  const wrong: WrongValue[] = [];
  for (const candidate of wrongValues(input)) {
    if (equals(candidate.value, correct)) continue;
    if (wrong.some((entry) => equals(entry.value, candidate.value))) continue;
    wrong.push(candidate);
  }
  if (wrong.length < 3) throw new Error(`${input.solveMode}: fewer than three distinct unit-aware pace distractors`);

  const correctAudit: TsdCp001OptionAudit = {
    text: formatAnswer(solution, display),
    misconceptionId: "CORRECT",
    isCorrect: true,
  };
  const wrongAudit = wrong.slice(0, 3).map((candidate): TsdCp001OptionAudit => ({
    text: formatAnswer({ ...solution, value: candidate.value }, display),
    misconceptionId: candidate.misconceptionId,
    isCorrect: false,
  }));
  const correctIndex = (trailingSeedOrdinal(seed) + authorityOrdinal(authority)) % 4;
  const optionAudit: TsdCp001OptionAudit[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    optionAudit.push(index === correctIndex ? correctAudit : wrongAudit[wrongIndex++]);
  }
  return {
    options: optionAudit.map((option) => option.text),
    optionAudit,
    correctIndex,
  };
}
