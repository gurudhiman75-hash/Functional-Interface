import {
  absoluteRational,
  addRationals,
  affineFaultyClockModel,
  classifyFaultyClockRate,
  compareRationals,
  divideRationals,
  exactRational,
  gainOrLossPerActualPeriodExact,
  inferRateFromDisplayedEventIntervalExact,
  multiplyRationals,
  rationalsEqual,
} from "../../../../../foundation/temporal";
import type { ClockTaskId } from "../catalog";
import type { ClockFamilySolverInput, SolvedClockPrototype } from "../solver-types";
import {
  formatClockTimeFromSeconds,
  formatDurationSeconds,
  formatOrdinal,
  rationalAnswer,
  textAnswer,
  timeAnswer,
} from "../utils";

const CP008_TASKS = new Set<ClockTaskId>([
  "GAIN_FROM_COINCIDENCE_INTERVAL",
  "LOSS_FROM_COINCIDENCE_INTERVAL",
  "COINCIDENCE_INTERVAL_FROM_RATE",
  "CLASSIFY_FROM_EVENT_INTERVAL",
  "RATE_FROM_RIGHT_OR_OPPOSITION_RECURRENCE",
  "ACTUAL_TIME_OF_NTH_DISPLAYED_EVENT",
]);

const DAY_SECONDS = 86_400;
const DISPLAYED_COINCIDENCE_INTERVAL = exactRational(43_200, 11);
const DISPLAYED_RIGHT_ANGLE_INTERVAL = exactRational(21_600, 11);
const SOURCE_FAST_RATE = exactRational(45, 44); // 64 actual min -> 65 5/11 displayed min.
const SOURCE_SLOW_RATE = exactRational(120, 121); // 66 actual min -> 65 5/11 displayed min.
const SOURCE_FAST_DAILY_GAIN = gainOrLossPerActualPeriodExact({
  rateDisplayedPerActual: SOURCE_FAST_RATE,
  actualPeriodSeconds: DAY_SECONDS,
});
const SOURCE_SLOW_DAILY_LOSS = absoluteRational(gainOrLossPerActualPeriodExact({
  rateDisplayedPerActual: SOURCE_SLOW_RATE,
  actualPeriodSeconds: DAY_SECONDS,
}));

function rateDisplay(rate: { numerator: bigint; denominator: bigint }): string {
  return `${rate.numerator}:${rate.denominator}`;
}

function dailyErrorAnswer(
  direction: "GAIN" | "LOSS",
  seconds: { numerator: bigint; denominator: bigint },
) {
  return rationalAnswer(
    "DURATION",
    seconds,
    `${direction === "GAIN" ? "gain" : "loss"} of ${formatDurationSeconds(seconds)} per day`,
    "DAILY_CLOCK_ERROR",
  );
}

function eventErrorDistractors(
  direction: "GAIN" | "LOSS",
  correct: { numerator: bigint; denominator: bigint },
): SolvedClockPrototype["distractors"] {
  const oppositeDirection = direction === "GAIN" ? "LOSS" : "GAIN";
  return [
    {
      answer: dailyErrorAnswer(oppositeDirection, correct),
      reasonCode: "FAST_SLOW_DIRECTION_REVERSED",
      reason: "This reverses the conclusion: a shorter-than-normal coincidence interval means fast, while a longer interval means slow.",
    },
    {
      answer: dailyErrorAnswer(direction, multiplyRationals(correct, 2)),
      reasonCode: "COINCIDENCE_ERROR_DOUBLED",
      reason: "This doubles the accumulated clock error instead of scaling the observed recurrence proportion once.",
    },
    {
      answer: dailyErrorAnswer(direction, divideRationals(correct, 2)),
      reasonCode: "COINCIDENCE_ERROR_HALVED",
      reason: "This halves the accumulated clock error after the recurrence comparison.",
    },
  ];
}

function recurrenceDistractors(
  correctSeconds: { numerator: bigint; denominator: bigint },
): SolvedClockPrototype["distractors"] {
  return [
    {
      answer: rationalAnswer("DURATION", DISPLAYED_COINCIDENCE_INTERVAL, formatDurationSeconds(DISPLAYED_COINCIDENCE_INTERVAL)),
      reasonCode: "FAULTY_RATE_IGNORED",
      reason: "This uses the normal displayed coincidence interval as though it were also the actual elapsed time.",
    },
    {
      answer: rationalAnswer("DURATION", multiplyRationals(correctSeconds, 2), formatDurationSeconds(multiplyRationals(correctSeconds, 2))),
      reasonCode: "RECURRENCE_DOUBLED",
      reason: "This counts two coincidence intervals instead of one.",
    },
    {
      answer: rationalAnswer("DURATION", divideRationals(correctSeconds, 2), formatDurationSeconds(divideRationals(correctSeconds, 2))),
      reasonCode: "RECURRENCE_HALVED",
      reason: "This uses only half of one coincidence interval.",
    },
  ];
}

function solveGainOrLoss(input: ClockFamilySolverInput): SolvedClockPrototype {
  const direction = input.taskId === "GAIN_FROM_COINCIDENCE_INTERVAL" ? "GAIN" : "LOSS";
  const observedActualInterval = direction === "GAIN"
    ? exactRational(64 * 60)
    : exactRational(66 * 60);
  const inferredRate = inferRateFromDisplayedEventIntervalExact({
    displayedEventIntervalSeconds: DISPLAYED_COINCIDENCE_INTERVAL,
    observedActualIntervalSeconds: observedActualInterval,
  });
  const signedDaily = gainOrLossPerActualPeriodExact({
    rateDisplayedPerActual: inferredRate,
    actualPeriodSeconds: DAY_SECONDS,
  });
  const magnitude = absoluteRational(signedDaily);
  const expected = direction === "GAIN" ? SOURCE_FAST_DAILY_GAIN : SOURCE_SLOW_DAILY_LOSS;
  const answer = dailyErrorAnswer(direction, magnitude);
  const verifierAnswer = dailyErrorAnswer(direction, expected);
  const observedText = formatDurationSeconds(observedActualInterval);
  const normalText = formatDurationSeconds(DISPLAYED_COINCIDENCE_INTERVAL);
  return {
    taskId: input.taskId,
    stem: `The hour and minute hands of a faulty clock coincide every ${observedText} of actual time. The clock is known to be ${direction === "GAIN" ? "fast" : "slow"}. How much does it ${direction === "GAIN" ? "gain" : "lose"} in 24 actual hours?`,
    scenario: {
      displayedEvent: "COINCIDENCE",
      observedActualInterval: observedText,
      normalClockCoincidenceInterval: normalText,
      knownClassification: direction === "GAIN" ? "FAST" : "SLOW",
    },
    answer,
    verifierAnswer,
    distractors: eventErrorDistractors(direction, magnitude),
    explanation: {
      given: `A correct clock's hands coincide every ${normalText}; this clock's hands coincide every ${observedText} of actual time.`,
      rule: "Compare the normal displayed coincidence interval with the observed actual interval, then use direct proportion to scale the gain or loss to 24 hours.",
      working: [
        `Clock rate = ${normalText} : ${observedText} = ${rateDisplay(inferredRate)}.`,
        `Error fraction per actual minute = |rate − 1|.`,
        `${direction === "GAIN" ? "Gain" : "Loss"} in 24 hours = ${formatDurationSeconds(magnitude)}.`,
      ],
      validityCheck: `At rate ${rateDisplay(inferredRate)}, ${observedText} of actual time advances the clock display by exactly ${normalText}.`,
      closestTrap: direction === "GAIN"
        ? "Because 64 minutes is less than 65 5/11 minutes, the clock is fast; calling it slow reverses the comparison."
        : "Because 66 minutes is more than 65 5/11 minutes, the clock is slow; calling it fast reverses the comparison.",
      answer: answer.display,
    },
    canonicalTrace: [
      `rate=(43200/11)/${observedActualInterval.numerator}=${inferredRate.numerator}/${inferredRate.denominator}`,
      `dailyError=${magnitude.numerator}/${magnitude.denominator}`,
    ],
    verifierTrace: [`sourceCalibratedDailyError=${expected.numerator}/${expected.denominator}`],
    solveTraceExtras: { rateRatio: rateDisplay(inferredRate) },
    contractEvidence: {
      expectedAnswerKind: "DURATION",
      oracleName: direction === "GAIN"
        ? "CP008_SOURCE_NATURAL_64_MIN_GAIN_ORACLE"
        : "CP008_SOURCE_NATURAL_66_MIN_LOSS_ORACLE",
      visibleStemTokens: [observedText, direction === "GAIN" ? "fast" : "slow", "24 actual hours"],
    },
  };
}

function solveCoincidenceIntervalFromRate(input: ClockFamilySolverInput): SolvedClockPrototype {
  const useFast = input.rng.pick([true, false] as const);
  const rate = useFast ? SOURCE_FAST_RATE : SOURCE_SLOW_RATE;
  const dailyError = useFast ? SOURCE_FAST_DAILY_GAIN : SOURCE_SLOW_DAILY_LOSS;
  const direction = useFast ? "gains" : "loses";
  const actualInterval = divideRationals(DISPLAYED_COINCIDENCE_INTERVAL, rate);
  const expectedActual = exactRational((useFast ? 64 : 66) * 60);
  const answer = rationalAnswer("DURATION", actualInterval, formatDurationSeconds(actualInterval));
  const verifierAnswer = rationalAnswer("DURATION", expectedActual, formatDurationSeconds(expectedActual));
  const dailyErrorText = formatDurationSeconds(dailyError);
  return {
    taskId: input.taskId,
    stem: `A clock ${direction} ${dailyErrorText} in 24 actual hours. What actual-time interval separates two successive coincidences of its hour and minute hands?`,
    scenario: {
      direction: useFast ? "GAIN" : "LOSS",
      dailyError: dailyErrorText,
      displayedEvent: "COINCIDENCE",
    },
    answer,
    verifierAnswer,
    distractors: recurrenceDistractors(actualInterval),
    explanation: {
      given: `The clock ${direction} ${dailyErrorText} per day. A correct clock has a coincidence interval of ${formatDurationSeconds(DISPLAYED_COINCIDENCE_INTERVAL)} in clock time.`,
      rule: "First convert the daily gain/loss to the clock's speed ratio, then divide the displayed coincidence interval by that ratio to get actual elapsed time.",
      working: [
        `Clock-time : actual-time rate = ${rateDisplay(rate)}.`,
        `Actual coincidence interval = ${formatDurationSeconds(DISPLAYED_COINCIDENCE_INTERVAL)} ÷ ${rateDisplay(rate)} = ${answer.display}.`,
      ],
      validityCheck: `Multiplying ${answer.display} by rate ${rateDisplay(rate)} reproduces exactly one normal displayed coincidence interval.`,
      closestTrap: "Do not use 65 5/11 minutes directly as actual time when the clock itself is fast or slow.",
      answer: answer.display,
    },
    canonicalTrace: [`displayedInterval/rate=${actualInterval.numerator}/${actualInterval.denominator}`],
    verifierTrace: [`sourceNaturalExpected=${expectedActual.numerator}/${expectedActual.denominator}`],
    solveTraceExtras: { rateRatio: rateDisplay(rate) },
    contractEvidence: {
      expectedAnswerKind: "DURATION",
      oracleName: "CP008_SOURCE_NATURAL_COINCIDENCE_INTERVAL_FROM_GAIN_LOSS_ORACLE",
      visibleStemTokens: [direction, dailyErrorText, "24 actual hours"],
    },
  };
}

function solveClassification(input: ClockFamilySolverInput): SolvedClockPrototype {
  const variant = input.rng.pick(["FAST", "SLOW", "CORRECT"] as const);
  const observedActualInterval = variant === "FAST"
    ? exactRational(64 * 60)
    : variant === "SLOW"
      ? exactRational(66 * 60)
      : DISPLAYED_COINCIDENCE_INTERVAL;
  const inferredRate = inferRateFromDisplayedEventIntervalExact({
    displayedEventIntervalSeconds: DISPLAYED_COINCIDENCE_INTERVAL,
    observedActualIntervalSeconds: observedActualInterval,
  });
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
    stem: `The hour and minute hands of a clock coincide every ${observedText} of actual time. Is the clock fast, slow or correct?`,
    scenario: { observedActualInterval: observedText, displayedEvent: "COINCIDENCE" },
    answer,
    verifierAnswer,
    distractors: (["FAST", "SLOW", "CORRECT", "CANNOT_DETERMINE"] as const)
      .filter((value) => value !== canonicalClass)
      .map((value) => ({
        answer: textAnswer("CLASSIFICATION", value, value.toLowerCase().replaceAll("_", " ")),
        reasonCode: `EVENT_INTERVAL_MISCLASSIFIED_AS_${value}`,
        reason: "This does not follow the comparison with the correct-clock interval of 65 5/11 minutes.",
      })),
    explanation: {
      given: `Observed coincidence interval = ${observedText}; correct-clock interval = ${formatDurationSeconds(DISPLAYED_COINCIDENCE_INTERVAL)}.`,
      rule: "Less than 65 5/11 minutes means fast; more means slow; equal means correct.",
      working: [`${observedText} compared with ${formatDurationSeconds(DISPLAYED_COINCIDENCE_INTERVAL)} gives ${answer.display}.`],
      validityCheck: `The inferred speed ratio is ${rateDisplay(inferredRate)}, which has the same classification.`,
      closestTrap: "Compare actual elapsed intervals in the correct direction: shorter recurrence means the faulty clock is running faster.",
      answer: answer.display,
    },
    canonicalTrace: [`classifyRate=${canonicalClass}`],
    verifierTrace: [`intervalComparison=${verifierClass}`],
    solveTraceExtras: { rateRatio: rateDisplay(inferredRate) },
    contractEvidence: {
      expectedAnswerKind: "CLASSIFICATION",
      oracleName: "CP008_SOURCE_NATURAL_EVENT_INTERVAL_CLASSIFICATION_ORACLE",
      visibleStemTokens: [observedText, "fast, slow or correct"],
    },
  };
}

function solveOtherRecurrenceRate(input: ClockFamilySolverInput): SolvedClockPrototype {
  const eventType = input.rng.pick(["RIGHT_ANGLE", "OPPOSITION"] as const);
  const displayedInterval = eventType === "RIGHT_ANGLE"
    ? DISPLAYED_RIGHT_ANGLE_INTERVAL
    : DISPLAYED_COINCIDENCE_INTERVAL;
  const observedActualInterval = divideRationals(displayedInterval, SOURCE_FAST_RATE);
  const inferredRate = inferRateFromDisplayedEventIntervalExact({
    displayedEventIntervalSeconds: displayedInterval,
    observedActualIntervalSeconds: observedActualInterval,
  });
  const manualRate = divideRationals(displayedInterval, observedActualInterval);
  const observedText = formatDurationSeconds(observedActualInterval);
  const eventText = eventType === "RIGHT_ANGLE" ? "successive right-angle positions" : "successive opposite positions";
  const answer = rationalAnswer("RATE", inferredRate, rateDisplay(inferredRate));
  const verifierAnswer = rationalAnswer("RATE", manualRate, rateDisplay(manualRate));
  return {
    taskId: input.taskId,
    stem: `On a faulty clock, ${eventText} of the hands occur every ${observedText} of actual time. What is the ratio of time shown by the clock to actual time?`,
    scenario: { eventType, observedActualInterval: observedText },
    answer,
    verifierAnswer,
    distractors: [
      {
        answer: rationalAnswer("RATE", divideRationals(1, inferredRate), rateDisplay(divideRationals(1, inferredRate))),
        reasonCode: "CLOCK_ACTUAL_RATIO_REVERSED",
        reason: "This reverses clock time and actual time in the requested ratio.",
      },
      {
        answer: rationalAnswer("RATE", exactRational(1), "1:1"),
        reasonCode: "FAULTY_RATE_IGNORED",
        reason: "This treats the faulty clock as running at the correct rate.",
      },
      {
        answer: rationalAnswer("RATE", exactRational(46, 44), "46:44"),
        reasonCode: "ONE_RATE_PART_ADDED",
        reason: "This adds one part to the clock-time side after the ratio has already been determined.",
      },
    ],
    explanation: {
      given: `${eventText} recur every ${observedText} of actual time.`,
      rule: "Clock-time : actual-time rate = normal clock-time recurrence ÷ observed actual recurrence.",
      working: [
        `Normal clock-time recurrence for this event = ${formatDurationSeconds(displayedInterval)}.`,
        `Rate = ${formatDurationSeconds(displayedInterval)} : ${observedText} = ${answer.display}.`,
      ],
      validityCheck: `The recovered rate maps ${observedText} of actual time to exactly ${formatDurationSeconds(displayedInterval)} on the clock.`,
      closestTrap: "Use the recurrence for the stated event type; right-angle positions recur twice as often as coincidences or oppositions.",
      answer: answer.display,
    },
    canonicalTrace: [`inferRate=${inferredRate.numerator}/${inferredRate.denominator}`],
    verifierTrace: [`displayed/actual=${manualRate.numerator}/${manualRate.denominator}`],
    solveTraceExtras: { rateRatio: rateDisplay(inferredRate) },
    contractEvidence: {
      expectedAnswerKind: "RATE",
      oracleName: "CP008_CALIBRATED_OTHER_EVENT_RECURRENCE_RATE_ORACLE",
      visibleStemTokens: [eventText, observedText, "ratio of time shown"],
    },
  };
}

function solveNthDisplayedCoincidence(input: ClockFamilySolverInput): SolvedClockPrototype {
  const occurrence = input.rng.int(2, 6);
  const displayedElapsed = multiplyRationals(DISPLAYED_COINCIDENCE_INTERVAL, occurrence);
  const actualElapsed = divideRationals(displayedElapsed, SOURCE_FAST_RATE);
  const expectedActual = exactRational(occurrence * 64 * 60);
  if (!rationalsEqual(actualElapsed, expectedActual)) {
    throw new Error("Source-natural 64-minute coincidence calibration drifted.");
  }
  const answer = timeAnswer(actualElapsed, { absolute: true, includeDayOffset: true, includeSeconds: false });
  const verifierAnswer = timeAnswer(expectedActual, { absolute: true, includeDayOffset: true, includeSeconds: false });
  const dailyGainText = formatDurationSeconds(SOURCE_FAST_DAILY_GAIN);
  const occurrenceText = formatOrdinal(occurrence);
  return {
    taskId: input.taskId,
    stem: `A clock is set right at 12 noon and gains ${dailyGainText} in 24 actual hours. At what actual time will its hands coincide for the ${occurrenceText} time after 12 noon?`,
    scenario: {
      setRightActual: "12 noon",
      dailyGain: dailyGainText,
      occurrence,
      displayedEvent: "COINCIDENCE",
    },
    answer,
    verifierAnswer,
    distractors: [
      {
        answer: timeAnswer(multiplyRationals(DISPLAYED_COINCIDENCE_INTERVAL, occurrence), { absolute: true, includeDayOffset: true, includeSeconds: true }),
        reasonCode: "DISPLAYED_RECURRENCE_USED_AS_ACTUAL",
        reason: "This counts the normal clock-time recurrence directly as actual elapsed time and ignores that the clock is fast.",
      },
      {
        answer: timeAnswer(exactRational((occurrence - 1) * 64 * 60), { absolute: true, includeDayOffset: true }),
        reasonCode: "PREVIOUS_COINCIDENCE_SELECTED",
        reason: "This gives the preceding post-noon coincidence rather than the stated occurrence.",
      },
      {
        answer: timeAnswer(exactRational((occurrence + 1) * 64 * 60), { absolute: true, includeDayOffset: true }),
        reasonCode: "NEXT_COINCIDENCE_SELECTED",
        reason: "This gives the next post-noon coincidence rather than the stated occurrence.",
      },
    ],
    explanation: {
      given: `The clock gains ${dailyGainText} per day and therefore runs at ${rateDisplay(SOURCE_FAST_RATE)} of correct speed.`,
      rule: "On this calibrated fast clock, one displayed coincidence interval of 65 5/11 clock-minutes takes exactly 64 actual minutes.",
      working: [
        `Actual time to one post-noon coincidence = 64 minutes.`,
        `Actual elapsed time to the ${occurrenceText} post-noon coincidence = ${occurrence} × 64 = ${occurrence * 64} minutes.`,
        `Actual clock time = ${answer.display}.`,
      ],
      validityCheck: `At ${answer.display}, the faulty display has advanced by exactly ${formatDurationSeconds(displayedElapsed)}, which is ${occurrence} coincidence intervals.`,
      closestTrap: "Do not count the 12-noon starting coincidence as the first post-noon occurrence; the question says after 12 noon.",
      answer: answer.display,
    },
    canonicalTrace: [`n×displayedInterval/rate=${actualElapsed.numerator}/${actualElapsed.denominator}`],
    verifierTrace: [`n×64min=${expectedActual.numerator}/${expectedActual.denominator}`],
    solveTraceExtras: { rateRatio: rateDisplay(SOURCE_FAST_RATE) },
    contractEvidence: {
      expectedAnswerKind: "ABSOLUTE_TIME",
      oracleName: "CP008_SOURCE_NATURAL_NTH_COINCIDENCE_ACTUAL_TIME_ORACLE",
      visibleStemTokens: [dailyGainText, occurrenceText, "12 noon"],
    },
  };
}

export function solveExamNaturalFaultyEventFamily(
  input: ClockFamilySolverInput,
): SolvedClockPrototype | null {
  if (!CP008_TASKS.has(input.taskId)) return null;
  if (input.taskId === "GAIN_FROM_COINCIDENCE_INTERVAL" || input.taskId === "LOSS_FROM_COINCIDENCE_INTERVAL") {
    return solveGainOrLoss(input);
  }
  if (input.taskId === "COINCIDENCE_INTERVAL_FROM_RATE") {
    return solveCoincidenceIntervalFromRate(input);
  }
  if (input.taskId === "CLASSIFY_FROM_EVENT_INTERVAL") {
    return solveClassification(input);
  }
  if (input.taskId === "RATE_FROM_RIGHT_OR_OPPOSITION_RECURRENCE") {
    return solveOtherRecurrenceRate(input);
  }
  return solveNthDisplayedCoincidence(input);
}
