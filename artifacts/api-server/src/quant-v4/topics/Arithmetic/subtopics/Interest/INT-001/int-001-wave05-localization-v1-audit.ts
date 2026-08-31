import assert from "node:assert/strict";
import { INT_001_WAVE03_QL_IDS } from "./int-001-wave03-permanent-allocation-v1";
import { generateInt001Wave05EnglishFrozenQuestion } from "./int-001-wave05-english-freeze-v1";
import {
  generateInt001Wave05LocalizedQuestion,
  INT_001_WAVE05_LOCALIZATION_VERSION,
  INT_001_WAVE05_LOCALIZED_LANGUAGES,
} from "./int-001-wave05-localization-v1";

const SEEDS_PER_QL_LANGUAGE = 300;
const FORBIDDEN = /\b(multiplier|combined\s+factor|amount\s+factor|return[-\s]difference\s+factor|growth\s+factor|depreciation\s+factor)\b|गुणक|ਗੁਣਕ/iu;
const NUMBER = /\d/u;
const ARITHMETIC = /[=×÷+−^/]|₹|%/u;
const DEVANAGARI = /[\u0900-\u097F]/u;
const GURMUKHI = /[\u0A00-\u0A7F]/u;
const DEPRECATED_PUNJABI_CI = /ਚੱਕਰਵੱਧੀ/gu;

let questions = 0;
let semanticParityChecks = 0;
let localeChecks = 0;
let directCalculationChecks = 0;
let lifecycleChecks = 0;

for (const qlId of INT_001_WAVE03_QL_IDS) {
  for (const language of INT_001_WAVE05_LOCALIZED_LANGUAGES) {
    for (let index = 0; index < SEEDS_PER_QL_LANGUAGE; index += 1) {
      const seed = `INT-001-WAVE05-LOCALIZATION:${qlId}:${language}:${index}`;
      const english = generateInt001Wave05EnglishFrozenQuestion(qlId, seed) as any;
      const localized = generateInt001Wave05LocalizedQuestion(qlId, seed, language) as any;

      assert.equal(localized.qlId, english.qlId);
      assert.equal(localized.correctIndex, english.correctIndex);
      assert.equal(localized.mathematicalFingerprint, english.mathematicalFingerprint);
      assert.equal(JSON.stringify(localized.mathematicalState), JSON.stringify(english.mathematicalState));
      assert.equal(JSON.stringify(localized.options), JSON.stringify(english.options));
      assert.equal(JSON.stringify(localized.answer), JSON.stringify(english.answer));
      assert.equal(localized.sourcePrototypeId, english.sourcePrototypeId);
      semanticParityChecks += 7;

      assert.equal(localized.localizationVersion, INT_001_WAVE05_LOCALIZATION_VERSION);
      assert.equal(localized.language, language);
      assert.equal(localized.locale, language === "hi" ? "hi-IN" : "pa-IN");
      assert.notEqual(localized.stem, english.stem);
      assert.ok(language === "hi" ? DEVANAGARI.test(localized.stem) : GURMUKHI.test(localized.stem), `${qlId}/${seed}: localized script missing`);
      if (language === "pa") assert.equal(DEPRECATED_PUNJABI_CI.test(localized.stem), false, `${qlId}/${seed}: deprecated Punjabi CI term returned`);
      localeChecks += 6;

      assert.equal(localized.explanationStyle, "DIRECT_CALCULATION");
      assert.equal(localized.explanation.steps.length, english.explanation.steps.length);
      assert.ok(localized.explanation.steps.length >= 3 && localized.explanation.steps.length <= 6);
      for (const step of localized.explanation.steps) {
        assert.ok(NUMBER.test(step), `${qlId}/${seed}: localized worked line lacks numerical substitution: ${step}`);
        assert.ok(ARITHMETIC.test(step), `${qlId}/${seed}: localized worked line lacks visible arithmetic: ${step}`);
        assert.equal(FORBIDDEN.test(step), false, `${qlId}/${seed}: forbidden abstract narration survived localization: ${step}`);
        if (language === "pa") assert.equal(DEPRECATED_PUNJABI_CI.test(step), false, `${qlId}/${seed}: deprecated Punjabi CI term returned in explanation`);
        directCalculationChecks += language === "pa" ? 4 : 3;
      }
      directCalculationChecks += 3;

      assert.equal(localized.lifecycle.permanentIdentityFrozen, true);
      assert.equal(localized.lifecycle.learnerContentFrozen, true);
      assert.equal(localized.lifecycle.questionStudioDiscoverable, false);
      assert.equal(localized.lifecycle.questionBankWritable, false);
      assert.equal(localized.lifecycle.testEligible, false);
      assert.equal(localized.lifecycle.mockTestEligible, false);
      assert.equal(localized.lifecycle.publiclyPublishable, false);
      assert.equal(localized.lifecycle.automaticStudentPublication, false);
      lifecycleChecks += 8;
      questions += 1;
    }
  }
}

assert.equal(questions, 1800);
console.log(JSON.stringify({
  version: INT_001_WAVE05_LOCALIZATION_VERSION,
  qls: INT_001_WAVE03_QL_IDS,
  languages: INT_001_WAVE05_LOCALIZED_LANGUAGES,
  seedsPerQlLanguage: SEEDS_PER_QL_LANGUAGE,
  questions,
  semanticParityChecks,
  localeChecks,
  directCalculationChecks,
  lifecycleChecks,
  policy: {
    englishFrozenMathPreserved: true,
    optionAndAnswerOwnershipPreserved: true,
    directCalculationStylePreserved: true,
    hindiPunjabiSemanticParity: true,
    downstreamDeliveryClosed: true,
  },
}, null, 2));
console.log("PASS_INT_001_WAVE05_LOCALIZATION_V1_AUDIT");
