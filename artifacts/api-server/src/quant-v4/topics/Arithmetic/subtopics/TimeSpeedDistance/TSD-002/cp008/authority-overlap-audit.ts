import { TSD_CP008_DISCOVERY_CANDIDATES, type TsdCp008SolveMode } from "./discovery-registry";

export type TsdCp008OverlapDecision =
  | "KEEP_AS_NEW_CP008_AUTHORITY"
  | "MERGE_INTO_CP008_AUTHORITY"
  | "HOLD_CROSS_CHECKPOINT_OVERLAP"
  | "HOLD_REPRESENTATION_CANDIDATE"
  | "INTERNAL_QA";

export interface TsdCp008OverlapAuditEntry {
  readonly solveMode: TsdCp008SolveMode;
  readonly decision: TsdCp008OverlapDecision;
  readonly targetAuthority: string;
  readonly reason: string;
}

export const TSD_CP008_AUTHORITY_OVERLAP_AUDIT: readonly TsdCp008OverlapAuditEntry[] = Object.freeze([
  { solveMode: "findCrossingTimeForOppositeDirectionTrains", decision: "KEEP_AS_NEW_CP008_AUTHORITY", targetAuthority: "oppositeDirectionTrainCrossingTime", reason: "Two finite train lengths are traversed at the sum of their speeds; this is the base head-on finite-train relative-motion invariant." },
  { solveMode: "findCrossingTimeForSameDirectionTrains", decision: "KEEP_AS_NEW_CP008_AUTHORITY", targetAuthority: "sameDirectionTrainCrossingTime", reason: "Complete same-direction passage uses the sum of train lengths divided by the positive speed difference and has a distinct feasibility condition." },
  { solveMode: "findOvertakeTimeForTrains", decision: "MERGE_INTO_CP008_AUTHORITY", targetAuthority: "sameDirectionTrainCrossingTime", reason: "Overtaking is the ordinary same-direction complete crossing event once the faster train closes one combined train length." },
  { solveMode: "findRelativeSpeedFromTrainCrossing", decision: "KEEP_AS_NEW_CP008_AUTHORITY", targetAuthority: "relativeSpeedFromTrainCrossing", reason: "Crossing time and the combined finite length directly recover relative speed before direction semantics split that relative speed into individual speeds." },
  { solveMode: "findUnknownTrainLengthFromCrossing", decision: "KEEP_AS_NEW_CP008_AUTHORITY", targetAuthority: "trainLengthFromTrainCrossingEvidence", reason: "A missing train length is reconstructed from relative speed, crossing duration and the other finite train length." },
  { solveMode: "findUnknownTrainSpeedFromCrossing", decision: "KEEP_AS_NEW_CP008_AUTHORITY", targetAuthority: "trainSpeedFromTrainCrossingEvidence", reason: "An individual train speed is recovered from crossing evidence plus direction and the other train speed." },
  { solveMode: "findSumOfTrainLengthsFromCrossing", decision: "MERGE_INTO_CP008_AUTHORITY", targetAuthority: "trainLengthFromTrainCrossingEvidence", reason: "The combined-length target is the direct aggregate form of the same finite-length inverse crossing equation and need not consume a separate authority." },
  { solveMode: "findLengthRatioFromCrossingTimes", decision: "HOLD_REPRESENTATION_CANDIDATE", targetAuthority: "trainLengthFromTrainCrossingEvidence", reason: "Length-ratio questions compose ordinary crossing equations; retain as a representation until sources prove a distinct learner invariant." },
  { solveMode: "findSpeedRatioFromCrossingTimes", decision: "MERGE_INTO_CP008_AUTHORITY", targetAuthority: "trainSpeedFromTrainCrossingEvidence", reason: "A speed ratio recovered from crossing times is an inverse projection of the same direction-aware train-speed evidence system." },
  { solveMode: "findTrainCrossingTimeForMovingPersonSameDirection", decision: "KEEP_AS_NEW_CP008_AUTHORITY", targetAuthority: "movingObserverTrainCrossingTime", reason: "A finite train crossing a moving point observer uses train length divided by train-observer relative speed; the moving observer is essential." },
  { solveMode: "findTrainCrossingTimeForMovingPersonOppositeDirection", decision: "MERGE_INTO_CP008_AUTHORITY", targetAuthority: "movingObserverTrainCrossingTime", reason: "Opposite-direction observer motion changes relative-speed composition from difference to sum but not the learner authority." },
  { solveMode: "findTrainSpeedFromTwoMovingObservers", decision: "KEEP_AS_NEW_CP008_AUTHORITY", targetAuthority: "trainObserverStateFromCrossingTimes", reason: "Paired moving-observer crossing times form a stable inverse system that recovers the train speed rather than only one crossing duration." },
  { solveMode: "findObserverSpeedFromTrainCrossingTimes", decision: "MERGE_INTO_CP008_AUTHORITY", targetAuthority: "trainObserverStateFromCrossingTimes", reason: "Recovering observer speed is the alternate target of the same paired relative-speed equations." },
  { solveMode: "findMeetingTimeBetweenStations", decision: "KEEP_AS_NEW_CP008_AUTHORITY", targetAuthority: "stationMeetingSystem", reason: "Two trains moving between declared stations meet according to a station-distance closure equation; station geometry is essential." },
  { solveMode: "findStationDistanceFromDepartureAndMeetingData", decision: "MERGE_INTO_CP008_AUTHORITY", targetAuthority: "stationMeetingSystem", reason: "Station distance is the inverse target of the same meeting-time closure equation." },
  { solveMode: "findTrainMeetingPointBetweenStations", decision: "MERGE_INTO_CP008_AUTHORITY", targetAuthority: "stationMeetingSystem", reason: "Meeting position is a distance partition of the same station meeting state." },
  { solveMode: "findStaggeredTrainDepartureMeetingTime", decision: "KEEP_AS_NEW_CP008_AUTHORITY", targetAuthority: "staggeredStationMeetingSchedule", reason: "A delayed departure creates a pre-motion head start that must be resolved before the two-train relative meeting interval." },
  { solveMode: "findDepartureDelayFromMeetingState", decision: "MERGE_INTO_CP008_AUTHORITY", targetAuthority: "staggeredStationMeetingSchedule", reason: "Departure delay is the inverse target of the same staggered station schedule." },
  { solveMode: "findPostMeetingTimesToStations", decision: "KEEP_AS_NEW_CP008_AUTHORITY", targetAuthority: "postMeetingStationTimeSystem", reason: "Post-meeting travel times encode the classic reciprocal speed-distance relation and support direct and inverse station-system questions." },
  { solveMode: "findSpeedRatioFromPostMeetingTrainTimes", decision: "MERGE_INTO_CP008_AUTHORITY", targetAuthority: "postMeetingStationTimeSystem", reason: "The speed-ratio target follows from the same post-meeting time identity and should remain under one authority." },
  { solveMode: "findStationDistanceFromPostMeetingTrainTimes", decision: "MERGE_INTO_CP008_AUTHORITY", targetAuthority: "postMeetingStationTimeSystem", reason: "Recovering total station distance is another inverse target of the same post-meeting system." },
  { solveMode: "findTimeGapBetweenPassingTwoObservers", decision: "HOLD_REPRESENTATION_CANDIDATE", targetAuthority: "movingObserverTrainCrossingTime", reason: "A time gap between observer events is a timeline composition over ordinary relative-speed crossings, not yet a distinct invariant." },
  { solveMode: "findTimeGapBetweenTwoTrainCrossings", decision: "HOLD_REPRESENTATION_CANDIDATE", targetAuthority: "oppositeDirectionTrainCrossingTime", reason: "Sequencing two ordinary train-crossing events should remain a representation until source saturation proves separate ownership." },
  { solveMode: "findUnknownPlatformLengthUsingTwoTrains", decision: "KEEP_AS_NEW_CP008_AUTHORITY", targetAuthority: "sharedFixedObjectTwoTrainEvidence", reason: "Two distinct trains supply coupled evidence about one common fixed object; neither single-train CP007 equation alone determines the intended state." },
  { solveMode: "findUnknownTrainLengthUsingCommonPlatform", decision: "MERGE_INTO_CP008_AUTHORITY", targetAuthority: "sharedFixedObjectTwoTrainEvidence", reason: "Changing the unknown from common platform length to one train length does not change the coupled two-train evidence system." },
  { solveMode: "findDualPlatformOrBridgeState", decision: "MERGE_INTO_CP008_AUTHORITY", targetAuthority: "sharedFixedObjectTwoTrainEvidence", reason: "Platform/bridge wording changes the fixed-object skin, while the defining contract remains coupled evidence from two trains." },
  { solveMode: "findTrainOvertakeClockTime", decision: "HOLD_REPRESENTATION_CANDIDATE", targetAuthority: "sameDirectionTrainCrossingTime", reason: "Adding the overtake duration to a clock time is a timeline representation of the same-direction crossing authority." },
  { solveMode: "findTrainMeetingClockTime", decision: "HOLD_REPRESENTATION_CANDIDATE", targetAuthority: "stationMeetingSystem", reason: "Meeting clock time is a clock projection of the station-meeting duration, not a new relative-motion invariant." },
  { solveMode: "findCrossingAfterOneTrainStops", decision: "HOLD_CROSS_CHECKPOINT_OVERLAP", targetAuthority: "TSD_CP012_VARIABLE_MULTI_STAGE_MOTION", reason: "A train stopping creates an explicit rate-stage boundary; CP012 owns variable or multi-stage motion even when train interaction supplies the context." },
  { solveMode: "findCrossingAfterOneTrainChangesSpeed", decision: "HOLD_CROSS_CHECKPOINT_OVERLAP", targetAuthority: "TSD_CP012_VARIABLE_MULTI_STAGE_MOTION", reason: "An explicit speed change is a genuine multi-stage rate schedule and belongs to CP012 rather than consuming a CP008 authority." },
  { solveMode: "findSequenceOfTrainCrossings", decision: "HOLD_REPRESENTATION_CANDIDATE", targetAuthority: "trainRelativeMotionCaselet", reason: "A sequence of crossings composes retained train-relative authorities and should remain a caselet representation at discovery." },
  { solveMode: "findMaximumOrCompleteOverlapDuration", decision: "KEEP_AS_NEW_CP008_AUTHORITY", targetAuthority: "finiteTrainOverlapDuration", reason: "Maximum/complete overlap uses relative motion between corresponding train boundaries and is not identical to complete pass time." },
  { solveMode: "reconstructTrainNetworkCaselet", decision: "HOLD_REPRESENTATION_CANDIDATE", targetAuthority: "trainRelativeMotionCaselet", reason: "Network reconstruction is a multi-item representation over retained authorities unless source evidence proves a separate learner contract." },
  { solveMode: "detectContradictoryTrainStatements", decision: "INTERNAL_QA", targetAuthority: "trainSystemSemanticValidation", reason: "Contradiction detection protects generation and explanations but does not consume a learner QL." },
  { solveMode: "classifyTrainSystemAsPossibleUniqueOrMultiple", decision: "INTERNAL_QA", targetAuthority: "trainSystemStateClassification", reason: "Uniqueness and feasibility classification is validation infrastructure over ordinary learner authorities." },
  { solveMode: "verifyTrainSystemClaim", decision: "INTERNAL_QA", targetAuthority: "trainSystemClaimVerification", reason: "Claim verification remains an internal QA layer during discovery." },
  { solveMode: "solveTrainSystemDataSufficiency", decision: "INTERNAL_QA", targetAuthority: "trainSystemDataSufficiency", reason: "Data sufficiency attaches to frozen authorities and should not consume a standalone QL during discovery." },
]);

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(TSD_CP008_AUTHORITY_OVERLAP_AUDIT.length === TSD_CP008_DISCOVERY_CANDIDATES.length, "Every CP008 discovery candidate must receive exactly one ownership decision");
assert(new Set(TSD_CP008_AUTHORITY_OVERLAP_AUDIT.map((entry) => entry.solveMode)).size === TSD_CP008_AUTHORITY_OVERLAP_AUDIT.length, "Duplicate CP008 overlap decision");
for (const mode of TSD_CP008_DISCOVERY_CANDIDATES) {
  assert(TSD_CP008_AUTHORITY_OVERLAP_AUDIT.some((entry) => entry.solveMode === mode), `${mode}: CP008 overlap decision missing`);
}

const retainedTargets = new Set(TSD_CP008_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "KEEP_AS_NEW_CP008_AUTHORITY").map((entry) => entry.targetAuthority));
for (const entry of TSD_CP008_AUTHORITY_OVERLAP_AUDIT) {
  if (entry.decision === "MERGE_INTO_CP008_AUTHORITY") {
    assert(retainedTargets.has(entry.targetAuthority), `${entry.solveMode}: CP008 merge target ${entry.targetAuthority} is not retained`);
  }
}

export const TSD_CP008_OVERLAP_COUNTS = Object.freeze({
  newLearnerAuthorities: TSD_CP008_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "KEEP_AS_NEW_CP008_AUTHORITY").length,
  mergedCoreModes: TSD_CP008_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "MERGE_INTO_CP008_AUTHORITY").length,
  heldCrossCheckpointModes: TSD_CP008_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "HOLD_CROSS_CHECKPOINT_OVERLAP").length,
  heldRepresentationCandidates: TSD_CP008_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "HOLD_REPRESENTATION_CANDIDATE").length,
  internalQaModes: TSD_CP008_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "INTERNAL_QA").length,
});

assert(TSD_CP008_OVERLAP_COUNTS.newLearnerAuthorities === 12, `Expected 12 retained CP008 learner authorities, received ${TSD_CP008_OVERLAP_COUNTS.newLearnerAuthorities}`);
assert(TSD_CP008_OVERLAP_COUNTS.mergedCoreModes === 12, `Expected 12 merged CP008 modes, received ${TSD_CP008_OVERLAP_COUNTS.mergedCoreModes}`);
assert(TSD_CP008_OVERLAP_COUNTS.heldCrossCheckpointModes === 2, `Expected 2 CP008 cross-checkpoint holds, received ${TSD_CP008_OVERLAP_COUNTS.heldCrossCheckpointModes}`);
assert(TSD_CP008_OVERLAP_COUNTS.heldRepresentationCandidates === 7, `Expected 7 CP008 representation holds, received ${TSD_CP008_OVERLAP_COUNTS.heldRepresentationCandidates}`);
assert(TSD_CP008_OVERLAP_COUNTS.internalQaModes === 4, `Expected 4 CP008 internal QA modes, received ${TSD_CP008_OVERLAP_COUNTS.internalQaModes}`);
