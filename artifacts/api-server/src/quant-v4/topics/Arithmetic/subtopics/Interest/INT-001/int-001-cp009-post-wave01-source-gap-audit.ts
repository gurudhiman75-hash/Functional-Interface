import {
  INT_CP009_PROTOTYPE_IDS,
  buildIntCp009BalancedDiscoveryPackage as buildIntCp009DiscoveryPackage,
  intCp009EquivalentAt,
  intCp009ShiftAmount,
  verifyIntCp009PrototypeAnswer,
} from "./cp009-dated-cash-flow-discovery-balanced-v2";
import {
  INT_CP009_POST_WAVE01_GAP_RESULT,
  INT_CP009_POST_WAVE01_SOURCE_LEDGER,
} from "./cp009-post-wave01-source-ledger";
import { eq } from "./cp003-exam-model";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function stable(value: unknown): string {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `${current}n` : current);
}

const prototypeIds = new Set<string>(INT_CP009_PROTOTYPE_IDS);
let dispositionChecks = 0;
for (const direction of INT_CP009_POST_WAVE01_SOURCE_LEDGER) {
  if (direction.disposition === "COVERED" || direction.disposition === "MERGE_CANDIDATE") {
    assert(direction.prototypes.length > 0, `${direction.id}: executable disposition has no prototype`);
  }
  if (
    direction.disposition === "REASSIGN_CP007"
    || direction.disposition === "REASSIGN_CP008"
    || direction.disposition === "REASSIGN_CP010"
    || direction.disposition === "EXCLUDED_NO_SOURCE_AUTHORITY"
  ) {
    assert(direction.prototypes.length === 0, `${direction.id}: reassigned/excluded direction claims a CP009 prototype`);
  }
  for (const prototypeId of direction.prototypes) {
    assert(prototypeIds.has(prototypeId), `${direction.id}: unknown prototype ${prototypeId}`);
  }
  dispositionChecks += 2 + direction.prototypes.length;
}

const counts = Object.freeze({
  covered: INT_CP009_POST_WAVE01_SOURCE_LEDGER.filter((entry) => entry.disposition === "COVERED").length,
  representations: INT_CP009_POST_WAVE01_SOURCE_LEDGER.filter((entry) => entry.disposition === "REPRESENTATION").length,
  mergeCandidates: INT_CP009_POST_WAVE01_SOURCE_LEDGER.filter((entry) => entry.disposition === "MERGE_CANDIDATE").length,
  cp007: INT_CP009_POST_WAVE01_SOURCE_LEDGER.filter((entry) => entry.disposition === "REASSIGN_CP007").length,
  cp008: INT_CP009_POST_WAVE01_SOURCE_LEDGER.filter((entry) => entry.disposition === "REASSIGN_CP008").length,
  cp010: INT_CP009_POST_WAVE01_SOURCE_LEDGER.filter((entry) => entry.disposition === "REASSIGN_CP010").length,
  excluded: INT_CP009_POST_WAVE01_SOURCE_LEDGER.filter((entry) => entry.disposition === "EXCLUDED_NO_SOURCE_AUTHORITY").length,
});

assert(INT_CP009_POST_WAVE01_SOURCE_LEDGER.length === 20, "CP009 source ledger count drifted");
assert(counts.covered === 7, "CP009 covered source-direction count drifted");
assert(counts.representations === 5, "CP009 representation count drifted");
assert(counts.mergeCandidates === 1, "CP009 merge-candidate count drifted");
assert(counts.cp007 === 1, "CP009->CP007 reassignment count drifted");
assert(counts.cp008 === 2, "CP009->CP008 reassignment count drifted");
assert(counts.cp010 === 1, "CP009->CP010 reassignment count drifted");
assert(counts.excluded === 3, "CP009 excluded direction count drifted");
assert(INT_CP009_POST_WAVE01_GAP_RESULT.materialGaps === 0, "CP009 material source gaps remain");
assert(INT_CP009_POST_WAVE01_GAP_RESULT.permanentQlCount === 0, "CP009 source audit allocated permanent QLs");
assert(INT_CP009_POST_WAVE01_GAP_RESULT.nextPotentialQlIdentity === "INT-QL-125", "CP009 next potential identity drifted");
assert(INT_CP009_POST_WAVE01_GAP_RESULT.nextPotentialQlIdentityReserved === false, "CP009 source audit reserved INT-QL-125");
assert(INT_CP009_POST_WAVE01_GAP_RESULT.nextGate === "FINAL_MERGE_SPLIT_PROPOSAL", "CP009 next gate drifted");

let regressionPackages = 0;
let regressionChecks = 0;
for (const prototypeId of INT_CP009_PROTOTYPE_IDS) {
  for (let index = 0; index < 40; index += 1) {
    const seed = `int-cp009-source-gap:${prototypeId}:${index}`;
    const first = buildIntCp009DiscoveryPackage(prototypeId, seed);
    const replay = buildIntCp009DiscoveryPackage(prototypeId, seed);
    assert(stable(first) === stable(replay), `${prototypeId}/${seed}: deterministic replay drift`);
    assert(verifyIntCp009PrototypeAnswer(first.mathematicalState, first.answer), `${prototypeId}/${seed}: verifier drift`);
    assert(first.permanentQlId === null, `${prototypeId}/${seed}: permanent QL leaked`);
    assert(first.lifecycle.questionStudioDiscoverable === false, `${prototypeId}/${seed}: Question Studio opened`);
    assert(first.lifecycle.questionBankWritable === false, `${prototypeId}/${seed}: Question Bank opened`);
    assert(first.lifecycle.testEligibility === "INELIGIBLE", `${prototypeId}/${seed}: test gate opened`);
    assert(first.lifecycle.publiclyPublishable === false, `${prototypeId}/${seed}: public gate opened`);
    regressionPackages += 1;
    regressionChecks += 7;
  }
}

let equivalentPaymentMergeChecks = 0;
for (let index = 0; index < 200; index += 1) {
  const seed = `int-cp009-merge-p008-p002:${index}`;
  const package008 = buildIntCp009DiscoveryPackage("INT-CP009-PROT-008", seed);
  const state = package008.mathematicalState;
  assert(state.prototypeId === "INT-CP009-PROT-008", `${seed}: P008 state narrowing failed`);
  const valueTodayFromSchedule = intCp009EquivalentAt(state.repayments, state.periodicRatePercent, 0);
  const valueTodayFromEquivalentPayment = intCp009ShiftAmount(package008.answer, state.periodicRatePercent, state.comparisonPeriod, 0);
  assert(eq(valueTodayFromSchedule, valueTodayFromEquivalentPayment), `${seed}: P008 does not reduce to common-date opening-value equivalence`);
  equivalentPaymentMergeChecks += 1;
}

console.log(JSON.stringify({
  sourceDirectionsAudited: INT_CP009_POST_WAVE01_SOURCE_LEDGER.length,
  coveredDirections: counts.covered,
  representationDirections: counts.representations,
  mergeCandidates: counts.mergeCandidates,
  cp007Reassignments: counts.cp007,
  cp008Reassignments: counts.cp008,
  cp010Reassignments: counts.cp010,
  excludedNoSourceAuthority: counts.excluded,
  materialGaps: INT_CP009_POST_WAVE01_GAP_RESULT.materialGaps,
  implementedTemporaryPrototypes: INT_CP009_PROTOTYPE_IDS.length,
  regressionPackages,
  regressionChecks,
  dispositionChecks,
  equivalentPaymentMergeChecks,
  permanentQlCount: 0,
  nextPotentialQlIdentity: INT_CP009_POST_WAVE01_GAP_RESULT.nextPotentialQlIdentity,
  nextPotentialQlIdentityReserved: false,
  nextGate: INT_CP009_POST_WAVE01_GAP_RESULT.nextGate,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_INT_CP009_POST_WAVE01_SOURCE_GAP_AUDIT");
