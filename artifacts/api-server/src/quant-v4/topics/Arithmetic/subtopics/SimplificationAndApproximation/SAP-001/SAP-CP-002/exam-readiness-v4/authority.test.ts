import assert from "node:assert/strict";
import { generateSapCp002ExamReadinessV4Sweep, SAP_CP002_EXAM_READINESS_V4_STATE } from "./runtime";
import { generateSapCp002ExamReadinessV4ReviewRecords } from "./review-export";

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

const sweep = generateSapCp002ExamReadinessV4Sweep(100);
assert.equal(sweep.length, 1_900);
const identities = new Set<string>();
const positionsByQl = new Map<string, number[]>();
const positionsByPrototype = new Map<string, number[]>();
const difficultyBandsByQl = new Map<string, Set<string>>();
let ql023 = 0;
let ql026 = 0;
let ql028 = 0;
let inverseVerified = 0;
let ql032FormTraps = 0;

for (const pkg of sweep) {
  assert.equal(pkg.validation.ok, true, `${pkg.temporaryPrototypeId}/${pkg.seed}: ${pkg.validation.errors.join("; ")}`);
  assert.equal(pkg.options.length, 4);
  assert.equal(new Set(pkg.options.map((option) => option.value)).size, 4);
  assert.equal(pkg.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer);
  assert.equal(pkg.explanation.solutionComplete, true);
  assert.equal(pkg.validation.noFallbackPassed, true);
  assert.equal(pkg.validation.finalWorkingMatchesAnswer, true);
  assert.equal(pkg.validation.surfaceSyntaxPassed, true);
  assert.equal(pkg.validation.symbolNormalizationPassed, true);
  assert.equal(pkg.validation.explanationCompletenessPassed, true);
  assert.equal(pkg.lifecycle.active, false);
  assert.equal(pkg.lifecycle.questionStudioDiscoverable, false);
  assert.equal(pkg.lifecycle.questionBankWritable, false);
  assert.equal(pkg.lifecycle.testEligible, false);
  assert.equal(pkg.lifecycle.publiclyPublishable, false);
  assert.equal(pkg.reviewVersion, "SAP_CP002_EXAM_READINESS_V4");
  assert.ok(!identities.has(pkg.generationIdentity), `Duplicate generation identity: ${pkg.generationIdentity}`);
  identities.add(pkg.generationIdentity);

  const byQl = positionsByQl.get(pkg.permanentQlId) ?? [];
  byQl.push(pkg.correctIndex);
  positionsByQl.set(pkg.permanentQlId, byQl);
  const byPrototype = positionsByPrototype.get(pkg.temporaryPrototypeId) ?? [];
  byPrototype.push(pkg.correctIndex);
  positionsByPrototype.set(pkg.temporaryPrototypeId, byPrototype);
  const bands = difficultyBandsByQl.get(pkg.permanentQlId) ?? new Set<string>();
  bands.add(pkg.difficulty);
  difficultyBandsByQl.set(pkg.permanentQlId, bands);

  if (pkg.permanentQlId === "SAP-QL-023") {
    ql023 += 1;
    assert.match(pkg.explanation.methodId, /COMPLETE_BLOCK/);
    assert.ok(pkg.explanation.stepByStep.some((step) => /Numerator block/i.test(step)));
    assert.ok(pkg.explanation.stepByStep.some((step) => /Denominator block/i.test(step)));
  }
  if (pkg.permanentQlId === "SAP-QL-026") {
    ql026 += 1;
    assert.match(pkg.explanation.methodId, /RECIPROCAL_OF_COMPLETE_GROUP/);
    assert.ok(pkg.explanation.stepByStep.some((step) => /grouped denominator/i.test(step)));
  }
  if (pkg.permanentQlId === "SAP-QL-028") {
    ql028 += 1;
    assert.match(pkg.explanation.methodId, /CONTINUED_FRACTION_INNER_TO_OUTER/);
    assert.ok(pkg.explanation.stepByStep.length >= 4);
  }
  if (pkg.taskDirection === "INVERSE") {
    inverseVerified += 1;
    assert.equal(pkg.explanation.substitutionVerified, true);
    assert.ok(pkg.explanation.stepByStep.some((step) => /Substitution check/i.test(step)));
  }
  if (pkg.permanentQlId === "SAP-QL-031") {
    assert.ok(pkg.explanation.stepByStep.some((step) => /^A =/i.test(step)));
    assert.ok(pkg.explanation.stepByStep.some((step) => /^B =/i.test(step)));
    assert.ok(pkg.explanation.stepByStep.some((step) => /A − B =/i.test(step)));
  }
  if (pkg.permanentQlId === "SAP-QL-032") {
    ql032FormTraps += 1;
    assert.equal(pkg.validation.ql032FormTrapPassed, true);
    assert.equal(pkg.options.filter((option) => option.numericEquivalenceToCorrect).length, 2);
    assert.equal(pkg.options.filter((option) => option.satisfiesRequiredForm).length, 1);
  }
  if (pkg.permanentQlId === "SAP-QL-033") {
    assert.match(pkg.explanation.methodId, /FIRST_INVALID_TRANSFORMATION/);
    assert.ok(pkg.explanation.stepByStep.some((step) => /exact value|equivalent/i.test(step)));
  }
}

for (const [group, sequence] of [...positionsByQl, ...positionsByPrototype]) {
  assert.ok(maximumRun(sequence) <= 3, `${group} has answer-position run ${maximumRun(sequence)}.`);
}

assert.equal(identities.size, 1_900);
assert.equal(ql023, 100);
assert.equal(ql026, 100);
assert.equal(ql028, 100);
assert.ok(inverseVerified >= 300);
assert.equal(ql032FormTraps, 100);
const multiBandQls = [...difficultyBandsByQl.values()].filter((bands) => bands.size >= 2).length;
assert.ok(multiBandQls >= 8, `Only ${multiBandQls} QLs span more than one difficulty band.`);

const records = generateSapCp002ExamReadinessV4ReviewRecords();
assert.equal(records.length, 300);
assert.equal(new Set(records.map((record) => record.canonicalPayloadKey)).size, 300);
assert.equal(new Set(records.map((record) => record.generationIdentity)).size, 300);
assert.equal(records.filter((record) => !record.validation.ok).length, 0);
assert.equal(records.filter((record) => /SAFE_FALLBACK/i.test(record.explanation.methodId)).length, 0);
assert.equal(records.filter((record) => !record.validation.finalWorkingMatchesAnswer).length, 0);
assert.equal(records.filter((record) => !record.validation.surfaceSyntaxPassed).length, 0);
assert.equal(records.filter((record) => !record.validation.symbolNormalizationPassed).length, 0);

console.log(JSON.stringify({
  status: "PASS_SAP_CP002_EXAM_READINESS_V4_AUTHORITY",
  sweptPackages: sweep.length,
  uniqueGenerationIdentities: identities.size,
  reviewRecords: records.length,
  uniqueReviewPayloads: new Set(records.map((record) => record.canonicalPayloadKey)).size,
  genericFallbacks: records.filter((record) => /SAFE_FALLBACK/i.test(record.explanation.methodId)).length,
  multiBandQls,
  difficultyCounts: {
    EASY: records.filter((record) => record.difficulty === "EASY").length,
    MEDIUM: records.filter((record) => record.difficulty === "MEDIUM").length,
    HARD: records.filter((record) => record.difficulty === "HARD").length,
  },
  lifecycle: SAP_CP002_EXAM_READINESS_V4_STATE.editorialState,
}, null, 2));
