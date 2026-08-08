import type {
  CalendarPrototypeId,
  Locale,
  Month,
} from "./types.ts";
import {
  DeterministicRandom,
  absoluteDayGap,
  inclusiveDateCount,
  interveningDays,
  oddDayLeapYear,
  ordinalDifference,
  ordinalWeekday,
  spanContainsFeb29,
  weekdayShift,
} from "./foundation.ts";
import {
  displaySemantic,
  formatDate,
  makeExplanation,
  pickLeapYear,
  t,
  weekdayName,
  type Problem,
} from "./runtime-shared.ts";
export function leapBoundaryProblem(id: CalendarPrototypeId, seed: number, locale: Locale, rng: DeterministicRandom): Problem | null {
  if (!["CAL-PQL-010", "CAL-PQL-011", "CAL-PQL-012", "CAL-PQL-013"].includes(id)) return null;
  const leapYear = pickLeapYear(rng, 1804, 2196);
  if (id === "CAL-PQL-010") {
    const anchorDate = { year: leapYear, month: 2 as Month, day: rng.int(20, 28) };
    const targetDate = { year: leapYear, month: 3 as Month, day: rng.int(1, 12) };
    const gap = ordinalDifference(anchorDate, targetDate);
    const anchorWeekday = ordinalWeekday(anchorDate);
    const answer = ordinalWeekday(targetDate);
    return {
      queryType: "WEEKDAY_ACROSS_FEB29", facts: { anchorDate, targetDate, anchorWeekday, signedDayShift: gap }, answer,
      groundTruth: { method: "ORDINAL", segments: [{ crosses: "29 February" }, { gap }], answer },
      teachingTrace: { method: "DATE_SPAN", segments: [{ februaryLength: 29 }, { gap }], answer: weekdayShift(anchorWeekday, gap) },
      stem: t(locale, `In ${leapYear}, ${formatDate(anchorDate, locale)} was ${weekdayName(anchorWeekday, locale)}. What day was ${formatDate(targetDate, locale)}?`, `${leapYear} में ${formatDate(anchorDate, locale)} को ${weekdayName(anchorWeekday, locale)} था। ${formatDate(targetDate, locale)} को कौन-सा वार था?`, `${leapYear} ਵਿੱਚ ${formatDate(anchorDate, locale)} ਨੂੰ ${weekdayName(anchorWeekday, locale)} ਸੀ। ${formatDate(targetDate, locale)} ਨੂੰ ਕਿਹੜਾ ਵਾਰ ਸੀ?`),
      wrongs: [
        { value: weekdayShift(anchorWeekday, gap - 1), misconceptionId: "FEB29_WRONGLY_EXCLUDED", derivation: { assumedFebruaryLength: 28 } },
        { value: weekdayShift(anchorWeekday, gap + 1), misconceptionId: "COUNTED_ANCHOR_AS_DAY_ONE", derivation: { countedAnchor: true } },
        { value: weekdayShift(anchorWeekday, -gap), misconceptionId: "FORWARD_BACKWARD_REVERSAL", derivation: { direction: "BACKWARD" } },
      ],
      explanation: makeExplanation(locale, `${leapYear} is a leap year.`, "February has 29 days, so 29 February must be included in the movement.", [`Verified date gap = ${gap}`, `${gap} mod 7 = ${gap % 7}`], weekdayName(answer, locale), "Treating February as 28 days makes the result one weekday early."),
      coverage: { crossesMonth: true, crossesFeb29: true }, difficultyDimensions: { D4LeapDayExposure: true },
    };
  }

  if (id === "CAL-PQL-011") {
    const start = { year: leapYear, month: 2 as Month, day: rng.int(20, 28) };
    const end = { year: leapYear, month: 3 as Month, day: rng.int(1, 15) };
    const answer = absoluteDayGap(start, end);
    return {
      queryType: "DAY_GAP_ACROSS_FEB29", facts: { anchorDate: start, targetDate: end, countSemantics: "ABSOLUTE_GAP" }, answer,
      groundTruth: { method: "ORDINAL", segments: [{ ordinalDifference: ordinalDifference(start, end) }], answer },
      teachingTrace: { method: "DATE_SPAN", segments: [{ februaryLength: 29 }, { exactGap: answer }], answer },
      stem: t(locale, `How many days are there from ${formatDate(start, locale)} to ${formatDate(end, locale)}, not counting the starting date?`, `${formatDate(start, locale)} से ${formatDate(end, locale)} तक, आरंभिक तिथि को न गिनते हुए, कितने दिन हैं?`, `${formatDate(start, locale)} ਤੋਂ ${formatDate(end, locale)} ਤੱਕ, ਸ਼ੁਰੂਆਤੀ ਤਾਰੀਖ ਨੂੰ ਨਾ ਗਿਣਦਿਆਂ, ਕਿੰਨੇ ਦਿਨ ਹਨ?`),
      wrongs: [
        { value: answer - 1, misconceptionId: "FEB29_WRONGLY_EXCLUDED", derivation: { omitted: "29 February" } },
        { value: answer + 1, misconceptionId: "INCLUDED_BOTH_DATES", derivation: { formula: "gap+1" } },
        { value: Math.max(0, answer - 2), misconceptionId: "EXCLUDED_BOTH_DATES", derivation: { formula: "gap-1 plus omitted leap day" } },
      ],
      explanation: makeExplanation(locale, `${formatDate(start, locale)} → ${formatDate(end, locale)}`, "Use the exact gap and include 29 February because it lies inside the span.", [`February ${leapYear} has 29 days`, `Exact gap = ${answer}`], String(answer)),
      coverage: { crossesMonth: true, crossesFeb29: true }, difficultyDimensions: { D4LeapDayExposure: true, D6CountInterpretation: true },
    };
  }

  if (id === "CAL-PQL-012") {
    const start = { year: leapYear, month: 2 as Month, day: rng.int(20, 27) };
    const end = { year: leapYear, month: 3 as Month, day: rng.int(3, 16) };
    const inclusive = seed % 2 === 0;
    const answer = inclusive ? inclusiveDateCount(start, end) : interveningDays(start, end);
    const semantics = inclusive ? "INCLUSIVE_BOTH" : "EXCLUSIVE_BOTH";
    return {
      queryType: inclusive ? "INCLUSIVE_DATE_COUNT" : "EXCLUSIVE_DATE_COUNT", facts: { anchorDate: start, targetDate: end, countSemantics: semantics }, answer,
      groundTruth: { method: "ORDINAL", segments: [{ gap: absoluteDayGap(start, end) }, { semantics }], answer },
      teachingTrace: { method: "DATE_SPAN", segments: [{ baseGap: absoluteDayGap(start, end) }, { adjustment: inclusive ? 1 : -1 }], answer },
      stem: inclusive
        ? t(locale, `How many dates are included from ${formatDate(start, locale)} to ${formatDate(end, locale)}, including both dates?`, `${formatDate(start, locale)} से ${formatDate(end, locale)} तक दोनों तिथियों सहित कुल कितनी तिथियाँ हैं?`, `${formatDate(start, locale)} ਤੋਂ ${formatDate(end, locale)} ਤੱਕ ਦੋਵੇਂ ਤਾਰੀਖਾਂ ਸਮੇਤ ਕੁੱਲ ਕਿੰਨੀਆਂ ਤਾਰੀਖਾਂ ਹਨ?`)
        : t(locale, `How many days lie strictly between ${formatDate(start, locale)} and ${formatDate(end, locale)}, excluding both dates?`, `${formatDate(start, locale)} और ${formatDate(end, locale)} के बीच, दोनों तिथियों को छोड़कर, कितने दिन हैं?`, `${formatDate(start, locale)} ਅਤੇ ${formatDate(end, locale)} ਦੇ ਵਿਚਕਾਰ, ਦੋਵੇਂ ਤਾਰੀਖਾਂ ਤੋਂ ਬਿਨਾਂ, ਕਿੰਨੇ ਦਿਨ ਹਨ?`),
      wrongs: [
        { value: absoluteDayGap(start, end), misconceptionId: inclusive ? "OMITTED_TARGET_DATE" : "INCLUDED_BOTH_DATES", derivation: { used: "ABSOLUTE_GAP" } },
        { value: inclusiveDateCount(start, end), misconceptionId: "INCLUDED_BOTH_DATES", derivation: { used: "INCLUSIVE_BOTH" } },
        { value: interveningDays(start, end), misconceptionId: "EXCLUDED_BOTH_DATES", derivation: { used: "EXCLUSIVE_BOTH" } },
        inclusive
          ? { value: inclusiveDateCount(start, end) + 1, misconceptionId: "COUNTED_ANCHOR_AS_DAY_ONE", derivation: { used: "INCLUSIVE_BOTH_PLUS_RECOUNTED_ANCHOR" } }
          : { value: Math.max(0, interveningDays(start, end) - 1), misconceptionId: "FEB29_WRONGLY_EXCLUDED", derivation: { used: "EXCLUSIVE_BOTH_AND_OMITTED_FEB29" } },
      ],
      explanation: makeExplanation(locale, `Count contract: ${semantics}`, inclusive ? "Inclusive count = absolute gap + 1." : "Exclusive count = absolute gap − 1.", [`Absolute gap = ${absoluteDayGap(start, end)}`, `Required count = ${answer}`], String(answer), "The words ‘including both’ or ‘excluding both’ determine the adjustment."),
      coverage: { crossesMonth: true, crossesFeb29: true, usesInclusiveCounting: inclusive }, difficultyDimensions: { D4LeapDayExposure: true, D6CountInterpretation: true },
    };
  }

  const includeLeapDay = seed % 2 === 0;
  const start = includeLeapDay ? { year: leapYear, month: 2 as Month, day: 20 } : { year: leapYear, month: 3 as Month, day: 1 };
  const end = includeLeapDay ? { year: leapYear, month: 3 as Month, day: 5 } : { year: leapYear, month: 4 as Month, day: 5 };
  const answer = includeLeapDay ? "YES_CONTAINS_LEAP_DAY" : "NO_LEAP_DAY_IN_SPAN";
  return {
    queryType: "LEAP_DAY_IN_SPAN", facts: { anchorDate: start, targetDate: end, booleanAnswer: includeLeapDay }, answer,
    groundTruth: { method: "ORDINAL", segments: [{ enumeratedContainment: spanContainsFeb29(start, end) }], answer },
    teachingTrace: { method: "LEAP_RULE", segments: [{ year: leapYear, isLeap: oddDayLeapYear(leapYear) }, { feb29WithinBounds: includeLeapDay }], answer },
    stem: t(locale, `Does the inclusive span from ${formatDate(start, locale)} to ${formatDate(end, locale)} contain 29 February?`, `क्या ${formatDate(start, locale)} से ${formatDate(end, locale)} तक की समावेशी अवधि में 29 फ़रवरी आती है?`, `ਕੀ ${formatDate(start, locale)} ਤੋਂ ${formatDate(end, locale)} ਤੱਕ ਦੀ ਸ਼ਾਮਿਲ ਮਿਆਦ ਵਿੱਚ 29 ਫ਼ਰਵਰੀ ਆਉਂਦੀ ਹੈ?`),
    wrongs: [
      { value: includeLeapDay ? "NO_LEAP_DAY_IN_SPAN" : "YES_CONTAINS_LEAP_DAY", misconceptionId: includeLeapDay ? "FEB29_WRONGLY_EXCLUDED" : "FEB29_WRONGLY_INCLUDED", derivation: { reversedContainment: true } },
      { value: "LEAP_DAY_ONLY_AT_EXCLUDED_BOUNDARY", misconceptionId: "EXCLUDED_BOTH_DATES", derivation: { treatedInclusiveAsExclusive: true } },
      { value: "INVALID_DATE_SPAN", misconceptionId: "LEAP_EVERY_FOUR_YEARS_ONLY", derivation: { rejectedValidLeapDate: true } },
    ],
    explanation: makeExplanation(locale, `${leapYear} passes the Gregorian leap rule.`, "A leap day is inside the span only when 29 February lies between the inclusive endpoints.", [`Span: ${formatDate(start, locale)} to ${formatDate(end, locale)}`, `Contains 29 February: ${includeLeapDay}`], displaySemantic(answer, "CLASSIFICATION", locale)),
    coverage: { crossesFeb29: includeLeapDay }, difficultyDimensions: { D4LeapDayExposure: true, D6CountInterpretation: true },
  };
}
