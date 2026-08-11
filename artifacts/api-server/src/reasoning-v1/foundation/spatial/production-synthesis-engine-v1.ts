import { buildSpatialFclSafeQuartetCatalogV1 } from "./fcl-safe-quartet-catalog-v1";
import {
  SPATIAL_PRIMITIVE_CLASSIFICATION_PROPERTY_IDS_V2,
  buildSpatialPrimitiveClassificationQuestionFromIdsV2,
  type SpatialPrimitiveClassificationPropertyIdV2,
} from "./primitive-classification-v2";
import type { SpatialPrimitiveIdV2 } from "./primitive-types";
import {
  SPATIAL_FSR_SYNTHESIS_RULE_IDS_V1,
  synthesizeSpatialFanAttemptV1,
  synthesizeSpatialFsrAttemptV1,
} from "./production-synthesis-v1";
import type { SpatialPrimitiveRetrofitTransformV2 } from "./primitive-retrofit-proof";
import { spatialSceneSemanticFingerprint } from "./normalize";
import { DeterministicSpatialRng } from "./seed";
import type { SpatialSeriesRuleId } from "./series-types";
import { classifySpatialSceneSymmetry } from "./symmetry";
import type { SpatialLineNode, SpatialScene } from "./types";
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

export const SPATIAL_FAN_SYNTHESIS_TRANSFORM_IDS_V1: readonly Exclude<
  SpatialPrimitiveRetrofitTransformV2,
  "UNCHANGED"
>[] = ["ROTATE_90_CW", "ROTATE_180", "REFLECT_VERTICAL", "REFLECT_HORIZONTAL"] as const;

function lifecycleLock() {
  return { ...SPATIAL_SYNTHESIS_LIFECYCLE_LOCK_V1 };
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

function acceptedAttempt(
  seed: string,
  familyId: string,
  attemptIndex: number,
  desiredCorrectOptionIndex: number,
  candidate: SpatialSynthesisCandidateV1,
): SpatialSynthesisAttemptV1 {
  return {
    status: "ACCEPTED",
    chapterCode: "FCL-001",
    seed,
    familyId,
    attemptIndex,
    desiredCorrectOptionIndex,
    candidate,
  };
}

function validateCorrectSlot(index: number): void {
  if (!Number.isInteger(index) || index < 0 || index > 3) {
    throw new Error(`Correct option index '${index}' must be in the range 0..3.`);
  }
}

interface LineEndpointCandidate {
  nodeIndex: number;
  endpoint: "start" | "end";
  x: number;
  y: number;
  distanceSquared: number;
  key: string;
}

function collectOuterLineEndpoints(
  scene: SpatialScene,
  usedKeys: ReadonlySet<string>,
): LineEndpointCandidate[] {
  const candidates: LineEndpointCandidate[] = [];
  scene.nodes.forEach((node, nodeIndex) => {
    if (node.kind !== "line") return;
    for (const endpoint of ["start", "end"] as const) {
      const point = node[endpoint];
      const dx = point.x - 50;
      const dy = point.y - 50;
      const key = `${nodeIndex}:${endpoint}`;
      if (usedKeys.has(key)) continue;
      if (dx * dx + dy * dy < 100) continue;
      candidates.push({
        nodeIndex,
        endpoint,
        x: point.x,
        y: point.y,
        distanceSquared: dx * dx + dy * dy,
        key,
      });
    }
  });
  return candidates;
}

function shortenEndpoint(
  scene: SpatialScene,
  selected: LineEndpointCandidate,
): SpatialScene {
  const nodes = scene.nodes.map((node, nodeIndex) => {
    if (nodeIndex !== selected.nodeIndex || node.kind !== "line") return node;
    const line = node as SpatialLineNode;
    const moving = selected.endpoint === "start" ? line.start : line.end;
    const fixed = selected.endpoint === "start" ? line.end : line.start;
    const shortened = {
      x: moving.x + (fixed.x - moving.x) * 0.18,
      y: moving.y + (fixed.y - moving.y) * 0.18,
    };
    return selected.endpoint === "start"
      ? { ...line, start: shortened }
      : { ...line, end: shortened };
  });
  return { ...scene, nodes };
}

function selectEndpointForSurvivingSymmetry(
  candidates: readonly LineEndpointCandidate[],
  symmetry: ReturnType<typeof classifySpatialSceneSymmetry>,
): LineEndpointCandidate | undefined {
  let targeted: LineEndpointCandidate[] = [];
  if (symmetry.vertical) {
    targeted = candidates.filter((candidate) => Math.abs(candidate.x - 50) > 5);
  } else if (symmetry.horizontal) {
    targeted = candidates.filter((candidate) => Math.abs(candidate.y - 50) > 5);
  } else if (symmetry.rotational180) {
    targeted = [...candidates];
  }
  const pool = targeted.length > 0 ? targeted : [...candidates];
  return pool.sort((left, right) => {
    if (symmetry.vertical) {
      const horizontalReach = Math.abs(right.x - 50) - Math.abs(left.x - 50);
      if (horizontalReach !== 0) return horizontalReach;
    }
    if (symmetry.horizontal) {
      const verticalReach = Math.abs(right.y - 50) - Math.abs(left.y - 50);
      if (verticalReach !== 0) return verticalReach;
    }
    return right.distanceSquared - left.distanceSquared || left.y - right.y || left.x - right.x;
  })[0];
}

function applyAsymmetricCrossingPresentation(scene: SpatialScene): SpatialScene {
  let current: SpatialScene = scene;
  const usedKeys = new Set<string>();

  for (let pass = 0; pass < 4; pass += 1) {
    const symmetry = classifySpatialSceneSymmetry(current);
    if (!symmetry.vertical && !symmetry.horizontal && !symmetry.rotational180) {
      return {
        ...current,
        metadata: {
          ...(current.metadata ?? {}),
          productionPresentation: "FCL_TRUE_CROSSING_ASYMMETRIC_ARM_V1",
          productionPresentationArmShortenings: usedKeys.size,
        },
      };
    }

    const candidates = collectOuterLineEndpoints(current, usedKeys);
    const selected = selectEndpointForSurvivingSymmetry(candidates, symmetry);
    if (!selected) {
      throw new Error(`${scene.id}: unable to find a safe outer line endpoint to neutralize remaining symmetry.`);
    }
    usedKeys.add(selected.key);
    current = shortenEndpoint(current, selected);
  }

  const remaining = classifySpatialSceneSymmetry(current);
  if (remaining.vertical || remaining.horizontal || remaining.rotational180) {
    throw new Error(
      `${scene.id}: crossing presentation still has symmetry after ${usedKeys.size} arm shortenings: ${JSON.stringify(remaining)}.`,
    );
  }
  return {
    ...current,
    metadata: {
      ...(current.metadata ?? {}),
      productionPresentation: "FCL_TRUE_CROSSING_ASYMMETRIC_ARM_V1",
      productionPresentationArmShortenings: usedKeys.size,
    },
  };
}

function applyFclProductionPresentation(
  scenes: readonly SpatialScene[],
  propertyId: SpatialPrimitiveClassificationPropertyIdV2,
): SpatialScene[] {
  if (propertyId !== "HAS_TRUE_CROSSING") return scenes.map((scene) => scene);
  return scenes.map(applyAsymmetricCrossingPresentation);
}

export function buildSpatialFclFamilyScheduleV1(
  requested: number,
): SpatialPrimitiveClassificationPropertyIdV2[] {
  if (!Number.isInteger(requested) || requested <= 0) {
    throw new Error("FCL synthesis schedule requires a positive integer request size.");
  }
  const capacities = new Map(
    SPATIAL_PRIMITIVE_CLASSIFICATION_PROPERTY_IDS_V2.map((propertyId) => [
      propertyId,
      buildSpatialFclSafeQuartetCatalogV1(propertyId).length,
    ]),
  );
  const zeroCapacity = SPATIAL_PRIMITIVE_CLASSIFICATION_PROPERTY_IDS_V2.filter(
    (propertyId) => (capacities.get(propertyId) ?? 0) === 0,
  );
  if (zeroCapacity.length > 0) {
    throw new Error(`FCL production families with zero strict capacity: ${zeroCapacity.join(", ")}.`);
  }
  const totalCapacity = [...capacities.values()].reduce((sum, capacity) => sum + capacity, 0);
  if (requested > totalCapacity) {
    throw new Error(`FCL requested ${requested} unique contents but strict catalog capacity is ${totalCapacity}.`);
  }

  const used = new Map<SpatialPrimitiveClassificationPropertyIdV2, number>();
  const schedule: SpatialPrimitiveClassificationPropertyIdV2[] = [];
  while (schedule.length < requested) {
    let progressed = false;
    for (const propertyId of SPATIAL_PRIMITIVE_CLASSIFICATION_PROPERTY_IDS_V2) {
      if (schedule.length >= requested) break;
      const count = used.get(propertyId) ?? 0;
      const capacity = capacities.get(propertyId) ?? 0;
      if (count >= capacity) continue;
      schedule.push(propertyId);
      used.set(propertyId, count + 1);
      progressed = true;
    }
    if (!progressed) break;
  }
  if (schedule.length !== requested) {
    throw new Error(`FCL capacity-aware scheduler produced ${schedule.length}/${requested} slots.`);
  }
  return schedule;
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
      return rejectedAttempt(
        chapterCode,
        input.seed,
        input.familyId,
        attemptIndex,
        input.desiredCorrectOptionIndex,
        "INVALID_REQUEST",
        `Unsupported FCL synthesis family '${input.familyId}'.`,
      );
    }

    const catalog = buildSpatialFclSafeQuartetCatalogV1(input.familyId);
    if (catalog.length === 0) {
      return rejectedAttempt(
        chapterCode,
        input.seed,
        input.familyId,
        attemptIndex,
        input.desiredCorrectOptionIndex,
        "FCL_POOL_SHORTAGE",
        `No ambiguity-safe quartet exists for '${input.familyId}'.`,
      );
    }

    const rng = new DeterministicSpatialRng(input.seed);
    const selected = rng.pick(catalog);
    const common = rng.shuffle(selected.slice(0, 3));
    const odd = selected[3];
    const ordered = [...common] as SpatialPrimitiveIdV2[];
    ordered.splice(input.desiredCorrectOptionIndex, 0, odd);
    const primitiveIds = ordered as [
      SpatialPrimitiveIdV2,
      SpatialPrimitiveIdV2,
      SpatialPrimitiveIdV2,
      SpatialPrimitiveIdV2,
    ];

    try {
      const payload = buildSpatialPrimitiveClassificationQuestionFromIdsV2({
        prototypeId: `FCL-SYNTH-${input.familyId}-${attemptIndex}`,
        propertyId: input.familyId,
        primitiveIds,
        correctOptionIndex: input.desiredCorrectOptionIndex,
      });
      payload.optionScenes = applyFclProductionPresentation(payload.optionScenes, input.familyId);
      if (!payload.optionScenes.every((scene) => validateSpatialScene(scene).ok)) {
        return rejectedAttempt(
          chapterCode,
          input.seed,
          input.familyId,
          attemptIndex,
          input.desiredCorrectOptionIndex,
          "SCENE_VALIDATION_FAILED",
          "At least one catalog-selected FCL scene failed spatial scene validation after production presentation.",
        );
      }

      const optionFingerprints = payload.optionScenes.map(spatialSceneSemanticFingerprint);
      if (new Set(optionFingerprints).size !== 4) {
        return rejectedAttempt(
          chapterCode,
          input.seed,
          input.familyId,
          attemptIndex,
          input.desiredCorrectOptionIndex,
          "INVALID_REQUEST",
          "FCL production presentation collapsed two option scenes to the same semantic fingerprint.",
        );
      }
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
      return acceptedAttempt(
        input.seed,
        input.familyId,
        attemptIndex,
        input.desiredCorrectOptionIndex,
        candidate,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const rejectCode: SpatialSynthesisRejectCodeV1 = message.includes("competing visible 3-to-1 descriptor")
        ? "FCL_COMPETING_DESCRIPTOR"
        : "INVALID_REQUEST";
      return rejectedAttempt(
        chapterCode,
        input.seed,
        input.familyId,
        attemptIndex,
        input.desiredCorrectOptionIndex,
        rejectCode,
        `Safe-catalog final validation failed: ${message}`,
      );
    }
  } catch (error) {
    return rejectedAttempt(
      chapterCode,
      input.seed,
      input.familyId,
      attemptIndex,
      input.desiredCorrectOptionIndex,
      "INVALID_REQUEST",
      error instanceof Error ? error.message : String(error),
    );
  }
}

function chapterFamilies(chapterCode: SpatialSynthesisChapterV1): readonly string[] {
  switch (chapterCode) {
    case "FAN-001": return SPATIAL_FAN_SYNTHESIS_TRANSFORM_IDS_V1;
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
  const fclSchedule = chapterCode === "FCL-001" ? buildSpatialFclFamilyScheduleV1(requested) : null;

  for (let attemptIndex = 0; accepted.length < requested && attemptIndex < maxAttempts; attemptIndex += 1) {
    const acceptedIndex = accepted.length;
    const familyId = fclSchedule
      ? fclSchedule[acceptedIndex]!
      : families[acceptedIndex % families.length]!;
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
  const maxAttempts = request.maxAttemptsPerChapter ?? Math.max(500, request.requestedPerChapter * 10);
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
