import {
  absoluteRational,
  affineFaultyClockModel,
  clockRateFromGainLoss,
  deriveFaultyClockRateFromObservationsExact,
  displayedTimeFromActualExact,
  exactRational,
  multiplyRationals,
  subtractRationals,
} from "../../../../../foundation/temporal";
import type { ClockTaskId } from "../catalog";
import type { ClockFamilySolverInput, SolvedClockPrototype } from "../solver-types";
import {
  formatDurationSeconds,
  rationalAnswer,
  timeAnswer,
} from "../utils";

const TASKS = new Set<ClockTaskId>([
  "DISPLAYED_FROM_ACTUAL_ELAPSED",
  "INITIAL_OFFSET_CORRECT_RATE",
  "DERIVE_RATE_FROM_OBSERVATIONS",
  "COMPARE_TWO_FAULTY_CLOCKS",
]);

const HOUR = 3_600;
const MINUTE = 60;
const DAY = 86_400;

function durationAnswer(seconds: number | { numerator: bigint; denominator: bigint }) {
  return rationalAnswer("DURATION", seconds, formatDurationSeconds(seconds));
}

function solveDisplayedFromActual(input: ClockFamilySolverInput): SolvedClockPrototype {
  const actualAnchor = exactRational(8 * HOUR);
  const displayedAnchor = exactRational(8 * HOUR);
  const dailyGainMinutes = input.rng.pick([12, 15, 24, 30] as const);
  const actualElapsedHours = input.rng.pick([4, 6, 8, 12] as const);
  const actualElapsed = exactRational(actualElapsedHours * HOUR);
  const rate = clockRateFromGainLoss({
    direction: "GAIN",
    errorUnits: dailyGainMinutes * MINUTE,
    actualPeriodUnits: DAY,
  });
  const model = affineFaultyClockModel({
    actualAnchorSeconds: actualAnchor,
    displayedAnchorSeconds: displayedAnchor,
    rateDisplayedPerActual: rate,
  });
  const targetActual = exactRational(8 * HOUR + actualElapsedHours * HOUR);
  const displayed = displayedTimeFromActualExact(model, targetActual);
  const gainedDuringElapsed = exactRational(
    dailyGainMinutes * MINUTE * actualElapsedHours,
    24,
  );
  const manualDisplayed = exactRational(
    8 * HOUR + actualElapsedHours * HOUR +
      Number(gainedDuringElapsed.numerator / gainedDuringElapsed.denominator),
  );
  const answer = timeAnswer(displayed, { absolute: true, includeDayOffset: true, includeSeconds: false });
  const verifierAnswer = timeAnswer(manualDisplayed, { absolute: true, includeDayOffset: true, includeSeconds: false });
  const gainDuringText = formatDurationSeconds(gainedDuringElapsed);

  return {
    taskId: input.taskId,
    stem: `A clock is correct at 8:00 a.m. and gains ${dailyGainMinutes} minutes in every 24 actual hours. What will it show after ${actualElapsedHours} actual hours?`,
    scenario: {
      setRightAt: "8:00 a.m.",
      direction: "GAIN",
      dailyErrorMinutes: dailyGainMinutes,
      actualElapsedHours,
    },
    answer,
    verifierAnswer,
    distractors: [
      {
        answer: timeAnswer(exactRational(8 * HOUR + actualElapsedHours * HOUR), { absolute: true, includeDayOffset: true }),
        reasonCode: "GAIN_IGNORED",
        reason: "This advances the clock by the actual elapsed time but ignores the gain accumulated during that interval.",
      },
      {
        answer: timeAnswer(exactRational(8 * HOUR + actualElapsedHours * HOUR + dailyGainMinutes * MINUTE), { absolute: true, includeDayOffset: true }),
        reasonCode: "FULL_DAY_GAIN_APPLIED_TO_PARTIAL_DAY",
        reason: "This adds the full 24-hour gain even though fewer than 24 actual hours have elapsed.",
      },
      {
        answer: timeAnswer(exactRational(8 * HOUR + actualElapsedHours * HOUR - Number(gainedDuringElapsed.numerator / gainedDuringElapsed.denominator)), { absolute: true, includeDayOffset: true }),
        reasonCode: "GAIN_TREATED_AS_LOSS",
        reason: "This subtracts the accumulated error even though the clock is gaining time.",
      },
    ],
    explanation: {
      given: `The clock gains ${dailyGainMinutes} minutes in 24 actual hours and is correct at 8:00 a.m.`,
      rule: "For uniform gain, scale the daily gain in direct proportion to the actual elapsed time, then add that gain to the correct time.",
      working: [
        `Gain in ${actualElapsedHours} hours = ${dailyGainMinutes} × ${actualElapsedHours}/24 = ${gainDuringText}.`,
        `Correct time after ${actualElapsedHours} hours = ${timeAnswer(exactRational(8 * HOUR + actualElapsedHours * HOUR), { absolute: true, includeDayOffset: true }).display}.`,
        `Clock reading = correct time + ${gainDuringText} = ${answer.display}.`,
      ],
      validityCheck: "The hidden affine clock model gives the same displayed reading from the exact speed ratio.",
      closestTrap: "Use only the proportional gain for the elapsed part of the day; do not add the full daily gain.",
      answer: answer.display,
    },
    canonicalTrace: [`affineRate=${rate.numerator}/${rate.denominator}`, `displayed=${displayed.numerator}/${displayed.denominator}`],
    verifierTrace: [`proportionalGain=${gainedDuringElapsed.numerator}/${gainedDuringElapsed.denominator}`, `manualDisplayed=${manualDisplayed.numerator}/${manualDisplayed.denominator}`],
    solveTraceExtras: { rateRatio: `${rate.numerator}:${rate.denominator}` },
    contractEvidence: {
      expectedAnswerKind: "ABSOLUTE_TIME",
      oracleName: "CP006_EXAM_NATURAL_FORWARD_GAIN_ORACLE",
      visibleStemTokens: ["correct at 8:00 a.m.", `${dailyGainMinutes} minutes`, `${actualElapsedHours} actual hours`],
    },
  };
}

function solveInitialOffsetCorrectRate(input: ClockFamilySolverInput): SolvedClockPrototype {
  const offsetMinutes = input.rng.pick([5, 10, 15] as const);
  const elapsedHours = input.rng.pick([4, 6, 8, 12] as const);
  const direction = input.rng.pick(["BEHIND", "AHEAD"] as const);
  const actualAnchor = exactRational(8 * HOUR);
  const signedOffset = direction === "BEHIND" ? -offsetMinutes * MINUTE : offsetMinutes * MINUTE;
  const displayedAnchor = exactRational(8 * HOUR + signedOffset);
  const model = affineFaultyClockModel({
    actualAnchorSeconds: actualAnchor,
    displayedAnchorSeconds: displayedAnchor,
    rateDisplayedPerActual: 1,
  });
  const targetActual = exactRational(8 * HOUR + elapsedHours * HOUR);
  const displayed = displayedTimeFromActualExact(model, targetActual);
  const manualDisplayed = exactRational(8 * HOUR + elapsedHours * HOUR + signedOffset);
  const answer = timeAnswer(displayed, { absolute: true, includeDayOffset: true });
  const verifierAnswer = timeAnswer(manualDisplayed, { absolute: true, includeDayOffset: true });
  const relation = direction === "BEHIND" ? "slow" : "fast";

  return {
    taskId: input.taskId,
    stem: `At 8:00 a.m., a clock is ${offsetMinutes} minutes ${relation}. From then on it runs at the correct rate. What will it show ${elapsedHours} actual hours later?`,
    scenario: { actualAnchor: "8:00 a.m.", offsetMinutes, offsetDirection: direction, elapsedHours },
    answer,
    verifierAnswer,
    distractors: [
      {
        answer: timeAnswer(targetActual, { absolute: true, includeDayOffset: true }),
        reasonCode: "INITIAL_OFFSET_DISCARDED",
        reason: "This forgets that a correct running rate preserves the clock's initial error.",
      },
      {
        answer: timeAnswer(exactRational(8 * HOUR + elapsedHours * HOUR - signedOffset), { absolute: true, includeDayOffset: true }),
        reasonCode: "OFFSET_DIRECTION_REVERSED",
        reason: "This changes a slow clock into a fast one, or vice versa.",
      },
      {
        answer: timeAnswer(exactRational(8 * HOUR + elapsedHours * HOUR + 2 * signedOffset), { absolute: true, includeDayOffset: true }),
        reasonCode: "OFFSET_APPLIED_TWICE",
        reason: "This adds the fixed initial error a second time even though it does not grow.",
      },
    ],
    explanation: {
      given: `At 8:00 a.m. the clock is ${offsetMinutes} minutes ${relation}, and after that its running rate is correct.`,
      rule: "A clock running at the correct rate keeps the same fixed error; the offset neither grows nor shrinks.",
      working: [
        `Correct time ${elapsedHours} hours later = ${timeAnswer(targetActual, { absolute: true, includeDayOffset: true }).display}.`,
        `${direction === "BEHIND" ? "Subtract" : "Add"} the unchanged ${offsetMinutes}-minute offset.`,
        `Clock reading = ${answer.display}.`,
      ],
      validityCheck: "The exact affine model has slope 1, so displayed time and actual time advance equally.",
      closestTrap: "A fixed initial error is not a gain/loss rate; do not multiply it by elapsed hours.",
      answer: answer.display,
    },
    canonicalTrace: [`slope=1`, `displayed=${displayed.numerator}/${displayed.denominator}`],
    verifierTrace: [`actual+fixedOffset=${manualDisplayed.numerator}/${manualDisplayed.denominator}`],
    contractEvidence: {
      expectedAnswerKind: "ABSOLUTE_TIME",
      oracleName: "CP006_EXAM_NATURAL_FIXED_OFFSET_ORACLE",
      visibleStemTokens: ["At 8:00 a.m.", `${offsetMinutes} minutes ${relation}`, `${elapsedHours} actual hours later`],
    },
  };
}

function solveDeriveRate(input: ClockFamilySolverInput): SolvedClockPrototype {
  const initialSlowMinutes = input.rng.pick([5, 10] as const);
  const extraLossPerDayMinutes = input.rng.pick([10, 15, 20, 24] as const);
  const actualFirst = exactRational(8 * HOUR);
  const displayedFirst = exactRational(8 * HOUR - initialSlowMinutes * MINUTE);
  const actualSecond = exactRational(8 * HOUR + DAY);
  const displayedSecond = exactRational(8 * HOUR + DAY - (initialSlowMinutes + extraLossPerDayMinutes) * MINUTE);
  const derivedRate = deriveFaultyClockRateFromObservationsExact({
    actualFirstSeconds: actualFirst,
    displayedFirstSeconds: displayedFirst,
    actualSecondSeconds: actualSecond,
    displayedSecondSeconds: displayedSecond,
  });
  const manualRate = exactRational(24 * 60 - extraLossPerDayMinutes, 24 * 60);
  const display = `${derivedRate.numerator}:${derivedRate.denominator}`;
  const answer = rationalAnswer("RATE", derivedRate, display);
  const verifierAnswer = rationalAnswer("RATE", manualRate, `${manualRate.numerator}:${manualRate.denominator}`);

  return {
    taskId: input.taskId,
    stem: `At 8:00 a.m., a clock is ${initialSlowMinutes} minutes slow. Exactly 24 actual hours later it is ${initialSlowMinutes + extraLossPerDayMinutes} minutes slow. What is the ratio of time shown by the clock to actual time?`,
    scenario: { initialSlowMinutes, finalSlowMinutes: initialSlowMinutes + extraLossPerDayMinutes, observationGapHours: 24 },
    answer,
    verifierAnswer,
    distractors: [
      {
        answer: rationalAnswer("RATE", exactRational(24 * 60, 24 * 60 - extraLossPerDayMinutes), `${24 * 60}:${24 * 60 - extraLossPerDayMinutes}`),
        reasonCode: "SHOWN_ACTUAL_RATIO_REVERSED",
        reason: "This gives actual time : shown time instead of the requested shown time : actual time.",
      },
      {
        answer: rationalAnswer("RATE", exactRational(24 * 60 - initialSlowMinutes, 24 * 60), `${24 * 60 - initialSlowMinutes}:${24 * 60}`),
        reasonCode: "INITIAL_OFFSET_TREATED_AS_DAILY_LOSS",
        reason: "This mistakes the clock's initial fixed error for the amount lost during the observation period.",
      },
      {
        answer: rationalAnswer("RATE", exactRational(1), "1:1"),
        reasonCode: "CHANGE_IN_ERROR_IGNORED",
        reason: "This ignores the additional loss accumulated over the 24-hour observation period.",
      },
    ],
    explanation: {
      given: `The clock changes from ${initialSlowMinutes} minutes slow to ${initialSlowMinutes + extraLossPerDayMinutes} minutes slow in 24 actual hours.`,
      rule: "Only the change in error during the observation period determines the running rate; the initial fixed offset cancels.",
      working: [
        `Additional loss in 24 hours = ${initialSlowMinutes + extraLossPerDayMinutes} − ${initialSlowMinutes} = ${extraLossPerDayMinutes} minutes.`,
        `In 1440 actual minutes, the clock shows ${1440 - extraLossPerDayMinutes} minutes.`,
        `Shown time : actual time = ${1440 - extraLossPerDayMinutes}:1440 = ${answer.display}.`,
      ],
      validityCheck: "Subtracting the two displayed observations gives the same displayed elapsed time as the direct loss calculation.",
      closestTrap: "Do not use the initial slow amount as the daily loss; compare the change in error between observations.",
      answer: answer.display,
    },
    canonicalTrace: [`observationRate=${derivedRate.numerator}/${derivedRate.denominator}`],
    verifierTrace: [`(1440-loss)/1440=${manualRate.numerator}/${manualRate.denominator}`],
    solveTraceExtras: { rateRatio: display },
    contractEvidence: {
      expectedAnswerKind: "RATE",
      oracleName: "CP007_EXAM_NATURAL_RATE_FROM_ERROR_CHANGE_ORACLE",
      visibleStemTokens: [`${initialSlowMinutes} minutes slow`, "24 actual hours", `${initialSlowMinutes + extraLossPerDayMinutes} minutes slow`],
    },
  };
}

function solveCompareTwo(input: ClockFamilySolverInput): SolvedClockPrototype {
  const leftInitialAhead = input.rng.pick([5, 10] as const);
  const rightInitialBehind = input.rng.pick([5, 10] as const);
  const leftDailyGain = input.rng.pick([10, 15, 20] as const);
  const rightDailyLoss = input.rng.pick([10, 12, 15] as const);
  const anchor = exactRational(12 * HOUR);
  const leftRate = clockRateFromGainLoss({ direction: "GAIN", errorUnits: leftDailyGain * MINUTE, actualPeriodUnits: DAY });
  const rightRate = clockRateFromGainLoss({ direction: "LOSS", errorUnits: rightDailyLoss * MINUTE, actualPeriodUnits: DAY });
  const left = affineFaultyClockModel({
    actualAnchorSeconds: anchor,
    displayedAnchorSeconds: exactRational(12 * HOUR + leftInitialAhead * MINUTE),
    rateDisplayedPerActual: leftRate,
  });
  const right = affineFaultyClockModel({
    actualAnchorSeconds: anchor,
    displayedAnchorSeconds: exactRational(12 * HOUR - rightInitialBehind * MINUTE),
    rateDisplayedPerActual: rightRate,
  });
  const target = exactRational(12 * HOUR + DAY);
  const leftReading = displayedTimeFromActualExact(left, target);
  const rightReading = displayedTimeFromActualExact(right, target);
  const difference = absoluteRational(subtractRationals(leftReading, rightReading));
  const manualDifferenceMinutes = leftInitialAhead + rightInitialBehind + leftDailyGain + rightDailyLoss;
  const verifierDifference = exactRational(manualDifferenceMinutes * MINUTE);
  const answer = durationAnswer(difference);
  const verifierAnswer = durationAnswer(verifierDifference);

  return {
    taskId: input.taskId,
    stem: `At 12 noon, clock A is ${leftInitialAhead} minutes fast and gains ${leftDailyGain} minutes per day. At the same instant, clock B is ${rightInitialBehind} minutes slow and loses ${rightDailyLoss} minutes per day. How far apart will their readings be after 24 actual hours?`,
    scenario: { leftInitialAhead, leftDailyGain, rightInitialBehind, rightDailyLoss, elapsedHours: 24 },
    answer,
    verifierAnswer,
    distractors: [
      {
        answer: durationAnswer(exactRational((leftDailyGain + rightDailyLoss) * MINUTE)),
        reasonCode: "INITIAL_SEPARATION_IGNORED",
        reason: "This counts only the extra separation created during the day and ignores the two clocks' initial errors.",
      },
      {
        answer: durationAnswer(exactRational((leftInitialAhead + rightInitialBehind) * MINUTE)),
        reasonCode: "DAILY_GAIN_LOSS_IGNORED",
        reason: "This keeps only the initial separation and ignores the additional gain and loss over 24 hours.",
      },
      {
        answer: durationAnswer(exactRational(Math.abs(leftDailyGain - rightDailyLoss + leftInitialAhead - rightInitialBehind) * MINUTE)),
        reasonCode: "ERROR_DIRECTIONS_SUBTRACTED",
        reason: "A gaining fast clock and a losing slow clock move farther apart; subtracting their errors uses the wrong directions.",
      },
    ],
    explanation: {
      given: `A starts ${leftInitialAhead} minutes fast and gains ${leftDailyGain} minutes/day; B starts ${rightInitialBehind} minutes slow and loses ${rightDailyLoss} minutes/day.`,
      rule: "Because the clocks move away from correct time in opposite directions, add the initial separation and the additional separation accumulated during the day.",
      working: [
        `Initial separation = ${leftInitialAhead} + ${rightInitialBehind} = ${leftInitialAhead + rightInitialBehind} minutes.`,
        `Additional separation in 24 hours = ${leftDailyGain} + ${rightDailyLoss} = ${leftDailyGain + rightDailyLoss} minutes.`,
        `Total separation = ${leftInitialAhead + rightInitialBehind} + ${leftDailyGain + rightDailyLoss} = ${answer.display}.`,
      ],
      validityCheck: "Independent affine models for the two clocks give the same difference at the same actual instant.",
      closestTrap: "Since A gains while B loses, their daily errors increase the gap between them rather than cancelling.",
      answer: answer.display,
    },
    canonicalTrace: [`left=${leftReading.numerator}/${leftReading.denominator}`, `right=${rightReading.numerator}/${rightReading.denominator}`, `difference=${difference.numerator}/${difference.denominator}`],
    verifierTrace: [`initial+dailySeparation=${verifierDifference.numerator}/${verifierDifference.denominator}`],
    contractEvidence: {
      expectedAnswerKind: "DURATION",
      oracleName: "CP007_EXAM_NATURAL_TWO_CLOCK_SEPARATION_ORACLE",
      visibleStemTokens: ["clock A", `${leftDailyGain} minutes per day`, "clock B", `${rightDailyLoss} minutes per day`, "24 actual hours"],
    },
  };
}

export function solveExamNaturalFaultyCoreFamily(
  input: ClockFamilySolverInput,
): SolvedClockPrototype | null {
  if (!TASKS.has(input.taskId)) return null;
  if (input.taskId === "DISPLAYED_FROM_ACTUAL_ELAPSED") return solveDisplayedFromActual(input);
  if (input.taskId === "INITIAL_OFFSET_CORRECT_RATE") return solveInitialOffsetCorrectRate(input);
  if (input.taskId === "DERIVE_RATE_FROM_OBSERVATIONS") return solveDeriveRate(input);
  return solveCompareTwo(input);
}
