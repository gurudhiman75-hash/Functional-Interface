import type {
  CalendarPrototypeId,
  Locale,
  MisconceptionId,
  Month,
} from "./types.ts";
import {
  DeterministicRandom,
  fullYearCalendarsMatch,
  matchingFullYearsInRange,
  monthCalendarsMatch,
  nextMatchingFullYear,
  ordinalDaysInMonth,
  ordinalLeapYear,
  ordinalWeekday,
  previousMatchingFullYear,
} from "./foundation.ts";
import {
  directCalendarMatch,
  displaySemantic,
  makeExplanation,
  monthName,
  t,
  weekdayName,
  type Problem,
} from "./runtime-shared.ts";
export function repetitionBoundaryFrequencyProblem(id: CalendarPrototypeId, seed: number, locale: Locale, rng: DeterministicRandom): Problem | null {
  if (!["CAL-PQL-029", "CAL-PQL-030", "CAL-PQL-031", "CAL-PQL-032", "CAL-PQL-033", "CAL-PQL-034"].includes(id)) return null;

  if (["CAL-PQL-029", "CAL-PQL-030", "CAL-PQL-031", "CAL-PQL-032", "CAL-PQL-034"].includes(id)) {
    const year = rng.int(1800, 2199);
    const next = nextMatchingFullYear(year);
    const previous = previousMatchingFullYear(year);

    if (id === "CAL-PQL-029" || id === "CAL-PQL-030") {
      const forward = id === "CAL-PQL-029";
      const answer = forward ? next : previous;
      const candidateDirection = forward ? 1 : -1;
      const nearStartMatch = (() => {
        for (let candidate = year + candidateDirection; candidate !== answer; candidate += candidateDirection) {
          if (ordinalWeekday({ year: candidate, month: 1, day: 1 }) === ordinalWeekday({ year, month: 1, day: 1 })) return candidate;
        }
        return answer + candidateDirection;
      })();
      return {
        queryType: forward ? "NEXT_IDENTICAL_FULL_YEAR" : "PREVIOUS_IDENTICAL_FULL_YEAR", facts: { year, secondYear: answer, fullYearMatch: true }, answer,
        groundTruth: { method: "REPETITION_RULE", segments: [{ nearestSearch: answer }, { directSequenceMatch: directCalendarMatch(year, answer) }], answer },
        teachingTrace: { method: "REPETITION_RULE", segments: [{ sameJan1: true }, { sameLeapStatus: ordinalLeapYear(year) === ordinalLeapYear(answer) }], answer },
        stem: t(locale, `Which is the ${forward ? "next" : "previous"} year having a calendar identical to ${year}?`, `${year} के समान कैलेंडर वाला ${forward ? "अगला" : "पिछला"} वर्ष कौन-सा है?`, `${year} ਵਰਗਾ ਕੈਲੰਡਰ ਰੱਖਣ ਵਾਲਾ ${forward ? "ਅਗਲਾ" : "ਪਿਛਲਾ"} ਸਾਲ ਕਿਹੜਾ ਹੈ?`),
        wrongs: [
          { value: nearStartMatch, misconceptionId: "START_WEEKDAY_MATCH_ONLY", derivation: { sameJan1: true, sameLeapStatus: ordinalLeapYear(year) === ordinalLeapYear(nearStartMatch) } },
          { value: answer + candidateDirection, misconceptionId: "YEAR_TYPE_MATCH_ONLY", derivation: { nearestLeapTypeOnly: true } },
          { value: answer + 7 * candidateDirection, misconceptionId: "MONTH_MATCH_RULE_USED_FOR_FULL_YEAR", derivation: { assumedSevenYearCycle: true } },
        ],
        explanation: makeExplanation(locale, `Reference year: ${year}`, "Full-year calendars match only when 1 January weekday and leap status both match; ‘next/previous’ also requires nearest distance.", [`1 January weekday matches: true`, `Leap status matches: ${ordinalLeapYear(year) === ordinalLeapYear(answer)}`, `Nearest valid year: ${answer}`], String(answer)),
        difficultyDimensions: { D1ArithmeticSegments: 2, D9TrapCollisions: 3 },
      };
    }

    if (id === "CAL-PQL-031") {
      const answer = next;
      const candidates = [answer];
      for (let delta = 1; candidates.length < 4; delta++) {
        const candidate = year + delta;
        if (candidate !== answer && !fullYearCalendarsMatch(year, candidate)) candidates.push(candidate);
      }
      return {
        queryType: "SELECT_MATCHING_FULL_YEAR", facts: { year, secondYear: answer, optionYears: candidates }, answer,
        groundTruth: { method: "REPETITION_RULE", segments: candidates.map((candidate) => ({ candidate, directMatch: directCalendarMatch(year, candidate) })), answer },
        teachingTrace: { method: "REPETITION_RULE", segments: candidates.map((candidate) => ({ candidate, sameJan1: ordinalWeekday({ year, month: 1, day: 1 }) === ordinalWeekday({ year: candidate, month: 1, day: 1 }), sameLeapStatus: ordinalLeapYear(year) === ordinalLeapYear(candidate) })), answer },
        stem: t(locale, `Which year has a full-year calendar identical to ${year}?`, `किस वर्ष का पूरे वर्ष का कैलेंडर ${year} के समान है?`, `ਕਿਹੜੇ ਸਾਲ ਦਾ ਪੂਰੇ ਸਾਲ ਦਾ ਕੈਲੰਡਰ ${year} ਵਰਗਾ ਹੈ?`),
        wrongs: candidates.filter((candidate) => candidate !== answer).map((candidate, index) => ({ value: candidate, misconceptionId: (["START_WEEKDAY_MATCH_ONLY", "YEAR_TYPE_MATCH_ONLY", "MONTH_MATCH_RULE_USED_FOR_FULL_YEAR"] as MisconceptionId[])[index]!, derivation: { candidate, actualMatch: false } })),
        explanation: makeExplanation(locale, `Reference year: ${year}`, "Check both 1 January weekday and leap status for each option.", candidates.map((candidate) => `${candidate}: ${fullYearCalendarsMatch(year, candidate) ? "matches" : "does not match"}`), String(answer)),
      };
    }

    if (id === "CAL-PQL-032") {
      const shouldMatch = seed % 4 === 0;
      let secondYear = shouldMatch ? next : year + rng.int(1, 12);
      if (!shouldMatch && fullYearCalendarsMatch(year, secondYear)) secondYear++;
      const sameStart = ordinalWeekday({ year, month: 1, day: 1 }) === ordinalWeekday({ year: secondYear, month: 1, day: 1 });
      const sameLeap = ordinalLeapYear(year) === ordinalLeapYear(secondYear);
      const answer = sameStart && sameLeap ? "IDENTICAL_FULL_YEAR_CALENDARS" : !sameStart && !sameLeap ? "BOTH_CONDITIONS_FAIL" : sameStart ? "DIFFERENT_LEAP_STATUS" : "DIFFERENT_START_WEEKDAY";
      return {
        queryType: "VALIDATE_FULL_YEAR_MATCH", facts: { year, secondYear, fullYearMatch: shouldMatch }, answer,
        groundTruth: { method: "REPETITION_RULE", segments: [{ directSequenceMatch: directCalendarMatch(year, secondYear) }], answer },
        teachingTrace: { method: "REPETITION_RULE", segments: [{ sameStart }, { sameLeap }], answer },
        stem: t(locale, `Are the full-year calendars of ${year} and ${secondYear} identical? Choose the exact reason.`, `क्या ${year} और ${secondYear} के पूरे वर्ष के कैलेंडर समान हैं? सटीक कारण चुनिए।`, `ਕੀ ${year} ਅਤੇ ${secondYear} ਦੇ ਪੂਰੇ ਸਾਲਾਂ ਦੇ ਕੈਲੰਡਰ ਇਕੋ ਜਿਹੇ ਹਨ? ਸਹੀ ਕਾਰਨ ਚੁਣੋ।`),
        wrongs: [
          { value: "IDENTICAL_FULL_YEAR_CALENDARS", misconceptionId: "START_WEEKDAY_MATCH_ONLY", derivation: { sameStart } },
          { value: "DIFFERENT_START_WEEKDAY", misconceptionId: "YEAR_TYPE_MATCH_ONLY", derivation: { sameLeap } },
          { value: "DIFFERENT_LEAP_STATUS", misconceptionId: "MONTH_MATCH_RULE_USED_FOR_FULL_YEAR", derivation: { confusedContract: true } },
          { value: "BOTH_CONDITIONS_FAIL", misconceptionId: "START_WEEKDAY_MATCH_ONLY", derivation: { assumedBothFail: true } },
        ],
        explanation: makeExplanation(locale, `${year} vs ${secondYear}`, "Full-year equality requires both conditions.", [`Same 1 January weekday: ${sameStart}`, `Same leap status: ${sameLeap}`], displaySemantic(answer, "CLASSIFICATION", locale)),
      };
    }

    const rangeStart = Math.max(1600, year - rng.int(10, 30));
    const rangeEnd = Math.min(2399, year + rng.int(20, 50));
    const matches = matchingFullYearsInRange(year, rangeStart, rangeEnd);
    const answer = matches.length;
    return {
      queryType: "COUNT_MATCHING_FULL_YEARS_IN_RANGE", facts: { year, yearRange: { start: rangeStart, end: rangeEnd, inclusive: true }, matchingYears: matches }, answer,
      groundTruth: { method: "REPETITION_RULE", segments: [{ directMatches: matches }], answer },
      teachingTrace: { method: "REPETITION_RULE", segments: matches.map((candidate) => ({ candidate, sameJan1: true, sameLeapStatus: true })), answer },
      stem: t(locale, `Excluding ${year} itself, how many years from ${rangeStart} to ${rangeEnd} have a full-year calendar identical to ${year}?`, `${year} को छोड़कर, ${rangeStart} से ${rangeEnd} तक कितने वर्षों का पूरे वर्ष का कैलेंडर ${year} के समान है?`, `${year} ਨੂੰ ਛੱਡ ਕੇ, ${rangeStart} ਤੋਂ ${rangeEnd} ਤੱਕ ਕਿੰਨੇ ਸਾਲਾਂ ਦਾ ਪੂਰੇ ਸਾਲ ਦਾ ਕੈਲੰਡਰ ${year} ਵਰਗਾ ਹੈ?`),
      wrongs: [
        { value: answer + 1, misconceptionId: "START_WEEKDAY_MATCH_ONLY", derivation: { includedStartOnlyMatch: true } },
        { value: Math.max(0, answer - 1), misconceptionId: "YEAR_TYPE_MATCH_ONLY", derivation: { omittedValidMatch: true } },
        { value: answer + (matches.includes(year) ? 0 : 2), misconceptionId: "MONTH_MATCH_RULE_USED_FOR_FULL_YEAR", derivation: { usedMonthContract: true } },
      ],
      explanation: makeExplanation(locale, `Range ${rangeStart}–${rangeEnd}`, "Test every candidate for both start weekday and leap status and exclude the reference year.", [`Matching years: ${matches.join(", ") || "none"}`, `Count = ${answer}`], String(answer)),
      difficultyDimensions: { D1ArithmeticSegments: 3, D10InformationFiltering: 2 },
    };
  }

  if (id === "CAL-PQL-033") {
    const referenceYear = rng.int(1800, 2180);
    const month = rng.int(1, 12) as Month;
    let answer = referenceYear + 1;
    while (answer <= 2399 && !monthCalendarsMatch(referenceYear, month, answer, month)) answer++;
    if (answer > 2399) throw new Error("No matching month found.");
    const candidateYears = [answer];
    for (let candidate = referenceYear + 1; candidateYears.length < 4; candidate++) {
      if (candidate !== answer && !monthCalendarsMatch(referenceYear, month, candidate, month)) candidateYears.push(candidate);
    }
    return {
      queryType: "MATCH_SPECIFIED_MONTH", facts: { year: referenceYear, secondYear: answer, month, optionYears: candidateYears }, answer,
      groundTruth: { method: "REPETITION_RULE", segments: candidateYears.map((candidate) => ({ candidate, monthMatch: monthCalendarsMatch(referenceYear, month, candidate, month) })), answer },
      teachingTrace: { method: "REPETITION_RULE", segments: [{ sameFirstWeekday: true }, { sameMonthLength: true }], answer },
      stem: t(locale, `The calendar of ${monthName(month, locale)} ${referenceYear} is identical to ${monthName(month, locale)} of which year?`, `${monthName(month, locale)} ${referenceYear} का कैलेंडर किस वर्ष के ${monthName(month, locale)} के समान है?`, `${monthName(month, locale)} ${referenceYear} ਦਾ ਕੈਲੰਡਰ ਕਿਸ ਸਾਲ ਦੇ ${monthName(month, locale)} ਵਰਗਾ ਹੈ?`),
      wrongs: candidateYears.filter((candidate) => candidate !== answer).map((candidate, index) => ({ value: candidate, misconceptionId: (["FULL_YEAR_RULE_USED_FOR_MONTH_MATCH", "START_WEEKDAY_MATCH_ONLY", "YEAR_TYPE_MATCH_ONLY"] as MisconceptionId[])[index]!, derivation: { candidate, actualMonthMatch: false } })),
      explanation: makeExplanation(locale, `${monthName(month, locale)} ${referenceYear}`, "Month calendars match when the first weekday and month length both match.", [`First weekday: ${weekdayName(ordinalWeekday({ year: referenceYear, month, day: 1 }), locale)}`, `Month length: ${ordinalDaysInMonth(referenceYear, month)}`, `Matching year: ${answer}`], String(answer)),
    };
  }

  return null;
}
