import assert from "node:assert/strict";
import {
  INT_CP005_QL_IDS,
  INT_CP005_RUNTIME_VERSION_V7,
  generateIntCp005QuestionV7,
  verifyIntCp005Answer,
  type IntCp005Locale,
  type IntCp005QuestionV7,
} from "./cp005-variable-growth-decay-runtime-v7";

const LOCALES = Object.freeze(["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly IntCp005Locale[]);
const contexts086 = new Set<string>();
const contexts088 = new Set<string>();
const contexts090 = new Set<string>();
const thresholdDirections = new Set<string>();
const thresholdRates = new Set<string>();
const thresholdYears = new Set<number>();
const thresholdInitials = new Set<string>();
const eventOrders = new Set<string>();
const eventSigns = new Set<string>();
const planPairs = new Set<string>();
const planInitials = new Set<string>();
const perQlFingerprints: Record<string, number> = {};
const perQlStems: Record<string, Record<string, number>> = {};
let questions = 0;
let verifierChecks = 0;
let replayChecks = 0;
let optionChecks = 0;
let parityChecks = 0;
let lifecycleChecks = 0;
let wrapperChecks = 0;
let collisionChecks = 0;
let contextChecks = 0;
let exactPlanMoneyChecks = 0;
let thresholdBoundaryChecks = 0;

function learnerStrings(question: IntCp005QuestionV7): readonly string[] {
  return [question.presentation.markdown, question.presentation.prompt, ...question.options.flatMap((option) => [option.text, option.studentFeedback]), question.explanation.keyIdea, ...question.explanation.steps, question.explanation.finalAnswer, question.explanation.commonMistake];
}

function stripMath(text: string): string {
  return text.replace(/\\\([\s\S]*?\\\)/gu, "").replace(/\\\[[\s\S]*?\\\]/gu, "");
}

function optionKey(question: IntCp005QuestionV7): string {
  return question.options.map((option) => `${option.value.numerator}/${option.value.denominator}:${option.misconceptionId}:${option.isCorrect}`).join("|");
}

function assertSurface(question: IntCp005QuestionV7): void {
  const joined = learnerStrings(question).join("\n");
  assert(!joined.includes("$"), `${question.qlId}/${question.seed}/${question.locale}: legacy dollar delimiter`);
  assert(!/₹[0-9,]+\.00\b/u.test(joined), `${question.qlId}/${question.seed}/${question.locale}: .00 money`);
  assert(!/\d+\.\d{3,}/u.test(joined), `${question.qlId}/${question.seed}/${question.locale}: >2 visible decimals`);
  assert(!/people people/iu.test(joined), `${question.qlId}/${question.seed}/${question.locale}: duplicate people noun`);
  assert(!/TODO|TBD|placeholder|translation pending/iu.test(joined));
  if (question.locale === "hi-IN") assert(/[\u0900-\u097F]/u.test(joined));
  if (question.locale === "pa-IN") {
    assert(/[\u0A00-\u0A7F]/u.test(joined));
    assert(!joined.includes("ਚੱਕਰਵੱਧੀ"));
    if (question.qlId === "INT-QL-086" && ["POPULATION", "SALARY", "PRODUCTION"].includes(question.mathematicalState.context)) assert(/ਵਾਧਾ ਹੁੰਦਾ ਹੈ/u.test(question.presentation.markdown));
  }
  if (question.locale === "hi-IN" && question.qlId === "INT-QL-092") assert(!/इसके मूल्य में क्रमशः [^।]+ होता है।/u.test(question.presentation.markdown));
  if (question.locale === "pa-IN" && question.qlId === "INT-QL-092") assert(!/ਇਸ ਦੇ ਮੁੱਲ ਵਿੱਚ ਕ੍ਰਮਵਾਰ [^।]+ ਹੁੰਦਾ ਹੈ।/u.test(question.presentation.markdown));

  const prefix = question.locale === "en-IN" ? "Formula:" : question.locale === "hi-IN" ? "सूत्र:" : "ਸੂਤਰ:";
  assert(question.explanation.steps[0]?.startsWith(prefix), `${question.qlId}/${question.seed}/${question.locale}: formula-first missing`);
  assert(/\\\([^\n]+\\\)/u.test(question.explanation.steps[0] ?? ""), `${question.qlId}/${question.seed}/${question.locale}: formula wrapper missing`);
  for (const step of question.explanation.steps) {
    const outside = stripMath(step);
    assert(!/[=×÷^]/u.test(outside), `${question.qlId}/${question.seed}/${question.locale}: raw equation outside wrapper`);
    assert(!/\\(?:frac|times|div|prod|left|right)/u.test(outside), `${question.qlId}/${question.seed}/${question.locale}: raw LaTeX outside wrapper`);
    wrapperChecks += 1;
  }

  if (question.qlId === "INT-QL-088" && question.mathematicalState.context === "SALARY") {
    assert(question.locale === "en-IN" ? /salary/iu.test(question.presentation.markdown) : question.locale === "hi-IN" ? /वेतन/u.test(question.presentation.markdown) : /ਤਨਖਾਹ/u.test(question.presentation.markdown));
    contextChecks += 1;
  }
  if (question.qlId === "INT-QL-088" && question.mathematicalState.context === "POPULATION") {
    assert(question.locale === "en-IN" ? /population/iu.test(question.presentation.markdown) : question.locale === "hi-IN" ? /जनसंख्या/u.test(question.presentation.markdown) : /ਆਬਾਦੀ/u.test(question.presentation.markdown));
    contextChecks += 1;
  }

  if (question.qlId === "INT-QL-093") {
    assert.equal(question.mathematicalState.initial.denominator, 1n, `${question.qlId}/${question.seed}: non-integral threshold initial value`);
    assert.equal(question.mathematicalState.threshold.denominator, 1n, `${question.qlId}/${question.seed}: non-integral threshold boundary`);
    assert.equal(question.options.every((option) => option.value.denominator === 1n), true, `${question.qlId}/${question.seed}: threshold year option not integral`);
    thresholdBoundaryChecks += 4;
  }

  if (question.qlId === "INT-QL-095") {
    for (const option of question.options) {
      assert.equal(option.value.denominator, 1n, `${question.qlId}/${question.seed}/${question.locale}: plan option is not exact whole-rupee money`);
      assert(/^₹[0-9,]+$/u.test(option.text), `${question.qlId}/${question.seed}/${question.locale}: plan option is not whole-rupee learner text`);
      exactPlanMoneyChecks += 1;
    }
  }
}

assert.equal(INT_CP005_RUNTIME_VERSION_V7, "INT-CP-005-VARIABLE-GROWTH-DECAY-v7");
assert.equal(INT_CP005_QL_IDS.length, 10);

for (const qlId of INT_CP005_QL_IDS) {
  const fingerprints = new Set<string>();
  const stems = new Map<IntCp005Locale, Map<string, string>>(LOCALES.map((locale) => [locale, new Map<string, string>()]));
  const answerPositions = new Set<number>();

  for (let index = 0; index < 100; index += 1) {
    const seed = `int-cp005-v7-audit-${qlId}-${index}`;
    const english = generateIntCp005QuestionV7(qlId, seed, "en-IN");
    assert.deepEqual(generateIntCp005QuestionV7(qlId, seed, "en-IN"), english, `${qlId}/${seed}: replay drift`);
    replayChecks += 1;
    assert(verifyIntCp005Answer(english.mathematicalState, english.solution), `${qlId}/${seed}: solution verifier failure`);
    verifierChecks += 1;
    assert.equal(english.options.length, 4);
    assert.equal(new Set(english.options.map((option) => option.text)).size, 4, `${qlId}/${seed}: duplicate options`);
    assert.equal(english.options.filter((option) => option.isCorrect).length, 1);
    english.options.forEach((option, optionIndex) => {
      assert.equal(verifyIntCp005Answer(english.mathematicalState, option.value), optionIndex === english.correctIndex, `${qlId}/${seed}: option ownership failure`);
      optionChecks += 1;
    });
    answerPositions.add(english.correctIndex);
    fingerprints.add(english.mathematicalFingerprint);

    if (qlId === "INT-QL-086") contexts086.add(english.mathematicalState.context);
    if (qlId === "INT-QL-088") contexts088.add(english.mathematicalState.context);
    if (qlId === "INT-QL-090") contexts090.add(english.mathematicalState.context);
    if (english.mathematicalState.qlId === "INT-QL-093") {
      const r = (value: { numerator: bigint; denominator: bigint }) => `${value.numerator}/${value.denominator}`;
      thresholdDirections.add(english.mathematicalState.direction);
      thresholdRates.add(`${english.mathematicalState.direction}:${r(english.mathematicalState.rate)}`);
      thresholdYears.add(english.mathematicalState.targetYear);
      thresholdInitials.add(r(english.mathematicalState.initial));
    }
    if (english.mathematicalState.qlId === "INT-QL-094") {
      eventOrders.add(english.mathematicalState.eventOrder);
      eventSigns.add(english.mathematicalState.adjustment.numerator >= 0n ? "IN" : "OUT");
    }
    if (english.mathematicalState.qlId === "INT-QL-095") {
      const r = (value: { numerator: bigint; denominator: bigint }) => `${value.numerator}/${value.denominator}`;
      planPairs.add(`${english.mathematicalState.planARates.map(r).join(",")}|${english.mathematicalState.planBRates.map(r).join(",")}`);
      planInitials.add(r(english.mathematicalState.initial));
    }

    const canonicalOptions = optionKey(english);
    for (const locale of LOCALES) {
      const question = locale === "en-IN" ? english : generateIntCp005QuestionV7(qlId, seed, locale);
      questions += 1;
      assert.equal(question.runtimeVersion, INT_CP005_RUNTIME_VERSION_V7);
      assert.deepEqual(question.mathematicalState, english.mathematicalState, `${qlId}/${seed}/${locale}: state drift`);
      assert.deepEqual(question.solution, english.solution, `${qlId}/${seed}/${locale}: solution drift`);
      assert.equal(question.correctIndex, english.correctIndex, `${qlId}/${seed}/${locale}: answer-position drift`);
      assert.equal(optionKey(question), canonicalOptions, `${qlId}/${seed}/${locale}: option/misconception drift`);
      parityChecks += 4;
      assertSurface(question);

      const map = stems.get(locale)!;
      const previous = map.get(question.presentation.markdown);
      if (previous !== undefined) assert.equal(previous, question.mathematicalFingerprint, `${qlId}/${locale}: same visible stem maps to different state`);
      else map.set(question.presentation.markdown, question.mathematicalFingerprint);
      collisionChecks += 1;

      assert.equal(question.enabled, false);
      assert.equal(question.stagingStatus, "NOT_STAGED");
      assert.equal(question.registrationStatus, "NOT_REGISTERED");
      assert.equal(question.questionStudioDiscoverable, false);
      assert.equal(question.questionBankStatus, "NOT_STORED");
      assert.equal(question.testEligibility, "INELIGIBLE");
      assert.equal(question.publiclyPublishable, false);
      lifecycleChecks += 7;
    }
  }

  assert.deepEqual([...answerPositions].sort(), [0, 1, 2, 3], `${qlId}: all answer positions not reachable`);
  const minimum = qlId === "INT-QL-093" ? 50 : qlId === "INT-QL-095" ? 60 : 20;
  assert(fingerprints.size >= minimum, `${qlId}: state diversity ${fingerprints.size} < ${minimum}`);
  perQlFingerprints[qlId] = fingerprints.size;
  perQlStems[qlId] = Object.fromEntries(LOCALES.map((locale) => [locale, stems.get(locale)!.size]));
}

assert.deepEqual([...contexts086].sort(), ["INVESTMENT", "POPULATION", "PRODUCTION", "SALARY"]);
assert.deepEqual([...contexts088].sort(), ["INVESTMENT", "POPULATION", "SALARY"]);
assert.deepEqual([...contexts090].sort(), ["ASSET", "MACHINE", "VEHICLE"]);
assert.deepEqual([...thresholdDirections].sort(), ["DECAY", "GROWTH"]);
assert(thresholdRates.size >= 12, `threshold rate-profile diversity ${thresholdRates.size} < 12`);
assert.deepEqual([...thresholdYears].sort(), [2, 3, 4, 5]);
assert(thresholdInitials.size >= 12, `threshold initial-value diversity ${thresholdInitials.size} < 12`);
assert.deepEqual([...eventOrders].sort(), ["ADJUSTMENT_THEN_GROWTH", "GROWTH_THEN_ADJUSTMENT"]);
assert.deepEqual([...eventSigns].sort(), ["IN", "OUT"]);
assert(planPairs.size >= 60, `two-plan schedule diversity ${planPairs.size} < 60`);
assert(planInitials.size >= 8, `two-plan initial-value diversity ${planInitials.size} < 8`);

console.log(JSON.stringify({
  runtimeVersion: INT_CP005_RUNTIME_VERSION_V7,
  qls: INT_CP005_QL_IDS.length,
  questions,
  perLocale: questions / 3,
  replayChecks,
  verifierChecks,
  optionChecks,
  parityChecks,
  lifecycleChecks,
  wrapperChecks,
  collisionChecks,
  contextChecks,
  exactPlanMoneyChecks,
  thresholdBoundaryChecks,
  perQlFingerprints,
  perQlStems,
  thresholdRateProfiles: [...thresholdRates].sort(),
  thresholdYears: [...thresholdYears].sort(),
  thresholdInitialValues: thresholdInitials.size,
  planSchedulePairs: planPairs.size,
  planInitialValues: planInitials.size,
}, null, 2));
console.log("PASS_INT_CP005_VARIABLE_GROWTH_DECAY_V7");
