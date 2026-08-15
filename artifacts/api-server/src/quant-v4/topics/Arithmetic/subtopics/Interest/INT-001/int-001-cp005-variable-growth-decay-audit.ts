import assert from "node:assert/strict";
import {
  INT_CP005_QL_IDS,
  INT_CP005_REGISTRY,
  INT_CP005_SOURCE_SATURATION,
  generateIntCp005Question,
  verifyIntCp005Answer,
  type IntCp005Locale,
  type IntCp005Question,
} from "./cp005-variable-growth-decay-runtime";

const LOCALES = Object.freeze(["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly IntCp005Locale[]);
const positions = new Map<string, Set<number>>();
const contexts086 = new Set<string>();
const contexts090 = new Set<string>();
const thresholdDirections = new Set<string>();
const eventOrders = new Set<string>();
const eventAdjustmentSigns = new Set<string>();
const representations = new Set<string>();
const fingerprints = new Set<string>();
let questions = 0;
let verifierChecks = 0;
let replayChecks = 0;
let optionChecks = 0;
let localeParityChecks = 0;
let wrapperChecks = 0;
let decimalChecks = 0;
let lifecycleChecks = 0;
let scriptChecks = 0;
let formulaFirstChecks = 0;
let oldPunjabiTermChecks = 0;

function learnerStrings(question: IntCp005Question): string[] {
  return [
    question.presentation.markdown,
    question.presentation.prompt,
    ...question.options.flatMap((option) => [option.text, option.studentFeedback]),
    question.explanation.keyIdea,
    ...question.explanation.steps,
    question.explanation.finalAnswer,
    question.explanation.commonMistake,
  ];
}

function stripWrappedMath(text: string): string {
  return text
    .replace(/\\\([\s\S]*?\\\)/gu, "")
    .replace(/\\\[[\s\S]*?\\\]/gu, "");
}

function assertLearnerSurface(question: IntCp005Question): void {
  const strings = learnerStrings(question);
  const joined = strings.join("\n");
  assert(!joined.includes("$"), `${question.qlId}/${question.seed}/${question.locale}: legacy dollar delimiter`);
  wrapperChecks += strings.length;

  for (const step of question.explanation.steps) {
    const outside = stripWrappedMath(step);
    assert(!/[=×÷^]/u.test(outside), `${question.qlId}/${question.seed}/${question.locale}: raw equation operator outside wrapper: ${outside}`);
    assert(!/\\(?:frac|times|div|prod|left|right)/u.test(outside), `${question.qlId}/${question.seed}/${question.locale}: raw LaTeX command outside wrapper: ${outside}`);
  }

  assert(!/\d+\.\d{3,}/u.test(joined), `${question.qlId}/${question.seed}/${question.locale}: >2 visible decimal places`);
  assert(!/₹[0-9,]+\.00\b/u.test(joined), `${question.qlId}/${question.seed}/${question.locale}: whole-rupee .00 display`);
  assert(!/[eE][+-]?\d{2,}/u.test(joined), `${question.qlId}/${question.seed}/${question.locale}: scientific notation leak`);
  decimalChecks += strings.length;

  const formulaPrefix = question.locale === "en-IN" ? "Formula:" : question.locale === "hi-IN" ? "सूत्र:" : "ਸੂਤਰ:";
  assert(question.explanation.steps[0]?.startsWith(formulaPrefix), `${question.qlId}/${question.seed}/${question.locale}: formula-first step missing`);
  assert(/\\\([^\n]+\\\)/u.test(question.explanation.steps[0] ?? ""), `${question.qlId}/${question.seed}/${question.locale}: first step lacks Examtree math wrapper`);
  formulaFirstChecks += 1;

  if (question.locale === "hi-IN") {
    assert(/[\u0900-\u097F]/u.test(joined), `${question.qlId}/${question.seed}: Hindi script missing`);
    scriptChecks += 1;
  }
  if (question.locale === "pa-IN") {
    assert(/[\u0A00-\u0A7F]/u.test(joined), `${question.qlId}/${question.seed}: Punjabi script missing`);
    assert(!joined.includes("ਚੱਕਰਵੱਧੀ"), `${question.qlId}/${question.seed}: rejected Punjabi compound-interest term`);
    oldPunjabiTermChecks += 1;
    scriptChecks += 1;
  }
}

function optionValueKey(question: IntCp005Question): string {
  return question.options.map((option) => `${option.value.numerator}/${option.value.denominator}:${option.misconceptionId}:${option.isCorrect}`).join("|");
}

assert.equal(INT_CP005_QL_IDS.length, 10, "CP005 permanent QL count drifted");
assert.deepEqual(INT_CP005_QL_IDS, ["INT-QL-086", "INT-QL-087", "INT-QL-088", "INT-QL-089", "INT-QL-090", "INT-QL-091", "INT-QL-092", "INT-QL-093", "INT-QL-094", "INT-QL-095"]);
assert.equal(INT_CP005_REGISTRY.length, 10, "registry count mismatch");
assert.equal(new Set(INT_CP005_REGISTRY.map((entry) => entry.qlId)).size, 10, "duplicate registry QL");
assert.equal(INT_CP005_SOURCE_SATURATION.permanentQlCount, 10);
assert.equal(INT_CP005_SOURCE_SATURATION.legacyFamiliesRecovered.length, 8);

for (const qlId of INT_CP005_QL_IDS) {
  positions.set(qlId, new Set<number>());
  const visibleByLocale = new Map<IntCp005Locale, Set<string>>(LOCALES.map((locale) => [locale, new Set<string>()]));

  for (let index = 0; index < 100; index += 1) {
    const seed = `int-cp005-audit-${qlId}-${index}`;
    const english = generateIntCp005Question(qlId, seed, "en-IN");
    const replay = generateIntCp005Question(qlId, seed, "en-IN");
    assert.deepEqual(replay, english, `${qlId}/${seed}: deterministic replay failed`);
    replayChecks += 1;

    assert(verifyIntCp005Answer(english.mathematicalState, english.solution), `${qlId}/${seed}: independent verifier rejected solution`);
    verifierChecks += 1;
    assert.equal(english.options.length, 4, `${qlId}/${seed}: must have four options`);
    assert.equal(english.options.filter((option) => option.isCorrect).length, 1, `${qlId}/${seed}: one correct option required`);
    assert.equal(english.correctIndex, english.options.findIndex((option) => option.isCorrect), `${qlId}/${seed}: correct index mismatch`);
    assert.equal(new Set(english.options.map((option) => option.text)).size, 4, `${qlId}/${seed}: duplicate displayed options`);
    assert(verifyIntCp005Answer(english.mathematicalState, english.options[english.correctIndex]!.value), `${qlId}/${seed}: correct option does not verify`);
    english.options.forEach((option, optionIndex) => {
      if (optionIndex !== english.correctIndex) assert(!verifyIntCp005Answer(english.mathematicalState, option.value), `${qlId}/${seed}: distractor also verifies`);
    });
    optionChecks += 4;
    positions.get(qlId)!.add(english.correctIndex);
    representations.add(`${qlId}:${english.representation}`);
    fingerprints.add(english.mathematicalFingerprint);

    if (qlId === "INT-QL-086") contexts086.add(english.mathematicalState.context);
    if (qlId === "INT-QL-090") contexts090.add(english.mathematicalState.context);
    if (qlId === "INT-QL-093" && english.mathematicalState.qlId === "INT-QL-093") thresholdDirections.add(english.mathematicalState.direction);
    if (qlId === "INT-QL-094" && english.mathematicalState.qlId === "INT-QL-094") {
      eventOrders.add(english.mathematicalState.eventOrder);
      eventAdjustmentSigns.add(english.mathematicalState.adjustment.numerator >= 0n ? "IN" : "OUT");
    }

    let canonicalOptionKey = optionValueKey(english);
    for (const locale of LOCALES) {
      const question = locale === "en-IN" ? english : generateIntCp005Question(qlId, seed, locale);
      questions += 1;
      assert.equal(question.mathematicalFingerprint, english.mathematicalFingerprint, `${qlId}/${seed}/${locale}: mathematical fingerprint drift`);
      assert.deepEqual(question.mathematicalState, english.mathematicalState, `${qlId}/${seed}/${locale}: mathematical state drift`);
      assert.equal(question.solution.numerator, english.solution.numerator, `${qlId}/${seed}/${locale}: solution numerator drift`);
      assert.equal(question.solution.denominator, english.solution.denominator, `${qlId}/${seed}/${locale}: solution denominator drift`);
      assert.equal(question.correctIndex, english.correctIndex, `${qlId}/${seed}/${locale}: option order drift`);
      assert.equal(optionValueKey(question), canonicalOptionKey, `${qlId}/${seed}/${locale}: option value/misconception ownership drift`);
      localeParityChecks += 6;
      assertLearnerSurface(question);
      visibleByLocale.get(locale)!.add(question.presentation.markdown);

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

  assert.deepEqual([...positions.get(qlId)!].sort(), [0, 1, 2, 3], `${qlId}: all answer positions must be reachable`);
  for (const locale of LOCALES) {
    assert((visibleByLocale.get(locale)?.size ?? 0) >= 45, `${qlId}/${locale}: insufficient visible diversity`);
  }
}

assert.deepEqual([...contexts086].sort(), ["INVESTMENT", "POPULATION", "PRODUCTION", "SALARY"], "QL086 context variants not saturated");
assert.deepEqual([...contexts090].sort(), ["ASSET", "MACHINE", "VEHICLE"], "QL090 depreciation contexts not saturated");
assert.deepEqual([...thresholdDirections].sort(), ["DECAY", "GROWTH"], "threshold growth/decay directions not both reached");
assert.deepEqual([...eventOrders].sort(), ["ADJUSTMENT_THEN_GROWTH", "GROWTH_THEN_ADJUSTMENT"], "event-order variants not both reached");
assert.deepEqual([...eventAdjustmentSigns].sort(), ["IN", "OUT"], "migration-in/out variants not both reached");
assert(representations.has("INT-QL-086:STANDARD_PROSE") && representations.has("INT-QL-086:RATE_TABLE"), "variable-rate prose/table coverage missing");
assert(representations.has("INT-QL-095:COMPARISON_TABLE"), "plan comparison table missing");
assert(fingerprints.size >= 750, `numeric/state diversity too low: ${fingerprints.size}`);

const summary = {
  runtimeVersion: "INT-CP-005-VARIABLE-GROWTH-DECAY-v1",
  qls: INT_CP005_QL_IDS.length,
  questions,
  perLocale: questions / 3,
  verifierChecks,
  replayChecks,
  optionChecks,
  localeParityChecks,
  wrapperChecks,
  decimalChecks,
  lifecycleChecks,
  scriptChecks,
  formulaFirstChecks,
  oldPunjabiTermChecks,
  uniqueMathematicalFingerprints: fingerprints.size,
  contexts086: [...contexts086].sort(),
  contexts090: [...contexts090].sort(),
  thresholdDirections: [...thresholdDirections].sort(),
  eventOrders: [...eventOrders].sort(),
  eventAdjustmentSigns: [...eventAdjustmentSigns].sort(),
};

console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP005_VARIABLE_GROWTH_DECAY_V1");
