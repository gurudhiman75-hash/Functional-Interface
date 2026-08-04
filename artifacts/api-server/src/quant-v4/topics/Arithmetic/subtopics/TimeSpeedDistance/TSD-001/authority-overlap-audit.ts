import type { TsdCp001SourceCandidate } from "./cp001/discovery-registry";
import type { TsdCp002SourceCandidate } from "./cp002/discovery-registry";

export type TsdAuditedSourceCandidate = TsdCp001SourceCandidate | TsdCp002SourceCandidate;

export type TsdAuthorityAuditDecision =
  | "KEEP_DISTINCT"
  | "MERGE_AS_REPRESENTATION"
  | "SPLIT_BY_EQUATION"
  | "KEEP_PARAMETERIZED";

export interface TsdAuthorityAuditRecord {
  readonly currentQlId: `TSD-QL-${string}`;
  readonly currentSolveMode: string;
  readonly decision: TsdAuthorityAuditDecision;
  readonly targetAuthorityKeys: readonly string[];
  readonly sourceCandidates: readonly TsdAuditedSourceCandidate[];
  readonly essentialOperation: string;
  readonly reason: string;
  readonly implementationStatus: "DECIDED_NOT_IMPLEMENTED";
  readonly permanentIdsAssigned: false;
}

function record(
  currentQlId: TsdAuthorityAuditRecord["currentQlId"],
  currentSolveMode: string,
  decision: TsdAuthorityAuditDecision,
  targetAuthorityKeys: readonly string[],
  sourceCandidates: readonly TsdAuditedSourceCandidate[],
  essentialOperation: string,
  reason: string,
): TsdAuthorityAuditRecord {
  return Object.freeze({
    currentQlId,
    currentSolveMode,
    decision,
    targetAuthorityKeys: Object.freeze([...targetAuthorityKeys]),
    sourceCandidates: Object.freeze([...sourceCandidates]),
    essentialOperation,
    reason,
    implementationStatus: "DECIDED_NOT_IMPLEMENTED",
    permanentIdsAssigned: false,
  });
}

export const TSD_CROSS_QL_AUTHORITY_AUDIT: readonly TsdAuthorityAuditRecord[] = Object.freeze([
  record(
    "TSD-QL-017",
    "distanceByProportion",
    "KEEP_DISTINCT",
    ["referenceTripDistanceAtChangedConditions"],
    ["findUnknownDistanceByDirectProportion"],
    "Infer a latent reference rate and scale distance by target-speed and target-time factors.",
    "QL-001 supplies speed directly. This task first reconstructs or compares against a reference trip, so the hidden-rate inference is essential rather than cosmetic. The current same-speed review is incomplete and must add a changed-speed representation.",
  ),
  record(
    "TSD-QL-018",
    "timeByProportion",
    "KEEP_DISTINCT",
    ["referenceTripTimeAtChangedConditions"],
    ["findUnknownTimeByDirectProportion", "findTimeAfterSpeedChangeForSameDistance"],
    "Infer a reference rate and scale time by target-distance and inverse target-speed factors.",
    "QL-003 supplies the target speed and distance directly. This authority requires comparison with a reference trip and supports both changed distance and changed speed. The current review must expose both representations before refreeze.",
  ),
  record(
    "TSD-QL-032",
    "roundTripTimeFromOneWayDistance",
    "KEEP_DISTINCT",
    ["roundTripLegTimeSum"],
    ["findRoundTripTimeFromOneWayDistanceAndSpeeds"],
    "Compute two unequal leg times for the repeated one-way distance and add them.",
    "QL-003 is a one-leg distance/speed calculation. The outward-return task requires preserving equal-distance leg structure and summing two durations; this multi-leg invariant belongs in CP-002.",
  ),
  record(
    "TSD-QL-033",
    "totalDistanceFromAverageAndTime",
    "MERGE_AS_REPRESENTATION",
    ["distanceFromSpeedAndTime:OVERALL_AVERAGE_AS_EFFECTIVE_SPEED"],
    ["findTotalDistanceFromAverageSpeedAndTotalTime"],
    "Multiply an explicitly supplied effective speed by total time.",
    "No segment data are reconstructed or used. Calling the supplied speed an overall average does not change the learner operation from QL-001, so a separate authority would be story-only duplication.",
  ),
  record(
    "TSD-QL-029",
    "unknownSegmentShareFromAverage",
    "SPLIT_BY_EQUATION",
    ["unknownDistanceShareFromAverageSpeed", "unknownTimeShareFromAverageSpeed"],
    ["findUnknownDistanceFractionFromOverallAverage", "findUnknownTimeFractionFromOverallAverage"],
    "Use reciprocal-speed weighting for distance share, or direct-speed weighting for time share.",
    "The two representations solve different governing equations and support different shortcuts and misconception families. A submode is adequate during remodel, but the final authority registry must split them.",
  ),
  record(
    "TSD-QL-034",
    "segmentAllocationFromTotalsAndSpeeds",
    "KEEP_PARAMETERIZED",
    ["segmentAllocationFromTotalsAndSpeeds"],
    [
      "findSegmentDistanceFromTotalDistanceTimeAndSpeeds",
      "findSegmentTimeFromTotalDistanceAndSpeeds",
      "findDistanceCoveredAtEachSpeedFromTotalDistanceAndTime",
      "findTimeSpentAtEachSpeedFromTotalDistanceAndAverage",
    ],
    "Solve the same two-equation system t₁+t₂=T and v₁t₁+v₂t₂=D, then format the requested time or distance.",
    "The requested field changes only the final projection from one solved system. Explicit requestedQuantity submodes preserve authority purity without duplicating the mathematics.",
  ),
  record(
    "TSD-QL-035",
    "segmentRatioFromAverageAndSpeeds",
    "SPLIT_BY_EQUATION",
    ["distanceRatioFromAverageAndSpeeds", "timeRatioFromAverageAndSpeeds"],
    ["findDistanceRatioFromAverageAndSegmentSpeeds", "findTimeRatioFromAverageAndSegmentSpeeds"],
    "Derive a harmonic-weighted distance ratio, or an arithmetic-weighted time ratio.",
    "The equations and valid shortcuts differ. Sharing one learner authority previously attached a time-ratio shortcut to distance-ratio items, so final discovery must split the two tasks.",
  ),
]);

export const TSD_AUTHORITY_AUDIT_PROJECTED_COUNTS = Object.freeze({
  cp001LearnerAuthorities: 23,
  cp002LearnerAuthorities: 15,
  combinedLearnerAuthorities: 38,
  internalQaAuthorities: 4,
  combinedMathematicalAuthorities: 42,
  currentReviewQlMappings: 37,
  permanentIdsAssigned: 0,
});

export const TSD_AUTHORITY_AUDIT_REQUIRED_REPRESENTATIONS = Object.freeze({
  referenceTripDistanceAtChangedConditions: Object.freeze(["SAME_SPEED", "CHANGED_SPEED"] as const),
  referenceTripTimeAtChangedConditions: Object.freeze(["SAME_SPEED", "CHANGED_SPEED_SAME_DISTANCE"] as const),
  roundTripLegTimeSum: Object.freeze(["OUTWARD_RETURN_TWO_LEG"] as const),
  segmentAllocationFromTotalsAndSpeeds: Object.freeze([
    "FIRST_DISTANCE",
    "SECOND_DISTANCE",
    "FIRST_TIME",
    "SECOND_TIME",
  ] as const),
});
