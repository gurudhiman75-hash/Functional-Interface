import { TSD_CP007_DISCOVERY_CANDIDATES, type TsdCp007SolveMode } from "./discovery-registry";

export type TsdCp007OverlapDecision =
  | "KEEP_AS_NEW_CP007_AUTHORITY"
  | "MERGE_INTO_CP007_AUTHORITY"
  | "HOLD_CROSS_CHECKPOINT_OVERLAP"
  | "HOLD_REPRESENTATION_CANDIDATE"
  | "INTERNAL_QA";

export interface TsdCp007OverlapAuditEntry {
  readonly solveMode: TsdCp007SolveMode;
  readonly decision: TsdCp007OverlapDecision;
  readonly targetAuthority: string;
  readonly reason: string;
}

export const TSD_CP007_AUTHORITY_OVERLAP_AUDIT: readonly TsdCp007OverlapAuditEntry[] = Object.freeze([
  { solveMode: "findTrainCrossingTimeForPole", decision: "KEEP_AS_NEW_CP007_AUTHORITY", targetAuthority: "fixedPointCrossingTime", reason: "A point object makes the train cover exactly its own length; this is the base finite-train event invariant." },
  { solveMode: "findTrainCrossingTimeForStationaryPerson", decision: "MERGE_INTO_CP007_AUTHORITY", targetAuthority: "fixedPointCrossingTime", reason: "A stationary person, pole, signal or tree is the same zero-length fixed object for crossing-distance purposes." },
  { solveMode: "findTrainCrossingTimeForPlatform", decision: "KEEP_AS_NEW_CP007_AUTHORITY", targetAuthority: "finiteFixedObjectCrossingTime", reason: "A complete crossing of a fixed object requires train length plus object length; platform, bridge and tunnel are semantic skins over the same geometry." },
  { solveMode: "findTrainCrossingTimeForBridge", decision: "MERGE_INTO_CP007_AUTHORITY", targetAuthority: "finiteFixedObjectCrossingTime", reason: "Bridge crossing uses the same front-entry to rear-clear event interval and L_train + L_object distance as a platform." },
  { solveMode: "findTrainCrossingTimeForTunnel", decision: "MERGE_INTO_CP007_AUTHORITY", targetAuthority: "finiteFixedObjectCrossingTime", reason: "Tunnel crossing changes wording, not the finite-object crossing invariant." },
  { solveMode: "findTrainLengthFromPoleTimeAndSpeed", decision: "KEEP_AS_NEW_CP007_AUTHORITY", targetAuthority: "trainLengthFromPointCrossing", reason: "The unknown finite train length is reconstructed directly from point-crossing time and train speed." },
  { solveMode: "findTrainSpeedFromLengthAndPoleTime", decision: "KEEP_AS_NEW_CP007_AUTHORITY", targetAuthority: "trainSpeedFromPointCrossing", reason: "The unknown speed is reconstructed from a known train length and point-crossing duration." },
  { solveMode: "findPlatformLengthFromCrossingTime", decision: "KEEP_AS_NEW_CP007_AUTHORITY", targetAuthority: "fixedObjectLengthFromCrossingEvidence", reason: "The learner removes the train's own length from the total crossing distance to recover fixed-object length." },
  { solveMode: "findBridgeLengthFromCrossingTime", decision: "MERGE_INTO_CP007_AUTHORITY", targetAuthority: "fixedObjectLengthFromCrossingEvidence", reason: "Bridge length recovery is the same inverse finite-object crossing contract as platform length recovery." },
  { solveMode: "findTunnelLengthFromCrossingTime", decision: "MERGE_INTO_CP007_AUTHORITY", targetAuthority: "fixedObjectLengthFromCrossingEvidence", reason: "Tunnel length recovery is the same inverse finite-object crossing contract as platform length recovery." },
  { solveMode: "findTrainLengthFromPoleAndPlatformTimes", decision: "KEEP_AS_NEW_CP007_AUTHORITY", targetAuthority: "trainLengthFromPointAndObjectTimes", reason: "Paired point/object times eliminate speed through their extra-time relation and recover train length from a known fixed-object length." },
  { solveMode: "findTrainSpeedFromPoleAndPlatformTimes", decision: "KEEP_AS_NEW_CP007_AUTHORITY", targetAuthority: "trainSpeedFromPointAndObjectTimes", reason: "The extra crossing time over the point observation isolates the fixed-object distance and therefore the train speed." },
  { solveMode: "findPlatformLengthFromPoleAndPlatformTimes", decision: "MERGE_INTO_CP007_AUTHORITY", targetAuthority: "fixedObjectLengthFromCrossingEvidence", reason: "Object length is still the target; the point time merely supplies speed through an intermediate inference and should be a representation of the same inverse authority." },
  { solveMode: "findDifferenceOfPlatformLengthsFromCrossingTimes", decision: "KEEP_AS_NEW_CP007_AUTHORITY", targetAuthority: "fixedObjectLengthDifferenceFromCrossingTimes", reason: "Two unknown fixed objects can be compared without knowing train length because their crossing-time difference isolates only the object-length difference." },
  { solveMode: "findCrossingTimeForTwoFixedObjects", decision: "HOLD_REPRESENTATION_CANDIDATE", targetAuthority: "finiteFixedObjectCrossingTime", reason: "Contiguous bridge-plus-platform or other combined fixed geometry is exam-supported, but algebraically it is one effective fixed length and should not consume its own authority." },
  { solveMode: "findTimeForFrontToReachObject", decision: "HOLD_CROSS_CHECKPOINT_OVERLAP", targetAuthority: "TSD_CP001_GENERIC_DISTANCE_TIME", reason: "If only the train front travels an initial gap to a target, train length is irrelevant and the problem collapses to ordinary distance-time motion." },
  { solveMode: "findTimeForRearToClearObject", decision: "MERGE_INTO_CP007_AUTHORITY", targetAuthority: "finiteFixedObjectCrossingTime", reason: "Measured from front entry, rear-clear time is exactly the complete finite-object crossing interval." },
  { solveMode: "findDurationTrainFullyOccupiesPlatform", decision: "KEEP_AS_NEW_CP007_AUTHORITY", targetAuthority: "fullOccupancyDuration", reason: "The interval from rear entry to front exit uses L_object - L_train when the object is longer than the train, a different event-semantic distance from ordinary crossing." },
  { solveMode: "findDurationTrainFullyOccupiesBridge", decision: "MERGE_INTO_CP007_AUTHORITY", targetAuthority: "fullOccupancyDuration", reason: "Bridge and platform full-occupancy intervals share the same object-minus-train geometry and feasibility condition." },
  { solveMode: "findTimeBetweenEngineAndRearPassingObserver", decision: "MERGE_INTO_CP007_AUTHORITY", targetAuthority: "fixedPointCrossingTime", reason: "The time from engine passing a fixed observer to the rear passing that observer is exactly the train's point-crossing time." },
  { solveMode: "findPartialTrainLengthPassedInGivenTime", decision: "HOLD_REPRESENTATION_CANDIDATE", targetAuthority: "fixedPointCrossingTime", reason: "Partial passage at a point is a bounded progress representation of the point-crossing event, not a separate learner invariant." },
  { solveMode: "findPartialPlatformCoveredInGivenTime", decision: "HOLD_CROSS_CHECKPOINT_OVERLAP", targetAuthority: "TSD_CP001_GENERIC_DISTANCE_TIME", reason: "Without an essential front/rear boundary event this is ordinary distance covered in a time interval, not finite-train crossing ownership." },
  { solveMode: "findTrainEntryOrExitClockTime", decision: "MERGE_INTO_CP007_AUTHORITY", targetAuthority: "trainCrossingEventTimeline", reason: "Adding a crossing-event duration to a clock time is the forward projection of the same event timeline authority." },
  { solveMode: "findUnknownEventTimeFromEntryExitTimeline", decision: "KEEP_AS_NEW_CP007_AUTHORITY", targetAuthority: "trainCrossingEventTimeline", reason: "Timeline questions require identifying which front/rear boundary events the stated clock times represent before applying the correct interval." },
  { solveMode: "findNumberOfPolesPassedAtFixedSpacing", decision: "KEEP_AS_NEW_CP007_AUTHORITY", targetAuthority: "fixedSpacingPointCount", reason: "Exam sources explicitly ask train/pole count over equal spacing; the crucial n points versus n-1 gaps convention is a stable fixed-point sequence contract." },
  { solveMode: "findSpacingBetweenPolesFromPassCount", decision: "MERGE_INTO_CP007_AUTHORITY", targetAuthority: "fixedSpacingPointCount", reason: "Recovering spacing is the inverse form of the same equal-gap point-count authority." },
  { solveMode: "findObjectLengthFromTrainOccupancyDuration", decision: "MERGE_INTO_CP007_AUTHORITY", targetAuthority: "fullOccupancyDuration", reason: "Object-length recovery is the inverse projection of the full-occupancy interval L_object - L_train = v t." },
  { solveMode: "findTrainLengthRatioFromCrossingTimes", decision: "HOLD_REPRESENTATION_CANDIDATE", targetAuthority: "trainLengthFromPointCrossing", reason: "With fixed-point crossings this is a ratio representation of L = v t; with multiple moving trains it crosses into CP008, so no standalone CP007 authority is justified." },
  { solveMode: "reconstructTrainCrossingFromTimeline", decision: "HOLD_REPRESENTATION_CANDIDATE", targetAuthority: "trainCrossingEventTimeline", reason: "A table/caselet reconstruction composes ordinary event intervals and should remain a representation until sources prove a distinct learner contract." },
  { solveMode: "detectCrossingEventSemanticError", decision: "INTERNAL_QA", targetAuthority: "fixedObjectCrossingSemanticValidation", reason: "Semantic-error detection protects generation and explanations but does not consume a learner QL." },
  { solveMode: "classifyFixedObjectTrainStateAsPossibleUniqueOrMultiple", decision: "INTERNAL_QA", targetAuthority: "fixedObjectTrainStateClassification", reason: "Uniqueness/possibility classification is a validation layer over ordinary train-crossing authorities at this gate." },
  { solveMode: "verifyFixedObjectCrossingClaim", decision: "INTERNAL_QA", targetAuthority: "fixedObjectCrossingClaimVerification", reason: "Claim verification is internal assessment infrastructure until learner authorities are frozen." },
  { solveMode: "solveFixedObjectTrainDataSufficiency", decision: "INTERNAL_QA", targetAuthority: "fixedObjectTrainDataSufficiency", reason: "Data sufficiency attaches to frozen ordinary authorities and should not consume a standalone learner QL during discovery." },
]);

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(TSD_CP007_AUTHORITY_OVERLAP_AUDIT.length === TSD_CP007_DISCOVERY_CANDIDATES.length, "Every CP007 discovery candidate must receive exactly one ownership decision");
assert(new Set(TSD_CP007_AUTHORITY_OVERLAP_AUDIT.map((entry) => entry.solveMode)).size === TSD_CP007_AUTHORITY_OVERLAP_AUDIT.length, "Duplicate CP007 overlap decision");
for (const mode of TSD_CP007_DISCOVERY_CANDIDATES) {
  assert(TSD_CP007_AUTHORITY_OVERLAP_AUDIT.some((entry) => entry.solveMode === mode), `${mode}: CP007 overlap decision missing`);
}

const retainedTargets = new Set(TSD_CP007_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "KEEP_AS_NEW_CP007_AUTHORITY").map((entry) => entry.targetAuthority));
for (const entry of TSD_CP007_AUTHORITY_OVERLAP_AUDIT) {
  if (entry.decision === "MERGE_INTO_CP007_AUTHORITY") {
    assert(retainedTargets.has(entry.targetAuthority), `${entry.solveMode}: CP007 merge target ${entry.targetAuthority} is not retained`);
  }
}

export const TSD_CP007_OVERLAP_COUNTS = Object.freeze({
  newLearnerAuthorities: TSD_CP007_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "KEEP_AS_NEW_CP007_AUTHORITY").length,
  mergedCoreModes: TSD_CP007_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "MERGE_INTO_CP007_AUTHORITY").length,
  heldCrossCheckpointModes: TSD_CP007_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "HOLD_CROSS_CHECKPOINT_OVERLAP").length,
  heldRepresentationCandidates: TSD_CP007_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "HOLD_REPRESENTATION_CANDIDATE").length,
  internalQaModes: TSD_CP007_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "INTERNAL_QA").length,
});

assert(TSD_CP007_OVERLAP_COUNTS.newLearnerAuthorities === 11, `Expected 11 retained CP007 learner authorities, received ${TSD_CP007_OVERLAP_COUNTS.newLearnerAuthorities}`);
assert(TSD_CP007_OVERLAP_COUNTS.mergedCoreModes === 12, `Expected 12 merged CP007 modes, received ${TSD_CP007_OVERLAP_COUNTS.mergedCoreModes}`);
assert(TSD_CP007_OVERLAP_COUNTS.heldCrossCheckpointModes === 2, `Expected 2 CP007 cross-checkpoint holds, received ${TSD_CP007_OVERLAP_COUNTS.heldCrossCheckpointModes}`);
assert(TSD_CP007_OVERLAP_COUNTS.heldRepresentationCandidates === 4, `Expected 4 CP007 representation holds, received ${TSD_CP007_OVERLAP_COUNTS.heldRepresentationCandidates}`);
assert(TSD_CP007_OVERLAP_COUNTS.internalQaModes === 4, `Expected 4 CP007 internal QA modes, received ${TSD_CP007_OVERLAP_COUNTS.internalQaModes}`);
