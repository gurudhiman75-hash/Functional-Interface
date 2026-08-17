import {
  horizontalReflectionTransform,
  rotationTransform,
  translationTransform,
  verticalReflectionTransform,
  type AffineTransform,
} from "./geometry";
import { spatialSceneSemanticFingerprint } from "./normalize";
import {
  reflectSceneHorizontally,
  reflectSceneVertically,
  rotateScene,
  transformNode,
  translateScene,
} from "./transform";
import type { SpatialNode, SpatialPoint, SpatialScene } from "./types";

function assertFinitePoint(point: SpatialPoint, label: string): void {
  if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
    throw new Error(`${label} must contain finite coordinates.`);
  }
}

function assertSelection(scene: SpatialScene, nodeIds: readonly string[]): Set<string> {
  if (nodeIds.length === 0) throw new Error("At least one spatial node must be selected.");
  const selected = new Set(nodeIds);
  if (selected.size !== nodeIds.length) throw new Error("Selected spatial node IDs must be unique.");
  const sceneIds = new Set(scene.nodes.map((node) => node.id));
  for (const nodeId of selected) {
    if (!sceneIds.has(nodeId)) throw new Error(`Spatial node '${nodeId}' does not exist in scene '${scene.id}'.`);
  }
  return selected;
}

function copySceneWithNodes(scene: SpatialScene, nodes: SpatialNode[], nextId: string): SpatialScene {
  return {
    ...scene,
    id: nextId,
    nodes,
    metadata: scene.metadata ? { ...scene.metadata } : undefined,
  };
}

export function spatialNodeCenterV1(node: SpatialNode): SpatialPoint {
  switch (node.kind) {
    case "line":
      return { x: (node.start.x + node.end.x) / 2, y: (node.start.y + node.end.y) / 2 };
    case "circle":
    case "arc":
      return { ...node.center };
    case "polygon":
    case "polyline": {
      const sum = node.points.reduce(
        (acc, point) => ({ x: acc.x + point.x, y: acc.y + point.y }),
        { x: 0, y: 0 },
      );
      return { x: sum.x / node.points.length, y: sum.y / node.points.length };
    }
  }
}

export function spatialSceneCenterV1(scene: SpatialScene): SpatialPoint {
  if (scene.nodes.length === 0) {
    return {
      x: scene.viewBox.minX + scene.viewBox.width / 2,
      y: scene.viewBox.minY + scene.viewBox.height / 2,
    };
  }
  const centers = scene.nodes.map(spatialNodeCenterV1);
  const sum = centers.reduce(
    (acc, point) => ({ x: acc.x + point.x, y: acc.y + point.y }),
    { x: 0, y: 0 },
  );
  return { x: sum.x / centers.length, y: sum.y / centers.length };
}

export function transformSelectedSpatialNodesV1(
  scene: SpatialScene,
  nodeIds: readonly string[],
  transform: AffineTransform,
  nextId = scene.id,
): SpatialScene {
  const selected = assertSelection(scene, nodeIds);
  return copySceneWithNodes(
    scene,
    scene.nodes.map((node) => (selected.has(node.id) ? transformNode(node, transform) : { ...node })),
    nextId,
  );
}

export function rotateSelectedSpatialNodesV1(
  scene: SpatialScene,
  nodeIds: readonly string[],
  angleDeg: number,
  pivot: SpatialPoint,
  nextId = scene.id,
): SpatialScene {
  if (!Number.isFinite(angleDeg)) throw new Error("Selected-node rotation angle must be finite.");
  assertFinitePoint(pivot, "Selected-node rotation pivot");
  return transformSelectedSpatialNodesV1(scene, nodeIds, rotationTransform(angleDeg, pivot), nextId);
}

export function reflectSelectedSpatialNodesV1(
  scene: SpatialScene,
  nodeIds: readonly string[],
  axis: "VERTICAL" | "HORIZONTAL",
  axisValue: number,
  nextId = scene.id,
): SpatialScene {
  if (!Number.isFinite(axisValue)) throw new Error("Selected-node reflection axis must be finite.");
  const transform = axis === "VERTICAL"
    ? verticalReflectionTransform(axisValue)
    : horizontalReflectionTransform(axisValue);
  return transformSelectedSpatialNodesV1(scene, nodeIds, transform, nextId);
}

export function translateSelectedSpatialNodesV1(
  scene: SpatialScene,
  nodeIds: readonly string[],
  dx: number,
  dy: number,
  nextId = scene.id,
): SpatialScene {
  if (!Number.isFinite(dx) || !Number.isFinite(dy)) {
    throw new Error("Selected-node translation offsets must be finite.");
  }
  return transformSelectedSpatialNodesV1(scene, nodeIds, translationTransform(dx, dy), nextId);
}

function scalePoint(point: SpatialPoint, factor: number, pivot: SpatialPoint): SpatialPoint {
  return {
    x: pivot.x + (point.x - pivot.x) * factor,
    y: pivot.y + (point.y - pivot.y) * factor,
  };
}

function scaleSpatialNodeV1(node: SpatialNode, factor: number, pivot: SpatialPoint): SpatialNode {
  switch (node.kind) {
    case "line":
      return { ...node, start: scalePoint(node.start, factor, pivot), end: scalePoint(node.end, factor, pivot) };
    case "circle":
      return { ...node, center: scalePoint(node.center, factor, pivot), radius: node.radius * factor };
    case "polygon":
    case "polyline":
      return { ...node, points: node.points.map((point) => scalePoint(point, factor, pivot)) };
    case "arc":
      return { ...node, center: scalePoint(node.center, factor, pivot), radius: node.radius * factor };
  }
}

export function scaleSelectedSpatialNodesV1(
  scene: SpatialScene,
  nodeIds: readonly string[],
  factor: number,
  pivot: SpatialPoint,
  nextId = scene.id,
): SpatialScene {
  if (!(Number.isFinite(factor) && factor > 0)) {
    throw new Error("Selected-node scale factor must be a positive finite number.");
  }
  assertFinitePoint(pivot, "Selected-node scale pivot");
  const selected = assertSelection(scene, nodeIds);
  return copySceneWithNodes(
    scene,
    scene.nodes.map((node) => selected.has(node.id) ? scaleSpatialNodeV1(node, factor, pivot) : { ...node }),
    nextId,
  );
}

export function cycleSelectedSpatialNodePositionsV1(
  scene: SpatialScene,
  nodeIds: readonly string[],
  nextId = scene.id,
): SpatialScene {
  const selected = assertSelection(scene, nodeIds);
  if (nodeIds.length < 2) throw new Error("Position cycling requires at least two selected nodes.");
  const byId = new Map(scene.nodes.map((node) => [node.id, node] as const));
  const centers = nodeIds.map((nodeId) => spatialNodeCenterV1(byId.get(nodeId)!));
  const targetById = new Map<string, SpatialPoint>();
  nodeIds.forEach((nodeId, index) => targetById.set(nodeId, centers[(index + 1) % centers.length]!));
  return copySceneWithNodes(
    scene,
    scene.nodes.map((node) => {
      if (!selected.has(node.id)) return { ...node };
      const source = spatialNodeCenterV1(node);
      const target = targetById.get(node.id)!;
      return transformNode(node, translationTransform(target.x - source.x, target.y - source.y));
    }),
    nextId,
  );
}

export function setSelectedSpatialFillV1(
  scene: SpatialScene,
  nodeIds: readonly string[],
  fill: string,
  nextId = scene.id,
): SpatialScene {
  const selected = assertSelection(scene, nodeIds);
  if (!fill.trim()) throw new Error("Spatial fill value must not be empty.");
  return copySceneWithNodes(
    scene,
    scene.nodes.map((node) => selected.has(node.id)
      ? { ...node, style: { ...(node.style ?? {}), fill } }
      : { ...node }),
    nextId,
  );
}

export function removeSelectedSpatialNodesV1(
  scene: SpatialScene,
  nodeIds: readonly string[],
  nextId = scene.id,
): SpatialScene {
  const selected = assertSelection(scene, nodeIds);
  return copySceneWithNodes(scene, scene.nodes.filter((node) => !selected.has(node.id)).map((node) => ({ ...node })), nextId);
}

export function duplicateSelectedSpatialNodesV1(
  scene: SpatialScene,
  nodeIds: readonly string[],
  dx: number,
  dy: number,
  idSuffix: string,
  nextId = scene.id,
): SpatialScene {
  const selected = assertSelection(scene, nodeIds);
  if (!idSuffix.trim()) throw new Error("Duplicated spatial nodes require a non-empty ID suffix.");
  const copies = scene.nodes
    .filter((node) => selected.has(node.id))
    .map((node) => ({
      ...transformNode(node, translationTransform(dx, dy)),
      id: `${node.id}-${idSuffix}`,
    }));
  return copySceneWithNodes(scene, [...scene.nodes.map((node) => ({ ...node })), ...copies], nextId);
}

export function replaceSpatialNodeV1(
  scene: SpatialScene,
  nodeId: string,
  replacement: SpatialNode,
  nextId = scene.id,
): SpatialScene {
  assertSelection(scene, [nodeId]);
  if (replacement.id !== nodeId) {
    throw new Error(`Replacement node ID '${replacement.id}' must preserve '${nodeId}'.`);
  }
  return copySceneWithNodes(
    scene,
    scene.nodes.map((node) => node.id === nodeId ? { ...replacement } : { ...node }),
    nextId,
  );
}

export function extractSpatialNodeSubsetV1(
  scene: SpatialScene,
  nodeIds: readonly string[],
  nextId = scene.id,
): SpatialScene {
  const selected = assertSelection(scene, nodeIds);
  return copySceneWithNodes(
    scene,
    scene.nodes.filter((node) => selected.has(node.id)).map((node) => ({ ...node })),
    nextId,
  );
}

export function centerSpatialSceneV1(scene: SpatialScene, nextId = scene.id): SpatialScene {
  const center = spatialSceneCenterV1(scene);
  return translateScene(scene, -center.x, -center.y, nextId);
}

export function spatialRotationOrbitFingerprintV1(scene: SpatialScene): string {
  const centered = centerSpatialSceneV1(scene, `${scene.id}-centered`);
  const fingerprints = [0, 90, 180, 270].map((angle) =>
    spatialSceneSemanticFingerprint(rotateScene(centered, angle, { x: 0, y: 0 }, `${scene.id}-orbit-${angle}`)),
  );
  return fingerprints.sort()[0]!;
}

export type SpatialCenteredTransformRelationV1 =
  | "SAME"
  | "ROTATE_90"
  | "ROTATE_180"
  | "REFLECT_VERTICAL"
  | "REFLECT_HORIZONTAL";

export function inferCenteredSubfigureTransformRelationsV1(
  left: SpatialScene,
  right: SpatialScene,
): SpatialCenteredTransformRelationV1[] {
  const centeredLeft = centerSpatialSceneV1(left, `${left.id}-centered`);
  const centeredRight = centerSpatialSceneV1(right, `${right.id}-centered`);
  const target = spatialSceneSemanticFingerprint(centeredRight);
  const candidates: readonly [SpatialCenteredTransformRelationV1, SpatialScene][] = [
    ["SAME", centeredLeft],
    ["ROTATE_90", rotateScene(centeredLeft, 90, { x: 0, y: 0 }, `${left.id}-r90`)],
    ["ROTATE_180", rotateScene(centeredLeft, 180, { x: 0, y: 0 }, `${left.id}-r180`)],
    ["REFLECT_VERTICAL", reflectSceneVertically(centeredLeft, 0, `${left.id}-rv`)],
    ["REFLECT_HORIZONTAL", reflectSceneHorizontally(centeredLeft, 0, `${left.id}-rh`)],
  ];
  return candidates.filter(([, candidate]) => spatialSceneSemanticFingerprint(candidate) === target).map(([relation]) => relation);
}

export function countSpatialNodesByRoleV1(scene: SpatialScene, rolePrefix: string): number {
  return scene.nodes.filter((node) => (node.role ?? "").startsWith(rolePrefix)).length;
}

export function filledSpatialNodeCountV1(scene: SpatialScene): number {
  return scene.nodes.filter((node) => {
    const fill = node.style?.fill?.trim().toLowerCase();
    return fill !== undefined && fill !== "none" && fill !== "transparent";
  }).length;
}

export function spatialNodeExtentV1(node: SpatialNode): number {
  switch (node.kind) {
    case "circle":
    case "arc":
      return node.radius * 2;
    case "line":
      return Math.hypot(node.end.x - node.start.x, node.end.y - node.start.y);
    case "polygon":
    case "polyline": {
      const xs = node.points.map((point) => point.x);
      const ys = node.points.map((point) => point.y);
      return Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
    }
  }
}

export type SpatialRelativePositionV1 =
  | "CENTER"
  | "TOP"
  | "TOP_RIGHT"
  | "RIGHT"
  | "BOTTOM_RIGHT"
  | "BOTTOM"
  | "BOTTOM_LEFT"
  | "LEFT"
  | "TOP_LEFT";

export function classifySpatialRelativePositionV1(
  point: SpatialPoint,
  center: SpatialPoint,
): SpatialRelativePositionV1 {
  assertFinitePoint(point, "Relative-position point");
  assertFinitePoint(center, "Relative-position center");
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  const ax = Math.abs(dx);
  const ay = Math.abs(dy);
  if (ax < 1e-9 && ay < 1e-9) return "CENTER";
  if (ax <= ay * 0.35) return dy < 0 ? "TOP" : "BOTTOM";
  if (ay <= ax * 0.35) return dx > 0 ? "RIGHT" : "LEFT";
  if (dx > 0 && dy < 0) return "TOP_RIGHT";
  if (dx > 0 && dy > 0) return "BOTTOM_RIGHT";
  if (dx < 0 && dy > 0) return "BOTTOM_LEFT";
  return "TOP_LEFT";
}

export type SpatialGapOperationV1 =
  | { kind: "ROTATE_SELECTED"; nodeIds: readonly string[]; angleDeg: number; pivot: SpatialPoint }
  | { kind: "REFLECT_SELECTED"; nodeIds: readonly string[]; axis: "VERTICAL" | "HORIZONTAL"; axisValue: number }
  | { kind: "TRANSLATE_SELECTED"; nodeIds: readonly string[]; dx: number; dy: number }
  | { kind: "SCALE_SELECTED"; nodeIds: readonly string[]; factor: number; pivot: SpatialPoint }
  | { kind: "CYCLE_POSITIONS"; nodeIds: readonly string[] }
  | { kind: "SET_FILL"; nodeIds: readonly string[]; fill: string }
  | { kind: "REMOVE_SELECTED"; nodeIds: readonly string[] }
  | { kind: "DUPLICATE_SELECTED"; nodeIds: readonly string[]; dx: number; dy: number; idSuffix: string }
  | { kind: "REPLACE_NODE"; nodeId: string; replacement: SpatialNode };

export function applySpatialGapOperationV1(
  scene: SpatialScene,
  operation: SpatialGapOperationV1,
  nextId = scene.id,
): SpatialScene {
  switch (operation.kind) {
    case "ROTATE_SELECTED":
      return rotateSelectedSpatialNodesV1(scene, operation.nodeIds, operation.angleDeg, operation.pivot, nextId);
    case "REFLECT_SELECTED":
      return reflectSelectedSpatialNodesV1(scene, operation.nodeIds, operation.axis, operation.axisValue, nextId);
    case "TRANSLATE_SELECTED":
      return translateSelectedSpatialNodesV1(scene, operation.nodeIds, operation.dx, operation.dy, nextId);
    case "SCALE_SELECTED":
      return scaleSelectedSpatialNodesV1(scene, operation.nodeIds, operation.factor, operation.pivot, nextId);
    case "CYCLE_POSITIONS":
      return cycleSelectedSpatialNodePositionsV1(scene, operation.nodeIds, nextId);
    case "SET_FILL":
      return setSelectedSpatialFillV1(scene, operation.nodeIds, operation.fill, nextId);
    case "REMOVE_SELECTED":
      return removeSelectedSpatialNodesV1(scene, operation.nodeIds, nextId);
    case "DUPLICATE_SELECTED":
      return duplicateSelectedSpatialNodesV1(scene, operation.nodeIds, operation.dx, operation.dy, operation.idSuffix, nextId);
    case "REPLACE_NODE":
      return replaceSpatialNodeV1(scene, operation.nodeId, operation.replacement, nextId);
  }
}

export function applySpatialGapPipelineV1(
  scene: SpatialScene,
  operations: readonly SpatialGapOperationV1[],
  nextId = scene.id,
): SpatialScene {
  return operations.reduce(
    (current, operation, index) => applySpatialGapOperationV1(current, operation, `${nextId}-step-${index + 1}`),
    scene,
  );
}
