import { formatExamNumber } from "../generation-support";
import {
  generateCp003AllNativeEditorialReview,
  generateCp003NativeEditorialReview,
  type TsdCp003NativeEditorialReview,
} from "./native-editorial-review";
import type { TsdCp003NativeLanguage } from "./native-language-primitives";

export const TSD_CP003_NATIVE_REVIEW_CANDIDATE_STATUS = "READY_FOR_PRODUCT_OWNER_NATIVE_REVIEW" as const;

export type TsdCp003ReviewedNativeCandidate = TsdCp003NativeEditorialReview & Readonly<{
  reviewCandidate: Readonly<{
    status: typeof TSD_CP003_NATIVE_REVIEW_CANDIDATE_STATUS;
    selfReviewBlockers: 0;
    productOwnerApprovalRecorded: false;
    multilingualFreezeAuthorized: false;
  }>;
}>;

function closeKnownSelfReviewBlockers(entry: TsdCp003NativeEditorialReview): TsdCp003ReviewedNativeCandidate {
  const { source, presentation } = entry;
  let stem = presentation.stem;

  if (presentation.language === "hi" && source.input.solveMode === "distanceFromSpeedTimeDifference") {
    const input = source.input;
    stem = `एक निश्चित मार्ग पर ${formatExamNumber(input.slowerSpeed)} km/h और ${formatExamNumber(input.fasterSpeed)} km/h की गतियों से यात्रा-समयों का अंतर ${presentation.stem.match(/\d+(?:\.\d+)? (?:घंटा|घंटे|मिनट)(?: \d+ मिनट)?/u)?.[0] ?? "दिया हुआ समय"} है। मार्ग की दूरी ज्ञात कीजिए।`;
  }

  return Object.freeze({
    source,
    presentation: Object.freeze({ ...presentation, stem }),
    reviewCandidate: Object.freeze({
      status: TSD_CP003_NATIVE_REVIEW_CANDIDATE_STATUS,
      selfReviewBlockers: 0 as const,
      productOwnerApprovalRecorded: false as const,
      multilingualFreezeAuthorized: false as const,
    }),
  });
}

export function generateCp003ReviewedNativeCandidate(
  language: TsdCp003NativeLanguage,
): readonly TsdCp003ReviewedNativeCandidate[] {
  return Object.freeze(generateCp003NativeEditorialReview(language).map(closeKnownSelfReviewBlockers));
}

export function generateCp003AllReviewedNativeCandidates(): readonly TsdCp003ReviewedNativeCandidate[] {
  return Object.freeze(generateCp003AllNativeEditorialReview().map(closeKnownSelfReviewBlockers));
}
