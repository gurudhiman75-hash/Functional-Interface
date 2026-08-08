import type {
  CalendarPrototypeId,
  Locale,
  Month,
} from "./types.ts";
import {
  DeterministicRandom,
  dateFromDayOfYear,
  dayOfYear,
  mod7,
  oddDayWeekday,
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
  randomDate,
  t,
  weekdayName,
  type Problem,
} from "./runtime-shared.ts";
export function absoluteAndYearProblem(id: CalendarPrototypeId, seed: number, locale: Locale, rng: DeterministicRandom): Problem | null {
  if (!["CAL-PQL-014", "CAL-PQL-015", "CAL-PQL-016", "CAL-PQL-017", "CAL-PQL-018", "CAL-PQL-019", "CAL-PQL-020"].includes(id)) return null;

  if (id === "CAL-PQL-014") {
    const date = seed % 5 === 0 ? { year: rng.pick([1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300]), month: rng.int(1, 12) as Month, day: 1 } : randomDate(rng, 1600, 2399);
    const answer = ordinalWeekday(date);
    const teaching = oddDayWeekday(date);
    return {
      queryType: "ABSOLUTE_GREGORIAN_WEEKDAY", facts: { targetDate: date }, answer,
      groundTruth: { method: "ORDINAL", segments: [{ date, weekday: answer }], answer },
      teachingTrace: { method: "ODD_DAY", segments: [teaching.trace as unknown as Record<string, unknown>], answer: teaching.weekday },
      stem: t(locale, `What day of the week was ${formatDate(date, locale)}?`, `${formatDate(date, locale)} को सप्ताह का कौन-सा दिन था?`, `${formatDate(date, locale)} ਨੂੰ ਹਫ਼ਤੇ ਦਾ ਕਿਹੜਾ ਦਿਨ ਸੀ?`),
      wrongs: [
        { value: mod7(answer - 1), misconceptionId: "LEAP_YEAR_AS_ONE_ODD_DAY", derivation: { weekdayOffset: -1 } },
        { value: mod7(answer + 1), misconceptionId: "ORDINARY_YEAR_AS_TWO_ODD_DAYS", derivation: { weekdayOffset: 1 } },
        { value: mod7(answer + 2), misconceptionId: "CENTURY_BLOCK_OFFSET_ERROR", derivation: { weekdayOffset: 2 } },
      ],
      explanation: makeExplanation(locale, formatDate(date, locale), "Reduce complete 400-year blocks, then add remaining year, month and day contributions.", [`Complete 400-year blocks: ${teaching.trace.complete400YearBlocks}`, `Remaining ordinary years: ${teaching.trace.ordinaryYears}`, `Remaining leap years: ${teaching.trace.leapYears}`, `Month/day contribution: ${teaching.trace.daysBeforeMonth + teaching.trace.dayOffset}`, `Total odd days: ${teaching.trace.totalOddDays}`], weekdayName(answer, locale)),
      coverage: { usesCenturyYear: date.year % 100 === 0, usesDivisibleBy400Year: date.year % 400 === 0 }, difficultyDimensions: { D1ArithmeticSegments: 4, D5CenturyExposure: date.year % 100 === 0 },
    };
  }

  if (id === "CAL-PQL-015") {
    const year = rng.int(1800, 2199);
    const length = ordinalLeapYear(year) ? 366 : 365;
    const nthDay = rng.int(2, length);
    const date = dateFromDayOfYear(year, nthDay);
    const answer = ordinalWeekday(date);
    const jan1 = ordinalWeekday({ year, month: 1, day: 1 });
    return {
      queryType: "WEEKDAY_OF_NTH_DAY", facts: { year, nthDay, targetDate: date, anchorWeekday: jan1 }, answer,
      groundTruth: { method: "ORDINAL", segments: [{ dateFromDayOfYear: date }], answer },
      teachingTrace: { method: "MOD7_SHIFT", segments: [{ jan1 }, { shift: nthDay - 1 }], answer: weekdayShift(jan1, nthDay - 1) },
      stem: t(locale, `Which weekday was the ${nthDay}${nthDay % 10 === 1 ? "st" : nthDay % 10 === 2 ? "nd" : nthDay % 10 === 3 ? "rd" : "th"} day of ${year}?`, `${year} का ${nthDay}वाँ दिन कौन-सा वार था?`, `${year} ਦਾ ${nthDay}ਵਾਂ ਦਿਨ ਕਿਹੜਾ ਵਾਰ ਸੀ?`),
      wrongs: [
        { value: weekdayShift(jan1, nthDay), misconceptionId: "COUNTED_ANCHOR_AS_DAY_ONE", derivation: { shift: nthDay } },
        { value: weekdayShift(jan1, nthDay - 2), misconceptionId: "SHIFT_BY_N_MINUS_ONE", derivation: { shift: nthDay - 2 } },
        { value: mod7(answer + (ordinalLeapYear(year) && nthDay > 59 ? -1 : 2)), misconceptionId: "FREQUENCY_USED_365_FOR_LEAP_YEAR", derivation: { ignoredLeapDay: ordinalLeapYear(year) && nthDay > 59 } },
      ],
      explanation: makeExplanation(locale, `1 January ${year}: ${weekdayName(jan1, locale)}`, "The nth day is shifted by n − 1 days from 1 January.", [`Shift = ${nthDay} − 1 = ${nthDay - 1}`, `${nthDay - 1} mod 7 = ${(nthDay - 1) % 7}`], weekdayName(answer, locale)),
    };
  }

  if (id === "CAL-PQL-016") {
    const date = randomDate(rng);
    const answer = dayOfYear(date);
    const direct = ordinalDifference({ year: date.year, month: 1, day: 1 }, date) + 1;
    return {
      queryType: "DATE_TO_DAY_OF_YEAR", facts: { targetDate: date, nthDay: answer }, answer,
      groundTruth: { method: "ORDINAL", segments: [{ jan1ToDateDifference: direct - 1 }], answer: direct },
      teachingTrace: { method: "DATE_SPAN", segments: [{ completeMonthDays: answer - date.day }, { dayInMonth: date.day }], answer },
      stem: t(locale, `${formatDate(date, locale)} is which numbered day of ${date.year}?`, `${formatDate(date, locale)}, वर्ष ${date.year} का कौन-सा क्रमांकित दिन है?`, `${formatDate(date, locale)}, ਸਾਲ ${date.year} ਦਾ ਕਿਹੜੇ ਨੰਬਰ ਦਾ ਦਿਨ ਹੈ?`),
      wrongs: [
        { value: answer - 1, misconceptionId: "COUNTED_ANCHOR_AS_DAY_ONE", derivation: { omittedCurrentDate: true } },
        { value: answer + 1, misconceptionId: "OMITTED_TARGET_DATE", derivation: { addedExtraTarget: true } },
        { value: Math.max(1, answer + (ordinalLeapYear(date.year) && date.month > 2 ? -1 : 2)), misconceptionId: "FEBRUARY_ALWAYS_28", derivation: { assumedFebruary28: true } },
      ],
      explanation: makeExplanation(locale, formatDate(date, locale), "Add verified lengths of all complete preceding months, then add the date number.", [`Complete preceding-month days = ${answer - date.day}`, `Add ${date.day}`, `Day number = ${answer}`], String(answer)),
    };
  }

  if (["CAL-PQL-017", "CAL-PQL-018", "CAL-PQL-019", "CAL-PQL-020"].includes(id)) {
    const year = rng.int(1800, 2188);
    const month = rng.pick([1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) as Month;
    const day = rng.int(1, Math.min(28, ordinalDaysInMonth(year, month)));
    const spanYears = id === "CAL-PQL-017" ? 1 : rng.int(2, 10);
    const forward = id !== "CAL-PQL-020" && (id !== "CAL-PQL-017" || seed % 2 === 0);
    const yearA = forward ? year : year + spanYears;
    const yearB = forward ? year + spanYears : year;
    const dateA = { year: yearA, month, day };
    const dateB = { year: yearB, month, day };
    const weekdayA = ordinalWeekday(dateA);
    const weekdayB = ordinalWeekday(dateB);
    const signed = ordinalDifference(dateA, dateB);

    if (id === "CAL-PQL-017") {
      const answer = weekdayB;
      const direction = yearB > yearA ? "next" : "previous";
      return {
        queryType: "SAME_DATE_ADJACENT_YEAR", facts: { anchorDate: dateA, targetDate: dateB, anchorWeekday: weekdayA, signedDayShift: signed }, answer,
        groundTruth: { method: "ORDINAL", segments: [{ dateB, weekdayB }], answer },
        teachingTrace: { method: "ODD_DAY", segments: [{ completeYearShift: mod7(signed) }], answer: weekdayShift(weekdayA, signed) },
        stem: t(locale, `${formatDate(dateA, locale)} was ${weekdayName(weekdayA, locale)}. What weekday was the same date in the ${direction} year?`, `${formatDate(dateA, locale)} को ${weekdayName(weekdayA, locale)} था। ${direction === "next" ? "अगले" : "पिछले"} वर्ष में इसी तिथि को कौन-सा वार था?`, `${formatDate(dateA, locale)} ਨੂੰ ${weekdayName(weekdayA, locale)} ਸੀ। ${direction === "next" ? "ਅਗਲੇ" : "ਪਿਛਲੇ"} ਸਾਲ ਇਸੇ ਤਾਰੀਖ ਨੂੰ ਕਿਹੜਾ ਵਾਰ ਸੀ?`),
        wrongs: [
          { value: weekdayShift(weekdayA, signed > 0 ? 1 : -1), misconceptionId: "LEAP_YEAR_AS_ONE_ODD_DAY", derivation: { assumedEveryYearOrdinary: true } },
          { value: weekdayShift(weekdayA, signed > 0 ? 2 : -2), misconceptionId: "ORDINARY_YEAR_AS_TWO_ODD_DAYS", derivation: { assumedEveryYearLeap: true } },
          { value: weekdayShift(weekdayA, -signed), misconceptionId: "FORWARD_BACKWARD_REVERSAL", derivation: { reversedDirection: true } },
          { value: weekdayShift(weekdayA, signed + (signed > 0 ? -1 : 1)), misconceptionId: "COUNTED_ANCHOR_AS_DAY_ONE", derivation: { usedShift: signed + (signed > 0 ? -1 : 1) } },
          { value: weekdayShift(weekdayA, signed + (signed > 0 ? 1 : -1)), misconceptionId: "SHIFT_BY_N_PLUS_ONE", derivation: { usedShift: signed + (signed > 0 ? 1 : -1) } },
        ],
        explanation: makeExplanation(locale, `${formatDate(dateA, locale)} → ${formatDate(dateB, locale)}`, "A completed ordinary year shifts by 1 weekday and a completed leap year by 2, with date position handled by the exact span.", [`Exact shift = ${signed} days`, `Odd-day shift = ${mod7(signed)}`], weekdayName(answer, locale)),
        coverage: { crossesYear: true, crossesFeb29: spanContainsFeb29(dateA, dateB), usesBackwardMovement: signed < 0 },
      };
    }

    if (id === "CAL-PQL-018") {
      const answer = weekdayB;
      return {
        queryType: "MULTI_YEAR_WEEKDAY_MOVEMENT", facts: { anchorDate: dateA, targetDate: dateB, anchorWeekday: weekdayA, signedDayShift: signed }, answer,
        groundTruth: { method: "ORDINAL", segments: [{ signedDayDifference: signed }], answer },
        teachingTrace: { method: "ODD_DAY", segments: [{ oddDayRemainder: mod7(signed) }], answer: weekdayShift(weekdayA, signed) },
        stem: t(locale, `If ${formatDate(dateA, locale)} was ${weekdayName(weekdayA, locale)}, what day was ${formatDate(dateB, locale)}?`, `यदि ${formatDate(dateA, locale)} को ${weekdayName(weekdayA, locale)} था, तो ${formatDate(dateB, locale)} को कौन-सा वार था?`, `ਜੇ ${formatDate(dateA, locale)} ਨੂੰ ${weekdayName(weekdayA, locale)} ਸੀ, ਤਾਂ ${formatDate(dateB, locale)} ਨੂੰ ਕਿਹੜਾ ਵਾਰ ਸੀ?`),
        wrongs: [
          { value: weekdayShift(weekdayA, yearB - yearA), misconceptionId: "LEAP_YEAR_AS_ONE_ODD_DAY", derivation: { treatedAllYearsOrdinary: true } },
          { value: weekdayShift(weekdayA, 2 * (yearB - yearA)), misconceptionId: "ORDINARY_YEAR_AS_TWO_ODD_DAYS", derivation: { treatedAllYearsLeap: true } },
          { value: weekdayShift(weekdayA, -signed), misconceptionId: "FORWARD_BACKWARD_REVERSAL", derivation: { reversedDirection: true } },
        ],
        explanation: makeExplanation(locale, `${spanYears} calendar-year span`, "Count each complete year by Gregorian type, then reduce the total modulo 7.", [`Exact signed days = ${signed}`, `Remainder = ${mod7(signed)}`], weekdayName(answer, locale)),
        coverage: { crossesYear: true, crossesFeb29: spanContainsFeb29(dateA, dateB) }, difficultyDimensions: { D1ArithmeticSegments: spanYears, D4LeapDayExposure: true },
      };
    }

    if (id === "CAL-PQL-019") {
      const janA = { year: yearA, month: 1 as Month, day: 1 };
      const janB = { year: yearB, month: 1 as Month, day: 1 };
      const answer = mod7(ordinalDifference(janA, janB));
      return {
        queryType: "FIRST_DAY_YEAR_OFFSET", facts: { anchorDate: janA, targetDate: janB, signedDayShift: ordinalDifference(janA, janB) }, answer,
        groundTruth: { method: "ORDINAL", segments: [{ exactDays: ordinalDifference(janA, janB) }], answer },
        teachingTrace: { method: "ODD_DAY", segments: [{ ordinaryLeapAccumulation: answer }], answer },
        stem: t(locale, `By how many weekdays does 1 January ${yearB} move forward from 1 January ${yearA}?`, `1 जनवरी ${yearA} की तुलना में 1 जनवरी ${yearB} कितने वार आगे बढ़ता है?`, `1 ਜਨਵਰੀ ${yearA} ਦੇ ਮੁਕਾਬਲੇ 1 ਜਨਵਰੀ ${yearB} ਕਿੰਨੇ ਵਾਰ ਅੱਗੇ ਵਧਦਾ ਹੈ?`),
        wrongs: [
          { value: mod7(yearB - yearA), misconceptionId: "LEAP_YEAR_AS_ONE_ODD_DAY", derivation: { allOrdinary: true } },
          { value: mod7(2 * (yearB - yearA)), misconceptionId: "ORDINARY_YEAR_AS_TWO_ODD_DAYS", derivation: { allLeap: true } },
          { value: mod7(answer + 1), misconceptionId: "FAILED_MOD7_REDUCTION", derivation: { offset: 1 } },
        ],
        explanation: makeExplanation(locale, `1 January ${yearA} → 1 January ${yearB}`, "Add one odd day for each ordinary year and two for each leap year, then reduce modulo 7.", [`Net weekday offset = ${answer}`], String(answer)),
        coverage: { crossesYear: true },
      };
    }

    const answer = weekdayA;
    return {
      queryType: "RECOVER_EARLIER_CROSS_YEAR_WEEKDAY", facts: { anchorDate: dateA, targetDate: dateB, targetWeekday: weekdayB, signedDayShift: signed }, answer,
      groundTruth: { method: "ORDINAL", segments: [{ earlierWeekday: weekdayA }], answer },
      teachingTrace: { method: "ODD_DAY", segments: [{ reverseShift: -signed }], answer: weekdayShift(weekdayB, -signed) },
      stem: t(locale, `${formatDate(dateB, locale)} was ${weekdayName(weekdayB, locale)}. What day was ${formatDate(dateA, locale)}?`, `${formatDate(dateB, locale)} को ${weekdayName(weekdayB, locale)} था। ${formatDate(dateA, locale)} को कौन-सा वार था?`, `${formatDate(dateB, locale)} ਨੂੰ ${weekdayName(weekdayB, locale)} ਸੀ। ${formatDate(dateA, locale)} ਨੂੰ ਕਿਹੜਾ ਵਾਰ ਸੀ?`),
      wrongs: [
        { value: weekdayShift(weekdayB, signed), misconceptionId: "FORWARD_BACKWARD_REVERSAL", derivation: { usedForwardShift: true } },
        { value: weekdayShift(weekdayB, -(yearB - yearA)), misconceptionId: "LEAP_YEAR_AS_ONE_ODD_DAY", derivation: { allOrdinary: true } },
        { value: weekdayShift(weekdayB, -2 * (yearB - yearA)), misconceptionId: "ORDINARY_YEAR_AS_TWO_ODD_DAYS", derivation: { allLeap: true } },
      ],
      explanation: makeExplanation(locale, `${formatDate(dateB, locale)} → ${formatDate(dateA, locale)}`, "Reverse the verified cross-year odd-day shift.", [`Signed span = ${signed}`, `Reverse remainder = ${mod7(-signed)}`], weekdayName(answer, locale)),
      coverage: { crossesYear: true, usesBackwardMovement: true }, difficultyDimensions: { D2ReverseReasoning: true, D8InverseReasoning: true },
    };
  }

  return null;
}
