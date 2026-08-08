import {
  divide,
  equals,
  isPositive,
  multiply,
  rational,
  type Rational,
} from "../foundation/rational";
import { convertSpeed } from "../foundation/units";
import type { TsdCp001Solution, TsdCp001SolveInput } from "./canonical-solver";
import type {
  DisplayContract,
  TsdCp001MisconceptionId,
  TsdCp001OptionAudit,
} from "./runtime-types";
import { formatAnswer, formatExamNumber } from "./runtime-support";

interface OptionSet {
  readonly options: readonly string[];
  readonly optionAudit: readonly TsdCp001OptionAudit[];
  readonly correctIndex: number;
}

type WrongCandidate = readonly [Rational, TsdCp001MisconceptionId];

function scalarValue(solution: TsdCp001Solution): Rational | null {
  return "value" in solution && typeof solution.value !== "boolean" ? solution.value : null;
}

function placeOptions(
  correct: TsdCp001OptionAudit,
  wrong: readonly TsdCp001OptionAudit[],
  correctIndex: number,
): OptionSet {
  const optionAudit: TsdCp001OptionAudit[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    optionAudit.push(index === correctIndex ? correct : wrong[wrongIndex++]);
  }
  return {
    options: optionAudit.map((option) => option.text),
    optionAudit,
    correctIndex,
  };
}

function buildScalarSet(
  solution: TsdCp001Solution,
  display: DisplayContract,
  fallback: OptionSet,
  rawCandidates: readonly WrongCandidate[],
): OptionSet {
  const correctValue = scalarValue(solution);
  if (!correctValue) return fallback;

  const candidates: WrongCandidate[] = [];
  for (const [value, misconceptionId] of rawCandidates) {
    if (!isPositive(value) || equals(value, correctValue)) continue;
    if (candidates.some(([existing]) => equals(existing, value))) continue;
    candidates.push([value, misconceptionId]);
  }
  if (candidates.length < 3) return fallback;

  const correct = fallback.optionAudit.find((option) => option.isCorrect);
  if (!correct) return fallback;
  const wrong = candidates.slice(0, 3).map(([value, misconceptionId]) => ({
    text: formatAnswer({ ...solution, value } as TsdCp001Solution, display),
    misconceptionId,
    isCorrect: false,
  }));
  return placeOptions(correct, wrong, fallback.correctIndex);
}

function speedTriplet(mps: Rational, kmph: Rational, metresPerMinute: Rational): string {
  return `${formatExamNumber(mps)} m/s = ${formatExamNumber(kmph)} km/h = ${formatExamNumber(metresPerMinute)} m/min`;
}

function equivalentSpeedSet(
  input: Extract<TsdCp001SolveInput, { solveMode: "convertSpeedUnit" }>,
  fallback: OptionSet,
): OptionSet {
  const correct = fallback.optionAudit.find((option) => option.isCorrect);
  if (!correct) return fallback;

  const metresPerSecond = convertSpeed(input.value, input.from, "MPS");
  const kilometresPerHour = convertSpeed(metresPerSecond, "MPS", "KMPH");
  const metresPerMinute = convertSpeed(metresPerSecond, "MPS", "M_PER_MINUTE");
  const wrong: readonly TsdCp001OptionAudit[] = [
    {
      text: speedTriplet(
        metresPerSecond,
        multiply(metresPerSecond, rational(3)),
        metresPerMinute,
      ),
      misconceptionId: "USE_WRONG_CONVERSION_FACTOR",
      isCorrect: false,
    },
    {
      text: speedTriplet(
        metresPerSecond,
        kilometresPerHour,
        multiply(kilometresPerHour, rational(60)),
      ),
      misconceptionId: "MIX_UNCONVERTED_UNITS",
      isCorrect: false,
    },
    {
      text: speedTriplet(metresPerSecond, metresPerSecond, metresPerSecond),
      misconceptionId: "OMIT_UNIT_CONVERSION",
      isCorrect: false,
    },
  ];
  return placeOptions(correct, wrong, fallback.correctIndex);
}

function speedCandidates(
  input: Extract<TsdCp001SolveInput, { solveMode: "convertSpeedUnit" }>,
): readonly WrongCandidate[] | null {
  if (input.from === "KM_PER_MINUTE" && input.to === "KMPH") {
    return [
      [input.value, "OMIT_UNIT_CONVERSION"],
      [divide(input.value, rational(60)), "REVERSE_UNIT_CONVERSION"],
      [multiply(input.value, rational(3600)), "USE_WRONG_CONVERSION_FACTOR"],
    ];
  }
  if (input.from === "MPS" && input.to === "KMPH") {
    return [
      [multiply(input.value, rational(3)), "USE_WRONG_CONVERSION_FACTOR"],
      [multiply(input.value, rational(4)), "USE_WRONG_CONVERSION_FACTOR"],
      [input.value, "OMIT_UNIT_CONVERSION"],
    ];
  }
  if (input.from === "KMPH" && input.to === "MPS") {
    return [
      [divide(input.value, rational(3)), "USE_WRONG_CONVERSION_FACTOR"],
      [divide(input.value, rational(4)), "USE_WRONG_CONVERSION_FACTOR"],
      [input.value, "OMIT_UNIT_CONVERSION"],
    ];
  }
  return null;
}

function distanceCandidates(
  input: Extract<TsdCp001SolveInput, { solveMode: "convertDistanceUnit" }>,
): readonly WrongCandidate[] | null {
  if (input.from === "M" && input.to === "KM") {
    return [
      [input.value, "OMIT_UNIT_CONVERSION"],
      [divide(input.value, rational(100)), "USE_WRONG_CONVERSION_FACTOR"],
      [divide(input.value, rational(10000)), "USE_WRONG_CONVERSION_FACTOR"],
    ];
  }
  if (input.from === "M" && input.to === "CM") {
    return [
      [input.value, "OMIT_UNIT_CONVERSION"],
      [multiply(input.value, rational(1000)), "USE_WRONG_CONVERSION_FACTOR"],
      [multiply(input.value, rational(10)), "USE_WRONG_CONVERSION_FACTOR"],
    ];
  }
  if (input.from === "MM" && input.to === "CM") {
    return [
      [input.value, "OMIT_UNIT_CONVERSION"],
      [multiply(input.value, rational(10)), "REVERSE_UNIT_CONVERSION"],
      [divide(input.value, rational(100)), "USE_WRONG_CONVERSION_FACTOR"],
    ];
  }
  return null;
}

function timeCandidates(
  input: Extract<TsdCp001SolveInput, { solveMode: "convertTimeUnit" }>,
): readonly WrongCandidate[] | null {
  if (input.from === "HOUR" && input.to === "MINUTE") {
    return [
      [input.value, "OMIT_UNIT_CONVERSION"],
      [multiply(input.value, rational(24)), "USE_WRONG_CONVERSION_FACTOR"],
      [multiply(input.value, rational(3600)), "USE_WRONG_CONVERSION_FACTOR"],
    ];
  }
  if (input.from === "SECOND" && input.to === "HOUR") {
    return [
      [input.value, "OMIT_UNIT_CONVERSION"],
      [divide(input.value, rational(60)), "CONVERT_ONLY_ONE_UNIT"],
      [divide(divide(input.value, rational(60)), rational(24)), "USE_WRONG_CONVERSION_FACTOR"],
    ];
  }
  if (input.from === "MINUTE" && input.to === "DAY") {
    return [
      [input.value, "OMIT_UNIT_CONVERSION"],
      [divide(input.value, rational(60)), "CONVERT_ONLY_ONE_UNIT"],
      [divide(input.value, rational(24)), "USE_WRONG_CONVERSION_FACTOR"],
    ];
  }
  return null;
}

export function unitConversionOptionPackage(
  input: TsdCp001SolveInput,
  solution: TsdCp001Solution,
  display: DisplayContract,
  representation: string,
  fallback: OptionSet,
): OptionSet {
  if (input.solveMode === "convertSpeedUnit") {
    if (representation === "EQUIVALENT_SPEED_SET") {
      return equivalentSpeedSet(input, fallback);
    }
    const candidates = speedCandidates(input);
    return candidates ? buildScalarSet(solution, display, fallback, candidates) : fallback;
  }
  if (input.solveMode === "convertDistanceUnit") {
    const candidates = distanceCandidates(input);
    return candidates ? buildScalarSet(solution, display, fallback, candidates) : fallback;
  }
  if (input.solveMode === "convertTimeUnit") {
    const candidates = timeCandidates(input);
    return candidates ? buildScalarSet(solution, display, fallback, candidates) : fallback;
  }
  return fallback;
}
