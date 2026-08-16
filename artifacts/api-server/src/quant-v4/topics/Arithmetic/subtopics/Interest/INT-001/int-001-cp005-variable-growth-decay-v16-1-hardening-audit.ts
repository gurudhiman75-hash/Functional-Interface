import {
  INT_CP005_RUNTIME_VERSION_V16_1,
  INT_CP005_V16_1_QL_IDS,
  generateIntCp005QuestionV16_1Final,
  intCp005V16_1TopologyKey,
} from "./cp005-variable-growth-decay-runtime-v16-1-final";
import { add, mul, rat } from "./cp003-exam-model";
import { verifyIntCp005Answer } from "./cp005-variable-growth-decay-runtime";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
function r(value: { numerator: bigint; denominator: bigint }): string { return `${value.numerator}/${value.denominator}`; }
function normalizedStem(text: string): string {
  return text
    .replace(/₹[0-9,]+/gu, "₹N")
    .replace(/[0-9][0-9,]*(?:\.[0-9]+)?%/gu, "R%")
    .replace(/\b[0-9][0-9,]*(?:\.[0-9]+)?\b/gu, "N")
    .replace(/\b(?:machine|vehicle|property|asset|town)\b/giu, "SUBJECT")
    .replace(/\s+/gu, " ")
    .trim();
}
function absBig(value: bigint): bigint { return value < 0n ? -value : value; }

const topology = new Map<string, Set<string>>();
const skeletons = new Map<string, Set<string>>();
const answerValues = new Map<string, Set<string>>();
const answerPositions = new Map<string, Set<number>>();
const contexts = new Map<string, Set<string>>();
for (const qlId of INT_CP005_V16_1_QL_IDS) {
  topology.set(qlId, new Set());
  skeletons.set(qlId, new Set());
  answerValues.set(qlId, new Set());
  answerPositions.set(qlId, new Set());
  contexts.set(qlId, new Set());
}

const thresholdYears = new Set<number>();
const thresholdDirections = new Set<string>();
const thresholdBoundaries = new Set<string>();
const mixedOutcomes = new Set<string>();
const planDirections = new Set<string>();
let questions = 0;
let verifierChecks = 0;
let optionChecks = 0;
let plausibilityChecks = 0;
let lifecycleChecks = 0;
let deterministicChecks = 0;

for (const qlId of INT_CP005_V16_1_QL_IDS) {
  for (let index = 0; index < 640; index += 1) {
    const seed = `int-cp005-v16.1-audit-${qlId}-${index}`;
    const q = generateIntCp005QuestionV16_1Final(qlId, seed);
    const replay = generateIntCp005QuestionV16_1Final(qlId, seed);
    assert(JSON.stringify(q, (_k, v) => typeof v === "bigint" ? `${v}n` : v) === JSON.stringify(replay, (_k, v) => typeof v === "bigint" ? `${v}n` : v), `${qlId}/${seed}: deterministic replay drift`);
    deterministicChecks += 1;
    questions += 1;
    assert(q.runtimeVersion === INT_CP005_RUNTIME_VERSION_V16_1, `${qlId}/${seed}: wrong runtime version`);
    assert(verifyIntCp005Answer(q.mathematicalState, q.solution), `${qlId}/${seed}: independent verifier failed`);
    verifierChecks += 1;
    assert(q.options.length === 4 && q.options.filter((o) => o.isCorrect).length === 1, `${qlId}/${seed}: option ownership invalid`);
    assert(q.correctAnswer === q.options[q.correctIndex]!.text, `${qlId}/${seed}: correct answer/index mismatch`);
    assert(new Set(q.options.map((o) => o.text)).size === 4, `${qlId}/${seed}: duplicate option text`);
    assert(q.options.every((o) => o.value.denominator === 1n && o.value.numerator > 0n), `${qlId}/${seed}: non-integral/non-positive option`);
    optionChecks += 4;
    assert(!q.enabled && q.stagingStatus === "NOT_STAGED" && q.registrationStatus === "NOT_REGISTERED", `${qlId}/${seed}: lifecycle opened`);
    assert(!q.questionStudioDiscoverable && q.questionBankStatus === "NOT_STORED" && q.testEligibility === "INELIGIBLE" && !q.publiclyPublishable, `${qlId}/${seed}: delivery opened`);
    lifecycleChecks += 7;

    const learner = [q.presentation.markdown, ...q.options.map((o) => `${o.text}\n${o.studentFeedback}`), q.explanation.keyIdea, ...q.explanation.steps, q.explanation.commonMistake].join("\n");
    assert(!/production|capacity|salary|employee|executive/iu.test(learner), `${qlId}/${seed}: rejected context leaked`);
    assert(!/₹[0-9]+,[0-9]{2},[0-9]{2},[0-9]{3}/u.test(learner), `${qlId}/${seed}: crore-scale money leaked`);
    assert(!/NEARBY_ARITHMETIC|RATE_PLUS_|RATE_MINUS_/u.test(q.options.map((o) => o.misconceptionId).join("|")), `${qlId}/${seed}: synthetic distractor ownership returned`);
    assert(q.presentation.markdown.length <= 380, `${qlId}/${seed}: stem too long (${q.presentation.markdown.length})`);

    topology.get(qlId)!.add(intCp005V16_1TopologyKey(q.mathematicalState));
    skeletons.get(qlId)!.add(normalizedStem(q.presentation.markdown));
    answerValues.get(qlId)!.add(r(q.solution));
    answerPositions.get(qlId)!.add(q.correctIndex);
    contexts.get(qlId)!.add(q.mathematicalState.context);

    if (qlId === "INT-QL-090") {
      const state = q.mathematicalState;
      assert(state.qlId === "INT-QL-090", "narrowing failure");
      assert(q.options.every((o) => o.value.numerator < state.initial.numerator), `${qlId}/${seed}: depreciation option is not below opening value`);
      plausibilityChecks += 4;
    }
    if (qlId === "INT-QL-089") {
      assert(q.options.every((o) => o.value.numerator < 60n), `${qlId}/${seed}: implausible rate option`);
      assert(q.options.filter((o) => !o.isCorrect).every((o) => /REPEAT_KNOWN_RATE|ADD_KNOWN_RATES/u.test(o.misconceptionId)), `${qlId}/${seed}: weak missing-rate distractor returned`);
      plausibilityChecks += 4;
    }
    if (qlId === "INT-QL-092") {
      const state = q.mathematicalState;
      assert(state.qlId === "INT-QL-092", "narrowing failure");
      const delta = q.solution.numerator - state.initial.numerator;
      const band = state.initial.numerator / 100n;
      mixedOutcomes.add(absBig(delta) <= band ? "BREAK_EVEN" : delta > 0n ? "GROWTH" : "DECLINE");
    }
    if (qlId === "INT-QL-093") {
      const state = q.mathematicalState;
      assert(state.qlId === "INT-QL-093", "narrowing failure");
      thresholdYears.add(state.targetYear);
      thresholdDirections.add(state.direction);
      const factor = state.direction === "GROWTH"
        ? add(rat(1n), { numerator: state.rate.numerator, denominator: state.rate.denominator * 100n })
        : { numerator: 100n * state.rate.denominator - state.rate.numerator, denominator: 100n * state.rate.denominator };
      const atYear = mul(state.initial, Array.from({ length: state.targetYear }, () => factor).reduce((a, b) => mul(a, b), rat(1n)));
      thresholdBoundaries.add(r(state.threshold) === r(atYear) ? "EXACT" : "BETWEEN");
    }
    if (qlId === "INT-QL-095") {
      const state = q.mathematicalState;
      assert(state.qlId === "INT-QL-095", "narrowing failure");
      assert(q.options.every((o) => o.value.numerator < state.initial.numerator), `${qlId}/${seed}: plan-difference option looks like a full final amount`);
      assert(q.options.filter((o) => !o.isCorrect).every((o) => /PLAN_RATES|YEAR|COMPARISON/u.test(o.misconceptionId)), `${qlId}/${seed}: non-difference distractor returned`);
      const amount = (rates: readonly { numerator: bigint; denominator: bigint }[]) => rates.reduce((acc, rate) => mul(acc, { numerator: 100n * rate.denominator + rate.numerator, denominator: 100n * rate.denominator }), state.initial);
      const a = amount(state.planARates); const b = amount(state.planBRates);
      planDirections.add(a.numerator * b.denominator > b.numerator * a.denominator ? "A_GT_B" : "B_GT_A");
      plausibilityChecks += 4;
    }
  }
}

const minTopology: Record<string, number> = {
  "INT-QL-086": 30, "INT-QL-087": 18, "INT-QL-088": 30, "INT-QL-089": 20,
  "INT-QL-090": 24, "INT-QL-091": 24, "INT-QL-092": 14, "INT-QL-093": 30, "INT-QL-095": 10,
};
for (const qlId of INT_CP005_V16_1_QL_IDS) {
  assert(skeletons.get(qlId)!.size >= 3, `${qlId}: fewer than three normalized stem frames (${skeletons.get(qlId)!.size})`);
  assert(topology.get(qlId)!.size >= minTopology[qlId]!, `${qlId}: genuine mathematical topology too low (${topology.get(qlId)!.size})`);
  assert(answerPositions.get(qlId)!.size === 4, `${qlId}: all answer positions not reached`);
}
assert(contexts.get("INT-QL-086")!.has("INVESTMENT") && contexts.get("INT-QL-086")!.has("POPULATION") && contexts.get("INT-QL-086")!.has("ASSET"), "QL086 context coverage incomplete");
assert(contexts.get("INT-QL-088")!.has("INVESTMENT") && contexts.get("INT-QL-088")!.has("POPULATION") && contexts.get("INT-QL-088")!.has("ASSET"), "QL088 context coverage incomplete");
assert(contexts.get("INT-QL-090")!.size === 2 && contexts.get("INT-QL-091")!.size === 2, "depreciation machine/vehicle coverage incomplete");
assert(answerValues.get("INT-QL-089")!.size >= 8, `QL089 missing-rate answer diversity too low (${answerValues.get("INT-QL-089")!.size})`);
assert(thresholdYears.size === 4 && [2, 3, 4, 5].every((year) => thresholdYears.has(year)), `QL093 year coverage incomplete: ${[...thresholdYears].join(",")}`);
assert(thresholdDirections.size === 2, `QL093 direction coverage incomplete`);
assert(thresholdBoundaries.size === 2, `QL093 exact/between boundary coverage incomplete`);
assert(mixedOutcomes.has("GROWTH") && mixedOutcomes.has("DECLINE") && mixedOutcomes.has("BREAK_EVEN"), `QL092 outcome coverage incomplete: ${[...mixedOutcomes].join(",")}`);
assert(planDirections.size === 2, `QL095 A>B/B>A direction coverage incomplete: ${[...planDirections].join(",")}`);
let ql094Rejected = false;
try { generateIntCp005QuestionV16_1Final("INT-QL-094", "must-reject"); } catch { ql094Rejected = true; }
assert(ql094Rejected, "QL094 did not remain rejected");

console.log(JSON.stringify({
  runtimeVersion: INT_CP005_RUNTIME_VERSION_V16_1,
  qls: INT_CP005_V16_1_QL_IDS.length,
  questions,
  deterministicChecks,
  verifierChecks,
  optionChecks,
  plausibilityChecks,
  lifecycleChecks,
  normalizedStemFrames: Object.fromEntries([...skeletons].map(([ql, set]) => [ql, set.size])),
  genuineTopologies: Object.fromEntries([...topology].map(([ql, set]) => [ql, set.size])),
  answerDiversity: Object.fromEntries([...answerValues].map(([ql, set]) => [ql, set.size])),
  contextCoverage: Object.fromEntries([...contexts].map(([ql, set]) => [ql, [...set].sort()])),
  thresholdYears: [...thresholdYears].sort(),
  thresholdDirections: [...thresholdDirections].sort(),
  thresholdBoundaries: [...thresholdBoundaries].sort(),
  mixedOutcomes: [...mixedOutcomes].sort(),
  planDirections: [...planDirections].sort(),
  ql094Rejected,
}, null, 2));
console.log("PASS_INT_CP005_V16_1_DIVERSITY_HARDENING");
