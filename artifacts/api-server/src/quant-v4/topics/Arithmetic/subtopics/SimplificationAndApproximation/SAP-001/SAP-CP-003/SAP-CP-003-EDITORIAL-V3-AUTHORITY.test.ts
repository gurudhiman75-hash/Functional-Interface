import assert from "node:assert/strict";
import { SAP_CP003_EXAM_READINESS_POLICY } from "./exam-readiness-policy";
import { sameDisplayedValue } from "./exact";
import {
  generateSapCp003Sweep,
  SAP_CP003_EDITORIAL_V3_STATE,
} from "./editorial-runtime";
import { generateSapCp003ReviewRecords } from "./review-export";
import { SAP_CP003_PROTOTYPE_TO_PERMANENT_QL } from "./permanent-runtime/runtime";
import { SAP_CP003_PROTOTYPE_IDS, type SapCp003PrototypeId } from "./types";

const GENERIC_DISTRACTOR_IDS = new Set([
  "FINAL_SCALE_TEN_TIMES_LARGE",
  "FINAL_SCALE_TEN_TIMES_SMALL",
  "FINAL_VALUE_ONE_TOO_LARGE",
  "FINAL_VALUE_ONE_TOO_SMALL",
  "FINAL_VALUE_DOUBLED",
]);

const MINIMUM_FRAME_COUNTS: Readonly<Record<SapCp003PrototypeId, number>> = Object.freeze({
  "SAP-CP003-PROT-TERMINATING-DECIMAL-EXPRESSION": 4,
  "SAP-CP003-PROT-DECIMAL-FRACTION-MIXED-EXPRESSION": 4,
  "SAP-CP003-PROT-DECIMAL-PRODUCT-PLACE-VALUE": 4,
  "SAP-CP003-PROT-DECIMAL-DIVISION-POWER-OF-TEN": 1,
  "SAP-CP003-PROT-DECIMAL-DIVISION-COMPATIBLE-FACTOR": 4,
  "SAP-CP003-PROT-PERCENTAGE-AS-NUMERIC-FACTOR": 4,
  "SAP-CP003-PROT-PERCENT-OF-QUANTITY-IN-EXPRESSION": 4,
  "SAP-CP003-PROT-MIXED-PERCENT-FRACTION-DECIMAL": 4,
  "SAP-CP003-PROT-CONVERT-TERMS-TO-FRACTIONS": 4,
  "SAP-CP003-PROT-CONVERT-TERMS-TO-DECIMALS": 4,
  "SAP-CP003-PROT-KNOWN-FRACTION-DECIMAL-EQUIVALENCE": 4,
  "SAP-CP003-PROT-RECURRING-DECIMAL-IN-EXPRESSION": 4,
  "SAP-CP003-PROT-COMPLEMENTARY-PERCENTAGE-EXPRESSION": 3,
  "SAP-CP003-PROT-SUCCESSIVE-PERCENT-FACTORS": 3,
  "SAP-CP003-PROT-MISSING-DECIMAL-OPERAND": 4,
  "SAP-CP003-PROT-MISSING-PERCENTAGE-LITERAL": 4,
  "SAP-CP003-PROT-COMPARE-FRACTION-DECIMAL-PERCENT": 4,
  "SAP-CP003-PROT-SELECT-CORRECT-DECIMAL-PLACEMENT": 1,
  "SAP-CP003-PROT-IDENTIFY-INCORRECT-CONVERSION-STEP": 4,
});

function frameSignature(stem: string): string {
  return stem
    .replace(/\d+(?:\.\d+)?%/g, "PERCENT")
    .replace(/\d+\/\d+/g, "FRACTION")
    .replace(/\d+(?:\.\d+)?/g, "NUMBER")
    .replace(/[a-z]\u0305/gi, "RECURRING")
    .replace(/\s+/g, " ")
    .trim();
}

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

function forwardCycleTransitions(sequence: readonly number[]): number {
  let count = 0;
  for (let index = 1; index < sequence.length; index += 1) {
    if (sequence[index] === ((sequence[index - 1]! + 1) % 4)) count += 1;
  }
  return count;
}

const sweep = generateSapCp003Sweep(100);
assert.equal(sweep.length, 1_900);
assert.equal(new Set(sweep.map((pkg) => pkg.generationIdentity)).size, 1_900);

const frameCounts = new Map<SapCp003PrototypeId, Set<string>>();
const difficultyByPrototype = new Map<SapCp003PrototypeId, Set<string>>();
let genericDistractors = 0;
let missingDistractorAnalyses = 0;
let equivalentOptionPairs = 0;
let latestEditorialPackages = 0;

for (const pkg of sweep) {
  assert.equal(pkg.validation.ok, true, `${pkg.prototypeId}/${pkg.seed}: ${pkg.validation.errors.join("; ")}`);
  assert.equal(pkg.options.length, 4);
  assert.equal(new Set(pkg.options.map((option) => option.value)).size, 4);
  assert.equal(pkg.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer);
  assert.ok(pkg.explanation.coreConcept.length >= 35, `${pkg.prototypeId}/${pkg.seed}: concept is too short.`);
  assert.ok(pkg.explanation.steps.length >= 1, `${pkg.prototypeId}/${pkg.seed}: no calculation steps.`);
  assert.ok(pkg.explanation.finalAnswer.includes(pkg.canonicalAnswer), `${pkg.prototypeId}/${pkg.seed}: final answer is not bound.`);

  const frames = frameCounts.get(pkg.prototypeId) ?? new Set<string>();
  frames.add(frameSignature(pkg.stem));
  frameCounts.set(pkg.prototypeId, frames);
  const difficulties = difficultyByPrototype.get(pkg.prototypeId) ?? new Set<string>();
  difficulties.add(pkg.difficulty);
  difficultyByPrototype.set(pkg.prototypeId, difficulties);

  if (
    pkg.generationIdentity.startsWith("SAP_CP003_EDITORIAL_V3")
    || pkg.generationIdentity.startsWith("SAP_CP003_EDITORIAL_QUALITY_V3")
    || pkg.generationIdentity.startsWith("SAP_CP003_RECURRING_DECIMAL_V3")
    || pkg.generationIdentity.startsWith("SAP_CP003_MISSING_PERCENTAGE_V3")
  ) {
    latestEditorialPackages += 1;
  }

  for (const option of pkg.options) {
    if (!option.isCorrect && (!option.misconceptionId || option.analysis.length < 25)) missingDistractorAnalyses += 1;
    if (option.misconceptionId && GENERIC_DISTRACTOR_IDS.has(option.misconceptionId)) genericDistractors += 1;
  }
  for (let left = 0; left < pkg.options.length; left += 1) {
    for (let right = left + 1; right < pkg.options.length; right += 1) {
      if (sameDisplayedValue(pkg.options[left]!.value, pkg.options[right]!.value)) equivalentOptionPairs += 1;
    }
  }
}

for (const prototypeId of SAP_CP003_PROTOTYPE_IDS) {
  const actual = frameCounts.get(prototypeId)?.size ?? 0;
  assert.ok(actual >= MINIMUM_FRAME_COUNTS[prototypeId], `${prototypeId}: expected at least ${MINIMUM_FRAME_COUNTS[prototypeId]} frames, found ${actual}.`);
}
assert.equal(genericDistractors, 0);
assert.equal(missingDistractorAnalyses, 0);
assert.equal(equivalentOptionPairs, 0);
assert.ok(latestEditorialPackages >= 900, `Only ${latestEditorialPackages} packages use the latest editorial-remediation surfaces.`);

const diagnosisPrototype = "SAP-CP003-PROT-IDENTIFY-INCORRECT-CONVERSION-STEP" as const;
const diagnosisPackages = sweep.filter((pkg) => pkg.prototypeId === diagnosisPrototype);
assert.deepEqual([...new Set(diagnosisPackages.map((pkg) => pkg.canonicalAnswer))].sort(), ["No error", "Step 1", "Step 2", "Step 3"].sort());
assert.ok(diagnosisPackages.some((pkg) => pkg.difficulty === "EASY"));
assert.ok(diagnosisPackages.some((pkg) => pkg.difficulty === "MEDIUM"));
assert.equal(diagnosisPackages.filter((pkg) => pkg.difficulty === "HARD").length, 0);

const percentagePrototype = "SAP-CP003-PROT-MISSING-PERCENTAGE-LITERAL" as const;
assert.equal(frameCounts.get(percentagePrototype)?.size, 4);
for (const pkg of sweep.filter((item) => item.prototypeId === percentagePrototype)) {
  assert.ok(pkg.options.every((option) => option.value.endsWith("%")));
}

const recurringPrototype = "SAP-CP003-PROT-RECURRING-DECIMAL-IN-EXPRESSION" as const;
const recurringSurfaceCount = frameCounts.get(recurringPrototype)?.size ?? 0;
assert.ok(recurringSurfaceCount >= 4 && recurringSurfaceCount <= 8, `Recurring-decimal notation produced ${recurringSurfaceCount} normalized surfaces; expected 4 to 8.`);
assert.ok(sweep.filter((pkg) => pkg.prototypeId === recurringPrototype).some((pkg) => pkg.stem.match(/recurring.*recurring/i)));

const review = generateSapCp003ReviewRecords();
assert.equal(review.length, 300);
assert.equal(new Set(review.map((record) => record.canonicalPayloadKey)).size, 300);
assert.equal(new Set(review.map((record) => record.prototypeId)).size, 19);
const reviewSequence = review.map((record) => record.correctIndex);
assert.ok(maximumRun(reviewSequence) <= 7);
assert.ok(forwardCycleTransitions(reviewSequence) <= 120);
assert.ok(review.every((record) => record.options.filter((option) => !option.isCorrect).every((option) => Boolean(option.misconceptionId) && option.analysis.length >= 25)));

const mockUseTiers = [...new Set(Object.values(SAP_CP003_EXAM_READINESS_POLICY).map((policy) => policy.mockUse))].sort();
assert.deepEqual(mockUseTiers, ["FOUNDATION_ONLY", "SSC_AND_BANKING_ELIGIBLE", "SSC_ELIGIBLE"].sort());
assert.equal(Object.values(SAP_CP003_EXAM_READINESS_POLICY).filter((policy) => policy.mockUse === "REMEDIATION_PENDING").length, 0);
assert.equal(SAP_CP003_EDITORIAL_V3_STATE.status, "EDITORIAL_REMEDIATION_V3_HUMAN_REVIEW_APPROVED");
assert.equal(SAP_CP003_EDITORIAL_V3_STATE.explanationReview, "FULL_300_QUESTION_HUMAN_APPROVED");
assert.equal(SAP_CP003_EDITORIAL_V3_STATE.approvalAuthority, "PRODUCT_OWNER_APPROVED_2026_08_08");
assert.equal(SAP_CP003_EDITORIAL_V3_STATE.active, false);
assert.equal(SAP_CP003_EDITORIAL_V3_STATE.questionStudioDiscoverable, false);
assert.equal(SAP_CP003_EDITORIAL_V3_STATE.testEligible, false);
assert.equal(Object.keys(SAP_CP003_PROTOTYPE_TO_PERMANENT_QL).length, 19);

console.log(JSON.stringify({
  status: "PASS_SAP_CP003_EDITORIAL_REMEDIATION_V3_APPROVED_AUTHORITY",
  packagesTested: sweep.length,
  uniqueGenerationIdentities: new Set(sweep.map((pkg) => pkg.generationIdentity)).size,
  reviewQuestions: review.length,
  minimumFrameCounts: Object.fromEntries([...frameCounts.entries()].map(([prototypeId, frames]) => [SAP_CP003_PROTOTYPE_TO_PERMANENT_QL[prototypeId], frames.size])),
  genericDistractors,
  missingDistractorAnalyses,
  equivalentOptionPairs,
  latestEditorialPackages,
  recurringSurfaceCount,
  diagnosisAnswers: [...new Set(diagnosisPackages.map((pkg) => pkg.canonicalAnswer))].sort(),
  diagnosisDifficulties: [...new Set(diagnosisPackages.map((pkg) => pkg.difficulty))].sort(),
  reviewAnswerPositions: {
    A: reviewSequence.filter((value) => value === 0).length,
    B: reviewSequence.filter((value) => value === 1).length,
    C: reviewSequence.filter((value) => value === 2).length,
    D: reviewSequence.filter((value) => value === 3).length,
  },
  reviewForwardCycleRate: Number((forwardCycleTransitions(reviewSequence) / (reviewSequence.length - 1)).toFixed(4)),
  mockUseTiers,
  approvalAuthority: SAP_CP003_EDITORIAL_V3_STATE.approvalAuthority,
  lifecycle: "INACTIVE_HUMAN_REVIEW_APPROVED_AWAITING_MERGE_AUTHORIZATION",
}, null, 2));
