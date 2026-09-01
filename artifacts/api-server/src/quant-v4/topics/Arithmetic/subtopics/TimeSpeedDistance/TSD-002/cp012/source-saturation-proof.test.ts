import {
  TSD_CP012_LEARNER_AUTHORITIES,
  TSD_CP012_SINGLE_SOURCE_DISTINCT_AUTHORITIES,
  TSD_CP012_SOURCE_CANDIDATES,
  TSD_CP012_SOURCE_SUMMARY,
} from "./source-saturation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-012 source saturation proof failed: ${message}`);
}

assert(TSD_CP012_SOURCE_SUMMARY.inventoryCandidates === 40, "design inventory must remain 40 candidates");
assert(TSD_CP012_SOURCE_SUMMARY.inheritedCrossCheckpointCandidates === 2, "expected two inherited CP011 holds");
assert(TSD_CP012_SOURCE_SUMMARY.rawCandidates === 42, "expected 42 total discovery sources after CP011 transfers");
assert(TSD_CP012_SOURCE_SUMMARY.learnerSourceForms === 38, "expected 38 learner-source forms");
assert(TSD_CP012_SOURCE_SUMMARY.learnerAuthorities === 11, "expected eleven mathematical authorities after synthesis split");
assert(TSD_CP012_SOURCE_SUMMARY.internalQaModes === 4, "expected four internal QA modes");
assert(new Set(TSD_CP012_SOURCE_CANDIDATES.map((x) => x.sourceId)).size === 42, "source IDs must be unique");
assert(new Set(TSD_CP012_SOURCE_CANDIDATES.map((x) => x.candidate)).size === 42, "candidate names must be unique");

const singleSourceAllowed = new Set<string>(TSD_CP012_SINGLE_SOURCE_DISTINCT_AUTHORITIES);
for (const authorityKey of TSD_CP012_LEARNER_AUTHORITIES) {
  const owned = TSD_CP012_SOURCE_CANDIDATES.filter((x) => x.authorityKey === authorityKey);
  assert(owned.length >= 1, `${authorityKey}: authority has no source evidence`);
  if (!singleSourceAllowed.has(authorityKey)) {
    assert(owned.length >= 2, `${authorityKey}: merged authority should have at least two independent source forms`);
  } else {
    assert(owned.length === 1, `${authorityKey}: source-backed distinct authority should remain exactly one explicit inventory form`);
  }
}

for (const candidate of TSD_CP012_SOURCE_CANDIDATES) {
  if (candidate.disposition === "LEARNER_AUTHORITY") assert(candidate.authorityKey, `${candidate.sourceId}: learner form missing authority`);
  else assert(candidate.authorityKey === undefined, `${candidate.sourceId}: internal QA mode must not claim learner authority`);
}

const transferred = TSD_CP012_SOURCE_CANDIDATES.filter((x) => x.sourceId.startsWith("CP012-XCP-"));
assert(transferred.length === 2, "exactly two cross-checkpoint transfers expected");
assert(transferred.every((x) => x.authorityKey === "movingSurfaceScheduleSynthesisState"), "CP011 state-change holds must land in moving-surface schedule synthesis");
assert(TSD_CP012_SOURCE_CANDIDATES.find((x) => x.candidate === "findEscalatorPlusScheduleSynthesis")?.authorityKey === "movingSurfaceScheduleSynthesisState", "ordinary escalator schedule synthesis must share authority with CP011 transferred state changes");
assert(TSD_CP012_SOURCE_CANDIDATES.find((x) => x.candidate === "findTrainPlusScheduleSynthesis")?.authorityKey === "trainScheduleSynthesisState", "train synthesis must remain finite-train specific");
assert(TSD_CP012_SOURCE_CANDIDATES.find((x) => x.candidate === "findBoatPlusPursuitSynthesis")?.authorityKey === "mediumPursuitSynthesisState", "medium pursuit synthesis must remain signed-medium specific");
assert(TSD_CP012_SOURCE_CANDIDATES.find((x) => x.candidate === "findCircularRaceSynthesis")?.authorityKey === "closedTrackRaceSynthesisState", "circular race synthesis must remain modular-track specific");
assert(TSD_CP012_SOURCE_CANDIDATES.find((x) => x.candidate === "findTwoEngineInverseState")?.authorityKey === "twoEngineInverseState", "generic two-engine inverse must not be collapsed into a context-specific synthesis engine");

assert(TSD_CP012_SOURCE_SUMMARY.frozen === true, "CP012 source authority must be frozen");
assert(TSD_CP012_SOURCE_SUMMARY.questionStudioRegistered === false, "content freeze must not Studio-register CP012");
assert(TSD_CP012_SOURCE_SUMMARY.bankWritable === false, "CP012 Bank writes must remain disabled");
assert(TSD_CP012_SOURCE_SUMMARY.testEligible === false, "CP012 test eligibility must remain disabled");
assert(TSD_CP012_SOURCE_SUMMARY.publiclyPublishable === false, "CP012 public publishing must remain disabled");

console.log("TSD-CP-012 FROZEN SOURCE SATURATION + SYNTHESIS SPLIT PROOF: PASS");
console.log(JSON.stringify({
  ...TSD_CP012_SOURCE_SUMMARY,
  singleSourceDistinctAuthorities: TSD_CP012_SINGLE_SOURCE_DISTINCT_AUTHORITIES,
}, null, 2));
