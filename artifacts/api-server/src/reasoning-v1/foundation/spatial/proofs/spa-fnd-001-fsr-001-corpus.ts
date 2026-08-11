import { spatialSeriesPresentationForRule } from "../series-rule-authority";
import { generateSpatialSeriesProofQuestion } from "../series-proof-generator";
import type {
  SpatialSeriesFrameState,
  SpatialSeriesProofDefinition,
  SpatialSeriesProofQuestion,
} from "../series-types";

function state(
  primitiveId: SpatialSeriesFrameState["primitiveId"],
  rotationQuarterTurns: SpatialSeriesFrameState["rotationQuarterTurns"],
  markerPosition: SpatialSeriesFrameState["markerPosition"] = "TOP",
  dotAnchor: SpatialSeriesFrameState["dotAnchor"] = "TOP",
  dotCount: SpatialSeriesFrameState["dotCount"] = 3,
): SpatialSeriesFrameState {
  return { primitiveId, rotationQuarterTurns, markerPosition, dotAnchor, dotCount };
}

const DEFINITIONS: readonly SpatialSeriesProofDefinition[] = [
  {
    prototypeId: "FSR-001-PROTOTYPE-01",
    ruleId: "ROTATE_90_CW",
    initialState: state("L_SHAPE", 0),
    presentationProfile: spatialSeriesPresentationForRule("ROTATE_90_CW"),
    distractorRuleIds: ["ROTATE_90_CCW", "ROTATE_180", "NO_CHANGE"],
    desiredCorrectOptionIndex: 0,
  },
  {
    prototypeId: "FSR-001-PROTOTYPE-02",
    ruleId: "ROTATE_90_CCW",
    initialState: state("ARROW_RIGHT", 0),
    presentationProfile: spatialSeriesPresentationForRule("ROTATE_90_CCW"),
    distractorRuleIds: ["ROTATE_90_CW", "ROTATE_180", "NO_CHANGE"],
    desiredCorrectOptionIndex: 1,
  },
  {
    prototypeId: "FSR-001-PROTOTYPE-03",
    ruleId: "ROTATE_180",
    initialState: state("SEMICIRCLE", 0),
    presentationProfile: spatialSeriesPresentationForRule("ROTATE_180"),
    distractorRuleIds: ["ROTATE_90_CW", "ROTATE_90_CCW", "NO_CHANGE"],
    desiredCorrectOptionIndex: 2,
  },
  {
    prototypeId: "FSR-001-PROTOTYPE-04",
    ruleId: "MOVE_MARKER_CW",
    initialState: state("CIRCLE", 0, "TOP"),
    presentationProfile: spatialSeriesPresentationForRule("MOVE_MARKER_CW"),
    distractorRuleIds: ["MOVE_MARKER_CCW", "MOVE_MARKER_180", "NO_CHANGE"],
    desiredCorrectOptionIndex: 3,
  },
  {
    prototypeId: "FSR-001-PROTOTYPE-05",
    ruleId: "MOVE_MARKER_CCW",
    initialState: state("PENTAGON", 0, "TOP"),
    presentationProfile: spatialSeriesPresentationForRule("MOVE_MARKER_CCW"),
    distractorRuleIds: ["MOVE_MARKER_CW", "MOVE_MARKER_180", "NO_CHANGE"],
    desiredCorrectOptionIndex: 0,
  },
  {
    prototypeId: "FSR-001-PROTOTYPE-06",
    ruleId: "MOVE_DOTS_CW",
    initialState: state("V_SHAPE", 0, "TOP", "TOP", 3),
    presentationProfile: spatialSeriesPresentationForRule("MOVE_DOTS_CW"),
    distractorRuleIds: ["MOVE_DOTS_CCW", "MOVE_DOTS_180", "NO_CHANGE"],
    desiredCorrectOptionIndex: 1,
  },
  {
    prototypeId: "FSR-001-PROTOTYPE-07",
    ruleId: "MOVE_DOTS_CCW",
    initialState: state("DIAMOND", 0, "TOP", "TOP", 2),
    presentationProfile: spatialSeriesPresentationForRule("MOVE_DOTS_CCW"),
    distractorRuleIds: ["MOVE_DOTS_CW", "MOVE_DOTS_180", "NO_CHANGE"],
    desiredCorrectOptionIndex: 2,
  },
  {
    prototypeId: "FSR-001-PROTOTYPE-08",
    ruleId: "INCREASE_DOTS",
    initialState: state("CIRCLE", 0, "TOP", "TOP", 1),
    presentationProfile: spatialSeriesPresentationForRule("INCREASE_DOTS"),
    distractorRuleIds: ["DECREASE_DOTS", "MOVE_DOTS_CW", "NO_CHANGE"],
    desiredCorrectOptionIndex: 3,
  },
  {
    prototypeId: "FSR-001-PROTOTYPE-09",
    ruleId: "ROTATE_90_CW_MOVE_MARKER_CCW",
    initialState: state("CHEVRON_RIGHT", 0, "TOP"),
    presentationProfile: spatialSeriesPresentationForRule("ROTATE_90_CW_MOVE_MARKER_CCW"),
    distractorRuleIds: ["ROTATE_90_CW", "MOVE_MARKER_CCW", "ROTATE_90_CCW"],
    desiredCorrectOptionIndex: 0,
  },
  {
    prototypeId: "FSR-001-PROTOTYPE-10",
    ruleId: "ROTATE_90_CCW_MOVE_DOTS_CW",
    initialState: state("T_SHAPE", 0, "TOP", "TOP", 3),
    presentationProfile: spatialSeriesPresentationForRule("ROTATE_90_CCW_MOVE_DOTS_CW"),
    distractorRuleIds: ["ROTATE_90_CCW", "MOVE_DOTS_CW", "ROTATE_90_CW"],
    desiredCorrectOptionIndex: 1,
  },
] as const;

export function buildSpatialSeriesProofCorpus(): SpatialSeriesProofQuestion[] {
  return DEFINITIONS.map(generateSpatialSeriesProofQuestion);
}
