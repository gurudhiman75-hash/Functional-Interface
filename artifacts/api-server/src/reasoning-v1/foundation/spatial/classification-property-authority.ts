import {
  normalizeSpatialAnalogyState,
} from "./analogy-rule-authority";
import type {
  SpatialAnalogyDirection,
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
  "SEGMENT_MATCHES_OUTER_SIDES_MINUS_ONE",
  "MARKER_OPPOSITE_SEGMENT_ANCHOR",
  "INNER_HAS_ONE_MORE_SIDE_THAN_OUTER",
  "ARROW_POINTS_TO_SEGMENT_ANCHOR",
] as const;

const POLYGON_SIDE_COUNT: Partial<Record<SpatialAnalogyShape, number>> = {
  TRIANGLE: 3,
  SQUARE: 4,
  PENTAGON: 5,
};

const DIRECTION_TO_ANCHOR: Record<
  SpatialAnalogyDirection,
  SpatialAnalogySegmentAnchor
> = {
  UP: "TOP",
  RIGHT: "RIGHT",
  DOWN: "BOTTOM",
  LEFT: "LEFT",
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

export function spatialClassificationPolygonSideCount(
  shape: SpatialAnalogyShape,
): number | null {
  return POLYGON_SIDE_COUNT[shape] ?? null;
}

export function spatialClassificationDirectionAnchor(
  direction: SpatialAnalogyDirection,
): SpatialAnalogySegmentAnchor {
  return DIRECTION_TO_ANCHOR[direction];
}

export function spatialClassificationPropertySatisfied(
  stateInput: SpatialAnalogyFigureState,
  propertyId: SpatialClassificationPropertyId,
): boolean {
  const state = normalizeSpatialAnalogyState(stateInput);
  const outerSides = spatialClassificationPolygonSideCount(state.outerShape);
  const innerSides = spatialClassificationPolygonSideCount(state.innerShape);
  switch (propertyId) {
    case "OUTER_INNER_DIFFERENT":
      return state.outerShape !== state.innerShape;
    case "SEGMENT_MATCHES_INNER_SIDES_MINUS_ONE":
      return innerSides !== null && state.segmentCount === innerSides - 1;
    case "MARKER_ON_ARROW_SIDE":
      return markerOnDirectionSide(state);
    case "ORIENTATIONS_MATCH":
      return state.outerRotationQuarter === state.innerRotationQuarter;
    case "SEGMENT_MATCHES_OUTER_SIDES_MINUS_ONE":
      return outerSides !== null && state.segmentCount === outerSides - 1;
    case "MARKER_OPPOSITE_SEGMENT_ANCHOR":
      return markerOppositeAnchor(state.markerPosition, state.segmentAnchor);
    case "INNER_HAS_ONE_MORE_SIDE_THAN_OUTER":
      return (
        outerSides !== null &&
        innerSides !== null &&
        innerSides === outerSides + 1
      );
    case "ARROW_POINTS_TO_SEGMENT_ANCHOR":
      return (
        spatialClassificationDirectionAnchor(state.direction) ===
        state.segmentAnchor
      );
  }
}

export function spatialClassificationPropertyDescription(
  propertyId: SpatialClassificationPropertyId,
): string {
  const descriptions: Record<SpatialClassificationPropertyId, string> = {
    OUTER_INNER_DIFFERENT:
      "the outer and inner shapes are different",
    SEGMENT_MATCHES_INNER_SIDES_MINUS_ONE:
      "the number of dots is one less than the number of sides of the inner polygon",
    MARKER_ON_ARROW_SIDE:
      "the black marker lies on the same side toward which the arrow points",
    ORIENTATIONS_MATCH:
      "the outer and inner shapes point in the same direction",
    SEGMENT_MATCHES_OUTER_SIDES_MINUS_ONE:
      "the number of dots is one less than the number of sides of the outer polygon",
    MARKER_OPPOSITE_SEGMENT_ANCHOR:
      "the black marker lies on the side opposite the dot group",
    INNER_HAS_ONE_MORE_SIDE_THAN_OUTER:
      "the inner polygon has exactly one more side than the outer polygon",
    ARROW_POINTS_TO_SEGMENT_ANCHOR:
      "the arrow points toward the side containing the dot group",
  };
  return descriptions[propertyId];
}

function orientationName(quarter: number): string {
  return ["up", "right", "down", "left"][quarter] ?? "unknown";
}

function dotCountDescription(count: number): string {
  return `${count} dot${count === 1 ? "" : "s"}`;
}

export function spatialClassificationPropertyEvidence(
  stateInput: SpatialAnalogyFigureState,
  propertyId: SpatialClassificationPropertyId,
): string {
  const state = normalizeSpatialAnalogyState(stateInput);
  const outerSides = spatialClassificationPolygonSideCount(state.outerShape);
  const innerSides = spatialClassificationPolygonSideCount(state.innerShape);
  switch (propertyId) {
    case "OUTER_INNER_DIFFERENT":
      return `outer ${state.outerShape.toLowerCase()}, inner ${state.innerShape.toLowerCase()}`;
    case "SEGMENT_MATCHES_INNER_SIDES_MINUS_ONE":
      return innerSides === null
        ? `inner circle has no polygon-side count; the figure has ${dotCountDescription(state.segmentCount)}`
        : `inner ${state.innerShape.toLowerCase()} has ${innerSides} sides; the figure has ${dotCountDescription(state.segmentCount)}`;
    case "MARKER_ON_ARROW_SIDE":
      return `marker at ${state.markerPosition.toLowerCase().replaceAll("_", " ")}; arrow points ${state.direction.toLowerCase()}`;
    case "ORIENTATIONS_MATCH":
      return `outer points ${orientationName(state.outerRotationQuarter)}; inner points ${orientationName(state.innerRotationQuarter)}`;
    case "SEGMENT_MATCHES_OUTER_SIDES_MINUS_ONE":
      return outerSides === null
        ? `outer circle has no polygon-side count; the figure has ${dotCountDescription(state.segmentCount)}`
        : `outer ${state.outerShape.toLowerCase()} has ${outerSides} sides; the figure has ${dotCountDescription(state.segmentCount)}`;
    case "MARKER_OPPOSITE_SEGMENT_ANCHOR":
      return `marker at ${state.markerPosition.toLowerCase().replaceAll("_", " ")}; dots are on the ${state.segmentAnchor.toLowerCase()}`;
    case "INNER_HAS_ONE_MORE_SIDE_THAN_OUTER":
      return outerSides === null || innerSides === null
        ? `outer ${state.outerShape.toLowerCase()} and inner ${state.innerShape.toLowerCase()} do not form two polygons`
        : `outer has ${outerSides} sides; inner has ${innerSides} sides`;
    case "ARROW_POINTS_TO_SEGMENT_ANCHOR":
      return `arrow points ${state.direction.toLowerCase()}; dots are on the ${state.segmentAnchor.toLowerCase()}`;
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
