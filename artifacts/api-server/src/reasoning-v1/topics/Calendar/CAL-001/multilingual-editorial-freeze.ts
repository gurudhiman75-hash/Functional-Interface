import type {
  CalendarOption,
  CalendarQuestionPackage,
  GregorianDate,
  Locale,
  Month,
  SemanticValue,
  StructuredCalendarExplanation,
  Weekday,
} from "./types.ts";
import {
  displaySemantic,
  formatDate,
  monthName,
  weekdayName,
} from "./runtime-shared.ts";
import {
  mod7,
  ordinalDaysInMonth,
  ordinalLeapYear,
  ordinalDifference,
  ordinalWeekday,
} from "./foundation.ts";

export const CAL_001_MULTILINGUAL_EDITORIAL_FREEZE_VERSION =
  "CAL_001_MULTILINGUAL_EDITORIAL_FREEZE_V1" as const;

type FrozenLocale = Exclude<Locale, "en-IN">;
type TextPair = { hi: string; pa: string };

function t(locale: FrozenLocale, pair: TextPair): string {
  return locale === "hi-IN" ? pair.hi : pair.pa;
}

function numberFact(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`CAL-001 multilingual freeze: missing ${label}.`);
  }
  return value;
}

function dateFact(value: unknown, label: string): GregorianDate {
  if (!value || typeof value !== "object") {
    throw new Error(`CAL-001 multilingual freeze: missing ${label}.`);
  }
  const date = value as GregorianDate;
  if (![date.year, date.month, date.day].every(Number.isFinite)) {
    throw new Error(`CAL-001 multilingual freeze: invalid ${label}.`);
  }
  return date;
}

function weekdayFact(value: unknown, label: string): Weekday {
  const weekday = numberFact(value, label);
  if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6) {
    throw new Error(`CAL-001 multilingual freeze: invalid ${label}.`);
  }
  return weekday as Weekday;
}

function monthFact(value: unknown): Month {
  const month = numberFact(value, "month");
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error("CAL-001 multilingual freeze: invalid month.");
  }
  return month as Month;
}

function classification(value: string, locale: FrozenLocale): string {
  const labels: Record<string, TextPair> = {
    LEAP_YEAR: { hi: "गैर-शताब्दी अधिवर्ष", pa: "ਗੈਰ-ਸਦੀ ਲੀਪ ਸਾਲ" },
    ORDINARY_YEAR: { hi: "गैर-शताब्दी साधारण वर्ष", pa: "ਗੈਰ-ਸਦੀ ਸਧਾਰਣ ਸਾਲ" },
    LEAP_CENTURY_YEAR: { hi: "लीप शताब्दी वर्ष", pa: "ਲੀਪ ਸਦੀ ਸਾਲ" },
    ORDINARY_CENTURY_YEAR: { hi: "साधारण शताब्दी वर्ष", pa: "ਸਧਾਰਣ ਸਦੀ ਸਾਲ" },
    YES_CONTAINS_LEAP_DAY: { hi: "हाँ, 29 फ़रवरी शामिल है", pa: "ਹਾਂ, 29 ਫ਼ਰਵਰੀ ਸ਼ਾਮਲ ਹੈ" },
    NO_LEAP_DAY_IN_SPAN: { hi: "नहीं, 29 फ़रवरी शामिल नहीं है", pa: "ਨਹੀਂ, 29 ਫ਼ਰਵਰੀ ਸ਼ਾਮਲ ਨਹੀਂ ਹੈ" },
    INVALID_DATE_SPAN: { hi: "दी गई अवधि अमान्य है", pa: "ਦਿੱਤੀ ਮਿਆਦ ਅਵੈਧ ਹੈ" },
    LEAP_DAY_ONLY_AT_EXCLUDED_BOUNDARY: { hi: "29 फ़रवरी केवल छोड़ी गई सीमा पर है", pa: "29 ਫ਼ਰਵਰੀ ਕੇਵਲ ਛੱਡੀ ਗਈ ਹੱਦ ਉੱਤੇ ਹੈ" },
    IDENTICAL_FULL_YEAR_CALENDARS: { hi: "हाँ, दोनों वर्षों के कैलेंडर समान हैं", pa: "ਹਾਂ, ਦੋਵੇਂ ਸਾਲਾਂ ਦੇ ਕੈਲੰਡਰ ਇਕੋ ਜਿਹੇ ਹਨ" },
    DIFFERENT_START_WEEKDAY: { hi: "नहीं, 1 जनवरी के वार अलग हैं", pa: "ਨਹੀਂ, 1 ਜਨਵਰੀ ਦੇ ਵਾਰ ਵੱਖ ਹਨ" },
    DIFFERENT_LEAP_STATUS: { hi: "नहीं, दोनों वर्षों का प्रकार अलग है", pa: "ਨਹੀਂ, ਦੋਵੇਂ ਸਾਲਾਂ ਦੀ ਕਿਸਮ ਵੱਖ ਹੈ" },
    BOTH_CONDITIONS_FAIL: { hi: "नहीं, 1 जनवरी का वार और वर्ष का प्रकार दोनों अलग हैं", pa: "ਨਹੀਂ, 1 ਜਨਵਰੀ ਦਾ ਵਾਰ ਅਤੇ ਸਾਲ ਦੀ ਕਿਸਮ ਦੋਵੇਂ ਵੱਖ ਹਨ" },
  };
  const label = labels[value];
  return label ? t(locale, label) : value;
}

function weekdayList(values: readonly Weekday[], locale: FrozenLocale): string {
  const names = [...values].sort((a, b) => a - b).map((value) => weekdayName(value, locale));
  if (names.length === 0) return t(locale, { hi: "कोई नहीं", pa: "ਕੋਈ ਨਹੀਂ" });
  if (names.length === 1) return names[0]!;
  const and = t(locale, { hi: "और", pa: "ਅਤੇ" });
  if (names.length === 2) return `${names[0]} ${and} ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} ${and} ${names.at(-1)}`;
}

function localDisplay(value: SemanticValue, type: CalendarOption["semanticType"], locale: FrozenLocale): string {
  if (type === "WEEKDAY_SET") return weekdayList(value as Weekday[], locale);
  if (type === "CLASSIFICATION") return classification(String(value), locale);
  return displaySemantic(value, type, locale);
}

function answerText(pkg: CalendarQuestionPackage, locale: FrozenLocale): string {
  return localDisplay(pkg.canonicalAnswer, pkg.outputType, locale);
}

function directionText(days: number, locale: FrozenLocale): string {
  if (days >= 0) return t(locale, { hi: `${days} दिन आगे`, pa: `${days} ਦਿਨ ਅੱਗੇ` });
  return t(locale, { hi: `${Math.abs(days)} दिन पीछे`, pa: `${Math.abs(days)} ਦਿਨ ਪਿੱਛੇ` });
}

function genericConclusion(pkg: CalendarQuestionPackage, locale: FrozenLocale): string {
  const answer = answerText(pkg, locale);
  return t(locale, { hi: `अतः सही उत्तर ${answer} है।`, pa: `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।` });
}

function explainShift(pkg: CalendarQuestionPackage, locale: FrozenLocale): StructuredCalendarExplanation {
  const shift = numberFact(pkg.facts.signedDayShift ?? 0, "signed day shift");
  const remainder = mod7(Math.abs(shift));
  return {
    observation: t(locale, {
      hi: `दिया गया दिन परिवर्तन ${directionText(shift, locale)} है।`,
      pa: `ਦਿੱਤਾ ਦਿਨ ਬਦਲਾਅ ${directionText(shift, locale)} ਹੈ।`,
    }),
    rule: t(locale, {
      hi: "हर 7 दिन बाद वार दोहराता है। पूरे सप्ताह हटाकर बचे दिनों के अनुसार आगे या पीछे चलें।",
      pa: "ਹਰ 7 ਦਿਨਾਂ ਬਾਅਦ ਵਾਰ ਦੁਹਰਾਉਂਦਾ ਹੈ। ਪੂਰੇ ਹਫ਼ਤੇ ਹਟਾ ਕੇ ਬਚੇ ਦਿਨਾਂ ਅਨੁਸਾਰ ਅੱਗੇ ਜਾਂ ਪਿੱਛੇ ਜਾਓ।",
    }),
    working: [
      t(locale, { hi: `${Math.abs(shift)} ÷ 7 का शेष ${remainder} है।`, pa: `${Math.abs(shift)} ÷ 7 ਦਾ ਬਾਕੀ ${remainder} ਹੈ।` }),
      t(locale, { hi: `इसलिए केवल ${remainder} वार का परिवर्तन करना है।`, pa: `ਇਸ ਲਈ ਕੇਵਲ ${remainder} ਵਾਰਾਂ ਦਾ ਬਦਲਾਅ ਕਰਨਾ ਹੈ।` }),
    ],
    conclusion: genericConclusion(pkg, locale),
    closestTrap: t(locale, {
      hi: "आगे और पीछे की दिशा न बदलें तथा आरंभिक वार को पहला दिन मानकर न गिनें।",
      pa: "ਅੱਗੇ ਅਤੇ ਪਿੱਛੇ ਦੀ ਦਿਸ਼ਾ ਨਾ ਬਦਲੋ ਅਤੇ ਸ਼ੁਰੂਆਤੀ ਵਾਰ ਨੂੰ ਪਹਿਲਾ ਦਿਨ ਮੰਨ ਕੇ ਨਾ ਗਿਣੋ।",
    }),
  };
}

function explainDateMovement(pkg: CalendarQuestionPackage, locale: FrozenLocale): StructuredCalendarExplanation {
  const a = pkg.facts.anchorDate ? dateFact(pkg.facts.anchorDate, "anchor date") : undefined;
  const b = pkg.facts.targetDate ? dateFact(pkg.facts.targetDate, "target date") : undefined;
  const shift = typeof pkg.facts.signedDayShift === "number" ? pkg.facts.signedDayShift : undefined;
  const working: string[] = [];
  if (a && b) working.push(t(locale, { hi: `${formatDate(a, locale)} से ${formatDate(b, locale)} तक का सही दिन-अंतर लें।`, pa: `${formatDate(a, locale)} ਤੋਂ ${formatDate(b, locale)} ਤੱਕ ਦਾ ਸਹੀ ਦਿਨ-ਅੰਤਰ ਲਵੋ।` }));
  if (shift !== undefined) working.push(t(locale, { hi: `दिशायुक्त दिन-अंतर: ${directionText(shift, locale)}।`, pa: `ਦਿਸ਼ਾਵਾਂ ਵਾਲਾ ਦਿਨ-ਅੰਤਰ: ${directionText(shift, locale)}।` }));
  return {
    observation: a && b
      ? t(locale, { hi: `प्रश्न ${formatDate(a, locale)} और ${formatDate(b, locale)} के बीच संबंध पूछता है।`, pa: `ਪ੍ਰਸ਼ਨ ${formatDate(a, locale)} ਅਤੇ ${formatDate(b, locale)} ਵਿਚਕਾਰ ਸੰਬੰਧ ਪੁੱਛਦਾ ਹੈ।` })
      : t(locale, { hi: "प्रश्न में तिथि और दिनों का परिवर्तन दिया गया है।", pa: "ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਤਾਰੀਖ ਅਤੇ ਦਿਨਾਂ ਦਾ ਬਦਲਾਅ ਦਿੱਤਾ ਗਿਆ ਹੈ।" }),
    rule: t(locale, {
      hi: "हर महीने के वास्तविक दिनों का उपयोग करें। तिथि-अंतर के अनुसार वार या तिथि को आगे अथवा पीछे बदलें।",
      pa: "ਹਰ ਮਹੀਨੇ ਦੇ ਅਸਲ ਦਿਨ ਵਰਤੋ। ਤਾਰੀਖ-ਅੰਤਰ ਅਨੁਸਾਰ ਵਾਰ ਜਾਂ ਤਾਰੀਖ ਨੂੰ ਅੱਗੇ ਜਾਂ ਪਿੱਛੇ ਬਦਲੋ।",
    }),
    working: working.length ? working : [t(locale, { hi: "दिए गए दिनों को सही दिशा में जोड़ें या घटाएँ।", pa: "ਦਿੱਤੇ ਦਿਨਾਂ ਨੂੰ ਸਹੀ ਦਿਸ਼ਾ ਵਿੱਚ ਜੋੜੋ ਜਾਂ ਘਟਾਓ।" })],
    conclusion: genericConclusion(pkg, locale),
    closestTrap: t(locale, {
      hi: "महीने की लंबाई गलत लेने या आरंभिक तिथि को पहला दिन गिनने से उत्तर एक दिन बदल सकता है।",
      pa: "ਮਹੀਨੇ ਦੀ ਲੰਬਾਈ ਗਲਤ ਲੈਣ ਜਾਂ ਸ਼ੁਰੂਆਤੀ ਤਾਰੀਖ ਨੂੰ ਪਹਿਲਾ ਦਿਨ ਗਿਣਨ ਨਾਲ ਉੱਤਰ ਇੱਕ ਦਿਨ ਬਦਲ ਸਕਦਾ ਹੈ।",
    }),
  };
}

function explainLeapSpan(pkg: CalendarQuestionPackage, locale: FrozenLocale): StructuredCalendarExplanation {
  const a = dateFact(pkg.facts.anchorDate, "anchor date");
  const b = dateFact(pkg.facts.targetDate, "target date");
  const includesBoth = pkg.facts.countSemantics === "INCLUSIVE_BOTH";
  const excludesBoth = pkg.facts.countSemantics === "EXCLUSIVE_BOTH";
  return {
    observation: t(locale, {
      hi: `अवधि ${formatDate(a, locale)} से ${formatDate(b, locale)} तक है।`,
      pa: `ਮਿਆਦ ${formatDate(a, locale)} ਤੋਂ ${formatDate(b, locale)} ਤੱਕ ਹੈ।`,
    }),
    rule: t(locale, {
      hi: "अधिवर्ष में फ़रवरी के 29 दिन होते हैं। गणना करते समय प्रश्न में दी गई समावेशी या बहिष्कृत सीमा का पालन करें।",
      pa: "ਲੀਪ ਸਾਲ ਵਿੱਚ ਫ਼ਰਵਰੀ ਦੇ 29 ਦਿਨ ਹੁੰਦੇ ਹਨ। ਗਿਣਤੀ ਕਰਦੇ ਸਮੇਂ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੀ ਸ਼ਾਮਲ ਜਾਂ ਛੱਡੀ ਹੱਦ ਦੀ ਪਾਲਣਾ ਕਰੋ।",
    }),
    working: [
      t(locale, { hi: `आरंभिक वर्ष ${ordinalLeapYear(a.year) ? "अधिवर्ष" : "साधारण वर्ष"} है।`, pa: `ਸ਼ੁਰੂਆਤੀ ਸਾਲ ${ordinalLeapYear(a.year) ? "ਲੀਪ ਸਾਲ" : "ਸਧਾਰਣ ਸਾਲ"} ਹੈ।` }),
      includesBoth
        ? t(locale, { hi: "दोनों तिथियाँ गणना में शामिल हैं।", pa: "ਦੋਵੇਂ ਤਾਰੀਖਾਂ ਗਿਣਤੀ ਵਿੱਚ ਸ਼ਾਮਲ ਹਨ।" })
        : excludesBoth
          ? t(locale, { hi: "दोनों सीमा-तिथियाँ गणना से बाहर हैं।", pa: "ਦੋਵੇਂ ਹੱਦ-ਤਾਰੀਖਾਂ ਗਿਣਤੀ ਤੋਂ ਬਾਹਰ ਹਨ।" })
          : t(locale, { hi: "सही तिथि-अंतर लेकर 29 फ़रवरी की स्थिति जाँचें।", pa: "ਸਹੀ ਤਾਰੀਖ-ਅੰਤਰ ਲੈ ਕੇ 29 ਫ਼ਰਵਰੀ ਦੀ ਸਥਿਤੀ ਜਾਂਚੋ।" }),
    ],
    conclusion: genericConclusion(pkg, locale),
    closestTrap: t(locale, {
      hi: "हर फ़रवरी को 28 दिन मानना या सीमा-तिथियों को गलत गिनना सामान्य त्रुटि है।",
      pa: "ਹਰ ਫ਼ਰਵਰੀ ਨੂੰ 28 ਦਿਨ ਮੰਨਣਾ ਜਾਂ ਹੱਦ-ਤਾਰੀਖਾਂ ਨੂੰ ਗਲਤ ਗਿਣਣਾ ਆਮ ਗਲਤੀ ਹੈ।",
    }),
  };
}

function explainAbsoluteDate(pkg: CalendarQuestionPackage, locale: FrozenLocale): StructuredCalendarExplanation {
  const date = pkg.facts.targetDate ? dateFact(pkg.facts.targetDate, "target date") : undefined;
  const nth = typeof pkg.facts.nthDay === "number" ? pkg.facts.nthDay : undefined;
  return {
    observation: date
      ? t(locale, { hi: `दी गई तिथि ${formatDate(date, locale)} है।`, pa: `ਦਿੱਤੀ ਤਾਰੀਖ ${formatDate(date, locale)} ਹੈ।` })
      : t(locale, { hi: `वर्ष का दिन क्रमांक ${nth} दिया गया है।`, pa: `ਸਾਲ ਦਾ ਦਿਨ ਨੰਬਰ ${nth} ਦਿੱਤਾ ਗਿਆ ਹੈ।` }),
    rule: t(locale, {
      hi: "बीते पूरे महीनों के दिन जोड़ें। अधिवर्ष में 29 फ़रवरी शामिल करें और प्राप्त दिन क्रमांक से वार निकालें।",
      pa: "ਬੀਤੇ ਪੂਰੇ ਮਹੀਨਿਆਂ ਦੇ ਦਿਨ ਜੋੜੋ। ਲੀਪ ਸਾਲ ਵਿੱਚ 29 ਫ਼ਰਵਰੀ ਸ਼ਾਮਲ ਕਰੋ ਅਤੇ ਮਿਲੇ ਦਿਨ ਨੰਬਰ ਤੋਂ ਵਾਰ ਕੱਢੋ।",
    }),
    working: [
      date
        ? t(locale, { hi: `${date.year} ${ordinalLeapYear(date.year) ? "अधिवर्ष" : "साधारण वर्ष"} है।`, pa: `${date.year} ${ordinalLeapYear(date.year) ? "ਲੀਪ ਸਾਲ" : "ਸਧਾਰਣ ਸਾਲ"} ਹੈ।` })
        : t(locale, { hi: "1 जनवरी को पहला दिन मानकर nवें दिन तक n − 1 दिन आगे जाएँ।", pa: "1 ਜਨਵਰੀ ਨੂੰ ਪਹਿਲਾ ਦਿਨ ਮੰਨ ਕੇ nਵੇਂ ਦਿਨ ਤੱਕ n − 1 ਦਿਨ ਅੱਗੇ ਜਾਓ।" }),
      nth !== undefined ? t(locale, { hi: `वर्ष का आवश्यक दिन क्रमांक ${nth} है।`, pa: `ਸਾਲ ਦਾ ਲੋੜੀਂਦਾ ਦਿਨ ਨੰਬਰ ${nth} ਹੈ।` }) : t(locale, { hi: "माहवार कुल को 7 से भाग देकर वार-अंतर लें।", pa: "ਮਹੀਨਾਵਾਰ ਕੁੱਲ ਨੂੰ 7 ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਵਾਰ-ਅੰਤਰ ਲਵੋ।" }),
    ],
    conclusion: genericConclusion(pkg, locale),
    closestTrap: t(locale, {
      hi: "अधिवर्ष में फ़रवरी का एक अतिरिक्त दिन छोड़ने या nवें दिन के लिए n दिन चलने से उत्तर एक दिन बदल जाता है।",
      pa: "ਲੀਪ ਸਾਲ ਵਿੱਚ ਫ਼ਰਵਰੀ ਦਾ ਇੱਕ ਵਾਧੂ ਦਿਨ ਛੱਡਣ ਜਾਂ nਵੇਂ ਦਿਨ ਲਈ n ਦਿਨ ਜਾਣ ਨਾਲ ਉੱਤਰ ਇੱਕ ਦਿਨ ਬਦਲ ਜਾਂਦਾ ਹੈ।",
    }),
  };
}

function explainYearMovement(pkg: CalendarQuestionPackage, locale: FrozenLocale): StructuredCalendarExplanation {
  const first = pkg.facts.anchorDate ? dateFact(pkg.facts.anchorDate, "anchor date") : undefined;
  const second = pkg.facts.targetDate ? dateFact(pkg.facts.targetDate, "target date") : undefined;
  return {
    observation: first && second
      ? t(locale, { hi: `तुलना ${formatDate(first, locale)} से ${formatDate(second, locale)} तक है।`, pa: `ਤੁਲਨਾ ${formatDate(first, locale)} ਤੋਂ ${formatDate(second, locale)} ਤੱਕ ਹੈ।` })
      : t(locale, { hi: "प्रश्न वर्षों के बीच वार परिवर्तन पूछता है।", pa: "ਪ੍ਰਸ਼ਨ ਸਾਲਾਂ ਵਿਚਕਾਰ ਵਾਰ ਬਦਲਾਅ ਪੁੱਛਦਾ ਹੈ।" }),
    rule: t(locale, {
      hi: "पूरा साधारण वर्ष वार को 1 दिन और पूरा अधिवर्ष 2 दिन बदलता है। कुल परिवर्तन को 7 से भाग देकर शेष लें।",
      pa: "ਪੂਰਾ ਸਧਾਰਣ ਸਾਲ ਵਾਰ ਨੂੰ 1 ਦਿਨ ਅਤੇ ਪੂਰਾ ਲੀਪ ਸਾਲ 2 ਦਿਨ ਬਦਲਦਾ ਹੈ। ਕੁੱਲ ਬਦਲਾਅ ਨੂੰ 7 ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਬਾਕੀ ਲਵੋ।",
    }),
    working: [
      t(locale, { hi: "बीच के प्रत्येक वर्ष को साधारण या अधिवर्ष के रूप में जाँचें।", pa: "ਵਿਚਕਾਰਲੇ ਹਰ ਸਾਲ ਨੂੰ ਸਧਾਰਣ ਜਾਂ ਲੀਪ ਸਾਲ ਵਜੋਂ ਜਾਂਚੋ।" }),
      t(locale, { hi: "कुल विषम दिनों का शेष ही वार का वास्तविक परिवर्तन है।", pa: "ਕੁੱਲ ਵਿਸ਼ਮ ਦਿਨਾਂ ਦਾ ਬਾਕੀ ਹੀ ਵਾਰ ਦਾ ਅਸਲ ਬਦਲਾਅ ਹੈ।" }),
    ],
    conclusion: genericConclusion(pkg, locale),
    closestTrap: t(locale, {
      hi: "हर चौथे वर्ष को बिना शताब्दी नियम जाँचे अधिवर्ष मानना गलत है।",
      pa: "ਹਰ ਚੌਥੇ ਸਾਲ ਨੂੰ ਸਦੀ ਨਿਯਮ ਜਾਂਚੇ ਬਿਨਾਂ ਲੀਪ ਸਾਲ ਮੰਨਣਾ ਗਲਤ ਹੈ।",
    }),
  };
}

function explainYearClass(pkg: CalendarQuestionPackage, locale: FrozenLocale): StructuredCalendarExplanation {
  const year = typeof pkg.facts.year === "number" ? pkg.facts.year : undefined;
  const range = pkg.facts.yearRange;
  return {
    observation: year !== undefined
      ? t(locale, { hi: `जाँचा जाने वाला वर्ष ${year} है।`, pa: `ਜਾਂਚਿਆ ਜਾਣ ਵਾਲਾ ਸਾਲ ${year} ਹੈ।` })
      : t(locale, { hi: `वर्ष-सीमा ${range?.start} से ${range?.end} तक है।`, pa: `ਸਾਲ-ਹੱਦ ${range?.start} ਤੋਂ ${range?.end} ਤੱਕ ਹੈ।` }),
    rule: t(locale, {
      hi: "पहले 400, फिर 100 और अंत में 4 से विभाज्यता जाँचें। शताब्दी वर्ष केवल 400 से विभाज्य होने पर अधिवर्ष है।",
      pa: "ਪਹਿਲਾਂ 400, ਫਿਰ 100 ਅਤੇ ਅੰਤ ਵਿੱਚ 4 ਨਾਲ ਭਾਗਯੋਗਤਾ ਜਾਂਚੋ। ਸਦੀ ਸਾਲ ਕੇਵਲ 400 ਨਾਲ ਭਾਗਯੋਗ ਹੋਣ ਤੇ ਲੀਪ ਸਾਲ ਹੈ।",
    }),
    working: [
      range
        ? t(locale, { hi: "सीमा के भीतर 4 के गुणज गिनें, 100 के गुणज घटाएँ और 400 के गुणज वापस जोड़ें।", pa: "ਹੱਦ ਅੰਦਰ 4 ਦੇ ਗੁਣਜ ਗਿਣੋ, 100 ਦੇ ਗੁਣਜ ਘਟਾਓ ਅਤੇ 400 ਦੇ ਗੁਣਜ ਵਾਪਸ ਜੋੜੋ।" })
        : t(locale, { hi: `${year} पर 400–100–4 का नियम क्रम से लागू करें।`, pa: `${year} ਉੱਤੇ 400–100–4 ਦਾ ਨਿਯਮ ਕ੍ਰਮ ਨਾਲ ਲਗਾਓ।` }),
      t(locale, { hi: "साधारण वर्षों की संख्या कुल वर्षों में से अधिवर्ष घटाकर मिलती है।", pa: "ਸਧਾਰਣ ਸਾਲਾਂ ਦੀ ਗਿਣਤੀ ਕੁੱਲ ਸਾਲਾਂ ਵਿੱਚੋਂ ਲੀਪ ਸਾਲ ਘਟਾ ਕੇ ਮਿਲਦੀ ਹੈ।" }),
    ],
    conclusion: genericConclusion(pkg, locale),
    closestTrap: t(locale, {
      hi: "100 से विभाज्य वर्ष को केवल 4 के नियम से अधिवर्ष न मानें।",
      pa: "100 ਨਾਲ ਭਾਗਯੋਗ ਸਾਲ ਨੂੰ ਕੇਵਲ 4 ਦੇ ਨਿਯਮ ਨਾਲ ਲੀਪ ਸਾਲ ਨਾ ਮੰਨੋ।",
    }),
  };
}

function explainOddDays(pkg: CalendarQuestionPackage, locale: FrozenLocale): StructuredCalendarExplanation {
  const year = typeof pkg.facts.year === "number" ? pkg.facts.year : undefined;
  const range = pkg.facts.yearRange;
  return {
    observation: range
      ? t(locale, { hi: `गणना वर्ष ${range.start} से ${range.end} तक है।`, pa: `ਗਿਣਤੀ ਸਾਲ ${range.start} ਤੋਂ ${range.end} ਤੱਕ ਹੈ।` })
      : t(locale, { hi: `${year} पूर्ण वर्षों का विषम-दिन परिणाम चाहिए।`, pa: `${year} ਪੂਰੇ ਸਾਲਾਂ ਦਾ ਵਿਸ਼ਮ-ਦਿਨ ਨਤੀਜਾ ਚਾਹੀਦਾ ਹੈ।` }),
    rule: t(locale, {
      hi: "साधारण वर्ष 1 और अधिवर्ष 2 विषम दिन देता है। हर पूरा 400-वर्षीय खंड 7 के अनुसार 0 देता है।",
      pa: "ਸਧਾਰਣ ਸਾਲ 1 ਅਤੇ ਲੀਪ ਸਾਲ 2 ਵਿਸ਼ਮ ਦਿਨ ਦਿੰਦਾ ਹੈ। ਹਰ ਪੂਰਾ 400-ਸਾਲਾ ਖੰਡ 7 ਅਨੁਸਾਰ 0 ਦਿੰਦਾ ਹੈ।",
    }),
    working: [
      t(locale, { hi: "पहले पूरे 400-वर्षीय खंड अलग करें।", pa: "ਪਹਿਲਾਂ ਪੂਰੇ 400-ਸਾਲਾ ਖੰਡ ਵੱਖ ਕਰੋ।" }),
      t(locale, { hi: "शेष वर्षों में साधारण और अधिवर्ष के विषम दिन जोड़कर कुल को 7 से भाग दें।", pa: "ਬਚੇ ਸਾਲਾਂ ਵਿੱਚ ਸਧਾਰਣ ਅਤੇ ਲੀਪ ਸਾਲਾਂ ਦੇ ਵਿਸ਼ਮ ਦਿਨ ਜੋੜ ਕੇ ਕੁੱਲ ਨੂੰ 7 ਨਾਲ ਭਾਗ ਦਿਓ।" }),
    ],
    conclusion: genericConclusion(pkg, locale),
    closestTrap: t(locale, {
      hi: "शताब्दी वर्ष का 400 वाला अपवाद छोड़ने से विषम-दिन परिणाम बदल जाता है।",
      pa: "ਸਦੀ ਸਾਲ ਦਾ 400 ਵਾਲਾ ਅਪਵਾਦ ਛੱਡਣ ਨਾਲ ਵਿਸ਼ਮ-ਦਿਨ ਨਤੀਜਾ ਬਦਲ ਜਾਂਦਾ ਹੈ।",
    }),
  };
}

function explainCalendarMatch(pkg: CalendarQuestionPackage, locale: FrozenLocale): StructuredCalendarExplanation {
  const year = numberFact(pkg.facts.year, "year");
  const second = typeof pkg.facts.secondYear === "number" ? pkg.facts.secondYear : undefined;
  const isMonth = pkg.prototypeAuthority === "CAL-PQL-033";
  const month = isMonth ? monthFact(pkg.facts.month) : undefined;
  return {
    observation: isMonth && month
      ? t(locale, { hi: `${monthName(month, locale)} ${year} के समान माह-कैलेंडर वाला वर्ष चाहिए।`, pa: `${monthName(month, locale)} ${year} ਵਰਗਾ ਮਹੀਨਾ-ਕੈਲੰਡਰ ਵਾਲਾ ਸਾਲ ਚਾਹੀਦਾ ਹੈ।` })
      : second !== undefined
        ? t(locale, { hi: `${year} और ${second} के पूरे वर्ष के कैलेंडर की तुलना करनी है।`, pa: `${year} ਅਤੇ ${second} ਦੇ ਪੂਰੇ ਸਾਲ ਦੇ ਕੈਲੰਡਰ ਦੀ ਤੁਲਨਾ ਕਰਨੀ ਹੈ।` })
        : t(locale, { hi: `${year} के समान कैलेंडर वाला वर्ष खोजना है।`, pa: `${year} ਵਰਗਾ ਕੈਲੰਡਰ ਵਾਲਾ ਸਾਲ ਲੱਭਣਾ ਹੈ।` }),
    rule: isMonth
      ? t(locale, { hi: "दो महीनों के कैलेंडर तभी समान होते हैं जब उनका पहला वार और दिनों की संख्या दोनों समान हों।", pa: "ਦੋ ਮਹੀਨਿਆਂ ਦੇ ਕੈਲੰਡਰ ਤਦੋਂ ਹੀ ਇਕੋ ਜਿਹੇ ਹੁੰਦੇ ਹਨ ਜਦੋਂ ਉਨ੍ਹਾਂ ਦਾ ਪਹਿਲਾ ਵਾਰ ਅਤੇ ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ਦੋਵੇਂ ਇੱਕੋ ਹੋਣ।" })
      : t(locale, { hi: "दो पूरे वर्षों के कैलेंडर तभी समान होते हैं जब 1 जनवरी का वार और दोनों वर्षों का प्रकार समान हो।", pa: "ਦੋ ਪੂਰੇ ਸਾਲਾਂ ਦੇ ਕੈਲੰਡਰ ਤਦੋਂ ਹੀ ਇਕੋ ਜਿਹੇ ਹੁੰਦੇ ਹਨ ਜਦੋਂ 1 ਜਨਵਰੀ ਦਾ ਵਾਰ ਅਤੇ ਦੋਵੇਂ ਸਾਲਾਂ ਦੀ ਕਿਸਮ ਇੱਕੋ ਹੋਵੇ।" }),
    working: isMonth && month && second !== undefined
      ? [
          t(locale, { hi: `${monthName(month, locale)} ${year} के पहले वार और माह-लंबाई की तुलना ${monthName(month, locale)} ${second} से करें।`, pa: `${monthName(month, locale)} ${year} ਦੇ ਪਹਿਲੇ ਵਾਰ ਅਤੇ ਮਹੀਨਾ-ਲੰਬਾਈ ਦੀ ਤੁਲਨਾ ${monthName(month, locale)} ${second} ਨਾਲ ਕਰੋ।` }),
          t(locale, { hi: "पूरे वर्ष का प्रकार अलग होने पर भी एक विशेष माह का कैलेंडर समान हो सकता है।", pa: "ਪੂਰੇ ਸਾਲ ਦੀ ਕਿਸਮ ਵੱਖ ਹੋਣ ਤੇ ਵੀ ਕਿਸੇ ਖ਼ਾਸ ਮਹੀਨੇ ਦਾ ਕੈਲੰਡਰ ਇਕੋ ਜਿਹਾ ਹੋ ਸਕਦਾ ਹੈ।" }),
        ]
      : [
          t(locale, { hi: "हर उम्मीदवार वर्ष के लिए 1 जनवरी का वार जाँचें।", pa: "ਹਰ ਉਮੀਦਵਾਰ ਸਾਲ ਲਈ 1 ਜਨਵਰੀ ਦਾ ਵਾਰ ਜਾਂਚੋ।" }),
          t(locale, { hi: "फिर दोनों वर्षों के साधारण या अधिवर्ष होने की स्थिति मिलाएँ।", pa: "ਫਿਰ ਦੋਵੇਂ ਸਾਲਾਂ ਦੇ ਸਧਾਰਣ ਜਾਂ ਲੀਪ ਹੋਣ ਦੀ ਸਥਿਤੀ ਮਿਲਾਓ।" }),
        ],
    conclusion: genericConclusion(pkg, locale),
    closestTrap: isMonth
      ? t(locale, { hi: "माह-कैलेंडर के लिए पूरे वर्ष का नियम लगाना गलत है।", pa: "ਮਹੀਨਾ-ਕੈਲੰਡਰ ਲਈ ਪੂਰੇ ਸਾਲ ਦਾ ਨਿਯਮ ਲਗਾਉਣਾ ਗਲਤ ਹੈ।" })
      : t(locale, { hi: "केवल 1 जनवरी का वार या केवल वर्ष का प्रकार मिलना पर्याप्त नहीं है।", pa: "ਕੇਵਲ 1 ਜਨਵਰੀ ਦਾ ਵਾਰ ਜਾਂ ਕੇਵਲ ਸਾਲ ਦੀ ਕਿਸਮ ਮਿਲਣਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।" }),
  };
}

function explainBoundary(pkg: CalendarQuestionPackage, locale: FrozenLocale): StructuredCalendarExplanation {
  const year = numberFact(pkg.facts.year, "year");
  const month = typeof pkg.facts.month === "number" ? monthFact(pkg.facts.month) : undefined;
  const length = month ? ordinalDaysInMonth(year, month) : (ordinalLeapYear(year) ? 366 : 365);
  return {
    observation: month
      ? t(locale, { hi: `${monthName(month, locale)} ${year} में ${length} दिन हैं।`, pa: `${monthName(month, locale)} ${year} ਵਿੱਚ ${length} ਦਿਨ ਹਨ।` })
      : t(locale, { hi: `${year} में ${length} दिन हैं।`, pa: `${year} ਵਿੱਚ ${length} ਦਿਨ ਹਨ।` }),
    rule: t(locale, {
      hi: "पहले और अंतिम दिन के बीच लंबाई − 1 दिन का अंतर होता है। उलटे प्रश्न में उसी परिवर्तन की दिशा बदलें।",
      pa: "ਪਹਿਲੇ ਅਤੇ ਆਖ਼ਰੀ ਦਿਨ ਵਿਚਕਾਰ ਲੰਬਾਈ − 1 ਦਿਨਾਂ ਦਾ ਅੰਤਰ ਹੁੰਦਾ ਹੈ। ਉਲਟੇ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਉਸੇ ਬਦਲਾਅ ਦੀ ਦਿਸ਼ਾ ਬਦਲੋ।",
    }),
    working: [
      t(locale, { hi: `आवश्यक दिन परिवर्तन ${length - 1} है।`, pa: `ਲੋੜੀਂਦਾ ਦਿਨ ਬਦਲਾਅ ${length - 1} ਹੈ।` }),
      t(locale, { hi: `${length - 1} को 7 से भाग देकर वार-अंतर लें।`, pa: `${length - 1} ਨੂੰ 7 ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਵਾਰ-ਅੰਤਰ ਲਵੋ।` }),
    ],
    conclusion: genericConclusion(pkg, locale),
    closestTrap: t(locale, {
      hi: "लंबाई स्वयं लेने से पहला दिन दो बार गिना जाता है और उत्तर एक दिन बदल जाता है।",
      pa: "ਲੰਬਾਈ ਆਪ ਲੈਣ ਨਾਲ ਪਹਿਲਾ ਦਿਨ ਦੋ ਵਾਰ ਗਿਣਿਆ ਜਾਂਦਾ ਹੈ ਅਤੇ ਉੱਤਰ ਇੱਕ ਦਿਨ ਬਦਲ ਜਾਂਦਾ ਹੈ।",
    }),
  };
}

function explainFrequency(pkg: CalendarQuestionPackage, locale: FrozenLocale): StructuredCalendarExplanation {
  const isRange = pkg.prototypeAuthority === "CAL-PQL-044";
  const rangeStart = isRange ? dateFact(pkg.facts.anchorDate, "anchor date") : undefined;
  const rangeEnd = isRange ? dateFact(pkg.facts.targetDate, "target date") : undefined;
  const year = isRange ? rangeStart!.year : numberFact(pkg.facts.year, "year");
  const month = !isRange && typeof pkg.facts.month === "number" ? monthFact(pkg.facts.month) : undefined;
  const signedRange = isRange ? ordinalDifference(rangeStart!, rangeEnd!) : 0;
  const firstDate = isRange && signedRange < 0 ? rangeEnd! : rangeStart;
  const length = isRange
    ? Math.abs(signedRange) + 1
    : month
      ? ordinalDaysInMonth(year, month)
      : (ordinalLeapYear(year) ? 366 : 365);
  const start = isRange
    ? ordinalWeekday(firstDate!)
    : month
      ? ordinalWeekday({ year, month, day: 1 })
      : ordinalWeekday({ year, month: 1, day: 1 });
  const completeWeeks = Math.floor(length / 7);
  const extras = length % 7;
  const extraWeekdays = Array.from({ length: extras }, (_, index) => mod7(start + index));
  return {
    observation: isRange
      ? t(locale, {
          hi: `${formatDate(firstDate!, locale)} से ${formatDate(signedRange < 0 ? rangeStart! : rangeEnd!, locale)} तक दोनों तिथियों सहित ${length} दिन हैं।`,
          pa: `${formatDate(firstDate!, locale)} ਤੋਂ ${formatDate(signedRange < 0 ? rangeStart! : rangeEnd!, locale)} ਤੱਕ ਦੋਵੇਂ ਤਾਰੀਖਾਂ ਸਮੇਤ ${length} ਦਿਨ ਹਨ।`,
        })
      : month
        ? t(locale, { hi: `${monthName(month, locale)} ${year} में ${length} दिन हैं और पहला वार ${weekdayName(start, locale)} है।`, pa: `${monthName(month, locale)} ${year} ਵਿੱਚ ${length} ਦਿਨ ਹਨ ਅਤੇ ਪਹਿਲਾ ਵਾਰ ${weekdayName(start, locale)} ਹੈ।` })
        : t(locale, { hi: `${year} में ${length} दिन हैं और 1 जनवरी ${weekdayName(start, locale)} है।`, pa: `${year} ਵਿੱਚ ${length} ਦਿਨ ਹਨ ਅਤੇ 1 ਜਨਵਰੀ ${weekdayName(start, locale)} ਹੈ।` }),
    rule: t(locale, {
      hi: "कुल दिनों को पूरे सप्ताह और बचे दिनों में बाँटें। बचे दिन आरंभिक वार से लगातार आते हैं और वही एक बार अतिरिक्त गिने जाते हैं।",
      pa: "ਕੁੱਲ ਦਿਨਾਂ ਨੂੰ ਪੂਰੇ ਹਫ਼ਤਿਆਂ ਅਤੇ ਬਚੇ ਦਿਨਾਂ ਵਿੱਚ ਵੰਡੋ। ਬਚੇ ਦਿਨ ਸ਼ੁਰੂਆਤੀ ਵਾਰ ਤੋਂ ਲਗਾਤਾਰ ਆਉਂਦੇ ਹਨ ਅਤੇ ਉਹੀ ਇੱਕ ਵਾਰ ਵੱਧ ਗਿਣੇ ਜਾਂਦੇ ਹਨ।",
    }),
    working: [
      t(locale, { hi: `${length} दिन = ${completeWeeks} पूरे सप्ताह + ${extras} दिन।`, pa: `${length} ਦਿਨ = ${completeWeeks} ਪੂਰੇ ਹਫ਼ਤੇ + ${extras} ਦਿਨ।` }),
      extras === 0
        ? t(locale, { hi: "कोई अतिरिक्त वार नहीं है; सभी वार समान बार आते हैं।", pa: "ਕੋਈ ਵਾਧੂ ਵਾਰ ਨਹੀਂ ਹੈ; ਸਾਰੇ ਵਾਰ ਬਰਾਬਰ ਵਾਰ ਆਉਂਦੇ ਹਨ।" })
        : t(locale, { hi: `अतिरिक्त वार: ${weekdayList(extraWeekdays, locale)}।`, pa: `ਵਾਧੂ ਵਾਰ: ${weekdayList(extraWeekdays, locale)}।` }),
    ],
    conclusion: genericConclusion(pkg, locale),
    closestTrap: t(locale, {
      hi: "बचे दिनों का क्रम गलत वार से शुरू करने पर 4/5 या 52/53 की संख्या बदल जाती है।",
      pa: "ਬਚੇ ਦਿਨਾਂ ਦਾ ਕ੍ਰਮ ਗਲਤ ਵਾਰ ਤੋਂ ਸ਼ੁਰੂ ਕਰਨ ਨਾਲ 4/5 ਜਾਂ 52/53 ਦੀ ਗਿਣਤੀ ਬਦਲ ਜਾਂਦੀ ਹੈ।",
    }),
  };
}

function localizedExplanation(pkg: CalendarQuestionPackage, locale: FrozenLocale): StructuredCalendarExplanation {
  const n = Number(pkg.prototypeAuthority.slice(-3));
  if (n <= 4) return explainShift(pkg, locale);
  if (n <= 9) return explainDateMovement(pkg, locale);
  if (n <= 13) return explainLeapSpan(pkg, locale);
  if (n <= 16) return explainAbsoluteDate(pkg, locale);
  if (n <= 20) return explainYearMovement(pkg, locale);
  if (n <= 24) return explainYearClass(pkg, locale);
  if (n <= 28) return explainOddDays(pkg, locale);
  if (n <= 34) return explainCalendarMatch(pkg, locale);
  if (n <= 39) return explainBoundary(pkg, locale);
  return explainFrequency(pkg, locale);
}

function polishedStem(pkg: CalendarQuestionPackage, locale: FrozenLocale): string {
  const hi = locale === "hi-IN";
  const facts = pkg.facts;

  if (pkg.prototypeAuthority === "CAL-PQL-013" && facts.anchorDate && facts.targetDate) {
    return hi
      ? `दोनों तिथियों सहित, क्या ${formatDate(dateFact(facts.anchorDate, "anchor date"), locale)} से ${formatDate(dateFact(facts.targetDate, "target date"), locale)} के बीच 29 फ़रवरी आती है?`
      : `ਦੋਵੇਂ ਤਾਰੀਖਾਂ ਸਮੇਤ, ਕੀ ${formatDate(dateFact(facts.anchorDate, "anchor date"), locale)} ਤੋਂ ${formatDate(dateFact(facts.targetDate, "target date"), locale)} ਦੇ ਵਿਚਕਾਰ 29 ਫ਼ਰਵਰੀ ਆਉਂਦੀ ਹੈ?`;
  }
  if (pkg.prototypeAuthority === "CAL-PQL-016" && facts.targetDate) {
    const date = dateFact(facts.targetDate, "target date");
    return hi ? `${formatDate(date, locale)}, वर्ष का कौन-सा दिन है?` : `${formatDate(date, locale)}, ਸਾਲ ਦਾ ਕਿਹੜਾ ਦਿਨ ਹੈ?`;
  }
  if (pkg.prototypeAuthority === "CAL-PQL-019" && facts.anchorDate && facts.targetDate) {
    const a = dateFact(facts.anchorDate, "anchor date");
    const b = dateFact(facts.targetDate, "target date");
    return hi
      ? `${formatDate(a, locale)} की तुलना में ${formatDate(b, locale)} का वार कितने दिन आगे है?`
      : `${formatDate(a, locale)} ਦੇ ਮੁਕਾਬਲੇ ${formatDate(b, locale)} ਦਾ ਵਾਰ ਕਿੰਨੇ ਦਿਨ ਅੱਗੇ ਹੈ?`;
  }
  if (pkg.prototypeAuthority === "CAL-PQL-021" && typeof facts.year === "number") {
    return hi ? `वर्ष ${facts.year} किस प्रकार का वर्ष है?` : `ਸਾਲ ${facts.year} ਕਿਸ ਕਿਸਮ ਦਾ ਸਾਲ ਹੈ?`;
  }
  if (pkg.prototypeAuthority === "CAL-PQL-025" && typeof facts.year === "number") {
    return hi
      ? `ग्रेगोरियन कैलेंडर में वर्ष 1 से वर्ष ${facts.year} तक कितने विषम दिन हैं?`
      : `ਗ੍ਰੇਗੋਰੀਅਨ ਕੈਲੰਡਰ ਵਿੱਚ ਸਾਲ 1 ਤੋਂ ਸਾਲ ${facts.year} ਤੱਕ ਕਿੰਨੇ ਵਿਸ਼ਮ ਦਿਨ ਹਨ?`;
  }
  if (pkg.prototypeAuthority === "CAL-PQL-026" && typeof facts.year === "number") {
    return hi
      ? `ग्रेगोरियन कैलेंडर के पहले ${facts.year} वर्षों में कितने विषम दिन हैं?`
      : `ਗ੍ਰੇਗੋਰੀਅਨ ਕੈਲੰਡਰ ਦੇ ਪਹਿਲੇ ${facts.year} ਸਾਲਾਂ ਵਿੱਚ ਕਿੰਨੇ ਵਿਸ਼ਮ ਦਿਨ ਹਨ?`;
  }
  if (pkg.prototypeAuthority === "CAL-PQL-032" && typeof facts.year === "number" && typeof facts.secondYear === "number") {
    return hi
      ? `कौन-सा विकल्प सही बताता है कि ${facts.year} और ${facts.secondYear} के कैलेंडर समान हैं या नहीं?`
      : `ਕਿਹੜਾ ਵਿਕਲਪ ਸਹੀ ਦੱਸਦਾ ਹੈ ਕਿ ${facts.year} ਅਤੇ ${facts.secondYear} ਦੇ ਕੈਲੰਡਰ ਇਕੋ ਜਿਹੇ ਹਨ ਜਾਂ ਨਹੀਂ?`;
  }
  if (pkg.prototypeAuthority === "CAL-PQL-041" && typeof facts.year === "number" && typeof facts.month === "number") {
    const month = monthFact(facts.month);
    return hi
      ? `${monthName(month, locale)} ${facts.year} में कौन-से वार पाँच बार आते हैं?`
      : `${monthName(month, locale)} ${facts.year} ਵਿੱਚ ਕਿਹੜੇ ਵਾਰ ਪੰਜ ਵਾਰ ਆਉਂਦੇ ਹਨ?`;
  }
  if (pkg.prototypeAuthority === "CAL-PQL-043" && typeof facts.year === "number") {
    return hi ? `वर्ष ${facts.year} में कौन-से वार 53 बार आते हैं?` : `ਸਾਲ ${facts.year} ਵਿੱਚ ਕਿਹੜੇ ਵਾਰ 53 ਵਾਰ ਆਉਂਦੇ ਹਨ?`;
  }

  return pkg.stem
    .replaceAll("प्रोलेप्टिक ", "")
    .replaceAll("ਪ੍ਰੋਲੇਪਟਿਕ ", "")
    .replaceAll("कौन-सा/से वार", "कौन-से वार")
    .replaceAll("ਕਿਹੜਾ/ਕਿਹੜੇ ਵਾਰ", "ਕਿਹੜੇ ਵਾਰ")
    .replaceAll("सटीक कारण चुनिए", "सही कारण चुनिए");
}

function localizedOptions(pkg: CalendarQuestionPackage, locale: FrozenLocale): CalendarOption[] {
  return pkg.options.map((option) => ({
    ...option,
    display: localDisplay(option.semanticValue, option.semanticType, locale),
    explanation: t(locale, {
      hi: option.isCorrect ? "यह विकल्प सही गणना से मेल खाता है।" : "यह विकल्प एक सामान्य गणना-त्रुटि से बनता है।",
      pa: option.isCorrect ? "ਇਹ ਵਿਕਲਪ ਸਹੀ ਗਿਣਤੀ ਨਾਲ ਮਿਲਦਾ ਹੈ।" : "ਇਹ ਵਿਕਲਪ ਇੱਕ ਆਮ ਗਿਣਤੀ-ਗਲਤੀ ਤੋਂ ਬਣਦਾ ਹੈ।",
    }),
  }));
}

export function applyCalendarMultilingualEditorialFreeze(
  pkg: CalendarQuestionPackage,
): CalendarQuestionPackage {
  if (pkg.locale === "en-IN") return pkg;
  const locale = pkg.locale as FrozenLocale;
  return {
    ...pkg,
    stem: polishedStem(pkg, locale),
    stemTemplateId: `${pkg.stemTemplateId}-MULTILINGUAL-FREEZE-V1`,
    explanationTemplateId: `${pkg.explanationTemplateId}-MULTILINGUAL-FREEZE-V1`,
    options: localizedOptions(pkg, locale),
    explanation: localizedExplanation(pkg, locale),
  };
}
