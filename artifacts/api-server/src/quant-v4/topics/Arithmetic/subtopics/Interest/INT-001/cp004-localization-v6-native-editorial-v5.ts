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
  if (bareEquation && !bareEquation[1].includes("\\(") && !bareEquation[1].includes("\\[")) {
    return `${inlineMath(toLatexArithmetic(bareEquation[1]))}।`;
  }

  return step;
}

function remediateMathStep(locale: IntCp004V6Locale, original: string): string {
  const converted = replaceLegacyDollarMath(original);
  return remediateRawEquation(locale, converted);
}

function remediateStem(
  qlId: IntCp004V6LocalizedQuestion["qlId"],
  locale: IntCp004V6Locale,
  original: string,
): string {
  let stem = original;

  if (qlId === "INT-QL-076") {
    stem = locale === "hi-IN"
      ? stem.replace(/प्रभावी दी गई जानकारी के आधार पर वार्षिक ब्याज दर कितनी थी\?/gu, "प्रभावी वार्षिक ब्याज दर (दो दशमलव स्थान तक) कितनी होगी?")
      : stem.replace(/ਪ੍ਰਭਾਵੀ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਦੇ ਅਧਾਰ 'ਤੇ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ ਕਿੰਨੀ ਸੀ\?/gu, "ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਵਿਆਜ ਦਰ (ਦੋ ਦਸ਼ਮਲਵ ਥਾਵਾਂ ਤੱਕ) ਕਿੰਨੀ ਹੋਵੇਗੀ?");
  }

  if (qlId === "INT-QL-084") {
    stem = locale === "hi-IN"
      ? stem.replace(/पहले वर्ष ब्याज जोड़ा जाता है और अगले वर्ष हर छह महीने जोड़ा जाता है।/gu, "पहले वर्ष ब्याज सालाना जोड़ा जाता है और अगले वर्ष हर छह महीने जोड़ा जाता है।")
      : stem.replace(/ਪਹਿਲੇ ਸਾਲ ਵਿਆਜ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ ਅਤੇ ਅਗਲੇ ਸਾਲ ਹਰ ਛੇ ਮਹੀਨੇ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ।/gu, "ਪਹਿਲੇ ਸਾਲ ਵਿਆਜ ਸਾਲਾਨਾ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ ਅਤੇ ਅਗਲੇ ਸਾਲ ਹਰ ਛੇ ਮਹੀਨੇ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ।");
  }

  return stem;
}

function displayedPercent(text: string): number | null {
  const match = text.replace(/,/gu, "").match(/^([0-9]+(?:\.\d+)?)%$/u);
  return match ? Number(match[1]) : null;
}

function solutionNumber(question: IntCp004V6LocalizedQuestion): number {
  return Number(question.solution.numerator) / Number(question.solution.denominator);
}

function needsApproximation(question: IntCp004V6LocalizedQuestion): boolean {
  if (question.qlId !== "INT-QL-076") return false;
  const displayed = displayedPercent(question.correctAnswer);
  return displayed !== null && Math.abs(solutionNumber(question) - displayed) > 1e-10;
}

function markApproximation(step: string, correctAnswer: string): string {
  const displayed = correctAnswer.replace(/%$/u, "");
  const exactNeedle = `= ${displayed}\\%`;
  if (step.includes(exactNeedle)) return step.replace(exactNeedle, `\\approx ${displayed}\\%`);
  const compactNeedle = `=${displayed}\\%`;
  return step.includes(compactNeedle) ? step.replace(compactNeedle, `\\approx ${displayed}\\%`) : step;
}

export function generateIntCp004V6NativeEditorialV5Question(
  qlId: IntCp004V6LocalizedQuestion["qlId"],
  seed: string,
  locale: IntCp004V6Locale,
): IntCp004V6LocalizedQuestion {
  const question = generateIntCp004V6NativeEditorialV4Question(qlId, seed, locale);
  const approximate = needsApproximation(question);
  const steps = question.explanation.steps.map((step) => remediateMathStep(locale, step));
  const explanation = Object.freeze({
    ...question.explanation,
    steps: Object.freeze(approximate ? steps.map((step) => markApproximation(step, question.correctAnswer)) : steps),
    finalAnswer: approximate
      ? (locale === "hi-IN" ? `उत्तर: लगभग ${question.correctAnswer}।` : `ਉੱਤਰ: ਲਗਭਗ ${question.correctAnswer}।`)
      : question.explanation.finalAnswer,
  });

  return deepFreeze({
    ...question,
    stem: remediateStem(qlId, locale, question.stem),
    explanation,
  });
}
