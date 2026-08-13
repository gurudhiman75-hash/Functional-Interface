import { generateSpatialGapLearnerQuestionV1 } from "./gap-question-generator-v1";
import type {
  SpatialGapQuestionBatchRequestV1,
  SpatialGapQuestionBatchResultV1,
} from "./gap-question-types-v1";
import {
  SPATIAL_GAP_IDS_V1,
  SPATIAL_GAP_LIFECYCLE_LOCK_V1,
  type SpatialGapChapterV1,
  type SpatialGapIdV1,
} from "./gap-types-v1";

function zeroGapCounts(): Record<SpatialGapIdV1, number> {
  return Object.fromEntries(SPATIAL_GAP_IDS_V1.map((gapId) => [gapId, 0])) as Record<SpatialGapIdV1, number>;
}

function zeroSlotsByGap(): Record<SpatialGapIdV1, [number, number, number, number]> {
  return Object.fromEntries(SPATIAL_GAP_IDS_V1.map((gapId) => [gapId, [0, 0, 0, 0]])) as Record<SpatialGapIdV1, [number, number, number, number]>;
}

function chapterForGap(gapId: SpatialGapIdV1): SpatialGapChapterV1 {
  if (gapId.startsWith("FAN-")) return "FAN-001";
  if (gapId.startsWith("FCL-")) return "FCL-001";
  return "FSR-001";
}

export function synthesizeSpatialGapQuestionBatchV1(
  request: SpatialGapQuestionBatchRequestV1,
): SpatialGapQuestionBatchResultV1 {
  if (!request.seedPrefix.trim()) throw new Error("Spatial gap question synthesis requires a non-empty seed prefix.");
  if (!Number.isInteger(request.requestedPerGap) || request.requestedPerGap <= 0) {
    throw new Error("Spatial gap question requestedPerGap must be a positive integer.");
  }

  const accepted: SpatialGapQuestionBatchResultV1["accepted"] = [];
  const gapCounts = zeroGapCounts();
  const correctSlotCounts: [number, number, number, number] = [0, 0, 0, 0];
  const correctSlotCountsByGap = zeroSlotsByGap();
  const chapterCounts: Record<SpatialGapChapterV1, number> = {
    "FAN-001": 0,
    "FCL-001": 0,
    "FSR-001": 0,
  };
  const contentFingerprints = new Set<string>();
  const deliveryFingerprints = new Set<string>();

  SPATIAL_GAP_IDS_V1.forEach((gapId, gapIndex) => {
    for (let index = 0; index < request.requestedPerGap; index += 1) {
      const desiredCorrectOptionIndex = ((index + gapIndex) % 4) as 0 | 1 | 2 | 3;
      const seed = `${request.seedPrefix}:${gapId}:${String(index).padStart(4, "0")}`;
      const question = generateSpatialGapLearnerQuestionV1({
        gapId,
        seed,
        desiredCorrectOptionIndex,
      });
      if (contentFingerprints.has(question.contentFingerprint)) {
        throw new Error(`${gapId}: duplicate learner-question content at seed '${seed}'.`);
      }
      if (deliveryFingerprints.has(question.deliveryFingerprint)) {
        throw new Error(`${gapId}: duplicate learner-question delivery at seed '${seed}'.`);
      }
      contentFingerprints.add(question.contentFingerprint);
      deliveryFingerprints.add(question.deliveryFingerprint);
      accepted.push(question);
      gapCounts[gapId] += 1;
      chapterCounts[chapterForGap(gapId)] += 1;
      correctSlotCounts[question.correctOptionIndex] += 1;
      correctSlotCountsByGap[gapId][question.correctOptionIndex] += 1;
    }
  });

  return {
    version: "SPA-FND-001-GAP-QUESTION-BATCH-V1",
    seedPrefix: request.seedPrefix,
    requestedPerGap: request.requestedPerGap,
    totalAccepted: accepted.length,
    accepted,
    gapCounts,
    chapterCounts,
    correctSlotCounts,
    correctSlotCountsByGap,
    lifecycle: { ...SPATIAL_GAP_LIFECYCLE_LOCK_V1 },
  };
}
