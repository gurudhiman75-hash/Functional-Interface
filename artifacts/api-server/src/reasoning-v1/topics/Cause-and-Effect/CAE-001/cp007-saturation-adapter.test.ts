import assert from "node:assert/strict";
import {
  CP007_SATURATION_COMMON_FACTOR_FAMILY_IDS,
  CP007_SATURATION_COMMON_FACTOR_WORLDS,
  generateReviewedCp007SaturationCommonFactorQuestion,
} from "./cp007-saturation-adapter.ts";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";
import type { CaeLocale } from "./types.ts";

const LOCALES: readonly CaeLocale[] = ["en-IN", "hi-IN", "pa-IN"];

assert.ok(CP007_SATURATION_COMMON_FACTOR_FAMILY_IDS.length >= 2, "CP007 Wave 3 needs multiple new common-factor families.");
assert.ok(CP007_SATURATION_COMMON_FACTOR_WORLDS.length >= 8, "CP007 Wave 3 needs substantial new common-factor world depth.");

const seenFamilies = new Set<string>();
const seenVariants = new Set<string>();
for (let seed = 0; seed < 240; seed += 1) {
  const en = generateReviewedCp007SaturationCommonFactorQuestion({ locale: "en-IN", seed });
  seenFamilies.add(en.scenarioFamilyId);
  seenVariants.add(en.scenarioVariantId);
  assert.equal(en.checkpointId, "CAE-CP-007");
  assert.equal(en.qlId, "CAE-QL-007");
  assert.equal(en.answerId, "COMMON_CAUSE");
  assert.equal(en.difficulty, "MEDIUM", `${seed}: CP007 saturation adapter must never emit EASY content.`);
  assert.equal(en.options.length, 4);
  assert.equal(new Set(en.options).size, 4);
  assert.equal(en.optionMetadata.filter((option) => option.isCorrect).length, 1);
  assert.equal(en.visibleContext.visibleNodeIds.length, 2);
  assert.equal(en.visibleContext.hiddenNodeIds.length, 1);
  assert.equal(en.metadata.reviewOnly, true);
  assert.equal(en.metadata.questionBankWritable, false);
  assert.equal(en.metadata.publicEligible, false);

  for (const locale of LOCALES) {
    const localized = generateReviewedCp007SaturationCommonFactorQuestion({ locale, seed });
    assert.equal(localized.scenarioFamilyId, en.scenarioFamilyId, `${seed}/${locale}: CP007 saturation family drift`);
    assert.equal(localized.scenarioVariantId, en.scenarioVariantId, `${seed}/${locale}: CP007 saturation variant drift`);
    assert.equal(localized.answerId, en.answerId, `${seed}/${locale}: CP007 saturation answer drift`);
    assert.equal(localized.correctIndex, en.correctIndex, `${seed}/${locale}: CP007 saturation option-order drift`);
  }
}
assert.deepEqual(seenFamilies, new Set(CP007_SATURATION_COMMON_FACTOR_FAMILY_IDS), "240-seed CP007 saturation QA must reach every approved family.");
assert.equal(seenVariants.size, CP007_SATURATION_COMMON_FACTOR_WORLDS.length, "240-seed CP007 saturation QA must reach every approved world.");

let reviewedSaturation = 0;
let legacyCommon = 0;
let falseCausation = 0;
for (let seed = 0; seed < 800; seed += 1) {
  const question = generateReviewedCaeQuestion({ qlId: "CAE-QL-007", locale: "en-IN", seed });
  assert.notEqual(question.difficulty, "EASY", `${seed}: reviewed CP007 must never regress to EASY.`);
  if (CP007_SATURATION_COMMON_FACTOR_FAMILY_IDS.includes(question.scenarioFamilyId)) reviewedSaturation += 1;
  else if (question.scenarioFamilyId === "CAE-FAM-SHARED-PRESSURE") legacyCommon += 1;
  else if (question.scenarioFamilyId === "CAE-FAM-FALSE-CAUSATION") falseCausation += 1;
  else assert.fail(`${seed}: unexpected reviewed CP007 family ${question.scenarioFamilyId}`);
}
assert.equal(reviewedSaturation, 100, "CP007 Wave 3 saturation allocation must remain exactly one seed in eight.");
assert.equal(legacyCommon, 100, "CP007 legacy common-factor allocation must remain exactly one seed in eight.");
assert.equal(falseCausation, 600, "CP007 false-causation authority must remain dominant at six seeds in eight.");

console.log(`CAE-001 CP007 Wave 3 saturation QA passed: ${CP007_SATURATION_COMMON_FACTOR_FAMILY_IDS.length} families / ${CP007_SATURATION_COMMON_FACTOR_WORLDS.length} worlds.`);
