import { buildSpatialPrimitiveInstanceSceneV2 } from "./primitive-instance-v2";
import {
  SPATIAL_FAN_PRIMITIVE_POOL_V2,
  SPATIAL_FCL_PRIMITIVE_POOL_V2,
} from "./primitive-chapter-pools-v2";
import {
  SPATIAL_PRIMITIVE_CLASSIFICATION_PROPERTY_IDS_V2,
  buildSpatialPrimitiveClassificationQuestionFromIdsV2,
  spatialPrimitiveClassificationPropertySatisfiedV2,
  type SpatialPrimitiveClassificationPropertyIdV2,
} from "./primitive-classification-v2";
import {
  applySpatialPrimitiveRetrofitTransformV2,
  type SpatialPrimitiveRetrofitQuestionV2,
  type SpatialPrimitiveRetrofitTransformV2,
} from "./primitive-retrofit-proof";
import { getSpatialPrimitiveV2 } from "./primitive-library-v2";
import { spatialSceneSemanticFingerprint } from "./normalize";
import { DeterministicSpatialRng, hashSpatialSeed } from "./seed";
import {
  generateSpatialSeriesProofQuestion,
} from "./series-proof-generator";
import {
  spatialSeriesPresentationForRule,
} from "./series-rule-authority";
import type {
  SpatialSeriesCardinal,
  SpatialSeriesFrameState,
  SpatialSeriesProofDefinition,
  SpatialSeriesRuleId,
} from "./series-types";
import type { SpatialPrimitiveIdV2 } from "./primitive-types";
import type { SpatialScene } from "./types";
import { validateSpatialScene } from "./validator";
import {
  SPATIAL_SYNTHESIS_LIFECYCLE_LOCK_V1,
  type SpatialProductionSynthesisBatchRequestV1,
  type SpatialProductionSynthesisBatchResultV1,
  type SpatialProductionSynthesisChapterResultV1,
  type SpatialSynthesisAttemptV1,
  type SpatialSynthesisCandidateV1,
  type SpatialSynthesisChapterV1,
  type SpatialSynthesisRejectCodeV1,
} from "./synthesis-types-v1";

const FAN_FAMILIES: readonly Exclude<SpatialPrimitiveRetrofitTransformV2, "UNCHANGED">[] = [
  "ROTATE_90_CW",
  "ROTATE_180",
  "REFLECT_VERTICAL",
  "REFLECT_HORIZONTAL",
] as const;

const FAN_OPTION_TRANSFORMS: readonly SpatialPrimitiveRetrofitTransformV2[] = [
  "ROTATE_90_CW",
  "ROTATE_180",
  "REFLECT_VERTICAL",
  "REFLECT_HORIZONTAL",
  "UNCHANGED",
] as const;

export const SPATIAL_FSR_SYNTHESIS_RULE_IDS_V1: readonly SpatialSeriesRuleId[] = [
  "ROTATE_90_CW",
  "ROTATE_90_CCW",
  "ROTATE_180",
  "MOVE_MARKER_CW",
  "MOVE_MARKER_CCW",
  "MOVE_DOTS_CW",
  "MOVE_DOTS_CCW",
  "INCREASE_DOTS",
  "ROTATE_90_CW_MOVE_MARKER_CCW",
  "ROTATE_90_CCW_MOVE_DOTS_CW",
] as const;

const CARDINALS: readonly SpatialSeriesCardinal[] = ["TOP", "RIGHT", "BOTTOM", "LEFT"] as const;

const FSR_DISTRACTORS: Record<SpatialSeriesRuleId, readonly [SpatialSeriesRuleId, SpatialSeriesRuleId, SpatialSeriesRuleId]> = {
  ROTATE_90_CW: ["ROTATE_90_CCW", "ROTATE_180", "NO_CHANGE"],
  ROTATE_90_CCW: ["ROTATE_90_CW", "ROTATE_180", "NO_CHANGE"],
  ROTATE_180: ["ROTATE_90_CW", "ROTATE_90_CCW", "NO_CHANGE"],
  MOVE_MARKER_CW: ["MOVE_MARKER_CCW", "MOVE_MARKER_180", "NO_CHANGE"],
  MOVE_MARKER_CCW: ["MOVE_MARKER_CW", "MOVE_MARKER_180", "NO_CHANGE"],
  MOVE_MARKER_180: ["MOVE_MARKER_CW", "MOVE_MARKER_CCW", "NO_CHANGE"],
  MOVE_DOTS_CW: ["MOVE_DOTS_CCW", "MOVE_DOTS_180", "NO_CHANGE"],
  MOVE_DOTS_CCW: ["MOVE_DOTS_CW", "MOVE_DOTS_180", "NO_CHANGE"],
  MOVE_DOTS_180: ["MOVE_DOTS_CW", "MOVE_DOTS_CCW", "NO_CHANGE"],
  INCREASE_DOTS: ["DECREASE_DOTS", "MOVE_DOTS_CW", "NO_CHANGE"],
  DECREASE_DOTS: ["INCREASE_DOTS", "MOVE_DOTS_CCW", "NO_CHANGE"],
  ROTATE_90_CW_MOVE_MARKER_CCW: ["ROTATE_90_CW", "MOVE_MARKER_CCW", "ROTATE_90_CCW"],
  ROTATE_90_CCW_MOVE_DOTS_CW: ["ROTATE_90_CCW", "MOVE_DOTS_CW", "ROTATE_90_CW"],
  NO_CHANGE: ["ROTATE_90_CW", "MOVE_MARKER_CW", "MOVE_DOTS_CW"],
};

const FSR_PERIOD_FOUR_PRIMITIVES: readonly SpatialPrimitiveIdV2[] = SPATIAL_FAN_PRIMITIVE_POOL_V2.filter(
  (primitiveId) => getSpatialPrimitiveV2(primitiveId).rotationPeriodQuarterTurns === 4,
);

function lifecycleLock() {
  return { ...SPATIAL_SYNTHESIS_LIFECYCLE_LOCK_V1 };
}

function prototypeToken(seed: string): string {
  return hashSpatialSeed(seed).toString(16).padStart(8, "0");
}

function validateCorrectSlot(index: number): void {
  if (!Number.isInteger(index) || index < 0 || index > 3) {
    throw new Error(`Correct option index '${index}' must be in the range 0..3.`);
  }
}

function sceneSetIsValid(scenes: readonly SpatialScene[]): boolean {
  return scenes.every((scene) => validateSpatialScene(scene).ok);
}

function withSynthesisMarker(scene: SpatialScene, id: string): SpatialScene {
  return {
    ...scene,
    id,
    nodes: [
      ...scene.nodes,
      {
        kind: "circle",
        id: `${id}-marker`,
        role: "synthesis-distinguishing-marker",
        layer: 9,
        center: { x: 30, y: 36 },
        radius: 3.2,
        style: { stroke: "#111", strokeWidth: 1.2, fill: "#111" },
      },
    ],
    metadata: {
      ...(scene.metadata ?? {}),
      semanticRole: "SPATIAL_SYNTHESIS_STIMULUS_V1",
    },
  };
}

function fanBaseScene(primitiveId: SpatialPrimitiveIdV2, id: string): SpatialScene {
  return withSynthesisMarker(
    buildSpatialPrimitiveInstanceSceneV2(primitiveId, `${id}-primitive`, {
      scale: 0.84,
      idPrefix: `${id.toLowerCase()}-primitive`,
    }),
    id,
  );
}

function acceptedAttempt(
  chapterCode: SpatialSynthesisChapterV1,
  seed: string,
  familyId: string,
  attemptIndex: number,
  desiredCorrectOptionIndex: number,
  candidate: SpatialSynthesisCandidateV1,
): SpatialSynthesisAttemptV1 {
  return {
    status: "ACCEPTED",
    chapterCode,
    seed,
    familyId,
    attemptIndex,
    desiredCorrectOptionIndex,
    candidate,
  };
}

function rejectedAttempt(
  chapterCode: SpatialSynthesisChapterV1,
  seed: string,
  familyId: string,
  attemptIndex: number,
  desiredCorrectOptionIndex: number,
  rejectCode: SpatialSynthesisRejectCodeV1,
  message: string,
): SpatialSynthesisAttemptV1 {
  return {
    status: "REJECTED",
    chapterCode,
    seed,
    familyId,
    attemptIndex,
    desiredCorrectOptionIndex,
    rejectCode,
    message,
  };
}

function orderedFanOptions(
  source: SpatialScene,
  intended: Exclude<SpatialPrimitiveRetrofitTransformV2, "UNCHANGED">,
  rng: DeterministicSpatialRng,
  correctOptionIndex: number,
): { scenes: SpatialScene[]; labels: SpatialPrimitiveRetrofitTransformV2[] } {
  const distractors = rng.sampleWithoutReplacement(
    FAN_OPTION_TRANSFORMS.filter((entry) => entry !== intended),
    3,
  );
  const labels: SpatialPrimitiveRetrofitTransformV2[] = [intended, ...distractors];
  [labels[0], labels[correctOptionIndex]] = [labels[correctOptionIndex]!, labels[0]!];
  const scenes = labels.map((label, index) =>
    applySpatialPrimitiveRetrofitTransformV2(source, label, `${source.id}-OPTION-${index + 1}-${label}`),
  );
  return { scenes, labels };
}

export function synthesizeSpatialFanAttemptV1(input: {
  seed: string;
  familyId: Exclude<SpatialPrimitiveRetrofitTransformV2, "UNCHANGED">;
  desiredCorrectOptionIndex: number;
  attemptIndex?: number;
}): SpatialSynthesisAttemptV1 {
  const chapterCode = "FAN-001" as const;
  const attemptIndex = input.attemptIndex ?? 0;
  try {
    validateCorrectSlot(input.desiredCorrectOptionIndex);
    if (!FAN_FAMILIES.includes(input.familyId)) {
      return rejectedAttempt(chapterCode, input.seed, input.familyId, attemptIndex, input.desiredCorrectOptionIndex, "INVALID_REQUEST", `Unsupported FAN synthesis family '${input.familyId}'.`);
    }
    const rng = new DeterministicSpatialRng(input.seed);
    const [sourcePrimitiveId, targetPrimitiveId] = rng.sampleWithoutReplacement(SPATIAL_FAN_PRIMITIVE_POOL_V2, 2);
    const token = prototypeToken(input.seed);
    const sourceScene = fanBaseScene(sourcePrimitiveId, `FAN-SYNTH-${token}-A`);
    const pairResultScene = applySpatialPrimitiveRetrofitTransformV2(sourceScene, input.familyId, `FAN-SYNTH-${token}-B`);
    const targetScene = fanBaseScene(targetPrimitiveId, `FAN-SYNTH-${token}-C`);

    const inferred = FAN_OPTION_TRANSFORMS.filter((transform) =>
      spatialSceneSemanticFingerprint(
        applySpatialPrimitiveRetrofitTransformV2(sourceScene, transform, `FAN-SYNTH-${token}-INFER-${transform}`),
      ) === spatialSceneSemanticFingerprint(pairResultScene),
    );
    if (inferred.length !== 1 || inferred[0] !== input.familyId) {
      return rejectedAttempt(
        chapterCode,
        input.seed,
        input.familyId,
        attemptIndex,
        input.desiredCorrectOptionIndex,
        "FAN_TRANSFORM_COLLISION",
        `A→B is not uniquely solved by '${input.familyId}'; candidates: ${inferred.join(", ") || "none"}.`,
      );
    }

    const ordered = orderedFanOptions(targetScene, input.familyId, rng, input.desiredCorrectOptionIndex);
    const optionFingerprints = ordered.scenes.map(spatialSceneSemanticFingerprint);
    if (new Set(optionFingerprints).size !== 4) {
      return rejectedAttempt(chapterCode, input.seed, input.familyId, attemptIndex, input.desiredCorrectOptionIndex, "FAN_OPTION_COLLISION", "FAN option scenes are not visually unique.");
    }
    if (!sceneSetIsValid([sourceScene, pairResultScene, targetScene, ...ordered.scenes])) {
      return rejectedAttempt(chapterCode, input.seed, input.familyId, attemptIndex, input.desiredCorrectOptionIndex, "SCENE_VALIDATION_FAILED", "At least one FAN synthesis scene failed spatial scene validation.");
    }

    const payload: SpatialPrimitiveRetrofitQuestionV2 = {
      chapterCode,
      prototypeId: `FAN-SYNTH-${token}`,
      transform: input.familyId,
      sourcePrimitiveId,
      sourceScene,
      analogyTargetPrimitiveId: targetPrimitiveId,
      pairResultScene,
      targetScene,
      optionScenes: ordered.scenes,
      optionLabels: ordered.labels,
      correctOptionIndex: input.desiredCorrectOptionIndex,
    };

    const contentFingerprint = [
      chapterCode,
      input.familyId,
      spatialSceneSemanticFingerprint(sourceScene),
      spatialSceneSemanticFingerprint(pairResultScene),
      spatialSceneSemanticFingerprint(targetScene),
      [...optionFingerprints].sort().join("||"),
    ].join("::");
    const deliveryFingerprint = [
      contentFingerprint,
      String(input.desiredCorrectOptionIndex),
      optionFingerprints.join("||"),
    ].join("::DELIVERY::");
    const candidate: SpatialSynthesisCandidateV1 = {
      chapterCode,
      seed: input.seed,
      familyId: input.familyId,
      correctOptionIndex: input.desiredCorrectOptionIndex,
      contentFingerprint,
      deliveryFingerprint,
      payload,
      lifecycle: lifecycleLock(),
    };
    return acceptedAttempt(chapterCode, input.seed, input.familyId, attemptIndex, input.desiredCorrectOptionIndex, candidate);
  } catch (error) {
    return rejectedAttempt(chapterCode, input.seed, input.familyId, attemptIndex, input.desiredCorrectOptionIndex, "INVALID_REQUEST", error instanceof Error ? error.message : String(error));
  }
}

export function synthesizeSpatialFclAttemptV1(input: {
  seed: string;
  familyId: SpatialPrimitiveClassificationPropertyIdV2;
  desiredCorrectOptionIndex: number;
  attemptIndex?: number;
}): SpatialSynthesisAttemptV1 {
  const chapterCode = "FCL-001" as const;
  const attemptIndex = input.attemptIndex ?? 0;
  try {
    validateCorrectSlot(input.desiredCorrectOptionIndex);
    if (!SPATIAL_PRIMITIVE_CLASSIFICATION_PROPERTY_IDS_V2.includes(input.familyId)) {
      return rejectedAttempt(chapterCode, input.seed, input.familyId, attemptIndex, input.desiredCorrectOptionIndex, "INVALID_REQUEST", `Unsupported FCL synthesis family '${input.familyId}'.`);
    }
    const truePool = SPATIAL_FCL_PRIMITIVE_POOL_V2.filter((primitiveId) =>
      spatialPrimitiveClassificationPropertySatisfiedV2(primitiveId, input.familyId),
    );
    const falsePool = SPATIAL_FCL_PRIMITIVE_POOL_V2.filter((primitiveId) =>
      !spatialPrimitiveClassificationPropertySatisfiedV2(primitiveId, input.familyId),
    );
    if (truePool.length < 3 || falsePool.length < 1) {
      return rejectedAttempt(
        chapterCode,
        input.seed,
        input.familyId,
        attemptIndex,
        input.desiredCorrectOptionIndex,
        "FCL_POOL_SHORTAGE",
        `FCL family '${input.familyId}' has true/false pool sizes ${truePool.length}/${falsePool.length}.`,
      );
    }

    const rng = new DeterministicSpatialRng(input.seed);
    const common = rng.sampleWithoutReplacement(truePool, 3);
    const odd = rng.pick(falsePool);
    const primitiveIds = [...common] as SpatialPrimitiveIdV2[];
    primitiveIds.splice(input.desiredCorrectOptionIndex, 0, odd);
    const tuple = primitiveIds as [SpatialPrimitiveIdV2, SpatialPrimitiveIdV2, SpatialPrimitiveIdV2, SpatialPrimitiveIdV2];
    const token = prototypeToken(input.seed);

    try {
      const payload = buildSpatialPrimitiveClassificationQuestionFromIdsV2({
        prototypeId: `FCL-SYNTH-${token}`,
        propertyId: input.familyId,
        primitiveIds: tuple,
        correctOptionIndex: input.desiredCorrectOptionIndex,
      });
      if (!sceneSetIsValid(payload.optionScenes)) {
        return rejectedAttempt(chapterCode, input.seed, input.familyId, attemptIndex, input.desiredCorrectOptionIndex, "SCENE_VALIDATION_FAILED", "At least one FCL synthesis scene failed spatial scene validation.");
      }
      const optionFingerprints = payload.optionScenes.map(spatialSceneSemanticFingerprint);
      const contentFingerprint = [
        chapterCode,
        input.familyId,
        [...optionFingerprints].sort().join("||"),
      ].join("::");
      const deliveryFingerprint = [
        contentFingerprint,
        String(input.desiredCorrectOptionIndex),
        optionFingerprints.join("||"),
      ].join("::DELIVERY::");
      const candidate: SpatialSynthesisCandidateV1 = {
        chapterCode,
        seed: input.seed,
        familyId: input.familyId,
        correctOptionIndex: input.desiredCorrectOptionIndex,
        contentFingerprint,
        deliveryFingerprint,
        payload,
        lifecycle: lifecycleLock(),
      };
      return acceptedAttempt(chapterCode, input.seed, input.familyId, attemptIndex, input.desiredCorrectOptionIndex, candidate);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const rejectCode: SpatialSynthesisRejectCodeV1 = message.includes("competing visible 3-to-1 descriptor")
        ? "FCL_COMPETING_DESCRIPTOR"
        : "INVALID_REQUEST";
      return rejectedAttempt(chapterCode, input.seed, input.familyId, attemptIndex, input.desiredCorrectOptionIndex, rejectCode, message);
    }
  } catch (error) {
    return rejectedAttempt(chapterCode, input.seed, input.familyId, attemptIndex, input.desiredCorrectOptionIndex, "INVALID_REQUEST", error instanceof Error ? error.message : String(error));
  }
}

function fsrInitialState(ruleId: SpatialSeriesRuleId, rng: DeterministicSpatialRng): SpatialSeriesFrameState {
  const primitiveId = rng.pick(FSR_PERIOD_FOUR_PRIMITIVES);
  const markerPosition = rng.pick(CARDINALS);
  const dotAnchor = rng.pick(CARDINALS);
  const dotCount: SpatialSeriesFrameState["dotCount"] = ruleId === "INCREASE_DOTS"
    ? 1
    : rng.pick([1, 2, 3, 4] as const);
  return {
    primitiveId,
    rotationQuarterTurns: rng.int(4) as SpatialSeriesFrameState["rotationQuarterTurns"],
    markerPosition,
    dotAnchor,
    dotCount,
  };
}

export function synthesizeSpatialFsrAttemptV1(input: {
  seed: string;
  familyId: SpatialSeriesRuleId;
  desiredCorrectOptionIndex: number;
  attemptIndex?: number;
}): SpatialSynthesisAttemptV1 {
  const chapterCode = "FSR-001" as const;
  const attemptIndex = input.attemptIndex ?? 0;
  try {
    validateCorrectSlot(input.desiredCorrectOptionIndex);
    if (!SPATIAL_FSR_SYNTHESIS_RULE_IDS_V1.includes(input.familyId)) {
      return rejectedAttempt(chapterCode, input.seed, input.familyId, attemptIndex, input.desiredCorrectOptionIndex, "INVALID_REQUEST", `Unsupported FSR synthesis family '${input.familyId}'.`);
    }
    if (FSR_PERIOD_FOUR_PRIMITIVES.length === 0) {
      return rejectedAttempt(chapterCode, input.seed, input.familyId, attemptIndex, input.desiredCorrectOptionIndex, "INVALID_REQUEST", "No quarter-turn-sensitive primitive is available for FSR synthesis.");
    }
    const rng = new DeterministicSpatialRng(input.seed);
    const definition: SpatialSeriesProofDefinition = {
      prototypeId: `FSR-SYNTH-${prototypeToken(input.seed)}`,
      ruleId: input.familyId,
      initialState: fsrInitialState(input.familyId, rng),
      presentationProfile: spatialSeriesPresentationForRule(input.familyId),
      distractorRuleIds: [...FSR_DISTRACTORS[input.familyId]],
      desiredCorrectOptionIndex: input.desiredCorrectOptionIndex,
    };
    try {
      const payload = generateSpatialSeriesProofQuestion(definition);
      const allScenes = [...payload.seriesScenes, ...payload.options.map((option) => option.scene)];
      if (!sceneSetIsValid(allScenes)) {
        return rejectedAttempt(chapterCode, input.seed, input.familyId, attemptIndex, input.desiredCorrectOptionIndex, "SCENE_VALIDATION_FAILED", "At least one FSR synthesis scene failed spatial scene validation.");
      }
      const seriesFingerprints = payload.seriesScenes.map(spatialSceneSemanticFingerprint);
      const optionFingerprints = payload.options.map((option) => option.sceneFingerprint);
      const contentFingerprint = [
        chapterCode,
        input.familyId,
        seriesFingerprints.join("||"),
        [...optionFingerprints].sort().join("||"),
      ].join("::");
      const deliveryFingerprint = [
        contentFingerprint,
        String(input.desiredCorrectOptionIndex),
        optionFingerprints.join("||"),
      ].join("::DELIVERY::");
      const candidate: SpatialSynthesisCandidateV1 = {
        chapterCode,
        seed: input.seed,
        familyId: input.familyId,
        correctOptionIndex: input.desiredCorrectOptionIndex,
        contentFingerprint,
        deliveryFingerprint,
        payload,
        lifecycle: lifecycleLock(),
      };
      return acceptedAttempt(chapterCode, input.seed, input.familyId, attemptIndex, input.desiredCorrectOptionIndex, candidate);
    } catch (error) {
      return rejectedAttempt(chapterCode, input.seed, input.familyId, attemptIndex, input.desiredCorrectOptionIndex, "FSR_GENERATOR_REJECTED", error instanceof Error ? error.message : String(error));
    }
  } catch (error) {
    return rejectedAttempt(chapterCode, input.seed, input.familyId, attemptIndex, input.desiredCorrectOptionIndex, "INVALID_REQUEST", error instanceof Error ? error.message : String(error));
  }
}

function chapterFamilies(chapterCode: SpatialSynthesisChapterV1): readonly string[] {
  switch (chapterCode) {
    case "FAN-001": return FAN_FAMILIES;
    case "FCL-001": return SPATIAL_PRIMITIVE_CLASSIFICATION_PROPERTY_IDS_V2;
    case "FSR-001": return SPATIAL_FSR_SYNTHESIS_RULE_IDS_V1;
  }
}

function synthesizeAttemptForChapter(
  chapterCode: SpatialSynthesisChapterV1,
  seed: string,
  familyId: string,
  desiredCorrectOptionIndex: number,
  attemptIndex: number,
): SpatialSynthesisAttemptV1 {
  switch (chapterCode) {
    case "FAN-001":
      return synthesizeSpatialFanAttemptV1({
        seed,
        familyId: familyId as Exclude<SpatialPrimitiveRetrofitTransformV2, "UNCHANGED">,
        desiredCorrectOptionIndex,
        attemptIndex,
      });
    case "FCL-001":
      return synthesizeSpatialFclAttemptV1({
        seed,
        familyId: familyId as SpatialPrimitiveClassificationPropertyIdV2,
        desiredCorrectOptionIndex,
        attemptIndex,
      });
    case "FSR-001":
      return synthesizeSpatialFsrAttemptV1({
        seed,
        familyId: familyId as SpatialSeriesRuleId,
        desiredCorrectOptionIndex,
        attemptIndex,
      });
  }
}

function synthesizeChapterBatch(
  chapterCode: SpatialSynthesisChapterV1,
  seedPrefix: string,
  requested: number,
  maxAttempts: number,
): SpatialProductionSynthesisChapterResultV1 {
  const accepted: SpatialSynthesisCandidateV1[] = [];
  const attempts: SpatialSynthesisAttemptV1[] = [];
  const seenContent = new Set<string>();
  const rejectionCounts: Partial<Record<SpatialSynthesisRejectCodeV1, number>> = {};
  const correctSlotCounts: [number, number, number, number] = [0, 0, 0, 0];
  const familyCounts: Record<string, number> = {};
  const families = chapterFamilies(chapterCode);

  for (let attemptIndex = 0; accepted.length < requested && attemptIndex < maxAttempts; attemptIndex += 1) {
    const acceptedIndex = accepted.length;
    const familyId = families[acceptedIndex % families.length]!;
    const desiredCorrectOptionIndex = acceptedIndex % 4;
    const seed = `${seedPrefix}:${chapterCode}:${familyId}:${desiredCorrectOptionIndex}:${attemptIndex}`;
    const attempt = synthesizeAttemptForChapter(
      chapterCode,
      seed,
      familyId,
      desiredCorrectOptionIndex,
      attemptIndex,
    );

    if (attempt.status === "REJECTED") {
      attempts.push(attempt);
      rejectionCounts[attempt.rejectCode] = (rejectionCounts[attempt.rejectCode] ?? 0) + 1;
      continue;
    }

    if (seenContent.has(attempt.candidate.contentFingerprint)) {
      const duplicate = rejectedAttempt(
        chapterCode,
        seed,
        familyId,
        attemptIndex,
        desiredCorrectOptionIndex,
        "DUPLICATE_CONTENT",
        "Candidate content fingerprint already exists in this synthesis batch; option-order changes do not count as new content.",
      );
      attempts.push(duplicate);
      rejectionCounts.DUPLICATE_CONTENT = (rejectionCounts.DUPLICATE_CONTENT ?? 0) + 1;
      continue;
    }

    seenContent.add(attempt.candidate.contentFingerprint);
    attempts.push(attempt);
    accepted.push(attempt.candidate);
    correctSlotCounts[desiredCorrectOptionIndex] += 1;
    familyCounts[familyId] = (familyCounts[familyId] ?? 0) + 1;
  }

  if (accepted.length !== requested) {
    throw new Error(
      `${chapterCode}: synthesis exhausted ${maxAttempts} attempts with ${accepted.length}/${requested} accepted. Rejections: ${JSON.stringify(rejectionCounts)}.`,
    );
  }

  return {
    chapterCode,
    requested,
    accepted,
    attempts,
    rejectionCounts,
    correctSlotCounts,
    familyCounts,
  };
}

export function synthesizeSpatialProductionBatchV1(
  request: SpatialProductionSynthesisBatchRequestV1,
): SpatialProductionSynthesisBatchResultV1 {
  if (!request.seedPrefix.trim()) throw new Error("Production synthesis seedPrefix must not be empty.");
  if (!Number.isInteger(request.requestedPerChapter) || request.requestedPerChapter <= 0) {
    throw new Error("requestedPerChapter must be a positive integer.");
  }
  const maxAttempts = request.maxAttemptsPerChapter ?? Math.max(2_000, request.requestedPerChapter * 200);
  if (!Number.isInteger(maxAttempts) || maxAttempts < request.requestedPerChapter) {
    throw new Error("maxAttemptsPerChapter must be an integer at least as large as requestedPerChapter.");
  }

  const fan = synthesizeChapterBatch("FAN-001", request.seedPrefix, request.requestedPerChapter, maxAttempts);
  const fcl = synthesizeChapterBatch("FCL-001", request.seedPrefix, request.requestedPerChapter, maxAttempts);
  const fsr = synthesizeChapterBatch("FSR-001", request.seedPrefix, request.requestedPerChapter, maxAttempts);

  return {
    version: "SPA-FND-001-PRODUCTION-SYNTHESIS-V1",
    seedPrefix: request.seedPrefix,
    requestedPerChapter: request.requestedPerChapter,
    totalAccepted: fan.accepted.length + fcl.accepted.length + fsr.accepted.length,
    chapters: {
      "FAN-001": fan,
      "FCL-001": fcl,
      "FSR-001": fsr,
    },
    lifecycle: lifecycleLock(),
  };
}
