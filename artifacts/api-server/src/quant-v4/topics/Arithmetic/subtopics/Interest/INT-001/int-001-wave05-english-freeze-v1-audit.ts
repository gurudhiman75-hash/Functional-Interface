import assert from "node:assert/strict";
import { INT_001_WAVE03_QL_IDS } from "./int-001-wave03-permanent-allocation-v1";
import { generateInt001Wave04DirectCalculationCandidate } from "./int-001-wave04-direct-calculation-presentation-v2";
import {
  generateInt001Wave05EnglishFrozenQuestion,
  INT_001_WAVE05_ENGLISH_FREEZE_VERSION,
} from "./int-001-wave05-english-freeze-v1";

const SEEDS_PER_QL = 300;
const FORBIDDEN = /\b(multiplier|combined\s+factor|amount\s+factor|return[-\s]difference\s+factor|growth\s+factor|depreciation\s+factor)\b|गुणक|ਗੁਣਕ/iu;
const NUMBER = /\d/u;
const ARITHMETIC = /[=×÷+−^/]|₹|%/u;

let questions = 0;
let identityChecks = 0;
let freezeChecks = 0;
let directCalculationChecks = 0;
let lifecycleChecks = 0;

for (const qlId of INT_001_WAVE03_QL_IDS) {
  for (let index = 0; index < SEEDS_PER_QL; index += 1) {
    const seed = `INT-001-WAVE05-EN-FREEZE:${qlId}:${index}`;
    const source = generateInt001Wave04DirectCalculationCandidate(qlId, seed) as any;
    const frozen = generateInt001Wave05EnglishFrozenQuestion(qlId, seed) as any;

    assert.equal(frozen.qlId, source.qlId);
    assert.equal(frozen.stem, source.stem);
    assert.equal(frozen.correctIndex, source.correctIndex);
    assert.equal(frozen.mathematicalFingerprint, source.mathematicalFingerprint);
    assert.equal(JSON.stringify(frozen.options), JSON.stringify(source.options));
    assert.equal(JSON.stringify(frozen.mathematicalState), JSON.stringify(source.mathematicalState));
    assert.equal(JSON.stringify(frozen.explanation), JSON.stringify(source.explanation));
    identityChecks += 7;

    assert.equal(frozen.freezeVersion, INT_001_WAVE05_ENGLISH_FREEZE_VERSION);
    assert.equal(frozen.learnerContentFrozen, true);
    assert.equal(frozen.lifecycle.permanentIdentityFrozen, true);
    assert.equal(frozen.lifecycle.learnerContentFrozen, true);
    assert.equal(Object.isFrozen(frozen), true);
    assert.equal(Object.isFrozen(frozen.explanation), true);
    freezeChecks += 6;

    assert.equal(frozen.explanationStyle, "DIRECT_CALCULATION");
    assert.ok(frozen.explanation.steps.length >= 3 && frozen.explanation.steps.length <= 6);
    for (const step of frozen.explanation.steps) {
      assert.ok(NUMBER.test(step), `${qlId}/${seed}: frozen worked line lacks numbers: ${step}`);
      assert.ok(ARITHMETIC.test(step), `${qlId}/${seed}: frozen worked line lacks arithmetic: ${step}`);
      assert.equal(FORBIDDEN.test(step), false, `${qlId}/${seed}: forbidden explanation jargon survived freeze: ${step}`);
      directCalculationChecks += 3;
    }
    directCalculationChecks += 2;

    assert.equal(frozen.lifecycle.questionStudioDiscoverable, false);
    assert.equal(frozen.lifecycle.questionBankStatus, "NOT_STORED");
    assert.equal(frozen.lifecycle.questionBankWritable, false);
    assert.equal(frozen.lifecycle.testEligibility, "INELIGIBLE");
    assert.equal(frozen.lifecycle.testEligible, false);
    assert.equal(frozen.lifecycle.mockTestEligible, false);
    assert.equal(frozen.lifecycle.publiclyPublishable, false);
    assert.equal(frozen.lifecycle.automaticStudentPublication, false);
    lifecycleChecks += 8;
    questions += 1;
  }
}

assert.equal(questions, 900);
console.log(JSON.stringify({
  version: INT_001_WAVE05_ENGLISH_FREEZE_VERSION,
  qls: INT_001_WAVE03_QL_IDS,
  seedsPerQl: SEEDS_PER_QL,
  questions,
  identityChecks,
  freezeChecks,
  directCalculationChecks,
  lifecycleChecks,
  policy: {
    frozenSource: "WAVE04_DIRECT_CALCULATION_PRESENTATION_V2",
    learnerContentFrozen: true,
    mathematicalAuthorityPreserved: true,
    downstreamDeliveryClosed: true,
  },
}, null, 2));
console.log("PASS_INT_001_WAVE05_ENGLISH_FREEZE_V1_AUDIT");
