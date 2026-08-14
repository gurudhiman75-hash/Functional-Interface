import assert from "node:assert/strict";
import {
  INT_CP005_QL_IDS,
  INT_CP005_REGISTRY_V2,
  INT_CP005_RUNTIME_VERSION_V2,
  generateIntCp005QuestionV2,
  verifyIntCp005Answer,
  type IntCp005Locale,
  type IntCp005QuestionV2,
} from "./cp005-variable-growth-decay-runtime-v2";

const LOCALES = Object.freeze(["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly IntCp005Locale[]);
const positions = new Map<string, Set<number>>();
const contexts086 = new Set<string>();
const contexts090 = new Set<string>();
const thresholdDirections = new Set<string>();
const eventOrders = new Set<string>();
const eventSigns = new Set<string>();
const representations = new Set<string>();
const globalFingerprints = new Set<string>();
const perQlFingerprintCounts: Record<string, number> = {};
const perQlStemCounts: Record<string, Record<string, number>> = {};
let questions = 0;
let replayChecks = 0;
let verifierChecks = 0;
let optionChecks = 0;
let localeParityChecks = 0;
let learnerStringChecks = 0;
let lifecycleChecks = 0;
let wrapperChecks = 0;
let formulaFirstChecks = 0;
let semanticCollisionChecks = 0;

function learnerStrings(question: IntCp005QuestionV2): string[] {
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
  return text.replace(/\\\([\s\S]*?\\\)/gu, "").replace(/\\\[[\s\S]*?\\\]/gu, "");
}

function optionOwnershipKey(question: IntCp005QuestionV2): string {
  return question.options.map((option) => `${option.value.numerator}/${option.value.denominator}:${option.misconceptionId}:${option.isCorrect}`).join("|");
}

function assertLearnerSurface(question: IntCp005QuestionV2): void {
  const strings = learnerStrings(question);
  const joined = strings.join("\n");
  learnerStringChecks += strings.length;

  assert(!joined.includes("$"), `${question.qlId}/${question.seed}/${question.locale}: legacy dollar math`);
  assert(!/₹[0-9,]+\.00\b/u.test(joined), `${question.qlId}/${question.seed}/${question.locale}: whole-rupee .00`);
  assert(!/\d+\.\d{3,}/u.test(joined), `${question.qlId}/${question.seed}/${question.locale}: >2 visible decimal places`);
  assert(!/[eE][+-]?\d{2,}/u.test(joined), `${question.qlId}/${question.seed}/${question.locale}: scientific notation`);
  assert(!/people people/iu.test(joined), `${question.qlId}/${question.seed}/${question.locale}: duplicated English people noun`);
  assert(!/TODO|TBD|placeholder|translation pending/iu.test(joined), `${question.qlId}/${question.seed}/${question.locale}: placeholder leak`);

  if (question.locale === "hi-IN") assert(/[\u0900-\u097F]/u.test(joined), `${question.qlId}/${question.seed}: Hindi script missing`);
  if (question.locale === "pa-IN") {
    assert(/[\u0A00-\u0A7F]/u.test(joined), `${question.qlId}/${question.seed}: Punjabi script missing`);
    assert(!joined.includes("ਚੱਕਰਵੱਧੀ"), `${question.qlId}/${question.seed}: rejected Punjabi compound-interest term`);
    if (question.qlId === "INT-QL-086" && ["POPULATION", "SALARY", "PRODUCTION"].includes(question.mathematicalState.context)) {
      assert(!/ਇਸ ਵਿੱਚ [^।]+ ਹੁੰਦਾ ਹੈ।/u.test(question.presentation.markdown), `${question.qlId}/${question.seed}: mechanical Punjabi growth sentence survived V2`);
    }
  }
  if (question.locale === "hi-IN" && question.qlId === "INT-QL-092") {
    assert(!/इसके मूल्य में क्रमशः [^।]+ होता है।/u.test(question.presentation.markdown), `${question.qlId}/${question.seed}: mechanical Hindi mixed-change sentence survived V2`);
  }
  if (question.locale === "pa-IN" && question.qlId === "INT-QL-092") {
    assert(!/ਇਸ ਦੇ ਮੁੱਲ ਵਿੱਚ ਕ੍ਰਮਵਾਰ [^।]+ ਹੁੰਦਾ ਹੈ।/u.test(question.presentation.markdown), `${question.qlId}/${question.seed}: mechanical Punjabi mixed-change sentence survived V2`);
  }

  const formulaPrefix = question.locale === "en-IN" ? "Formula:" : question.locale === "hi-IN" ? "सूत्र:" : "ਸੂਤਰ:";
  assert(question.explanation.steps[0]?.startsWith(formulaPrefix), `${question.qlId}/${question.seed}/${question.locale}: explanation is not formula-first`);
  assert(/\\\([^\n]+\\\)/u.test(question.explanation.steps[0] ?? ""), `${question.qlId}/${question.seed}/${question.locale}: first step lacks Examtree wrapper`);
  formulaFirstChecks += 1;

  for (const step of question.explanation.steps) {
    const outside = stripWrappedMath(step);
    assert(!/[=×÷^]/u.test(outside), `${question.qlId}/${question.seed}/${question.locale}: raw math operator outside wrapper`);
    assert(!/\\(?:frac|times|div|prod|left|right)/u.test(outside), `${question.qlId}/${question.seed}/${question.locale}: raw LaTeX outside wrapper`);
    wrapperChecks += 1;
  }
}

assert.equal(INT_CP005_RUNTIME_VERSION_V2, "INT-CP-005-VARIABLE-GROWTH-DECAY-v2");
assert.deepEqual(INT_CP005_QL_IDS, ["INT-QL-086", "INT-QL-087", "INT-QL-088", "INT-QL-089", "INT-QL-090", "INT-QL-091", "INT-QL-092", "INT-QL-093", "INT-QL-094", "INT-QL-095"]);
assert.equal(INT_CP005_REGISTRY_V2.length, 10);
assert.equal(INT_CP005_REGISTRY_V2.find((entry) => entry.qlId === "INT-QL-086")?.answerSemantic, "CONTEXT_VALUE");
assert.equal(INT_CP005_REGISTRY_V2.find((entry) => entry.qlId === "INT-QL-088")?.answerSemantic, "CONTEXT_VALUE");

for (const qlId of INT_CP005_QL_IDS) {
  positions.set(qlId, new Set<number>());
  const qlFingerprints = new Set<string>();
  const visibleByLocale = new Map<IntCp005Locale, Set<string>>(LOCALES.map((locale) => [locale, new Set<string>()]));
  const stemToFingerprintByLocale = new Map<IntCp005Locale, Map<string, string>>(LOCALES.map((locale) => [locale, new Map<string, string>()]));

  for (let index = 0; index < 100; index += 1) {
    const seed = `int-cp005-v2-audit-${qlId}-${index}`;
    const english = generateIntCp005QuestionV2(qlId, seed, "en-IN");
    const replay = generateIntCp005QuestionV2(qlId, seed, "en-IN");
    assert.deepEqual(replay, english, `${qlId}/${seed}: deterministic replay failed`);
    replayChecks += 1;

    assert(verifyIntCp005Answer(english.mathematicalState, english.solution), `${qlId}/${seed}: independent verifier rejected solution`);
    verifierChecks += 1;
    assert.equal(english.options.length, 4, `${qlId}/${seed}: four options required`);
    assert.equal(english.options.filter((option) => option.isCorrect).length, 1, `${qlId}/${seed}: one correct option required`);
    assert.equal(english.correctIndex, english.options.findIndex((option) => option.isCorrect), `${qlId}/${seed}: correct index mismatch`);
    assert.equal(new Set(english.options.map((option) => option.text)).size, 4, `${qlId}/${seed}: duplicate displayed options`);
    english.options.forEach((option, optionIndex) => {
      const verifies = verifyIntCp005Answer(english.mathematicalState, option.value);
      assert.equal(verifies, optionIndex === english.correctIndex, `${qlId}/${seed}: option verifier ownership mismatch at ${optionIndex}`);
      optionChecks += 1;
    });
    positions.get(qlId)!.add(english.correctIndex);
    representations.add(`${qlId}:${english.representation}`);
    qlFingerprints.add(english.mathematicalFingerprint);
    globalFingerprints.add(`${qlId}:${english.mathematicalFingerprint}`);

    if (qlId === "INT-QL-086") contexts086.add(english.mathematicalState.context);
    if (qlId === "INT-QL-090") contexts090.add(english.mathematicalState.context);
    if (english.mathematicalState.qlId === "INT-QL-093") thresholdDirections.add(english.mathematicalState.direction);
    if (english.mathematicalState.qlId === "INT-QL-094") {
      eventOrders.add(english.mathematicalState.eventOrder);
      eventSigns.add(english.mathematicalState.adjustment.numerator >= 0n ? "IN" : "OUT");
    }

    const canonicalOptions = optionOwnershipKey(english);
    for (const locale of LOCALES) {
      const question = locale === "en-IN" ? english : generateIntCp005QuestionV2(qlId, seed, locale);
      questions += 1;
      assert.equal(question.runtimeVersion, INT_CP005_RUNTIME_VERSION_V2);
      assert.deepEqual(question.mathematicalState, english.mathematicalState, `${qlId}/${seed}/${locale}: mathematical state drift`);
      assert.equal(question.mathematicalFingerprint, english.mathematicalFingerprint, `${qlId}/${seed}/${locale}: fingerprint drift`);
      assert.deepEqual(question.solution, english.solution, `${qlId}/${seed}/${locale}: solution drift`);
      assert.equal(question.correctIndex, english.correctIndex, `${qlId}/${seed}/${locale}: correct-index drift`);
      assert.equal(optionOwnershipKey(question), canonicalOptions, `${qlId}/${seed}/${locale}: option/misconception ownership drift`);
      localeParityChecks += 5;
      assertLearnerSurface(question);

      const stems = visibleByLocale.get(locale)!;
      stems.add(question.presentation.markdown);
      const stemMap = stemToFingerprintByLocale.get(locale)!;
      const previousFingerprint = stemMap.get(question.presentation.markdown);
      if (previousFingerprint !== undefined) {
        assert.equal(previousFingerprint, question.mathematicalFingerprint, `${qlId}/${locale}: same visible stem maps to different mathematical states`);
      } else {
        stemMap.set(question.presentation.markdown, question.mathematicalFingerprint);
      }
      semanticCollisionChecks += 1;

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

  assert.deepEqual([...positions.get(qlId)!].sort(), [0, 1, 2, 3], `${qlId}: all four answer positions must be reachable`);
  assert(qlFingerprints.size >= 20, `${qlId}: insufficient mathematical-state diversity (${qlFingerprints.size})`);
  perQlFingerprintCounts[qlId] = qlFingerprints.size;
  perQlStemCounts[qlId] = {};
  for (const locale of LOCALES) {
    const count = visibleByLocale.get(locale)!.size;
    perQlStemCounts[qlId]![locale] = count;
    assert(count >= qlFingerprints.size, `${qlId}/${locale}: learner wording collapses distinct mathematical states (${count} stems / ${qlFingerprints.size} states)`);
  }
}

assert.deepEqual([...contexts086].sort(), ["INVESTMENT", "POPULATION", "PRODUCTION", "SALARY"]);
assert.deepEqual([...contexts090].sort(), ["ASSET", "MACHINE", "VEHICLE"]);
assert.deepEqual([...thresholdDirections].sort(), ["DECAY", "GROWTH"]);
assert.deepEqual([...eventOrders].sort(), ["ADJUSTMENT_THEN_GROWTH", "GROWTH_THEN_ADJUSTMENT"]);
assert.deepEqual([...eventSigns].sort(), ["IN", "OUT"]);
assert(representations.has("INT-QL-086:STANDARD_PROSE"));
assert(representations.has("INT-QL-095:COMPARISON_TABLE"));
assert(![...representations].some((entry) => entry.endsWith(":RATE_TABLE")), "V2 must not duplicate rate tables and prose schedules");

console.log(JSON.stringify({
  runtimeVersion: INT_CP005_RUNTIME_VERSION_V2,
  qls: INT_CP005_QL_IDS.length,
  questions,
  perLocale: questions / LOCALES.length,
  replayChecks,
  verifierChecks,
  optionChecks,
  localeParityChecks,
  learnerStringChecks,
  lifecycleChecks,
  wrapperChecks,
  formulaFirstChecks,
  semanticCollisionChecks,
  uniqueMathematicalFingerprints: globalFingerprints.size,
  perQlFingerprintCounts,
  perQlStemCounts,
  contexts086: [...contexts086].sort(),
  contexts090: [...contexts090].sort(),
  thresholdDirections: [...thresholdDirections].sort(),
  eventOrders: [...eventOrders].sort(),
  eventSigns: [...eventSigns].sort(),
}, null, 2));
console.log("PASS_INT_CP005_VARIABLE_GROWTH_DECAY_V2");
