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
  SpatialScene,
} from "./types";

export interface SpatialClassificationSceneIntegrityResult {
  ok: boolean;
  errors: string[];
}

export function buildSpatialClassificationFigureScene(
  state: SpatialAnalogyFigureState,
  id: string,
): SpatialScene {
  const scene = buildSpatialAnalogyFigureScene(state, id);
  return {
    ...scene,
    metadata: {
      ...scene.metadata,
      chapterCode: "FCL-001",
      semanticRole: "FIGURE_CLASSIFICATION_OPTION",
    },
  };
}

export function validateSpatialClassificationSceneAgainstState(
  scene: SpatialScene,
  stateInput: SpatialAnalogyFigureState,
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
  if (direction.length !== 3) errors.push("DIRECTION_NODE_COUNT");
  if (marker.length !== 1) errors.push("MARKER_COUNT");
  if (segments.length !== state.segmentCount) errors.push("SEGMENT_NODE_COUNT");

  const innerLayer = inner[0]?.layer ?? 0;
  const directionLayer = Math.min(...direction.map((node) => node.layer ?? 0));
  const markerLayer = marker[0]?.layer ?? 0;
  if (direction.length > 0 && directionLayer <= innerLayer) {
    errors.push("ARROW_NOT_ABOVE_INNER_SHAPE");
  }
  if (marker.length > 0 && markerLayer <= directionLayer) {
    errors.push("MARKER_NOT_TOPMOST");
  }

  const expectedFill = state.shadedInner
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
  };
  for (const [key, value] of Object.entries(expectedMetadata)) {
    if (metadata[key] !== value) errors.push(`METADATA_${key.toUpperCase()}_MISMATCH`);
  }
  if (metadata.chapterCode !== "FCL-001") errors.push("CHAPTER_METADATA_MISMATCH");

  return { ok: errors.length === 0, errors };
}
