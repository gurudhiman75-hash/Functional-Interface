import { ordinalDaysInMonth, ordinalWeekday } from "./foundation.ts";
import { weekdayName } from "./runtime-shared.ts";
import type {
  CalendarQuestionPackage,
  Month,
  StructuredCalendarExplanation,
  Weekday,
} from "./types.ts";

export const CAL_001_ENGLISH_EDITORIAL_FREEZE_VERSION =
  "CAL_001_ENGLISH_EDITORIAL_FREEZE_V2" as const;

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function requireNumber(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`CAL-001 final English editorial freeze: missing ${label}.`);
  }
  return value;
}

function requireMonth(value: unknown): Month {
  const month = requireNumber(value, "month");
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error("CAL-001 final English editorial freeze: invalid month.");
  }
  return month as Month;
}

function requireWeekday(value: unknown, label: string): Weekday {
  const weekday = requireNumber(value, label);
  if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6) {
    throw new Error(`CAL-001 final English editorial freeze: invalid ${label}.`);
  }
  return weekday as Weekday;
}

function monthName(month: Month): string {
  return MONTH_NAMES[month - 1];
}

function joinEnglish(items: string[]): string {
  if (items.length === 0) return "none";
  if (items.length === 1) return items[0]!;
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}

function weekdaySequence(start: Weekday, count: number): Weekday[] {
  return Array.from({ length: count }, (_, index) => ((start + index) % 7) as Weekday);
}

function naturaliseMechanicalPhrasing(text: string): string {
  return text
    .replace(/\b1 weekday\(s\)/g, "1 weekday")
    .replace(/\b(\d+) weekday\(s\)/g, "$1 weekdays")
    .replace(/\b1 day\(s\)/g, "1 day")
    .replace(/\b(\d+) day\(s\)/g, "$1 days")
    .replace(/weekday\(s\)/g, "weekdays")
    .replace(/day\(s\)/g, "days");
}

function naturaliseExplanation(
  explanation: StructuredCalendarExplanation,
): StructuredCalendarExplanation {
  return {
    observation: naturaliseMechanicalPhrasing(explanation.observation),
    rule: naturaliseMechanicalPhrasing(explanation.rule),
    working: explanation.working.map(naturaliseMechanicalPhrasing),
    conclusion: naturaliseMechanicalPhrasing(explanation.conclusion),
    ...(explanation.closestTrap
      ? { closestTrap: naturaliseMechanicalPhrasing(explanation.closestTrap) }
      : {}),
    ...(explanation.verification
      ? { verification: naturaliseMechanicalPhrasing(explanation.verification) }
      : {}),
  };
}

function freezeOddDayExplanation(pkg: CalendarQuestionPackage): StructuredCalendarExplanation {
  const year = requireNumber(pkg.facts.year, "year");
  return {
    ...naturaliseExplanation(pkg.explanation),
    observation: `The complete years being counted are year 1 through year ${year}.`,
    rule: "An ordinary year contributes 1 odd day and a leap year contributes 2. Reduce the total modulo 7.",
    closestTrap: "Remember the century rule: a century year is leap only when it is divisible by 400.",
  };
}

function freezeMonthMatchExplanation(pkg: CalendarQuestionPackage): StructuredCalendarExplanation {
  const firstYear = requireNumber(pkg.facts.year, "first year");
  const secondYear = requireNumber(pkg.facts.secondYear, "second year");
  const month = requireMonth(pkg.facts.month);
  const firstStart = ordinalWeekday({ year: firstYear, month, day: 1 });
  const secondStart = ordinalWeekday({ year: secondYear, month, day: 1 });
  const firstLength = ordinalDaysInMonth(firstYear, month);
  const secondLength = ordinalDaysInMonth(secondYear, month);
  const label = monthName(month);

  return {
    observation: `${label} ${firstYear} starts on ${weekdayName(firstStart, "en-IN")} and has ${firstLength} days.`,
    rule: "Two months have the same calendar when they start on the same weekday and have the same number of days.",
    working: [
      `${label} ${secondYear} starts on ${weekdayName(secondStart, "en-IN")}.`,
      `${label} has ${secondLength} days in ${secondYear}.`,
      `Both the starting weekday and the month length match.`,
    ],
    conclusion: String(secondYear),
    closestTrap: "A month can match even when the two full-year calendars do not match.",
  };
}

function freezeMonthFrequencyExplanation(pkg: CalendarQuestionPackage): StructuredCalendarExplanation {
  const year = requireNumber(pkg.facts.year, "year");
  const month = requireMonth(pkg.facts.month);
  const namedWeekday = requireWeekday(pkg.facts.namedWeekday, "named weekday");
  const length = ordinalDaysInMonth(year, month);
  const firstWeekday = ordinalWeekday({ year, month, day: 1 });
  const base = Math.floor(length / 7);
  const extraCount = length % 7;
  const extraWeekdays = weekdaySequence(firstWeekday, extraCount);
  const answer = requireNumber(pkg.canonicalAnswer, "canonical answer");
  const named = weekdayName(namedWeekday, "en-IN");

  const working = extraCount === 0
    ? [
        `${length} = ${base} × 7, so there are no extra days.`,
        `Every weekday, including ${named}, occurs ${base} times.`,
      ]
    : [
        `${length} = ${base} × 7 + ${extraCount}.`,
        `The extra weekdays are ${joinEnglish(extraWeekdays.map((value) => weekdayName(value, "en-IN")))}.`,
        `${named} ${extraWeekdays.includes(namedWeekday) ? "is" : "is not"} one of the extra weekdays.`,
      ];

  return {
    observation: `${monthName(month)} ${year} starts on ${weekdayName(firstWeekday, "en-IN")} and has ${length} days.`,
    rule: `Every weekday occurs ${base} times. Only the extra weekdays occur once more.`,
    working,
    conclusion: String(answer),
    closestTrap: "Count extra weekdays from the first day of the month, not from the named weekday.",
  };
}

function freezeFiveTimesExplanation(pkg: CalendarQuestionPackage): StructuredCalendarExplanation {
  const year = requireNumber(pkg.facts.year, "year");
  const month = requireMonth(pkg.facts.month);
  const length = ordinalDaysInMonth(year, month);
  const firstWeekday = ordinalWeekday({ year, month, day: 1 });
  const extraCount = length % 7;
  const extras = weekdaySequence(firstWeekday, extraCount);

  return {
    observation: `${monthName(month)} ${year} starts on ${weekdayName(firstWeekday, "en-IN")} and has ${length} days.`,
    rule: "Every weekday occurs four times. The extra weekdays, starting from the first day of the month, occur a fifth time.",
    working: [
      `${length} = 4 × 7 + ${extraCount}.`,
      extraCount === 0
        ? "There are no extra weekdays, so no weekday occurs five times."
        : `The extra weekdays are ${joinEnglish(extras.map((value) => weekdayName(value, "en-IN")))}.`,
    ],
    conclusion: pkg.options[pkg.answerIndex]!.display,
    closestTrap: "Start the extra sequence from the weekday of the first date of the month.",
  };
}

function freezeYearFrequencyExplanation(pkg: CalendarQuestionPackage): StructuredCalendarExplanation {
  const year = requireNumber(pkg.facts.year, "year");
  const firstWeekday = ordinalWeekday({ year, month: 1, day: 1 });
  const length = ordinalDaysInMonth(year, 2) === 29 ? 366 : 365;
  const extraCount = length % 7;
  const extras = weekdaySequence(firstWeekday, extraCount);

  if (pkg.prototypeAuthority === "CAL-PQL-042") {
    const namedWeekday = requireWeekday(pkg.facts.namedWeekday, "named weekday");
    const named = weekdayName(namedWeekday, "en-IN");
    return {
      observation: `${year} has ${length} days and begins on ${weekdayName(firstWeekday, "en-IN")}.`,
      rule: "Every weekday occurs 52 times. The extra weekday or weekdays occur once more.",
      working: [
        `${length} = 52 × 7 + ${extraCount}.`,
        `The extra ${extraCount === 1 ? "weekday is" : "weekdays are"} ${joinEnglish(extras.map((value) => weekdayName(value, "en-IN")))}.`,
        `${named} ${extras.includes(namedWeekday) ? "is" : "is not"} extra.`,
      ],
      conclusion: String(pkg.canonicalAnswer),
      closestTrap: "Begin the extra sequence from 1 January.",
    };
  }

  return {
    observation: `${year} has ${length} days and begins on ${weekdayName(firstWeekday, "en-IN")}.`,
    rule: "Every weekday occurs 52 times. The extra weekday or weekdays occur 53 times.",
    working: [
      `${length} = 52 × 7 + ${extraCount}.`,
      `The ${extraCount === 1 ? "weekday occurring" : "weekdays occurring"} 53 times ${extraCount === 1 ? "is" : "are"} ${joinEnglish(extras.map((value) => weekdayName(value, "en-IN")))}.`,
    ],
    conclusion: pkg.options[pkg.answerIndex]!.display,
    closestTrap: "Begin the extra sequence from 1 January and use 366 days for a leap year.",
  };
}

export function finalizeCalendarEnglishStemSimplification(
  pkg: CalendarQuestionPackage,
): CalendarQuestionPackage {
  if (pkg.locale !== "en-IN") return pkg;

  let frozen: CalendarQuestionPackage = {
    ...pkg,
    explanation: naturaliseExplanation(pkg.explanation),
  };

  if (pkg.prototypeAuthority === "CAL-PQL-002") {
    const today = requireWeekday(pkg.facts.anchorWeekday, "anchor weekday");
    const days = Math.abs(requireNumber(pkg.facts.signedDayShift, "signed day shift"));
    frozen = {
      ...frozen,
      stem: `If today is ${weekdayName(today, "en-IN")}, what day was it ${days} days ago?`,
      stemTemplateId: `${pkg.stemTemplateId}-FREEZE-V2`,
    };
  }

  if (pkg.prototypeAuthority === "CAL-PQL-025") {
    const year = requireNumber(pkg.facts.year, "year");
    frozen = {
      ...frozen,
      stem: `How many odd days are there from year 1 through year ${year} in the Gregorian calendar?`,
      explanation: freezeOddDayExplanation(pkg),
    };
  }

  if (pkg.prototypeAuthority === "CAL-PQL-026") {
    frozen = {
      ...frozen,
      explanation: freezeOddDayExplanation(pkg),
    };
  }

  if (pkg.prototypeAuthority === "CAL-PQL-032") {
    const firstYear = requireNumber(pkg.facts.year, "first year");
    const secondYear = requireNumber(pkg.facts.secondYear, "second year");
    frozen = {
      ...frozen,
      stem: `Which option correctly explains whether ${firstYear} and ${secondYear} have the same calendar?`,
    };
  }

  if (pkg.prototypeAuthority === "CAL-PQL-033") {
    const year = requireNumber(pkg.facts.year, "year");
    const month = requireMonth(pkg.facts.month);
    frozen = {
      ...frozen,
      stem: `${monthName(month)} ${year} has the same calendar as ${monthName(month)} in which year?`,
      explanation: freezeMonthMatchExplanation(pkg),
    };
  }

  if (pkg.prototypeAuthority === "CAL-PQL-040") {
    frozen = {
      ...frozen,
      explanation: freezeMonthFrequencyExplanation(pkg),
    };
  }

  if (pkg.prototypeAuthority === "CAL-PQL-041") {
    const year = requireNumber(pkg.facts.year, "year");
    const month = requireMonth(pkg.facts.month);
    frozen = {
      ...frozen,
      stem: `Which weekdays occur five times in ${monthName(month)} ${year}?`,
      explanation: freezeFiveTimesExplanation(pkg),
    };
  }

  if (pkg.prototypeAuthority === "CAL-PQL-042" || pkg.prototypeAuthority === "CAL-PQL-043") {
    frozen = {
      ...frozen,
      ...(pkg.prototypeAuthority === "CAL-PQL-043"
        ? { stem: `Which weekdays occur 53 times in ${requireNumber(pkg.facts.year, "year")}?` }
        : {}),
      explanation: freezeYearFrequencyExplanation(pkg),
    };
  }

  return frozen;
}
