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

function localizedValueLabel(label: string, locale: ApprovedOpsLocale): string {
  const base = locale === "hi-IN" ? "मान पढ़ें" : "ਮੁੱਲ ਪੜ੍ਹੋ";
  if (label === "Read the value") return base;
  if (label.startsWith("Left side:")) return locale === "hi-IN" ? `बायाँ पक्ष: ${base}` : `ਖੱਬਾ ਪਾਸਾ: ${base}`;
  if (label.startsWith("Right side:")) return locale === "hi-IN" ? `दायाँ पक्ष: ${base}` : `ਸੱਜਾ ਪਾਸਾ: ${base}`;
  return base;
}

export function localizeApprovedOpsQuestion(
  question: ApprovedOpsQuestion,
  locale: ApprovedOpsLocale,
): LocalizedApprovedOpsQuestion {
  const originalLabels = question.explanation.steps.map((step) => step.label);
  const patched: ApprovedOpsQuestion = {
    ...question,
    explanation: {
      ...question.explanation,
      steps: question.explanation.steps.map((step) => ({
        ...step,
        label: placeholderLabel(step.label),
      })),
    },
  };
  const localized = localizeBase(patched, locale);
  return {
    ...localized,
    explanation: {
      ...localized.explanation,
      steps: localized.explanation.steps.map((step, index) => {
        const original = originalLabels[index];
        return original === "Read the value" || original.endsWith(": Read the value")
          ? { ...step, label: localizedValueLabel(original, locale) }
          : step;
      }),
    },
  };
}
