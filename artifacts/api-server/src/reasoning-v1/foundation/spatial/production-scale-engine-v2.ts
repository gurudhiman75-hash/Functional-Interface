import {
  buildSpatialFclInstanceSafeQuartetCatalogV2,
  auditSpatialFclInstanceQuartetV2,
  spatialFclInstanceCatalogCapacityV2,
  spatialFclInstancePropertySatisfiedV2,
  spatialFclInstanceTotalCapacityV2,
  type SpatialFclInstanceQuartetV2,
} from "./fcl-instance-catalog-v2";
import { buildSpatialFclSafeQuartetCatalogV1 } from "./fcl-safe-quartet-catalog-v1";
import {
  buildSpatialFsrContentFromStateV2,
  buildSpatialFsrSafeStateCatalogV2,
  spatialFsrSafeStateCapacityV2,
  spatialFsrSafeStateTotalCapacityV2,
  type SpatialFsrSafeStateCatalogEntryV2,
} from "./fsr-safe-state-catalog-v2";
import {
  SPATIAL_PRIMITIVE_CLASSIFICATION_PROPERTY_DESCRIPTION_V2,
  SPATIAL_PRIMITIVE_CLASSIFICATION_PROPERTY_IDS_V2,
  type SpatialPrimitiveClassificationPropertyIdV2,
} from "./primitive-classification-v2";
import { getSpatialPrimitiveConnectivityV2 } from "./primitive-connectivity-v2";
import { getSpatialPrimitiveV2 } from "./primitive-library-v2";
import { SPATIAL_FAN_SYNTHESIS_TRANSFORM_IDS_V1 } from "./production-synthesis-engine-v1";
import {
  SPATIAL_FSR_SYNTHESIS_RULE_IDS_V1,
  synthesizeSpatialFanAttemptV1,
} from "./production-synthesis-v1";
import { spatialSceneSemanticFingerprint } from "./normalize";
import { DeterministicSpatialRng } from "./seed";
import { classifySpatialSceneSymmetry } from "./symmetry";
import type { SpatialSeriesRuleId } from "./series-types";
import type { SpatialLineNode, SpatialScene } from "./types";
import { validateSpatialScene } from "./validator";
import { SPATIAL_SYNTHESIS_LIFECYCLE_LOCK_V1 } from "./synthesis-types-v1";
import type {
  SpatialFclInstanceQuestionV2,
  SpatialProductionScaleBatchRequestV2,
  SpatialProductionScaleBatchResultV2,
  SpatialProductionScaleCandidateV2,
  SpatialProductionScaleChapterResultV2,
} from "./synthesis-types-v2";

function lifecycleLock() {
  return { ...SPATIAL_SYNTHESIS_LIFECYCLE_LOCK_V1 };
}

interface OuterEndpoint {
  nodeIndex: number;
  endpoint: "start" | "end";
  key: string;
  x: number;
  y: number;
  distanceSquared: number;
}

function crossingEndpoints(scene: SpatialScene, used: ReadonlySet<string>): OuterEndpoint[] {
  const result: OuterEndpoint[] = [];
  scene.nodes.forEach((node, nodeIndex) => {
    if (node.kind !== "line") return;
    for (const endpoint of ["start", "end"] as const) {
      const point = node[endpoint];
      const key = `${nodeIndex}:${endpoint}`;
      if (used.has(key)) continue;
      const dx = point.x - 50;
      const dy = point.y - 50;
      if (dx * dx + dy * dy < 100) continue;
      result.push({ nodeIndex, endpoint, key, x: point.x, y: point.y, distanceSquared: dx * dx + dy * dy });
    }
  });
  return result;
}

function shortenCrossingEndpoint(scene: SpatialScene, selected: OuterEndpoint): SpatialScene {
  return {
    ...scene,
    nodes: scene.nodes.map((node, nodeIndex) => {
      if (nodeIndex !== selected.nodeIndex || node.kind !== "line") return node;
      const line = node as SpatialLineNode;
      const moving = selected.endpoint === "start" ? line.start : line.end;
      const fixed = selected.endpoint === "start" ? line.end : line.start;
      const shortened = {
        x: moving.x + (fixed.x - moving.x) * 0.18,
        y: moving.y + (fixed.y - moving.y) * 0.18,
      };
      return selected.endpoint === "start" ? { ...line, start: shortened } : { ...line, end: shortened };
    }),
  };
}

function crossingPresentation(scene: SpatialScene): SpatialScene {
  let current = scene;
  const used = new Set<string>();
  for (let pass = 0; pass < 4; pass += 1) {
    const symmetry = classifySpatialSceneSymmetry(current);
    if (!symmetry.vertical && !symmetry.horizontal && !symmetry.rotational180) {
      return {
        ...current,
        metadata: { ...(current.metadata ?? {}), productionPresentation: "FCL_TRUE_CROSSING_ASYMMETRIC_ARM_V2" },
      };
    }
    const candidates = crossingEndpoints(current, used);
    const targeted = symmetry.vertical
      ? candidates.filter((candidate) => Math.abs(candidate.x - 50) > 5)
      : symmetry.horizontal
        ? candidates.filter((candidate) => Math.abs(candidate.y - 50) > 5)
        : candidates;
    const selected = (targeted.length > 0 ? targeted : candidates)
      .sort((left, right) => right.distanceSquared - left.distanceSquared || left.y - right.y || left.x - right.x)[0];
    if (!selected) throw new Error(`${scene.id}: no safe outer endpoint available for crossing presentation.`);
    used.add(selected.key);
    current = shortenCrossingEndpoint(current, selected);
  }
  const symmetry = classifySpatialSceneSymmetry(current);
  if (symmetry.vertical || symmetry.horizontal || symmetry.rotational180) {
    throw new Error(`${scene.id}: crossing presentation failed to remove whole-figure symmetry.`);
  }
  return current;
}

function presentedFclScene(
  scene: SpatialScene,
  propertyId: SpatialPrimitiveClassificationPropertyIdV2,
  nextId: string,
): SpatialScene {
  const cloned: SpatialScene = {
    ...scene,
    id: nextId,
    nodes: scene.nodes.map((node, index) => ({ ...node, id: `${nextId}-N${index + 1}` })),
    metadata: { ...(scene.metadata ?? {}), chapterCode: "FCL-001", synthesisVersion: "PRODUCTION_SCALE_V2" },
  };
  return propertyId === "HAS_TRUE_CROSSING" ? crossingPresentation(cloned) : cloned;
}

function evidenceForInstance(
  instance: SpatialFclInstanceQuartetV2[number],
  propertyId: SpatialPrimitiveClassificationPropertyIdV2,
): string {
  const entry = getSpatialPrimitiveV2(instance.primitiveId);
  const connectivity = getSpatialPrimitiveConnectivityV2(instance.primitiveId);
  const symmetry = classifySpatialSceneSymmetry(instance.scene);
  const orientation = entry.rotationPeriodQuarterTurns === 1 ? "" : ` at ${instance.rotationQuarterTurns * 90}°`;
  switch (propertyId) {
    case "EVEN_SIDED_POLYGON": return entry.polygonSideCount === null ? `${entry.label}${orientation}: not a polygon` : `${entry.label}${orientation}: ${entry.polygonSideCount} sides`;
    case "VERTICAL_SYMMETRY": return `${entry.label}${orientation}: vertical symmetry ${symmetry.vertical ? "present" : "absent"}`;
    case "HORIZONTAL_SYMMETRY": return `${entry.label}${orientation}: horizontal symmetry ${symmetry.horizontal ? "present" : "absent"}`;
    case "HALF_TURN_SYMMETRY": return `${entry.label}${orientation}: 180° symmetry ${symmetry.rotational180 ? "present" : "absent"}`;
    case "QUARTER_TURN_SYMMETRY": return `${entry.label}${orientation}: ${entry.rotationPeriodQuarterTurns === 1 ? "90°-repeating" : "not 90°-repeating"}`;
    case "HAS_BRANCH_JUNCTION": return `${entry.label}${orientation}: ${connectivity.junctionCount} branch junction${connectivity.junctionCount === 1 ? "" : "s"}`;
    case "HAS_TRUE_CROSSING": return `${entry.label}${orientation}: ${connectivity.crossingCount} true crossing${connectivity.crossingCount === 1 ? "" : "s"}`;
    case "PARTITIONED_FIGURE": return `${entry.label}${orientation}: ${entry.category === "PARTITIONED_FIGURE" ? "partitioned" : "not partitioned"}`;
    case "HALF_TURN_ONLY": return `${entry.label}${orientation}: ${entry.rotationPeriodQuarterTurns === 2 ? "180° only" : "not 180° only"}`;
    case "TWO_FREE_TERMINALS": return `${entry.label}${orientation}: ${connectivity.terminalCount} free line ends`;
    case "CLOSED_SHAPE": return `${entry.label}${orientation}: ${entry.topology === "CLOSED" ? "closed" : "not one closed basic shape"}`;
    case "POLYGON": return entry.polygonSideCount === null ? `${entry.label}${orientation}: not a straight-sided polygon` : `${entry.label}${orientation}: ${entry.polygonSideCount}-sided polygon`;
  }
}

function buildFclInstanceQuestion(
  quartet: SpatialFclInstanceQuartetV2,
  propertyId: SpatialPrimitiveClassificationPropertyIdV2,
  correctOptionIndex: number,
  prototypeId: string,
): SpatialFclInstanceQuestionV2 {
  const audit = auditSpatialFclInstanceQuartetV2(quartet, propertyId, correctOptionIndex);
  if (!audit.safe) throw new Error(`${prototypeId}: final instance quartet audit failed for ${propertyId}.`);
  const optionScenes = quartet.map((instance, index) =>
    presentedFclScene(instance.scene, propertyId, `${prototypeId}-OPTION-${index + 1}`),
  );
  if (!optionScenes.every((scene) => validateSpatialScene(scene).ok)) {
    throw new Error(`${prototypeId}: at least one FCL instance option scene failed validation.`);
  }
  const fingerprints = optionScenes.map(spatialSceneSemanticFingerprint);
  if (new Set(fingerprints).size !== 4) {
    throw new Error(`${prototypeId}: FCL instance presentation produced duplicate option scenes.`);
  }
  if (propertyId === "HAS_TRUE_CROSSING") {
    for (const scene of optionScenes) {
      const symmetry = classifySpatialSceneSymmetry(scene);
      if (symmetry.vertical || symmetry.horizontal || symmetry.rotational180) {
        throw new Error(`${prototypeId}: crossing option retained a whole-figure symmetry shortcut.`);
      }
    }
  }
  const propertyVector = quartet.map((instance) => spatialFclInstancePropertySatisfiedV2(instance, propertyId));
  const application = quartet.map((instance, index) =>
    `${String.fromCharCode(65 + index)}. ${evidenceForInstance(instance, propertyId)} ${propertyVector[index] ? "✓" : "✗"}`,
  ).join("  ");
  return {
    chapterCode: "FCL-001",
    prototypeId,
    propertyId,
    propertyDescription: SPATIAL_PRIMITIVE_CLASSIFICATION_PROPERTY_DESCRIPTION_V2[propertyId],
    instances: quartet.map((instance) => ({ ...instance })),
    optionScenes,
    propertyVector,
    correctOptionIndex,
    descriptorAudits: audit.descriptorAudits,
    globalRotationOrbitFingerprint: audit.globalRotationOrbitFingerprint,
    learnerExplanation: {
      observation: "Compare all four rendered figures, including their visible orientation.",
      rule: `Three figures share this relationship: ${SPATIAL_PRIMITIVE_CLASSIFICATION_PROPERTY_DESCRIPTION_V2[propertyId]}.`,
      application,
      check: `Only option ${String.fromCharCode(65 + correctOptionIndex)} breaks the relationship; the instance-level audit found no different-minority rule or easier visible orientation shortcut.`,
    },
    lifecycle: lifecycleLock(),
  };
}

function buildFclSchedule(requested: number): SpatialPrimitiveClassificationPropertyIdV2[] {
  const capacities = spatialFclInstanceCatalogCapacityV2();
  const total = Object.values(capacities).reduce((sum, value) => sum + value, 0);
  if (requested > total) throw new Error(`FCL V2 requested ${requested} contents but instance catalog capacity is ${total}.`);
  const used = new Map<SpatialPrimitiveClassificationPropertyIdV2, number>();
  const schedule: SpatialPrimitiveClassificationPropertyIdV2[] = [];
  while (schedule.length < requested) {
    let progressed = false;
    for (const propertyId of SPATIAL_PRIMITIVE_CLASSIFICATION_PROPERTY_IDS_V2) {
      if (schedule.length >= requested) break;
      const count = used.get(propertyId) ?? 0;
      if (count >= capacities[propertyId]) continue;
      schedule.push(propertyId);
      used.set(propertyId, count + 1);
      progressed = true;
    }
    if (!progressed) break;
  }
  if (schedule.length !== requested) throw new Error(`FCL V2 scheduler produced ${schedule.length}/${requested}.`);
  return schedule;
}

function fclScaleBatch(seedPrefix: string, requested: number): SpatialProductionScaleChapterResultV2 {
  const schedule = buildFclSchedule(requested);
  const perFamilyQueues = new Map<SpatialPrimitiveClassificationPropertyIdV2, SpatialFclInstanceQuartetV2[]>();
  for (const propertyId of SPATIAL_PRIMITIVE_CLASSIFICATION_PROPERTY_IDS_V2) {
    const rng = new DeterministicSpatialRng(`${seedPrefix}:FCL-QUEUE:${propertyId}`);
    perFamilyQueues.set(propertyId, rng.shuffle(buildSpatialFclInstanceSafeQuartetCatalogV2(propertyId)));
  }
  const accepted: SpatialProductionScaleCandidateV2[] = [];
  const correctSlotCounts: [number, number, number, number] = [0, 0, 0, 0];
  const familyCounts: Record<string, number> = {};
  const consumed = new Map<SpatialPrimitiveClassificationPropertyIdV2, number>();

  schedule.forEach((propertyId, acceptedIndex) => {
    const queue = perFamilyQueues.get(propertyId)!;
    const offset = consumed.get(propertyId) ?? 0;
    const selected = queue[offset];
    if (!selected) throw new Error(`FCL V2 queue exhausted unexpectedly for ${propertyId}.`);
    consumed.set(propertyId, offset + 1);
    const desiredCorrectOptionIndex = acceptedIndex % 4;
    const rng = new DeterministicSpatialRng(`${seedPrefix}:FCL-DELIVERY:${propertyId}:${acceptedIndex}`);
    const common = rng.shuffle(selected.slice(0, 3));
    const ordered = [...common] as SpatialFclInstanceQuartetV2[number][];
    ordered.splice(desiredCorrectOptionIndex, 0, selected[3]);
    const quartet = ordered as unknown as SpatialFclInstanceQuartetV2;
    const prototypeId = `FCL-SCALE-V2-${String(acceptedIndex + 1).padStart(4, "0")}`;
    const payload = buildFclInstanceQuestion(quartet, propertyId, desiredCorrectOptionIndex, prototypeId);
    const optionFingerprints = payload.optionScenes.map(spatialSceneSemanticFingerprint);
    const contentFingerprint = `FCL-001::${propertyId}::${payload.globalRotationOrbitFingerprint}`;
    const deliveryFingerprint = `${contentFingerprint}::DELIVERY::${desiredCorrectOptionIndex}::${optionFingerprints.join("||")}`;
    accepted.push({
      chapterCode: "FCL-001",
      seed: `${seedPrefix}:FCL:${propertyId}:${acceptedIndex}`,
      familyId: propertyId,
      correctOptionIndex: desiredCorrectOptionIndex,
      contentFingerprint,
      deliveryFingerprint,
      payload,
      lifecycle: lifecycleLock(),
    });
    correctSlotCounts[desiredCorrectOptionIndex] += 1;
    familyCounts[propertyId] = (familyCounts[propertyId] ?? 0) + 1;
  });

  if (new Set(accepted.map((candidate) => candidate.contentFingerprint)).size !== accepted.length) {
    throw new Error("FCL V2 batch contains duplicate global-rotation-normalized content.");
  }
  return {
    chapterCode: "FCL-001",
    requested,
    accepted,
    attempts: requested,
    duplicateRejects: 0,
    generatorRejects: 0,
    correctSlotCounts,
    familyCounts,
  };
}

function fanScaleBatch(
  seedPrefix: string,
  requested: number,
  maxAttempts: number,
): SpatialProductionScaleChapterResultV2 {
  const accepted: SpatialProductionScaleCandidateV2[] = [];
  const seen = new Set<string>();
  const correctSlotCounts: [number, number, number, number] = [0, 0, 0, 0];
  const familyCounts: Record<string, number> = {};
  let duplicateRejects = 0;
  let generatorRejects = 0;
  let attempts = 0;
  for (let attemptIndex = 0; accepted.length < requested && attemptIndex < maxAttempts; attemptIndex += 1) {
    attempts += 1;
    const acceptedIndex = accepted.length;
    const familyId = SPATIAL_FAN_SYNTHESIS_TRANSFORM_IDS_V1[acceptedIndex % SPATIAL_FAN_SYNTHESIS_TRANSFORM_IDS_V1.length]!;
    const desiredCorrectOptionIndex = acceptedIndex % 4;
    const seed = `${seedPrefix}:FAN-001:${familyId}:${desiredCorrectOptionIndex}:${attemptIndex}`;
    const attempt = synthesizeSpatialFanAttemptV1({ seed, familyId, desiredCorrectOptionIndex, attemptIndex });
    if (attempt.status === "REJECTED") {
      generatorRejects += 1;
      continue;
    }
    if (seen.has(attempt.candidate.contentFingerprint)) {
      duplicateRejects += 1;
      continue;
    }
    seen.add(attempt.candidate.contentFingerprint);
    accepted.push({ ...attempt.candidate });
    correctSlotCounts[desiredCorrectOptionIndex] += 1;
    familyCounts[familyId] = (familyCounts[familyId] ?? 0) + 1;
  }
  if (accepted.length !== requested) {
    throw new Error(`FAN-001: V2 scale proof exhausted ${maxAttempts} attempts at ${accepted.length}/${requested}.`);
  }
  return {
    chapterCode: "FAN-001",
    requested,
    accepted,
    attempts,
    duplicateRejects,
    generatorRejects,
    correctSlotCounts,
    familyCounts,
  };
}

function buildFsrSchedule(requested: number): SpatialSeriesRuleId[] {
  const capacities = spatialFsrSafeStateCapacityV2();
  const total = Object.values(capacities).reduce((sum, value) => sum + value, 0);
  if (requested > total) throw new Error(`FSR V2 requested ${requested} contents but safe-state capacity is ${total}.`);
  const used = new Map<SpatialSeriesRuleId, number>();
  const schedule: SpatialSeriesRuleId[] = [];
  while (schedule.length < requested) {
    let progressed = false;
    for (const ruleId of SPATIAL_FSR_SYNTHESIS_RULE_IDS_V1) {
      if (schedule.length >= requested) break;
      const count = used.get(ruleId) ?? 0;
      if (count >= (capacities[ruleId] ?? 0)) continue;
      schedule.push(ruleId);
      used.set(ruleId, count + 1);
      progressed = true;
    }
    if (!progressed) break;
  }
  if (schedule.length !== requested) throw new Error(`FSR V2 scheduler produced ${schedule.length}/${requested}.`);
  return schedule;
}

function fsrScaleBatch(seedPrefix: string, requested: number): SpatialProductionScaleChapterResultV2 {
  const schedule = buildFsrSchedule(requested);
  const queues = new Map<SpatialSeriesRuleId, SpatialFsrSafeStateCatalogEntryV2[]>();
  for (const ruleId of SPATIAL_FSR_SYNTHESIS_RULE_IDS_V1) {
    const rng = new DeterministicSpatialRng(`${seedPrefix}:FSR-QUEUE:${ruleId}`);
    queues.set(ruleId, rng.shuffle(buildSpatialFsrSafeStateCatalogV2(ruleId)));
  }
  const consumed = new Map<SpatialSeriesRuleId, number>();
  const accepted: SpatialProductionScaleCandidateV2[] = [];
  const correctSlotCounts: [number, number, number, number] = [0, 0, 0, 0];
  const familyCounts: Record<string, number> = {};

  schedule.forEach((ruleId, acceptedIndex) => {
    const queue = queues.get(ruleId)!;
    const offset = consumed.get(ruleId) ?? 0;
    const selected = queue[offset];
    if (!selected) throw new Error(`FSR V2 queue exhausted unexpectedly for ${ruleId}.`);
    consumed.set(ruleId, offset + 1);
    const correctOptionIndex = acceptedIndex % 4;
    const prototypeId = `FSR-SCALE-V2-${String(acceptedIndex + 1).padStart(4, "0")}`;
    const built = buildSpatialFsrContentFromStateV2({
      ruleId,
      initialState: selected.initialState,
      correctOptionIndex,
      prototypeId,
    });
    if (built.contentFingerprint !== selected.contentFingerprint) {
      throw new Error(`${prototypeId}: answer delivery changed FSR content identity.`);
    }
    accepted.push({
      chapterCode: "FSR-001",
      seed: `${seedPrefix}:FSR:${ruleId}:${acceptedIndex}`,
      familyId: ruleId,
      correctOptionIndex,
      contentFingerprint: built.contentFingerprint,
      deliveryFingerprint: built.deliveryFingerprint,
      payload: built.payload,
      lifecycle: lifecycleLock(),
    });
    correctSlotCounts[correctOptionIndex] += 1;
    familyCounts[ruleId] = (familyCounts[ruleId] ?? 0) + 1;
  });

  if (new Set(accepted.map((candidate) => candidate.contentFingerprint)).size !== accepted.length) {
    throw new Error("FSR V2 batch contains duplicate safe-state content.");
  }
  return {
    chapterCode: "FSR-001",
    requested,
    accepted,
    attempts: requested,
    duplicateRejects: 0,
    generatorRejects: 0,
    correctSlotCounts,
    familyCounts,
  };
}

export function synthesizeSpatialProductionScaleBatchV2(
  request: SpatialProductionScaleBatchRequestV2,
): SpatialProductionScaleBatchResultV2 {
  if (!request.seedPrefix.trim()) throw new Error("Production Scale V2 seedPrefix must not be empty.");
  if (!Number.isInteger(request.requestedPerChapter) || request.requestedPerChapter <= 0) {
    throw new Error("Production Scale V2 requestedPerChapter must be a positive integer.");
  }
  const maxAttempts = request.maxAttemptsPerChapter ?? Math.max(5_000, request.requestedPerChapter * 20);
  const fan = fanScaleBatch(request.seedPrefix, request.requestedPerChapter, maxAttempts);
  const fcl = fclScaleBatch(request.seedPrefix, request.requestedPerChapter);
  const fsr = fsrScaleBatch(request.seedPrefix, request.requestedPerChapter);
  const fclCanonicalCatalogCapacity = SPATIAL_PRIMITIVE_CLASSIFICATION_PROPERTY_IDS_V2.reduce(
    (sum, propertyId) => sum + buildSpatialFclSafeQuartetCatalogV1(propertyId).length,
    0,
  );
  return {
    version: "SPA-FND-001-PRODUCTION-SCALE-V2",
    seedPrefix: request.seedPrefix,
    requestedPerChapter: request.requestedPerChapter,
    totalAccepted: fan.accepted.length + fcl.accepted.length + fsr.accepted.length,
    fclInstanceCatalogCapacity: spatialFclInstanceTotalCapacityV2(),
    fclCanonicalCatalogCapacity,
    fsrSafeStateTotalCapacity: spatialFsrSafeStateTotalCapacityV2(),
    chapters: { "FAN-001": fan, "FCL-001": fcl, "FSR-001": fsr },
    lifecycle: lifecycleLock(),
  };
}