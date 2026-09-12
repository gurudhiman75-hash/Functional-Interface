import assert from "node:assert/strict";
import { INT_001_WAVE03_QL_IDS } from "./int-001-wave03-permanent-allocation-v1";
import { generateInt001Wave04DirectCalculationCandidate } from "./int-001-wave04-direct-calculation-presentation-v2";
import {
  INT_001_WAVE05_ENGLISH_FREEZE_ID,
  INT_001_WAVE05_ENGLISH_FREEZE_APPROVAL,
  generateInt001Wave05EnglishFrozenQuestion,
} from "./int-001-wave05-english-freeze-v1";
import {
  INT_001_WAVE05_LOCALIZED_LOCALES,
  INT_001_WAVE05_LOCALIZED_VERSION,
  generateInt001Wave05LocalizedCandidate,
} from "./int-001-wave05-localized-candidate-v1";

const ENGLISH_SEEDS_PER_QL = 300;
const LOCALIZED_SEEDS_PER_QL_LOCALE = 150;
const FORBIDDEN = /\b(multiplier|factor|combined\s+factor|return[-\s]difference\s+factor)\b|गुणक|ਗੁਣਕ/iu;
const NUMERIC = /[0-9]/u;
const MATH = /[=×÷+−^/]/u;

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, nested) => typeof nested === "bigint" ? `${nested}n` : nested);
}
function directSteps(question: any): readonly string[] {
  return Object.freeze((question.explanation?.steps ?? []).map(String));
}

let englishFreezeChecks = 0;
let englishPayloadParityChecks = 0;
let localizationQuestions = 0;
let localizationSemanticParityChecks = 0;
let localizationLanguageChecks = 0;
let localizationExplanationChecks = 0;
let lifecycleChecks = 0;
let maxQualitySelectionAttempts = 0;

for (const qlId of INT_001_WAVE03_QL_IDS) {
  for (let index = 0; index < ENGLISH_SEEDS_PER_QL; index += 1) {
    const seed = `INT-001-WAVE05-FREEZE:${qlId}:${index}`;
    const source = generateInt001Wave04DirectCalculationCandidate(qlId, seed) as any;
    const frozen = generateInt001Wave05EnglishFrozenQuestion(qlId, seed) as any;
    maxQualitySelectionAttempts = Math.max(maxQualitySelectionAttempts, Number(frozen.qualitySelectionAttempts ?? 0));

    assert.equal(frozen.freezeId, INT_001_WAVE05_ENGLISH_FREEZE_ID, `${qlId}: wrong English freeze id`);
    assert.equal(frozen.freezeApproval.authority, INT_001_WAVE05_ENGLISH_FREEZE_APPROVAL.authority, `${qlId}: wrong freeze approval`);
    assert.equal(frozen.explanationStyle, "DIRECT_CALCULATION", `${qlId}: English freeze lost direct-calculation style`);
    assert.equal(frozen.lifecycle.permanentIdentityFrozen, true);
    assert.equal(frozen.lifecycle.learnerContentFrozen, true);
    assert.equal(frozen.lifecycle.reviewStatus, "ENGLISH_FROZEN");
    englishFreezeChecks += 6;

    assert.equal(frozen.stem, source.stem, `${qlId}: English freeze stem drift`);
    assert.equal(stable(frozen.options), stable(source.options), `${qlId}: English freeze options drift`);
    assert.equal(frozen.correctIndex, source.correctIndex, `${qlId}: English freeze correct index drift`);
    assert.equal(stable(frozen.answer), stable(source.answer), `${qlId}: English freeze answer drift`);
    assert.equal(frozen.mathematicalFingerprint, source.mathematicalFingerprint, `${qlId}: English freeze math fingerprint drift`);
    assert.equal(stable(frozen.mathematicalState), stable(source.mathematicalState), `${qlId}: English freeze mathematical state drift`);
    assert.equal(stable(frozen.explanation), stable(source.explanation), `${qlId}: English freeze explanation drift`);
    englishPayloadParityChecks += 7;

    const steps = directSteps(frozen);
    assert.ok(steps.length >= 3 && steps.length <= 6, `${qlId}: English freeze worked-line count escaped 3-6`);
    assert.equal(steps.some((step) => FORBIDDEN.test(step)), false, `${qlId}: forbidden narration in English freeze`);
    assert.ok(steps.filter((step) => NUMERIC.test(step) && MATH.test(step)).length / steps.length >= 0.75, `${qlId}: English freeze not calculation dense`);
    englishFreezeChecks += 3;

    assert.equal(frozen.lifecycle.questionStudioDiscoverable, false);
    assert.equal(frozen.lifecycle.questionBankWritable, false);
    assert.equal(frozen.lifecycle.testEligible, false);
    assert.equal(frozen.lifecycle.mockTestEligible, false);
    assert.equal(frozen.lifecycle.publiclyPublishable, false);
    lifecycleChecks += 5;
  }

  for (const locale of INT_001_WAVE05_LOCALIZED_LOCALES) {
    for (let index = 0; index < LOCALIZED_SEEDS_PER_QL_LOCALE; index += 1) {
      const seed = `INT-001-WAVE05-LOCALIZE:${qlId}:${locale}:${index}`;
      const en = generateInt001Wave05EnglishFrozenQuestion(qlId, seed) as any;
      const localized = generateInt001Wave05LocalizedCandidate(qlId, seed, locale) as any;
      localizationQuestions += 1;

      assert.equal(localized.localizedVersion, INT_001_WAVE05_LOCALIZED_VERSION);
      assert.equal(localized.localizedFromFreezeId, INT_001_WAVE05_ENGLISH_FREEZE_ID);
      assert.equal(localized.provenance.localizedFromApproval, INT_001_WAVE05_ENGLISH_FREEZE_APPROVAL.authority);
      assert.equal(localized.localizationStatus, "HI_PA_REVIEW_CANDIDATE");
      assert.equal(localized.lifecycle.learnerContentFrozen, false);
      assert.equal(localized.lifecycle.questionStudioDiscoverable, false);
      assert.equal(localized.lifecycle.questionBankWritable, false);
      assert.equal(localized.lifecycle.testEligible, false);
      assert.equal(localized.lifecycle.publiclyPublishable, false);
      lifecycleChecks += 9;

      assert.equal(localized.qlId, en.qlId);
      assert.equal(localized.sourcePrototypeId, en.sourcePrototypeId);
      assert.equal(localized.stemFamilyId, en.stemFamilyId);
      assert.equal(localized.correctIndex, en.correctIndex);
      assert.equal(stable(localized.answer), stable(en.answer));
      assert.equal(localized.mathematicalFingerprint, en.mathematicalFingerprint);
      assert.equal(stable(localized.mathematicalState), stable(en.mathematicalState));
      assert.equal(stable(localized.options.map((option: any) => option.value)), stable(en.options.map((option: any) => option.value)));
      assert.equal(stable(localized.options.map((option: any) => option.isCorrect)), stable(en.options.map((option: any) => option.isCorrect)));
      assert.equal(stable(localized.options.map((option: any) => option.misconceptionId)), stable(en.options.map((option: any) => option.misconceptionId)));
      localizationSemanticParityChecks += 10;

      assert.notEqual(localized.stem, en.stem, `${qlId}/${locale}: localized stem remained English`);
      if (locale === "hi-IN") {
        assert.ok(/[\u0900-\u097F]/u.test(localized.stem), `${qlId}: Hindi stem lacks Devanagari`);
        assert.equal(localized.language, "hi");
      } else {
        assert.ok(/[\u0A00-\u0A7F]/u.test(localized.stem), `${qlId}: Punjabi stem lacks Gurmukhi`);
        assert.equal(localized.language, "pa");
      }
      localizationLanguageChecks += 3;

      const steps = directSteps(localized);
      assert.ok(steps.length >= 3 && steps.length <= 6, `${qlId}/${locale}: worked-line count escaped 3-6`);
      assert.equal(steps.some((step) => FORBIDDEN.test(step)), false, `${qlId}/${locale}: forbidden abstract narration`);
      const arithmetic = steps.filter((step) => NUMERIC.test(step) && MATH.test(step)).length;
      assert.ok(arithmetic / steps.length >= 0.75, `${qlId}/${locale}: localized explanation not calculation dense`);
      assert.equal(localized.explanationStyle, "DIRECT_CALCULATION");
      assert.equal(localized.explanation.keyIdea, "");
      assert.equal(localized.explanation.shortcut, "");
      assert.equal(localized.explanation.commonTrap, "");
      localizationExplanationChecks += 7;
    }
  }
}

assert.equal(localizationQuestions, 900);
assert.equal(englishFreezeChecks, 8100);
assert.equal(englishPayloadParityChecks, 6300);
assert.equal(localizationSemanticParityChecks, 9000);
assert.equal(localizationLanguageChecks, 2700);
assert.equal(localizationExplanationChecks, 6300);
assert.equal(lifecycleChecks, 12600);

console.log(JSON.stringify({
  englishFreezeId: INT_001_WAVE05_ENGLISH_FREEZE_ID,
  freezeApproval: INT_001_WAVE05_ENGLISH_FREEZE_APPROVAL.authority,
  qls: INT_001_WAVE03_QL_IDS,
  englishSeedsPerQl: ENGLISH_SEEDS_PER_QL,
  localizedSeedsPerQlLocale: LOCALIZED_SEEDS_PER_QL_LOCALE,
  englishQuestions: ENGLISH_SEEDS_PER_QL * INT_001_WAVE03_QL_IDS.length,
  localizationQuestions,
  englishFreezeChecks,
  englishPayloadParityChecks,
  localizationSemanticParityChecks,
  localizationLanguageChecks,
  localizationExplanationChecks,
  lifecycleChecks,
  maxQualitySelectionAttempts,
  policy: {
    englishFreezeSource: "WAVE04_DIRECT_CALCULATION_PRESENTATION_v2",
    localizedSemantics: "MATHEMATICAL_STATE_OPTIONS_ANSWER_IDENTICAL_TO_ENGLISH_FREEZE",
    localizedExplanationStyle: "DIRECT_CALCULATION",
    abstractMultiplierFactorNarration: "FORBIDDEN",
    downstreamDelivery: "CLOSED",
  },
}, null, 2));
console.log("PASS_INT_001_WAVE05_FREEZE_LOCALIZATION_V1_AUDIT");
