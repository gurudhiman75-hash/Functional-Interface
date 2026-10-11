import { TSD_CP005_DISCOVERY_CANDIDATES } from "./discovery-registry";
import type { TsdCp005SolveMode } from "./types";

export type TsdCp005OverlapDecision =
  | "KEEP_AS_NEW_CP005_AUTHORITY"
  | "MERGE_INTO_CP005_AUTHORITY"
  | "HOLD_CROSS_CHECKPOINT_OVERLAP"
  | "HOLD_REPRESENTATION_CANDIDATE"
  | "INTERNAL_QA";

export interface TsdCp005OverlapAuditEntry {
  readonly solveMode: TsdCp005SolveMode;
  readonly decision: TsdCp005OverlapDecision;
  readonly targetAuthority: string;
  readonly reason: string;
}

export const TSD_CP005_AUTHORITY_OVERLAP_AUDIT: readonly TsdCp005OverlapAuditEntry[] = Object.freeze([
  { solveMode: "findSpeedRatioFromPostMeetingArrivalTimes", decision: "KEEP_AS_NEW_CP005_AUTHORITY", targetAuthority: "speedRatioFromPostMeetingArrivalTimes", reason: "The square-root relation between the two post-meeting arrival times is uniquely post-meeting evidence and is not owned by CP004 first-meeting ratio tasks." },
  { solveMode: "findPostMeetingArrivalTimeFromSpeedRatio", decision: "KEEP_AS_NEW_CP005_AUTHORITY", targetAuthority: "postMeetingArrivalTimeFromSpeedRelation", reason: "The target is remaining travel time after the first meeting; post-meeting path reconstruction is essential." },
  { solveMode: "findTotalDistanceFromPostMeetingTimes", decision: "KEEP_AS_NEW_CP005_AUTHORITY", targetAuthority: "routeDistanceFromPostMeetingEvidence", reason: "The full endpoint distance is reconstructed from post-meeting arrival evidence, not from a first-meeting gap alone." },
  { solveMode: "findSpeedsFromPostMeetingTimesAndDistance", decision: "KEEP_AS_NEW_CP005_AUTHORITY", targetAuthority: "individualSpeedsFromPostMeetingEvidence", reason: "Both individual speeds are reconstructed from the route and paired post-meeting times; the answer contract differs from CP004 individual-speed recovery." },
  { solveMode: "findMeetingPointFromPostMeetingTimes", decision: "KEEP_AS_NEW_CP005_AUTHORITY", targetAuthority: "firstMeetingPointFromPostMeetingEvidence", reason: "The first meeting point is inferred specifically from what happens after that meeting, which makes the evidence topology materially different from CP004 direct speed-ratio meeting-point tasks." },

  { solveMode: "findSecondMeetingTimeAfterEndpointTurnaround", decision: "KEEP_AS_NEW_CP005_AUTHORITY", targetAuthority: "repeatedLinearMeetingTime", reason: "Endpoint reflection after the first meeting creates the repeated-line invariant; nth-meeting and consecutive-meeting timing are parameterisations of the same authority." },
  { solveMode: "findSecondMeetingPointAfterEndpointTurnaround", decision: "KEEP_AS_NEW_CP005_AUTHORITY", targetAuthority: "repeatedLinearMeetingPoint", reason: "The target is the physical reflected position of a repeated meeting on a bounded line." },
  { solveMode: "findNthMeetingTimeOnLine", decision: "MERGE_INTO_CP005_AUTHORITY", targetAuthority: "repeatedLinearMeetingTime", reason: "The nth meeting changes only the odd-multiple parameter (2n-1)L and not the learner invariant." },
  { solveMode: "findNthMeetingPointOnLine", decision: "MERGE_INTO_CP005_AUTHORITY", targetAuthority: "repeatedLinearMeetingPoint", reason: "Nth meeting point uses the same reflected endpoint-position rule as the second-meeting-point task." },
  { solveMode: "findRepeatedMeetingCountInTimeWindow", decision: "KEEP_AS_NEW_CP005_AUTHORITY", targetAuthority: "repeatedLinearMeetingCount", reason: "Counting how many repeated meetings occur before a deadline changes the requested semantic from event time/location to bounded event count." },

  { solveMode: "findMeetingAfterOneTravellerTurnsBack", decision: "KEEP_AS_NEW_CP005_AUTHORITY", targetAuthority: "singleTurnaroundMeetingTime", reason: "One traveller reaches an endpoint and reverses before the meeting; this is a distinct bounded-line event topology from both CP004 pursuit and two-endpoint repeated reflection." },
  { solveMode: "findMeetingAfterBothTurnAtEndpoints", decision: "MERGE_INTO_CP005_AUTHORITY", targetAuthority: "repeatedLinearMeetingTime", reason: "With instantaneous endpoint reversals by both travellers, the requested meeting time is the retained repeated-reflection authority." },
  { solveMode: "findShuttleMeetingTime", decision: "MERGE_INTO_CP005_AUTHORITY", targetAuthority: "singleTurnaroundMeetingTime", reason: "A one-turn shuttle meeting is the same endpoint-reversal time equation with shuttle wording." },
  { solveMode: "findShuttleDistanceCovered", decision: "KEEP_AS_NEW_CP005_AUTHORITY", targetAuthority: "shuttleDistanceBeforeReturnMeeting", reason: "The requested quantity is the turning traveller's total path length, not the event time or physical meeting coordinate." },
  { solveMode: "findReturnJourneyMeetingPoint", decision: "KEEP_AS_NEW_CP005_AUTHORITY", targetAuthority: "returnJourneyMeetingPoint", reason: "The learner must convert the turnaround event into the physical coordinate of the return meeting." },

  { solveMode: "findMeetingPointShiftAfterSpeedChange", decision: "HOLD_CROSS_CHECKPOINT_OVERLAP", targetAuthority: "CP004_OR_CP003_SPEED_CHANGE_MEETING_POINT", reason: "In its current executable form the speed change occurs before the first meeting, so it does not yet require post-meeting or endpoint-turnaround evidence. Hold until a genuinely CP005 source form is established." },
  { solveMode: "findSpeedChangeFromMeetingPointShift", decision: "HOLD_CROSS_CHECKPOINT_OVERLAP", targetAuthority: "CP004_OR_CP003_SPEED_CHANGE_MEETING_POINT", reason: "The inverse meeting-point shift currently remains a pre-first-meeting speed-change system and risks duplicating CP004/CP003 ownership." },
  { solveMode: "findStartDelayFromMeetingPoint", decision: "HOLD_CROSS_CHECKPOINT_OVERLAP", targetAuthority: "CP004_DELAYED_START_MEETING", reason: "A delayed start inferred only from a first meeting point is already within CP004 delayed-start/meeting-point territory unless post-meeting evidence is made essential." },
  { solveMode: "findStaggeredDepartureMeetingPoint", decision: "HOLD_CROSS_CHECKPOINT_OVERLAP", targetAuthority: "CP004_DELAYED_START_MEETING", reason: "Staggered first-departure meeting point is CP004 unless later endpoint or post-meeting evidence changes the topology." },
  { solveMode: "findIntermediateStartPointFromMeetingData", decision: "HOLD_CROSS_CHECKPOINT_OVERLAP", targetAuthority: "CP004_INTERMEDIATE_POINT_MEETING", reason: "The current state is a first-meeting reconstruction and collides with CP004 held intermediate-point discovery; it is not yet a CP005 authority." },

  { solveMode: "findEndpointRestTimeFromNextMeeting", decision: "KEEP_AS_NEW_CP005_AUTHORITY", targetAuthority: "endpointRestFromNextMeeting", reason: "A rest at the reversal endpoint alters the second-meeting schedule and is genuinely post-first-meeting bounded-line behaviour." },
  { solveMode: "findTimeBetweenFirstAndSecondMeetings", decision: "MERGE_INTO_CP005_AUTHORITY", targetAuthority: "repeatedLinearMeetingTime", reason: "The interval is the difference between two events governed by the same repeated-meeting schedule; no new motion authority is introduced." },
  { solveMode: "findDistanceBetweenEndpointsFromRepeatedMeetings", decision: "KEEP_AS_NEW_CP005_AUTHORITY", targetAuthority: "routeDistanceFromRepeatedMeetingGap", reason: "This is the inverse route-length reconstruction from repeated-meeting timing evidence." },
  { solveMode: "findRouteReversalScheduleParameter", decision: "MERGE_INTO_CP005_AUTHORITY", targetAuthority: "endpointRestFromNextMeeting", reason: "The executable schedule parameter is endpoint dwell/rest inferred from the next meeting, identical to the retained endpoint-rest authority." },
  { solveMode: "findPassThenCatchAfterTurnaround", decision: "MERGE_INTO_CP005_AUTHORITY", targetAuthority: "singleTurnaroundMeetingTime", reason: "Once the endpoint reversal is explicit, pass/catch wording is a representation of the same one-turn meeting-time system." },
  { solveMode: "findMeetingAtSpecifiedCheckpoint", decision: "HOLD_CROSS_CHECKPOINT_OVERLAP", targetAuthority: "CP004_DELAYED_START_MEETING", reason: "The current solver recovers a start delay needed for a first meeting at a checkpoint; without post-meeting evidence this belongs with CP004 delayed-start target-meeting work." },

  { solveMode: "reconstructCompleteLinearItinerary", decision: "HOLD_REPRESENTATION_CANDIDATE", targetAuthority: "MULTIPLE_CP005_AUTHORITIES", reason: "A complete itinerary is a composite representation over already-proven repeated-meeting authorities. It should not consume its own QL unless later evidence shows an independent learner task contract." },
  { solveMode: "detectContradictoryMeetingStatements", decision: "INTERNAL_QA", targetAuthority: "postMeetingContradictionDetection", reason: "Contradiction detection remains a QA/assessment layer until ordinary post-meeting learner authorities are finalized." },
  { solveMode: "classifyPostMeetingStateAsPossibleUniqueOrMultiple", decision: "INTERNAL_QA", targetAuthority: "postMeetingStateClassification", reason: "State classification is retained for validation rather than consuming a learner QL at this checkpoint." },
  { solveMode: "verifyPostMeetingClaim", decision: "INTERNAL_QA", targetAuthority: "postMeetingClaimVerification", reason: "Claim verification is an internal validation/representation layer over ordinary authorities." },
  { solveMode: "solvePostMeetingDataSufficiency", decision: "INTERNAL_QA", targetAuthority: "postMeetingDataSufficiency", reason: "Data sufficiency is attached only after ordinary authorities are proven and does not create a standalone CP005 QL." },
]);

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(TSD_CP005_AUTHORITY_OVERLAP_AUDIT.length === TSD_CP005_DISCOVERY_CANDIDATES.length, "Every CP005 discovery candidate must receive exactly one overlap decision");
assert(new Set(TSD_CP005_AUTHORITY_OVERLAP_AUDIT.map((entry) => entry.solveMode)).size === TSD_CP005_AUTHORITY_OVERLAP_AUDIT.length, "Duplicate CP005 overlap decision");
for (const mode of TSD_CP005_DISCOVERY_CANDIDATES) {
  assert(TSD_CP005_AUTHORITY_OVERLAP_AUDIT.some((entry) => entry.solveMode === mode), `${mode}: CP005 overlap decision missing`);
}

const retainedTargets = new Set(TSD_CP005_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "KEEP_AS_NEW_CP005_AUTHORITY").map((entry) => entry.targetAuthority));
for (const entry of TSD_CP005_AUTHORITY_OVERLAP_AUDIT) {
  if (entry.decision === "MERGE_INTO_CP005_AUTHORITY") assert(retainedTargets.has(entry.targetAuthority), `${entry.solveMode}: merge target ${entry.targetAuthority} is not retained`);
}

export const TSD_CP005_OVERLAP_COUNTS = Object.freeze({
  newLearnerAuthorities: TSD_CP005_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "KEEP_AS_NEW_CP005_AUTHORITY").length,
  mergedCoreModes: TSD_CP005_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "MERGE_INTO_CP005_AUTHORITY").length,
  heldCrossCheckpointModes: TSD_CP005_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "HOLD_CROSS_CHECKPOINT_OVERLAP").length,
  heldRepresentationCandidates: TSD_CP005_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "HOLD_REPRESENTATION_CANDIDATE").length,
  internalQaModes: TSD_CP005_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "INTERNAL_QA").length,
});

assert(TSD_CP005_OVERLAP_COUNTS.newLearnerAuthorities === 13, `Expected 13 retained CP005 learner-authority candidates, received ${TSD_CP005_OVERLAP_COUNTS.newLearnerAuthorities}`);
assert(TSD_CP005_OVERLAP_COUNTS.mergedCoreModes === 7, `Expected 7 merged CP005 modes, received ${TSD_CP005_OVERLAP_COUNTS.mergedCoreModes}`);
assert(TSD_CP005_OVERLAP_COUNTS.heldCrossCheckpointModes === 6, `Expected 6 held cross-checkpoint CP005 modes, received ${TSD_CP005_OVERLAP_COUNTS.heldCrossCheckpointModes}`);
assert(TSD_CP005_OVERLAP_COUNTS.heldRepresentationCandidates === 1, `Expected 1 held CP005 representation candidate, received ${TSD_CP005_OVERLAP_COUNTS.heldRepresentationCandidates}`);
assert(TSD_CP005_OVERLAP_COUNTS.internalQaModes === 4, `Expected 4 CP005 internal-QA modes, received ${TSD_CP005_OVERLAP_COUNTS.internalQaModes}`);
