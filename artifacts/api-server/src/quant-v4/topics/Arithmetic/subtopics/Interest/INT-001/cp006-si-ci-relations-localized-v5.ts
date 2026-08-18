import { type IntCp006QlId } from "./cp006-si-ci-relations-runtime-v4-final";
import {
  generateIntCp006LocalizedQuestion as generateV3,
  type IntCp006LocalizedLocale,
} from "./cp006-si-ci-relations-localized-v3";
import {
  INT_CP006_EXPANDED_EXPLANATION_VERSION,
  buildIntCp006ExpandedExplanation,
  polishIntCp006NativeExplanationText,
} from "./cp006-expanded-explanation-v3";

export const INT_CP006_LOCALIZED_EXPLANATION_VERSION = "INT-CP-006-HI-PA-v5-grammar-review" as const;
export type { IntCp006LocalizedLocale };

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

export function generateIntCp006LocalizedExplanationReviewQuestion(
  qlId: IntCp006QlId,
  seed: string,
  locale: IntCp006LocalizedLocale,
) {
  const source = generateV3(qlId, seed, locale);
  const answer = source.options[source.correctIndex]!.value;
  const expanded = buildIntCp006ExpandedExplanation(qlId, source.mathematicalState, answer, locale);
  return deepFreeze({
    ...source,
    explanation: deepFreeze({
      ...source.explanation,
      keyIdea: expanded.keyIdea,
      steps: expanded.steps,
      commonMistake: polishIntCp006NativeExplanationText(source.explanation.commonMistake, locale),
    }),
    localizedVersion: INT_CP006_LOCALIZED_EXPLANATION_VERSION,
    explanationReviewVersion: INT_CP006_EXPANDED_EXPLANATION_VERSION,
    editorialStatus: "LOCALIZED_GRAMMAR_REVIEW" as const,
    approvalStatus: "PENDING_LOCALIZED_GRAMMAR_PRODUCT_REVIEW" as const,
    allocationStatus: "INACTIVE_LOCALIZED_GRAMMAR_REVIEW" as const,
    permanentIdentityFrozen: true as const,
    learnerContentFrozen: false as const,
    mathematicalFingerprint: `${source.mathematicalFingerprint}|${INT_CP006_LOCALIZED_EXPLANATION_VERSION}`,
  });
}
