import {
  INT_CP006_LOCALIZED_LOCALES,
  INT_CP006_LOCALIZATION_DECISION,
  generateIntCp006LocalizedQuestion as generateV2,
  type IntCp006LocalizedLocale,
} from "./cp006-si-ci-relations-localized-v2";
import type { IntCp006QlId } from "./cp006-si-ci-relations-runtime-v4-final";

export const INT_CP006_LOCALIZED_VERSION = "INT-CP-006-HI-PA-v3-review" as const;
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

function polishMarkdown(qlId: IntCp006QlId, locale: IntCp006LocalizedLocale, markdown: string): string {
  let polished = markdown;
  if (qlId === "INT-QL-102") polished = polished.replaceAll("SI−CI", "CI−SI");
  if (qlId === "INT-QL-106") {
    polished = locale === "hi-IN"
      ? polished.replaceAll("मूल मूलधन", "मूलधन")
      : polished.replaceAll("ਮੂਲ ਮੂਲਧਨ", "ਮੂਲਧਨ");
  }
  return polished;
}

export function generateIntCp006LocalizedQuestion(
  qlId: IntCp006QlId,
  seed: string,
  locale: IntCp006LocalizedLocale,
) {
  const question = generateV2(qlId, seed, locale);
  const markdown = polishMarkdown(qlId, locale, question.presentation.markdown);
  if (markdown === question.presentation.markdown) {
    return deepFreeze({
      ...question,
      localizedVersion: INT_CP006_LOCALIZED_VERSION,
      mathematicalFingerprint: `${question.mathematicalFingerprint}|CP006_HI_PA_V3`,
    });
  }
  return deepFreeze({
    ...question,
    presentation: deepFreeze({ ...question.presentation, markdown, prompt: markdown }),
    localizedVersion: INT_CP006_LOCALIZED_VERSION,
    mathematicalFingerprint: `${question.mathematicalFingerprint}|CP006_HI_PA_V3`,
  });
}
