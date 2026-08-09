import type { CalendarQuestionPackage, Locale, StructuredCalendarExplanation, Weekday } from "./types.ts";
import { mod7, ordinalLeapYear } from "./foundation.ts";
import { displaySemantic, formatDate, weekdayName } from "./runtime-shared.ts";

type FrozenLocale = Exclude<Locale, "en-IN">;
type Pair = { hi: string; pa: string };

function t(locale: FrozenLocale, pair: Pair): string {
  return locale === "hi-IN" ? pair.hi : pair.pa;
}

function numberFact(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`CAL-001 multilingual final: missing ${label}.`);
  }
  return value;
}

function weekdayFact(value: unknown, label: string): Weekday {
  const valueNumber = numberFact(value, label);
  if (!Number.isInteger(valueNumber) || valueNumber < 0 || valueNumber > 6) {
    throw new Error(`CAL-001 multilingual final: invalid ${label}.`);
  }
  return valueNumber as Weekday;
}

function conclusion(pkg: CalendarQuestionPackage, locale: FrozenLocale): string {
  const answer = displaySemantic(pkg.canonicalAnswer, pkg.outputType, locale);
  return t(locale, { hi: `अतः सही उत्तर ${answer} है।`, pa: `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।` });
}

function recoverStart(pkg: CalendarQuestionPackage, locale: FrozenLocale): StructuredCalendarExplanation {
  const target = weekdayFact(pkg.facts.targetWeekday, "target weekday");
  const days = Math.abs(numberFact(pkg.facts.signedDayShift, "signed day shift"));
  const remainder = mod7(days);
  return {
    observation: t(locale, {
      hi: `${days} दिन बाद वार ${weekdayName(target, locale)} है; आरंभिक वार निकालना है।`,
      pa: `${days} ਦਿਨ ਬਾਅਦ ਵਾਰ ${weekdayName(target, locale)} ਹੈ; ਸ਼ੁਰੂਆਤੀ ਵਾਰ ਕੱਢਣਾ ਹੈ।`,
    }),
    rule: t(locale, {
      hi: "बाद का वार दिया हो तो दिए गए परिवर्तन को उलटकर पीछे चलें। पूरे सप्ताह हटाने के लिए दिनों को 7 से भाग दें।",
      pa: "ਬਾਅਦ ਵਾਲਾ ਵਾਰ ਦਿੱਤਾ ਹੋਵੇ ਤਾਂ ਦਿੱਤੇ ਬਦਲਾਅ ਨੂੰ ਉਲਟ ਕੇ ਪਿੱਛੇ ਜਾਓ। ਪੂਰੇ ਹਫ਼ਤੇ ਹਟਾਉਣ ਲਈ ਦਿਨਾਂ ਨੂੰ 7 ਨਾਲ ਭਾਗ ਦਿਓ।",
    }),
    working: [
      t(locale, { hi: `${days} ÷ 7 का शेष ${remainder} है।`, pa: `${days} ÷ 7 ਦਾ ਬਾਕੀ ${remainder} ਹੈ।` }),
      t(locale, { hi: `${weekdayName(target, locale)} से ${remainder} दिन पीछे जाएँ।`, pa: `${weekdayName(target, locale)} ਤੋਂ ${remainder} ਦਿਨ ਪਿੱਛੇ ਜਾਓ।` }),
    ],
    conclusion: conclusion(pkg, locale),
    closestTrap: t(locale, {
      hi: "लक्ष्य वार से आगे चलना दिशा उलट देता है और गलत उत्तर देता है।",
      pa: "ਲਕਸ਼ ਵਾਰ ਤੋਂ ਅੱਗੇ ਜਾਣਾ ਦਿਸ਼ਾ ਉਲਟ ਦਿੰਦਾ ਹੈ ਅਤੇ ਗਲਤ ਉੱਤਰ ਦਿੰਦਾ ਹੈ।",
    }),
  };
}

function leastPositive(pkg: CalendarQuestionPackage, locale: FrozenLocale): StructuredCalendarExplanation {
  const start = weekdayFact(pkg.facts.anchorWeekday, "anchor weekday");
  const target = weekdayFact(pkg.facts.targetWeekday, "target weekday");
  const raw = mod7(target - start);
  const least = raw === 0 ? 7 : raw;
  return {
    observation: t(locale, {
      hi: `आज ${weekdayName(start, locale)} है और अगला ${weekdayName(target, locale)} चाहिए।`,
      pa: `ਅੱਜ ${weekdayName(start, locale)} ਹੈ ਅਤੇ ਅਗਲਾ ${weekdayName(target, locale)} ਚਾਹੀਦਾ ਹੈ।`,
    }),
    rule: t(locale, {
      hi: "आरंभिक वार से लक्ष्य वार तक आगे गिनें। उत्तर न्यूनतम धनात्मक संख्या होना चाहिए।",
      pa: "ਸ਼ੁਰੂਆਤੀ ਵਾਰ ਤੋਂ ਲਕਸ਼ ਵਾਰ ਤੱਕ ਅੱਗੇ ਗਿਣੋ। ਉੱਤਰ ਘੱਟੋ-ਘੱਟ ਧਨਾਤਮਕ ਗਿਣਤੀ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।",
    }),
    working: [
      t(locale, { hi: `7 के अनुसार वार-अंतर ${raw} है।`, pa: `7 ਅਨੁਸਾਰ ਵਾਰ-ਅੰਤਰ ${raw} ਹੈ।` }),
      raw === 0
        ? t(locale, { hi: "वार समान हैं, इसलिए अगला अवसर 0 नहीं बल्कि 7 दिन बाद होगा।", pa: "ਵਾਰ ਇੱਕੋ ਹਨ, ਇਸ ਲਈ ਅਗਲਾ ਮੌਕਾ 0 ਨਹੀਂ ਸਗੋਂ 7 ਦਿਨ ਬਾਅਦ ਹੋਵੇਗਾ।" })
        : t(locale, { hi: `न्यूनतम धनात्मक अंतर ${least} दिन है।`, pa: `ਘੱਟੋ-ਘੱਟ ਧਨਾਤਮਕ ਅੰਤਰ ${least} ਦਿਨ ਹੈ।` }),
    ],
    conclusion: conclusion(pkg, locale),
    closestTrap: t(locale, {
      hi: "आज को पहला दिन गिनना या समान वार होने पर 0 चुनना गलत है।",
      pa: "ਅੱਜ ਨੂੰ ਪਹਿਲਾ ਦਿਨ ਗਿਣਨਾ ਜਾਂ ਇੱਕੋ ਵਾਰ ਹੋਣ ਤੇ 0 ਚੁਣਨਾ ਗਲਤ ਹੈ।",
    }),
  };
}

function centuryBoundary(pkg: CalendarQuestionPackage, locale: FrozenLocale): StructuredCalendarExplanation {
  const anchor = pkg.facts.anchorDate;
  const target = pkg.facts.targetDate;
  if (!anchor || !target) throw new Error("CAL-001 multilingual final: century-boundary dates missing.");
  const shift = numberFact(pkg.facts.signedDayShift, "signed day shift");
  const centuryYear = target.year % 100 === 0 ? target.year : anchor.year % 100 === 0 ? anchor.year : target.year;
  const leap = ordinalLeapYear(centuryYear);
  return {
    observation: t(locale, {
      hi: `तिथि-अंतर ${formatDate(anchor, locale)} से ${formatDate(target, locale)} तक है और इसमें शताब्दी वर्ष ${centuryYear} आता है।`,
      pa: `ਤਾਰੀਖ-ਅੰਤਰ ${formatDate(anchor, locale)} ਤੋਂ ${formatDate(target, locale)} ਤੱਕ ਹੈ ਅਤੇ ਇਸ ਵਿੱਚ ਸਦੀ ਸਾਲ ${centuryYear} ਆਉਂਦਾ ਹੈ।`,
    }),
    rule: t(locale, {
      hi: "शताब्दी वर्ष केवल 400 से विभाज्य होने पर अधिवर्ष होता है। सही फ़रवरी लंबाई लेकर पूरे दिन-अंतर को 7 से भाग दें।",
      pa: "ਸਦੀ ਸਾਲ ਕੇਵਲ 400 ਨਾਲ ਭਾਗਯੋਗ ਹੋਣ ਤੇ ਲੀਪ ਸਾਲ ਹੁੰਦਾ ਹੈ। ਸਹੀ ਫ਼ਰਵਰੀ ਲੰਬਾਈ ਲੈ ਕੇ ਪੂਰੇ ਦਿਨ-ਅੰਤਰ ਨੂੰ 7 ਨਾਲ ਭਾਗ ਦਿਓ।",
    }),
    working: [
      t(locale, {
        hi: `${centuryYear} ${leap ? "लीप शताब्दी वर्ष" : "साधारण शताब्दी वर्ष"} है।`,
        pa: `${centuryYear} ${leap ? "ਲੀਪ ਸਦੀ ਸਾਲ" : "ਸਧਾਰਣ ਸਦੀ ਸਾਲ"} ਹੈ।`,
      }),
      t(locale, { hi: `सही दिशायुक्त दिन-अंतर ${shift} है; 7 से शेष लेकर वार बदलें।`, pa: `ਸਹੀ ਦਿਸ਼ਾਵਾਂ ਵਾਲਾ ਦਿਨ-ਅੰਤਰ ${shift} ਹੈ; 7 ਨਾਲ ਬਾਕੀ ਲੈ ਕੇ ਵਾਰ ਬਦਲੋ।` }),
    ],
    conclusion: conclusion(pkg, locale),
    closestTrap: t(locale, {
      hi: "हर शताब्दी वर्ष को अधिवर्ष या हर शताब्दी वर्ष को साधारण मानने से एक दिन की त्रुटि हो सकती है।",
      pa: "ਹਰ ਸਦੀ ਸਾਲ ਨੂੰ ਲੀਪ ਜਾਂ ਹਰ ਸਦੀ ਸਾਲ ਨੂੰ ਸਧਾਰਣ ਮੰਨਣ ਨਾਲ ਇੱਕ ਦਿਨ ਦੀ ਗਲਤੀ ਹੋ ਸਕਦੀ ਹੈ।",
    }),
  };
}

export function finalizeCalendarMultilingualEditorialFreeze(
  pkg: CalendarQuestionPackage,
): CalendarQuestionPackage {
  if (pkg.locale === "en-IN") return pkg;
  const locale = pkg.locale as FrozenLocale;
  if (pkg.prototypeAuthority === "CAL-PQL-003") return { ...pkg, explanation: recoverStart(pkg, locale) };
  if (pkg.prototypeAuthority === "CAL-PQL-004") return { ...pkg, explanation: leastPositive(pkg, locale) };
  if (pkg.prototypeAuthority === "CAL-PQL-027") return { ...pkg, explanation: centuryBoundary(pkg, locale) };
  return pkg;
}
