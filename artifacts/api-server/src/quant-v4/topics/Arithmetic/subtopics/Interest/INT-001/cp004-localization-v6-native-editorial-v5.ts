import { generateIntCp004V6NativeEditorialV4Question } from "./cp004-localization-v6-native-editorial-v4";
import type { IntCp004V6Locale, IntCp004V6LocalizedQuestion } from "./cp004-localization-v6-types";

export const INT_CP004_HI_PA_V6_NATIVE_EDITORIAL_V5 = "INT-CP-004-HI-PA-V6-NATIVE-EDITORIAL-v5" as const;

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

function inlineMath(expression: string): string {
  return String.raw`\(${expression.trim()}\)`;
}

function replaceLegacyDollarMath(text: string): string {
  return text
    .replace(/\$\$([^$]+)\$\$/gu, (_match, expression: string) => inlineMath(expression))
    .replace(/\$([^$]+)\$/gu, (_match, expression: string) => inlineMath(expression));
}

function outsideExamtreeMath(text: string): string {
  return text
    .replace(/\\\([\s\S]*?\\\)/gu, "")
    .replace(/\\\[[\s\S]*?\\\]/gu, "");
}

function mathNumber(raw: string): string {
  return raw.replace(/,/gu, "{,}");
}

function toLatexArithmetic(raw: string): string {
  let value = raw.trim().replace(/[।.]$/u, "");
  value = value.replace(/₹/gu, "");
  value = value.replace(/([0-9][0-9,]*(?:\.\d+)?)/gu, (number) => mathNumber(number));
  value = value.replace(/−/gu, "-").replace(/×/gu, String.raw`\times `).replace(/÷/gu, String.raw`\div `);
  value = value.replace(/\|([^|]+)\|/gu, (_match, inner: string) => String.raw`\left|${inner.trim()}\right|`);
  value = value.replace(/\^\(([^)]+)\)/gu, "^{$1}");
  value = value.replace(/\^([A-Za-z0-9_]+)/gu, "^{$1}");
  value = value.replace(/\s+/gu, " ").trim();
  return value;
}

function remediateRawEquation(locale: IntCp004V6Locale, step: string): string {
  if (!outsideExamtreeMath(step).includes("=")) return step;

  const duration = locale === "hi-IN"
    ? step.match(/^(\d+) अवधियाँ\s*=\s*(.+?)[।.]?$/u)
    : step.match(/^(\d+) ਮਿਆਦਾਂ\s*=\s*(.+?)[।.]?$/u);
  if (duration) {
    return locale === "hi-IN"
      ? `कुल ${duration[1]} अवधियाँ हैं, इसलिए कुल समय ${duration[2]} है।`
      : `ਕੁੱਲ ${duration[1]} ਮਿਆਦਾਂ ਹਨ, ਇਸ ਲਈ ਕੁੱਲ ਸਮਾਂ ${duration[2]} ਹੈ।`;
  }

  const labelledEquation = step.match(/^([^=\\]+?)\s*=\s*(.+?)[।.]?$/u);
  if (labelledEquation && /[0-9₹|−×÷]/u.test(labelledEquation[2])) {
    return `${labelledEquation[1].trim()}: ${inlineMath(toLatexArithmetic(labelledEquation[2]))}।`;
  }

  const bareEquation = step.match(/^(.+?=.+?)[।.]?$/u);
  if (bareEquation && !/\\[([]/u.test(bareEquation[1])) {
    return `${inlineMath(toLatexArithmetic(bareEquation[1]))}।`;
  }

  return step;
}

function remediateMathStep(locale: IntCp004V6Locale, original: string): string {
  const converted = replaceLegacyDollarMath(original);
  return remediateRawEquation(locale, converted);
}

export function generateIntCp004V6NativeEditorialV5Question(
  qlId: IntCp004V6LocalizedQuestion["qlId"],
  seed: string,
  locale: IntCp004V6Locale,
): IntCp004V6LocalizedQuestion {
  const question = generateIntCp004V6NativeEditorialV4Question(qlId, seed, locale);
  const explanation = Object.freeze({
    ...question.explanation,
    steps: Object.freeze(question.explanation.steps.map((step) => remediateMathStep(locale, step))),
  });

  return deepFreeze({
    ...question,
    explanation,
  });
}
