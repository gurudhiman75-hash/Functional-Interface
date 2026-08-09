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
  SpatialScene,
} from "./types";

export interface SpatialClassificationSceneIntegrityResult {
  ok: boolean;
  errors: string[];
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
): SpatialNode {
  if (node.role === "inner-shape" && !profile.showShading) {
    return {
      ...node,
      style: { ...node.style, fill: SPATIAL_ANALOGY_INNER_OPEN_FILL },
    };
  }
  if (node.role === "count-segment" && node.kind === "line") {
    return {
      kind: "circle",
      id: node.id,
      role: node.role,
      layer: node.layer,
      center: {
        x: (node.start.x + node.end.x) / 2,
        y: (node.start.y + node.end.y) / 2,
      },
      radius: 2.7,
      style: { stroke: "#111", strokeWidth: 1, fill: "#111" },
      explanationTags: node.explanationTags,
    };
  }
  return node;
}

export function buildSpatialClassificationFigureScene(
  state: SpatialAnalogyFigureState,
  id: string,
  presentationProfile: SpatialClassificationPresentationProfile,
): SpatialScene {
  const scene = buildSpatialAnalogyFigureScene(state, id);
  return {
    ...scene,
    nodes: scene.nodes
      .filter((node) => classificationNodeVisible(node, presentationProfile))
      .map((node) => classificationPresentationNode(node, presentationProfile)),
    metadata: {
      ...scene.metadata,
      chapterCode: "FCL-001",
      semanticRole: "FIGURE_CLASSIFICATION_OPTION",
      showMarker: presentationProfile.showMarker,
      showDirection: presentationProfile.showDirection,
      showShading: presentationProfile.showShading,
      showSegments: presentationProfile.showSegments,
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
  const byRole = (role: string) => scene.nodes.filter((node) => node.role === role);
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
  if (marker.length > 0 && direction.length > 0 && markerLayer <= directionLayer) {
    errors.push("MARKER_NOT_TOPMOST");
  }

  const expectedFill =
    presentationProfile.showShading && state.shadedInner
      ? SPATIAL_ANALOGY_INNER_SHADED_FILL
      : SPATIAL_ANALOGY_INNER_OPEN_FILL;
  if (inner[0]?.style?.fill !== expectedFill) {
    errors.push("INNER_SHADING_MISMATCH");
  }

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
  };
  for (const [key, value] of Object.entries(expectedMetadata)) {
    if (metadata[key] !== value) errors.push(`METADATA_${key.toUpperCase()}_MISMATCH`);
  }
  if (metadata.chapterCode !== "FCL-001") errors.push("CHAPTER_METADATA_MISMATCH");

  return { ok: errors.length === 0, errors };
}
