import { equals, rational, type Rational } from "../foundation/rational";
import {
  TSD_CP004_CORE_AUTHORITIES,
  TSD_CP004_DISCOVERY_AUTHORITIES,
  TSD_CP004_DISCOVERY_STATUS,
} from "./discovery-registry";
import {
  solveCp004Core,
  verifyCp004Core,
  type TsdCp004CoreInput,
  type TsdCp004CoreSolveMode,
} from "./relative-motion-foundation";

interface Fixture {
  readonly mode: TsdCp004CoreSolveMode;
  readonly input: TsdCp004CoreInput;
  readonly expected: Rational;
}

const q = rational;
const fixtures: readonly Fixture[] = Object.freeze([
  { mode: "findRelativeSpeedOppositeDirections", input: { speedA: q(60), speedB: q(40) }, expected: q(100) },
  { mode: "findRelativeSpeedSameDirection", input: { speedA: q(70), speedB: q(45) }, expected: q(25) },
  { mode: "findMeetingTimeFromInitialSeparation", input: { speedA: q(60), speedB: q(40), initialSeparation: q(300), directionCase: "OPPOSITE" }, expected: q(3) },
  { mode: "findInitialSeparationFromMeetingTime", input: { speedA: q(60), speedB: q(40), meetingTime: q(5, 2), directionCase: "OPPOSITE" }, expected: q(250) },
  { mode: "findRelativeSpeedFromMeetingTime", input: { initialSeparation: q(240), meetingTime: q(3) }, expected: q(80) },
  { mode: "findIndividualSpeedFromRelativeSpeedAndOtherSpeed", input: { relativeSpeed: q(90), speedB: q(40), unknownBody: "A", directionCase: "OPPOSITE" }, expected: q(50) },
  { mode: "findCatchUpTimeFromHeadStartDistance", input: { speedA: q(75), speedB: q(45), headStartDistance: q(90) }, expected: q(3) },
  { mode: "findHeadStartDistanceFromCatchUpTime", input: { speedA: q(75), speedB: q(45), meetingTime: q(4) }, expected: q(120) },
  { mode: "findDelayedStartCatchUpTime", input: { speedA: q(70), speedB: q(40), startDelay: q(3, 2) }, expected: q(2) },
  { mode: "findStartDelayFromCatchUpState", input: { speedA: q(70), speedB: q(40), meetingTime: q(2) }, expected: q(3, 2) },
  { mode: "findFasterSpeedFromCatchUpState", input: { speedB: q(40), headStartDistance: q(90), meetingTime: q(3) }, expected: q(70) },
  { mode: "findSlowerSpeedFromCatchUpState", input: { speedA: q(80), headStartDistance: q(120), meetingTime: q(4) }, expected: q(50) },
  { mode: "findSeparationAfterMovingApart", input: { speedA: q(40), speedB: q(30), initialSeparation: q(20), elapsedTime: q(2) }, expected: q(160) },
  { mode: "findInitialGapFromLaterSeparation", input: { speedA: q(40), speedB: q(30), specifiedSeparation: q(170), elapsedTime: q(2) }, expected: q(30) },
  { mode: "findMeetingPointDistanceSplit", input: { routeDistance: q(300), speedA: q(60), speedB: q(40) }, expected: q(180) },
  { mode: "findSpeedRatioFromMeetingPoint", input: { distanceA: q(180), distanceB: q(120) }, expected: q(3, 2) },
  { mode: "findMeetingPointFromSpeedRatio", input: { routeDistance: q(300), ratioA: q(3), ratioB: q(2) }, expected: q(180) },
  { mode: "findUnknownStartPointGap", input: { speedA: q(70), speedB: q(50), meetingTime: q(3), directionCase: "SAME" }, expected: q(60) },
  { mode: "findMeetingClockTime", input: { departureMinute: q(600), initialSeparation: q(180), speedA: q(60), speedB: q(30), directionCase: "OPPOSITE" }, expected: q(720) },
  { mode: "findDepartureClockTimeFromMeetingState", input: { meetingClockMinute: q(720), initialSeparation: q(180), speedA: q(60), speedB: q(30), directionCase: "OPPOSITE" }, expected: q(600) },
  { mode: "findRelativeDistanceCoveredInGivenTime", input: { speedA: q(60), speedB: q(40), elapsedTime: q(2), directionCase: "OPPOSITE" }, expected: q(200) },
  { mode: "findTimeUntilSpecifiedSeparation", input: { speedA: q(70), speedB: q(50), initialSeparation: q(100), specifiedSeparation: q(40), directionCase: "SAME" }, expected: q(3) },
  { mode: "findSpeedNeededToAvoidOrCauseMeeting", input: { initialSeparation: q(180), targetTime: q(2), speedB: q(40), directionCase: "OPPOSITE" }, expected: q(50) },
]);

function invariant(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

invariant(TSD_CP004_DISCOVERY_AUTHORITIES.length === 33, "CP-004 discovery registry must contain exactly 33 blueprint candidates");
invariant(TSD_CP004_CORE_AUTHORITIES.length === 23, "CP-004 core executable foundation must contain exactly 23 modes");
invariant(new Set(TSD_CP004_DISCOVERY_AUTHORITIES.map((authority) => authority.provisionalId)).size === 33, "CP-004 provisional authority IDs must be unique");
invariant(new Set(TSD_CP004_DISCOVERY_AUTHORITIES.map((authority) => authority.solveMode)).size === 33, "CP-004 solve modes must be unique");
invariant(TSD_CP004_DISCOVERY_AUTHORITIES.every((authority) => authority.permanentQlId === null), "CP-004 discovery must allocate zero permanent QLs");
invariant(fixtures.length === TSD_CP004_CORE_AUTHORITIES.length, "Every CP-004 core authority requires an exact proof fixture");

let solved = 0;
let verified = 0;
for (const fixture of fixtures) {
  invariant(TSD_CP004_CORE_AUTHORITIES.some((authority) => authority.solveMode === fixture.mode), `${fixture.mode}: missing from core registry`);
  const result = solveCp004Core(fixture.mode, fixture.input);
  invariant(equals(result.answer, fixture.expected), `${fixture.mode}: exact answer mismatch`);
  solved += 1;
  const verification = verifyCp004Core(fixture.mode, fixture.input, result);
  invariant(verification.valid, `${fixture.mode}: verification failed: ${verification.errors.join("; ")}`);
  verified += 1;
}

// Explicit invalid-state guard: a pursuer cannot catch a faster leader under a same-direction closing-speed model.
let invalidCatchRejected = false;
try {
  solveCp004Core("findCatchUpTimeFromHeadStartDistance", { speedA: q(40), speedB: q(50), headStartDistance: q(100) });
} catch {
  invalidCatchRejected = true;
}
invariant(invalidCatchRejected, "non-positive closing speed was not rejected");

invariant(TSD_CP004_DISCOVERY_STATUS.nextPermanentQl === "TSD-QL-048", "CP-004 must begin permanent allocation at TSD-QL-048");
invariant(TSD_CP004_DISCOVERY_STATUS.permanentQlCount === 0, "CP-004 foundation must not allocate permanent QLs");
invariant(TSD_CP004_DISCOVERY_STATUS.questionStudioEnabled === false, "Question Studio must remain disabled");
invariant(TSD_CP004_DISCOVERY_STATUS.questionBankStatus === "NOT_STORED", "Question Bank writes must remain disabled");
invariant(TSD_CP004_DISCOVERY_STATUS.testEligibility === "INELIGIBLE", "CP-004 tests must remain ineligible");
invariant(TSD_CP004_DISCOVERY_STATUS.publiclyPublishable === false, "CP-004 public delivery must remain disabled");

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP004_EXACT_RELATIVE_MOTION_FOUNDATION",
  blueprintCandidates: TSD_CP004_DISCOVERY_AUTHORITIES.length,
  coreExecutableModes: TSD_CP004_CORE_AUTHORITIES.length,
  advancedDiscoveryModes: TSD_CP004_DISCOVERY_STATUS.advancedDiscoveryCount,
  representationCandidates: TSD_CP004_DISCOVERY_STATUS.representationCandidateCount,
  internalQaModes: TSD_CP004_DISCOVERY_STATUS.internalQaCount,
  exactFixturesSolved: solved,
  verificationChecks: verified,
  invalidClosingSpeedRejected: invalidCatchRejected,
  permanentQlCount: TSD_CP004_DISCOVERY_STATUS.permanentQlCount,
  nextPermanentQl: TSD_CP004_DISCOVERY_STATUS.nextPermanentQl,
  discoveryFrozen: TSD_CP004_DISCOVERY_STATUS.discoveryFrozen,
  englishFrozen: TSD_CP004_DISCOVERY_STATUS.englishFrozen,
  questionStudioEnabled: TSD_CP004_DISCOVERY_STATUS.questionStudioEnabled,
  questionBankStatus: TSD_CP004_DISCOVERY_STATUS.questionBankStatus,
  testEligibility: TSD_CP004_DISCOVERY_STATUS.testEligibility,
  publiclyPublishable: TSD_CP004_DISCOVERY_STATUS.publiclyPublishable,
}, null, 2));
