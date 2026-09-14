import assert from "node:assert/strict";
import {
  CP007_SATURATION_COMMON_FACTOR_FAMILY_IDS,
  CP007_SATURATION_COMMON_FACTOR_WORLDS,
  generateReviewedCp007SaturationCommonFactorQuestion,
} from "./cp007-saturation-adapter.ts";
import { CP007_WAVE4_PARALLEL_FAMILY_IDS, generateReviewedCp007Wave4ParallelQuestion } from "./cp007-wave4-parallel-adapter.ts";
import { CP007_EXPANDED_FALSE_CAUSATION_FAMILY_ID } from "./cp007-expanded-false-causation.ts";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";
import type { CaeLocale } from "./types.ts";

const LOCALES: readonly CaeLocale[] = ["en-IN", "hi-IN", "pa-IN"];

assert.ok(CP007_SATURATION_COMMON_FACTOR_FAMILY_IDS.length >= 7, "CP007 Wave 4 needs the expanded common-factor family set.");
assert.ok(CP007_SATURATION_COMMON_FACTOR_WORLDS.length >= 28, "CP007 Wave 4 needs substantial common-factor world depth.");
assert.equal(CP007_WAVE4_PARALLEL_FAMILY_IDS.length, 5, "CP007 Wave 4 needs five new parallel families.");

const seenFamilies = new Set<string>();
const seenVariants = new Set<string>();
for (let seed = 0; seed < 480; seed += 1) {
  const en = generateReviewedCp007SaturationCommonFactorQuestion({ locale: "en-IN", seed });
  seenFamilies.add(en.scenarioFamilyId);
  seenVariants.add(en.scenarioVariantId);
  assert.equal(en.checkpointId, "CAE-CP-007");
  assert.equal(en.qlId, "CAE-QL-007");
  assert.equal(en.answerId, "COMMON_CAUSE");
  assert.equal(en.difficulty, "MEDIUM");
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
    assert.equal(localized.scenarioFamilyId, en.scenarioFamilyId);
    assert.equal(localized.scenarioVariantId, en.scenarioVariantId);
    assert.equal(localized.answerId, en.answerId);
    assert.equal(localized.correctIndex, en.correctIndex);
  }
}
assert.deepEqual(seenFamilies, new Set(CP007_SATURATION_COMMON_FACTOR_FAMILY_IDS), "CP007 common-factor QA must reach every approved family.");
assert.equal(seenVariants.size, CP007_SATURATION_COMMON_FACTOR_WORLDS.length, "CP007 common-factor QA must reach every approved world.");

const seenParallelFamilies = new Set<string>();
const seenParallelVariants = new Set<string>();
for (let seed = 0; seed < 480; seed += 1) {
  const en = generateReviewedCp007Wave4ParallelQuestion({ locale: "en-IN", seed });
  seenParallelFamilies.add(en.scenarioFamilyId);
  seenParallelVariants.add(en.scenarioVariantId);
  assert.equal(en.answerId, "CORRELATION_ONLY");
  assert.equal(en.difficulty, "MEDIUM");
  assert.equal(en.visibleContext.visibleNodeIds.length, 4);
  assert.equal(en.visibleContext.hiddenNodeIds.length, 0);
  assert.ok(en.causalStateId.includes("wave:4"));
  for (const locale of LOCALES) {
    const localized = generateReviewedCp007Wave4ParallelQuestion({ locale, seed });
    assert.equal(localized.scenarioFamilyId, en.scenarioFamilyId);
    assert.equal(localized.scenarioVariantId, en.scenarioVariantId);
    assert.equal(localized.answerId, en.answerId);
    assert.equal(localized.correctIndex, en.correctIndex);
  }
}
assert.deepEqual(seenParallelFamilies, new Set(CP007_WAVE4_PARALLEL_FAMILY_IDS), "CP007 Wave 4 parallel QA must reach every family.");
assert.equal(seenParallelVariants.size, 20, "CP007 Wave 4 parallel QA must reach all twenty worlds.");

let expandedCommon = 0;
let legacyCommon = 0;
let wave4Parallel = 0;
let legacyFalseCausation = 0;
let expandedFalseCausation = 0;
for (let seed = 0; seed < 800; seed += 1) {
  const question = generateReviewedCaeQuestion({ qlId: "CAE-QL-007", locale: "en-IN", seed });
  assert.notEqual(question.difficulty, "EASY");
  if (CP007_SATURATION_COMMON_FACTOR_FAMILY_IDS.includes(question.scenarioFamilyId)) expandedCommon += 1;
  else if (question.scenarioFamilyId === "CAE-FAM-SHARED-PRESSURE") legacyCommon += 1;
  else if (CP007_WAVE4_PARALLEL_FAMILY_IDS.includes(question.scenarioFamilyId)) wave4Parallel += 1;
  else if (question.scenarioFamilyId === "CAE-FAM-FALSE-CAUSATION") legacyFalseCausation += 1;
  else if (question.scenarioFamilyId === CP007_EXPANDED_FALSE_CAUSATION_FAMILY_ID) expandedFalseCausation += 1;
  else assert.fail(`${seed}: unexpected reviewed CP007 family ${question.scenarioFamilyId}`);
}
assert.equal(expandedCommon, 100, "Expanded common-factor allocation must remain one seed in eight.");
assert.equal(legacyCommon, 100, "Legacy common-factor allocation must remain one seed in eight.");
assert.equal(wave4Parallel, 200, "Wave 4 parallel false-causation allocation must remain two seeds in eight.");
assert.equal(legacyFalseCausation, 200, "Legacy false-causation authority must retain two seeds in eight.");
assert.equal(expandedFalseCausation, 200, "Expanded false-causation authority must receive two seeds in eight.");

console.log(`CAE-001 CP007 Wave 4 saturation QA passed: ${CP007_SATURATION_COMMON_FACTOR_FAMILY_IDS.length} common-factor families / ${CP007_SATURATION_COMMON_FACTOR_WORLDS.length} worlds plus 5 parallel families / 20 worlds and balanced legacy/expanded false-causation lanes.`);