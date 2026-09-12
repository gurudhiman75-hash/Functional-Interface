import assert from "node:assert/strict";
import { verifyIntCp010SequentialReopen } from "./cp010-sequential-mixed-source-reopen-v2";
import { INT_001_WAVE03_QL_IDS } from "./int-001-wave03-permanent-allocation-v1";
import {
  INT_001_WAVE04_ENGLISH_CALCULATION_STYLE_VERSION,
  generateInt001Wave04EnglishCalculationCandidate,
} from "./int-001-wave04-english-authority-v2-calculation";

const SEEDS_PER_QL = 300;
const FORBIDDEN_EXPLANATION_JARGON = /\b(?:multiplier|multipliers|amount factor|combined factor|return-difference factor|growth factor)\b/iu;

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}

let questions = 0;
let deterministicChecks = 0;
let verifierChecks = 0;
let directStyleChecks = 0;
let arithmeticDensityChecks = 0;
let jargonChecks = 0;
let qlSpecificChecks = 0;

for (const qlId of INT_001_WAVE03_QL_IDS) {
  for (let index = 0; index < SEEDS_PER_QL; index += 1) {
    const seed = `INT-001-WAVE04-DIRECT-CALC:${qlId}:${index}`;
    const first = generateInt001Wave04EnglishCalculationCandidate(qlId, seed) as any;
    const second = generateInt001Wave04EnglishCalculationCandidate(qlId, seed) as any;

    assert.equal(stable(first), stable(second), `${qlId}/${seed}: direct-calculation package is not deterministic`);
    deterministicChecks += 1;

    assert.equal(first.authorityVersion, INT_001_WAVE04_ENGLISH_CALCULATION_STYLE_VERSION);
    assert.equal(first.explanationStyle, "DIRECT_CALCULATION");
    assert.equal(first.provenance.learnerExplanationStyle, "DIRECT_CALCULATION");
    assert.equal(first.provenance.conceptualFactorNarrationRemoved, true);
    directStyleChecks += 4;

    assert.equal(verifyIntCp010SequentialReopen(first.mathematicalState, first.answer), true, `${qlId}/${seed}: verifier rejected answer after explanation rewrite`);
    verifierChecks += 1;

    const explanationText = [
      first.explanation.whatAsked,
      first.explanation.keyIdea,
      ...first.explanation.steps,
      first.explanation.shortcut,
      first.explanation.commonTrap,
      first.explanation.finalAnswer,
    ].join("\n");

    assert.equal(FORBIDDEN_EXPLANATION_JARGON.test(explanationText), false, `${qlId}/${seed}: conceptual factor/multiplier narration leaked`);
    jargonChecks += 1;

    assert.ok(first.explanation.keyIdea.length <= 150, `${qlId}/${seed}: key idea is too verbose`);
    assert.ok(first.explanation.steps.length >= 4 && first.explanation.steps.length <= 6, `${qlId}/${seed}: explanation should stay within 4–6 calculation lines`);
    assert.ok(first.explanation.steps.every((step: string) => /\d/u.test(step)), `${qlId}/${seed}: every worked line must contain actual numerical calculation`);
    const arithmeticLines = first.explanation.steps.filter((step: string) => /[×÷+−=]/u.test(step)).length;
    assert.ok(arithmeticLines >= first.explanation.steps.length - 1, `${qlId}/${seed}: explanation is not calculation-dense enough`);
    assert.ok((explanationText.match(/[₹%]/gu) ?? []).length >= 5, `${qlId}/${seed}: explanation lacks concrete monetary/rate substitution`);
    arithmeticDensityChecks += 5;

    if (qlId === "INT-QL-132") {
      assert.ok(first.explanation.steps.some((step: string) => /^SI =|SI on/u.test(step)), `${qlId}/${seed}: SI calculation line missing`);
      assert.ok(first.explanation.steps.some((step: string) => /CI/u.test(step)), `${qlId}/${seed}: CI calculation line missing`);
      assert.ok(first.explanation.steps.some((step: string) => /final amount/i.test(step)), `${qlId}/${seed}: final amount line missing`);
      qlSpecificChecks += 3;
    } else if (qlId === "INT-QL-133") {
      assert.ok(first.explanation.steps[0].startsWith("Before the "), `${qlId}/${seed}: inverse solution must begin by undoing the last stage`);
      assert.ok(first.explanation.steps.some((step: string) => /Original principal =/u.test(step)), `${qlId}/${seed}: direct principal calculation missing`);
      assert.equal(/work backward/i.test(first.explanation.keyIdea), true, `${qlId}/${seed}: inverse direction not stated simply`);
      qlSpecificChecks += 3;
    } else {
      assert.ok(first.explanation.steps.some((step: string) => /For ₹100, SI amount/u.test(step)), `${qlId}/${seed}: ₹100 SI base calculation missing`);
      assert.ok(first.explanation.steps.some((step: string) => /For ₹100, CI amount/u.test(step)), `${qlId}/${seed}: ₹100 CI base calculation missing`);
      assert.ok(first.explanation.steps.some((step: string) => /Difference on ₹100/u.test(step)), `${qlId}/${seed}: ₹100 difference calculation missing`);
      assert.ok(first.explanation.steps.some((step: string) => /Actual difference is/u.test(step)), `${qlId}/${seed}: scaling calculation missing`);
      qlSpecificChecks += 4;
    }

    assert.equal(first.lifecycle.learnerContentFrozen, false);
    assert.equal(first.lifecycle.questionStudioDiscoverable, false);
    assert.equal(first.lifecycle.questionBankWritable, false);
    assert.equal(first.lifecycle.testEligible, false);
    assert.equal(first.lifecycle.publiclyPublishable, false);
    questions += 1;
  }
}

assert.equal(questions, 900);

console.log(JSON.stringify({
  version: INT_001_WAVE04_ENGLISH_CALCULATION_STYLE_VERSION,
  qls: INT_001_WAVE03_QL_IDS,
  seedsPerQl: SEEDS_PER_QL,
  questions,
  deterministicChecks,
  verifierChecks,
  directStyleChecks,
  arithmeticDensityChecks,
  jargonChecks,
  qlSpecificChecks,
  explanationPolicy: {
    style: "DIRECT_CALCULATION",
    conceptualMultiplierNarration: "FORBIDDEN",
    workedLines: "4_TO_6",
    numericalSubstitutionOnEveryLine: true,
    ql132: "CALCULATE_STAGE_1_THEN_STAGE_2",
    ql133: "UNDO_LAST_STAGE_THEN_FIRST",
    ql134: "CALCULATE_ON_RUPEES_100_THEN_SCALE",
  },
}, null, 2));
console.log("PASS_INT_001_WAVE04_DIRECT_CALCULATION_EXPLANATION_V2_AUDIT");
