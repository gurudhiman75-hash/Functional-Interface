import type {
  CalendarPrototypeId,
  Locale,
  Month,
  Weekday,
} from "./types.ts";
import {
  DeterministicRandom,
  addDays,
  inclusiveDateCount,
  mod7,
  ordinalDaysInMonth,
  ordinalLeapYear,
  ordinalWeekday,
  spanContainsFeb29,
  weekdayFrequencyInInclusiveRange,
  weekdayFrequencyInMonth,
  weekdayFrequencyInYear,
} from "./foundation.ts";
import {
  formatDate,
  formatWeekdaySet,
  makeExplanation,
  monthName,
  randomDate,
  t,
  weekdayName,
  type Problem,
} from "./runtime-shared.ts";
export function frequencyProblem(id: CalendarPrototypeId, _seed: number, locale: Locale, rng: DeterministicRandom): Problem | null {
  if (!["CAL-PQL-040", "CAL-PQL-041", "CAL-PQL-042", "CAL-PQL-043", "CAL-PQL-044"].includes(id)) return null;
  if (["CAL-PQL-040", "CAL-PQL-041", "CAL-PQL-042", "CAL-PQL-043"].includes(id)) {
    const year = rng.int(1800, 2199);
    if (id === "CAL-PQL-040" || id === "CAL-PQL-041") {
      const month = rng.int(1, 12) as Month;
      const frequency = weekdayFrequencyInMonth(year, month);
      const first = ordinalWeekday({ year, month, day: 1 });
      const length = ordinalDaysInMonth(year, month);
      if (id === "CAL-PQL-040") {
        const named = rng.int(0, 6) as Weekday;
        const answer = frequency[named];
        let enumerated = 0;
        for (let day = 1; day <= length; day++) if (ordinalWeekday({ year, month, day }) === named) enumerated++;
        return {
          queryType: "COUNT_NAMED_WEEKDAY_IN_MONTH", facts: { year, month, namedWeekday: named }, answer,
          groundTruth: { method: "ORDINAL", segments: [{ enumerated }], answer: enumerated },
          teachingTrace: { method: "FREQUENCY_RULE", segments: [{ completeWeeks: Math.floor(length / 7) }, { extraDays: length % 7 }, { firstWeekday: first }], answer },
          stem: t(locale, `How many ${weekdayName(named, locale)}s are there in ${monthName(month, locale)} ${year}?`, `${monthName(month, locale)} ${year} में कितने ${weekdayName(named, locale)} हैं?`, `${monthName(month, locale)} ${year} ਵਿੱਚ ਕਿੰਨੇ ${weekdayName(named, locale)} ਹਨ?`),
          wrongs: [
            { value: frequency[mod7(named + 1)], misconceptionId: "FREQUENCY_EXTRA_DAYS_FROM_WRONG_START", derivation: { shiftedStart: 1 } },
            { value: Math.floor(length / 7), misconceptionId: "FIRST_LAST_DAY_OFF_BY_ONE", derivation: { ignoredExtras: true } },
            { value: Math.ceil(length / 7), misconceptionId: length === 31 ? "WRONG_MONTH_LENGTH_30_FOR_31" : "FEBRUARY_ALWAYS_28", derivation: { assumedAllExtra: true } },
            { value: Math.max(0, Math.floor(length / 7) - 1), misconceptionId: "FAILED_MOD7_REDUCTION", derivation: { completeWeeksUsed: Math.max(0, Math.floor(length / 7) - 1) } },
            { value: Math.ceil(length / 7) + 1, misconceptionId: "FIRST_LAST_DAY_OFF_BY_ONE", derivation: { countedIncompleteWeekAndBoundaryTwice: true } },
          ],
          explanation: makeExplanation(locale, `${monthName(month, locale)} ${year}: ${length} days, starts ${weekdayName(first, locale)}`, "Write the month as complete weeks plus extra days; extras begin from the first weekday.", [`${length} = 7 × ${Math.floor(length / 7)} + ${length % 7}`, `${weekdayName(named, locale)} occurs ${answer} times`], String(answer)),
        };
      }
      const answer = Object.entries(frequency).filter(([, count]) => count === 5).map(([weekday]) => Number(weekday) as Weekday);
      const wrongStart = mod7(first + 1);
      const wrongFrequency = (() => {
        const result: Weekday[] = [];
        for (let i = 0; i < length % 7; i++) result.push(mod7(wrongStart + i));
        return result.sort((a, b) => a - b);
      })();
      return {
        queryType: "WEEKDAYS_OCCURRING_FIVE_TIMES_MONTH", facts: { year, month }, answer,
        groundTruth: { method: "ORDINAL", segments: [{ frequency }], answer },
        teachingTrace: { method: "FREQUENCY_RULE", segments: [{ completeWeeks: Math.floor(length / 7) }, { extraWeekdays: answer }], answer },
        stem: t(locale, `Which weekday(s) occur five times in ${monthName(month, locale)} ${year}?`, `${monthName(month, locale)} ${year} में कौन-सा/से वार पाँच बार आते हैं?`, `${monthName(month, locale)} ${year} ਵਿੱਚ ਕਿਹੜਾ/ਕਿਹੜੇ ਵਾਰ ਪੰਜ ਵਾਰ ਆਉਂਦੇ ਹਨ?`),
        wrongs: [
          { value: wrongFrequency, misconceptionId: "FREQUENCY_EXTRA_DAYS_FROM_WRONG_START", derivation: { wrongStart } },
          { value: Array.from({ length: length % 7 }, (_, index) => mod7(first - 1 + index)).sort((a, b) => a - b), misconceptionId: "FREQUENCY_EXTRA_DAYS_FROM_WRONG_START", derivation: { shiftedStart: -1 } },
          { value: answer.slice(0, Math.max(0, answer.length - 1)), misconceptionId: "FIRST_LAST_DAY_OFF_BY_ONE", derivation: { omittedLastExtra: true } },
          { value: [...new Set([...answer, mod7(first + length % 7)])] as Weekday[], misconceptionId: "WRONG_MONTH_LENGTH_31_FOR_30", derivation: { addedExtraDay: true } },
          { value: [first], misconceptionId: "FEBRUARY_ALWAYS_29", derivation: { assumedFebruaryLength: 29 } },
          { value: [first, mod7(first + 1)], misconceptionId: "WRONG_MONTH_LENGTH_31_FOR_30", derivation: { assumedPeriodLength: 30 } },
          { value: [first, mod7(first + 1), mod7(first + 2)], misconceptionId: "WRONG_MONTH_LENGTH_30_FOR_31", derivation: { assumedPeriodLength: 31 } },
        ],
        explanation: makeExplanation(locale, `${length} days beginning ${weekdayName(first, locale)}`, "The extra weekdays after complete weeks are exactly those occurring five times.", [`Complete weeks = ${Math.floor(length / 7)}`, `Extra days = ${length % 7}`, `Five-time weekday set = ${formatWeekdaySet(answer, locale) || "none"}`], formatWeekdaySet(answer, locale) || "None"),
      };
    }

    const frequency = weekdayFrequencyInYear(year);
    const first = ordinalWeekday({ year, month: 1, day: 1 });
    const length = ordinalLeapYear(year) ? 366 : 365;
    if (id === "CAL-PQL-042") {
      const named = rng.int(0, 6) as Weekday;
      const answer = frequency[named];
      let enumerated = 0;
      for (let day = 1; day <= length; day++) if (ordinalWeekday(addDays({ year, month: 1, day: 1 }, day - 1)) === named) enumerated++;
      return {
        queryType: "COUNT_NAMED_WEEKDAY_IN_YEAR", facts: { year, namedWeekday: named }, answer,
        groundTruth: { method: "ORDINAL", segments: [{ enumerated }], answer: enumerated },
        teachingTrace: { method: "FREQUENCY_RULE", segments: [{ completeWeeks: 52 }, { extraDays: length - 364 }, { firstWeekday: first }], answer },
        stem: t(locale, `How many ${weekdayName(named, locale)}s are there in the year ${year}?`, `वर्ष ${year} में कितने ${weekdayName(named, locale)} हैं?`, `ਸਾਲ ${year} ਵਿੱਚ ਕਿੰਨੇ ${weekdayName(named, locale)} ਹਨ?`),
        wrongs: [
          { value: frequency[mod7(named + 1)], misconceptionId: "FREQUENCY_EXTRA_DAYS_FROM_WRONG_START", derivation: { shiftedStart: 1 } },
          { value: 52, misconceptionId: ordinalLeapYear(year) ? "FREQUENCY_USED_365_FOR_LEAP_YEAR" : "FREQUENCY_USED_366_FOR_ORDINARY_YEAR", derivation: { ignoredExtras: true } },
          { value: 53, misconceptionId: "FREQUENCY_EXTRA_DAYS_FROM_WRONG_START", derivation: { assumedNamedIsExtra: true } },
          { value: 51, misconceptionId: "FAILED_MOD7_REDUCTION", derivation: { completeWeeksUsed: 51 } },
          { value: 54, misconceptionId: "FIRST_LAST_DAY_OFF_BY_ONE", derivation: { countedExtraBoundaryWeek: true } },
        ],
        explanation: makeExplanation(locale, `${year}: ${length} days, starts ${weekdayName(first, locale)}`, "Every weekday occurs 52 times; the first one or two weekdays occur once more.", [`Extra days = ${length - 364}`, `${weekdayName(named, locale)} occurs ${answer} times`], String(answer)),
      };
    }
    const answer = Object.entries(frequency).filter(([, count]) => count === 53).map(([weekday]) => Number(weekday) as Weekday);
    const wrongStartSet = Array.from({ length: length - 364 }, (_, index) => mod7(first + index + 1)).sort((a, b) => a - b);
    return {
      queryType: "WEEKDAYS_OCCURRING_53_TIMES_YEAR", facts: { year }, answer,
      groundTruth: { method: "ORDINAL", segments: [{ frequency }], answer },
      teachingTrace: { method: "FREQUENCY_RULE", segments: [{ length }, { firstWeekday: first }, { extraWeekdays: answer }], answer },
      stem: t(locale, `Which weekday(s) occur 53 times in the year ${year}?`, `वर्ष ${year} में कौन-सा/से वार 53 बार आते हैं?`, `ਸਾਲ ${year} ਵਿੱਚ ਕਿਹੜਾ/ਕਿਹੜੇ ਵਾਰ 53 ਵਾਰ ਆਉਂਦੇ ਹਨ?`),
      wrongs: [
        { value: wrongStartSet, misconceptionId: "FREQUENCY_EXTRA_DAYS_FROM_WRONG_START", derivation: { shiftedStart: 1 } },
        { value: Array.from({ length: length - 364 }, (_, index) => mod7(first - 1 + index)).sort((a, b) => a - b), misconceptionId: "FREQUENCY_EXTRA_DAYS_FROM_WRONG_START", derivation: { shiftedStart: -1 } },
        { value: [first], misconceptionId: "FREQUENCY_USED_365_FOR_LEAP_YEAR", derivation: { forcedOneExtra: true } },
        { value: [first, mod7(first + 1)], misconceptionId: "FREQUENCY_USED_366_FOR_ORDINARY_YEAR", derivation: { forcedTwoExtras: true } },
      ],
      explanation: makeExplanation(locale, `${year}: ${length} days`, "365 days give one extra weekday; 366 days give two consecutive extra weekdays, beginning on 1 January.", [`1 January: ${weekdayName(first, locale)}`, `53-time set: ${formatWeekdaySet(answer, locale)}`], formatWeekdaySet(answer, locale)),
    };
  }

  const start = randomDate(rng);
  const end = addDays(start, rng.int(14, 400));
  const named = rng.int(0, 6) as Weekday;
  const frequency = weekdayFrequencyInInclusiveRange(start, end);
  const answer = frequency[named];
  let enumerated = 0;
  for (let offset = 0; offset < inclusiveDateCount(start, end); offset++) if (ordinalWeekday(addDays(start, offset)) === named) enumerated++;
  return {
    queryType: "COUNT_WEEKDAY_IN_INCLUSIVE_RANGE", facts: { anchorDate: start, targetDate: end, namedWeekday: named, countSemantics: "INCLUSIVE_BOTH" }, answer,
    groundTruth: { method: "ORDINAL", segments: [{ enumerated }], answer: enumerated },
    teachingTrace: { method: "FREQUENCY_RULE", segments: [{ length: inclusiveDateCount(start, end) }, { startWeekday: ordinalWeekday(start) }, { frequency }], answer },
    stem: t(locale, `Including both dates, how many ${weekdayName(named, locale)}s occur from ${formatDate(start, locale)} to ${formatDate(end, locale)}?`, `दोनों तिथियों सहित, ${formatDate(start, locale)} से ${formatDate(end, locale)} तक कितने ${weekdayName(named, locale)} आते हैं?`, `ਦੋਵੇਂ ਤਾਰੀਖਾਂ ਸਮੇਤ, ${formatDate(start, locale)} ਤੋਂ ${formatDate(end, locale)} ਤੱਕ ਕਿੰਨੇ ${weekdayName(named, locale)} ਆਉਂਦੇ ਹਨ?`),
    wrongs: [
      { value: weekdayFrequencyInInclusiveRange(addDays(start, 1), end)[named], misconceptionId: "EXCLUDED_BOTH_DATES", derivation: { excludedStart: true } },
      { value: weekdayFrequencyInInclusiveRange(start, addDays(end, -1))[named], misconceptionId: "OMITTED_TARGET_DATE", derivation: { excludedEnd: true } },
      { value: frequency[mod7(named + 1)], misconceptionId: "FREQUENCY_EXTRA_DAYS_FROM_WRONG_START", derivation: { shiftedNamedWeekday: true } },
      { value: Math.max(0, answer - 1), misconceptionId: "FAILED_MOD7_REDUCTION", derivation: { usedOneFewerCompleteWeekOccurrence: true } },
      { value: answer + 1, misconceptionId: "INCLUDED_BOTH_DATES", derivation: { countedOneBoundaryOccurrenceWithoutCheckingWeekday: true } },
      { value: answer + 2, misconceptionId: "FIRST_LAST_DAY_OFF_BY_ONE", derivation: { countedBothBoundaryDatesAsOccurrences: true } },
    ],
    explanation: makeExplanation(locale, `Inclusive range length = ${inclusiveDateCount(start, end)}`, "Split the inclusive length into complete weeks and extra days beginning from the start weekday.", [`Start weekday = ${weekdayName(ordinalWeekday(start), locale)}`, `Complete weeks = ${Math.floor(inclusiveDateCount(start, end) / 7)}`, `Required count = ${answer}`], String(answer)),
    coverage: { crossesMonth: start.month !== end.month, crossesYear: start.year !== end.year, crossesFeb29: spanContainsFeb29(start, end), usesInclusiveCounting: true }, difficultyDimensions: { D6CountInterpretation: true, D1ArithmeticSegments: 3 },
  };
}
