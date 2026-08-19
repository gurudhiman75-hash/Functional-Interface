import {
  generateIntCp007LocalizedReviewQuestion as generateV3,
  type IntCp007LocalizedLocale,
} from "./cp007-scheme-equivalence-localized-v3";
import type { IntCp007QlId } from "./cp007-scheme-equivalence-runtime-v3-final";

export const INT_CP007_LOCALIZED_VERSION = "INT-CP-007-HI-PA-v4-final-language-review" as const;
export const INT_CP007_LOCALIZED_V4_SUPERSEDES = "INT-CP-007-HI-PA-v3-exam-editorial-review" as const;
export type { IntCp007LocalizedLocale };

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  return Object.freeze(value);
}

function polishText(text: string, locale: IntCp007LocalizedLocale): string {
  if (locale === "hi-IN") {
    return text
      .replace(/(\d+ वर्ष के लिए चक्रवृद्धि ब्याज), जिसमें ब्याज हर वर्ष मूलधन में जुड़ता है है/gu,
        "$1 लागू है, जिसमें ब्याज हर वर्ष मूलधन में जुड़ता है")
      .replace(/दो राशियाँ (.+) में लगाए जाते हैं/gu, "दो राशियाँ $1 में लगाई जाती हैं")
      .replace(/वार्षिक चक्रवृद्धि ब्याज \(ब्याज हर वर्ष मूलधन में जुड़ता है\) के अनुसार बढ़ता है/gu,
        "वार्षिक चक्रवृद्धि ब्याज (ब्याज हर वर्ष मूलधन में जुड़ता है) पर बढ़ता है");
  }
  return text
    .replace(/(\d+ ਸਾਲ ਲਈ ਮਿਸ਼ਰਤ ਵਿਆਜ), ਜਿਸ ਵਿੱਚ ਵਿਆਜ ਹਰ ਸਾਲ ਮੂਲ ਵਿੱਚ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ ਹੈ/gu,
      "$1 ਲਾਗੂ ਹੈ, ਜਿਸ ਵਿੱਚ ਵਿਆਜ ਹਰ ਸਾਲ ਮੂਲ ਵਿੱਚ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ")
    .replace(/ਦੋ ਰਕਮਾਂ (.+) ਵਿੱਚ ਲਗਾਏ ਜਾਂਦੇ ਹਨ/gu, "ਦੋ ਰਕਮਾਂ $1 ਵਿੱਚ ਲਗਾਈਆਂ ਜਾਂਦੀਆਂ ਹਨ")
    .replace(/ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ \(ਵਿਆਜ ਹਰ ਸਾਲ ਮੂਲ ਵਿੱਚ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ\) ਅਨੁਸਾਰ ਵਧਦਾ ਹੈ/gu,
      "ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ (ਵਿਆਜ ਹਰ ਸਾਲ ਮੂਲ ਵਿੱਚ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ) ਤੇ ਵਧਦਾ ਹੈ");
}

function polishExplanation(source: ReturnType<typeof generateV3>, locale: IntCp007LocalizedLocale) {
  return deepFreeze({
    keyIdea: polishText(source.explanation.keyIdea, locale),
    steps: Object.freeze(source.explanation.steps.map((step) => polishText(step, locale))),
    finalAnswer: source.explanation.finalAnswer,
    commonMistake: polishText(source.explanation.commonMistake, locale),
  });
}

export function generateIntCp007LocalizedReviewQuestion(
  qlId: IntCp007QlId,
  seed: string,
  locale: IntCp007LocalizedLocale,
) {
  const source = generateV3(qlId, seed, locale) as any;
  const markdown = polishText(source.presentation.markdown, locale);
  const explanation = polishExplanation(source, locale);

  return deepFreeze({
    ...source,
    presentation: deepFreeze({ ...source.presentation, markdown, prompt: markdown }),
    explanation,
    localizedVersion: INT_CP007_LOCALIZED_VERSION,
    editorialStatus: "MULTILINGUAL_FINAL_LANGUAGE_REVIEW" as const,
    approvalStatus: "PENDING_MULTILINGUAL_PRODUCT_REVIEW" as const,
    allocationStatus: "INACTIVE_MULTILINGUAL_FINAL_LANGUAGE_REVIEW" as const,
    mathematicalFingerprint: `${source.mathematicalFingerprint}|${INT_CP007_LOCALIZED_VERSION}`,
  });
}

export function containsDeprecatedPunjabiCompoundInterestTerm(text: string): boolean {
  return text.includes("ਚੱਕਰਵੱਧੀ");
}
