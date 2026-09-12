import { generateInt001Wave04DirectCalculationCandidate } from "./int-001-wave04-direct-calculation-presentation-v2";
import type { Int001Wave03QlId } from "./int-001-wave03-permanent-allocation-v1";

export const INT_001_WAVE05_ENGLISH_FREEZE_ID = "INT-001-WAVE05-EN-v1-frozen" as const;
export const INT_001_WAVE05_ENGLISH_FREEZE_APPROVAL = Object.freeze({
  authority: "PRODUCT_OWNER_APPROVED_INT_WAVE04_DIRECT_CALC_2026_09_01" as const,
  sourcePresentationVersion: "INT-001-WAVE04-DIRECT-CALCULATION-PRESENTATION-v2" as const,
  sourceRetrofitHead: "f655132386325b37cf508d5673eab530c63db2b8" as const,
  approvedQlIds: Object.freeze(["INT-QL-132", "INT-QL-133", "INT-QL-134"] as const),
  explanationStyle: "DIRECT_CALCULATION" as const,
});

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

export function generateInt001Wave05EnglishFrozenQuestion(qlId: Int001Wave03QlId, seed: string | number) {
  const source = generateInt001Wave04DirectCalculationCandidate(qlId, seed) as any;
  if (source.explanationStyle !== "DIRECT_CALCULATION") throw new Error(`${qlId}: freeze source escaped direct-calculation style.`);
  if (source.lifecycle?.permanentIdentityFrozen !== true) throw new Error(`${qlId}: permanent identity is not frozen.`);
  if (source.lifecycle?.questionBankWritable || source.lifecycle?.testEligible || source.lifecycle?.publiclyPublishable) {
    throw new Error(`${qlId}: source lifecycle unexpectedly opened before English freeze.`);
  }
  return deepFreeze({
    ...source,
    freezeId: INT_001_WAVE05_ENGLISH_FREEZE_ID,
    freezeApproval: INT_001_WAVE05_ENGLISH_FREEZE_APPROVAL,
    explanationPresentationVersion: source.explanationPresentationVersion,
    lifecycle: {
      ...source.lifecycle,
      learnerContentFrozen: true as const,
      reviewStatus: "ENGLISH_FROZEN" as const,
      localeReviewStatus: "LOCALIZATION_PENDING" as const,
      questionStudioDiscoverable: false as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    },
    provenance: {
      ...source.provenance,
      learnerExplanationStyle: "DIRECT_CALCULATION" as const,
      conceptualFactorNarrationRemoved: true as const,
      englishLearnerContentFrozen: true as const,
      englishFreezeId: INT_001_WAVE05_ENGLISH_FREEZE_ID,
    },
  });
}
