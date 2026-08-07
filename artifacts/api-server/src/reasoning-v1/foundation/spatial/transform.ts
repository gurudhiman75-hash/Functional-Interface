import {
  angleFromCenter,
  applyAffineTransform,
  determinant,
  horizontalReflectionTransform,
  isRigidTransform,
  pointAtAngle,
  reflectionAcrossLineTransform,
  rotationTransform,
  translationTransform,
  verticalReflectionTransform,
  type AffineTransform,
} from "./geometry";
import type {
  SpatialArcNode,
  SpatialNode,
  SpatialPoint,
  SpatialScene,
} from "./types";

function transformArc(
  node: SpatialArcNode,
  transform: AffineTransform,
): SpatialArcNode {
  const center = applyAffineTransform(node.center, transform);
  const startPoint = applyAffineTransform(
    pointAtAngle(node.center, node.radius, node.startAngleDeg),
    transform,
  );
  const endPoint = applyAffineTransform(
    pointAtAngle(node.center, node.radius, node.endAngleDeg),
    transform,
  );
  const reversesOrientation = determinant(transform) < 0;

  return {
    ...node,
    center,
    startAngleDeg: angleFromCenter(center, startPoint),
    endAngleDeg: angleFromCenter(center, endPoint),
    sweep: reversesOrientation
      ? node.sweep === "clockwise"
        ? "counterclockwise"
        : "clockwise"
      : node.sweep,
  };
}

export function transformNode(
  node: SpatialNode,
  transform: AffineTransform,
): SpatialNode {
  if (!isRigidTransform(transform)) {
    throw new Error(
      "Spatial foundation currently accepts rigid transforms only (translation, rotation and reflection).",
    );
  }

  switch (node.kind) {
    case "line":
      return {
        ...node,
        start: applyAffineTransform(node.start, transform),
        end: applyAffineTransform(node.end, transform),
      };
    case "circle":
      return {
        ...node,
        center: applyAffineTransform(node.center, transform),
      };
    case "polygon":
    case "polyline":
      return {
        ...node,
        points: node.points.map((point) =>
          applyAffineTransform(point, transform),
        ),
      };
    case "arc":
      return transformArc(node, transform);
  }
}

export function transformScene(
  scene: SpatialScene,
  transform: AffineTransform,
  nextId = scene.id,
): SpatialScene {
  return {
    ...scene,
    id: nextId,
    nodes: scene.nodes.map((node) => transformNode(node, transform)),
    metadata: scene.metadata ? { ...scene.metadata } : undefined,
  };
}

export function translateScene(
  scene: SpatialScene,
  dx: number,
  dy: number,
  nextId = scene.id,
): SpatialScene {
  return transformScene(scene, translationTransform(dx, dy), nextId);
}

export function rotateScene(
  scene: SpatialScene,
  angleDeg: number,
  pivot: SpatialPoint,
  nextId = scene.id,
): SpatialScene {
  return transformScene(scene, rotationTransform(angleDeg, pivot), nextId);
}

export function reflectSceneAcrossLine(
  scene: SpatialScene,
  lineStart: SpatialPoint,
  lineEnd: SpatialPoint,
  nextId = scene.id,
): SpatialScene {
  return transformScene(
    scene,
    reflectionAcrossLineTransform(lineStart, lineEnd),
    nextId,
  );
}

export function reflectSceneVertically(
  scene: SpatialScene,
  axisX: number,
  nextId = scene.id,
): SpatialScene {
  return transformScene(scene, verticalReflectionTransform(axisX), nextId);
}

export function reflectSceneHorizontally(
  scene: SpatialScene,
  axisY: number,
  nextId = scene.id,
): SpatialScene {
  return transformScene(scene, horizontalReflectionTransform(axisY), nextId);
}
