import type {
  CalendarPrototypeId,
  Locale,
  Month,
  Weekday,
} from "./types.ts";
import {
  DeterministicRandom,
  ordinalDaysInMonth,
  ordinalLeapYear,
  ordinalWeekday,
  weekdayFrequencyInMonth,
} from "./foundation.ts";
import {
  makeExplanation,
  monthName,
  t,
  weekdayName,
  type Problem,
} from "./runtime-shared.ts";

function pickYearByLeapStatus(rng: DeterministicRandom, leap: boolean): number {
  for (let attempt = 0; attempt < 1000; attempt++) {
    const year = rng.int(1900, 2099);
    if (ordinalLeapYear(year) === leap) return year;
  }
  throw new Error(`Unable to select a ${leap ? "leap" : "ordinary"} frequency year.`);
}

function pickMonthScenario(seed: number, rng: DeterministicRandom): { year: number; month: Month } {
  switch (seed % 4) {
    case 0:
      return { year: pickYearByLeapStatus(rng, false), month: 2 };
    case 1:
      return { year: pickYearByLeapStatus(rng, true), month: 2 };
    case 2:
      return { year: rng.int(1900, 2099), month: rng.pick([4, 6, 9, 11]) };
    default:
      return { year: rng.int(1900, 2099), month: rng.pick([1, 3, 5, 7, 8, 10, 12]) };
  }
}

function namedWeekdayFrequencyProblem(seed: number, locale: Locale, rng: DeterministicRandom): Problem {
  const { year, month } = pickMonthScenario(seed, rng);
  const length = ordinalDaysInMonth(year, month);
  const first = ordinalWeekday({ year, month, day: 1 });
  const named = rng.int(0, 6) as Weekday;
  const frequency = weekdayFrequencyInMonth(year, month);
  const answer = frequency[named];

  let enumerated = 0;
  for (let day = 1; day <= length; day++) {
    if (ordinalWeekday({ year, month, day }) === named) enumerated++;
  }

  const oppositeFrequency = answer === 4 ? 5 : 4;
  return {
    queryType: "COUNT_NAMED_WEEKDAY_IN_MONTH",
    facts: { year, month, namedWeekday: named },
    answer,
    groundTruth: {
      method: "ORDINAL",
      segments: [{ enumerated }],
      answer: enumerated,
    },
    teachingTrace: {
      method: "FREQUENCY_RULE",
      segments: [
        { completeWeeks: Math.floor(length / 7) },
        { extraDays: length % 7 },
        { firstWeekday: first },
      ],
      answer,
    },
    stem: t(
      locale,
      `How many ${weekdayName(named, locale)}s are there in ${monthName(month, locale)} ${year}?`,
      `${monthName(month, locale)} ${year} में कितने ${weekdayName(named, locale)} हैं?`,
      `${monthName(month, locale)} ${year} ਵਿੱਚ ਕਿੰਨੇ ${weekdayName(named, locale)} ਹਨ?`,
    ),
    wrongs: [
      {
        value: oppositeFrequency,
        misconceptionId: "FREQUENCY_EXTRA_DAYS_FROM_WRONG_START",
        derivation: { treatedNamedWeekdayAsHavingOppositeExtraDayStatus: true, usedCount: oppositeFrequency },
      },
      {
        value: 3,
        misconceptionId: "FAILED_MOD7_REDUCTION",
        derivation: { usedOneFewerCompleteWeek: true, usedCount: 3 },
      },
      {
        value: 6,
        misconceptionId: "FIRST_LAST_DAY_OFF_BY_ONE",
        derivation: { doubleCountedIncompleteWeekAndBoundary: true, usedCount: 6 },
      },
    ],
    explanation: makeExplanation(
      locale,
      `${monthName(month, locale)} ${year} has ${length} days and begins on ${weekdayName(first, locale)}.`,
      "Write the month as complete weeks plus extra days; the extra weekday sequence begins on the first day of the month.",
      [
        `${length} = ${Math.floor(length / 7)} × 7 + ${length % 7}.`,
        `Every weekday occurs ${Math.floor(length / 7)} times before the ${length % 7} extra day(s) are assigned.`,
        `${weekdayName(named, locale)} occurs ${answer} times.`,
      ],
      String(answer),
      "Starting the extra-day sequence from the wrong weekday changes a count of 4 into 5, or 5 into 4.",
    ),
    coverage: {
      crossesFeb29: month === 2 && length === 29,
    },
    difficultyDimensions: {
      D4LeapDayExposure: month === 2 && length === 29,
      D6CountInterpretation: true,
    },
  };
}

export function buildFrequencyExamReadyProblemOverride(
  id: CalendarPrototypeId,
  seed: number,
  locale: Locale,
  rng: DeterministicRandom,
): Problem | null {
  if (id === "CAL-PQL-040") return namedWeekdayFrequencyProblem(seed, locale, rng);
  return null;
}
