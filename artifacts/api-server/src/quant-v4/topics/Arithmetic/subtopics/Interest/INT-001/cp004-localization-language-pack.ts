import type { Cp004Frequency } from "./cp004-frequency-math";
import type { IntCp004LocalizedLanguage, IntCp004LocalizedLocale } from "./cp004-localization-types";

export type IntCp004AuthorityTerm =
  | "AMOUNT"
  | "ANNUAL_RATE"
  | "BALANCE"
  | "COMPOUND_INTEREST"
  | "COMPOUNDING_FREQUENCY"
  | "CORRECT"
  | "DIFFERENCE"
  | "DURATION"
  | "EFFECTIVE_ANNUAL_RATE"
  | "FINAL_AMOUNT"
  | "FIND"
  | "FREQUENCY"
  | "FULL_YEAR"
  | "INTEREST"
  | "INVESTMENT"
  | "MATURITY_AMOUNT"
  | "NOMINAL_ANNUAL_RATE"
  | "PERIOD"
  | "PERIOD_RATE"
  | "PRINCIPAL"
  | "RATE"
  | "SCHEDULE"
  | "SCHEME"
  | "SIMPLE_INTEREST"
  | "TAIL_PERIOD"
  | "TIME";

const HINDI_TERMS: Readonly<Record<IntCp004AuthorityTerm, string>> = Object.freeze({
  AMOUNT: "राशि",
  ANNUAL_RATE: "वार्षिक दर",
  BALANCE: "शेष राशि",
  COMPOUND_INTEREST: "चक्रवृद्धि ब्याज",
  COMPOUNDING_FREQUENCY: "चक्रवृद्धि की आवृत्ति",
  CORRECT: "सही",
  DIFFERENCE: "अंतर",
  DURATION: "अवधि",
  EFFECTIVE_ANNUAL_RATE: "प्रभावी वार्षिक दर",
  FINAL_AMOUNT: "अंतिम राशि",
  FIND: "ज्ञात कीजिए",
  FREQUENCY: "आवृत्ति",
  FULL_YEAR: "पूर्ण वर्ष",
  INTEREST: "ब्याज",
  INVESTMENT: "निवेश",
  MATURITY_AMOUNT: "परिपक्वता राशि",
  NOMINAL_ANNUAL_RATE: "नाममात्र वार्षिक दर",
  PERIOD: "अवधि",
  PERIOD_RATE: "प्रति अवधि दर",
  PRINCIPAL: "मूलधन",
  RATE: "दर",
  SCHEDULE: "ब्याज गणना क्रम",
  SCHEME: "योजना",
  SIMPLE_INTEREST: "साधारण ब्याज",
  TAIL_PERIOD: "अंतिम आंशिक अवधि",
  TIME: "समय",
});

const PUNJABI_TERMS: Readonly<Record<IntCp004AuthorityTerm, string>> = Object.freeze({
  AMOUNT: "ਰਕਮ",
  ANNUAL_RATE: "ਸਾਲਾਨਾ ਦਰ",
  BALANCE: "ਬਕਾਇਆ ਰਕਮ",
  COMPOUND_INTEREST: "ਚੱਕਰਵੱਧੀ ਵਿਆਜ",
  COMPOUNDING_FREQUENCY: "ਚੱਕਰਵੱਧੀ ਦੀ ਆਵ੍ਰਿਤੀ",
  CORRECT: "ਸਹੀ",
  DIFFERENCE: "ਅੰਤਰ",
  DURATION: "ਮਿਆਦ",
  EFFECTIVE_ANNUAL_RATE: "ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ",
  FINAL_AMOUNT: "ਅੰਤਿਮ ਰਕਮ",
  FIND: "ਪਤਾ ਕਰੋ",
  FREQUENCY: "ਆਵ੍ਰਿਤੀ",
  FULL_YEAR: "ਪੂਰਾ ਸਾਲ",
  INTEREST: "ਵਿਆਜ",
  INVESTMENT: "ਨਿਵੇਸ਼",
  MATURITY_AMOUNT: "ਮਿਆਦ ਪੂਰੀ ਹੋਣ ਦੀ ਰਕਮ",
  NOMINAL_ANNUAL_RATE: "ਨਾਮਮਾਤਰ ਸਾਲਾਨਾ ਦਰ",
  PERIOD: "ਅਵਧੀ",
  PERIOD_RATE: "ਹਰ ਅਵਧੀ ਦੀ ਦਰ",
  PRINCIPAL: "ਮੂਲਧਨ",
  RATE: "ਦਰ",
  SCHEDULE: "ਵਿਆਜ ਗਿਣਤੀ ਕ੍ਰਮ",
  SCHEME: "ਯੋਜਨਾ",
  SIMPLE_INTEREST: "ਸਧਾਰਣ ਵਿਆਜ",
  TAIL_PERIOD: "ਅੰਤਿਮ ਅਧੂਰੀ ਅਵਧੀ",
  TIME: "ਸਮਾਂ",
});

export const INT_CP004_LOCALIZATION_VERSION = "INT-CP-004-HI-PA-LOCALISATION-v1" as const;
export const INT_CP004_LOCALIZED_LOCALES = Object.freeze(["hi-IN", "pa-IN"] as const);

export function languageForCp004Locale(locale: IntCp004LocalizedLocale): IntCp004LocalizedLanguage {
  return locale === "hi-IN" ? "hi" : "pa";
}

export function cp004Term(locale: IntCp004LocalizedLocale, term: IntCp004AuthorityTerm): string {
  return locale === "hi-IN" ? HINDI_TERMS[term] : PUNJABI_TERMS[term];
}

export function cp004FrequencyLabel(locale: IntCp004LocalizedLocale, frequency: Cp004Frequency): string {
  if (locale === "hi-IN") {
    switch (frequency) {
      case 1: return "वार्षिक";
      case 2: return "अर्धवार्षिक";
      case 4: return "त्रैमासिक";
      case 12: return "मासिक";
    }
  }
  switch (frequency) {
    case 1: return "ਸਾਲਾਨਾ";
    case 2: return "ਛਿਮਾਹੀ";
    case 4: return "ਤਿਮਾਹੀ";
    case 12: return "ਮਾਸਿਕ";
  }
}

export function cp004PeriodNoun(locale: IntCp004LocalizedLocale, frequency: Cp004Frequency): string {
  if (locale === "hi-IN") {
    switch (frequency) {
      case 1: return "वर्ष";
      case 2: return "अर्धवर्ष";
      case 4: return "तिमाही";
      case 12: return "माह";
    }
  }
  switch (frequency) {
    case 1: return "ਸਾਲ";
    case 2: return "ਛਿਮਾਹੀ";
    case 4: return "ਤਿਮਾਹੀ";
    case 12: return "ਮਹੀਨਾ";
  }
}

export function cp004PeriodsText(locale: IntCp004LocalizedLocale, periods: number, frequency: Cp004Frequency): string {
  if (!Number.isInteger(periods) || periods < 1) throw new Error(`Invalid period count: ${periods}`);
  const noun = cp004PeriodNoun(locale, frequency);
  return locale === "hi-IN" ? `${periods} ${noun}` : `${periods} ${noun}`;
}

export function cp004YearsText(locale: IntCp004LocalizedLocale, years: number): string {
  if (!Number.isInteger(years) || years < 1) throw new Error(`Invalid year count: ${years}`);
  return locale === "hi-IN" ? `${years} वर्ष` : `${years} ਸਾਲ`;
}

export function cp004MonthsText(locale: IntCp004LocalizedLocale, months: number): string {
  if (!Number.isInteger(months) || months < 1) throw new Error(`Invalid month count: ${months}`);
  return locale === "hi-IN" ? `${months} माह` : `${months} ਮਹੀਨੇ`;
}

export function cp004CompoundingText(locale: IntCp004LocalizedLocale, frequency: Cp004Frequency): string {
  const label = cp004FrequencyLabel(locale, frequency);
  return locale === "hi-IN"
    ? `ब्याज ${label} चक्रवृद्धि आधार पर जोड़ा जाता है`
    : `ਵਿਆਜ ${label} ਚੱਕਰਵੱਧੀ ਆਧਾਰ 'ਤੇ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ`;
}

export function cp004FindPrompt(locale: IntCp004LocalizedLocale, target: string): string {
  return locale === "hi-IN" ? `${target} ज्ञात कीजिए।` : `${target} ਪਤਾ ਕਰੋ।`;
}

export function cp004CorrectFeedback(locale: IntCp004LocalizedLocale): string {
  return locale === "hi-IN" ? "सही उत्तर।" : "ਸਹੀ ਉੱਤਰ।";
}

export function cp004CommonMistakeTitle(locale: IntCp004LocalizedLocale): string {
  return locale === "hi-IN" ? "सामान्य गलती" : "ਆਮ ਗਲਤੀ";
}

export function cp004SolutionTitle(locale: IntCp004LocalizedLocale): string {
  return locale === "hi-IN" ? "हल" : "ਹੱਲ";
}

export function cp004WhatAskedText(locale: IntCp004LocalizedLocale, target: string): string {
  return locale === "hi-IN" ? `हमें ${target} ज्ञात करना है।` : `ਸਾਨੂੰ ${target} ਪਤਾ ਕਰਨਾ ਹੈ।`;
}

export function assertCp004LocalizedText(locale: IntCp004LocalizedLocale, text: string, label: string): void {
  if (!text.trim()) throw new Error(`${label}: localized text is empty.`);
  const expectedScript = locale === "hi-IN" ? /[\u0900-\u097F]/u : /[\u0A00-\u0A7F]/u;
  if (!expectedScript.test(text)) throw new Error(`${label}: localized text does not contain the expected script.`);
  if (/\b(?:TODO|TBD|placeholder|translate|translation pending)\b/iu.test(text)) {
    throw new Error(`${label}: localization placeholder reached learner content.`);
  }
}
