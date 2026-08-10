import {
  RATIONAL_ONE,
  add,
  compare,
  divide,
  equals,
  isPositive,
  multiply,
  rational,
  subtract,
  type Rational,
} from "../foundation/rational";
import { convertDistance, convertTime } from "../foundation/units";
import type { TsdCp001Solution, TsdCp001SolveInput } from "./canonical-solver";
import type { TsdCp001DiscoveryAuthority } from "./discovery-registry";
import type { DisplayContract, TsdCp001MisconceptionId, TsdCp001OptionAudit } from "./runtime-types";
import { authorityOrdinal, formatAnswer, formatClock, r, trailingSeedOrdinal } from "./runtime-support";

type WrongScalar = { value: Rational; misconceptionId: TsdCp001MisconceptionId };

function absolute(value: Rational): Rational {
  return value.numerator < 0n ? rational(-value.numerator, value.denominator) : value;
}

function scalarSolutionValue(solution: TsdCp001Solution): Rational | null {
  return "value" in solution && typeof solution.value !== "boolean" ? solution.value : null;
}

function addCandidate(candidates: WrongScalar[], value: Rational, misconceptionId: TsdCp001MisconceptionId, correct: Rational): void {
  if (!isPositive(value) || equals(value, correct)) return;
  if (candidates.some((candidate) => equals(candidate.value, value))) return;
  candidates.push({ value, misconceptionId });
}

function addCandidates(candidates: WrongScalar[], correct: Rational, entries: readonly [Rational, TsdCp001MisconceptionId][]): void {
  for (const [value, misconceptionId] of entries) addCandidate(candidates, value, misconceptionId, correct);
}

function ratioComparisonCandidates(input: Extract<TsdCp001SolveInput, {
  solveMode: "compareDistancesAtEqualTime" | "compareTimesAtEqualDistance" | "compareSpeedsAtEqualTime";
}>, correct: Rational): WrongScalar[] {
  const candidates: WrongScalar[] = [];
  const first = input.solveMode === "compareSpeedsAtEqualTime" ? input.firstDistance : input.firstSpeed;
  const second = input.solveMode === "compareSpeedsAtEqualTime" ? input.secondDistance : input.secondSpeed;
  addCandidates(candidates, correct, [
    [divide(RATIONAL_ONE, correct), "INVERT_REQUIRED_RATIO"],
    [divide(add(first, second), second), "USE_SUM_INSTEAD_OF_RATIO"],
    [divide(absolute(subtract(first, second)), second), "USE_DIFFERENCE_INSTEAD_OF_RATIO"],
    [first, "USE_FIRST_QUANTITY_ONLY"],
    [second, "USE_SECOND_QUANTITY_ONLY"],
  ]);
  return candidates;
}

function ratioFormulaCandidates(input: Extract<TsdCp001SolveInput, {
  solveMode: "distanceRatioFromSpeedAndTimeRatios" | "speedRatioFromDistanceAndTimeRatios" | "timeRatioFromDistanceAndSpeedRatios";
}>, correct: Rational): WrongScalar[] {
  const candidates: WrongScalar[] = [];
  if (input.solveMode === "distanceRatioFromSpeedAndTimeRatios") {
    addCandidates(candidates, correct, [
      [input.speedRatio, "USE_FIRST_QUANTITY_ONLY"],
      [input.timeRatio, "USE_SECOND_QUANTITY_ONLY"],
      [add(input.speedRatio, input.timeRatio), "ADD_RATIOS_INSTEAD_OF_MULTIPLYING"],
      [divide(RATIONAL_ONE, correct), "INVERT_REQUIRED_RATIO"],
    ]);
  } else if (input.solveMode === "speedRatioFromDistanceAndTimeRatios") {
    addCandidates(candidates, correct, [
      [input.distanceRatio, "USE_FIRST_QUANTITY_ONLY"],
      [input.timeRatio, "USE_SECOND_QUANTITY_ONLY"],
      [multiply(input.distanceRatio, input.timeRatio), "MULTIPLY_INSTEAD_OF_DIVIDE"],
      [divide(input.timeRatio, input.distanceRatio), "INVERT_REQUIRED_RATIO"],
    ]);
  } else {
    addCandidates(candidates, correct, [
      [input.distanceRatio, "USE_FIRST_QUANTITY_ONLY"],
      [input.speedRatio, "USE_SECOND_QUANTITY_ONLY"],
      [multiply(input.distanceRatio, input.speedRatio), "MULTIPLY_INSTEAD_OF_DIVIDE"],
      [divide(input.speedRatio, input.distanceRatio), "INVERT_REQUIRED_RATIO"],
    ]);
  }
  return candidates;
}

function scalarWrongCandidates(input: TsdCp001SolveInput, correct: Rational): WrongScalar[] {
  const candidates: WrongScalar[] = [];
  switch (input.solveMode) {
    case "distanceFromSpeedAndTime":
      addCandidates(candidates, correct, [
        [add(input.speedMps, input.durationSeconds), "ADD_INSTEAD_OF_MULTIPLY"],
        [absolute(subtract(input.durationSeconds, input.speedMps)), "SUBTRACT_WHEN_ADDITION_IS_REQUIRED"],
        [divide(multiply(input.speedMps, input.durationSeconds), r(60)), "TREAT_SECONDS_AS_MINUTES"],
        [input.speedMps, "USE_FIRST_QUANTITY_ONLY"],
      ]);
      break;
    case "speedFromDistanceAndTime":
      addCandidates(candidates, correct, [
        [divide(add(input.distanceMetres, input.durationSeconds), input.durationSeconds), "ADD_GIVENS_BEFORE_DIVIDING"],
        [divide(subtract(input.distanceMetres, input.durationSeconds), input.durationSeconds), "SUBTRACT_GIVENS_BEFORE_DIVIDING"],
        [divide(input.distanceMetres, divide(input.durationSeconds, r(60))), "TREAT_SECONDS_AS_MINUTES"],
        [divide(input.durationSeconds, input.distanceMetres), "REVERSE_DIVISION"],
      ]);
      break;
    case "timeFromDistanceAndSpeed":
      addCandidates(candidates, correct, [
        [divide(add(input.distanceMetres, input.speedMps), input.speedMps), "ADD_GIVENS_BEFORE_DIVIDING"],
        [divide(subtract(input.distanceMetres, input.speedMps), input.speedMps), "SUBTRACT_GIVENS_BEFORE_DIVIDING"],
        [divide(input.distanceMetres, multiply(input.speedMps, r(60))), "TREAT_SECONDS_AS_MINUTES"],
        [divide(input.speedMps, input.distanceMetres), "REVERSE_DIVISION"],
      ]);
      break;
    case "convertSpeedUnit":
      addCandidates(candidates, correct, [
        [input.value, "OMIT_UNIT_CONVERSION"],
        [divide(multiply(input.value, input.value), correct), "REVERSE_UNIT_CONVERSION"],
        [multiply(correct, r(60)), "USE_WRONG_CONVERSION_FACTOR"],
        [divide(correct, r(60)), "USE_WRONG_CONVERSION_FACTOR"],
      ]);
      break;
    case "convertDistanceUnit":
      addCandidates(candidates, correct, [
        [input.value, "OMIT_UNIT_CONVERSION"],
        [divide(multiply(input.value, input.value), correct), "REVERSE_UNIT_CONVERSION"],
        [multiply(correct, r(10)), "USE_WRONG_CONVERSION_FACTOR"],
        [divide(correct, r(10)), "USE_WRONG_CONVERSION_FACTOR"],
      ]);
      break;
    case "convertTimeUnit":
      addCandidates(candidates, correct, [
        [input.value, "OMIT_UNIT_CONVERSION"],
        [divide(multiply(input.value, input.value), correct), "REVERSE_UNIT_CONVERSION"],
        [multiply(correct, r(60)), "USE_WRONG_CONVERSION_FACTOR"],
        [divide(correct, r(60)), "USE_WRONG_CONVERSION_FACTOR"],
        [multiply(correct, r(24)), "USE_WRONG_CONVERSION_FACTOR"],
      ]);
      break;
    case "speedFromMixedUnits": {
      const target = {
        MPS: { distance: "M" as const, time: "SECOND" as const },
        KMPH: { distance: "KM" as const, time: "HOUR" as const },
        M_PER_MINUTE: { distance: "M" as const, time: "MINUTE" as const },
        KM_PER_MINUTE: { distance: "KM" as const, time: "MINUTE" as const },
      }[input.outputUnit];
      const convertedDistance = convertDistance(input.distance, input.distanceUnit, target.distance);
      const convertedTime = convertTime(input.duration, input.timeUnit, target.time);
      addCandidates(candidates, correct, [
        [divide(input.distance, input.duration), "MIX_UNCONVERTED_UNITS"],
        [divide(convertedDistance, input.duration), "CONVERT_ONLY_ONE_UNIT"],
        [divide(input.distance, convertedTime), "CONVERT_ONLY_ONE_UNIT"],
        [multiply(convertedDistance, convertedTime), "MULTIPLY_INSTEAD_OF_DIVIDE"],
        [divide(convertedTime, convertedDistance), "REVERSE_DIVISION"],
        [input.distance, "USE_FIRST_QUANTITY_ONLY"],
        [input.duration, "USE_SECOND_QUANTITY_ONLY"],
      ]);
      break;
    }
    case "elapsedClockTime": {
      const ignoredDay = absolute(subtract(input.arrivalMinuteOfDay, input.departureMinuteOfDay));
      addCandidates(candidates, correct, [
        [ignoredDay, "IGNORE_CLOCK_ROLLOVER"],
        [add(input.arrivalMinuteOfDay, input.departureMinuteOfDay), "ADD_WHEN_SUBTRACTION_IS_REQUIRED"],
        [input.arrivalMinuteOfDay, "USE_SECOND_QUANTITY_ONLY"],
        [input.departureMinuteOfDay, "USE_FIRST_QUANTITY_ONLY"],
        [add(correct, r(60)), "IGNORE_CLOCK_ROLLOVER"],
      ]);
      break;
    }
    case "compareDistancesAtEqualTime":
    case "compareTimesAtEqualDistance":
    case "compareSpeedsAtEqualTime":
      candidates.push(...ratioComparisonCandidates(input, correct));
      break;
    case "distanceRatioFromSpeedAndTimeRatios":
    case "speedRatioFromDistanceAndTimeRatios":
    case "timeRatioFromDistanceAndSpeedRatios":
      candidates.push(...ratioFormulaCandidates(input, correct));
      break;
    case "distanceByProportion":
      addCandidates(candidates, correct, [
        [multiply(input.knownDistance, divide(input.targetTime, input.knownTime)), "IGNORE_SPEED_CHANGE"],
        [multiply(input.knownDistance, divide(input.targetSpeed, input.knownSpeed)), "IGNORE_TIME_CHANGE"],
        [multiply(input.knownDistance, multiply(divide(input.knownSpeed, input.targetSpeed), divide(input.targetTime, input.knownTime))), "INVERT_REQUIRED_RATIO"],
        [multiply(input.knownDistance, add(divide(input.targetSpeed, input.knownSpeed), divide(input.targetTime, input.knownTime))), "ADD_RATIOS_INSTEAD_OF_MULTIPLYING"],
        [multiply(input.knownDistance, multiply(divide(input.knownSpeed, input.targetSpeed), divide(input.knownTime, input.targetTime))), "INVERT_REQUIRED_RATIO"],
        [input.knownDistance, "USE_FIRST_QUANTITY_ONLY"],
      ]);
      break;
    case "timeByProportion":
      addCandidates(candidates, correct, [
        [multiply(input.knownTime, divide(input.knownSpeed, input.targetSpeed)), "IGNORE_DISTANCE_CHANGE"],
        [multiply(input.knownTime, divide(input.targetDistance, input.knownDistance)), "IGNORE_SPEED_CHANGE"],
        [multiply(input.knownTime, multiply(divide(input.targetDistance, input.knownDistance), divide(input.targetSpeed, input.knownSpeed))), "USE_DIRECT_SPEED_FACTOR"],
        [multiply(input.knownTime, add(divide(input.targetDistance, input.knownDistance), divide(input.knownSpeed, input.targetSpeed))), "ADD_RATIOS_INSTEAD_OF_MULTIPLYING"],
        [multiply(input.knownTime, multiply(divide(input.knownDistance, input.targetDistance), divide(input.targetSpeed, input.knownSpeed))), "INVERT_REQUIRED_RATIO"],
        [input.knownTime, "USE_FIRST_QUANTITY_ONLY"],
      ]);
      break;
    case "speedByProportion":
      addCandidates(candidates, correct, [
        [multiply(input.knownSpeed, divide(input.knownTime, input.targetTime)), "IGNORE_DISTANCE_CHANGE"],
        [multiply(input.knownSpeed, divide(input.targetDistance, input.knownDistance)), "IGNORE_TIME_CHANGE"],
        [multiply(input.knownSpeed, multiply(divide(input.targetDistance, input.knownDistance), divide(input.targetTime, input.knownTime))), "USE_DIRECT_TIME_FACTOR"],
        [multiply(input.knownSpeed, add(divide(input.targetDistance, input.knownDistance), divide(input.knownTime, input.targetTime))), "ADD_RATIOS_INSTEAD_OF_MULTIPLYING"],
        [multiply(input.knownSpeed, multiply(divide(input.knownDistance, input.targetDistance), divide(input.targetTime, input.knownTime))), "INVERT_REQUIRED_RATIO"],
        [input.knownSpeed, "USE_FIRST_QUANTITY_ONLY"],
      ]);
      break;
    case "speedFromPace":
      if (input.outputUnit === "KMPH") {
        addCandidates(candidates, correct, [
          [input.pace, "FAIL_TO_INVERT_PACE"],
          [multiply(r(60), input.pace), "MULTIPLY_INSTEAD_OF_DIVIDE"],
          [divide(input.pace, r(60)), "APPLY_SIXTY_IN_WRONG_DIRECTION"],
        ]);
      } else {
        addCandidates(candidates, correct, [
          [input.pace, "FAIL_TO_INVERT_PACE"],
          [divide(r(1000), input.pace), "IGNORE_MINUTE_CONVERSION"],
          [divide(r(60), input.pace), "USE_WRONG_CONVERSION_FACTOR"],
        ]);
      }
      break;
    case "paceFromSpeed":
      addCandidates(candidates, correct, [
        [input.speed, "FAIL_TO_INVERT_PACE"],
        [multiply(r(60), input.speed), "MULTIPLY_INSTEAD_OF_DIVIDE"],
        [divide(input.speed, r(60)), "APPLY_SIXTY_IN_WRONG_DIRECTION"],
      ]);
      break;
    case "distanceFromPaceAndTime":
      addCandidates(candidates, correct, [
        [multiply(input.duration, input.pace), "MULTIPLY_PACE_AND_TIME"],
        [divide(input.pace, input.duration), "REVERSE_DIVISION"],
        [divide(input.duration, multiply(input.pace, r(60))), "IGNORE_MINUTE_CONVERSION"],
        [input.duration, "USE_SECOND_QUANTITY_ONLY"],
      ]);
      break;
    case "requiredUniformSpeedForDeadline": {
      const absoluteDeadline = add(input.deadlineMinuteOfDay, multiply(rational(input.deadlineDayOffset), r(1440)));
      const availableMinutes = subtract(absoluteDeadline, input.departureMinuteOfDay);
      const availableHours = divide(availableMinutes, r(60));
      addCandidates(candidates, correct, [
        [divide(input.distance, availableMinutes), "USE_MINUTES_AS_HOURS"],
        [divide(input.distance, add(availableHours, RATIONAL_ONE)), "ADD_ONE_HOUR_TO_INTERVAL"],
        [divide(input.distance, subtract(availableHours, RATIONAL_ONE)), "DROP_ONE_HOUR_FROM_INTERVAL"],
        [multiply(input.distance, availableHours), "MULTIPLY_INSTEAD_OF_DIVIDE"],
      ]);
      break;
    }
    case "arrivalClockTime":
    case "departureClockTime":
    case "classifyUniformMotionState":
    case "verifyUniformMotionClaim":
      break;
  }
  if (candidates.length < 3) {
    throw new Error(`${input.solveMode}: fewer than three misconception-specific scalar distractors for ${JSON.stringify(input, (_key, value) => typeof value === "bigint" ? `${value}n` : value)}`);
  }
  return candidates.slice(0, 3);
}

function clockWrongCandidates(
  input: Extract<TsdCp001SolveInput, { solveMode: "arrivalClockTime" | "departureClockTime" }>,
  solution: Extract<TsdCp001Solution, { answerKind: "CLOCK_TIME" }>,
): { minuteOfDay: Rational; dayOffset: bigint; misconceptionId: TsdCp001MisconceptionId }[] {
  const absoluteCorrect = add(solution.minuteOfDay, multiply(rational(solution.dayOffset), r(1440)));
  const reference = input.solveMode === "arrivalClockTime"
    ? input.departureMinuteOfDay
    : add(input.arrivalMinuteOfDay, multiply(rational(input.arrivalDayOffset), r(1440)));
  const raw = input.solveMode === "arrivalClockTime"
    ? [
        { absolute: reference, misconceptionId: "USE_GIVEN_DURATION_AS_ANSWER" as const },
        { absolute: subtract(reference, input.durationMinutes), misconceptionId: "SUBTRACT_WHEN_ADDITION_IS_REQUIRED" as const },
        { absolute: add(absoluteCorrect, r(60)), misconceptionId: "IGNORE_CLOCK_ROLLOVER" as const },
      ]
    : [
        { absolute: reference, misconceptionId: "USE_GIVEN_DURATION_AS_ANSWER" as const },
        { absolute: add(reference, input.durationMinutes), misconceptionId: "ADD_WHEN_SUBTRACTION_IS_REQUIRED" as const },
        { absolute: subtract(absoluteCorrect, r(60)), misconceptionId: "IGNORE_CLOCK_ROLLOVER" as const },
      ];
  const unique: { minuteOfDay: Rational; dayOffset: bigint; misconceptionId: TsdCp001MisconceptionId }[] = [];
  for (const candidate of raw) {
    const dayOffset = candidate.absolute.numerator >= 0n ? candidate.absolute.numerator / 1440n : -1n;
    const minuteOfDay = rational(((candidate.absolute.numerator % 1440n) + 1440n) % 1440n, candidate.absolute.denominator);
    const text = formatClock(minuteOfDay, dayOffset);
    if (text === formatClock(solution.minuteOfDay, solution.dayOffset)) continue;
    if (unique.some((entry) => formatClock(entry.minuteOfDay, entry.dayOffset) === text)) continue;
    unique.push({ minuteOfDay, dayOffset, misconceptionId: candidate.misconceptionId });
  }
  return unique.slice(0, 3);
}

function classificationOptions(solution: Extract<TsdCp001Solution, { answerKind: "CLASSIFICATION" }>): TsdCp001OptionAudit[] {
  const labels: readonly [typeof solution.classification, string][] = [
    ["UNIQUE", "Exactly one missing quantity can be calculated"],
    ["CONSISTENT", "All three supplied quantities agree"],
    ["INDETERMINATE", "Too few quantities are supplied for a unique calculation"],
    ["IMPOSSIBLE", "The supplied quantities contradict uniform motion"],
  ];
  return labels.map(([classification, text]) => ({
    text,
    misconceptionId: classification === solution.classification ? "CORRECT" : classification === "IMPOSSIBLE" ? "IGNORE_INCONSISTENT_IDENTITY" : "CLASSIFY_FROM_NUMBER_OF_GIVENS_ONLY",
    isCorrect: classification === solution.classification,
  }));
}

function booleanOptions(solution: Extract<TsdCp001Solution, { answerKind: "BOOLEAN" }>): TsdCp001OptionAudit[] {
  const correct = solution.value ? "Yes, the claim is correct" : "No, the claim is incorrect";
  const values = [
    "Yes, the claim is correct",
    "No, the claim is incorrect",
    "The claim is correct only after changing units",
    "The information is insufficient",
  ];
  return values.map((text) => ({
    text,
    misconceptionId: text === correct ? "CORRECT" : text.includes("units") ? "OMIT_UNIT_CONVERSION" : "ASSUME_CLAIM_WITHOUT_CHECKING",
    isCorrect: text === correct,
  }));
}

export function optionPackage(
  authority: TsdCp001DiscoveryAuthority,
  seed: string,
  input: TsdCp001SolveInput,
  solution: TsdCp001Solution,
  display: DisplayContract,
): { options: readonly string[]; optionAudit: readonly TsdCp001OptionAudit[]; correctIndex: number } {
  let unshuffled: TsdCp001OptionAudit[];
  if (solution.answerKind === "CLASSIFICATION") {
    unshuffled = classificationOptions(solution);
  } else if (solution.answerKind === "BOOLEAN") {
    unshuffled = booleanOptions(solution);
  } else if (solution.answerKind === "CLOCK_TIME") {
    if (input.solveMode !== "arrivalClockTime" && input.solveMode !== "departureClockTime") {
      throw new Error("Clock-time solution used with non-clock input");
    }
    unshuffled = [
      { text: formatClock(solution.minuteOfDay, solution.dayOffset), misconceptionId: "CORRECT", isCorrect: true },
      ...clockWrongCandidates(input, solution).map((candidate) => ({
        text: formatClock(candidate.minuteOfDay, candidate.dayOffset),
        misconceptionId: candidate.misconceptionId,
        isCorrect: false,
      })),
    ];
  } else {
    const correct = scalarSolutionValue(solution);
    if (!correct) throw new Error("Expected scalar solution");
    unshuffled = [
      { text: formatAnswer(solution, display), misconceptionId: "CORRECT", isCorrect: true },
      ...scalarWrongCandidates(input, correct).map((candidate) => {
        const wrongSolution = { ...solution, value: candidate.value } as TsdCp001Solution;
        return {
          text: formatAnswer(wrongSolution, display),
          misconceptionId: candidate.misconceptionId,
          isCorrect: false,
        };
      }),
    ];
  }
  if (unshuffled.length !== 4) throw new Error(`Could not build four options for ${authority.solveMode}`);
  const correctTarget = (trailingSeedOrdinal(seed) + authorityOrdinal(authority)) % 4;
  const correct = unshuffled.find((option) => option.isCorrect)!;
  const wrong = unshuffled.filter((option) => !option.isCorrect);
  const optionAudit: TsdCp001OptionAudit[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    optionAudit.push(index === correctTarget ? correct : wrong[wrongIndex++]);
  }
  return {
    options: optionAudit.map((option) => option.text),
    optionAudit,
    correctIndex: correctTarget,
  };
}
