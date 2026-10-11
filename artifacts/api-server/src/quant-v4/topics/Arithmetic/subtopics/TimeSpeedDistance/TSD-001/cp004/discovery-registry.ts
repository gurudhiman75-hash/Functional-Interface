export type TsdCp004DiscoveryDisposition =
  | "CORE_EXECUTABLE_FOUNDATION"
  | "REPRESENTATION_EXTENSION"
  | "ADVANCED_DISCOVERY"
  | "INTERNAL_QA";

export interface TsdCp004DiscoveryAuthority {
  readonly provisionalId: string;
  readonly solveMode: string;
  readonly disposition: TsdCp004DiscoveryDisposition;
  readonly learnerFacing: boolean;
  readonly permanentQlId: null;
  readonly ownershipNote: string;
}

const core = [
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
  "findRelativeDistanceCoveredInGivenTime",
  "findTimeUntilSpecifiedSeparation",
  "findSpeedNeededToAvoidOrCauseMeeting",
] as const;

const advanced = [
  "findPursuitTimeWithOneRest",
  "findCatchUpAfterVariableStart",
  "findMeetingAfterOneBodyPassesCheckpoint",
  "findTwoPursuerMeetingOrder",
  "findIntermediatePointMeetingState",
] as const;

const representations = [
  "findRelativeMotionStateFromTimeline",
  "findRelativeMotionStateFromDiagram",
] as const;

const qa = [
  "classifyRelativeMotionStateAsPossibleUniqueOrMultiple",
  "verifyMeetingOrPursuitClaim",
  "solveRelativeMotionDataSufficiency",
] as const;

function build(
  solveModes: readonly string[],
  start: number,
  disposition: TsdCp004DiscoveryDisposition,
  learnerFacing: boolean,
  ownershipNote: string,
): readonly TsdCp004DiscoveryAuthority[] {
  return solveModes.map((solveMode, index) => Object.freeze({
    provisionalId: `TSD-CP004-AUTH-${String(start + index).padStart(3, "0")}`,
    solveMode,
    disposition,
    learnerFacing,
    permanentQlId: null,
    ownershipNote,
  }));
}

export const TSD_CP004_DISCOVERY_AUTHORITIES = Object.freeze([
  ...build(core, 1, "CORE_EXECUTABLE_FOUNDATION", true,
    "Straight-line first-meeting, pursuit, separation, head-start, meeting-point or clock-time authority."),
  ...build(advanced, 24, "ADVANCED_DISCOVERY", true,
    "Potential learner authority requiring source saturation or overlap review before permanent ownership."),
  ...build(representations, 29, "REPRESENTATION_EXTENSION", true,
    "Timeline/diagram representation candidate; representation alone must not create a permanent QL."),
  ...build(qa, 31, "INTERNAL_QA", false,
    "State classification, claim verification or data-sufficiency QA layer pending ordinary authority proof."),
]);

export const TSD_CP004_CORE_AUTHORITIES = Object.freeze(
  TSD_CP004_DISCOVERY_AUTHORITIES.filter((authority) => authority.disposition === "CORE_EXECUTABLE_FOUNDATION"),
);

export const TSD_CP004_DISCOVERY_STATUS = Object.freeze({
  checkpointId: "TSD-CP-004" as const,
  title: "Straight-Line Relative Motion, Meeting and Pursuit" as const,
  blueprintCandidateCount: 33 as const,
  coreExecutableFoundationCount: core.length,
  advancedDiscoveryCount: advanced.length,
  representationCandidateCount: representations.length,
  internalQaCount: qa.length,
  nextPermanentQl: "TSD-QL-048" as const,
  permanentQlCount: 0 as const,
  discoveryFrozen: false as const,
  englishFrozen: false as const,
  questionStudioEnabled: false as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
});

export function cp004AuthorityByMode(solveMode: string): TsdCp004DiscoveryAuthority {
  const authority = TSD_CP004_DISCOVERY_AUTHORITIES.find((candidate) => candidate.solveMode === solveMode);
  if (!authority) throw new Error(`Unknown CP-004 solve mode: ${solveMode}`);
  return authority;
}
