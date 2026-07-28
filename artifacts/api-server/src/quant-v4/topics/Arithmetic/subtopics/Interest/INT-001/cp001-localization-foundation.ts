import {
  compareRational,
  formatPercent,
  formatRational,
  isWholeRational,
  multiplyRational,
  rational,
} from "./foundation/rational";
import { deterministicIndex } from "./foundation/prng";
import type { Rational } from "./foundation/types";
import type { IntCp001Locale } from "./cp001-multilingual-release";

export type UnknownRecord = Record<string, unknown>;

export interface IntCp001LocaleCopy {
  locale: IntCp001Locale;
  languageId: "hi-IN" | "pa-IN";
  headings: {
    core: string;
    steps: string;
    shortcut: string;
    traps: string;
  };
  labels: {
    principal: string;
    interest: string;
    amount: string;
    annualRate: string;
    time: string;
    earlierAmount: string;
    laterAmount: string;
    earlierTime: string;
    laterTime: string;
    annualInterest: string;
    answer: string;
    verification: string;
  };
}

export const INT_CP001_LOCALE_COPY: Record<IntCp001Locale, IntCp001LocaleCopy> = {
  hi: {
    locale: "hi",
    languageId: "hi-IN",
    headings: {
      core: "📌 मुख्य अवधारणा और सूत्र",
      steps: "📝 चरणबद्ध हल",
      shortcut: "⚡ परीक्षा में तेज़ तरीका",
      traps: "⚠️ सामान्य गलतियाँ और विकल्प विश्लेषण",
    },
    labels: {
      principal: "मूलधन",
      interest: "साधारण ब्याज",
      amount: "कुल राशि",
      annualRate: "वार्षिक दर",
      time: "समय",
      earlierAmount: "पहली राशि",
      laterAmount: "बाद की राशि",
      earlierTime: "पहला समय",
      laterTime: "बाद का समय",
      annualInterest: "एक वर्ष का ब्याज",
      answer: "उत्तर",
      verification: "जाँच",
    },
  },
  pa: {
    locale: "pa",
    languageId: "pa-IN",
    headings: {
      core: "📌 ਮੁੱਖ ਧਾਰਨਾ ਅਤੇ ਸੂਤਰ",
      steps: "📝 ਕਦਮ-ਦਰ-ਕਦਮ ਹੱਲ",
      shortcut: "⚡ ਪ੍ਰੀਖਿਆ ਵਾਲਾ ਤੇਜ਼ ਤਰੀਕਾ",
      traps: "⚠️ ਆਮ ਗਲਤੀਆਂ ਅਤੇ ਵਿਕਲਪ ਵਿਸ਼ਲੇਸ਼ਣ",
    },
    labels: {
      principal: "ਮੂਲਧਨ",
      interest: "ਸਧਾਰਣ ਵਿਆਜ",
      amount: "ਕੁੱਲ ਰਕਮ",
      annualRate: "ਸਾਲਾਨਾ ਦਰ",
      time: "ਸਮਾਂ",
      earlierAmount: "ਪਹਿਲੀ ਰਕਮ",
      laterAmount: "ਬਾਅਦ ਦੀ ਰਕਮ",
      earlierTime: "ਪਹਿਲਾ ਸਮਾਂ",
      laterTime: "ਬਾਅਦ ਦਾ ਸਮਾਂ",
      annualInterest: "ਇੱਕ ਸਾਲ ਦਾ ਵਿਆਜ",
      answer: "ਉੱਤਰ",
      verification: "ਜਾਂਚ",
    },
  },
};

export function asRecord(value: unknown): UnknownRecord | undefined {
  return value && typeof value === "object" ? value as UnknownRecord : undefined;
}

export function isRational(value: unknown): value is Rational {
  return Boolean(
    value
    && typeof value === "object"
    && typeof (value as Rational).numerator === "bigint"
    && typeof (value as Rational).denominator === "bigint",
  );
}

export function readRational(record: UnknownRecord | undefined, key: string): Rational | undefined {
  const value = record?.[key];
  return isRational(value) ? value : undefined;
}

export function requireRational(record: UnknownRecord | undefined, key: string): Rational {
  const value = readRational(record, key);
  if (!value) throw new Error(`Missing rational field ${key}.`);
  return value;
}

export function formatIndianInteger(value: bigint): string {
  const negative = value < 0n;
  const digits = (negative ? -value : value).toString();
  if (digits.length <= 3) return `${negative ? "-" : ""}${digits}`;
  const lastThree = digits.slice(-3);
  const leading = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/gu, ",");
  return `${negative ? "-" : ""}${leading},${lastThree}`;
}

export function formatMoneyLocalized(value: Rational): string {
  if (value.denominator === 1n) return `₹${formatIndianInteger(value.numerator)}`;
  return `₹$\\frac{${value.numerator}}{${value.denominator}}$`;
}

export function mathMoney(value: Rational): string {
  if (value.denominator === 1n) return `\\text{₹}${formatIndianInteger(value.numerator)}`;
  return `\\text{₹}\\frac{${value.numerator}}{${value.denominator}}`;
}

export function mathRational(value: Rational): string {
  if (value.denominator === 1n) return value.numerator.toString();
  const negative = value.numerator < 0n;
  const numerator = negative ? -value.numerator : value.numerator;
  return `${negative ? "-" : ""}\\frac{${numerator}}{${value.denominator}}`;
}

export function inlineRational(value: Rational): string {
  return `$${mathRational(value)}$`;
}

export function formatPercentLocalized(value: Rational, locale: IntCp001Locale): string {
  return locale === "hi"
    ? `${formatPercent(value)}% वार्षिक`
    : `${formatPercent(value)}% ਸਾਲਾਨਾ`;
}

export function mathPercent(value: Rational): string {
  return `${formatPercent(value)}\\%`;
}

function yearWord(locale: IntCp001Locale): string {
  return locale === "hi" ? "वर्ष" : "ਸਾਲ";
}

function monthWord(locale: IntCp001Locale, count: bigint): string {
  if (locale === "hi") return count === 1n ? "महीना" : "महीने";
  return count === 1n ? "ਮਹੀਨਾ" : "ਮਹੀਨੇ";
}

function dayWord(locale: IntCp001Locale): string {
  return locale === "hi" ? "दिन" : "ਦਿਨ";
}

export function formatMonths(months: bigint | number, locale: IntCp001Locale): string {
  const value = typeof months === "number" ? BigInt(months) : months;
  return `${value} ${monthWord(locale, value)}`;
}

export function formatDays(days: bigint | number, locale: IntCp001Locale): string {
  const value = typeof days === "number" ? BigInt(days) : days;
  return `${value} ${dayWord(locale)}`;
}

export function formatDurationYears(value: Rational, locale: IntCp001Locale): string {
  if (isWholeRational(value)) return `${value.numerator} ${yearWord(locale)}`;
  const months = multiplyRational(value, rational(12));
  if (isWholeRational(months)) {
    if (months.numerator < 12n) return formatMonths(months.numerator, locale);
    const years = months.numerator / 12n;
    const remainder = months.numerator % 12n;
    if (remainder === 0n) return `${years} ${yearWord(locale)}`;
    return `${years} ${yearWord(locale)} ${formatMonths(remainder, locale)}`;
  }
  return `${inlineRational(value)} ${yearWord(locale)}`;
}

export function mathDurationYears(value: Rational, locale: IntCp001Locale): string {
  if (isWholeRational(value)) return `${value.numerator}\\text{ ${yearWord(locale)}}`;
  const months = multiplyRational(value, rational(12));
  if (isWholeRational(months)) return `${months.numerator}\\text{ ${monthWord(locale, months.numerator)}}`;
  return `${mathRational(value)}\\text{ ${yearWord(locale)}}`;
}

export function formatRatio(value: Rational): string {
  return value.denominator === 1n ? value.numerator.toString() : inlineRational(value);
}

export function formatColonRatio(value: Rational): string {
  return `${value.numerator} : ${value.denominator}`;
}

export interface LocalizedContext {
  actor: string;
  lead: string;
  investmentNoun: string;
}

const ACTOR_NAMES: Record<IntCp001Locale, Record<string, string>> = {
  hi: {
    Meera: "मीरा", Harpreet: "हरप्रीत", Aman: "अमन", Gurleen: "गुरलीन",
    Ravi: "रवि", Simran: "सिमरन", Navdeep: "नवदीप", Kiran: "किरण",
  },
  pa: {
    Meera: "ਮੀਰਾ", Harpreet: "ਹਰਪ੍ਰੀਤ", Aman: "ਅਮਨ", Gurleen: "ਗੁਰਲੀਨ",
    Ravi: "ਰਵੀ", Simran: "ਸਿਮਰਨ", Navdeep: "ਨਵਦੀਪ", Kiran: "ਕਿਰਨ",
  },
};

function actorName(actor: string | undefined, locale: IntCp001Locale): string {
  if (actor && ACTOR_NAMES[locale][actor]) return ACTOR_NAMES[locale][actor]!;
  return locale === "hi" ? "एक निवेशक" : "ਇੱਕ ਨਿਵੇਸ਼ਕ";
}

export function localizedContext(parameters: UnknownRecord, locale: IntCp001Locale, seed: string): LocalizedContext {
  const context = asRecord(parameters.context);
  const scenarioId = typeof context?.scenarioId === "string" ? context.scenarioId : "GENERIC";
  const actor = actorName(typeof context?.actor === "string" ? context.actor : undefined, locale);

  const hi: Record<string, [string, string]> = {
    FIXED_DEPOSIT: [`${actor} ने सहकारी बैंक में सावधि जमा की है`, "सावधि जमा"],
    POST_OFFICE: [`${actor} ने डाकघर में मियादी जमा की है`, "मियादी जमा"],
    EDUCATION_LOAN: [`${actor} ने क्षेत्रीय बैंक से शिक्षा ऋण लिया है`, "शिक्षा ऋण"],
    CROP_LOAN: [`${actor} ने ग्रामीण ऋण समिति से फसल ऋण लिया है`, "फसल ऋण"],
    BUSINESS_ADVANCE: [`${actor} ने स्थानीय वित्त कार्यालय में व्यावसायिक निवेश किया है`, "व्यावसायिक निवेश"],
    SAVINGS_CERTIFICATE: [`${actor} ने बचत सहकारी संस्था से बचत प्रमाणपत्र लिया है`, "बचत प्रमाणपत्र"],
    EQUIPMENT_LOAN: [`${actor} ने जिला बैंक से उपकरण ऋण लिया है`, "उपकरण ऋण"],
    PERSONAL_AGREEMENT: [`${actor} ने वित्त कार्यालय में ऋण समझौता किया है`, "ऋण"],
  };
  const pa: Record<string, [string, string]> = {
    FIXED_DEPOSIT: [`${actor} ਨੇ ਸਹਿਕਾਰੀ ਬੈਂਕ ਵਿੱਚ ਮਿਆਦੀ ਜਮ੍ਹਾ ਕਰਵਾਈ ਹੈ`, "ਮਿਆਦੀ ਜਮ੍ਹਾ"],
    POST_OFFICE: [`${actor} ਨੇ ਡਾਕਘਰ ਵਿੱਚ ਮਿਆਦੀ ਜਮ੍ਹਾ ਕਰਵਾਈ ਹੈ`, "ਮਿਆਦੀ ਜਮ੍ਹਾ"],
    EDUCATION_LOAN: [`${actor} ਨੇ ਖੇਤਰੀ ਬੈਂਕ ਤੋਂ ਸਿੱਖਿਆ ਕਰਜ਼ਾ ਲਿਆ ਹੈ`, "ਸਿੱਖਿਆ ਕਰਜ਼ਾ"],
    CROP_LOAN: [`${actor} ਨੇ ਪੇਂਡੂ ਕਰਜ਼ਾ ਸਭਾ ਤੋਂ ਫਸਲੀ ਕਰਜ਼ਾ ਲਿਆ ਹੈ`, "ਫਸਲੀ ਕਰਜ਼ਾ"],
    BUSINESS_ADVANCE: [`${actor} ਨੇ ਸਥਾਨਕ ਵਿੱਤ ਦਫ਼ਤਰ ਵਿੱਚ ਕਾਰੋਬਾਰੀ ਨਿਵੇਸ਼ ਕੀਤਾ ਹੈ`, "ਕਾਰੋਬਾਰੀ ਨਿਵੇਸ਼"],
    SAVINGS_CERTIFICATE: [`${actor} ਨੇ ਬਚਤ ਸਹਿਕਾਰੀ ਸਭਾ ਤੋਂ ਬਚਤ ਸਰਟੀਫਿਕੇਟ ਲਿਆ ਹੈ`, "ਬਚਤ ਸਰਟੀਫਿਕੇਟ"],
    EQUIPMENT_LOAN: [`${actor} ਨੇ ਜ਼ਿਲ੍ਹਾ ਬੈਂਕ ਤੋਂ ਸਾਜ਼ੋ-ਸਾਮਾਨ ਲਈ ਕਰਜ਼ਾ ਲਿਆ ਹੈ`, "ਸਾਜ਼ੋ-ਸਾਮਾਨ ਕਰਜ਼ਾ"],
    PERSONAL_AGREEMENT: [`${actor} ਨੇ ਵਿੱਤ ਦਫ਼ਤਰ ਵਿੱਚ ਕਰਜ਼ੇ ਦਾ ਸਮਝੌਤਾ ਕੀਤਾ ਹੈ`, "ਕਰਜ਼ਾ"],
  };

  const selected = (locale === "hi" ? hi : pa)[scenarioId];
  if (selected) return { actor, lead: selected[0], investmentNoun: selected[1] };

  const genericHi: Array<[string, string]> = [
    [`${actor} ने एक बैंक में निवेश किया है`, "निवेश"],
    [`${actor} ने डाकघर में मियादी जमा की है`, "मियादी जमा"],
    [`${actor} ने सहकारी संस्था में धन जमा किया है`, "जमा"],
  ];
  const genericPa: Array<[string, string]> = [
    [`${actor} ਨੇ ਇੱਕ ਬੈਂਕ ਵਿੱਚ ਨਿਵੇਸ਼ ਕੀਤਾ ਹੈ`, "ਨਿਵੇਸ਼"],
    [`${actor} ਨੇ ਡਾਕਘਰ ਵਿੱਚ ਮਿਆਦੀ ਜਮ੍ਹਾ ਕਰਵਾਈ ਹੈ`, "ਮਿਆਦੀ ਜਮ੍ਹਾ"],
    [`${actor} ਨੇ ਸਹਿਕਾਰੀ ਸਭਾ ਵਿੱਚ ਰਕਮ ਜਮ੍ਹਾ ਕਰਵਾਈ ਹੈ`, "ਜਮ੍ਹਾ"],
  ];
  const pool = locale === "hi" ? genericHi : genericPa;
  const item = pool[deterministicIndex(`${seed}:${locale}:int-cp001-context`, pool.length)]!;
  return { actor, lead: item[0], investmentNoun: item[1] };
}

export function localizeDisplayMath(value: string, locale: IntCp001Locale): string {
  if (locale === "hi") {
    return value
      .replaceAll("\\text{ years}", "\\text{ वर्ष}")
      .replaceAll("\\text{ year}", "\\text{ वर्ष}")
      .replaceAll("\\text{ months}", "\\text{ महीने}")
      .replaceAll("\\text{ month}", "\\text{ महीना}")
      .replaceAll("\\text{annual}", "\\text{वार्षिक}")
      .replaceAll("\\text{one year}", "\\text{एक वर्ष}")
      .replaceAll("\\text{net interest percentage}", "\\text{कुल ब्याज प्रतिशत}");
  }
  return value
    .replaceAll("\\text{ years}", "\\text{ ਸਾਲ}")
    .replaceAll("\\text{ year}", "\\text{ ਸਾਲ}")
    .replaceAll("\\text{ months}", "\\text{ ਮਹੀਨੇ}")
    .replaceAll("\\text{ month}", "\\text{ ਮਹੀਨਾ}")
    .replaceAll("\\text{annual}", "\\text{ਸਾਲਾਨਾ}")
    .replaceAll("\\text{one year}", "\\text{ਇੱਕ ਸਾਲ}")
    .replaceAll("\\text{net interest percentage}", "\\text{ਕੁੱਲ ਵਿਆਜ ਪ੍ਰਤੀਸ਼ਤ}");
}

export function formatLocalizedOption(
  result: { semantic: string; value: unknown },
  fallbackText: string,
  locale: IntCp001Locale,
): string {
  if (!isRational(result.value)) return fallbackText;
  const value = result.value;
  switch (result.semantic) {
    case "SIMPLE_INTEREST":
    case "TOTAL_AMOUNT":
    case "PRINCIPAL":
    case "ANNUAL_INTEREST":
      return formatMoneyLocalized(value);
    case "ANNUAL_RATE_PERCENT":
      return formatPercentLocalized(value, locale);
    case "TIME_YEARS":
      return formatDurationYears(value, locale);
    case "TIME_MONTHS":
      return formatMonths(value.numerator / value.denominator, locale);
    case "AMOUNT_MULTIPLE":
      return locale === "hi"
        ? `${formatRatio(value)} गुना मूलधन`
        : `${formatRatio(value)} ਗੁਣਾ ਮੂਲਧਨ`;
    case "INTEREST_TO_PRINCIPAL_RATIO":
      if (compareRational(value, rational(1)) < 0) {
        return locale === "hi"
          ? `मूलधन का ${formatRatio(value)}`
          : `ਮੂਲਧਨ ਦਾ ${formatRatio(value)}`;
      }
      return locale === "hi"
        ? `${formatRatio(value)} गुना मूलधन`
        : `${formatRatio(value)} ਗੁਣਾ ਮੂਲਧਨ`;
    default:
      return fallbackText;
  }
}

const MATH_SEGMENT = /(\$\$[\s\S]*?\$\$|\$[^$]*?\$)/gu;

export function stripMath(value: string): string {
  return value.replace(MATH_SEGMENT, " ");
}

export function hasHindiScript(value: string): boolean {
  return /[\u0900-\u097F]/u.test(value);
}

export function hasGurmukhiScript(value: string): boolean {
  return /[\u0A00-\u0A7F]/u.test(value);
}

export function hasInstructionalLatinLeak(value: string): boolean {
  return /[A-Za-z]{2,}/u.test(stripMath(value));
}

export function stableBigIntJson(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

export function rawRational(value: Rational): string {
  return formatRational(value);
}
