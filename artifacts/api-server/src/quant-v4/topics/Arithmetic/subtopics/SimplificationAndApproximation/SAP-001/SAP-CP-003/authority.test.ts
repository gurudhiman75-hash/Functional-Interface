import assert from "node:assert/strict";
import { SAP_CP003_PROTOTYPE_AUTHORITIES } from "./catalogue";
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

assert.equal(formatRat(parseRecurringDecimal("0.(3)")!), "1/3");
assert.equal(formatRat(parseRecurringDecimal("0.1(6)")!), "1/6");
assert.equal(formatRat(parseRecurringDecimal("0.8(3)")!), "5/6");
assert.equal(formatRat(parseNumericLiteral("37.5%")!), "3/8");
assert.equal(formatRat(parseNumericLiteral("0.625")!), "5/8");

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
let diagnosisCount = 0;
let recurringCount = 0;

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
    assert.match(pkg.canonicalAnswer, /^A [<>=] B$/);
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
    assert.match(pkg.stem, /\d\.\d*\(\d+\)/);
    assert.match(pkg.explanation.steps[0]!, /exact fraction/i);
    assert.ok(pkg.options.some((option) => option.misconceptionId === "RECURRING_BLOCK_READ_AS_FINITE"));
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
  assert.ok(maximumRun(sequence) <= 1, `${prototypeId} has a repeated correct answer position.`);
  const distribution = [0, 1, 2, 3].map((index) => sequence.filter((value) => value === index).length);
  assert.deepEqual(distribution, [25, 25, 25, 25]);
}
assert.equal(difficultyBands.size, 3);
assert.equal(inverseCount, 200);
assert.equal(comparisonCount, 100);
assert.equal(diagnosisCount, 100);
assert.equal(recurringCount, 100);

const records = generateSapCp003ReviewRecords();
assert.equal(records.length, 300);
assert.equal(new Set(records.map((record) => record.canonicalPayloadKey)).size, 300);
assert.equal(new Set(records.map((record) => record.generationIdentity)).size, 300);
assert.equal(new Set(records.map((record) => record.prototypeId)).size, 19);
assert.equal(records.filter((record) => record.options.length !== 4).length, 0);
assert.equal(records.filter((record) => record.options.filter((option) => option.isCorrect).length !== 1).length, 0);

console.log(JSON.stringify({
  status: "PASS_SAP_CP003_EXECUTABLE_DISCOVERY_AUTHORITY",
  packagesTested: sweep.length,
  uniqueGenerationIdentities: identities.size,
  prototypeCount: counts.size,
  reviewQuestions: records.length,
  uniqueReviewPayloads: new Set(records.map((record) => record.canonicalPayloadKey)).size,
  difficultyCounts: {
    EASY: records.filter((record) => record.difficulty === "EASY").length,
    MEDIUM: records.filter((record) => record.difficulty === "MEDIUM").length,
    HARD: records.filter((record) => record.difficulty === "HARD").length,
  },
  inverseCount,
  comparisonCount,
  diagnosisCount,
  recurringCount,
  nextAvailableQlId: SAP_CP003_RUNTIME_STATE.nextAvailableQlId,
  lifecycle: SAP_CP003_RUNTIME_STATE.status,
}, null, 2));
