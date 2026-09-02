import { generateIntCp008EnglishFrozenQuestion } from "./cp008-instalment-english-v6-frozen";
import {
  generateIntCp008LocalizedReviewQuestion as generateV1,
  type IntCp008LocalizedLocale,
} from "./cp008-instalment-localized-v1";
import type { IntCp008QlId } from "./cp008-instalment-runtime-v1-final";

export const INT_CP008_LOCALIZED_VERSION = "INT-CP-008-HI-PA-v2-math-parity-review" as const;
export const INT_CP008_LOCALIZED_V2_SUPERSEDES = "INT-CP-008-HI-PA-v1-native-review" as const;
export type { IntCp008LocalizedLocale };

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

export function generateIntCp008LocalizedReviewQuestion(
  qlId: IntCp008QlId,
  seed: string,
  locale: IntCp008LocalizedLocale,
) {
  const source = generateV1(qlId, seed, locale) as any;
  let explanation = source.explanation;

  if (qlId === "INT-QL-120") {
    const english = generateIntCp008EnglishFrozenQuestion(qlId, seed) as any;
    const approvedMath = mathSegments(String(english.explanation.steps[2] ?? ""));
    if (approvedMath.length !== 3) {
      throw new Error(`${qlId}/${seed}: expected three approved QL120 step-3 MathJax segments, got ${approvedMath.length}`);
    }
    const steps = [...source.explanation.steps];
    steps[2] = locale === "hi-IN"
      ? `${approvedMath[0]} हल करने पर ${approvedMath[1]} मिलता है, जहाँ ${approvedMath[2]}।`
      : `${approvedMath[0]} ਹੱਲ ਕਰਨ ਤੇ ${approvedMath[1]} ਮਿਲਦਾ ਹੈ, ਜਿੱਥੇ ${approvedMath[2]}।`;
    explanation = deepFreeze({ ...source.explanation, steps: Object.freeze(steps) });
  }

  return deepFreeze({
    ...source,
    explanation,
    localizedVersion: INT_CP008_LOCALIZED_VERSION,
    editorialStatus: "MULTILINGUAL_MATH_PARITY_REVIEW" as const,
    approvalStatus: "PENDING_MULTILINGUAL_PRODUCT_REVIEW" as const,
    allocationStatus: "INACTIVE_MULTILINGUAL_REVIEW" as const,
    mathematicalFingerprint: `${source.mathematicalFingerprint}|${INT_CP008_LOCALIZED_VERSION}`,
  });
}
