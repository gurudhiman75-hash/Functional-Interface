import assert from "node:assert/strict";
import {
  INT_CP005_QL_IDS,
  INT_CP005_RUNTIME_VERSION_V8,
  generateIntCp005QuestionV8,
  verifyIntCp005Answer,
  type IntCp005Locale,
  type IntCp005QuestionV8,
} from "./cp005-variable-growth-decay-runtime-v8";
import { generateIntCp005QuestionV7 } from "./cp005-variable-growth-decay-runtime-v7";

const LOCALES = Object.freeze(["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly IntCp005Locale[]);
const answerPositions = new Map<string, Set<number>>();
const contexts086 = new Set<string>();
const contexts088 = new Set<string>();
const thresholdProfiles = new Set<string>();
const thresholdYears = new Set<number>();
const planPairs = new Set<string>();
let questions = 0;
let sourceParityChecks = 0;
let solverVerifierChecks = 0;
let optionChecks = 0;
let lifecycleChecks = 0;
let wrapperChecks = 0;
let editorialChecks = 0;
let collisionChecks = 0;

function optionKey(question: IntCp005QuestionV8): string {
  return question.options.map((option) => `${option.value.numerator}/${option.value.denominator}:${option.misconceptionId}:${option.isCorrect}`).join("|");
}

function learnerStrings(question: IntCp005QuestionV8): readonly string[] {
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

function assertEditorial(question: IntCp005QuestionV8): void {
  const joined = learnerStrings(question).join("\n");
  assert(!joined.includes("$"), `${question.qlId}/${question.seed}/${question.locale}: legacy dollar math`);
  assert(!/₹[0-9,]+\.00\b/u.test(joined), `${question.qlId}/${question.seed}/${question.locale}: whole-rupee .00`);
  assert(!/\d+\.\d{3,}/u.test(joined), `${question.qlId}/${question.seed}/${question.locale}: >2 visible decimals`);
  assert(!/TODO|TBD|placeholder|translation pending/iu.test(joined), `${question.qlId}/${question.seed}/${question.locale}: placeholder leak`);
  assert(!/people people/iu.test(joined), `${question.qlId}/${question.seed}/${question.locale}: duplicate people noun`);
  assert(!/लोग लोग/u.test(joined), `${question.qlId}/${question.seed}/${question.locale}: duplicate Hindi लोग`);
  assert(!/ਲੋਕ ਲੋਕ/u.test(joined), `${question.qlId}/${question.seed}/${question.locale}: duplicate Punjabi ਲੋਕ`);
  assert(!/जनसंख्या [0-9,]+ लोग है/u.test(joined), `${question.qlId}/${question.seed}: awkward Hindi population grammar`);
  assert(!/ਆਬਾਦੀ [0-9,]+ ਲੋਕ ਹੈ/u.test(joined), `${question.qlId}/${question.seed}: awkward Punjabi population grammar`);
  assert(!/अंतिम मूल्य [0-9,]+ (?:लोग|इकाइयाँ) है/u.test(joined), `${question.qlId}/${question.seed}: generic Hindi final-value label survived`);
  assert(!/ਅੰਤਿਮ ਮੁੱਲ [0-9,]+ (?:ਲੋਕ|ਇਕਾਈਆਂ) ਹੈ/u.test(joined), `${question.qlId}/${question.seed}: generic Punjabi final-value label survived`);
  assert(!/प्रारंभिक मूल्य [0-9,]+ लोग/u.test(joined), `${question.qlId}/${question.seed}: generic Hindi population initial-value label survived`);
  assert(!/ਸ਼ੁਰੂਆਤੀ ਮੁੱਲ [0-9,]+ ਲੋਕ/u.test(joined), `${question.qlId}/${question.seed}: generic Punjabi population initial-value label survived`);
  editorialChecks += 12;

  if (question.locale === "hi-IN") assert(/[\u0900-\u097F]/u.test(joined), `${question.qlId}/${question.seed}: Hindi script missing`);
  if (question.locale === "pa-IN") {
    assert(/[\u0A00-\u0A7F]/u.test(joined), `${question.qlId}/${question.seed}: Punjabi script missing`);
    assert(!joined.includes("ਚੱਕਰਵੱਧੀ"), `${question.qlId}/${question.seed}: rejected Punjabi compound-interest term`);
  }

  if (question.qlId === "INT-QL-088" && question.mathematicalState.context === "SALARY") {
    if (question.locale === "en-IN") {
      assert(/salary-growth rates/iu.test(question.presentation.markdown), `${question.qlId}/${question.seed}: English salary growth rate label missing`);
      assert(!/annual compound rates/iu.test(question.presentation.markdown), `${question.qlId}/${question.seed}: English salary still described as compound interest`);
      assert(/annual salary at the beginning/iu.test(question.explanation.steps.at(-1) ?? ""), `${question.qlId}/${question.seed}: English salary final explanation not contextual`);
    } else if (question.locale === "hi-IN") {
      assert(/वेतन-वृद्धि दरों/u.test(question.presentation.markdown), `${question.qlId}/${question.seed}: Hindi salary growth rate label missing`);
      assert(!/वार्षिक चक्रवृद्धि दरों/u.test(question.presentation.markdown), `${question.qlId}/${question.seed}: Hindi salary still described as compound interest`);
      assert(/प्रारंभिक वार्षिक वेतन/u.test(question.explanation.steps.at(-1) ?? ""), `${question.qlId}/${question.seed}: Hindi salary final explanation not contextual`);
    } else {
      assert(/ਤਨਖਾਹ-ਵਾਧੇ ਦੀਆਂ ਦਰਾਂ/u.test(question.presentation.markdown), `${question.qlId}/${question.seed}: Punjabi salary growth rate label missing`);
      assert(!/ਮਿਸ਼ਰਤ ਵਿਆਜ ਦਰਾਂ/u.test(question.presentation.markdown), `${question.qlId}/${question.seed}: Punjabi salary still described as compound interest`);
      assert(/ਸ਼ੁਰੂਆਤੀ ਸਾਲਾਨਾ ਤਨਖਾਹ/u.test(question.explanation.steps.at(-1) ?? ""), `${question.qlId}/${question.seed}: Punjabi salary final explanation not contextual`);
    }
    editorialChecks += 3;
  }

  if (question.qlId === "INT-QL-086" && question.mathematicalState.context === "POPULATION") {
    const finalStep = question.explanation.steps.at(-1) ?? "";
    assert(question.locale === "en-IN" ? /final population/iu.test(finalStep) : question.locale === "hi-IN" ? /अंतिम जनसंख्या/u.test(finalStep) : /ਅੰਤਿਮ ਆਬਾਦੀ/u.test(finalStep), `${question.qlId}/${question.seed}/${question.locale}: final population explanation not contextual`);
    editorialChecks += 1;
  }

  if (question.qlId === "INT-QL-088" && question.mathematicalState.context === "POPULATION") {
    const finalStep = question.explanation.steps.at(-1) ?? "";
    assert(question.locale === "en-IN" ? /population at the beginning/iu.test(finalStep) : question.locale === "hi-IN" ? /प्रारंभिक जनसंख्या/u.test(finalStep) : /ਸ਼ੁਰੂਆਤੀ ਆਬਾਦੀ/u.test(finalStep), `${question.qlId}/${question.seed}/${question.locale}: initial population explanation not contextual`);
    editorialChecks += 1;
  }

  if (question.qlId === "INT-QL-094") {
    const finalStep = question.explanation.steps.at(-1) ?? "";
    assert(question.locale === "en-IN" ? /final population/iu.test(finalStep) : question.locale === "hi-IN" ? /अंतिम जनसंख्या/u.test(finalStep) : /ਅੰਤਿਮ ਆਬਾਦੀ/u.test(finalStep), `${question.qlId}/${question.seed}/${question.locale}: migration final explanation not contextual`);
    editorialChecks += 1;
  }

  const formulaPrefix = question.locale === "en-IN" ? "Formula:" : question.locale === "hi-IN" ? "सूत्र:" : "ਸੂਤਰ:";
  assert(question.explanation.steps[0]?.startsWith(formulaPrefix), `${question.qlId}/${question.seed}/${question.locale}: formula-first missing`);
  assert(/\\\([^\n]+\\\)/u.test(question.explanation.steps[0] ?? ""), `${question.qlId}/${question.seed}/${question.locale}: first formula wrapper missing`);
  for (const step of question.explanation.steps) {
    const outside = stripMath(step);
    assert(!/[=×÷^]/u.test(outside), `${question.qlId}/${question.seed}/${question.locale}: raw equation outside wrapper`);
    assert(!/\\(?:frac|times|div|prod|left|right)/u.test(outside), `${question.qlId}/${question.seed}/${question.locale}: raw LaTeX outside wrapper`);
    wrapperChecks += 1;
  }
}

assert.equal(INT_CP005_RUNTIME_VERSION_V8, "INT-CP-005-VARIABLE-GROWTH-DECAY-v8");
assert.equal(INT_CP005_QL_IDS.length, 10);

for (const qlId of INT_CP005_QL_IDS) {
  const positions = new Set<number>();
  answerPositions.set(qlId, positions);
  const visibleByLocale = new Map<IntCp005Locale, Map<string, string>>(LOCALES.map((locale) => [locale, new Map<string, string>()]));

  for (let index = 0; index < 100; index += 1) {
    const seed = `int-cp005-v8-audit-${qlId}-${index}`;
    const english = generateIntCp005QuestionV8(qlId, seed, "en-IN");
    assert.deepEqual(generateIntCp005QuestionV8(qlId, seed, "en-IN"), english, `${qlId}/${seed}: deterministic replay drift`);
    assert(verifyIntCp005Answer(english.mathematicalState, english.solution), `${qlId}/${seed}: independent verifier rejected solution`);
    solverVerifierChecks += 1;
    assert.equal(english.options.length, 4);
    assert.equal(new Set(english.options.map((option) => option.text)).size, 4, `${qlId}/${seed}: duplicate options`);
    assert.equal(english.options.filter((option) => option.isCorrect).length, 1);
    english.options.forEach((option, optionIndex) => {
      assert.equal(verifyIntCp005Answer(english.mathematicalState, option.value), optionIndex === english.correctIndex, `${qlId}/${seed}: option verifier ownership failure`);
      optionChecks += 1;
    });
    positions.add(english.correctIndex);

    if (qlId === "INT-QL-086") contexts086.add(english.mathematicalState.context);
    if (qlId === "INT-QL-088") contexts088.add(english.mathematicalState.context);
    if (english.mathematicalState.qlId === "INT-QL-093") {
      thresholdProfiles.add(`${english.mathematicalState.direction}:${english.mathematicalState.rate.numerator}/${english.mathematicalState.rate.denominator}`);
      thresholdYears.add(english.mathematicalState.targetYear);
    }
    if (english.mathematicalState.qlId === "INT-QL-095") {
      const r = (value: { numerator: bigint; denominator: bigint }) => `${value.numerator}/${value.denominator}`;
      planPairs.add(`${english.mathematicalState.planARates.map(r).join(",")}|${english.mathematicalState.planBRates.map(r).join(",")}`);
    }

    const englishOptionKey = optionKey(english);
    for (const locale of LOCALES) {
      const question = locale === "en-IN" ? english : generateIntCp005QuestionV8(qlId, seed, locale);
      const source = generateIntCp005QuestionV7(qlId, seed, locale);
      questions += 1;
      assert.equal(question.runtimeVersion, INT_CP005_RUNTIME_VERSION_V8);
      assert.deepEqual(question.mathematicalState, source.mathematicalState, `${qlId}/${seed}/${locale}: V8 changed mathematical state`);
      assert.equal(question.mathematicalFingerprint, source.mathematicalFingerprint, `${qlId}/${seed}/${locale}: V8 changed fingerprint`);
      assert.deepEqual(question.solution, source.solution, `${qlId}/${seed}/${locale}: V8 changed solution`);
      assert.equal(question.correctIndex, source.correctIndex, `${qlId}/${seed}/${locale}: V8 changed correct index`);
      assert.equal(optionKey(question), optionKey(source as IntCp005QuestionV8), `${qlId}/${seed}/${locale}: V8 changed option/misconception ownership`);
      assert.equal(optionKey(question), englishOptionKey, `${qlId}/${seed}/${locale}: locale option ownership drift`);
      sourceParityChecks += 6;
      assertEditorial(question);

      const map = visibleByLocale.get(locale)!;
      const previous = map.get(question.presentation.markdown);
      if (previous !== undefined) assert.equal(previous, question.mathematicalFingerprint, `${qlId}/${locale}: same visible stem maps to different mathematical state`);
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

  assert.deepEqual([...positions].sort(), [0, 1, 2, 3], `${qlId}: all answer positions not reachable`);
}

assert.deepEqual([...contexts086].sort(), ["INVESTMENT", "POPULATION", "PRODUCTION", "SALARY"]);
assert.deepEqual([...contexts088].sort(), ["INVESTMENT", "POPULATION", "SALARY"]);
assert(thresholdProfiles.size >= 12, `threshold profile diversity regressed: ${thresholdProfiles.size}`);
assert.deepEqual([...thresholdYears].sort(), [2, 3, 4, 5]);
assert(planPairs.size >= 60, `plan schedule diversity regressed: ${planPairs.size}`);

console.log(JSON.stringify({
  runtimeVersion: INT_CP005_RUNTIME_VERSION_V8,
  qls: INT_CP005_QL_IDS.length,
  questions,
  perLocale: questions / 3,
  sourceParityChecks,
  solverVerifierChecks,
  optionChecks,
  lifecycleChecks,
  wrapperChecks,
  editorialChecks,
  collisionChecks,
  thresholdProfiles: thresholdProfiles.size,
  thresholdYears: [...thresholdYears].sort(),
  planSchedulePairs: planPairs.size,
}, null, 2));
console.log("PASS_INT_CP005_VARIABLE_GROWTH_DECAY_V8");
