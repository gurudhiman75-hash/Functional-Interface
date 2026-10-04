import { multiply, rational, type Rational } from "../../foundation/rational";
import { formatExamNumber } from "../../cp003/generation-support";
import { formatNativeClock, formatNativeDuration } from "../../cp003/localization/native-language-primitives";

export type TsdCp004NativeLanguage = "hi" | "pa";

export function cp004NativeNumber(value: Rational | undefined): string {
  return value ? formatExamNumber(value) : "?";
}

export function cp004NativeDuration(value: Rational | undefined, language: TsdCp004NativeLanguage): string {
  return value ? formatNativeDuration(value, language) : "?";
}

export function cp004NativeClock(value: Rational | undefined, language: TsdCp004NativeLanguage): string {
  return value ? formatNativeClock(value, language) : "?";
}

export function cp004LocalizeOption(text: string, language: TsdCp004NativeLanguage): string {
  if (language === "hi") {
    return text
      .replace(/\bhours\b/gi, "घंटे")
      .replace(/\bhour\b/gi, "घंटा")
      .replace(/\bminutes\b/gi, "मिनट")
      .replace(/\bminute\b/gi, "मिनट")
      .replace(/\bseconds\b/gi, "सेकंड")
      .replace(/\bsecond\b/gi, "सेकंड");
  }
  return text
    .replace(/\bhours\b/gi, "ਘੰਟੇ")
    .replace(/\bhour\b/gi, "ਘੰਟਾ")
    .replace(/\bminutes\b/gi, "ਮਿੰਟ")
    .replace(/\bminute\b/gi, "ਮਿੰਟ")
    .replace(/\bseconds\b/gi, "ਸਕਿੰਟ")
    .replace(/\bsecond\b/gi, "ਸਕਿੰਟ");
}

export function cp004Ratio(left: Rational | undefined, right: Rational | undefined): string {
  return `${cp004NativeNumber(left)}:${cp004NativeNumber(right)}`;
}

export function cp004MinutesFromHours(value: Rational | undefined): string {
  if (!value) return "?";
  return formatExamNumber(multiply(value, rational(60)));
}

const DEVANAGARI = /[\u0900-\u097F]/u;
const GURMUKHI = /[\u0A00-\u0A7F]/u;
const LATIN_WORD = /[A-Za-z]{2,}/gu;
const ALLOWED_LATIN = new Set(["km", "AM", "PM"]);

export function assertCp004NativeText(
  text: string,
  language: TsdCp004NativeLanguage,
  label: string,
): void {
  if (!text.trim()) throw new Error(`${label}: native text is empty`);
  if (/\{[^}]+\}/u.test(text)) throw new Error(`${label}: unresolved placeholder remains`);
  if (language === "hi") {
    if (!DEVANAGARI.test(text)) throw new Error(`${label}: Hindi text has no Devanagari`);
    if (GURMUKHI.test(text)) throw new Error(`${label}: Hindi text contains Gurmukhi`);
  } else {
    if (!GURMUKHI.test(text)) throw new Error(`${label}: Punjabi text has no Gurmukhi`);
    if (DEVANAGARI.test(text)) throw new Error(`${label}: Punjabi text contains Devanagari`);
  }
  const unexpected = (text.match(LATIN_WORD) ?? []).filter((token) => !ALLOWED_LATIN.has(token));
  if (unexpected.length > 0) {
    throw new Error(`${label}: unexpected Latin words: ${[...new Set(unexpected)].join(", ")}`);
  }
}
