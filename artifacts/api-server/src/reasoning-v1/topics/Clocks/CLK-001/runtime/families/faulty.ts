import {
  absoluteRational,
  actualTimeFromDisplayedExact,
  actualTimeWhenErrorReachesExact,
  actualTimeWhenTwoFaultyClocksAgreeExact,
  addRationals,
  affineFaultyClockModel,
  applyPiecewiseFaultyClockRatesExact,
  classifyFaultyClockRate,
  clockRateFromGainLoss,
  compareRationals,
  deriveFaultyClockRateFromObservationsExact,
  displayedTimeFromActualExact,
  divideRationals,
  exactRational,
  faultyClockErrorAtActualExact,
  gainOrLossPerActualPeriodExact,
  inferRateFromDisplayedEventIntervalExact,
  multiplyRationals,
  nextCorrectAnalogDialActualTimeExact,
  rationalsEqual,
  subtractRationals,
  type ExactRational,
} from "../../../../../foundation/temporal";
import type { ClockTaskId } from "../catalog";
import type {
  ClockContractEvidence,
  ClockFamilySolverInput,
  SolvedClockPrototype,
} from "../solver-types";
import type { ClockAnswerKind, ClockSemanticAnswer } from "../types";
import {
  clockSeconds,
  formatClockTimeFromSeconds,
  formatDurationSeconds,
  rationalAnswer,
  textAnswer,
  timeAnswer,
} from "../utils";

const CP006_TASKS = new Set<ClockTaskId>([
  "DISPLAYED_FROM_ACTUAL_ELAPSED",
  "ACTUAL_FROM_DISPLAYED_ELAPSED",
  "ERROR_AFTER_ACTUAL_DURATION",
  "ACTUAL_DURATION_FROM_READING_CHANGE",
  "CLASSIFY_FAST_SLOW",
  "CONVERT_GAIN_LOSS_RATE",
  "INITIAL_OFFSET_CORRECT_RATE",
  "INITIAL_OFFSET_AND_WRONG_RATE",
]);

const CP007_TASKS = new Set<ClockTaskId>([
  "DERIVE_RATE_FROM_OBSERVATIONS",
  "DERIVE_SET_RIGHT_TIME",
  "MULTIDAY_ACTUAL_FROM_DISPLAY",
  "MULTIDAY_DISPLAY_FROM_ACTUAL",
  "TIME_WHEN_ERROR_REACHES_TARGET",
  "NEXT_CORRECT_READING",
  "COMPARE_TWO_FAULTY_CLOCKS",
  "GAINING_AND_LOSING_EQUALITY",
  "PIECEWISE_RATE",
  "MISSING_GAIN_LOSS_FROM_FINAL",
]);

const CP008_TASKS = new Set<ClockTaskId>([
  "GAIN_FROM_COINCIDENCE_INTERVAL",
  "LOSS_FROM_COINCIDENCE_INTERVAL",
  "COINCIDENCE_INTERVAL_FROM_RATE",
  "CLASSIFY_FROM_EVENT_INTERVAL",
  "RATE_FROM_RIGHT_OR_OPPOSITION_RECURRENCE",
  "ACTUAL_TIME_OF_NTH_DISPLAYED_EVENT",
]);

const DAY_SECONDS = 86_400;
const HALF_DAY_SECONDS = 43_200;
const DISPLAYED_COINCIDENCE_INTERVAL = exactRational(43_200, 11);
const DISPLAYED_RIGHT_ANGLE_INTERVAL = exactRational(21_600, 11);

function exactKey(value: ExactRational): string {
  return `${value.numerator}/${value.denominator}`;
}

function rateDisplay(rate: ExactRational): string {
  return `${rate.numerator}:${rate.denominator}`;
}

function signedErrorText(error: ExactRational): string {
  const magnitude = absoluteRational(error);
  if (compareRationals(error, 0) > 0) return `gains ${formatDurationSeconds(magnitude)}`;
  if (compareRationals(error, 0) < 0) return `loses ${formatDurationSeconds(magnitude)}`;
  return "has no error";
}

function contract(
  expectedAnswerKind: ClockAnswerKind,
  oracleName: string,
  visibleStemTokens: readonly string[],
): ClockContractEvidence {
  return { expectedAnswerKind, oracleName, visibleStemTokens };
}

function durationDistractors(
  correct: ExactRational,
  reasonPrefix: string,
): SolvedClockPrototype["distractors"] {
  return [
    {
      answer: rationalAnswer("DURATION", multiplyRationals(correct, 2), formatDurationSeconds(multiplyRationals(correct, 2))),
      reasonCode: `${reasonPrefix}_DOUBLED`,
      reason: "This doubles the exact elapsed or error amount by applying the rate conversion twice.",
    },
    {
      answer: rationalAnswer("DURATION", divideRationals(correct, 2), formatDurationSeconds(divideRationals(correct, 2))),
      reasonCode: `${reasonPrefix}_HALVED`,
      reason: "This uses only half of the required elapsed or accumulated-error amount.",
    },
    {
      answer: rationalAnswer("DURATION", addRationals(correct, 60), formatDurationSeconds(addRationals(correct, 60))),
      reasonCode: `${reasonPrefix}_ONE_MINUTE_ADDED`,
      reason: "This introduces an extra minute that is not supported by the exact displayed:actual proportion.",
    },
  ];
}

function timeDistractors(
  correct: ExactRational,
  absolute = true,
): SolvedClockPrototype["distractors"] {
  return [
    {
      answer: timeAnswer(addRationals(correct, 300), { absolute, includeDayOffset: absolute, includeSeconds: true }),
      reasonCode: "INITIAL_OFFSET_ADDED_TWICE",
      reason: "This adds the initial clock offset a second time after the affine conversion.",
    },
    {
      answer: timeAnswer(subtractRationals(correct, 300), { absolute, includeDayOffset: absolute, includeSeconds: true }),
      reasonCode: "INITIAL_OFFSET_REVERSED",
      reason: "This applies the initial ahead/behind offset in the wrong direction.",
    },
    {
      answer: timeAnswer(addRationals(correct, 3_600), { absolute, includeDayOffset: absolute, includeSeconds: true }),
      reasonCode: "RATE_APPLIED_TO_WRONG_BASE",
      reason: "This applies the clock-rate correction to the absolute reading instead of only to elapsed time from the anchor.",
    },
  ];
}

function rateDistractors(
  correct: ExactRational,
): SolvedClockPrototype["distractors"] {
  const reciprocal = divideRationals(1, correct);
  const errorOnly = absoluteRational(subtractRationals(correct, 1));
  return [
    {
      answer: rationalAnswer("RATE", reciprocal, rateDisplay(reciprocal)),
      reasonCode: "ACTUAL_DISPLAYED_RATIO_INVERTED",
      reason: "This reverses displayed elapsed time and actual elapsed time in the rate ratio.",
    },
    {
      answer: rationalAnswer("RATE", errorOnly, rateDisplay(errorOnly)),
      reasonCode: "ERROR_FRACTION_USED_AS_FULL_RATE",
      reason: "This reports only the gain/loss fraction instead of adding it to or subtracting it from one full unit of clock rate.",
    },
    {
      answer: rationalAnswer("RATE", addRationals(correct, 1), rateDisplay(addRationals(correct, 1))),
      reasonCode: "BASE_RATE_COUNTED_TWICE",
      reason: "This adds another full correct-rate unit after the displayed:actual ratio has already been formed.",
    },
  ];
}

function classificationDistractors(
  correct: "FAST" | "SLOW" | "CORRECT",
): SolvedClockPrototype["distractors"] {
  return (["FAST", "SLOW", "CORRECT", "CANNOT_DETERMINE"] as const)
    .filter((value) => value !== correct)
    .map((value) => ({
      answer: textAnswer("CLASSIFICATION", value, value.toLowerCase().replaceAll("_", " ")),
      reasonCode: `MISCLASSIFIED_AS_${value}`,
      reason: "This classification does not match whether displayed elapsed time is greater than, less than or equal to actual elapsed time.",
    }));
}

function modelFromDailyError(
  direction: "GAIN" | "LOSS",
  errorMinutes: number,
  actualAnchorSeconds: ExactRational | number,
  displayedAnchorSeconds?: ExactRational | number,
) {
  const rate = clockRateFromGainLoss({
    direction,
    errorUnits: errorMinutes * 60,
    actualPeriodUnits: DAY_SECONDS,
  });
  const model = affineFaultyClockModel({
    actualAnchorSeconds,
    displayedAnchorSeconds,
    rateDisplayedPerActual: rate,
  });
  return { rate, model };
}

function solveCp006(input: ClockFamilySolverInput): SolvedClockPrototype {
  const direction = input.rng.pick(["GAIN", "LOSS"] as const);
  const errorMinutes = input.rng.pick([4, 6, 8, 10, 12, 15, 20, 24, 30] as const);
  const actualAnchor = exactRational(clockSeconds(8, 0).numerator, clockSeconds(8, 0).denominator);
  const base = modelFromDailyError(direction, errorMinutes, actualAnchor);

  if (input.taskId === "DISPLAYED_FROM_ACTUAL_ELAPSED") {
    const actualElapsedHours = input.rng.pick([6, 8, 12, 18, 24, 36, 48] as const);
    const targetActual = addRationals(actualAnchor, actualElapsedHours * 3_600);
    const displayed = displayedTimeFromActualExact(base.model, targetActual);
    const manualDisplayed = addRationals(actualAnchor, multiplyRationals(base.rate, actualElapsedHours * 3_600));
    const answer = timeAnswer(displayed, { absolute: true, includeDayOffset: true, includeSeconds: true });
    const verifierAnswer = timeAnswer(manualDisplayed, { absolute: true, includeDayOffset: true, includeSeconds: true });
    const anchorText = formatClockTimeFromSeconds(actualAnchor, { includeDayOffset: true });
    return {
      taskId: input.taskId,
      stem: `A clock is correct at ${anchorText} and ${direction === "GAIN" ? "gains" : "loses"} ${errorMinutes} minutes every 24 actual hours. What will it display after ${actualElapsedHours} actual hours?`,
      scenario: { anchor: anchorText, direction, errorMinutesPerDay: errorMinutes, actualElapsedHours },
      answer,
      verifierAnswer,
      distractors: timeDistractors(displayed),
      explanation: {
        given: `Correct at ${anchorText}; ${direction.toLowerCase()} ${errorMinutes} minutes per day; actual elapsed time ${actualElapsedHours} hours.`,
        rule: "Displayed elapsed time = clock rate × actual elapsed time; add that elapsed amount to the displayed anchor.",
        working: [`Displayed:actual rate = ${rateDisplay(base.rate)}.`, `Displayed reading = ${answer.display}.`],
        validityCheck: "A separate elapsed-time proportion gives the same displayed reading.",
        closestTrap: "Apply the rate to elapsed time only; do not multiply the clock's absolute starting reading by the rate.",
        answer: answer.display,
      },
      canonicalTrace: [`D=D0+r(A-A0)=${exactKey(displayed)}`],
      verifierTrace: [`D=A0+r×elapsed=${exactKey(manualDisplayed)}`],
      solveTraceExtras: { rateRatio: rateDisplay(base.rate) },
      contractEvidence: contract("ABSOLUTE_TIME", "CP006_DISPLAYED_FROM_ACTUAL_AFFINE_ORACLE", [anchorText, `${errorMinutes} minutes`, `${actualElapsedHours} actual hours`]),
    };
  }

  if (input.taskId === "ACTUAL_FROM_DISPLAYED_ELAPSED") {
    const actualElapsedHours = input.rng.pick([8, 12, 18, 24, 30, 36, 48] as const);
    const targetActual = addRationals(actualAnchor, actualElapsedHours * 3_600);
    const targetDisplayed = displayedTimeFromActualExact(base.model, targetActual);
    const recovered = actualTimeFromDisplayedExact(base.model, targetDisplayed);
    const manualRecovered = addRationals(actualAnchor, divideRationals(subtractRationals(targetDisplayed, actualAnchor), base.rate));
    const targetDisplayedText = formatClockTimeFromSeconds(targetDisplayed, { includeDayOffset: true, includeSeconds: true });
    const answer = timeAnswer(recovered, { absolute: true, includeDayOffset: true, includeSeconds: true });
    const verifierAnswer = timeAnswer(manualRecovered, { absolute: true, includeDayOffset: true, includeSeconds: true });
    return {
      taskId: input.taskId,
      stem: `A clock was correct at 8:00 a.m. on day 0 and ${direction === "GAIN" ? "gains" : "loses"} ${errorMinutes} minutes every 24 actual hours. When it displays ${targetDisplayedText}, what is the actual time?`,
      scenario: { actualAnchor: "8:00 a.m. (day +0)", displayedReading: targetDisplayedText, direction, errorMinutesPerDay: errorMinutes },
      answer,
      verifierAnswer,
      distractors: timeDistractors(recovered),
      explanation: {
        given: `The indicated reading is ${targetDisplayedText}; rate ${rateDisplay(base.rate)}.`,
        rule: "Actual elapsed time = displayed elapsed time ÷ displayed:actual rate.",
        working: [`Subtract the 8:00 anchor from the indicated reading.`, `Divide that displayed elapsed time by ${rateDisplay(base.rate)}.`, `Actual time = ${answer.display}.`],
        validityCheck: "Substituting the recovered actual time into the forward affine model reproduces the stated displayed reading.",
        closestTrap: "A fast clock requires dividing by a rate greater than 1; multiplying reverses the correction.",
        answer: answer.display,
      },
      canonicalTrace: [`A=A0+(D-D0)/r=${exactKey(recovered)}`],
      verifierTrace: [`manualElapsed/r=${exactKey(manualRecovered)}`],
      solveTraceExtras: { rateRatio: rateDisplay(base.rate) },
      contractEvidence: contract("ABSOLUTE_TIME", "CP006_ACTUAL_FROM_DISPLAYED_INVERSE_ORACLE", [targetDisplayedText, `${errorMinutes} minutes`, "actual time"]),
    };
  }

  if (input.taskId === "ERROR_AFTER_ACTUAL_DURATION") {
    const actualHours = input.rng.pick([6, 12, 18, 24, 36, 48, 72] as const);
    const targetActual = addRationals(actualAnchor, actualHours * 3_600);
    const signedError = faultyClockErrorAtActualExact(base.model, targetActual);
    const manualError = multiplyRationals(subtractRationals(base.rate, 1), actualHours * 3_600);
    const magnitude = absoluteRational(signedError);
    const verifierMagnitude = absoluteRational(manualError);
    const answer = rationalAnswer("DURATION", magnitude, signedErrorText(signedError));
    const verifierAnswer = rationalAnswer("DURATION", verifierMagnitude, signedErrorText(manualError));
    return {
      taskId: input.taskId,
      stem: `A clock is initially correct and ${direction === "GAIN" ? "gains" : "loses"} ${errorMinutes} minutes every 24 actual hours. What error will it have after ${actualHours} actual hours?`,
      scenario: { direction, errorMinutesPerDay: errorMinutes, actualHours },
      answer,
      verifierAnswer,
      distractors: durationDistractors(magnitude, "ACCUMULATED_ERROR"),
      explanation: {
        given: `${direction.toLowerCase()} ${errorMinutes} minutes in 24 hours; duration ${actualHours} hours.`,
        rule: "Clock error grows linearly: error = daily error × actual duration / 24 hours.",
        working: [`Accumulated error = ${answer.display}.`],
        validityCheck: "The affine reading error and direct daily proportion agree exactly.",
        closestTrap: "The sign tells whether the clock gains or loses; the magnitude alone is incomplete wording.",
        answer: answer.display,
      },
      canonicalTrace: [`D-A=${exactKey(signedError)}`],
      verifierTrace: [`(r-1)t=${exactKey(manualError)}`],
      solveTraceExtras: { rateRatio: rateDisplay(base.rate) },
      contractEvidence: contract("DURATION", "CP006_ACCUMULATED_ERROR_ORACLE", [`${errorMinutes} minutes`, `${actualHours} actual hours`, "error"]),
    };
  }

  if (input.taskId === "ACTUAL_DURATION_FROM_READING_CHANGE") {
    const actualHours = input.rng.pick([6, 8, 12, 15, 18, 24, 30] as const);
    const displayedChange = multiplyRationals(base.rate, actualHours * 3_600);
    const canonicalDuration = divideRationals(displayedChange, base.rate);
    const zeroModel = affineFaultyClockModel({ rateDisplayedPerActual: base.rate });
    const verifierDuration = actualTimeFromDisplayedExact(zeroModel, displayedChange);
    const answer = rationalAnswer("DURATION", canonicalDuration, formatDurationSeconds(canonicalDuration));
    const verifierAnswer = rationalAnswer("DURATION", verifierDuration, formatDurationSeconds(verifierDuration));
    const displayedChangeText = formatDurationSeconds(displayedChange);
    return {
      taskId: input.taskId,
      stem: `A clock ${direction === "GAIN" ? "gains" : "loses"} ${errorMinutes} minutes every 24 actual hours. If its reading advances by ${displayedChangeText}, how much actual time has elapsed?`,
      scenario: { direction, errorMinutesPerDay: errorMinutes, displayedReadingChange: displayedChangeText },
      answer,
      verifierAnswer,
      distractors: [
        {
          answer: rationalAnswer("DURATION", displayedChange, displayedChangeText),
          reasonCode: "DISPLAYED_ELAPSED_USED_AS_ACTUAL",
          reason: "This copies the clock's indicated elapsed time without correcting for its rate.",
        },
        ...durationDistractors(canonicalDuration, "READING_CHANGE").slice(0, 2),
      ],
      explanation: {
        given: `Displayed advance ${displayedChangeText}; rate ${rateDisplay(base.rate)}.`,
        rule: "Actual elapsed time = displayed elapsed time ÷ displayed:actual rate.",
        working: [`Actual elapsed time = ${answer.display}.`],
        validityCheck: "Running the clock at the stated rate for the recovered duration gives the stated reading change.",
        closestTrap: "Displayed elapsed time equals actual elapsed time only for a correct-rate clock.",
        answer: answer.display,
      },
      canonicalTrace: [`displayedChange/r=${exactKey(canonicalDuration)}`],
      verifierTrace: [`inverseAffine=${exactKey(verifierDuration)}`],
      solveTraceExtras: { rateRatio: rateDisplay(base.rate) },
      contractEvidence: contract("DURATION", "CP006_READING_CHANGE_INVERSE_ORACLE", [displayedChangeText, `${errorMinutes} minutes`, "actual time"]),
    };
  }

  if (input.taskId === "CLASSIFY_FAST_SLOW") {
    const actualHours = input.rng.pick([6, 8, 12, 24] as const);
    const actualElapsed = exactRational(actualHours * 3_600);
    const displayedElapsed = multiplyRationals(base.rate, actualElapsed);
    const canonicalClass = classifyFaultyClockRate(base.rate);
    const verifierClass = compareRationals(displayedElapsed, actualElapsed) > 0
      ? "FAST"
      : compareRationals(displayedElapsed, actualElapsed) < 0
        ? "SLOW"
        : "CORRECT";
    const answer = textAnswer("CLASSIFICATION", canonicalClass, canonicalClass.toLowerCase());
    const verifierAnswer = textAnswer("CLASSIFICATION", verifierClass, verifierClass.toLowerCase());
    const displayedElapsedText = formatDurationSeconds(displayedElapsed);
    return {
      taskId: input.taskId,
      stem: `During ${actualHours} actual hours, a clock's reading advances by ${displayedElapsedText}. Is the clock fast, slow or correct?`,
      scenario: { actualHours, displayedAdvance: displayedElapsedText },
      answer,
      verifierAnswer,
      distractors: classificationDistractors(canonicalClass),
      explanation: {
        given: `Actual elapsed time ${actualHours} hours; displayed elapsed time ${displayedElapsedText}.`,
        rule: "Compare displayed elapsed time with actual elapsed time.",
        working: [`Displayed elapsed is ${compareRationals(displayedElapsed, actualElapsed) > 0 ? "greater" : "less"} than actual elapsed.`, `The clock is ${answer.display}.`],
        validityCheck: `The derived rate ${rateDisplay(base.rate)} has the same classification.`,
        closestTrap: "Compare elapsed intervals, not the numerical clock-face readings at unrelated anchors.",
        answer: answer.display,
      },
      canonicalTrace: [`classify(r)=${canonicalClass}`],
      verifierTrace: [`compareDisplayedActual=${verifierClass}`],
      solveTraceExtras: { rateRatio: rateDisplay(base.rate) },
      contractEvidence: contract("CLASSIFICATION", "CP006_ELAPSED_INTERVAL_CLASSIFICATION_ORACLE", [`${actualHours} actual hours`, displayedElapsedText, "fast, slow or correct"]),
    };
  }

  if (input.taskId === "CONVERT_GAIN_LOSS_RATE") {
    const rate = base.rate;
    const dailyError = gainOrLossPerActualPeriodExact({ rateDisplayedPerActual: rate, actualPeriodSeconds: DAY_SECONDS });
    const hourlyError = gainOrLossPerActualPeriodExact({ rateDisplayedPerActual: rate, actualPeriodSeconds: 3_600 });
    const reconstructedDaily = multiplyRationals(hourlyError, 24);
    const magnitudeHourly = absoluteRational(hourlyError);
    const magnitudeDaily = absoluteRational(dailyError);
    const verifierDaily = absoluteRational(reconstructedDaily);
    const answer = rationalAnswer("RATE", magnitudeHourly, `${formatDurationSeconds(magnitudeHourly)} per actual hour`);
    const verifierAnswer = rationalAnswer("RATE", divideRationals(verifierDaily, 24), `${formatDurationSeconds(divideRationals(verifierDaily, 24))} per actual hour`);
    return {
      taskId: input.taskId,
      stem: `A clock ${direction === "GAIN" ? "gains" : "loses"} ${formatDurationSeconds(magnitudeDaily)} every 24 actual hours. How much does it ${direction === "GAIN" ? "gain" : "lose"} per actual hour?`,
      scenario: { direction, dailyError: formatDurationSeconds(magnitudeDaily), conversion: "PER_DAY_TO_PER_HOUR" },
      answer,
      verifierAnswer,
      distractors: [
        { answer: rationalAnswer("RATE", magnitudeDaily, `${formatDurationSeconds(magnitudeDaily)} per actual hour`), reasonCode: "DAILY_ERROR_NOT_DIVIDED", reason: "This copies the daily error as an hourly error without dividing by 24." },
        { answer: rationalAnswer("RATE", multiplyRationals(magnitudeHourly, 60), `${formatDurationSeconds(multiplyRationals(magnitudeHourly, 60))} per actual hour`), reasonCode: "MINUTES_SECONDS_SCALE_ERROR", reason: "This multiplies by 60 while converting a time error already stored in seconds." },
        { answer: rationalAnswer("RATE", divideRationals(magnitudeHourly, 24), `${formatDurationSeconds(divideRationals(magnitudeHourly, 24))} per actual hour`), reasonCode: "DIVIDED_BY_24_TWICE", reason: "This divides the daily error by 24 twice." },
      ],
      explanation: {
        given: `${formatDurationSeconds(magnitudeDaily)} ${direction.toLowerCase()} per day.`,
        rule: "For a uniform clock, hourly gain/loss = daily gain/loss ÷ 24.",
        working: [`Per-hour error = ${answer.display}.`],
        validityCheck: "Multiplying the hourly amount by 24 restores the exact daily error.",
        closestTrap: "Do not confuse conversion of the error interval with conversion of the full clock rate.",
        answer: answer.display,
      },
      canonicalTrace: [`daily/24=${exactKey(magnitudeHourly)}`],
      verifierTrace: [`hourly×24=${exactKey(reconstructedDaily)}`],
      solveTraceExtras: { rateRatio: rateDisplay(rate) },
      contractEvidence: contract("RATE", "CP006_GAIN_LOSS_PERIOD_CONVERSION_ORACLE", [formatDurationSeconds(magnitudeDaily), "24 actual hours", "per actual hour"]),
    };
  }

  if (input.taskId === "INITIAL_OFFSET_CORRECT_RATE") {
    const offsetMinutes = input.rng.pick([5, 10, 15, 20, 30] as const);
    const ahead = input.rng.pick([true, false] as const);
    const signedOffset = exactRational((ahead ? 1 : -1) * offsetMinutes * 60);
    const actualAnchorSeconds = clockSeconds(8, 0);
    const displayedAnchorSeconds = addRationals(actualAnchorSeconds, signedOffset);
    const model = affineFaultyClockModel({ actualAnchorSeconds, displayedAnchorSeconds, rateDisplayedPerActual: 1 });
    const actualElapsedHours = input.rng.pick([3, 6, 9, 12, 24] as const);
    const targetActual = addRationals(actualAnchorSeconds, actualElapsedHours * 3_600);
    const displayed = displayedTimeFromActualExact(model, targetActual);
    const manual = addRationals(targetActual, signedOffset);
    const answer = timeAnswer(displayed, { absolute: true, includeDayOffset: true, includeSeconds: true });
    const verifierAnswer = timeAnswer(manual, { absolute: true, includeDayOffset: true, includeSeconds: true });
    return {
      taskId: input.taskId,
      stem: `At 8:00 a.m. on day 0, a clock is ${offsetMinutes} minutes ${ahead ? "ahead" : "behind"} but thereafter runs at the correct rate. What will it display after ${actualElapsedHours} actual hours?`,
      scenario: { actualAnchor: "8:00 a.m. (day +0)", offsetMinutes, offsetDirection: ahead ? "AHEAD" : "BEHIND", actualElapsedHours, rate: "1:1" },
      answer,
      verifierAnswer,
      distractors: timeDistractors(displayed),
      explanation: {
        given: `Initial offset ${offsetMinutes} minutes ${ahead ? "ahead" : "behind"}; correct running rate.`,
        rule: "A correct-rate clock preserves its initial offset; add actual elapsed time equally to both readings.",
        working: [`Actual target time = ${formatClockTimeFromSeconds(targetActual, { includeDayOffset: true })}.`, `Displayed target time = ${answer.display}.`],
        validityCheck: "Displayed minus actual remains exactly equal to the initial offset.",
        closestTrap: "A fixed offset does not grow when the clock's running rate is correct.",
        answer: answer.display,
      },
      canonicalTrace: [`affineRate1=${exactKey(displayed)}`],
      verifierTrace: [`actual+offset=${exactKey(manual)}`],
      solveTraceExtras: { rateRatio: "1:1" },
      contractEvidence: contract("ABSOLUTE_TIME", "CP006_FIXED_OFFSET_ORACLE", ["8:00 a.m.", `${offsetMinutes} minutes`, `${actualElapsedHours} actual hours`]),
    };
  }

  const offsetMinutes = input.rng.pick([5, 10, 15, 20] as const);
  const ahead = input.rng.pick([true, false] as const);
  const signedOffset = exactRational((ahead ? 1 : -1) * offsetMinutes * 60);
  const displayedAnchor = addRationals(actualAnchor, signedOffset);
  const model = affineFaultyClockModel({ actualAnchorSeconds: actualAnchor, displayedAnchorSeconds: displayedAnchor, rateDisplayedPerActual: base.rate });
  const actualElapsedHours = input.rng.pick([12, 18, 24, 36, 48] as const);
  const targetActual = addRationals(actualAnchor, actualElapsedHours * 3_600);
  const displayed = displayedTimeFromActualExact(model, targetActual);
  const manual = addRationals(displayedAnchor, multiplyRationals(base.rate, actualElapsedHours * 3_600));
  const answer = timeAnswer(displayed, { absolute: true, includeDayOffset: true, includeSeconds: true });
  const verifierAnswer = timeAnswer(manual, { absolute: true, includeDayOffset: true, includeSeconds: true });
  return {
    taskId: input.taskId,
    stem: `At 8:00 a.m. on day 0, a clock is ${offsetMinutes} minutes ${ahead ? "ahead" : "behind"}. It also ${direction === "GAIN" ? "gains" : "loses"} ${errorMinutes} minutes every 24 actual hours. What will it display after ${actualElapsedHours} actual hours?`,
    scenario: { actualAnchor: "8:00 a.m. (day +0)", offsetMinutes, offsetDirection: ahead ? "AHEAD" : "BEHIND", direction, errorMinutesPerDay: errorMinutes, actualElapsedHours },
    answer,
    verifierAnswer,
    distractors: timeDistractors(displayed),
    explanation: {
      given: `Initial offset ${offsetMinutes} minutes ${ahead ? "ahead" : "behind"}; ${direction.toLowerCase()} ${errorMinutes} minutes per day.`,
      rule: "Displayed target = initial displayed reading + rate × actual elapsed time.",
      working: [`Initial displayed reading = ${formatClockTimeFromSeconds(displayedAnchor, { includeDayOffset: true })}.`, `Rate = ${rateDisplay(base.rate)}.`, `Displayed target = ${answer.display}.`],
      validityCheck: "A separate offset-plus-elapsed computation gives the identical absolute reading.",
      closestTrap: "The initial offset is added once; only subsequent elapsed time is scaled by the wrong rate.",
      answer: answer.display,
    },
    canonicalTrace: [`D=D0+rΔA=${exactKey(displayed)}`],
    verifierTrace: [`D0+r×elapsed=${exactKey(manual)}`],
    solveTraceExtras: { rateRatio: rateDisplay(base.rate) },
    contractEvidence: contract("ABSOLUTE_TIME", "CP006_OFFSET_PLUS_RATE_ORACLE", [`${offsetMinutes} minutes`, `${errorMinutes} minutes`, `${actualElapsedHours} actual hours`]),
  };
}

function solveCp007(input: ClockFamilySolverInput): SolvedClockPrototype {
  if (input.taskId === "DERIVE_RATE_FROM_OBSERVATIONS") {
    const direction = input.rng.pick(["GAIN", "LOSS"] as const);
    const errorMinutes = input.rng.pick([6, 8, 10, 12, 15, 20, 24, 30] as const);
    const rate = clockRateFromGainLoss({ direction, errorUnits: errorMinutes * 60, actualPeriodUnits: DAY_SECONDS });
    const actualFirst = exactRational(clockSeconds(8, 0).numerator, clockSeconds(8, 0).denominator);
    const displayedFirst = addRationals(actualFirst, input.rng.pick([-600, -300, 0, 300, 600] as const));
    const actualElapsedHours = input.rng.pick([12, 18, 24, 36, 48] as const);
    const actualSecond = addRationals(actualFirst, actualElapsedHours * 3_600);
    const displayedSecond = addRationals(displayedFirst, multiplyRationals(rate, actualElapsedHours * 3_600));
    const derived = deriveFaultyClockRateFromObservationsExact({ actualFirstSeconds: actualFirst, displayedFirstSeconds: displayedFirst, actualSecondSeconds: actualSecond, displayedSecondSeconds: displayedSecond });
    const manual = divideRationals(subtractRationals(displayedSecond, displayedFirst), subtractRationals(actualSecond, actualFirst));
    const answer = rationalAnswer("RATE", derived, rateDisplay(derived));
    const verifierAnswer = rationalAnswer("RATE", manual, rateDisplay(manual));
    const a1 = formatClockTimeFromSeconds(actualFirst, { includeDayOffset: true });
    const d1 = formatClockTimeFromSeconds(displayedFirst, { includeDayOffset: true, includeSeconds: true });
    const a2 = formatClockTimeFromSeconds(actualSecond, { includeDayOffset: true });
    const d2 = formatClockTimeFromSeconds(displayedSecond, { includeDayOffset: true, includeSeconds: true });
    return {
      taskId: input.taskId,
      stem: `At actual time ${a1}, a clock displays ${d1}. At actual time ${a2}, it displays ${d2}. What is its displayed-time : actual-time rate?`,
      scenario: { actualFirst: a1, displayedFirst: d1, actualSecond: a2, displayedSecond: d2 },
      answer,
      verifierAnswer,
      distractors: rateDistractors(derived),
      explanation: {
        given: "Two actual/displayed observations.",
        rule: "Rate = change in displayed time ÷ change in actual time; fixed initial offset cancels.",
        working: [`Displayed elapsed = ${formatDurationSeconds(subtractRationals(displayedSecond, displayedFirst))}.`, `Actual elapsed = ${formatDurationSeconds(subtractRationals(actualSecond, actualFirst))}.`, `Rate = ${answer.display}.`],
        validityCheck: "The derived rate reproduces the second observation from the first.",
        closestTrap: "Do not divide the absolute clock readings; subtract corresponding observations first.",
        answer: answer.display,
      },
      canonicalTrace: [`deriveObservations=${exactKey(derived)}`],
      verifierTrace: [`ΔD/ΔA=${exactKey(manual)}`],
      solveTraceExtras: { rateRatio: rateDisplay(derived) },
      contractEvidence: contract("RATE", "CP007_TWO_OBSERVATION_RATE_ORACLE", [a1, d1, a2, d2]),
    };
  }

  if (input.taskId === "DERIVE_SET_RIGHT_TIME") {
    const direction = input.rng.pick(["GAIN", "LOSS"] as const);
    const errorMinutes = input.rng.pick([8, 10, 12, 15, 20, 24, 30] as const);
    const rate = clockRateFromGainLoss({ direction, errorUnits: errorMinutes * 60, actualPeriodUnits: DAY_SECONDS });
    const setRight = exactRational(input.rng.pick([0, 3_600, 7_200, 10_800] as const));
    const model = affineFaultyClockModel({ actualAnchorSeconds: setRight, displayedAnchorSeconds: setRight, rateDisplayedPerActual: rate });
    const observationActual = addRationals(setRight, input.rng.pick([24, 36, 48, 60, 72] as const) * 3_600);
    const observationDisplayed = displayedTimeFromActualExact(model, observationActual);
    const errorAtObservation = subtractRationals(observationDisplayed, observationActual);
    const slope = subtractRationals(rate, 1);
    const derivedSetRight = subtractRationals(observationActual, divideRationals(errorAtObservation, slope));
    const verifierSetRight = actualTimeWhenErrorReachesExact({ model: affineFaultyClockModel({ actualAnchorSeconds: observationActual, displayedAnchorSeconds: observationDisplayed, rateDisplayedPerActual: rate }), targetErrorSeconds: 0 });
    const observationActualText = formatClockTimeFromSeconds(observationActual, { includeDayOffset: true });
    const observationDisplayedText = formatClockTimeFromSeconds(observationDisplayed, { includeDayOffset: true, includeSeconds: true });
    const answer = timeAnswer(derivedSetRight, { absolute: true, includeDayOffset: true, includeSeconds: true });
    const verifierAnswer = timeAnswer(verifierSetRight, { absolute: true, includeDayOffset: true, includeSeconds: true });
    return {
      taskId: input.taskId,
      stem: `A clock runs at displayed:actual rate ${rateDisplay(rate)}. At actual time ${observationActualText}, it displays ${observationDisplayedText}. At what actual time was it last set exactly right?`,
      scenario: { rate: rateDisplay(rate), observationActual: observationActualText, observationDisplayed: observationDisplayedText },
      answer,
      verifierAnswer,
      distractors: timeDistractors(derivedSetRight),
      explanation: {
        given: `Rate ${rateDisplay(rate)} and one later actual/displayed observation.`,
        rule: "At the set-right time the error is zero; work backward by error ÷ (rate−1).",
        working: [`Observation error = ${signedErrorText(errorAtObservation)}.`, `Set-right time = ${answer.display}.`],
        validityCheck: "Anchoring the affine model at the recovered time reproduces the later observation.",
        closestTrap: "Subtracting the displayed error directly from actual time ignores the rate at which that error accumulated.",
        answer: answer.display,
      },
      canonicalTrace: [`Aset=Aobs-error/(r-1)=${exactKey(derivedSetRight)}`],
      verifierTrace: [`errorTarget0=${exactKey(verifierSetRight)}`],
      solveTraceExtras: { rateRatio: rateDisplay(rate) },
      contractEvidence: contract("ABSOLUTE_TIME", "CP007_SET_RIGHT_BACKSOLVE_ORACLE", [rateDisplay(rate), observationActualText, observationDisplayedText]),
    };
  }

  if (input.taskId === "MULTIDAY_ACTUAL_FROM_DISPLAY" || input.taskId === "MULTIDAY_DISPLAY_FROM_ACTUAL") {
    const direction = input.rng.pick(["GAIN", "LOSS"] as const);
    const errorMinutes = input.rng.pick([10, 12, 15, 20, 24, 30] as const);
    const { rate, model } = modelFromDailyError(direction, errorMinutes, clockSeconds(6, 0));
    const actualDays = input.rng.pick([2, 3, 4, 5, 7] as const);
    const actualTarget = addRationals(clockSeconds(6, 0), actualDays * DAY_SECONDS + input.rng.pick([7_200, 14_400, 21_600, 28_800] as const));
    const displayedTarget = displayedTimeFromActualExact(model, actualTarget);
    const recoveredActual = actualTimeFromDisplayedExact(model, displayedTarget);
    const manualDisplayed = addRationals(clockSeconds(6, 0), multiplyRationals(rate, subtractRationals(actualTarget, clockSeconds(6, 0))));
    const displayedText = formatClockTimeFromSeconds(displayedTarget, { includeDayOffset: true, includeSeconds: true });
    const actualText = formatClockTimeFromSeconds(actualTarget, { includeDayOffset: true, includeSeconds: true });
    const asksActual = input.taskId === "MULTIDAY_ACTUAL_FROM_DISPLAY";
    const answer = asksActual
      ? timeAnswer(recoveredActual, { absolute: true, includeDayOffset: true, includeSeconds: true })
      : timeAnswer(displayedTarget, { absolute: true, includeDayOffset: true, includeSeconds: true });
    const verifierAnswer = asksActual
      ? timeAnswer(actualTarget, { absolute: true, includeDayOffset: true, includeSeconds: true })
      : timeAnswer(manualDisplayed, { absolute: true, includeDayOffset: true, includeSeconds: true });
    return {
      taskId: input.taskId,
      stem: asksActual
        ? `A clock was correct at 6:00 a.m. on day 0 and ${direction === "GAIN" ? "gains" : "loses"} ${errorMinutes} minutes per actual day. When it displays ${displayedText}, what is the actual time, including the day offset?`
        : `A clock was correct at 6:00 a.m. on day 0 and ${direction === "GAIN" ? "gains" : "loses"} ${errorMinutes} minutes per actual day. What will it display at actual time ${actualText}, including the displayed day offset?`,
      scenario: { anchor: "6:00 a.m. (day +0)", direction, errorMinutesPerDay: errorMinutes, actualTarget: actualText, displayedTarget: displayedText },
      answer,
      verifierAnswer,
      distractors: timeDistractors(asksActual ? recoveredActual : displayedTarget),
      explanation: {
        given: `Correct at 6:00 a.m. day 0; ${direction.toLowerCase()} ${errorMinutes} minutes per day.`,
        rule: asksActual ? "Preserve the absolute displayed day count, subtract the anchor and divide by the rate." : "Preserve the absolute actual day count and apply the rate to elapsed time from the anchor.",
        working: [`Actual target = ${actualText}.`, `Displayed target = ${displayedText}.`, `Required answer = ${answer.display}.`],
        validityCheck: "Forward and inverse affine mappings round-trip without reducing modulo 12 or 24 too early.",
        closestTrap: "Discarding the day offset before the calculation can shift the answer by one or more full days.",
        answer: answer.display,
      },
      canonicalTrace: [asksActual ? `inverse=${exactKey(recoveredActual)}` : `forward=${exactKey(displayedTarget)}`],
      verifierTrace: [asksActual ? `knownActual=${exactKey(actualTarget)}` : `manualForward=${exactKey(manualDisplayed)}`],
      solveTraceExtras: { rateRatio: rateDisplay(rate) },
      contractEvidence: contract("ABSOLUTE_TIME", asksActual ? "CP007_MULTIDAY_INVERSE_ORACLE" : "CP007_MULTIDAY_FORWARD_ORACLE", [asksActual ? displayedText : actualText, `${errorMinutes} minutes`, "day offset"]),
    };
  }

  if (input.taskId === "TIME_WHEN_ERROR_REACHES_TARGET") {
    const direction = input.rng.pick(["GAIN", "LOSS"] as const);
    const dailyErrorMinutes = input.rng.pick([10, 12, 15, 20, 24, 30] as const);
    const { rate, model } = modelFromDailyError(direction, dailyErrorMinutes, clockSeconds(8, 0));
    const targetErrorMinutes = dailyErrorMinutes * input.rng.pick([2, 3, 4, 5] as const);
    const targetSignedError = exactRational((direction === "GAIN" ? 1 : -1) * targetErrorMinutes * 60);
    const canonical = actualTimeWhenErrorReachesExact({ model, targetErrorSeconds: targetSignedError });
    const manualElapsed = divideRationals(targetSignedError, subtractRationals(rate, 1));
    const verifier = addRationals(clockSeconds(8, 0), manualElapsed);
    const answer = timeAnswer(canonical, { absolute: true, includeDayOffset: true, includeSeconds: true });
    const verifierAnswer = timeAnswer(verifier, { absolute: true, includeDayOffset: true, includeSeconds: true });
    return {
      taskId: input.taskId,
      stem: `A clock is correct at 8:00 a.m. on day 0 and ${direction === "GAIN" ? "gains" : "loses"} ${dailyErrorMinutes} minutes per actual day. At what actual time will it be exactly ${targetErrorMinutes} minutes ${direction === "GAIN" ? "fast" : "slow"}?`,
      scenario: { anchor: "8:00 a.m. (day +0)", direction, dailyErrorMinutes, targetErrorMinutes },
      answer,
      verifierAnswer,
      distractors: timeDistractors(canonical),
      explanation: {
        given: `Daily error ${dailyErrorMinutes} minutes; target error ${targetErrorMinutes} minutes.`,
        rule: "Actual elapsed time = target error ÷ error accumulated per unit actual time.",
        working: [`Target time = ${answer.display}.`],
        validityCheck: "The affine error at the answer is exactly the stated signed target.",
        closestTrap: "Use the signed target for a slow clock; treating loss as positive can send the solution backward in time.",
        answer: answer.display,
      },
      canonicalTrace: [`targetErrorSolve=${exactKey(canonical)}`],
      verifierTrace: [`anchor+target/(r-1)=${exactKey(verifier)}`],
      solveTraceExtras: { rateRatio: rateDisplay(rate) },
      contractEvidence: contract("ABSOLUTE_TIME", "CP007_TARGET_ERROR_TIME_ORACLE", [`${dailyErrorMinutes} minutes`, `${targetErrorMinutes} minutes`, "actual time"]),
    };
  }

  if (input.taskId === "NEXT_CORRECT_READING") {
    const direction = input.rng.pick(["GAIN", "LOSS"] as const);
    const dailyErrorMinutes = input.rng.pick([30, 45, 60, 90, 120] as const);
    const { rate, model } = modelFromDailyError(direction, dailyErrorMinutes, 0, 0);
    const canonical = nextCorrectAnalogDialActualTimeExact({ model, strictlyAfterActualSeconds: 0 });
    const errorCycle = direction === "GAIN" ? HALF_DAY_SECONDS : -HALF_DAY_SECONDS;
    const manual = divideRationals(errorCycle, subtractRationals(rate, 1));
    const answer = timeAnswer(canonical, { absolute: true, includeDayOffset: true, includeSeconds: true });
    const verifierAnswer = timeAnswer(manual, { absolute: true, includeDayOffset: true, includeSeconds: true });
    return {
      taskId: input.taskId,
      stem: `A 12-hour analog clock is set exactly right at 12:00 on day 0 and thereafter ${direction === "GAIN" ? "gains" : "loses"} ${dailyErrorMinutes} minutes per actual day. When will its dial next show the correct 12-hour reading?`,
      scenario: { anchor: "12:00 (day +0)", direction, dailyErrorMinutes, dialCycleHours: 12 },
      answer,
      verifierAnswer,
      distractors: [
        { answer: timeAnswer(divideRationals(canonical, 2), { absolute: true, includeDayOffset: true, includeSeconds: true }), reasonCode: "SIX_HOUR_ERROR_USED", reason: "This waits for only a six-hour dial error instead of a full 12-hour equivalence." },
        { answer: timeAnswer(multiplyRationals(canonical, 2), { absolute: true, includeDayOffset: true, includeSeconds: true }), reasonCode: "TWENTY_FOUR_HOUR_ERROR_USED", reason: "This waits for a 24-hour error although a 12-hour analog dial repeats after 12 hours." },
        { answer: timeAnswer(addRationals(canonical, DAY_SECONDS), { absolute: true, includeDayOffset: true, includeSeconds: true }), reasonCode: "ONE_EXTRA_DAY", reason: "This adds an extra day after the first exact dial-equivalent correction event." },
      ],
      explanation: {
        given: `Set right at 12:00; ${direction.toLowerCase()} ${dailyErrorMinutes} minutes per day.`,
        rule: "A 12-hour analog dial is next correct when accumulated error reaches +12 hours for a fast clock or −12 hours for a slow clock.",
        working: [`Next correct dial time = ${answer.display}.`],
        validityCheck: "At that actual time, displayed−actual is an exact multiple of 43,200 seconds and the time is strictly after the anchor.",
        closestTrap: "The dial repeats every 12 hours, not every 24 hours.",
        answer: answer.display,
      },
      canonicalTrace: [`nextCorrect=${exactKey(canonical)}`],
      verifierTrace: [`±43200/(r-1)=${exactKey(manual)}`],
      solveTraceExtras: { rateRatio: rateDisplay(rate) },
      contractEvidence: contract("ABSOLUTE_TIME", "CP007_NEXT_ANALOG_CORRECTION_ORACLE", [`${dailyErrorMinutes} minutes`, "12-hour analog", "next"]),
    };
  }

  if (input.taskId === "COMPARE_TWO_FAULTY_CLOCKS") {
    const leftRate = clockRateFromGainLoss({ direction: "GAIN", errorUnits: input.rng.pick([600, 900, 1_200] as const), actualPeriodUnits: DAY_SECONDS });
    const rightRate = clockRateFromGainLoss({ direction: "LOSS", errorUnits: input.rng.pick([300, 600, 900] as const), actualPeriodUnits: DAY_SECONDS });
    const left = affineFaultyClockModel({ actualAnchorSeconds: 0, displayedAnchorSeconds: 300, rateDisplayedPerActual: leftRate });
    const right = affineFaultyClockModel({ actualAnchorSeconds: 0, displayedAnchorSeconds: -300, rateDisplayedPerActual: rightRate });
    const actualHours = input.rng.pick([24, 36, 48, 72] as const);
    const actual = exactRational(actualHours * 3_600);
    const leftReading = displayedTimeFromActualExact(left, actual);
    const rightReading = displayedTimeFromActualExact(right, actual);
    const difference = absoluteRational(subtractRationals(leftReading, rightReading));
    const manualDifference = absoluteRational(addRationals(600, multiplyRationals(subtractRationals(leftRate, rightRate), actual)));
    const answer = rationalAnswer("DURATION", difference, formatDurationSeconds(difference));
    const verifierAnswer = rationalAnswer("DURATION", manualDifference, formatDurationSeconds(manualDifference));
    return {
      taskId: input.taskId,
      stem: `At actual 12:00 on day 0, clock A is 5 minutes ahead and runs at rate ${rateDisplay(leftRate)}, while clock B is 5 minutes behind and runs at rate ${rateDisplay(rightRate)}. How far apart will their readings be after ${actualHours} actual hours?`,
      scenario: { leftInitialOffsetMinutes: 5, rightInitialOffsetMinutes: -5, leftRate: rateDisplay(leftRate), rightRate: rateDisplay(rightRate), actualHours },
      answer,
      verifierAnswer,
      distractors: durationDistractors(difference, "TWO_CLOCK_DIFFERENCE"),
      explanation: {
        given: "Two clocks with different offsets and rates.",
        rule: "Compute both displayed readings at the same actual instant, then take their absolute difference.",
        working: [`Clock A reading = ${formatClockTimeFromSeconds(leftReading, { includeDayOffset: true, includeSeconds: true })}.`, `Clock B reading = ${formatClockTimeFromSeconds(rightReading, { includeDayOffset: true, includeSeconds: true })}.`, `Difference = ${answer.display}.`],
        validityCheck: "Initial separation plus relative-rate drift gives the same difference.",
        closestTrap: "Comparing only the daily gain/loss ignores the two clocks' initial ten-minute separation.",
        answer: answer.display,
      },
      canonicalTrace: [`|DA-DB|=${exactKey(difference)}`],
      verifierTrace: [`|initialGap+(rA-rB)t|=${exactKey(manualDifference)}`],
      contractEvidence: contract("DURATION", "CP007_TWO_CLOCK_READING_DIFFERENCE_ORACLE", [rateDisplay(leftRate), rateDisplay(rightRate), `${actualHours} actual hours`]),
    };
  }

  if (input.taskId === "GAINING_AND_LOSING_EQUALITY") {
    const gainingRate = clockRateFromGainLoss({ direction: "GAIN", errorUnits: input.rng.pick([600, 900, 1_200] as const), actualPeriodUnits: DAY_SECONDS });
    const losingRate = clockRateFromGainLoss({ direction: "LOSS", errorUnits: input.rng.pick([300, 600, 900] as const), actualPeriodUnits: DAY_SECONDS });
    const gaining = affineFaultyClockModel({ actualAnchorSeconds: 0, displayedAnchorSeconds: -1_800, rateDisplayedPerActual: gainingRate });
    const losing = affineFaultyClockModel({ actualAnchorSeconds: 0, displayedAnchorSeconds: 1_800, rateDisplayedPerActual: losingRate });
    const canonical = actualTimeWhenTwoFaultyClocksAgreeExact({ left: gaining, right: losing });
    const manual = divideRationals(3_600, subtractRationals(gainingRate, losingRate));
    const answer = timeAnswer(canonical, { absolute: true, includeDayOffset: true, includeSeconds: true });
    const verifierAnswer = timeAnswer(manual, { absolute: true, includeDayOffset: true, includeSeconds: true });
    return {
      taskId: input.taskId,
      stem: `At actual 12:00 on day 0, a gaining clock shows 11:30 and runs at rate ${rateDisplay(gainingRate)}, while a losing clock shows 12:30 and runs at rate ${rateDisplay(losingRate)}. At what actual time will their displayed readings become equal?`,
      scenario: { gainingInitialReading: "11:30", losingInitialReading: "12:30", gainingRate: rateDisplay(gainingRate), losingRate: rateDisplay(losingRate) },
      answer,
      verifierAnswer,
      distractors: timeDistractors(canonical),
      explanation: {
        given: "The gaining clock starts one hour behind the losing clock.",
        rule: "Meeting time = initial displayed gap ÷ relative displayed-rate difference.",
        working: [`Initial gap = 1 hour.`, `Relative rate = ${rateDisplay(subtractRationals(gainingRate, losingRate))}.`, `Equality time = ${answer.display}.`],
        validityCheck: "Both affine models give exactly the same displayed reading at the answer.",
        closestTrap: "Adding the two rates is wrong; only their difference closes the initial reading gap.",
        answer: answer.display,
      },
      canonicalTrace: [`affineIntersection=${exactKey(canonical)}`],
      verifierTrace: [`gap/(rGain-rLoss)=${exactKey(manual)}`],
      contractEvidence: contract("ABSOLUTE_TIME", "CP007_TWO_CLOCK_INTERSECTION_ORACLE", ["11:30", "12:30", rateDisplay(gainingRate), rateDisplay(losingRate)]),
    };
  }

  if (input.taskId === "PIECEWISE_RATE") {
    const firstRate = clockRateFromGainLoss({ direction: "GAIN", errorUnits: input.rng.pick([600, 900, 1_200] as const), actualPeriodUnits: DAY_SECONDS });
    const secondRate = clockRateFromGainLoss({ direction: "LOSS", errorUnits: input.rng.pick([300, 600, 900] as const), actualPeriodUnits: DAY_SECONDS });
    const firstHours = input.rng.pick([8, 12, 18, 24] as const);
    const secondHours = input.rng.pick([6, 12, 18, 24] as const);
    const displayedAnchor = clockSeconds(6, 0);
    const canonical = applyPiecewiseFaultyClockRatesExact({ displayedAnchorSeconds: displayedAnchor, segments: [
      { actualDurationSeconds: firstHours * 3_600, rateDisplayedPerActual: firstRate },
      { actualDurationSeconds: secondHours * 3_600, rateDisplayedPerActual: secondRate },
    ] });
    const verifier = addRationals(displayedAnchor, addRationals(multiplyRationals(firstRate, firstHours * 3_600), multiplyRationals(secondRate, secondHours * 3_600)));
    const answer = timeAnswer(canonical, { absolute: true, includeDayOffset: true, includeSeconds: true });
    const verifierAnswer = timeAnswer(verifier, { absolute: true, includeDayOffset: true, includeSeconds: true });
    return {
      taskId: input.taskId,
      stem: `A clock shows 6:00 a.m. on day 0. For the next ${firstHours} actual hours it runs at rate ${rateDisplay(firstRate)}; from that change point, for a further ${secondHours} actual hours it runs at rate ${rateDisplay(secondRate)}. What does it then display?`,
      scenario: { displayedAnchor: "6:00 a.m. (day +0)", firstHours, firstRate: rateDisplay(firstRate), secondHours, secondRate: rateDisplay(secondRate) },
      answer,
      verifierAnswer,
      distractors: timeDistractors(canonical),
      explanation: {
        given: "Two explicit rate segments with one change point.",
        rule: "Compute displayed elapsed time separately for each actual-duration segment and add both to the initial displayed reading.",
        working: [`First segment contribution = ${formatDurationSeconds(multiplyRationals(firstRate, firstHours * 3_600))}.`, `Second segment contribution = ${formatDurationSeconds(multiplyRationals(secondRate, secondHours * 3_600))}.`, `Final display = ${answer.display}.`],
        validityCheck: "The piecewise engine and direct sum of segment contributions agree exactly.",
        closestTrap: "A weighted average rate is unnecessary and can hide which actual duration belongs to which rate.",
        answer: answer.display,
      },
      canonicalTrace: [`piecewise=${exactKey(canonical)}`],
      verifierTrace: [`sumSegments=${exactKey(verifier)}`],
      contractEvidence: contract("ABSOLUTE_TIME", "CP007_PIECEWISE_SEGMENT_ORACLE", [`${firstHours} actual hours`, rateDisplay(firstRate), `${secondHours} actual hours`, rateDisplay(secondRate)]),
    };
  }

  const direction = input.rng.pick(["GAIN", "LOSS"] as const);
  const dailyErrorMinutes = input.rng.pick([8, 10, 12, 15, 20, 24, 30] as const);
  const rate = clockRateFromGainLoss({ direction, errorUnits: dailyErrorMinutes * 60, actualPeriodUnits: DAY_SECONDS });
  const actualAnchor = clockSeconds(7, 0);
  const model = affineFaultyClockModel({ actualAnchorSeconds: actualAnchor, displayedAnchorSeconds: actualAnchor, rateDisplayedPerActual: rate });
  const actualDays = input.rng.pick([2, 3, 4, 5] as const);
  const actualTarget = addRationals(actualAnchor, actualDays * DAY_SECONDS);
  const displayedTarget = displayedTimeFromActualExact(model, actualTarget);
  const derivedRate = deriveFaultyClockRateFromObservationsExact({ actualFirstSeconds: actualAnchor, displayedFirstSeconds: actualAnchor, actualSecondSeconds: actualTarget, displayedSecondSeconds: displayedTarget });
  const signedDailyError = gainOrLossPerActualPeriodExact({ rateDisplayedPerActual: derivedRate, actualPeriodSeconds: DAY_SECONDS });
  const magnitude = absoluteRational(signedDailyError);
  const verifierMagnitude = exactRational(dailyErrorMinutes * 60);
  const displayedText = formatClockTimeFromSeconds(displayedTarget, { includeDayOffset: true, includeSeconds: true });
  const answer = rationalAnswer("DURATION", magnitude, `${direction === "GAIN" ? "gains" : "loses"} ${formatDurationSeconds(magnitude)} per day`);
  const verifierAnswer = rationalAnswer("DURATION", verifierMagnitude, `${direction === "GAIN" ? "gains" : "loses"} ${formatDurationSeconds(verifierMagnitude)} per day`);
  return {
    taskId: input.taskId,
    stem: `A clock was correct at 7:00 a.m. on day 0. At actual 7:00 a.m. on day +${actualDays}, it displays ${displayedText}. How much does it gain or lose per actual day?`,
    scenario: { firstActual: "7:00 a.m. (day +0)", firstDisplayed: "7:00 a.m. (day +0)", secondActualDay: actualDays, secondDisplayed: displayedText },
    answer,
    verifierAnswer,
    distractors: durationDistractors(magnitude, "MISSING_DAILY_ERROR"),
    explanation: {
      given: `Actual interval ${actualDays} days and the final indicated reading ${displayedText}.`,
      rule: "Find total displayed error over the actual interval, divide by the number of actual days and retain the gain/loss direction.",
      working: [`Derived rate = ${rateDisplay(derivedRate)}.`, `Daily error = ${answer.display}.`],
      validityCheck: "Applying the recovered daily error for the stated number of days reproduces the final reading.",
      closestTrap: "The total multi-day error must be divided by the number of actual days.",
      answer: answer.display,
    },
    canonicalTrace: [`derivedRate=${exactKey(derivedRate)}`, `dailyError=${exactKey(signedDailyError)}`],
    verifierTrace: [`knownDailyMagnitude=${exactKey(verifierMagnitude)}`],
    solveTraceExtras: { rateRatio: rateDisplay(derivedRate) },
    contractEvidence: contract("DURATION", "CP007_MISSING_DAILY_ERROR_ORACLE", [`day +${actualDays}`, displayedText, "per actual day"]),
  };
}

function solveCp008(input: ClockFamilySolverInput): SolvedClockPrototype {
  const direction: "GAIN" | "LOSS" = input.taskId === "LOSS_FROM_COINCIDENCE_INTERVAL"
    ? "LOSS"
    : input.taskId === "GAIN_FROM_COINCIDENCE_INTERVAL"
      ? "GAIN"
      : input.rng.pick(["GAIN", "LOSS"] as const);
  const dailyErrorMinutes = input.rng.pick([6, 8, 10, 12, 15, 20, 24, 30] as const);
  const rate = clockRateFromGainLoss({ direction, errorUnits: dailyErrorMinutes * 60, actualPeriodUnits: DAY_SECONDS });

  if (input.taskId === "GAIN_FROM_COINCIDENCE_INTERVAL" || input.taskId === "LOSS_FROM_COINCIDENCE_INTERVAL") {
    const observedActualInterval = divideRationals(DISPLAYED_COINCIDENCE_INTERVAL, rate);
    const inferredRate = inferRateFromDisplayedEventIntervalExact({ displayedEventIntervalSeconds: DISPLAYED_COINCIDENCE_INTERVAL, observedActualIntervalSeconds: observedActualInterval });
    const signedDailyError = gainOrLossPerActualPeriodExact({ rateDisplayedPerActual: inferredRate, actualPeriodSeconds: DAY_SECONDS });
    const magnitude = absoluteRational(signedDailyError);
    const verifierMagnitude = exactRational(dailyErrorMinutes * 60);
    const observedText = formatDurationSeconds(observedActualInterval);
    const answer = rationalAnswer("DURATION", magnitude, `${direction === "GAIN" ? "gain" : "loss"} of ${formatDurationSeconds(magnitude)} per actual day`);
    const verifierAnswer = rationalAnswer("DURATION", verifierMagnitude, `${direction === "GAIN" ? "gain" : "loss"} of ${formatDurationSeconds(verifierMagnitude)} per actual day`);
    return {
      taskId: input.taskId,
      stem: `On a faulty clock, successive displayed coincidences of the hour and minute hands are observed ${observedText} apart in actual time. The clock is known to be ${direction === "GAIN" ? "fast" : "slow"}. What is its ${direction === "GAIN" ? "gain" : "loss"} per actual day?`,
      scenario: { displayedEvent: "COINCIDENCE", observedActualInterval: observedText, knownClassification: direction === "GAIN" ? "FAST" : "SLOW" },
      answer,
      verifierAnswer,
      distractors: durationDistractors(magnitude, "EVENT_INFERRED_DAILY_ERROR"),
      explanation: {
        given: `Displayed coincidence recurrence ${formatDurationSeconds(DISPLAYED_COINCIDENCE_INTERVAL)}; observed actual recurrence ${observedText}.`,
        rule: "Clock rate = displayed event interval ÷ observed actual interval; convert rate−1 to gain/loss per day.",
        working: [`Inferred rate = ${rateDisplay(inferredRate)}.`, `Daily ${direction.toLowerCase()} = ${formatDurationSeconds(magnitude)}.`],
        validityCheck: "The inferred rate maps the observed actual interval back to one exact displayed coincidence interval.",
        closestTrap: "The normal coincidence interval belongs to the faulty clock's displayed time, not directly to actual time.",
        answer: answer.display,
      },
      canonicalTrace: [`rate=displayedInterval/actualInterval=${exactKey(inferredRate)}`, `dailyError=${exactKey(signedDailyError)}`],
      verifierTrace: [`sourceDailyMagnitude=${exactKey(verifierMagnitude)}`],
      solveTraceExtras: { rateRatio: rateDisplay(inferredRate) },
      contractEvidence: contract("DURATION", direction === "GAIN" ? "CP008_GAIN_FROM_COINCIDENCE_ORACLE" : "CP008_LOSS_FROM_COINCIDENCE_ORACLE", [observedText, direction === "GAIN" ? "fast" : "slow", "per actual day"]),
    };
  }

  if (input.taskId === "COINCIDENCE_INTERVAL_FROM_RATE") {
    const actualInterval = divideRationals(DISPLAYED_COINCIDENCE_INTERVAL, rate);
    const verifierInterval = actualTimeFromDisplayedExact(affineFaultyClockModel({ rateDisplayedPerActual: rate }), DISPLAYED_COINCIDENCE_INTERVAL);
    const answer = rationalAnswer("DURATION", actualInterval, formatDurationSeconds(actualInterval));
    const verifierAnswer = rationalAnswer("DURATION", verifierInterval, formatDurationSeconds(verifierInterval));
    return {
      taskId: input.taskId,
      stem: `A faulty clock runs at displayed:actual rate ${rateDisplay(rate)}. What actual-time interval separates two successive displayed coincidences of its hour and minute hands?`,
      scenario: { rate: rateDisplay(rate), displayedEvent: "COINCIDENCE" },
      answer,
      verifierAnswer,
      distractors: [
        { answer: rationalAnswer("DURATION", DISPLAYED_COINCIDENCE_INTERVAL, formatDurationSeconds(DISPLAYED_COINCIDENCE_INTERVAL)), reasonCode: "DISPLAYED_INTERVAL_USED_AS_ACTUAL", reason: "This uses the normal displayed coincidence interval without correcting for the faulty clock rate." },
        ...durationDistractors(actualInterval, "COINCIDENCE_INTERVAL").slice(0, 2),
      ],
      explanation: {
        given: `Rate ${rateDisplay(rate)}; one displayed coincidence recurrence equals ${formatDurationSeconds(DISPLAYED_COINCIDENCE_INTERVAL)} of displayed time.`,
        rule: "Actual interval = displayed event interval ÷ displayed:actual rate.",
        working: [`Actual recurrence = ${answer.display}.`],
        validityCheck: "Running the faulty clock for the answer advances its display by exactly one normal coincidence interval.",
        closestTrap: "A fast clock reaches the next displayed event in less actual time; a slow clock takes more.",
        answer: answer.display,
      },
      canonicalTrace: [`displayedInterval/r=${exactKey(actualInterval)}`],
      verifierTrace: [`inverseAffine=${exactKey(verifierInterval)}`],
      solveTraceExtras: { rateRatio: rateDisplay(rate) },
      contractEvidence: contract("DURATION", "CP008_COINCIDENCE_INTERVAL_FROM_RATE_ORACLE", [rateDisplay(rate), "displayed coincidences", "actual-time interval"]),
    };
  }

  if (input.taskId === "CLASSIFY_FROM_EVENT_INTERVAL") {
    const observedActualInterval = divideRationals(DISPLAYED_COINCIDENCE_INTERVAL, rate);
    const inferredRate = inferRateFromDisplayedEventIntervalExact({ displayedEventIntervalSeconds: DISPLAYED_COINCIDENCE_INTERVAL, observedActualIntervalSeconds: observedActualInterval });
    const canonicalClass = classifyFaultyClockRate(inferredRate);
    const verifierClass = compareRationals(observedActualInterval, DISPLAYED_COINCIDENCE_INTERVAL) < 0
      ? "FAST"
      : compareRationals(observedActualInterval, DISPLAYED_COINCIDENCE_INTERVAL) > 0
        ? "SLOW"
        : "CORRECT";
    const observedText = formatDurationSeconds(observedActualInterval);
    const answer = textAnswer("CLASSIFICATION", canonicalClass, canonicalClass.toLowerCase());
    const verifierAnswer = textAnswer("CLASSIFICATION", verifierClass, verifierClass.toLowerCase());
    return {
      taskId: input.taskId,
      stem: `Successive displayed coincidences on a faulty clock are ${observedText} apart in actual time. Is the clock fast, slow or correct?`,
      scenario: { displayedEvent: "COINCIDENCE", observedActualInterval: observedText },
      answer,
      verifierAnswer,
      distractors: classificationDistractors(canonicalClass),
      explanation: {
        given: `Observed actual interval ${observedText}; normal displayed coincidence interval ${formatDurationSeconds(DISPLAYED_COINCIDENCE_INTERVAL)}.`,
        rule: "A shorter actual interval means a fast clock; a longer actual interval means a slow clock.",
        working: [`Inferred rate = ${rateDisplay(inferredRate)}.`, `Classification = ${answer.display}.`],
        validityCheck: "Direct interval comparison and the inferred-rate classification agree.",
        closestTrap: "The normal recurrence is measured in displayed clock time; compare it carefully with the observed actual interval.",
        answer: answer.display,
      },
      canonicalTrace: [`classify(rate)=${canonicalClass}`],
      verifierTrace: [`compareIntervals=${verifierClass}`],
      solveTraceExtras: { rateRatio: rateDisplay(inferredRate) },
      contractEvidence: contract("CLASSIFICATION", "CP008_EVENT_INTERVAL_CLASSIFICATION_ORACLE", [observedText, "fast, slow or correct"]),
    };
  }

  if (input.taskId === "RATE_FROM_RIGHT_OR_OPPOSITION_RECURRENCE") {
    const eventType = input.rng.pick(["RIGHT_ANGLE", "OPPOSITION"] as const);
    const displayedInterval = eventType === "RIGHT_ANGLE" ? DISPLAYED_RIGHT_ANGLE_INTERVAL : DISPLAYED_COINCIDENCE_INTERVAL;
    const observedActualInterval = divideRationals(displayedInterval, rate);
    const inferredRate = inferRateFromDisplayedEventIntervalExact({ displayedEventIntervalSeconds: displayedInterval, observedActualIntervalSeconds: observedActualInterval });
    const manualRate = divideRationals(displayedInterval, observedActualInterval);
    const observedText = formatDurationSeconds(observedActualInterval);
    const answer = rationalAnswer("RATE", inferredRate, rateDisplay(inferredRate));
    const verifierAnswer = rationalAnswer("RATE", manualRate, rateDisplay(manualRate));
    const eventText = eventType === "RIGHT_ANGLE" ? "successive displayed right-angle positions" : "successive displayed oppositions";
    return {
      taskId: input.taskId,
      stem: `On a faulty clock, ${eventText} are observed ${observedText} apart in actual time. What is the displayed-time : actual-time rate of the clock?`,
      scenario: { eventType, observedActualInterval: observedText },
      answer,
      verifierAnswer,
      distractors: rateDistractors(inferredRate),
      explanation: {
        given: `${eventText}; observed actual interval ${observedText}.`,
        rule: "Rate = normal displayed recurrence for that event family ÷ observed actual recurrence.",
        working: [`Normal displayed recurrence = ${formatDurationSeconds(displayedInterval)}.`, `Rate = ${answer.display}.`],
        validityCheck: "Multiplying the observed actual interval by the inferred rate returns the exact displayed recurrence.",
        closestTrap: "Right-angle events recur twice as often as coincidences or oppositions; use the correct displayed recurrence.",
        answer: answer.display,
      },
      canonicalTrace: [`inferRate=${exactKey(inferredRate)}`],
      verifierTrace: [`displayed/actual=${exactKey(manualRate)}`],
      solveTraceExtras: { rateRatio: rateDisplay(inferredRate) },
      contractEvidence: contract("RATE", "CP008_EVENT_RECURRENCE_RATE_ORACLE", [eventText, observedText, "displayed-time : actual-time rate"]),
    };
  }

  const setRightActual = exactRational(0);
  const model = affineFaultyClockModel({ actualAnchorSeconds: setRightActual, displayedAnchorSeconds: setRightActual, rateDisplayedPerActual: rate });
  const occurrence = input.rng.int(2, 6);
  const displayedEventElapsed = multiplyRationals(DISPLAYED_COINCIDENCE_INTERVAL, occurrence);
  const displayedEventAbsolute = addRationals(setRightActual, displayedEventElapsed);
  const canonicalActual = actualTimeFromDisplayedExact(model, displayedEventAbsolute);
  const manualActual = addRationals(setRightActual, divideRationals(displayedEventElapsed, rate));
  const answer = timeAnswer(canonicalActual, { absolute: true, includeDayOffset: true, includeSeconds: true });
  const verifierAnswer = timeAnswer(manualActual, { absolute: true, includeDayOffset: true, includeSeconds: true });
  return {
    taskId: input.taskId,
    stem: `A faulty clock is set right at actual 12:00 on day 0 and runs at displayed:actual rate ${rateDisplay(rate)}. At what actual time does its ${occurrence}th displayed coincidence after that instant occur?`,
    scenario: { setRightActual: "12:00 (day +0)", rate: rateDisplay(rate), occurrence, displayedEvent: "COINCIDENCE" },
    answer,
    verifierAnswer,
    distractors: [
      { answer: timeAnswer(addRationals(setRightActual, multiplyRationals(DISPLAYED_COINCIDENCE_INTERVAL, occurrence)), { absolute: true, includeDayOffset: true, includeSeconds: true }), reasonCode: "DISPLAYED_EVENT_TIME_USED_AS_ACTUAL", reason: "This adds displayed event intervals directly to actual time without dividing by the faulty rate." },
      { answer: timeAnswer(addRationals(setRightActual, divideRationals(multiplyRationals(DISPLAYED_COINCIDENCE_INTERVAL, occurrence - 1), rate)), { absolute: true, includeDayOffset: true, includeSeconds: true }), reasonCode: "PREVIOUS_EVENT_SELECTED", reason: "This selects the previous displayed coincidence rather than the stated nth event." },
      { answer: timeAnswer(addRationals(setRightActual, divideRationals(multiplyRationals(DISPLAYED_COINCIDENCE_INTERVAL, occurrence + 1), rate)), { absolute: true, includeDayOffset: true, includeSeconds: true }), reasonCode: "NEXT_EVENT_SELECTED", reason: "This selects one displayed coincidence after the stated nth event." },
    ],
    explanation: {
      given: `Set right at 12:00; rate ${rateDisplay(rate)}; occurrence ${occurrence}.`,
      rule: "The nth displayed coincidence occurs after n normal displayed recurrence intervals; divide that displayed elapsed time by the faulty rate to obtain actual elapsed time.",
      working: [`Displayed elapsed to event = ${formatDurationSeconds(displayedEventElapsed)}.`, `Actual event time = ${answer.display}.`],
      validityCheck: "Forward mapping the answer advances the faulty display to the exact nth coincidence timestamp.",
      closestTrap: "Do not use n−1 intervals here: the anchor itself is the set-right coincidence, not the first counted post-anchor coincidence.",
      answer: answer.display,
    },
    canonicalTrace: [`inverseAffine=${exactKey(canonicalActual)}`],
    verifierTrace: [`anchor+nI/r=${exactKey(manualActual)}`],
    solveTraceExtras: { rateRatio: rateDisplay(rate) },
    contractEvidence: contract("ABSOLUTE_TIME", "CP008_NTH_DISPLAYED_EVENT_ACTUAL_TIME_ORACLE", [`${occurrence}th`, rateDisplay(rate), "12:00"]),
  };
}

export function solveFaultyClockFamily(
  input: ClockFamilySolverInput,
): SolvedClockPrototype | null {
  if (CP006_TASKS.has(input.taskId)) return solveCp006(input);
  if (CP007_TASKS.has(input.taskId)) return solveCp007(input);
  if (CP008_TASKS.has(input.taskId)) return solveCp008(input);
  return null;
}
