import {
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
import type { ClockFamilySolverInput, SolvedClockPrototype } from "../solver-types";
import {
  formatDurationSeconds,
  localized,
  rationalAnswer,
  textAnswer,
} from "../utils";

const STRIKE_TASKS = new Set<ClockTaskId>([
  "DURATION_FOR_N_STRIKES",
  "GAP_FROM_N_STRIKES",
  "TRANSFER_STRIKE_COUNT",
  "STRIKES_IN_DURATION",
  "FIRST_LAST_INCLUSION",
  "COMPARE_STRIKING_SPEEDS",
  "TOTAL_STRIKES_12_HOURS",
  "TOTAL_STRIKES_24_HOURS",
  "TOTAL_STRIKES_INCLUSIVE_RANGE",
  "INFER_RANGE_OR_HOUR_FROM_TOTAL",
  "CUSTOM_HOUR_STRIKE_SCHEDULE",
  "HOURLY_AND_HALF_HOUR_CHIME",
]);

function durationAnswer(seconds: ExactRational) {
  return rationalAnswer("DURATION", seconds, formatDurationSeconds(seconds), "DURATION_SECONDS");
}

function countAnswer(count: number) {
  return rationalAnswer("COUNT", count, count.toString(), "COUNT");
}

function strikeExplanation(input: {
  locale: ClockFamilySolverInput["locale"];
  given: string;
  working: readonly string[];
  validity: string;
  answer: string;
}) {
  return {
    given: input.given,
    rule: localized(input.locale, {
      en: "For n equally spaced strikes, the first-to-last duration contains n − 1 equal gaps.",
      hi: "n समान अंतर वाली घंटियों में पहली से अंतिम घंटी तक n − 1 समान अंतराल होते हैं।",
      pa: "n ਬਰਾਬਰ ਫਰਕ ਵਾਲੀਆਂ ਘੰਟੀਆਂ ਵਿੱਚ ਪਹਿਲੀ ਤੋਂ ਆਖਰੀ ਘੰਟੀ ਤੱਕ n − 1 ਬਰਾਬਰ ਅੰਤਰਾਲ ਹੁੰਦੇ ਹਨ।",
    }),
    working: input.working,
    validityCheck: input.validity,
    closestTrap: "Do not use the number of strikes as the number of time gaps; the first strike begins the observation with no preceding gap.",
    answer: input.answer,
  };
}

function solveInterval(input: ClockFamilySolverInput): SolvedClockPrototype {
  const { taskId, locale, rng } = input;
  const strikes = rng.pick([5, 6, 7, 8, 9, 10, 12] as const);
  const gap = exactRational(rng.pick([1, 2, 3, 4, 5, 6] as const));
  const duration = durationForStrikesExact({ strikes, gapSeconds: gap });

  if (taskId === "DURATION_FOR_N_STRIKES") {
    const answer = durationAnswer(duration);
    const timeline = strikeTimelineExact({ strikes, gapSeconds: gap });
    return {
      taskId,
      stem: localized(locale, {
        en: `A clock gives ${strikes} equally spaced strikes, with ${formatDurationSeconds(gap)} between consecutive strikes. How long does it take from the first strike to the last?`,
        hi: `एक घड़ी ${strikes} समान अंतर वाली घंटियाँ बजाती है और लगातार घंटियों के बीच ${formatDurationSeconds(gap)} है। पहली से अंतिम घंटी तक कितना समय लगता है?`,
        pa: `ਇੱਕ ਘੜੀ ${strikes} ਬਰਾਬਰ ਫਰਕ ਵਾਲੀਆਂ ਘੰਟੀਆਂ ਵਜਾਉਂਦੀ ਹੈ ਅਤੇ ਲਗਾਤਾਰ ਘੰਟੀਆਂ ਵਿਚਕਾਰ ${formatDurationSeconds(gap)} ਹੈ। ਪਹਿਲੀ ਤੋਂ ਆਖਰੀ ਘੰਟੀ ਤੱਕ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗਦਾ ਹੈ?`,
      }),
      scenario: { strikes, gapSeconds: Number(gap.numerator) },
      answer,
      distractors: [
        { answer: durationAnswer(multiplyRationals(gap, strikes)), reasonCode: "N_STRIKES_MEANS_N_INTERVALS", reason: "This incorrectly uses one gap for every strike." },
        { answer: durationAnswer(multiplyRationals(gap, Math.max(0, strikes - 2))), reasonCode: "N_STRIKES_MEANS_N_MINUS_2_INTERVALS", reason: "This removes two intervals instead of one." },
        { answer: durationAnswer(gap), reasonCode: "ONE_GAP_ONLY", reason: "This returns only the interval between two consecutive strikes." },
      ],
      explanation: strikeExplanation({ locale, given: `${strikes} strikes and gap ${formatDurationSeconds(gap)}.`, working: [`Interval count = ${strikes} − 1 = ${strikes - 1}.`, `Duration = ${strikes - 1} × ${formatDurationSeconds(gap)} = ${answer.display}.`], validity: `The event timeline starts at ${formatDurationSeconds(timeline[0]!.timestampSeconds)} and ends at ${formatDurationSeconds(timeline[timeline.length - 1]!.timestampSeconds)}.`, answer: `The duration is ${answer.display}.` }),
      canonicalTrace: ["Use n−1 gaps.", "Multiply by the exact gap."],
      verifierTrace: ["Enumerate every strike timestamp and subtract first from last."],
      solveTraceExtras: { strikeIntervalCount: strikes - 1 },
    };
  }

  if (taskId === "GAP_FROM_N_STRIKES") {
    const solvedGap = gapFromStrikeDurationExact({ strikes, firstToLastDurationSeconds: duration });
    const answer = durationAnswer(solvedGap);
    return {
      taskId,
      stem: localized(locale, {
        en: `A clock takes ${formatDurationSeconds(duration)} from its first to its ${strikes}th strike. Find the interval between consecutive strikes.`,
        hi: `एक घड़ी पहली से ${strikes}वीं घंटी तक ${formatDurationSeconds(duration)} लेती है। लगातार घंटियों के बीच का अंतर ज्ञात कीजिए।`,
        pa: `ਇੱਕ ਘੜੀ ਪਹਿਲੀ ਤੋਂ ${strikes}ਵੀਂ ਘੰਟੀ ਤੱਕ ${formatDurationSeconds(duration)} ਲੈਂਦੀ ਹੈ। ਲਗਾਤਾਰ ਘੰਟੀਆਂ ਵਿਚਕਾਰ ਅੰਤਰ ਲੱਭੋ।`,
      }),
      scenario: { strikes, firstToLastDuration: formatDurationSeconds(duration) },
      answer,
      distractors: [
        { answer: durationAnswer(divideRationals(duration, strikes)), reasonCode: "N_STRIKES_MEANS_N_INTERVALS", reason: "This divides by the strike count instead of the gap count." },
        { answer: durationAnswer(divideRationals(duration, strikes - 2)), reasonCode: "N_MINUS_2_INTERVALS", reason: "This uses too few intervals." },
        { answer: durationAnswer(duration), reasonCode: "TOTAL_DURATION_AS_GAP", reason: "This treats the full first-to-last duration as a single gap." },
      ],
      explanation: strikeExplanation({ locale, given: `${strikes} strikes occur over ${formatDurationSeconds(duration)} first-to-last.`, working: [`Gap count = ${strikes - 1}.`, `Gap = total duration ÷ ${strikes - 1} = ${answer.display}.`], validity: `Reconstruction: (${strikes}−1) × ${answer.display} = ${formatDurationSeconds(duration)}.`, answer: `The consecutive-strike interval is ${answer.display}.` }),
      canonicalTrace: ["Divide first-to-last duration by n−1."],
      verifierTrace: ["Rebuild a strike timeline using the solved gap."],
      solveTraceExtras: { strikeIntervalCount: strikes - 1 },
    };
  }

  if (taskId === "TRANSFER_STRIKE_COUNT") {
    const targetStrikes = rng.pick([3, 4, 11, 13, 15] as const);
    const transferred = transferStrikeDurationExact({ sourceStrikes: strikes, sourceDurationSeconds: duration, targetStrikes });
    const answer = durationAnswer(transferred);
    return {
      taskId,
      stem: localized(locale, {
        en: `A clock takes ${formatDurationSeconds(duration)} to strike ${strikes} times. At the same striking speed, how long will it take to strike ${targetStrikes} times?`,
        hi: `एक घड़ी ${strikes} बार बजने में ${formatDurationSeconds(duration)} लेती है। उसी गति से ${targetStrikes} बार बजने में कितना समय लगेगा?`,
        pa: `ਇੱਕ ਘੜੀ ${strikes} ਵਾਰ ਵੱਜਣ ਵਿੱਚ ${formatDurationSeconds(duration)} ਲੈਂਦੀ ਹੈ। ਉਸੇ ਗਤੀ ਨਾਲ ${targetStrikes} ਵਾਰ ਵੱਜਣ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`,
      }),
      scenario: { sourceStrikes: strikes, sourceDuration: formatDurationSeconds(duration), targetStrikes },
      answer,
      distractors: [
        { answer: durationAnswer(multiplyRationals(duration, exactRational(targetStrikes, strikes))), reasonCode: "DIRECT_PROPORTION_ON_STRIKE_COUNT_NOT_INTERVALS", reason: "This scales by strike counts instead of interval counts." },
        { answer: durationAnswer(multiplyRationals(gap, targetStrikes)), reasonCode: "TARGET_STRIKES_AS_INTERVALS", reason: "This assigns one gap to each target strike." },
        { answer: durationAnswer(multiplyRationals(gap, Math.max(0, targetStrikes - 2))), reasonCode: "TARGET_N_MINUS_2_INTERVALS", reason: "This removes two intervals from the target count." },
      ],
      explanation: strikeExplanation({ locale, given: `${strikes} strikes take ${formatDurationSeconds(duration)}; target is ${targetStrikes} strikes.`, working: [`Source gap = ${formatDurationSeconds(duration)} ÷ ${strikes - 1} = ${formatDurationSeconds(gap)}.`, `Target duration = (${targetStrikes}−1) × gap = ${answer.display}.`], validity: "Both source and target use the same independently reconstructed gap.", answer: `The target duration is ${answer.display}.` }),
      canonicalTrace: ["Derive source gap from n−1 intervals.", "Apply target n−1 intervals."],
      verifierTrace: ["Enumerate source and target strike timelines at the same gap."],
      solveTraceExtras: { strikeIntervalCount: targetStrikes - 1 },
    };
  }

  if (taskId === "STRIKES_IN_DURATION" || taskId === "FIRST_LAST_INCLUSION") {
    const intervals = rng.pick([4, 5, 6, 8, 10] as const);
    const observedDuration = multiplyRationals(gap, intervals);
    const includeStart = true;
    const includeEnd = taskId === "FIRST_LAST_INCLUSION" ? rng.pick([true, false] as const) : true;
    const count = strikeCountWithinDurationExact({ durationSeconds: observedDuration, gapSeconds: gap, includeStrikeAtStart: includeStart, includeStrikeAtEnd: includeEnd });
    const answer = countAnswer(count);
    return {
      taskId,
      stem: localized(locale, {
        en: `A clock strikes every ${formatDurationSeconds(gap)}. Starting with a strike at time 0, how many strikes are heard during the next ${formatDurationSeconds(observedDuration)}${includeEnd ? ", including a strike at the end" : ", excluding a strike exactly at the end"}?`,
        hi: `एक घड़ी प्रत्येक ${formatDurationSeconds(gap)} पर बजती है। समय 0 की घंटी से शुरू करके अगले ${formatDurationSeconds(observedDuration)} में${includeEnd ? " अंतिम क्षण की घंटी सहित" : " अंतिम क्षण की घंटी को छोड़कर"} कितनी घंटियाँ सुनाई देंगी?`,
        pa: `ਇੱਕ ਘੜੀ ਹਰ ${formatDurationSeconds(gap)} 'ਤੇ ਵੱਜਦੀ ਹੈ। ਸਮਾਂ 0 ਦੀ ਘੰਟੀ ਤੋਂ ਸ਼ੁਰੂ ਕਰਕੇ ਅਗਲੇ ${formatDurationSeconds(observedDuration)} ਵਿੱਚ${includeEnd ? " ਅੰਤ ਵਾਲੀ ਘੰਟੀ ਸਮੇਤ" : " ਅੰਤ ਵਾਲੀ ਘੰਟੀ ਤੋਂ ਬਿਨਾਂ"} ਕਿੰਨੀਆਂ ਘੰਟੀਆਂ ਸੁਣੀਆਂ ਜਾਣਗੀਆਂ?`,
      }),
      scenario: { gapSeconds: Number(gap.numerator), durationSeconds: Number(observedDuration.numerator), includeStart, includeEnd },
      answer,
      distractors: [
        { answer: countAnswer(intervals), reasonCode: "START_STRIKE_OMITTED", reason: "This counts only intervals and omits the strike at the start." },
        { answer: countAnswer(intervals + 2), reasonCode: "BOTH_BOUNDARIES_DOUBLE_COUNTED", reason: "This adds two boundary strikes to the interval count." },
        { answer: countAnswer(includeEnd ? count - 1 : count + 1), reasonCode: "ENDPOINT_POLICY_REVERSED", reason: "This applies the opposite end-point inclusion rule." },
      ],
      explanation: strikeExplanation({ locale, given: `Gap = ${formatDurationSeconds(gap)}, duration = ${formatDurationSeconds(observedDuration)}, start included, end ${includeEnd ? "included" : "excluded"}.`, working: [`There are ${intervals} complete gaps.`, `Add the start strike and apply the end policy: count = ${count}.`], validity: `The explicit event timestamps were checked against the closed/open end contract.`, answer: `${answer.display} strikes are heard.` }),
      canonicalTrace: ["Count complete gap multiples.", "Apply start and end inclusion flags."],
      verifierTrace: ["Enumerate strike timestamps and filter by the exact interval."],
      solveTraceExtras: { strikeIntervalCount: intervals, endpointPolicy: `[start, end${includeEnd ? "]" : ")"}` },
    };
  }

  if (taskId === "COMPARE_STRIKING_SPEEDS") {
    const strikesB = rng.pick([6, 8, 10, 12] as const);
    const gapB = exactRational(rng.pick([2, 3, 4, 5] as const));
    const durationB = durationForStrikesExact({ strikes: strikesB, gapSeconds: gapB });
    const ratio = divideRationals(gapB, gap);
    const answer = rationalAnswer("RATIO", ratio, `${ratio.numerator}:${ratio.denominator}`, "GAP_A_TO_GAP_B");
    return {
      taskId,
      stem: localized(locale, {
        en: `Clock A takes ${formatDurationSeconds(duration)} to strike ${strikes} times, while clock B takes ${formatDurationSeconds(durationB)} to strike ${strikesB} times. Find the ratio of A's gap between strikes to B's gap.`,
        hi: `घड़ी A ${strikes} बार बजने में ${formatDurationSeconds(duration)} और घड़ी B ${strikesB} बार बजने में ${formatDurationSeconds(durationB)} लेती है। A तथा B के लगातार घंटियों के अंतरालों का अनुपात ज्ञात कीजिए।`,
        pa: `ਘੜੀ A ${strikes} ਵਾਰ ਵੱਜਣ ਵਿੱਚ ${formatDurationSeconds(duration)} ਅਤੇ ਘੜੀ B ${strikesB} ਵਾਰ ਵੱਜਣ ਵਿੱਚ ${formatDurationSeconds(durationB)} ਲੈਂਦੀ ਹੈ। A ਅਤੇ B ਦੀਆਂ ਲਗਾਤਾਰ ਘੰਟੀਆਂ ਦੇ ਅੰਤਰਾਲਾਂ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`,
      }),
      scenario: { aStrikes: strikes, aDuration: formatDurationSeconds(duration), bStrikes: strikesB, bDuration: formatDurationSeconds(durationB) },
      answer,
      distractors: [
        { answer: rationalAnswer("RATIO", divideRationals(duration, durationB), `${duration.numerator * durationB.denominator}:${duration.denominator * durationB.numerator}`, "TOTAL_DURATION_RATIO"), reasonCode: "TOTAL_DURATION_RATIO_USED", reason: "This compares total durations without accounting for different interval counts." },
        { answer: rationalAnswer("RATIO", divideRationals(gap, gapB), `${gap.numerator * gapB.denominator}:${gap.denominator * gapB.numerator}`, "REVERSED_GAP_RATIO"), reasonCode: "RATIO_ORDER_REVERSED", reason: "This returns B's gap to A's gap." },
        { answer: rationalAnswer("RATIO", exactRational(strikes, strikesB), `${strikes}:${strikesB}`, "STRIKE_COUNT_RATIO"), reasonCode: "STRIKE_COUNTS_COMPARED", reason: "This compares strike counts instead of derived gaps." },
      ],
      explanation: strikeExplanation({ locale, given: "Each clock has its own strike count and first-to-last duration.", working: [`A gap = duration_A/(${strikes}−1) = ${formatDurationSeconds(gap)}.`, `B gap = duration_B/(${strikesB}−1) = ${formatDurationSeconds(gapB)}.`, `A:B gap ratio = ${answer.display}.`], validity: "Each gap reproduces its clock's original first-to-last duration.", answer: `The gap ratio is ${answer.display}.` }),
      canonicalTrace: ["Derive both n−1 gaps and divide A by B."],
      verifierTrace: ["Reconstruct both timelines and compare adjacent timestamps."],
    };
  }

  throw new Error(`Unsupported strike interval task ${taskId}`);
}

function solveSchedule(input: ClockFamilySolverInput): SolvedClockPrototype {
  const { taskId, locale, rng } = input;

  if (taskId === "TOTAL_STRIKES_12_HOURS" || taskId === "TOTAL_STRIKES_24_HOURS") {
    const hours = taskId === "TOTAL_STRIKES_12_HOURS" ? 12 : 24;
    const total = hours === 12 ? totalStrikesInTwelveHours() : totalStrikesInTwentyFourHours();
    const answer = countAnswer(total);
    return {
      taskId,
      stem: localized(locale, {
        en: `A standard clock strikes the hour number at each full hour. How many hour strikes does it make in ${hours} consecutive hours?`,
        hi: `एक मानक घड़ी प्रत्येक पूर्ण घंटे पर घंटे की संख्या के बराबर घंटियाँ बजाती है। ${hours} लगातार घंटों में कुल कितनी घंटियाँ बजेंगी?`,
        pa: `ਇੱਕ ਮਿਆਰੀ ਘੜੀ ਹਰ ਪੂਰੇ ਘੰਟੇ 'ਤੇ ਘੰਟੇ ਦੀ ਗਿਣਤੀ ਦੇ ਬਰਾਬਰ ਘੰਟੀਆਂ ਵਜਾਉਂਦੀ ਹੈ। ${hours} ਲਗਾਤਾਰ ਘੰਟਿਆਂ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੀਆਂ ਘੰਟੀਆਂ ਵੱਜਣਗੀਆਂ?`,
      }),
      scenario: { hours, schedule: "STANDARD_1_TO_12" },
      answer,
      distractors: [
        { answer: countAnswer(hours === 12 ? 66 : 78), reasonCode: "HOUR_12_OMITTED", reason: "This mishandles the 12 o'clock strike count." },
        { answer: countAnswer(hours === 12 ? 144 : 156), reasonCode: "HOURS_MULTIPLIED_BY_12", reason: "This assumes every hour produces 12 strikes." },
        { answer: countAnswer(hours === 12 ? 78 * 2 : 78), reasonCode: hours === 12 ? "TWELVE_HOUR_SUM_DOUBLED" : "TWELVE_HOUR_SUM_NOT_DOUBLED", reason: "This uses the total for the wrong cycle length." },
      ],
      explanation: {
        given: `Standard hourly schedule over ${hours} hours.`,
        rule: localized(locale, { en: "Enumerate each hourly event; one 12-hour cycle totals 1+2+...+12.", hi: "हर घंटे की घटना गिनें; 12 घंटे का कुल 1+2+...+12 है।", pa: "ਹਰ ਘੰਟੇ ਦੀ ਘਟਨਾ ਗਿਣੋ; 12 ਘੰਟਿਆਂ ਦਾ ਜੋੜ 1+2+...+12 ਹੈ।" }),
        working: hours === 12 ? ["1+2+...+12 = 78."] : ["One 12-hour cycle = 78.", "Two cycles = 2×78 = 156."],
        validityCheck: "An independent hour-by-hour schedule enumeration gives the same total.",
        closestTrap: "At 12 o'clock the clock strikes 12 times, not zero, and a 24-hour period contains two 12-hour schedules.",
        answer: `Total strikes = ${answer.display}.`,
      },
      canonicalTrace: ["Sum schedule values over every included hour."],
      verifierTrace: ["Enumerate each hour and accumulate its strike count."],
    };
  }

  if (taskId === "TOTAL_STRIKES_INCLUSIVE_RANGE") {
    const startHour = rng.pick([1, 2, 3, 4, 5, 6] as const);
    const endHour = startHour + rng.pick([3, 4, 5, 6] as const);
    const total = totalHourlyStrikesInclusive({ startHour, endHour });
    const answer = countAnswer(total);
    return {
      taskId,
      stem: localized(locale, {
        en: `A standard clock strikes the hour number. How many strikes occur from ${startHour} o'clock through ${endHour} o'clock, both endpoint hours included?`,
        hi: `एक मानक घड़ी घंटे की संख्या के बराबर बजती है। ${startHour} बजे से ${endHour} बजे तक, दोनों अंतिम घंटे सहित, कितनी घंटियाँ बजेंगी?`,
        pa: `ਇੱਕ ਮਿਆਰੀ ਘੜੀ ਘੰਟੇ ਦੀ ਗਿਣਤੀ ਦੇ ਬਰਾਬਰ ਵੱਜਦੀ ਹੈ। ${startHour} ਵਜੇ ਤੋਂ ${endHour} ਵਜੇ ਤੱਕ, ਦੋਵੇਂ ਅੰਤ ਵਾਲੇ ਘੰਟੇ ਸਮੇਤ, ਕਿੰਨੀਆਂ ਘੰਟੀਆਂ ਵੱਜਣਗੀਆਂ?`,
      }),
      scenario: { startHour, endHour, includeStart: true, includeEnd: true },
      answer,
      distractors: [
        { answer: countAnswer(total - startHour), reasonCode: "START_HOUR_OMITTED", reason: "This excludes the stated inclusive starting hour." },
        { answer: countAnswer(total - endHour), reasonCode: "END_HOUR_OMITTED", reason: "This excludes the stated inclusive ending hour." },
        { answer: countAnswer(endHour - startHour + 1), reasonCode: "ONE_STRIKE_PER_HOUR_ASSUMED", reason: "This counts hourly events rather than the number of strikes at each event." },
      ],
      explanation: {
        given: `Inclusive hours ${startHour}, ${startHour + 1}, ..., ${endHour}.`,
        rule: localized(locale, { en: "Add the strike count attached to every included hourly event.", hi: "हर शामिल घंटे की घंटियों की संख्या जोड़ें।", pa: "ਹਰ ਸ਼ਾਮਲ ਘੰਟੇ ਦੀਆਂ ਘੰਟੀਆਂ ਦੀ ਗਿਣਤੀ ਜੋੜੋ।" }),
        working: [`${Array.from({ length: endHour - startHour + 1 }, (_, index) => startHour + index).join(" + ")} = ${total}.`],
        validityCheck: "The timeline includes both endpoint hourly events exactly once.",
        closestTrap: "Do not count only the number of hours or silently drop an inclusive endpoint.",
        answer: `Total strikes = ${answer.display}.`,
      },
      canonicalTrace: ["Sum every inclusive hourly strike count."],
      verifierTrace: ["Enumerate included hour events and count each timestamp's strikes."],
      solveTraceExtras: { endpointPolicy: "[start hour, end hour]" },
    };
  }

  if (taskId === "INFER_RANGE_OR_HOUR_FROM_TOTAL") {
    const hour = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const);
    const answer = textAnswer("POSITION", `HOUR_${hour}`, `${hour} o'clock`, { hour });
    return {
      taskId,
      stem: localized(locale, {
        en: `A standard clock strikes ${hour} times at a full hour. Which hour is it?`,
        hi: `एक मानक घड़ी किसी पूर्ण घंटे पर ${hour} बार बजती है। वह कौन-सा घंटा है?`,
        pa: `ਇੱਕ ਮਿਆਰੀ ਘੜੀ ਕਿਸੇ ਪੂਰੇ ਘੰਟੇ 'ਤੇ ${hour} ਵਾਰ ਵੱਜਦੀ ਹੈ। ਉਹ ਕਿਹੜਾ ਘੰਟਾ ਹੈ?`,
      }),
      scenario: { strikeCount: hour, schedule: "STANDARD_1_TO_12" },
      answer,
      distractors: [1, 2, 3, 4].map((offset) => {
        const wrong = ((hour + offset - 1) % 12) + 1;
        return { answer: textAnswer("POSITION", `HOUR_${wrong}`, `${wrong} o'clock`, { hour: wrong }), reasonCode: "HOUR_LABEL_MISMATCH", reason: "This hour's standard strike count does not equal the observed number." };
      }),
      explanation: {
        given: `${hour} strikes are heard at one full hour.`,
        rule: localized(locale, { en: "In the standard schedule, the hour label equals the number of strikes.", hi: "मानक क्रम में घंटे की संख्या ही घंटियों की संख्या होती है।", pa: "ਮਿਆਰੀ ਕ੍ਰਮ ਵਿੱਚ ਘੰਟੇ ਦੀ ਗਿਣਤੀ ਹੀ ਘੰਟੀਆਂ ਦੀ ਗਿਣਤੀ ਹੁੰਦੀ ਹੈ।" }),
        working: [`${hour} strikes correspond uniquely to ${hour} o'clock.`],
        validityCheck: "Within one 12-hour standard schedule, no other hour has the same strike count.",
        closestTrap: "Do not treat 12 o'clock as zero strikes.",
        answer: `It is ${answer.display}.`,
      },
      canonicalTrace: ["Invert the standard hour-to-strike schedule."],
      verifierTrace: ["Evaluate the schedule at the selected hour and recover the observed count."],
    };
  }

  if (taskId === "CUSTOM_HOUR_STRIKE_SCHEDULE") {
    const startHour = 1;
    const endHour = rng.pick([5, 6, 7, 8] as const);
    const multiplier = rng.pick([2, 3] as const);
    const offset = rng.pick([0, 1, 2] as const);
    const schedule = (hourIndex: number) => multiplier * (((hourIndex - 1) % 12) + 1) + offset;
    const total = totalHourlyStrikesInclusive({ startHour, endHour, schedule });
    const answer = countAnswer(total);
    return {
      taskId,
      stem: localized(locale, {
        en: `A special clock strikes ${multiplier}h + ${offset} times at hour h. How many strikes occur from 1 o'clock through ${endHour} o'clock, both included?`,
        hi: `एक विशेष घड़ी घंटे h पर ${multiplier}h + ${offset} बार बजती है। 1 बजे से ${endHour} बजे तक, दोनों सहित, कुल कितनी घंटियाँ बजेंगी?`,
        pa: `ਇੱਕ ਖਾਸ ਘੜੀ ਘੰਟੇ h 'ਤੇ ${multiplier}h + ${offset} ਵਾਰ ਵੱਜਦੀ ਹੈ। 1 ਵਜੇ ਤੋਂ ${endHour} ਵਜੇ ਤੱਕ, ਦੋਵੇਂ ਸਮੇਤ, ਕੁੱਲ ਕਿੰਨੀਆਂ ਘੰਟੀਆਂ ਵੱਜਣਗੀਆਂ?`,
      }),
      scenario: { formula: `${multiplier}h+${offset}`, startHour, endHour },
      answer,
      distractors: [
        { answer: countAnswer(total - schedule(startHour)), reasonCode: "START_HOUR_OMITTED", reason: "This drops the inclusive first hour." },
        { answer: countAnswer(total - schedule(endHour)), reasonCode: "END_HOUR_OMITTED", reason: "This drops the inclusive last hour." },
        { answer: countAnswer(totalHourlyStrikesInclusive({ startHour, endHour })), reasonCode: "STANDARD_SCHEDULE_USED", reason: "This ignores the explicitly defined custom strike schedule." },
      ],
      explanation: {
        given: `Custom schedule s(h)=${multiplier}h+${offset}, inclusive h=1..${endHour}.`,
        rule: localized(locale, { en: "Evaluate the stated schedule at every included hour and add the results.", hi: "दिए गए क्रम को हर शामिल घंटे पर लागू कर परिणाम जोड़ें।", pa: "ਦਿੱਤੇ ਕ੍ਰਮ ਨੂੰ ਹਰ ਸ਼ਾਮਲ ਘੰਟੇ 'ਤੇ ਲਾਗੂ ਕਰਕੇ ਨਤੀਜੇ ਜੋੜੋ।" }),
        working: [`${Array.from({ length: endHour }, (_, index) => schedule(index + 1)).join(" + ")} = ${total}.`],
        validityCheck: "The standard 1-to-12 schedule is not substituted for the custom rule.",
        closestTrap: "Use the rule stated in the question, not the familiar standard clock schedule.",
        answer: `Total strikes = ${answer.display}.`,
      },
      canonicalTrace: ["Evaluate custom schedule per hour."],
      verifierTrace: ["Enumerate hourly event objects and sum their custom strike counts."],
      solveTraceExtras: { endpointPolicy: "[1 hour, end hour]" },
    };
  }

  if (taskId === "HOURLY_AND_HALF_HOUR_CHIME") {
    const startHour = rng.pick([1, 2, 3, 4] as const);
    const endHour = startHour + rng.pick([4, 5, 6] as const);
    const total = totalHourlyAndHalfHourChimes({ startHour, endHour, includeStartHour: true, includeEndHour: true, halfHourChimesPerInterval: 1 });
    const answer = countAnswer(total);
    const hourlyOnly = totalHourlyStrikesInclusive({ startHour, endHour });
    return {
      taskId,
      stem: localized(locale, {
        en: `A clock strikes the hour number at each full hour and gives one extra chime at each half-hour. How many sounds occur from ${startHour}:00 to ${endHour}:00, both full-hour endpoints included?`,
        hi: `एक घड़ी हर पूर्ण घंटे पर घंटे की संख्या के बराबर बजती है और हर आधे घंटे पर एक अतिरिक्त घंटी देती है। ${startHour}:00 से ${endHour}:00 तक, दोनों पूर्ण-घंटे के अंत सहित, कुल कितनी आवाजें होंगी?`,
        pa: `ਇੱਕ ਘੜੀ ਹਰ ਪੂਰੇ ਘੰਟੇ 'ਤੇ ਘੰਟੇ ਦੀ ਗਿਣਤੀ ਦੇ ਬਰਾਬਰ ਵੱਜਦੀ ਹੈ ਅਤੇ ਹਰ ਅੱਧੇ ਘੰਟੇ 'ਤੇ ਇੱਕ ਵਾਧੂ ਘੰਟੀ ਦਿੰਦੀ ਹੈ। ${startHour}:00 ਤੋਂ ${endHour}:00 ਤੱਕ, ਦੋਵੇਂ ਪੂਰੇ-ਘੰਟੇ ਦੇ ਅੰਤ ਸਮੇਤ, ਕੁੱਲ ਕਿੰਨੀਆਂ ਆਵਾਜ਼ਾਂ ਹੋਣਗੀਆਂ?`,
      }),
      scenario: { startHour, endHour, hourlySchedule: "STANDARD", halfHourChimes: 1 },
      answer,
      distractors: [
        { answer: countAnswer(hourlyOnly), reasonCode: "HALF_HOUR_CHIMES_OMITTED", reason: "This counts only full-hour strikes." },
        { answer: countAnswer(hourlyOnly + (endHour - startHour + 1)), reasonCode: "HALF_HOUR_ENDPOINT_OVERCOUNT", reason: "This adds one half-hour chime for every full-hour event rather than every interval." },
        { answer: countAnswer(total - startHour), reasonCode: "START_HOUR_OMITTED", reason: "This drops the inclusive starting full-hour strikes." },
      ],
      explanation: {
        given: `Full hours ${startHour} through ${endHour} are included; there is one half-hour event in each intervening hour interval.`,
        rule: localized(locale, { en: "Add all full-hour strike counts and one half-hour chime per interval between the endpoint hours.", hi: "सभी पूर्ण-घंटे की घंटियाँ तथा अंतिम घंटों के बीच प्रत्येक अंतराल की एक आधे-घंटे की घंटी जोड़ें।", pa: "ਸਾਰੇ ਪੂਰੇ-ਘੰਟੇ ਦੀਆਂ ਘੰਟੀਆਂ ਅਤੇ ਅੰਤ ਵਾਲੇ ਘੰਟਿਆਂ ਵਿਚਕਾਰ ਹਰ ਅੰਤਰਾਲ ਦੀ ਇੱਕ ਅੱਧੇ-ਘੰਟੇ ਦੀ ਘੰਟੀ ਜੋੜੋ।" }),
        working: [`Hourly strikes = ${hourlyOnly}.`, `Half-hour intervals = ${endHour - startHour}.`, `Total = ${hourlyOnly}+${endHour - startHour}=${total}.`],
        validityCheck: "The half-hour count is based on intervals, while the full-hour endpoints are both included.",
        closestTrap: "Do not add a half-hour chime at the final full-hour endpoint itself.",
        answer: `Total sounds = ${answer.display}.`,
      },
      canonicalTrace: ["Sum hourly schedule and interval-based half-hour events."],
      verifierTrace: ["Enumerate full-hour and half-hour timestamps separately and count them."],
      solveTraceExtras: { endpointPolicy: "[start full hour, end full hour]" },
    };
  }

  throw new Error(`Unsupported strike schedule task ${taskId}`);
}

export function solveStrikeFamily(input: ClockFamilySolverInput): SolvedClockPrototype | null {
  if (!STRIKE_TASKS.has(input.taskId)) {
    return null;
  }
  return input.taskId.startsWith("TOTAL_") || input.taskId === "INFER_RANGE_OR_HOUR_FROM_TOTAL" || input.taskId === "CUSTOM_HOUR_STRIKE_SCHEDULE" || input.taskId === "HOURLY_AND_HALF_HOUR_CHIME"
    ? solveSchedule(input)
    : solveInterval(input);
}
