import { spatialSceneSemanticFingerprint } from "./normalize";
import { spatialNodeCenterV1, scaleSelectedSpatialNodesV1 } from "./gap-runtime-v1";
import type { SpatialGapIdV1 } from "./gap-types-v1";
import type { SpatialGapLearnerQuestionV1, SpatialGapQuestionOptionV1 } from "./gap-question-types-v1";
import type { SpatialNode, SpatialPoint, SpatialScene } from "./types";
import { validateSpatialOptionUniqueness, validateSpatialScene } from "./validator";

export interface SpatialGapMaterialProfileV1 {
  id: string;
  capacity: number;
  mode: "ROLE_SCALE_GRID" | "FCL_SUBFIGURE_ASPECT_GRID";
  componentAFactor?: number;
  componentBFactor?: number;
  componentCdFactor?: number;
  dotFactor?: number;
  aspectXFactor?: number;
  aspectYFactor?: number;
}

export interface MaterializedSpatialGapQuestionV1 {
  materialProfile: SpatialGapMaterialProfileV1;
  question: SpatialGapLearnerQuestionV1;
}

const ROLE_SCALE_LEVELS = [0.78, 0.86, 0.94, 1.06, 1.14, 1.22] as const;
const CD_SCALE_LEVELS = [0.88, 0.93, 0.98, 1.02, 1.07, 1.12] as const;
const DOT_SCALE_LEVELS = [0.8, 0.88, 0.96, 1.04, 1.12, 1.2] as const;
const FCL_ASPECT_LEVELS = [
  0.68, 0.72, 0.76, 0.8,
  0.84, 0.88, 0.92, 0.96,
  1.04, 1.08, 1.12, 1.16,
  1.2, 1.24, 1.28, 1.32,
] as const;

export function spatialGapMaterialProfileCapacityV1(gapId: SpatialGapIdV1): number {
  return gapId === "FCL-GAP-06" ? 256 : 216;
}

export function getSpatialGapMaterialProfileV1(
  gapId: SpatialGapIdV1,
  profileIndex: number,
): SpatialGapMaterialProfileV1 {
  if (!Number.isInteger(profileIndex) || profileIndex < 0) {
    throw new Error("Spatial material profile index must be a non-negative integer.");
  }
  const capacity = spatialGapMaterialProfileCapacityV1(gapId);
  if (profileIndex >= capacity) {
    throw new Error(`${gapId}: material profile index ${profileIndex} exceeds capacity ${capacity}.`);
  }

  if (gapId === "FCL-GAP-06") {
    const xIndex = profileIndex % FCL_ASPECT_LEVELS.length;
    const yIndex = Math.floor(profileIndex / FCL_ASPECT_LEVELS.length) % FCL_ASPECT_LEVELS.length;
    return {
      id: `FCL6-AX${String(xIndex).padStart(2, "0")}-AY${String(yIndex).padStart(2, "0")}`,
      capacity,
      mode: "FCL_SUBFIGURE_ASPECT_GRID",
      aspectXFactor: FCL_ASPECT_LEVELS[xIndex]!,
      aspectYFactor: FCL_ASPECT_LEVELS[yIndex]!,
    };
  }

  const aIndex = profileIndex % ROLE_SCALE_LEVELS.length;
  const bIndex = Math.floor(profileIndex / ROLE_SCALE_LEVELS.length) % ROLE_SCALE_LEVELS.length;
  const dotIndex = Math.floor(profileIndex / (ROLE_SCALE_LEVELS.length ** 2)) % DOT_SCALE_LEVELS.length;
  const cdIndex = (profileIndex * 5 + Math.floor(profileIndex / 7)) % CD_SCALE_LEVELS.length;
  return {
    id: `RS-A${aIndex}-B${bIndex}-D${dotIndex}-CD${cdIndex}`,
    capacity,
    mode: "ROLE_SCALE_GRID",
    componentAFactor: ROLE_SCALE_LEVELS[aIndex]!,
    componentBFactor: ROLE_SCALE_LEVELS[bIndex]!,
    componentCdFactor: CD_SCALE_LEVELS[cdIndex]!,
    dotFactor: DOT_SCALE_LEVELS[dotIndex]!,
  };
}

function nodeById(scene: SpatialScene, nodeId: string): SpatialNode {
  const node = scene.nodes.find((candidate) => candidate.id === nodeId);
  if (!node) throw new Error(`Spatial material profile could not find node '${nodeId}'.`);
  return node;
}

function scaleRole(
  scene: SpatialScene,
  role: string,
  factor: number,
  suffix: string,
): SpatialScene {
  let current = scene;
  const ids = current.nodes.filter((node) => node.role === role).map((node) => node.id);
  ids.forEach((nodeId, index) => {
    const center = spatialNodeCenterV1(nodeById(current, nodeId));
    current = scaleSelectedSpatialNodesV1(
      current,
      [nodeId],
      factor,
      center,
      `${scene.id}-${suffix}-${index + 1}`,
    );
  });
  return current;
}

function scalePointAnisotropic(
  point: SpatialPoint,
  center: SpatialPoint,
  factorX: number,
  factorY: number,
): SpatialPoint {
  return {
    x: center.x + (point.x - center.x) * factorX,
    y: center.y + (point.y - center.y) * factorY,
  };
}

function anisotropicNode(node: SpatialNode, factorX: number, factorY: number): SpatialNode {
  const center = spatialNodeCenterV1(node);
  switch (node.kind) {
    case "line":
      return {
        ...node,
        start: scalePointAnisotropic(node.start, center, factorX, factorY),
        end: scalePointAnisotropic(node.end, center, factorX, factorY),
      };
    case "polygon":
    case "polyline":
      return {
        ...node,
        points: node.points.map((point) => scalePointAnisotropic(point, center, factorX, factorY)),
      };
    case "circle":
    case "arc":
      throw new Error(`Anisotropic material profiling does not support '${node.kind}' nodes.`);
  }
}

function anisotropicRole(
  scene: SpatialScene,
  role: string,
  factorX: number,
  factorY: number,
  suffix: string,
): SpatialScene {
  const matching = scene.nodes.filter((node) => node.role === role);
  if (matching.length === 0) return scene;
  return {
    ...scene,
    id: `${scene.id}-${suffix}`,
    nodes: scene.nodes.map((node) =>
      node.role === role ? anisotropicNode(node, factorX, factorY) : { ...node },
    ),
    metadata: scene.metadata ? { ...scene.metadata } : undefined,
  };
}

function applyProfileToScene(
  scene: SpatialScene,
  profile: SpatialGapMaterialProfileV1,
): SpatialScene {
  let current = scene;
  if (profile.mode === "FCL_SUBFIGURE_ASPECT_GRID") {
    current = anisotropicRole(
      current,
      "component-a",
      profile.aspectXFactor!,
      profile.aspectYFactor!,
      profile.id,
    );
  } else {
    current = scaleRole(current, "component-a", profile.componentAFactor!, `${profile.id}-a`);
    current = scaleRole(current, "component-b", profile.componentBFactor!, `${profile.id}-b`);
    current = scaleRole(current, "component-c", profile.componentCdFactor!, `${profile.id}-c`);
    current = scaleRole(current, "component-d", profile.componentCdFactor!, `${profile.id}-d`);
    current = scaleRole(current, "dot", profile.dotFactor!, `${profile.id}-dot`);
  }
  const validation = validateSpatialScene(current);
  if (!validation.ok) {
    throw new Error(`${scene.id}/${profile.id}: materialized scene is invalid: ${validation.errors.map((error) => error.code).join(",")}.`);
  }
  return current;
}

function materializeOption(
  option: SpatialGapQuestionOptionV1,
  profile: SpatialGapMaterialProfileV1,
): SpatialGapQuestionOptionV1 {
  const scene = applyProfileToScene(option.scene, profile);
  return {
    ...option,
    scene,
    sceneFingerprint: spatialSceneSemanticFingerprint(scene),
  };
}

export function materializeSpatialGapLearnerQuestionV1(
  source: SpatialGapLearnerQuestionV1,
  profileIndex: number,
): MaterializedSpatialGapQuestionV1 {
  const materialProfile = getSpatialGapMaterialProfileV1(source.gapId, profileIndex);
  const stimulusScenes = source.stimulusScenes.map((scene) => applyProfileToScene(scene, materialProfile));
  const options = source.options.map((option) => materializeOption(option, materialProfile));
  const uniqueness = validateSpatialOptionUniqueness(options.map((option) => option.scene));
  if (!uniqueness.ok) {
    throw new Error(`${source.gapId}/${materialProfile.id}: material profile collapsed option uniqueness.`);
  }

  const optionFingerprints = options.map((option) => option.sceneFingerprint);
  const correctOption = options[source.correctOptionIndex];
  if (!correctOption) throw new Error(`${source.gapId}: correct option missing after material profiling.`);
  const stimulusFingerprints = stimulusScenes.map(spatialSceneSemanticFingerprint);
  const contentFingerprint = JSON.stringify({
    gapId: source.gapId,
    chapterCode: source.chapterCode,
    stimulusFingerprints,
    correctSceneFingerprint: correctOption.sceneFingerprint,
    optionSet: [...optionFingerprints].sort(),
  });
  const deliveryFingerprint = JSON.stringify({
    contentFingerprint,
    seed: source.seed,
    materialProfileId: materialProfile.id,
    correctOptionIndex: source.correctOptionIndex,
    optionFingerprints,
  });

  return {
    materialProfile,
    question: {
      ...source,
      stimulusScenes,
      options,
      solverEvidence: {
        ...source.solverEvidence,
        expectedCorrectSceneFingerprint: correctOption.sceneFingerprint,
        optionSceneFingerprints: optionFingerprints,
      },
      contentFingerprint,
      deliveryFingerprint,
    },
  };
}
