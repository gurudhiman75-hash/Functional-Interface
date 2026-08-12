export const TSD_CP004_CHECKPOINT_ID = "TSD-CP-004" as const;
export const TSD_CP004_PACKAGE_ID = "TSD-001" as const;

export type TsdCp004AuthorityId =
  | "RELATIVE_SPEED_OPPOSITE"
  | "RELATIVE_SPEED_SAME_DIRECTION"
  | "FIRST_MEETING_TIME"
  | "INITIAL_GAP_FROM_MEETING"
  | "UNKNOWN_SPEED_FROM_MEETING"
  | "HEAD_START_CATCH_UP_TIME"
  | "HEAD_START_DISTANCE"
  | "DELAYED_START_CATCH_UP_TIME"
  | "START_DELAY_FROM_CATCH_UP"
  | "SEPARATION_AFTER_TIME"
  | "TIME_TO_SPECIFIED_SEPARATION"
  | "MEETING_POINT_DISTANCE_SPLIT"
  | "SPEED_RATIO_FROM_MEETING_POINT"
  | "MEETING_POINT_FROM_SPEED_RATIO"
  | "REQUIRED_SPEED_FOR_MEETING_DEADLINE"
  | "MULTI_PURSUER_MEETING_ORDER";

export interface TsdCp004Authority {
  readonly authorityId: TsdCp004AuthorityId;
  readonly candidateQlId: string;
  readonly title: string;
  readonly governingInvariant: string;
  readonly answerKind: "SPEED" | "TIME" | "DISTANCE" | "RATIO" | "ORDER";
  readonly minimumDifficulty: "Easy" | "Medium" | "Hard";
}

export const TSD_CP004_AUTHORITIES: readonly TsdCp004Authority[] = Object.freeze([
  { authorityId: "RELATIVE_SPEED_OPPOSITE", candidateQlId: "TSD-QL-048", title: "Opposite-direction relative speed", governingInvariant: "closing speed = speed A + speed B", answerKind: "SPEED", minimumDifficulty: "Easy" },
  { authorityId: "RELATIVE_SPEED_SAME_DIRECTION", candidateQlId: "TSD-QL-049", title: "Same-direction relative speed", governingInvariant: "closing speed = faster speed - slower speed", answerKind: "SPEED", minimumDifficulty: "Easy" },
  { authorityId: "FIRST_MEETING_TIME", candidateQlId: "TSD-QL-050", title: "First meeting time on a line", governingInvariant: "time = initial gap / positive closing speed", answerKind: "TIME", minimumDifficulty: "Easy" },
  { authorityId: "INITIAL_GAP_FROM_MEETING", candidateQlId: "TSD-QL-051", title: "Initial separation from first-meeting evidence", governingInvariant: "initial gap = closing speed × meeting time", answerKind: "DISTANCE", minimumDifficulty: "Medium" },
  { authorityId: "UNKNOWN_SPEED_FROM_MEETING", candidateQlId: "TSD-QL-052", title: "Unknown individual speed from meeting evidence", governingInvariant: "recover closing speed from gap/time, then isolate the unknown body speed", answerKind: "SPEED", minimumDifficulty: "Medium" },
  { authorityId: "HEAD_START_CATCH_UP_TIME", candidateQlId: "TSD-QL-053", title: "Catch-up time from a distance head start", governingInvariant: "catch-up time = head-start distance / same-direction closing speed", answerKind: "TIME", minimumDifficulty: "Easy" },
  { authorityId: "HEAD_START_DISTANCE", candidateQlId: "TSD-QL-054", title: "Head-start distance from catch-up evidence", governingInvariant: "head-start distance = same-direction closing speed × catch-up time", answerKind: "DISTANCE", minimumDifficulty: "Medium" },
  { authorityId: "DELAYED_START_CATCH_UP_TIME", candidateQlId: "TSD-QL-055", title: "Delayed-start pursuit time", governingInvariant: "lead at chaser start = slower speed × start delay; catch-up uses speed difference", answerKind: "TIME", minimumDifficulty: "Medium" },
  { authorityId: "START_DELAY_FROM_CATCH_UP", candidateQlId: "TSD-QL-056", title: "Start delay reconstructed from catch-up state", governingInvariant: "lead at chaser start = closing speed × chase time = slower speed × start delay", answerKind: "TIME", minimumDifficulty: "Medium" },
  { authorityId: "SEPARATION_AFTER_TIME", candidateQlId: "TSD-QL-057", title: "Separation after relative motion", governingInvariant: "later separation follows signed relative displacement from the initial gap", answerKind: "DISTANCE", minimumDifficulty: "Easy" },
  { authorityId: "TIME_TO_SPECIFIED_SEPARATION", candidateQlId: "TSD-QL-058", title: "Time until a specified separation", governingInvariant: "time = required change in separation / relative speed", answerKind: "TIME", minimumDifficulty: "Medium" },
  { authorityId: "MEETING_POINT_DISTANCE_SPLIT", candidateQlId: "TSD-QL-059", title: "Meeting-point distance split", governingInvariant: "simultaneous travel time makes travelled distances proportional to speeds", answerKind: "DISTANCE", minimumDifficulty: "Medium" },
  { authorityId: "SPEED_RATIO_FROM_MEETING_POINT", candidateQlId: "TSD-QL-060", title: "Speed ratio from meeting point", governingInvariant: "speed ratio = distance travelled by A : distance travelled by B", answerKind: "RATIO", minimumDifficulty: "Medium" },
  { authorityId: "MEETING_POINT_FROM_SPEED_RATIO", candidateQlId: "TSD-QL-061", title: "Meeting point from speed ratio", governingInvariant: "divide the initial gap in the speed ratio for simultaneous opposite-direction motion", answerKind: "DISTANCE", minimumDifficulty: "Medium" },
  { authorityId: "REQUIRED_SPEED_FOR_MEETING_DEADLINE", candidateQlId: "TSD-QL-062", title: "Required speed to meet/catch by a deadline", governingInvariant: "required closing speed = effective gap / available time, then isolate the required body speed", answerKind: "SPEED", minimumDifficulty: "Hard" },
  { authorityId: "MULTI_PURSUER_MEETING_ORDER", candidateQlId: "TSD-QL-063", title: "Order of first catches by multiple pursuers", governingInvariant: "compare independently verified first-catch times on the same line", answerKind: "ORDER", minimumDifficulty: "Hard" },
]);

export type TsdCp004Disposition = "RETAIN_NEW_AUTHORITY" | "MERGE_INTO_CP004" | "REPRESENTATION_ONLY" | "ASSEMBLY_OR_QA_ONLY";

export interface TsdCp004DiscoveryDisposition {
  readonly sourceCandidate: string;
  readonly disposition: TsdCp004Disposition;
  readonly authorityId: TsdCp004AuthorityId | null;
  readonly reason: string;
}

export const TSD_CP004_DISCOVERY_DISPOSITION: readonly TsdCp004DiscoveryDisposition[] = Object.freeze([
  ["findRelativeSpeedOppositeDirections", "RETAIN_NEW_AUTHORITY", "RELATIVE_SPEED_OPPOSITE", "Opposite-direction addition is a first-class relative-motion invariant."],
  ["findRelativeSpeedSameDirection", "RETAIN_NEW_AUTHORITY", "RELATIVE_SPEED_SAME_DIRECTION", "Same-direction subtraction is a distinct central misconception boundary."],
  ["findMeetingTimeFromInitialSeparation", "RETAIN_NEW_AUTHORITY", "FIRST_MEETING_TIME", "Direct first-event time target."],
  ["findInitialSeparationFromMeetingTime", "RETAIN_NEW_AUTHORITY", "INITIAL_GAP_FROM_MEETING", "Inverse gap reconstruction changes the requested semantic."],
  ["findRelativeSpeedFromMeetingTime", "MERGE_INTO_CP004", "UNKNOWN_SPEED_FROM_MEETING", "Relative speed is the intermediate quantity in the inverse individual-speed authority."],
  ["findIndividualSpeedFromRelativeSpeedAndOtherSpeed", "MERGE_INTO_CP004", "UNKNOWN_SPEED_FROM_MEETING", "Same inverse learner task after recovering or receiving relative speed."],
  ["findCatchUpTimeFromHeadStartDistance", "RETAIN_NEW_AUTHORITY", "HEAD_START_CATCH_UP_TIME", "Canonical same-direction pursuit."],
  ["findHeadStartDistanceFromCatchUpTime", "RETAIN_NEW_AUTHORITY", "HEAD_START_DISTANCE", "Inverse head-start reconstruction."],
  ["findDelayedStartCatchUpTime", "RETAIN_NEW_AUTHORITY", "DELAYED_START_CATCH_UP_TIME", "The gap must first be generated by a start delay."],
  ["findStartDelayFromCatchUpState", "RETAIN_NEW_AUTHORITY", "START_DELAY_FROM_CATCH_UP", "Inverse delayed-start reconstruction."],
  ["findFasterSpeedFromCatchUpState", "MERGE_INTO_CP004", "UNKNOWN_SPEED_FROM_MEETING", "Unknown speed under a same-direction closing-speed equation."],
  ["findSlowerSpeedFromCatchUpState", "MERGE_INTO_CP004", "UNKNOWN_SPEED_FROM_MEETING", "Unknown speed under a same-direction closing-speed equation."],
  ["findSeparationAfterMovingApart", "RETAIN_NEW_AUTHORITY", "SEPARATION_AFTER_TIME", "Direct signed-separation evolution."],
  ["findInitialGapFromLaterSeparation", "MERGE_INTO_CP004", "SEPARATION_AFTER_TIME", "Reverse parameterization of the same signed separation equation."],
  ["findMeetingPointDistanceSplit", "RETAIN_NEW_AUTHORITY", "MEETING_POINT_DISTANCE_SPLIT", "Asks for a travelled distance, not merely event time."],
  ["findSpeedRatioFromMeetingPoint", "RETAIN_NEW_AUTHORITY", "SPEED_RATIO_FROM_MEETING_POINT", "Inverse ratio target."],
  ["findMeetingPointFromSpeedRatio", "RETAIN_NEW_AUTHORITY", "MEETING_POINT_FROM_SPEED_RATIO", "Forward ratio-to-location target."],
  ["findUnknownStartPointGap", "MERGE_INTO_CP004", "INITIAL_GAP_FROM_MEETING", "Same unknown initial separation contract."],
  ["findMeetingClockTime", "REPRESENTATION_ONLY", "FIRST_MEETING_TIME", "Clock time changes presentation, not the governing event equation."],
  ["findDepartureClockTimeFromMeetingState", "REPRESENTATION_ONLY", "START_DELAY_FROM_CATCH_UP", "Clock-time inversion is a presentation of delayed-start reconstruction."],
  ["findPursuitTimeWithOneRest", "MERGE_INTO_CP004", "DELAYED_START_CATCH_UP_TIME", "A pre-catch rest creates an effective delayed start; no post-meeting system is involved."],
  ["findCatchUpAfterVariableStart", "MERGE_INTO_CP004", "DELAYED_START_CATCH_UP_TIME", "Variable start is represented by the effective lead when pursuit begins."],
  ["findMeetingAfterOneBodyPassesCheckpoint", "MERGE_INTO_CP004", "DELAYED_START_CATCH_UP_TIME", "Checkpoint evidence reconstructs the same effective lead/start delay."],
  ["findRelativeDistanceCoveredInGivenTime", "MERGE_INTO_CP004", "SEPARATION_AFTER_TIME", "Relative displacement is the direct separation equation."],
  ["findTimeUntilSpecifiedSeparation", "RETAIN_NEW_AUTHORITY", "TIME_TO_SPECIFIED_SEPARATION", "Inverse event time to a non-zero separation target."],
  ["findSpeedNeededToAvoidOrCauseMeeting", "RETAIN_NEW_AUTHORITY", "REQUIRED_SPEED_FOR_MEETING_DEADLINE", "Required-speed deadline/threshold changes the target and difficulty."],
  ["findTwoPursuerMeetingOrder", "RETAIN_NEW_AUTHORITY", "MULTI_PURSUER_MEETING_ORDER", "Three-body comparison changes evidence topology and answer kind."],
  ["findIntermediatePointMeetingState", "MERGE_INTO_CP004", "MEETING_POINT_DISTANCE_SPLIT", "Named checkpoint is a meeting-point representation."],
  ["findRelativeMotionStateFromTimeline", "REPRESENTATION_ONLY", "FIRST_MEETING_TIME", "Timeline is a representation after ordinary authority exists."],
  ["findRelativeMotionStateFromDiagram", "REPRESENTATION_ONLY", "FIRST_MEETING_TIME", "Number-line/route-strip is a representation after ordinary authority exists."],
  ["classifyRelativeMotionStateAsPossibleUniqueOrMultiple", "ASSEMBLY_OR_QA_ONLY", null, "State classification is retained as a validation/claim form until source evidence justifies a learner QL."],
  ["verifyMeetingOrPursuitClaim", "ASSEMBLY_OR_QA_ONLY", null, "Claim verification reuses proven authorities and is not a new core mathematical QL here."],
  ["solveRelativeMotionDataSufficiency", "ASSEMBLY_OR_QA_ONLY", null, "Data sufficiency is a later representation/assembly layer after ordinary authorities are frozen."],
].map(([sourceCandidate, disposition, authorityId, reason]) => Object.freeze({ sourceCandidate, disposition, authorityId, reason })) as readonly TsdCp004DiscoveryDisposition[]);

export const TSD_CP004_PROPOSED_QL_RANGE = Object.freeze({
  first: "TSD-QL-048",
  last: "TSD-QL-063",
  count: 16,
  permanent: false,
  approvalRequired: true,
});

export const TSD_CP004_BOUNDARIES = Object.freeze({
  owns: "first meeting, first catch-up, first crossing/separation event and meeting-point reconstruction on an open line",
  excludes: Object.freeze([
    "finite train length or complete train crossing (CP-007/008)",
    "motion continuing after first meeting or endpoint turnaround (CP-005)",
    "closed-loop modular motion (CP-006)",
    "race lead/handicap finish semantics (CP-010)",
  ]),
});
