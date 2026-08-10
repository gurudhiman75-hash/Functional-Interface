import { TSD_FINAL_LEARNER_AUTHORITIES } from "../final-authority-registry";
import { TSD_CP003_LEARNER_AUTHORITIES } from "./discovery-registry";

export type TsdCp003OverlapDecision =
  | "KEEP_AS_NEW_CP003_AUTHORITY"
  | "MERGE_INTO_CP003_AUTHORITY"
  | "ABSORB_AS_PRIOR_CHECKPOINT_REPRESENTATION";

export interface TsdCp003OverlapAuditEntry {
  readonly solveMode: string;
  readonly decision: TsdCp003OverlapDecision;
  readonly targetAuthority: string;
  readonly reason: string;
}

export const TSD_CP003_CROSS_CHECKPOINT_OVERLAP_AUDIT: readonly TsdCp003OverlapAuditEntry[] = Object.freeze([
  {
    solveMode: "timeGainLossFromSpeedChange",
    decision: "KEEP_AS_NEW_CP003_AUTHORITY",
    targetAuthority: "timeGainLossFromSpeedChange",
    reason: "The answer is a journey-time delta, not the changed journey time itself; keep one CP-003 delta-time authority and absorb same-arrival start-shift wording into it.",
  },
  {
    solveMode: "distanceFromSpeedTimeDifference",
    decision: "KEEP_AS_NEW_CP003_AUTHORITY",
    targetAuthority: "distanceFromSpeedTimeDifference",
    reason: "This is the inverse fixed-route reciprocal-speed equation D(1/v1-1/v2)=time gap; it is not a direct CP-001 proportionality output.",
  },
  {
    solveMode: "speedFromFixedRouteTimeDifference",
    decision: "KEEP_AS_NEW_CP003_AUTHORITY",
    targetAuthority: "speedFromFixedRouteTimeDifference",
    reason: "The unknown is one speed reconstructed from a fixed-route time difference, including ratio representations; this is a distinct inverse equation family.",
  },
  {
    solveMode: "usualSpeedFromEarlyLatePair",
    decision: "KEEP_AS_NEW_CP003_AUTHORITY",
    targetAuthority: "usualSpeedFromEarlyLatePair",
    reason: "It reconstructs both route distance and scheduled travel time from an early/late pair before solving the on-time speed.",
  },
  {
    solveMode: "distanceFromEarlyLatePair",
    decision: "MERGE_INTO_CP003_AUTHORITY",
    targetAuthority: "distanceFromSpeedTimeDifference",
    reason: "Late+early is exactly the total time difference between two speeds on the same route; the governing equation and distance answer contract are identical.",
  },
  {
    solveMode: "scheduledArrivalTimeFromActualSpeed",
    decision: "ABSORB_AS_PRIOR_CHECKPOINT_REPRESENTATION",
    targetAuthority: "arrivalClockTime",
    reason: "After distance/speed gives duration, the operation is the finalized CP-001 arrival-clock authority; schedule wording does not create a new equation.",
  },
  {
    solveMode: "requiredRecoverySpeedAfterLostTime",
    decision: "ABSORB_AS_PRIOR_CHECKPOINT_REPRESENTATION",
    targetAuthority: "requiredUniformSpeedForDeadline",
    reason: "Late-start/unplanned-stop recovery asks for distance divided by time remaining to a deadline, already owned by CP-001 deadline-speed reconstruction.",
  },
  {
    solveMode: "requiredRemainingSpeedAfterPartialRoute",
    decision: "ABSORB_AS_PRIOR_CHECKPOINT_REPRESENTATION",
    targetAuthority: "requiredRemainingSpeedForTargetAverage",
    reason: "Scheduled total time is equivalent to a target whole-route average; known first-segment distance/time plus unknown remaining speed is the finalized CP-002 target-average inverse.",
  },
  {
    solveMode: "stoppageDurationFromRunningAndOverallSpeed",
    decision: "ABSORB_AS_PRIOR_CHECKPOINT_REPRESENTATION",
    targetAuthority: "unknownSegmentTimeFromAverage",
    reason: "A stop is a zero-distance time segment; solving stop time from running and overall speed is the CP-002 unknown segment-time average equation.",
  },
  {
    solveMode: "overallSpeedIncludingStops",
    decision: "ABSORB_AS_PRIOR_CHECKPOINT_REPRESENTATION",
    targetAuthority: "averageSpeedFromSegments",
    reason: "Overall speed with stops is total distance divided by moving time plus zero-distance stop time, a direct representation of segmented average speed.",
  },
  {
    solveMode: "runningSpeedFromOverallSpeedAndStops",
    decision: "ABSORB_AS_PRIOR_CHECKPOINT_REPRESENTATION",
    targetAuthority: "unknownSegmentSpeedFromAverage",
    reason: "The moving segment covers the whole distance while the stop contributes only time; solving running speed is an inverse segmented-average problem.",
  },
  {
    solveMode: "numberOfStopsFromOverallDelay",
    decision: "KEEP_AS_NEW_CP003_AUTHORITY",
    targetAuthority: "numberOfStopsFromOverallDelay",
    reason: "The unknown is a discrete stop count; this integer answer contract is not present in prior motion authorities.",
  },
  {
    solveMode: "delayFromRegularStops",
    decision: "KEEP_AS_NEW_CP003_AUTHORITY",
    targetAuthority: "delayFromRegularStops",
    reason: "The learner target is accumulated stoppage delay from a discrete count and one-stop duration, distinct from continuous average-speed inverses.",
  },
  {
    solveMode: "restTimeInRepeatedTravelRestCycle",
    decision: "KEEP_AS_NEW_CP003_AUTHORITY",
    targetAuthority: "restTimeInRepeatedTravelRestCycle",
    reason: "It separates travel-cycle count from rest-event count, an important discrete schedule invariant not covered by prior segmented-motion authorities.",
  },
  {
    solveMode: "totalTimeWithRegularStops",
    decision: "KEEP_AS_NEW_CP003_AUTHORITY",
    targetAuthority: "totalTimeWithRegularStops",
    reason: "The explicit regular-stop count pattern and off-by-one stop semantics justify a dedicated discrete elapsed-time authority.",
  },
  {
    solveMode: "speedChangePointDistance",
    decision: "ABSORB_AS_PRIOR_CHECKPOINT_REPRESENTATION",
    targetAuthority: "segmentAllocationFromTotalsAndSpeeds",
    reason: "The change point is exactly the first segment distance in a two-speed allocation with known total distance and total time.",
  },
  {
    solveMode: "fractionOfRouteAtChangedSpeed",
    decision: "ABSORB_AS_PRIOR_CHECKPOINT_REPRESENTATION",
    targetAuthority: "unknownDistanceShareFromAverageSpeed",
    reason: "Total distance and total time define the overall average; the requested percentage is the distance share of one speed segment, already finalized in CP-002.",
  },
  {
    solveMode: "lostTimeDurationFromScheduleRecovery",
    decision: "KEEP_AS_NEW_CP003_AUTHORITY",
    targetAuthority: "lostTimeDurationFromScheduleRecovery",
    reason: "The target reconstructs original lost time as recovered travel-time difference plus residual lateness; neither prior direct deadline nor segmented-average authority returns this quantity.",
  },
  {
    solveMode: "startTimeShiftForSameArrival",
    decision: "MERGE_INTO_CP003_AUTHORITY",
    targetAuthority: "timeGainLossFromSpeedChange",
    reason: "For a fixed route and same arrival, the required departure shift is exactly |D/v1-D/v2|, identical to time gained/lost from the speed change.",
  },
  {
    solveMode: "arrivalShiftFromDepartureAndSpeedChanges",
    decision: "KEEP_AS_NEW_CP003_AUTHORITY",
    targetAuthority: "arrivalShiftFromDepartureAndSpeedChanges",
    reason: "It composes a signed departure shift with a signed travel-time shift; this two-change schedule equation is not a prior clock or speed authority.",
  },
  {
    solveMode: "walkingRidingAllocation",
    decision: "ABSORB_AS_PRIOR_CHECKPOINT_REPRESENTATION",
    targetAuthority: "segmentAllocationFromTotalsAndSpeeds",
    reason: "Walking/riding is a two-speed segment-allocation story; time/distance target wording is a representation of the finalized CP-002 allocation system.",
  },
  {
    solveMode: "scheduleBuffer",
    decision: "KEEP_AS_NEW_CP003_AUTHORITY",
    targetAuthority: "scheduleBuffer",
    reason: "It directly asks for timetable margin rather than a motion variable. Keep provisional for editorial-value review because the operation is simple but the schedule answer contract is distinct.",
  },
]);

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(TSD_CP003_CROSS_CHECKPOINT_OVERLAP_AUDIT.length === TSD_CP003_LEARNER_AUTHORITIES.length, "Every provisional learner authority must receive one overlap decision");
assert(new Set(TSD_CP003_CROSS_CHECKPOINT_OVERLAP_AUDIT.map((entry) => entry.solveMode)).size === TSD_CP003_CROSS_CHECKPOINT_OVERLAP_AUDIT.length, "Duplicate CP-003 overlap decision");
for (const authority of TSD_CP003_LEARNER_AUTHORITIES) {
  assert(TSD_CP003_CROSS_CHECKPOINT_OVERLAP_AUDIT.some((entry) => entry.solveMode === authority.solveMode), `${authority.solveMode}: overlap decision missing`);
}

const priorAuthorityKeys = new Set(TSD_FINAL_LEARNER_AUTHORITIES.map((entry) => entry.authorityKey));
for (const entry of TSD_CP003_CROSS_CHECKPOINT_OVERLAP_AUDIT) {
  if (entry.decision === "ABSORB_AS_PRIOR_CHECKPOINT_REPRESENTATION") {
    assert(priorAuthorityKeys.has(entry.targetAuthority), `${entry.solveMode}: prior target ${entry.targetAuthority} does not exist in finalized CP-001/002 registry`);
  }
  if (entry.decision === "MERGE_INTO_CP003_AUTHORITY") {
    assert(TSD_CP003_CROSS_CHECKPOINT_OVERLAP_AUDIT.some((candidate) => candidate.solveMode === entry.targetAuthority && candidate.decision === "KEEP_AS_NEW_CP003_AUTHORITY"), `${entry.solveMode}: CP-003 merge target ${entry.targetAuthority} is not retained`);
  }
}

const counts = {
  keep: TSD_CP003_CROSS_CHECKPOINT_OVERLAP_AUDIT.filter((entry) => entry.decision === "KEEP_AS_NEW_CP003_AUTHORITY").length,
  mergeWithinCp003: TSD_CP003_CROSS_CHECKPOINT_OVERLAP_AUDIT.filter((entry) => entry.decision === "MERGE_INTO_CP003_AUTHORITY").length,
  absorbPrior: TSD_CP003_CROSS_CHECKPOINT_OVERLAP_AUDIT.filter((entry) => entry.decision === "ABSORB_AS_PRIOR_CHECKPOINT_REPRESENTATION").length,
};
assert(counts.keep === 11, `Expected 11 provisional new CP-003 learner authorities after overlap audit, received ${counts.keep}`);
assert(counts.mergeWithinCp003 === 2, `Expected two within-CP003 merges, received ${counts.mergeWithinCp003}`);
assert(counts.absorbPrior === 9, `Expected nine prior-checkpoint absorptions, received ${counts.absorbPrior}`);

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP003_CROSS_CHECKPOINT_OVERLAP_AUDIT",
  originalProvisionalLearnerAuthorities: TSD_CP003_LEARNER_AUTHORITIES.length,
  proposedNewCp003LearnerAuthorities: counts.keep,
  mergedIntoAnotherCp003Authority: counts.mergeWithinCp003,
  absorbedAsPriorCheckpointRepresentations: counts.absorbPrior,
  permanentQlCount: 0,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));
