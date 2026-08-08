import type {
  SpatialAnalogyFigureState,
  SpatialAnalogyProofQuestion,
  SpatialAnalogyQuarterTurn,
  SpatialAnalogySegmentAnchor,
} from "../foundation/spatial";
import { generateFigureAnalogyProofQuestion } from "../topics/Non-Verbal-Reasoning/Figure-Analogy/FAN-001/runtime/figure-analogy-proof-generator";

function figure(
  outerShape: SpatialAnalogyFigureState["outerShape"],
  innerShape: SpatialAnalogyFigureState["innerShape"],
  markerPosition: SpatialAnalogyFigureState["markerPosition"],
  direction: SpatialAnalogyFigureState["direction"],
  shadedInner: boolean,
  segmentCount: SpatialAnalogyFigureState["segmentCount"],
  outerRotationQuarter: SpatialAnalogyQuarterTurn,
  innerRotationQuarter: SpatialAnalogyQuarterTurn,
  segmentAnchor: SpatialAnalogySegmentAnchor,
): SpatialAnalogyFigureState {
  return { outerShape, innerShape, outerRotationQuarter, innerRotationQuarter, markerPosition, direction, shadedInner, segmentCount, segmentAnchor };
}

export function buildSpatialFan001ProofCorpus(): SpatialAnalogyProofQuestion[] {
  return [
    generateFigureAnalogyProofQuestion({
      seed: "FAN-PROOF-01-003",
      ruleId: "ROTATE_90_CW",
      aState: figure("TRIANGLE", "PENTAGON", "TOP_LEFT", "UP", false, 2, 0, 0, "BOTTOM"),
      cState: figure("PENTAGON", "TRIANGLE", "BOTTOM_LEFT", "LEFT", true, 3, 2, 3, "TOP"),
      distractors: [
        { ruleId: "ROTATE_90_CCW", label: "WRONG_ROTATION_DIRECTION" },
        { ruleId: "MOVE_MARKER_CLOCKWISE", label: "MARKER_ONLY_MOVEMENT" },
        { ruleId: "REFLECT_VERTICAL", label: "WRONG_REFLECTION_AXIS" },
      ],
    }),
    generateFigureAnalogyProofQuestion({
      seed: "FAN-PROOF-02-003",
      ruleId: "ROTATE_180",
      aState: figure("PENTAGON", "TRIANGLE", "TOP_LEFT", "RIGHT", true, 1, 1, 0, "RIGHT"),
      cState: figure("TRIANGLE", "PENTAGON", "TOP_RIGHT", "DOWN", false, 4, 3, 2, "BOTTOM"),
      distractors: [
        { ruleId: "ROTATE_90_CW", label: "WRONG_ROTATION_ANGLE" },
        { ruleId: "REFLECT_HORIZONTAL", label: "WRONG_REFLECTION_AXIS" },
        { ruleId: "REVERSE_DIRECTION", label: "DIRECTION_ONLY_PARTIAL_RULE" },
      ],
    }),
    generateFigureAnalogyProofQuestion({
      seed: "FAN-PROOF-03-006",
      ruleId: "REFLECT_VERTICAL",
      aState: figure("TRIANGLE", "PENTAGON", "BOTTOM_LEFT", "LEFT", false, 3, 1, 2, "LEFT"),
      cState: figure("PENTAGON", "TRIANGLE", "BOTTOM_RIGHT", "RIGHT", true, 2, 3, 1, "RIGHT"),
      distractors: [
        { ruleId: "REFLECT_HORIZONTAL", label: "WRONG_REFLECTION_AXIS" },
        { ruleId: "ROTATE_180", label: "ROTATION_SUBSTITUTED_FOR_RULE" },
        { ruleId: "NO_CHANGE", label: "NO_CHANGE" },
      ],
    }),
    generateFigureAnalogyProofQuestion({
      seed: "FAN-PROOF-04-004",
      ruleId: "MOVE_MARKER_CLOCKWISE",
      aState: figure("TRIANGLE", "CIRCLE", "TOP_RIGHT", "UP", true, 2, 0, 0, "TOP"),
      cState: figure("CIRCLE", "SQUARE", "BOTTOM_LEFT", "LEFT", false, 3, 0, 0, "RIGHT"),
      distractors: [
        { ruleId: "MOVE_MARKER_COUNTERCLOCKWISE", label: "MARKER_MOVED_WRONG_WAY" },
        { ruleId: "ROTATE_90_CW", label: "ROTATION_SUBSTITUTED_FOR_RULE" },
        { ruleId: "NO_CHANGE", label: "NO_CHANGE" },
      ],
    }),
    generateFigureAnalogyProofQuestion({
      seed: "FAN-PROOF-05-003",
      ruleId: "ADD_SEGMENT",
      aState: figure("SQUARE", "CIRCLE", "TOP_LEFT", "DOWN", false, 1, 0, 0, "LEFT"),
      cState: figure("PENTAGON", "TRIANGLE", "BOTTOM_RIGHT", "RIGHT", true, 2, 1, 0, "TOP"),
      distractors: [
        { ruleId: "REMOVE_SEGMENT", label: "COUNT_CHANGED_WRONG_WAY" },
        { ruleId: "NO_CHANGE", label: "COUNT_UNCHANGED" },
        { ruleId: "TOGGLE_INNER_SHADING", label: "SHADING_CHANGED_INSTEAD" },
      ],
    }),
    generateFigureAnalogyProofQuestion({
      seed: "FAN-PROOF-06-007",
      ruleId: "REMOVE_SEGMENT",
      aState: figure("CIRCLE", "PENTAGON", "TOP_RIGHT", "LEFT", true, 4, 0, 1, "RIGHT"),
      cState: figure("SQUARE", "CIRCLE", "BOTTOM_LEFT", "UP", false, 3, 0, 0, "BOTTOM"),
      distractors: [
        { ruleId: "ADD_SEGMENT", label: "COUNT_CHANGED_WRONG_WAY" },
        { ruleId: "NO_CHANGE", label: "COUNT_UNCHANGED" },
        { ruleId: "TOGGLE_INNER_SHADING", label: "SHADING_CHANGED_INSTEAD" },
      ],
    }),
    generateFigureAnalogyProofQuestion({
      seed: "FAN-PROOF-07-001",
      ruleId: "SUBSTITUTE_INNER_NEXT",
      aState: figure("SQUARE", "TRIANGLE", "BOTTOM_RIGHT", "DOWN", false, 2, 0, 0, "RIGHT"),
      cState: figure("TRIANGLE", "CIRCLE", "TOP_LEFT", "RIGHT", true, 3, 2, 0, "LEFT"),
      distractors: [
        { ruleId: "NO_CHANGE", label: "SHAPE_SUBSTITUTION_SKIPPED" },
        { ruleId: "SWAP_INNER_OUTER", label: "INNER_OUTER_EXCHANGE_INSTEAD" },
        { ruleId: "TOGGLE_INNER_SHADING", label: "SHADING_CHANGED_INSTEAD" },
      ],
    }),
    generateFigureAnalogyProofQuestion({
      seed: "FAN-PROOF-08-002",
      ruleId: "TOGGLE_INNER_SHADING",
      aState: figure("PENTAGON", "SQUARE", "BOTTOM_LEFT", "UP", false, 4, 2, 0, "TOP"),
      cState: figure("CIRCLE", "TRIANGLE", "TOP_RIGHT", "LEFT", true, 1, 0, 1, "RIGHT"),
      distractors: [
        { ruleId: "NO_CHANGE", label: "SHADING_UNCHANGED" },
        { ruleId: "SUBSTITUTE_INNER_NEXT", label: "SHAPE_CHANGED_INSTEAD" },
        { ruleId: "REVERSE_DIRECTION", label: "DIRECTION_CHANGED_INSTEAD" },
      ],
    }),
    generateFigureAnalogyProofQuestion({
      seed: "FAN-PROOF-09-013",
      ruleId: "SWAP_INNER_OUTER",
      aState: figure("PENTAGON", "TRIANGLE", "TOP_LEFT", "RIGHT", true, 3, 1, 2, "BOTTOM"),
      cState: figure("TRIANGLE", "PENTAGON", "BOTTOM_RIGHT", "DOWN", false, 2, 3, 1, "LEFT"),
      distractors: [
        { ruleId: "NO_CHANGE", label: "INNER_OUTER_UNCHANGED" },
        { ruleId: "SUBSTITUTE_INNER_NEXT", label: "SHAPE_CHANGED_INSTEAD" },
        { ruleId: "TOGGLE_INNER_SHADING", label: "SHADING_CHANGED_INSTEAD" },
      ],
    }),
    generateFigureAnalogyProofQuestion({
      seed: "FAN-PROOF-10-014",
      ruleId: "COMPOUND_ROTATE_90_CW_TOGGLE_SHADING",
      aState: figure("TRIANGLE", "PENTAGON", "TOP_LEFT", "UP", false, 2, 0, 1, "BOTTOM"),
      cState: figure("PENTAGON", "TRIANGLE", "BOTTOM_RIGHT", "DOWN", true, 4, 2, 3, "RIGHT"),
      distractors: [
        { ruleId: "ROTATE_90_CW", label: "PARTIAL_RULE_ROTATION_ONLY" },
        { ruleId: "TOGGLE_INNER_SHADING", label: "PARTIAL_RULE_SHADING_ONLY" },
        { ruleId: "COMPOUND_ROTATE_90_CCW_TOGGLE_SHADING", label: "WRONG_ROTATION_DIRECTION" },
      ],
    }),
  ];
}
