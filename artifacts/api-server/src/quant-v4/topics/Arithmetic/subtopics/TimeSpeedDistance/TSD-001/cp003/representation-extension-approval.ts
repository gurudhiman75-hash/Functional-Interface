import { finalAuthorityByKey } from "../final-authority-registry";

export type TsdCp003RepresentationExtensionSolveMode =
  | "scheduledArrivalTimeFromActualSpeed"
  | "requiredRecoverySpeedAfterLostTime"
  | "requiredRemainingSpeedAfterPartialRoute"
  | "stoppageDurationFromRunningAndOverallSpeed"
  | "overallSpeedIncludingStops"
  | "runningSpeedFromOverallSpeedAndStops"
  | "speedChangePointDistance"
  | "fractionOfRouteAtChangedSpeed"
  | "walkingRidingAllocation";

export interface TsdCp003RepresentationExtensionApproval {
  readonly solveMode: TsdCp003RepresentationExtensionSolveMode;
  readonly targetAuthority: string;
  readonly authorityOwnerCheckpointId: "TSD-CP-001" | "TSD-CP-002";
  readonly contentCheckpointId: "TSD-CP-003";
  readonly decision: "APPROVED_AS_CP003_REPRESENTATION_EXTENSION";
  readonly rationale: string;
  readonly priorFrozenEnglishMutationAllowed: false;
  readonly newPermanentQlRequired: false;
  readonly cp003EnglishFreezeStatus: "UNFROZEN";
}

const specifications: readonly Omit<TsdCp003RepresentationExtensionApproval, "authorityOwnerCheckpointId">[] = Object.freeze([
  {
    solveMode: "scheduledArrivalTimeFromActualSpeed",
    targetAuthority: "arrivalClockTime",
    contentCheckpointId: "TSD-CP-003",
    decision: "APPROVED_AS_CP003_REPRESENTATION_EXTENSION",
    rationale: "Distance divided by actual speed gives the journey duration; adding that duration to departure time is the existing arrival-clock authority. CP-003 schedule wording adds an exam-relevant representation, not a new mathematical unknown.",
    priorFrozenEnglishMutationAllowed: false,
    newPermanentQlRequired: false,
    cp003EnglishFreezeStatus: "UNFROZEN",
  },
  {
    solveMode: "requiredRecoverySpeedAfterLostTime",
    targetAuthority: "requiredUniformSpeedForDeadline",
    contentCheckpointId: "TSD-CP-003",
    decision: "APPROVED_AS_CP003_REPRESENTATION_EXTENSION",
    rationale: "After a delay or stop, required recovery speed is remaining distance divided by the time left to a deadline. That is the finalized deadline-speed authority with CP-003 disruption wording.",
    priorFrozenEnglishMutationAllowed: false,
    newPermanentQlRequired: false,
    cp003EnglishFreezeStatus: "UNFROZEN",
  },
  {
    solveMode: "requiredRemainingSpeedAfterPartialRoute",
    targetAuthority: "requiredRemainingSpeedForTargetAverage",
    contentCheckpointId: "TSD-CP-003",
    decision: "APPROVED_AS_CP003_REPRESENTATION_EXTENSION",
    rationale: "A scheduled total travel time fixes the target whole-route average. After one completed segment, solving the remaining speed is the existing target-average inverse with a schedule representation.",
    priorFrozenEnglishMutationAllowed: false,
    newPermanentQlRequired: false,
    cp003EnglishFreezeStatus: "UNFROZEN",
  },
  {
    solveMode: "stoppageDurationFromRunningAndOverallSpeed",
    targetAuthority: "unknownSegmentTimeFromAverage",
    contentCheckpointId: "TSD-CP-003",
    decision: "APPROVED_AS_CP003_REPRESENTATION_EXTENSION",
    rationale: "Stoppage is a zero-distance time segment. Isolating stop duration from running speed and overall speed is the existing unknown-segment-time average-speed equation.",
    priorFrozenEnglishMutationAllowed: false,
    newPermanentQlRequired: false,
    cp003EnglishFreezeStatus: "UNFROZEN",
  },
  {
    solveMode: "overallSpeedIncludingStops",
    targetAuthority: "averageSpeedFromSegments",
    contentCheckpointId: "TSD-CP-003",
    decision: "APPROVED_AS_CP003_REPRESENTATION_EXTENSION",
    rationale: "Overall speed including stops is total distance divided by moving time plus zero-distance stop time, so it is a direct segmented-average-speed representation rather than a new authority.",
    priorFrozenEnglishMutationAllowed: false,
    newPermanentQlRequired: false,
    cp003EnglishFreezeStatus: "UNFROZEN",
  },
  {
    solveMode: "runningSpeedFromOverallSpeedAndStops",
    targetAuthority: "unknownSegmentSpeedFromAverage",
    contentCheckpointId: "TSD-CP-003",
    decision: "APPROVED_AS_CP003_REPRESENTATION_EXTENSION",
    rationale: "Overall elapsed time includes the stop segment; removing that time and solving the moving segment speed is the existing unknown-segment-speed average authority.",
    priorFrozenEnglishMutationAllowed: false,
    newPermanentQlRequired: false,
    cp003EnglishFreezeStatus: "UNFROZEN",
  },
  {
    solveMode: "speedChangePointDistance",
    targetAuthority: "segmentAllocationFromTotalsAndSpeeds",
    contentCheckpointId: "TSD-CP-003",
    decision: "APPROVED_AS_CP003_REPRESENTATION_EXTENSION",
    rationale: "The distance at which speed changes is exactly the first unknown segment distance in a two-speed allocation with known route distance and total time.",
    priorFrozenEnglishMutationAllowed: false,
    newPermanentQlRequired: false,
    cp003EnglishFreezeStatus: "UNFROZEN",
  },
  {
    solveMode: "fractionOfRouteAtChangedSpeed",
    targetAuthority: "unknownDistanceShareFromAverageSpeed",
    contentCheckpointId: "TSD-CP-003",
    decision: "APPROVED_AS_CP003_REPRESENTATION_EXTENSION",
    rationale: "The requested percentage is the distance share of one speed segment after total distance and time determine the route average. This is the existing distance-share inverse in speed-change wording.",
    priorFrozenEnglishMutationAllowed: false,
    newPermanentQlRequired: false,
    cp003EnglishFreezeStatus: "UNFROZEN",
  },
  {
    solveMode: "walkingRidingAllocation",
    targetAuthority: "segmentAllocationFromTotalsAndSpeeds",
    contentCheckpointId: "TSD-CP-003",
    decision: "APPROVED_AS_CP003_REPRESENTATION_EXTENSION",
    rationale: "Walking and riding are two speed segments whose distances and times must satisfy the same total-distance/total-time allocation system already owned by the finalized segment-allocation authority.",
    priorFrozenEnglishMutationAllowed: false,
    newPermanentQlRequired: false,
    cp003EnglishFreezeStatus: "UNFROZEN",
  },
]);

export const TSD_CP003_REPRESENTATION_EXTENSION_APPROVALS: readonly TsdCp003RepresentationExtensionApproval[] = Object.freeze(
  specifications.map((specification) => {
    const target = finalAuthorityByKey(specification.targetAuthority);
    if (target.checkpointId !== "TSD-CP-001" && target.checkpointId !== "TSD-CP-002") {
      throw new Error(`${specification.solveMode}: target ${specification.targetAuthority} is not a finalized CP-001/002 learner authority`);
    }
    return Object.freeze({
      ...specification,
      authorityOwnerCheckpointId: target.checkpointId,
    });
  }),
);