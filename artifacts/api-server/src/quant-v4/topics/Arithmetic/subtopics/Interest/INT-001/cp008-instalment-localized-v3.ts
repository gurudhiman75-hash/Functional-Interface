import {
  generateIntCp008LocalizedReviewQuestion as generateV2,
  type IntCp008LocalizedLocale,
} from "./cp008-instalment-localized-v2";
import type { IntCp008QlId } from "./cp008-instalment-runtime-v1-final";

export const INT_CP008_LOCALIZED_VERSION = "INT-CP-008-HI-PA-v3-editorial-review" as const;
export const INT_CP008_LOCALIZED_V3_SUPERSEDES = "INT-CP-008-HI-PA-v2-math-parity-review" as const;
export type { IntCp008LocalizedLocale };

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  return Object.freeze(value);
}

function repairCommonProse(text: string, locale: IntCp008LocalizedLocale): string {
  let next = text
    .replace(/(₹[\d,]+(?:\.\d+)?),\s+(?=(?:होता|होती|होते|ਹੁੰਦਾ|ਹੁੰਦੀ|ਹੁੰਦੇ))/gu, "$1 ");

  if (locale === "hi-IN") {
    next = next
      .replace(/मौद्रिक उत्तर निकटतम पैसे तक दें।/gu, "उत्तर निकटतम पैसे तक दें।")
      .replace(/पहले 1 अवधि-अंत भुगतान (₹[\d,]+(?:\.\d+)?) के हैं/gu, "पहला अवधि-अंत भुगतान $1 का है")
      .replace(/पहले 1 भुगतान (₹[\d,]+(?:\.\d+)?) के तय हैं/gu, "पहला भुगतान $1 तय है")
      .replace(/\$B_k=B_\{k-1\}\(1\+r\)-X\$ के अनुसार बदलता है/gu, "$B_k=B_{k-1}(1+r)-X$ से बदलता है")
      .replace(/अंतिम पैसे तक गोल करने से पहले/gu, "निकटतम पैसे तक गोल करने से पहले")
      .replace(/कार्यक्रम इस प्रकार बनता है/gu, "भुगतान क्रम इस प्रकार बनता है")
      .replace(/इस कार्यक्रम से मेल खाने वाली/gu, "इस भुगतान क्रम से मेल खाने वाली")
      .replace(/एक कोष (\d+(?:\.\d+)?% प्रति (?:वर्ष|छमाही)) कमाता है/gu, "एक कोष पर $1 ब्याज मिलता है")
      .replace(/कोष (\d+(?:\.\d+)?% प्रति (?:वर्ष|छमाही)) कमाता है/gu, "कोष पर $1 ब्याज मिलता है")
      .replace(/बकाया राशि पर (\d+(?:\.\d+)?% प्रति (?:वर्ष|छमाही)) लगता है/gu, "बकाया राशि पर $1 ब्याज लगता है");
  } else {
    next = next
      .replace(/ਰਕਮ ਵਾਲਾ ਉੱਤਰ ਸਭ ਤੋਂ ਨੇੜਲੇ ਪੈਸੇ ਤੱਕ ਦਿਓ।/gu, "ਉੱਤਰ ਸਭ ਤੋਂ ਨੇੜਲੇ ਪੈਸੇ ਤੱਕ ਦਿਓ।")
      .replace(/ਪਹਿਲੀਆਂ 1 ਮਿਆਦ-ਅੰਤ ਅਦਾਇਗੀਆਂ (₹[\d,]+(?:\.\d+)?) ਦੀਆਂ ਹਨ/gu, "ਪਹਿਲੀ ਮਿਆਦ-ਅੰਤ ਅਦਾਇਗੀ $1 ਦੀ ਹੈ")
      .replace(/ਪਹਿਲੀਆਂ 1 ਅਦਾਇਗੀਆਂ (₹[\d,]+(?:\.\d+)?) ਦੀਆਂ ਨਿਯਤ ਹਨ/gu, "ਪਹਿਲੀ ਅਦਾਇਗੀ $1 ਨਿਯਤ ਹੈ")
      .replace(/\$B_k=B_\{k-1\}\(1\+r\)-X\$ ਅਨੁਸਾਰ ਬਦਲਦਾ ਹੈ/gu, "$B_k=B_{k-1}(1+r)-X$ ਨਾਲ ਬਦਲਦਾ ਹੈ")
      .replace(/ਆਖਰੀ ਪੈਸੇ ਤੱਕ ਗੋਲ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ/gu, "ਸਭ ਤੋਂ ਨੇੜਲੇ ਪੈਸੇ ਤੱਕ ਗੋਲ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ")
      .replace(/ਕਾਰਜਕ੍ਰਮ ਇਸ ਤਰ੍ਹਾਂ ਬਣਦਾ ਹੈ/gu, "ਅਦਾਇਗੀ ਕ੍ਰਮ ਇਸ ਤਰ੍ਹਾਂ ਬਣਦਾ ਹੈ")
      .replace(/ਇਸ ਕਾਰਜਕ੍ਰਮ ਨਾਲ ਮਿਲਦੀ/gu, "ਇਸ ਅਦਾਇਗੀ ਕ੍ਰਮ ਨਾਲ ਮਿਲਦੀ")
      .replace(/ਇੱਕ ਫੰਡ (\d+(?:\.\d+)?% ਪ੍ਰਤੀ (?:ਸਾਲ|ਛਿਮਾਹੀ)) ਕਮਾਉਂਦਾ ਹੈ/gu, "ਇੱਕ ਫੰਡ ਤੇ $1 ਵਿਆਜ ਮਿਲਦਾ ਹੈ")
      .replace(/ਫੰਡ (\d+(?:\.\d+)?% ਪ੍ਰਤੀ (?:ਸਾਲ|ਛਿਮਾਹੀ)) ਕਮਾਉਂਦਾ ਹੈ/gu, "ਫੰਡ ਤੇ $1 ਵਿਆਜ ਮਿਲਦਾ ਹੈ")
      .replace(/ਬਕਾਇਆ ਰਕਮ ਤੇ (\d+(?:\.\d+)?% ਪ੍ਰਤੀ (?:ਸਾਲ|ਛਿਮਾਹੀ)) ਲੱਗਦਾ ਹੈ/gu, "ਬਕਾਇਆ ਰਕਮ ਤੇ $1 ਵਿਆਜ ਲੱਗਦਾ ਹੈ");
  }
  return next;
}

function repairPrompt(source: any, locale: IntCp008LocalizedLocale): string {
  let prompt = repairCommonProse(source.presentation.prompt, locale);

  if (source.qlId === "INT-QL-123" && source.presentation.stemFamilyId === "INT-QL-123-T6") {
    if (locale === "hi-IN") {
      prompt = prompt.replace(
        /^उधारकर्ता (₹[\d,]+(?:\.\d+)?) की भुगतान संख्या (\d+) को (\d+)-भुगतान योजना में छोड़ देता है।/u,
        "$3-भुगतान योजना में भुगतान संख्या $2, जिसकी राशि $1 है, नहीं किया गया।",
      );
    } else {
      prompt = prompt.replace(
        /^ਕਰਜ਼ਦਾਰ (₹[\d,]+(?:\.\d+)?) ਦੀ ਅਦਾਇਗੀ ਨੰਬਰ (\d+) ਨੂੰ (\d+)-ਅਦਾਇਗੀ ਯੋਜਨਾ ਵਿੱਚ ਛੱਡ ਦਿੰਦਾ ਹੈ।/u,
        "$3-ਅਦਾਇਗੀ ਯੋਜਨਾ ਵਿੱਚ ਅਦਾਇਗੀ ਨੰਬਰ $2, ਜਿਸ ਦੀ ਰਕਮ $1 ਹੈ, ਨਹੀਂ ਕੀਤੀ ਗਈ।",
      );
    }
  }

  if (source.qlId === "INT-QL-124" && source.presentation.stemFamilyId === "INT-QL-124-T4") {
    if (locale === "hi-IN") {
      prompt = prompt.replace(
        /^(₹[\d,]+(?:\.\d+)?) के शुरुआती ऋण के लिए, (\d+) अवधि-अंत भुगतान दोनों स्थितियों में समान रहते हैं।/u,
        "$1 के शुरुआती ऋण के लिए दोनों योजनाओं में भुगतान की संख्या $2 और भुगतान का समय समान है।",
      );
    } else {
      prompt = prompt.replace(
        /^(₹[\d,]+(?:\.\d+)?) ਦੇ ਸ਼ੁਰੂਆਤੀ ਕਰਜ਼ੇ ਲਈ, (\d+) ਮਿਆਦ-ਅੰਤ ਅਦਾਇਗੀਆਂ ਦੋਵਾਂ ਹਾਲਤਾਂ ਵਿੱਚ ਇੱਕੋ ਹਨ।/u,
        "$1 ਦੇ ਸ਼ੁਰੂਆਤੀ ਕਰਜ਼ੇ ਲਈ ਦੋਵਾਂ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਅਦਾਇਗੀਆਂ ਦੀ ਗਿਣਤੀ $2 ਅਤੇ ਅਦਾਇਗੀ ਦਾ ਸਮਾਂ ਇੱਕੋ ਹੈ।",
      );
    }
  }

  if (source.qlId === "INT-QL-124" && source.presentation.stemFamilyId === "INT-QL-124-T6") {
    if (locale === "hi-IN") {
      prompt = prompt.replace(
        /^दो वित्त योजनाएँ समान (₹[\d,]+(?:\.\d+)?) की बकाया राशि को ([^।]+) के लिए कवर करती हैं।/u,
        "$1 की समान बकाया राशि के लिए $2 की दो पुनर्भुगतान योजनाएँ हैं।",
      );
    } else {
      prompt = prompt.replace(
        /^ਦੋ ਵਿੱਤੀ ਯੋਜਨਾਵਾਂ ਇੱਕੋ (₹[\d,]+(?:\.\d+)?) ਦੀ ਬਕਾਇਆ ਰਕਮ ਨੂੰ ([^।]+) ਲਈ ਕਵਰ ਕਰਦੀਆਂ ਹਨ।/u,
        "$1 ਦੀ ਇੱਕੋ ਬਕਾਇਆ ਰਕਮ ਲਈ $2 ਦੀਆਂ ਦੋ ਵਾਪਸੀ ਯੋਜਨਾਵਾਂ ਹਨ।",
      );
    }
  }

  return prompt;
}

export function generateIntCp008LocalizedReviewQuestion(
  qlId: IntCp008QlId,
  seed: string,
  locale: IntCp008LocalizedLocale,
) {
  const source = generateV2(qlId, seed, locale) as any;
  const prompt = repairPrompt(source, locale);
  const explanation = deepFreeze({
    ...source.explanation,
    keyIdea: repairCommonProse(source.explanation.keyIdea, locale),
    steps: Object.freeze(source.explanation.steps.map((step: string) => repairCommonProse(step, locale))),
    commonMistake: repairCommonProse(source.explanation.commonMistake, locale),
  });

  return deepFreeze({
    ...source,
    localizedVersion: INT_CP008_LOCALIZED_VERSION,
    presentation: deepFreeze({ ...source.presentation, prompt, markdown: prompt }),
    explanation,
    editorialStatus: "MULTILINGUAL_EDITORIAL_REVIEW" as const,
    approvalStatus: "PENDING_MULTILINGUAL_PRODUCT_REVIEW" as const,
    allocationStatus: "INACTIVE_MULTILINGUAL_REVIEW" as const,
    mathematicalFingerprint: `${source.mathematicalFingerprint}|${INT_CP008_LOCALIZED_VERSION}`,
  });
}
