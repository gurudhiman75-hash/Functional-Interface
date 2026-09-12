import assert from "node:assert/strict";
import { INT_001_WAVE03_QL_IDS } from "./int-001-wave03-permanent-allocation-v1";
import { generateInt001Wave04EnglishCandidate } from "./int-001-wave04-english-authority-v1";
import {
  generateInt001Wave04DirectCalculationCandidate,
  INT_001_WAVE04_DIRECT_CALCULATION_PRESENTATION_VERSION,
} from "./int-001-wave04-direct-calculation-presentation-v2";

const SEEDS_PER_QL = 300;
const FORBIDDEN = /\b(multiplier|combined\s+factor|amount\s+factor|return[-\s]difference\s+factor|growth\s+factor)\b/iu;
const NUMBER = /\d/u;
const ARITHMETIC = /[=×÷+−^/]|₹|%/u;

let questions = 0;
let identityPreservationChecks = 0;
let compactnessChecks = 0;
let arithmeticChecks = 0;
let jargonChecks = 0;

for (const qlId of INT_001_WAVE03_QL_IDS) {
  for (let index = 0; index < SEEDS_PER_QL; index += 1) {
    const seed = `INT-001-WAVE04-DIRECT-PRESENTATION:${qlId}:${index}`;
    const source = generateInt001Wave04EnglishCandidate(qlId, seed) as any;
    const presented = generateInt001Wave04DirectCalculationCandidate(qlId, seed) as any;

    assert.equal(presented.qlId, source.qlId);
    assert.equal(presented.stem, source.stem);
    assert.equal(presented.correctIndex, source.correctIndex);
    assert.equal(presented.mathematicalFingerprint, source.mathematicalFingerprint);
    assert.equal(JSON.stringify(presented.options), JSON.stringify(source.options));
    identityPreservationChecks += 5;

    assert.equal(presented.explanationStyle, "DIRECT_CALCULATION");
    assert.equal(presented.explanationPresentationVersion, INT_001_WAVE04_DIRECT_CALCULATION_PRESENTATION_VERSION);
    assert.equal(presented.explanation.whatAsked, "");
    assert.equal(presented.explanation.keyIdea, "");
    assert.equal(presented.explanation.shortcut, "");
    assert.equal(presented.explanation.commonTrap, "");
    assert.ok(presented.explanation.steps.length >= 3 && presented.explanation.steps.length <= 6);
    compactnessChecks += 7;

    for (const step of presented.explanation.steps) {
      assert.ok(NUMBER.test(step), `${qlId}/${seed}: worked line lacks numerical substitution: ${step}`);
      assert.ok(ARITHMETIC.test(step), `${qlId}/${seed}: worked line lacks visible arithmetic: ${step}`);
      assert.ok(!FORBIDDEN.test(step), `${qlId}/${seed}: forbidden abstract narration survived: ${step}`);
      arithmeticChecks += 2;
      jargonChecks += 1;
    }
    assert.ok(NUMBER.test(String(presented.explanation.finalAnswer)));
    questions += 1;
  }
}

console.log(JSON.stringify({
  version: INT_001_WAVE04_DIRECT_CALCULATION_PRESENTATION_VERSION,
  qls: INT_001_WAVE03_QL_IDS,
  seedsPerQl: SEEDS_PER_QL,
  questions,
  identityPreservationChecks,
  compactnessChecks,
  arithmeticChecks,
  jargonChecks,
  policy: {
    learnerProseLayer: "REMOVED",
    workedSolution: "CALCULATION_ONLY",
    workedLines: "3_TO_6",
    mathematicalAuthorityPreserved: true,
  },
}, null, 2));
console.log("PASS_INT_001_WAVE04_DIRECT_CALCULATION_PRESENTATION_V2_AUDIT");
