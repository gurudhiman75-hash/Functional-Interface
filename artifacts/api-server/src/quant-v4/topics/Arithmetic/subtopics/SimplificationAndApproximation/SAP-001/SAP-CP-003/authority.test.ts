import assert from "node:assert/strict";
import { SAP_CP003_PROTOTYPE_AUTHORITIES } from "./catalogue";
import { SAP_CP003_EXAM_READINESS_POLICY } from "./exam-readiness-policy";
import { parseNumericLiteral, parseRecurringDecimal, formatRat } from "./exact";
import { generateSapCp003ReviewRecords } from "./review-export";
import { generateSapCp003Sweep, SAP_CP003_RUNTIME_STATE } from "./editorial-runtime";
import { SAP_CP003_PROTOTYPE_IDS } from "./types";

function maximumRun(sequence: readonly number[]): number {
  let maximum = 0;
  let current = 0;
  let previous: number | undefined;
  for (const value of sequence) {
    current = value === previous ? current + 1 : 1;
    maximum = Math.max(maximum, current);
    previous = value;
  }
  return maximum;
}

function distribution(sequence: readonly number[]): readonly number[] {
  return [0, 1, 2, 3].map((index) => sequence.filter((value) => value === index).length);
}

function forwardCycleTransitions(sequence: readonly number[]): number {
  let count = 0;
  for (let index = 1; index < sequence.length; index += 1) {
    if (sequence[index] === ((sequence[index - 1]! + 1) % 4)) count += 1;
  }
  return count;
}

function transitionCounts(sequence: readonly number[]): ReadonlyMap<string, number> {
  const counts = new Map<string, number>();
  for (let index = 1; index < sequence.length; index += 1) {
    const key = `${sequence[index - 1]}→${sequence[index]}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function cyclicFourWindows(sequence: readonly number[]): number {
  let count = 0;
  for (let index = 0; index <= sequence.length - 4; index += 1) {
    const start = sequence[index]!;
    if (
      sequence[index + 1] === (start + 1) % 4
      && sequence[index + 2] === (start + 2) % 4
      && sequence[index + 3] === (start + 3) % 4
    ) count += 1;
  }
  return count;
}

function fourGramFrequencies(sequence: readonly number[]): ReadonlyMap<string, number> {
  const counts = new Map<string, number>();
  for (let index = 0; index <= sequence.length - 4; index += 1) {
    const key = sequence.slice(index, index + 4).join("");
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function maximumMapValue(values: ReadonlyMap<string, number>): number {
  return Math.max(0, ...values.values());
}

assert.equal(formatRat(parseRecurringDecimal("0.(3)")!), "1/3");
assert.equal(formatRat(parseRecurringDecimal("0.1(6)")!), "1/6");
assert.equal(formatRat(parseRecurringDecimal("0.8(3)")!), "5/6");
assert.equal(formatRat(parseNumericLiteral("37.5%")!), "3/8");
assert.equal(formatRat(parseNumericLiteral("0.625")!), "5/8");
assert.equal(Object.keys(SAP_CP003_EXAM_READINESS_POLICY).length, 19);
assert.ok(new Set(Object.values(SAP_CP003_EXAM_READINESS_POLICY).map((policy) => policy.mockUse)).size >= 4);

const sweep = generateSapCp003Sweep(100);
assert.equal(sweep.length, 1_900);
assert.equal(SAP_CP003_PROTOTYPE_AUTHORITIES.length, 19);
assert.equal(new Set(SAP_CP003_PROTOTYPE_AUTHORITIES.map((authority) => authority.solveMode)).size, 19);

const identities = new Set<string>();
const positions = new Map<string, number[]>();
const counts = new Map<string, number>();
const difficultyBands = new Set<string>();
let inverseCount = 0;
let comparisonCount = 0;
let cannotDetermineComparisonCount = 0;
let diagnosisCount = 0;
let recurringCount = 0;
let decimalPlacementCount = 0;

for (const pkg of sweep) {
  assert.equal(pkg.validation.ok, true, `${pkg.prototypeId}/${pkg.seed}: ${pkg.validation.errors.join("; ")}`);
  assert.equal(pkg.validation.exactAgreementPassed, true);
  assert.equal(pkg.validation.optionUniquenessPassed, true);
  assert.equal(pkg.validation.singleCorrectOptionPassed, true);
  assert.equal(pkg.validation.answerBindingPassed, true);
  assert.equal(pkg.validation.surfaceSyntaxPassed, true);
  assert.equal(pkg.validation.explanationCompletenessPassed, true);
  assert.equal(pkg.validation.lifecyclePassed, true);
  assert.equal(pkg.options.length, 4);
  assert.equal(new Set(pkg.options.map((option) => option.value)).size, 4);
  assert.equal(pkg.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer);
  assert.equal(pkg.options.filter((option) => !option.isCorrect && !option.misconceptionId).length, 0);
  assert.equal(pkg.lifecycle.permanentQlId, null);
  assert.equal(pkg.lifecycle.active, false);
  assert.equal(pkg.lifecycle.questionStudioDiscoverable, false);
  assert.equal(pkg.lifecycle.questionBankWritable, false);
  assert.equal(pkg.lifecycle.testEligible, false);
  assert.equal(pkg.lifecycle.publiclyPublishable, false);
  assert.ok(!identities.has(pkg.generationIdentity), `Duplicate identity ${pkg.generationIdentity}.`);
  identities.add(pkg.generationIdentity);
  const list = positions.get(pkg.prototypeId) ?? [];
  list.push(pkg.correctIndex);
  positions.set(pkg.prototypeId, list);
  counts.set(pkg.prototypeId, (counts.get(pkg.prototypeId) ?? 0) + 1);
  difficultyBands.add(pkg.difficulty);
  if (pkg.taskDirection === "INVERSE") {
    inverseCount += 1;
    assert.ok(pkg.explanation.steps.some((step) => /check/i.test(step)));
  }
  if (pkg.taskDirection === "COMPARISON") {
    comparisonCount += 1;
    if (pkg.canonicalAnswer === "Cannot be determined") {
      cannotDetermineComparisonCount += 1;
      assert.match(pkg.stem, /positive numbers/);
      assert.ok(pkg.explanation.steps.some((step) => /cannot be compared/i.test(step)));
    } else {
      assert.match(pkg.canonicalAnswer, /^A [<>=] B$/);
    }
  }
  if (pkg.taskDirection === "DIAGNOSIS") {
    diagnosisCount += 1;
    assert.match(pkg.stem, /\nStep 1:/);
    assert.match(pkg.stem, /\nStep 2:/);
    assert.match(pkg.stem, /\nStep 3:/);
    assert.match(pkg.stem, /\nWhich is the first incorrect step\?/);
  }
  if (pkg.prototypeId === "SAP-CP003-PROT-RECURRING-DECIMAL-IN-EXPRESSION") {
    recurringCount += 1;
    assert.match(pkg.stem, /recurring/);
    assert.doesNotMatch(pkg.stem, /\.\d*\(\d+\)/);
    assert.match(pkg.explanation.steps[0]!, /exact fraction/i);
    assert.ok(pkg.options.some((option) => option.misconceptionId === "RECURRING_BLOCK_READ_AS_FINITE"));
  }
  if (pkg.prototypeId === "SAP-CP003-PROT-SELECT-CORRECT-DECIMAL-PLACEMENT") {
    decimalPlacementCount += 1;
    assert.match(pkg.stem, /^Ignoring decimal points,/);
    assert.ok(pkg.explanation.steps.some((step) => /visible factors have/i.test(step)));
  }
  if (pkg.prototypeId === "SAP-CP003-PROT-MISSING-PERCENTAGE-LITERAL") {
    for (const option of pkg.options) {
      assert.match(option.value, /%$/);
      const value = parseNumericLiteral(option.value)!;
      assert.ok(value.n >= 0n && value.n * 2n <= value.d * 3n, `${option.value} is outside the bounded percentage option range.`);
    }
  }
}

assert.equal(identities.size, 1_900);
assert.equal(counts.size, 19);
for (const prototypeId of SAP_CP003_PROTOTYPE_IDS) {
  assert.equal(counts.get(prototypeId), 100);
  const sequence = positions.get(prototypeId)!;
  const localDistribution = distribution(sequence);
  assert.ok(maximumRun(sequence) <= 6, `${prototypeId} has an implausibly long same-position run.`);
  assert.ok(localDistribution.every((count) => count >= 12 && count <= 38), `${prototypeId} has an implausibly skewed position distribution: ${localDistribution.join(",")}.`);
  assert.ok(forwardCycleTransitions(sequence) <= 45, `${prototypeId} leaks an A→B→C→D transition pattern.`);
  assert.ok(maximumMapValue(transitionCounts(sequence)) <= 28, `${prototypeId} has an over-dominant answer-position transition.`);
  assert.ok(cyclicFourWindows(sequence) <= 18, `${prototypeId} repeats too many four-answer cycles.`);
}
assert.equal(difficultyBands.size, 3);
assert.equal(inverseCount, 200);
assert.equal(comparisonCount, 100);
assert.equal(cannotDetermineComparisonCount, 20);
assert.equal(diagnosisCount, 100);
assert.equal(recurringCount, 100);
assert.equal(decimalPlacementCount, 100);

const records = generateSapCp003ReviewRecords();
assert.equal(records.length, 300);
assert.equal(new Set(records.map((record) => record.canonicalPayloadKey)).size, 300);
assert.equal(new Set(records.map((record) => record.generationIdentity)).size, 300);
assert.equal(new Set(records.map((record) => record.prototypeId)).size, 19);
assert.equal(records.filter((record) => record.options.length !== 4).length, 0);
assert.equal(records.filter((record) => record.options.filter((option) => option.isCorrect).length !== 1).length, 0);
assert.ok(records.filter((record) => record.correctAnswer === "Cannot be determined").length >= 3);

const reviewSequence = records.map((record) => record.correctIndex);
const reviewDistribution = distribution(reviewSequence);
const reviewTransitionCounts = transitionCounts(reviewSequence);
const reviewFourGrams = fourGramFrequencies(reviewSequence);
const reviewForwardCycleTransitions = forwardCycleTransitions(reviewSequence);
const reviewCyclicFourWindows = cyclicFourWindows(reviewSequence);
assert.ok(reviewDistribution.every((count) => count >= 50 && count <= 100), `Review answer positions are unacceptably skewed: ${reviewDistribution.join(",")}.`);
assert.ok(maximumRun(reviewSequence) <= 6, "Review contains an implausibly long same-position run.");
assert.ok(reviewForwardCycleTransitions <= 120, `Review leaks the forward answer cycle in ${reviewForwardCycleTransitions} of ${reviewSequence.length - 1} transitions.`);
assert.ok(maximumMapValue(reviewTransitionCounts) <= 40, "Review contains an over-dominant answer-position transition.");
assert.ok(reviewCyclicFourWindows <= 45, `Review contains ${reviewCyclicFourWindows} cyclic four-answer windows.`);
assert.ok(reviewFourGrams.size >= 70, `Review contains only ${reviewFourGrams.size} distinct four-answer patterns.`);
assert.ok(maximumMapValue(reviewFourGrams) <= 12, "One four-answer pattern is repeated too frequently.");

console.log(JSON.stringify({
  status: "PASS_SAP_CP003_STRUCTURAL_REMEDIATION_V2_AUTHORITY",
  packagesTested: sweep.length,
  uniqueGenerationIdentities: identities.size,
  prototypeCount: counts.size,
  reviewQuestions: records.length,
  uniqueReviewPayloads: new Set(records.map((record) => record.canonicalPayloadKey)).size,
  reviewAnswerPositionCounts: {
    A: reviewDistribution[0],
    B: reviewDistribution[1],
    C: reviewDistribution[2],
    D: reviewDistribution[3],
  },
  reviewForwardCycleTransitions,
  reviewTransitionCount: reviewSequence.length - 1,
  reviewForwardCycleRate: Number((reviewForwardCycleTransitions / (reviewSequence.length - 1)).toFixed(4)),
  reviewCyclicFourWindows,
  distinctReviewFourGrams: reviewFourGrams.size,
  maximumReviewFourGramFrequency: maximumMapValue(reviewFourGrams),
  difficultyCounts: {
    EASY: records.filter((record) => record.difficulty === "EASY").length,
    MEDIUM: records.filter((record) => record.difficulty === "MEDIUM").length,
    HARD: records.filter((record) => record.difficulty === "HARD").length,
  },
  inverseCount,
  comparisonCount,
  cannotDetermineComparisonCount,
  diagnosisCount,
  recurringCount,
  decimalPlacementCount,
  nextAvailableQlId: SAP_CP003_RUNTIME_STATE.nextAvailableQlId,
  lifecycle: SAP_CP003_RUNTIME_STATE.status,
}, null, 2));
