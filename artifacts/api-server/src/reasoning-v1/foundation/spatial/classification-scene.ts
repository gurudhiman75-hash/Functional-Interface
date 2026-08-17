import {
  buildSpatialAnalogyFigureScene,
  SPATIAL_ANALOGY_INNER_OPEN_FILL,
  SPATIAL_ANALOGY_INNER_SHADED_FILL,
} from "./analogy-scene";
import {
  normalizeSpatialAnalogyState,
} from "./analogy-rule-authority";
import type {
  SpatialAnalogyFigureState,
} from "./analogy-types";
import type {
  SpatialClassificationPresentationProfile,
} from "./classification-types";
import type {
  SpatialNode,
  SpatialPoint,
  SpatialScene,
} from "./types";

export interface SpatialClassificationSceneIntegrityResult {
  ok: boolean;
  errors: string[];
}

const FIGURE_CENTER: SpatialPoint = { x: 50, y: 50 };
const TRIANGLE_CONTAINER_INNER_SCALE = 0.7;

function classificationInnerPresentationScale(
  state: SpatialAnalogyFigureState,
): number {
  return state.outerShape === "TRIANGLE"
    ? TRIANGLE_CONTAINER_INNER_SCALE
    : 1;
}

function scalePointFromCenter(point: SpatialPoint, scale: number): SpatialPoint {
  return {
    x: FIGURE_CENTER.x + (point.x - FIGURE_CENTER.x) * scale,
    y: FIGURE_CENTER.y + (point.y - FIGURE_CENTER.y) * scale,
  };
}

function scaleInnerShapeNode(node: SpatialNode, scale: number): SpatialNode {
  if (node.role !== "inner-shape" || scale === 1) return node;

  switch (node.kind) {
    case "circle":
      return {
        ...node,
        center: scalePointFromCenter(node.center, scale),
        radius: node.radius * scale,
      };
    case "polygon":
      return {
        ...node,
        points: node.points.map((point) =>
          scalePointFromCenter(point, scale),
        ),
      };
    case "polyline":
      return {
        ...node,
        points: node.points.map((point) =>
          scalePointFromCenter(point, scale),
        ),
      };
    case "line":
      return {
        ...node,
        start: scalePointFromCenter(node.start, scale),
        end: scalePointFromCenter(node.end, scale),
      };
    case "arc":
      return {
        ...node,
        center: scalePointFromCenter(node.center, scale),
        radius: node.radius * scale,
      };
  }
}

function classificationNodeVisible(
  node: SpatialNode,
  profile: SpatialClassificationPresentationProfile,
): boolean {
  if (node.role === "direction-indicator") return profile.showDirection;
  if (node.role === "distinguishing-marker") return profile.showMarker;
  if (node.role === "count-segment") return profile.showSegments;
  return true;
}

function classificationPresentationNode(
  node: SpatialNode,
  profile: SpatialClassificationPresentationProfile,
  innerPresentationScale: number,
): SpatialNode {
  const scaledNode = scaleInnerShapeNode(node, innerPresentationScale);

  if (scaledNode.role === "inner-shape" && !profile.showShading) {
    return {
      ...scaledNode,
      style: {
        ...scaledNode.style,
        fill: SPATIAL_ANALOGY_INNER_OPEN_FILL,
      },
    };
  }
  if (scaledNode.role === "count-segment" && scaledNode.kind === "line") {
    return {
      kind: "circle",
      id: scaledNode.id,
      role: scaledNode.role,
      layer: scaledNode.layer,
      center: {
        x: (scaledNode.start.x + scaledNode.end.x) / 2,
        y: (scaledNode.start.y + scaledNode.end.y) / 2,
      },
      radius: 2.7,
      style: { stroke: "#111", strokeWidth: 1, fill: "#111" },
      explanationTags: scaledNode.explanationTags,
    };
  }
  return scaledNode;
}

export function buildSpatialClassificationFigureScene(
  state: SpatialAnalogyFigureState,
  id: string,
  presentationProfile: SpatialClassificationPresentationProfile,
): SpatialScene {
  const scene = buildSpatialAnalogyFigureScene(state, id);
  const innerPresentationScale = classificationInnerPresentationScale(state);
  return {
    ...scene,
    nodes: scene.nodes
      .filter((node) => classificationNodeVisible(node, presentationProfile))
      .map((node) =>
        classificationPresentationNode(
          node,
          presentationProfile,
          innerPresentationScale,
        ),
      ),
    metadata: {
      ...scene.metadata,
      chapterCode: "FCL-001",
      semanticRole: "FIGURE_CLASSIFICATION_OPTION",
      showMarker: presentationProfile.showMarker,
      showDirection: presentationProfile.showDirection,
      showShading: presentationProfile.showShading,
      showSegments: presentationProfile.showSegments,
      innerPresentationScale,
    },
  };
}

export function validateSpatialClassificationSceneAgainstState(
  scene: SpatialScene,
  stateInput: SpatialAnalogyFigureState,
  presentationProfile: SpatialClassificationPresentationProfile,
): SpatialClassificationSceneIntegrityResult {
  const state = normalizeSpatialAnalogyState(stateInput);
  const errors: string[] = [];
  const byRole = (role: string) =>
    scene.nodes.filter((node) => node.role === role);
  const outer = byRole("outer-shape");
  const inner = byRole("inner-shape");
  const direction = byRole("direction-indicator");
  const marker = byRole("distinguishing-marker");
  const segments = byRole("count-segment");

  if (outer.length !== 1) errors.push("OUTER_SHAPE_COUNT");
  if (inner.length !== 1) errors.push("INNER_SHAPE_COUNT");
  if (direction.length !== (presentationProfile.showDirection ? 3 : 0)) {
    errors.push("DIRECTION_NODE_COUNT");
  }
  if (marker.length !== (presentationProfile.showMarker ? 1 : 0)) {
    errors.push("MARKER_COUNT");
  }
  if (
    segments.length !==
    (presentationProfile.showSegments ? state.segmentCount : 0)
  ) {
    errors.push("SEGMENT_NODE_COUNT");
  }
  if (
    presentationProfile.showSegments &&
    segments.some((node) => node.kind !== "circle")
  ) {
    errors.push("COUNT_MARK_NOT_DOT");
  }

  const innerLayer = inner[0]?.layer ?? 0;
  const directionLayer =
    direction.length > 0
      ? Math.min(...direction.map((node) => node.layer ?? 0))
      : 0;
  const markerLayer = marker[0]?.layer ?? 0;
  if (direction.length > 0 && directionLayer <= innerLayer) {
    errors.push("ARROW_NOT_ABOVE_INNER_SHAPE");
  }
  if (
    marker.length > 0 &&
    direction.length > 0 &&
    markerLayer <= directionLayer
  ) {
    errors.push("MARKER_NOT_TOPMOST");
  }

  const expectedFill =
    presentationProfile.showShading && state.shadedInner
      ? SPATIAL_ANALOGY_INNER_SHADED_FILL
      : SPATIAL_ANALOGY_INNER_OPEN_FILL;
  if (inner[0]?.style?.fill !== expectedFill) {
    errors.push("INNER_SHADING_MISMATCH");
  }

  const innerPresentationScale = classificationInnerPresentationScale(state);
  const metadata = scene.metadata ?? {};
  const expectedMetadata: Record<string, string | number | boolean> = {
    outerShape: state.outerShape,
    innerShape: state.innerShape,
    outerRotationQuarter: state.outerRotationQuarter,
    innerRotationQuarter: state.innerRotationQuarter,
    markerPosition: state.markerPosition,
    direction: state.direction,
    shadedInner: state.shadedInner,
    segmentCount: state.segmentCount,
    segmentAnchor: state.segmentAnchor,
    showMarker: presentationProfile.showMarker,
    showDirection: presentationProfile.showDirection,
    showShading: presentationProfile.showShading,
    showSegments: presentationProfile.showSegments,
    innerPresentationScale,
  };
  for (const [key, value] of Object.entries(expectedMetadata)) {
    if (metadata[key] !== value) {
      errors.push(`METADATA_${key.toUpperCase()}_MISMATCH`);
    }
  }
  if (metadata.chapterCode !== "FCL-001") {
    errors.push("CHAPTER_METADATA_MISMATCH");
  }

  return { ok: errors.length === 0, errors };
}
