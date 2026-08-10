import {
  TSD_CP003_DISCOVERY_AUTHORITIES,
  TSD_CP003_INTERNAL_AUTHORITIES,
  TSD_CP003_LEARNER_AUTHORITIES,
  TSD_CP003_SOURCE_CANDIDATES,
} from "./discovery-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(TSD_CP003_SOURCE_CANDIDATES.length === 35, "CP-003 source-candidate count must remain 35 during discovery");
assert(TSD_CP003_DISCOVERY_AUTHORITIES.length === 24, "CP-003 provisional authority count must be 24 for this discovery pass");
assert(TSD_CP003_LEARNER_AUTHORITIES.length === 22, "CP-003 learner-facing provisional authority count must be 22");
assert(TSD_CP003_INTERNAL_AUTHORITIES.length === 2, "CP-003 internal-QA authority count must be 2");
assert(new Set(TSD_CP003_DISCOVERY_AUTHORITIES.map((entry) => entry.provisionalId)).size === TSD_CP003_DISCOVERY_AUTHORITIES.length, "Duplicate CP-003 provisional ID");
assert(new Set(TSD_CP003_DISCOVERY_AUTHORITIES.map((entry) => entry.solveMode)).size === TSD_CP003_DISCOVERY_AUTHORITIES.length, "Duplicate CP-003 solve mode");

const sourceOwners = new Map<string, string[]>();
for (const authority of TSD_CP003_DISCOVERY_AUTHORITIES) {
  assert(authority.sourceCandidates.length > 0, `${authority.provisionalId}: authority has no source candidate`);
  assert(authority.discoveryStatus === "OPEN_EXECUTABLE_DISCOVERY", `${authority.provisionalId}: discovery was frozen prematurely`);
  assert(authority.permanentQlId === null, `${authority.provisionalId}: permanent QL allocated before executable proof`);
  assert(authority.englishFreezeStatus === "UNFROZEN", `${authority.provisionalId}: English frozen before executable proof`);
  assert(authority.questionBankStatus === "NOT_STORED", `${authority.provisionalId}: Question Bank write enabled during discovery`);
  assert(authority.testEligibility === "INELIGIBLE", `${authority.provisionalId}: test eligibility enabled during discovery`);
  assert(authority.publiclyPublishable === false, `${authority.provisionalId}: public delivery enabled during discovery`);

  for (const source of authority.sourceCandidates) {
    sourceOwners.set(source, [...(sourceOwners.get(source) ?? []), authority.provisionalId]);
  }
}

assert(sourceOwners.size === TSD_CP003_SOURCE_CANDIDATES.length, "Not every CP-003 source candidate is owned");
for (const source of TSD_CP003_SOURCE_CANDIDATES) {
  const owners = sourceOwners.get(source) ?? [];
  assert(owners.length === 1, `${source}: expected exactly one CP-003 provisional owner, received ${owners.join(", ") || "none"}`);
}

const byMode = new Map(TSD_CP003_DISCOVERY_AUTHORITIES.map((entry) => [entry.solveMode, entry]));

const timeGainLoss = byMode.get("timeGainLossFromSpeedChange")!;
assert(timeGainLoss.sourceCandidates.length === 2, "Faster/slower fixed-route time difference should remain one authority");
assert(timeGainLoss.answerKind === "TIME", "Time gain/loss authority answer kind changed");

const earlyLateSpeed = byMode.get("usualSpeedFromEarlyLatePair")!;
const earlyLateDistance = byMode.get("distanceFromEarlyLatePair")!;
assert(earlyLateSpeed.provisionalId !== earlyLateDistance.provisionalId, "Early/late speed and distance tasks were incorrectly merged");
assert(earlyLateSpeed.answerKind === "SPEED" && earlyLateDistance.answerKind === "DISTANCE", "Early/late inverse answer contracts changed");

const stopCount = byMode.get("numberOfStopsFromOverallDelay")!;
const stopDelay = byMode.get("delayFromRegularStops")!;
assert(stopCount.provisionalId !== stopDelay.provisionalId, "Stop-count and stop-delay tasks were incorrectly merged");
assert(stopCount.answerKind === "COUNT" && stopDelay.answerKind === "TIME", "Regular-stop answer contracts changed");

const changePointDistance = byMode.get("speedChangePointDistance")!;
const changePointFraction = byMode.get("fractionOfRouteAtChangedSpeed")!;
assert(changePointDistance.provisionalId !== changePointFraction.provisionalId, "Change-point distance and route-fraction tasks were incorrectly merged");
assert(changePointDistance.answerKind === "DISTANCE" && changePointFraction.answerKind === "PERCENT", "Change-point answer contracts changed");

const walkingRiding = byMode.get("walkingRidingAllocation")!;
assert(walkingRiding.sourceCandidates.length === 2, "Walking/riding time and distance representations should share one allocation authority during discovery");
assert(walkingRiding.answerKind === "ALLOCATION", "Walking/riding allocation answer kind changed");

for (const forbidden of ["Train", "Meeting", "Catch", "Circular", "Boat", "Stream"] as const) {
  assert(!TSD_CP003_SOURCE_CANDIDATES.some((source) => source.includes(forbidden)), `CP-003 collision guard failed: ${forbidden} candidate leaked in`);
}

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP003_EXECUTABLE_DISCOVERY_REGISTRY",
  sourceCandidates: TSD_CP003_SOURCE_CANDIDATES.length,
  provisionalAuthorities: TSD_CP003_DISCOVERY_AUTHORITIES.length,
  learnerAuthorities: TSD_CP003_LEARNER_AUTHORITIES.length,
  internalQaAuthorities: TSD_CP003_INTERNAL_AUTHORITIES.length,
  sourceCandidatesOwnedExactlyOnce: sourceOwners.size,
  permanentQlCount: 0,
  englishFreezeStatus: "UNFROZEN",
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
