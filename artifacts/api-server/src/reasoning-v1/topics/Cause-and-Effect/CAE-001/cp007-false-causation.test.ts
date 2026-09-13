import assert from "node:assert/strict";
import { causalPath } from "./causal-solver.ts";
import {
  CP007_FALSE_CAUSATION_VARIANTS,
  CP007_FALSE_CAUSATION_WORLDS,
  generateCp007FalseCausationQuestion,
} from "./cp007-false-causation.ts";
import { CAE_001_EDITORIAL_REALNESS_REVIEW } from "./editorial-review-pack.ts";
import { previewCae001QuestionStudioReview } from "./question-studio-review.ts";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";
import type { CaeLocale } from "./types.ts";

const LOCALES: readonly CaeLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const states = new Set<string>();
const variants = new Set<string>();
let hardCount = 0;
let mediumCount = 0;

for (let seed = 0; seed < 240; seed += 1) {
  const question = generateCp007FalseCausationQuestion({ locale: "en-IN", seed });
  states.add(question.causalStateId);
  variants.add(question.scenarioVariantId);
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

assert.equal(variants.size, CP007_FALSE_CAUSATION_VARIANTS.length, "240-seed CP007 QA must reach every authored false-causation scenario");
assert.ok(states.size >= 12, `CP007 needs substantial semantic-direction diversity; saw ${states.size} states`);
assert.ok(hardCount > 0, "CP007 should include post-hoc HARD items");
assert.ok(mediumCount > 0, "CP007 should include co-movement MEDIUM items");

const review = CAE_001_EDITORIAL_REALNESS_REVIEW["CAE-QL-007"];
assert.equal(review.length, 10);
assert.equal(new Set(review.map((entry) => entry.question.causalStateId)).size, 10);
assert.ok(review.every((entry) => entry.question.scenarioFamilyId === "CAE-FAM-FALSE-CAUSATION"));
assert.ok(review.every((entry) => entry.question.answerId === "CORRELATION_ONLY"));

for (let seed = 0; seed < 40; seed += 1) {
  const en = generateCp007FalseCausationQuestion({ locale: "en-IN", seed });
  for (const locale of LOCALES) {
    const localized = generateCp007FalseCausationQuestion({ locale, seed });
    assert.equal(localized.causalStateId, en.causalStateId, `${seed}/${locale}: CP007 causal state drift`);
    assert.equal(localized.answerId, en.answerId, `${seed}/${locale}: CP007 answer drift`);
    assert.equal(localized.correctIndex, en.correctIndex, `${seed}/${locale}: CP007 presentation drift`);
    assert.deepEqual(localized.optionMetadata.map((option) => option.id), en.optionMetadata.map((option) => option.id), `${seed}/${locale}: CP007 semantic option drift`);
  }
}

const reviewed = generateReviewedCaeQuestion({ qlId: "CAE-QL-007", locale: "en-IN", seed: 11 });
assert.equal(reviewed.scenarioFamilyId, "CAE-FAM-FALSE-CAUSATION");
const legacyFiveWay = generateReviewedCaeQuestion({ qlId: "CAE-QL-007", locale: "en-IN", seed: 11, questionProfile: "FIVE_WAY" });
assert.notEqual(legacyFiveWay.scenarioFamilyId, "CAE-FAM-FALSE-CAUSATION", "explicit unsourced five-way CP007 requests remain on frozen V3 until separately approved");

const studio = previewCae001QuestionStudioReview({ qlId: "CAE-QL-007", locale: "en-IN", seed: 17 });
assert.equal(studio.question.scenarioFamilyId, "CAE-FAM-FALSE-CAUSATION");
assert.equal(studio.question.metadata.reviewOnly, true);
assert.equal(studio.question.metadata.questionBankWritable, false);
assert.equal(studio.question.metadata.publicEligible, false);
