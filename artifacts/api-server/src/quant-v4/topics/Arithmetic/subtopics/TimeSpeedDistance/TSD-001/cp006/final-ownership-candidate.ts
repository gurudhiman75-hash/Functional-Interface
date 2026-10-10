import { TSD_CP006_AUTHORITY_OVERLAP_AUDIT, TSD_CP006_OVERLAP_COUNTS } from "./authority-overlap-audit";

export interface TsdCp006FinalOwnershipCandidate {
  readonly authorityKey: string;
  readonly checkpointId: "TSD-CP-006";
  readonly underlyingSolveModes: readonly string[];
  readonly examRepresentations: readonly string[];
  readonly sourceSaturationRequirements: readonly string[];
  readonly ownershipStatus: "FINAL_MERGE_SPLIT_CANDIDATE";
  readonly permanentQlId: null;
  readonly englishFreezeStatus: "UNFROZEN";
}

const examRepresentations = Object.freeze(new Map<string, readonly string[]>([
  ["circularFirstMeetingOrOvertakeTime", Object.freeze(["two runners start together on a circular track in the same direction", "two runners start together in opposite directions", "first overtake after one relative lap", "nth meeting/overtake stated through the fundamental circular period"])],
  ["relativeLapDifferenceAfterTime", Object.freeze(["faster runner is how many laps ahead", "relative distance expressed in rounds after a fixed time", "compare completed relative laps after mixed hour/minute duration"])],
  ["circularEventCountInWindow", Object.freeze(["number of meetings in a stated duration", "number of overtakes before a deadline", "count events when the last interval is incomplete", "count repeated coincidences from a declared fundamental period"])],
  ["distinctCircularMeetingPointCount", Object.freeze(["how many distinct points can the runners meet at", "meeting locations repeat after a coordinate cycle", "distinguish repeated events from distinct physical track points"])],
  ["circularMeetingPointLocation", Object.freeze(["distance clockwise from the start at first meeting", "modular coordinate of a stated meeting", "meeting point after more than one raw lap of travel"])],
  ["trackLengthFromCircularMeetingPeriod", Object.freeze(["circumference from first overtake time", "track length from opposite-direction first meeting time", "recover one relative-lap distance from speeds and meeting period"])],
  ["runnerSpeedFromCircularEventCount", Object.freeze(["faster speed from overtakes in a time window", "unknown runner speed from repeated meeting count", "recover relative speed first and then the individual speed"])],
  ["simultaneousReturnToStart", Object.freeze(["two runners first return together to the starting point", "three runners simultaneously return to start", "meeting specifically at the starting line after departure", "LCM of individual lap durations with fractional times"])],
  ["multiRunnerFirstCommonMeeting", Object.freeze(["three runners first meet at one point anywhere on the track", "common meeting from two independent pairwise congruences", "mixed directions with a first all-runner coincidence"])],
  ["multiRunnerPairwiseMeetingSchedule", Object.freeze(["find AB AC and BC meeting periods", "order which pair meets first", "pairwise schedule before the first all-runner meeting"])],
  ["circularMeetingFromInitialArcGap", Object.freeze(["runners begin at different points on the same circle", "initial clockwise arc gap given before a catch", "recover an unknown initial arc gap from meeting time", "wrap-sensitive gap where the first valid modular meeting is not the straight-line catch"])],
  ["circularStaggeredStartMeeting", Object.freeze(["one runner starts later on a closed track", "early runner completes part or more than one lap before the second starts", "recover start delay from a later circular meeting", "delayed start with modular position at the later departure instant"])],
  ["circularLapStateAfterTime", Object.freeze(["number of complete laps after a duration", "location on the track after a duration", "quotient and remainder of total travel by circumference", "clockwise or anticlockwise modular position from a non-zero start point"])],
]));

const saturationRequirements = Object.freeze(new Map<string, readonly string[]>([
  ["circularFirstMeetingOrOvertakeTime", Object.freeze(["same-direction and opposite-direction branches", "at least one fractional meeting period", "nth-event representation without creating a separate authority"])],
  ["relativeLapDifferenceAfterTime", Object.freeze(["integer and fractional lap differences", "mixed time units", "avoid collapsing to raw distance-only wording"])],
  ["circularEventCountInWindow", Object.freeze(["same-direction overtake and opposite-direction meeting counts", "exact-boundary and non-boundary windows", "zero/positive event boundary handling in QA even if learner rows remain positive"])],
  ["distinctCircularMeetingPointCount", Object.freeze(["one-point and multi-point cycles", "coprime and non-coprime speed structures", "explicit distinction from event count"])],
  ["circularMeetingPointLocation", Object.freeze(["meeting before and after raw travel exceeds one circumference", "clockwise coordinate conventions", "non-zero modular coordinate cases"])],
  ["trackLengthFromCircularMeetingPeriod", Object.freeze(["same/opposite direction source forms", "fractional period cases", "track length must be inferred as one relative lap, not supplied as an initial straight gap"])],
  ["runnerSpeedFromCircularEventCount", Object.freeze(["at least two event counts", "same-direction and, if source-supported, opposite-direction individual-speed recovery", "exact integer and rational speed results"])],
  ["simultaneousReturnToStart", Object.freeze(["two-runner and three-runner forms", "integer and rational lap durations", "distinguish return-to-start from meeting anywhere"])],
  ["multiRunnerFirstCommonMeeting", Object.freeze(["at least two mixed-direction patterns", "non-trivial pairwise periods", "common meeting not forced to the starting point in every source form"])],
  ["multiRunnerPairwiseMeetingSchedule", Object.freeze(["different earliest-pair orders", "tied and untied pairwise periods in QA", "schedule list and ordering representations"])],
  ["circularMeetingFromInitialArcGap", Object.freeze(["wrap-sensitive cases required", "clockwise and anticlockwise gap conventions", "inverse gap recovery as a representation of the same authority"])],
  ["circularStaggeredStartMeeting", Object.freeze(["early-runner wrap before later start required in part of the pool", "forward and inverse delay forms", "avoid source forms algebraically identical to CP004 no-wrap pursuit"])],
  ["circularLapStateAfterTime", Object.freeze(["complete-lap count and residual-position targets", "non-zero start positions", "both directions and exact modulo handling"])],
]));

const retained = TSD_CP006_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "KEEP_AS_NEW_CP006_AUTHORITY");

export const TSD_CP006_FINAL_NEW_AUTHORITY_CANDIDATES: readonly TsdCp006FinalOwnershipCandidate[] = Object.freeze(
  retained.map((entry) => {
    const ownedModes = TSD_CP006_AUTHORITY_OVERLAP_AUDIT
      .filter((candidate) => candidate.targetAuthority === entry.targetAuthority && (candidate.decision === "KEEP_AS_NEW_CP006_AUTHORITY" || candidate.decision === "MERGE_INTO_CP006_AUTHORITY"))
      .map((candidate) => candidate.solveMode);
    const representations = examRepresentations.get(entry.targetAuthority);
    const requirements = saturationRequirements.get(entry.targetAuthority);
    if (!representations || representations.length < 3) throw new Error(`${entry.targetAuthority}: insufficient CP006 exam representation coverage`);
    if (!requirements || requirements.length < 3) throw new Error(`${entry.targetAuthority}: insufficient CP006 source-saturation requirements`);
    return Object.freeze({
      authorityKey: entry.targetAuthority,
      checkpointId: "TSD-CP-006" as const,
      underlyingSolveModes: Object.freeze(ownedModes),
      examRepresentations: representations,
      sourceSaturationRequirements: requirements,
      ownershipStatus: "FINAL_MERGE_SPLIT_CANDIDATE" as const,
      permanentQlId: null,
      englishFreezeStatus: "UNFROZEN" as const,
    });
  }),
);

export const TSD_CP006_FINAL_OWNERSHIP_CANDIDATE_SUMMARY = Object.freeze({
  newCp006LearnerAuthorities: TSD_CP006_FINAL_NEW_AUTHORITY_CANDIDATES.length,
  mergedCoreSolveModes: TSD_CP006_OVERLAP_COUNTS.mergedCoreModes,
  heldCrossCheckpointModes: TSD_CP006_OVERLAP_COUNTS.heldCrossCheckpointModes,
  heldAdvancedModes: TSD_CP006_OVERLAP_COUNTS.heldAdvancedModes,
  heldRepresentationCandidates: TSD_CP006_OVERLAP_COUNTS.heldRepresentationCandidates,
  internalQaModes: TSD_CP006_OVERLAP_COUNTS.internalQaModes,
  permanentQlCount: 0 as const,
  nextPermanentQl: "TSD-QL-071" as const,
  englishFreezeStatus: "UNFROZEN" as const,
  questionStudioEnabled: false as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
  nextGate: "PRODUCT_OWNER_REVIEW_OF_CP006_13_AUTHORITY_MERGE_SPLIT_BEFORE_QL_ALLOCATION" as const,
});

if (TSD_CP006_FINAL_NEW_AUTHORITY_CANDIDATES.length !== 13) {
  throw new Error(`CP006 final ownership candidate expected 13 learner authorities, found ${TSD_CP006_FINAL_NEW_AUTHORITY_CANDIDATES.length}`);
}
