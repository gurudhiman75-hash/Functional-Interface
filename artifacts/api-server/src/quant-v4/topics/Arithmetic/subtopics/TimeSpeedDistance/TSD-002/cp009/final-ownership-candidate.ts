import { TSD_CP009_LEARNER_AUTHORITIES, TSD_CP009_SOURCE_ACCOUNTING } from "./source-saturation-final";

export interface TsdCp009FinalOwnershipCandidate {
  readonly authorityKey: string;
  readonly checkpointId: "TSD-CP-009";
  readonly underlyingSolveModes: readonly string[];
  readonly examRepresentations: readonly string[];
  readonly executableInvariant: string;
  readonly ownershipStatus: "SOURCE_SATURATED_EXECUTABLE_FEASIBILITY_CANDIDATE";
  readonly permanentQlId: null;
}

const representations = Object.freeze(new Map<string, readonly string[]>([
  ["mediumAdjustedGroundSpeed", Object.freeze([
    "boat downstream or upstream from still-water speed and stream speed",
    "swimmer moving with or against a current",
    "aircraft with tailwind or headwind in one dimension",
    "direct assisted/opposed speed comparison before any time-distance step",
    "mixed km/h and m/s wording after unit normalization",
  ])],
  ["mediumComponentsFromAssistedOpposedSpeeds", Object.freeze([
    "recover still-water speed from upstream and downstream speeds",
    "recover stream speed from paired boat ground speeds",
    "recover still-air speed from tailwind/headwind ground speeds",
    "recover one-dimensional wind speed from paired aircraft speeds",
  ])],
  ["mediumLegTravelState", Object.freeze([
    "find downstream travel time for a stated river distance",
    "find upstream travel time for a stated river distance",
    "find distance covered in a stated assisted travel time",
    "find distance covered in a stated opposed travel time",
    "air or water contexts using the same signed-medium equation",
  ])],
  ["pairedEqualDistanceMediumState", Object.freeze([
    "same river distance covered upstream and downstream in different times",
    "find equal distance from upstream-downstream time difference",
    "recover still-water speed from equal-distance paired times",
    "recover current speed from equal-distance paired times",
    "time-ratio or speed-ratio representation of the same paired state",
  ])],
  ["roundTripMediumState", Object.freeze([
    "equal-distance downstream then upstream round trip",
    "find total round-trip time",
    "find average speed over the full out-and-back journey",
    "one-dimensional aircraft tailwind/headwind round trip",
  ])],
  ["mixedUnequalLegMediumState", Object.freeze([
    "different downstream and upstream distances with total time given",
    "recover one unknown assisted-leg distance",
    "recover one unknown opposed-leg distance",
    "recover body-relative speed from two unequal legs when the exact quadratic state is determined",
    "unequal-distance time-difference wording reducible to the same two-leg equation",
  ])],
  ["equalTimeMediumDistanceSpread", Object.freeze([
    "same boat travels downstream and upstream for equal times",
    "find extra distance covered with the current",
    "infer current effect from equal-time distance difference",
    "aircraft or swimmer equal-time assisted/opposed distance spread",
  ])],
  ["mediumShiftedMeetingPoint", Object.freeze([
    "two boats start from opposite ends of a river segment",
    "meeting time uses closing speed with current cancellation",
    "meeting point measured from the upstream end",
    "meeting point measured from the downstream end by complement",
    "show that current changes the distance split without changing meeting time",
  ])],
  ["passiveFloatingObjectState", Object.freeze([
    "raft speed equals current speed",
    "floating log drifts with the stream",
    "find drift time for a passive object",
    "use a passive float as a direct current-speed tracer",
  ])],
  ["floatingObjectRecoveryState", Object.freeze([
    "object dropped from a moving boat and recovered after turnaround",
    "find recovery time after the boat turns",
    "find downstream drift distance of the dropped object before recovery",
    "solve in the water frame where the floating object is stationary",
    "recognize cancellation of boat speed from the classic equal-away/equal-return recovery time",
  ])],
  ["changingMediumState", Object.freeze([
    "same boat repeats a trip after current speed changes",
    "recover new current speed from changed travel time",
    "find increase in current speed between two comparable trips",
    "one-dimensional wind-change analogue with fixed still-air speed",
  ])],
]));

export const TSD_CP009_FINAL_NEW_AUTHORITY_CANDIDATES: readonly TsdCp009FinalOwnershipCandidate[] = Object.freeze(
  TSD_CP009_LEARNER_AUTHORITIES.map((authority) => {
    const underlyingSolveModes = TSD_CP009_SOURCE_ACCOUNTING
      .filter((entry) => (entry.disposition === "LEARNER_AUTHORITY" || entry.disposition === "MERGED") && entry.target === authority.authorityKey)
      .map((entry) => entry.candidate);
    const examRepresentations = representations.get(authority.authorityKey);
    if (!examRepresentations || examRepresentations.length < 4) throw new Error(`${authority.authorityKey}: CP009 representation coverage too thin`);
    if (!underlyingSolveModes.length) throw new Error(`${authority.authorityKey}: CP009 underlying source modes missing`);
    return Object.freeze({
      authorityKey: authority.authorityKey,
      checkpointId: "TSD-CP-009" as const,
      underlyingSolveModes: Object.freeze(underlyingSolveModes),
      examRepresentations,
      executableInvariant: authority.invariant,
      ownershipStatus: "SOURCE_SATURATED_EXECUTABLE_FEASIBILITY_CANDIDATE" as const,
      permanentQlId: null,
    });
  }),
);

if (TSD_CP009_FINAL_NEW_AUTHORITY_CANDIDATES.length !== 11) throw new Error(`Expected 11 CP009 final authority candidates, got ${TSD_CP009_FINAL_NEW_AUTHORITY_CANDIDATES.length}`);
if (new Set(TSD_CP009_FINAL_NEW_AUTHORITY_CANDIDATES.map((entry) => entry.authorityKey)).size !== 11) throw new Error("CP009 final authority keys are not unique");
