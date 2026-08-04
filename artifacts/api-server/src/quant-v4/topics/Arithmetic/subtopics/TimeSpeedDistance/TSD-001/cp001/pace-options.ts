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

function wrongValues(
  input: Extract<TsdCp001SolveInput, { solveMode: "speedFromPace" | "paceFromSpeed" | "distanceFromPaceAndTime" }>,
): readonly WrongValue[] {
  if (input.solveMode === "speedFromPace") {
    if (input.outputUnit === "KMPH" && input.paceUnit === "MINUTE_PER_KM") {
      return [
        { value: input.pace, misconceptionId: "FAIL_TO_INVERT_PACE" },
        { value: multiply(rational(60), input.pace), misconceptionId: "MULTIPLY_INSTEAD_OF_DIVIDE" },
        { value: divide(input.pace, rational(60)), misconceptionId: "APPLY_SIXTY_IN_WRONG_DIRECTION" },
      ];
    }
    if (input.outputUnit === "MPS" && input.paceUnit === "SECOND_PER_KM") {
      return [
        { value: input.pace, misconceptionId: "FAIL_TO_INVERT_PACE" },
        { value: divide(rational(60), input.pace), misconceptionId: "USE_WRONG_CONVERSION_FACTOR" },
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
      { value: divide(rational(1000), input.pace), misconceptionId: "IGNORE_MINUTE_CONVERSION" },
      { value: divide(rational(60), input.pace), misconceptionId: "USE_WRONG_CONVERSION_FACTOR" },
    ];
  }

  if (input.solveMode === "paceFromSpeed") {
    if (input.outputUnit === "MINUTE_PER_KM" && input.speedUnit === "KMPH") {
      return [
        { value: input.speed, misconceptionId: "FAIL_TO_INVERT_PACE" },
        { value: divide(rational(100), input.speed), misconceptionId: "USE_WRONG_CONVERSION_FACTOR" },
        { value: divide(rational(1), input.speed), misconceptionId: "USE_MINUTES_AS_HOURS" },
      ];
    }
    return [
      { value: input.speed, misconceptionId: "FAIL_TO_INVERT_PACE" },
      { value: divide(rational(100), input.speed), misconceptionId: "OMIT_UNIT_CONVERSION" },
      { value: divide(rational(1000), multiply(input.speed, rational(60))), misconceptionId: "TREAT_SECONDS_AS_MINUTES" },
    ];
  }

  const matchingDuration = convertTime(input.duration, input.timeUnit, paceTimeUnit(input));
  const distanceKm = divide(matchingDuration, input.pace);
  const multiplied = multiply(matchingDuration, input.pace);
  const reversed = divide(input.pace, matchingDuration);
  if (input.outputUnit === "M") {
    return [
      { value: distanceKm, misconceptionId: "OMIT_UNIT_CONVERSION" },
      { value: multiplied, misconceptionId: "MULTIPLY_PACE_AND_TIME" },
      { value: reversed, misconceptionId: "REVERSE_DIVISION" },
    ];
  }
  return [
    { value: multiplied, misconceptionId: "MULTIPLY_PACE_AND_TIME" },
    { value: reversed, misconceptionId: "REVERSE_DIVISION" },
    { value: convertDistance(input.duration, "KM", input.outputUnit), misconceptionId: "USE_SECOND_QUANTITY_ONLY" },
  ];
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
