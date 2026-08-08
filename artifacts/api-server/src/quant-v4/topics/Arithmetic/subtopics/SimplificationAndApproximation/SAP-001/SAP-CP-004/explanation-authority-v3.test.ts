import assert from "node:assert/strict";
import {
  SAP_CP004_PROTOTYPE_IDS,
  generateSapCp004Package,
  generateSapCp004PreExplanationPackage,
  type SapCp004Package,
} from "./final-runtime";
import { generateSapCp004ReviewRecords } from "./review-export";

function power(base: bigint, exponent: number): bigint {
  let result = 1n;
  for (let index = 0; index < exponent; index += 1) result *= base;
  return result;
}

function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) [x, y] = [y, x % y];
  return x || 1n;
}

function explanationText(pkg: SapCp004Package): string {
  return [pkg.explanation.coreConcept, ...pkg.explanation.steps, pkg.explanation.finalAnswer].join("\n");
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function assertSurfaceUnchanged(before: SapCp004Package, after: SapCp004Package): void {
  assert.equal(after.stem, before.stem, `${after.prototypeId}/${after.seed}: stem changed during explanation remediation.`);
  assert.equal(after.canonicalAnswer, before.canonicalAnswer, `${after.prototypeId}/${after.seed}: answer changed.`);
  assert.deepEqual(after.options, before.options, `${after.prototypeId}/${after.seed}: options changed.`);
  assert.equal(after.correctIndex, before.correctIndex, `${after.prototypeId}/${after.seed}: answer position changed.`);
  assert.deepEqual(after.oracle, before.oracle, `${after.prototypeId}/${after.seed}: oracle changed.`);
  assert.equal(after.difficulty, before.difficulty, `${after.prototypeId}/${after.seed}: difficulty changed.`);
  assert.equal(after.taskDirection, before.taskDirection, `${after.prototypeId}/${after.seed}: task direction changed.`);
  assert.equal(after.answerSemantic, before.answerSemantic, `${after.prototypeId}/${after.seed}: answer semantic changed.`);
  assert.equal(after.frameId, before.frameId, `${after.prototypeId}/${after.seed}: frame changed.`);
  assert.equal(after.canonicalPayloadKey, before.canonicalPayloadKey, `${after.prototypeId}/${after.seed}: canonical payload changed.`);
  assert.deepEqual(after.lifecycle, before.lifecycle, `${after.prototypeId}/${after.seed}: lifecycle changed.`);
  assert.equal(after.proposedPermanentQlId, before.proposedPermanentQlId, `${after.prototypeId}/${after.seed}: proposed QL changed.`);
}

const BANNED_ENGINEERING_TERMS = /\b(?:AST|RPN|canonical payload|canonical evaluator|generation identity|prototype id|runtime seed|fingerprint)\b/i;
const OLD_GENERIC_FINAL = /Therefore, (?:the )?(?:exact )?(?:value|answer|root|reduced fraction|factorial ratio|missing exponent|missing radicand)\b/i;
const TAUTOLOGICAL_REDUCTION = /\b(-?\d+\/\d+)\s*=\s*\1\s+in lowest terms\b/i;

let unchangedPackages = 0;
let directCancellationPackages = 0;
let earlyStopDiagnosisPackages = 0;
let conciseFoundationPackages = 0;
let explicitNegativeBasePackages = 0;
let meaningfulFractionReductionPackages = 0;
let totalExplanationWords = 0;

for (const prototypeId of SAP_CP004_PROTOTYPE_IDS) {
  for (let seed = 1; seed <= 100; seed += 1) {
    const before = generateSapCp004PreExplanationPackage(prototypeId, seed);
    const after = generateSapCp004Package(prototypeId, seed);
    assertSurfaceUnchanged(before, after);
    unchangedPackages += 1;

    assert.equal(after.validation.ok, true, `${prototypeId}/${seed}: ${after.validation.errors.join("; ")}`);
    assert.ok(after.explanation.coreConcept.length >= 35, `${prototypeId}/${seed}: strategy sentence is too short.`);
    assert.ok(after.explanation.steps.length >= 2 && after.explanation.steps.length <= 4, `${prototypeId}/${seed}: explanation depth is outside 2..4 steps.`);
    assert.equal(after.explanation.finalAnswer, `Answer: ${after.canonicalAnswer}.`, `${prototypeId}/${seed}: final answer line is not exact.`);

    const text = explanationText(after);
    totalExplanationWords += wordCount(text);
    assert.doesNotMatch(text, BANNED_ENGINEERING_TERMS, `${prototypeId}/${seed}: engineering language leaked into the explanation.`);
    assert.doesNotMatch(text, OLD_GENERIC_FINAL, `${prototypeId}/${seed}: old repetitive final-answer language remains.`);
    assert.doesNotMatch(text, TAUTOLOGICAL_REDUCTION, `${prototypeId}/${seed}: tautological lowest-terms statement remains.`);
    assert.doesNotMatch(text, /\b(?:undefined|NaN|Infinity)\b/, `${prototypeId}/${seed}: malformed text remains.`);

    if (prototypeId === "SAP-CP004-PROT-POWER-ROOT-CANCELLATION") {
      const base = after.oracle.data.base!;
      const index = after.oracle.data.index ?? 2;
      const expandedValue = power(BigInt(base), index);
      directCancellationPackages += 1;
      assert.match(after.explanation.coreConcept, /do not expand/i);
      assert.match(after.explanation.coreConcept, /undo each other/i);
      assert.ok(!after.explanation.steps.some((step) => step.includes(`${base}^${index} = ${expandedValue}`)), `${prototypeId}/${seed}: cancellation explanation still expands the large power.`);
      if (after.stem.includes(" × ")) assert.match(after.explanation.steps[0]!, / × /);
      else assert.match(after.explanation.steps[0]!, /\^/);
    }

    if (prototypeId === "SAP-CP004-PROT-FRACTION-POWER") {
      const numerator = BigInt(after.oracle.data.numerator!);
      const denominator = BigInt(after.oracle.data.denominator!);
      if (gcd(numerator, denominator) > 1n) {
        assert.match(after.explanation.coreConcept, /reduce the fraction first/i);
      } else {
        assert.match(after.explanation.steps.join(" "), /share no common factor/i);
      }
      meaningfulFractionReductionPackages += 1;
    }

    if (prototypeId === "SAP-CP004-PROT-EXACT-ROOT-OF-FRACTION") {
      const numeratorRoot = BigInt(after.oracle.data.numeratorRoot!);
      const denominatorRoot = BigInt(after.oracle.data.denominatorRoot!);
      assert.match(after.explanation.steps[1]!, /[√∛]\(\d+\/\d+\)/, `${prototypeId}/${seed}: the full fraction is not visibly grouped under the root.`);
      if (gcd(numeratorRoot, denominatorRoot) > 1n) {
        assert.match(after.explanation.steps.join(" "), /Divide numerator and denominator by/i);
      } else {
        assert.match(after.explanation.steps.join(" "), /coprime/i);
      }
      meaningfulFractionReductionPackages += 1;
    }

    if (prototypeId === "SAP-CP004-PROT-NEGATIVE-BASE-PARITY") {
      explicitNegativeBasePackages += 1;
      assert.match(after.explanation.coreConcept, /parentheses/i);
      assert.match(after.explanation.coreConcept, /complete base/i);
      assert.match(after.explanation.coreConcept, /different from a minus written outside the power/i);
      assert.match(after.explanation.coreConcept, /even|odd/i);
    }

    if (prototypeId === "SAP-CP004-PROT-FACTORIAL-RATIO") {
      assert.match(after.explanation.coreConcept, /do not calculate the full factorials/i);
      assert.match(after.explanation.steps.join(" "), /Cancel/i);
    }

    if (prototypeId === "SAP-CP004-PROT-PERFECT-SQUARE-ROOT" || prototypeId === "SAP-CP004-PROT-PERFECT-CUBE-ROOT" || prototypeId === "SAP-CP004-PROT-SMALL-FACTORIAL") {
      conciseFoundationPackages += 1;
      assert.equal(after.explanation.steps.length, 2, `${prototypeId}/${seed}: a foundation item is over-explained.`);
    }

    if (after.taskDirection === "DIAGNOSIS") {
      const errorStep = after.oracle.data.errorStep!;
      if (errorStep === 1) {
        earlyStopDiagnosisPackages += 1;
        assert.equal(after.explanation.steps.length, 2);
        assert.match(after.explanation.steps[1]!, /later dependent steps need not be checked/i);
      } else if (errorStep === 2) {
        earlyStopDiagnosisPackages += 1;
        assert.equal(after.explanation.steps.length, 3);
        assert.match(after.explanation.steps[2]!, /final dependent step need not be checked/i);
        assert.ok(!after.explanation.steps.some((step) => /Step 3 should/i.test(step)));
      } else if (errorStep === 3) {
        assert.equal(after.explanation.steps.length, 3);
        assert.match(after.explanation.steps[2]!, /Step 3 should/i);
      } else {
        assert.equal(after.canonicalAnswer, "No error");
        assert.equal(after.explanation.steps.length, 3);
        assert.ok(after.explanation.steps.every((step) => /is correct/i.test(step)));
      }
    }
  }
}

assert.equal(unchangedPackages, 1_900);
assert.equal(directCancellationPackages, 100);
assert.equal(explicitNegativeBasePackages, 100);
assert.equal(meaningfulFractionReductionPackages, 200);
assert.equal(conciseFoundationPackages, 300);
assert.ok(earlyStopDiagnosisPackages > 0);

const review = generateSapCp004ReviewRecords();
assert.equal(review.length, 300);
let unchangedReviewRecords = 0;
for (const record of review) {
  const before = generateSapCp004PreExplanationPackage(record.prototypeId, record.seed, record.correctIndex);
  assertSurfaceUnchanged(before, record);
  assert.equal(record.explanation.finalAnswer, `Answer: ${record.canonicalAnswer}.`);
  unchangedReviewRecords += 1;
}
assert.equal(unchangedReviewRecords, 300);

console.log(JSON.stringify({
  status: "PASS_SAP_CP004_EXPLANATION_REMEDIATION_V3_AUTHORITY",
  packagesTested: unchangedPackages,
  unchangedQuestionOptionAnswerSurfaces: unchangedPackages,
  reviewQuestions: review.length,
  unchangedReviewSurfaces: unchangedReviewRecords,
  directCancellationPackages,
  explicitNegativeBasePackages,
  meaningfulFractionReductionPackages,
  earlyStopDiagnosisPackages,
  conciseFoundationPackages,
  averageExplanationWords: Number((totalExplanationWords / unchangedPackages).toFixed(2)),
  proposedQlRange: "SAP-QL-053..SAP-QL-071",
  lifecycle: "INACTIVE_REVIEW_CANDIDATE_PERMANENT_IDS_NOT_ALLOCATED",
}, null, 2));
