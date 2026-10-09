import {
  TSD_CP011_CP012_HOLDS,
  TSD_CP011_DISCOVERY_STATUS,
  TSD_CP011_INTERNAL_QA_MODES,
  TSD_CP011_LEARNER_AUTHORITIES,
  TSD_CP011_RAW_SOURCE_CANDIDATES,
  TSD_CP011_SOURCE_TO_AUTHORITY,
} from "./source-saturation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-011 source saturation proof failed: ${message}`);
}

assert(TSD_CP011_RAW_SOURCE_CANDIDATES.length === 35, "expected 35 raw inventory candidates");
assert(new Set(TSD_CP011_RAW_SOURCE_CANDIDATES).size === 35, "raw candidates must be unique");
assert(TSD_CP011_LEARNER_AUTHORITIES.length === 7, "expected seven learner mathematical authorities");
assert(new Set(TSD_CP011_LEARNER_AUTHORITIES).size === 7, "learner authorities must be unique");
assert(TSD_CP011_CP012_HOLDS.length === 2, "expected two CP012 multi-stage holds");
assert(TSD_CP011_INTERNAL_QA_MODES.length === 4, "expected four internal QA/DS modes");

const learnerSources = TSD_CP011_LEARNER_AUTHORITIES.flatMap((key) => [...TSD_CP011_SOURCE_TO_AUTHORITY[key]]);
assert(learnerSources.length === 29, "expected 29 learner-source forms after holds/QA separation");
assert(new Set(learnerSources).size === learnerSources.length, "a source candidate cannot belong to two learner authorities");

const disposed = [...learnerSources, ...TSD_CP011_CP012_HOLDS, ...TSD_CP011_INTERNAL_QA_MODES];
assert(disposed.length === 35, "all 35 candidates must have exactly one disposition");
assert(new Set(disposed).size === 35, "candidate dispositions overlap");
for (const candidate of TSD_CP011_RAW_SOURCE_CANDIDATES) {
  assert(disposed.includes(candidate), `${candidate}: missing disposition`);
}

assert(TSD_CP011_SOURCE_TO_AUTHORITY.movingSurfaceTravelState.length === 7, "moving-surface travel source breadth regressed");
assert(TSD_CP011_SOURCE_TO_AUTHORITY.stationaryStepCountState.length === 4, "stationary-step source breadth regressed");
assert(TSD_CP011_SOURCE_TO_AUTHORITY.dualEscalatorObservationState.length === 5, "dual-observation source breadth regressed");
assert(TSD_CP011_SOURCE_TO_AUTHORITY.movingSurfaceStateComparison.length === 5, "state-comparison source breadth regressed");
assert(TSD_CP011_SOURCE_TO_AUTHORITY.wheelRollState.length === 4, "wheel-roll source breadth regressed");
assert(TSD_CP011_SOURCE_TO_AUTHORITY.wheelRateTranslationState.length === 2, "wheel-rate source breadth regressed");
assert(TSD_CP011_SOURCE_TO_AUTHORITY.twoWheelComparisonState.length === 2, "two-wheel source breadth regressed");

assert(TSD_CP011_DISCOVERY_STATUS.permanentAllocationStatus === "FROZEN_APPROVED", "approved freeze status missing");
assert(TSD_CP011_DISCOVERY_STATUS.frozen, "CP011 source authority must be frozen after lifecycle approval");
assert(!TSD_CP011_DISCOVERY_STATUS.questionStudioRegistered, "content freeze must not register CP011 in Studio");
assert(!TSD_CP011_DISCOVERY_STATUS.bankWritable, "content freeze must not enable bank writes");
assert(!TSD_CP011_DISCOVERY_STATUS.testEligible, "content freeze must not enable tests");
assert(!TSD_CP011_DISCOVERY_STATUS.publiclyPublishable, "content freeze must not enable publication");

console.log("TSD-CP-011 FROZEN SOURCE SATURATION PROOF: PASS");
console.log(JSON.stringify(TSD_CP011_DISCOVERY_STATUS, null, 2));
