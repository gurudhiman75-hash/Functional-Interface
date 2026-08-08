import type {
  CalendarPrototypeId,
  CalendarQuestionPackage,
  GregorianDate,
  Locale,
  SemanticValue,
} from "./types.ts";
import {
  DeterministicRandom,
  mod7,
  ordinalDifference,
  ordinalLeapYear,
  ordinalWeekday,
  spanContainsFeb29,
  weekdayShift,
} from "./foundation.ts";
import {
  formatDate,
  makeExplanation,
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

export function buildAdditionalExamReadyProblemOverride(
  id: CalendarPrototypeId,
  seed: number,
  locale: Locale,
  rng: DeterministicRandom,
): Problem | null {
  if (id === "CAL-PQL-027") return centuryBoundaryProblem(seed, locale, rng);
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
