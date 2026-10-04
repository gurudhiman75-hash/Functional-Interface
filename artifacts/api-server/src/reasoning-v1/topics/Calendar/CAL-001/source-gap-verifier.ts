import {
  countLeapYearsInclusive,
  isValidGregorianDate,
  mod7,
  ordinalDaysInMonth,
  ordinalDifference,
  ordinalWeekday,
  semanticKey,
} from "./foundation.ts";
import type { GregorianDate, Month, Weekday } from "./types.ts";
import type {
  CalendarSourceGapAnswer,
  CalendarSourceGapQuestion,
} from "./source-gap-runtime.ts";

export const CAL_001_SOURCE_GAP_INDEPENDENT_PROOF_AUTHORITY =
  "CAL_001_SOURCE_GAP_INDEPENDENT_PROOF_2026_10_04" as const;

function sameDateRecurrenceYear(date: GregorianDate): number {
  const targetWeekday = ordinalWeekday(date);
  for (let year = date.year + 1; year <= date.year + 60; year += 1) {
    const candidate: GregorianDate = { year, month: date.month, day: date.day };
    if (!isValidGregorianDate(candidate)) continue;
    if (
      mod7(ordinalDifference(date, candidate)) === 0
      && ordinalWeekday(candidate) === targetWeekday
    ) return year;
  }
  throw new Error("Calendar source-gap verifier could not find recurrence within 60 years.");
}

function datesForWeekday(year: number, month: Month, weekday: Weekday): number[] {
  const first = ordinalWeekday({ year, month, day: 1 });
  const firstDate = 1 + mod7(weekday - first);
  const length = ordinalDaysInMonth(year, month);
  const dates: number[] = [];
  for (let day = firstDate; day <= length; day += 7) dates.push(day);
  return dates;
}

export function independentlyVerifyCalendarSourceGapQuestion(
  question: CalendarSourceGapQuestion,
): CalendarSourceGapAnswer {
  const facts = question.facts;

  if (question.prototypeAuthority === "CAL-GAP-PROT-001") {
    const date = facts.date as GregorianDate | undefined;
    if (!date || !isValidGregorianDate(date)) {
      throw new Error(`${question.prototypeAuthority}: verifier requires a valid date fact`);
    }
    return sameDateRecurrenceYear(date);
  }

  if (question.prototypeAuthority === "CAL-GAP-PROT-002") {
    const year = Number(facts.year);
    const month = Number(facts.month) as Month;
    const namedWeekday = Number(facts.namedWeekday) as Weekday;
    if (!Number.isInteger(year) || month < 1 || month > 12 || namedWeekday < 0 || namedWeekday > 6) {
      throw new Error(`${question.prototypeAuthority}: verifier received invalid month/weekday facts`);
    }
    return datesForWeekday(year, month, namedWeekday);
  }

  const range = facts.yearRange as { start?: number; end?: number; inclusive?: boolean } | undefined;
  if (
    !range
    || !Number.isInteger(range.start)
    || !Number.isInteger(range.end)
    || range.inclusive !== true
  ) {
    throw new Error(`${question.prototypeAuthority}: verifier requires an inclusive integer year range`);
  }
  return countLeapYearsInclusive(range.start!, range.end!);
}

export function assertCalendarSourceGapIntegrity(
  question: CalendarSourceGapQuestion,
): void {
  const verified = independentlyVerifyCalendarSourceGapQuestion(question);
  if (semanticKey(verified) !== semanticKey(question.canonicalAnswer)) {
    throw new Error(
      `${question.prototypeAuthority} seed ${question.seed}: independent source-gap verifier mismatch (${semanticKey(verified)} vs ${semanticKey(question.canonicalAnswer)})`,
    );
  }

  if (
    question.optionValues.length !== 4
    || new Set(question.optionValues.map((value) => semanticKey(value))).size !== 4
    || question.answerIndex < 0
    || question.answerIndex > 3
    || semanticKey(question.optionValues[question.answerIndex]!) !== semanticKey(verified)
  ) {
    throw new Error(
      `${question.prototypeAuthority} seed ${question.seed}: source-gap option/answer integrity failed`,
    );
  }

  if (
    question.options.length !== 4
    || new Set(question.options).size !== 4
    || question.options[question.answerIndex] !== question.explanation.conclusion
  ) {
    throw new Error(
      `${question.prototypeAuthority} seed ${question.seed}: source-gap display answer integrity failed`,
    );
  }
}
