import {
  generateIntCp008LocalizedReviewQuestion as generateV5,
  type IntCp008LocalizedLocale,
} from "./cp008-instalment-localized-v5";
import type { IntCp008QlId } from "./cp008-instalment-runtime-v1-final";

export const INT_CP008_LOCALIZED_VERSION = "INT-CP-008-HI-PA-v6-final-language-review" as const;
export const INT_CP008_LOCALIZED_V6_SUPERSEDES = "INT-CP-008-HI-PA-v5-final-editorial-review" as const;
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
    return text.replace(
      /कार्यक्रम में (\d+) बराबर भुगतान या निकासी (₹[\d,]+(?:\.\d+)?) की हैं और शुरुआती बकाया पूछा गया है।/gu,
      "भुगतान क्रम में कुल $1 बराबर भुगतान या निकासी हैं और हर राशि $2 है। शुरुआती बकाया पूछा गया है।",
    );
  }
  return text
    .replace(
      /ਕਾਰਜਕ੍ਰਮ ਵਿੱਚ (\d+) ਬਰਾਬਰ ਅਦਾਇਗੀਆਂ ਜਾਂ ਨਿਕਾਸੀਆਂ (₹[\d,]+(?:\.\d+)?) ਦੀਆਂ ਹਨ ਅਤੇ ਸ਼ੁਰੂਆਤੀ ਬਕਾਇਆ ਪੁੱਛਿਆ ਗਿਆ ਹੈ।/gu,
      "ਅਦਾਇਗੀ ਕ੍ਰਮ ਵਿੱਚ ਕੁੱਲ $1 ਬਰਾਬਰ ਅਦਾਇਗੀਆਂ ਜਾਂ ਨਿਕਾਸੀਆਂ ਹਨ ਅਤੇ ਹਰ ਰਕਮ $2 ਹੈ। ਸ਼ੁਰੂਆਤੀ ਬਕਾਇਆ ਪੁੱਛਿਆ ਗਿਆ ਹੈ।",
    )
    .replace(/1 ਅਦਾਇਗੀਆਂ/gu, "1 ਅਦਾਇਗੀ");
}

function polishPrompt(source: any, locale: IntCp008LocalizedLocale): string {
  let prompt = source.presentation.prompt as string;
  if (source.qlId === "INT-QL-118") {
    if (locale === "hi-IN") {
      prompt = prompt
        .replace(/भुगतान संख्या 1 के बाद/gu, "पहले भुगतान के बाद")
        .replace(/भुगतान संख्या 2 के बाद/gu, "दूसरे भुगतान के बाद");
    } else {
      prompt = prompt
        .replace(/ਅਦਾਇਗੀ ਨੰਬਰ 1 ਤੋਂ ਬਾਅਦ/gu, "ਪਹਿਲੀ ਅਦਾਇਗੀ ਤੋਂ ਬਾਅਦ")
        .replace(/ਅਦਾਇਗੀ ਨੰਬਰ 2 ਤੋਂ ਬਾਅਦ/gu, "ਦੂਜੀ ਅਦਾਇਗੀ ਤੋਂ ਬਾਅਦ");
    }
  }
  return polishText(prompt, locale);
}

function polishExplanation(source: any, locale: IntCp008LocalizedLocale) {
  const c = source.mathematicalState.contractState as any;
  const steps = source.explanation.steps.map((step: string) => polishText(step, locale));

  if (source.qlId === "INT-QL-119" && c.periods - 1 === 1) {
    steps[1] = locale === "hi-IN"
      ? steps[1].replace(/इन नियमित भुगतानों के लिए/gu, "इस नियमित भुगतान के लिए")
      : steps[1].replace(/ਇਨ੍ਹਾਂ ਨਿਯਮਿਤ ਅਦਾਇਗੀਆਂ ਲਈ/gu, "ਇਸ ਨਿਯਮਿਤ ਅਦਾਇਗੀ ਲਈ");
  }

  if (source.qlId === "INT-QL-123") {
    const growthPeriods = c.periods - c.missedPaymentNumber;
    if (locale === "hi-IN") {
      if (growthPeriods > 1) {
        steps[1] = steps[1].replace(new RegExp(`${growthPeriods} पूरी ब्याज अवधि है`, "gu"), `${growthPeriods} पूरी ब्याज अवधियाँ हैं`);
      }
    } else if (growthPeriods > 1) {
      steps[1] = steps[1].replace(new RegExp(`${growthPeriods} ਪੂਰੀ ਵਿਆਜ ਮਿਆਦ ਹੈ`, "gu"), `${growthPeriods} ਪੂਰੀਆਂ ਵਿਆਜ ਮਿਆਦਾਂ ਹਨ`);
    }
  }

  return deepFreeze({
    ...source.explanation,
    keyIdea: polishText(source.explanation.keyIdea, locale),
    steps: Object.freeze(steps),
    commonMistake: polishText(source.explanation.commonMistake, locale),
  });
}

export function generateIntCp008LocalizedReviewQuestion(
  qlId: IntCp008QlId,
  seed: string,
  locale: IntCp008LocalizedLocale,
) {
  const source = generateV5(qlId, seed, locale) as any;
  const prompt = polishPrompt(source, locale);
  const explanation = polishExplanation(source, locale);

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
