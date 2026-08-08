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
  ANNUAL_RATE: "वार्षिक ब्याज दर",
  BALANCE: "खाते की राशि",
  COMPOUND_INTEREST: "चक्रवृद्धि ब्याज",
  COMPOUNDING_FREQUENCY: "ब्याज जोड़ने का अंतराल",
  CORRECT: "सही",
  DIFFERENCE: "अंतर",
  DURATION: "समय",
  EFFECTIVE_ANNUAL_RATE: "प्रभावी वार्षिक दर",
  FINAL_AMOUNT: "कुल राशि",
  FIND: "ज्ञात कीजिए",
  FREQUENCY: "ब्याज जोड़ने का तरीका",
  FULL_YEAR: "पूरा वर्ष",
  INTEREST: "ब्याज",
  INVESTMENT: "निवेश",
  MATURITY_AMOUNT: "परिपक्वता पर राशि",
  NOMINAL_ANNUAL_RATE: "घोषित वार्षिक दर",
  PERIOD: "चक्रवृद्धि अवधि",
  PERIOD_RATE: "हर अवधि की ब्याज दर",
  PRINCIPAL: "मूलधन",
  RATE: "ब्याज दर",
  SCHEDULE: "ब्याज जोड़ने का क्रम",
  SCHEME: "योजना",
  SIMPLE_INTEREST: "साधारण ब्याज",
  TAIL_PERIOD: "अंतिम अतिरिक्त महीने",
  TIME: "समय",
});

const PUNJABI_TERMS: Readonly<Record<IntCp004AuthorityTerm, string>> = Object.freeze({
  AMOUNT: "ਰਕਮ",
  ANNUAL_RATE: "ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ",
  BALANCE: "ਖਾਤੇ ਦੀ ਰਕਮ",
  COMPOUND_INTEREST: "ਚੱਕਰਵੱਧੀ ਵਿਆਜ",
  COMPOUNDING_FREQUENCY: "ਵਿਆਜ ਜੋੜਨ ਦਾ ਅੰਤਰਾਲ",
  CORRECT: "ਸਹੀ",
  DIFFERENCE: "ਅੰਤਰ",
  DURATION: "ਸਮਾਂ",
  EFFECTIVE_ANNUAL_RATE: "ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ",
  FINAL_AMOUNT: "ਕੁੱਲ ਰਕਮ",
  FIND: "ਪਤਾ ਲਗਾਓ",
  FREQUENCY: "ਵਿਆਜ ਜੋੜਨ ਦਾ ਤਰੀਕਾ",
  FULL_YEAR: "ਪੂਰਾ ਸਾਲ",
  INTEREST: "ਵਿਆਜ",
  INVESTMENT: "ਨਿਵੇਸ਼",
  MATURITY_AMOUNT: "ਮਿਆਦ ਪੂਰੀ ਹੋਣ ਉੱਤੇ ਰਕਮ",
  NOMINAL_ANNUAL_RATE: "ਦੱਸੀ ਗਈ ਸਾਲਾਨਾ ਦਰ",
  PERIOD: "ਚੱਕਰਵੱਧੀ ਮਿਆਦ",
  PERIOD_RATE: "ਹਰ ਮਿਆਦ ਦੀ ਵਿਆਜ ਦਰ",
  PRINCIPAL: "ਮੂਲਧਨ",
  RATE: "ਵਿਆਜ ਦਰ",
  SCHEDULE: "ਵਿਆਜ ਜੋੜਨ ਦਾ ਕ੍ਰਮ",
  SCHEME: "ਯੋਜਨਾ",
  SIMPLE_INTEREST: "ਸਧਾਰਣ ਵਿਆਜ",
  TAIL_PERIOD: "ਅਖੀਰਲੇ ਵਾਧੂ ਮਹੀਨੇ",
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
      case 2: return "छमाही";
      case 4: return "तिमाही";
      case 12: return "मासिक";
    }
  }
  switch (frequency) {
    case 1: return "ਸਾਲਾਨਾ";
    case 2: return "ਛਿਮਾਹੀ";
    case 4: return "ਤਿਮਾਹੀ";
    case 12: return "ਮਹੀਨਾਵਾਰ";
  }
}

export function cp004FrequencyIntervalText(locale: IntCp004LocalizedLocale, frequency: Cp004Frequency): string {
  if (locale === "hi-IN") {
    switch (frequency) {
      case 1: return "हर वर्ष";
      case 2: return "हर छमाही";
      case 4: return "हर तिमाही";
      case 12: return "हर महीने";
    }
  }
  switch (frequency) {
    case 1: return "ਹਰ ਸਾਲ";
    case 2: return "ਹਰ ਛੇ ਮਹੀਨੇ";
    case 4: return "ਹਰ ਤਿੰਨ ਮਹੀਨੇ";
    case 12: return "ਹਰ ਮਹੀਨੇ";
  }
}

export function cp004CreditedTimesText(locale: IntCp004LocalizedLocale, frequency: Cp004Frequency): string {
  if (locale === "hi-IN") {
    switch (frequency) {
      case 1: return "वर्ष में एक बार";
      case 2: return "वर्ष में दो बार";
      case 4: return "वर्ष में चार बार";
      case 12: return "हर माह";
    }
  }
  switch (frequency) {
    case 1: return "ਸਾਲ ਵਿੱਚ ਇੱਕ ਵਾਰ";
    case 2: return "ਸਾਲ ਵਿੱਚ ਦੋ ਵਾਰ";
    case 4: return "ਸਾਲ ਵਿੱਚ ਚਾਰ ਵਾਰ";
    case 12: return "ਹਰ ਮਹੀਨੇ";
  }
}

export function cp004PeriodNoun(locale: IntCp004LocalizedLocale, frequency: Cp004Frequency): string {
  if (locale === "hi-IN") {
    switch (frequency) {
      case 1: return "वर्ष";
      case 2: return "छमाही";
      case 4: return "तिमाही";
      case 12: return "महीना";
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
  if (locale === "hi-IN") {
    switch (frequency) {
      case 1: return `${periods} वर्ष`;
      case 2: return periods === 1 ? "1 छमाही" : `${periods} छमाहियाँ`;
      case 4: return periods === 1 ? "1 तिमाही" : `${periods} तिमाहियाँ`;
      case 12: return periods === 1 ? "1 महीना" : `${periods} महीने`;
    }
  }
  switch (frequency) {
    case 1: return periods === 1 ? "1 ਸਾਲ" : `${periods} ਸਾਲ`;
    case 2: return periods === 1 ? "1 ਛਿਮਾਹੀ" : `${periods} ਛਿਮਾਹੀਆਂ`;
    case 4: return periods === 1 ? "1 ਤਿਮਾਹੀ" : `${periods} ਤਿਮਾਹੀਆਂ`;
    case 12: return periods === 1 ? "1 ਮਹੀਨਾ" : `${periods} ਮਹੀਨੇ`;
  }
}

export function cp004YearsText(locale: IntCp004LocalizedLocale, years: number): string {
  if (!Number.isInteger(years) || years < 1) throw new Error(`Invalid year count: ${years}`);
  return locale === "hi-IN"
    ? `${years} वर्ष`
    : years === 1 ? "1 ਸਾਲ" : `${years} ਸਾਲ`;
}

export function cp004MonthsText(locale: IntCp004LocalizedLocale, months: number): string {
  if (!Number.isInteger(months) || months < 1) throw new Error(`Invalid month count: ${months}`);
  return locale === "hi-IN"
    ? months === 1 ? "1 महीना" : `${months} महीने`
    : months === 1 ? "1 ਮਹੀਨਾ" : `${months} ਮਹੀਨੇ`;
}

export function cp004CompoundingText(locale: IntCp004LocalizedLocale, frequency: Cp004Frequency): string {
  const interval = cp004FrequencyIntervalText(locale, frequency);
  return locale === "hi-IN"
    ? `ब्याज ${interval} मूलधन में जोड़ा जाता है`
    : `ਵਿਆਜ ${interval} ਮੂਲਧਨ ਵਿੱਚ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ`;
}

export function cp004FindPrompt(locale: IntCp004LocalizedLocale, target: string): string {
  return locale === "hi-IN" ? `${target} ज्ञात कीजिए।` : `${target} ਪਤਾ ਲਗਾਓ।`;
}

export function cp004CorrectFeedback(locale: IntCp004LocalizedLocale): string {
  return locale === "hi-IN"
    ? "सही। यह विकल्प प्रश्न की सभी ब्याज-शर्तों को पूरा करता है।"
    : "ਸਹੀ। ਇਹ ਚੋਣ ਪ੍ਰਸ਼ਨ ਦੀਆਂ ਸਾਰੀਆਂ ਵਿਆਜ-ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਕਰਦੀ ਹੈ।";
}

export function cp004CommonMistakeTitle(locale: IntCp004LocalizedLocale): string {
  return locale === "hi-IN" ? "सामान्य गलती" : "ਆਮ ਗਲਤੀ";
}

export function cp004SolutionTitle(locale: IntCp004LocalizedLocale): string {
  return locale === "hi-IN" ? "हल" : "ਹੱਲ";
}

export function cp004WhatAskedText(locale: IntCp004LocalizedLocale, target: string): string {
  return locale === "hi-IN" ? `हमें ${target} ज्ञात करना है।` : `ਸਾਨੂੰ ${target} ਪਤਾ ਲਗਾਉਣਾ ਹੈ।`;
}

function isUniversalMathExpression(text: string): boolean {
  const trimmed = text.trim();
  return /[=×÷+−\-]/u.test(trimmed)
    && /^[\s0-9₹%.,()/=×÷+−\-^APCInr।]+$/u.test(trimmed);
}

export function assertCp004LocalizedText(locale: IntCp004LocalizedLocale, text: string, label: string): void {
  if (!text.trim()) throw new Error(`${label}: localized text is empty.`);
  if (/\b(?:TODO|TBD|placeholder|translate|translation pending)\b/iu.test(text)) {
    throw new Error(`${label}: localization placeholder reached learner content.`);
  }
  const expectedScript = locale === "hi-IN" ? /[\u0900-\u097F]/u : /[\u0A00-\u0A7F]/u;
  if (!expectedScript.test(text) && !isUniversalMathExpression(text)) {
    throw new Error(`${label}: localized text contains neither the expected script nor a universal mathematical expression.`);
  }
}
