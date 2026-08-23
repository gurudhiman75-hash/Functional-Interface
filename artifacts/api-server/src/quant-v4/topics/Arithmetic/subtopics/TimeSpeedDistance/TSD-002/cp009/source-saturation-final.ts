export type TsdCp009Disposition = "LEARNER_AUTHORITY" | "MERGED" | "CROSS_CHECKPOINT_HOLD" | "INTERNAL_QA";

export type TsdCp009AuthorityKey =
  | "mediumAdjustedGroundSpeed"
  | "mediumComponentsFromAssistedOpposedSpeeds"
  | "mediumLegTravelState"
  | "pairedEqualDistanceMediumState"
  | "roundTripMediumState"
  | "mixedUnequalLegMediumState"
  | "equalTimeMediumDistanceSpread"
  | "mediumShiftedMeetingPoint"
  | "passiveFloatingObjectState"
  | "floatingObjectRecoveryState"
  | "changingMediumState";

export const TSD_CP009_SOURCE_CANDIDATES = Object.freeze([
  "findDownstreamSpeed",
  "findUpstreamSpeed",
  "findStillWaterSpeed",
  "findStreamSpeed",
  "findDownstreamTime",
  "findUpstreamTime",
  "findDistanceFromUpstreamAndDownstreamTimes",
  "findDistanceFromEqualDistanceTimeDifference",
  "findStillWaterSpeedFromEqualDistanceTimes",
  "findStreamSpeedFromEqualDistanceTimes",
  "findUpstreamDownstreamSpeedRatio",
  "findUpstreamDownstreamTimeRatio",
  "findStillWaterSpeedFromTimeRatio",
  "findStreamSpeedFromTimeRatio",
  "findRoundTripTimeInStream",
  "findRoundTripAverageSpeedInStream",
  "findUnknownLegDistanceInStream",
  "findUnknownLegSpeedInStream",
  "findDistanceDifferenceAtEqualTime",
  "findTimeDifferenceForUnequalDistances",
  "findBoatCatchUpTimeInStream",
  "findMeetingTimeForOppositeDirectionBoats",
  "findMeetingPointForTwoBoats",
  "findRaftOrFloatingObjectSpeed",
  "findRaftTravelTime",
  "findBoatCatchFloatingObjectTime",
  "findDroppedObjectRecoveryDistance",
  "findTurnaroundTimeToRecoverFloatingObject",
  "findSwimmerSpeedAlongStream",
  "findAircraftGroundSpeedWithTailwind",
  "findAircraftGroundSpeedWithHeadwind",
  "findStillAirSpeed",
  "findWindSpeed",
  "findAircraftRoundTripTime",
  "findCurrentChangeFromTwoTrips",
  "validateStillSpeedGreaterThanCurrent",
  "classifyMediumMotionStateAsPossibleUniqueOrMultiple",
  "verifyBoatStreamOrWindClaim",
  "solveMediumMotionDataSufficiency",
] as const);

export const TSD_CP009_LEARNER_AUTHORITIES = Object.freeze([
  Object.freeze({
    authorityKey: "mediumAdjustedGroundSpeed" as const,
    sourceCandidate: "findDownstreamSpeed" as const,
    learnerContract: "Find assisted or opposed ground speed when a body's speed relative to a one-dimensional medium and the medium speed are known.",
    invariant: "v_ground = u + c for assisted motion; v_ground = u - c for opposed motion, with u > c for positive opposed progress.",
  }),
  Object.freeze({
    authorityKey: "mediumComponentsFromAssistedOpposedSpeeds" as const,
    sourceCandidate: "findStillWaterSpeed" as const,
    learnerContract: "Recover body-relative speed or medium speed from assisted and opposed ground-speed evidence.",
    invariant: "u = (v_assisted + v_opposed)/2 and c = (v_assisted - v_opposed)/2.",
  }),
  Object.freeze({
    authorityKey: "mediumLegTravelState" as const,
    sourceCandidate: "findDownstreamTime" as const,
    learnerContract: "Solve a single assisted or opposed leg for time or distance after constructing the correct medium-adjusted ground speed.",
    invariant: "d = (u ± c)t, using the sign implied by motion relative to the medium.",
  }),
  Object.freeze({
    authorityKey: "pairedEqualDistanceMediumState" as const,
    sourceCandidate: "findDistanceFromUpstreamAndDownstreamTimes" as const,
    learnerContract: "Use paired assisted/opposed observations over the same distance to recover a requested distance, body speed, medium speed, or equivalent ratio state.",
    invariant: "t_assisted = d/(u+c), t_opposed = d/(u-c), hence t_opposed/t_assisted = (u+c)/(u-c).",
  }),
  Object.freeze({
    authorityKey: "roundTripMediumState" as const,
    sourceCandidate: "findRoundTripTimeInStream" as const,
    learnerContract: "Solve an equal-distance out-and-back trip through a one-dimensional medium for total time or average speed.",
    invariant: "T = d/(u+c) + d/(u-c); average speed = 2d/T = (u^2-c^2)/u.",
  }),
  Object.freeze({
    authorityKey: "mixedUnequalLegMediumState" as const,
    sourceCandidate: "findUnknownLegDistanceInStream" as const,
    learnerContract: "Solve a two-leg assisted/opposed trip with unequal leg distances when one route quantity is unknown.",
    invariant: "T = d_assisted/(u+c) + d_opposed/(u-c), with exactly one requested route parameter solved from sufficient evidence.",
  }),
  Object.freeze({
    authorityKey: "equalTimeMediumDistanceSpread" as const,
    sourceCandidate: "findDistanceDifferenceAtEqualTime" as const,
    learnerContract: "Find the distance advantage created by the medium when the same body travels assisted and opposed for equal times.",
    invariant: "Δd = [(u+c)-(u-c)]t = 2ct.",
  }),
  Object.freeze({
    authorityKey: "mediumShiftedMeetingPoint" as const,
    sourceCandidate: "findMeetingPointForTwoBoats" as const,
    learnerContract: "Find where two powered bodies starting from opposite ends meet when a common one-dimensional medium shifts their ground distances even though it cancels from closing speed.",
    invariant: "t_meet = D/(u1+u2); from the upstream end x = (u1+c)t_meet, so the meeting location depends on c while meeting time does not.",
  }),
  Object.freeze({
    authorityKey: "passiveFloatingObjectState" as const,
    sourceCandidate: "findRaftOrFloatingObjectSpeed" as const,
    learnerContract: "Use a passive raft or floating object as a direct tracer of the medium speed.",
    invariant: "v_float,ground = c and t = d/c for passive drift along the one-dimensional medium.",
  }),
  Object.freeze({
    authorityKey: "floatingObjectRecoveryState" as const,
    sourceCandidate: "findBoatCatchFloatingObjectTime" as const,
    learnerContract: "Solve catch/recovery states involving a powered body and a passive floating object after a drop, separation, or turnaround.",
    invariant: "In the medium frame the floating object is stationary and the powered body moves at speed u; recovery is solved from relative separation in that frame.",
  }),
  Object.freeze({
    authorityKey: "changingMediumState" as const,
    sourceCandidate: "findCurrentChangeFromTwoTrips" as const,
    learnerContract: "Recover a changed medium speed from two comparable trip states while the body's relative speed remains fixed.",
    invariant: "Each observation uses v_ground = u ± c_i; shared u couples the two trip equations and the requested change is derived from c1 and c2.",
  }),
] as const);

export const TSD_CP009_SOURCE_ACCOUNTING = Object.freeze([
  { candidate: "findDownstreamSpeed", disposition: "LEARNER_AUTHORITY", target: "mediumAdjustedGroundSpeed" },
  { candidate: "findUpstreamSpeed", disposition: "MERGED", target: "mediumAdjustedGroundSpeed" },
  { candidate: "findStillWaterSpeed", disposition: "LEARNER_AUTHORITY", target: "mediumComponentsFromAssistedOpposedSpeeds" },
  { candidate: "findStreamSpeed", disposition: "MERGED", target: "mediumComponentsFromAssistedOpposedSpeeds" },
  { candidate: "findDownstreamTime", disposition: "LEARNER_AUTHORITY", target: "mediumLegTravelState" },
  { candidate: "findUpstreamTime", disposition: "MERGED", target: "mediumLegTravelState" },
  { candidate: "findDistanceFromUpstreamAndDownstreamTimes", disposition: "LEARNER_AUTHORITY", target: "pairedEqualDistanceMediumState" },
  { candidate: "findDistanceFromEqualDistanceTimeDifference", disposition: "MERGED", target: "pairedEqualDistanceMediumState" },
  { candidate: "findStillWaterSpeedFromEqualDistanceTimes", disposition: "MERGED", target: "pairedEqualDistanceMediumState" },
  { candidate: "findStreamSpeedFromEqualDistanceTimes", disposition: "MERGED", target: "pairedEqualDistanceMediumState" },
  { candidate: "findUpstreamDownstreamSpeedRatio", disposition: "MERGED", target: "pairedEqualDistanceMediumState" },
  { candidate: "findUpstreamDownstreamTimeRatio", disposition: "MERGED", target: "pairedEqualDistanceMediumState" },
  { candidate: "findStillWaterSpeedFromTimeRatio", disposition: "MERGED", target: "pairedEqualDistanceMediumState" },
  { candidate: "findStreamSpeedFromTimeRatio", disposition: "MERGED", target: "pairedEqualDistanceMediumState" },
  { candidate: "findRoundTripTimeInStream", disposition: "LEARNER_AUTHORITY", target: "roundTripMediumState" },
  { candidate: "findRoundTripAverageSpeedInStream", disposition: "MERGED", target: "roundTripMediumState" },
  { candidate: "findUnknownLegDistanceInStream", disposition: "LEARNER_AUTHORITY", target: "mixedUnequalLegMediumState" },
  { candidate: "findUnknownLegSpeedInStream", disposition: "MERGED", target: "mixedUnequalLegMediumState" },
  { candidate: "findDistanceDifferenceAtEqualTime", disposition: "LEARNER_AUTHORITY", target: "equalTimeMediumDistanceSpread" },
  { candidate: "findTimeDifferenceForUnequalDistances", disposition: "MERGED", target: "mixedUnequalLegMediumState" },
  { candidate: "findBoatCatchUpTimeInStream", disposition: "CROSS_CHECKPOINT_HOLD", target: "CP004_GENERIC_RELATIVE_MOTION_CURRENT_CANCELS" },
  { candidate: "findMeetingTimeForOppositeDirectionBoats", disposition: "CROSS_CHECKPOINT_HOLD", target: "CP004_GENERIC_RELATIVE_MOTION_CURRENT_CANCELS" },
  { candidate: "findMeetingPointForTwoBoats", disposition: "LEARNER_AUTHORITY", target: "mediumShiftedMeetingPoint" },
  { candidate: "findRaftOrFloatingObjectSpeed", disposition: "LEARNER_AUTHORITY", target: "passiveFloatingObjectState" },
  { candidate: "findRaftTravelTime", disposition: "MERGED", target: "passiveFloatingObjectState" },
  { candidate: "findBoatCatchFloatingObjectTime", disposition: "LEARNER_AUTHORITY", target: "floatingObjectRecoveryState" },
  { candidate: "findDroppedObjectRecoveryDistance", disposition: "MERGED", target: "floatingObjectRecoveryState" },
  { candidate: "findTurnaroundTimeToRecoverFloatingObject", disposition: "MERGED", target: "floatingObjectRecoveryState" },
  { candidate: "findSwimmerSpeedAlongStream", disposition: "MERGED", target: "mediumAdjustedGroundSpeed" },
  { candidate: "findAircraftGroundSpeedWithTailwind", disposition: "MERGED", target: "mediumAdjustedGroundSpeed" },
  { candidate: "findAircraftGroundSpeedWithHeadwind", disposition: "MERGED", target: "mediumAdjustedGroundSpeed" },
  { candidate: "findStillAirSpeed", disposition: "MERGED", target: "mediumComponentsFromAssistedOpposedSpeeds" },
  { candidate: "findWindSpeed", disposition: "MERGED", target: "mediumComponentsFromAssistedOpposedSpeeds" },
  { candidate: "findAircraftRoundTripTime", disposition: "MERGED", target: "roundTripMediumState" },
  { candidate: "findCurrentChangeFromTwoTrips", disposition: "LEARNER_AUTHORITY", target: "changingMediumState" },
  { candidate: "validateStillSpeedGreaterThanCurrent", disposition: "INTERNAL_QA", target: "FEASIBILITY_GUARD" },
  { candidate: "classifyMediumMotionStateAsPossibleUniqueOrMultiple", disposition: "INTERNAL_QA", target: "STATE_CLASSIFIER" },
  { candidate: "verifyBoatStreamOrWindClaim", disposition: "INTERNAL_QA", target: "INDEPENDENT_VERIFIER" },
  { candidate: "solveMediumMotionDataSufficiency", disposition: "INTERNAL_QA", target: "DATA_SUFFICIENCY_QA" },
] as const satisfies readonly Readonly<{ candidate: (typeof TSD_CP009_SOURCE_CANDIDATES)[number]; disposition: TsdCp009Disposition; target: string }>[]);

export const TSD_CP009_SOURCE_SATURATION = Object.freeze({
  checkpointId: "TSD-CP-009" as const,
  packageId: "TSD-002" as const,
  title: "Motion in a Medium: Boats, Streams and One-Dimensional Wind" as const,
  sourceCandidateCount: 39 as const,
  learnerAuthorityCount: 11 as const,
  mergedModeCount: 22 as const,
  crossCheckpointHoldCount: 2 as const,
  internalQaCount: 4 as const,
  permanentQlCount: 0 as const,
  nextPermanentQl: "TSD-QL-104" as const,
  finiteDimensionPolicy: "ONE_DIMENSIONAL_SIGNED_MEDIUM_ONLY" as const,
  twoDimensionalRiverCrossing: "HELD_FOR_ADVANCED_TRIG_VECTOR_OWNERSHIP" as const,
  vectorWindDrift: "HELD_FOR_ADVANCED_TRIG_VECTOR_OWNERSHIP" as const,
  fluidMechanics: "EXCLUDED" as const,
  questionStudioEnabled: false as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
});
