import { add, divide, equals, isPositive, multiply, rational, subtract, type Rational } from "../foundation/rational";
import type { TsdCp001Solution, TsdCp001SolveInput } from "./canonical-solver";
import type { DisplayContract, TsdCp001MisconceptionId, TsdCp001OptionAudit } from "./runtime-types";
import { formatAnswer, r } from "./runtime-support";

interface OptionSet {
  readonly options: readonly string[];
  readonly optionAudit: readonly TsdCp001OptionAudit[];
  readonly correctIndex: number;
}

type WrongCandidate = readonly [Rational, TsdCp001MisconceptionId];

function scalarValue(solution: TsdCp001Solution): Rational | null {
  return "value" in solution && typeof solution.value !== "boolean" ? solution.value : null;
}

function buildScalarSet(
  solution: TsdCp001Solution,
  display: DisplayContract,
  correctIndex: number,
  rawCandidates: readonly WrongCandidate[],
): OptionSet | null {
  const correct = scalarValue(solution);
  if (!correct) return null;
  const candidates: WrongCandidate[] = [];
  for (const [value, misconceptionId] of rawCandidates) {
    if (!isPositive(value) || equals(value, correct)) continue;
    if (candidates.some(([existing]) => equals(existing, value))) continue;
    candidates.push([value, misconceptionId]);
  }
  if (candidates.length < 3) return null;
  const correctOption: TsdCp001OptionAudit = {
    text: formatAnswer(solution, display),
    misconceptionId: "CORRECT",
    isCorrect: true,
  };
  const wrongOptions = candidates.slice(0, 3).map(([value, misconceptionId]) => ({
    text: formatAnswer({ ...solution, value } as TsdCp001Solution, display),
    misconceptionId,
    isCorrect: false,
  }));
  const optionAudit: TsdCp001OptionAudit[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    optionAudit.push(index === correctIndex ? correctOption : wrongOptions[wrongIndex++]);
  }
  return { options: optionAudit.map((option) => option.text), optionAudit, correctIndex };
}

export function examOptionPackage(
  input: TsdCp001SolveInput,
  solution: TsdCp001Solution,
  display: DisplayContract,
  fallback: OptionSet,
): OptionSet {
  const correct = scalarValue(solution);
  if (!correct) return fallback;
  if (
    input.solveMode === "speedFromPace"
    || input.solveMode === "paceFromSpeed"
    || input.solveMode === "distanceFromPaceAndTime"
  ) return fallback;

  let candidates: readonly WrongCandidate[] | null = null;
  switch (input.solveMode) {
    case "distanceFromSpeedAndTime":
      candidates = [
        [multiply(add(input.speedMps, r(1)), input.durationSeconds), "MISREAD_SPEED"],
        [multiply(subtract(input.speedMps, r(1)), input.durationSeconds), "MISREAD_SPEED"],
        [multiply(input.speedMps, add(input.durationSeconds, r(10))), "MISREAD_TIME"],
      ];
      break;
    case "speedFromDistanceAndTime":
      candidates = [
        [subtract(correct, r(1)), "MISREAD_TIME"],
        [add(correct, r(1)), "MISREAD_DISTANCE"],
        [add(correct, r(2)), "DIVISION_ERROR"],
      ];
      break;
    case "timeFromDistanceAndSpeed":
      candidates = [
        [subtract(correct, r(5)), "MISREAD_SPEED"],
        [add(correct, r(5)), "MISREAD_DISTANCE"],
        [add(correct, r(10)), "DIVISION_ERROR"],
      ];
      break;
    case "convertSpeedUnit":
      if (input.from === "KMPH" && input.to === "MPS") {
        candidates = [[divide(input.value, r(3)), "USE_WRONG_CONVERSION_FACTOR"], [divide(input.value, r(4)), "USE_WRONG_CONVERSION_FACTOR"], [input.value, "OMIT_UNIT_CONVERSION"]];
      } else if (input.from === "MPS" && input.to === "KMPH") {
        candidates = [[multiply(input.value, r(3)), "USE_WRONG_CONVERSION_FACTOR"], [multiply(input.value, r(4)), "USE_WRONG_CONVERSION_FACTOR"], [input.value, "OMIT_UNIT_CONVERSION"]];
      } else if (input.from === "M_PER_MINUTE" && input.to === "MPS") {
        candidates = [[input.value, "OMIT_UNIT_CONVERSION"], [divide(input.value, r(50)), "USE_WRONG_CONVERSION_FACTOR"], [divide(input.value, r(100)), "USE_WRONG_CONVERSION_FACTOR"]];
      } else if (input.from === "KM_PER_MINUTE" && input.to === "KMPH") {
        candidates = [[multiply(input.value, r(50)), "USE_WRONG_CONVERSION_FACTOR"], [multiply(input.value, r(100)), "USE_WRONG_CONVERSION_FACTOR"], [input.value, "OMIT_UNIT_CONVERSION"]];
      } else {
        candidates = [[input.value, "OMIT_UNIT_CONVERSION"], [multiply(correct, r(6, 5)), "USE_WRONG_CONVERSION_FACTOR"], [multiply(correct, r(4, 5)), "USE_WRONG_CONVERSION_FACTOR"]];
      }
      break;
    case "convertDistanceUnit":
      candidates = [[input.value, "OMIT_UNIT_CONVERSION"], [multiply(correct, r(10)), "USE_WRONG_CONVERSION_FACTOR"], [divide(correct, r(10)), "USE_WRONG_CONVERSION_FACTOR"]];
      break;
    case "convertTimeUnit":
      candidates = [[input.value, "OMIT_UNIT_CONVERSION"], [multiply(correct, r(2)), "USE_WRONG_CONVERSION_FACTOR"], [divide(correct, r(2)), "USE_WRONG_CONVERSION_FACTOR"]];
      break;
    case "speedFromMixedUnits":
      candidates = [[multiply(correct, r(3, 4)), "MISREAD_TIME"], [multiply(correct, r(5, 4)), "MISREAD_TIME"], [multiply(correct, r(3, 2)), "MISREAD_DISTANCE"]];
      break;
    case "elapsedClockTime":
      candidates = [[subtract(correct, r(60)), "DROP_ONE_HOUR_FROM_INTERVAL"], [add(correct, r(60)), "ADD_ONE_HOUR_TO_INTERVAL"], [add(correct, r(30)), "MISREAD_TIME"]];
      break;
    case "distanceByProportion":
      candidates = [
        [input.knownDistance, "IGNORE_TIME_CHANGE"],
        [multiply(input.knownDistance, divide(input.knownTime, input.targetTime)), "INVERT_REQUIRED_RATIO"],
        [multiply(input.knownDistance, divide(input.targetTime, add(input.knownTime, r(1)))), "MISREAD_TIME"],
        [add(correct, r(25)), "DIVISION_ERROR"],
      ];
      break;
    case "timeByProportion":
      candidates = [
        [input.knownTime, "IGNORE_DISTANCE_CHANGE"],
        [multiply(input.knownTime, divide(input.knownDistance, input.targetDistance)), "INVERT_REQUIRED_RATIO"],
        [add(correct, r(2)), "DIVISION_ERROR"],
        [add(correct, r(3)), "DIVISION_ERROR"],
        [subtract(correct, r(1)), "MISREAD_TIME"],
      ];
      break;
    case "speedByProportion":
      candidates = [
        [input.knownSpeed, "IGNORE_TIME_CHANGE"],
        [add(correct, r(10)), "DIVISION_ERROR"],
        [subtract(correct, r(10)), "MISREAD_TIME"],
        [add(correct, r(20)), "DIVISION_ERROR"],
      ];
      break;
    case "requiredUniformSpeedForDeadline": {
      const absoluteDeadline = add(
        input.deadlineMinuteOfDay,
        multiply(rational(input.deadlineDayOffset), r(1440)),
      );
      const availableMinutes = subtract(absoluteDeadline, input.departureMinuteOfDay);
      const availableHours = divide(availableMinutes, r(60));
      candidates = [
        [divide(input.distance, add(availableHours, r(1))), "ADD_ONE_HOUR_TO_INTERVAL"],
        [divide(input.distance, subtract(availableHours, r(1))), "DROP_ONE_HOUR_FROM_INTERVAL"],
        [add(correct, r(10)), "DIVISION_ERROR"],
        [subtract(correct, r(10)), "DIVISION_ERROR"],
        [add(correct, r(20)), "DIVISION_ERROR"],
      ];
      break;
    }
    default:
      return fallback;
  }
  return buildScalarSet(solution, display, fallback.correctIndex, candidates) ?? fallback;
}
