import type { IntCp003LocalizedLanguage, IntCp003LocalizedLocale } from "./cp003-localization-types";

export type IntCp003AuthorityTerm =
  | "AMOUNT"
  | "ANNUAL_RATE"
  | "BALANCE"
  | "COMPOUND_INTEREST"
  | "CORRECT"
  | "EARLIER_YEAR"
  | "FINAL_AMOUNT"
  | "FIND"
  | "INTEREST"
  | "INTEREST_IN_YEAR"
  | "INVESTMENT"
  | "LATER_YEAR"
  | "ORIGINAL_SUM"
  | "PRINCIPAL"
  | "RATE"
  | "TIME"
  | "YEAR"
  | "YEARS";

const HINDI_TERMS: Readonly<Record<IntCp003AuthorityTerm, string>> = Object.freeze({
  AMOUNT: "राशि",
  ANNUAL_RATE: "वार्षिक दर",
  BALANCE: "शेष राशि",
  COMPOUND_INTEREST: "चक्रवृद्धि ब्याज",
  CORRECT: "सही",
  EARLIER_YEAR: "पहला दिया गया वर्ष",
  FINAL_AMOUNT: "अंतिम राशि",
  FIND: "ज्ञात कीजिए",
  INTEREST: "ब्याज",
  INTEREST_IN_YEAR: "उस वर्ष का ब्याज",
  INVESTMENT: "निवेश",
  LATER_YEAR: "बाद वाला वर्ष",
  ORIGINAL_SUM: "मूल राशि",
  PRINCIPAL: "मूलधन",
  RATE: "दर",
  TIME: "समय",
  YEAR: "वर्ष",
  YEARS: "वर्ष",
});

const PUNJABI_TERMS: Readonly<Record<IntCp003AuthorityTerm, string>> = Object.freeze({
  AMOUNT: "ਰਕਮ",
  ANNUAL_RATE: "ਸਾਲਾਨਾ ਦਰ",
  BALANCE: "ਬਕਾਇਆ ਰਕਮ",
  COMPOUND_INTEREST: "ਚੱਕਰਵੱਧੀ ਵਿਆਜ",
  CORRECT: "ਸਹੀ",
  EARLIER_YEAR: "ਪਹਿਲਾਂ ਦਿੱਤਾ ਸਾਲ",
  FINAL_AMOUNT: "ਅੰਤਿਮ ਰਕਮ",
  FIND: "ਪਤਾ ਕਰੋ",
  INTEREST: "ਵਿਆਜ",
  INTEREST_IN_YEAR: "ਉਸ ਸਾਲ ਦਾ ਵਿਆਜ",
  INVESTMENT: "ਨਿਵੇਸ਼",
  LATER_YEAR: "ਬਾਅਦ ਵਾਲਾ ਸਾਲ",
  ORIGINAL_SUM: "ਮੂਲ ਰਕਮ",
  PRINCIPAL: "ਮੂਲਧਨ",
  RATE: "ਦਰ",
  TIME: "ਸਮਾਂ",
  YEAR: "ਸਾਲ",
  YEARS: "ਸਾਲ",
});

export const INT_CP003_LOCALIZATION_VERSION = "INT-CP-003-HI-PA-LOCALISATION-v1" as const;
export const INT_CP003_LOCALIZED_LOCALES = Object.freeze(["hi-IN", "pa-IN"] as const);

export function languageForLocale(locale: IntCp003LocalizedLocale): IntCp003LocalizedLanguage {
  return locale === "hi-IN" ? "hi" : "pa";
}

export function cp003Term(
  locale: IntCp003LocalizedLocale,
  term: IntCp003AuthorityTerm,
): string {
  return locale === "hi-IN" ? HINDI_TERMS[term] : PUNJABI_TERMS[term];
}

export function cp003YearsText(
  locale: IntCp003LocalizedLocale,
  years: number,
): string {
  if (!Number.isInteger(years) || years < 1) throw new Error(`Invalid complete-year count: ${years}`);
  return locale === "hi-IN" ? `${years} वर्ष` : `${years} ਸਾਲ`;
}

export function cp003OrdinalYearText(
  locale: IntCp003LocalizedLocale,
  year: number,
): string {
  if (!Number.isInteger(year) || year < 1) throw new Error(`Invalid year number: ${year}`);
  if (locale === "hi-IN") {
    if (year === 1) return "पहले वर्ष";
    if (year === 2) return "दूसरे वर्ष";
    if (year === 3) return "तीसरे वर्ष";
    if (year === 4) return "चौथे वर्ष";
    if (year === 5) return "पाँचवें वर्ष";
    return `${year}वें वर्ष`;
  }
  if (year === 1) return "ਪਹਿਲੇ ਸਾਲ";
  if (year === 2) return "ਦੂਜੇ ਸਾਲ";
  if (year === 3) return "ਤੀਜੇ ਸਾਲ";
  if (year === 4) return "ਚੌਥੇ ਸਾਲ";
  if (year === 5) return "ਪੰਜਵੇਂ ਸਾਲ";
  return `${year}ਵੇਂ ਸਾਲ`;
}

export function cp003CompoundedAnnuallyText(locale: IntCp003LocalizedLocale): string {
  return locale === "hi-IN"
    ? "ब्याज की गणना वार्षिक चक्रवृद्धि आधार पर की जाती है"
    : "ਵਿਆਜ ਦੀ ਗਿਣਤੀ ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਆਧਾਰ 'ਤੇ ਕੀਤੀ ਜਾਂਦੀ ਹੈ";
}

export function cp003FindPrompt(
  locale: IntCp003LocalizedLocale,
  target: string,
): string {
  return locale === "hi-IN" ? `${target} ज्ञात कीजिए।` : `${target} ਪਤਾ ਕਰੋ।`;
}

export function cp003CorrectFeedback(locale: IntCp003LocalizedLocale): string {
  return locale === "hi-IN" ? "सही उत्तर।" : "ਸਹੀ ਉੱਤਰ।";
}

export function cp003CommonMistakeTitle(locale: IntCp003LocalizedLocale): string {
  return locale === "hi-IN" ? "सामान्य गलती" : "ਆਮ ਗਲਤੀ";
}

export function cp003QuickMethodTitle(locale: IntCp003LocalizedLocale): string {
  return locale === "hi-IN" ? "त्वरित विधि" : "ਤੇਜ਼ ਤਰੀਕਾ";
}

export function cp003CheckTitle(locale: IntCp003LocalizedLocale): string {
  return locale === "hi-IN" ? "जाँच" : "ਜਾਂਚ";
}

export function assertCp003LocalizedText(
  locale: IntCp003LocalizedLocale,
  text: string,
  label: string,
): void {
  if (!text.trim()) throw new Error(`${label}: localized text is empty.`);
  const expectedScript = locale === "hi-IN" ? /[\u0900-\u097F]/u : /[\u0A00-\u0A7F]/u;
  if (!expectedScript.test(text)) throw new Error(`${label}: localized text does not contain the expected script.`);
  if (/\b(?:TODO|TBD|placeholder|translate|translation pending)\b/iu.test(text)) {
    throw new Error(`${label}: localization placeholder reached learner content.`);
  }
}
