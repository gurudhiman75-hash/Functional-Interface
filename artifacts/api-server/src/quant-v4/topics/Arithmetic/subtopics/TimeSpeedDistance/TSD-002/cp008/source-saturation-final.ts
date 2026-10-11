import { TSD_CP008_DISCOVERY_CANDIDATES, type TsdCp008SolveMode } from "./discovery-registry";

export type TsdCp008FinalDecision =
  | "KEEP_CP008_AUTHORITY"
  | "MERGE_CP008_AUTHORITY"
  | "HOLD_CROSS_CHECKPOINT"
  | "HOLD_REPRESENTATION"
  | "INTERNAL_QA";

export interface TsdCp008SourceSaturationEntry {
  readonly solveMode: TsdCp008SolveMode;
  readonly decision: TsdCp008FinalDecision;
  readonly targetAuthority: string;
  readonly executableInvariant: string;
  readonly saturationReason: string;
}

export const TSD_CP008_SOURCE_SATURATION_FINAL: readonly TsdCp008SourceSaturationEntry[] = Object.freeze([
  { solveMode: "findCrossingTimeForOppositeDirectionTrains", decision: "KEEP_CP008_AUTHORITY", targetAuthority: "oppositeDirectionTrainCrossingTime", executableInvariant: "t=(L1+L2)/(v1+v2)", saturationReason: "Both finite train lengths and opposite-direction relative speed are essential; generic CP004 point-body meeting does not own the combined-length crossing interval." },
  { solveMode: "findCrossingTimeForSameDirectionTrains", decision: "KEEP_CP008_AUTHORITY", targetAuthority: "sameDirectionTrainCrossingTime", executableInvariant: "t=(L1+L2)/(vFast-vSlow)", saturationReason: "Complete overtaking requires the positive speed difference and one combined train length; finite-body clearance is essential." },
  { solveMode: "findOvertakeTimeForTrains", decision: "MERGE_CP008_AUTHORITY", targetAuthority: "sameDirectionTrainCrossingTime", executableInvariant: "t=(L1+L2)/(vFast-vSlow)", saturationReason: "Overtake time and same-direction complete crossing are the same learner invariant." },
  { solveMode: "findRelativeSpeedFromTrainCrossing", decision: "KEEP_CP008_AUTHORITY", targetAuthority: "relativeSpeedFromTrainCrossing", executableInvariant: "vRel=(L1+L2)/t", saturationReason: "This inverse target is repeatedly useful before direction semantics recover individual speed; the finite combined length remains essential." },
  { solveMode: "findUnknownTrainLengthFromCrossing", decision: "KEEP_CP008_AUTHORITY", targetAuthority: "trainLengthFromTrainCrossingEvidence", executableInvariant: "Lunknown=vRel*t-Lknown", saturationReason: "Unknown finite train length is a stable inverse target of two-train crossing evidence." },
  { solveMode: "findUnknownTrainSpeedFromCrossing", decision: "KEEP_CP008_AUTHORITY", targetAuthority: "trainSpeedFromTrainCrossingEvidence", executableInvariant: "vunknown=vRel-vOther or vOther+vRel", saturationReason: "Individual train speed recovery requires direction-aware decomposition of crossing relative speed." },
  { solveMode: "findSumOfTrainLengthsFromCrossing", decision: "MERGE_CP008_AUTHORITY", targetAuthority: "trainLengthFromTrainCrossingEvidence", executableInvariant: "L1+L2=vRel*t", saturationReason: "Combined length is the aggregate projection of the same train-length inverse authority." },
  { solveMode: "findLengthRatioFromCrossingTimes", decision: "HOLD_REPRESENTATION", targetAuthority: "trainLengthFromTrainCrossingEvidence", executableInvariant: "composition of ordinary finite-train crossing equations", saturationReason: "Length-ratio wording changes the representation, not the governing finite-crossing invariant." },
  { solveMode: "findSpeedRatioFromCrossingTimes", decision: "MERGE_CP008_AUTHORITY", targetAuthority: "trainSpeedFromTrainCrossingEvidence", executableInvariant: "direction-aware inverse crossing equations", saturationReason: "Speed-ratio recovery is an alternate output of train-speed reconstruction rather than a separate QL." },
  { solveMode: "findTrainCrossingTimeForMovingPersonSameDirection", decision: "KEEP_CP008_AUTHORITY", targetAuthority: "movingObserverTrainCrossingTime", executableInvariant: "t=Ltrain/(vTrain-vObserver)", saturationReason: "The train is finite while the observer is moving; neither CP004 point-body meeting nor CP007 stationary-point crossing fully owns this contract." },
  { solveMode: "findTrainCrossingTimeForMovingPersonOppositeDirection", decision: "MERGE_CP008_AUTHORITY", targetAuthority: "movingObserverTrainCrossingTime", executableInvariant: "t=Ltrain/(vTrain+vObserver)", saturationReason: "Direction changes relative-speed composition but not the learner authority." },
  { solveMode: "findTrainSpeedFromTwoMovingObservers", decision: "KEEP_CP008_AUTHORITY", targetAuthority: "trainObserverStateFromCrossingTimes", executableInvariant: "paired equations L/tSame=vTrain-vObs and L/tOpp=vTrain+vObs", saturationReason: "Two moving-observer observations create a genuine two-equation inverse state distinct from one crossing duration." },
  { solveMode: "findObserverSpeedFromTrainCrossingTimes", decision: "MERGE_CP008_AUTHORITY", targetAuthority: "trainObserverStateFromCrossingTimes", executableInvariant: "paired observer/train relative-speed equations", saturationReason: "Observer speed and train speed are alternate targets of the same paired state." },

  { solveMode: "findMeetingTimeBetweenStations", decision: "HOLD_CROSS_CHECKPOINT", targetAuthority: "TSD_CP004:firstMeetingOrCatchUpTimeFromGap", executableInvariant: "t=D/(v1+v2) when train lengths are irrelevant", saturationReason: "Calling the point bodies trains does not create a new authority; CP004 already owns first meeting between endpoints." },
  { solveMode: "findStationDistanceFromDepartureAndMeetingData", decision: "HOLD_CROSS_CHECKPOINT", targetAuthority: "TSD_CP004:relativeDistanceFromRelativeMotion", executableInvariant: "D=vRel*t", saturationReason: "Station distance from first-meeting evidence is generic relative distance reconstruction already owned by CP004." },
  { solveMode: "findTrainMeetingPointBetweenStations", decision: "HOLD_CROSS_CHECKPOINT", targetAuthority: "TSD_CP004:firstMeetingPointFromSpeedRelation", executableInvariant: "meeting-point partition by speed ratio", saturationReason: "Finite train length is not used in ordinary station meeting-point questions; CP004 owns the learner invariant." },
  { solveMode: "findStaggeredTrainDepartureMeetingTime", decision: "HOLD_CROSS_CHECKPOINT", targetAuthority: "TSD_CP004:delayedStartPursuitState", executableInvariant: "delay becomes a relative-motion head start before first meeting", saturationReason: "A staggered departure without finite-body clearance is a generic delayed-start relative-motion schedule." },
  { solveMode: "findDepartureDelayFromMeetingState", decision: "HOLD_CROSS_CHECKPOINT", targetAuthority: "TSD_CP004:delayedStartPursuitState", executableInvariant: "inverse delayed-start relative-motion equation", saturationReason: "Recovering the departure delay remains CP004 ownership when train length is not essential." },
  { solveMode: "findPostMeetingTimesToStations", decision: "HOLD_CROSS_CHECKPOINT", targetAuthority: "TSD_CP005:postMeetingArrivalTimeFromSpeedRelation", executableInvariant: "post-meeting endpoint arrival relation", saturationReason: "CP005 already owns post-meeting endpoint times for two travellers; train naming is only a skin." },
  { solveMode: "findSpeedRatioFromPostMeetingTrainTimes", decision: "HOLD_CROSS_CHECKPOINT", targetAuthority: "TSD_CP005:speedRatioFromPostMeetingArrivalTimes", executableInvariant: "speed ratio from reciprocal post-meeting arrival times", saturationReason: "This exact learner target is already a permanent CP005 authority." },
  { solveMode: "findStationDistanceFromPostMeetingTrainTimes", decision: "HOLD_CROSS_CHECKPOINT", targetAuthority: "TSD_CP005:routeDistanceFromPostMeetingEvidence", executableInvariant: "route distance reconstructed from post-meeting evidence", saturationReason: "This exact inverse state is already owned by CP005." },

  { solveMode: "findTimeGapBetweenPassingTwoObservers", decision: "HOLD_REPRESENTATION", targetAuthority: "movingObserverTrainCrossingTime", executableInvariant: "timeline composition over moving-observer crossing events", saturationReason: "The extra clock/timeline layer does not add a new finite-train invariant." },
  { solveMode: "findTimeGapBetweenTwoTrainCrossings", decision: "HOLD_REPRESENTATION", targetAuthority: "oppositeDirectionTrainCrossingTime", executableInvariant: "sequence of ordinary crossing intervals", saturationReason: "A gap between crossing events is a representation over retained crossing authorities." },
  { solveMode: "findUnknownPlatformLengthUsingTwoTrains", decision: "KEEP_CP008_AUTHORITY", targetAuthority: "sharedFixedObjectTwoTrainEvidence", executableInvariant: "two train/object equations share one fixed-object length", saturationReason: "A common platform/bridge coupled with two train states supports a genuine two-equation finite-body system when neither single observation alone determines the requested joint state." },
  { solveMode: "findUnknownTrainLengthUsingCommonPlatform", decision: "MERGE_CP008_AUTHORITY", targetAuthority: "sharedFixedObjectTwoTrainEvidence", executableInvariant: "same coupled common-object system with alternate target", saturationReason: "Changing the requested unknown does not change the coupled two-train evidence authority." },
  { solveMode: "findDualPlatformOrBridgeState", decision: "MERGE_CP008_AUTHORITY", targetAuthority: "sharedFixedObjectTwoTrainEvidence", executableInvariant: "shared fixed-object coupled equations", saturationReason: "Platform/bridge wording is a scene skin over the same two-train system." },
  { solveMode: "findTrainOvertakeClockTime", decision: "HOLD_REPRESENTATION", targetAuthority: "sameDirectionTrainCrossingTime", executableInvariant: "clock projection after computing overtaking duration", saturationReason: "Clock time is a representation of the same-direction crossing authority." },
  { solveMode: "findTrainMeetingClockTime", decision: "HOLD_CROSS_CHECKPOINT", targetAuthority: "TSD_CP004:firstMeetingOrCatchUpTimeFromGap", executableInvariant: "clock projection of generic first meeting", saturationReason: "The underlying meeting duration belongs to CP004; a clock wrapper cannot pull it into CP008." },
  { solveMode: "findCrossingAfterOneTrainStops", decision: "HOLD_CROSS_CHECKPOINT", targetAuthority: "TSD_CP012:variableMultiStageMotion", executableInvariant: "explicit stop creates a rate-stage boundary", saturationReason: "CP012 owns explicit multi-stage rate schedules." },
  { solveMode: "findCrossingAfterOneTrainChangesSpeed", decision: "HOLD_CROSS_CHECKPOINT", targetAuthority: "TSD_CP012:variableMultiStageMotion", executableInvariant: "explicit speed change creates a rate-stage boundary", saturationReason: "CP012 owns explicit multi-stage rate schedules." },
  { solveMode: "findSequenceOfTrainCrossings", decision: "HOLD_REPRESENTATION", targetAuthority: "trainRelativeMotionCaselet", executableInvariant: "composition of retained CP008 authorities", saturationReason: "A sequence/caselet should reuse ordinary authorities rather than consume a learner QL." },
  { solveMode: "findMaximumOrCompleteOverlapDuration", decision: "KEEP_CP008_AUTHORITY", targetAuthority: "fullContainmentOverlapDuration", executableInvariant: "tContain=|Llong-Lshort|/vRel for unequal finite lengths", saturationReason: "Only the explicit interval during which the shorter train is wholly inside the longitudinal span of the longer is retained; ambiguous 'maximum overlap' wording is rejected." },
  { solveMode: "reconstructTrainNetworkCaselet", decision: "HOLD_REPRESENTATION", targetAuthority: "trainRelativeMotionCaselet", executableInvariant: "multi-item composition of retained authorities", saturationReason: "Network reconstruction is a caselet representation, not a new single learner invariant." },
  { solveMode: "detectContradictoryTrainStatements", decision: "INTERNAL_QA", targetAuthority: "trainSystemSemanticValidation", executableInvariant: "reject inconsistent finite-train evidence", saturationReason: "Generation QA only." },
  { solveMode: "classifyTrainSystemAsPossibleUniqueOrMultiple", decision: "INTERNAL_QA", targetAuthority: "trainSystemStateClassification", executableInvariant: "classify UNIQUE/MULTIPLE/IMPOSSIBLE", saturationReason: "Assessment infrastructure over ordinary authorities." },
  { solveMode: "verifyTrainSystemClaim", decision: "INTERNAL_QA", targetAuthority: "trainSystemClaimVerification", executableInvariant: "independent claim verification", saturationReason: "Verification infrastructure, not a learner QL." },
  { solveMode: "solveTrainSystemDataSufficiency", decision: "INTERNAL_QA", targetAuthority: "trainSystemDataSufficiency", executableInvariant: "sufficiency over frozen ordinary authorities", saturationReason: "Data sufficiency attaches after ordinary authority freeze." },
]);

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(TSD_CP008_SOURCE_SATURATION_FINAL.length === TSD_CP008_DISCOVERY_CANDIDATES.length, "CP008 source saturation must account for all 37 discovery modes");
assert(new Set(TSD_CP008_SOURCE_SATURATION_FINAL.map((entry) => entry.solveMode)).size === TSD_CP008_DISCOVERY_CANDIDATES.length, "CP008 source saturation contains duplicate solve modes");
for (const mode of TSD_CP008_DISCOVERY_CANDIDATES) assert(TSD_CP008_SOURCE_SATURATION_FINAL.some((entry) => entry.solveMode === mode), `${mode}: missing final source-saturation decision`);

export const TSD_CP008_FINAL_COUNTS = Object.freeze({
  learnerAuthorities: TSD_CP008_SOURCE_SATURATION_FINAL.filter((entry) => entry.decision === "KEEP_CP008_AUTHORITY").length,
  mergedModes: TSD_CP008_SOURCE_SATURATION_FINAL.filter((entry) => entry.decision === "MERGE_CP008_AUTHORITY").length,
  crossCheckpointHolds: TSD_CP008_SOURCE_SATURATION_FINAL.filter((entry) => entry.decision === "HOLD_CROSS_CHECKPOINT").length,
  representationHolds: TSD_CP008_SOURCE_SATURATION_FINAL.filter((entry) => entry.decision === "HOLD_REPRESENTATION").length,
  internalQaModes: TSD_CP008_SOURCE_SATURATION_FINAL.filter((entry) => entry.decision === "INTERNAL_QA").length,
});

assert(TSD_CP008_FINAL_COUNTS.learnerAuthorities === 9, `Expected 9 source-saturated CP008 learner authorities, got ${TSD_CP008_FINAL_COUNTS.learnerAuthorities}`);
assert(TSD_CP008_FINAL_COUNTS.mergedModes === 7, `Expected 7 merged CP008 modes, got ${TSD_CP008_FINAL_COUNTS.mergedModes}`);
assert(TSD_CP008_FINAL_COUNTS.crossCheckpointHolds === 11, `Expected 11 CP008 cross-checkpoint holds, got ${TSD_CP008_FINAL_COUNTS.crossCheckpointHolds}`);
assert(TSD_CP008_FINAL_COUNTS.representationHolds === 6, `Expected 6 CP008 representation holds, got ${TSD_CP008_FINAL_COUNTS.representationHolds}`);
assert(TSD_CP008_FINAL_COUNTS.internalQaModes === 4, `Expected 4 CP008 internal-QA modes, got ${TSD_CP008_FINAL_COUNTS.internalQaModes}`);

export const TSD_CP008_SOURCE_SATURATION_POLICY = Object.freeze({
  checkpointId: "TSD-CP-008" as const,
  status: "SOURCE_SATURATED_EXECUTABLE_FEASIBILITY_CANDIDATE" as const,
  finiteLengthEssentialityRule: "At least one finite train length or a genuinely coupled finite-train system must affect the target equation." as const,
  genericStationMeetingOwner: "TSD-CP-004" as const,
  postMeetingStationOwner: "TSD-CP-005" as const,
  explicitRateStageOwner: "TSD-CP-012" as const,
  ambiguousMaximumOverlapRejected: true as const,
  permanentQlCount: 0 as const,
  nextPermanentQl: "TSD-QL-095" as const,
  questionStudioEnabled: false as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
});
