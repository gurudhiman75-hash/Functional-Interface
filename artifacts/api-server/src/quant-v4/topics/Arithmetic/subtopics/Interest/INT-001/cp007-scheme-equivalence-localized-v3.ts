import { generateIntCp007EnglishFrozenQuestion } from "./cp007-scheme-equivalence-english-v8-frozen";
import {
  generateIntCp007LocalizedReviewQuestion as generateV2,
  type IntCp007LocalizedLocale,
} from "./cp007-scheme-equivalence-localized-v2";
import type { IntCp007QlId } from "./cp007-scheme-equivalence-runtime-v3-final";

export const INT_CP007_LOCALIZED_VERSION = "INT-CP-007-HI-PA-v3-exam-editorial-review" as const;
export const INT_CP007_LOCALIZED_V3_SUPERSEDES = "INT-CP-007-HI-PA-v2-native-review" as const;
export type { IntCp007LocalizedLocale };

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  return Object.freeze(value);
}

function mathSegments(text: string): readonly string[] {
  return Object.freeze(text.match(/\$[^$]+\$/gu) ?? []);
}

function polishText(text: string, locale: IntCp007LocalizedLocale): string {
  if (locale === "hi-IN") {
    return text
      .replace(/([0-9.]+% वार्षिक साधारण ब्याज), (\d+) वर्ष के लिए/gu, "$2 वर्ष के लिए $1")
      .replace(/([0-9.]+% वार्षिक चक्रवृद्धि ब्याज \(ब्याज हर वर्ष मूलधन में जुड़ता है\)), (\d+) वर्ष के लिए/gu, "$2 वर्ष के लिए $1")
      .replace(/(\d+ वर्ष के लिए चक्रवृद्धि ब्याज), जिसमें ब्याज हर वर्ष मूलधन में जुड़ता है लागू है/gu, "$1 लागू है, जिसमें ब्याज हर वर्ष मूलधन में जुड़ता है")
      .replace(/वार्षिक साधारण ब्याज के अनुसार बढ़ता है/gu, "वार्षिक साधारण ब्याज पर बढ़ता है")
      .replace(/दो प्रारंभिक मूलधन/gu, "दो राशियाँ")
      .replace(/समान दिखने वाली दरों पर भी/gu, "एक जैसी वार्षिक दर होने पर भी")
      .replace(/भविष्य राशि/gu, "परिपक्वता राशि")
      .replace(/पहला आगे निकलने वाला वर्ष साबित करने के लिए लगातार दो पूरे वर्षों की जाँच करें: पिछले वर्ष B आगे नहीं हो और चुने वर्ष में B आगे हो।/gu,
        "पहली बार आगे निकलने का वर्ष तय करने के लिए लगातार दो पूरे वर्षों की जाँच करें: पिछले वर्ष B आगे न हो और चुने गए वर्ष में B आगे हो जाए।")
      .replace(/पहले आगे निकलने का वर्ष सिद्ध करने के लिए ठीक पिछले पूरे वर्ष की भी जाँच करें/gu,
        "पहली बार आगे निकलने का वर्ष तय करने के लिए ठीक पिछले पूरे वर्ष की भी जाँच करें");
  }
  return text
    .replace(/([0-9.]+% ਸਾਲਾਨਾ ਸਧਾਰਨ ਵਿਆਜ), (\d+) ਸਾਲ ਲਈ/gu, "$2 ਸਾਲ ਲਈ $1")
    .replace(/([0-9.]+% ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ \(ਵਿਆਜ ਹਰ ਸਾਲ ਮੂਲ ਵਿੱਚ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ\)), (\d+) ਸਾਲ ਲਈ/gu, "$2 ਸਾਲ ਲਈ $1")
    .replace(/(\d+ ਸਾਲ ਲਈ ਮਿਸ਼ਰਤ ਵਿਆਜ), ਜਿਸ ਵਿੱਚ ਵਿਆਜ ਹਰ ਸਾਲ ਮੂਲ ਵਿੱਚ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ ਲਾਗੂ ਹੈ/gu, "$1 ਲਾਗੂ ਹੈ, ਜਿਸ ਵਿੱਚ ਵਿਆਜ ਹਰ ਸਾਲ ਮੂਲ ਵਿੱਚ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ")
    .replace(/ਸਾਲਾਨਾ ਸਧਾਰਨ ਵਿਆਜ ਅਨੁਸਾਰ ਵਧਦਾ ਹੈ/gu, "ਸਾਲਾਨਾ ਸਧਾਰਨ ਵਿਆਜ ਤੇ ਵਧਦਾ ਹੈ")
    .replace(/ਦੋ ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ/gu, "ਦੋ ਰਕਮਾਂ")
    .replace(/ਇੱਕੋ ਜਿਹੀਆਂ ਲੱਗਣ ਵਾਲੀਆਂ ਦਰਾਂ ਤੇ ਵੀ/gu, "ਇੱਕੋ ਸਾਲਾਨਾ ਦਰ ਹੋਣ ਤੇ ਵੀ")
    .replace(/ਭਵਿੱਖੀ ਰਕਮ/gu, "ਮਿਆਦੀ ਰਕਮ")
    .replace(/ਪਹਿਲੀ ਵਾਰ ਅੱਗੇ ਨਿਕਲਣ ਵਾਲਾ ਸਾਲ ਸਾਬਤ ਕਰਨ ਲਈ ਲਗਾਤਾਰ ਦੋ ਪੂਰੇ ਸਾਲ ਜਾਂਚੋ: ਪਿਛਲੇ ਸਾਲ B ਅੱਗੇ ਨਾ ਹੋਵੇ ਅਤੇ ਚੁਣੇ ਸਾਲ ਵਿੱਚ B ਅੱਗੇ ਹੋਵੇ।/gu,
      "ਪਹਿਲੀ ਵਾਰ ਅੱਗੇ ਨਿਕਲਣ ਵਾਲਾ ਸਾਲ ਤੈਅ ਕਰਨ ਲਈ ਲਗਾਤਾਰ ਦੋ ਪੂਰੇ ਸਾਲ ਜਾਂਚੋ: ਪਿਛਲੇ ਸਾਲ B ਅੱਗੇ ਨਾ ਹੋਵੇ ਅਤੇ ਚੁਣੇ ਸਾਲ ਵਿੱਚ B ਅੱਗੇ ਹੋ ਜਾਵੇ।")
    .replace(/ਪਹਿਲੀ ਵਾਰ ਅੱਗੇ ਨਿਕਲਣ ਦਾ ਸਾਲ ਸਾਬਤ ਕਰਨ ਲਈ ਠੀਕ ਪਿਛਲੇ ਪੂਰੇ ਸਾਲ ਦੀ ਵੀ ਜਾਂਚ ਕਰੋ/gu,
      "ਪਹਿਲੀ ਵਾਰ ਅੱਗੇ ਨਿਕਲਣ ਦਾ ਸਾਲ ਤੈਅ ਕਰਨ ਲਈ ਠੀਕ ਪਿਛਲੇ ਪੂਰੇ ਸਾਲ ਦੀ ਵੀ ਜਾਂਚ ਕਰੋ");
}

function polishExplanation(
  qlId: IntCp007QlId,
  seed: string,
  locale: IntCp007LocalizedLocale,
  source: ReturnType<typeof generateV2>,
) {
  const english = generateIntCp007EnglishFrozenQuestion(qlId, seed) as any;
  const steps = source.explanation.steps.map((step) => polishText(step, locale));

  if (qlId === "INT-QL-111") {
    const math = mathSegments(english.explanation.steps[4] ?? "");
    const rateEquation = math[0];
    if (!rateEquation) throw new Error(`${qlId}/${seed}: V3 missing approved QL111 rate equation`);
    steps[4] = locale === "hi-IN"
      ? `इससे ${rateEquation} मिलता है; यही आवश्यक वार्षिक दर है।`
      : `ਇਸ ਤੋਂ ${rateEquation} ਮਿਲਦਾ ਹੈ; ਇਹੀ ਲੋੜੀਂਦੀ ਸਾਲਾਨਾ ਦਰ ਹੈ।`;
  }

  if (qlId === "INT-QL-115") {
    const math = mathSegments(english.explanation.steps[3] ?? "");
    if (math.length < 3) throw new Error(`${qlId}/${seed}: V3 expected three approved QL115 math segments, got ${math.length}`);
    steps[3] = locale === "hi-IN"
      ? `यदि दूसरी योजना का शुरुआती मूलधन ${math[0]} है, तो ${math[1]}; इसलिए ${math[2]}।`
      : `ਜੇ ਦੂਜੀ ਯੋਜਨਾ ਦਾ ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ ${math[0]} ਹੈ, ਤਾਂ ${math[1]}; ਇਸ ਲਈ ${math[2]}।`;
  }

  return deepFreeze({
    keyIdea: polishText(source.explanation.keyIdea, locale),
    steps: Object.freeze(steps),
    finalAnswer: source.explanation.finalAnswer,
    commonMistake: polishText(source.explanation.commonMistake, locale),
  });
}

export function generateIntCp007LocalizedReviewQuestion(
  qlId: IntCp007QlId,
  seed: string,
  locale: IntCp007LocalizedLocale,
) {
  const source = generateV2(qlId, seed, locale) as any;
  const markdown = polishText(source.presentation.markdown, locale);
  const explanation = polishExplanation(qlId, seed, locale, source);

  return deepFreeze({
    ...source,
    presentation: deepFreeze({ ...source.presentation, markdown, prompt: markdown }),
    explanation,
    localizedVersion: INT_CP007_LOCALIZED_VERSION,
    editorialStatus: "MULTILINGUAL_EXAM_EDITORIAL_REVIEW" as const,
    approvalStatus: "PENDING_MULTILINGUAL_PRODUCT_REVIEW" as const,
    allocationStatus: "INACTIVE_MULTILINGUAL_EXAM_EDITORIAL_REVIEW" as const,
    mathematicalFingerprint: `${source.mathematicalFingerprint}|${INT_CP007_LOCALIZED_VERSION}`,
  });
}

export function containsDeprecatedPunjabiCompoundInterestTerm(text: string): boolean {
  return text.includes("ਚੱਕਰਵੱਧੀ");
}
