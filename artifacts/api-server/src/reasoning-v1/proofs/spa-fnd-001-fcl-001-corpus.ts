import type {
  SpatialAnalogyFigureState,
  SpatialClassificationProofQuestion,
} from "../foundation/spatial";
import {
  generateFigureClassificationProofQuestion,
} from "../topics/Non-Verbal-Reasoning/Figure-Classification/FCL-001/runtime/figure-classification-proof-generator";

function figure(
  outerShape: SpatialAnalogyFigureState["outerShape"],
  innerShape: SpatialAnalogyFigureState["innerShape"],
  outerRotationQuarter: SpatialAnalogyFigureState["outerRotationQuarter"],
  innerRotationQuarter: SpatialAnalogyFigureState["innerRotationQuarter"],
  markerPosition: SpatialAnalogyFigureState["markerPosition"],
  direction: SpatialAnalogyFigureState["direction"],
  shadedInner: boolean,
  segmentCount: SpatialAnalogyFigureState["segmentCount"],
  segmentAnchor: SpatialAnalogyFigureState["segmentAnchor"],
): SpatialAnalogyFigureState {
  return {
    outerShape,
    innerShape,
    outerRotationQuarter,
    innerRotationQuarter,
    markerPosition,
    direction,
    shadedInner,
    segmentCount,
    segmentAnchor,
  };
}

export function buildSpatialFcl001ProofCorpus(): SpatialClassificationProofQuestion[] {
  return [
    generateFigureClassificationProofQuestion({
      seed: "FCL-REMEDIATED-01-STRUCTURE",
      prototypeId: "FCL-PROT-OUTER-INNER-RELATION",
      propertyId: "OUTER_INNER_DIFFERENT",
      expectedOddIndex: 0,
      states: [
        figure("SQUARE", "SQUARE", 0, 0, "TOP_LEFT", "DOWN", false, 1, "LEFT"),
        figure("SQUARE", "PENTAGON", 0, 0, "TOP_RIGHT", "UP", false, 1, "RIGHT"),
        figure("TRIANGLE", "SQUARE", 0, 0, "BOTTOM_LEFT", "DOWN", true, 1, "LEFT"),
        figure("PENTAGON", "TRIANGLE", 0, 0, "BOTTOM_RIGHT", "UP", true, 1, "RIGHT"),
      ],
    }),
    generateFigureClassificationProofQuestion({
      seed: "FCL-REMEDIATED-02-INNER-COUNT",
      prototypeId: "FCL-PROT-INNER-SIDE-COUNT-RELATION",
      propertyId: "SEGMENT_MATCHES_INNER_SIDES_MINUS_ONE",
      expectedOddIndex: 1,
      states: [
        figure("CIRCLE", "TRIANGLE", 0, 0, "TOP_LEFT", "UP", false, 2, "LEFT"),
        figure("CIRCLE", "SQUARE", 0, 0, "TOP_RIGHT", "DOWN", true, 1, "RIGHT"),
        figure("CIRCLE", "SQUARE", 0, 0, "BOTTOM_LEFT", "UP", true, 3, "LEFT"),
        figure("CIRCLE", "PENTAGON", 0, 0, "BOTTOM_RIGHT", "DOWN", false, 4, "RIGHT"),
      ],
    }),
    generateFigureClassificationProofQuestion({
      seed: "FCL-REMEDIATED-03-MARKER-DIRECTION",
      prototypeId: "FCL-PROT-MARKER-ARROW-SIDE",
      propertyId: "MARKER_ON_ARROW_SIDE",
      expectedOddIndex: 2,
      states: [
        figure("TRIANGLE", "SQUARE", 0, 0, "TOP_LEFT", "UP", false, 1, "TOP"),
        figure("SQUARE", "TRIANGLE", 0, 0, "BOTTOM_RIGHT", "DOWN", false, 2, "BOTTOM"),
        figure("TRIANGLE", "SQUARE", 0, 0, "TOP_RIGHT", "LEFT", true, 1, "TOP"),
        figure("SQUARE", "TRIANGLE", 0, 0, "BOTTOM_LEFT", "LEFT", true, 2, "BOTTOM"),
      ],
    }),
    generateFigureClassificationProofQuestion({
      seed: "FCL-REMEDIATED-04-ORIENTATION",
      prototypeId: "FCL-PROT-INNER-OUTER-ORIENTATION",
      propertyId: "ORIENTATIONS_MATCH",
      expectedOddIndex: 3,
      states: [
        figure("TRIANGLE", "PENTAGON", 0, 0, "TOP_LEFT", "UP", false, 1, "LEFT"),
        figure("PENTAGON", "TRIANGLE", 1, 1, "BOTTOM_RIGHT", "DOWN", false, 2, "RIGHT"),
        figure("TRIANGLE", "PENTAGON", 2, 2, "TOP_RIGHT", "LEFT", true, 1, "LEFT"),
        figure("PENTAGON", "TRIANGLE", 3, 1, "BOTTOM_LEFT", "RIGHT", true, 2, "RIGHT"),
      ],
    }),
    generateFigureClassificationProofQuestion({
      seed: "FCL-REMEDIATED-05-OUTER-COUNT",
      prototypeId: "FCL-PROT-OUTER-SIDE-COUNT-RELATION",
      propertyId: "SEGMENT_MATCHES_OUTER_SIDES_MINUS_ONE",
      expectedOddIndex: 0,
      states: [
        figure("CIRCLE", "SQUARE", 0, 0, "TOP_LEFT", "UP", false, 1, "LEFT"),
        figure("TRIANGLE", "SQUARE", 0, 0, "BOTTOM_RIGHT", "DOWN", false, 2, "RIGHT"),
        figure("SQUARE", "PENTAGON", 0, 0, "TOP_RIGHT", "LEFT", true, 3, "LEFT"),
        figure("PENTAGON", "CIRCLE", 0, 0, "BOTTOM_LEFT", "RIGHT", true, 4, "RIGHT"),
      ],
    }),
    generateFigureClassificationProofQuestion({
      seed: "FCL-REMEDIATED-06-MARKER-SEGMENTS",
      prototypeId: "FCL-PROT-MARKER-SEGMENT-OPPOSITION",
      propertyId: "MARKER_OPPOSITE_SEGMENT_ANCHOR",
      expectedOddIndex: 1,
      states: [
        figure("TRIANGLE", "SQUARE", 0, 0, "BOTTOM_LEFT", "LEFT", false, 2, "TOP"),
        figure("SQUARE", "TRIANGLE", 0, 0, "TOP_LEFT", "RIGHT", true, 2, "TOP"),
        figure("TRIANGLE", "SQUARE", 0, 0, "TOP_RIGHT", "LEFT", false, 3, "BOTTOM"),
        figure("SQUARE", "TRIANGLE", 0, 0, "TOP_RIGHT", "RIGHT", true, 3, "BOTTOM"),
      ],
    }),
    generateFigureClassificationProofQuestion({
      seed: "FCL-REMEDIATED-07-SIDE-INCREASE",
      prototypeId: "FCL-PROT-INNER-ONE-MORE-SIDE",
      propertyId: "INNER_HAS_ONE_MORE_SIDE_THAN_OUTER",
      expectedOddIndex: 2,
      states: [
        figure("TRIANGLE", "SQUARE", 0, 0, "TOP_LEFT", "UP", false, 1, "LEFT"),
        figure("SQUARE", "PENTAGON", 0, 0, "BOTTOM_RIGHT", "DOWN", false, 1, "RIGHT"),
        figure("SQUARE", "TRIANGLE", 0, 0, "TOP_RIGHT", "LEFT", true, 1, "LEFT"),
        figure("TRIANGLE", "SQUARE", 0, 0, "BOTTOM_LEFT", "RIGHT", true, 1, "RIGHT"),
      ],
    }),
    generateFigureClassificationProofQuestion({
      seed: "FCL-REMEDIATED-08-ARROW-SEGMENTS",
      prototypeId: "FCL-PROT-ARROW-SEGMENT-ALIGNMENT",
      propertyId: "ARROW_POINTS_TO_SEGMENT_ANCHOR",
      expectedOddIndex: 3,
      states: [
        figure("TRIANGLE", "SQUARE", 0, 0, "TOP_LEFT", "UP", false, 1, "TOP"),
        figure("SQUARE", "TRIANGLE", 0, 0, "BOTTOM_LEFT", "RIGHT", false, 2, "RIGHT"),
        figure("TRIANGLE", "SQUARE", 0, 0, "BOTTOM_RIGHT", "DOWN", true, 1, "BOTTOM"),
        figure("SQUARE", "TRIANGLE", 0, 0, "BOTTOM_RIGHT", "LEFT", true, 2, "TOP"),
      ],
    }),
  ];
}
