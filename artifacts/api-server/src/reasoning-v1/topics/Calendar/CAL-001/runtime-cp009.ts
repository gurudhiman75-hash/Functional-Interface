import type {
  CalendarPrototypeId,
  Locale,
  Month,
} from "./types.ts";
import {
  DeterministicRandom,
  mod7,
  ordinalDaysInMonth,
  ordinalLeapYear,
  ordinalWeekday,
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
export function boundaryProblem(id: CalendarPrototypeId, seed: number, locale: Locale, rng: DeterministicRandom): Problem | null {
  if (!["CAL-PQL-035", "CAL-PQL-036", "CAL-PQL-037", "CAL-PQL-038", "CAL-PQL-039"].includes(id)) return null;
  if (["CAL-PQL-035", "CAL-PQL-036", "CAL-PQL-037", "CAL-PQL-038", "CAL-PQL-039"].includes(id)) {
    const year = rng.int(1800, 2199);
    if (id === "CAL-PQL-035" || id === "CAL-PQL-036") {
      const first = ordinalWeekday({ year, month: 1, day: 1 });
      const last = ordinalWeekday({ year, month: 12, day: 31 });
      const forward = id === "CAL-PQL-035";
      const answer = forward ? last : first;
      const length = ordinalLeapYear(year) ? 366 : 365;
      return {
        queryType: forward ? "LAST_WEEKDAY_FROM_FIRST_YEAR" : "FIRST_WEEKDAY_FROM_LAST_YEAR", facts: { year, anchorWeekday: forward ? first : last, targetWeekday: answer }, answer,
        groundTruth: { method: "ORDINAL", segments: [{ first }, { last }], answer },
        teachingTrace: { method: "MOD7_SHIFT", segments: [{ length }, { shift: forward ? length - 1 : -(length - 1) }], answer: weekdayShift(forward ? first : last, forward ? length - 1 : -(length - 1)) },
        stem: forward
          ? t(locale, `If 1 January ${year} was ${weekdayName(first, locale)}, what day was 31 December ${year}?`, `यदि 1 जनवरी ${year} को ${weekdayName(first, locale)} था, तो 31 दिसंबर ${year} को कौन-सा वार था?`, `ਜੇ 1 ਜਨਵਰੀ ${year} ਨੂੰ ${weekdayName(first, locale)} ਸੀ, ਤਾਂ 31 ਦਸੰਬਰ ${year} ਨੂੰ ਕਿਹੜਾ ਵਾਰ ਸੀ?`)
          : t(locale, `If 31 December ${year} was ${weekdayName(last, locale)}, what day was 1 January ${year}?`, `यदि 31 दिसंबर ${year} को ${weekdayName(last, locale)} था, तो 1 जनवरी ${year} को कौन-सा वार था?`, `ਜੇ 31 ਦਸੰਬਰ ${year} ਨੂੰ ${weekdayName(last, locale)} ਸੀ, ਤਾਂ 1 ਜਨਵਰੀ ${year} ਨੂੰ ਕਿਹੜਾ ਵਾਰ ਸੀ?`),
        wrongs: [
          { value: weekdayShift(forward ? first : last, forward ? length : -length), misconceptionId: "FIRST_LAST_DAY_OFF_BY_ONE", derivation: { usedShift: forward ? length : -length } },
          { value: weekdayShift(forward ? first : last, forward ? length - 2 : -(length - 2)), misconceptionId: "COUNTED_ANCHOR_AS_DAY_ONE", derivation: { usedShift: forward ? length - 2 : -(length - 2) } },
          { value: weekdayShift(forward ? first : last, forward ? length + 1 : -(length + 1)), misconceptionId: "SHIFT_BY_N_PLUS_ONE", derivation: { usedShift: forward ? length + 1 : -(length + 1) } },
          { value: weekdayShift(forward ? first : last, forward ? -(length - 1) : length - 1), misconceptionId: "FORWARD_BACKWARD_REVERSAL", derivation: { reversedDirection: true } },
          { value: mod7(answer + (ordinalLeapYear(year) ? -1 : 1)), misconceptionId: ordinalLeapYear(year) ? "FREQUENCY_USED_365_FOR_LEAP_YEAR" : "FREQUENCY_USED_366_FOR_ORDINARY_YEAR", derivation: { wrongYearLength: true } },
        ],
        explanation: makeExplanation(locale, `${year} has ${length} days.`, "From first to last, shift by length − 1; reverse with the negative of the same shift.", [`Shift = ${length - 1}`, `Remainder = ${(length - 1) % 7}`], weekdayName(answer, locale)),
        coverage: { usesBackwardMovement: !forward }, difficultyDimensions: { D2ReverseReasoning: !forward },
      };
    }

    const month = rng.int(1, 12) as Month;
    const length = ordinalDaysInMonth(year, month);
    const first = ordinalWeekday({ year, month, day: 1 });
    const last = ordinalWeekday({ year, month, day: length });
    if (id === "CAL-PQL-037" || id === "CAL-PQL-038") {
      const forward = id === "CAL-PQL-037";
      const answer = forward ? last : first;
      return {
        queryType: forward ? "LAST_WEEKDAY_FROM_FIRST_MONTH" : "FIRST_WEEKDAY_FROM_LAST_MONTH", facts: { year, month, anchorWeekday: forward ? first : last, targetWeekday: answer }, answer,
        groundTruth: { method: "ORDINAL", segments: [{ first }, { last }], answer },
        teachingTrace: { method: "MOD7_SHIFT", segments: [{ monthLength: length }, { shift: forward ? length - 1 : -(length - 1) }], answer: weekdayShift(forward ? first : last, forward ? length - 1 : -(length - 1)) },
        stem: forward
          ? t(locale, `The first day of ${monthName(month, locale)} ${year} was ${weekdayName(first, locale)}. What was the weekday on its last day?`, `${monthName(month, locale)} ${year} का पहला दिन ${weekdayName(first, locale)} था। अंतिम दिन कौन-सा वार था?`, `${monthName(month, locale)} ${year} ਦਾ ਪਹਿਲਾ ਦਿਨ ${weekdayName(first, locale)} ਸੀ। ਆਖ਼ਰੀ ਦਿਨ ਕਿਹੜਾ ਵਾਰ ਸੀ?`)
          : t(locale, `The last day of ${monthName(month, locale)} ${year} was ${weekdayName(last, locale)}. What was the weekday on its first day?`, `${monthName(month, locale)} ${year} का अंतिम दिन ${weekdayName(last, locale)} था। पहला दिन कौन-सा वार था?`, `${monthName(month, locale)} ${year} ਦਾ ਆਖ਼ਰੀ ਦਿਨ ${weekdayName(last, locale)} ਸੀ। ਪਹਿਲਾ ਦਿਨ ਕਿਹੜਾ ਵਾਰ ਸੀ?`),
        wrongs: [
          { value: weekdayShift(forward ? first : last, forward ? length : -length), misconceptionId: "FIRST_LAST_DAY_OFF_BY_ONE", derivation: { usedLengthNotLengthMinusOne: true } },
          { value: mod7(answer + (length === 31 ? -1 : 1)), misconceptionId: length === 31 ? "WRONG_MONTH_LENGTH_30_FOR_31" : "WRONG_MONTH_LENGTH_31_FOR_30", derivation: { wrongMonthLength: true } },
          { value: mod7(answer + 2), misconceptionId: month === 2 && ordinalLeapYear(year) ? "FEBRUARY_ALWAYS_28" : "FEBRUARY_ALWAYS_29", derivation: { wrongFebruaryLength: true } },
        ],
        explanation: makeExplanation(locale, `${monthName(month, locale)} ${year} has ${length} days.`, "First-to-last movement is length − 1 days; reverse uses the negative shift.", [`Shift = ${length - 1}`, `Remainder = ${(length - 1) % 7}`], weekdayName(answer, locale)),
        coverage: { usesBackwardMovement: !forward }, difficultyDimensions: { D2ReverseReasoning: !forward },
      };
    }

    const targetDay = rng.int(2, length - 1);
    const targetDate = { year, month, day: targetDay };
    const useFirst = seed % 2 === 0;
    const anchorWeekday = useFirst ? first : last;
    const signedShift = useFirst ? targetDay - 1 : -(length - targetDay);
    const answer = ordinalWeekday(targetDate);
    return {
      queryType: "SPECIFIED_DATE_FROM_MONTH_BOUNDARY", facts: { targetDate, year, month, anchorWeekday, signedDayShift: signedShift }, answer,
      groundTruth: { method: "ORDINAL", segments: [{ targetDate, weekday: answer }], answer },
      teachingTrace: { method: "MOD7_SHIFT", segments: [{ boundary: useFirst ? "FIRST" : "LAST" }, { signedShift }], answer: weekdayShift(anchorWeekday, signedShift) },
      stem: useFirst
        ? t(locale, `The first day of ${monthName(month, locale)} ${year} was ${weekdayName(first, locale)}. What day was ${formatDate(targetDate, locale)}?`, `${monthName(month, locale)} ${year} का पहला दिन ${weekdayName(first, locale)} था। ${formatDate(targetDate, locale)} को कौन-सा वार था?`, `${monthName(month, locale)} ${year} ਦਾ ਪਹਿਲਾ ਦਿਨ ${weekdayName(first, locale)} ਸੀ। ${formatDate(targetDate, locale)} ਨੂੰ ਕਿਹੜਾ ਵਾਰ ਸੀ?`)
        : t(locale, `The last day of ${monthName(month, locale)} ${year} was ${weekdayName(last, locale)}. What day was ${formatDate(targetDate, locale)}?`, `${monthName(month, locale)} ${year} का अंतिम दिन ${weekdayName(last, locale)} था। ${formatDate(targetDate, locale)} को कौन-सा वार था?`, `${monthName(month, locale)} ${year} ਦਾ ਆਖ਼ਰੀ ਦਿਨ ${weekdayName(last, locale)} ਸੀ। ${formatDate(targetDate, locale)} ਨੂੰ ਕਿਹੜਾ ਵਾਰ ਸੀ?`),
      wrongs: [
        { value: weekdayShift(anchorWeekday, signedShift + (signedShift >= 0 ? 1 : -1)), misconceptionId: "FIRST_LAST_DAY_OFF_BY_ONE", derivation: { shiftOffset: 1 } },
        { value: weekdayShift(anchorWeekday, -signedShift), misconceptionId: "FORWARD_BACKWARD_REVERSAL", derivation: { reversedDirection: true } },
        { value: weekdayShift(anchorWeekday, signedShift + (signedShift >= 0 ? -1 : 1)), misconceptionId: "COUNTED_ANCHOR_AS_DAY_ONE", derivation: { countedBoundaryAsDayOne: true } },
      ],
      explanation: makeExplanation(locale, useFirst ? "First-day anchor" : "Last-day anchor", "Use date − 1 from the first day or month length − date from the last day.", [`Signed shift = ${signedShift}`, `Remainder = ${mod7(signedShift)}`], weekdayName(answer, locale)),
      coverage: { usesBackwardMovement: !useFirst }, difficultyDimensions: { D2ReverseReasoning: !useFirst },
    };
  }

  return null;
}
