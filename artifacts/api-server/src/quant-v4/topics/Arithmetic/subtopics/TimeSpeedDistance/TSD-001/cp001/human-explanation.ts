import type { TsdCp001SolveInput } from "./canonical-solver";
import type { TsdCp001DiscoveryAuthority } from "./discovery-registry";
import { buildFourTierExplanation } from "./pedagogy";
import type {
  DisplayContract,
  TsdCp001Explanation,
  TsdCp001OptionAnalysis,
  TsdCp001OptionAudit,
} from "./runtime-types";
import { hashSeed, humanizeMisconception } from "./runtime-support";

function naturalize(value: string): string {
  return value
    .replace(/compatible units/gi, "matching units")
    .replace(/continuous timeline/gi, "complete clock interval")
    .replace(/required answer/gi, "final answer")
    .replace(/\.{2,}/g, ".");
}

function clockTeachingLead(input: TsdCp001SolveInput, variant: number): string | null {
  if (input.solveMode === "arrivalClockTime") {
    return [
      "The journey duration is added to the starting time, so move forward on the clock.",
      "Start from the departure time and add the complete hours before adding the remaining minutes.",
      "Because the arrival time is required, follow the clock forward and watch the AM/PM or day change.",
    ][variant];
  }
  if (input.solveMode === "departureClockTime") {
    return [
      "The starting time is earlier than the arrival time, so work backward by the full journey duration.",
      "Begin at the arrival time and subtract the complete hours before subtracting the remaining minutes.",
      "To recover the departure time, move backward on the clock and treat midnight as a change of day.",
    ][variant];
  }
  if (input.solveMode === "elapsedClockTime") {
    return [
      "Find the full interval between departure and arrival; do not compare only the clock numbers.",
      "Count the journey in chronological order and split the interval at midnight whenever the day changes.",
      "Measure the complete time from departure to arrival while keeping the AM/PM and next-day labels in view.",
    ][variant];
  }
  return null;
}

function decisiveCheck(input: TsdCp001SolveInput): string {
  switch (input.solveMode) {
    case "distanceFromSpeedAndTime":
      return "the unit conversions and the final speed × time multiplication";
    case "speedFromDistanceAndTime":
      return "the converted distance ÷ time calculation";
    case "timeFromDistanceAndSpeed":
      return "the converted distance ÷ speed calculation";
    case "convertSpeedUnit":
    case "convertDistanceUnit":
    case "convertTimeUnit":
      return "the direction and size of the conversion factor";
    case "speedFromMixedUnits":
      return "the converted distance and time used in the division";
    case "arrivalClockTime":
      return "the addition of the journey duration to the starting time";
    case "departureClockTime":
      return "the subtraction of the journey duration from the arrival time";
    case "elapsedClockTime":
      return "the full interval between the two clock times";
    case "compareDistancesAtEqualTime":
      return "the fact that the common travel time cancels";
    case "compareTimesAtEqualDistance":
      return "the inverse relation between speed and time for the same distance";
    case "compareSpeedsAtEqualTime":
      return "the fact that the common travel time cancels from speed = distance ÷ time";
    case "distanceRatioFromSpeedAndTimeRatios":
      return "the multiplication of the speed and time ratios in A:B order";
    case "speedRatioFromDistanceAndTimeRatios":
      return "distance ratio ÷ time ratio in A:B order";
    case "timeRatioFromDistanceAndSpeedRatios":
      return "distance ratio ÷ speed ratio in A:B order";
    case "distanceByProportion":
      return "the original speed and its use over the new journey time";
    case "timeByProportion":
      return "the original speed and the new distance ÷ speed calculation";
    case "speedByProportion":
      return "the reconstructed journey distance and its division by the new time";
    case "speedFromPace":
      return input.outputUnit === "MPS"
        ? "1000 metres ÷ the seconds taken for one kilometre"
        : "60 minutes ÷ the minutes taken for one kilometre";
    case "paceFromSpeed":
      return input.outputUnit === "SECOND_PER_KM"
        ? "1000 metres ÷ the metres covered each second"
        : "60 minutes ÷ the speed in km/h";
    case "distanceFromPaceAndTime": {
      const timeUnit = input.paceUnit === "SECOND_PER_KM" ? "seconds" : "minutes";
      return input.outputUnit === "M"
        ? `total ${timeUnit} ÷ ${timeUnit} per kilometre, followed by kilometres × 1000`
        : `total ${timeUnit} ÷ ${timeUnit} per kilometre`;
    }
    case "requiredUniformSpeedForDeadline":
      return "the exact available time and distance ÷ available hours";
    default:
      return "the complete distance–speed–time calculation";
  }
}

function correctReason(input: TsdCp001SolveInput, answerText: string, variant: number): string {
  const variants = (first: string, second: string, third: string): string => [first, second, third][variant];
  switch (input.solveMode) {
    case "distanceFromSpeedAndTime":
      return variants(
        `✅ Correct: after converting speed and time into matching units, their product is ${answerText}.`,
        `✅ Correct: the converted speed multiplied by the converted duration gives ${answerText}.`,
        `✅ Correct: once the units match, distance = speed × time produces ${answerText}.`,
      );
    case "speedFromDistanceAndTime":
      return variants(
        `✅ Correct: the complete distance divided by the complete duration gives ${answerText}.`,
        `✅ Correct: after the needed conversion, distance ÷ time equals ${answerText}.`,
        `✅ Correct: ${answerText} is the distance covered in each second.`,
      );
    case "timeFromDistanceAndSpeed":
      return variants(
        `✅ Correct: distance divided by the matching-unit speed gives ${answerText}.`,
        `✅ Correct: the converted distance ÷ converted speed calculation gives ${answerText}.`,
        `✅ Correct: travelling the stated distance at the stated speed takes ${answerText}.`,
      );
    case "distanceByProportion":
      return variants(
        `✅ Correct: the speed recovered from the first journey covers ${answerText} in the new time.`,
        `✅ Correct: applying the unchanged speed to the second duration gives ${answerText}.`,
        `✅ Correct: old distance ÷ old time gives the speed, and speed × new time gives ${answerText}.`,
      );
    case "timeByProportion":
      return variants(
        `✅ Correct: the new distance divided by the speed recovered from the first journey gives ${answerText}.`,
        `✅ Correct: at the unchanged speed, the second journey requires ${answerText}.`,
        `✅ Correct: old distance ÷ old time gives the speed, and new distance ÷ that speed gives ${answerText}.`,
      );
    case "speedByProportion":
      return variants(
        `✅ Correct: old speed × old time reconstructs the common distance, and distance ÷ new time gives ${answerText}.`,
        `✅ Correct: the speed needed to cover the same reconstructed distance in the new duration is ${answerText}.`,
        `✅ Correct: dividing the original journey distance by the new time produces ${answerText}.`,
      );
    case "requiredUniformSpeedForDeadline":
      return variants(
        `✅ Correct: dividing the full distance by the exact available time gives ${answerText}.`,
        `✅ Correct: ${answerText} is the speed that uses the available time exactly.`,
        `✅ Correct: the calculated time window and distance give a minimum speed of ${answerText}.`,
      );
    case "arrivalClockTime":
      return variants(
        `✅ Correct: moving forward from the starting time by the full journey duration ends at ${answerText}.`,
        `✅ Correct: adding the complete hours and then the remaining minutes gives ${answerText}.`,
        `✅ Correct: the forward clock calculation, including the AM/PM or day change, gives ${answerText}.`,
      );
    case "departureClockTime":
      return variants(
        `✅ Correct: moving backward from the arrival time by the full journey duration gives ${answerText}.`,
        `✅ Correct: subtracting the complete hours and then the remaining minutes gives ${answerText}.`,
        `✅ Correct: the backward clock calculation, including the midnight rollover, gives ${answerText}.`,
      );
    case "elapsedClockTime":
      return variants(
        `✅ Correct: counting the complete interval from departure to arrival gives ${answerText}.`,
        `✅ Correct: the time before and after the boundary adds up to ${answerText}.`,
        `✅ Correct: keeping the AM/PM and next-day labels in order gives a total of ${answerText}.`,
      );
    case "compareDistancesAtEqualTime":
    case "compareTimesAtEqualDistance":
    case "compareSpeedsAtEqualTime":
    case "distanceRatioFromSpeedAndTimeRatios":
    case "speedRatioFromDistanceAndTimeRatios":
    case "timeRatioFromDistanceAndSpeedRatios":
      return variants(
        `✅ Correct: keeping the order A:B and simplifying the governing relation gives ${answerText}.`,
        `✅ Correct: the common factor is handled correctly, leaving the ratio ${answerText}.`,
        `✅ Correct: forming the comparison in the stated A:B order gives ${answerText}.`,
      );
    case "convertSpeedUnit":
    case "convertDistanceUnit":
    case "convertTimeUnit":
      return variants(
        `✅ Correct: applying the correct conversion factor gives ${answerText}.`,
        `✅ Correct: the same physical quantity written in the target unit is ${answerText}.`,
        `✅ Correct: the conversion moves in the right direction and produces ${answerText}.`,
      );
    case "speedFromMixedUnits":
      return variants(
        `✅ Correct: after matching the distance and time units to the requested speed unit, the division gives ${answerText}.`,
        `✅ Correct: converted distance ÷ converted time gives ${answerText}.`,
        `✅ Correct: the numerator and denominator units combine to produce ${answerText}.`,
      );
    case "speedFromPace":
      return input.outputUnit === "MPS"
        ? variants(
            `✅ Correct: 1000 metres divided by the stated seconds per kilometre gives ${answerText}.`,
            `✅ Correct: one kilometre is 1000 metres, and distance ÷ time gives ${answerText}.`,
            `✅ Correct: converting the one-kilometre pace directly into metres per second gives ${answerText}.`,
          )
        : variants(
            `✅ Correct: 60 minutes divided by the minutes taken per kilometre gives ${answerText}.`,
            `✅ Correct: the hourly speed corresponding to the stated pace is ${answerText}.`,
            `✅ Correct: applying the reciprocal pace relation gives ${answerText}.`,
          );
    case "paceFromSpeed":
      return input.outputUnit === "SECOND_PER_KM"
        ? variants(
            `✅ Correct: 1000 metres divided by the metres covered each second gives ${answerText}.`,
            `✅ Correct: the time needed to cover one kilometre at the stated m/s speed is ${answerText}.`,
            `✅ Correct: distance ÷ speed gives a one-kilometre pace of ${answerText}.`,
          )
        : variants(
            `✅ Correct: 60 minutes divided by the speed in km/h gives ${answerText}.`,
            `✅ Correct: the time needed for one kilometre at the stated hourly speed is ${answerText}.`,
            `✅ Correct: applying the inverse speed–pace relation gives ${answerText}.`,
          );
    case "distanceFromPaceAndTime":
      return input.outputUnit === "M"
        ? variants(
            `✅ Correct: total time ÷ pace gives kilometres, and multiplying by 1000 gives ${answerText}.`,
            `✅ Correct: the journey covers the calculated kilometre amount, which converts to ${answerText}.`,
            `✅ Correct: after finding distance in kilometres, the final km-to-m conversion gives ${answerText}.`,
          )
        : variants(
            `✅ Correct: dividing total time by the time needed for one kilometre gives ${answerText}.`,
            `✅ Correct: the total duration contains exactly ${answerText} at the stated pace.`,
            `✅ Correct: total time ÷ pace gives a distance of ${answerText}.`,
          );
    default:
      return variants(
        `✅ Correct: substituting the stated values into the governing relation gives ${answerText}.`,
        `✅ Correct: the complete calculation agrees with ${answerText}.`,
        `✅ Correct: checking the result against the original data confirms ${answerText}.`,
      );
  }
}

function paceOptionReason(
  input: Extract<TsdCp001SolveInput, { solveMode: "speedFromPace" | "paceFromSpeed" | "distanceFromPaceAndTime" }>,
  option: TsdCp001OptionAnalysis,
): string | null {
  if (option.isCorrect) return null;

  if (input.solveMode === "speedFromPace") {
    if (option.misconceptionId === "FAIL_TO_INVERT_PACE") {
      return `⚠️ ${option.text}: this copies the pace number as a speed. Pace is time per kilometre, so distance must be divided by time.`;
    }
    if (input.outputUnit === "MPS" && option.misconceptionId === "USE_WRONG_CONVERSION_FACTOR") {
      return `⚠️ ${option.text}: this uses 60 where the distance should be 1000 metres. For m/s, calculate 1000 ÷ seconds per kilometre.`;
    }
    if (input.outputUnit === "MPS" && option.misconceptionId === "TREAT_SECONDS_AS_MINUTES") {
      return `⚠️ ${option.text}: this treats the given seconds as though they were minutes. The pace is already in seconds per kilometre.`;
    }
  }

  if (input.solveMode === "paceFromSpeed") {
    if (option.misconceptionId === "FAIL_TO_INVERT_PACE") {
      return `⚠️ ${option.text}: this copies the speed number as the time for one kilometre. Pace must be found by dividing the one-kilometre distance by speed.`;
    }
    if (option.misconceptionId === "MULTIPLY_INSTEAD_OF_DIVIDE") {
      const distance = input.outputUnit === "SECOND_PER_KM" ? "1000 metres" : "60 minutes";
      return `⚠️ ${option.text}: this multiplies ${distance} by the speed, but the time for one kilometre is found by division.`;
    }
    if (input.outputUnit === "SECOND_PER_KM" && option.misconceptionId === "USE_WRONG_CONVERSION_FACTOR") {
      return `⚠️ ${option.text}: this uses 60 instead of the 1000 metres contained in one kilometre.`;
    }
  }

  if (input.solveMode === "distanceFromPaceAndTime") {
    if (input.outputUnit === "M" && option.misconceptionId === "OMIT_UNIT_CONVERSION") {
      return `⚠️ ${option.text}: this finds the distance in kilometres but writes the same number as metres. Multiply the kilometre result by 1000.`;
    }
    if (option.misconceptionId === "MULTIPLY_PACE_AND_TIME") {
      return `⚠️ ${option.text}: this multiplies total time by time per kilometre. The number of kilometres is total time ÷ time per kilometre.`;
    }
    if (option.misconceptionId === "REVERSE_DIVISION") {
      return `⚠️ ${option.text}: this divides the one-kilometre time by the total time, reversing the required calculation.`;
    }
  }

  return null;
}

function humanOptionReason(
  input: TsdCp001SolveInput,
  option: TsdCp001OptionAnalysis,
  variant: number,
): string {
  if (option.isCorrect) return correctReason(input, option.text, variant);

  if (input.solveMode === "elapsedClockTime" && option.misconceptionId === "MISREAD_TIME") {
    return `⚠️ ${option.text}: this adds an extra 30 minutes that do not occur anywhere in the journey interval.`;
  }

  if (
    (input.solveMode === "arrivalClockTime" || input.solveMode === "departureClockTime")
    && option.misconceptionId === "IGNORE_CLOCK_ROLLOVER"
  ) {
    return `⚠️ ${option.text}: this keeps the clock reading but assigns the wrong AM/PM or calendar day at the boundary.`;
  }

  if (
    input.solveMode === "convertSpeedUnit"
    && option.misconceptionId === "MIX_UNCONVERTED_UNITS"
    && /m\/min/.test(option.text)
  ) {
    return `⚠️ ${option.text}: this multiplies the km/h number by 60 as though it were already m/s. Convert to m/s first, then multiply by 60.`;
  }

  if (
    input.solveMode === "speedFromPace"
    || input.solveMode === "paceFromSpeed"
    || input.solveMode === "distanceFromPaceAndTime"
  ) {
    const paceReason = paceOptionReason(input, option);
    if (paceReason) return paceReason;
  }

  const existing = naturalize(option.reason);
  if (!/this option is obtained by/i.test(existing)) {
    if (existing.includes(option.text)) return existing;
    return existing.replace(/^⚠️\s*/, `⚠️ ${option.text}: `);
  }

  const mistake = humanizeMisconception(option.misconceptionId);
  const check = decisiveCheck(input);
  const templates = [
    `⚠️ The value ${option.text} appears after ${mistake}. Reworking ${check} rules it out.`,
    `⚠️ Choosing ${option.text} means ${mistake}. A careful check of ${check} gives a different result.`,
    `⚠️ ${option.text} can be reached only by ${mistake}; it does not survive a check of ${check}.`,
  ] as const;
  return templates[variant];
}

export function buildHumanExplanation(
  authority: TsdCp001DiscoveryAuthority,
  input: TsdCp001SolveInput,
  display: DisplayContract,
  working: readonly string[],
  optionAudit: readonly TsdCp001OptionAudit[],
  answerText: string,
  seed: string,
): TsdCp001Explanation {
  const base = buildFourTierExplanation(
    authority,
    input,
    display,
    working,
    optionAudit,
    answerText,
    seed,
  );
  const variant = hashSeed(seed) % 3;
  const normalizedSteps = base.stepByStepSolution.map(naturalize);
  const clockLead = clockTeachingLead(input, variant);
  const stepByStepSolution = clockLead
    ? [clockLead, ...normalizedSteps.slice(1)]
    : normalizedSteps;

  return {
    ...base,
    keyRule: naturalize(base.keyRule),
    stepByStepSolution,
    examSpeedShortcut: naturalize(base.examSpeedShortcut),
    optionAnalysis: base.optionAnalysis.map((option) => ({
      ...option,
      reason: humanOptionReason(input, option, variant),
    })),
    concept: naturalize(base.concept),
    working: base.working.map(naturalize),
    shortcut: naturalize(base.shortcut),
    trap: naturalize(base.trap),
    conclusion: naturalize(base.conclusion),
  };
}
