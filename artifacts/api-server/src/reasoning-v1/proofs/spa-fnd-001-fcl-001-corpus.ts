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
      seed: "FCL-PROOF-01-STRUCTURE",
      prototypeId: "FCL-PROT-OUTER-INNER-RELATION",
      propertyId: "OUTER_INNER_DIFFERENT",
      expectedOddIndex: 0,
      states: [
        figure("PENTAGON", "PENTAGON", 0, 1, "BOTTOM_RIGHT", "DOWN", false, 2, "RIGHT"),
        figure("TRIANGLE", "PENTAGON", 2, 1, "BOTTOM_RIGHT", "UP", true, 1, "TOP"),
        figure("TRIANGLE", "CIRCLE", 3, 0, "BOTTOM_RIGHT", "LEFT", false, 1, "BOTTOM"),
        figure("PENTAGON", "CIRCLE", 2, 0, "TOP_LEFT", "UP", true, 2, "RIGHT"),
      ],
    }),
    generateFigureClassificationProofQuestion({
      seed: "FCL-PROOF-02-COUNT",
      prototypeId: "FCL-PROT-SIDE-COUNT-RELATION",
      propertyId: "SEGMENT_MATCHES_INNER_SIDES_MINUS_ONE",
      expectedOddIndex: 1,
      states: [
        figure("PENTAGON", "PENTAGON", 1, 1, "BOTTOM_RIGHT", "RIGHT", true, 4, "TOP"),
        figure("PENTAGON", "PENTAGON", 2, 3, "BOTTOM_RIGHT", "RIGHT", true, 1, "TOP"),
        figure("CIRCLE", "SQUARE", 0, 0, "TOP_RIGHT", "UP", false, 3, "LEFT"),
        figure("CIRCLE", "TRIANGLE", 0, 1, "BOTTOM_LEFT", "DOWN", false, 2, "TOP"),
      ],
    }),
    generateFigureClassificationProofQuestion({
      seed: "FCL-PROOF-03-MARKER-DIRECTION",
      prototypeId: "FCL-PROT-MARKER-ARROW-SIDE",
      propertyId: "MARKER_ON_ARROW_SIDE",
      expectedOddIndex: 2,
      states: [
        figure("CIRCLE", "SQUARE", 0, 0, "BOTTOM_LEFT", "LEFT", false, 1, "TOP"),
        figure("SQUARE", "TRIANGLE", 0, 3, "BOTTOM_RIGHT", "RIGHT", true, 3, "BOTTOM"),
        figure("TRIANGLE", "CIRCLE", 0, 0, "BOTTOM_RIGHT", "LEFT", false, 2, "RIGHT"),
        figure("SQUARE", "PENTAGON", 0, 2, "TOP_LEFT", "LEFT", false, 1, "BOTTOM"),
      ],
    }),
    generateFigureClassificationProofQuestion({
      seed: "FCL-PROOF-04-ORIENTATION",
      prototypeId: "FCL-PROT-INNER-OUTER-ORIENTATION",
      propertyId: "ORIENTATIONS_MATCH",
      expectedOddIndex: 3,
      states: [
        figure("TRIANGLE", "TRIANGLE", 3, 3, "BOTTOM_LEFT", "DOWN", false, 1, "LEFT"),
        figure("PENTAGON", "TRIANGLE", 2, 2, "TOP_LEFT", "RIGHT", false, 4, "TOP"),
        figure("PENTAGON", "PENTAGON", 1, 1, "BOTTOM_LEFT", "DOWN", true, 3, "LEFT"),
        figure("PENTAGON", "TRIANGLE", 0, 2, "BOTTOM_LEFT", "RIGHT", true, 4, "LEFT"),
      ],
    }),
    generateFigureClassificationProofQuestion({
      seed: "FCL-PROOF-05-SHADING-PARITY",
      prototypeId: "FCL-PROT-SHADING-COUNT-PARITY",
      propertyId: "SHADING_MATCHES_ODD_SEGMENTS",
      expectedOddIndex: 0,
      states: [
        figure("PENTAGON", "TRIANGLE", 3, 1, "BOTTOM_LEFT", "UP", false, 1, "TOP"),
        figure("TRIANGLE", "PENTAGON", 3, 0, "TOP_RIGHT", "RIGHT", true, 3, "LEFT"),
        figure("SQUARE", "CIRCLE", 0, 0, "TOP_LEFT", "UP", true, 3, "BOTTOM"),
        figure("SQUARE", "TRIANGLE", 0, 0, "TOP_LEFT", "RIGHT", true, 1, "BOTTOM"),
      ],
    }),
    generateFigureClassificationProofQuestion({
      seed: "FCL-PROOF-06-MARKER-SEGMENTS",
      prototypeId: "FCL-PROT-MARKER-SEGMENT-OPPOSITION",
      propertyId: "MARKER_OPPOSITE_SEGMENT_ANCHOR",
      expectedOddIndex: 1,
      states: [
        figure("SQUARE", "TRIANGLE", 0, 1, "BOTTOM_RIGHT", "LEFT", false, 4, "LEFT"),
        figure("SQUARE", "PENTAGON", 0, 1, "TOP_LEFT", "LEFT", true, 1, "LEFT"),
        figure("TRIANGLE", "CIRCLE", 3, 0, "BOTTOM_LEFT", "LEFT", false, 1, "RIGHT"),
        figure("TRIANGLE", "CIRCLE", 2, 0, "TOP_RIGHT", "DOWN", true, 2, "LEFT"),
      ],
    }),
    generateFigureClassificationProofQuestion({
      seed: "FCL-PROOF-07-SHAPE-CYCLE",
      prototypeId: "FCL-PROT-SHAPE-CYCLE",
      propertyId: "INNER_NEXT_AFTER_OUTER",
      expectedOddIndex: 2,
      states: [
        figure("TRIANGLE", "SQUARE", 0, 0, "TOP_LEFT", "UP", true, 2, "LEFT"),
        figure("PENTAGON", "TRIANGLE", 2, 1, "BOTTOM_RIGHT", "RIGHT", true, 4, "BOTTOM"),
        figure("TRIANGLE", "PENTAGON", 3, 0, "BOTTOM_LEFT", "RIGHT", true, 2, "BOTTOM"),
        figure("PENTAGON", "TRIANGLE", 1, 1, "BOTTOM_LEFT", "UP", false, 3, "BOTTOM"),
      ],
    }),
    generateFigureClassificationProofQuestion({
      seed: "FCL-PROOF-08-ARROW-SEGMENTS",
      prototypeId: "FCL-PROT-ARROW-SEGMENT-ALIGNMENT",
      propertyId: "ARROW_POINTS_TO_SEGMENT_ANCHOR",
      expectedOddIndex: 3,
      states: [
        figure("SQUARE", "SQUARE", 0, 0, "BOTTOM_LEFT", "LEFT", true, 3, "LEFT"),
        figure("PENTAGON", "PENTAGON", 2, 0, "BOTTOM_LEFT", "RIGHT", true, 1, "RIGHT"),
        figure("TRIANGLE", "SQUARE", 0, 0, "TOP_LEFT", "LEFT", true, 2, "LEFT"),
        figure("CIRCLE", "PENTAGON", 0, 2, "TOP_RIGHT", "LEFT", true, 4, "BOTTOM"),
      ],
    }),
  ];
}
