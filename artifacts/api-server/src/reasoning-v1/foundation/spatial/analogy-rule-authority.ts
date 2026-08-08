import type {
  SpatialAnalogyDirection,
  SpatialAnalogyFigureState,
  SpatialAnalogyMarkerPosition,
  SpatialAnalogyRuleComplexity,
  SpatialAnalogyRuleId,
  SpatialAnalogyShape,
} from "./analogy-types";

const SHAPE_CYCLE: readonly SpatialAnalogyShape[] = [
  "TRIANGLE",
  "SQUARE",
  "CIRCLE",
  "PENTAGON",
];

const CLOCKWISE_MARKER: Record<
  SpatialAnalogyMarkerPosition,
  SpatialAnalogyMarkerPosition
> = {
  TOP_LEFT: "TOP_RIGHT",
  TOP_RIGHT: "BOTTOM_RIGHT",
  BOTTOM_RIGHT: "BOTTOM_LEFT",
  BOTTOM_LEFT: "TOP_LEFT",
};

const COUNTERCLOCKWISE_MARKER: Record<
  SpatialAnalogyMarkerPosition,
  SpatialAnalogyMarkerPosition
> = {
  TOP_LEFT: "BOTTOM_LEFT",
  BOTTOM_LEFT: "BOTTOM_RIGHT",
  BOTTOM_RIGHT: "TOP_RIGHT",
  TOP_RIGHT: "TOP_LEFT",
};

const CLOCKWISE_DIRECTION: Record<
  SpatialAnalogyDirection,
  SpatialAnalogyDirection
> = {
  UP: "RIGHT",
  RIGHT: "DOWN",
  DOWN: "LEFT",
  LEFT: "UP",
};

const COUNTERCLOCKWISE_DIRECTION: Record<
  SpatialAnalogyDirection,
  SpatialAnalogyDirection
> = {
  UP: "LEFT",
  LEFT: "DOWN",
  DOWN: "RIGHT",
  RIGHT: "UP",
};

const OPPOSITE_DIRECTION: Record<
  SpatialAnalogyDirection,
  SpatialAnalogyDirection
> = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

const VERTICAL_MARKER: Record<
  SpatialAnalogyMarkerPosition,
  SpatialAnalogyMarkerPosition
> = {
  TOP_LEFT: "TOP_RIGHT",
  TOP_RIGHT: "TOP_LEFT",
  BOTTOM_RIGHT: "BOTTOM_LEFT",
  BOTTOM_LEFT: "BOTTOM_RIGHT",
};

const HORIZONTAL_MARKER: Record<
  SpatialAnalogyMarkerPosition,
  SpatialAnalogyMarkerPosition
> = {
  TOP_LEFT: "BOTTOM_LEFT",
  TOP_RIGHT: "BOTTOM_RIGHT",
  BOTTOM_RIGHT: "TOP_RIGHT",
  BOTTOM_LEFT: "TOP_LEFT",
};

const VERTICAL_DIRECTION: Record<
  SpatialAnalogyDirection,
  SpatialAnalogyDirection
> = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

const HORIZONTAL_DIRECTION: Record<
  SpatialAnalogyDirection,
  SpatialAnalogyDirection
> = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
};

export const SPATIAL_ANALOGY_INFERENCE_RULE_IDS: readonly SpatialAnalogyRuleId[] =
  [
    "ROTATE_90_CW",
    "ROTATE_90_CCW",
    "ROTATE_180",
    "REFLECT_VERTICAL",
    "REFLECT_HORIZONTAL",
    "MOVE_MARKER_CLOCKWISE",
    "MOVE_MARKER_COUNTERCLOCKWISE",
    "ADD_SEGMENT",
    "REMOVE_SEGMENT",
    "SUBSTITUTE_INNER_NEXT",
    "TOGGLE_INNER_SHADING",
    "SWAP_INNER_OUTER",
    "REVERSE_DIRECTION",
    "COMPOUND_ROTATE_90_CW_TOGGLE_SHADING",
    "COMPOUND_ROTATE_90_CCW_TOGGLE_SHADING",
    "NO_CHANGE",
  ] as const;

function cloneState(
  state: SpatialAnalogyFigureState,
): SpatialAnalogyFigureState {
  return { ...state };
}

function nextShape(shape: SpatialAnalogyShape): SpatialAnalogyShape {
  const index = SHAPE_CYCLE.indexOf(shape);
  return SHAPE_CYCLE[(index + 1) % SHAPE_CYCLE.length]!;
}

export function spatialAnalogyStateFingerprint(
  state: SpatialAnalogyFigureState,
): string {
  return [
    state.outerShape,
    state.innerShape,
    state.markerPosition,
    state.direction,
    state.shadedInner ? "SHADED" : "OPEN",
    state.segmentCount,
  ].join("|");
}

export function areSpatialAnalogyStatesEqual(
  left: SpatialAnalogyFigureState,
  right: SpatialAnalogyFigureState,
): boolean {
  return spatialAnalogyStateFingerprint(left) ===
    spatialAnalogyStateFingerprint(right);
}

export function applySpatialAnalogyRule(
  source: SpatialAnalogyFigureState,
  ruleId: SpatialAnalogyRuleId,
): SpatialAnalogyFigureState | null {
  const next = cloneState(source);

  switch (ruleId) {
    case "ROTATE_90_CW":
      next.markerPosition = CLOCKWISE_MARKER[source.markerPosition];
      next.direction = CLOCKWISE_DIRECTION[source.direction];
      return next;
    case "ROTATE_90_CCW":
      next.markerPosition = COUNTERCLOCKWISE_MARKER[source.markerPosition];
      next.direction = COUNTERCLOCKWISE_DIRECTION[source.direction];
      return next;
    case "ROTATE_180":
      next.markerPosition =
        CLOCKWISE_MARKER[CLOCKWISE_MARKER[source.markerPosition]];
      next.direction =
        CLOCKWISE_DIRECTION[CLOCKWISE_DIRECTION[source.direction]];
      return next;
    case "REFLECT_VERTICAL":
      next.markerPosition = VERTICAL_MARKER[source.markerPosition];
      next.direction = VERTICAL_DIRECTION[source.direction];
      return next;
    case "REFLECT_HORIZONTAL":
      next.markerPosition = HORIZONTAL_MARKER[source.markerPosition];
      next.direction = HORIZONTAL_DIRECTION[source.direction];
      return next;
    case "MOVE_MARKER_CLOCKWISE":
      next.markerPosition = CLOCKWISE_MARKER[source.markerPosition];
      return next;
    case "MOVE_MARKER_COUNTERCLOCKWISE":
      next.markerPosition = COUNTERCLOCKWISE_MARKER[source.markerPosition];
      return next;
    case "ADD_SEGMENT":
      if (source.segmentCount >= 4) return null;
      next.segmentCount = (source.segmentCount + 1) as 2 | 3 | 4;
      return next;
    case "REMOVE_SEGMENT":
      if (source.segmentCount <= 1) return null;
      next.segmentCount = (source.segmentCount - 1) as 1 | 2 | 3;
      return next;
    case "SUBSTITUTE_INNER_NEXT":
      next.innerShape = nextShape(source.innerShape);
      return next;
    case "TOGGLE_INNER_SHADING":
      next.shadedInner = !source.shadedInner;
      return next;
    case "SWAP_INNER_OUTER":
      next.outerShape = source.innerShape;
      next.innerShape = source.outerShape;
      return next;
    case "REVERSE_DIRECTION":
      next.direction = OPPOSITE_DIRECTION[source.direction];
      return next;
    case "COMPOUND_ROTATE_90_CW_TOGGLE_SHADING":
      next.markerPosition = CLOCKWISE_MARKER[source.markerPosition];
      next.direction = CLOCKWISE_DIRECTION[source.direction];
      next.shadedInner = !source.shadedInner;
      return next;
    case "COMPOUND_ROTATE_90_CCW_TOGGLE_SHADING":
      next.markerPosition = COUNTERCLOCKWISE_MARKER[source.markerPosition];
      next.direction = COUNTERCLOCKWISE_DIRECTION[source.direction];
      next.shadedInner = !source.shadedInner;
      return next;
    case "NO_CHANGE":
      return next;
  }
}

export function inferSpatialAnalogyRules(
  aState: SpatialAnalogyFigureState,
  bState: SpatialAnalogyFigureState,
): SpatialAnalogyRuleId[] {
  return SPATIAL_ANALOGY_INFERENCE_RULE_IDS.filter((ruleId) => {
    const result = applySpatialAnalogyRule(aState, ruleId);
    return result !== null && areSpatialAnalogyStatesEqual(result, bState);
  });
}

export function spatialAnalogyRuleComplexity(
  ruleId: SpatialAnalogyRuleId,
): SpatialAnalogyRuleComplexity {
  return ruleId.startsWith("COMPOUND_")
    ? "COMPOUND_TWO_STEP"
    : "SINGLE_STEP";
}

export function spatialAnalogyRuleDescription(
  ruleId: SpatialAnalogyRuleId,
): string {
  switch (ruleId) {
    case "ROTATE_90_CW":
      return "rotate the complete figure by 90° clockwise";
    case "ROTATE_90_CCW":
      return "rotate the complete figure by 90° anticlockwise";
    case "ROTATE_180":
      return "rotate the complete figure by 180°";
    case "REFLECT_VERTICAL":
      return "reflect the figure from left to right";
    case "REFLECT_HORIZONTAL":
      return "reflect the figure from top to bottom";
    case "MOVE_MARKER_CLOCKWISE":
      return "move only the black marker one corner clockwise";
    case "MOVE_MARKER_COUNTERCLOCKWISE":
      return "move only the black marker one corner anticlockwise";
    case "ADD_SEGMENT":
      return "add one short segment while keeping every other feature unchanged";
    case "REMOVE_SEGMENT":
      return "remove one short segment while keeping every other feature unchanged";
    case "SUBSTITUTE_INNER_NEXT":
      return "replace the inner shape with the next shape in the fixed triangle–square–circle–pentagon cycle";
    case "TOGGLE_INNER_SHADING":
      return "invert the inner shape between open and shaded";
    case "SWAP_INNER_OUTER":
      return "exchange the inner and outer shapes";
    case "REVERSE_DIRECTION":
      return "reverse the arrow direction";
    case "COMPOUND_ROTATE_90_CW_TOGGLE_SHADING":
      return "rotate the complete figure 90° clockwise and also invert the inner shading";
    case "COMPOUND_ROTATE_90_CCW_TOGGLE_SHADING":
      return "rotate the complete figure 90° anticlockwise and also invert the inner shading";
    case "NO_CHANGE":
      return "leave the figure unchanged";
  }
}
