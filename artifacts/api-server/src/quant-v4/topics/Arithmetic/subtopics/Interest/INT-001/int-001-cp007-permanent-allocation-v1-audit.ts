import {
  INT_CP007_MERGED_DISCOVERY_CONTRACTS,
  INT_CP007_PERMANENT_ALLOCATION,
  INT_CP007_QL_CONTRACTS,
  INT_CP007_QL_IDS,
  INT_CP007_QL_TO_PROTOTYPE,
  INT_CP007_RUNTIME_VERSION,
  constructIntCp007State,
  solveIntCp007,
  verifyIntCp007Answer,
} from "./cp007-scheme-equivalence-runtime-v3-final";

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

const EXPECTED_QLS = ["INT-QL-109", "INT-QL-110", "INT-QL-111", "INT-QL-112", "INT-QL-113", "INT-QL-114", "INT-QL-115"] as const;
const EXPECTED_PROTOTYPES = [
  "INT-CP007-PROT-001",
  "INT-CP007-PROT-002",
  "INT-CP007-PROT-003",
  "INT-CP007-PROT-007",
  "INT-CP007-PROT-008",
  "INT-CP007-PROT-009",
  "INT-CP007-PROT-010",
] as const;
const MERGED_PROTOTYPES = ["INT-CP007-PROT-004", "INT-CP007-PROT-005", "INT-CP007-PROT-006"] as const;

assert(INT_CP007_RUNTIME_VERSION === "INT-CP-007-v3-permanent-allocation", "CP007 permanent runtime version drift");
assert(stable(INT_CP007_QL_IDS) === stable(EXPECTED_QLS), "CP007 QL allocation must be exactly INT-QL-109..115");
assert(INT_CP007_QL_IDS.length === 7, "CP007 must allocate exactly seven permanent QLs");
assert(INT_CP007_PERMANENT_ALLOCATION.firstQlId === "INT-QL-109", "CP007 first QL drift");
assert(INT_CP007_PERMANENT_ALLOCATION.lastQlId === "INT-QL-115", "CP007 last QL drift");
assert(INT_CP007_PERMANENT_ALLOCATION.meaningfulUnclassifiedSourceDirections === 0, "CP007 permanent allocation opened before saturation");
assert(INT_CP007_PERMANENT_ALLOCATION.mergedDiscoveryContracts === 3, "CP007 merged-contract count drift");
assert(INT_CP007_PERMANENT_ALLOCATION.permanentIdentityFrozen, "CP007 permanent identity must be frozen at allocation");
assert(!INT_CP007_PERMANENT_ALLOCATION.learnerContentFrozen, "CP007 learner content must remain open for English authoring");
assert(!INT_CP007_PERMANENT_ALLOCATION.enabled, "CP007 delivery enabled during allocation");
assert(INT_CP007_PERMANENT_ALLOCATION.stagingStatus === "NOT_STAGED", "CP007 staging opened during allocation");
assert(INT_CP007_PERMANENT_ALLOCATION.registrationStatus === "NOT_REGISTERED", "CP007 registration opened during allocation");
assert(!INT_CP007_PERMANENT_ALLOCATION.questionStudioDiscoverable, "CP007 Question Studio opened during allocation");
assert(INT_CP007_PERMANENT_ALLOCATION.questionBankStatus === "NOT_STORED", "CP007 Question Bank opened during allocation");
assert(INT_CP007_PERMANENT_ALLOCATION.testEligibility === "INELIGIBLE", "CP007 tests opened during allocation");
assert(!INT_CP007_PERMANENT_ALLOCATION.publiclyPublishable, "CP007 public delivery opened during allocation");

const mappedPrototypes = INT_CP007_QL_IDS.map((qlId) => INT_CP007_QL_TO_PROTOTYPE[qlId]);
assert(stable(mappedPrototypes) === stable(EXPECTED_PROTOTYPES), "CP007 QL-to-prototype mapping drift");
assert(new Set(mappedPrototypes).size === 7, "CP007 retained prototype mapping must be one-to-one");
for (const merged of MERGED_PROTOTYPES) {
  assert(!mappedPrototypes.includes(merged as never), `${merged}: merged discovery prototype leaked into permanent allocation`);
  assert(merged in INT_CP007_MERGED_DISCOVERY_CONTRACTS, `${merged}: merged discovery disposition missing`);
}

let generatedStates = 0;
let deterministicChecks = 0;
let solverVerifierChecks = 0;
let identityChecks = 0;
let deepFreezeChecks = 0;
let lifecycleChecks = 0;
const semanticCoverage = new Set<string>();
const familyCoverage = new Map<string, Set<string>>();

for (const qlId of INT_CP007_QL_IDS) {
  const signatures = new Set<string>();
  for (let index = 0; index < 300; index += 1) {
    const seed = `int-cp007-allocation-${qlId}-${index}`;
    const state = constructIntCp007State(qlId, seed);
    const replay = constructIntCp007State(qlId, seed);
    assert(stable(state) === stable(replay), `${qlId}/${seed}: deterministic state drift`);
    deterministicChecks += 1;

    assert(state.checkpointId === "INT-CP-007", `${qlId}/${seed}: checkpoint drift`);
    assert(state.qlId === qlId, `${qlId}/${seed}: permanent QL identity drift`);
    assert(state.sourcePrototypeId === INT_CP007_QL_TO_PROTOTYPE[qlId], `${qlId}/${seed}: source prototype drift`);
    assert(state.contractState.prototypeId === state.sourcePrototypeId, `${qlId}/${seed}: nested prototype drift`);
    assert(state.answerSemantic === INT_CP007_QL_CONTRACTS[qlId].answerSemantic, `${qlId}/${seed}: answer semantic drift`);
    identityChecks += 5;

    const answer = solveIntCp007(state);
    assert(verifyIntCp007Answer(state, answer), `${qlId}/${seed}: independent verifier rejected permanent solver answer`);
    solverVerifierChecks += 1;

    assertDeepFrozen(state, `${qlId}/${seed}`);
    deepFreezeChecks += 1;

    assert(!INT_CP007_PERMANENT_ALLOCATION.enabled, `${qlId}/${seed}: enabled opened`);
    assert(INT_CP007_PERMANENT_ALLOCATION.stagingStatus === "NOT_STAGED", `${qlId}/${seed}: staging opened`);
    assert(INT_CP007_PERMANENT_ALLOCATION.registrationStatus === "NOT_REGISTERED", `${qlId}/${seed}: registration opened`);
    assert(!INT_CP007_PERMANENT_ALLOCATION.questionStudioDiscoverable, `${qlId}/${seed}: Question Studio opened`);
    assert(INT_CP007_PERMANENT_ALLOCATION.questionBankStatus === "NOT_STORED", `${qlId}/${seed}: Question Bank opened`);
    assert(INT_CP007_PERMANENT_ALLOCATION.testEligibility === "INELIGIBLE", `${qlId}/${seed}: test eligibility opened`);
    assert(!INT_CP007_PERMANENT_ALLOCATION.publiclyPublishable, `${qlId}/${seed}: public delivery opened`);
    lifecycleChecks += 7;

    semanticCoverage.add(state.answerSemantic);
    signatures.add(stable(state.contractState));
    generatedStates += 1;
  }
  familyCoverage.set(qlId, signatures);
  const minimumFamilies = qlId === "INT-QL-111" ? 4 : 3;
  assert(signatures.size >= minimumFamilies, `${qlId}: insufficient permanent state-family coverage`);
}

assert(semanticCoverage.size === 7, `CP007 expected seven distinct permanent answer semantics, got ${semanticCoverage.size}`);
assert(generatedStates === 2100, `CP007 expected 2100 allocation states, got ${generatedStates}`);

console.log(JSON.stringify({
  runtimeVersion: INT_CP007_RUNTIME_VERSION,
  permanentQls: INT_CP007_QL_IDS,
  qlCount: INT_CP007_QL_IDS.length,
  generatedStates,
  deterministicChecks,
  solverVerifierChecks,
  identityChecks,
  deepFreezeChecks,
  lifecycleChecks,
  semanticCoverage: [...semanticCoverage].sort(),
  uniqueStateFamilies: Object.fromEntries([...familyCoverage.entries()].map(([qlId, values]) => [qlId, values.size])),
  mergedDiscoveryPrototypesExcluded: MERGED_PROTOTYPES.length,
  permanentIdentityFrozen: INT_CP007_PERMANENT_ALLOCATION.permanentIdentityFrozen,
  learnerContentFrozen: INT_CP007_PERMANENT_ALLOCATION.learnerContentFrozen,
  learnerDeliveryAuthorized: false,
}, null, 2));
console.log("PASS_INT_CP007_PERMANENT_ALLOCATION_V1_AUDIT");
