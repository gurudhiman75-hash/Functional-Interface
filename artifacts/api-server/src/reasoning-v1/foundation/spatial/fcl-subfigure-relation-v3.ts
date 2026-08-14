import type { SpatialCanonicalQuestionV2 } from "./gap-question-remediation-v2";
import { hashSpatialSeed } from "./seed";
import { SPATIAL_SCENE_VERSION, type SpatialNode, type SpatialPoint, type SpatialScene } from "./types";

export type SpatialFclSubfigureRelationModeV3 =
  | "VERTICAL_MIRROR"
  | "HORIZONTAL_WATER"
  | "HALF_TURN_ROTATION";

export const SPATIAL_FCL_SUBFIGURE_RELATION_MODES_V3: readonly SpatialFclSubfigureRelationModeV3[] = [
  "VERTICAL_MIRROR",
  "HORIZONTAL_WATER",
  "HALF_TURN_ROTATION",
] as const;

const OUTLINE = { stroke: "#111", strokeWidth: 2.4, fill: "none", lineCap: "round", lineJoin: "round" } as const;

function rotatePoint(point: SpatialPoint, center: SpatialPoint, angleDeg: number): SpatialPoint {
  const radians = angleDeg * Math.PI / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return { x: center.x + dx * cos - dy * sin, y: center.y + dx * sin + dy * cos };
}

function hook(id: string, center: SpatialPoint, size: number, angleDeg: number): Extract<SpatialNode, { kind: "polyline" }> {
  const points = [
    { x: center.x - size, y: center.y - size * 0.75 },
    { x: center.x + size * 0.2, y: center.y - size * 0.75 },
    { x: center.x + size * 0.2, y: center.y - size * 0.15 },
    { x: center.x + size * 0.75, y: center.y - size * 0.15 },
    { x: center.x + size * 0.75, y: center.y + size * 0.75 },
  ].map((point) => rotatePoint(point, center, angleDeg));
  return { kind: "polyline", id, role: "relation-shape", layer: 3, points, style: { ...OUTLINE } };
}

function dot(id: string, center: SpatialPoint, radius: number): SpatialNode {
  return {
    kind: "circle",
    id,
    role: "relation-marker",
    layer: 5,
    center,
    radius,
    style: { stroke: "#111", strokeWidth: 1, fill: "#111" },
  };
}

function relationVector(mode: SpatialFclSubfigureRelationModeV3, dx: number, dy: number): { dx: number; dy: number } {
  switch (mode) {
    case "VERTICAL_MIRROR": return { dx: -dx, dy };
    case "HORIZONTAL_WATER": return { dx, dy: -dy };
    case "HALF_TURN_ROTATION": return { dx: -dx, dy: -dy };
  }
}

function pairLayout(mode: SpatialFclSubfigureRelationModeV3): {
  first: SpatialPoint;
  second: SpatialPoint;
  divider: Extract<SpatialNode, { kind: "line" }>;
} {
  if (mode === "HORIZONTAL_WATER") {
    return {
      first: { x: 60, y: 38 },
      second: { x: 60, y: 82 },
      divider: {
        kind: "line",
        id: "divider",
        role: "pair-divider",
        layer: 0,
        start: { x: 28, y: 60 },
        end: { x: 92, y: 60 },
        style: { stroke: "#888", strokeWidth: 1, dashArray: [3, 3] },
      },
    };
  }
  return {
    first: { x: 38, y: 60 },
    second: { x: 82, y: 60 },
    divider: {
      kind: "line",
      id: "divider",
      role: "pair-divider",
      layer: 0,
      start: { x: 60, y: 28 },
      end: { x: 60, y: 92 },
      style: { stroke: "#888", strokeWidth: 1, dashArray: [3, 3] },
    },
  };
}

function pairedScene(
  id: string,
  layoutMode: SpatialFclSubfigureRelationModeV3,
  relationMode: SpatialFclSubfigureRelationModeV3,
  angleDeg: number,
  hookSize: number,
  dotRadius: number,
): SpatialScene {
  const layout = pairLayout(layoutMode);
  const firstHook = hook("first-hook", layout.first, hookSize, angleDeg);
  const secondPoints = firstHook.points.map((point) => {
    const mapped = relationVector(relationMode, point.x - layout.first.x, point.y - layout.first.y);
    return { x: layout.second.x + mapped.dx, y: layout.second.y + mapped.dy };
  });
  const markerOffset = rotatePoint(
    { x: layout.first.x + 9, y: layout.first.y - 13 },
    layout.first,
    angleDeg,
  );
  const mappedMarker = relationVector(
    relationMode,
    markerOffset.x - layout.first.x,
    markerOffset.y - layout.first.y,
  );
  return {
    version: SPATIAL_SCENE_VERSION,
    id,
    viewBox: { minX: 0, minY: 0, width: 120, height: 120 },
    nodes: [
      firstHook,
      { ...firstHook, id: "second-hook", points: secondPoints },
      dot("first-dot", markerOffset, dotRadius),
      dot("second-dot", { x: layout.second.x + mappedMarker.dx, y: layout.second.y + mappedMarker.dy }, dotRadius),
      layout.divider,
    ],
    metadata: { chapterCode: "FCL-001", semanticRole: `FCL_SUBFIGURE_RELATION_${layoutMode}` },
  };
}

export function spatialFclSubfigureRelationModeForSeedV3(seed: string): SpatialFclSubfigureRelationModeV3 {
  return SPATIAL_FCL_SUBFIGURE_RELATION_MODES_V3[
    hashSpatialSeed(`${seed}:FCL-SUBFIGURE-RELATION-MODE-V3`) % SPATIAL_FCL_SUBFIGURE_RELATION_MODES_V3.length
  ]!;
}

function oddModeFor(common: SpatialFclSubfigureRelationModeV3): SpatialFclSubfigureRelationModeV3 {
  switch (common) {
    case "VERTICAL_MIRROR": return "HALF_TURN_ROTATION";
    case "HORIZONTAL_WATER": return "VERTICAL_MIRROR";
    case "HALF_TURN_ROTATION": return "HORIZONTAL_WATER";
  }
}

function language(mode: SpatialFclSubfigureRelationModeV3): {
  decisiveProperty: string;
  observation: string;
  rule: string;
  application: string;
  check: string;
  commonCue: string;
  oddCue: string;
} {
  switch (mode) {
    case "VERTICAL_MIRROR":
      return {
        decisiveProperty: "three option-pairs show an exact left-right mirror relation, including the marker dot; one pair does not",
        observation: "In three options, every bend and the marker dot appear at the horizontally opposite position in the second figure.",
        rule: "A vertical mirror reverses left and right while keeping corresponding points at the same height.",
        application: "Check both the hooked line and the dot; a half-turn is not the same as a vertical mirror.",
        check: "Option {correct} is the odd pair because its second shape and marker cannot be obtained by a vertical mirror of the first figure.",
        commonCue: "vertical-mirror",
        oddCue: "half-turn",
      };
    case "HORIZONTAL_WATER":
      return {
        decisiveProperty: "three option-pairs show an exact top-bottom water-image relation, including the marker dot; one pair does not",
        observation: "In three options, every bend and the marker dot appear at the vertically opposite position below the horizontal divider.",
        rule: "A water image reverses top and bottom while keeping corresponding points at the same left-right position.",
        application: "Compare the upper and lower figures point by point; a left-right mirror is not a water image.",
        check: "Option {correct} is the odd pair because its lower shape and marker cannot be obtained by a horizontal water reflection of the upper figure.",
        commonCue: "water-image",
        oddCue: "vertical-mirror",
      };
    case "HALF_TURN_ROTATION":
      return {
        decisiveProperty: "three option-pairs show the same shape after a 180-degree rotation, including the marker dot; one pair does not",
        observation: "In three options, the second figure matches the first after a half-turn: both the hooked line and marker move to their opposite positions.",
        rule: "A 180° rotation turns the complete figure halfway around its centre; it is not a mirror or water reflection.",
        application: "Mentally rotate the first figure by 180° and compare both the line bends and the marker with the second figure.",
        check: "Option {correct} is the odd pair because its second shape and marker do not match a 180° rotation of the first figure.",
        commonCue: "half-turn",
        oddCue: "water-image",
      };
  }
}

export function buildSpatialFclSubfigureRelationQuestionV3(seed: string): SpatialCanonicalQuestionV2 {
  const mode = spatialFclSubfigureRelationModeForSeedV3(seed);
  const oddMode = oddModeFor(mode);
  const hash = hashSpatialSeed(`${seed}:FCL-SUBFIGURE-RELATION-MATERIAL-V3`);
  const hookSize = 8.2 + (hash % 7) * 0.45;
  const dotRadius = 2.4 + (Math.floor(hash / 7) % 5) * 0.18;
  const commonAngles = [0, 45, -45] as const;
  const commonScenes = commonAngles.map((angle, index) => pairedScene(
    `${seed}-common-${index + 1}`,
    mode,
    mode,
    angle,
    hookSize,
    dotRadius,
  ));
  const odd = pairedScene(`${seed}-odd`, mode, oddMode, 90, hookSize, dotRadius);
  const text = language(mode);
  return {
    stimulusScenes: [],
    correctScene: odd,
    distractors: [
      { misconception: "WRONG_RELATION", scene: commonScenes[0]! },
      { misconception: "WRONG_RELATION", scene: commonScenes[1]! },
      { misconception: "WRONG_RELATION", scene: commonScenes[2]! },
    ],
    decisiveProperty: text.decisiveProperty,
    fclCueAudit: {
      decisiveCue: "pair-relation",
      cues: {
        "pair-relation": [text.commonCue, text.commonCue, text.commonCue, text.oddCue],
        "first-shape-orientation": ["0", "45", "-45", "90"],
        "marker-count": ["2", "2", "2", "2"],
      },
    },
    explanation: {
      observation: text.observation,
      rule: text.rule,
      application: text.application,
      check: text.check,
    },
  };
}
