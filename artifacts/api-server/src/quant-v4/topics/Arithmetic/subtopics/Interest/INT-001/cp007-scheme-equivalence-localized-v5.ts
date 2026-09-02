import {
  generateIntCp007LocalizedReviewQuestion as generateV4,
  type IntCp007LocalizedLocale,
} from "./cp007-scheme-equivalence-localized-v4";
import type { IntCp007QlId } from "./cp007-scheme-equivalence-runtime-v3-final";

export const INT_CP007_LOCALIZED_VERSION = "INT-CP-007-HI-PA-v5-clean-ci-terminology-review" as const;
export const INT_CP007_LOCALIZED_V5_SUPERSEDES = "INT-CP-007-HI-PA-v4-final-language-review" as const;
export type { IntCp007LocalizedLocale };

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

function removeCiDefinitionClause(text: string, locale: IntCp007LocalizedLocale): string {
  if (locale === "hi-IN") {
    return text
      .replace(/ ?\(ब्याज हर वर्ष मूलधन में जुड़ता है\)/gu, "")
      .replace(/, जिसमें ब्याज हर वर्ष मूलधन में जुड़ता है/gu, "")
      .replace(/ब्याज हर वर्ष मूलधन में जुड़ता है/gu, "");
  }
  return text
    .replace(/ ?\(ਵਿਆਜ ਹਰ ਸਾਲ ਮੂਲ ਵਿੱਚ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ\)/gu, "")
    .replace(/, ਜਿਸ ਵਿੱਚ ਵਿਆਜ ਹਰ ਸਾਲ ਮੂਲ ਵਿੱਚ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ/gu, "")
    .replace(/ਵਿਆਜ ਹਰ ਸਾਲ ਮੂਲ ਵਿੱਚ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ/gu, "");
}

function cleanText(text: string, locale: IntCp007LocalizedLocale): string {
  return removeCiDefinitionClause(text, locale)
    .replace(/\(\s*\)/gu, "")
    .replace(/\s+,/gu, ",")
    .replace(/,\s*,/gu, ",")
    .replace(/ {2,}/gu, " ")
    .replace(/\s+([।.])/gu, "$1")
    .trim();
}

export function generateIntCp007LocalizedReviewQuestion(
  qlId: IntCp007QlId,
  seed: string,
  locale: IntCp007LocalizedLocale,
) {
  const source = generateV4(qlId, seed, locale) as any;
  const markdown = cleanText(source.presentation.markdown, locale);
  const explanation = deepFreeze({
    keyIdea: cleanText(source.explanation.keyIdea, locale),
    steps: Object.freeze(source.explanation.steps.map((step: string) => cleanText(step, locale))),
    finalAnswer: cleanText(source.explanation.finalAnswer, locale),
    commonMistake: cleanText(source.explanation.commonMistake, locale),
  });

  return deepFreeze({
    ...source,
    presentation: deepFreeze({ ...source.presentation, markdown, prompt: markdown }),
    explanation,
    localizedVersion: INT_CP007_LOCALIZED_VERSION,
    editorialStatus: "MULTILINGUAL_CLEAN_CI_TERMINOLOGY_REVIEW" as const,
    approvalStatus: "PENDING_MULTILINGUAL_PRODUCT_REVIEW" as const,
    allocationStatus: "INACTIVE_MULTILINGUAL_CLEAN_CI_TERMINOLOGY_REVIEW" as const,
    mathematicalFingerprint: `${source.mathematicalFingerprint}|${INT_CP007_LOCALIZED_VERSION}`,
  });
}

export function containsDeprecatedPunjabiCompoundInterestTerm(text: string): boolean {
  return text.includes("ਚੱਕਰਵੱਧੀ");
}
