import type { CalendarQuestionPackage, GregorianDate, Month, SemanticValue, Weekday } from "./types.ts";
import {
  absoluteDayGap,
  addDays,
  countLeapYearsInclusive,
  countOrdinaryYearsInclusive,
  dayOfYear,
  fullYearCalendarsMatch,
  inclusiveDateCount,
  interveningDays,
  matchingFullYearsInRange,
  mod7,
  monthCalendarsMatch,
  nextMatchingFullYear,
  oddDaysInCompleteYears,
  ordinalDaysInMonth,
  ordinalLeapYear,
  ordinalWeekday,
  previousMatchingFullYear,
  semanticKey,
  spanContainsFeb29,
  weekdayFrequencyInInclusiveRange,
  weekdayFrequencyInMonth,
  weekdayFrequencyInYear,
  weekdayShift,
} from "./foundation.ts";

function requireDate(value: GregorianDate | undefined, label: string): GregorianDate {
  if (!value) throw new Error(`Verifier requires ${label}.`);
  return value;
}

function requireWeekday(value: Weekday | undefined, label: string): Weekday {
  if (value === undefined) throw new Error(`Verifier requires ${label}.`);
  return value;
}

function classifyYear(year: number): string {
  if (year % 400 === 0) return "LEAP_CENTURY_YEAR";
  if (year % 100 === 0) return "ORDINARY_CENTURY_YEAR";
  return ordinalLeapYear(year) ? "LEAP_YEAR" : "ORDINARY_YEAR";
}

export function independentlyVerifyCalendarQuestion(pkg: CalendarQuestionPackage): SemanticValue {
  const f = pkg.facts;
  const id = pkg.prototypeAuthority;

  switch (id) {
    case "CAL-PQL-001": return weekdayShift(requireWeekday(f.anchorWeekday, "anchorWeekday"), Number(f.signedDayShift));
    case "CAL-PQL-002": return weekdayShift(requireWeekday(f.anchorWeekday, "anchorWeekday"), Number(f.signedDayShift));
    case "CAL-PQL-003": return weekdayShift(requireWeekday(f.targetWeekday, "targetWeekday"), -Number(f.signedDayShift));
    case "CAL-PQL-004": {
      const start = requireWeekday(f.anchorWeekday, "anchorWeekday");
      const target = requireWeekday(f.targetWeekday, "targetWeekday");
      const remainder = mod7(target - start);
      return remainder === 0 ? 7 : remainder;
    }
    case "CAL-PQL-005": case "CAL-PQL-006": case "CAL-PQL-007": case "CAL-PQL-010": case "CAL-PQL-014": case "CAL-PQL-017": case "CAL-PQL-018": case "CAL-PQL-027": case "CAL-PQL-039":
      return ordinalWeekday(requireDate(f.targetDate, "targetDate"));
    case "CAL-PQL-008": case "CAL-PQL-011": return absoluteDayGap(requireDate(f.anchorDate, "anchorDate"), requireDate(f.targetDate, "targetDate"));
    case "CAL-PQL-009": return addDays(requireDate(f.anchorDate, "anchorDate"), Number(f.signedDayShift));
    case "CAL-PQL-012": {
      const a = requireDate(f.anchorDate, "anchorDate");
      const b = requireDate(f.targetDate, "targetDate");
      return f.countSemantics === "INCLUSIVE_BOTH" ? inclusiveDateCount(a, b) : interveningDays(a, b);
    }
    case "CAL-PQL-013": return spanContainsFeb29(requireDate(f.anchorDate, "anchorDate"), requireDate(f.targetDate, "targetDate")) ? "YES_CONTAINS_LEAP_DAY" : "NO_LEAP_DAY_IN_SPAN";
    case "CAL-PQL-015": return ordinalWeekday(requireDate(f.targetDate, "targetDate"));
    case "CAL-PQL-016": return dayOfYear(requireDate(f.targetDate, "targetDate"));
    case "CAL-PQL-019": return mod7(Number(f.signedDayShift));
    case "CAL-PQL-020": return ordinalWeekday(requireDate(f.anchorDate, "anchorDate"));
    case "CAL-PQL-021": return classifyYear(Number(f.year));
    case "CAL-PQL-022": {
      const targetLeap = Boolean(f.booleanAnswer);
      const options = f.optionYears as number[];
      const matches = options.filter((year) => ordinalLeapYear(year) === targetLeap);
      if (matches.length !== 1) throw new Error("PQL-022 does not have exactly one matching year.");
      return matches[0]!;
    }
    case "CAL-PQL-023": case "CAL-PQL-028": {
      const range = f.yearRange!;
      return countLeapYearsInclusive(range.start, range.end);
    }
    case "CAL-PQL-024": {
      const range = f.yearRange!;
      return countOrdinaryYearsInclusive(range.start, range.end);
    }
    case "CAL-PQL-025": case "CAL-PQL-026": return oddDaysInCompleteYears(Number(f.year));
    case "CAL-PQL-029": return nextMatchingFullYear(Number(f.year));
    case "CAL-PQL-030": return previousMatchingFullYear(Number(f.year));
    case "CAL-PQL-031": {
      const year = Number(f.year);
      const options = f.optionYears as number[];
      const matches = options.filter((candidate) => fullYearCalendarsMatch(year, candidate));
      if (matches.length !== 1) throw new Error("PQL-031 does not have exactly one match.");
      return matches[0]!;
    }
    case "CAL-PQL-032": {
      const a = Number(f.year);
      const b = Number(f.secondYear);
      const sameStart = ordinalWeekday({ year: a, month: 1, day: 1 }) === ordinalWeekday({ year: b, month: 1, day: 1 });
      const sameLeap = ordinalLeapYear(a) === ordinalLeapYear(b);
      return sameStart && sameLeap ? "IDENTICAL_FULL_YEAR_CALENDARS" : !sameStart && !sameLeap ? "BOTH_CONDITIONS_FAIL" : sameStart ? "DIFFERENT_LEAP_STATUS" : "DIFFERENT_START_WEEKDAY";
    }
    case "CAL-PQL-033": {
      const year = Number(f.year);
      const month = Number(f.month) as Month;
      const options = f.optionYears as number[];
      const matches = options.filter((candidate) => monthCalendarsMatch(year, month, candidate, month));
      if (matches.length !== 1) throw new Error("PQL-033 does not have exactly one month match.");
      return matches[0]!;
    }
    case "CAL-PQL-034": {
      const range = f.yearRange!;
      return matchingFullYearsInRange(Number(f.year), range.start, range.end).length;
    }
    case "CAL-PQL-035": return ordinalWeekday({ year: Number(f.year), month: 12, day: 31 });
    case "CAL-PQL-036": return ordinalWeekday({ year: Number(f.year), month: 1, day: 1 });
    case "CAL-PQL-037": return ordinalWeekday({ year: Number(f.year), month: Number(f.month) as Month, day: ordinalDaysInMonth(Number(f.year), Number(f.month) as Month) });
    case "CAL-PQL-038": return ordinalWeekday({ year: Number(f.year), month: Number(f.month) as Month, day: 1 });
    case "CAL-PQL-040": return weekdayFrequencyInMonth(Number(f.year), Number(f.month) as Month)[requireWeekday(f.namedWeekday, "namedWeekday")];
    case "CAL-PQL-041": {
      const frequency = weekdayFrequencyInMonth(Number(f.year), Number(f.month) as Month);
      return Object.entries(frequency).filter(([, count]) => count === 5).map(([weekday]) => Number(weekday) as Weekday);
    }
    case "CAL-PQL-042": return weekdayFrequencyInYear(Number(f.year))[requireWeekday(f.namedWeekday, "namedWeekday")];
    case "CAL-PQL-043": {
      const frequency = weekdayFrequencyInYear(Number(f.year));
      return Object.entries(frequency).filter(([, count]) => count === 53).map(([weekday]) => Number(weekday) as Weekday);
    }
    case "CAL-PQL-044": return weekdayFrequencyInInclusiveRange(requireDate(f.anchorDate, "anchorDate"), requireDate(f.targetDate, "targetDate"))[requireWeekday(f.namedWeekday, "namedWeekday")];
  }
}

export function assertCalendarPackageIntegrity(pkg: CalendarQuestionPackage): void {
  const verified = independentlyVerifyCalendarQuestion(pkg);
  if (semanticKey(verified) !== semanticKey(pkg.canonicalAnswer)) {
    throw new Error(`${pkg.prototypeAuthority} seed ${pkg.seed}: independent verifier mismatch (${semanticKey(verified)} vs ${semanticKey(pkg.canonicalAnswer)}).`);
  }
  if (!pkg.crossCheck.passed || semanticKey(pkg.groundTruth.answer) !== semanticKey(pkg.teachingTrace.answer)) {
    throw new Error(`${pkg.prototypeAuthority} seed ${pkg.seed}: cross-check is not proven.`);
  }
  if (pkg.options.length !== 4 || new Set(pkg.options.map((option) => semanticKey(option.semanticValue))).size !== 4) {
    throw new Error(`${pkg.prototypeAuthority} seed ${pkg.seed}: semantic option uniqueness failed.`);
  }
  if (pkg.options.filter((option) => option.isCorrect).length !== 1 || !pkg.options[pkg.answerIndex]?.isCorrect) {
    throw new Error(`${pkg.prototypeAuthority} seed ${pkg.seed}: exact-one-answer proof failed.`);
  }
  const lifecycle = pkg.lifecycle;
  if (pkg.permanentQlId !== null || lifecycle.permanentQlId !== null || lifecycle.active || lifecycle.questionStudioDiscoverable || lifecycle.questionBankStored || lifecycle.questionBankWritable || lifecycle.testEligible || lifecycle.publiclyPublishable) {
    throw new Error(`${pkg.prototypeAuthority} seed ${pkg.seed}: lifecycle lock violation.`);
  }
}
