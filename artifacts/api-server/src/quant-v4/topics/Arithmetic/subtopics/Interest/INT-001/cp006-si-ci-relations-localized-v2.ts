import {
  INT_CP006_LOCALIZED_LOCALES,
  INT_CP006_LOCALIZATION_DECISION,
  generateIntCp006LocalizedQuestion as generateV1,
  type IntCp006LocalizedLocale,
} from "./cp006-si-ci-relations-localized-v1";
import type { IntCp006QlId } from "./cp006-si-ci-relations-runtime-v4-final";

export const INT_CP006_LOCALIZED_VERSION = "INT-CP-006-HI-PA-v2-review" as const;
export { INT_CP006_LOCALIZED_LOCALES, INT_CP006_LOCALIZATION_DECISION };
export type { IntCp006LocalizedLocale };

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) {
    deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  }
  return Object.freeze(value);
}

function localizedSolutionSteps(
  qlId: IntCp006QlId,
  locale: IntCp006LocalizedLocale,
  steps: readonly string[],
): readonly string[] {
  const hi = locale === "hi-IN";
  if (qlId === "INT-QL-098") {
    return Object.freeze([
      hi ? `मूलधन के लिए ${steps[0]}` : `ਮੂਲਧਨ ਲਈ ${steps[0]}`,
      ...steps.slice(1),
    ]);
  }
  if (qlId === "INT-QL-100") {
    return Object.freeze([
      hi ? `पहले अंतर निकालें: ${steps[0]}` : `ਪਹਿਲਾਂ ਅੰਤਰ ਕੱਢੋ: ${steps[0]}`,
      ...(steps.length > 1
        ? [hi ? `फिर दर निकालें: ${steps[1]}` : `ਫਿਰ ਦਰ ਕੱਢੋ: ${steps[1]}`]
        : []),
      ...steps.slice(2),
    ]);
  }
  if (qlId === "INT-QL-105") {
    return Object.freeze([
      hi ? `लगातार वर्षों के ब्याज का अनुपात लें: ${steps[0]}` : `ਲਗਾਤਾਰ ਸਾਲਾਂ ਦੇ ਵਿਆਜ ਦਾ ਅਨੁਪਾਤ ਲਓ: ${steps[0]}`,
      ...steps.slice(1),
    ]);
  }
  return steps;
}

export function generateIntCp006LocalizedQuestion(
  qlId: IntCp006QlId,
  seed: string,
  locale: IntCp006LocalizedLocale,
) {
  const question = generateV1(qlId, seed, locale);
  const steps = localizedSolutionSteps(qlId, locale, question.explanation.steps);
  if (steps === question.explanation.steps) {
    return deepFreeze({
      ...question,
      localizedVersion: INT_CP006_LOCALIZED_VERSION,
      mathematicalFingerprint: `${question.mathematicalFingerprint}|CP006_HI_PA_V2`,
    });
  }
  return deepFreeze({
    ...question,
    explanation: deepFreeze({ ...question.explanation, steps }),
    localizedVersion: INT_CP006_LOCALIZED_VERSION,
    mathematicalFingerprint: `${question.mathematicalFingerprint}|CP006_HI_PA_V2`,
  });
}
