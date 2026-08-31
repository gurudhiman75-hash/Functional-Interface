import { INT_001_WAVE03_QL_IDS, type Int001Wave03QlId } from "./int-001-wave03-permanent-allocation-v1";
import {
  generateInt001Wave04DirectCalculationCandidate,
  INT_001_WAVE04_DIRECT_CALCULATION_PRESENTATION_VERSION,
} from "./int-001-wave04-direct-calculation-presentation-v2";

export const INT_001_WAVE05_ENGLISH_FREEZE_VERSION = "INT-001-WAVE05-ENGLISH-FREEZE-v1" as const;
export const INT_001_WAVE05_ENGLISH_FREEZE_STATUS = "ENGLISH_LEARNER_CONTENT_FROZEN" as const;
export const INT_001_WAVE05_ENGLISH_FROZEN_QL_IDS = INT_001_WAVE03_QL_IDS;

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) {
    deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  }
  return Object.freeze(value);
}

export function generateInt001Wave05EnglishFrozenQuestion(
  qlId: Int001Wave03QlId,
  seed: string | number,
) {
  if (!(INT_001_WAVE05_ENGLISH_FROZEN_QL_IDS as readonly string[]).includes(qlId)) {
    throw new Error(`Unsupported Wave05 English freeze QL '${String(qlId)}'.`);
  }
  const source = generateInt001Wave04DirectCalculationCandidate(qlId, seed) as any;
  if (source.explanationStyle !== "DIRECT_CALCULATION") {
    throw new Error(`${qlId}/${String(seed)}: English freeze source escaped direct-calculation policy.`);
  }
  if (source.explanationPresentationVersion !== INT_001_WAVE04_DIRECT_CALCULATION_PRESENTATION_VERSION) {
    throw new Error(`${qlId}/${String(seed)}: English freeze source presentation authority drifted.`);
  }

  return deepFreeze({
    ...source,
    freezeVersion: INT_001_WAVE05_ENGLISH_FREEZE_VERSION,
    freezeStatus: INT_001_WAVE05_ENGLISH_FREEZE_STATUS,
    learnerContentFrozen: true as const,
    lifecycle: {
      ...source.lifecycle,
      permanentIdentityFrozen: true as const,
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
    freezeTraceability: {
      sourceAuthorityVersion: source.authorityVersion,
      sourceRelease: source.release,
      directCalculationPresentationVersion: source.explanationPresentationVersion,
      permanentQlId: qlId,
      mathematicalFingerprint: source.mathematicalFingerprint,
      downstreamReleaseOpened: false as const,
    },
  });
}
