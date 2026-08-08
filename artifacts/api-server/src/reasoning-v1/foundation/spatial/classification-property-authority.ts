import {
  normalizeSpatialAnalogyState,
} from "./analogy-rule-authority";
import type {
  SpatialAnalogyFigureState,
  SpatialAnalogyMarkerPosition,
  SpatialAnalogySegmentAnchor,
  SpatialAnalogyShape,
} from "./analogy-types";
import type {
  SpatialClassificationPropertyId,
} from "./classification-types";

export const SPATIAL_CLASSIFICATION_PROPERTY_IDS: readonly SpatialClassificationPropertyId[] = [
  "OUTER_INNER_DIFFERENT",
  "SEGMENT_MATCHES_INNER_SIDES_MINUS_ONE",
  "MARKER_ON_ARROW_SIDE",
  "ORIENTATIONS_MATCH",
  "SHADING_MATCHES_ODD_SEGMENTS",
  "MARKER_OPPOSITE_SEGMENT_ANCHOR",
  "INNER_NEXT_AFTER_OUTER",
  "ARROW_POINTS_TO_SEGMENT_ANCHOR",
] as const;

const SHAPE_CYCLE: Record<SpatialAnalogyShape, SpatialAnalogyShape> = {
  TRIANGLE: "SQUARE",
  SQUARE: "CIRCLE",
  CIRCLE: "PENTAGON",
  PENTAGON: "TRIANGLE",
};

const POLYGON_SIDE_COUNT: Partial<Record<SpatialAnalogyShape, number>> = {
  TRIANGLE: 3,
  SQUARE: 4,
  PENTAGON: 5,
};

function markerOnDirectionSide(state: SpatialAnalogyFigureState): boolean {
  const marker = state.markerPosition;
  switch (state.direction) {
    case "UP":
      return marker === "TOP_LEFT" || marker === "TOP_RIGHT";
    case "RIGHT":
      return marker === "TOP_RIGHT" || marker === "BOTTOM_RIGHT";
    case "DOWN":
      return marker === "BOTTOM_LEFT" || marker === "BOTTOM_RIGHT";
    case "LEFT":
      return marker === "TOP_LEFT" || marker === "BOTTOM_LEFT";
  }
}

function markerOppositeAnchor(
  marker: SpatialAnalogyMarkerPosition,
  anchor: SpatialAnalogySegmentAnchor,
): boolean {
  switch (anchor) {
    case "TOP":
      return marker === "BOTTOM_LEFT" || marker === "BOTTOM_RIGHT";
    case "RIGHT":
      return marker === "TOP_LEFT" || marker === "BOTTOM_LEFT";
    case "BOTTOM":
      return marker === "TOP_LEFT" || marker === "TOP_RIGHT";
    case "LEFT":
      return marker === "TOP_RIGHT" || marker === "BOTTOM_RIGHT";
  }
}

export function spatialClassificationPropertySatisfied(
  stateInput: SpatialAnalogyFigureState,
  propertyId: SpatialClassificationPropertyId,
): boolean {
  const state = normalizeSpatialAnalogyState(stateInput);
  switch (propertyId) {
    case "OUTER_INNER_DIFFERENT":
      return state.outerShape !== state.innerShape;
    case "SEGMENT_MATCHES_INNER_SIDES_MINUS_ONE": {
      const sideCount = POLYGON_SIDE_COUNT[state.innerShape];
      return sideCount !== undefined && state.segmentCount === sideCount - 1;
    }
    case "MARKER_ON_ARROW_SIDE":
      return markerOnDirectionSide(state);
    case "ORIENTATIONS_MATCH":
      return state.outerRotationQuarter === state.innerRotationQuarter;
    case "SHADING_MATCHES_ODD_SEGMENTS":
      return state.shadedInner === (state.segmentCount % 2 === 1);
    case "MARKER_OPPOSITE_SEGMENT_ANCHOR":
      return markerOppositeAnchor(state.markerPosition, state.segmentAnchor);
    case "INNER_NEXT_AFTER_OUTER":
      return state.innerShape === SHAPE_CYCLE[state.outerShape];
    case "ARROW_POINTS_TO_SEGMENT_ANCHOR":
      return state.direction === state.segmentAnchor;
  }
}

export function spatialClassificationPropertyDescription(
  propertyId: SpatialClassificationPropertyId,
): string {
  const descriptions: Record<SpatialClassificationPropertyId, string> = {
    OUTER_INNER_DIFFERENT:
      "the outer and inner shapes are different",
    SEGMENT_MATCHES_INNER_SIDES_MINUS_ONE:
      "the number of short segments is one less than the number of sides of the inner polygon",
    MARKER_ON_ARROW_SIDE:
      "the black marker lies on the same side toward which the arrow points",
    ORIENTATIONS_MATCH:
      "the outer and inner shapes have the same quarter-turn orientation",
    SHADING_MATCHES_ODD_SEGMENTS:
      "the inner shape is shaded exactly when the segment count is odd",
    MARKER_OPPOSITE_SEGMENT_ANCHOR:
      "the black marker lies on the side opposite the short-segment group",
    INNER_NEXT_AFTER_OUTER:
      "the inner shape is the next shape after the outer shape in the triangle–square–circle–pentagon cycle",
    ARROW_POINTS_TO_SEGMENT_ANCHOR:
      "the arrow points toward the side containing the short-segment group",
  };
  return descriptions[propertyId];
}

export function spatialClassificationPropertyEvidence(
  stateInput: SpatialAnalogyFigureState,
  propertyId: SpatialClassificationPropertyId,
): string {
  const state = normalizeSpatialAnalogyState(stateInput);
  switch (propertyId) {
    case "OUTER_INNER_DIFFERENT":
      return `outer ${state.outerShape.toLowerCase()}, inner ${state.innerShape.toLowerCase()}`;
    case "SEGMENT_MATCHES_INNER_SIDES_MINUS_ONE": {
      const sideCount = POLYGON_SIDE_COUNT[state.innerShape];
      return sideCount === undefined
        ? `inner circle has no polygon-side count, with ${state.segmentCount} segments`
        : `inner ${state.innerShape.toLowerCase()} has ${sideCount} sides and the figure has ${state.segmentCount} segments`;
    }
    case "MARKER_ON_ARROW_SIDE":
      return `marker ${state.markerPosition.toLowerCase().replaceAll("_", " ")}, arrow ${state.direction.toLowerCase()}`;
    case "ORIENTATIONS_MATCH":
      return `outer orientation Q${state.outerRotationQuarter}, inner orientation Q${state.innerRotationQuarter}`;
    case "SHADING_MATCHES_ODD_SEGMENTS":
      return `${state.shadedInner ? "shaded" : "open"} inner shape with ${state.segmentCount} segment${state.segmentCount === 1 ? "" : "s"}`;
    case "MARKER_OPPOSITE_SEGMENT_ANCHOR":
      return `marker ${state.markerPosition.toLowerCase().replaceAll("_", " ")}, segments on ${state.segmentAnchor.toLowerCase()}`;
    case "INNER_NEXT_AFTER_OUTER":
      return `outer ${state.outerShape.toLowerCase()}, inner ${state.innerShape.toLowerCase()}`;
    case "ARROW_POINTS_TO_SEGMENT_ANCHOR":
      return `arrow ${state.direction.toLowerCase()}, segments on ${state.segmentAnchor.toLowerCase()}`;
  }
}

export function spatialClassificationPropertyVector(
  states: readonly SpatialAnalogyFigureState[],
  propertyId: SpatialClassificationPropertyId,
): boolean[] {
  return states.map((state) =>
    spatialClassificationPropertySatisfied(state, propertyId),
  );
}

export function findSpatialClassificationSeparatingProperties(
  states: readonly SpatialAnalogyFigureState[],
): SpatialClassificationPropertyId[] {
  return SPATIAL_CLASSIFICATION_PROPERTY_IDS.filter((propertyId) => {
    const vector = spatialClassificationPropertyVector(states, propertyId);
    return vector.filter(Boolean).length === 3;
  });
}
