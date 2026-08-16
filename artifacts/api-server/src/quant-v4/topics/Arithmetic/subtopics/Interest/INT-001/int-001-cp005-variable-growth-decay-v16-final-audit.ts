import {
  INT_CP005_V16_QL_IDS,
  INT_CP005_RUNTIME_VERSION_V16,
  generateIntCp005QuestionV16Final,
} from "./cp005-variable-growth-decay-runtime-v16-final";
import { verifyIntCp005Answer } from "./cp005-variable-growth-decay-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}
function maxVisibleState(question: ReturnType<typeof generateIntCp005QuestionV16Final>): bigint {
  const state = question.mathematicalState;
  switch (state.qlId) {
    case "INT-QL-086": case "INT-QL-087": case "INT-QL-090": case "INT-QL-092": case "INT-QL-095": return state.initial.numerator;
    case "INT-QL-088": case "INT-QL-089": case "INT-QL-091": return state.initial.numerator > state.finalValue.numerator ? state.initial.numerator : state.finalValue.numerator;
    case "INT-QL-093": return state.initial.numerator > state.threshold.numerator ? state.initial.numerator : state.threshold.numerator;
    case "INT-QL-094": return 0n;
  }
}
function normalizedRates(rates: readonly { numerator: bigint; denominator: bigint }[]): string {
  return rates.map((rate) => `${rate.numerator}/${rate.denominator}`).sort().join("|");
}

let questions = 0;
let verifierChecks = 0;
let lifecycleChecks = 0;
let editorialChecks = 0;
let deterministicChecks = 0;
let genuinePlanChecks = 0;
const stems = new Set<string>();
const answerPositions = new Map<string, Set<number>>();
const qlContexts = new Map<string, Set<string>>();
const qlAnswers = new Map<string, Set<string>>();
const qlStems = new Map<string, Set<string>>();
const bannedLeadIns = [
  "The deposit does not carry one fixed annual rate throughout",
  "Successive annual rates apply to this record",
  "The observed final value comes after a changing annual rate",
  "The value has grown under different yearly rates",
  "The asset has different depreciation rates over the period",
  "Different annual depreciation rates led to the present value",
  "The asset has already passed through several yearly depreciation rates",
  "The current value is observed after successive depreciation",
];

for (const qlId of INT_CP005_V16_QL_IDS) {
  answerPositions.set(qlId, new Set());
  qlContexts.set(qlId, new Set());
  qlAnswers.set(qlId, new Set());
  qlStems.set(qlId, new Set());
  for (let index = 0; index < 160; index += 1) {
    const seed = `int-cp005-v16-final-audit-${qlId}-${index}`;
    const question = generateIntCp005QuestionV16Final(qlId, seed);
    const replay = generateIntCp005QuestionV16Final(qlId, seed);
    assert(stable(question) === stable(replay), `${qlId}/${seed}: replay changed`);
    deterministicChecks += 1;
    questions += 1;

    assert(question.runtimeVersion === INT_CP005_RUNTIME_VERSION_V16, `${qlId}/${seed}: wrong runtime`);
    assert(question.locale === "en-IN", `${qlId}/${seed}: candidate is not English`);
    assert(verifyIntCp005Answer(question.mathematicalState, question.solution), `${qlId}/${seed}: verifier failed`);
    assert(question.solution.denominator === 1n, `${qlId}/${seed}: non-integral keyed answer`);
    verifierChecks += 1;

    assert(question.options.length === 4, `${qlId}/${seed}: option count`);
    assert(new Set(question.options.map((option) => option.text)).size === 4, `${qlId}/${seed}: duplicate options`);
    assert(question.options.filter((option) => option.isCorrect).length === 1, `${qlId}/${seed}: correct ownership`);
    assert(question.correctAnswer === question.options[question.correctIndex]!.text, `${qlId}/${seed}: answer/index mismatch`);
    answerPositions.get(qlId)!.add(question.correctIndex);
    qlContexts.get(qlId)!.add(question.mathematicalState.context);
    qlAnswers.get(qlId)!.add(question.correctAnswer);
    qlStems.get(qlId)!.add(question.presentation.markdown);

    assert(!question.enabled && question.stagingStatus === "NOT_STAGED" && question.registrationStatus === "NOT_REGISTERED", `${qlId}/${seed}: lifecycle opened`);
    assert(!question.questionStudioDiscoverable && question.questionBankStatus === "NOT_STORED" && question.testEligibility === "INELIGIBLE" && !question.publiclyPublishable, `${qlId}/${seed}: delivery opened`);
    lifecycleChecks += 7;

    const stem = question.presentation.markdown;
    assert(stem.length <= 285, `${qlId}/${seed}: stem too long (${stem.length})`);
    assert(!bannedLeadIns.some((phrase) => stem.includes(phrase)), `${qlId}/${seed}: boilerplate lead-in returned`);
    assert(!/production|capacity|salary|employee|executive/iu.test(stem), `${qlId}/${seed}: out-of-scope context leaked`);
    assert(!/1 years\b/u.test(`${stem} ${question.options.map((o) => o.text).join(" ")}`), `${qlId}/${seed}: singular-year grammar`);
    assert(!/₹\d{2,},\d{2},\d{3}/u.test(stem), `${qlId}/${seed}: crore-scale learner money leaked`);
    editorialChecks += 5;

    if (qlId !== "INT-QL-093") assert(maxVisibleState(question) <= 300000n, `${qlId}/${seed}: learner value exceeds ₹3 lakh`);
    const state = question.mathematicalState;
    switch (state.qlId) {
      case "INT-QL-086": case "INT-QL-087": case "INT-QL-088": case "INT-QL-089":
        assert(state.context === "INVESTMENT", `${qlId}/${seed}: investment QL escaped context`);
        break;
      case "INT-QL-090": case "INT-QL-091":
        assert(state.context === "MACHINE" || state.context === "VEHICLE", `${qlId}/${seed}: depreciation context escaped`);
        break;
      case "INT-QL-092":
        assert(state.context === "ASSET", `${qlId}/${seed}: mixed-change context escaped`);
        break;
      case "INT-QL-093":
        assert(state.context === "POPULATION" || state.context === "ASSET", `${qlId}/${seed}: threshold context escaped`);
        break;
      case "INT-QL-095":
        assert(state.context === "INVESTMENT", `${qlId}/${seed}: comparison context escaped`);
        assert(normalizedRates(state.planARates) !== normalizedRates(state.planBRates), `${qlId}/${seed}: plans differ only by rate order`);
        assert(question.solution.numerator > 0n, `${qlId}/${seed}: degenerate zero-difference comparison`);
        genuinePlanChecks += 2;
        break;
      case "INT-QL-094": throw new Error("QL094 unexpectedly reached V16 final audit");
    }
    if (state.qlId === "INT-QL-086" || state.qlId === "INT-QL-087" || state.qlId === "INT-QL-088") {
      assert(state.rates.length >= 2 && state.rates.length <= 3, `${qlId}/${seed}: ordinary duration not 2-3 years`);
    }
    if (state.qlId === "INT-QL-090" || state.qlId === "INT-QL-091") {
      assert(state.decayRates.length >= 2 && state.decayRates.length <= 3, `${qlId}/${seed}: depreciation duration not 2-3 years`);
    }
    if (state.qlId === "INT-QL-092") assert(state.signedRates.length >= 2 && state.signedRates.length <= 3, `${qlId}/${seed}: mixed duration not 2-3 years`);
    editorialChecks += 2;

    const learner = [stem, question.explanation.keyIdea, ...question.explanation.steps, question.explanation.commonMistake].join("\n");
    assert(!/\$[^\n]*\$/u.test(learner), `${qlId}/${seed}: dollar MathJax delimiter`);
    assert(!/\\begin\{|\\end\{/u.test(learner), `${qlId}/${seed}: unsupported MathJax environment`);
    editorialChecks += 2;
    stems.add(stem);
  }
}

let ql094Rejected = false;
try { generateIntCp005QuestionV16Final("INT-QL-094", "must-reject"); } catch { ql094Rejected = true; }
assert(ql094Rejected, "INT-QL-094: final V16 authority did not reject out-of-scope generation");

for (const qlId of INT_CP005_V16_QL_IDS) {
  assert(answerPositions.get(qlId)!.size === 4, `${qlId}: not all answer positions reached`);
  assert(qlStems.get(qlId)!.size >= 8, `${qlId}: stem diversity too low`);
  assert(qlAnswers.get(qlId)!.size >= 4, `${qlId}: answer diversity too low`);
}
assert(qlContexts.get("INT-QL-086")!.size === 1 && qlContexts.get("INT-QL-086")!.has("INVESTMENT"), "QL086 context not investment-only");
assert(stems.size >= 90, "chapter-wide V16 stem diversity is too low");

console.log(JSON.stringify({
  runtimeVersion: INT_CP005_RUNTIME_VERSION_V16,
  qls: INT_CP005_V16_QL_IDS.length,
  questions,
  deterministicChecks,
  verifierChecks,
  lifecycleChecks,
  editorialChecks,
  genuinePlanChecks,
  uniqueStems: stems.size,
  answerPositions: Object.fromEntries([...answerPositions].map(([ql, positions]) => [ql, [...positions].sort()])),
  ql094Rejected,
}, null, 2));
console.log("PASS_INT_CP005_V16_FINAL_EXAM_REALISM");
