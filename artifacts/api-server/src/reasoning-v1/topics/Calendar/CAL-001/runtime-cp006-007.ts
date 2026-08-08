import type {
  CalendarPrototypeId,
  Locale,
  MisconceptionId,
  Month,
} from "./types.ts";
import {
  DeterministicRandom,
  classifyLeapYear,
  countLeapYearsInclusive,
  countOrdinaryYearsInclusive,
  mod7,
  oddDayLeapYear,
  oddDaysInCompleteYears,
  ordinalDifference,
  ordinalLeapYear,
  ordinalWeekday,
  spanContainsFeb29,
  weekdayShift,
} from "./foundation.ts";
import {
  directLeapCount,
  displaySemantic,
  formatDate,
  makeExplanation,
  pickLeapYear,
  pickOrdinaryYear,
  t,
  weekdayName,
  type Problem,
} from "./runtime-shared.ts";
export function leapCenturyProblem(id: CalendarPrototypeId, seed: number, locale: Locale, rng: DeterministicRandom): Problem | null {
  if (!["CAL-PQL-021", "CAL-PQL-022", "CAL-PQL-023", "CAL-PQL-024", "CAL-PQL-025", "CAL-PQL-026", "CAL-PQL-027", "CAL-PQL-028"].includes(id)) return null;
  if (id === "CAL-PQL-021") {
    const categories = [rng.int(1801, 2199), rng.pick([1700, 1800, 1900, 2100, 2200, 2300]), rng.pick([1600, 2000]), pickLeapYear(rng)];
    const year = categories[seed % categories.length]!;
    const leap = ordinalLeapYear(year);
    const answer = year % 400 === 0 ? "LEAP_CENTURY_YEAR" : year % 100 === 0 ? "ORDINARY_CENTURY_YEAR" : leap ? "LEAP_YEAR" : "ORDINARY_YEAR";
    return {
      queryType: "CLASSIFY_YEAR", facts: { year, booleanAnswer: leap }, answer,
      groundTruth: { method: "LEAP_RULE", segments: [{ ordinalLeap: leap }], answer },
      teachingTrace: { method: "LEAP_RULE", segments: [{ divisibleBy400: year % 400 === 0 }, { divisibleBy100: year % 100 === 0 }, { divisibleBy4: year % 4 === 0 }], answer: year % 400 === 0 ? "LEAP_CENTURY_YEAR" : year % 100 === 0 ? "ORDINARY_CENTURY_YEAR" : oddDayLeapYear(year) ? "LEAP_YEAR" : "ORDINARY_YEAR" },
      stem: t(locale, `How should the year ${year} be classified under the Gregorian rule?`, `ग्रेगोरियन नियम के अनुसार वर्ष ${year} का सही वर्गीकरण क्या है?`, `ਗ੍ਰੇਗੋਰੀਅਨ ਨਿਯਮ ਅਨੁਸਾਰ ਸਾਲ ${year} ਦੀ ਸਹੀ ਵਰਗੀਕਰਨ ਕੀ ਹੈ?`),
      wrongs: [
        { value: "LEAP_YEAR", misconceptionId: "LEAP_EVERY_FOUR_YEARS_ONLY", derivation: { divisibilityBy4Only: true } },
        { value: "ORDINARY_CENTURY_YEAR", misconceptionId: "CENTURY_NEVER_LEAP", derivation: { allCenturiesOrdinary: true } },
        { value: "LEAP_CENTURY_YEAR", misconceptionId: "CENTURY_ALWAYS_LEAP", derivation: { allCenturiesLeap: true } },
        { value: "ORDINARY_YEAR", misconceptionId: "DIVISIBLE_BY_400_RULE_OMITTED", derivation: { omitted400Rule: true } },
      ],
      explanation: makeExplanation(locale, `Year ${year}`, "Check divisibility by 400, then 100, then 4.", [`Divisible by 400: ${year % 400 === 0}`, `Divisible by 100: ${year % 100 === 0}`, `Divisible by 4: ${year % 4 === 0}`], displaySemantic(answer, "CLASSIFICATION", locale)),
      coverage: { usesCenturyYear: year % 100 === 0, usesDivisibleBy400Year: year % 400 === 0 }, difficultyDimensions: { D5CenturyExposure: year % 100 === 0 },
    };
  }

  if (id === "CAL-PQL-022") {
    const targetLeap = seed % 2 === 0;
    const correctYear = targetLeap ? pickLeapYear(rng, 1600, 2399) : pickOrdinaryYear(rng, 1600, 2399);
    const optionsPool: number[] = [correctYear];
    while (optionsPool.length < 4) {
      const candidate = rng.int(1600, 2399);
      if (classifyLeapYear(candidate) !== targetLeap && !optionsPool.includes(candidate)) optionsPool.push(candidate);
    }
    return {
      queryType: targetLeap ? "SELECT_ONLY_LEAP_YEAR" : "SELECT_ONLY_ORDINARY_YEAR", facts: { year: correctYear, booleanAnswer: targetLeap, optionYears: optionsPool }, answer: correctYear,
      groundTruth: { method: "LEAP_RULE", segments: optionsPool.map((year) => ({ year, leap: ordinalLeapYear(year) })), answer: correctYear },
      teachingTrace: { method: "LEAP_RULE", segments: optionsPool.map((year) => ({ year, leap: oddDayLeapYear(year) })), answer: correctYear },
      stem: t(locale, `Which of the following is the only ${targetLeap ? "leap" : "ordinary"} year?`, `निम्न में से केवल कौन-सा ${targetLeap ? "अधिवर्ष" : "साधारण वर्ष"} है?`, `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕੇਵਲ ਕਿਹੜਾ ${targetLeap ? "ਲੀਪ ਸਾਲ" : "ਸਧਾਰਣ ਸਾਲ"} ਹੈ?`),
      wrongs: optionsPool.filter((year) => year !== correctYear).map((year, index) => ({ value: year, misconceptionId: (["LEAP_EVERY_FOUR_YEARS_ONLY", "CENTURY_ALWAYS_LEAP", "DIVISIBLE_BY_400_RULE_OMITTED"] as MisconceptionId[])[index]!, derivation: { year, actualLeap: ordinalLeapYear(year) } })),
      explanation: makeExplanation(locale, `Target class: ${targetLeap ? "leap" : "ordinary"}`, "Apply the 400/100/4 order to every option.", optionsPool.map((year) => `${year}: ${ordinalLeapYear(year) ? "leap" : "ordinary"}`), String(correctYear)),
      coverage: { usesCenturyYear: optionsPool.some((year) => year % 100 === 0), usesDivisibleBy400Year: optionsPool.some((year) => year % 400 === 0) },
    };
  }

  if (["CAL-PQL-023", "CAL-PQL-024", "CAL-PQL-028"].includes(id)) {
    const start = id === "CAL-PQL-028" ? rng.pick([1600, 1690, 1790, 1890, 1990, 2090]) : rng.int(1600, 2100);
    const end = Math.min(2399, start + rng.int(id === "CAL-PQL-028" ? 120 : 20, id === "CAL-PQL-028" ? 350 : 180));
    const leapCount = countLeapYearsInclusive(start, end);
    const answer = id === "CAL-PQL-024" ? countOrdinaryYearsInclusive(start, end) : leapCount;
    const direct = directLeapCount(start, end);
    const query = id === "CAL-PQL-024" ? "COUNT_ORDINARY_YEARS" : id === "CAL-PQL-028" ? "COUNT_LEAP_YEARS_WITH_CENTURY_EXCEPTION" : "COUNT_LEAP_YEARS";
    return {
      queryType: query, facts: { yearRange: { start, end, inclusive: true } }, answer,
      groundTruth: { method: "LEAP_RULE", segments: [{ formulaLeapCount: leapCount }, { totalYears: end - start + 1 }], answer },
      teachingTrace: { method: "LEAP_RULE", segments: [{ directLeapCount: direct }, { directOrdinaryCount: end - start + 1 - direct }], answer: id === "CAL-PQL-024" ? end - start + 1 - direct : direct },
      stem: t(locale, `How many ${id === "CAL-PQL-024" ? "ordinary" : "leap"} years are there from ${start} to ${end}, including both years?`, `${start} से ${end} तक, दोनों वर्षों सहित, कितने ${id === "CAL-PQL-024" ? "साधारण वर्ष" : "अधिवर्ष"} हैं?`, `${start} ਤੋਂ ${end} ਤੱਕ, ਦੋਵੇਂ ਸਾਲਾਂ ਸਮੇਤ, ਕਿੰਨੇ ${id === "CAL-PQL-024" ? "ਸਧਾਰਣ ਸਾਲ" : "ਲੀਪ ਸਾਲ"} ਹਨ?`),
      wrongs: [
        { value: Math.floor(end / 4) - Math.floor((start - 1) / 4), misconceptionId: "LEAP_EVERY_FOUR_YEARS_ONLY", derivation: { ignoredCenturyRules: true } },
        { value: answer + 1, misconceptionId: "CENTURY_ALWAYS_LEAP", derivation: { addedCentury: true } },
        { value: Math.max(0, answer - 1), misconceptionId: "DIVISIBLE_BY_400_RULE_OMITTED", derivation: { omitted400Year: true } },
      ],
      explanation: makeExplanation(locale, `Inclusive range ${start}–${end}`, "Count multiples of 4, subtract multiples of 100, and add multiples of 400; ordinary years are the remainder.", [`Total years = ${end - start + 1}`, `Leap years = ${leapCount}`, `Required count = ${answer}`], String(answer)),
      coverage: { crossesCentury: Math.floor(start / 100) !== Math.floor(end / 100), usesCenturyYear: true, usesDivisibleBy400Year: Math.ceil(start / 400) * 400 <= end }, difficultyDimensions: { D5CenturyExposure: id === "CAL-PQL-028", D1ArithmeticSegments: 3 },
    };
  }

  if (id === "CAL-PQL-025") {
    const years = rng.int(1, 1200);
    const answer = oddDaysInCompleteYears(years);
    const start = { year: 1, month: 1 as Month, day: 1 };
    const end = { year: years + 1, month: 1 as Month, day: 1 };
    const ordinalAnswer = mod7(ordinalDifference(start, end));
    return {
      queryType: "ODD_DAYS_IN_COMPLETE_YEARS", facts: { year: years }, answer,
      groundTruth: { method: "ORDINAL", segments: [{ exactDays: ordinalDifference(start, end) }], answer: ordinalAnswer },
      teachingTrace: { method: "ODD_DAY", segments: [{ completeYears: years }, { oddDays: answer }], answer },
      stem: t(locale, `How many odd days are there in ${years} complete Gregorian years?`, `${years} पूर्ण ग्रेगोरियन वर्षों में कितने विषम दिन हैं?`, `${years} ਪੂਰੇ ਗ੍ਰੇਗੋਰੀਅਨ ਸਾਲਾਂ ਵਿੱਚ ਕਿੰਨੇ ਵਿਸ਼ਮ ਦਿਨ ਹਨ?`),
      wrongs: [
        { value: mod7(years), misconceptionId: "LEAP_YEAR_AS_ONE_ODD_DAY", derivation: { allYearsOneOddDay: true } },
        { value: mod7(2 * years), misconceptionId: "ORDINARY_YEAR_AS_TWO_ODD_DAYS", derivation: { allYearsTwoOddDays: true } },
        { value: Math.min(6, answer + 1), misconceptionId: "FAILED_MOD7_REDUCTION", derivation: { reductionOffset: 1 } },
      ],
      explanation: makeExplanation(locale, `${years} complete years`, "Ordinary years contribute 1 odd day, leap years 2, and every complete 400-year block contributes 0 modulo 7.", [`Odd days modulo 7 = ${answer}`], String(answer)),
      difficultyDimensions: { D1ArithmeticSegments: 3, D5CenturyExposure: years >= 100 },
    };
  }

  if (id === "CAL-PQL-026") {
    const years = rng.pick([100, 200, 300, 400]);
    const answer = oddDaysInCompleteYears(years);
    const expected: Record<number, number> = { 100: 5, 200: 3, 300: 1, 400: 0 };
    return {
      queryType: "CENTURY_BLOCK_ODD_DAYS", facts: { year: years }, answer,
      groundTruth: { method: "ORDINAL", segments: [{ exactDays: ordinalDifference({ year: 1, month: 1, day: 1 }, { year: years + 1, month: 1, day: 1 }) }], answer: expected[years]! },
      teachingTrace: { method: "ODD_DAY", segments: [{ blockYears: years }, { reducedOddDays: answer }], answer },
      stem: t(locale, `How many odd days are there in ${years} complete Gregorian years?`, `${years} पूर्ण ग्रेगोरियन वर्षों में कितने विषम दिन हैं?`, `${years} ਪੂਰੇ ਗ੍ਰੇਗੋਰੀਅਨ ਸਾਲਾਂ ਵਿੱਚ ਕਿੰਨੇ ਵਿਸ਼ਮ ਦਿਨ ਹਨ?`),
      wrongs: [
        { value: mod7(answer + 1), misconceptionId: "CENTURY_BLOCK_OFFSET_ERROR", derivation: { offset: 1 } },
        { value: mod7(years / 100), misconceptionId: "CENTURY_ALWAYS_LEAP", derivation: { treatedCenturyAsLeap: true } },
        { value: mod7(answer + (years === 400 ? 2 : 3)), misconceptionId: "DIVISIBLE_BY_400_RULE_OMITTED", derivation: { omitted400Exception: true } },
      ],
      explanation: makeExplanation(locale, `${years}-year block`, "Use the Gregorian century reductions 100→5, 200→3, 300→1, 400→0, verified by exact day count.", [`Result = ${answer} odd day(s)`], String(answer)),
      coverage: { crossesCentury: true, usesCenturyYear: true, usesDivisibleBy400Year: years === 400 }, difficultyDimensions: { D5CenturyExposure: true },
    };
  }

  const century = rng.pick([1700, 1800, 1900, 2000, 2100, 2200, 2300]);
  const start = { year: century - 1, month: 12 as Month, day: rng.int(20, 31) };
  const end = { year: century, month: 3 as Month, day: rng.int(1, 15) };
  const startWeekday = ordinalWeekday(start);
  const answer = ordinalWeekday(end);
  const gap = ordinalDifference(start, end);
  return {
    queryType: "WEEKDAY_ACROSS_CENTURY_BOUNDARY", facts: { anchorDate: start, targetDate: end, anchorWeekday: startWeekday, signedDayShift: gap }, answer,
    groundTruth: { method: "ORDINAL", segments: [{ exactGap: gap }, { centuryYearLeap: ordinalLeapYear(century) }], answer },
    teachingTrace: { method: "ODD_DAY", segments: [{ centuryYear: century }, { divisibleBy400: century % 400 === 0 }, { gap }], answer: weekdayShift(startWeekday, gap) },
    stem: t(locale, `If ${formatDate(start, locale)} was ${weekdayName(startWeekday, locale)}, what day was ${formatDate(end, locale)}?`, `यदि ${formatDate(start, locale)} को ${weekdayName(startWeekday, locale)} था, तो ${formatDate(end, locale)} को कौन-सा वार था?`, `ਜੇ ${formatDate(start, locale)} ਨੂੰ ${weekdayName(startWeekday, locale)} ਸੀ, ਤਾਂ ${formatDate(end, locale)} ਨੂੰ ਕਿਹੜਾ ਵਾਰ ਸੀ?`),
    wrongs: [
      { value: weekdayShift(startWeekday, gap + (century % 400 === 0 ? -1 : 1)), misconceptionId: century % 400 === 0 ? "CENTURY_NEVER_LEAP" : "CENTURY_ALWAYS_LEAP", derivation: { wrongCenturyStatus: true } },
      { value: weekdayShift(startWeekday, gap - 1), misconceptionId: "DIVISIBLE_BY_400_RULE_OMITTED", derivation: { omittedCenturyException: true } },
      { value: weekdayShift(startWeekday, -gap), misconceptionId: "FORWARD_BACKWARD_REVERSAL", derivation: { reversedDirection: true } },
    ],
    explanation: makeExplanation(locale, `Century year ${century}`, "A century year is leap only when divisible by 400.", [`${century} divisible by 400: ${century % 400 === 0}`, `Exact shift = ${gap}`, `Remainder = ${gap % 7}`], weekdayName(answer, locale)),
    coverage: { crossesYear: true, crossesCentury: true, usesCenturyYear: true, usesDivisibleBy400Year: century % 400 === 0, crossesFeb29: spanContainsFeb29(start, end) }, difficultyDimensions: { D5CenturyExposure: true, D4LeapDayExposure: true },
  };
}
