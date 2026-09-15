import assert from "node:assert/strict";
import { causalPath } from "./causal-solver.ts";
import { CP007_COMMON_FACTOR_WORLDS, generateCp007CommonFactorQuestion } from "./cp007-common-factor.ts";
import {
  CP007_FALSE_CAUSATION_VARIANTS,
  CP007_FALSE_CAUSATION_WORLDS,
  generateCp007FalseCausationQuestion,
} from "./cp007-false-causation.ts";
import {
  CP007_EXPANDED_FALSE_CAUSATION_FAMILY_ID,
  CP007_EXPANDED_FALSE_CAUSATION_SCENARIOS,
  generateCp007ExpandedFalseCausationQuestion,
} from "./cp007-expanded-false-causation.ts";
import { CAE_001_REVIEWED_EDITORIAL_REALNESS_REVIEW } from "./reviewed-editorial-review-pack.ts";
import { previewCae001QuestionStudioReview } from "./question-studio-review.ts";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";
import type { CaeLocale } from "./types.ts";

const LOCALES: readonly CaeLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const falseStates = new Set<string>();
const falseVariants = new Set<string>();
let hardCount = 0;
let mediumCount = 0;

for (let seed = 0; seed < 240; seed += 1) {
  const question = generateCp007FalseCausationQuestion({ locale: "en-IN", seed });
  falseStates.add(question.causalStateId);
  falseVariants.add(question.scenarioVariantId);
  if (question.difficulty === "HARD") hardCount += 1;
  if (question.difficulty === "MEDIUM") mediumCount += 1;

  assert.equal(question.checkpointId, "CAE-CP-007");
  assert.equal(question.qlId, "CAE-QL-007");
  assert.equal(question.scenarioFamilyId, "CAE-FAM-FALSE-CAUSATION");
  assert.equal(question.answerId, "CORRELATION_ONLY");
  assert.equal(question.options.length, 4);
  assert.equal(question.optionMetadata.filter((option) => option.isCorrect).length, 1);
  assert.equal(new Set(question.options).size, 4);
  assert.notEqual(question.difficulty, "EASY", `${question.causalStateId}: false-causation review item must require real inference`);
  assert.doesNotMatch(question.stem, /another town|different public service|unrelated|independent/i, `${question.causalStateId}: stem contains an obvious independence cue`);

  const world = CP007_FALSE_CAUSATION_WORLDS.find((entry) => entry.id === question.causalWorldId);
  assert.ok(world, `${question.causalWorldId}: CP007 world missing`);
  const [first, second] = question.visibleContext.visibleNodeIds;
  assert.ok(first && second);
  const firstNode = world.nodes.find((node) => node.id === first)!;
  const secondNode = world.nodes.find((node) => node.id === second)!;
  assert.equal(firstNode.role, "EFFECT");
  assert.equal(secondNode.role, "EFFECT");
  assert.equal(causalPath(world, first, second), null, `${question.causalStateId}: visible outcomes must not causally lead to one another`);
  assert.equal(causalPath(world, second, first), null, `${question.causalStateId}: visible outcomes must not causally lead to one another`);

  const hiddenCauses = world.nodes.filter((node) => node.role === "CAUSE");
  assert.equal(hiddenCauses.length, 2);
  assert.ok(hiddenCauses.some((cause) => causalPath(world, cause.id, first)), `${question.causalStateId}: Statement I needs its own supported cause`);
  assert.ok(hiddenCauses.some((cause) => causalPath(world, cause.id, second)), `${question.causalStateId}: Statement II needs its own supported cause`);
  assert.ok(question.explanation.includes("→"), `${question.causalStateId}: explanation must expose the two real chains`);
}

assert.equal(falseVariants.size, CP007_FALSE_CAUSATION_VARIANTS.length, "240-seed CP007 QA must reach every authored legacy false-causation scenario");
assert.ok(falseStates.size >= 12, `CP007 needs substantial semantic-direction diversity; saw ${falseStates.size} states`);
assert.ok(hardCount > 0, "CP007 should include post-hoc HARD items");
assert.ok(mediumCount > 0, "CP007 should include co-movement MEDIUM items");

assert.equal(CP007_EXPANDED_FALSE_CAUSATION_SCENARIOS.length, 10, "expanded CP007 false-causation authority must expose ten authored scenarios");
assert.equal(new Set(CP007_EXPANDED_FALSE_CAUSATION_SCENARIOS.map((scenario) => scenario.id)).size, 10);
assert.deepEqual(new Set(CP007_EXPANDED_FALSE_CAUSATION_SCENARIOS.map((scenario) => scenario.pattern)), new Set(["CO_MOVEMENT", "POST_HOC"]));
const expandedVariants = new Set<string>();
const expandedStates = new Set<string>();
const expandedDifficulties = new Set<string>();
for (let seed = 0; seed < 400; seed += 1) {
  const en = generateCp007ExpandedFalseCausationQuestion({ locale: "en-IN", seed });
  expandedVariants.add(en.scenarioVariantId);
  expandedStates.add(en.causalStateId);
  expandedDifficulties.add(en.difficulty);
  assert.equal(en.scenarioFamilyId, CP007_EXPANDED_FALSE_CAUSATION_FAMILY_ID);
  assert.equal(en.answerId, "CORRELATION_ONLY");
  assert.equal(en.options.length, 4);
  assert.equal(new Set(en.options).size, 4);
  assert.equal(en.optionMetadata.filter((option) => option.isCorrect).length, 1);
  assert.equal(en.optionMetadata[en.correctIndex]!.id, "CORRELATION_ONLY");
  assert.equal(en.visibleContext.visibleNodeIds.length, 4, `${en.causalStateId}: both effects and both independent causes must be learner-visible`);
  assert.equal(en.visibleContext.hiddenNodeIds.length, 0);
  assert.ok(en.explanation.includes("→"));
  assert.notEqual(en.difficulty, "EASY");
  assert.equal(en.metadata.reviewOnly, true);
  assert.equal(en.metadata.questionBankWritable, false);
  assert.equal(en.metadata.publicEligible, false);

  if (seed < 60) {
    for (const locale of LOCALES) {
      const localized = generateCp007ExpandedFalseCausationQuestion({ locale, seed });
      assert.equal(localized.causalStateId, en.causalStateId, `${seed}/${locale}: expanded CP007 state drift`);
      assert.equal(localized.answerId, en.answerId, `${seed}/${locale}: expanded CP007 answer drift`);
      assert.equal(localized.correctIndex, en.correctIndex, `${seed}/${locale}: expanded CP007 presentation drift`);
      assert.deepEqual(localized.optionMetadata.map((option) => option.id), en.optionMetadata.map((option) => option.id), `${seed}/${locale}: expanded CP007 option semantic drift`);
      if (locale !== "en-IN") {
        assert.equal(/[A-Za-z]{4,}/.test(localized.stem), false, `${seed}/${locale}: English expanded CP007 stem leakage`);
        assert.equal(/[A-Za-z]{4,}/.test(localized.explanation), false, `${seed}/${locale}: English expanded CP007 explanation leakage`);
      }
    }
  }
}
assert.equal(expandedVariants.size, 10, "expanded CP007 sweep must reach all ten scenarios");
assert.ok(expandedStates.size >= 18, `expanded CP007 must expose both statement directions; saw ${expandedStates.size}`);
assert.deepEqual(expandedDifficulties, new Set(["MEDIUM", "HARD"]));

for (let seed = 0; seed < 60; seed += 1) {
  const question = generateCp007CommonFactorQuestion({ locale: "en-IN", seed });
  assert.equal(question.answerId, "COMMON_CAUSE");
  assert.equal(question.options.length, 4);
  assert.equal(question.optionMetadata.filter((option) => option.isCorrect).length, 1);
  const world = CP007_COMMON_FACTOR_WORLDS.find((entry) => entry.id === question.causalWorldId);
  assert.ok(world);
  const cause = world.nodes.find((node) => node.role === "CAUSE")!;
  const [first, second] = question.visibleContext.visibleNodeIds;
  assert.ok(first && second);
  assert.ok(causalPath(world, cause.id, first));
  assert.ok(causalPath(world, cause.id, second));
  assert.equal(causalPath(world, first, second), null);
  assert.equal(causalPath(world, second, first), null);
}

const reviewedStates = new Set<string>();
const reviewedAnswers = new Set<string>();
const reviewedFamilies = new Set<string>();
const counts = { legacyFalse: 0, expandedFalse: 0, parallel: 0, commonExpanded: 0, commonLegacy: 0 };
for (let seed = 0; seed < 240; seed += 1) {
  const question = generateReviewedCaeQuestion({ qlId: "CAE-QL-007", locale: "en-IN", seed });
  reviewedStates.add(question.causalStateId);
  reviewedAnswers.add(question.answerId);
  reviewedFamilies.add(question.scenarioFamilyId);
  assert.ok(question.answerId === "CORRELATION_ONLY" || question.answerId === "COMMON_CAUSE");

  if (seed % 8 === 0 || seed % 16 === 12) counts.commonExpanded += 1;
  else if (seed % 16 === 4) counts.commonLegacy += 1;
  else if (seed % 8 === 2 || seed % 8 === 6) counts.parallel += 1;
  else if (seed % 8 === 3 || seed % 8 === 7) {
    counts.expandedFalse += 1;
    assert.equal(question.scenarioFamilyId, CP007_EXPANDED_FALSE_CAUSATION_FAMILY_ID, `${seed}: expanded false-causation slot drifted`);
  } else {
    counts.legacyFalse += 1;
    assert.equal(question.scenarioFamilyId, "CAE-FAM-FALSE-CAUSATION", `${seed}: legacy false-causation slot drifted`);
  }
}
assert.deepEqual(counts, { legacyFalse: 60, expandedFalse: 60, parallel: 60, commonExpanded: 45, commonLegacy: 15 });
assert.ok(reviewedStates.size >= 30, `reviewed CP007 needs broad semantic coverage; saw ${reviewedStates.size}`);
assert.deepEqual(reviewedAnswers, new Set(["COMMON_CAUSE", "CORRELATION_ONLY"]));
assert.ok(reviewedFamilies.has("CAE-FAM-FALSE-CAUSATION"));
assert.ok(reviewedFamilies.has(CP007_EXPANDED_FALSE_CAUSATION_FAMILY_ID));
assert.ok(reviewedFamilies.has("CAE-FAM-SHARED-PRESSURE"));

const review = CAE_001_REVIEWED_EDITORIAL_REALNESS_REVIEW["CAE-QL-007"];
assert.equal(review.length, 10);
assert.equal(new Set(review.map((entry) => entry.question.causalStateId)).size, 10);
assert.ok(review.some((entry) => entry.question.answerId === "CORRELATION_ONLY"));
assert.ok(review.some((entry) => entry.question.answerId === "COMMON_CAUSE"));
assert.ok(review.some((entry) => entry.question.scenarioFamilyId === CP007_EXPANDED_FALSE_CAUSATION_FAMILY_ID), "CP007 review pack must expose expanded false-causation authority");
assert.ok(review.every((entry) => entry.question.difficulty !== "EASY"));

for (let seed = 0; seed < 40; seed += 1) {
  const en = generateReviewedCaeQuestion({ qlId: "CAE-QL-007", locale: "en-IN", seed });
  for (const locale of LOCALES) {
    const localized = generateReviewedCaeQuestion({ qlId: "CAE-QL-007", locale, seed });
    assert.equal(localized.causalStateId, en.causalStateId, `${seed}/${locale}: CP007 causal state drift`);
    assert.equal(localized.answerId, en.answerId, `${seed}/${locale}: CP007 answer drift`);
    assert.equal(localized.correctIndex, en.correctIndex, `${seed}/${locale}: CP007 presentation drift`);
    assert.deepEqual(localized.optionMetadata.map((option) => option.id), en.optionMetadata.map((option) => option.id), `${seed}/${locale}: CP007 semantic option drift`);
  }
}

const legacyReviewed = generateReviewedCaeQuestion({ qlId: "CAE-QL-007", locale: "en-IN", seed: 9 });
assert.equal(legacyReviewed.scenarioFamilyId, "CAE-FAM-FALSE-CAUSATION");
const expandedReviewed = generateReviewedCaeQuestion({ qlId: "CAE-QL-007", locale: "en-IN", seed: 11 });
assert.equal(expandedReviewed.scenarioFamilyId, CP007_EXPANDED_FALSE_CAUSATION_FAMILY_ID);
const commonReviewed = generateReviewedCaeQuestion({ qlId: "CAE-QL-007", locale: "en-IN", seed: 12 });
assert.equal(commonReviewed.answerId, "COMMON_CAUSE");
const legacyCommonReviewed = generateReviewedCaeQuestion({ qlId: "CAE-QL-007", locale: "en-IN", seed: 20 });
assert.equal(legacyCommonReviewed.scenarioFamilyId, "CAE-FAM-SHARED-PRESSURE");
const legacyFiveWay = generateReviewedCaeQuestion({ qlId: "CAE-QL-007", locale: "en-IN", seed: 11, questionProfile: "FIVE_WAY" });
assert.notEqual(legacyFiveWay.scenarioFamilyId, "CAE-FAM-FALSE-CAUSATION", "explicit unsourced five-way CP007 requests remain on frozen V3 until separately approved");
assert.notEqual(legacyFiveWay.scenarioFamilyId, CP007_EXPANDED_FALSE_CAUSATION_FAMILY_ID);

const studio = previewCae001QuestionStudioReview({ qlId: "CAE-QL-007", locale: "en-IN", seed: 19 });
assert.equal(studio.question.scenarioFamilyId, CP007_EXPANDED_FALSE_CAUSATION_FAMILY_ID, "Question Studio must expose expanded CP007 false-causation items");
const studioCommon = previewCae001QuestionStudioReview({ qlId: "CAE-QL-007", locale: "en-IN", seed: 16 });
assert.equal(studioCommon.question.answerId, "COMMON_CAUSE");
assert.equal(studio.question.metadata.reviewOnly, true);
assert.equal(studio.question.metadata.questionBankWritable, false);
assert.equal(studio.question.metadata.publicEligible, false);

console.log("PASS_CAE_CP007_FALSE_CAUSATION_EXPANSION", {
  legacyVariants: CP007_FALSE_CAUSATION_VARIANTS.length,
  expandedVariants: expandedVariants.size,
  expandedStates: expandedStates.size,
  reviewedAllocation: counts,
});
