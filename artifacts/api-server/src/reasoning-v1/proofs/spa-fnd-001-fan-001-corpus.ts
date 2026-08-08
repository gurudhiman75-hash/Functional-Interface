import type {
  SpatialAnalogyFigureState,
  SpatialAnalogyProofQuestion,
} from "../foundation/spatial";
import { generateFigureAnalogyProofQuestion } from "../topics/Non-Verbal-Reasoning/Figure-Analogy/FAN-001/runtime/figure-analogy-proof-generator";

function figure(
  outerShape: SpatialAnalogyFigureState["outerShape"],
  innerShape: SpatialAnalogyFigureState["innerShape"],
  markerPosition: SpatialAnalogyFigureState["markerPosition"],
  direction: SpatialAnalogyFigureState["direction"],
  shadedInner: boolean,
  segmentCount: SpatialAnalogyFigureState["segmentCount"],
): SpatialAnalogyFigureState {
  return {
    outerShape,
    innerShape,
    markerPosition,
    direction,
    shadedInner,
    segmentCount,
  };
}

export function buildSpatialFan001ProofCorpus(): SpatialAnalogyProofQuestion[] {
  return [
    generateFigureAnalogyProofQuestion({
      seed: "FAN-PROOF-01-003",
      ruleId: "ROTATE_90_CW",
      aState: figure("SQUARE", "TRIANGLE", "TOP_LEFT", "UP", false, 2),
      cState: figure("CIRCLE", "PENTAGON", "BOTTOM_LEFT", "LEFT", true, 3),
      distractors: [
        {
          ruleId: "ROTATE_90_CCW",
          label: "WRONG_ROTATION_DIRECTION",
        },
        {
          ruleId: "MOVE_MARKER_CLOCKWISE",
          label: "MARKER_ONLY_MOVEMENT",
        },
        {
          ruleId: "REFLECT_VERTICAL",
          label: "WRONG_REFLECTION_AXIS",
        },
      ],
    }),
    generateFigureAnalogyProofQuestion({
      seed: "FAN-PROOF-02-003",
      ruleId: "ROTATE_180",
      aState: figure("CIRCLE", "TRIANGLE", "TOP_LEFT", "RIGHT", true, 1),
      cState: figure("PENTAGON", "SQUARE", "TOP_RIGHT", "DOWN", false, 4),
      distractors: [
        {
          ruleId: "ROTATE_90_CW",
          label: "WRONG_ROTATION_ANGLE",
        },
        {
          ruleId: "REFLECT_HORIZONTAL",
          label: "WRONG_REFLECTION_AXIS",
        },
        {
          ruleId: "REVERSE_DIRECTION",
          label: "DIRECTION_ONLY_PARTIAL_RULE",
        },
      ],
    }),
    generateFigureAnalogyProofQuestion({
      seed: "FAN-PROOF-03-006",
      ruleId: "REFLECT_VERTICAL",
      aState: figure("PENTAGON", "CIRCLE", "BOTTOM_LEFT", "LEFT", false, 3),
      cState: figure("SQUARE", "TRIANGLE", "BOTTOM_RIGHT", "UP", true, 2),
      distractors: [
        {
          ruleId: "REFLECT_HORIZONTAL",
          label: "WRONG_REFLECTION_AXIS",
        },
        {
          ruleId: "ROTATE_180",
          label: "ROTATION_SUBSTITUTED_FOR_RULE",
        },
        { ruleId: "NO_CHANGE", label: "NO_CHANGE" },
      ],
    }),
    generateFigureAnalogyProofQuestion({
      seed: "FAN-PROOF-04-004",
      ruleId: "MOVE_MARKER_CLOCKWISE",
      aState: figure("TRIANGLE", "CIRCLE", "TOP_RIGHT", "UP", true, 2),
      cState: figure("CIRCLE", "SQUARE", "BOTTOM_LEFT", "LEFT", false, 3),
      distractors: [
        {
          ruleId: "MOVE_MARKER_COUNTERCLOCKWISE",
          label: "MARKER_MOVED_WRONG_WAY",
        },
        {
          ruleId: "ROTATE_90_CW",
          label: "ROTATION_SUBSTITUTED_FOR_RULE",
        },
        { ruleId: "NO_CHANGE", label: "NO_CHANGE" },
      ],
    }),
    generateFigureAnalogyProofQuestion({
      seed: "FAN-PROOF-05-003",
      ruleId: "ADD_SEGMENT",
      aState: figure("SQUARE", "CIRCLE", "TOP_LEFT", "DOWN", false, 1),
      cState: figure("PENTAGON", "TRIANGLE", "BOTTOM_RIGHT", "RIGHT", true, 2),
      distractors: [
        {
          ruleId: "REMOVE_SEGMENT",
          label: "COUNT_CHANGED_WRONG_WAY",
        },
        { ruleId: "NO_CHANGE", label: "COUNT_UNCHANGED" },
        {
          ruleId: "TOGGLE_INNER_SHADING",
          label: "SHADING_CHANGED_INSTEAD",
        },
      ],
    }),
    generateFigureAnalogyProofQuestion({
      seed: "FAN-PROOF-06-007",
      ruleId: "REMOVE_SEGMENT",
      aState: figure("CIRCLE", "PENTAGON", "TOP_RIGHT", "LEFT", true, 4),
      cState: figure("TRIANGLE", "SQUARE", "BOTTOM_LEFT", "UP", false, 3),
      distractors: [
        {
          ruleId: "ADD_SEGMENT",
          label: "COUNT_CHANGED_WRONG_WAY",
        },
        { ruleId: "NO_CHANGE", label: "COUNT_UNCHANGED" },
        {
          ruleId: "TOGGLE_INNER_SHADING",
          label: "SHADING_CHANGED_INSTEAD",
        },
      ],
    }),
    generateFigureAnalogyProofQuestion({
      seed: "FAN-PROOF-07-001",
      ruleId: "SUBSTITUTE_INNER_NEXT",
      aState: figure("SQUARE", "TRIANGLE", "BOTTOM_RIGHT", "DOWN", false, 2),
      cState: figure("TRIANGLE", "CIRCLE", "TOP_LEFT", "RIGHT", true, 3),
      distractors: [
        {
          ruleId: "NO_CHANGE",
          label: "SHAPE_SUBSTITUTION_SKIPPED",
        },
        {
          ruleId: "SWAP_INNER_OUTER",
          label: "INNER_OUTER_EXCHANGE_INSTEAD",
        },
        {
          ruleId: "TOGGLE_INNER_SHADING",
          label: "SHADING_CHANGED_INSTEAD",
        },
      ],
    }),
    generateFigureAnalogyProofQuestion({
      seed: "FAN-PROOF-08-002",
      ruleId: "TOGGLE_INNER_SHADING",
      aState: figure("PENTAGON", "SQUARE", "BOTTOM_LEFT", "UP", false, 4),
      cState: figure("CIRCLE", "TRIANGLE", "TOP_RIGHT", "LEFT", true, 1),
      distractors: [
        { ruleId: "NO_CHANGE", label: "SHADING_UNCHANGED" },
        {
          ruleId: "SUBSTITUTE_INNER_NEXT",
          label: "SHAPE_CHANGED_INSTEAD",
        },
        {
          ruleId: "REVERSE_DIRECTION",
          label: "DIRECTION_CHANGED_INSTEAD",
        },
      ],
    }),
    generateFigureAnalogyProofQuestion({
      seed: "FAN-PROOF-09-013",
      ruleId: "SWAP_INNER_OUTER",
      aState: figure("SQUARE", "CIRCLE", "TOP_LEFT", "RIGHT", true, 3),
      cState: figure("PENTAGON", "TRIANGLE", "BOTTOM_RIGHT", "DOWN", false, 2),
      distractors: [
        { ruleId: "NO_CHANGE", label: "INNER_OUTER_UNCHANGED" },
        {
          ruleId: "SUBSTITUTE_INNER_NEXT",
          label: "SHAPE_CHANGED_INSTEAD",
        },
        {
          ruleId: "TOGGLE_INNER_SHADING",
          label: "SHADING_CHANGED_INSTEAD",
        },
      ],
    }),
    generateFigureAnalogyProofQuestion({
      seed: "FAN-PROOF-10-014",
      ruleId: "COMPOUND_ROTATE_90_CW_TOGGLE_SHADING",
      aState: figure("TRIANGLE", "SQUARE", "TOP_LEFT", "UP", false, 2),
      cState: figure("CIRCLE", "PENTAGON", "BOTTOM_RIGHT", "DOWN", true, 4),
      distractors: [
        {
          ruleId: "ROTATE_90_CW",
          label: "PARTIAL_RULE_ROTATION_ONLY",
        },
        {
          ruleId: "TOGGLE_INNER_SHADING",
          label: "PARTIAL_RULE_SHADING_ONLY",
        },
        {
          ruleId: "COMPOUND_ROTATE_90_CCW_TOGGLE_SHADING",
          label: "WRONG_ROTATION_DIRECTION",
        },
      ],
    }),
  ];
}
