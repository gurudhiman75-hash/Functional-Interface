import { TSD_CP004_DISCOVERY_AUTHORITIES } from "./discovery-registry";

export type TsdCp004OverlapDecision =
  | "KEEP_AS_NEW_CP004_AUTHORITY"
  | "MERGE_INTO_CP004_AUTHORITY"
  | "ABSORB_AS_CP004_REPRESENTATION"
  | "HOLD_ADVANCED_DISCOVERY"
  | "HOLD_REPRESENTATION_CANDIDATE"
  | "INTERNAL_QA";

export interface TsdCp004OverlapAuditEntry {
  readonly solveMode: string;
  readonly decision: TsdCp004OverlapDecision;
  readonly targetAuthority: string;
  readonly reason: string;
}

export const TSD_CP004_CROSS_CHECKPOINT_OVERLAP_AUDIT: readonly TsdCp004OverlapAuditEntry[] = Object.freeze([
  { solveMode: "findRelativeSpeedOppositeDirections", decision: "KEEP_AS_NEW_CP004_AUTHORITY", targetAuthority: "relativeSpeedBetweenTwoBodies", reason: "Opposite-direction motion establishes the two-body sum-speed invariant. Same-direction closing speed is the directional branch of the same learner task, not a separate QL." },
  { solveMode: "findRelativeSpeedSameDirection", decision: "MERGE_INTO_CP004_AUTHORITY", targetAuthority: "relativeSpeedBetweenTwoBodies", reason: "Closing speed is the same relative-speed authority with a SAME direction case." },
  { solveMode: "findMeetingTimeFromInitialSeparation", decision: "KEEP_AS_NEW_CP004_AUTHORITY", targetAuthority: "firstMeetingOrCatchUpTimeFromGap", reason: "First meeting time is gap divided by the applicable relative speed; pursuit catch-up time uses the same target and invariant." },
  { solveMode: "findInitialSeparationFromMeetingTime", decision: "KEEP_AS_NEW_CP004_AUTHORITY", targetAuthority: "relativeDistanceFromRelativeMotion", reason: "The requested distance is relative speed multiplied by elapsed/meeting time. Head-start and unknown-gap wording do not change the answer contract." },
  { solveMode: "findRelativeSpeedFromMeetingTime", decision: "KEEP_AS_NEW_CP004_AUTHORITY", targetAuthority: "relativeSpeedFromGapAndMeetingTime", reason: "The learner reconstructs the relative speed from gap and meeting time before any individual-speed decomposition." },
  { solveMode: "findIndividualSpeedFromRelativeSpeedAndOtherSpeed", decision: "KEEP_AS_NEW_CP004_AUTHORITY", targetAuthority: "individualSpeedFromRelativeState", reason: "The target is an individual body's speed recovered from a relative-motion state; catch-up variants share this target." },
  { solveMode: "findCatchUpTimeFromHeadStartDistance", decision: "MERGE_INTO_CP004_AUTHORITY", targetAuthority: "firstMeetingOrCatchUpTimeFromGap", reason: "A head start is simply the initial same-direction gap, so catch-up time is the same gap/relative-speed authority." },
  { solveMode: "findHeadStartDistanceFromCatchUpTime", decision: "MERGE_INTO_CP004_AUTHORITY", targetAuthority: "relativeDistanceFromRelativeMotion", reason: "Head-start distance equals closing speed multiplied by catch-up time, the same relative-distance reconstruction." },
  { solveMode: "findDelayedStartCatchUpTime", decision: "KEEP_AS_NEW_CP004_AUTHORITY", targetAuthority: "delayedStartPursuitState", reason: "A start delay must first be converted into a moving head start before applying closing speed, making this a materially richer pursuit state than a stated gap." },
  { solveMode: "findStartDelayFromCatchUpState", decision: "MERGE_INTO_CP004_AUTHORITY", targetAuthority: "delayedStartPursuitState", reason: "This is the inverse projection of the same delayed-start pursuit system." },
  { solveMode: "findFasterSpeedFromCatchUpState", decision: "MERGE_INTO_CP004_AUTHORITY", targetAuthority: "individualSpeedFromRelativeState", reason: "The catch-up state first yields closing speed; adding it to the slower speed is the individual-speed recovery authority." },
  { solveMode: "findSlowerSpeedFromCatchUpState", decision: "MERGE_INTO_CP004_AUTHORITY", targetAuthority: "individualSpeedFromRelativeState", reason: "The catch-up state first yields closing speed; subtracting it from the faster speed is the same individual-speed recovery authority." },
  { solveMode: "findSeparationAfterMovingApart", decision: "KEEP_AS_NEW_CP004_AUTHORITY", targetAuthority: "separationEvolutionOnLine", reason: "The target is separation after a period of relative motion rather than a first-meeting event." },
  { solveMode: "findInitialGapFromLaterSeparation", decision: "MERGE_INTO_CP004_AUTHORITY", targetAuthority: "separationEvolutionOnLine", reason: "This reverses the same separation-evolution equation." },
  { solveMode: "findMeetingPointDistanceSplit", decision: "KEEP_AS_NEW_CP004_AUTHORITY", targetAuthority: "firstMeetingPointFromSpeedRelation", reason: "At a simultaneous first meeting, distances covered are proportional to speeds; speed-ratio wording is a representation of the same meeting-point target." },
  { solveMode: "findSpeedRatioFromMeetingPoint", decision: "KEEP_AS_NEW_CP004_AUTHORITY", targetAuthority: "speedRatioFromFirstMeetingPoint", reason: "The target is the speed ratio inferred from the two distances to the first meeting point, a distinct ratio answer contract." },
  { solveMode: "findMeetingPointFromSpeedRatio", decision: "MERGE_INTO_CP004_AUTHORITY", targetAuthority: "firstMeetingPointFromSpeedRelation", reason: "A stated speed ratio replaces explicit speeds but leaves the first-meeting distance split unchanged." },
  { solveMode: "findUnknownStartPointGap", decision: "MERGE_INTO_CP004_AUTHORITY", targetAuthority: "relativeDistanceFromRelativeMotion", reason: "The unknown starting gap is relative speed multiplied by meeting time, identical to the retained relative-distance target." },
  { solveMode: "findMeetingClockTime", decision: "ABSORB_AS_CP004_REPRESENTATION", targetAuthority: "firstMeetingOrCatchUpTimeFromGap", reason: "Clock arithmetic wraps the already-owned first-meeting duration. It is exam-relevant presentation, not a new relative-motion authority." },
  { solveMode: "findDepartureClockTimeFromMeetingState", decision: "ABSORB_AS_CP004_REPRESENTATION", targetAuthority: "firstMeetingOrCatchUpTimeFromGap", reason: "Recovering departure clock time reverses the clock wrapper around first-meeting duration; no new motion invariant is introduced." },
  { solveMode: "findRelativeDistanceCoveredInGivenTime", decision: "MERGE_INTO_CP004_AUTHORITY", targetAuthority: "relativeDistanceFromRelativeMotion", reason: "Relative distance is relative speed multiplied by elapsed time. CP001 supplies arithmetic primitives, but two-body relative speed is essential, so ownership remains CP004." },
  { solveMode: "findTimeUntilSpecifiedSeparation", decision: "MERGE_INTO_CP004_AUTHORITY", targetAuthority: "separationEvolutionOnLine", reason: "The required change in separation divided by relative speed is the time projection of the same separation-evolution state." },
  { solveMode: "findSpeedNeededToAvoidOrCauseMeeting", decision: "KEEP_AS_NEW_CP004_AUTHORITY", targetAuthority: "requiredSpeedForTargetMeeting", reason: "The target is an individual speed constrained by a desired meeting time, requiring both target relative speed and directional decomposition." },
  { solveMode: "findPursuitTimeWithOneRest", decision: "HOLD_ADVANCED_DISCOVERY", targetAuthority: "findPursuitTimeWithOneRest", reason: "A rest creates a piecewise pursuit timeline and needs executable source saturation before ownership is fixed." },
  { solveMode: "findCatchUpAfterVariableStart", decision: "HOLD_ADVANCED_DISCOVERY", targetAuthority: "findCatchUpAfterVariableStart", reason: "Variable start behaviour is multi-stage and remains provisional until its boundary with CP012 is proven." },
  { solveMode: "findMeetingAfterOneBodyPassesCheckpoint", decision: "HOLD_ADVANCED_DISCOVERY", targetAuthority: "findMeetingAfterOneBodyPassesCheckpoint", reason: "Checkpoint evidence may be either a first-meeting representation or a reconstructive authority; retain for saturation review." },
  { solveMode: "findTwoPursuerMeetingOrder", decision: "HOLD_ADVANCED_DISCOVERY", targetAuthority: "findTwoPursuerMeetingOrder", reason: "Three-body ordering is materially beyond the two-body foundation and needs independent source evidence." },
  { solveMode: "findIntermediatePointMeetingState", decision: "HOLD_ADVANCED_DISCOVERY", targetAuthority: "findIntermediatePointMeetingState", reason: "Intermediate-point constraints can collapse to a meeting-point representation or create a new inverse system; hold until generated evidence is reviewed." },
  { solveMode: "findRelativeMotionStateFromTimeline", decision: "HOLD_REPRESENTATION_CANDIDATE", targetAuthority: "MULTIPLE_CP004_AUTHORITIES", reason: "Timeline is a representation layer and must map onto proven ordinary authorities rather than consume its own QL." },
  { solveMode: "findRelativeMotionStateFromDiagram", decision: "HOLD_REPRESENTATION_CANDIDATE", targetAuthority: "MULTIPLE_CP004_AUTHORITIES", reason: "Diagram is a representation layer and must map onto proven ordinary authorities rather than consume its own QL." },
  { solveMode: "classifyRelativeMotionStateAsPossibleUniqueOrMultiple", decision: "INTERNAL_QA", targetAuthority: "relativeMotionStateClassification", reason: "State uniqueness is an internal validation authority until ordinary learner families are saturated." },
  { solveMode: "verifyMeetingOrPursuitClaim", decision: "INTERNAL_QA", targetAuthority: "relativeMotionClaimVerification", reason: "Claim verification is retained for QA and does not consume a learner QL at this checkpoint." },
  { solveMode: "solveRelativeMotionDataSufficiency", decision: "INTERNAL_QA", targetAuthority: "relativeMotionDataSufficiency", reason: "Data sufficiency is a representation/assessment layer to be attached only after ordinary authority proof." },
]);

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(TSD_CP004_CROSS_CHECKPOINT_OVERLAP_AUDIT.length === TSD_CP004_DISCOVERY_AUTHORITIES.length, "Every CP004 discovery candidate must receive exactly one ownership decision");
assert(new Set(TSD_CP004_CROSS_CHECKPOINT_OVERLAP_AUDIT.map((entry) => entry.solveMode)).size === TSD_CP004_CROSS_CHECKPOINT_OVERLAP_AUDIT.length, "Duplicate CP004 overlap decision");
for (const authority of TSD_CP004_DISCOVERY_AUTHORITIES) {
  assert(TSD_CP004_CROSS_CHECKPOINT_OVERLAP_AUDIT.some((entry) => entry.solveMode === authority.solveMode), `${authority.solveMode}: CP004 overlap decision missing`);
}

const retainedTargets = new Set(TSD_CP004_CROSS_CHECKPOINT_OVERLAP_AUDIT.filter((entry) => entry.decision === "KEEP_AS_NEW_CP004_AUTHORITY").map((entry) => entry.targetAuthority));
for (const entry of TSD_CP004_CROSS_CHECKPOINT_OVERLAP_AUDIT) {
  if (entry.decision === "MERGE_INTO_CP004_AUTHORITY" || entry.decision === "ABSORB_AS_CP004_REPRESENTATION") {
    assert(retainedTargets.has(entry.targetAuthority), `${entry.solveMode}: CP004 merge/representation target ${entry.targetAuthority} is not retained`);
  }
}

export const TSD_CP004_OVERLAP_COUNTS = Object.freeze({
  newLearnerAuthorities: TSD_CP004_CROSS_CHECKPOINT_OVERLAP_AUDIT.filter((entry) => entry.decision === "KEEP_AS_NEW_CP004_AUTHORITY").length,
  mergedCoreModes: TSD_CP004_CROSS_CHECKPOINT_OVERLAP_AUDIT.filter((entry) => entry.decision === "MERGE_INTO_CP004_AUTHORITY").length,
  cp004RepresentationModes: TSD_CP004_CROSS_CHECKPOINT_OVERLAP_AUDIT.filter((entry) => entry.decision === "ABSORB_AS_CP004_REPRESENTATION").length,
  heldAdvancedModes: TSD_CP004_CROSS_CHECKPOINT_OVERLAP_AUDIT.filter((entry) => entry.decision === "HOLD_ADVANCED_DISCOVERY").length,
  heldRepresentationCandidates: TSD_CP004_CROSS_CHECKPOINT_OVERLAP_AUDIT.filter((entry) => entry.decision === "HOLD_REPRESENTATION_CANDIDATE").length,
  internalQaModes: TSD_CP004_CROSS_CHECKPOINT_OVERLAP_AUDIT.filter((entry) => entry.decision === "INTERNAL_QA").length,
});

assert(TSD_CP004_OVERLAP_COUNTS.newLearnerAuthorities === 10, `Expected 10 retained CP004 learner authorities, received ${TSD_CP004_OVERLAP_COUNTS.newLearnerAuthorities}`);
assert(TSD_CP004_OVERLAP_COUNTS.mergedCoreModes === 11, `Expected 11 merged core modes, received ${TSD_CP004_OVERLAP_COUNTS.mergedCoreModes}`);
assert(TSD_CP004_OVERLAP_COUNTS.cp004RepresentationModes === 2, `Expected 2 CP004 representation modes, received ${TSD_CP004_OVERLAP_COUNTS.cp004RepresentationModes}`);
assert(TSD_CP004_OVERLAP_COUNTS.heldAdvancedModes === 5, `Expected 5 held advanced modes, received ${TSD_CP004_OVERLAP_COUNTS.heldAdvancedModes}`);
assert(TSD_CP004_OVERLAP_COUNTS.heldRepresentationCandidates === 2, `Expected 2 held representation candidates, received ${TSD_CP004_OVERLAP_COUNTS.heldRepresentationCandidates}`);
assert(TSD_CP004_OVERLAP_COUNTS.internalQaModes === 3, `Expected 3 internal QA modes, received ${TSD_CP004_OVERLAP_COUNTS.internalQaModes}`);
