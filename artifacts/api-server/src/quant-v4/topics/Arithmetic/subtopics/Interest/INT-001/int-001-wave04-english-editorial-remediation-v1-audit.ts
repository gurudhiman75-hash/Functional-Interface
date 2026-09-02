import assert from "node:assert/strict";
import { INT_001_WAVE03_QL_IDS } from "./int-001-wave03-permanent-allocation-v1";
import { generateInt001Wave04EnglishCandidate } from "./int-001-wave04-english-authority-v1";

const SEEDS_PER_QL = 300;
const FORBIDDEN_ABSTRACT = /\b(multiplier|combined\s+factor|amount\s+factor|return[-\s]difference\s+factor|multiplication\s+factor)\b/iu;

function equalRational(left: any, right: any) {
  return left.numerator * right.denominator === right.numerator * left.denominator;
}
function exactAtPaise(value: any) {
  return (value.numerator * 100n) % value.denominator === 0n;
}
function numeric(value: any) {
  return Number(value.numerator) / Number(value.denominator);
}

let checks = 0;
let exactPaiseGainChecks = 0;
let antiCollapseChecks = 0;
let nearbyDistractorChecks = 0;
let cleanExplanationChecks = 0;
let directCalculationChecks = 0;
let maxQualitySelectionAttempts = 0;

for (const qlId of INT_001_WAVE03_QL_IDS) {
  for (let index = 0; index < SEEDS_PER_QL; index += 1) {
    const seed = `INT-001-WAVE04-EDITORIAL:${qlId}:${index}`;
    const question = generateInt001Wave04EnglishCandidate(qlId, seed) as any;
    maxQualitySelectionAttempts = Math.max(maxQualitySelectionAttempts, question.qualitySelectionAttempts);
    assert.ok(question.qualitySelectionAttempts >= 1 && question.qualitySelectionAttempts <= 96, `${qlId}/${seed}: invalid deterministic quality-selection attempts`);
    checks += 1;

    const explanation = [question.explanation.keyIdea, ...question.explanation.steps, question.explanation.shortcut, question.explanation.commonTrap].join("\n");
    assert.equal(/\b\d{4,}\/\d{4,}\b/u.test(explanation), false, `${qlId}/${seed}: learner explanation leaked an unreadable raw fraction`);
    assert.equal(FORBIDDEN_ABSTRACT.test(explanation), false, `${qlId}/${seed}: abstract multiplier/factor narration survived the direct-calculation retrofit`);
    assert.ok(question.explanation.steps.some((step: string) => /[=×÷+−^/]/u.test(step) && /\d/u.test(step)), `${qlId}/${seed}: direct numerical working is missing`);
    cleanExplanationChecks += 1;
    directCalculationChecks += 2;

    if (qlId === "INT-QL-132" || qlId === "INT-QL-133") {
      const state = question.mathematicalState;
      const collapsed = state.simpleYears === 1 && equalRational(state.simpleRatePercent, state.compoundRatePercent);
      assert.equal(collapsed, false, `${qlId}/${seed}: sequential mixed state collapsed into a same-rate one-year SI/CI identity`);
      antiCollapseChecks += 1;
    }

    if (qlId === "INT-QL-134") {
      const state = question.mathematicalState;
      assert.equal(exactAtPaise(state.netGain), true, `${qlId}/${seed}: displayed gain would round away exact solver input`);
      assert.ok(question.explanation.steps.some((step: string) => step.startsWith("Difference on ₹100 =")), `${qlId}/${seed}: ₹100 direct-comparison calculation layer missing`);
      assert.ok(question.explanation.steps.some((step: string) => step.startsWith("Actual difference is ") && step.includes("principal =")), `${qlId}/${seed}: direct scale-up to principal missing`);
      exactPaiseGainChecks += 2;
      directCalculationChecks += 2;

      const answer = numeric(question.answer);
      const calculationSlips = question.options.filter((option: any) => !option.isCorrect && /CALCULATION_SLIP$/u.test(option.misconceptionId));
      assert.equal(calculationSlips.length, 2, `${qlId}/${seed}: QL134 must carry exactly two nearby calculation-slip distractors`);
      for (const option of calculationSlips) {
        const ratio = numeric(option.value) / answer;
        assert.ok(ratio >= 0.8 && ratio <= 1.2 && Math.abs(ratio - 1) >= 0.05, `${qlId}/${seed}: nearby distractor escaped the 5–20% exam-realistic band`);
      }
      const conceptual = question.options.filter((option: any) => !option.isCorrect && !/CALCULATION_SLIP$/u.test(option.misconceptionId));
      assert.equal(conceptual.length, 1, `${qlId}/${seed}: QL134 must retain one conceptual misconception distractor`);
      nearbyDistractorChecks += 4;
    }
  }
}

assert.equal(checks, 900);
assert.equal(antiCollapseChecks, 600);
assert.equal(exactPaiseGainChecks, 600);
assert.equal(nearbyDistractorChecks, 1200);
assert.equal(cleanExplanationChecks, 900);
assert.equal(directCalculationChecks, 2400);

console.log(JSON.stringify({
  seedsPerQl: SEEDS_PER_QL,
  qls: INT_001_WAVE03_QL_IDS,
  checks,
  antiCollapseChecks,
  exactPaiseGainChecks,
  nearbyDistractorChecks,
  cleanExplanationChecks,
  directCalculationChecks,
  maxQualitySelectionAttempts,
  policy: {
    sequentialIdentityCollapseRejected: true,
    ql134ExactDisplayedGainRequired: true,
    ql134Distractors: "ONE_CONCEPTUAL_PLUS_TWO_NEARBY",
    unreadableRawFractionsRejected: true,
    abstractMultiplierFactorNarrationRejected: true,
    ql134Method: "DIRECT_RUPEES_100_COMPARISON_AND_SCALE",
  },
}, null, 2));
console.log("PASS_INT_001_WAVE04_ENGLISH_EDITORIAL_REMEDIATION_V1_AUDIT");
