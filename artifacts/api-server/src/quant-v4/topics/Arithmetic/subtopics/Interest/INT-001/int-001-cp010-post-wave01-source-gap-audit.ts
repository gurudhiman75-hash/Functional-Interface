import {
  INT_CP010_PROTOTYPE_IDS,
  buildIntCp010DiscoveryPackage,
  solveIntCp010Discovery,
  verifyIntCp010DiscoveryAnswer,
} from "./cp010-mixed-systems-discovery-v1";
import {
  INT_CP010_POST_WAVE01_SOURCE_LEDGER,
  INT_CP010_POST_WAVE01_SOURCE_LEDGER_VERSION,
  INT_CP010_POST_WAVE01_SOURCE_RESULT,
} from "./cp010-post-wave01-source-ledger-v1";
import { eq } from "./cp003-exam-model";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(INT_CP010_POST_WAVE01_SOURCE_LEDGER_VERSION === "INT-CP-010-POST-WAVE01-SOURCE-LEDGER-v1", "CP010 source-ledger version drifted");
assert(INT_CP010_POST_WAVE01_SOURCE_LEDGER.length === 16, `Expected 16 source directions, got ${INT_CP010_POST_WAVE01_SOURCE_LEDGER.length}`);
assert(INT_CP010_POST_WAVE01_SOURCE_RESULT.reliableSourceDirections === 3, "Reliable source-direction count drifted");
assert(INT_CP010_POST_WAVE01_SOURCE_RESULT.sourceHolds === 4, "Source-hold count drifted");
assert(INT_CP010_POST_WAVE01_SOURCE_RESULT.designOnlyNoDirectSource === 6, "Design-only count drifted");
assert(INT_CP010_POST_WAVE01_SOURCE_RESULT.representationHolds === 1, "Representation-hold count drifted");
assert(INT_CP010_POST_WAVE01_SOURCE_RESULT.earlierCpDirections === 2, "Earlier-CP count drifted");
assert(INT_CP010_POST_WAVE01_SOURCE_RESULT.materialReliableSourceGaps === 0, "Reliable source gap opened");
assert(INT_CP010_POST_WAVE01_SOURCE_RESULT.permanentCandidatePrototypeIds.join(",") === "INT-CP010-PROT-003,INT-CP010-PROT-004", "Permanent-candidate prototype set drifted");
assert(INT_CP010_POST_WAVE01_SOURCE_RESULT.sourceHoldPrototypeIds.join(",") === "INT-CP010-PROT-001,INT-CP010-PROT-002", "Source-hold prototype set drifted");
assert(INT_CP010_POST_WAVE01_SOURCE_RESULT.proposedPermanentAuthorityCountBeforeMergeSplit === 2, "Pre-merge/split authority count drifted");
assert(INT_CP010_POST_WAVE01_SOURCE_RESULT.permanentQlCount === 0, "Source audit must not allocate permanent QLs");
assert(INT_CP010_POST_WAVE01_SOURCE_RESULT.nextPotentialQlIdentity === "INT-QL-130", "Next potential QL drifted");
assert(INT_CP010_POST_WAVE01_SOURCE_RESULT.nextPotentialQlIdentityReserved === false, "Source audit must not reserve QL identity");

const reliableIds = new Set(INT_CP010_POST_WAVE01_SOURCE_LEDGER
  .filter((entry) => entry.disposition === "COVERED_RELIABLE_SOURCE")
  .flatMap((entry) => entry.prototypes));
assert(reliableIds.size === 2 && reliableIds.has("INT-CP010-PROT-003") && reliableIds.has("INT-CP010-PROT-004"), "Reliable source directions must resolve only to P003/P004");

const sourceHoldIds = new Set(INT_CP010_POST_WAVE01_SOURCE_LEDGER
  .filter((entry) => entry.disposition === "SOURCE_HOLD_LEGACY_FIXTURE_MISROUTED")
  .flatMap((entry) => entry.prototypes));
assert(sourceHoldIds.size === 2 && sourceHoldIds.has("INT-CP010-PROT-001") && sourceHoldIds.has("INT-CP010-PROT-002"), "Legacy source holds must remain P001/P002");

for (const held of ["S01", "S02", "S06", "S07"]) {
  const entry = INT_CP010_POST_WAVE01_SOURCE_LEDGER.find((item) => item.id === held)!;
  assert(entry.disposition === "SOURCE_HOLD_LEGACY_FIXTURE_MISROUTED", `${held}: legacy misrouting hold was weakened`);
  assert(/misrout|V2|legacy/i.test(`${entry.sourceEvidence} ${entry.note}`), `${held}: legacy fixture finding is not documented`);
}

let regressionPackages = 0;
let regressionChecks = 0;
let reliableCandidatePackages = 0;
let sourceHoldPackages = 0;
const fingerprints = new Map<string, Set<string>>();
for (const prototypeId of INT_CP010_PROTOTYPE_IDS) {
  fingerprints.set(prototypeId, new Set());
  for (let index = 0; index < 100; index += 1) {
    const seed = `cp010:post-wave01:${prototypeId}:${index}`;
    const q = buildIntCp010DiscoveryPackage(prototypeId, seed);
    regressionPackages += 1;
    fingerprints.get(prototypeId)!.add(q.mathematicalFingerprint);
    assert(q.permanentQlId === null, `${prototypeId}/${seed}: permanent QL leaked`);
    assert(eq(solveIntCp010Discovery(q.mathematicalState), q.answer), `${prototypeId}/${seed}: canonical solver drift`);
    assert(verifyIntCp010DiscoveryAnswer(q.mathematicalState, q.answer), `${prototypeId}/${seed}: independent verifier drift`);
    assert(q.options.length === 4 && q.options.filter((option) => option.isCorrect).length === 1, `${prototypeId}/${seed}: option ownership drift`);
    assert(q.lifecycle.questionStudioDiscoverable === false && q.lifecycle.questionBankWritable === false && q.lifecycle.testEligible === false && q.lifecycle.publiclyPublishable === false, `${prototypeId}/${seed}: downstream lifecycle leaked`);
    regressionChecks += 5;
    if (reliableIds.has(prototypeId)) reliableCandidatePackages += 1;
    if (sourceHoldIds.has(prototypeId)) sourceHoldPackages += 1;
  }
}
assert(regressionPackages === 400, `Expected 400 regression packages, got ${regressionPackages}`);
assert(reliableCandidatePackages === 200, `Expected 200 reliable-candidate packages, got ${reliableCandidatePackages}`);
assert(sourceHoldPackages === 200, `Expected 200 source-hold packages, got ${sourceHoldPackages}`);
for (const [prototypeId, states] of fingerprints) assert(states.size >= 70, `${prototypeId}: post-Wave01 state pool unexpectedly thin (${states.size})`);

console.log(JSON.stringify({
  sourceLedgerVersion: INT_CP010_POST_WAVE01_SOURCE_LEDGER_VERSION,
  directionsAudited: INT_CP010_POST_WAVE01_SOURCE_RESULT.directionsAudited,
  reliableSourceDirections: INT_CP010_POST_WAVE01_SOURCE_RESULT.reliableSourceDirections,
  sourceHolds: INT_CP010_POST_WAVE01_SOURCE_RESULT.sourceHolds,
  designOnlyNoDirectSource: INT_CP010_POST_WAVE01_SOURCE_RESULT.designOnlyNoDirectSource,
  representationHolds: INT_CP010_POST_WAVE01_SOURCE_RESULT.representationHolds,
  earlierCpDirections: INT_CP010_POST_WAVE01_SOURCE_RESULT.earlierCpDirections,
  materialReliableSourceGaps: INT_CP010_POST_WAVE01_SOURCE_RESULT.materialReliableSourceGaps,
  discoveryPrototypeCount: INT_CP010_POST_WAVE01_SOURCE_RESULT.discoveryPrototypeCount,
  permanentCandidatePrototypeIds: INT_CP010_POST_WAVE01_SOURCE_RESULT.permanentCandidatePrototypeIds,
  sourceHoldPrototypeIds: INT_CP010_POST_WAVE01_SOURCE_RESULT.sourceHoldPrototypeIds,
  proposedPermanentAuthorityCountBeforeMergeSplit: INT_CP010_POST_WAVE01_SOURCE_RESULT.proposedPermanentAuthorityCountBeforeMergeSplit,
  regressionPackages,
  regressionChecks,
  reliableCandidatePackages,
  sourceHoldPackages,
  uniqueMathematicalStates: Object.fromEntries([...fingerprints].map(([id, values]) => [id, values.size])),
  permanentQlCount: 0,
  nextPotentialQlIdentity: INT_CP010_POST_WAVE01_SOURCE_RESULT.nextPotentialQlIdentity,
  nextPotentialQlIdentityReserved: false,
  nextGate: INT_CP010_POST_WAVE01_SOURCE_RESULT.nextGate,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_INT_CP010_POST_WAVE01_SOURCE_GAP_AUDIT");
