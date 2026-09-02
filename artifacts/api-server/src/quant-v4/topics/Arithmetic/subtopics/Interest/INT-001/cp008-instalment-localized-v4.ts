import {
  generateIntCp008LocalizedReviewQuestion as generateV3,
  type IntCp008LocalizedLocale,
} from "./cp008-instalment-localized-v3";
import type { IntCp008QlId } from "./cp008-instalment-runtime-v1-final";

export const INT_CP008_LOCALIZED_VERSION = "INT-CP-008-HI-PA-v4-final-language-review" as const;
export const INT_CP008_LOCALIZED_V4_SUPERSEDES = "INT-CP-008-HI-PA-v3-editorial-review" as const;
export type { IntCp008LocalizedLocale };

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  return Object.freeze(value);
}

function repairQl119Singular(text: string, locale: IntCp008LocalizedLocale): string {
  if (locale === "hi-IN") {
    return text
      .replace(/पहले 1 अवधि-अंत भुगतान (₹[\d,]+(?:\.\d+)?) के हैं/gu, "पहला अवधि-अंत भुगतान $1 का है")
      .replace(/पहले 1 भुगतान (₹[\d,]+(?:\.\d+)?) के हैं/gu, "पहला भुगतान $1 का है")
      .replace(/पहले 1 भुगतान (₹[\d,]+(?:\.\d+)?) के तय हैं/gu, "पहला भुगतान $1 तय है")
      .replace(/पहले 1 भुगतान (₹[\d,]+(?:\.\d+)?)(?=[;,।])/gu, "पहला भुगतान $1")
      .replace(/(₹[\d,]+(?:\.\d+)?) की 1 नियमित किस्तों के बाद/gu, "$1 की 1 नियमित किस्त के बाद")
      .replace(/(₹[\d,]+(?:\.\d+)?) की 1 तय किस्तों के बाद/gu, "$1 की 1 तय किस्त के बाद");
  }
  return text
    .replace(/ਪਹਿਲੀਆਂ 1 ਮਿਆਦ-ਅੰਤ ਅਦਾਇਗੀਆਂ (₹[\d,]+(?:\.\d+)?) ਦੀਆਂ ਹਨ/gu, "ਪਹਿਲੀ ਮਿਆਦ-ਅੰਤ ਅਦਾਇਗੀ $1 ਦੀ ਹੈ")
    .replace(/ਪਹਿਲੀਆਂ 1 ਅਦਾਇਗੀਆਂ (₹[\d,]+(?:\.\d+)?) ਦੀਆਂ ਹਨ/gu, "ਪਹਿਲੀ ਅਦਾਇਗੀ $1 ਦੀ ਹੈ")
    .replace(/ਪਹਿਲੀਆਂ 1 ਅਦਾਇਗੀਆਂ (₹[\d,]+(?:\.\d+)?) ਦੀਆਂ ਨਿਯਤ ਹਨ/gu, "ਪਹਿਲੀ ਅਦਾਇਗੀ $1 ਨਿਯਤ ਹੈ")
    .replace(/ਪਹਿਲੀਆਂ 1 ਅਦਾਇਗੀਆਂ (₹[\d,]+(?:\.\d+)?)(?=[;,।])/gu, "ਪਹਿਲੀ ਅਦਾਇਗੀ $1")
    .replace(/(₹[\d,]+(?:\.\d+)?) ਦੀਆਂ 1 ਨਿਯਮਿਤ ਕਿਸ਼ਤਾਂ ਤੋਂ ਬਾਅਦ/gu, "$1 ਦੀ 1 ਨਿਯਮਿਤ ਕਿਸ਼ਤ ਤੋਂ ਬਾਅਦ")
    .replace(/(₹[\d,]+(?:\.\d+)?) ਦੀਆਂ 1 ਅਦਾਇਗੀਆਂ ਤੋਂ ਬਾਅਦ/gu, "$1 ਦੀ 1 ਅਦਾਇਗੀ ਤੋਂ ਬਾਅਦ")
    .replace(/(₹[\d,]+(?:\.\d+)?) ਦੀਆਂ 1 ਨਿਯਤ ਕਿਸ਼ਤਾਂ ਤੋਂ ਬਾਅਦ/gu, "$1 ਦੀ 1 ਨਿਯਤ ਕਿਸ਼ਤ ਤੋਂ ਬਾਅਦ");
}

export function generateIntCp008LocalizedReviewQuestion(
  qlId: IntCp008QlId,
  seed: string,
  locale: IntCp008LocalizedLocale,
) {
  const source = generateV3(qlId, seed, locale) as any;
  if (qlId !== "INT-QL-119" || source.mathematicalState.contractState.periods - 1 !== 1) {
    return deepFreeze({
      ...source,
      localizedVersion: INT_CP008_LOCALIZED_VERSION,
      editorialStatus: "MULTILINGUAL_FINAL_LANGUAGE_REVIEW" as const,
      approvalStatus: "PENDING_MULTILINGUAL_PRODUCT_REVIEW" as const,
      allocationStatus: "INACTIVE_MULTILINGUAL_FINAL_LANGUAGE_REVIEW" as const,
      mathematicalFingerprint: `${source.mathematicalFingerprint}|${INT_CP008_LOCALIZED_VERSION}`,
    });
  }

  const prompt = repairQl119Singular(source.presentation.prompt, locale);
  const explanation = deepFreeze({
    ...source.explanation,
    keyIdea: repairQl119Singular(source.explanation.keyIdea, locale),
    steps: Object.freeze(source.explanation.steps.map((step: string) => repairQl119Singular(step, locale))),
    commonMistake: repairQl119Singular(source.explanation.commonMistake, locale),
  });

  return deepFreeze({
    ...source,
    localizedVersion: INT_CP008_LOCALIZED_VERSION,
    presentation: deepFreeze({ ...source.presentation, prompt, markdown: prompt }),
    explanation,
    editorialStatus: "MULTILINGUAL_FINAL_LANGUAGE_REVIEW" as const,
    approvalStatus: "PENDING_MULTILINGUAL_PRODUCT_REVIEW" as const,
    allocationStatus: "INACTIVE_MULTILINGUAL_FINAL_LANGUAGE_REVIEW" as const,
    mathematicalFingerprint: `${source.mathematicalFingerprint}|${INT_CP008_LOCALIZED_VERSION}`,
  });
}
