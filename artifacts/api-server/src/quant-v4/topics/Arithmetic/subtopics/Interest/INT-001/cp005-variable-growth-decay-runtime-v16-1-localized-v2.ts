import {
  INT_CP005_V16_1_LOCALES,
  generateIntCp005QuestionV16_1Localized as generateBase,
  type IntCp005QuestionV16_1Localized,
  type IntCp005V16_1Locale,
} from "./cp005-variable-growth-decay-runtime-v16-1-localized";
import type { IntCp005QlId } from "./cp005-variable-growth-decay-runtime";

export const INT_CP005_V16_1_LOCALIZED_VERSION = "INT-CP-005-V16.1-HI-PA-HARDENING-v2" as const;
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

export function generateIntCp005QuestionV16_1Localized(
  qlId: IntCp005QlId,
  seed: string,
  locale: IntCp005V16_1Locale,
): IntCp005QuestionV16_1Localized {
  const source = generateBase(qlId, seed, locale);
  if (qlId !== "INT-QL-089") return source;

  let markdown = source.presentation.markdown;
  if (locale === "hi-IN" && !markdown.includes("चक्रवृद्धि")) {
    markdown = markdown.replace(
      "लुप्त वार्षिक दर कितनी है?",
      "लुप्त वार्षिक चक्रवृद्धि ब्याज दर कितनी है?",
    );
    if (!markdown.includes("चक्रवृद्धि")) throw new Error(`${qlId}/${seed}: Hindi compound-interest terminology remediation failed`);
  }
  if (locale === "pa-IN" && !markdown.includes("ਮਿਸ਼ਰਤ")) {
    markdown = markdown.replace(
      "ਗੁੰਮ ਸਾਲਾਨਾ ਦਰ ਕਿੰਨੀ ਹੈ?",
      "ਗੁੰਮ ਸਾਲਾਨਾ ਮਿਸ਼ਰਤ ਵਿਆਜ ਦਰ ਕਿੰਨੀ ਹੈ?",
    );
    if (!markdown.includes("ਮਿਸ਼ਰਤ")) throw new Error(`${qlId}/${seed}: Punjabi compound-interest terminology remediation failed`);
  }
  if (markdown === source.presentation.markdown) return source;
  return deepFreeze({
    ...source,
    presentation: deepFreeze({ ...source.presentation, markdown, prompt: markdown }),
    mathematicalFingerprint: `${source.mathematicalFingerprint}|V16_1_LOCALIZED_TERM_V2`,
  });
}
