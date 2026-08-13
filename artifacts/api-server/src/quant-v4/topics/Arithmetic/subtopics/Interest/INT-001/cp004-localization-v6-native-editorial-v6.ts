import { generateIntCp004V6NativeEditorialV5Question } from "./cp004-localization-v6-native-editorial-v5";
import type { IntCp004V6Locale, IntCp004V6LocalizedQuestion } from "./cp004-localization-v6-types";

export const INT_CP004_HI_PA_V6_NATIVE_EDITORIAL_V6 = "INT-CP-004-HI-PA-V6-NATIVE-EDITORIAL-v6" as const;

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

function trimPlainDecimals(text: string): string {
  return text.replace(/(\d[\d,]*)\.(\d+)(?!\d)/gu, (_match, whole: string, fraction: string) => {
    const trimmed = fraction.replace(/0+$/u, "");
    return trimmed.length === 0 ? whole : `${whole}.${trimmed}`;
  });
}

function cleanMoney(text: string): string {
  return text.replace(/₹\s*([\d,]+)\.(\d{2})(?!\d)/gu, (_match, whole: string, paise: string) => {
    return paise === "00" ? `₹${whole}` : `₹${whole}.${paise}`;
  });
}

function cleanRateFractionNotation(text: string): string {
  // V5 correctly wrapped the inherited V4 expressions, but V4's conversion could
  // render 40%/100 as 40\frac{\%}{100}.  The intended competitive-exam notation is 40/100.
  return text.replace(/([0-9][0-9{,}.]*)\\frac\{\\%\}\{100\}/gu, (_match, rate: string) => `\\frac{${rate}}{100}`);
}

function cleanRateDefinitionLine(text: string, locale: IntCp004V6Locale): string {
  const label = locale === "hi-IN" ? /^(प्रति अवधि दर|हर अवधि की दर):\s*/u : /^(ਹਰ ਮਿਆਦ ਦੀ ਦਰ):\s*/u;
  const match = text.match(label);
  if (!match) return text;
  const prefix = match[0];
  const rest = text.slice(prefix.length);
  const direct = rest.match(/^\\\(([0-9][0-9{,}.]*)\\frac\{\\%\}\{100\}\\\)([।.]?)$/u);
  if (!direct) return text;
  const rate = direct[1];
  return `${prefix}\\(${rate}\\%=\\frac{${rate}}{100}\\)${direct[2]}`;
}

function cleanVisible(text: string, locale: IntCp004V6Locale): string {
  // Preserve mathematical value and identity; this pass changes display text only.
  let cleaned = cleanRateDefinitionLine(text, locale);
  cleaned = cleanRateFractionNotation(cleaned);
  cleaned = cleanMoney(cleaned);
  cleaned = trimPlainDecimals(cleaned);
  return cleaned;
}

export function generateIntCp004V6NativeEditorialV6Question(
  qlId: IntCp004V6LocalizedQuestion["qlId"],
  seed: string,
  locale: IntCp004V6Locale,
): IntCp004V6LocalizedQuestion {
  const question = generateIntCp004V6NativeEditorialV5Question(qlId, seed, locale);

  const options = Object.freeze(question.options.map((option) => Object.freeze({
    ...option,
    text: cleanVisible(option.text, locale),
  })));
  const correctAnswer = options[question.correctIndex]?.text;
  if (!correctAnswer) throw new Error(`${qlId}/${seed}/${locale}: V6 correct answer missing.`);

  const explanation = Object.freeze({
    ...question.explanation,
    whatAsked: cleanVisible(question.explanation.whatAsked, locale),
    steps: Object.freeze(question.explanation.steps.map((step) => cleanVisible(step, locale))),
    finalAnswer: locale === "hi-IN" ? `उत्तर: ${correctAnswer}।` : `ਉੱਤਰ: ${correctAnswer}।`,
    commonMistake: cleanVisible(question.explanation.commonMistake, locale),
  });

  return deepFreeze({
    ...question,
    stem: cleanVisible(question.stem, locale),
    options,
    correctAnswer,
    explanation,
  });
}
