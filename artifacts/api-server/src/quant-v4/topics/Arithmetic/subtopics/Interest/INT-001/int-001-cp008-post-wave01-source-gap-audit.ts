import {
  INT_CP008_PROTOTYPE_IDS,
  buildIntCp008DiscoveryPackage,
  verifyIntCp008PrototypeAnswer,
} from "./cp008-instalment-discovery-v1";
import {
  INT_CP008_POST_WAVE01_GAP_RESULT,
  INT_CP008_POST_WAVE01_SOURCE_LEDGER,
} from "./cp008-post-wave01-source-ledger";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function stable(value: unknown): string {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `${current}n` : current);
}

const prototypeIds = new Set<string>(INT_CP008_PROTOTYPE_IDS);
let dispositionChecks = 0;
for (const direction of INT_CP008_POST_WAVE01_SOURCE_LEDGER) {
  if (direction.disposition === "COVERED" || direction.disposition === "MERGE_CANDIDATE") {
    assert(direction.prototypes.length > 0, `${direction.id}: executable disposition lacks prototype`);
  }
  if (direction.disposition === "REASSIGN_CP009") {
    assert(direction.prototypes.length === 0, `${direction.id}: CP009 reassignment claims CP008 prototype`);
  }
  for (const prototypeId of direction.prototypes) {
    assert(prototypeIds.has(prototypeId), `${direction.id}: unknown prototype ${prototypeId}`);
  }
  dispositionChecks += 2 + direction.prototypes.length;
}

const counts = Object.freeze({
  covered: INT_CP008_POST_WAVE01_SOURCE_LEDGER.filter((entry) => entry.disposition === "COVERED").length,
  representations: INT_CP008_POST_WAVE01_SOURCE_LEDGER.filter((entry) => entry.disposition === "REPRESENTATION").length,
  cp009: INT_CP008_POST_WAVE01_SOURCE_LEDGER.filter((entry) => entry.disposition === "REASSIGN_CP009").length,
  mergeCandidates: INT_CP008_POST_WAVE01_SOURCE_LEDGER.filter((entry) => entry.disposition === "MERGE_CANDIDATE").length,
});
assert(INT_CP008_POST_WAVE01_SOURCE_LEDGER.length === 17, "CP008 source ledger count drifted");
assert(counts.covered === 10, "CP008 covered source-direction count drifted");
assert(counts.representations === 2, "CP008 representation count drifted");
assert(counts.cp009 === 3, "CP008/CP009 reassignment count drifted");
assert(counts.mergeCandidates === 2, "CP008 merge-candidate count drifted");
assert(INT_CP008_POST_WAVE01_GAP_RESULT.materialGaps === 0, "CP008 material source gaps remain");
assert(INT_CP008_POST_WAVE01_GAP_RESULT.permanentQlCount === 0, "CP008 source audit allocated permanent QLs");
assert(INT_CP008_POST_WAVE01_GAP_RESULT.nextGate === "FINAL_MERGE_SPLIT_PROPOSAL", "CP008 next gate drifted");

let regressionPackages = 0;
let regressionChecks = 0;
for (const prototypeId of INT_CP008_PROTOTYPE_IDS) {
  for (let index = 0; index < 40; index += 1) {
    const seed = `int-cp008-source-gap:${prototypeId}:${index}`;
    const first = buildIntCp008DiscoveryPackage(prototypeId, seed);
    const replay = buildIntCp008DiscoveryPackage(prototypeId, seed);
    assert(stable(first) === stable(replay), `${prototypeId}/${seed}: replay drift`);
    assert(verifyIntCp008PrototypeAnswer(first.mathematicalState, first.answer), `${prototypeId}/${seed}: verifier drift`);
    assert(first.permanentQlId === null, `${prototypeId}/${seed}: permanent QL leaked`);
    assert(first.lifecycle.questionStudioDiscoverable === false, `${prototypeId}/${seed}: Question Studio opened`);
    assert(first.lifecycle.questionBankWritable === false, `${prototypeId}/${seed}: Question Bank opened`);
    assert(first.lifecycle.testEligibility === "INELIGIBLE", `${prototypeId}/${seed}: test gate opened`);
    assert(first.lifecycle.publiclyPublishable === false, `${prototypeId}/${seed}: public gate opened`);
    regressionPackages += 1;
    regressionChecks += 7;
  }
}

console.log(JSON.stringify({
  sourceDirectionsAudited: INT_CP008_POST_WAVE01_SOURCE_LEDGER.length,
  coveredDirections: counts.covered,
  representationDirections: counts.representations,
  cp009Reassignments: counts.cp009,
  mergeCandidates: counts.mergeCandidates,
  materialGaps: 0,
  implementedTemporaryPrototypes: INT_CP008_PROTOTYPE_IDS.length,
  regressionPackages,
  regressionChecks,
  dispositionChecks,
  permanentQlCount: 0,
  nextPotentialQlIdentity: INT_CP008_POST_WAVE01_GAP_RESULT.nextPotentialQlIdentity,
  nextGate: INT_CP008_POST_WAVE01_GAP_RESULT.nextGate,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_INT_CP008_POST_WAVE01_SOURCE_GAP_AUDIT");
