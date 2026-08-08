import type {
  CalendarOption,
  CalendarPrototypeId,
  CalendarQuestionPackage,
  CalculationTrace,
  Difficulty,
  DifficultyDimensions,
  GregorianDate,
  Locale,
  MisconceptionId,
  Month,
  OutputType,
  SemanticValue,
  StructuredCalendarExplanation,
  Weekday,
} from "./types.ts";
import {
  DeterministicRandom,
  addDays,
  mod7,
  oddDayLeapYear,
  ordinalDaysInMonth,
  ordinalDifference,
  ordinalLeapYear,
  ordinalWeekday,
  semanticKey,
} from "./foundation.ts";

const WEEKDAYS: Record<Locale, readonly string[]> = {
  "en-IN": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  "hi-IN": ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"],
  "pa-IN": ["ਐਤਵਾਰ", "ਸੋਮਵਾਰ", "ਮੰਗਲਵਾਰ", "ਬੁੱਧਵਾਰ", "ਵੀਰਵਾਰ", "ਸ਼ੁੱਕਰਵਾਰ", "ਸ਼ਨੀਵਾਰ"],
};

const MONTHS: Record<Locale, readonly string[]> = {
  "en-IN": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  "hi-IN": ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
  "pa-IN": ["ਜਨਵਰੀ", "ਫ਼ਰਵਰੀ", "ਮਾਰਚ", "ਅਪ੍ਰੈਲ", "ਮਈ", "ਜੂਨ", "ਜੁਲਾਈ", "ਅਗਸਤ", "ਸਤੰਬਰ", "ਅਕਤੂਬਰ", "ਨਵੰਬਰ", "ਦਸੰਬਰ"],
};

export function weekdayName(weekday: Weekday, locale: Locale): string {
  return WEEKDAYS[locale][weekday]!;
}

export function monthName(month: Month, locale: Locale): string {
  return MONTHS[locale][month - 1]!;
}

export function formatDate(date: GregorianDate, locale: Locale): string {
  return `${date.day} ${monthName(date.month, locale)} ${date.year}`;
}

export function formatWeekdaySet(value: Weekday[], locale: Locale): string {
  const names = [...value].sort((a, b) => a - b).map((weekday) => weekdayName(weekday, locale));
  return names.join(locale === "en-IN" ? ", " : "、");
}

export function displaySemantic(value: SemanticValue, outputType: OutputType, locale: Locale): string {
  if (outputType === "WEEKDAY") return weekdayName(value as Weekday, locale);
  if (outputType === "DATE") return formatDate(value as GregorianDate, locale);
  if (outputType === "WEEKDAY_SET") return formatWeekdaySet(value as Weekday[], locale);
  if (outputType === "CLASSIFICATION") {
    const labels: Record<Locale, Record<string, string>> = {
      "en-IN": {
        LEAP_YEAR: "Leap year", ORDINARY_YEAR: "Ordinary year", ORDINARY_CENTURY_YEAR: "Ordinary century year",
        LEAP_CENTURY_YEAR: "Leap century year", YES_CONTAINS_LEAP_DAY: "Yes, the span contains 29 February",
        NO_LEAP_DAY_IN_SPAN: "No, the span does not contain 29 February", INVALID_DATE_SPAN: "The stated span is invalid",
        LEAP_DAY_ONLY_AT_EXCLUDED_BOUNDARY: "29 February is only at an excluded boundary",
        IDENTICAL_FULL_YEAR_CALENDARS: "Yes, the full-year calendars are identical",
        DIFFERENT_START_WEEKDAY: "No, 1 January falls on different weekdays",
        DIFFERENT_LEAP_STATUS: "No, the years have different leap status",
        BOTH_CONDITIONS_FAIL: "No, both the starting weekday and leap status differ",
      },
      "hi-IN": {
        LEAP_YEAR: "अधिवर्ष", ORDINARY_YEAR: "साधारण वर्ष", ORDINARY_CENTURY_YEAR: "साधारण शताब्दी वर्ष",
        LEAP_CENTURY_YEAR: "अधिवर्ष शताब्दी वर्ष", YES_CONTAINS_LEAP_DAY: "हाँ, अवधि में 29 फ़रवरी शामिल है",
        NO_LEAP_DAY_IN_SPAN: "नहीं, अवधि में 29 फ़रवरी शामिल नहीं है", INVALID_DATE_SPAN: "दी गई अवधि अमान्य है",
        LEAP_DAY_ONLY_AT_EXCLUDED_BOUNDARY: "29 फ़रवरी केवल बहिष्कृत सीमा पर है",
        IDENTICAL_FULL_YEAR_CALENDARS: "हाँ, दोनों पूरे वर्ष के कैलेंडर समान हैं",
        DIFFERENT_START_WEEKDAY: "नहीं, 1 जनवरी अलग-अलग वार को है",
        DIFFERENT_LEAP_STATUS: "नहीं, दोनों वर्षों की अधिवर्ष स्थिति अलग है",
        BOTH_CONDITIONS_FAIL: "नहीं, आरंभिक वार और अधिवर्ष स्थिति दोनों अलग हैं",
      },
      "pa-IN": {
        LEAP_YEAR: "ਲੀਪ ਸਾਲ", ORDINARY_YEAR: "ਸਧਾਰਣ ਸਾਲ", ORDINARY_CENTURY_YEAR: "ਸਧਾਰਣ ਸਦੀ ਸਾਲ",
        LEAP_CENTURY_YEAR: "ਲੀਪ ਸਦੀ ਸਾਲ", YES_CONTAINS_LEAP_DAY: "ਹਾਂ, ਮਿਆਦ ਵਿੱਚ 29 ਫ਼ਰਵਰੀ ਸ਼ਾਮਲ ਹੈ",
        NO_LEAP_DAY_IN_SPAN: "ਨਹੀਂ, ਮਿਆਦ ਵਿੱਚ 29 ਫ਼ਰਵਰੀ ਸ਼ਾਮਲ ਨਹੀਂ ਹੈ", INVALID_DATE_SPAN: "ਦਿੱਤੀ ਮਿਆਦ ਅਵੈਧ ਹੈ",
        LEAP_DAY_ONLY_AT_EXCLUDED_BOUNDARY: "29 ਫ਼ਰਵਰੀ ਸਿਰਫ਼ ਬਾਹਰ ਰੱਖੀ ਹੱਦ ਉੱਤੇ ਹੈ",
        IDENTICAL_FULL_YEAR_CALENDARS: "ਹਾਂ, ਦੋਵੇਂ ਪੂਰੇ ਸਾਲਾਂ ਦੇ ਕੈਲੰਡਰ ਇਕੋ ਜਿਹੇ ਹਨ",
        DIFFERENT_START_WEEKDAY: "ਨਹੀਂ, 1 ਜਨਵਰੀ ਵੱਖ-ਵੱਖ ਵਾਰਾਂ ਨੂੰ ਹੈ",
        DIFFERENT_LEAP_STATUS: "ਨਹੀਂ, ਦੋਵੇਂ ਸਾਲਾਂ ਦੀ ਲੀਪ ਸਥਿਤੀ ਵੱਖ ਹੈ",
        BOTH_CONDITIONS_FAIL: "ਨਹੀਂ, ਸ਼ੁਰੂਆਤੀ ਵਾਰ ਅਤੇ ਲੀਪ ਸਥਿਤੀ ਦੋਵੇਂ ਵੱਖ ਹਨ",
      },
    };
    return labels[locale][String(value)] ?? String(value);
  }
  return String(value);
}

export function walkWeekday(anchor: Weekday, signedDays: number): Weekday {
  let result = anchor;
  const step = signedDays >= 0 ? 1 : -1;
  for (let i = 0; i < Math.abs(signedDays); i++) result = mod7(result + step);
  return result;
}

export function randomDate(rng: DeterministicRandom, minYear = 1800, maxYear = 2199): GregorianDate {
  const year = rng.int(minYear, maxYear);
  const month = rng.int(1, 12) as Month;
  const day = rng.int(1, ordinalDaysInMonth(year, month));
  return { year, month, day };
}

export function pickLeapYear(rng: DeterministicRandom, min = 1800, max = 2199): number {
  for (let attempt = 0; attempt < 1000; attempt++) {
    const year = rng.int(min, max);
    if (ordinalLeapYear(year)) return year;
  }
  throw new Error("Unable to select leap year.");
}

export function pickOrdinaryYear(rng: DeterministicRandom, min = 1800, max = 2199): number {
  for (let attempt = 0; attempt < 1000; attempt++) {
    const year = rng.int(min, max);
    if (!ordinalLeapYear(year)) return year;
  }
  throw new Error("Unable to select ordinary year.");
}

export function directLeapCount(start: number, end: number): number {
  let count = 0;
  for (let year = start; year <= end; year++) if (oddDayLeapYear(year)) count++;
  return count;
}

export function directCalendarMatch(yearA: number, yearB: number): boolean {
  if (ordinalLeapYear(yearA) !== ordinalLeapYear(yearB)) return false;
  const length = ordinalLeapYear(yearA) ? 366 : 365;
  const a = { year: yearA, month: 1 as Month, day: 1 };
  const b = { year: yearB, month: 1 as Month, day: 1 };
  for (let offset = 0; offset < length; offset++) {
    if (ordinalWeekday(addDays(a, offset)) !== ordinalWeekday(addDays(b, offset))) return false;
  }
  return true;
}

export function directFrequency(a: GregorianDate, b: GregorianDate, named: Weekday): number {
  const start = Math.min(0, ordinalDifference(a, b));
  const end = Math.max(0, ordinalDifference(a, b));
  const anchor = ordinalDifference(a, b) >= 0 ? a : b;
  let count = 0;
  for (let offset = start; offset <= end; offset++) if (ordinalWeekday(addDays(anchor, offset)) === named) count++;
  return count;
}

export type WrongCandidate = {
  value: SemanticValue;
  misconceptionId: MisconceptionId;
  derivation: Record<string, unknown>;
};

export type Problem = {
  queryType: string;
  facts: CalendarQuestionPackage["facts"];
  answer: SemanticValue;
  groundTruth: CalculationTrace;
  teachingTrace: CalculationTrace;
  stem: string;
  wrongs: WrongCandidate[];
  explanation: StructuredCalendarExplanation;
  coverage?: Partial<CalendarQuestionPackage["coverageFlags"]>;
  difficultyDimensions?: Partial<DifficultyDimensions>;
};

function normalizeWrongCandidates(problem: Problem): WrongCandidate[] {
  const correctKey = semanticKey(problem.answer);
  const seen = new Set<string>([correctKey]);
  const accepted: WrongCandidate[] = [];
  for (const candidate of problem.wrongs) {
    const key = semanticKey(candidate.value);
    if (!seen.has(key)) {
      accepted.push(candidate);
      seen.add(key);
    }
    if (accepted.length === 3) return accepted;
  }
  throw new Error("DISTRACTOR_METHOD_COLLISION");
}

const MISCONCEPTION_REASON: Record<MisconceptionId, Record<Locale, string>> = {
  FORWARD_BACKWARD_REVERSAL: { "en-IN": "moving in the opposite direction", "hi-IN": "उलटी दिशा में चलने", "pa-IN": "ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ ਜਾਣ" },
  SHIFT_BY_N_MINUS_ONE: { "en-IN": "using N − 1 days", "hi-IN": "N − 1 दिन लेने", "pa-IN": "N − 1 ਦਿਨ ਲੈਣ" },
  SHIFT_BY_N_PLUS_ONE: { "en-IN": "using N + 1 days", "hi-IN": "N + 1 दिन लेने", "pa-IN": "N + 1 ਦਿਨ ਲੈਣ" },
  FAILED_MOD7_REDUCTION: { "en-IN": "reducing the day count modulo 7 incorrectly", "hi-IN": "दिनों को 7 से गलत शेष में बदलने", "pa-IN": "ਦਿਨਾਂ ਨੂੰ 7 ਨਾਲ ਗਲਤ ਸ਼ੇਸ਼ ਵਿੱਚ ਬਦਲਣ" },
  NEGATIVE_MODULO_ERROR: { "en-IN": "handling a backward remainder incorrectly", "hi-IN": "पीछे की ओर शेष को गलत संभालने", "pa-IN": "ਪਿੱਛੇ ਵਾਲੇ ਸ਼ੇਸ਼ ਨੂੰ ਗਲਤ ਸੰਭਾਲਣ" },
  COUNTED_ANCHOR_AS_DAY_ONE: { "en-IN": "counting the anchor date as day one", "hi-IN": "आरंभिक तिथि को पहला दिन गिनने", "pa-IN": "ਸ਼ੁਰੂਆਤੀ ਤਾਰੀਖ ਨੂੰ ਪਹਿਲਾ ਦਿਨ ਗਿਣਨ" },
  OMITTED_TARGET_DATE: { "en-IN": "omitting the target date", "hi-IN": "अंतिम तिथि छोड़ने", "pa-IN": "ਅੰਤਿਮ ਤਾਰੀਖ ਛੱਡਣ" },
  INCLUDED_BOTH_DATES: { "en-IN": "including both boundary dates under the wrong count contract", "hi-IN": "गलत नियम में दोनों सीमा तिथियाँ शामिल करने", "pa-IN": "ਗਲਤ ਨਿਯਮ ਹੇਠ ਦੋਵੇਂ ਹੱਦ ਤਾਰੀਖਾਂ ਸ਼ਾਮਲ ਕਰਨ" },
  EXCLUDED_BOTH_DATES: { "en-IN": "excluding both boundary dates under the wrong count contract", "hi-IN": "गलत नियम में दोनों सीमा तिथियाँ हटाने", "pa-IN": "ਗਲਤ ਨਿਯਮ ਹੇਠ ਦੋਵੇਂ ਹੱਦ ਤਾਰੀਖਾਂ ਹਟਾਉਣ" },
  WRONG_MONTH_LENGTH_30_FOR_31: { "en-IN": "treating a 31-day month as 30 days", "hi-IN": "31 दिन के महीने को 30 दिन मानने", "pa-IN": "31 ਦਿਨਾਂ ਵਾਲੇ ਮਹੀਨੇ ਨੂੰ 30 ਦਿਨ ਮੰਨਣ" },
  WRONG_MONTH_LENGTH_31_FOR_30: { "en-IN": "treating a 30-day month as 31 days", "hi-IN": "30 दिन के महीने को 31 दिन मानने", "pa-IN": "30 ਦਿਨਾਂ ਵਾਲੇ ਮਹੀਨੇ ਨੂੰ 31 ਦਿਨ ਮੰਨਣ" },
  FEBRUARY_ALWAYS_28: { "en-IN": "always treating February as 28 days", "hi-IN": "फ़रवरी को हमेशा 28 दिन मानने", "pa-IN": "ਫ਼ਰਵਰੀ ਨੂੰ ਹਮੇਸ਼ਾ 28 ਦਿਨ ਮੰਨਣ" },
  FEBRUARY_ALWAYS_29: { "en-IN": "always treating February as 29 days", "hi-IN": "फ़रवरी को हमेशा 29 दिन मानने", "pa-IN": "ਫ਼ਰਵਰੀ ਨੂੰ ਹਮੇਸ਼ਾ 29 ਦਿਨ ਮੰਨਣ" },
  FEB29_WRONGLY_INCLUDED: { "en-IN": "including 29 February when it is outside the span", "hi-IN": "29 फ़रवरी को अवधि से बाहर होने पर भी गिनने", "pa-IN": "29 ਫ਼ਰਵਰੀ ਨੂੰ ਮਿਆਦ ਤੋਂ ਬਾਹਰ ਹੋਣ ਦੇ ਬਾਵਜੂਦ ਗਿਣਨ" },
  FEB29_WRONGLY_EXCLUDED: { "en-IN": "omitting 29 February from the span", "hi-IN": "अवधि से 29 फ़रवरी हटाने", "pa-IN": "ਮਿਆਦ ਵਿੱਚੋਂ 29 ਫ਼ਰਵਰੀ ਹਟਾਉਣ" },
  LEAP_EVERY_FOUR_YEARS_ONLY: { "en-IN": "using only the divisible-by-4 shortcut", "hi-IN": "केवल 4 से विभाज्यता वाला अधूरा नियम लगाने", "pa-IN": "ਸਿਰਫ਼ 4 ਨਾਲ ਭਾਗਯੋਗਤਾ ਵਾਲਾ ਅਧੂਰਾ ਨਿਯਮ ਲਗਾਉਣ" },
  CENTURY_ALWAYS_LEAP: { "en-IN": "treating every century year as leap", "hi-IN": "हर शताब्दी वर्ष को अधिवर्ष मानने", "pa-IN": "ਹਰ ਸਦੀ ਸਾਲ ਨੂੰ ਲੀਪ ਸਾਲ ਮੰਨਣ" },
  CENTURY_NEVER_LEAP: { "en-IN": "treating every century year as ordinary", "hi-IN": "हर शताब्दी वर्ष को साधारण मानने", "pa-IN": "ਹਰ ਸਦੀ ਸਾਲ ਨੂੰ ਸਧਾਰਣ ਮੰਨਣ" },
  DIVISIBLE_BY_400_RULE_OMITTED: { "en-IN": "omitting the divisible-by-400 exception", "hi-IN": "400 से विभाज्यता का अपवाद छोड़ने", "pa-IN": "400 ਨਾਲ ਭਾਗਯੋਗਤਾ ਵਾਲਾ ਅਪਵਾਦ ਛੱਡਣ" },
  ORDINARY_YEAR_AS_TWO_ODD_DAYS: { "en-IN": "assigning two odd days to an ordinary year", "hi-IN": "साधारण वर्ष को दो विषम दिन देने", "pa-IN": "ਸਧਾਰਣ ਸਾਲ ਨੂੰ ਦੋ ਵਾਧੂ ਦਿਨ ਦੇਣ" },
  LEAP_YEAR_AS_ONE_ODD_DAY: { "en-IN": "assigning one odd day to a leap year", "hi-IN": "अधिवर्ष को एक विषम दिन देने", "pa-IN": "ਲੀਪ ਸਾਲ ਨੂੰ ਇੱਕ ਵਾਧੂ ਦਿਨ ਦੇਣ" },
  CENTURY_BLOCK_OFFSET_ERROR: { "en-IN": "using the wrong century-block offset", "hi-IN": "शताब्दी खंड का गलत शेष लेने", "pa-IN": "ਸਦੀ ਖੰਡ ਦਾ ਗਲਤ ਸ਼ੇਸ਼ ਲੈਣ" },
  START_WEEKDAY_MATCH_ONLY: { "en-IN": "checking only the weekday of 1 January", "hi-IN": "केवल 1 जनवरी का वार मिलाने", "pa-IN": "ਸਿਰਫ਼ 1 ਜਨਵਰੀ ਦਾ ਵਾਰ ਮਿਲਾਉਣ" },
  YEAR_TYPE_MATCH_ONLY: { "en-IN": "checking only whether both years are leap or ordinary", "hi-IN": "केवल दोनों वर्षों की अधिवर्ष स्थिति मिलाने", "pa-IN": "ਸਿਰਫ਼ ਦੋਵੇਂ ਸਾਲਾਂ ਦੀ ਲੀਪ ਸਥਿਤੀ ਮਿਲਾਉਣ" },
  FULL_YEAR_RULE_USED_FOR_MONTH_MATCH: { "en-IN": "using the full-year rule for a month-only match", "hi-IN": "महीने के मिलान पर पूरे वर्ष का नियम लगाने", "pa-IN": "ਮਹੀਨੇ ਦੇ ਮਿਲਾਨ ਲਈ ਪੂਰੇ ਸਾਲ ਦਾ ਨਿਯਮ ਲਗਾਉਣ" },
  MONTH_MATCH_RULE_USED_FOR_FULL_YEAR: { "en-IN": "using a month-only rule for a full-year match", "hi-IN": "पूरे वर्ष के मिलान पर केवल महीने का नियम लगाने", "pa-IN": "ਪੂਰੇ ਸਾਲ ਦੇ ਮਿਲਾਨ ਲਈ ਸਿਰਫ਼ ਮਹੀਨੇ ਦਾ ਨਿਯਮ ਲਗਾਉਣ" },
  FIRST_LAST_DAY_OFF_BY_ONE: { "en-IN": "using the period length instead of length − 1", "hi-IN": "पहले से अंतिम दिन के लिए अवधि के स्थान पर अवधि − 1 न लेने", "pa-IN": "ਪਹਿਲੇ ਤੋਂ ਆਖ਼ਰੀ ਦਿਨ ਲਈ ਮਿਆਦ ਦੀ ਥਾਂ ਮਿਆਦ − 1 ਨਾ ਲੈਣ" },
  FREQUENCY_EXTRA_DAYS_FROM_WRONG_START: { "en-IN": "assigning the extra weekdays from the wrong starting weekday", "hi-IN": "अतिरिक्त वार गलत आरंभिक वार से बाँटने", "pa-IN": "ਵਾਧੂ ਵਾਰ ਗਲਤ ਸ਼ੁਰੂਆਤੀ ਵਾਰ ਤੋਂ ਵੰਡਣ" },
  FREQUENCY_USED_365_FOR_LEAP_YEAR: { "en-IN": "using 365 days for a leap year", "hi-IN": "अधिवर्ष के लिए 365 दिन लेने", "pa-IN": "ਲੀਪ ਸਾਲ ਲਈ 365 ਦਿਨ ਲੈਣ" },
  FREQUENCY_USED_366_FOR_ORDINARY_YEAR: { "en-IN": "using 366 days for an ordinary year", "hi-IN": "साधारण वर्ष के लिए 366 दिन लेने", "pa-IN": "ਸਧਾਰਣ ਸਾਲ ਲਈ 366 ਦਿਨ ਲੈਣ" },
};

function optionExplanation(misconceptionId: MisconceptionId | undefined, display: string, locale: Locale, derivation?: Record<string, unknown>): string {
  if (!misconceptionId) {
    if (locale === "hi-IN") return `${display} सत्यापित गणना से प्राप्त सही उत्तर है।`;
    if (locale === "pa-IN") return `${display} ਪ੍ਰਮਾਣਿਤ ਗਣਨਾ ਤੋਂ ਮਿਲਿਆ ਸਹੀ ਉੱਤਰ ਹੈ।`;
    return `${display} is the correct result from the verified calculation.`;
  }
  const reason = MISCONCEPTION_REASON[misconceptionId][locale];
  const numericEvidence = Object.values(derivation ?? {}).filter((value) => typeof value === "number" || typeof value === "string").slice(0, 2).join(", ");
  const evidence = numericEvidence ? ` (${numericEvidence})` : "";
  if (locale === "hi-IN") return `${reason}${evidence} पर ${display} मिलता है; इसलिए यह विकल्प गलत है।`;
  if (locale === "pa-IN") return `${reason}${evidence} ਨਾਲ ${display} ਮਿਲਦਾ ਹੈ; ਇਸ ਲਈ ਇਹ ਵਿਕਲਪ ਗਲਤ ਹੈ।`;
  return `${reason}${evidence} gives ${display}; therefore this option is incorrect.`;
}

export function buildOptions(problem: Problem, outputType: OutputType, locale: Locale, prototypeId: CalendarPrototypeId, seed: number): { options: CalendarOption[]; answerIndex: 0 | 1 | 2 | 3 } {
  const wrongs = normalizeWrongCandidates(problem);
  const rng = new DeterministicRandom(`${prototypeId}:${seed}:options`);
  const shuffledWrongs = rng.shuffle(wrongs);
  const correct: CalendarOption = {
    semanticType: outputType,
    semanticValue: problem.answer,
    display: displaySemantic(problem.answer, outputType, locale),
    isCorrect: true,
    explanation: optionExplanation(undefined, displaySemantic(problem.answer, outputType, locale), locale),
  };
  const wrongOptions: CalendarOption[] = shuffledWrongs.map((wrong) => ({
    semanticType: outputType,
    semanticValue: wrong.value,
    display: displaySemantic(wrong.value, outputType, locale),
    isCorrect: false,
    misconceptionId: wrong.misconceptionId,
    derivation: wrong.derivation,
    explanation: optionExplanation(wrong.misconceptionId, displaySemantic(wrong.value, outputType, locale), locale, wrong.derivation),
  }));
  const numericId = Number(prototypeId.slice(-3));
  const answerIndex = ((seed + numericId) % 4) as 0 | 1 | 2 | 3;
  const options = [...wrongOptions];
  options.splice(answerIndex, 0, correct);
  return { options, answerIndex };
}

export function difficultyFromDimensions(dimensions: DifficultyDimensions): Difficulty {
  let score = dimensions.D1ArithmeticSegments + dimensions.D7OutputComplexity + dimensions.D9TrapCollisions + dimensions.D10InformationFiltering;
  for (const flag of [dimensions.D2ReverseReasoning, dimensions.D3MonthBoundary, dimensions.D4LeapDayExposure, dimensions.D5CenturyExposure, dimensions.D6CountInterpretation, dimensions.D8InverseReasoning]) if (flag) score += 2;
  return score >= 14 ? "HARD" : score >= 8 ? "MEDIUM" : "EASY";
}

export function defaultDimensions(problem: Problem, seed: number): DifficultyDimensions {
  return {
    D1ArithmeticSegments: 1 + (seed % 3),
    D2ReverseReasoning: false,
    D3MonthBoundary: Boolean(problem.coverage?.crossesMonth),
    D4LeapDayExposure: Boolean(problem.coverage?.crossesFeb29),
    D5CenturyExposure: Boolean(problem.coverage?.crossesCentury || problem.coverage?.usesCenturyYear),
    D6CountInterpretation: Boolean(problem.facts.countSemantics),
    D7OutputComplexity: problem.answer instanceof Array ? 3 : typeof problem.answer === "object" ? 2 : 1,
    D8InverseReasoning: false,
    D9TrapCollisions: 2 + (seed % 2),
    D10InformationFiltering: seed % 3,
    ...problem.difficultyDimensions,
  };
}

export function makeExplanation(locale: Locale, observation: string, rule: string, working: string[], conclusion: string, closestTrap?: string): StructuredCalendarExplanation {
  const verification = locale === "hi-IN"
    ? "स्वतंत्र ग्रेगोरियन गणना ने भी यही उत्तर सत्यापित किया।"
    : locale === "pa-IN"
      ? "ਸੁਤੰਤਰ ਗ੍ਰੇਗੋਰੀਅਨ ਗਣਨਾ ਨੇ ਵੀ ਇਹੀ ਉੱਤਰ ਪ੍ਰਮਾਣਿਤ ਕੀਤਾ।"
      : "An independent Gregorian calculation verified the same answer.";
  return { observation, rule, working, conclusion, closestTrap, verification };
}

export function t(locale: Locale, en: string, hi: string, pa: string): string {
  return locale === "hi-IN" ? hi : locale === "pa-IN" ? pa : en;
}
