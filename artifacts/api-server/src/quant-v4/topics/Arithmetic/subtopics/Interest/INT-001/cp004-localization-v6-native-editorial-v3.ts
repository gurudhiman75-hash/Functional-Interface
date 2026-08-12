import { generateIntCp004V6NativeEditorialQuestion } from "./cp004-localization-v6-native-editorial";
import type { IntCp004V6Locale, IntCp004V6LocalizedQuestion } from "./cp004-localization-v6-types";

export const INT_CP004_HI_PA_V6_NATIVE_EDITORIAL_V3 = "INT-CP-004-HI-PA-V6-NATIVE-EDITORIAL-v3" as const;

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

function naturalMonths(locale: IntCp004V6Locale, months: number): string {
  if (months < 12) return locale === "hi-IN" ? `${months} महीने` : `${months} ਮਹੀਨੇ`;
  const years = Math.floor(months / 12);
  const remainder = months % 12;
  const yearText = locale === "hi-IN" ? `${years} वर्ष` : `${years} ਸਾਲ`;
  if (remainder === 0) return yearText;
  const monthText = locale === "hi-IN" ? `${remainder} महीने` : `${remainder} ਮਹੀਨੇ`;
  return locale === "hi-IN" ? `${yearText} और ${monthText}` : `${yearText} ਅਤੇ ${monthText}`;
}

function normalize(locale: IntCp004V6Locale, text: string): string {
  const pattern = locale === "hi-IN" ? /(\d+) महीने/gu : /(\d+) ਮਹੀਨੇ/gu;
  return text.replace(pattern, (match, raw: string) => {
    const months = Number(raw);
    return Number.isInteger(months) && months >= 12 ? naturalMonths(locale, months) : match;
  });
}

export function generateIntCp004V6NativeEditorialV3Question(
  qlId: IntCp004V6LocalizedQuestion["qlId"],
  seed: string,
  locale: IntCp004V6Locale,
): IntCp004V6LocalizedQuestion {
  const question = generateIntCp004V6NativeEditorialQuestion(qlId, seed, locale);
  const options = Object.freeze(question.options.map((option) => Object.freeze({ ...option, text: normalize(locale, option.text) })));
  const correctAnswer = options[question.correctIndex]?.text;
  if (!correctAnswer) throw new Error(`${qlId}/${seed}/${locale}: V3 correct answer missing.`);
  const explanation = Object.freeze({
    ...question.explanation,
    whatAsked: normalize(locale, question.explanation.whatAsked),
    steps: Object.freeze(question.explanation.steps.map((step) => normalize(locale, step))),
    finalAnswer: locale === "hi-IN" ? `उत्तर: ${correctAnswer}।` : `ਉੱਤਰ: ${correctAnswer}।`,
    commonMistake: normalize(locale, question.explanation.commonMistake),
  });
  return deepFreeze({ ...question, stem: normalize(locale, question.stem), options, correctAnswer, explanation });
}
