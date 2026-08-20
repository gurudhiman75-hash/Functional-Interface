import { TSD_CP006_DISCOVERY_CANDIDATES, type TsdCp006SolveMode } from "./discovery-registry";

export type TsdCp006OverlapDecision =
  | "KEEP_AS_NEW_CP006_AUTHORITY"
  | "MERGE_INTO_CP006_AUTHORITY"
  | "HOLD_CROSS_CHECKPOINT_OVERLAP"
  | "HOLD_ADVANCED_DISCOVERY"
  | "HOLD_REPRESENTATION_CANDIDATE"
  | "INTERNAL_QA";

export interface TsdCp006OverlapAuditEntry {
  readonly solveMode: TsdCp006SolveMode;
  readonly decision: TsdCp006OverlapDecision;
  readonly targetAuthority: string;
  readonly reason: string;
}

export const TSD_CP006_AUTHORITY_OVERLAP_AUDIT: readonly TsdCp006OverlapAuditEntry[] = Object.freeze([
  { solveMode: "findCircularFirstMeetingTimeSameDirection", decision: "KEEP_AS_NEW_CP006_AUTHORITY", targetAuthority: "circularFirstMeetingOrOvertakeTime", reason: "The learner must recognise that one full relative lap, not a one-way initial gap, is required before same-direction runners coincide again. Opposite-direction and nth-event forms are directional/ordinal branches of this same modular event-time authority." },
  { solveMode: "findCircularFirstMeetingTimeOppositeDirections", decision: "MERGE_INTO_CP006_AUTHORITY", targetAuthority: "circularFirstMeetingOrOvertakeTime", reason: "Changing direction replaces difference speed with sum speed but leaves the governing closed-track relative-lap invariant unchanged." },
  { solveMode: "findFirstOvertakeTime", decision: "MERGE_INTO_CP006_AUTHORITY", targetAuthority: "circularFirstMeetingOrOvertakeTime", reason: "An overtake is the same-direction naming of a circular coincidence after one relative lap." },
  { solveMode: "findLapDifferenceAfterTime", decision: "KEEP_AS_NEW_CP006_AUTHORITY", targetAuthority: "relativeLapDifferenceAfterTime", reason: "The target is accumulated relative laps after a stated duration rather than the time of a meeting event." },
  { solveMode: "findMeetingCountInTimeWindow", decision: "KEEP_AS_NEW_CP006_AUTHORITY", targetAuthority: "circularEventCountInWindow", reason: "Counting repeated circular coincidences before a deadline is a bounded event-count contract, distinct from asking for one event time." },
  { solveMode: "findOvertakeCountInTimeWindow", decision: "MERGE_INTO_CP006_AUTHORITY", targetAuthority: "circularEventCountInWindow", reason: "Overtake count and opposite-direction meeting count use the same fundamental-event-period counting authority with a directional branch." },
  { solveMode: "findNthMeetingTime", decision: "MERGE_INTO_CP006_AUTHORITY", targetAuthority: "circularFirstMeetingOrOvertakeTime", reason: "The nth event is an integer multiple of the fundamental circular meeting period and introduces only an ordinal parameter." },
  { solveMode: "findNthOvertakeTime", decision: "MERGE_INTO_CP006_AUTHORITY", targetAuthority: "circularFirstMeetingOrOvertakeTime", reason: "Nth overtake time is the same fundamental same-direction relative-lap period multiplied by n." },
  { solveMode: "findDistinctMeetingPointCount", decision: "KEEP_AS_NEW_CP006_AUTHORITY", targetAuthority: "distinctCircularMeetingPointCount", reason: "The learner must distinguish the cycle length of modular meeting coordinates from the number of meeting events." },
  { solveMode: "findMeetingPointLocation", decision: "KEEP_AS_NEW_CP006_AUTHORITY", targetAuthority: "circularMeetingPointLocation", reason: "The requested quantity is the modular coordinate of a meeting on the track, requiring event time plus reduction modulo track length." },
  { solveMode: "findCircularMeetingPointFromSpeedRatio", decision: "HOLD_CROSS_CHECKPOINT_OVERLAP", targetAuthority: "CP004_FIRST_MEETING_POINT_FROM_SPEED_RELATION", reason: "In the current source form the speed-ratio distance split is algebraically identical to CP004 first-meeting-point ownership; retain only if later circular sources make repeated modular position essential." },
  { solveMode: "findCircularSpeedRatioFromMeetingPoint", decision: "HOLD_CROSS_CHECKPOINT_OVERLAP", targetAuthority: "CP004_SPEED_RATIO_FROM_FIRST_MEETING_POINT", reason: "Inferring speed ratio from a single first meeting point duplicates CP004's distance-ratio authority unless additional closed-track evidence is essential." },
  { solveMode: "findTrackLengthFromMeetingTime", decision: "KEEP_AS_NEW_CP006_AUTHORITY", targetAuthority: "trackLengthFromCircularMeetingPeriod", reason: "The unknown is the circumference represented by one complete relative lap; this inverse target is exam-distinct from the meeting-time question even though both share the same circular invariant." },
  { solveMode: "findRunnerSpeedFromMeetingCount", decision: "KEEP_AS_NEW_CP006_AUTHORITY", targetAuthority: "runnerSpeedFromCircularEventCount", reason: "The learner reconstructs an individual speed from repeated event count, track length and elapsed time rather than merely counting events." },
  { solveMode: "findTimeBothReturnToStart", decision: "KEEP_AS_NEW_CP006_AUTHORITY", targetAuthority: "simultaneousReturnToStart", reason: "The governing authority is the exact LCM of lap durations; it is different from a relative meeting anywhere on the track." },
  { solveMode: "findFirstSimultaneousStartPointReturn", decision: "MERGE_INTO_CP006_AUTHORITY", targetAuthority: "simultaneousReturnToStart", reason: "This asks for the same first common lap-cycle completion as the retained return-to-start authority." },
  { solveMode: "findThreeRunnerSimultaneousReturn", decision: "MERGE_INTO_CP006_AUTHORITY", targetAuthority: "simultaneousReturnToStart", reason: "Adding a third runner extends the same rational-LCM return cycle and does not change the learner invariant." },
  { solveMode: "findThreeRunnerFirstCommonMeeting", decision: "KEEP_AS_NEW_CP006_AUTHORITY", targetAuthority: "multiRunnerFirstCommonMeeting", reason: "A common meeting of three runners requires satisfying multiple pairwise modular congruences, not merely each runner returning to the start." },
  { solveMode: "findPairwiseMeetingScheduleForThreeRunners", decision: "KEEP_AS_NEW_CP006_AUTHORITY", targetAuthority: "multiRunnerPairwiseMeetingSchedule", reason: "The answer contract is the set/order of pairwise fundamental meeting periods rather than the first all-runner coincidence." },
  { solveMode: "findMeetingWithInitialArcGap", decision: "KEEP_AS_NEW_CP006_AUTHORITY", targetAuthority: "circularMeetingFromInitialArcGap", reason: "The initial state is a modular arc separation; retained learner forms must require closed-track wrapping so they do not collapse to CP004 straight-line gap pursuit." },
  { solveMode: "findInitialArcGapFromMeetingTime", decision: "MERGE_INTO_CP006_AUTHORITY", targetAuthority: "circularMeetingFromInitialArcGap", reason: "Recovering the initial arc gap is the inverse projection of the same modular-gap meeting state." },
  { solveMode: "findMeetingWithStaggeredStarts", decision: "KEEP_AS_NEW_CP006_AUTHORITY", targetAuthority: "circularStaggeredStartMeeting", reason: "The early runner must first be advanced modulo the track before the later runner enters; retained sources must include wrap-sensitive cases to distinguish this from CP004 delayed-start pursuit." },
  { solveMode: "findStartDelayFromCircularMeeting", decision: "MERGE_INTO_CP006_AUTHORITY", targetAuthority: "circularStaggeredStartMeeting", reason: "Start-delay recovery is the inverse answer contract of the same staggered circular state and should share one authority until source evidence proves otherwise." },
  { solveMode: "findMeetingAfterDirectionReversal", decision: "HOLD_ADVANCED_DISCOVERY", targetAuthority: "circularMeetingAfterDirectionReversal", reason: "A mid-run reversal creates a piecewise circular schedule and needs additional source saturation to prove its boundary against CP012 variable/periodic synthesis." },
  { solveMode: "findMeetingWithLapRest", decision: "HOLD_ADVANCED_DISCOVERY", targetAuthority: "circularMeetingWithLapRest", reason: "Lap-end rest creates a repeated travel-rest cycle that can collide with CP003 schedule ownership; retain executable discovery until closed-track meeting evidence establishes independent learner demand." },
  { solveMode: "findNumberOfCompletedLaps", decision: "KEEP_AS_NEW_CP006_AUTHORITY", targetAuthority: "circularLapStateAfterTime", reason: "Completed laps and residual track position are the quotient/remainder projections of total signed travel by circumference." },
  { solveMode: "findLocationAfterGivenTime", decision: "MERGE_INTO_CP006_AUTHORITY", targetAuthority: "circularLapStateAfterTime", reason: "The modular location is the remainder projection of the same circular lap-state decomposition used to count completed laps." },
  { solveMode: "findFirstMeetingAtStartingPoint", decision: "MERGE_INTO_CP006_AUTHORITY", targetAuthority: "simultaneousReturnToStart", reason: "For runners starting together, a later meeting specifically at the start means their lap cycles complete simultaneously, the retained LCM authority." },
  { solveMode: "distinguishMeetingAnywhereVsAtStart", decision: "HOLD_REPRESENTATION_CANDIDATE", targetAuthority: "MULTIPLE_CP006_AUTHORITIES", reason: "This is a contrast representation combining circular meeting-anywhere time with simultaneous start-line return; it should not consume its own QL." },
  { solveMode: "distinguishTotalMeetingsVsDistinctPoints", decision: "HOLD_REPRESENTATION_CANDIDATE", targetAuthority: "MULTIPLE_CP006_AUTHORITIES", reason: "The task explicitly contrasts event count with distinct modular coordinates and should be attached as a representation over two ordinary authorities." },
  { solveMode: "reconstructCircularMotionFromCheckpointTable", decision: "HOLD_REPRESENTATION_CANDIDATE", targetAuthority: "MULTIPLE_CP006_AUTHORITIES", reason: "Checkpoint-table reconstruction is a composite representation over circular position and speed state; it needs evidence before becoming a standalone learner authority." },
  { solveMode: "classifyCircularStateAsPossibleUniqueOrMultiple", decision: "INTERNAL_QA", targetAuthority: "circularStateClassification", reason: "State uniqueness/possibility remains an internal validation layer until ordinary circular learner authorities are finalized." },
  { solveMode: "verifyCircularTrackClaim", decision: "INTERNAL_QA", targetAuthority: "circularClaimVerification", reason: "Claim verification is a QA/assessment layer over ordinary circular authorities and does not consume a learner QL." },
  { solveMode: "solveCircularTrackDataSufficiency", decision: "INTERNAL_QA", targetAuthority: "circularDataSufficiency", reason: "Data sufficiency is attached after ordinary authority finalization and is not a standalone CP006 learner authority at this gate." },
]);

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(TSD_CP006_AUTHORITY_OVERLAP_AUDIT.length === TSD_CP006_DISCOVERY_CANDIDATES.length, "Every CP006 discovery candidate must receive exactly one ownership decision");
assert(new Set(TSD_CP006_AUTHORITY_OVERLAP_AUDIT.map((entry) => entry.solveMode)).size === TSD_CP006_AUTHORITY_OVERLAP_AUDIT.length, "Duplicate CP006 overlap decision");
for (const mode of TSD_CP006_DISCOVERY_CANDIDATES) {
  assert(TSD_CP006_AUTHORITY_OVERLAP_AUDIT.some((entry) => entry.solveMode === mode), `${mode}: CP006 overlap decision missing`);
}

const retainedTargets = new Set(TSD_CP006_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "KEEP_AS_NEW_CP006_AUTHORITY").map((entry) => entry.targetAuthority));
for (const entry of TSD_CP006_AUTHORITY_OVERLAP_AUDIT) {
  if (entry.decision === "MERGE_INTO_CP006_AUTHORITY") {
    assert(retainedTargets.has(entry.targetAuthority), `${entry.solveMode}: CP006 merge target ${entry.targetAuthority} is not retained`);
  }
}

export const TSD_CP006_OVERLAP_COUNTS = Object.freeze({
  newLearnerAuthorities: TSD_CP006_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "KEEP_AS_NEW_CP006_AUTHORITY").length,
  mergedCoreModes: TSD_CP006_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "MERGE_INTO_CP006_AUTHORITY").length,
  heldCrossCheckpointModes: TSD_CP006_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "HOLD_CROSS_CHECKPOINT_OVERLAP").length,
  heldAdvancedModes: TSD_CP006_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "HOLD_ADVANCED_DISCOVERY").length,
  heldRepresentationCandidates: TSD_CP006_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "HOLD_REPRESENTATION_CANDIDATE").length,
  internalQaModes: TSD_CP006_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "INTERNAL_QA").length,
});

assert(TSD_CP006_OVERLAP_COUNTS.newLearnerAuthorities === 13, `Expected 13 retained CP006 learner authorities, received ${TSD_CP006_OVERLAP_COUNTS.newLearnerAuthorities}`);
assert(TSD_CP006_OVERLAP_COUNTS.mergedCoreModes === 11, `Expected 11 merged CP006 modes, received ${TSD_CP006_OVERLAP_COUNTS.mergedCoreModes}`);
assert(TSD_CP006_OVERLAP_COUNTS.heldCrossCheckpointModes === 2, `Expected 2 CP006 cross-checkpoint holds, received ${TSD_CP006_OVERLAP_COUNTS.heldCrossCheckpointModes}`);
assert(TSD_CP006_OVERLAP_COUNTS.heldAdvancedModes === 2, `Expected 2 CP006 advanced holds, received ${TSD_CP006_OVERLAP_COUNTS.heldAdvancedModes}`);
assert(TSD_CP006_OVERLAP_COUNTS.heldRepresentationCandidates === 3, `Expected 3 CP006 representation holds, received ${TSD_CP006_OVERLAP_COUNTS.heldRepresentationCandidates}`);
assert(TSD_CP006_OVERLAP_COUNTS.internalQaModes === 3, `Expected 3 CP006 internal QA modes, received ${TSD_CP006_OVERLAP_COUNTS.internalQaModes}`);
