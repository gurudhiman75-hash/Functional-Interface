import {
  INT_CP009_EXAM_READY_VERSION,
  INT_CP009_PROTOTYPE_IDS,
  INT_CP009_RATE_LIBRARY,
  buildIntCp009ExamReadyDiscoveryPackage,
  solveIntCp009Prototype,
  verifyIntCp009PrototypeAnswer,
  type IntCp009DatedFlow,
  type IntCp009PrototypeState,
} from "./cp009-dated-cash-flow-exam-ready-v2";
import { eq, type Rational } from "./cp003-exam-model";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function stable(value: unknown): string {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `${current}n` : current);
}
function rationalKey(value: Rational): string { return `${value.numerator}/${value.denominator}`; }
function rupeesFromText(text: string): number[] {
  return [...text.matchAll(/₹([\d,]+)(?:\.\d{1,2})?/gu)].map((match) => Number(match[1]!.replaceAll(",", "")));
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
function openingDebtFor(state: IntCp009PrototypeState): Rational | null {
  switch (state.prototypeId) {
    case "INT-CP009-PROT-003":
    case "INT-CP009-PROT-004":
    case "INT-CP009-PROT-005":
    case "INT-CP009-PROT-007": return state.openingDebt;
    default: return null;
  }
}

assert(INT_CP009_EXAM_READY_VERSION === "INT-CP-009-DATED-CASH-FLOW-EXAM-READY-v2", "CP009 exam-ready version drifted");
assert(INT_CP009_PROTOTYPE_IDS.length === 8, "CP009 prototype count drifted");
assert(INT_CP009_RATE_LIBRARY.length === 3, "CP009 rate library drifted");

const answerPositions = [0, 0, 0, 0];
const stemCoverage = new Map<string, Set<string>>();
const promptSets = new Map<string, Set<string>>();
const stateSets = new Map<string, Set<string>>();
let questions = 0;
let deterministicChecks = 0;
let solverVerifierChecks = 0;
let optionChecks = 0;
let realismChecks = 0;
let editorialChecks = 0;
let explanationChecks = 0;
let lifecycleChecks = 0;
let deepFreezeChecks = 0;

for (const prototypeId of INT_CP009_PROTOTYPE_IDS) {
  stemCoverage.set(prototypeId, new Set());
  promptSets.set(prototypeId, new Set());
  stateSets.set(prototypeId, new Set());
  for (let index = 0; index < 120; index += 1) {
    const seed = `int-cp009-exam-v2:${prototypeId}:${index}`;
    const q = buildIntCp009ExamReadyDiscoveryPackage(prototypeId, seed);
    const replay = buildIntCp009ExamReadyDiscoveryPackage(prototypeId, seed);
    questions += 1;

    assert(stable(q) === stable(replay), `${prototypeId}/${seed}: nondeterministic exam-ready replay`);
    deterministicChecks += 1;
    assert(eq(solveIntCp009Prototype(q.mathematicalState), q.answer), `${prototypeId}/${seed}: canonical solver drift`);
    assert(verifyIntCp009PrototypeAnswer(q.mathematicalState, q.answer), `${prototypeId}/${seed}: independent verifier drift`);
    solverVerifierChecks += 2;

    assert(q.options.length === 4, `${prototypeId}/${seed}: option count drift`);
    assert(new Set(q.options.map((option) => rationalKey(option.value))).size === 4, `${prototypeId}/${seed}: duplicate option values`);
    assert(q.options.filter((option) => eq(option.value, q.answer)).length === 1, `${prototypeId}/${seed}: correct option multiplicity drift`);
    assert(q.correctIndex === index % 4, `${prototypeId}/${seed}: answer-position balance drift`);
    assert(q.correctAnswer === q.options[q.correctIndex]!.text, `${prototypeId}/${seed}: correct-answer ownership drift`);
    optionChecks += 5;
    answerPositions[q.correctIndex] += 1;

    const flows = flowsFor(q.mathematicalState);
    const amounts = flows.map((flow) => Number(flow.amount.numerator / flow.amount.denominator));
    assert(flows.length >= 2, `${prototypeId}/${seed}: insufficient dated flows`);
    assert(new Set(amounts).size >= 2, `${prototypeId}/${seed}: flows are not heterogeneous`);
    assert(Math.min(...amounts) >= 2_000, `${prototypeId}/${seed}: token repayment/deposit below exam-realism floor`);
    assert(Math.max(...amounts) <= 150_000, `${prototypeId}/${seed}: cash-flow outlier above exam-realism ceiling`);
    assert(Math.max(...amounts) / Math.min(...amounts) <= 12, `${prototypeId}/${seed}: cash-flow ratio too distorted (${Math.max(...amounts)}/${Math.min(...amounts)})`);
    realismChecks += 5;

    const openingDebt = openingDebtFor(q.mathematicalState);
    if (openingDebt) {
      const opening = Number(openingDebt.numerator / openingDebt.denominator);
      assert(opening >= 40_000 && opening <= 100_000, `${prototypeId}/${seed}: opening debt outside exam-ready band`);
      realismChecks += 1;
    }

    const learnerText = [q.presentation.prompt, q.explanation.keyIdea, ...q.explanation.steps, q.explanation.finalAnswer, ...q.options.map((option) => option.text)].join("\n");
    const moneyTokens = rupeesFromText(learnerText);
    assert(!learnerText.includes("after after"), `${prototypeId}/${seed}: duplicated time preposition`);
    assert(!learnerText.includes("half-year period"), `${prototypeId}/${seed}: mechanical half-year wording remains`);
    assert(!/(?:undefined|null|NaN)/u.test(learnerText), `${prototypeId}/${seed}: invalid learner placeholder`);
    assert(!/₹[\d,]+\.00\b/u.test(learnerText), `${prototypeId}/${seed}: whole-rupee .00 remains`);
    assert(moneyTokens.every((value) => value <= 300_000), `${prototypeId}/${seed}: learner-facing amount exceeds ₹3 lakh`);
    assert(q.presentation.prompt.length >= 100, `${prototypeId}/${seed}: prompt too thin`);
    editorialChecks += 6;

    assert(q.explanation.steps.length === 4, `${prototypeId}/${seed}: explanation depth drift`);
    assert(q.explanation.finalAnswer === q.correctAnswer, `${prototypeId}/${seed}: explanation final answer drift`);
    assert(q.explanation.steps.some((step) => step.includes("=")), `${prototypeId}/${seed}: no worked arithmetic in explanation`);
    assert(q.explanation.steps.join(" ").match(/₹[\d,]+/u) || prototypeId === "INT-CP009-PROT-007", `${prototypeId}/${seed}: explanation lacks question-specific money arithmetic`);
    if (prototypeId !== "INT-CP009-PROT-007") {
      assert(rupeesFromText(q.explanation.steps.join(" ")).length >= 3, `${prototypeId}/${seed}: explanation is still too generic`);
    } else {
      assert(q.explanation.steps.join(" ").includes("final balance"), `${prototypeId}/${seed}: rate explanation lacks candidate-balance evidence`);
    }
    explanationChecks += 5;

    assert(q.permanentQlId === null, `${prototypeId}/${seed}: permanent QL leaked before approval`);
    assert(q.lifecycle.enabled === false, `${prototypeId}/${seed}: runtime gate opened`);
    assert(q.lifecycle.stagingStatus === "NOT_STAGED", `${prototypeId}/${seed}: staging opened`);
    assert(q.lifecycle.registrationStatus === "NOT_REGISTERED", `${prototypeId}/${seed}: registration opened`);
    assert(q.lifecycle.questionStudioDiscoverable === false, `${prototypeId}/${seed}: Question Studio opened`);
    assert(q.lifecycle.questionBankStatus === "NOT_STORED", `${prototypeId}/${seed}: Question Bank state opened`);
    assert(q.lifecycle.questionBankWritable === false, `${prototypeId}/${seed}: Question Bank write opened`);
    assert(q.lifecycle.testEligibility === "INELIGIBLE", `${prototypeId}/${seed}: test gate opened`);
    assert(q.lifecycle.publiclyPublishable === false, `${prototypeId}/${seed}: public gate opened`);
    lifecycleChecks += 9;

    assert(Object.isFrozen(q), `${prototypeId}/${seed}: package not frozen`);
    assert(Object.isFrozen(q.mathematicalState), `${prototypeId}/${seed}: state not frozen`);
    assert(Object.isFrozen(q.options), `${prototypeId}/${seed}: options not frozen`);
    assert(Object.isFrozen(q.explanation), `${prototypeId}/${seed}: explanation not frozen`);
    assert(Object.isFrozen(q.explanation.steps), `${prototypeId}/${seed}: explanation steps not frozen`);
    deepFreezeChecks += 5;

    stemCoverage.get(prototypeId)!.add(q.presentation.stemFamilyId);
    promptSets.get(prototypeId)!.add(q.presentation.prompt);
    stateSets.get(prototypeId)!.add(stable(q.mathematicalState));
  }
}

for (const prototypeId of INT_CP009_PROTOTYPE_IDS) {
  assert(stemCoverage.get(prototypeId)!.size === 3, `${prototypeId}: missing exam-ready stem family`);
  assert(promptSets.get(prototypeId)!.size >= 40, `${prototypeId}: prompt pool too thin`);
  assert(stateSets.get(prototypeId)!.size >= 20, `${prototypeId}: mathematical state pool too thin`);
}
assert(questions === 960, `Expected 960 exam-ready questions, got ${questions}`);
assert(answerPositions.every((count) => count === 240), `Expected 240/240/240/240 answer balance, got ${answerPositions.join("/")}`);

console.log(JSON.stringify({
  examReadyVersion: INT_CP009_EXAM_READY_VERSION,
  prototypes: INT_CP009_PROTOTYPE_IDS.length,
  questions,
  deterministicChecks,
  solverVerifierChecks,
  optionChecks,
  realismChecks,
  editorialChecks,
  explanationChecks,
  lifecycleChecks,
  deepFreezeChecks,
  answerPositions,
  stemFamilyCoverage: Object.fromEntries([...stemCoverage].map(([key, value]) => [key, value.size])),
  uniquePromptCounts: Object.fromEntries([...promptSets].map(([key, value]) => [key, value.size])),
  uniqueStateCounts: Object.fromEntries([...stateSets].map(([key, value]) => [key, value.size])),
  permanentQlCount: 0,
  nextPotentialQlIdentity: "INT-QL-125",
  nextPotentialQlIdentityReserved: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_INT_CP009_EXAM_READINESS_V2_AUDIT");
