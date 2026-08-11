import { getSpatialPrimitiveV2 } from "./primitive-library-v2";
import type {
  SpatialSeriesCardinal,
  SpatialSeriesFrameState,
  SpatialSeriesPresentationProfile,
  SpatialSeriesQuarterTurn,
  SpatialSeriesRuleId,
} from "./series-types";

export const SPATIAL_SERIES_RULE_IDS: readonly SpatialSeriesRuleId[] = [
  "ROTATE_90_CW",
  "ROTATE_90_CCW",
  "ROTATE_180",
  "MOVE_MARKER_CW",
  "MOVE_MARKER_CCW",
  "MOVE_MARKER_180",
  "MOVE_DOTS_CW",
  "MOVE_DOTS_CCW",
  "MOVE_DOTS_180",
  "INCREASE_DOTS",
  "DECREASE_DOTS",
  "ROTATE_90_CW_MOVE_MARKER_CCW",
  "ROTATE_90_CCW_MOVE_DOTS_CW",
  "NO_CHANGE",
] as const;

const CW: Record<SpatialSeriesCardinal, SpatialSeriesCardinal> = {
  TOP: "RIGHT",
  RIGHT: "BOTTOM",
  BOTTOM: "LEFT",
  LEFT: "TOP",
};
const CCW: Record<SpatialSeriesCardinal, SpatialSeriesCardinal> = {
  TOP: "LEFT",
  LEFT: "BOTTOM",
  BOTTOM: "RIGHT",
  RIGHT: "TOP",
};

function q(value: number): SpatialSeriesQuarterTurn {
  return (((value % 4) + 4) % 4) as SpatialSeriesQuarterTurn;
}

export function canonicalSpatialSeriesPrimitiveQuarter(
  state: Pick<SpatialSeriesFrameState, "primitiveId" | "rotationQuarterTurns">,
): SpatialSeriesQuarterTurn {
  const period = getSpatialPrimitiveV2(state.primitiveId).rotationPeriodQuarterTurns;
  if (period === 1) return 0;
  if (period === 2) return q(state.rotationQuarterTurns % 2);
  return q(state.rotationQuarterTurns);
}

export function normalizeSpatialSeriesState(
  state: SpatialSeriesFrameState,
): SpatialSeriesFrameState {
  return {
    ...state,
    rotationQuarterTurns: canonicalSpatialSeriesPrimitiveQuarter(state),
  };
}

function rotateCardinal(
  value: SpatialSeriesCardinal,
  delta: 1 | 2 | -1,
): SpatialSeriesCardinal {
  if (delta === 1) return CW[value];
  if (delta === -1) return CCW[value];
  return CW[CW[value]];
}

export function applySpatialSeriesRule(
  stateInput: SpatialSeriesFrameState,
  ruleId: SpatialSeriesRuleId,
): SpatialSeriesFrameState | null {
  const state = normalizeSpatialSeriesState(stateInput);
  const next = { ...state };
  switch (ruleId) {
    case "ROTATE_90_CW":
      next.rotationQuarterTurns = q(state.rotationQuarterTurns + 1);
      break;
    case "ROTATE_90_CCW":
      next.rotationQuarterTurns = q(state.rotationQuarterTurns - 1);
      break;
    case "ROTATE_180":
      next.rotationQuarterTurns = q(state.rotationQuarterTurns + 2);
      break;
    case "MOVE_MARKER_CW":
      next.markerPosition = rotateCardinal(state.markerPosition, 1);
      break;
    case "MOVE_MARKER_CCW":
      next.markerPosition = rotateCardinal(state.markerPosition, -1);
      break;
    case "MOVE_MARKER_180":
      next.markerPosition = rotateCardinal(state.markerPosition, 2);
      break;
    case "MOVE_DOTS_CW":
      next.dotAnchor = rotateCardinal(state.dotAnchor, 1);
      break;
    case "MOVE_DOTS_CCW":
      next.dotAnchor = rotateCardinal(state.dotAnchor, -1);
      break;
    case "MOVE_DOTS_180":
      next.dotAnchor = rotateCardinal(state.dotAnchor, 2);
      break;
    case "INCREASE_DOTS":
      if (state.dotCount >= 5) return null;
      next.dotCount = (state.dotCount + 1) as SpatialSeriesFrameState["dotCount"];
      break;
    case "DECREASE_DOTS":
      if (state.dotCount <= 1) return null;
      next.dotCount = (state.dotCount - 1) as SpatialSeriesFrameState["dotCount"];
      break;
    case "ROTATE_90_CW_MOVE_MARKER_CCW":
      next.rotationQuarterTurns = q(state.rotationQuarterTurns + 1);
      next.markerPosition = rotateCardinal(state.markerPosition, -1);
      break;
    case "ROTATE_90_CCW_MOVE_DOTS_CW":
      next.rotationQuarterTurns = q(state.rotationQuarterTurns - 1);
      next.dotAnchor = rotateCardinal(state.dotAnchor, 1);
      break;
    case "NO_CHANGE":
      break;
  }
  return normalizeSpatialSeriesState(next);
}

export function spatialSeriesRuleDescription(ruleId: SpatialSeriesRuleId): string {
  const descriptions: Record<SpatialSeriesRuleId, string> = {
    ROTATE_90_CW: "the main figure rotates 90° clockwise in every step",
    ROTATE_90_CCW: "the main figure rotates 90° anticlockwise in every step",
    ROTATE_180: "the main figure rotates 180° in every step",
    MOVE_MARKER_CW: "the black marker moves one side clockwise in every step",
    MOVE_MARKER_CCW: "the black marker moves one side anticlockwise in every step",
    MOVE_MARKER_180: "the black marker moves to the opposite side in every step",
    MOVE_DOTS_CW: "the dot group moves one side clockwise in every step",
    MOVE_DOTS_CCW: "the dot group moves one side anticlockwise in every step",
    MOVE_DOTS_180: "the dot group moves to the opposite side in every step",
    INCREASE_DOTS: "one dot is added in every step",
    DECREASE_DOTS: "one dot is removed in every step",
    ROTATE_90_CW_MOVE_MARKER_CCW:
      "the main figure rotates 90° clockwise while the black marker moves one side anticlockwise",
    ROTATE_90_CCW_MOVE_DOTS_CW:
      "the main figure rotates 90° anticlockwise while the dot group moves one side clockwise",
    NO_CHANGE: "the figure does not change",
  };
  return descriptions[ruleId];
}

export function spatialSeriesPresentationForRule(
  ruleId: SpatialSeriesRuleId,
): SpatialSeriesPresentationProfile {
  switch (ruleId) {
    case "MOVE_MARKER_CW":
    case "MOVE_MARKER_CCW":
    case "MOVE_MARKER_180":
    case "ROTATE_90_CW_MOVE_MARKER_CCW":
      return { showMarker: true, showDots: false };
    case "MOVE_DOTS_CW":
    case "MOVE_DOTS_CCW":
    case "MOVE_DOTS_180":
    case "INCREASE_DOTS":
    case "DECREASE_DOTS":
    case "ROTATE_90_CCW_MOVE_DOTS_CW":
      return { showMarker: false, showDots: true };
    default:
      return { showMarker: false, showDots: false };
  }
}

export function spatialSeriesRuleCompatibleWithPresentation(
  ruleId: SpatialSeriesRuleId,
  profile: SpatialSeriesPresentationProfile,
): boolean {
  const required = spatialSeriesPresentationForRule(ruleId);
  return (!required.showMarker || profile.showMarker) && (!required.showDots || profile.showDots);
}
