import { generateIntCp004V6NativeEditorialV5Question } from "./cp004-localization-v6-native-editorial-v5";
import type { IntCp004V6Locale, IntCp004V6LocalizedQuestion } from "./cp004-localization-v6-types";

export const INT_CP004_HI_PA_V6_NATIVE_EDITORIAL_V8 = "INT-CP-004-HI-PA-V6-NATIVE-EDITORIAL-v8" as const;

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

function cleanWholeRupees(text: string): string {
  return text.replace(/₹\s*([\d,]+)\.00(?!\d)/gu, "₹$1");
}

function cleanPercentTrailingZeroes(text: string): string {
  return text
    .replace(/(\d+)\.(\d*?[1-9])0+(?=\\?%)/gu, "$1.$2")
    .replace(/(\d+)\.0+(?=\\?%)/gu, "$1");
}

function cleanInheritedRateFraction(text: string): string {
  return text.replace(/([0-9][0-9{,}.]*)\\frac\{\\%\}\{100\}/gu, (_match, rate: string) => `\\frac{${rate}}{100}`);
}

function cleanRateDefinitionLine(text: string, locale: IntCp004V6Locale): string {
  const label = locale === "hi-IN"
    ? /^(प्रति अवधि दर|हर अवधि की दर):\s*/u
    : /^(ਹਰ ਮਿਆਦ ਦੀ ਦਰ):\s*/u;
  const labelMatch = text.match(label);
  if (!labelMatch) return text;
  const prefix = labelMatch[0];
  const rest = text.slice(prefix.length);
  const direct = rest.match(/^\\\(([0-9][0-9{,}.]*)\\frac\{\\%\}\{100\}\\\)([।.]?)$/u);
  if (!direct) return text;
  const rate = direct[1];
  return `${prefix}\\(${rate}\\%=\\frac{${rate}}{100}\\)${direct[2]}`;
}

function cleanVisible(text: string, locale: IntCp004V6Locale): string {
  let cleaned = cleanRateDefinitionLine(text, locale);
  cleaned = cleanInheritedRateFraction(cleaned);
  cleaned = cleanWholeRupees(cleaned);
  cleaned = cleanPercentTrailingZeroes(cleaned);
  return cleaned;
}

function finalAnswer(locale: IntCp004V6Locale, predecessorFinal: string, answer: string): string {
  const approximate = locale === "hi-IN" ? predecessorFinal.includes("लगभग") : predecessorFinal.includes("ਲਗਭਗ");
  if (locale === "hi-IN") return approximate ? `उत्तर: लगभग ${answer}।` : `उत्तर: ${answer}।`;
  return approximate ? `ਉੱਤਰ: ਲਗਭਗ ${answer}।` : `ਉੱਤਰ: ${answer}।`;
}

export function generateIntCp004V6NativeEditorialV8Question(
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
  if (!correctAnswer) throw new Error(`${qlId}/${seed}/${locale}: V8 correct answer missing.`);

  const explanation = Object.freeze({
    ...question.explanation,
    whatAsked: cleanVisible(question.explanation.whatAsked, locale),
    steps: Object.freeze(question.explanation.steps.map((step) => cleanVisible(step, locale))),
    finalAnswer: finalAnswer(locale, question.explanation.finalAnswer, correctAnswer),
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
