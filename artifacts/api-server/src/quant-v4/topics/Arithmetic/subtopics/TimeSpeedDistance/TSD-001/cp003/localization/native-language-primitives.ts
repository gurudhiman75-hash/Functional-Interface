import { multiply, rational, type Rational } from "../../foundation/rational";
import { formatExamNumber } from "../generation-support";
import type { TsdCp003SolvedUnit } from "../types";

export type TsdCp003NativeLanguage = "hi" | "pa";

type NativePair = Readonly<{ hi: string; pa: string }>;

const pair = (hi: string, pa: string): NativePair => Object.freeze({ hi, pa });
export const pickNative = (language: TsdCp003NativeLanguage, value: NativePair): string => value[language];

export const TSD_CP003_NATIVE_TERMS = Object.freeze({
  METHOD: pair("विधि", "ਵਿਧੀ"),
  SOLUTION: pair("हल", "ਹੱਲ"),
  ANSWER: pair("उत्तर", "ਉੱਤਰ"),
  DISTANCE: pair("दूरी", "ਦੂਰੀ"),
  SPEED: pair("गति", "ਰਫ਼ਤਾਰ"),
  TIME: pair("समय", "ਸਮਾਂ"),
  JOURNEY: pair("यात्रा", "ਸਫ਼ਰ"),
  ROUTE: pair("मार्ग", "ਰਸਤਾ"),
  SCHEDULE: pair("निर्धारित समय", "ਨਿਰਧਾਰਤ ਸਮਾਂ"),
  DELAY: pair("देरी", "ਦੇਰੀ"),
  EARLY: pair("पहले", "ਪਹਿਲਾਂ"),
  STOP: pair("ठहराव", "ਠਹਿਰਾਅ"),
  REST: pair("विश्राम", "ਆਰਾਮ"),
  OVERALL_SPEED: pair("ठहराव सहित औसत गति", "ਠਹਿਰਾਅ ਸਮੇਤ ਔਸਤ ਰਫ਼ਤਾਰ"),
  RUNNING_SPEED: pair("चलते समय की गति", "ਚੱਲਣ ਸਮੇਂ ਦੀ ਰਫ਼ਤਾਰ"),
  REMAINING_DISTANCE: pair("शेष दूरी", "ਬਾਕੀ ਦੂਰੀ"),
  REMAINING_TIME: pair("शेष समय", "ਬਾਕੀ ਸਮਾਂ"),
  WALKING: pair("पैदल", "ਪੈਦਲ"),
  RIDING: pair("सवारी से", "ਸਵਾਰੀ ਨਾਲ"),
  NEXT_DAY: pair("अगले दिन", "ਅਗਲੇ ਦਿਨ"),
  DAYS_LATER: pair("दिन बाद", "ਦਿਨ ਬਾਅਦ"),
  LATER: pair("बाद", "ਬਾਅਦ"),
  EARLIER: pair("पहले", "ਪਹਿਲਾਂ"),
  REQUIRED: pair("आवश्यक", "ਲੋੜੀਂਦੀ"),
  TOTAL: pair("कुल", "ਕੁੱਲ"),
  PERCENT: pair("प्रतिशत", "ਪ੍ਰਤੀਸ਼ਤ"),
} as const);

export const TSD_CP003_NATIVE_NUMBER_POLICY = Object.freeze({
  digits: "ASCII_0_9",
  decimalSeparator: ".",
  speedUnit: "km/h",
  distanceUnit: "km",
  clockSuffix: "AM_PM",
  percentStyle: "SOURCE_VALUE_PERCENT_SIGN",
  fractionStyle: "SOURCE_EXAM_NUMBER",
} as const);

export function formatNativeDuration(value: Rational, language: TsdCp003NativeLanguage): string {
  const minutes = multiply(value, rational(60));
  if (minutes.denominator !== 1n) {
    return `${formatExamNumber(value)} ${language === "hi" ? "घंटे" : "ਘੰਟੇ"}`;
  }

  const total = Number(minutes.numerator);
  const sign = total < 0 ? "-" : "";
  const absolute = Math.abs(total);
  const hours = Math.floor(absolute / 60);
  const remainder = absolute % 60;
  if (hours === 0) return `${sign}${remainder} ${language === "hi" ? "मिनट" : "ਮਿੰਟ"}`;
  if (remainder === 0) {
    const unit = language === "hi"
      ? (hours === 1 ? "घंटा" : "घंटे")
      : (hours === 1 ? "ਘੰਟਾ" : "ਘੰਟੇ");
    return `${sign}${hours} ${unit}`;
  }
  return `${sign}${hours} ${language === "hi" ? "घंटे" : "ਘੰਟੇ"} ${remainder} ${language === "hi" ? "मिनट" : "ਮਿੰਟ"}`;
}

export function formatNativeClock(value: Rational, language: TsdCp003NativeLanguage): string {
  if (value.denominator !== 1n) {
    return `${formatExamNumber(value)} ${language === "hi" ? "मिनट" : "ਮਿੰਟ"}`;
  }
  const total = Number(value.numerator);
  const day = Math.floor(total / 1440);
  const minuteOfDay = ((total % 1440) + 1440) % 1440;
  const hour24 = Math.floor(minuteOfDay / 60);
  const minute = minuteOfDay % 60;
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;
  const dayText = day === 0
    ? ""
    : day === 1
      ? ` ${pickNative(language, TSD_CP003_NATIVE_TERMS.NEXT_DAY)}`
      : ` ${day + 1} ${pickNative(language, TSD_CP003_NATIVE_TERMS.DAYS_LATER)}`;
  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}${dayText}`;
}

export function formatNativeSolvedValue(
  value: Rational,
  unit: TsdCp003SolvedUnit,
  language: TsdCp003NativeLanguage,
): string {
  switch (unit) {
    case "HOUR": return formatNativeDuration(value, language);
    case "KM": return `${formatExamNumber(value)} km`;
    case "KMPH": return `${formatExamNumber(value)} km/h`;
    case "COUNT": return formatExamNumber(value);
    case "PERCENT": return `${formatExamNumber(value)}%`;
    case "CLOCK_MINUTE": return formatNativeClock(value, language);
  }
}

const DEVANAGARI = /[\u0900-\u0963\u0966-\u097F]/u;
const GURMUKHI = /[\u0A00-\u0A7F]/u;
const PLACEHOLDER = /\{[^}]+\}/u;
const LATIN_WORD = /[A-Za-z]{2,}/gu;
const ALLOWED_LATIN = new Set(["km", "AM", "PM"]);

function unexpectedLatinWords(text: string): readonly string[] {
  return Object.freeze((text.match(LATIN_WORD) ?? []).filter((token) => !ALLOWED_LATIN.has(token)));
}

export function assertTsdCp003NativeText(
  text: string,
  language: TsdCp003NativeLanguage,
  label: string,
): void {
  if (!text.trim()) throw new Error(`${label}: native text is empty`);
  if (PLACEHOLDER.test(text)) throw new Error(`${label}: unresolved placeholder remains`);
  if (language === "hi") {
    if (!DEVANAGARI.test(text)) throw new Error(`${label}: Hindi text has no Devanagari content`);
    if (GURMUKHI.test(text)) throw new Error(`${label}: Hindi text contains Gurmukhi script`);
  } else {
    if (!GURMUKHI.test(text)) throw new Error(`${label}: Punjabi text has no Gurmukhi content`);
    if (DEVANAGARI.test(text)) throw new Error(`${label}: Punjabi text contains Devanagari script`);
  }
  const unexpected = unexpectedLatinWords(text);
  if (unexpected.length > 0) {
    throw new Error(`${label}: unexpected English/Latin words remain: ${[...new Set(unexpected)].join(", ")}`);
  }
}
