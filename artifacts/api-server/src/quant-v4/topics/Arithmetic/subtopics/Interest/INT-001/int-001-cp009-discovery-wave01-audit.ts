import {
  INT_CP009_DISCOVERY_VERSION,
  INT_CP009_MANDATORY_SOURCE_DIRECTIONS,
  INT_CP009_PROTOTYPE_IDS,
  INT_CP009_RATE_LIBRARY,
  buildIntCp009DiscoveryPackage,
  solveIntCp009Prototype,
  verifyIntCp009PrototypeAnswer,
  type IntCp009DatedFlow,
  type IntCp009PrototypeState,
} from "./cp009-dated-cash-flow-discovery-v1";
import { eq, type Rational } from "./cp003-exam-model";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `${current}n` : current);
}

function rationalKey(value: Rational): string {
  return `${value.numerator}/${value.denominator}`;
}

function flowsFor(state: IntCp009PrototypeState): readonly IntCp009DatedFlow[] {
  switch (state.prototypeId) {
    case "INT-CP009-PROT-001": return state.deposits;
    case "INT-CP009-PROT-002": return state.repayments;
    case "INT-CP009-PROT-003": return state.repayments;
    case "INT-CP009-PROT-004": return state.repayments;
    case "INT-CP009-PROT-005": return state.knownRepayments;
    case "INT-CP009-PROT-006": return state.deposits;
    case "INT-CP009-PROT-007": return state.repayments;
    case "INT-CP009-PROT-008": return state.repayments;
  }
}

const mandatoryOwnership = Object.freeze({
  DEPOSITS_ON_DIFFERENT_DATES: Object.freeze(["INT-CP009-PROT-001", "INT-CP009-PROT-006"] as const),
  UNEQUAL_REPAYMENTS: Object.freeze(["INT-CP009-PROT-002", "INT-CP009-PROT-004", "INT-CP009-PROT-005", "INT-CP009-PROT-007", "INT-CP009-PROT-008"] as const),
  CHANGED_MIDDLE_PAYMENT: Object.freeze(["INT-CP009-PROT-003"] as const),
});

assert(INT_CP009_DISCOVERY_VERSION === "INT-CP-009-DATED-CASH-FLOW-DISCOVERY-WAVE01-v1", "CP009 discovery version drifted");
assert(INT_CP009_PROTOTYPE_IDS.length === 8, "CP009 Wave01 prototype count drifted");
assert(INT_CP009_MANDATORY_SOURCE_DIRECTIONS.length === 3, "CP009 mandatory source direction count drifted");
for (const direction of INT_CP009_MANDATORY_SOURCE_DIRECTIONS) {
  assert(mandatoryOwnership[direction].length > 0, `${direction}: no executable prototype ownership`);
}

const stemCoverage = new Map<string, Set<string>>();
const semanticCoverage = new Set<string>();
const stateFingerprints = new Map<string, Set<string>>();
const answerPositions = [0, 0, 0, 0];
let packages = 0;
let deterministicChecks = 0;
let solverVerifierChecks = 0;
let optionChecks = 0;
let lifecycleChecks = 0;
let heterogeneityChecks = 0;
let sourceOwnershipChecks = 0;
let inverseRateChecks = 0;
let presentationChecks = 0;
let deepFreezeChecks = 0;

for (const prototypeId of INT_CP009_PROTOTYPE_IDS) {
  stemCoverage.set(prototypeId, new Set());
  stateFingerprints.set(prototypeId, new Set());
  for (let index = 0; index < 120; index += 1) {
    const seed = `int-cp009-wave01:${prototypeId}:${index}`;
    const first = buildIntCp009DiscoveryPackage(prototypeId, seed);
    const replay = buildIntCp009DiscoveryPackage(prototypeId, seed);
    packages += 1;

    assert(stable(first) === stable(replay), `${prototypeId}/${seed}: deterministic replay drift`);
    deterministicChecks += 1;

    const solved = solveIntCp009Prototype(first.mathematicalState);
    assert(eq(solved, first.answer), `${prototypeId}/${seed}: packaged answer drifted from canonical solver`);
    assert(verifyIntCp009PrototypeAnswer(first.mathematicalState, first.answer), `${prototypeId}/${seed}: independent verifier rejected canonical answer`);
    solverVerifierChecks += 2;

    const optionKeys = first.options.map((option) => rationalKey(option.value));
    assert(new Set(optionKeys).size === 4, `${prototypeId}/${seed}: options are not four distinct values`);
    assert(first.options.filter((option) => eq(option.value, first.answer)).length === 1, `${prototypeId}/${seed}: correct option multiplicity drift`);
    assert(first.correctIndex >= 0 && first.correctIndex < 4, `${prototypeId}/${seed}: invalid correct index`);
    assert(first.correctAnswer === first.options[first.correctIndex]!.text, `${prototypeId}/${seed}: correct-answer text ownership drift`);
    optionChecks += 4;
    answerPositions[first.correctIndex] += 1;

    assert(first.permanentQlId === null, `${prototypeId}/${seed}: permanent QL leaked during discovery`);
    assert(first.lifecycle.enabled === false, `${prototypeId}/${seed}: runtime unexpectedly enabled`);
    assert(first.lifecycle.stagingStatus === "NOT_STAGED", `${prototypeId}/${seed}: staging gate opened`);
    assert(first.lifecycle.registrationStatus === "NOT_REGISTERED", `${prototypeId}/${seed}: registration gate opened`);
    assert(first.lifecycle.questionStudioDiscoverable === false, `${prototypeId}/${seed}: Question Studio gate opened`);
    assert(first.lifecycle.questionBankStatus === "NOT_STORED", `${prototypeId}/${seed}: Question Bank state opened`);
    assert(first.lifecycle.questionBankWritable === false, `${prototypeId}/${seed}: Question Bank write gate opened`);
    assert(first.lifecycle.testEligibility === "INELIGIBLE", `${prototypeId}/${seed}: test gate opened`);
    assert(first.lifecycle.publiclyPublishable === false, `${prototypeId}/${seed}: public gate opened`);
    lifecycleChecks += 9;

    const flows = flowsFor(first.mathematicalState);
    assert(flows.length >= 2, `${prototypeId}/${seed}: heterogeneous prototype has fewer than two visible flows`);
    assert(new Set(flows.map((flow) => rationalKey(flow.amount))).size >= 2, `${prototypeId}/${seed}: visible flows are not heterogeneous`);
    assert(new Set(flows.map((flow) => flow.atPeriod)).size === flows.length, `${prototypeId}/${seed}: duplicate timing collapsed dated-flow evidence`);
    heterogeneityChecks += 3;

    if (prototypeId === "INT-CP009-PROT-001" || prototypeId === "INT-CP009-PROT-006") {
      assert(flows.every((flow) => flow.direction === "DEPOSIT"), `${prototypeId}/${seed}: deposit family has repayment flow`);
      sourceOwnershipChecks += 1;
    } else {
      assert(flows.every((flow) => flow.direction === "REPAYMENT"), `${prototypeId}/${seed}: repayment family has deposit flow`);
      sourceOwnershipChecks += 1;
    }

    if (prototypeId === "INT-CP009-PROT-003") {
      const state = first.mathematicalState;
      assert(state.prototypeId === "INT-CP009-PROT-003", `${prototypeId}/${seed}: narrowing failure`);
      assert(state.missingAtPeriod > 1, `${prototypeId}/${seed}: changed payment is not a middle payment`);
      const maximumKnownPeriod = Math.max(...state.repayments.map((flow) => flow.atPeriod));
      assert(state.missingAtPeriod <= maximumKnownPeriod, `${prototypeId}/${seed}: changed payment escaped the active schedule`);
      sourceOwnershipChecks += 2;
    }

    if (prototypeId === "INT-CP009-PROT-007") {
      assert(INT_CP009_RATE_LIBRARY.some((rate) => eq(rate, first.answer)), `${prototypeId}/${seed}: inverse returned rate outside bounded library`);
      const matchingRates = INT_CP009_RATE_LIBRARY.filter((rate) => verifyIntCp009PrototypeAnswer(first.mathematicalState, rate));
      assert(matchingRates.length === 1, `${prototypeId}/${seed}: rate inverse is not unique`);
      inverseRateChecks += 2;
    }

    assert(first.presentation.prompt.length >= 90, `${prototypeId}/${seed}: discovery prompt too thin`);
    assert(!/(?:undefined|null|NaN)/u.test(first.presentation.prompt), `${prototypeId}/${seed}: invalid placeholder in prompt`);
    assert(first.explanation.steps.length === 4, `${prototypeId}/${seed}: explanation does not expose four decisive steps`);
    assert(first.explanation.finalAnswer === first.correctAnswer, `${prototypeId}/${seed}: explanation final answer drift`);
    presentationChecks += 4;

    assert(Object.isFrozen(first), `${prototypeId}/${seed}: package not frozen`);
    assert(Object.isFrozen(first.mathematicalState), `${prototypeId}/${seed}: state not frozen`);
    assert(Object.isFrozen(first.options), `${prototypeId}/${seed}: options not frozen`);
    assert(Object.isFrozen(first.explanation), `${prototypeId}/${seed}: explanation not frozen`);
    assert(Object.isFrozen(first.lifecycle), `${prototypeId}/${seed}: lifecycle not frozen`);
    deepFreezeChecks += 5;

    stemCoverage.get(prototypeId)!.add(first.presentation.stemFamilyId);
    semanticCoverage.add(first.answerSemantic);
    stateFingerprints.get(prototypeId)!.add(stable(first.mathematicalState));
  }
}

for (const prototypeId of INT_CP009_PROTOTYPE_IDS) {
  assert(stemCoverage.get(prototypeId)!.size === 3, `${prototypeId}: expected all three temporary stem families`);
  assert(stateFingerprints.get(prototypeId)!.size >= 20, `${prototypeId}: mathematical state pool is too thin`);
}
assert(semanticCoverage.size === 8, `CP009 answer-semantic coverage drifted: ${semanticCoverage.size}`);
assert(packages === 960, `CP009 expected 960 discovery packages, got ${packages}`);
assert(answerPositions.every((count) => count > 150), `CP009 answer positions are badly imbalanced: ${answerPositions.join("/")}`);

console.log(JSON.stringify({
  discoveryVersion: INT_CP009_DISCOVERY_VERSION,
  prototypes: INT_CP009_PROTOTYPE_IDS.length,
  mandatorySourceDirections: INT_CP009_MANDATORY_SOURCE_DIRECTIONS,
  packages,
  deterministicChecks,
  solverVerifierChecks,
  optionChecks,
  lifecycleChecks,
  heterogeneityChecks,
  sourceOwnershipChecks,
  inverseRateChecks,
  presentationChecks,
  deepFreezeChecks,
  answerSemanticCoverage: semanticCoverage.size,
  stemFamilyCoverage: Object.fromEntries([...stemCoverage].map(([key, value]) => [key, value.size])),
  uniqueStateCounts: Object.fromEntries([...stateFingerprints].map(([key, value]) => [key, value.size])),
  answerPositions,
  permanentQlCount: 0,
  nextPotentialQlIdentity: "INT-QL-125",
  nextPotentialQlIdentityReserved: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_INT_CP009_DISCOVERY_WAVE01_AUDIT");
