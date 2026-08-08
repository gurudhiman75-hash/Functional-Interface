import type {
  CalendarPrototypeId,
  CalendarQuestionPackage,
  GregorianDate,
  Locale,
  Month,
  SemanticValue,
  Weekday,
} from "./types.ts";
import {
  DeterministicRandom,
  matchingFullYearsInRange,
  mod7,
  oddDaysInCompleteYears,
  ordinalDaysInMonth,
  ordinalDifference,
  ordinalLeapYear,
  ordinalWeekday,
  spanContainsFeb29,
  weekdayShift,
} from "./foundation.ts";
import {
  displaySemantic,
  formatDate,
  makeExplanation,
  t,
  weekdayName,
  type Problem,
} from "./runtime-shared.ts";

const EXCLUSIVE_CLASSIFICATION_LABELS: Record<Locale, Record<string, string>> = {
  "en-IN": {
    LEAP_YEAR: "Leap non-century year",
    ORDINARY_YEAR: "Ordinary non-century year",
    LEAP_CENTURY_YEAR: "Leap century year",
    ORDINARY_CENTURY_YEAR: "Ordinary century year",
  },
  "hi-IN": {
    LEAP_YEAR: "गैर-शताब्दी अधिवर्ष",
    ORDINARY_YEAR: "गैर-शताब्दी साधारण वर्ष",
    LEAP_CENTURY_YEAR: "अधिवर्ष शताब्दी वर्ष",
    ORDINARY_CENTURY_YEAR: "साधारण शताब्दी वर्ष",
  },
  "pa-IN": {
    LEAP_YEAR: "ਗੈਰ-ਸਦੀ ਲੀਪ ਸਾਲ",
    ORDINARY_YEAR: "ਗੈਰ-ਸਦੀ ਸਧਾਰਣ ਸਾਲ",
    LEAP_CENTURY_YEAR: "ਲੀਪ ਸਦੀ ਸਾਲ",
    ORDINARY_CENTURY_YEAR: "ਸਧਾਰਣ ਸਦੀ ਸਾਲ",
  },
};

const WIDE_YEAR_AUTHORITIES = new Set<CalendarPrototypeId>([
  "CAL-PQL-014",
  "CAL-PQL-021",
  "CAL-PQL-022",
  "CAL-PQL-023",
  "CAL-PQL-024",
  "CAL-PQL-025",
  "CAL-PQL-026",
  "CAL-PQL-027",
  "CAL-PQL-028",
]);

function pickYearByClassification(
  rng: DeterministicRandom,
  classification: "LEAP_YEAR" | "ORDINARY_YEAR" | "LEAP_CENTURY_YEAR" | "ORDINARY_CENTURY_YEAR",
): number {
  if (classification === "LEAP_CENTURY_YEAR") return rng.pick([1600, 2000]);
  if (classification === "ORDINARY_CENTURY_YEAR") return rng.pick([1700, 1800, 1900, 2100, 2200, 2300]);
  for (let attempt = 0; attempt < 1000; attempt++) {
    const year = rng.int(1900, 2099);
    if (year % 100 === 0) continue;
    if (classification === "LEAP_YEAR" && ordinalLeapYear(year)) return year;
    if (classification === "ORDINARY_YEAR" && !ordinalLeapYear(year)) return year;
  }
  throw new Error(`Unable to pick ${classification}.`);
}

function classificationProblem(seed: number, locale: Locale, rng: DeterministicRandom): Problem {
  const classifications = ["ORDINARY_YEAR", "LEAP_YEAR", "ORDINARY_CENTURY_YEAR", "LEAP_CENTURY_YEAR"] as const;
  const answer = classifications[seed % classifications.length]!;
  const year = pickYearByClassification(rng, answer);
  const wrongClassifications = classifications.filter((value) => value !== answer);
  const misconceptionByWrong: Record<string, "LEAP_EVERY_FOUR_YEARS_ONLY" | "CENTURY_ALWAYS_LEAP" | "CENTURY_NEVER_LEAP" | "DIVISIBLE_BY_400_RULE_OMITTED"> = {
    LEAP_YEAR: "LEAP_EVERY_FOUR_YEARS_ONLY",
    ORDINARY_YEAR: "DIVISIBLE_BY_400_RULE_OMITTED",
    LEAP_CENTURY_YEAR: "CENTURY_ALWAYS_LEAP",
    ORDINARY_CENTURY_YEAR: "CENTURY_NEVER_LEAP",
  };
  return {
    queryType: "CLASSIFY_YEAR",
    facts: { year, booleanAnswer: ordinalLeapYear(year) },
    answer,
    groundTruth: { method: "LEAP_RULE", segments: [{ year, leap: ordinalLeapYear(year) }], answer },
    teachingTrace: {
      method: "LEAP_RULE",
      segments: [
        { divisibleBy400: year % 400 === 0 },
        { divisibleBy100: year % 100 === 0 },
        { divisibleBy4: year % 4 === 0 },
      ],
      answer,
    },
    stem: t(
      locale,
      `How should the year ${year} be classified under the Gregorian rule?`,
      `ग्रेगोरियन नियम के अनुसार वर्ष ${year} का सही वर्गीकरण क्या है?`,
      `ਗ੍ਰੇਗੋਰੀਅਨ ਨਿਯਮ ਅਨੁਸਾਰ ਸਾਲ ${year} ਦੀ ਸਹੀ ਵਰਗੀਕਰਨ ਕੀ ਹੈ?`,
    ),
    wrongs: wrongClassifications.map((value) => ({
      value,
      misconceptionId: misconceptionByWrong[value],
      derivation: { year, mistakenClassification: value },
    })),
    explanation: makeExplanation(
      locale,
      `Classify ${year} into one mutually exclusive Gregorian category.`,
      "Check divisibility by 400 first, then 100, then 4.",
      [
        `${year} ÷ 400 leaves remainder ${year % 400}.`,
        `${year} ÷ 100 leaves remainder ${year % 100}.`,
        `${year} ÷ 4 leaves remainder ${year % 4}.`,
      ],
      EXCLUSIVE_CLASSIFICATION_LABELS[locale][answer]!,
    ),
    coverage: {
      usesCenturyYear: year % 100 === 0,
      usesDivisibleBy400Year: year % 400 === 0,
    },
    difficultyDimensions: { D5CenturyExposure: year % 100 === 0 },
  };
}

function inverseCrossYearProblem(locale: Locale, rng: DeterministicRandom): Problem {
  const earlierYear = rng.int(1900, 2088);
  const spanYears = rng.int(2, 10);
  const month = rng.pick([1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) as Month;
  const day = rng.int(1, 28);
  const earlierDate: GregorianDate = { year: earlierYear, month, day };
  const laterDate: GregorianDate = { year: earlierYear + spanYears, month, day };
  const earlierWeekday = ordinalWeekday(earlierDate);
  const laterWeekday = ordinalWeekday(laterDate);
  const forwardSpan = ordinalDifference(earlierDate, laterDate);
  return {
    queryType: "RECOVER_EARLIER_CROSS_YEAR_WEEKDAY",
    facts: {
      anchorDate: earlierDate,
      targetDate: laterDate,
      targetWeekday: laterWeekday,
      signedDayShift: forwardSpan,
    },
    answer: earlierWeekday,
    groundTruth: { method: "ORDINAL", segments: [{ earlierDate, earlierWeekday }], answer: earlierWeekday },
    teachingTrace: {
      method: "ODD_DAY",
      segments: [{ forwardSpan }, { reverseRemainder: mod7(-forwardSpan) }],
      answer: weekdayShift(laterWeekday, -forwardSpan),
    },
    stem: t(
      locale,
      `${formatDate(laterDate, locale)} falls on ${weekdayName(laterWeekday, locale)}. Which weekday does ${formatDate(earlierDate, locale)} fall on?`,
      `${formatDate(laterDate, locale)} को ${weekdayName(laterWeekday, locale)} है। ${formatDate(earlierDate, locale)} को कौन-सा वार है?`,
      `${formatDate(laterDate, locale)} ਨੂੰ ${weekdayName(laterWeekday, locale)} ਹੈ। ${formatDate(earlierDate, locale)} ਨੂੰ ਕਿਹੜਾ ਵਾਰ ਹੈ?`,
    ),
    wrongs: [
      {
        value: weekdayShift(laterWeekday, forwardSpan),
        misconceptionId: "FORWARD_BACKWARD_REVERSAL",
        derivation: { incorrectlyMovedForward: forwardSpan },
      },
      {
        value: weekdayShift(laterWeekday, -spanYears),
        misconceptionId: "LEAP_YEAR_AS_ONE_ODD_DAY",
        derivation: { treatedEveryYearAsOrdinary: spanYears },
      },
      {
        value: weekdayShift(laterWeekday, -2 * spanYears),
        misconceptionId: "ORDINARY_YEAR_AS_TWO_ODD_DAYS",
        derivation: { treatedEveryYearAsLeap: spanYears },
      },
      {
        value: weekdayShift(laterWeekday, -forwardSpan + 1),
        misconceptionId: "SHIFT_BY_N_PLUS_ONE",
        derivation: { reverseShiftOffset: 1 },
      },
    ],
    explanation: makeExplanation(
      locale,
      `${formatDate(laterDate, locale)} is the known later-date anchor; the required date is earlier.`,
      "Find the complete forward span, reduce it modulo 7, and reverse that weekday movement.",
      [
        `Forward span from ${formatDate(earlierDate, locale)} to ${formatDate(laterDate, locale)} = ${forwardSpan} days.`,
        `${forwardSpan} mod 7 = ${mod7(forwardSpan)}.`,
        `Move backward by ${mod7(forwardSpan)} weekday(s) from ${weekdayName(laterWeekday, locale)}.`,
      ],
      weekdayName(earlierWeekday, locale),
      "Moving forward from the later date reverses the required direction.",
    ),
    coverage: {
      crossesYear: true,
      crossesFeb29: spanContainsFeb29(earlierDate, laterDate),
      usesBackwardMovement: true,
    },
    difficultyDimensions: {
      D1ArithmeticSegments: spanYears,
      D2ReverseReasoning: true,
      D4LeapDayExposure: spanContainsFeb29(earlierDate, laterDate),
      D8InverseReasoning: true,
    },
  };
}

function centuryBlockProblem(seed: number, locale: Locale): Problem {
  const reviewCycle = [100, 200, 300, 400, 700] as const;
  const years = reviewCycle[seed % reviewCycle.length]!;
  const answer = oddDaysInCompleteYears(years);
  const exactDays = ordinalDifference(
    { year: 1, month: 1, day: 1 },
    { year: years + 1, month: 1, day: 1 },
  );
  const complete400Blocks = Math.floor(years / 400);
  const remainderYears = years % 400;
  return {
    queryType: "CENTURY_BLOCK_ODD_DAYS",
    facts: { year: years, complete400Blocks, remainderYears },
    answer,
    groundTruth: { method: "ORDINAL", segments: [{ exactDays }], answer: mod7(exactDays) },
    teachingTrace: {
      method: "ODD_DAY",
      segments: [{ complete400Blocks }, { remainderYears }, { reducedOddDays: answer }],
      answer,
    },
    stem: t(
      locale,
      `How many odd days are there in the first ${years} complete years of the proleptic Gregorian calendar?`,
      `प्रोलेप्टिक ग्रेगोरियन कैलेंडर के पहले ${years} पूर्ण वर्षों में कितने विषम दिन हैं?`,
      `ਪ੍ਰੋਲੇਪਟਿਕ ਗ੍ਰੇਗੋਰੀਅਨ ਕੈਲੰਡਰ ਦੇ ਪਹਿਲੇ ${years} ਪੂਰੇ ਸਾਲਾਂ ਵਿੱਚ ਕਿੰਨੇ ਵਿਸ਼ਮ ਦਿਨ ਹਨ?`,
    ),
    wrongs: [
      { value: mod7(answer + 1), misconceptionId: "CENTURY_BLOCK_OFFSET_ERROR", derivation: { offset: 1 } },
      { value: mod7(answer + 2), misconceptionId: "CENTURY_ALWAYS_LEAP", derivation: { offset: 2 } },
      { value: mod7(answer + 3), misconceptionId: "DIVISIBLE_BY_400_RULE_OMITTED", derivation: { offset: 3 } },
      { value: mod7(answer + 4), misconceptionId: "LEAP_EVERY_FOUR_YEARS_ONLY", derivation: { offset: 4 } },
    ],
    explanation: makeExplanation(
      locale,
      `${years} years = ${complete400Blocks} complete 400-year block(s) + ${remainderYears} year(s).`,
      "Each complete 400-year Gregorian block contributes 0 odd days; use 100→5, 200→3 and 300→1 for the remainder.",
      [
        `Complete 400-year blocks contribute ${complete400Blocks} × 0 = 0 odd days.`,
        `The remaining ${remainderYears} years contribute ${answer} odd day(s).`,
        `Therefore the total remainder after division by 7 is ${answer}.`,
      ],
      String(answer),
    ),
    coverage: {
      crossesCentury: true,
      usesCenturyYear: true,
      usesDivisibleBy400Year: years >= 400,
    },
    difficultyDimensions: { D1ArithmeticSegments: years === 700 ? 3 : 2, D5CenturyExposure: true },
  };
}

export function buildExamReadyProblemOverride(
  id: CalendarPrototypeId,
  seed: number,
  locale: Locale,
  rng: DeterministicRandom,
): Problem | null {
  if (id === "CAL-PQL-020") return inverseCrossYearProblem(locale, rng);
  if (id === "CAL-PQL-021") return classificationProblem(seed, locale, rng);
  if (id === "CAL-PQL-026") return centuryBlockProblem(seed, locale);
  return null;
}

function extractPrimaryYears(facts: CalendarQuestionPackage["facts"]): number[] {
  const years = new Set<number>();
  if (typeof facts.year === "number") years.add(facts.year);
  if (facts.anchorDate) years.add(facts.anchorDate.year);
  if (facts.targetDate) years.add(facts.targetDate.year);
  if (facts.yearRange) {
    years.add(facts.yearRange.start);
    years.add(facts.yearRange.end);
  }
  return [...years];
}

export function shouldAcceptExamReadyProblem(id: CalendarPrototypeId, seed: number, problem: Problem): boolean {
  if (id === "CAL-PQL-007") {
    const { anchorDate, targetDate } = problem.facts;
    if (problem.coverage?.crossesFeb29 || (anchorDate && targetDate && spanContainsFeb29(anchorDate, targetDate))) return false;
  }
  if (WIDE_YEAR_AUTHORITIES.has(id) || seed % 5 === 4) return true;
  const years = extractPrimaryYears(problem.facts);
  return years.length === 0 || years.every((year) => year >= 1900 && year <= 2099);
}

function humaniseInternalLabels(text: string): string {
  return text
    .replaceAll("INCLUSIVE_BOTH", "including both dates")
    .replaceAll("EXCLUSIVE_BOTH", "excluding both dates")
    .replaceAll("ABSOLUTE_GAP", "ordinary date gap")
    .replaceAll("SIGNED_DIFFERENCE", "signed date difference")
    .replaceAll("LEAP_YEAR", "leap year")
    .replaceAll("ORDINARY_YEAR", "ordinary year");
}

function normaliseEnglishStem(stem: string): string {
  const weekday = "(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)";
  let result = stem;
  result = result.replace(/What day of the week was (.+?)\?/g, "Which weekday does $1 fall on?");
  result = result.replace(/Which weekday was (.+?)\?/g, "Which weekday does $1 fall on?");
  result = result.replace(/What weekday was the same date in the (next|previous) year\?/g, "Which weekday does the same date fall on in the $1 year?");
  result = result.replace(/What was the weekday on its (first|last) day\?/g, "Which weekday does its $1 day fall on?");
  result = result.replace(/What day was (.+?)\?/g, "Which weekday does $1 fall on?");
  result = result.replace(new RegExp(`(.+?) was ${weekday}`, "g"), "$1 falls on $2");
  result = result.replace(/\bwas\b/g, "is");
  return result;
}

function classificationLabel(value: SemanticValue, locale: Locale): string | null {
  if (typeof value !== "string") return null;
  return EXCLUSIVE_CLASSIFICATION_LABELS[locale][value] ?? null;
}

function countMultiplesInRange(start: number, end: number, divisor: number): number {
  return Math.floor(end / divisor) - Math.floor((start - 1) / divisor);
}

function enrichEnglishExplanation(pkg: CalendarQuestionPackage): CalendarQuestionPackage["explanation"] {
  const base = {
    ...pkg.explanation,
    observation: humaniseInternalLabels(pkg.explanation.observation),
    rule: humaniseInternalLabels(pkg.explanation.rule),
    working: pkg.explanation.working.map(humaniseInternalLabels),
    conclusion: humaniseInternalLabels(pkg.explanation.conclusion),
    closestTrap: pkg.explanation.closestTrap ? humaniseInternalLabels(pkg.explanation.closestTrap) : undefined,
  };
  delete base.verification;

  if (pkg.locale !== "en-IN") return base;
  const facts = pkg.facts;

  if (pkg.prototypeAuthority === "CAL-PQL-012" && facts.anchorDate && facts.targetDate) {
    const gap = Math.abs(ordinalDifference(facts.anchorDate, facts.targetDate));
    const inclusive = facts.countSemantics === "INCLUSIVE_BOTH";
    return {
      observation: inclusive ? "Both boundary dates must be counted." : "Both boundary dates must be excluded.",
      rule: inclusive ? "Inclusive count = ordinary date gap + 1." : "Strictly-between count = ordinary date gap − 1.",
      working: [
        `Ordinary date gap = ${gap} days.`,
        inclusive ? `Including both dates gives ${gap} + 1 = ${pkg.canonicalAnswer}.` : `Excluding both dates gives ${gap} − 1 = ${pkg.canonicalAnswer}.`,
      ],
      conclusion: String(pkg.canonicalAnswer),
      closestTrap: "Using the ordinary gap without reading the boundary words changes the answer by one.",
    };
  }

  if (pkg.prototypeAuthority === "CAL-PQL-015" && typeof facts.year === "number" && typeof facts.nthDay === "number") {
    const first = ordinalWeekday({ year: facts.year, month: 1, day: 1 });
    const shift = facts.nthDay - 1;
    return {
      observation: `First determine 1 January ${facts.year}; it falls on ${weekdayName(first, "en-IN")}.`,
      rule: "The nth day is n − 1 days after 1 January.",
      working: [
        `Required shift = ${facts.nthDay} − 1 = ${shift} days.`,
        `${shift} mod 7 = ${mod7(shift)}.`,
        `${weekdayName(first, "en-IN")} moved forward by ${mod7(shift)} weekday(s) gives ${displaySemantic(pkg.canonicalAnswer, pkg.outputType, "en-IN")}.`,
      ],
      conclusion: displaySemantic(pkg.canonicalAnswer, pkg.outputType, "en-IN"),
      closestTrap: "Shifting by n instead of n − 1 counts 1 January twice.",
    };
  }

  if (["CAL-PQL-023", "CAL-PQL-024", "CAL-PQL-028"].includes(pkg.prototypeAuthority) && facts.yearRange) {
    const { start, end } = facts.yearRange;
    const multiples4 = countMultiplesInRange(start, end, 4);
    const multiples100 = countMultiplesInRange(start, end, 100);
    const multiples400 = countMultiplesInRange(start, end, 400);
    const leapCount = multiples4 - multiples100 + multiples400;
    const total = end - start + 1;
    return {
      observation: `The range ${start}–${end} is inclusive, so it contains ${total} years.`,
      rule: "Leap years = multiples of 4 − multiples of 100 + multiples of 400.",
      working: [
        `Multiples of 4: ${multiples4}.`,
        `Multiples of 100: ${multiples100}; multiples of 400: ${multiples400}.`,
        `Leap years = ${multiples4} − ${multiples100} + ${multiples400} = ${leapCount}.`,
        pkg.prototypeAuthority === "CAL-PQL-024" ? `Ordinary years = ${total} − ${leapCount} = ${pkg.canonicalAnswer}.` : `Required leap-year count = ${pkg.canonicalAnswer}.`,
      ],
      conclusion: String(pkg.canonicalAnswer),
      closestTrap: "Counting every multiple of 4 as leap ignores the century exception.",
    };
  }

  if (["CAL-PQL-025", "CAL-PQL-026"].includes(pkg.prototypeAuthority) && typeof facts.year === "number") {
    const years = facts.year;
    const leapYears = Math.floor(years / 4) - Math.floor(years / 100) + Math.floor(years / 400);
    const ordinaryYears = years - leapYears;
    const rawOddDays = ordinaryYears + 2 * leapYears;
    return {
      observation: `The stated block is anchored to years 1 through ${years} of the proleptic Gregorian calendar.`,
      rule: "An ordinary year contributes 1 odd day and a leap year contributes 2; reduce the total modulo 7.",
      working: [
        `Leap years = ⌊${years}/4⌋ − ⌊${years}/100⌋ + ⌊${years}/400⌋ = ${leapYears}.`,
        `Ordinary years = ${years} − ${leapYears} = ${ordinaryYears}.`,
        `Total odd-day contribution = ${ordinaryYears} + 2 × ${leapYears} = ${rawOddDays}.`,
        `${rawOddDays} mod 7 = ${pkg.canonicalAnswer}.`,
      ],
      conclusion: String(pkg.canonicalAnswer),
      closestTrap: "The phrase ‘complete years’ is not enough unless the block is anchored, because leap-year positions matter.",
    };
  }

  if (["CAL-PQL-029", "CAL-PQL-030", "CAL-PQL-031", "CAL-PQL-032", "CAL-PQL-033"].includes(pkg.prototypeAuthority) && typeof facts.year === "number") {
    const comparisonYear = pkg.prototypeAuthority === "CAL-PQL-032"
      ? Number(facts.secondYear)
      : typeof pkg.canonicalAnswer === "number"
        ? pkg.canonicalAnswer
        : Number.NaN;
    if (Number.isFinite(comparisonYear)) {
      const firstA = ordinalWeekday({ year: facts.year, month: 1, day: 1 });
      const firstB = ordinalWeekday({ year: comparisonYear, month: 1, day: 1 });
      const sameLeap = ordinalLeapYear(facts.year) === ordinalLeapYear(comparisonYear);
      const scope = pkg.prototypeAuthority === "CAL-PQL-033" && facts.month
        ? `${formatDate({ year: facts.year, month: facts.month, day: 1 }, "en-IN")} month pattern`
        : "full-year calendar";
      return {
        observation: `Compare ${facts.year} with ${comparisonYear} for the required ${scope}.`,
        rule: pkg.prototypeAuthority === "CAL-PQL-033"
          ? "A month matches when its first weekday and month length both match."
          : "A full-year calendar matches only when 1 January and leap status both match.",
        working: [
          `1 January ${facts.year}: ${weekdayName(firstA, "en-IN")}.`,
          `1 January ${comparisonYear}: ${weekdayName(firstB, "en-IN")}.`,
          `Leap status matches: ${sameLeap ? "yes" : "no"}.`,
        ],
        conclusion: displaySemantic(pkg.canonicalAnswer, pkg.outputType, "en-IN"),
        closestTrap: "Matching only 1 January or only leap status is insufficient for a full-year match.",
      };
    }
  }

  if (pkg.prototypeAuthority === "CAL-PQL-034" && typeof facts.year === "number" && facts.yearRange) {
    const matches = matchingFullYearsInRange(facts.year, facts.yearRange.start, facts.yearRange.end);
    return {
      observation: `Count only years in ${facts.yearRange.start}–${facts.yearRange.end} whose full calendars match ${facts.year}.`,
      rule: "Each matching year must have both the same 1 January weekday and the same leap status.",
      working: [
        `Matching years found: ${matches.join(", ") || "none"}.`,
        `Number of matching years = ${matches.length}.`,
      ],
      conclusion: String(pkg.canonicalAnswer),
      closestTrap: "A year with the same starting weekday but different leap status is not a full-calendar match.",
    };
  }

  if (["CAL-PQL-040", "CAL-PQL-041"].includes(pkg.prototypeAuthority) && typeof facts.year === "number" && facts.month) {
    const length = ordinalDaysInMonth(facts.year, facts.month);
    const first = ordinalWeekday({ year: facts.year, month: facts.month, day: 1 });
    return {
      observation: `${formatDate({ year: facts.year, month: facts.month, day: 1 }, "en-IN")} starts on ${weekdayName(first, "en-IN")} and the month has ${length} days.`,
      rule: "Every weekday occurs four times; the extra days, starting from the first weekday, occur a fifth time.",
      working: [
        `${length} = 4 × 7 + ${length % 7}.`,
        `The first ${length % 7} weekday(s) from ${weekdayName(first, "en-IN")} receive one extra occurrence.`,
      ],
      conclusion: displaySemantic(pkg.canonicalAnswer, pkg.outputType, "en-IN"),
      closestTrap: "Assigning the extra occurrences from the wrong starting weekday changes the result.",
    };
  }

  if (["CAL-PQL-042", "CAL-PQL-043"].includes(pkg.prototypeAuthority) && typeof facts.year === "number") {
    const length = ordinalLeapYear(facts.year) ? 366 : 365;
    const first = ordinalWeekday({ year: facts.year, month: 1, day: 1 });
    return {
      observation: `${facts.year} has ${length} days and starts on ${weekdayName(first, "en-IN")}.`,
      rule: "Every weekday occurs 52 times; the remaining one or two days determine the weekday(s) occurring 53 times.",
      working: [
        `${length} = 52 × 7 + ${length % 7}.`,
        `The extra weekday sequence starts from ${weekdayName(first, "en-IN")}.`,
      ],
      conclusion: displaySemantic(pkg.canonicalAnswer, pkg.outputType, "en-IN"),
      closestTrap: "Using 365 days for a leap year or starting the extra sequence on the wrong weekday gives a wrong frequency.",
    };
  }

  if (pkg.prototypeAuthority === "CAL-PQL-044" && facts.anchorDate && facts.targetDate) {
    const days = Math.abs(ordinalDifference(facts.anchorDate, facts.targetDate)) + 1;
    const first = ordinalWeekday(facts.anchorDate);
    return {
      observation: `The inclusive span contains ${days} days and begins on ${weekdayName(first, "en-IN")}.`,
      rule: "Split the span into complete weeks and distribute the remaining days from the starting weekday.",
      working: [
        `${days} = ${Math.floor(days / 7)} × 7 + ${days % 7}.`,
        `Each weekday occurs ${Math.floor(days / 7)} times before the ${days % 7} remaining day(s) are assigned.`,
      ],
      conclusion: String(pkg.canonicalAnswer),
      closestTrap: "Excluding one endpoint changes both the span length and possibly the named-weekday count.",
    };
  }

  return base;
}

export function applyExamReadinessRemediation(pkg: CalendarQuestionPackage): CalendarQuestionPackage {
  const remediated: CalendarQuestionPackage = {
    ...pkg,
    stem: pkg.locale === "en-IN" ? normaliseEnglishStem(pkg.stem) : pkg.stem,
    facts: { ...pkg.facts },
    options: pkg.options.map((option) => ({ ...option })),
    explanation: { ...pkg.explanation },
  };

  if (pkg.prototypeAuthority === "CAL-PQL-021") {
    remediated.options = remediated.options.map((option) => {
      const label = classificationLabel(option.semanticValue, pkg.locale);
      if (!label) return option;
      return {
        ...option,
        display: label,
        explanation: option.isCorrect
          ? `${label} is the correct mutually exclusive Gregorian classification.`
          : `${label} follows the stated misconception and is not the correct classification.`,
      };
    });
  }

  if (pkg.prototypeAuthority === "CAL-PQL-025" && typeof pkg.facts.year === "number") {
    const years = pkg.facts.year;
    remediated.facts = { ...remediated.facts, yearRange: { start: 1, end: years, inclusive: true } };
    remediated.stem = t(
      pkg.locale,
      `How many odd days are there in the first ${years} complete years of the proleptic Gregorian calendar, from year 1 through year ${years}?`,
      `प्रोलेप्टिक ग्रेगोरियन कैलेंडर में वर्ष 1 से वर्ष ${years} तक के पहले ${years} पूर्ण वर्षों में कितने विषम दिन हैं?`,
      `ਪ੍ਰੋਲੇਪਟਿਕ ਗ੍ਰੇਗੋਰੀਅਨ ਕੈਲੰਡਰ ਵਿੱਚ ਸਾਲ 1 ਤੋਂ ਸਾਲ ${years} ਤੱਕ ਦੇ ਪਹਿਲੇ ${years} ਪੂਰੇ ਸਾਲਾਂ ਵਿੱਚ ਕਿੰਨੇ ਵਿਸ਼ਮ ਦਿਨ ਹਨ?`,
    );
  }

  remediated.explanation = enrichEnglishExplanation(remediated);
  return remediated;
}

export function primaryYearsForReview(pkg: CalendarQuestionPackage): number[] {
  return extractPrimaryYears(pkg.facts);
}
