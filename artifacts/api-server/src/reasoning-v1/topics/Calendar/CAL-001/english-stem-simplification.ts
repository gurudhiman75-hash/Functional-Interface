import type {
  CalendarPrototypeId,
  CalendarQuestionPackage,
  GregorianDate,
  Month,
  Weekday,
} from "./types.ts";
import { formatDate, weekdayName } from "./runtime-shared.ts";

export const CAL_001_ENGLISH_STEM_SIMPLIFICATION_VERSION =
  "CAL_001_ENGLISH_STEM_SIMPLIFICATION_V1" as const;

export const CAL_001_SIMPLIFIED_ENGLISH_STEM_AUTHORITIES = [
  "CAL-PQL-003",
  "CAL-PQL-004",
  "CAL-PQL-006",
  "CAL-PQL-010",
  "CAL-PQL-011",
  "CAL-PQL-012",
  "CAL-PQL-013",
  "CAL-PQL-015",
  "CAL-PQL-016",
  "CAL-PQL-019",
  "CAL-PQL-021",
  "CAL-PQL-025",
  "CAL-PQL-026",
  "CAL-PQL-029",
  "CAL-PQL-030",
  "CAL-PQL-031",
  "CAL-PQL-032",
  "CAL-PQL-033",
  "CAL-PQL-034",
  "CAL-PQL-037",
  "CAL-PQL-038",
  "CAL-PQL-041",
  "CAL-PQL-043",
  "CAL-PQL-044",
] as const satisfies readonly CalendarPrototypeId[];

const SIMPLIFIED_AUTHORITIES = new Set<CalendarPrototypeId>(
  CAL_001_SIMPLIFIED_ENGLISH_STEM_AUTHORITIES,
);

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
    throw new Error(`CAL-001 English stem simplification: missing ${label}.`);
  }
  return value;
}

function requireDate(value: unknown, label: string): GregorianDate {
  if (
    !value
    || typeof value !== "object"
    || typeof (value as GregorianDate).year !== "number"
    || typeof (value as GregorianDate).month !== "number"
    || typeof (value as GregorianDate).day !== "number"
  ) {
    throw new Error(`CAL-001 English stem simplification: missing ${label}.`);
  }
  return value as GregorianDate;
}

function requireWeekday(value: unknown, label: string): Weekday {
  const weekday = requireNumber(value, label);
  if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6) {
    throw new Error(`CAL-001 English stem simplification: invalid ${label}.`);
  }
  return weekday as Weekday;
}

function requireMonth(value: unknown): Month {
  const month = requireNumber(value, "month");
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error("CAL-001 English stem simplification: invalid month.");
  }
  return month as Month;
}

function ordinal(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

function monthName(month: Month): string {
  return MONTH_NAMES[month - 1];
}

function simplifiedStem(pkg: CalendarQuestionPackage): string {
  const facts = pkg.facts;

  switch (pkg.prototypeAuthority) {
    case "CAL-PQL-003": {
      const days = Math.abs(requireNumber(facts.signedDayShift, "signed day shift"));
      const target = requireWeekday(facts.targetWeekday, "target weekday");
      return `If it is ${weekdayName(target, "en-IN")} after ${days} days, what day is it today?`;
    }
    case "CAL-PQL-004": {
      const today = requireWeekday(facts.anchorWeekday, "anchor weekday");
      const target = requireWeekday(facts.targetWeekday, "target weekday");
      return `Today is ${weekdayName(today, "en-IN")}. After how many days will it next be ${weekdayName(target, "en-IN")}?`;
    }
    case "CAL-PQL-006":
    case "CAL-PQL-010": {
      const anchorDate = requireDate(facts.anchorDate, "anchor date");
      const targetDate = requireDate(facts.targetDate, "target date");
      const anchorWeekday = requireWeekday(facts.anchorWeekday, "anchor weekday");
      return `If ${formatDate(anchorDate, "en-IN")} is ${weekdayName(anchorWeekday, "en-IN")}, what day is ${formatDate(targetDate, "en-IN")}?`;
    }
    case "CAL-PQL-011": {
      const anchorDate = requireDate(facts.anchorDate, "anchor date");
      const targetDate = requireDate(facts.targetDate, "target date");
      return `How many days after ${formatDate(anchorDate, "en-IN")} is ${formatDate(targetDate, "en-IN")}?`;
    }
    case "CAL-PQL-012": {
      const anchorDate = requireDate(facts.anchorDate, "anchor date");
      const targetDate = requireDate(facts.targetDate, "target date");
      if (facts.countSemantics === "INCLUSIVE_BOTH") {
        return `Counting both dates, how many days are there from ${formatDate(anchorDate, "en-IN")} to ${formatDate(targetDate, "en-IN")}?`;
      }
      if (facts.countSemantics === "EXCLUSIVE_BOTH") {
        return `Excluding both dates, how many days are there between ${formatDate(anchorDate, "en-IN")} and ${formatDate(targetDate, "en-IN")}?`;
      }
      throw new Error("CAL-001 English stem simplification: unsupported count semantics for CAL-PQL-012.");
    }
    case "CAL-PQL-013": {
      const anchorDate = requireDate(facts.anchorDate, "anchor date");
      const targetDate = requireDate(facts.targetDate, "target date");
      return `Does the period from ${formatDate(anchorDate, "en-IN")} to ${formatDate(targetDate, "en-IN")}, including both dates, include 29 February?`;
    }
    case "CAL-PQL-015": {
      const year = requireNumber(facts.year, "year");
      const nthDay = requireNumber(facts.nthDay, "numbered day");
      return `What day of the week is the ${ordinal(nthDay)} day of ${year}?`;
    }
    case "CAL-PQL-016": {
      const targetDate = requireDate(facts.targetDate, "target date");
      return `Which numbered day of the year is ${formatDate(targetDate, "en-IN")}?`;
    }
    case "CAL-PQL-019": {
      const anchorDate = requireDate(facts.anchorDate, "anchor date");
      const targetDate = requireDate(facts.targetDate, "target date");
      return `From ${formatDate(anchorDate, "en-IN")} to ${formatDate(targetDate, "en-IN")}, by how many days does the weekday move forward?`;
    }
    case "CAL-PQL-021": {
      const year = requireNumber(facts.year, "year");
      return `What type of year is ${year} under the Gregorian calendar?`;
    }
    case "CAL-PQL-025": {
      const year = requireNumber(facts.year, "year");
      return `How many odd days are there from year 1 to year ${year} in the Gregorian calendar?`;
    }
    case "CAL-PQL-026": {
      const years = requireNumber(facts.year, "year block");
      return `How many odd days are there in the first ${years} years of the Gregorian calendar?`;
    }
    case "CAL-PQL-029": {
      const year = requireNumber(facts.year, "year");
      return `Which next year has the same calendar as ${year}?`;
    }
    case "CAL-PQL-030": {
      const year = requireNumber(facts.year, "year");
      return `Which previous year has the same calendar as ${year}?`;
    }
    case "CAL-PQL-031": {
      const year = requireNumber(facts.year, "year");
      return `Which year has the same calendar as ${year}?`;
    }
    case "CAL-PQL-032": {
      const firstYear = requireNumber(facts.year, "first year");
      const secondYear = requireNumber(facts.secondYear, "second year");
      return `Do ${firstYear} and ${secondYear} have the same calendar? Choose the correct reason.`;
    }
    case "CAL-PQL-033": {
      const year = requireNumber(facts.year, "year");
      const month = requireMonth(facts.month);
      return `${monthName(month)} ${year} has the same calendar as ${monthName(month)} of which year?`;
    }
    case "CAL-PQL-034": {
      const year = requireNumber(facts.year, "year");
      const range = facts.yearRange;
      if (!range) throw new Error("CAL-001 English stem simplification: missing year range.");
      return `From ${range.start} to ${range.end}, how many years other than ${year} have the same calendar as ${year}?`;
    }
    case "CAL-PQL-037": {
      const year = requireNumber(facts.year, "year");
      const month = requireMonth(facts.month);
      const firstWeekday = requireWeekday(facts.anchorWeekday, "first weekday");
      return `${monthName(month)} ${year} begins on ${weekdayName(firstWeekday, "en-IN")}. On which day does the month end?`;
    }
    case "CAL-PQL-038": {
      const year = requireNumber(facts.year, "year");
      const month = requireMonth(facts.month);
      const lastWeekday = requireWeekday(facts.anchorWeekday, "last weekday");
      return `${monthName(month)} ${year} ends on ${weekdayName(lastWeekday, "en-IN")}. On which day does the month begin?`;
    }
    case "CAL-PQL-041": {
      const year = requireNumber(facts.year, "year");
      const month = requireMonth(facts.month);
      return `Which day or days occur five times in ${monthName(month)} ${year}?`;
    }
    case "CAL-PQL-043": {
      const year = requireNumber(facts.year, "year");
      return `Which day or days occur 53 times in ${year}?`;
    }
    case "CAL-PQL-044": {
      const anchorDate = requireDate(facts.anchorDate, "anchor date");
      const targetDate = requireDate(facts.targetDate, "target date");
      const namedWeekday = requireWeekday(facts.namedWeekday, "named weekday");
      return `How many ${weekdayName(namedWeekday, "en-IN")}s are there from ${formatDate(anchorDate, "en-IN")} to ${formatDate(targetDate, "en-IN")}, including both dates?`;
    }
    default:
      return pkg.stem;
  }
}

export function applyCalendarEnglishStemSimplification(
  pkg: CalendarQuestionPackage,
): CalendarQuestionPackage {
  if (pkg.locale !== "en-IN" || !SIMPLIFIED_AUTHORITIES.has(pkg.prototypeAuthority)) return pkg;

  return {
    ...pkg,
    stem: simplifiedStem(pkg),
    stemTemplateId: `${pkg.stemTemplateId}-SIMPLE-V1`,
  };
}
