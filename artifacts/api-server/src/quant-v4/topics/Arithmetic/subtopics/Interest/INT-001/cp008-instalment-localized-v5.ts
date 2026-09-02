import {
  generateIntCp008LocalizedReviewQuestion as generateV4,
  type IntCp008LocalizedLocale,
} from "./cp008-instalment-localized-v4";
import type { IntCp008QlId } from "./cp008-instalment-runtime-v1-final";

export const INT_CP008_LOCALIZED_VERSION = "INT-CP-008-HI-PA-v5-final-editorial-review" as const;
export const INT_CP008_LOCALIZED_V5_SUPERSEDES = "INT-CP-008-HI-PA-v4-final-language-review" as const;
export type { IntCp008LocalizedLocale };

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  return Object.freeze(value);
}

function polishText(text: string, locale: IntCp008LocalizedLocale): string {
  if (locale === "hi-IN") {
    return text
      .replace(
        /हर किस्त उस अवधि का ब्याज जुड़ने के बाद दी जाती है, इसलिए एक ही किस्त राशि को अवधि-अंत पुनर्भुगतान क्रम से पूरा बकाया समाप्त करना चाहिए।/gu,
        "हर किस्त उस अवधि का ब्याज जुड़ने के बाद दी जाती है। इसलिए ऐसी समान किस्त चाहिए जो तय अवधि-अंत भुगतान क्रम में पूरा बकाया शून्य कर दे।",
      )
      .replace(
        /बराबर अवधि-अंत नकदी प्रवाह से पीछे की ओर काम करके वह एकल शुरुआती राशि निकालें जिसे ये भुगतान ठीक-ठीक समाप्त करते हैं।/gu,
        "दिए गए बराबर अवधि-अंत भुगतान या निकासी से पीछे की ओर गणना करके वह शुरुआती राशि निकालें जिससे अंतिम बकाया ठीक शून्य हो जाए।",
      )
      .replace(
        /दिए गए क्रम में बकाया अपडेट करें: पहले ब्याज जोड़ें, फिर किस्त घटाएँ। जितने भुगतान पूछे गए हैं, वहीं रुकें।/gu,
        "हर अवधि में पहले ब्याज जोड़ें, फिर किस्त घटाएँ। जितने भुगतान पूछे गए हैं, उतने तक बकाया निकालते जाएँ।",
      )
      .replace(
        /दर अज्ञात है। वही आवधिक दर खोजें जिसके साथ सटीक पुनर्भुगतान पुनरावृत्ति अंतिम बकाया को शून्य करती है।/gu,
        "दर अज्ञात है। वही आवधिक दर खोजें जिस पर इस भुगतान क्रम के बाद अंतिम बकाया ठीक शून्य हो जाता है।",
      )
      .replace(/दोनों योजनाओं में शुरुआती राशि (₹[\d,]+(?:\.\d+)?) और अवधि संख्या (\d+) समान है; केवल आवधिक दर बदलती है।/gu,
        "दोनों योजनाओं में शुरुआती राशि $1 और अवधियों की संख्या $2 समान है; केवल आवधिक दर बदलती है।")
      .replace(/हर दर पूरे पुनर्भुगतान कार्यक्रम को बदलती है।/gu, "हर दर पूरे भुगतान क्रम को बदलती है।");
  }

  return text
    .replace(
      /ਹਰ ਕਿਸ਼ਤ ਉਸ ਮਿਆਦ ਦਾ ਵਿਆਜ ਜੁੜਨ ਤੋਂ ਬਾਅਦ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ, ਇਸ ਲਈ ਇੱਕੋ ਕਿਸ਼ਤ ਰਕਮ ਨੂੰ ਮਿਆਦ-ਅੰਤ ਵਾਪਸੀ ਕ੍ਰਮ ਨਾਲ ਪੂਰਾ ਬਕਾਇਆ ਖਤਮ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ।/gu,
      "ਹਰ ਕਿਸ਼ਤ ਉਸ ਮਿਆਦ ਦਾ ਵਿਆਜ ਜੁੜਨ ਤੋਂ ਬਾਅਦ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ। ਇਸ ਲਈ ਐਸੀ ਬਰਾਬਰ ਕਿਸ਼ਤ ਚਾਹੀਦੀ ਹੈ ਜੋ ਨਿਯਤ ਮਿਆਦ-ਅੰਤ ਅਦਾਇਗੀ ਕ੍ਰਮ ਵਿੱਚ ਪੂਰਾ ਬਕਾਇਆ ਸਿਫ਼ਰ ਕਰ ਦੇਵੇ।",
    )
    .replace(
      /ਬਰਾਬਰ ਮਿਆਦ-ਅੰਤ ਨਕਦੀ ਪ੍ਰਵਾਹ ਤੋਂ ਪਿੱਛੇ ਵੱਲ ਕੰਮ ਕਰਕੇ ਉਹ ਇਕੱਲੀ ਸ਼ੁਰੂਆਤੀ ਰਕਮ ਕੱਢੋ ਜਿਸ ਨੂੰ ਇਹ ਅਦਾਇਗੀਆਂ ਬਿਲਕੁਲ ਖਤਮ ਕਰਦੀਆਂ ਹਨ।/gu,
      "ਦਿੱਤੀਆਂ ਬਰਾਬਰ ਮਿਆਦ-ਅੰਤ ਅਦਾਇਗੀਆਂ ਜਾਂ ਨਿਕਾਸੀਆਂ ਤੋਂ ਪਿੱਛੇ ਵੱਲ ਗਣਨਾ ਕਰਕੇ ਉਹ ਸ਼ੁਰੂਆਤੀ ਰਕਮ ਕੱਢੋ ਜਿਸ ਨਾਲ ਆਖਰੀ ਬਕਾਇਆ ਬਿਲਕੁਲ ਸਿਫ਼ਰ ਹੋ ਜਾਵੇ।",
    )
    .replace(
      /ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ਬਕਾਇਆ ਅਪਡੇਟ ਕਰੋ: ਪਹਿਲਾਂ ਵਿਆਜ ਜੋੜੋ, ਫਿਰ ਕਿਸ਼ਤ ਘਟਾਓ। ਜਿੰਨੀਆਂ ਅਦਾਇਗੀਆਂ ਪੁੱਛੀਆਂ ਹਨ, ਉੱਥੇ ਹੀ ਰੁਕੋ।/gu,
      "ਹਰ ਮਿਆਦ ਵਿੱਚ ਪਹਿਲਾਂ ਵਿਆਜ ਜੋੜੋ, ਫਿਰ ਕਿਸ਼ਤ ਘਟਾਓ। ਜਿੰਨੀਆਂ ਅਦਾਇਗੀਆਂ ਪੁੱਛੀਆਂ ਹਨ, ਉਨ੍ਹਾਂ ਤੱਕ ਬਕਾਇਆ ਕੱਢਦੇ ਜਾਓ।",
    )
    .replace(
      /ਦਰ ਅਣਜਾਣ ਹੈ। ਉਹੀ ਮਿਆਦੀ ਦਰ ਲੱਭੋ ਜਿਸ ਨਾਲ ਸਹੀ ਵਾਪਸੀ ਪੁਨਰਾਵਰਤੀ ਆਖਰੀ ਬਕਾਇਆ ਨੂੰ ਸਿਫ਼ਰ ਕਰਦੀ ਹੈ।/gu,
      "ਦਰ ਅਣਜਾਣ ਹੈ। ਉਹੀ ਮਿਆਦੀ ਦਰ ਲੱਭੋ ਜਿਸ ਤੇ ਇਸ ਅਦਾਇਗੀ ਕ੍ਰਮ ਤੋਂ ਬਾਅਦ ਆਖਰੀ ਬਕਾਇਆ ਬਿਲਕੁਲ ਸਿਫ਼ਰ ਹੋ ਜਾਂਦਾ ਹੈ।",
    )
    .replace(/ਹਰ ਦਰ ਪੂਰੇ ਵਾਪਸੀ ਕਾਰਜਕ੍ਰਮ ਨੂੰ ਬਦਲਦੀ ਹੈ।/gu, "ਹਰ ਦਰ ਪੂਰੇ ਅਦਾਇਗੀ ਕ੍ਰਮ ਨੂੰ ਬਦਲਦੀ ਹੈ।");
}

function polishPrompt(source: any, locale: IntCp008LocalizedLocale): string {
  let prompt = polishText(source.presentation.prompt, locale);

  if (source.qlId === "INT-QL-118" && source.presentation.stemFamilyId === "INT-QL-118-T2" && locale === "pa-IN") {
    prompt = prompt.replace(/\b1 ਅਦਾਇਗੀਆਂ ਦੇ ਤੁਰੰਤ ਬਾਅਦ/gu, "1 ਅਦਾਇਗੀ ਦੇ ਤੁਰੰਤ ਬਾਅਦ");
  }

  if (source.qlId === "INT-QL-121" && source.presentation.stemFamilyId === "INT-QL-121-T6") {
    const c = source.mathematicalState.contractState as any;
    if (locale === "hi-IN") {
      prompt = prompt.replace(
        /^(₹[\d,]+(?:\.\d+)?) की बकाया राशि (\d+) अवधियों के लिए है। समान भुगतान (₹[\d,]+(?:\.\d+)?) है और हर अवधि के ब्याज के बाद दिया जाता है।/u,
        "$1 की बकाया राशि $2 अवधियों में चुकानी है। समान भुगतान $3 है और हर अवधि का ब्याज जुड़ने के बाद दिया जाता है।",
      );
    } else {
      prompt = prompt.replace(
        /^(₹[\d,]+(?:\.\d+)?) ਦੀ ਬਕਾਇਆ ਰਕਮ (\d+) ਮਿਆਦਾਂ ਲਈ ਹੈ। ਬਰਾਬਰ ਅਦਾਇਗੀ (₹[\d,]+(?:\.\d+)?) ਹੈ ਅਤੇ ਹਰ ਮਿਆਦ ਦੇ ਵਿਆਜ ਤੋਂ ਬਾਅਦ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ।/u,
        "$1 ਦੀ ਬਕਾਇਆ ਰਕਮ $2 ਮਿਆਦਾਂ ਵਿੱਚ ਚੁਕਾਉਣੀ ਹੈ। ਬਰਾਬਰ ਅਦਾਇਗੀ $3 ਹੈ ਅਤੇ ਹਰ ਮਿਆਦ ਦਾ ਵਿਆਜ ਜੁੜਨ ਤੋਂ ਬਾਅਦ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ।",
      );
    }
    void c;
  }

  if (source.qlId === "INT-QL-122" && source.presentation.stemFamilyId === "INT-QL-122-T4") {
    if (locale === "hi-IN") {
      prompt = prompt.replace(
        /^कोष शून्य से शुरू होता है, ([0-9.]+% प्रति (?:वर्ष|छमाही)) कमाता है और हर ([^ ]+) के अंत में (₹[\d,]+(?:\.\d+)?) जमा होता है।/u,
        "कोष शून्य से शुरू होता है। उस पर $1 ब्याज मिलता है और हर $2 के अंत में $3 जमा किया जाता है।",
      );
    } else {
      prompt = prompt.replace(
        /^ਫੰਡ ਸਿਫ਼ਰ ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ, ([0-9.]+% ਪ੍ਰਤੀ (?:ਸਾਲ|ਛਿਮਾਹੀ)) ਕਮਾਉਂਦਾ ਹੈ ਅਤੇ ਹਰ ([^ ]+) ਦੇ ਅੰਤ ਵਿੱਚ (₹[\d,]+(?:\.\d+)?) ਜਮ੍ਹਾਂ ਹੁੰਦਾ ਹੈ।/u,
        "ਫੰਡ ਸਿਫ਼ਰ ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ। ਇਸ ਤੇ $1 ਵਿਆਜ ਮਿਲਦਾ ਹੈ ਅਤੇ ਹਰ $2 ਦੇ ਅੰਤ ਵਿੱਚ $3 ਜਮ੍ਹਾਂ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।",
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
  const source = generateV4(qlId, seed, locale) as any;
  const prompt = polishPrompt(source, locale);
  const explanation = deepFreeze({
    ...source.explanation,
    keyIdea: polishText(source.explanation.keyIdea, locale),
    steps: Object.freeze(source.explanation.steps.map((step: string) => polishText(step, locale))),
    commonMistake: polishText(source.explanation.commonMistake, locale),
  });

  return deepFreeze({
    ...source,
    localizedVersion: INT_CP008_LOCALIZED_VERSION,
    presentation: deepFreeze({ ...source.presentation, prompt, markdown: prompt }),
    explanation,
    editorialStatus: "MULTILINGUAL_FINAL_EDITORIAL_REVIEW" as const,
    approvalStatus: "PENDING_MULTILINGUAL_PRODUCT_REVIEW" as const,
    allocationStatus: "INACTIVE_MULTILINGUAL_FINAL_EDITORIAL_REVIEW" as const,
    mathematicalFingerprint: `${source.mathematicalFingerprint}|${INT_CP008_LOCALIZED_VERSION}`,
  });
}
