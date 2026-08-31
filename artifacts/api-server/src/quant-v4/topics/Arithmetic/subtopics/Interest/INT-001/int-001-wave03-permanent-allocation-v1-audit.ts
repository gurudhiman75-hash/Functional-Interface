import assert from "node:assert/strict";
import {
  INT_001_FINAL_QL_IDS,
  INT_001_INTENTIONAL_VACANCY,
  INT_001_NEXT_FREE_QL,
  INT_001_PERMANENT_QL_COUNT,
} from "./int-001-final-authority-registry-v1";
import { INT_CP007_QL_CONTRACTS } from "./cp007-scheme-equivalence-runtime-v3-final";
import { INT_CP010_FINAL_AUTHORITIES } from "./cp010-final-registry-v1";
import {
  INT_001_WAVE03_AUTHORITY_CONTRACTS,
  INT_001_WAVE03_PERMANENT_ALLOCATION,
  INT_001_WAVE03_PERMANENT_ALLOCATION_VERSION,
  INT_001_WAVE03_QL_IDS,
  constructInt001Wave03PermanentState,
  solveInt001Wave03Permanent,
  verifyInt001Wave03PermanentAnswer,
} from "./int-001-wave03-permanent-allocation-v1";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}

function assertDeepFrozen(value: unknown, label: string, seen = new WeakSet<object>()): void {
  if (typeof value !== "object" || value === null) return;
  const objectValue = value as object;
  if (seen.has(objectValue)) return;
  seen.add(objectValue);
  assert.equal(Object.isFrozen(objectValue), true, `${label}: object is not frozen`);
  for (const property of Reflect.ownKeys(objectValue)) {
    assertDeepFrozen((objectValue as Record<PropertyKey, unknown>)[property], `${label}.${String(property)}`, seen);
  }
}

assert.equal(INT_001_WAVE03_PERMANENT_ALLOCATION_VERSION, "INT-001-WAVE03-PERMANENT-ALLOCATION-v1");
assert.equal(INT_001_PERMANENT_QL_COUNT, 130, "Wave03 baseline permanent count drifted before allocation");
assert.equal(INT_001_NEXT_FREE_QL, "INT-QL-132", "Wave03 allocation must begin at the prior next-free QL");
assert.equal(INT_001_INTENTIONAL_VACANCY, "INT-QL-094", "Intentional vacancy changed before Wave03 allocation");
assert.deepEqual(INT_001_WAVE03_QL_IDS, ["INT-QL-132", "INT-QL-133", "INT-QL-134"]);
assert.equal(INT_001_WAVE03_PERMANENT_ALLOCATION.baselinePermanentQlCount, 130);
assert.equal(INT_001_WAVE03_PERMANENT_ALLOCATION.allocatedQlCount, 3);
assert.equal(INT_001_WAVE03_PERMANENT_ALLOCATION.resultingPermanentQlCount, 133);
assert.equal(INT_001_WAVE03_PERMANENT_ALLOCATION.firstQlId, "INT-QL-132");
assert.equal(INT_001_WAVE03_PERMANENT_ALLOCATION.lastQlId, "INT-QL-134");
assert.equal(INT_001_WAVE03_PERMANENT_ALLOCATION.nextFreeQl, "INT-QL-135");
assert.equal(INT_001_WAVE03_PERMANENT_ALLOCATION.permanentIdentityFrozen, true);
assert.equal(INT_001_WAVE03_PERMANENT_ALLOCATION.learnerContentFrozen, false);
assert.equal(INT_001_WAVE03_PERMANENT_ALLOCATION.multilingualAuthorityFrozen, false);
assert.equal(INT_001_WAVE03_PERMANENT_ALLOCATION.questionStudioDiscoverable, false);
assert.equal(INT_001_WAVE03_PERMANENT_ALLOCATION.questionBankStatus, "NOT_STORED");
assert.equal(INT_001_WAVE03_PERMANENT_ALLOCATION.questionBankWritable, false);
assert.equal(INT_001_WAVE03_PERMANENT_ALLOCATION.testEligibility, "INELIGIBLE");
assert.equal(INT_001_WAVE03_PERMANENT_ALLOCATION.mockTestEligible, false);
assert.equal(INT_001_WAVE03_PERMANENT_ALLOCATION.publiclyPublishable, false);

const baselineSet = new Set(INT_001_FINAL_QL_IDS);
for (const qlId of INT_001_WAVE03_QL_IDS) {
  assert.equal(baselineSet.has(qlId), false, `${qlId}: Wave03 QL collides with the frozen 130-QL baseline`);
}
const combined = new Set([...INT_001_FINAL_QL_IDS, ...INT_001_WAVE03_QL_IDS]);
assert.equal(combined.size, 133, "Wave03 combined permanent QL authority must contain exactly 133 identities");
assert.equal(combined.has("INT-QL-094"), false, "Wave03 must not resurrect the intentional QL094 vacancy");

assert.deepEqual(INT_CP007_QL_CONTRACTS["INT-QL-110"], {
  title: "Difference between two scheme returns",
  givenUnknown: "common principal + two complete schemes -> maturity amount difference",
  answerSemantic: "MONEY_DIFFERENCE",
}, "QL134 ownership premise drifted: QL110 must remain the direct return-difference authority");
assert.deepEqual(INT_CP007_QL_CONTRACTS["INT-QL-115"], {
  title: "Missing present principal for equal future value",
  givenUnknown: "known present principal + two complete schemes -> other present principal",
  answerSemantic: "MISSING_PRINCIPAL",
}, "QL134 ownership premise drifted: QL115 must remain equal-future-value principal ownership");
assert.deepEqual(INT_CP010_FINAL_AUTHORITIES.map(({ permanentQlId }) => permanentQlId), ["INT-QL-130", "INT-QL-131"], "Wave03 must not mutate the frozen CP010 base authorities");

assert.equal(INT_001_WAVE03_AUTHORITY_CONTRACTS["INT-QL-132"].checkpointId, "INT-CP-010");
assert.equal(INT_001_WAVE03_AUTHORITY_CONTRACTS["INT-QL-132"].sourcePrototypeIds.length, 2);
assert.equal(INT_001_WAVE03_AUTHORITY_CONTRACTS["INT-QL-133"].checkpointId, "INT-CP-010");
assert.deepEqual(INT_001_WAVE03_AUTHORITY_CONTRACTS["INT-QL-133"].sourcePrototypeIds, ["INT-CP010-REOPEN-PROT-003"]);
assert.equal(INT_001_WAVE03_AUTHORITY_CONTRACTS["INT-QL-134"].checkpointId, "INT-CP-007");
assert.deepEqual(INT_001_WAVE03_AUTHORITY_CONTRACTS["INT-QL-134"].sourcePrototypeIds, ["INT-CP010-REOPEN-PROT-004"]);

let generatedStates = 0;
let deterministicChecks = 0;
let solverVerifierChecks = 0;
let deepFreezeChecks = 0;
let lifecycleChecks = 0;
const uniqueStatesByQl = new Map<string, Set<string>>();
const prototypesByQl = new Map<string, Set<string>>();

for (const qlId of INT_001_WAVE03_QL_IDS) {
  const signatures = new Set<string>();
  const prototypes = new Set<string>();
  for (let index = 0; index < 400; index += 1) {
    const seed = `INT-001-WAVE03:${qlId}:${index}`;
    const first = constructInt001Wave03PermanentState(qlId, seed);
    const second = constructInt001Wave03PermanentState(qlId, seed);
    assert.equal(stable(first), stable(second), `${qlId}/${seed}: deterministic permanent state drift`);
    deterministicChecks += 1;

    assert.equal(first.qlId, qlId, `${qlId}/${seed}: permanent QL identity drift`);
    assert.equal(first.checkpointId, INT_001_WAVE03_AUTHORITY_CONTRACTS[qlId].checkpointId, `${qlId}/${seed}: checkpoint ownership drift`);
    assert.equal((INT_001_WAVE03_AUTHORITY_CONTRACTS[qlId].sourcePrototypeIds as readonly string[]).includes(first.sourcePrototypeId), true, `${qlId}/${seed}: source prototype escaped authority mapping`);
    assert.equal(first.contractState.prototypeId, first.sourcePrototypeId, `${qlId}/${seed}: nested source identity drift`);
    assert.equal(first.answerSemantic, INT_001_WAVE03_AUTHORITY_CONTRACTS[qlId].answerSemantic, `${qlId}/${seed}: answer semantic drift`);

    const answer = solveInt001Wave03Permanent(first);
    assert.equal(verifyInt001Wave03PermanentAnswer(first, answer), true, `${qlId}/${seed}: independent verifier rejected solver answer`);
    solverVerifierChecks += 1;

    assertDeepFrozen(first, `${qlId}/${seed}`);
    deepFreezeChecks += 1;

    assert.equal(INT_001_WAVE03_PERMANENT_ALLOCATION.questionStudioDiscoverable, false);
    assert.equal(INT_001_WAVE03_PERMANENT_ALLOCATION.questionBankWritable, false);
    assert.equal(INT_001_WAVE03_PERMANENT_ALLOCATION.testEligible, false);
    assert.equal(INT_001_WAVE03_PERMANENT_ALLOCATION.mockTestEligible, false);
    assert.equal(INT_001_WAVE03_PERMANENT_ALLOCATION.publiclyPublishable, false);
    lifecycleChecks += 5;

    signatures.add(stable(first.contractState));
    prototypes.add(first.sourcePrototypeId);
    generatedStates += 1;
  }
  uniqueStatesByQl.set(qlId, signatures);
  prototypesByQl.set(qlId, prototypes);
}

assert.deepEqual([...prototypesByQl.get("INT-QL-132")!].sort(), ["INT-CP010-REOPEN-PROT-001", "INT-CP010-REOPEN-PROT-002"], "QL132 must exercise both stage orders/source directions");
assert.deepEqual([...prototypesByQl.get("INT-QL-133")!], ["INT-CP010-REOPEN-PROT-003"]);
assert.deepEqual([...prototypesByQl.get("INT-QL-134")!], ["INT-CP010-REOPEN-PROT-004"]);
assert.ok(uniqueStatesByQl.get("INT-QL-132")!.size >= 120, "QL132 permanent state diversity is too thin");
assert.ok(uniqueStatesByQl.get("INT-QL-133")!.size >= 90, "QL133 permanent state diversity is too thin");
assert.ok(uniqueStatesByQl.get("INT-QL-134")!.size >= 70, "QL134 permanent state diversity is too thin");
assert.equal(generatedStates, 1200, "Wave03 audit must exercise 1,200 permanent states");

console.log(JSON.stringify({
  version: INT_001_WAVE03_PERMANENT_ALLOCATION_VERSION,
  baselinePermanentQlCount: INT_001_PERMANENT_QL_COUNT,
  allocatedQls: INT_001_WAVE03_QL_IDS,
  resultingPermanentQlCount: INT_001_WAVE03_PERMANENT_ALLOCATION.resultingPermanentQlCount,
  intentionalVacancy: INT_001_WAVE03_PERMANENT_ALLOCATION.intentionalVacancy,
  nextFreeQl: INT_001_WAVE03_PERMANENT_ALLOCATION.nextFreeQl,
  generatedStates,
  deterministicChecks,
  solverVerifierChecks,
  deepFreezeChecks,
  lifecycleChecks,
  uniqueStatesByQl: Object.fromEntries([...uniqueStatesByQl].map(([qlId, values]) => [qlId, values.size])),
  prototypesByQl: Object.fromEntries([...prototypesByQl].map(([qlId, values]) => [qlId, [...values].sort()])),
  permanentIdentityFrozen: INT_001_WAVE03_PERMANENT_ALLOCATION.permanentIdentityFrozen,
  learnerContentFrozen: INT_001_WAVE03_PERMANENT_ALLOCATION.learnerContentFrozen,
  questionStudioDiscoverable: INT_001_WAVE03_PERMANENT_ALLOCATION.questionStudioDiscoverable,
  downstreamDeliveryOpened: false,
}, null, 2));
console.log("PASS_INT_001_WAVE03_PERMANENT_ALLOCATION_V1_AUDIT");
