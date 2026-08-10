import { add, multiply, rational, subtract, type Rational } from "../foundation/rational";
import type { TsdCp001Solution, TsdCp001SolveInput } from "./canonical-solver";
import type { TsdCp001DiscoveryAuthority } from "./discovery-registry";
import type { TsdCp001MisconceptionId, TsdCp001OptionAudit } from "./runtime-types";
import { authorityOrdinal, formatClock, r, trailingSeedOrdinal } from "./runtime-support";

interface OptionSet {
  readonly options: readonly string[];
  readonly optionAudit: readonly TsdCp001OptionAudit[];
  readonly correctIndex: number;
}

type ClockInput = Extract<TsdCp001SolveInput, {
  solveMode: "arrivalClockTime" | "departureClockTime";
}>;
type ClockSolution = Extract<TsdCp001Solution, { answerKind: "CLOCK_TIME" }>;

interface ClockCandidate {
  readonly absoluteMinute: Rational;
  readonly misconceptionId: TsdCp001MisconceptionId;
}

function absoluteSolution(solution: ClockSolution): Rational {
  return add(solution.minuteOfDay, multiply(rational(solution.dayOffset), r(1440)));
}

function clockParts(absoluteMinute: Rational): { minuteOfDay: Rational; dayOffset: bigint } {
  const dayOffset = absoluteMinute.numerator >= 0n ? absoluteMinute.numerator / 1440n : -1n;
  const minuteOfDay = rational(
    ((absoluteMinute.numerator % 1440n) + 1440n) % 1440n,
    absoluteMinute.denominator,
  );
  return { minuteOfDay, dayOffset };
}

function oppositeAmPmAbsolute(solution: ClockSolution): Rational {
  const shiftedMinute = solution.minuteOfDay.numerator >= 720n
    ? subtract(solution.minuteOfDay, r(720))
    : add(solution.minuteOfDay, r(720));
  return add(shiftedMinute, multiply(rational(solution.dayOffset), r(1440)));
}

function wrongBoundaryAbsolute(input: ClockInput, solution: ClockSolution): Rational {
  const correctAbsolute = absoluteSolution(solution);

  if (input.solveMode === "arrivalClockTime") {
    // Never offer the same clock digits with only “next day” removed. In a journey that
    // necessarily crosses midnight, that wording can describe the same instant.
    // The boundary distractor instead keeps the minute reading and flips AM/PM.
    return oppositeAmPmAbsolute(solution);
  }

  if (input.arrivalDayOffset > 0n && correctAbsolute.numerator < 1440n) {
    // The true departure is on the previous day. Put the same clock reading on the
    // following day to create a genuinely different calendar instant.
    return add(correctAbsolute, r(1440));
  }
  return oppositeAmPmAbsolute(solution);
}

function wrongCandidates(input: ClockInput, solution: ClockSolution): readonly ClockCandidate[] {
  const reference = input.solveMode === "arrivalClockTime"
    ? input.departureMinuteOfDay
    : add(input.arrivalMinuteOfDay, multiply(rational(input.arrivalDayOffset), r(1440)));

  return input.solveMode === "arrivalClockTime"
    ? [
        { absoluteMinute: reference, misconceptionId: "USE_GIVEN_DURATION_AS_ANSWER" },
        { absoluteMinute: subtract(reference, input.durationMinutes), misconceptionId: "SUBTRACT_WHEN_ADDITION_IS_REQUIRED" },
        { absoluteMinute: wrongBoundaryAbsolute(input, solution), misconceptionId: "IGNORE_CLOCK_ROLLOVER" },
      ]
    : [
        { absoluteMinute: reference, misconceptionId: "USE_GIVEN_DURATION_AS_ANSWER" },
        { absoluteMinute: add(reference, input.durationMinutes), misconceptionId: "ADD_WHEN_SUBTRACTION_IS_REQUIRED" },
        { absoluteMinute: wrongBoundaryAbsolute(input, solution), misconceptionId: "IGNORE_CLOCK_ROLLOVER" },
      ];
}

export function clockOptionPackage(
  authority: TsdCp001DiscoveryAuthority,
  seed: string,
  input: ClockInput,
  solution: ClockSolution,
): OptionSet {
  const correctText = formatClock(solution.minuteOfDay, solution.dayOffset);
  const wrong: TsdCp001OptionAudit[] = [];
  for (const candidate of wrongCandidates(input, solution)) {
    const parts = clockParts(candidate.absoluteMinute);
    const text = formatClock(parts.minuteOfDay, parts.dayOffset);
    if (text === correctText || wrong.some((option) => option.text === text)) continue;
    wrong.push({
      text,
      misconceptionId: candidate.misconceptionId,
      isCorrect: false,
    });
  }
  if (wrong.length !== 3) {
    throw new Error(`${input.solveMode}: could not build three distinct boundary-faithful clock distractors`);
  }

  const correct: TsdCp001OptionAudit = {
    text: correctText,
    misconceptionId: "CORRECT",
    isCorrect: true,
  };
  const correctIndex = (trailingSeedOrdinal(seed) + authorityOrdinal(authority)) % 4;
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
