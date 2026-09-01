import type { Int001Wave03QlId } from "./int-001-wave03-permanent-allocation-v1";
import {
  INT_001_WAVE05_ENGLISH_FREEZE_ID,
  generateInt001Wave05EnglishFrozenQuestion,
} from "./int-001-wave05-english-freeze-v1";
import {
  INT_001_WAVE05_LOCALIZED_VERSION,
  type Int001Wave05LocalizedLocale,
  generateInt001Wave05LocalizedCandidate,
} from "./int-001-wave05-localized-candidate-v1";

export const INT_001_WAVE06_LOCALIZED_FREEZE_ID = "INT-001-WAVE06-HI-PA-v1-frozen" as const;
export const INT_001_WAVE06_LOCALIZED_FREEZE_APPROVAL = "PRODUCT_OWNER_APPROVED_INT_WAVE05_HI_PA_2026_09_01" as const;

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

export function generateInt001Wave06LocalizedFrozenQuestion(
  qlId: Int001Wave03QlId,
  seed: string | number,
  locale: Int001Wave05LocalizedLocale,
) {
  const source = generateInt001Wave05LocalizedCandidate(qlId, seed, locale) as any;
  if (source.localizedVersion !== INT_001_WAVE05_LOCALIZED_VERSION) throw new Error(`${qlId}/${locale}: localization source drift`);
  if (source.localizedFromFreezeId !== INT_001_WAVE05_ENGLISH_FREEZE_ID) throw new Error(`${qlId}/${locale}: English freeze ownership drift`);
  if (source.explanationStyle !== "DIRECT_CALCULATION") throw new Error(`${qlId}/${locale}: explanation style drift`);
  return deepFreeze({
    ...source,
    localizedFreezeId: INT_001_WAVE06_LOCALIZED_FREEZE_ID,
    localizedFreezeApproval: INT_001_WAVE06_LOCALIZED_FREEZE_APPROVAL,
    localizationStatus: "HI_PA_FROZEN" as const,
    editorialStatus: "MULTILINGUAL_FROZEN" as const,
    approvalStatus: INT_001_WAVE06_LOCALIZED_FREEZE_APPROVAL,
    lifecycle: {
      ...source.lifecycle,
      learnerContentFrozen: true as const,
      reviewStatus: "MULTILINGUAL_FROZEN" as const,
      localeReviewStatus: "APPROVED" as const,
      questionStudioDiscoverable: true as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    },
  });
}

export function generateInt001Wave06FrozenQuestion(qlId: Int001Wave03QlId, seed: string | number, language: "en" | "hi" | "pa") {
  if (language === "en") {
    const source = generateInt001Wave05EnglishFrozenQuestion(qlId, seed) as any;
    return deepFreeze({ ...source, lifecycle: { ...source.lifecycle, questionStudioDiscoverable: true as const } });
  }
  return generateInt001Wave06LocalizedFrozenQuestion(qlId, seed, language === "hi" ? "hi-IN" : "pa-IN");
}
