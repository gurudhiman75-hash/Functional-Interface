export const TSD_CP004_SOURCE_CANDIDATES = [
  "findRelativeSpeedOppositeDirections",
  "findRelativeSpeedSameDirection",
  "findMeetingTimeFromInitialSeparation",
  "findInitialSeparationFromMeetingTime",
  "findRelativeSpeedFromMeetingTime",
  "findIndividualSpeedFromRelativeSpeedAndOtherSpeed",
  "findCatchUpTimeFromHeadStartDistance",
  "findHeadStartDistanceFromCatchUpTime",
  "findDelayedStartCatchUpTime",
  "findStartDelayFromCatchUpState",
  "findFasterSpeedFromCatchUpState",
  "findSlowerSpeedFromCatchUpState",
  "findSeparationAfterMovingApart",
  "findInitialGapFromLaterSeparation",
  "findMeetingPointDistanceSplit",
  "findSpeedRatioFromMeetingPoint",
  "findMeetingPointFromSpeedRatio",
  "findUnknownStartPointGap",
  "findMeetingClockTime",
  "findDepartureClockTimeFromMeetingState",
  "findPursuitTimeWithOneRest",
  "findCatchUpAfterVariableStart",
  "findMeetingAfterOneBodyPassesCheckpoint",
  "findRelativeDistanceCoveredInGivenTime",
  "findTimeUntilSpecifiedSeparation",
  "findSpeedNeededToAvoidOrCauseMeeting",
  "findTwoPursuerMeetingOrder",
  "findIntermediatePointMeetingState",
  "findRelativeMotionStateFromTimeline",
  "findRelativeMotionStateFromDiagram",
  "classifyRelativeMotionStateAsPossibleUniqueOrMultiple",
  "verifyMeetingOrPursuitClaim",
  "solveRelativeMotionDataSufficiency",
] as const;

export type TsdCp004SourceCandidate = (typeof TSD_CP004_SOURCE_CANDIDATES)[number];

export type TsdCp004AnswerKind =
  | "SPEED"
  | "TIME"
  | "DISTANCE"
  | "RATIO"
  | "CLOCK_TIME"
  | "ORDER"
  | "CLASSIFICATION"
  | "BOOLEAN"
  | "DATA_SUFFICIENCY";

export type TsdCp004GoverningRule =
  | "RELATIVE_SPEED"
  | "FIRST_MEETING"
  | "PURSUIT"
  | "SEPARATION"
  | "MEETING_POINT_RATIO"
  | "CLOCK_TIME"
  | "PIECEWISE_FIRST_EVENT"
  | "THRESHOLD_EVENT"
  | "MULTI_BODY_FIRST_EVENT"
  | "REPRESENTATION_INTERPRETATION"
  | "STATE_VALIDITY"
  | "DATA_SUFFICIENCY";

export interface TsdCp004DiscoveryAuthority {
  readonly provisionalId: `TSD-CP004-DISC-${string}`;
  readonly solveMode: string;
  readonly answerKind: TsdCp004AnswerKind;
  readonly governingRule: TsdCp004GoverningRule;
  readonly sourceCandidates: readonly TsdCp004SourceCandidate[];
  readonly learnerFacing: boolean;
  readonly executableInWave1: boolean;
  readonly discoveryStatus: "OPEN_EXECUTABLE_DISCOVERY";
  readonly permanentQlId: null;
  readonly nextAvailableQlId: "TSD-QL-048";
  readonly englishFreezeStatus: "UNFROZEN";
  readonly questionStudioEnabled: false;
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly publiclyPublishable: false;
}

function authority(
  ordinal: number,
  solveMode: string,
  answerKind: TsdCp004AnswerKind,
  governingRule: TsdCp004GoverningRule,
  sourceCandidates: readonly TsdCp004SourceCandidate[],
  learnerFacing = true,
  executableInWave1 = true,
): TsdCp004DiscoveryAuthority {
  return Object.freeze({
    provisionalId: `TSD-CP004-DISC-${String(ordinal).padStart(3, "0")}`,
    solveMode,
    answerKind,
    governingRule,
    sourceCandidates,
    learnerFacing,
    executableInWave1,
    discoveryStatus: "OPEN_EXECUTABLE_DISCOVERY",
    permanentQlId: null,
    nextAvailableQlId: "TSD-QL-048",
    englishFreezeStatus: "UNFROZEN",
    questionStudioEnabled: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  });
}

export const TSD_CP004_DISCOVERY_AUTHORITIES: readonly TsdCp004DiscoveryAuthority[] = Object.freeze([
  authority(1, "relativeSpeedByDirection", "SPEED", "RELATIVE_SPEED", [
    "findRelativeSpeedOppositeDirections",
    "findRelativeSpeedSameDirection",
  ]),
  authority(2, "meetingTimeFromInitialGap", "TIME", "FIRST_MEETING", [
    "findMeetingTimeFromInitialSeparation",
  ]),
  authority(3, "initialGapFromMeetingState", "DISTANCE", "FIRST_MEETING", [
    "findInitialSeparationFromMeetingTime",
    "findUnknownStartPointGap",
  ]),
  authority(4, "relativeSpeedFromMeetingState", "SPEED", "FIRST_MEETING", [
    "findRelativeSpeedFromMeetingTime",
  ]),
  authority(5, "individualSpeedFromRelativeState", "SPEED", "RELATIVE_SPEED", [
    "findIndividualSpeedFromRelativeSpeedAndOtherSpeed",
  ]),
  authority(6, "catchUpTimeFromHeadStart", "TIME", "PURSUIT", [
    "findCatchUpTimeFromHeadStartDistance",
    "findDelayedStartCatchUpTime",
  ]),
  authority(7, "headStartFromCatchUpState", "DISTANCE", "PURSUIT", [
    "findHeadStartDistanceFromCatchUpTime",
    "findStartDelayFromCatchUpState",
  ]),
  authority(8, "speedFromCatchUpState", "SPEED", "PURSUIT", [
    "findFasterSpeedFromCatchUpState",
    "findSlowerSpeedFromCatchUpState",
  ]),
  authority(9, "separationAfterElapsedTime", "DISTANCE", "SEPARATION", [
    "findSeparationAfterMovingApart",
    "findRelativeDistanceCoveredInGivenTime",
  ]),
  authority(10, "initialGapFromLaterSeparation", "DISTANCE", "SEPARATION", [
    "findInitialGapFromLaterSeparation",
  ]),
  authority(11, "timeToSpecifiedSeparation", "TIME", "SEPARATION", [
    "findTimeUntilSpecifiedSeparation",
  ]),
  authority(12, "meetingPointDistanceSplit", "DISTANCE", "MEETING_POINT_RATIO", [
    "findMeetingPointDistanceSplit",
    "findMeetingPointFromSpeedRatio",
    "findIntermediatePointMeetingState",
  ]),
  authority(13, "speedRatioFromMeetingPoint", "RATIO", "MEETING_POINT_RATIO", [
    "findSpeedRatioFromMeetingPoint",
  ]),
  authority(14, "meetingClockState", "CLOCK_TIME", "CLOCK_TIME", [
    "findMeetingClockTime",
    "findDepartureClockTimeFromMeetingState",
  ]),
  authority(15, "piecewiseCatchUpTime", "TIME", "PIECEWISE_FIRST_EVENT", [
    "findPursuitTimeWithOneRest",
    "findCatchUpAfterVariableStart",
    "findMeetingAfterOneBodyPassesCheckpoint",
  ]),
  authority(16, "speedThresholdForFirstMeeting", "SPEED", "THRESHOLD_EVENT", [
    "findSpeedNeededToAvoidOrCauseMeeting",
  ]),
  authority(17, "multiPursuerFirstEventOrder", "ORDER", "MULTI_BODY_FIRST_EVENT", [
    "findTwoPursuerMeetingOrder",
  ]),
  authority(18, "relativeMotionRepresentationInterpretation", "CLASSIFICATION", "REPRESENTATION_INTERPRETATION", [
    "findRelativeMotionStateFromTimeline",
    "findRelativeMotionStateFromDiagram",
  ], false, false),
  authority(19, "classifyRelativeMotionState", "CLASSIFICATION", "STATE_VALIDITY", [
    "classifyRelativeMotionStateAsPossibleUniqueOrMultiple",
  ], false, false),
  authority(20, "verifyMeetingOrPursuitClaim", "BOOLEAN", "STATE_VALIDITY", [
    "verifyMeetingOrPursuitClaim",
  ], false, false),
  authority(21, "relativeMotionDataSufficiency", "DATA_SUFFICIENCY", "DATA_SUFFICIENCY", [
    "solveRelativeMotionDataSufficiency",
  ], false, false),
]);

export const TSD_CP004_LEARNER_AUTHORITIES = Object.freeze(
  TSD_CP004_DISCOVERY_AUTHORITIES.filter((entry) => entry.learnerFacing),
);

export const TSD_CP004_INTERNAL_AUTHORITIES = Object.freeze(
  TSD_CP004_DISCOVERY_AUTHORITIES.filter((entry) => !entry.learnerFacing),
);

export const TSD_CP004_WAVE1_EXECUTABLE_AUTHORITIES = Object.freeze(
  TSD_CP004_DISCOVERY_AUTHORITIES.filter((entry) => entry.executableInWave1),
);

export function cp004AuthorityBySolveMode(solveMode: string): TsdCp004DiscoveryAuthority {
  const found = TSD_CP004_DISCOVERY_AUTHORITIES.find((entry) => entry.solveMode === solveMode);
  if (!found) throw new Error(`Unknown CP-004 solve mode: ${solveMode}`);
  return found;
}
