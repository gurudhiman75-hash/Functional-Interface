import type { GregorianDate, Locale, Month, Weekday } from "./types.ts";
import {
  CALENDAR_SOURCE_GAP_PROTOTYPES,
  generateCalendarSourceGapQuestion,
  selectCalendarSourceGapReviewQuestions,
  type CalendarSourceGapExplanation,
  type CalendarSourceGapPrototypeId,
  type CalendarSourceGapQuestion,
} from "./source-gap-runtime.ts";
import { ordinalLeapYear } from "./foundation.ts";
import { formatDate, monthName, weekdayName } from "./runtime-shared.ts";

export const CAL_001_MULTILINGUAL_SOURCE_GAP_VERSION =
  "CAL_001_MULTILINGUAL_SOURCE_GAP_V1" as const;

type FrozenLocale = Exclude<Locale, "en-IN">;
type Pair = { hi: string; pa: string };

export type LocalizedCalendarSourceGapQuestion = Omit<
  CalendarSourceGapQuestion,
  "stem" | "options" | "explanation"
> & {
  locale: Locale;
  stem: string;
  options: string[];
  explanation: CalendarSourceGapExplanation;
};

function t(locale: FrozenLocale, pair: Pair): string {
  return locale === "hi-IN" ? pair.hi : pair.pa;
}

function dateList(values: readonly number[], locale: FrozenLocale): string {
  if (values.length === 0) return t(locale, { hi: "कोई नहीं", pa: "ਕੋਈ ਨਹੀਂ" });
  if (values.length === 1) return String(values[0]);
  const and = t(locale, { hi: "और", pa: "ਅਤੇ" });
  if (values.length === 2) return `${values[0]} ${and} ${values[1]}`;
  return `${values.slice(0, -1).join(", ")} ${and} ${values.at(-1)}`;
}

function recurrence(
  source: CalendarSourceGapQuestion,
  locale: FrozenLocale,
): LocalizedCalendarSourceGapQuestion {
  const facts = source.facts as {
    date: GregorianDate;
    weekday: Weekday;
    nextRecurrenceYear: number;
    checkedYears: Array<{ year: number; remainder: Weekday }>;
  };
  const date = facts.date;
  const weekday = weekdayName(facts.weekday, locale);
  const checked = facts.checkedYears.slice(0, -1);
  return {
    ...source,
    locale,
    stem: t(locale, {
      hi: `${formatDate(date, locale)} को ${weekday} है। अगली बार यही तिथि ${weekday} किस वर्ष होगी?`,
      pa: `${formatDate(date, locale)} ਨੂੰ ${weekday} ਹੈ। ਅਗਲੀ ਵਾਰ ਇਹੀ ਤਾਰੀਖ ${weekday} ਕਿਸ ਸਾਲ ਹੋਵੇਗੀ?`,
    }),
    options: source.optionValues.map(String),
    explanation: {
      observation: t(locale, {
        hi: `${date.day} ${monthName(date.month, locale)} का वार फिर ${weekday} होना चाहिए।`,
        pa: `${date.day} ${monthName(date.month, locale)} ਦਾ ਵਾਰ ਮੁੜ ${weekday} ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`,
      }),
      rule: t(locale, {
        hi: "हर अगले वैध वर्ष में इसी तिथि तक के वास्तविक दिन-अंतर को 7 से भाग दें। पहला शून्य शेष आवश्यक वर्ष है।",
        pa: "ਹਰ ਅਗਲੇ ਵੈਧ ਸਾਲ ਵਿੱਚ ਇਸੇ ਤਾਰੀਖ ਤੱਕ ਦੇ ਅਸਲ ਦਿਨ-ਅੰਤਰ ਨੂੰ 7 ਨਾਲ ਭਾਗ ਦਿਓ। ਪਹਿਲਾ ਸਿਫ਼ਰ ਬਾਕੀ ਲੋੜੀਂਦਾ ਸਾਲ ਹੈ।",
      }),
      working: [
        checked.length
          ? t(locale, {
              hi: `पहले जाँचे गए वर्ष: ${checked.map((entry) => `${entry.year} (शेष ${entry.remainder})`).join(", ")}।`,
              pa: `ਪਹਿਲਾਂ ਜਾਂਚੇ ਸਾਲ: ${checked.map((entry) => `${entry.year} (ਬਾਕੀ ${entry.remainder})`).join(", ")}।`,
            })
          : t(locale, { hi: "इससे पहले कोई वैध वर्ष नहीं आता।", pa: "ਇਸ ਤੋਂ ਪਹਿਲਾਂ ਕੋਈ ਵੈਧ ਸਾਲ ਨਹੀਂ ਆਉਂਦਾ।" }),
        t(locale, {
          hi: `${facts.nextRecurrenceYear} में शेष 0 है, इसलिए वार समान है।`,
          pa: `${facts.nextRecurrenceYear} ਵਿੱਚ ਬਾਕੀ 0 ਹੈ, ਇਸ ਲਈ ਵਾਰ ਇੱਕੋ ਹੈ।`,
        }),
      ],
      conclusion: String(source.canonicalAnswer),
      closestTrap: t(locale, {
        hi: "केवल वर्ष का प्रकार मिलाना या निश्चित 4, 5 या 6 वर्ष जोड़ना इस विशेष तिथि के समान वार की गारंटी नहीं देता।",
        pa: "ਕੇਵਲ ਸਾਲ ਦੀ ਕਿਸਮ ਮਿਲਾਉਣਾ ਜਾਂ ਨਿਸ਼ਚਿਤ 4, 5 ਜਾਂ 6 ਸਾਲ ਜੋੜਨਾ ਇਸ ਖ਼ਾਸ ਤਾਰੀਖ ਦੇ ਇੱਕੋ ਵਾਰ ਦੀ ਗਾਰੰਟੀ ਨਹੀਂ ਦਿੰਦਾ।",
      }),
    },
  };
}

function datesInMonth(
  source: CalendarSourceGapQuestion,
  locale: FrozenLocale,
): LocalizedCalendarSourceGapQuestion {
  const facts = source.facts as {
    year: number;
    month: Month;
    namedWeekday: Weekday;
    monthLength: number;
    firstWeekday: Weekday;
    dates: number[];
  };
  const named = weekdayName(facts.namedWeekday, locale);
  const month = monthName(facts.month, locale);
  return {
    ...source,
    locale,
    stem: t(locale, {
      hi: `${month} ${facts.year} में ${named} किन तिथियों को आता है?`,
      pa: `${month} ${facts.year} ਵਿੱਚ ${named} ਕਿਹੜੀਆਂ ਤਾਰੀਖਾਂ ਨੂੰ ਆਉਂਦਾ ਹੈ?`,
    }),
    options: source.optionValues.map((value) => dateList(value as number[], locale)),
    explanation: {
      observation: t(locale, {
        hi: `${month} ${facts.year} का पहला वार ${weekdayName(facts.firstWeekday, locale)} है और महीने में ${facts.monthLength} दिन हैं।`,
        pa: `${month} ${facts.year} ਦਾ ਪਹਿਲਾ ਵਾਰ ${weekdayName(facts.firstWeekday, locale)} ਹੈ ਅਤੇ ਮਹੀਨੇ ਵਿੱਚ ${facts.monthLength} ਦਿਨ ਹਨ।`,
      }),
      rule: t(locale, {
        hi: "पहले आवश्यक वार की पहली तिथि निकालें, फिर हर बार 7 जोड़ते जाएँ जब तक तिथि महीने के भीतर रहे।",
        pa: "ਪਹਿਲਾਂ ਲੋੜੀਂਦੇ ਵਾਰ ਦੀ ਪਹਿਲੀ ਤਾਰੀਖ ਕੱਢੋ, ਫਿਰ ਹਰ ਵਾਰ 7 ਜੋੜਦੇ ਜਾਓ ਜਦ ਤੱਕ ਤਾਰੀਖ ਮਹੀਨੇ ਅੰਦਰ ਰਹੇ।",
      }),
      working: [
        t(locale, { hi: `पहला ${named} ${facts.dates[0]} तारीख को है।`, pa: `ਪਹਿਲਾ ${named} ${facts.dates[0]} ਤਾਰੀਖ ਨੂੰ ਹੈ।` }),
        t(locale, { hi: `तिथियाँ: ${facts.dates.join(" → ")}।`, pa: `ਤਾਰੀਖਾਂ: ${facts.dates.join(" → ")}।` }),
      ],
      conclusion: dateList(facts.dates, locale),
      closestTrap: t(locale, {
        hi: "पहली तिथि एक दिन गलत लेने से पूरी सूची एक दिन खिसक जाती है; महीने से बाहर की अगली तिथि नहीं जोड़नी चाहिए।",
        pa: "ਪਹਿਲੀ ਤਾਰੀਖ ਇੱਕ ਦਿਨ ਗਲਤ ਲੈਣ ਨਾਲ ਪੂਰੀ ਸੂਚੀ ਇੱਕ ਦਿਨ ਖਿਸਕ ਜਾਂਦੀ ਹੈ; ਮਹੀਨੇ ਤੋਂ ਬਾਹਰ ਵਾਲੀ ਅਗਲੀ ਤਾਰੀਖ ਨਹੀਂ ਜੋੜਨੀ ਚਾਹੀਦੀ।",
      }),
    },
  };
}

function leapDayCount(
  source: CalendarSourceGapQuestion,
  locale: FrozenLocale,
): LocalizedCalendarSourceGapQuestion {
  const facts = source.facts as {
    yearRange: { start: number; end: number; inclusive: true };
    answer: number;
  };
  const { start, end } = facts.yearRange;
  const through = (year: number): number =>
    Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400);
  return {
    ...source,
    locale,
    stem: t(locale, {
      hi: `${start} से ${end} तक, दोनों वर्षों सहित, 29 फ़रवरी कितनी बार आती है?`,
      pa: `${start} ਤੋਂ ${end} ਤੱਕ, ਦੋਵੇਂ ਸਾਲਾਂ ਸਮੇਤ, 29 ਫ਼ਰਵਰੀ ਕਿੰਨੀ ਵਾਰ ਆਉਂਦੀ ਹੈ?`,
    }),
    options: source.optionValues.map(String),
    explanation: {
      observation: t(locale, {
        hi: "29 फ़रवरी केवल ग्रेगोरियन अधिवर्ष में आती है।",
        pa: "29 ਫ਼ਰਵਰੀ ਕੇਵਲ ਗ੍ਰੇਗੋਰੀਅਨ ਲੀਪ ਸਾਲ ਵਿੱਚ ਆਉਂਦੀ ਹੈ।",
      }),
      rule: t(locale, {
        hi: "4 के गुणज गिनें, 100 के गुणज घटाएँ और 400 के गुणज वापस जोड़ें। फिर आरंभिक वर्ष से पहले तक की संख्या घटाएँ।",
        pa: "4 ਦੇ ਗੁਣਜ ਗਿਣੋ, 100 ਦੇ ਗੁਣਜ ਘਟਾਓ ਅਤੇ 400 ਦੇ ਗੁਣਜ ਵਾਪਸ ਜੋੜੋ। ਫਿਰ ਸ਼ੁਰੂਆਤੀ ਸਾਲ ਤੋਂ ਪਹਿਲਾਂ ਤੱਕ ਦੀ ਗਿਣਤੀ ਘਟਾਓ।",
      }),
      working: [
        t(locale, { hi: `${end} तक अधिवर्ष = ${through(end)}।`, pa: `${end} ਤੱਕ ਲੀਪ ਸਾਲ = ${through(end)}।` }),
        t(locale, { hi: `${start - 1} तक अधिवर्ष = ${through(start - 1)}।`, pa: `${start - 1} ਤੱਕ ਲੀਪ ਸਾਲ = ${through(start - 1)}।` }),
        t(locale, { hi: `आवश्यक संख्या = ${through(end)} − ${through(start - 1)} = ${facts.answer}।`, pa: `ਲੋੜੀਂਦੀ ਗਿਣਤੀ = ${through(end)} − ${through(start - 1)} = ${facts.answer}।` }),
      ],
      conclusion: String(source.canonicalAnswer),
      closestTrap: t(locale, {
        hi: "कुल वर्षों को केवल 4 से भाग देना सीमाओं और शताब्दी अपवाद को अनदेखा करता है।",
        pa: "ਕੁੱਲ ਸਾਲਾਂ ਨੂੰ ਕੇਵਲ 4 ਨਾਲ ਭਾਗ ਦੇਣਾ ਹੱਦਾਂ ਅਤੇ ਸਦੀ ਅਪਵਾਦ ਨੂੰ ਅਣਡਿੱਠਾ ਕਰਦਾ ਹੈ।",
      }),
    },
  };
}

export function generateLocalizedCalendarSourceGapQuestion(
  id: CalendarSourceGapPrototypeId,
  seed: number,
  locale: Locale,
): LocalizedCalendarSourceGapQuestion {
  const source = generateCalendarSourceGapQuestion(id, seed);
  if (locale === "en-IN") return { ...source, locale };
  if (id === "CAL-GAP-PROT-001") return recurrence(source, locale);
  if (id === "CAL-GAP-PROT-002") return datesInMonth(source, locale);
  return leapDayCount(source, locale);
}

export function selectLocalizedCalendarSourceGapReviewQuestions(
  id: CalendarSourceGapPrototypeId,
  locale: Locale,
): LocalizedCalendarSourceGapQuestion[] {
  return selectCalendarSourceGapReviewQuestions(id).map((question) =>
    generateLocalizedCalendarSourceGapQuestion(id, question.seed, locale),
  );
}

export const CAL_001_MULTILINGUAL_SOURCE_GAP_PROTOTYPES = CALENDAR_SOURCE_GAP_PROTOTYPES;
