import assert from "node:assert/strict";
import {
  INT_CP005_QL_IDS,
  INT_CP005_RUNTIME_VERSION_V10,
  generateIntCp005QuestionV10,
  verifyIntCp005Answer,
  type IntCp005Locale,
  type IntCp005QuestionV10,
} from "./cp005-variable-growth-decay-runtime-v10";
import { generateIntCp005QuestionV9 } from "./cp005-variable-growth-decay-runtime-v9";

const LOCALES = Object.freeze(["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly IntCp005Locale[]);
const REGRESSION_PLAN_SEED = "int-cp005-v7-audit-INT-QL-095-4";
const thresholdProfiles = new Set<string>();
const thresholdYears = new Set<number>();
const planPairs = new Set<string>();
const planInitials = new Set<string>();
let questions = 0;
let replayChecks = 0;
let verifierChecks = 0;
let optionChecks = 0;
let parityChecks = 0;
let lifecycleChecks = 0;
let wrapperChecks = 0;
let editorialChecks = 0;
let sourceParityChecks = 0;
let regressionChecks = 0;
let arbitraryPlanSmokeChecks = 0;

function optionKey(question: IntCp005QuestionV10): string {
  return question.options.map((option) => `${option.value.numerator}/${option.value.denominator}:${option.misconceptionId}:${option.isCorrect}`).join("|");
}

function learnerStrings(question: IntCp005QuestionV10): readonly string[] {
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

function stripMath(text: string): string {
  return text.replace(/\\\([\s\S]*?\\\)/gu, "").replace(/\\\[[\s\S]*?\\\]/gu, "");
}

function assertSurface(question: IntCp005QuestionV10): void {
  const joined = learnerStrings(question).join("\n");
  assert(!joined.includes("$"), `${question.qlId}/${question.seed}/${question.locale}: legacy dollar math`);
  assert(!/₹[0-9,]+\.00\b/u.test(joined), `${question.qlId}/${question.seed}/${question.locale}: whole-rupee .00`);
  assert(!/\d+\.\d{3,}/u.test(joined), `${question.qlId}/${question.seed}/${question.locale}: >2 visible decimals`);
  assert(!/people people|लोग लोग|ਲੋਕ ਲੋਕ/iu.test(joined), `${question.qlId}/${question.seed}/${question.locale}: duplicate people noun`);
  assert(!/TODO|TBD|placeholder|translation pending/iu.test(joined), `${question.qlId}/${question.seed}/${question.locale}: placeholder`);
  assert(!/जनसंख्या [0-9,]+ लोग है/u.test(joined), `${question.qlId}/${question.seed}: awkward Hindi population grammar`);
  assert(!/ਆਬਾਦੀ [0-9,]+ ਲੋਕ ਹੈ/u.test(joined), `${question.qlId}/${question.seed}: awkward Punjabi population grammar`);
  if (question.locale === "hi-IN") assert(/[\u0900-\u097F]/u.test(joined), `${question.qlId}/${question.seed}: Hindi script missing`);
  if (question.locale === "pa-IN") {
    assert(/[\u0A00-\u0A7F]/u.test(joined), `${question.qlId}/${question.seed}: Punjabi script missing`);
    assert(!joined.includes("ਚੱਕਰਵੱਧੀ"), `${question.qlId}/${question.seed}: rejected Punjabi CI term`);
  }
  editorialChecks += 8;

  if (question.qlId === "INT-QL-089") {
    assert(/V_n=V_0K/u.test(question.explanation.steps[0] ?? ""), `${question.qlId}/${question.seed}/${question.locale}: K formula missing`);
    assert(!question.explanation.steps[0]?.includes("known factors"), `${question.qlId}/${question.seed}/${question.locale}: English text inside localized formula`);
    assert(question.explanation.steps.some((step) => step.includes(String.raw`\(K\)`)), `${question.qlId}/${question.seed}/${question.locale}: K definition wrapper missing`);
    editorialChecks += 3;
  }

  if (question.qlId === "INT-QL-088" && question.mathematicalState.context === "SALARY") {
    assert(!/compound factor|चक्रवृद्धि गुणक|ਮਿਸ਼ਰਤ ਗੁਣਕ/iu.test(question.explanation.commonMistake), `${question.qlId}/${question.seed}/${question.locale}: salary feedback uses compound factor`);
    assert(question.locale === "en-IN" ? /salary-growth factor/iu.test(question.explanation.commonMistake) : question.locale === "hi-IN" ? /वेतन-वृद्धि गुणक/u.test(question.explanation.commonMistake) : /ਤਨਖਾਹ-ਵਾਧਾ ਗੁਣਕ/u.test(question.explanation.commonMistake), `${question.qlId}/${question.seed}/${question.locale}: salary-growth feedback missing`);
    editorialChecks += 2;
  }

  if (question.qlId === "INT-QL-091") {
    assert(question.locale === "en-IN" ? /remaining-value factor/iu.test(question.explanation.commonMistake) : question.locale === "hi-IN" ? /शेष-मूल्य गुणक/u.test(question.explanation.commonMistake) : /ਬਚੇ-ਮੁੱਲ ਗੁਣਕ/u.test(question.explanation.commonMistake), `${question.qlId}/${question.seed}/${question.locale}: depreciation feedback not context-correct`);
    editorialChecks += 1;
  }

  if (question.qlId === "INT-QL-093") {
    assert(question.locale === "en-IN" ? /Choosing one year earlier is wrong/iu.test(question.explanation.commonMistake) : question.locale === "hi-IN" ? /एक वर्ष पहले का उत्तर चुनना गलत/u.test(question.explanation.commonMistake) : /ਇੱਕ ਸਾਲ ਪਹਿਲਾਂ ਵਾਲਾ ਉੱਤਰ ਚੁਣਨਾ ਗਲਤ/u.test(question.explanation.commonMistake), `${question.qlId}/${question.seed}/${question.locale}: threshold feedback not instructional`);
    editorialChecks += 1;
  }

  if (question.qlId === "INT-QL-086" && question.mathematicalState.context === "PRODUCTION") {
    const finalStep = question.explanation.steps.at(-1) ?? "";
    if (question.locale === "hi-IN") assert(/इकाइयों की है।$/u.test(finalStep), `${question.qlId}/${question.seed}: Hindi production grammar`);
    if (question.locale === "pa-IN") assert(/ਇਕਾਈਆਂ ਦੀ ਹੈ।$/u.test(finalStep), `${question.qlId}/${question.seed}: Punjabi production grammar`);
    editorialChecks += 1;
  }

  const prefix = question.locale === "en-IN" ? "Formula:" : question.locale === "hi-IN" ? "सूत्र:" : "ਸੂਤਰ:";
  assert(question.explanation.steps[0]?.startsWith(prefix), `${question.qlId}/${question.seed}/${question.locale}: formula-first missing`);
  assert(question.explanation.steps[0]?.includes(String.raw`\(`), `${question.qlId}/${question.seed}/${question.locale}: first Examtree wrapper missing`);
  for (const step of question.explanation.steps) {
    const outside = stripMath(step);
    assert(!/[=×÷^]/u.test(outside), `${question.qlId}/${question.seed}/${question.locale}: raw equation outside wrapper`);
    assert(!/\\(?:frac|times|div|prod|left|right)/u.test(outside), `${question.qlId}/${question.seed}/${question.locale}: raw LaTeX outside wrapper`);
    wrapperChecks += 1;
  }

  if (question.qlId === "INT-QL-095") {
    for (const option of question.options) {
      assert.equal(option.value.denominator, 1n, `${question.qlId}/${question.seed}/${question.locale}: fractional plan option`);
      assert(/^₹[0-9,]+$/u.test(option.text), `${question.qlId}/${question.seed}/${question.locale}: non-whole-rupee plan option text`);
    }
  }
}

assert.equal(INT_CP005_RUNTIME_VERSION_V10, "INT-CP-005-VARIABLE-GROWTH-DECAY-v10");
assert.equal(INT_CP005_QL_IDS.length, 10);

for (const qlId of INT_CP005_QL_IDS) {
  const positions = new Set<number>();
  for (let index = 0; index < 100; index += 1) {
    const seed = `int-cp005-v10-release-${qlId}-${index}`;
    const english = generateIntCp005QuestionV10(qlId, seed, "en-IN");
    assert.deepEqual(generateIntCp005QuestionV10(qlId, seed, "en-IN"), english, `${qlId}/${seed}: replay drift`);
    replayChecks += 1;
    assert(verifyIntCp005Answer(english.mathematicalState, english.solution), `${qlId}/${seed}: solution verifier failure`);
    verifierChecks += 1;
    assert.equal(english.options.length, 4);
    assert.equal(new Set(english.options.map((option) => option.text)).size, 4, `${qlId}/${seed}: duplicate options`);
    english.options.forEach((option, optionIndex) => {
      assert.equal(verifyIntCp005Answer(english.mathematicalState, option.value), optionIndex === english.correctIndex, `${qlId}/${seed}: option ownership failure`);
      optionChecks += 1;
    });
    positions.add(english.correctIndex);

    if (english.mathematicalState.qlId === "INT-QL-093") {
      thresholdProfiles.add(`${english.mathematicalState.direction}:${english.mathematicalState.rate.numerator}/${english.mathematicalState.rate.denominator}:${english.mathematicalState.targetYear}:${english.mathematicalState.initial.numerator}`);
      thresholdYears.add(english.mathematicalState.targetYear);
    }
    if (english.mathematicalState.qlId === "INT-QL-095") {
      const r = (value: { numerator: bigint; denominator: bigint }) => `${value.numerator}/${value.denominator}`;
      planPairs.add(`${english.mathematicalState.planARates.map(r).join(",")}|${english.mathematicalState.planBRates.map(r).join(",")}`);
      planInitials.add(r(english.mathematicalState.initial));
    }

    const canonicalOptions = optionKey(english);
    for (const locale of LOCALES) {
      const question = locale === "en-IN" ? english : generateIntCp005QuestionV10(qlId, seed, locale);
      questions += 1;
      assert.deepEqual(question.mathematicalState, english.mathematicalState, `${qlId}/${seed}/${locale}: locale state drift`);
      assert.deepEqual(question.solution, english.solution, `${qlId}/${seed}/${locale}: locale solution drift`);
      assert.equal(question.correctIndex, english.correctIndex, `${qlId}/${seed}/${locale}: locale correct-index drift`);
      assert.equal(optionKey(question), canonicalOptions, `${qlId}/${seed}/${locale}: locale option drift`);
      parityChecks += 4;
      assertSurface(question);

      if (qlId !== "INT-QL-095") {
        const v9 = generateIntCp005QuestionV9(qlId, seed, locale);
        assert.deepEqual(question.mathematicalState, v9.mathematicalState, `${qlId}/${seed}/${locale}: V10 changed non-plan state`);
        assert.equal(question.mathematicalFingerprint, v9.mathematicalFingerprint, `${qlId}/${seed}/${locale}: V10 changed non-plan fingerprint`);
        assert.equal(optionKey(question), optionKey(v9 as IntCp005QuestionV10), `${qlId}/${seed}/${locale}: V10 changed non-plan options`);
        sourceParityChecks += 3;
      }

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
  assert.deepEqual([...positions].sort(), [0, 1, 2, 3], `${qlId}: all answer positions not reachable`);
}

assert(thresholdProfiles.size >= 50, `threshold diversity regressed: ${thresholdProfiles.size}`);
assert.deepEqual([...thresholdYears].sort(), [2, 3, 4, 5]);
assert(planPairs.size >= 60, `plan schedule diversity regressed: ${planPairs.size}`);
assert(planInitials.size >= 8, `plan initial-value diversity regressed: ${planInitials.size}`);

for (const locale of LOCALES) {
  const q = generateIntCp005QuestionV10("INT-QL-095", REGRESSION_PLAN_SEED, locale);
  assert(verifyIntCp005Answer(q.mathematicalState, q.solution));
  assert.equal(q.options.length, 4);
  q.options.forEach((option) => assert.equal(option.value.denominator, 1n));
  assertSurface(q);
  regressionChecks += 1;
}

for (let index = 0; index < 500; index += 1) {
  const seed = `int-cp005-v10-plan-smoke-${index}`;
  const q = generateIntCp005QuestionV10("INT-QL-095", seed, "en-IN");
  assert(verifyIntCp005Answer(q.mathematicalState, q.solution), `${seed}: invalid solution`);
  assert.equal(q.options.length, 4);
  assert.equal(new Set(q.options.map((option) => option.text)).size, 4, `${seed}: duplicate options`);
  q.options.forEach((option, optionIndex) => {
    assert.equal(option.value.denominator, 1n, `${seed}: fractional option`);
    assert.equal(verifyIntCp005Answer(q.mathematicalState, option.value), optionIndex === q.correctIndex, `${seed}: option ownership`);
  });
  arbitraryPlanSmokeChecks += 1;
}

console.log(JSON.stringify({ runtimeVersion: INT_CP005_RUNTIME_VERSION_V10, qls: 10, questions, perLocale: questions / 3, replayChecks, verifierChecks, optionChecks, parityChecks, lifecycleChecks, wrapperChecks, editorialChecks, sourceParityChecks, regressionChecks, arbitraryPlanSmokeChecks, thresholdStates: thresholdProfiles.size, thresholdYears: [...thresholdYears].sort(), planSchedulePairs: planPairs.size, planInitialValues: planInitials.size }, null, 2));
console.log("PASS_INT_CP005_VARIABLE_GROWTH_DECAY_V10_RELEASE");
