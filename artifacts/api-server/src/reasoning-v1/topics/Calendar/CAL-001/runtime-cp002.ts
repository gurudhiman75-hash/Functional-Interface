import type {
  CalendarPrototypeId,
  Locale,
  Month,
} from "./types.ts";
import {
  DeterministicRandom,
  absoluteDayGap,
  addDays,
  ordinalDaysInMonth,
  ordinalDifference,
  ordinalWeekday,
  spanContainsFeb29,
  weekdayShift,
} from "./foundation.ts";
import {
  formatDate,
  makeExplanation,
  monthName,
  pickOrdinaryYear,
  randomDate,
  t,
  weekdayName,
  type Problem,
} from "./runtime-shared.ts";
export function dateRelationProblem(id: CalendarPrototypeId, _seed: number, locale: Locale, rng: DeterministicRandom): Problem | null {
  if (!["CAL-PQL-005", "CAL-PQL-006", "CAL-PQL-007", "CAL-PQL-008", "CAL-PQL-009"].includes(id)) return null;

  if (id === "CAL-PQL-005") {
    const year = rng.int(1800, 2199);
    const month = rng.int(1, 12) as Month;
    const maxDay = ordinalDaysInMonth(year, month);
    const startDay = rng.int(1, Math.max(1, maxDay - 10));
    const targetDay = rng.int(startDay + 1, maxDay);
    const anchorDate = { year, month, day: startDay };
    const targetDate = { year, month, day: targetDay };
    const anchorWeekday = ordinalWeekday(anchorDate);
    const gap = targetDay - startDay;
    const answer = ordinalWeekday(targetDate);
    return {
      queryType: "SAME_MONTH_DATE_RELATION", facts: { anchorDate, targetDate, anchorWeekday, signedDayShift: gap }, answer,
      groundTruth: { method: "ORDINAL", segments: [{ targetOrdinalWeekday: answer }], answer },
      teachingTrace: { method: "MOD7_SHIFT", segments: [{ dateDifference: gap }, { remainder: gap % 7 }], answer: weekdayShift(anchorWeekday, gap) },
      stem: t(locale, `If ${formatDate(anchorDate, locale)} was ${weekdayName(anchorWeekday, locale)}, what day was ${formatDate(targetDate, locale)}?`, `यदि ${formatDate(anchorDate, locale)} को ${weekdayName(anchorWeekday, locale)} था, तो ${formatDate(targetDate, locale)} को कौन-सा वार था?`, `ਜੇ ${formatDate(anchorDate, locale)} ਨੂੰ ${weekdayName(anchorWeekday, locale)} ਸੀ, ਤਾਂ ${formatDate(targetDate, locale)} ਨੂੰ ਕਿਹੜਾ ਵਾਰ ਸੀ?`),
      wrongs: [
        { value: weekdayShift(anchorWeekday, gap - 1), misconceptionId: "COUNTED_ANCHOR_AS_DAY_ONE", derivation: { usedGap: gap - 1 } },
        { value: weekdayShift(anchorWeekday, -gap), misconceptionId: "FORWARD_BACKWARD_REVERSAL", derivation: { usedGap: -gap } },
        { value: weekdayShift(anchorWeekday, gap + 1), misconceptionId: "SHIFT_BY_N_PLUS_ONE", derivation: { usedGap: gap + 1 } },
      ],
      explanation: makeExplanation(locale, `${formatDate(anchorDate, locale)} → ${formatDate(targetDate, locale)}`, "Subtract date numbers, then shift by the result.", [`${targetDay} − ${startDay} = ${gap}`, `${gap} mod 7 = ${gap % 7}`, `${weekdayName(anchorWeekday, locale)} + ${gap % 7} = ${weekdayName(answer, locale)}`], weekdayName(answer, locale)),
    };
  }

  if (id === "CAL-PQL-006") {
    const year = pickOrdinaryYear(rng);
    let month = rng.int(1, 11) as Month;
    if (month === 2) month = 3;
    const anchorDate = { year, month, day: Math.max(1, ordinalDaysInMonth(year, month) - rng.int(2, 8)) };
    const nextMonth = (month + 1) as Month;
    const targetDate = { year, month: nextMonth, day: rng.int(2, Math.min(15, ordinalDaysInMonth(year, nextMonth))) };
    const gap = ordinalDifference(anchorDate, targetDate);
    const anchorWeekday = ordinalWeekday(anchorDate);
    const answer = ordinalWeekday(targetDate);
    const currentLength = ordinalDaysInMonth(year, month);
    return {
      queryType: "ORDINARY_CROSS_MONTH_RELATION", facts: { anchorDate, targetDate, anchorWeekday, signedDayShift: gap }, answer,
      groundTruth: { method: "ORDINAL", segments: [{ dateDifference: gap }], answer },
      teachingTrace: { method: "DATE_SPAN", segments: [{ remainingInAnchorMonth: currentLength - anchorDate.day }, { targetMonthDays: targetDate.day }, { total: gap }], answer: weekdayShift(anchorWeekday, gap) },
      stem: t(locale, `${formatDate(anchorDate, locale)} was ${weekdayName(anchorWeekday, locale)}. Find the weekday on ${formatDate(targetDate, locale)}.`, `${formatDate(anchorDate, locale)} को ${weekdayName(anchorWeekday, locale)} था। ${formatDate(targetDate, locale)} का वार ज्ञात कीजिए।`, `${formatDate(anchorDate, locale)} ਨੂੰ ${weekdayName(anchorWeekday, locale)} ਸੀ। ${formatDate(targetDate, locale)} ਦਾ ਵਾਰ ਲੱਭੋ।`),
      wrongs: [
        { value: weekdayShift(anchorWeekday, gap - 1), misconceptionId: "OMITTED_TARGET_DATE", derivation: { usedGap: gap - 1 } },
        { value: weekdayShift(anchorWeekday, gap + (currentLength === 31 ? -1 : 1)), misconceptionId: currentLength === 31 ? "WRONG_MONTH_LENGTH_30_FOR_31" : "WRONG_MONTH_LENGTH_31_FOR_30", derivation: { assumedMonthLength: currentLength === 31 ? 30 : 31 } },
        { value: weekdayShift(anchorWeekday, -gap), misconceptionId: "FORWARD_BACKWARD_REVERSAL", derivation: { usedGap: -gap } },
      ],
      explanation: makeExplanation(locale, `${formatDate(anchorDate, locale)} → ${formatDate(targetDate, locale)}`, "Use verified month lengths and count the signed date difference.", [`Days after the anchor in ${monthName(month, locale)}: ${currentLength - anchorDate.day}`, `Days in the target month up to the date: ${targetDate.day}`, `Total shift: ${gap}`], weekdayName(answer, locale)),
      coverage: { crossesMonth: true }, difficultyDimensions: { D1ArithmeticSegments: 2 },
    };
  }

  if (id === "CAL-PQL-007") {
    const laterDate = randomDate(rng);
    const back = rng.int(8, Math.min(90, Math.max(8, ordinalDifference({ year: laterDate.year, month: 1, day: 1 }, laterDate))));
    const earlierDate = addDays(laterDate, -back);
    const laterWeekday = ordinalWeekday(laterDate);
    const answer = ordinalWeekday(earlierDate);
    return {
      queryType: "EARLIER_DATE_FROM_LATER_ANCHOR", facts: { anchorDate: laterDate, targetDate: earlierDate, anchorWeekday: laterWeekday, signedDayShift: -back }, answer,
      groundTruth: { method: "ORDINAL", segments: [{ earlierDate, weekday: answer }], answer },
      teachingTrace: { method: "DATE_SPAN", segments: [{ backwardDays: back }, { remainder: back % 7 }], answer: weekdayShift(laterWeekday, -back) },
      stem: t(locale, `If ${formatDate(laterDate, locale)} was ${weekdayName(laterWeekday, locale)}, what day was ${formatDate(earlierDate, locale)}?`, `यदि ${formatDate(laterDate, locale)} को ${weekdayName(laterWeekday, locale)} था, तो ${formatDate(earlierDate, locale)} को कौन-सा वार था?`, `ਜੇ ${formatDate(laterDate, locale)} ਨੂੰ ${weekdayName(laterWeekday, locale)} ਸੀ, ਤਾਂ ${formatDate(earlierDate, locale)} ਨੂੰ ਕਿਹੜਾ ਵਾਰ ਸੀ?`),
      wrongs: [
        { value: weekdayShift(laterWeekday, back), misconceptionId: "FORWARD_BACKWARD_REVERSAL", derivation: { usedDirection: "FORWARD" } },
        { value: weekdayShift(laterWeekday, -(back - 1)), misconceptionId: "COUNTED_ANCHOR_AS_DAY_ONE", derivation: { usedGap: back - 1 } },
        { value: weekdayShift(laterWeekday, -(back + 1)), misconceptionId: "SHIFT_BY_N_PLUS_ONE", derivation: { usedGap: back + 1 } },
      ],
      explanation: makeExplanation(locale, `${formatDate(laterDate, locale)} → ${formatDate(earlierDate, locale)}`, "An earlier date requires a backward weekday shift.", [`Gap = ${back} days`, `${back} mod 7 = ${back % 7}`, `${weekdayName(laterWeekday, locale)} − ${back % 7} = ${weekdayName(answer, locale)}`], weekdayName(answer, locale)),
      coverage: { crossesMonth: laterDate.month !== earlierDate.month, usesBackwardMovement: true }, difficultyDimensions: { D2ReverseReasoning: true },
    };
  }

  if (id === "CAL-PQL-008") {
    const start = randomDate(rng);
    const shift = rng.int(10, 180);
    const end = addDays(start, shift);
    const answer = absoluteDayGap(start, end);
    return {
      queryType: "EXACT_DAY_DIFFERENCE", facts: { anchorDate: start, targetDate: end, countSemantics: "ABSOLUTE_GAP" }, answer,
      groundTruth: { method: "ORDINAL", segments: [{ startOrdinal: ordinalDifference({ year: 1, month: 1, day: 1 }, start) + 1 }, { endOrdinal: ordinalDifference({ year: 1, month: 1, day: 1 }, end) + 1 }], answer },
      teachingTrace: { method: "DATE_SPAN", segments: [{ signedDifference: ordinalDifference(start, end) }, { absoluteGap: answer }], answer },
      stem: t(locale, `How many days after ${formatDate(start, locale)} is ${formatDate(end, locale)}?`, `${formatDate(end, locale)}, ${formatDate(start, locale)} के कितने दिन बाद है?`, `${formatDate(end, locale)}, ${formatDate(start, locale)} ਤੋਂ ਕਿੰਨੇ ਦਿਨ ਬਾਅਦ ਹੈ?`),
      wrongs: [
        { value: answer + 1, misconceptionId: "INCLUDED_BOTH_DATES", derivation: { formula: "gap+1" } },
        { value: Math.max(0, answer - 1), misconceptionId: "EXCLUDED_BOTH_DATES", derivation: { formula: "gap-1" } },
        { value: answer + 2, misconceptionId: "COUNTED_ANCHOR_AS_DAY_ONE", derivation: { formula: "gap+2" } },
      ],
      explanation: makeExplanation(locale, `${formatDate(start, locale)} → ${formatDate(end, locale)}`, "‘How many days after’ uses the signed date difference; the anchor is not day one.", [`Ordinal difference = ${answer}`], String(answer), "Including both dates would give one extra day."),
      coverage: { crossesMonth: start.month !== end.month, crossesYear: start.year !== end.year, crossesFeb29: spanContainsFeb29(start, end) },
    };
  }

  if (id === "CAL-PQL-009") {
    const anchorDate = randomDate(rng);
    const signedDayShift = rng.pick([-1, 1]) * rng.int(8, 120);
    const answer = addDays(anchorDate, signedDayShift);
    return {
      queryType: "EXPLICIT_DATE_ADDITION", facts: { anchorDate, targetDate: answer, signedDayShift }, answer,
      groundTruth: { method: "ORDINAL", segments: [{ anchorDate }, { signedDayShift }, { result: answer }], answer },
      teachingTrace: { method: "DATE_SPAN", segments: [{ direction: signedDayShift > 0 ? "FORWARD" : "BACKWARD" }, { days: Math.abs(signedDayShift) }], answer },
      stem: signedDayShift > 0
        ? t(locale, `Which date is ${signedDayShift} days after ${formatDate(anchorDate, locale)}?`, `${formatDate(anchorDate, locale)} के ${signedDayShift} दिन बाद कौन-सी तिथि होगी?`, `${formatDate(anchorDate, locale)} ਤੋਂ ${signedDayShift} ਦਿਨ ਬਾਅਦ ਕਿਹੜੀ ਤਾਰੀਖ ਹੋਵੇਗੀ?`)
        : t(locale, `Which date was ${Math.abs(signedDayShift)} days before ${formatDate(anchorDate, locale)}?`, `${formatDate(anchorDate, locale)} से ${Math.abs(signedDayShift)} दिन पहले कौन-सी तिथि थी?`, `${formatDate(anchorDate, locale)} ਤੋਂ ${Math.abs(signedDayShift)} ਦਿਨ ਪਹਿਲਾਂ ਕਿਹੜੀ ਤਾਰੀਖ ਸੀ?`),
      wrongs: [
        { value: addDays(anchorDate, signedDayShift + (signedDayShift > 0 ? -1 : 1)), misconceptionId: "COUNTED_ANCHOR_AS_DAY_ONE", derivation: { usedShift: signedDayShift + (signedDayShift > 0 ? -1 : 1) } },
        { value: addDays(anchorDate, -signedDayShift), misconceptionId: "FORWARD_BACKWARD_REVERSAL", derivation: { usedShift: -signedDayShift } },
        { value: addDays(anchorDate, signedDayShift + (signedDayShift > 0 ? 1 : -1)), misconceptionId: "SHIFT_BY_N_PLUS_ONE", derivation: { usedShift: signedDayShift + (signedDayShift > 0 ? 1 : -1) } },
      ],
      explanation: makeExplanation(locale, formatDate(anchorDate, locale), "Add or subtract the stated number of complete days using valid month lengths.", [`Signed shift = ${signedDayShift}`, `Result = ${formatDate(answer, locale)}`], formatDate(answer, locale)),
      coverage: { crossesMonth: anchorDate.month !== answer.month, crossesYear: anchorDate.year !== answer.year, crossesFeb29: spanContainsFeb29(anchorDate, answer), usesBackwardMovement: signedDayShift < 0 },
    };
  }

  return null;
}
