import {
  addRationals,
  compareRationals,
  divideRationals,
  durationForStrikesExact,
  exactRational,
  gapFromStrikeDurationExact,
  multiplyRationals,
  strikeCountWithinDurationExact,
  strikeTimelineExact,
  totalHourlyAndHalfHourChimes,
  totalHourlyStrikesInclusive,
  totalStrikesInTwelveHours,
  totalStrikesInTwentyFourHours,
  transferStrikeDurationExact,
  type ExactRational,
} from "../../../../../foundation/temporal";
import type { ClockTaskId } from "../catalog";
import type {
  ClockContractEvidence,
  ClockFamilySolverInput,
  SolvedClockPrototype,
} from "../solver-types";
import type { ClockAnswerKind } from "../types";
import {
  formatDurationSeconds,
  rationalAnswer,
  textAnswer,
} from "../utils";

const CP009_TASKS = new Set<ClockTaskId>([
  "DURATION_FOR_N_STRIKES",
  "GAP_FROM_N_STRIKES",
  "TRANSFER_STRIKE_COUNT",
  "STRIKES_IN_DURATION",
  "FIRST_LAST_INCLUSION",
  "COMPARE_STRIKING_SPEEDS",
]);

const CP010_TASKS = new Set<ClockTaskId>([
  "TOTAL_STRIKES_12_HOURS",
  "TOTAL_STRIKES_24_HOURS",
  "TOTAL_STRIKES_INCLUSIVE_RANGE",
  "INFER_RANGE_OR_HOUR_FROM_TOTAL",
  "CUSTOM_HOUR_STRIKE_SCHEDULE",
  "HOURLY_AND_HALF_HOUR_CHIME",
]);

function exactKey(value: ExactRational): string {
  return `${value.numerator}/${value.denominator}`;
}

function durationAnswer(value: ExactRational) {
  return rationalAnswer("DURATION", value, formatDurationSeconds(value), "DURATION_SECONDS");
}

function countAnswer(value: number) {
  return rationalAnswer("COUNT", value, value.toString(), "COUNT");
}

function contract(
  expectedAnswerKind: ClockAnswerKind,
  oracleName: string,
  visibleStemTokens: readonly string[],
): ClockContractEvidence {
  return { expectedAnswerKind, oracleName, visibleStemTokens };
}

function durationDistractors(correct: ExactRational): SolvedClockPrototype["distractors"] {
  return [
    {
      answer: durationAnswer(multiplyRationals(correct, 2)),
      reasonCode: "STRIKE_DURATION_DOUBLED",
      reason: "This doubles the exact first-to-last duration or the recovered gap.",
    },
    {
      answer: durationAnswer(divideRationals(correct, 2)),
      reasonCode: "STRIKE_DURATION_HALVED",
      reason: "This uses only half of the exact first-to-last duration or recovered gap.",
    },
    {
      answer: durationAnswer(addRationals(correct, 1)),
      reasonCode: "ONE_SECOND_ADDED",
      reason: "This introduces one extra second not supported by the equally spaced strike timeline.",
    },
  ];
}

function countDistractors(correct: number): SolvedClockPrototype["distractors"] {
  return [
    {
      answer: countAnswer(Math.max(0, correct - 1)),
      reasonCode: "BOUNDARY_STRIKE_OMITTED",
      reason: "This omits one strike at a boundary that the stated observation includes.",
    },
    {
      answer: countAnswer(correct + 1),
      reasonCode: "BOUNDARY_STRIKE_ADDED",
      reason: "This includes one boundary strike that the stated observation excludes.",
    },
    {
      answer: countAnswer(correct + 2),
      reasonCode: "INTERVALS_CONFUSED_WITH_STRIKES",
      reason: "This confuses the number of equal gaps with the number of strikes heard.",
    },
  ];
}

function ordinal(value: number): string {
  const lastTwo = value % 100;
  if (lastTwo >= 11 && lastTwo <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

function solveCp009(input: ClockFamilySolverInput): SolvedClockPrototype {
  const strikes = input.rng.pick([5, 6, 7, 8, 9, 10, 12] as const);
  const gap = exactRational(input.rng.pick([1, 2, 3, 4, 5, 6] as const));
  const duration = durationForStrikesExact({ strikes, gapSeconds: gap });

  if (input.taskId === "DURATION_FOR_N_STRIKES") {
    const timeline = strikeTimelineExact({ strikes, gapSeconds: gap });
    const canonical = duration;
    const verifier = timeline[timeline.length - 1]!.timestampSeconds;
    const answer = durationAnswer(canonical);
    const verifierAnswer = durationAnswer(verifier);
    return {
      taskId: input.taskId,
      stem: `A clock gives ${strikes} equally spaced strikes, with ${formatDurationSeconds(gap)} between consecutive strikes. How long does it take from the first strike to the last?`,
      scenario: { strikes, gap: formatDurationSeconds(gap), intervalCount: strikes - 1 },
      answer,
      verifierAnswer,
      distractors: [
        { answer: durationAnswer(multiplyRationals(gap, strikes)), reasonCode: "N_STRIKES_TREATED_AS_N_GAPS", reason: "This uses one time gap for every strike instead of n−1 gaps." },
        { answer: durationAnswer(multiplyRationals(gap, strikes - 2)), reasonCode: "TWO_GAPS_REMOVED", reason: "This removes two gaps instead of only the absent gap before the first strike." },
        { answer: durationAnswer(gap), reasonCode: "ONE_GAP_ONLY", reason: "This gives only the time between two consecutive strikes." },
      ],
      explanation: {
        given: `${strikes} strikes with a gap of ${formatDurationSeconds(gap)}.`,
        rule: "From the first strike to the nth strike there are n−1 equal gaps.",
        working: [`Number of gaps = ${strikes}−1 = ${strikes - 1}.`, `Duration = ${strikes - 1} × ${formatDurationSeconds(gap)} = ${answer.display}.`],
        validityCheck: "An independently enumerated strike timeline ends at the same timestamp.",
        closestTrap: "The first strike starts the observation; it has no preceding gap.",
        answer: answer.display,
      },
      canonicalTrace: [`(n-1)g=${exactKey(canonical)}`],
      verifierTrace: [`lastTimelineTimestamp=${exactKey(verifier)}`],
      solveTraceExtras: { strikeIntervalCount: strikes - 1 },
      contractEvidence: contract("DURATION", "CP009_N_MINUS_ONE_DURATION_ORACLE", [`${strikes} equally spaced strikes`, formatDurationSeconds(gap), "first strike to the last"]),
    };
  }

  if (input.taskId === "GAP_FROM_N_STRIKES") {
    const canonical = gapFromStrikeDurationExact({ strikes, firstToLastDurationSeconds: duration });
    const verifier = divideRationals(duration, strikes - 1);
    const answer = durationAnswer(canonical);
    const verifierAnswer = durationAnswer(verifier);
    return {
      taskId: input.taskId,
      stem: `A clock takes ${formatDurationSeconds(duration)} from its first strike to its ${ordinal(strikes)} strike. What is the interval between consecutive strikes?`,
      scenario: { strikes, firstToLastDuration: formatDurationSeconds(duration) },
      answer,
      verifierAnswer,
      distractors: [
        { answer: durationAnswer(divideRationals(duration, strikes)), reasonCode: "DIVIDED_BY_STRIKES", reason: "This divides by n instead of the n−1 consecutive-strike intervals." },
        { answer: durationAnswer(divideRationals(duration, strikes - 2)), reasonCode: "DIVIDED_BY_N_MINUS_TWO", reason: "This uses too few intervals between the first and last strike." },
        { answer: durationAnswer(duration), reasonCode: "TOTAL_DURATION_USED_AS_GAP", reason: "This treats the complete first-to-last duration as one consecutive-strike interval." },
      ],
      explanation: {
        given: `${strikes} strikes occupy ${formatDurationSeconds(duration)} from first to last.`,
        rule: "Consecutive gap = first-to-last duration ÷ (strikes−1).",
        working: [`Gap count = ${strikes - 1}.`, `Gap = ${formatDurationSeconds(duration)} ÷ ${strikes - 1} = ${answer.display}.`],
        validityCheck: "Multiplying the recovered gap by n−1 reconstructs the stated duration.",
        closestTrap: "Divide by the number of gaps, not by the number of strikes.",
        answer: answer.display,
      },
      canonicalTrace: [`gapAuthority=${exactKey(canonical)}`],
      verifierTrace: [`duration/(n-1)=${exactKey(verifier)}`],
      solveTraceExtras: { strikeIntervalCount: strikes - 1 },
      contractEvidence: contract("DURATION", "CP009_GAP_INVERSE_ORACLE", [formatDurationSeconds(duration), ordinal(strikes), "consecutive strikes"]),
    };
  }

  if (input.taskId === "TRANSFER_STRIKE_COUNT") {
    const targetStrikes = input.rng.pick([3, 4, 11, 13, 15] as const);
    const canonical = transferStrikeDurationExact({ sourceStrikes: strikes, sourceDurationSeconds: duration, targetStrikes });
    const recoveredGap = divideRationals(duration, strikes - 1);
    const verifier = multiplyRationals(recoveredGap, targetStrikes - 1);
    const answer = durationAnswer(canonical);
    const verifierAnswer = durationAnswer(verifier);
    return {
      taskId: input.taskId,
      stem: `A clock takes ${formatDurationSeconds(duration)} to strike ${strikes} times. At the same striking speed, how long will it take to strike ${targetStrikes} times?`,
      scenario: { sourceStrikes: strikes, sourceDuration: formatDurationSeconds(duration), targetStrikes },
      answer,
      verifierAnswer,
      distractors: [
        { answer: durationAnswer(multiplyRationals(duration, exactRational(targetStrikes, strikes))), reasonCode: "DIRECT_STRIKE_COUNT_PROPORTION", reason: "This scales by strike counts instead of by the corresponding n−1 interval counts." },
        { answer: durationAnswer(multiplyRationals(recoveredGap, targetStrikes)), reasonCode: "TARGET_STRIKES_TREATED_AS_GAPS", reason: "This uses targetStrikes gaps rather than targetStrikes−1 gaps." },
        { answer: durationAnswer(multiplyRationals(recoveredGap, targetStrikes - 2)), reasonCode: "TARGET_N_MINUS_TWO_GAPS", reason: "This removes two gaps from the target timeline." },
      ],
      explanation: {
        given: `${strikes} source strikes in ${formatDurationSeconds(duration)}; target ${targetStrikes} strikes.`,
        rule: "Recover one gap using sourceStrikes−1, then multiply it by targetStrikes−1.",
        working: [`Source gap = ${formatDurationSeconds(recoveredGap)}.`, `Target duration = ${targetStrikes - 1} × ${formatDurationSeconds(recoveredGap)} = ${answer.display}.`],
        validityCheck: "Direct transfer authority and independent two-step reconstruction agree exactly.",
        closestTrap: "Strike counts are not directly proportional to first-to-last durations; interval counts are.",
        answer: answer.display,
      },
      canonicalTrace: [`transfer=${exactKey(canonical)}`],
      verifierTrace: [`sourceGap×targetIntervals=${exactKey(verifier)}`],
      solveTraceExtras: { strikeIntervalCount: targetStrikes - 1 },
      contractEvidence: contract("DURATION", "CP009_TRANSFER_INTERVAL_COUNT_ORACLE", [`${strikes} times`, `${targetStrikes} times`, formatDurationSeconds(duration)]),
    };
  }

  if (input.taskId === "STRIKES_IN_DURATION" || input.taskId === "FIRST_LAST_INCLUSION") {
    const intervalCount = input.rng.pick([4, 5, 6, 8, 10] as const);
    const observedDuration = multiplyRationals(gap, intervalCount);
    const includeStart = input.taskId === "STRIKES_IN_DURATION" ? true : input.rng.pick([true, false] as const);
    const includeEnd = input.taskId === "STRIKES_IN_DURATION" ? true : input.rng.pick([true, false] as const);
    const canonical = strikeCountWithinDurationExact({ durationSeconds: observedDuration, gapSeconds: gap, includeStrikeAtStart: includeStart, includeStrikeAtEnd: includeEnd });
    const fullTimeline = strikeTimelineExact({ strikes: intervalCount + 1, gapSeconds: gap });
    const verifier = fullTimeline.filter((event) => {
      const atStart = compareRationals(event.timestampSeconds, 0) === 0;
      const atEnd = compareRationals(event.timestampSeconds, observedDuration) === 0;
      return (!atStart || includeStart) && (!atEnd || includeEnd);
    }).length;
    const answer = countAnswer(canonical);
    const verifierAnswer = countAnswer(verifier);
    const startText = includeStart ? "including the strike at the start" : "excluding the strike at the start";
    const endText = includeEnd ? "including a strike exactly at the end" : "excluding a strike exactly at the end";
    return {
      taskId: input.taskId,
      stem: `A clock strikes every ${formatDurationSeconds(gap)}. During an observation of ${formatDurationSeconds(observedDuration)}, count the strikes while ${startText} and ${endText}. How many strikes are heard?`,
      scenario: { gap: formatDurationSeconds(gap), duration: formatDurationSeconds(observedDuration), includeStart, includeEnd },
      answer,
      verifierAnswer,
      distractors: countDistractors(canonical),
      explanation: {
        given: `Gap ${formatDurationSeconds(gap)}; duration ${formatDurationSeconds(observedDuration)}; start ${includeStart ? "included" : "excluded"}; end ${includeEnd ? "included" : "excluded"}.`,
        rule: "Enumerate strike timestamps and apply the two endpoint flags exactly.",
        working: [`Underlying equal gaps = ${intervalCount}.`, `Accepted strikes = ${answer.display}.`],
        validityCheck: "The count formula and explicit timeline filtering give the same result.",
        closestTrap: "Intervals and heard strikes differ by boundary inclusion; do not add one automatically.",
        answer: answer.display,
      },
      canonicalTrace: [`countAuthority=${canonical}`],
      verifierTrace: [`filteredTimeline=${verifier}`],
      solveTraceExtras: { strikeIntervalCount: intervalCount, endpointPolicy: `${includeStart ? "[" : "("}start,end${includeEnd ? "]" : ")"}` },
      contractEvidence: contract("COUNT", "CP009_STRIKE_ENDPOINT_ORACLE", [formatDurationSeconds(gap), formatDurationSeconds(observedDuration), startText, endText]),
    };
  }

  const firstGap = exactRational(input.rng.pick([2, 3, 4, 5] as const));
  let secondGap = exactRational(input.rng.pick([1, 2, 3, 4, 5, 6] as const));
  if (compareRationals(firstGap, secondGap) === 0) secondGap = addRationals(secondGap, 1);
  const canonicalClass = compareRationals(firstGap, secondGap) < 0 ? "CLOCK_A" : "CLOCK_B";
  const firstDuration = durationForStrikesExact({ strikes: 8, gapSeconds: firstGap });
  const secondDuration = durationForStrikesExact({ strikes: 8, gapSeconds: secondGap });
  const derivedFirstGap = gapFromStrikeDurationExact({ strikes: 8, firstToLastDurationSeconds: firstDuration });
  const derivedSecondGap = gapFromStrikeDurationExact({ strikes: 8, firstToLastDurationSeconds: secondDuration });
  const verifierClass = compareRationals(derivedFirstGap, derivedSecondGap) < 0 ? "CLOCK_A" : "CLOCK_B";
  const answer = textAnswer("CLASSIFICATION", canonicalClass, canonicalClass === "CLOCK_A" ? "Clock A" : "Clock B");
  const verifierAnswer = textAnswer("CLASSIFICATION", verifierClass, verifierClass === "CLOCK_A" ? "Clock A" : "Clock B");
  return {
    taskId: input.taskId,
    stem: `Clock A takes ${formatDurationSeconds(firstDuration)} from its first to its 8th strike. Clock B takes ${formatDurationSeconds(secondDuration)} from its first to its 8th strike. Which clock strikes faster?`,
    scenario: { strikes: 8, clockADuration: formatDurationSeconds(firstDuration), clockBDuration: formatDurationSeconds(secondDuration) },
    answer,
    verifierAnswer,
    distractors: [
      { answer: textAnswer("CLASSIFICATION", canonicalClass === "CLOCK_A" ? "CLOCK_B" : "CLOCK_A", canonicalClass === "CLOCK_A" ? "Clock B" : "Clock A"), reasonCode: "LONGER_GAP_CALLED_FASTER", reason: "This treats the longer consecutive-strike gap as the faster striking speed." },
      { answer: textAnswer("CLASSIFICATION", "SAME_SPEED", "Both strike at the same speed"), reasonCode: "DURATIONS_ASSUMED_EQUAL", reason: "The exact first-to-last durations and recovered gaps are not equal." },
      { answer: textAnswer("CLASSIFICATION", "CANNOT_DETERMINE", "Cannot be determined"), reasonCode: "COMMON_STRIKE_COUNT_IGNORED", reason: "Both observations contain the same number of strikes, so their interval durations are directly comparable." },
    ],
    explanation: {
      given: "Both clocks are observed from the first to the 8th strike.",
      rule: "With equal strike counts, the clock with the smaller recovered consecutive-strike gap is faster.",
      working: [`Clock A gap = ${formatDurationSeconds(derivedFirstGap)}.`, `Clock B gap = ${formatDurationSeconds(derivedSecondGap)}.`, `${answer.display} is faster.`],
      validityCheck: "Direct gap comparison and independently recovered gaps give the same classification.",
      closestTrap: "A larger first-to-last duration means a slower, not faster, striking rate.",
      answer: answer.display,
    },
    canonicalTrace: [`compareSourceGaps=${canonicalClass}`],
    verifierTrace: [`compareRecoveredGaps=${verifierClass}`],
    contractEvidence: contract("CLASSIFICATION", "CP009_COMPARE_STRIKE_SPEED_ORACLE", [formatDurationSeconds(firstDuration), formatDurationSeconds(secondDuration), "8th strike"]),
  };
}

function hourStrikeSum(startHour: number, endHour: number, schedule: (hour: number) => number): number {
  let total = 0;
  for (let hour = startHour; hour <= endHour; hour += 1) total += schedule(hour);
  return total;
}

function standardHourLabel(hour: number): number {
  const normalized = ((hour % 12) + 12) % 12;
  return normalized === 0 ? 12 : normalized;
}

function solveCp010(input: ClockFamilySolverInput): SolvedClockPrototype {
  if (input.taskId === "TOTAL_STRIKES_12_HOURS") {
    const canonical = totalStrikesInTwelveHours();
    const verifier = Array.from({ length: 12 }, (_, index) => index + 1).reduce((sum, hour) => sum + hour, 0);
    const answer = countAnswer(canonical);
    const verifierAnswer = countAnswer(verifier);
    return {
      taskId: input.taskId,
      stem: "A standard striking clock strikes the hour number at every hour. How many strikes does it give in one complete 12-hour cycle?",
      scenario: { cycleHours: 12, schedule: "STANDARD_HOUR_NUMBER" },
      answer,
      verifierAnswer,
      distractors: [
        { answer: countAnswer(72), reasonCode: "TWELVE_SIX_TIMES", reason: "This assumes an average of six strikes per hour instead of summing 1 through 12." },
        { answer: countAnswer(66), reasonCode: "TWELVE_OCLOCK_OMITTED", reason: "This sums only 1 through 11 and omits the 12 o'clock strikes." },
        { answer: countAnswer(156), reasonCode: "TWENTY_FOUR_HOUR_TOTAL_USED", reason: "This gives the total for two complete 12-hour cycles." },
      ],
      explanation: {
        given: "Standard hourly schedule over one 12-hour cycle.",
        rule: "Add 1+2+⋯+12.",
        working: [`Total = 12×13÷2 = ${answer.display}.`],
        validityCheck: "The schedule engine and the arithmetic-series sum agree.",
        closestTrap: "Twelve o'clock contributes 12 strikes and must not be treated as zero.",
        answer: answer.display,
      },
      canonicalTrace: [`standard12=${canonical}`],
      verifierTrace: [`sum1to12=${verifier}`],
      contractEvidence: contract("COUNT", "CP010_STANDARD_TWELVE_HOUR_SUM_ORACLE", ["12-hour cycle", "hour number"]),
    };
  }

  if (input.taskId === "TOTAL_STRIKES_24_HOURS") {
    const canonical = totalStrikesInTwentyFourHours();
    const verifier = 2 * Array.from({ length: 12 }, (_, index) => index + 1).reduce((sum, hour) => sum + hour, 0);
    const answer = countAnswer(canonical);
    const verifierAnswer = countAnswer(verifier);
    return {
      taskId: input.taskId,
      stem: "A standard striking clock strikes the hour number at every hour. How many strikes does it give in 24 hours?",
      scenario: { cycleHours: 24, schedule: "STANDARD_HOUR_NUMBER" },
      answer,
      verifierAnswer,
      distractors: [
        { answer: countAnswer(78), reasonCode: "ONLY_ONE_TWELVE_HOUR_CYCLE", reason: "This counts only one of the two identical 12-hour cycles." },
        { answer: countAnswer(144), reasonCode: "SIX_STRIKES_PER_HOUR_ASSUMED", reason: "This assumes a fixed six strikes at every hour." },
        { answer: countAnswer(168), reasonCode: "TWELVE_ADDED_ONCE_MORE", reason: "This adds an extra 12 o'clock block beyond the two complete cycles." },
      ],
      explanation: {
        given: "A standard schedule over 24 hours.",
        rule: "The 12-hour strike pattern repeats exactly twice.",
        working: [`One 12-hour cycle = 78 strikes.`, `Twenty-four hours = 2×78 = ${answer.display}.`],
        validityCheck: "Direct hour-by-hour summation from hour 1 through hour 24 gives the same total.",
        closestTrap: "Do not count only the first 12-hour cycle.",
        answer: answer.display,
      },
      canonicalTrace: [`standard24=${canonical}`],
      verifierTrace: [`2×sum1to12=${verifier}`],
      contractEvidence: contract("COUNT", "CP010_STANDARD_TWENTY_FOUR_HOUR_SUM_ORACLE", ["24 hours", "hour number"]),
    };
  }

  if (input.taskId === "TOTAL_STRIKES_INCLUSIVE_RANGE") {
    const startHour = input.rng.int(1, 8);
    const endHour = startHour + input.rng.int(2, 6);
    const canonical = totalHourlyStrikesInclusive({ startHour, endHour });
    const verifier = hourStrikeSum(startHour, endHour, standardHourLabel);
    const answer = countAnswer(canonical);
    const verifierAnswer = countAnswer(verifier);
    return {
      taskId: input.taskId,
      stem: `How many hourly strikes does a standard striking clock give from ${startHour} o'clock through ${endHour} o'clock, including both endpoint hours?`,
      scenario: { startHour, endHour, includeStart: true, includeEnd: true },
      answer,
      verifierAnswer,
      distractors: [
        { answer: countAnswer(canonical - standardHourLabel(startHour)), reasonCode: "START_HOUR_EXCLUDED", reason: "This omits the starting hour although both endpoints are included." },
        { answer: countAnswer(canonical - standardHourLabel(endHour)), reasonCode: "END_HOUR_EXCLUDED", reason: "This omits the ending hour although both endpoints are included." },
        { answer: countAnswer(canonical - standardHourLabel(startHour) - standardHourLabel(endHour)), reasonCode: "BOTH_ENDPOINT_HOURS_EXCLUDED", reason: "This treats the range as open at both ends." },
      ],
      explanation: {
        given: `Inclusive hourly range ${startHour} through ${endHour}.`,
        rule: "Add the strike count at every stated hour, including both endpoints.",
        working: [`Total = ${Array.from({ length: endHour - startHour + 1 }, (_, index) => standardHourLabel(startHour + index)).join(" + ")} = ${answer.display}.`],
        validityCheck: "The schedule engine and direct inclusive summation agree.",
        closestTrap: "The phrase 'through' with both endpoints included requires counting both boundary hours.",
        answer: answer.display,
      },
      canonicalTrace: [`inclusiveSchedule=${canonical}`],
      verifierTrace: [`manualSum=${verifier}`],
      contractEvidence: contract("COUNT", "CP010_INCLUSIVE_HOUR_RANGE_ORACLE", [`${startHour} o'clock`, `${endHour} o'clock`, "including both endpoint hours"]),
    };
  }

  if (input.taskId === "INFER_RANGE_OR_HOUR_FROM_TOTAL") {
    const startHour = input.rng.int(1, 5);
    const endHour = startHour + input.rng.int(2, 6);
    const total = totalHourlyStrikesInclusive({ startHour, endHour });
    let inferredEnd = -1;
    for (let candidate = startHour; candidate <= 12; candidate += 1) {
      if (hourStrikeSum(startHour, candidate, standardHourLabel) === total) {
        inferredEnd = candidate;
        break;
      }
    }
    const answer = countAnswer(endHour);
    const verifierAnswer = countAnswer(inferredEnd);
    return {
      taskId: input.taskId,
      stem: `A standard striking clock gives ${total} strikes from ${startHour} o'clock through an unknown later hour, including both endpoints. What is the ending hour?`,
      scenario: { startHour, totalStrikes: total, endpointPolicy: "INCLUSIVE", requested: "ENDING_HOUR" },
      answer,
      verifierAnswer,
      distractors: [
        { answer: countAnswer(endHour - 1), reasonCode: "ENDING_HOUR_ONE_EARLY", reason: "This stops one hour before the cumulative total reaches the stated number of strikes." },
        { answer: countAnswer(endHour + 1), reasonCode: "ENDING_HOUR_ONE_LATE", reason: "This includes one extra hour after the stated total has already been reached." },
        { answer: countAnswer(total), reasonCode: "TOTAL_STRIKES_COPIED_AS_HOUR", reason: "This copies the strike total as an hour number without cumulative summation." },
      ],
      explanation: {
        given: `Start hour ${startHour}; inclusive total ${total}.`,
        rule: "Add successive hour strike counts until the cumulative total equals the stated total.",
        working: [`${Array.from({ length: endHour - startHour + 1 }, (_, index) => standardHourLabel(startHour + index)).join(" + ")} = ${total}.`, `Ending hour = ${answer.display}.`],
        validityCheck: "An independent bounded search finds the same first ending hour.",
        closestTrap: "The total number of strikes is not itself the ending hour.",
        answer: answer.display,
      },
      canonicalTrace: [`constructedEnd=${endHour}`],
      verifierTrace: [`searchedEnd=${inferredEnd}`],
      contractEvidence: contract("COUNT", "CP010_INFER_END_HOUR_ORACLE", [`${total} strikes`, `${startHour} o'clock`, "ending hour"]),
    };
  }

  if (input.taskId === "CUSTOM_HOUR_STRIKE_SCHEDULE") {
    const startHour = input.rng.int(1, 5);
    const endHour = startHour + input.rng.int(3, 6);
    const schedule = (hour: number) => standardHourLabel(hour) % 2 === 0 ? 2 : 1;
    const canonical = totalHourlyStrikesInclusive({ startHour, endHour, schedule });
    const verifier = hourStrikeSum(startHour, endHour, schedule);
    const answer = countAnswer(canonical);
    const verifierAnswer = countAnswer(verifier);
    return {
      taskId: input.taskId,
      stem: `A custom clock gives 1 strike at every odd-numbered hour and 2 strikes at every even-numbered hour. How many strikes does it give from ${startHour} o'clock through ${endHour} o'clock, including both hours?`,
      scenario: { startHour, endHour, oddHourStrikes: 1, evenHourStrikes: 2 },
      answer,
      verifierAnswer,
      distractors: [
        { answer: countAnswer(endHour - startHour + 1), reasonCode: "ONE_STRIKE_EVERY_HOUR", reason: "This ignores the extra strike at each even-numbered hour." },
        { answer: countAnswer(2 * (endHour - startHour + 1)), reasonCode: "TWO_STRIKES_EVERY_HOUR", reason: "This gives two strikes at odd-numbered hours as well." },
        { answer: countAnswer(canonical - schedule(startHour)), reasonCode: "CUSTOM_RANGE_START_EXCLUDED", reason: "This omits the first hour although the range is inclusive." },
      ],
      explanation: {
        given: `Odd hours give 1; even hours give 2; inclusive range ${startHour}–${endHour}.`,
        rule: "Apply the custom schedule separately to each hour, then add.",
        working: [`Hourly counts = ${Array.from({ length: endHour - startHour + 1 }, (_, index) => schedule(startHour + index)).join(" + ")}.`, `Total = ${answer.display}.`],
        validityCheck: "Schedule-engine summation and direct hour-by-hour addition agree.",
        closestTrap: "Do not replace a custom schedule with the standard hour-number strike rule.",
        answer: answer.display,
      },
      canonicalTrace: [`customSchedule=${canonical}`],
      verifierTrace: [`manualCustomSum=${verifier}`],
      contractEvidence: contract("COUNT", "CP010_CUSTOM_SCHEDULE_ORACLE", [`${startHour} o'clock`, `${endHour} o'clock`, "odd-numbered hour", "even-numbered hour"]),
    };
  }

  const startHour = input.rng.int(1, 6);
  const endHour = startHour + input.rng.int(2, 5);
  const halfHourChimes = input.rng.pick([1, 2] as const);
  const canonical = totalHourlyAndHalfHourChimes({ startHour, endHour, includeStartHour: true, includeEndHour: true, halfHourChimesPerInterval: halfHourChimes });
  const hourly = hourStrikeSum(startHour, endHour, standardHourLabel);
  const halfHourIntervals = endHour - startHour;
  const verifier = hourly + halfHourIntervals * halfHourChimes;
  const answer = countAnswer(canonical);
  const verifierAnswer = countAnswer(verifier);
  return {
    taskId: input.taskId,
    stem: `A clock strikes the hour number at each whole hour and gives ${halfHourChimes} chime${halfHourChimes === 1 ? "" : "s"} at each half-hour. How many total sounds occur from ${startHour}:00 through ${endHour}:00, including both whole-hour strikes?`,
    scenario: { startHour, endHour, halfHourChimes, includeStartHour: true, includeEndHour: true },
    answer,
    verifierAnswer,
    distractors: [
      { answer: countAnswer(hourly), reasonCode: "HALF_HOUR_CHIMES_OMITTED", reason: "This counts only the whole-hour strikes and omits every half-hour chime." },
      { answer: countAnswer(hourly + (halfHourIntervals + 1) * halfHourChimes), reasonCode: "EXTRA_HALF_HOUR_INTERVAL", reason: "This inserts one half-hour chime interval beyond the stated end time." },
      { answer: countAnswer(canonical - standardHourLabel(startHour)), reasonCode: "STARTING_HOUR_STRIKES_OMITTED", reason: "This excludes the starting whole-hour strikes although the stem includes them." },
    ],
    explanation: {
      given: `Whole-hour standard strikes plus ${halfHourChimes} chime${halfHourChimes === 1 ? "" : "s"} per half-hour interval.`,
      rule: "Add inclusive whole-hour strikes and one half-hour block for each gap between successive whole hours.",
      working: [`Whole-hour strikes = ${hourly}.`, `Half-hour intervals = ${halfHourIntervals}; half-hour sounds = ${halfHourIntervals * halfHourChimes}.`, `Total = ${answer.display}.`],
      validityCheck: "The combined schedule engine and separate hourly-plus-half-hour sum agree.",
      closestTrap: "There are endHour−startHour half-hour points between inclusive whole-hour endpoints, not one extra.",
      answer: answer.display,
    },
    canonicalTrace: [`combinedSchedule=${canonical}`],
    verifierTrace: [`hourly+halfHours=${verifier}`],
    contractEvidence: contract("COUNT", "CP010_HOURLY_HALF_HOUR_COMBINED_ORACLE", [`${halfHourChimes} chime`, `${startHour}:00`, `${endHour}:00`, "including both"]),
  };
}

export function solveRemediatedStrikeFamily(
  input: ClockFamilySolverInput,
): SolvedClockPrototype | null {
  if (CP009_TASKS.has(input.taskId)) return solveCp009(input);
  if (CP010_TASKS.has(input.taskId)) return solveCp010(input);
  return null;
}
