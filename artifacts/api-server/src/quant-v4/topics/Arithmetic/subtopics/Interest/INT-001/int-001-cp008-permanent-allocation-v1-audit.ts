import {
  INT_CP008_MERGED_DISCOVERY_CONTRACTS,
  INT_CP008_PERMANENT_ALLOCATION,
  INT_CP008_QL_CONTRACTS,
  INT_CP008_QL_IDS,
  INT_CP008_QL_TO_AUTHORITY_SLOT,
  INT_CP008_QL_TO_PROTOTYPE,
  INT_CP008_RUNTIME_VERSION,
  constructIntCp008State,
  solveIntCp008,
  verifyIntCp008Answer,
} from "./cp008-instalment-runtime-v1-final";
import {
  INT_CP008_AUTHORITY_GROUPS,
  INT_CP008_AUTHORITY_PROPOSAL_VERSION,
  INT_CP008_PROTOTYPE_TO_AUTHORITY_SLOT,
} from "./cp008-authority-proposal-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}

function assertDeepFrozen(value: unknown, label: string, seen = new WeakSet<object>()): void {
  if (typeof value !== "object" || value === null) return;
  const objectValue = value as object;
  if (seen.has(objectValue)) return;
  seen.add(objectValue);
  assert(Object.isFrozen(objectValue), `${label}: object is not frozen`);
  for (const property of Reflect.ownKeys(objectValue)) {
    assertDeepFrozen((objectValue as Record<PropertyKey, unknown>)[property], `${label}.${String(property)}`, seen);
  }
}

const EXPECTED_QLS = [
  "INT-QL-116",
  "INT-QL-117",
  "INT-QL-118",
  "INT-QL-119",
  "INT-QL-120",
  "INT-QL-121",
  "INT-QL-122",
  "INT-QL-123",
  "INT-QL-124",
] as const;

const EXPECTED_CANONICAL_PROTOTYPES = [
  "INT-CP008-PROT-001",
  "INT-CP008-PROT-002",
  "INT-CP008-PROT-003",
  "INT-CP008-PROT-004",
  "INT-CP008-PROT-005",
  "INT-CP008-PROT-007",
  "INT-CP008-PROT-008",
  "INT-CP008-PROT-010",
  "INT-CP008-PROT-011",
] as const;

const EXPECTED_SLOTS = [
  "CP008-A01",
  "CP008-A02",
  "CP008-A03",
  "CP008-A04",
  "CP008-A05",
  "CP008-A06",
  "CP008-A07",
  "CP008-A08",
  "CP008-A09",
] as const;

const MERGED_PROTOTYPES = ["INT-CP008-PROT-006", "INT-CP008-PROT-009"] as const;

assert(INT_CP008_RUNTIME_VERSION === "INT-CP-008-v1-permanent-allocation", "CP008 permanent runtime version drift");
assert(INT_CP008_AUTHORITY_PROPOSAL_VERSION === "INT-CP-008-AUTHORITY-PROPOSAL-v1", "CP008 proposal version drift");
assert(stable(INT_CP008_QL_IDS) === stable(EXPECTED_QLS), "CP008 allocation must be exactly INT-QL-116..124");
assert(INT_CP008_QL_IDS.length === 9, "CP008 must allocate exactly nine permanent QLs");
assert(INT_CP008_AUTHORITY_GROUPS.length === 9, "CP008 authority proposal must contain nine groups");
assert(INT_CP008_PERMANENT_ALLOCATION.qlCount === 9, "CP008 allocation count drift");
assert(INT_CP008_PERMANENT_ALLOCATION.firstQlId === "INT-QL-116", "CP008 first QL drift");
assert(INT_CP008_PERMANENT_ALLOCATION.lastQlId === "INT-QL-124", "CP008 last QL drift");
assert(INT_CP008_PERMANENT_ALLOCATION.nextFreeQlId === "INT-QL-125", "CP008 next-free QL drift");
assert(INT_CP008_PERMANENT_ALLOCATION.sourceMaterialGaps === 0, "CP008 allocation opened before source saturation");
assert(INT_CP008_PERMANENT_ALLOCATION.mergedDiscoveryContracts === 2, "CP008 merged discovery count drift");
assert(INT_CP008_PERMANENT_ALLOCATION.approvalAuthority === "PRODUCT_OWNER_APPROVED_CP008_9_AUTHORITY_STRUCTURE_2026_08_20", "CP008 approval authority drift");
assert(INT_CP008_PERMANENT_ALLOCATION.proposalExactHead === "9d6e6f5cf414ccd5c4f4127bb4bcd8752cf3efe1", "CP008 proposal head drift");
assert(INT_CP008_PERMANENT_ALLOCATION.proposalRun === 32327721843, "CP008 proposal run drift");
assert(INT_CP008_PERMANENT_ALLOCATION.proposalArtifact === 9391955740, "CP008 proposal artifact drift");
assert(INT_CP008_PERMANENT_ALLOCATION.proposalArtifactDigest === "sha256:30434d1a1d7d5b6a163870d2b741ced9639d8e0e74891b723ea0db021ce9ab55", "CP008 proposal digest drift");
assert(INT_CP008_PERMANENT_ALLOCATION.permanentIdentityFrozen, "CP008 permanent identity must freeze at allocation");
assert(!INT_CP008_PERMANENT_ALLOCATION.learnerContentFrozen, "CP008 learner content must remain open for English authoring");
assert(!INT_CP008_PERMANENT_ALLOCATION.enabled, "CP008 runtime enabled during allocation");
assert(INT_CP008_PERMANENT_ALLOCATION.stagingStatus === "NOT_STAGED", "CP008 staging opened during allocation");
assert(INT_CP008_PERMANENT_ALLOCATION.registrationStatus === "NOT_REGISTERED", "CP008 registration opened during allocation");
assert(!INT_CP008_PERMANENT_ALLOCATION.questionStudioDiscoverable, "CP008 Question Studio opened during allocation");
assert(INT_CP008_PERMANENT_ALLOCATION.questionBankStatus === "NOT_STORED", "CP008 Question Bank opened during allocation");
assert(!INT_CP008_PERMANENT_ALLOCATION.questionBankWritable, "CP008 Question Bank write opened during allocation");
assert(INT_CP008_PERMANENT_ALLOCATION.testEligibility === "INELIGIBLE", "CP008 tests opened during allocation");
assert(!INT_CP008_PERMANENT_ALLOCATION.publiclyPublishable, "CP008 public delivery opened during allocation");

const mappedPrototypes = INT_CP008_QL_IDS.map((qlId) => INT_CP008_QL_TO_PROTOTYPE[qlId]);
const mappedSlots = INT_CP008_QL_IDS.map((qlId) => INT_CP008_QL_TO_AUTHORITY_SLOT[qlId]);
assert(stable(mappedPrototypes) === stable(EXPECTED_CANONICAL_PROTOTYPES), "CP008 QL-to-prototype mapping drift");
assert(stable(mappedSlots) === stable(EXPECTED_SLOTS), "CP008 QL-to-authority-slot mapping drift");
assert(new Set(mappedPrototypes).size === 9, "CP008 canonical prototype mapping must be one-to-one");
assert(new Set(mappedSlots).size === 9, "CP008 permanent authority-slot coverage must be one-to-one");

for (const qlId of INT_CP008_QL_IDS) {
  const prototypeId = INT_CP008_QL_TO_PROTOTYPE[qlId];
  const slot = INT_CP008_QL_TO_AUTHORITY_SLOT[qlId];
  assert(INT_CP008_PROTOTYPE_TO_AUTHORITY_SLOT[prototypeId] === slot, `${qlId}: proposal slot mapping drift`);
  assert(INT_CP008_QL_CONTRACTS[qlId].title.length > 0, `${qlId}: empty contract title`);
  assert(INT_CP008_QL_CONTRACTS[qlId].givenUnknown.includes("->"), `${qlId}: given/unknown contract is not explicit`);
}

for (const merged of MERGED_PROTOTYPES) {
  assert(!mappedPrototypes.includes(merged as never), `${merged}: merged prototype leaked into canonical permanent mapping`);
  assert(merged in INT_CP008_MERGED_DISCOVERY_CONTRACTS, `${merged}: merged disposition missing`);
  const permanent = INT_CP008_MERGED_DISCOVERY_CONTRACTS[merged];
  assert(INT_CP008_QL_IDS.includes(permanent.permanentQlId), `${merged}: merged prototype points outside CP008 allocation`);
  assert(INT_CP008_PROTOTYPE_TO_AUTHORITY_SLOT[merged] === permanent.authoritySlot, `${merged}: merged proposal slot drift`);
}

let generatedStates = 0;
let deterministicChecks = 0;
let solverVerifierChecks = 0;
let identityChecks = 0;
let deepFreezeChecks = 0;
let lifecycleChecks = 0;
const semanticCoverage = new Set<string>();
const slotCoverage = new Set<string>();
const familyCoverage = new Map<string, Set<string>>();
const periodUnitCoverage = new Map<string, Set<string>>();

for (const qlId of INT_CP008_QL_IDS) {
  const signatures = new Set<string>();
  const periodUnits = new Set<string>();
  for (let index = 0; index < 300; index += 1) {
    const seed = `int-cp008-allocation-${qlId}-${index}`;
    const state = constructIntCp008State(qlId, seed);
    const replay = constructIntCp008State(qlId, seed);
    assert(stable(state) === stable(replay), `${qlId}/${seed}: deterministic state drift`);
    deterministicChecks += 1;

    assert(state.checkpointId === "INT-CP-008", `${qlId}/${seed}: checkpoint drift`);
    assert(state.qlId === qlId, `${qlId}/${seed}: permanent QL identity drift`);
    assert(state.sourcePrototypeId === INT_CP008_QL_TO_PROTOTYPE[qlId], `${qlId}/${seed}: source prototype drift`);
    assert(state.authoritySlot === INT_CP008_QL_TO_AUTHORITY_SLOT[qlId], `${qlId}/${seed}: authority slot drift`);
    assert(state.contractState.prototypeId === state.sourcePrototypeId, `${qlId}/${seed}: nested prototype drift`);
    assert(state.answerSemantic === INT_CP008_QL_CONTRACTS[qlId].answerSemantic, `${qlId}/${seed}: answer semantic drift`);
    identityChecks += 6;

    const answer = solveIntCp008(state);
    assert(verifyIntCp008Answer(state, answer), `${qlId}/${seed}: independent verifier rejected permanent solver answer`);
    solverVerifierChecks += 1;

    assertDeepFrozen(state, `${qlId}/${seed}`);
    deepFreezeChecks += 1;

    assert(!INT_CP008_PERMANENT_ALLOCATION.enabled, `${qlId}/${seed}: enabled opened`);
    assert(INT_CP008_PERMANENT_ALLOCATION.stagingStatus === "NOT_STAGED", `${qlId}/${seed}: staging opened`);
    assert(INT_CP008_PERMANENT_ALLOCATION.registrationStatus === "NOT_REGISTERED", `${qlId}/${seed}: registration opened`);
    assert(!INT_CP008_PERMANENT_ALLOCATION.questionStudioDiscoverable, `${qlId}/${seed}: Question Studio opened`);
    assert(INT_CP008_PERMANENT_ALLOCATION.questionBankStatus === "NOT_STORED", `${qlId}/${seed}: Question Bank opened`);
    assert(!INT_CP008_PERMANENT_ALLOCATION.questionBankWritable, `${qlId}/${seed}: Question Bank write opened`);
    assert(INT_CP008_PERMANENT_ALLOCATION.testEligibility === "INELIGIBLE", `${qlId}/${seed}: tests opened`);
    assert(!INT_CP008_PERMANENT_ALLOCATION.publiclyPublishable, `${qlId}/${seed}: public delivery opened`);
    lifecycleChecks += 8;

    semanticCoverage.add(state.answerSemantic);
    slotCoverage.add(state.authoritySlot);
    signatures.add(stable(state.contractState));
    if ("periodUnit" in state.contractState) periodUnits.add(state.contractState.periodUnit);
    generatedStates += 1;
  }
  familyCoverage.set(qlId, signatures);
  periodUnitCoverage.set(qlId, periodUnits);
  assert(signatures.size >= 20, `${qlId}: permanent state pool is too thin`);
  assert(periodUnits.size === 2, `${qlId}: annual/half-yearly coverage is incomplete`);
}

assert(generatedStates === 2700, `CP008 expected 2700 permanent allocation states, got ${generatedStates}`);
assert(slotCoverage.size === 9, `CP008 expected all nine permanent authority slots, got ${slotCoverage.size}`);
assert(semanticCoverage.size === 8, `CP008 expected eight answer semantics across nine QLs, got ${semanticCoverage.size}`);

console.log(JSON.stringify({
  runtimeVersion: INT_CP008_RUNTIME_VERSION,
  approvalAuthority: INT_CP008_PERMANENT_ALLOCATION.approvalAuthority,
  permanentQls: INT_CP008_QL_IDS,
  qlCount: INT_CP008_QL_IDS.length,
  nextFreeQlId: INT_CP008_PERMANENT_ALLOCATION.nextFreeQlId,
  generatedStates,
  deterministicChecks,
  solverVerifierChecks,
  identityChecks,
  deepFreezeChecks,
  lifecycleChecks,
  semanticCoverage: [...semanticCoverage].sort(),
  authoritySlotCoverage: [...slotCoverage].sort(),
  uniqueStateFamilies: Object.fromEntries([...familyCoverage.entries()].map(([qlId, values]) => [qlId, values.size])),
  periodUnitCoverage: Object.fromEntries([...periodUnitCoverage.entries()].map(([qlId, values]) => [qlId, [...values].sort()])),
  mergedDiscoveryPrototypesExcluded: MERGED_PROTOTYPES.length,
  sourceMaterialGaps: INT_CP008_PERMANENT_ALLOCATION.sourceMaterialGaps,
  permanentIdentityFrozen: INT_CP008_PERMANENT_ALLOCATION.permanentIdentityFrozen,
  learnerContentFrozen: INT_CP008_PERMANENT_ALLOCATION.learnerContentFrozen,
  learnerDeliveryAuthorized: false,
}, null, 2));
console.log("PASS_INT_CP008_PERMANENT_ALLOCATION_V1_AUDIT");
