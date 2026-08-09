import {
  normalizeSpatialAnalogyState,
} from "./analogy-rule-authority";
import type {
  SpatialAnalogyDirection,
  SpatialAnalogyFigureState,
  SpatialAnalogyMarkerPosition,
  SpatialAnalogySegmentAnchor,
} from "./analogy-types";
import {
  spatialClassificationDirectionAnchor,
  spatialClassificationPolygonSideCount,
  spatialClassificationPropertySatisfied,
} from "./classification-property-authority";
import type {
  SpatialClassificationNuisanceDistribution,
  SpatialClassificationNuisanceFeatureId,
  SpatialClassificationPropertyId,
} from "./classification-types";

export interface SpatialClassificationNuisanceAuditResult {
  ok: boolean;
  distributions: SpatialClassificationNuisanceDistribution[];
  ambiguousFeatureIds: SpatialClassificationNuisanceFeatureId[];
}

const FEATURE_IDS: readonly SpatialClassificationNuisanceFeatureId[] = [
  "OUTER_SHAPE",
  "INNER_SHAPE",
  "OUTER_ORIENTATION",
  "INNER_ORIENTATION",
  "MARKER_POSITION",
  "ARROW_DIRECTION",
  "INNER_SHADING",
  "SEGMENT_COUNT",
  "SEGMENT_ANCHOR",
  "SHAPE_PAIR",
  "ORIENTATION_PAIR",
  "MARKER_DIRECTION_PAIR",
  "MARKER_SEGMENT_PAIR",
  "ARROW_SEGMENT_PAIR",
  "OUTER_INNER_SAME",
  "ORIENTATIONS_MATCH",
  "MARKER_ON_ARROW_SIDE",
  "MARKER_OPPOSITE_SEGMENT_ANCHOR",
  "MARKER_ON_SEGMENT_SIDE",
  "ARROW_POINTS_TO_SEGMENT_ANCHOR",
  "ARROW_OPPOSITE_SEGMENT_ANCHOR",
  "SEGMENT_COUNT_ODD",
  "SEGMENT_MATCHES_INNER_SIDES_MINUS_ONE",
  "SEGMENT_MATCHES_OUTER_SIDES_MINUS_ONE",
  "INNER_HAS_ONE_MORE_SIDE_THAN_OUTER",
  "OUTER_POLYGON",
  "INNER_POLYGON",
  "OUTER_SIDE_PARITY",
  "INNER_SIDE_PARITY",
  "SIDE_COUNT_COMPARISON",
  "TOTAL_POLYGON_SIDES_PARITY",
] as const;

const INTENDED_EQUIVALENT_FEATURES: Record<
  SpatialClassificationPropertyId,
  readonly SpatialClassificationNuisanceFeatureId[]
> = {
  OUTER_INNER_DIFFERENT: ["OUTER_INNER_SAME"],
  SEGMENT_MATCHES_INNER_SIDES_MINUS_ONE: [
    "SEGMENT_MATCHES_INNER_SIDES_MINUS_ONE",
  ],
  MARKER_ON_ARROW_SIDE: ["MARKER_ON_ARROW_SIDE"],
  ORIENTATIONS_MATCH: ["ORIENTATIONS_MATCH"],
  SEGMENT_MATCHES_OUTER_SIDES_MINUS_ONE: [
    "SEGMENT_MATCHES_OUTER_SIDES_MINUS_ONE",
  ],
  MARKER_OPPOSITE_SEGMENT_ANCHOR: [
    "MARKER_OPPOSITE_SEGMENT_ANCHOR",
    "MARKER_ON_SEGMENT_SIDE",
  ],
  INNER_HAS_ONE_MORE_SIDE_THAN_OUTER: [
    "INNER_HAS_ONE_MORE_SIDE_THAN_OUTER",
    "SIDE_COUNT_COMPARISON",
  ],
  ARROW_POINTS_TO_SEGMENT_ANCHOR: [
    "ARROW_POINTS_TO_SEGMENT_ANCHOR",
  ],
};

const OPPOSITE_ANCHOR: Record<
  SpatialAnalogySegmentAnchor,
  SpatialAnalogySegmentAnchor
> = {
  TOP: "BOTTOM",
  RIGHT: "LEFT",
  BOTTOM: "TOP",
  LEFT: "RIGHT",
};

function markerOnSide(
  marker: SpatialAnalogyMarkerPosition,
  side: SpatialAnalogySegmentAnchor,
): boolean {
  switch (side) {
    case "TOP":
      return marker === "TOP_LEFT" || marker === "TOP_RIGHT";
    case "RIGHT":
      return marker === "TOP_RIGHT" || marker === "BOTTOM_RIGHT";
    case "BOTTOM":
      return marker === "BOTTOM_LEFT" || marker === "BOTTOM_RIGHT";
    case "LEFT":
      return marker === "TOP_LEFT" || marker === "BOTTOM_LEFT";
  }
}

function markerOnDirectionSide(
  marker: SpatialAnalogyMarkerPosition,
  direction: SpatialAnalogyDirection,
): boolean {
  return markerOnSide(marker, spatialClassificationDirectionAnchor(direction));
}

function sideParity(sideCount: number | null): string {
  if (sideCount === null) return "NONE";
  return sideCount % 2 === 0 ? "EVEN" : "ODD";
}

function sideComparison(
  outerSides: number | null,
  innerSides: number | null,
): string {
  if (outerSides === null || innerSides === null) return "NON_POLYGON";
  if (outerSides < innerSides) return "LESS";
  if (outerSides > innerSides) return "GREATER";
  return "EQUAL";
}

function featureRecord(
  stateInput: SpatialAnalogyFigureState,
): Record<SpatialClassificationNuisanceFeatureId, string> {
  const state = normalizeSpatialAnalogyState(stateInput);
  const outerSides = spatialClassificationPolygonSideCount(state.outerShape);
  const innerSides = spatialClassificationPolygonSideCount(state.innerShape);
  const directionAnchor = spatialClassificationDirectionAnchor(state.direction);
  const markerOnSegmentSide = markerOnSide(
    state.markerPosition,
    state.segmentAnchor,
  );
  const markerOppositeSegment = markerOnSide(
    state.markerPosition,
    OPPOSITE_ANCHOR[state.segmentAnchor],
  );
  return {
    OUTER_SHAPE: state.outerShape,
    INNER_SHAPE: state.innerShape,
    OUTER_ORIENTATION: `Q${state.outerRotationQuarter}`,
    INNER_ORIENTATION: `Q${state.innerRotationQuarter}`,
    MARKER_POSITION: state.markerPosition,
    ARROW_DIRECTION: state.direction,
    INNER_SHADING: state.shadedInner ? "SHADED" : "OPEN",
    SEGMENT_COUNT: String(state.segmentCount),
    SEGMENT_ANCHOR: state.segmentAnchor,
    SHAPE_PAIR: `${state.outerShape}->${state.innerShape}`,
    ORIENTATION_PAIR: `Q${state.outerRotationQuarter}->Q${state.innerRotationQuarter}`,
    MARKER_DIRECTION_PAIR: `${state.markerPosition}|${state.direction}`,
    MARKER_SEGMENT_PAIR: `${state.markerPosition}|${state.segmentAnchor}`,
    ARROW_SEGMENT_PAIR: `${state.direction}|${state.segmentAnchor}`,
    OUTER_INNER_SAME: String(state.outerShape === state.innerShape),
    ORIENTATIONS_MATCH: String(
      state.outerRotationQuarter === state.innerRotationQuarter,
    ),
    MARKER_ON_ARROW_SIDE: String(
      markerOnDirectionSide(state.markerPosition, state.direction),
    ),
    MARKER_OPPOSITE_SEGMENT_ANCHOR: String(markerOppositeSegment),
    MARKER_ON_SEGMENT_SIDE: String(markerOnSegmentSide),
    ARROW_POINTS_TO_SEGMENT_ANCHOR: String(
      directionAnchor === state.segmentAnchor,
    ),
    ARROW_OPPOSITE_SEGMENT_ANCHOR: String(
      OPPOSITE_ANCHOR[directionAnchor] === state.segmentAnchor,
    ),
    SEGMENT_COUNT_ODD: String(state.segmentCount % 2 === 1),
    SEGMENT_MATCHES_INNER_SIDES_MINUS_ONE: String(
      spatialClassificationPropertySatisfied(
        state,
        "SEGMENT_MATCHES_INNER_SIDES_MINUS_ONE",
      ),
    ),
    SEGMENT_MATCHES_OUTER_SIDES_MINUS_ONE: String(
      spatialClassificationPropertySatisfied(
        state,
        "SEGMENT_MATCHES_OUTER_SIDES_MINUS_ONE",
      ),
    ),
    INNER_HAS_ONE_MORE_SIDE_THAN_OUTER: String(
      spatialClassificationPropertySatisfied(
        state,
        "INNER_HAS_ONE_MORE_SIDE_THAN_OUTER",
      ),
    ),
    OUTER_POLYGON: String(outerSides !== null),
    INNER_POLYGON: String(innerSides !== null),
    OUTER_SIDE_PARITY: sideParity(outerSides),
    INNER_SIDE_PARITY: sideParity(innerSides),
    SIDE_COUNT_COMPARISON: sideComparison(outerSides, innerSides),
    TOTAL_POLYGON_SIDES_PARITY:
      outerSides === null || innerSides === null
        ? "NONE"
        : (outerSides + innerSides) % 2 === 0
          ? "EVEN"
          : "ODD",
  };
}

function frequencies(values: readonly string[]): Record<string, number> {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return Object.fromEntries(
    [...counts.entries()].sort(([left], [right]) => left.localeCompare(right)),
  );
}

function isThreeToOne(counts: Record<string, number>): boolean {
  const values = Object.values(counts).sort((left, right) => left - right);
  return values.length === 2 && values[0] === 1 && values[1] === 3;
}

export function auditSpatialClassificationNuisanceFeatures(
  states: readonly SpatialAnalogyFigureState[],
  intendedPropertyId: SpatialClassificationPropertyId,
): SpatialClassificationNuisanceAuditResult {
  const records = states.map(featureRecord);
  const allowed = new Set(INTENDED_EQUIVALENT_FEATURES[intendedPropertyId]);
  const distributions = FEATURE_IDS.map((featureId) => {
    const featureFrequencies = frequencies(
      records.map((record) => record[featureId]),
    );
    const intendedEquivalent = allowed.has(featureId);
    return {
      featureId,
      frequencies: featureFrequencies,
      threeToOne: isThreeToOne(featureFrequencies),
      intendedEquivalent,
    } satisfies SpatialClassificationNuisanceDistribution;
  });
  const ambiguousFeatureIds = distributions
    .filter(
      (distribution) =>
        distribution.threeToOne && !distribution.intendedEquivalent,
    )
    .map((distribution) => distribution.featureId);
  return {
    ok: ambiguousFeatureIds.length === 0,
    distributions,
    ambiguousFeatureIds,
  };
}
