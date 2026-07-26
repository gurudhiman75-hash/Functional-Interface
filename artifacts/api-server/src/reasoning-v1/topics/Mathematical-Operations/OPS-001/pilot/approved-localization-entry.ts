import type { ApprovedOpsQuestion } from "./approved-teaching-entry";
import {
  localizeApprovedOpsQuestion as localizeBase,
  type ApprovedOpsLocale,
  type LocalizedApprovedOpsQuestion,
} from "./approved-localization";

export type { ApprovedOpsLocale, LocalizedApprovedOpsQuestion };

function placeholderLabel(label: string): string {
  if (label === "Read the value") return "Identify complete tokens";
  if (label.endsWith(": Read the value")) return label.replace(/Read the value$/u, "Identify complete tokens");
  return label;
}

function placeholderText(source: string): string {
  if (/^Only .+ makes the equation true\.$/u.test(source)) return "The transformed equation is true.";
  return source;
}

function localizedValueLabel(label: string, locale: ApprovedOpsLocale): string {
  const base = locale === "hi-IN" ? "मान पढ़ें" : "ਮੁੱਲ ਪੜ੍ਹੋ";
  if (label === "Read the value") return base;
  if (label.startsWith("Left side:")) return locale === "hi-IN" ? `बायाँ पक्ष: ${base}` : `ਖੱਬਾ ਪਾਸਾ: ${base}`;
  if (label.startsWith("Right side:")) return locale === "hi-IN" ? `दायाँ पक्ष: ${base}` : `ਸੱਜਾ ਪਾਸਾ: ${base}`;
  return base;
}

function restoreText(original: string, translated: string, locale: ApprovedOpsLocale): string {
  const unique = original.match(/^Only (.+) makes the equation true\.$/u);
  if (unique) {
    if (unique[1] === "this pair") return locale === "hi-IN"
      ? "केवल यही युग्म समीकरण को सही बनाता है।"
      : "ਕੇਵਲ ਇਹੀ ਜੋੜਾ ਸਮੀਕਰਨ ਨੂੰ ਸਹੀ ਬਣਾਉਂਦਾ ਹੈ।";
    return locale === "hi-IN"
      ? `केवल ${unique[1]} समीकरण को सही बनाता है।`
      : `ਕੇਵਲ ${unique[1]} ਸਮੀਕਰਨ ਨੂੰ ਸਹੀ ਬਣਾਉਂਦਾ ਹੈ।`;
  }
  return translated;
}

export function localizeApprovedOpsQuestion(
  question: ApprovedOpsQuestion,
  locale: ApprovedOpsLocale,
): LocalizedApprovedOpsQuestion {
  const originalSteps = question.explanation.steps.map((step) => ({ ...step }));
  const patched: ApprovedOpsQuestion = {
    ...question,
    explanation: {
      ...question.explanation,
      steps: question.explanation.steps.map((step) => ({
        label: placeholderLabel(step.label),
        expression: placeholderText(step.expression),
        result: placeholderText(step.result),
      })),
    },
  };
  const localized = localizeBase(patched, locale);
  return {
    ...localized,
    explanation: {
      ...localized.explanation,
      steps: localized.explanation.steps.map((step, index) => {
        const original = originalSteps[index];
        const label = original.label === "Read the value" || original.label.endsWith(": Read the value")
          ? localizedValueLabel(original.label, locale)
          : step.label;
        return {
          ...step,
          label,
          expression: restoreText(original.expression, step.expression, locale),
          result: restoreText(original.result, step.result, locale),
        };
      }),
    },
  };
}
