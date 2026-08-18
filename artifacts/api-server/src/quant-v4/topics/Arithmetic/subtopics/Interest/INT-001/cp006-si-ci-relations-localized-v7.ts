import { type IntCp006QlId } from "./cp006-si-ci-relations-runtime-v4-final";
import {
  generateIntCp006LocalizedExplanationReviewQuestion as generateV6,
  type IntCp006LocalizedLocale,
} from "./cp006-si-ci-relations-localized-v6";

export const INT_CP006_LOCALIZED_EXPLANATION_VERSION = "INT-CP-006-HI-PA-v7-punjabi-terminology-review" as const;
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

function standardizePunjabiCompoundInterest(text: string): string {
  return text
    .replaceAll("ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਦਰ", "ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਦੀ ਦਰ")
    .replaceAll("ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਦੀ ਸਾਲਾਨਾ ਦਰ", "ਮਿਸ਼ਰਤ ਵਿਆਜ ਦੀ ਸਾਲਾਨਾ ਦਰ")
    .replaceAll("ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਦਰ", "ਮਿਸ਼ਰਤ ਵਿਆਜ ਦੀ ਦਰ")
    .replaceAll("ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਦਰ", "ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਦੀ ਦਰ")
    .replaceAll("ਚੱਕਰਵੱਧੀ ਦਰ", "ਮਿਸ਼ਰਤ ਵਿਆਜ ਦੀ ਦਰ")
    .replaceAll("ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਵਿਆਜ", "ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ")
    .replaceAll("ਚੱਕਰਵੱਧੀ ਵਿਆਜ", "ਮਿਸ਼ਰਤ ਵਿਆਜ")
    .replaceAll("ਸਾਲਾਨਾ ਚੱਕਰਵੱਧੀ ਵਿੱਚ", "ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਦੀ ਗਿਣਤੀ ਵਿੱਚ")
    .replaceAll("ਵਾਧੂ ਚੱਕਰਵੱਧੀ ਹਿੱਸਾ", "ਮਿਸ਼ਰਤ ਵਿਆਜ ਨਾਲ ਜੁੜਨ ਵਾਲਾ ਵਾਧੂ ਹਿੱਸਾ")
    .replaceAll("ਚੱਕਰਵੱਧੀ ਹਿੱਸਾ", "ਮਿਸ਼ਰਤ ਵਿਆਜ ਨਾਲ ਜੁੜਨ ਵਾਲਾ ਹਿੱਸਾ")
    .replaceAll("ਚੱਕਰਵੱਧੀ ਕਾਰਨ", "ਮਿਸ਼ਰਤ ਵਿਆਜ ਕਾਰਨ")
    .replaceAll("ਚੱਕਰਵੱਧੀ 'ਤੇ", "ਮਿਸ਼ਰਤ ਵਿਆਜ 'ਤੇ")
    .replaceAll("ਚੱਕਰਵੱਧੀ ਉੱਤੇ", "ਮਿਸ਼ਰਤ ਵਿਆਜ ਉੱਤੇ")
    .replaceAll("ਚੱਕਰਵੱਧੀ", "ਮਿਸ਼ਰਤ ਵਿਆਜ");
}

function transformPunjabiLearnerValue<T>(value: T): T {
  if (typeof value === "string") return standardizePunjabiCompoundInterest(value) as T;
  if (Array.isArray(value)) return value.map((item) => transformPunjabiLearnerValue(item)) as T;
  if (typeof value === "object" && value !== null) {
    const result: Record<PropertyKey, unknown> = {};
    for (const key of Reflect.ownKeys(value as object)) {
      result[key] = transformPunjabiLearnerValue((value as Record<PropertyKey, unknown>)[key]);
    }
    return result as T;
  }
  return value;
}

export function generateIntCp006LocalizedExplanationReviewQuestion(
  qlId: IntCp006QlId,
  seed: string,
  locale: IntCp006LocalizedLocale,
) {
  const source = generateV6(qlId, seed, locale);
  if (locale === "hi-IN") {
    return deepFreeze({
      ...source,
      localizedVersion: INT_CP006_LOCALIZED_EXPLANATION_VERSION,
      editorialStatus: "LOCALIZED_PUNJABI_TERMINOLOGY_REVIEW" as const,
      approvalStatus: "PENDING_LOCALIZED_TERMINOLOGY_PRODUCT_REVIEW" as const,
      allocationStatus: "INACTIVE_LOCALIZED_TERMINOLOGY_REVIEW" as const,
      mathematicalFingerprint: `${source.mathematicalFingerprint}|${INT_CP006_LOCALIZED_EXPLANATION_VERSION}`,
    });
  }

  return deepFreeze({
    ...source,
    presentation: transformPunjabiLearnerValue(source.presentation),
    explanation: transformPunjabiLearnerValue(source.explanation),
    localizedVersion: INT_CP006_LOCALIZED_EXPLANATION_VERSION,
    editorialStatus: "LOCALIZED_PUNJABI_TERMINOLOGY_REVIEW" as const,
    approvalStatus: "PENDING_LOCALIZED_TERMINOLOGY_PRODUCT_REVIEW" as const,
    allocationStatus: "INACTIVE_LOCALIZED_TERMINOLOGY_REVIEW" as const,
    mathematicalFingerprint: `${source.mathematicalFingerprint}|${INT_CP006_LOCALIZED_EXPLANATION_VERSION}`,
  });
}

export function containsDeprecatedPunjabiCompoundInterestTerm(text: string): boolean {
  return text.includes("ਚੱਕਰਵੱਧੀ");
}
