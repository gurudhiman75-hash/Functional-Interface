import type {
  CalendarPrototypeId,
  CalendarQuestionPackage,
  GregorianDate,
  Locale,
  Month,
  SemanticValue,
} from "./types.ts";
import {
  DeterministicRandom,
  mod7,
  ordinalDaysInMonth,
  ordinalDifference,
  ordinalLeapYear,
  ordinalWeekday,
  spanContainsFeb29,
  weekdayShift,
} from "./foundation.ts";
import {
  formatDate,
  makeExplanation,
  monthName,
  t,
  weekdayName,
  type Problem,
} from "./runtime-shared.ts";

function centuryBoundaryProblem(seed: number, locale: Locale, rng: DeterministicRandom): Problem {
  const ordinaryCenturies = [1700, 1800, 1900, 2100, 2200, 2300] as const;
  const century = seed % 4 === 0 ? 2000 : rng.pick(ordinaryCenturies);
  const start: GregorianDate = { year: century - 1, month: 12, day: rng.int(20, 31) };
  const end: GregorianDate = { year: century, month: 3, day: rng.int(1, 15) };
  const startWeekday = ordinalWeekday(start);
  const answer = ordinalWeekday(end);
  const gap = ordinalDifference(start, end);
  const statusError = century % 400 === 0 ? -1 : 1;

  return {
    queryType: "WEEKDAY_ACROSS_CENTURY_BOUNDARY",
    facts: {
      anchorDate: start,
      targetDate: end,
      anchorWeekday: startWeekday,
      signedDayShift: gap,
    },
    answer,
    groundTruth: {
      method: "ORDINAL",
      segments: [{ exactGap: gap }, { centuryYearLeap: ordinalLeapYear(century) }],
      answer,
    },
    teachingTrace: {
      method: "ODD_DAY",
      segments: [
        { centuryYear: century },
        { divisibleBy400: century % 400 === 0 },
        { gap },
        { remainder: mod7(gap) },
      ],
      answer: weekdayShift(startWeekday, gap),
    },
    stem: t(
      locale,
      `${formatDate(start, locale)} falls on ${weekdayName(startWeekday, locale)}. Which weekday does ${formatDate(end, locale)} fall on?`,
      `${formatDate(start, locale)} को ${weekdayName(startWeekday, locale)} है। ${formatDate(end, locale)} को कौन-सा वार है?`,
      `${formatDate(start, locale)} ਨੂੰ ${weekdayName(startWeekday, locale)} ਹੈ। ${formatDate(end, locale)} ਨੂੰ ਕਿਹੜਾ ਵਾਰ ਹੈ?`,
    ),
    wrongs: [
      {
        value: weekdayShift(answer, statusError),
        misconceptionId: century % 400 === 0 ? "DIVISIBLE_BY_400_RULE_OMITTED" : "CENTURY_ALWAYS_LEAP",
        derivation: { century, appliedWrongLeapStatus: true, weekdayError: statusError },
      },
      {
        value: weekdayShift(answer, 2),
        misconceptionId: "SHIFT_BY_N_PLUS_ONE",
        derivation: { countedAnchorAndBoundaryAgain: true, weekdayError: 2 },
      },
      {
        value: weekdayShift(answer, -2),
        misconceptionId: "SHIFT_BY_N_MINUS_ONE",
        derivation: { omittedTwoBoundaryDays: true, weekdayError: -2 },
      },
      {
        value: weekdayShift(startWeekday, -gap),
        misconceptionId: "FORWARD_BACKWARD_REVERSAL",
        derivation: { reversedDirection: true, gap },
      },
    ],
    explanation: makeExplanation(
      locale,
      `${century} is a century year; it is ${century % 400 === 0 ? "divisible" : "not divisible"} by 400.`,
      "A century year is leap only when it is divisible by 400.",
      [
        `${century} mod 400 = ${century % 400}.`,
        `Exact date gap = ${gap} days, so the weekday shift is ${mod7(gap)}.`,
        `${weekdayName(startWeekday, locale)} + ${mod7(gap)} weekday(s) = ${weekdayName(answer, locale)}.`,
      ],
      weekdayName(answer, locale),
      "Treating every century as leap, or every century as ordinary, changes the shift by one day.",
    ),
    coverage: {
      crossesYear: true,
      crossesCentury: true,
      usesCenturyYear: true,
      usesDivisibleBy400Year: century % 400 === 0,
      crossesFeb29: spanContainsFeb29(start, end),
    },
    difficultyDimensions: {
      D5CenturyExposure: true,
      D4LeapDayExposure: true,
    },
  };
}

function pickYearByLeapStatus(rng: DeterministicRandom, leap: boolean): number {
  for (let attempt = 0; attempt < 1000; attempt++) {
    const year = rng.int(1900, 2099);
    if (ordinalLeapYear(year) === leap) return year;
  }
  throw new Error(`Unable to select a ${leap ? "leap" : "ordinary"} review year.`);
}

function monthBoundaryProblem(
  id: "CAL-PQL-037" | "CAL-PQL-038",
  seed: number,
  locale: Locale,
  rng: DeterministicRandom,
): Problem {
  const pattern = seed % 4;
  let year: number;
  let month: Month;

  if (pattern === 0) {
    year = pickYearByLeapStatus(rng, false);
    month = 2;
  } else if (pattern === 1) {
    year = pickYearByLeapStatus(rng, true);
    month = 2;
  } else if (pattern === 2) {
    year = rng.int(1900, 2099);
    month = rng.pick([4, 6, 9, 11]);
  } else {
    year = rng.int(1900, 2099);
    month = rng.pick([1, 3, 5, 7, 8, 10, 12]);
  }

  const length = ordinalDaysInMonth(year, month);
  const first = ordinalWeekday({ year, month, day: 1 });
  const last = ordinalWeekday({ year, month, day: length });
  const forward = id === "CAL-PQL-037";
  const anchor = forward ? first : last;
  const signedShift = forward ? length - 1 : -(length - 1);
  const answer = forward ? last : first;
  const direction = forward ? 1 : -1;

  return {
    queryType: forward ? "LAST_WEEKDAY_FROM_FIRST_MONTH" : "FIRST_WEEKDAY_FROM_LAST_MONTH",
    facts: {
      year,
      month,
      anchorWeekday: anchor,
      targetWeekday: answer,
      signedDayShift: signedShift,
    },
    answer,
    groundTruth: {
      method: "ORDINAL",
      segments: [{ first }, { last }, { monthLength: length }],
      answer,
    },
    teachingTrace: {
      method: "MOD7_SHIFT",
      segments: [{ monthLength: length }, { signedShift }, { remainder: mod7(signedShift) }],
      answer: weekdayShift(anchor, signedShift),
    },
    stem: forward
      ? t(
          locale,
          `${monthName(month, locale)} ${year} begins on ${weekdayName(first, locale)}. Which weekday does its last day fall on?`,
          `${monthName(month, locale)} ${year} का पहला दिन ${weekdayName(first, locale)} है। अंतिम दिन कौन-सा वार है?`,
          `${monthName(month, locale)} ${year} ਦਾ ਪਹਿਲਾ ਦਿਨ ${weekdayName(first, locale)} ਹੈ। ਆਖ਼ਰੀ ਦਿਨ ਕਿਹੜਾ ਵਾਰ ਹੈ?`,
        )
      : t(
          locale,
          `${monthName(month, locale)} ${year} ends on ${weekdayName(last, locale)}. Which weekday does its first day fall on?`,
          `${monthName(month, locale)} ${year} का अंतिम दिन ${weekdayName(last, locale)} है। पहला दिन कौन-सा वार है?`,
          `${monthName(month, locale)} ${year} ਦਾ ਆਖ਼ਰੀ ਦਿਨ ${weekdayName(last, locale)} ਹੈ। ਪਹਿਲਾ ਦਿਨ ਕਿਹੜਾ ਵਾਰ ਹੈ?`,
        ),
    wrongs: [
      {
        value: weekdayShift(anchor, direction * length),
        misconceptionId: "FIRST_LAST_DAY_OFF_BY_ONE",
        derivation: { usedMonthLengthInsteadOfLengthMinusOne: true, usedShift: direction * length },
      },
      {
        value: weekdayShift(anchor, direction * (length + 1)),
        misconceptionId: "COUNTED_ANCHOR_AS_DAY_ONE",
        derivation: { countedBothBoundaryDaysAgain: true, usedShift: direction * (length + 1) },
      },
      {
        value: weekdayShift(anchor, direction * (length + 2)),
        misconceptionId: "FAILED_MOD7_REDUCTION",
        derivation: { usedIncorrectRemainder: mod7(direction * (length + 2)) },
      },
      {
        value: weekdayShift(anchor, -signedShift),
        misconceptionId: "FORWARD_BACKWARD_REVERSAL",
        derivation: { reversedDirection: true, usedShift: -signedShift },
      },
    ],
    explanation: makeExplanation(
      locale,
      `${monthName(month, locale)} ${year} has ${length} days.`,
      "The first and last dates are separated by month length minus one days; use the negative of that shift for the inverse form.",
      [
        `Required signed shift = ${forward ? "" : "−"}(${length} − 1) = ${signedShift}.`,
        `${signedShift} mod 7 = ${mod7(signedShift)}.`,
        `${weekdayName(anchor, locale)} shifted by ${signedShift} day(s) gives ${weekdayName(answer, locale)}.`,
      ],
      weekdayName(answer, locale),
      "Using the month length itself counts one boundary twice and moves the weekday by one extra day.",
    ),
    coverage: {
      usesBackwardMovement: !forward,
    },
    difficultyDimensions: {
      D2ReverseReasoning: !forward,
      D4LeapDayExposure: month === 2 && length === 29,
      D8InverseReasoning: !forward,
    },
  };
}

export function buildAdditionalExamReadyProblemOverride(
  id: CalendarPrototypeId,
  seed: number,
  locale: Locale,
  rng: DeterministicRandom,
): Problem | null {
  if (id === "CAL-PQL-027") return centuryBoundaryProblem(seed, locale, rng);
  if (id === "CAL-PQL-037" || id === "CAL-PQL-038") return monthBoundaryProblem(id, seed, locale, rng);
  return null;
}

function emptySetDisplay(locale: Locale): string {
  if (locale === "hi-IN") return "कोई नहीं";
  if (locale === "pa-IN") return "ਕੋਈ ਨਹੀਂ";
  return "None";
}

function isEmptyWeekdaySet(value: SemanticValue): boolean {
  return Array.isArray(value) && value.length === 0;
}

export function applyAdditionalExamReadinessRemediation(pkg: CalendarQuestionPackage): CalendarQuestionPackage {
  if (pkg.outputType !== "WEEKDAY_SET") return pkg;

  const answerIsEmpty = isEmptyWeekdaySet(pkg.canonicalAnswer);
  const display = emptySetDisplay(pkg.locale);
  return {
    ...pkg,
    options: pkg.options.map((option) => {
      if (!isEmptyWeekdaySet(option.semanticValue)) return option;
      return {
        ...option,
        display,
        explanation: option.isCorrect
          ? `${display} is correct because no weekday receives an extra occurrence in the stated period.`
          : `${display} follows from the stated counting misconception.`,
      };
    }),
    explanation: answerIsEmpty
      ? {
          ...pkg.explanation,
          conclusion: display,
          closestTrap: pkg.explanation.closestTrap
            ?? "A complete number of weeks gives every weekday the same frequency, so no weekday occurs an extra time.",
        }
      : pkg.explanation,
  };
}
