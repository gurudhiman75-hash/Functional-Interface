import assert from "node:assert/strict";
import {
  INT_CP005_QL_IDS,
  INT_CP005_RUNTIME_VERSION_V4,
  generateIntCp005QuestionV4,
  verifyIntCp005Answer,
  type IntCp005Locale,
  type IntCp005QuestionV4,
} from "./cp005-variable-growth-decay-runtime-v4";

const LOCALES = Object.freeze(["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly IntCp005Locale[]);
const contexts086 = new Set<string>();
const contexts088 = new Set<string>();
const contexts090 = new Set<string>();
const thresholdDirections = new Set<string>();
const thresholdRates = new Set<string>();
const thresholdYears = new Set<number>();
const eventOrders = new Set<string>();
const eventSigns = new Set<string>();
const answerPositions = new Map<string, Set<number>>();
const perQlFingerprints: Record<string, number> = {};
const perQlStems: Record<string, Record<string, number>> = {};
let questions = 0;
let replayChecks = 0;
let verifierChecks = 0;
let optionChecks = 0;
let parityChecks = 0;
let lifecycleChecks = 0;
let wrapperChecks = 0;
let contextChecks = 0;
let collisionChecks = 0;

function learnerStrings(question: IntCp005QuestionV4): readonly string[] {
  return [question.presentation.markdown, question.presentation.prompt, ...question.options.flatMap((option) => [option.text, option.studentFeedback]), question.explanation.keyIdea, ...question.explanation.steps, question.explanation.finalAnswer, question.explanation.commonMistake];
}

function optionKey(question: IntCp005QuestionV4): string {
  return question.options.map((option) => `${option.value.numerator}/${option.value.denominator}:${option.misconceptionId}:${option.isCorrect}`).join("|");
}

function stripMath(text: string): string {
  return text.replace(/\\\([\s\S]*?\\\)/gu, "").replace(/\\\[[\s\S]*?\\\]/gu, "");
}

function assertSurface(question: IntCp005QuestionV4): void {
  const joined = learnerStrings(question).join("\n");
  assert(!joined.includes("$"), `${question.qlId}/${question.seed}/${question.locale}: legacy dollar math`);
  assert(!/₹[0-9,]+\.00\b/u.test(joined), `${question.qlId}/${question.seed}/${question.locale}: whole rupee .00`);
  assert(!/\d+\.\d{3,}/u.test(joined), `${question.qlId}/${question.seed}/${question.locale}: >2 visible decimals`);
  assert(!/people people/iu.test(joined), `${question.qlId}/${question.seed}/${question.locale}: duplicate people noun`);
  assert(!/TODO|TBD|placeholder|translation pending/iu.test(joined), `${question.qlId}/${question.seed}/${question.locale}: placeholder leak`);
  if (question.locale === "hi-IN") assert(/[\u0900-\u097F]/u.test(joined), `${question.qlId}/${question.seed}: Hindi script missing`);
  if (question.locale === "pa-IN") {
    assert(/[\u0A00-\u0A7F]/u.test(joined), `${question.qlId}/${question.seed}: Punjabi script missing`);
    assert(!joined.includes("ਚੱਕਰਵੱਧੀ"), `${question.qlId}/${question.seed}: old Punjabi CI term`);
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
}

assert.equal(INT_CP005_RUNTIME_VERSION_V4, "INT-CP-005-VARIABLE-GROWTH-DECAY-v4");
assert.equal(INT_CP005_QL_IDS.length, 10);

for (const qlId of INT_CP005_QL_IDS) {
  const fingerprints = new Set<string>();
  const stems = new Map<IntCp005Locale, Map<string, string>>(LOCALES.map((locale) => [locale, new Map<string, string>()]));
  const positions = new Set<number>();
  answerPositions.set(qlId, positions);

  for (let index = 0; index < 100; index += 1) {
    const seed = `int-cp005-v4-audit-${qlId}-${index}`;
    const english = generateIntCp005QuestionV4(qlId, seed, "en-IN");
    assert.deepEqual(generateIntCp005QuestionV4(qlId, seed, "en-IN"), english, `${qlId}/${seed}: replay drift`);
    replayChecks += 1;
    assert(verifyIntCp005Answer(english.mathematicalState, english.solution), `${qlId}/${seed}: solution fails verifier`);
    verifierChecks += 1;
    assert.equal(english.options.length, 4);
    assert.equal(new Set(english.options.map((option) => option.text)).size, 4, `${qlId}/${seed}: duplicate options`);
    assert.equal(english.options.filter((option) => option.isCorrect).length, 1);
    english.options.forEach((option, optionIndex) => {
      assert.equal(verifyIntCp005Answer(english.mathematicalState, option.value), optionIndex === english.correctIndex, `${qlId}/${seed}: option ownership mismatch`);
      optionChecks += 1;
    });
    positions.add(english.correctIndex);
    fingerprints.add(english.mathematicalFingerprint);

    if (qlId === "INT-QL-086") contexts086.add(english.mathematicalState.context);
    if (qlId === "INT-QL-088") contexts088.add(english.mathematicalState.context);
    if (qlId === "INT-QL-090") contexts090.add(english.mathematicalState.context);
    if (english.mathematicalState.qlId === "INT-QL-093") {
      thresholdDirections.add(english.mathematicalState.direction);
      thresholdRates.add(`${english.mathematicalState.direction}:${english.mathematicalState.rate.numerator}/${english.mathematicalState.rate.denominator}`);
      thresholdYears.add(english.mathematicalState.targetYear);
    }
    if (english.mathematicalState.qlId === "INT-QL-094") {
      eventOrders.add(english.mathematicalState.eventOrder);
      eventSigns.add(english.mathematicalState.adjustment.numerator >= 0n ? "IN" : "OUT");
    }

    const canonicalOptions = optionKey(english);
    for (const locale of LOCALES) {
      const question = locale === "en-IN" ? english : generateIntCp005QuestionV4(qlId, seed, locale);
      questions += 1;
      assert.equal(question.runtimeVersion, INT_CP005_RUNTIME_VERSION_V4);
      assert.deepEqual(question.mathematicalState, english.mathematicalState, `${qlId}/${seed}/${locale}: state drift`);
      assert.deepEqual(question.solution, english.solution, `${qlId}/${seed}/${locale}: solution drift`);
      assert.equal(question.correctIndex, english.correctIndex, `${qlId}/${seed}/${locale}: answer position drift`);
      assert.equal(optionKey(question), canonicalOptions, `${qlId}/${seed}/${locale}: option ownership drift`);
      parityChecks += 4;
      assertSurface(question);

      const map = stems.get(locale)!;
      const previous = map.get(question.presentation.markdown);
      if (previous !== undefined) assert.equal(previous, question.mathematicalFingerprint, `${qlId}/${locale}: visible stem collision across different states`);
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
  const minimumStates = qlId === "INT-QL-093" ? 16 : 20;
  assert(fingerprints.size >= minimumStates, `${qlId}: mathematical-state diversity ${fingerprints.size} < ${minimumStates}`);
  perQlFingerprints[qlId] = fingerprints.size;
  perQlStems[qlId] = Object.fromEntries(LOCALES.map((locale) => [locale, stems.get(locale)!.size]));
}

assert.deepEqual([...contexts086].sort(), ["INVESTMENT", "POPULATION", "PRODUCTION", "SALARY"]);
assert.deepEqual([...contexts088].sort(), ["INVESTMENT", "POPULATION", "SALARY"]);
assert.deepEqual([...contexts090].sort(), ["ASSET", "MACHINE", "VEHICLE"]);
assert.deepEqual([...thresholdDirections].sort(), ["DECAY", "GROWTH"]);
assert(thresholdRates.size >= 8, `threshold rate coverage too low: ${thresholdRates.size}`);
assert.deepEqual([...thresholdYears].sort(), [2, 3, 4, 5]);
assert.deepEqual([...eventOrders].sort(), ["ADJUSTMENT_THEN_GROWTH", "GROWTH_THEN_ADJUSTMENT"]);
assert.deepEqual([...eventSigns].sort(), ["IN", "OUT"]);

console.log(JSON.stringify({
  runtimeVersion: INT_CP005_RUNTIME_VERSION_V4,
  qls: INT_CP005_QL_IDS.length,
  questions,
  perLocale: questions / 3,
  replayChecks,
  verifierChecks,
  optionChecks,
  parityChecks,
  lifecycleChecks,
  wrapperChecks,
  contextChecks,
  collisionChecks,
  perQlFingerprints,
  perQlStems,
  contexts086: [...contexts086].sort(),
  contexts088: [...contexts088].sort(),
  contexts090: [...contexts090].sort(),
  thresholdDirections: [...thresholdDirections].sort(),
  thresholdRateProfiles: [...thresholdRates].sort(),
  thresholdYears: [...thresholdYears].sort(),
  eventOrders: [...eventOrders].sort(),
  eventSigns: [...eventSigns].sort(),
}, null, 2));
console.log("PASS_INT_CP005_VARIABLE_GROWTH_DECAY_V4");
