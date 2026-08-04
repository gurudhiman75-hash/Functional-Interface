import type { TsdCp002Input, TsdCp002LearnerSolveMode } from "./types";

export type TsdCp002AuthoritySubmode =
  | "STANDARD"
  | "DISTANCE_SHARE"
  | "TIME_SHARE"
  | "FIRST_DISTANCE"
  | "SECOND_DISTANCE"
  | "FIRST_TIME"
  | "SECOND_TIME"
  | "DISTANCE_RATIO"
  | "TIME_RATIO";

export const TSD_CP002_REOPENED_SUBMODE_CONTRACT = Object.freeze({
  unknownSegmentShareFromAverage: Object.freeze(["DISTANCE_SHARE", "TIME_SHARE"] as const),
  segmentAllocationFromTotalsAndSpeeds: Object.freeze([
    "FIRST_DISTANCE",
    "SECOND_DISTANCE",
    "FIRST_TIME",
    "SECOND_TIME",
  ] as const),
  segmentRatioFromAverageAndSpeeds: Object.freeze(["DISTANCE_RATIO", "TIME_RATIO"] as const),
});

export function authoritySubmode(input: TsdCp002Input): TsdCp002AuthoritySubmode {
  switch (input.mode) {
    case "unknownSegmentShareFromAverage":
      return input.shareKind === "DISTANCE" ? "DISTANCE_SHARE" : "TIME_SHARE";
    case "segmentAllocationFromTotalsAndSpeeds":
      return input.requested;
    case "segmentRatioFromAverageAndSpeeds":
      return input.ratioKind === "DISTANCE" ? "DISTANCE_RATIO" : "TIME_RATIO";
    default:
      return "STANDARD";
  }
}

export function requiresAuthorityPurityDecision(mode: TsdCp002LearnerSolveMode): boolean {
  return mode === "unknownSegmentShareFromAverage"
    || mode === "segmentAllocationFromTotalsAndSpeeds"
    || mode === "segmentRatioFromAverageAndSpeeds";
}
