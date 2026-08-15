import assert from "node:assert/strict";
import {
  INT_CP005_QL_IDS,
  INT_CP005_RUNTIME_VERSION_V9,
  generateIntCp005QuestionV9,
  verifyIntCp005Answer,
  type IntCp005Locale,
  type IntCp005QuestionV9,
} from "./cp005-variable-growth-decay-runtime-v9";
import { generateIntCp005QuestionV8 } from "./cp005-variable-growth-decay-runtime-v8";

const LOCALES = Object.freeze(["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly IntCp005Locale[]);
let questions = 0;
let sourceParityChecks = 0;
let verifierChecks = 0;
let optionChecks = 0;
let wrapperChecks = 0;
let lifecycleChecks = 0;
let editorialChecks = 0;
let highSalaryChecks = 0;
const positions = new Map<string, Set<number>>();
const thresholdProfiles = new Set<string>();
const planPairs = new Set<string>();

function optionKey(question: IntCp005QuestionV9): string {
  return question.options.map((option) => `${option.value.numerator}/${option.value.denominator}:${option.misconceptionId}:${option.isCorrect}`).join("|");
}

function learnerStrings(question: IntCp005QuestionV9): readonly string[] {
  return [question.presentation.markdown, question.presentation.prompt, ...question.options.flatMap((option) => [option.text, option.studentFeedback]), question.explanation.keyIdea, ...question.explanation.steps, question.explanation.finalAnswer, question.explanation.commonMistake];
}

function stripMath(text: string): string {
  return text.replace(/\\\([\s\S]*?\\\)/gu, "").replace(/\\\[[\s\S]*?\\\]/gu, "");
}

function isAtLeastRupees(value: { numerator: bigint; denominator: bigint }, rupees: bigint): boolean {
  return value.numerator >= rupees * value.denominator;
}

function assertEditorial(question: IntCp005QuestionV9): void {
  const joined = learnerStrings(question).join("\n");
  assert(!joined.includes("$"), `${question.qlId}/${question.seed}/${question.locale}: dollar delimiter`);
  assert(!/₹[0-9,]+\.00\b/u.test(joined), `${question.qlId}/${question.seed}/${question.locale}: whole-rupee .00`);
  assert(!/\d+\.\d{3,}/u.test(joined), `${question.qlId}/${question.seed}/${question.locale}: >2 visible decimals`);
  assert(!/लोग लोग|ਲੋਕ ਲੋਕ|people people/iu.test(joined), `${question.qlId}/${question.seed}/${question.locale}: duplicated people noun`);
  assert(!/TODO|TBD|placeholder|translation pending/iu.test(joined), `${question.qlId}/${question.seed}/${question.locale}: placeholder`);
  if (question.locale === "pa-IN") assert(!joined.includes("ਚੱਕਰਵੱਧੀ"), `${question.qlId}/${question.seed}: old Punjabi CI term`);
  editorialChecks += 6;

  if (question.qlId === "INT-QL-089") {
    assert(!question.explanation.steps[0]?.includes("known factors"), `${question.qlId}/${question.seed}/${question.locale}: English known-factors phrase survived formula`);
    assert(/V_n=V_0K/u.test(question.explanation.steps[0] ?? ""), `${question.qlId}/${question.seed}/${question.locale}: K-formula missing`);
    assert(question.explanation.steps.some((step) => /\\\(K\\\)/u.test(step)), `${question.qlId}/${question.seed}/${question.locale}: K definition missing`);
    if (question.locale === "hi-IN") assert(question.explanation.steps.some((step) => /ज्ञात वर्षों के वृद्धि-गुणकों/u.test(step)), `${question.qlId}/${question.seed}: Hindi K definition not localized`);
    if (question.locale === "pa-IN") assert(question.explanation.steps.some((step) => /ਜਾਣੇ ਹੋਏ ਸਾਲਾਂ ਦੇ ਵਾਧੇ-ਗੁਣਕਾਂ/u.test(step)), `${question.qlId}/${question.seed}: Punjabi K definition not localized`);
    editorialChecks += 4;
  }

  if (question.qlId === "INT-QL-088" && question.mathematicalState.context === "SALARY") {
    assert(!/compound factor|चक्रवृद्धि गुणक|ਮਿਸ਼ਰਤ ਗੁਣਕ/iu.test(question.explanation.commonMistake), `${question.qlId}/${question.seed}/${question.locale}: salary feedback still uses compound-interest factor`);
    assert(question.locale === "en-IN" ? /salary-growth factor/iu.test(question.explanation.commonMistake) : question.locale === "hi-IN" ? /वेतन-वृद्धि गुणक/u.test(question.explanation.commonMistake) : /ਤਨਖਾਹ-ਵਾਧਾ ਗੁਣਕ/u.test(question.explanation.commonMistake), `${question.qlId}/${question.seed}/${question.locale}: salary-growth feedback missing`);
    const highValue = isAtLeastRupees(question.mathematicalState.initial, 2_000_000n) || isAtLeastRupees(question.mathematicalState.finalValue, 2_000_000n);
    if (highValue) {
      assert(question.locale === "en-IN" ? /senior executive/iu.test(question.presentation.markdown) : question.locale === "hi-IN" ? /वरिष्ठ अधिकारी/u.test(question.presentation.markdown) : /ਸੀਨੀਅਰ ਅਧਿਕਾਰੀ/u.test(question.presentation.markdown), `${question.qlId}/${question.seed}/${question.locale}: high salary still uses generic employee`);
      highSalaryChecks += 1;
    }
    editorialChecks += 2;
  }

  if (question.qlId === "INT-QL-091") {
    assert(!/compound factor|चक्रवृद्धि गुणक|ਮਿਸ਼ਰਤ ਗੁਣਕ/iu.test(question.explanation.commonMistake), `${question.qlId}/${question.seed}/${question.locale}: depreciation feedback uses compound factor`);
    assert(question.locale === "en-IN" ? /remaining-value factor/iu.test(question.explanation.commonMistake) : question.locale === "hi-IN" ? /शेष-मूल्य गुणक/u.test(question.explanation.commonMistake) : /ਬਚੇ-ਮੁੱਲ ਗੁਣਕ/u.test(question.explanation.commonMistake), `${question.qlId}/${question.seed}/${question.locale}: remaining-value feedback missing`);
    editorialChecks += 2;
  }

  if (question.qlId === "INT-QL-093") {
    assert(question.locale === "en-IN" ? /Choosing one year earlier is wrong/iu.test(question.explanation.commonMistake) : question.locale === "hi-IN" ? /एक वर्ष पहले का उत्तर चुनना गलत/u.test(question.explanation.commonMistake) : /ਇੱਕ ਸਾਲ ਪਹਿਲਾਂ ਵਾਲਾ ਉੱਤਰ ਚੁਣਨਾ ਗਲਤ/u.test(question.explanation.commonMistake), `${question.qlId}/${question.seed}/${question.locale}: threshold feedback is not instructional`);
    editorialChecks += 1;
  }

  if (question.qlId === "INT-QL-086" && question.mathematicalState.context === "PRODUCTION") {
    const finalStep = question.explanation.steps.at(-1) ?? "";
    if (question.locale === "hi-IN") assert(/इकाइयों की है।$/u.test(finalStep), `${question.qlId}/${question.seed}: Hindi production grammar not polished`);
    if (question.locale === "pa-IN") assert(/ਇਕਾਈਆਂ ਦੀ ਹੈ।$/u.test(finalStep), `${question.qlId}/${question.seed}: Punjabi production grammar not polished`);
    editorialChecks += 1;
  }

  const prefix = question.locale === "en-IN" ? "Formula:" : question.locale === "hi-IN" ? "सूत्र:" : "ਸੂਤਰ:";
  assert(question.explanation.steps[0]?.startsWith(prefix), `${question.qlId}/${question.seed}/${question.locale}: formula-first missing`);
  for (const step of question.explanation.steps) {
    const outside = stripMath(step);
    assert(!/[=×÷^]/u.test(outside), `${question.qlId}/${question.seed}/${question.locale}: raw math operator outside wrapper`);
    assert(!/\\(?:frac|times|div|prod|left|right)/u.test(outside), `${question.qlId}/${question.seed}/${question.locale}: raw LaTeX outside wrapper`);
    wrapperChecks += 1;
  }
}

assert.equal(INT_CP005_RUNTIME_VERSION_V9, "INT-CP-005-VARIABLE-GROWTH-DECAY-v9");
assert.equal(INT_CP005_QL_IDS.length, 10);

for (const qlId of INT_CP005_QL_IDS) {
  const qlPositions = new Set<number>();
  positions.set(qlId, qlPositions);
  for (let index = 0; index < 100; index += 1) {
    const seed = `int-cp005-v9-audit-${qlId}-${index}`;
    const english = generateIntCp005QuestionV9(qlId, seed, "en-IN");
    assert.deepEqual(generateIntCp005QuestionV9(qlId, seed, "en-IN"), english, `${qlId}/${seed}: replay drift`);
    assert(verifyIntCp005Answer(english.mathematicalState, english.solution), `${qlId}/${seed}: solution verifier failure`);
    verifierChecks += 1;
    assert.equal(english.options.length, 4);
    assert.equal(new Set(english.options.map((option) => option.text)).size, 4, `${qlId}/${seed}: duplicate options`);
    english.options.forEach((option, optionIndex) => {
      assert.equal(verifyIntCp005Answer(english.mathematicalState, option.value), optionIndex === english.correctIndex, `${qlId}/${seed}: option ownership failure`);
      optionChecks += 1;
    });
    qlPositions.add(english.correctIndex);

    if (english.mathematicalState.qlId === "INT-QL-093") thresholdProfiles.add(`${english.mathematicalState.direction}:${english.mathematicalState.rate.numerator}/${english.mathematicalState.rate.denominator}:${english.mathematicalState.targetYear}`);
    if (english.mathematicalState.qlId === "INT-QL-095") {
      const r = (value: { numerator: bigint; denominator: bigint }) => `${value.numerator}/${value.denominator}`;
      planPairs.add(`${english.mathematicalState.planARates.map(r).join(",")}|${english.mathematicalState.planBRates.map(r).join(",")}`);
    }

    const englishOptions = optionKey(english);
    for (const locale of LOCALES) {
      const question = locale === "en-IN" ? english : generateIntCp005QuestionV9(qlId, seed, locale);
      const source = generateIntCp005QuestionV8(qlId, seed, locale);
      questions += 1;
      assert.deepEqual(question.mathematicalState, source.mathematicalState, `${qlId}/${seed}/${locale}: V9 changed state`);
      assert.equal(question.mathematicalFingerprint, source.mathematicalFingerprint, `${qlId}/${seed}/${locale}: V9 changed fingerprint`);
      assert.deepEqual(question.solution, source.solution, `${qlId}/${seed}/${locale}: V9 changed solution`);
      assert.equal(question.correctIndex, source.correctIndex, `${qlId}/${seed}/${locale}: V9 changed correct index`);
      assert.equal(optionKey(question), optionKey(source as IntCp005QuestionV9), `${qlId}/${seed}/${locale}: V9 changed option ownership`);
      assert.equal(optionKey(question), englishOptions, `${qlId}/${seed}/${locale}: locale option drift`);
      sourceParityChecks += 6;
      assertEditorial(question);

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
  assert.deepEqual([...qlPositions].sort(), [0, 1, 2, 3], `${qlId}: all answer positions not reachable`);
}

assert(thresholdProfiles.size >= 50, `threshold diversity regressed: ${thresholdProfiles.size}`);
assert(planPairs.size >= 60, `plan diversity regressed: ${planPairs.size}`);
assert(highSalaryChecks > 0, "high-salary realism guard did not execute");

console.log(JSON.stringify({ runtimeVersion: INT_CP005_RUNTIME_VERSION_V9, qls: 10, questions, perLocale: questions / 3, sourceParityChecks, verifierChecks, optionChecks, wrapperChecks, lifecycleChecks, editorialChecks, highSalaryChecks, thresholdProfiles: thresholdProfiles.size, planSchedulePairs: planPairs.size }, null, 2));
console.log("PASS_INT_CP005_VARIABLE_GROWTH_DECAY_V9");
