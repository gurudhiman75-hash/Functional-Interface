import { generateIntCp005QuestionV14 } from "./cp005-variable-growth-decay-runtime-v14";
import {
  INT_CP005_QL_IDS,
  INT_CP005_RUNTIME_VERSION_V15,
  generateIntCp005QuestionV15,
  verifyIntCp005Answer,
  type IntCp005Locale,
} from "./cp005-variable-growth-decay-runtime-v15";

const LOCALES = Object.freeze(["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly IntCp005Locale[]);

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}

function abs(value: bigint): bigint { return value < 0n ? -value : value; }
function gcd(a: bigint, b: bigint): bigint {
  a = abs(a); b = abs(b);
  while (b !== 0n) [a, b] = [b, a % b];
  return a || 1n;
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

let questions = 0;
let parityChecks = 0;
let verifierChecks = 0;
let realismChecks = 0;
let lifecycleChecks = 0;
let wrapperChecks = 0;
let thresholdStates = 0;
const thresholdInitial = new Set<string>();
const thresholdFinal = new Set<string>();
const thresholdRates = new Set<string>();
const thresholdYears = new Set<number>();
const thresholdDirections = new Set<string>();

for (const qlId of INT_CP005_QL_IDS) {
  for (let index = 0; index < 100; index += 1) {
    const seed = `int-cp005-v15-audit-${qlId}-${index}`;
    for (const locale of LOCALES) {
      const current = generateIntCp005QuestionV15(qlId, seed, locale);
      const replay = generateIntCp005QuestionV15(qlId, seed, locale);
      assert(stable(current) === stable(replay), `${qlId}/${seed}/${locale}: non-deterministic V15 replay`);
      questions += 1;

      assert(current.runtimeVersion === INT_CP005_RUNTIME_VERSION_V15, `${qlId}/${seed}/${locale}: wrong runtime version`);
      assert(verifyIntCp005Answer(current.mathematicalState, current.solution), `${qlId}/${seed}/${locale}: independent verifier failed`);
      verifierChecks += 1;

      if (qlId !== "INT-QL-093") {
        const previous = generateIntCp005QuestionV14(qlId, seed, locale);
        const { runtimeVersion: _oldVersion, ...oldComparable } = previous;
        const { runtimeVersion: _newVersion, ...newComparable } = current;
        assert(stable(oldComparable) === stable(newComparable), `${qlId}/${seed}/${locale}: V15 changed non-threshold authority`);
        parityChecks += 1;
      } else {
        const state = current.mathematicalState;
        assert(state.qlId === "INT-QL-093", `${qlId}/${seed}/${locale}: wrong threshold state`);
        assert(state.initial.denominator === 1n && state.threshold.denominator === 1n, `${qlId}/${seed}/${locale}: non-integral threshold values`);
        assert(gcd(state.initial.numerator, state.threshold.numerator) === 1n, `${qlId}/${seed}/${locale}: threshold pair retains artificial common scale`);
        assert(state.initial.numerator > 0n && state.initial.numerator <= 10_000_000n, `${qlId}/${seed}/${locale}: initial threshold value is not exam-realistic`);
        assert(state.threshold.numerator > 0n && state.threshold.numerator <= 20_000_000n, `${qlId}/${seed}/${locale}: target threshold value is not exam-realistic`);
        if (state.direction === "GROWTH") {
          assert(state.context === "POPULATION", `${qlId}/${seed}/${locale}: growth threshold lost population context`);
          assert(state.threshold.numerator > state.initial.numerator, `${qlId}/${seed}/${locale}: growth threshold is not above initial value`);
          if (locale === "en-IN") assert(/^A city has a population/u.test(current.presentation.markdown), `${qlId}/${seed}: growth presentation is not city-realistic`);
        } else {
          assert(state.context === "ASSET", `${qlId}/${seed}/${locale}: decay threshold lost asset context`);
          assert(state.threshold.numerator < state.initial.numerator, `${qlId}/${seed}/${locale}: decay threshold is not below initial value`);
        }
        const previous = generateIntCp005QuestionV14(qlId, seed, locale);
        assert(current.solution.numerator === previous.solution.numerator && current.solution.denominator === previous.solution.denominator, `${qlId}/${seed}/${locale}: threshold solution changed`);
        assert(current.correctIndex === previous.correctIndex, `${qlId}/${seed}/${locale}: threshold correct index changed`);
        assert(stable(current.options) === stable(previous.options), `${qlId}/${seed}/${locale}: threshold options changed`);
        assert(state.rate.numerator === previous.mathematicalState.rate.numerator && state.rate.denominator === previous.mathematicalState.rate.denominator, `${qlId}/${seed}/${locale}: threshold rate changed`);
        assert(state.targetYear === previous.mathematicalState.targetYear && state.direction === previous.mathematicalState.direction, `${qlId}/${seed}/${locale}: threshold topology changed`);
        thresholdStates += 1;
        thresholdInitial.add(`${state.initial.numerator}`);
        thresholdFinal.add(`${state.threshold.numerator}`);
        thresholdRates.add(`${state.rate.numerator}/${state.rate.denominator}`);
        thresholdYears.add(state.targetYear);
        thresholdDirections.add(state.direction);
        realismChecks += 12;
      }

      assert(current.options.length === 4, `${qlId}/${seed}/${locale}: option count changed`);
      assert(current.options.filter((option) => option.isCorrect).length === 1, `${qlId}/${seed}/${locale}: correct-option ownership failed`);
      assert(current.correctAnswer === current.options[current.correctIndex]!.text, `${qlId}/${seed}/${locale}: correct answer mismatch`);
      assert(!current.enabled, `${qlId}/${seed}/${locale}: enabled unexpectedly`);
      assert(current.stagingStatus === "NOT_STAGED", `${qlId}/${seed}/${locale}: staged unexpectedly`);
      assert(current.registrationStatus === "NOT_REGISTERED", `${qlId}/${seed}/${locale}: registered unexpectedly`);
      assert(!current.questionStudioDiscoverable, `${qlId}/${seed}/${locale}: Question Studio opened unexpectedly`);
      assert(current.questionBankStatus === "NOT_STORED", `${qlId}/${seed}/${locale}: Question Bank opened unexpectedly`);
      assert(current.testEligibility === "INELIGIBLE", `${qlId}/${seed}/${locale}: test eligibility opened unexpectedly`);
      assert(!current.publiclyPublishable, `${qlId}/${seed}/${locale}: public delivery opened unexpectedly`);
      lifecycleChecks += 7;

      const learner = [
        current.presentation.markdown,
        current.explanation.keyIdea,
        ...current.explanation.steps,
        current.explanation.commonMistake ?? "",
      ].join("\n");
      assert(!/\$[^\n]*\$/u.test(learner), `${qlId}/${seed}/${locale}: dollar MathJax delimiter reached V15 learner content`);
      assert(!/(?:^|[^\\])[=×÷−^]/u.test(learner.replace(/\\\([^]*?\\\)/gu, "")), `${qlId}/${seed}/${locale}: raw math leaked outside Examtree wrappers`);
      wrapperChecks += 1;
    }
  }
}

assert(thresholdDirections.size === 2, "INT-QL-093/V15: both growth and decay directions were not reached");
assert(thresholdYears.size >= 4, "INT-QL-093/V15: target-year diversity regressed");
assert(thresholdRates.size >= 8, "INT-QL-093/V15: rate diversity regressed");
assert(thresholdInitial.size >= 20 && thresholdFinal.size >= 20, "INT-QL-093/V15: threshold value diversity regressed");

console.log(JSON.stringify({
  runtimeVersion: INT_CP005_RUNTIME_VERSION_V15,
  qls: INT_CP005_QL_IDS.length,
  questions,
  perLocale: questions / LOCALES.length,
  parityChecks,
  verifierChecks,
  realismChecks,
  lifecycleChecks,
  wrapperChecks,
  thresholdStates,
  thresholdDirections: [...thresholdDirections].sort(),
  thresholdYears: [...thresholdYears].sort(),
  thresholdRates: thresholdRates.size,
  thresholdInitialValues: thresholdInitial.size,
  thresholdFinalValues: thresholdFinal.size,
}, null, 2));
console.log("PASS_INT_CP005_VARIABLE_GROWTH_DECAY_V15");
