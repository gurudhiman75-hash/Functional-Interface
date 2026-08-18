import { type IntCp006QlId } from "./cp006-si-ci-relations-runtime-v4-final";
import { generateIntCp006EnglishFrozenQuestion } from "./cp006-si-ci-relations-v1-frozen";
import {
  INT_CP006_EXPANDED_EXPLANATION_VERSION,
  buildIntCp006ExpandedExplanation,
} from "./cp006-expanded-explanation-v3";

export const INT_CP006_ENGLISH_EXPLANATION_AMENDMENT = "INT-CP-006-EN-EXPL-v1-review" as const;

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

export function generateIntCp006EnglishExplanationReviewQuestion(qlId: IntCp006QlId, seed: string) {
  const source = generateIntCp006EnglishFrozenQuestion(qlId, seed, "en-IN");
  const answer = source.options[source.correctIndex]!.value;
  const expanded = buildIntCp006ExpandedExplanation(qlId, source.mathematicalState, answer, "en-IN");
  return deepFreeze({
    ...source,
    explanation: deepFreeze({
      ...source.explanation,
      keyIdea: expanded.keyIdea,
      steps: expanded.steps,
    }),
    explanationReviewVersion: INT_CP006_EXPANDED_EXPLANATION_VERSION,
    englishExplanationAmendment: INT_CP006_ENGLISH_EXPLANATION_AMENDMENT,
    editorialStatus: "EXPLANATION_REVIEW" as const,
    approvalStatus: "PENDING_EXPLANATION_PRODUCT_REVIEW" as const,
    allocationStatus: "INACTIVE_EXPLANATION_REVIEW" as const,
    permanentIdentityFrozen: true as const,
    learnerContentFrozen: false as const,
    mathematicalFingerprint: `${source.mathematicalFingerprint}|${INT_CP006_ENGLISH_EXPLANATION_AMENDMENT}`,
  });
}
