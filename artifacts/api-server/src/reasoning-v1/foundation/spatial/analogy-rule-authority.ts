import type {
  SpatialAnalogyDirection,
  SpatialAnalogyFigureState,
  SpatialAnalogyMarkerPosition,
  SpatialAnalogyQuarterTurn,
  SpatialAnalogyRuleComplexity,
  SpatialAnalogyRuleId,
  SpatialAnalogySegmentAnchor,
  SpatialAnalogyShape,
} from "./analogy-types";

const SHAPE_CYCLE: readonly SpatialAnalogyShape[] = ["TRIANGLE", "SQUARE", "CIRCLE", "PENTAGON"];
const CW_MARKER: Record<SpatialAnalogyMarkerPosition, SpatialAnalogyMarkerPosition> = { TOP_LEFT: "TOP_RIGHT", TOP_RIGHT: "BOTTOM_RIGHT", BOTTOM_RIGHT: "BOTTOM_LEFT", BOTTOM_LEFT: "TOP_LEFT" };
const CCW_MARKER: Record<SpatialAnalogyMarkerPosition, SpatialAnalogyMarkerPosition> = { TOP_LEFT: "BOTTOM_LEFT", BOTTOM_LEFT: "BOTTOM_RIGHT", BOTTOM_RIGHT: "TOP_RIGHT", TOP_RIGHT: "TOP_LEFT" };
const CW_DIRECTION: Record<SpatialAnalogyDirection, SpatialAnalogyDirection> = { UP: "RIGHT", RIGHT: "DOWN", DOWN: "LEFT", LEFT: "UP" };
const CCW_DIRECTION: Record<SpatialAnalogyDirection, SpatialAnalogyDirection> = { UP: "LEFT", LEFT: "DOWN", DOWN: "RIGHT", RIGHT: "UP" };
const OPPOSITE_DIRECTION: Record<SpatialAnalogyDirection, SpatialAnalogyDirection> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
const CW_ANCHOR: Record<SpatialAnalogySegmentAnchor, SpatialAnalogySegmentAnchor> = { TOP: "RIGHT", RIGHT: "BOTTOM", BOTTOM: "LEFT", LEFT: "TOP" };
const CCW_ANCHOR: Record<SpatialAnalogySegmentAnchor, SpatialAnalogySegmentAnchor> = { TOP: "LEFT", LEFT: "BOTTOM", BOTTOM: "RIGHT", RIGHT: "TOP" };
const V_MARKER: Record<SpatialAnalogyMarkerPosition, SpatialAnalogyMarkerPosition> = { TOP_LEFT: "TOP_RIGHT", TOP_RIGHT: "TOP_LEFT", BOTTOM_RIGHT: "BOTTOM_LEFT", BOTTOM_LEFT: "BOTTOM_RIGHT" };
const H_MARKER: Record<SpatialAnalogyMarkerPosition, SpatialAnalogyMarkerPosition> = { TOP_LEFT: "BOTTOM_LEFT", TOP_RIGHT: "BOTTOM_RIGHT", BOTTOM_RIGHT: "TOP_RIGHT", BOTTOM_LEFT: "TOP_LEFT" };
const V_DIRECTION: Record<SpatialAnalogyDirection, SpatialAnalogyDirection> = { UP: "UP", DOWN: "DOWN", LEFT: "RIGHT", RIGHT: "LEFT" };
const H_DIRECTION: Record<SpatialAnalogyDirection, SpatialAnalogyDirection> = { UP: "DOWN", DOWN: "UP", LEFT: "LEFT", RIGHT: "RIGHT" };
const V_ANCHOR: Record<SpatialAnalogySegmentAnchor, SpatialAnalogySegmentAnchor> = { TOP: "TOP", RIGHT: "LEFT", BOTTOM: "BOTTOM", LEFT: "RIGHT" };
const H_ANCHOR: Record<SpatialAnalogySegmentAnchor, SpatialAnalogySegmentAnchor> = { TOP: "BOTTOM", RIGHT: "RIGHT", BOTTOM: "TOP", LEFT: "LEFT" };

export const SPATIAL_ANALOGY_INFERENCE_RULE_IDS: readonly SpatialAnalogyRuleId[] = [
  "ROTATE_90_CW", "ROTATE_90_CCW", "ROTATE_180", "REFLECT_VERTICAL", "REFLECT_HORIZONTAL",
  "MOVE_MARKER_CLOCKWISE", "MOVE_MARKER_COUNTERCLOCKWISE", "ADD_SEGMENT", "REMOVE_SEGMENT",
  "SUBSTITUTE_INNER_NEXT", "TOGGLE_INNER_SHADING", "SWAP_INNER_OUTER", "REVERSE_DIRECTION",
  "COMPOUND_ROTATE_90_CW_TOGGLE_SHADING", "COMPOUND_ROTATE_90_CCW_TOGGLE_SHADING", "NO_CHANGE",
] as const;

function q(value: number): SpatialAnalogyQuarterTurn {
  return (((value % 4) + 4) % 4) as SpatialAnalogyQuarterTurn;
}

export function canonicalSpatialAnalogyShapeQuarter(shape: SpatialAnalogyShape, quarter: number): SpatialAnalogyQuarterTurn {
  return shape === "CIRCLE" || shape === "SQUARE" ? 0 : q(quarter);
}

export function normalizeSpatialAnalogyState(state: SpatialAnalogyFigureState): SpatialAnalogyFigureState {
  return {
    ...state,
    outerRotationQuarter: canonicalSpatialAnalogyShapeQuarter(state.outerShape, state.outerRotationQuarter),
    innerRotationQuarter: canonicalSpatialAnalogyShapeQuarter(state.innerShape, state.innerRotationQuarter),
  };
}

function nextShape(shape: SpatialAnalogyShape): SpatialAnalogyShape {
  return SHAPE_CYCLE[(SHAPE_CYCLE.indexOf(shape) + 1) % SHAPE_CYCLE.length]!;
}

function rotateShape(shape: SpatialAnalogyShape, quarter: SpatialAnalogyQuarterTurn, delta: number): SpatialAnalogyQuarterTurn {
  return canonicalSpatialAnalogyShapeQuarter(shape, quarter + delta);
}

function reflectVShape(shape: SpatialAnalogyShape, quarter: SpatialAnalogyQuarterTurn): SpatialAnalogyQuarterTurn {
  return canonicalSpatialAnalogyShapeQuarter(shape, -quarter);
}

function reflectHShape(shape: SpatialAnalogyShape, quarter: SpatialAnalogyQuarterTurn): SpatialAnalogyQuarterTurn {
  return canonicalSpatialAnalogyShapeQuarter(shape, 2 - quarter);
}

export function spatialAnalogyStateFingerprint(stateInput: SpatialAnalogyFigureState): string {
  const state = normalizeSpatialAnalogyState(stateInput);
  return [state.outerShape, `OUTER_Q${state.outerRotationQuarter}`, state.innerShape, `INNER_Q${state.innerRotationQuarter}`, state.markerPosition, state.direction, state.shadedInner ? "SHADED" : "OPEN", state.segmentCount, state.segmentAnchor].join("|");
}

export function areSpatialAnalogyStatesEqual(left: SpatialAnalogyFigureState, right: SpatialAnalogyFigureState): boolean {
  return spatialAnalogyStateFingerprint(left) === spatialAnalogyStateFingerprint(right);
}

export function applySpatialAnalogyRule(sourceInput: SpatialAnalogyFigureState, ruleId: SpatialAnalogyRuleId): SpatialAnalogyFigureState | null {
  const source = normalizeSpatialAnalogyState(sourceInput);
  const next = { ...source };
  switch (ruleId) {
    case "ROTATE_90_CW":
      next.outerRotationQuarter = rotateShape(source.outerShape, source.outerRotationQuarter, 1);
      next.innerRotationQuarter = rotateShape(source.innerShape, source.innerRotationQuarter, 1);
      next.markerPosition = CW_MARKER[source.markerPosition];
      next.direction = CW_DIRECTION[source.direction];
      next.segmentAnchor = CW_ANCHOR[source.segmentAnchor];
      return next;
    case "ROTATE_90_CCW":
      next.outerRotationQuarter = rotateShape(source.outerShape, source.outerRotationQuarter, -1);
      next.innerRotationQuarter = rotateShape(source.innerShape, source.innerRotationQuarter, -1);
      next.markerPosition = CCW_MARKER[source.markerPosition];
      next.direction = CCW_DIRECTION[source.direction];
      next.segmentAnchor = CCW_ANCHOR[source.segmentAnchor];
      return next;
    case "ROTATE_180":
      next.outerRotationQuarter = rotateShape(source.outerShape, source.outerRotationQuarter, 2);
      next.innerRotationQuarter = rotateShape(source.innerShape, source.innerRotationQuarter, 2);
      next.markerPosition = CW_MARKER[CW_MARKER[source.markerPosition]];
      next.direction = CW_DIRECTION[CW_DIRECTION[source.direction]];
      next.segmentAnchor = CW_ANCHOR[CW_ANCHOR[source.segmentAnchor]];
      return next;
    case "REFLECT_VERTICAL":
      next.outerRotationQuarter = reflectVShape(source.outerShape, source.outerRotationQuarter);
      next.innerRotationQuarter = reflectVShape(source.innerShape, source.innerRotationQuarter);
      next.markerPosition = V_MARKER[source.markerPosition];
      next.direction = V_DIRECTION[source.direction];
      next.segmentAnchor = V_ANCHOR[source.segmentAnchor];
      return next;
    case "REFLECT_HORIZONTAL":
      next.outerRotationQuarter = reflectHShape(source.outerShape, source.outerRotationQuarter);
      next.innerRotationQuarter = reflectHShape(source.innerShape, source.innerRotationQuarter);
      next.markerPosition = H_MARKER[source.markerPosition];
      next.direction = H_DIRECTION[source.direction];
      next.segmentAnchor = H_ANCHOR[source.segmentAnchor];
      return next;
    case "MOVE_MARKER_CLOCKWISE": next.markerPosition = CW_MARKER[source.markerPosition]; return next;
    case "MOVE_MARKER_COUNTERCLOCKWISE": next.markerPosition = CCW_MARKER[source.markerPosition]; return next;
    case "ADD_SEGMENT": if (source.segmentCount >= 4) return null; next.segmentCount = (source.segmentCount + 1) as 2 | 3 | 4; return next;
    case "REMOVE_SEGMENT": if (source.segmentCount <= 1) return null; next.segmentCount = (source.segmentCount - 1) as 1 | 2 | 3; return next;
    case "SUBSTITUTE_INNER_NEXT": {
      const replacement = nextShape(source.innerShape);
      next.innerShape = replacement;
      next.innerRotationQuarter = canonicalSpatialAnalogyShapeQuarter(replacement, source.innerRotationQuarter);
      return next;
    }
    case "TOGGLE_INNER_SHADING": next.shadedInner = !source.shadedInner; return next;
    case "SWAP_INNER_OUTER":
      next.outerShape = source.innerShape;
      next.innerShape = source.outerShape;
      next.outerRotationQuarter = canonicalSpatialAnalogyShapeQuarter(next.outerShape, source.innerRotationQuarter);
      next.innerRotationQuarter = canonicalSpatialAnalogyShapeQuarter(next.innerShape, source.outerRotationQuarter);
      return next;
    case "REVERSE_DIRECTION": next.direction = OPPOSITE_DIRECTION[source.direction]; return next;
    case "COMPOUND_ROTATE_90_CW_TOGGLE_SHADING": {
      const rotated = applySpatialAnalogyRule(source, "ROTATE_90_CW");
      return rotated ? { ...rotated, shadedInner: !source.shadedInner } : null;
    }
    case "COMPOUND_ROTATE_90_CCW_TOGGLE_SHADING": {
      const rotated = applySpatialAnalogyRule(source, "ROTATE_90_CCW");
      return rotated ? { ...rotated, shadedInner: !source.shadedInner } : null;
    }
    case "NO_CHANGE": return next;
  }
}

export function inferSpatialAnalogyRules(aState: SpatialAnalogyFigureState, bState: SpatialAnalogyFigureState): SpatialAnalogyRuleId[] {
  return SPATIAL_ANALOGY_INFERENCE_RULE_IDS.filter((ruleId) => {
    const result = applySpatialAnalogyRule(aState, ruleId);
    return result !== null && areSpatialAnalogyStatesEqual(result, bState);
  });
}

export function spatialAnalogyRuleComplexity(ruleId: SpatialAnalogyRuleId): SpatialAnalogyRuleComplexity {
  return ruleId.startsWith("COMPOUND_") ? "COMPOUND_TWO_STEP" : "SINGLE_STEP";
}

export function spatialAnalogyRuleDescription(ruleId: SpatialAnalogyRuleId): string {
  const descriptions: Record<SpatialAnalogyRuleId, string> = {
    ROTATE_90_CW: "rotate every visible part of the figure by 90° clockwise",
    ROTATE_90_CCW: "rotate every visible part of the figure by 90° anticlockwise",
    ROTATE_180: "rotate every visible part of the figure by 180°",
    REFLECT_VERTICAL: "reflect every visible part of the figure from left to right",
    REFLECT_HORIZONTAL: "reflect every visible part of the figure from top to bottom",
    MOVE_MARKER_CLOCKWISE: "move only the black marker one corner clockwise",
    MOVE_MARKER_COUNTERCLOCKWISE: "move only the black marker one corner anticlockwise",
    ADD_SEGMENT: "add one short segment while keeping every other feature unchanged",
    REMOVE_SEGMENT: "remove one short segment while keeping every other feature unchanged",
    SUBSTITUTE_INNER_NEXT: "replace the inner shape with the next shape in the fixed triangle–square–circle–pentagon cycle",
    TOGGLE_INNER_SHADING: "invert the inner shape between open and shaded",
    SWAP_INNER_OUTER: "exchange the inner and outer shapes, including their orientations",
    REVERSE_DIRECTION: "reverse only the arrow direction",
    COMPOUND_ROTATE_90_CW_TOGGLE_SHADING: "rotate every visible part 90° clockwise and also invert the inner shading",
    COMPOUND_ROTATE_90_CCW_TOGGLE_SHADING: "rotate every visible part 90° anticlockwise and also invert the inner shading",
    NO_CHANGE: "leave the figure unchanged",
  };
  return descriptions[ruleId];
}
