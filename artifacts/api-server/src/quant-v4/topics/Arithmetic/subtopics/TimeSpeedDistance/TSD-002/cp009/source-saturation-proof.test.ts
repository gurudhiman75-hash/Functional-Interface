import {
  TSD_CP009_LEARNER_AUTHORITIES,
  TSD_CP009_SOURCE_ACCOUNTING,
  TSD_CP009_SOURCE_CANDIDATES,
  TSD_CP009_SOURCE_SATURATION,
} from "./source-saturation-final";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-009 source saturation proof failed: ${message}`);
}

assert(TSD_CP009_SOURCE_CANDIDATES.length === 39, "source candidate count changed");
assert(TSD_CP009_SOURCE_ACCOUNTING.length === 39, "not all source candidates accounted");
assert(new Set(TSD_CP009_SOURCE_CANDIDATES).size === 39, "source candidate names are not unique");
assert(new Set(TSD_CP009_SOURCE_ACCOUNTING.map((entry) => entry.candidate)).size === 39, "accounting contains duplicate source candidates");
assert(TSD_CP009_SOURCE_CANDIDATES.every((candidate) => TSD_CP009_SOURCE_ACCOUNTING.some((entry) => entry.candidate === candidate)), "source candidate missing from accounting");

const counts = Object.freeze({
  learner: TSD_CP009_SOURCE_ACCOUNTING.filter((entry) => entry.disposition === "LEARNER_AUTHORITY").length,
  merged: TSD_CP009_SOURCE_ACCOUNTING.filter((entry) => entry.disposition === "MERGED").length,
  cross: TSD_CP009_SOURCE_ACCOUNTING.filter((entry) => entry.disposition === "CROSS_CHECKPOINT_HOLD").length,
  qa: TSD_CP009_SOURCE_ACCOUNTING.filter((entry) => entry.disposition === "INTERNAL_QA").length,
});
assert(counts.learner === 11, `expected 11 learner authorities, got ${counts.learner}`);
assert(counts.merged === 22, `expected 22 merged modes, got ${counts.merged}`);
assert(counts.cross === 2, `expected 2 cross-checkpoint holds, got ${counts.cross}`);
assert(counts.qa === 4, `expected 4 QA modes, got ${counts.qa}`);
assert(counts.learner + counts.merged + counts.cross + counts.qa === 39, "disposition counts do not close to 39");

assert(TSD_CP009_LEARNER_AUTHORITIES.length === 11, "learner authority registry count changed");
assert(new Set(TSD_CP009_LEARNER_AUTHORITIES.map((authority) => authority.authorityKey)).size === 11, "authority keys are not unique");
assert(new Set(TSD_CP009_LEARNER_AUTHORITIES.map((authority) => authority.sourceCandidate)).size === 11, "retained source candidates are not unique");
assert(TSD_CP009_LEARNER_AUTHORITIES.every((authority) => authority.learnerContract.length >= 70), "learner contract is too thin");
assert(TSD_CP009_LEARNER_AUTHORITIES.every((authority) => authority.invariant.length >= 40), "executable invariant is too thin");

const authorityKeys = new Set(TSD_CP009_LEARNER_AUTHORITIES.map((authority) => authority.authorityKey));
for (const entry of TSD_CP009_SOURCE_ACCOUNTING) {
  if (entry.disposition === "LEARNER_AUTHORITY" || entry.disposition === "MERGED") {
    assert(authorityKeys.has(entry.target as never), `${entry.candidate}: learner/merge target is not a retained CP009 authority`);
  }
}

const catchUp = TSD_CP009_SOURCE_ACCOUNTING.find((entry) => entry.candidate === "findBoatCatchUpTimeInStream");
const oppositeMeet = TSD_CP009_SOURCE_ACCOUNTING.find((entry) => entry.candidate === "findMeetingTimeForOppositeDirectionBoats");
assert(catchUp?.disposition === "CROSS_CHECKPOINT_HOLD", "same-current boat catch-up must remain generic relative motion");
assert(oppositeMeet?.disposition === "CROSS_CHECKPOINT_HOLD", "opposite boat meeting time must remain generic relative motion");
assert(catchUp?.target === "CP004_GENERIC_RELATIVE_MOTION_CURRENT_CANCELS", "catch-up cancellation owner changed");
assert(oppositeMeet?.target === "CP004_GENERIC_RELATIVE_MOTION_CURRENT_CANCELS", "meeting-time cancellation owner changed");

const meetingPoint = TSD_CP009_LEARNER_AUTHORITIES.find((authority) => authority.authorityKey === "mediumShiftedMeetingPoint");
assert(meetingPoint?.invariant.includes("meeting location depends on c while meeting time does not"), "meeting-point medium essentiality guard missing");

assert(TSD_CP009_SOURCE_SATURATION.permanentQlCount === 0, "QLs allocated before executable feasibility");
assert(TSD_CP009_SOURCE_SATURATION.nextPermanentQl === "TSD-QL-104", "next permanent QL changed");
assert(TSD_CP009_SOURCE_SATURATION.finiteDimensionPolicy === "ONE_DIMENSIONAL_SIGNED_MEDIUM_ONLY", "1-D medium boundary changed");
assert(TSD_CP009_SOURCE_SATURATION.twoDimensionalRiverCrossing === "HELD_FOR_ADVANCED_TRIG_VECTOR_OWNERSHIP", "2-D river crossing leaked into CP009");
assert(TSD_CP009_SOURCE_SATURATION.vectorWindDrift === "HELD_FOR_ADVANCED_TRIG_VECTOR_OWNERSHIP", "vector wind drift leaked into CP009");
assert(TSD_CP009_SOURCE_SATURATION.questionStudioEnabled === false, "Question Studio opened before CP009 freeze");
assert(TSD_CP009_SOURCE_SATURATION.questionBankStatus === "NOT_STORED", "Question Bank opened before CP009 freeze");
assert(TSD_CP009_SOURCE_SATURATION.testEligibility === "INELIGIBLE", "tests opened before CP009 freeze");
assert(TSD_CP009_SOURCE_SATURATION.publiclyPublishable === false, "public publication opened before CP009 freeze");

console.log("TSD-CP-009 SOURCE SATURATION PROOF: PASS");
console.log(JSON.stringify({
  sourceCandidates: 39,
  learnerAuthorities: 11,
  mergedModes: 22,
  crossCheckpointHolds: 2,
  internalQaModes: 4,
  nextPermanentQl: TSD_CP009_SOURCE_SATURATION.nextPermanentQl,
  dimensionalBoundary: TSD_CP009_SOURCE_SATURATION.finiteDimensionPolicy,
}, null, 2));
