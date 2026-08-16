import {
  INT_CP005_V16_1_LOCALES,
  generateIntCp005QuestionV16_1Localized as generateBase,
  type IntCp005QuestionV16_1Localized,
  type IntCp005V16_1Locale,
} from "./cp005-variable-growth-decay-runtime-v16-1-localized-v3";
import type { IntCp005QlId } from "./cp005-variable-growth-decay-runtime";

export const INT_CP005_V16_1_LOCALIZED_VERSION = "INT-CP-005-V16.1-HI-PA-HARDENING-v4" as const;
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

function polishQl088(question: IntCp005QuestionV16_1Localized, locale: IntCp005V16_1Locale): IntCp005QuestionV16_1Localized {
  if (question.mathematicalState.qlId !== "INT-QL-088") return question;
  const context = question.mathematicalState.context;
  let markdown = question.presentation.markdown;

  if (locale === "hi-IN") {
    markdown = markdown.replace(/वृद्धि\s+वृद्धि/gu, "वृद्धि");
    if (context === "POPULATION") {
      markdown = markdown
        .replace(/जनसंख्या ([0-9,]+) हो जाता है/gu, "जनसंख्या $1 हो जाती है")
        .replace(/प्रारंभिक जनसंख्या कितना था/gu, "प्रारंभिक जनसंख्या कितनी थी")
        .replace(/का प्रारंभिक जनसंख्या/gu, "प्रारंभिक जनसंख्या");
    } else if (context === "INVESTMENT") {
      markdown = markdown.replace(/(निवेश[^।]*?) हो जाती है।/gu, "$1 हो जाता है।");
    } else if (context === "ASSET") {
      markdown = markdown.replace(/(संपत्ति का मूल्य[^।]*?) हो जाती है।/gu, "$1 हो जाता है।");
    }
  } else {
    markdown = markdown.replace(/ਵਾਧਾ\s+ਵਾਧਾ/gu, "ਵਾਧਾ");
    if (context === "POPULATION") {
      markdown = markdown
        .replace(/ਆਬਾਦੀ ([0-9,]+) ਹੋ ਜਾਂਦਾ ਹੈ/gu, "ਆਬਾਦੀ $1 ਹੋ ਜਾਂਦੀ ਹੈ")
        .replace(/ਸ਼ੁਰੂਆਤੀ ਆਬਾਦੀ ਕਿੰਨਾ ਸੀ/gu, "ਸ਼ੁਰੂਆਤੀ ਆਬਾਦੀ ਕਿੰਨੀ ਸੀ")
        .replace(/ਦਾ ਸ਼ੁਰੂਆਤੀ ਆਬਾਦੀ/gu, "ਸ਼ੁਰੂਆਤੀ ਆਬਾਦੀ");
    } else if (context === "INVESTMENT") {
      markdown = markdown.replace(/(ਨਿਵੇਸ਼[^।]*?) ਹੋ ਜਾਂਦੀ ਹੈ।/gu, "$1 ਹੋ ਜਾਂਦਾ ਹੈ।");
    } else if (context === "ASSET") {
      markdown = markdown.replace(/(ਸੰਪਤੀ ਦਾ ਮੁੱਲ[^।]*?) ਹੋ ਜਾਂਦੀ ਹੈ।/gu, "$1 ਹੋ ਜਾਂਦਾ ਹੈ।");
    }
  }

  if (markdown === question.presentation.markdown) return question;
  return deepFreeze({
    ...question,
    presentation: deepFreeze({ ...question.presentation, markdown, prompt: markdown }),
    mathematicalFingerprint: `${question.mathematicalFingerprint}|V16_1_LOCALIZED_EDITORIAL_V4`,
  });
}

export function generateIntCp005QuestionV16_1Localized(
  qlId: IntCp005QlId,
  seed: string,
  locale: IntCp005V16_1Locale,
): IntCp005QuestionV16_1Localized {
  return polishQl088(generateBase(qlId, seed, locale), locale);
}
