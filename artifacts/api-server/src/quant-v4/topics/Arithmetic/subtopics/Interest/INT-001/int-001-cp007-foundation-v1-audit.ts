import {
  INT_CP007_DISCOVERY_DECISIONS,
  INT_CP007_PROTOTYPE_IDS,
  INT_CP007_RUNTIME_VERSION,
  answerSemanticForIntCp007Prototype,
  constructIntCp007PrototypeState,
  maturityAmount,
  schemeFactor,
  solveIntCp007Prototype,
  verifyIntCp007PrototypeAnswer,
  type IntCp007PrototypeState,
} from "./cp007-scheme-equivalence-runtime-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}

function displayableMoney(value: { numerator: bigint; denominator: bigint }): boolean {
  return value.numerator >= 0n && (value.numerator * 100n) % value.denominator === 0n;
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

function assertStateSpecificInvariants(state: IntCp007PrototypeState, answer: { numerator: bigint; denominator: bigint }, label: string): void {
  switch (state.prototypeId) {
    case "INT-CP007-PROT-001":
      assert(answer.denominator === 1n && (answer.numerator === 1n || answer.numerator === 2n), `${label}: invalid scheme selector`);
      break;
    case "INT-CP007-PROT-002":
      assert(displayableMoney(answer), `${label}: money difference is not displayable to paise`);
      assert(answer.numerator > 0n, `${label}: comparison difference must be positive`);
      break;
    case "INT-CP007-PROT-003": {
      const missingFactor = schemeFactor({ method: state.missingMethod, annualRatePercent: answer, years: state.missingYears });
      assert(stable(missingFactor) === stable(schemeFactor(state.knownScheme)), `${label}: equal-maturity inverse factor mismatch`);
      break;
    }
    case "INT-CP007-PROT-004":
      assert(displayableMoney(answer), `${label}: net gain is not displayable to paise`);
      assert(answer.numerator > 0n, `${label}: borrow/lend prototype must be a positive gain state`);
      break;
    case "INT-CP007-PROT-005":
    case "INT-CP007-PROT-006":
      assert(answer.numerator > 0n, `${label}: equivalent rate must be positive`);
      break;
    case "INT-CP007-PROT-007": {
      assert(displayableMoney(answer), `${label}: allocation component is not displayable to paise`);
      const other = { numerator: state.totalPrincipal.numerator * answer.denominator - answer.numerator * state.totalPrincipal.denominator, denominator: state.totalPrincipal.denominator * answer.denominator };
      assert(other.numerator > 0n, `${label}: second allocation component must be positive`);
      const futureA = maturityAmount(answer, state.schemeA);
      const futureB = maturityAmount({ numerator: other.numerator, denominator: other.denominator }, state.schemeB);
      assert(futureA.numerator * futureB.denominator === futureB.numerator * futureA.denominator, `${label}: future allocations are not equal`);
      break;
    }
    case "INT-CP007-PROT-008":
      assert(answer.numerator > 0n && answer.denominator > 0n, `${label}: principal ratio must be positive`);
      break;
    case "INT-CP007-PROT-009":
      assert(answer.denominator === 1n && answer.numerator >= 2n && answer.numerator <= BigInt(state.maximumYears), `${label}: overtake year outside bounded whole-year domain`);
      break;
  }
}

assert(INT_CP007_RUNTIME_VERSION === "INT-CP-007-DISCOVERY-v1", "CP007 runtime version drift");
assert(INT_CP007_PROTOTYPE_IDS.length === 9, "CP007 foundation must expose exactly nine temporary prototypes");
assert(INT_CP007_DISCOVERY_DECISIONS.standaloneEffectiveAnnualRateOwner === "INT-CP-004", "standalone EAR ownership drift");
assert(INT_CP007_DISCOVERY_DECISIONS.simpleOnlySplitLedgerOwner === "INT-CP-002", "simple split ownership drift");
assert(INT_CP007_DISCOVERY_DECISIONS.recurringEqualCashFlowsOwner === "INT-CP-008", "equal cash-flow ownership drift");
assert(INT_CP007_DISCOVERY_DECISIONS.heterogeneousDatedCashFlowsOwner === "INT-CP-009", "dated cash-flow ownership drift");
assert(INT_CP007_DISCOVERY_DECISIONS.inheritanceAtDifferentAges === "CONTEXT_VARIANT_OF_PROT_007", "inheritance context disposition drift");
assert(!INT_CP007_DISCOVERY_DECISIONS.intermediateCashFlowsAllowed, "CP007 must not admit intermediate cash flows");
assert(!INT_CP007_DISCOVERY_DECISIONS.permanentQlAllocationAuthorized, "foundation must not allocate permanent QLs");
assert(!INT_CP007_DISCOVERY_DECISIONS.learnerDeliveryAuthorized, "foundation must not open learner delivery");

let generatedStates = 0;
let deterministicChecks = 0;
let verifierChecks = 0;
let deepFreezeChecks = 0;
let stateInvariantChecks = 0;
const semanticCoverage = new Set<string>();
const stateCoverage = new Map<string, Set<string>>();
const schemeWinnerCoverage = new Set<string>();
const overtakeYearCoverage = new Set<string>();

for (const prototypeId of INT_CP007_PROTOTYPE_IDS) {
  const signatures = new Set<string>();
  for (let index = 0; index < 300; index += 1) {
    const seed = `int-cp007-foundation-${prototypeId}-${index}`;
    const state = constructIntCp007PrototypeState(prototypeId, seed);
    const replay = constructIntCp007PrototypeState(prototypeId, seed);
    assert(stable(state) === stable(replay), `${prototypeId}/${seed}: deterministic construction drift`);
    deterministicChecks += 1;

    assert(state.prototypeId === prototypeId, `${prototypeId}/${seed}: prototype identity drift`);
    assertDeepFrozen(state, `${prototypeId}/${seed}`);
    deepFreezeChecks += 1;

    const answer = solveIntCp007Prototype(state);
    assert(verifyIntCp007PrototypeAnswer(state, answer), `${prototypeId}/${seed}: solver answer rejected by independent verifier`);
    verifierChecks += 1;

    assertStateSpecificInvariants(state, answer, `${prototypeId}/${seed}`);
    stateInvariantChecks += 1;

    semanticCoverage.add(answerSemanticForIntCp007Prototype(prototypeId));
    signatures.add(stable(state));
    generatedStates += 1;

    if (prototypeId === "INT-CP007-PROT-001") schemeWinnerCoverage.add(answer.numerator.toString());
    if (prototypeId === "INT-CP007-PROT-009") overtakeYearCoverage.add(answer.numerator.toString());
  }
  stateCoverage.set(prototypeId, signatures);
  assert(signatures.size >= 3, `${prototypeId}: expected all curated foundation state families to be exercised`);
}

assert(semanticCoverage.size === 7, `expected seven answer-semantic classes, got ${semanticCoverage.size}`);
assert(schemeWinnerCoverage.has("1") && schemeWinnerCoverage.has("2"), "better-scheme prototype must cover both winners");
assert(overtakeYearCoverage.has("4") && overtakeYearCoverage.has("5"), "overtake prototype must cover both four- and five-year crossing states");

console.log(JSON.stringify({
  runtimeVersion: INT_CP007_RUNTIME_VERSION,
  prototypeCount: INT_CP007_PROTOTYPE_IDS.length,
  generatedStates,
  deterministicChecks,
  verifierChecks,
  deepFreezeChecks,
  stateInvariantChecks,
  semanticClasses: [...semanticCoverage].sort(),
  uniqueStateFamilies: Object.fromEntries([...stateCoverage.entries()].map(([id, values]) => [id, values.size])),
  schemeWinnerCoverage: [...schemeWinnerCoverage].sort(),
  overtakeYearCoverage: [...overtakeYearCoverage].sort(),
  permanentQlAllocationAuthorized: INT_CP007_DISCOVERY_DECISIONS.permanentQlAllocationAuthorized,
  learnerDeliveryAuthorized: INT_CP007_DISCOVERY_DECISIONS.learnerDeliveryAuthorized,
}, null, 2));
console.log("PASS_INT_CP007_FOUNDATION_V1_AUDIT");
