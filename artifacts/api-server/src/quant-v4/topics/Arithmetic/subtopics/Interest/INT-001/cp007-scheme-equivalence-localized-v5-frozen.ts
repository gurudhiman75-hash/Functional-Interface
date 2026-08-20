import {
  generateIntCp007LocalizedReviewQuestion as generateV5,
  type IntCp007LocalizedLocale,
} from "./cp007-scheme-equivalence-localized-v5";
import type { IntCp007QlId } from "./cp007-scheme-equivalence-runtime-v3-final";

export const INT_CP007_LOCALIZED_FREEZE_ID = "INT-CP-007-HI-PA-v5-frozen" as const;
export const INT_CP007_LOCALIZED_FREEZE_APPROVAL = "PRODUCT_OWNER_APPROVED_CP007_HI_PA_V5_2026_08_20" as const;
export const INT_CP007_LOCALIZED_APPROVED_REVIEW_VERSION = "INT-CP-007-HI-PA-v5-clean-ci-terminology-review" as const;
export const INT_CP007_LOCALIZED_APPROVED_REVIEW_HEAD = "8d544bccc5aa1626ba3fb9408140b3491c41bb02" as const;
export const INT_CP007_LOCALIZED_APPROVED_REVIEW_RUN = 32276219492 as const;
export const INT_CP007_LOCALIZED_APPROVED_REVIEW_ARTIFACT = 9374241368 as const;
export const INT_CP007_LOCALIZED_APPROVED_REVIEW_DIGEST = "sha256:712f6c7fda1c2d9707fd90b59221c0c9ff2f110ca7999b4396da4ced057da44b" as const;
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

export function generateIntCp007LocalizedFrozenQuestion(
  qlId: IntCp007QlId,
  seed: string,
  locale: IntCp007LocalizedLocale,
) {
  const source = generateV5(qlId, seed, locale) as any;
  return deepFreeze({
    ...source,
    localizedVersion: INT_CP007_LOCALIZED_FREEZE_ID,
    editorialStatus: "MULTILINGUAL_FROZEN" as const,
    approvalStatus: INT_CP007_LOCALIZED_FREEZE_APPROVAL,
    allocationStatus: "INACTIVE_MULTILINGUAL_FROZEN" as const,
    learnerContentFrozen: true,
    mathematicalFingerprint: `${source.mathematicalFingerprint}|${INT_CP007_LOCALIZED_FREEZE_ID}`,
  });
}
