import {
  TSD_CP001_DISCOVERY_AUTHORITIES,
  type TsdCp001SourceCandidate,
} from "./cp001/discovery-registry";
import {
  TSD_CP002_DISCOVERY_AUTHORITIES,
  type TsdCp002SourceCandidate,
} from "./cp002/discovery-registry";

export type TsdFinalSourceCandidate = TsdCp001SourceCandidate | TsdCp002SourceCandidate;
export type TsdFinalCheckpoint = "TSD-CP-001" | "TSD-CP-002";

export interface TsdFinalAuthority {
  readonly authorityKey: string;
  readonly checkpointId: TsdFinalCheckpoint;
  readonly learnerFacing: boolean;
  readonly answerKind: string;
  readonly governingRule: string;
  readonly underlyingSolveModes: readonly string[];
  readonly sourceCandidates: readonly TsdFinalSourceCandidate[];
  readonly legacyReviewQlAliases: readonly `TSD-QL-${string}`[];
  readonly adapterKind:
    | "DIRECT"
    | "REPRESENTATION_MERGE"
    | "SUBMODE_SPLIT"
    | "PARAMETERIZED_PROJECTION"
    | "INTERNAL_QA";
  readonly implementationStatus: "OWNERSHIP_IMPLEMENTED_REVIEW_REMAP_ACTIVE";
  readonly permanentQlId: null;
}

function finalAuthority(
  authorityKey: string,
  checkpointId: TsdFinalCheckpoint,
  learnerFacing: boolean,
  answerKind: string,
  governingRule: string,
  underlyingSolveModes: readonly string[],
  sourceCandidates: readonly TsdFinalSourceCandidate[],
  legacyReviewQlAliases: readonly `TSD-QL-${string}`[],
  adapterKind: TsdFinalAuthority["adapterKind"],
): TsdFinalAuthority {
  return Object.freeze({
    authorityKey,
    checkpointId,
    learnerFacing,
    answerKind,
    governingRule,
    underlyingSolveModes: Object.freeze([...underlyingSolveModes]),
    sourceCandidates: Object.freeze([...sourceCandidates]),
    legacyReviewQlAliases: Object.freeze([...legacyReviewQlAliases]),
    adapterKind,
    implementationStatus: "OWNERSHIP_IMPLEMENTED_REVIEW_REMAP_ACTIVE",
    permanentQlId: null,
  });
}

const CP001_QL_BY_MODE = Object.freeze(new Map(
  TSD_CP001_DISCOVERY_AUTHORITIES
    .filter((entry) => Number(entry.provisionalId.slice(-3)) <= 23)
    .map((entry, index) => [entry.solveMode, `TSD-QL-${String(index + 1).padStart(3, "0")}` as const]),
));

const CP002_QL_BY_MODE = Object.freeze(new Map<string, `TSD-QL-${string}`>([
  ["averageSpeedFromSegments", "TSD-QL-024"],
  ["averagePaceFromSegments", "TSD-QL-025"],
  ["unknownSegmentSpeedFromAverage", "TSD-QL-026"],
  ["unknownSegmentTimeFromAverage", "TSD-QL-027"],
  ["unknownSegmentDistanceFromAverage", "TSD-QL-028"],
  ["unknownSegmentShareFromAverage", "TSD-QL-029"],
  ["unknownRoundTripLegSpeedFromAverage", "TSD-QL-030"],
  ["oneWayDistanceFromRoundTripData", "TSD-QL-031"],
  ["roundTripTimeFromOneWayDistance", "TSD-QL-032"],
  ["totalDistanceFromAverageAndTime", "TSD-QL-033"],
  ["segmentAllocationFromTotalsAndSpeeds", "TSD-QL-034"],
  ["segmentRatioFromAverageAndSpeeds", "TSD-QL-035"],
  ["requiredRemainingSpeedForTargetAverage", "TSD-QL-036"],
  ["compareSegmentedJourneyPlans", "TSD-QL-037"],
]));

const cp001Authorities: TsdFinalAuthority[] = TSD_CP001_DISCOVERY_AUTHORITIES.map((entry) => {
  const internal = entry.solveMode === "classifyUniformMotionState" || entry.solveMode === "verifyUniformMotionClaim";
  const authorityKey = entry.solveMode === "distanceByProportion"
    ? "referenceTripDistanceAtChangedConditions"
    : entry.solveMode === "timeByProportion"
      ? "referenceTripTimeAtChangedConditions"
      : entry.solveMode;
  const sourceCandidates: TsdFinalSourceCandidate[] = [...entry.sourceCandidates];
  const aliases: `TSD-QL-${string}`[] = [];
  const currentAlias = CP001_QL_BY_MODE.get(entry.solveMode);
  if (currentAlias) aliases.push(currentAlias);

  if (entry.solveMode === "distanceFromSpeedAndTime") {
    sourceCandidates.push("findTotalDistanceFromAverageSpeedAndTotalTime");
    aliases.push("TSD-QL-033");
  }

  return finalAuthority(
    authorityKey,
    "TSD-CP-001",
    !internal,
    entry.answerKind,
    entry.governingRule,
    [entry.solveMode, ...(entry.solveMode === "distanceFromSpeedAndTime" ? ["totalDistanceFromAverageAndTime"] : [])],
    sourceCandidates,
    aliases,
    internal ? "INTERNAL_QA" : entry.solveMode === "distanceFromSpeedAndTime" ? "REPRESENTATION_MERGE" : "DIRECT",
  );
});

const cp002Authorities: TsdFinalAuthority[] = [];
for (const entry of TSD_CP002_DISCOVERY_AUTHORITIES) {
  const alias = CP002_QL_BY_MODE.get(entry.solveMode);

  if (entry.solveMode === "totalDistanceFromAverageAndTime") continue;

  if (entry.solveMode === "unknownSegmentShareFromAverage") {
    cp002Authorities.push(finalAuthority(
      "unknownDistanceShareFromAverageSpeed",
      "TSD-CP-002",
      true,
      "PERCENT",
      "DISTANCE_SHARE_RECIPROCAL_WEIGHTING",
      [entry.solveMode],
      ["findUnknownDistanceFractionFromOverallAverage"],
      ["TSD-QL-029"],
      "SUBMODE_SPLIT",
    ));
    cp002Authorities.push(finalAuthority(
      "unknownTimeShareFromAverageSpeed",
      "TSD-CP-002",
      true,
      "PERCENT",
      "TIME_SHARE_DIRECT_WEIGHTING",
      [entry.solveMode],
      ["findUnknownTimeFractionFromOverallAverage"],
      ["TSD-QL-029"],
      "SUBMODE_SPLIT",
    ));
    continue;
  }

  if (entry.solveMode === "segmentRatioFromAverageAndSpeeds") {
    cp002Authorities.push(finalAuthority(
      "distanceRatioFromAverageAndSpeeds",
      "TSD-CP-002",
      true,
      "RATIO",
      "DISTANCE_RATIO_HARMONIC_WEIGHTING",
      [entry.solveMode],
      ["findDistanceRatioFromAverageAndSegmentSpeeds"],
      ["TSD-QL-035"],
      "SUBMODE_SPLIT",
    ));
    cp002Authorities.push(finalAuthority(
      "timeRatioFromAverageAndSpeeds",
      "TSD-CP-002",
      true,
      "RATIO",
      "TIME_RATIO_DIRECT_WEIGHTING",
      [entry.solveMode],
      ["findTimeRatioFromAverageAndSegmentSpeeds"],
      ["TSD-QL-035"],
      "SUBMODE_SPLIT",
    ));
    continue;
  }

  const internal = !entry.learnerFacing;
  cp002Authorities.push(finalAuthority(
    entry.solveMode === "roundTripTimeFromOneWayDistance" ? "roundTripLegTimeSum" : entry.solveMode,
    "TSD-CP-002",
    entry.learnerFacing,
    entry.answerKind,
    entry.governingRule,
    [entry.solveMode],
    entry.sourceCandidates,
    alias ? [alias] : [],
    internal
      ? "INTERNAL_QA"
      : entry.solveMode === "segmentAllocationFromTotalsAndSpeeds"
        ? "PARAMETERIZED_PROJECTION"
        : "DIRECT",
  ));
}

export const TSD_FINAL_AUTHORITIES: readonly TsdFinalAuthority[] = Object.freeze([
  ...cp001Authorities,
  ...cp002Authorities,
]);

export const TSD_FINAL_LEARNER_AUTHORITIES = Object.freeze(TSD_FINAL_AUTHORITIES.filter((entry) => entry.learnerFacing));
export const TSD_FINAL_INTERNAL_AUTHORITIES = Object.freeze(TSD_FINAL_AUTHORITIES.filter((entry) => !entry.learnerFacing));

export function finalAuthorityByKey(authorityKey: string): TsdFinalAuthority {
  const authority = TSD_FINAL_AUTHORITIES.find((entry) => entry.authorityKey === authorityKey);
  if (!authority) throw new Error(`Unknown final TSD authority key: ${authorityKey}`);
  return authority;
}
