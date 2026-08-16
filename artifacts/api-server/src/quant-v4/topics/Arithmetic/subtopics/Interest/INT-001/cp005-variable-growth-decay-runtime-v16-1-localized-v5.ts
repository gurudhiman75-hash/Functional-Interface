import {
  INT_CP005_V16_1_LOCALES,
  generateIntCp005QuestionV16_1Localized as generateBase,
  type IntCp005QuestionV16_1Localized,
  type IntCp005V16_1Locale,
} from "./cp005-variable-growth-decay-runtime-v16-1-localized-v4";
import type { IntCp005QlId } from "./cp005-variable-growth-decay-runtime";

export const INT_CP005_V16_1_LOCALIZED_VERSION = "INT-CP-005-V16.1-HI-PA-HARDENING-v5" as const;
export { INT_CP005_V16_1_LOCALES };
export type { IntCp005QuestionV16_1Localized, IntCp005V16_1Locale };

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

function polish(question: IntCp005QuestionV16_1Localized, locale: IntCp005V16_1Locale): IntCp005QuestionV16_1Localized {
  const state = question.mathematicalState;
  let markdown = question.presentation.markdown;

  if (state.qlId === "INT-QL-088" && state.context === "INVESTMENT") {
    if (locale === "hi-IN") {
      markdown = markdown
        .replace("चक्रवृद्धि ब्याज पर किया गया निवेश पर", "चक्रवृद्धि ब्याज पर किए गए निवेश में")
        .replace("लागू करने के बाद मान", "लागू करने के बाद राशि")
        .replace(/राशि (₹[0-9,]+) हो जाता है/gu, "राशि $1 हो जाती है");
    } else {
      markdown = markdown
        .replace("ਮਿਸ਼ਰਤ ਵਿਆਜ 'ਤੇ ਕੀਤਾ ਨਿਵੇਸ਼ 'ਤੇ", "ਮਿਸ਼ਰਤ ਵਿਆਜ 'ਤੇ ਕੀਤੇ ਨਿਵੇਸ਼ ਵਿੱਚ")
        .replace("ਲਾਗੂ ਕਰਨ ਤੋਂ ਬਾਅਦ ਮੁੱਲ", "ਲਾਗੂ ਕਰਨ ਤੋਂ ਬਾਅਦ ਰਕਮ")
        .replace(/ਰਕਮ (₹[0-9,]+) ਹੋ ਜਾਂਦਾ ਹੈ/gu, "ਰਕਮ $1 ਹੋ ਜਾਂਦੀ ਹੈ");
    }
  }

  if (state.qlId === "INT-QL-090" && state.context === "VEHICLE") {
    if (locale === "hi-IN") markdown = markdown.replace(/मूल्य की वाहन में/gu, "मूल्य के वाहन में");
    else markdown = markdown.replace(/ਮੁੱਲ ਦੀ ਵਾਹਨ ਵਿੱਚ/gu, "ਮੁੱਲ ਦੇ ਵਾਹਨ ਵਿੱਚ");
  }

  if (state.qlId === "INT-QL-093") {
    if (locale === "hi-IN") markdown = markdown.replace(/या कम होने में/gu, "या उससे कम होने में");
    else markdown = markdown.replace(/ਜਾਂ ਘੱਟ ਹੋਣ ਵਿੱਚ/gu, "ਜਾਂ ਇਸ ਤੋਂ ਘੱਟ ਹੋਣ ਵਿੱਚ");
  }

  if (markdown === question.presentation.markdown) return question;
  return deepFreeze({
    ...question,
    presentation: deepFreeze({ ...question.presentation, markdown, prompt: markdown }),
    mathematicalFingerprint: `${question.mathematicalFingerprint}|V16_1_LOCALIZED_EDITORIAL_V5`,
  });
}

export function generateIntCp005QuestionV16_1Localized(
  qlId: IntCp005QlId,
  seed: string,
  locale: IntCp005V16_1Locale,
): IntCp005QuestionV16_1Localized {
  return polish(generateBase(qlId, seed, locale), locale);
}
