import { generateSpatialGapLearnerQuestionV1 } from "./gap-question-generator-v1";
import {
  materializeSpatialGapLearnerQuestionV1,
  spatialGapMaterialProfileCapacityV1,
  type SpatialGapMaterialProfileV1,
  type MaterializedSpatialGapQuestionV1,
} from "./gap-question-material-profile-v1";
import type { SpatialGapLearnerQuestionV1 } from "./gap-question-types-v1";
import {
  SPATIAL_GAP_IDS_V1,
  SPATIAL_GAP_LIFECYCLE_LOCK_V1,
  type SpatialGapChapterV1,
  type SpatialGapIdV1,
  type SpatialGapLifecycleLockV1,
} from "./gap-types-v1";

export interface SpatialGapQuestionProductionScaleAcceptedV1 {
  gapId: SpatialGapIdV1;
  materialProfile: SpatialGapMaterialProfileV1;
  question: SpatialGapLearnerQuestionV1;
}

export interface SpatialGapQuestionProductionScaleResultV1 {
  version: "SPA-FND-001-GAP-QUESTION-PRODUCTION-SCALE-V1";
  seedPrefix: string;
  requestedPerGap: number;
  totalAccepted: number;
  totalAttempts: number;
  totalDuplicateRejects: number;
  totalProfileRejects: number;
  accepted: SpatialGapQuestionProductionScaleAcceptedV1[];
  gapCounts: Record<SpatialGapIdV1, number>;
  attemptsByGap: Record<SpatialGapIdV1, number>;
  duplicateRejectsByGap: Record<SpatialGapIdV1, number>;
  profileRejectsByGap: Record<SpatialGapIdV1, number>;
  materialProfileCountsByGap: Record<SpatialGapIdV1, number>;
  materialProfileCapacityByGap: Record<SpatialGapIdV1, number>;
  chapterCounts: Record<SpatialGapChapterV1, number>;
  correctSlotCounts: [number, number, number, number];
  correctSlotCountsByGap: Record<SpatialGapIdV1, [number, number, number, number]>;
  lifecycle: SpatialGapLifecycleLockV1;
}

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

function isRetryableMaterialError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return error.message.includes("material profile collapsed option uniqueness") ||
    error.message.includes("materialized scene is invalid");
}

export function synthesizeSpatialGapQuestionProductionScaleV1(request: {
  seedPrefix: string;
  requestedPerGap: number;
}): SpatialGapQuestionProductionScaleResultV1 {
  if (!request.seedPrefix.trim()) throw new Error("Spatial learner production scale requires a non-empty seed prefix.");
  if (!Number.isInteger(request.requestedPerGap) || request.requestedPerGap <= 0) {
    throw new Error("Spatial learner production scale requestedPerGap must be a positive integer.");
  }

  const accepted: SpatialGapQuestionProductionScaleAcceptedV1[] = [];
  const gapCounts = zeroGapCounts();
  const attemptsByGap = zeroGapCounts();
  const duplicateRejectsByGap = zeroGapCounts();
  const profileRejectsByGap = zeroGapCounts();
  const materialProfileCountsByGap = zeroGapCounts();
  const materialProfileCapacityByGap = zeroGapCounts();
  const correctSlotCounts: [number, number, number, number] = [0, 0, 0, 0];
  const correctSlotCountsByGap = zeroSlotsByGap();
  const chapterCounts: Record<SpatialGapChapterV1, number> = {
    "FAN-001": 0,
    "FCL-001": 0,
    "FSR-001": 0,
  };
  const globalContent = new Set<string>();
  const globalDelivery = new Set<string>();
  let totalAttempts = 0;
  let totalDuplicateRejects = 0;
  let totalProfileRejects = 0;

  SPATIAL_GAP_IDS_V1.forEach((gapId, gapIndex) => {
    const capacity = spatialGapMaterialProfileCapacityV1(gapId);
    materialProfileCapacityByGap[gapId] = capacity;
    if (request.requestedPerGap > capacity) {
      throw new Error(`${gapId}: requested ${request.requestedPerGap} exceeds material profile capacity ${capacity}.`);
    }

    const seenProfiles = new Set<string>();
    let acceptedForGap = 0;
    for (let profileIndex = 0; profileIndex < capacity && acceptedForGap < request.requestedPerGap; profileIndex += 1) {
      const desiredCorrectOptionIndex = ((acceptedForGap + gapIndex) % 4) as 0 | 1 | 2 | 3;
      const seed = `${request.seedPrefix}:${gapId}:P${String(profileIndex).padStart(4, "0")}`;
      totalAttempts += 1;
      attemptsByGap[gapId] += 1;

      const baseQuestion = generateSpatialGapLearnerQuestionV1({
        gapId,
        seed,
        desiredCorrectOptionIndex,
      });
      let materialized: MaterializedSpatialGapQuestionV1;
      try {
        materialized = materializeSpatialGapLearnerQuestionV1(baseQuestion, profileIndex);
      } catch (error) {
        if (!isRetryableMaterialError(error)) throw error;
        profileRejectsByGap[gapId] += 1;
        totalProfileRejects += 1;
        continue;
      }
      if (seenProfiles.has(materialized.materialProfile.id)) {
        profileRejectsByGap[gapId] += 1;
        totalProfileRejects += 1;
        continue;
      }
      seenProfiles.add(materialized.materialProfile.id);

      const question = materialized.question;
      if (globalContent.has(question.contentFingerprint)) {
        duplicateRejectsByGap[gapId] += 1;
        totalDuplicateRejects += 1;
        continue;
      }
      if (globalDelivery.has(question.deliveryFingerprint)) {
        throw new Error(`${gapId}/${materialized.materialProfile.id}: delivery collision without content collision.`);
      }

      globalContent.add(question.contentFingerprint);
      globalDelivery.add(question.deliveryFingerprint);
      accepted.push({
        gapId,
        materialProfile: materialized.materialProfile,
        question,
      });
      acceptedForGap += 1;
      gapCounts[gapId] += 1;
      materialProfileCountsByGap[gapId] += 1;
      chapterCounts[chapterForGap(gapId)] += 1;
      correctSlotCounts[question.correctOptionIndex] += 1;
      correctSlotCountsByGap[gapId][question.correctOptionIndex] += 1;
    }

    if (acceptedForGap !== request.requestedPerGap) {
      throw new Error(
        `${gapId}: material production scale reached ${acceptedForGap}/${request.requestedPerGap} unique learner questions ` +
        `after exhausting ${capacity} material profiles (duplicates=${duplicateRejectsByGap[gapId]}, profileRejects=${profileRejectsByGap[gapId]}).`,
      );
    }
  });

  return {
    version: "SPA-FND-001-GAP-QUESTION-PRODUCTION-SCALE-V1",
    seedPrefix: request.seedPrefix,
    requestedPerGap: request.requestedPerGap,
    totalAccepted: accepted.length,
    totalAttempts,
    totalDuplicateRejects,
    totalProfileRejects,
    accepted,
    gapCounts,
    attemptsByGap,
    duplicateRejectsByGap,
    profileRejectsByGap,
    materialProfileCountsByGap,
    materialProfileCapacityByGap,
    chapterCounts,
    correctSlotCounts,
    correctSlotCountsByGap,
    lifecycle: { ...SPATIAL_GAP_LIFECYCLE_LOCK_V1 },
  };
}
