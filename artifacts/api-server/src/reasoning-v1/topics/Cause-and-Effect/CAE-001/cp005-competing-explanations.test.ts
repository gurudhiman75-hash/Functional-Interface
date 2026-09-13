import assert from "node:assert/strict";
import { CP005_COMPETING_SCENARIOS, generateCp005CompetingQuestion } from "./cp005-competing-explanations.ts";
import { previewCae001QuestionStudioReview } from "./question-studio-review.ts";
import { CAE_001_REVIEWED_EDITORIAL_REALNESS_REVIEW } from "./reviewed-editorial-review-pack.ts";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";
import type { CaeLocale } from "./types.ts";

const LOCALES: readonly CaeLocale[] = ["en-IN", "hi-IN", "pa-IN"];

assert.equal(CP005_COMPETING_SCENARIOS.length, 11, "reviewed CP005 must expose eleven independently authored competing-explanation cases");
assert.ok(CP005_COMPETING_SCENARIOS.some((scenario) => scenario.difficulty === "MEDIUM"));
assert.ok(CP005_COMPETING_SCENARIOS.some((scenario) => scenario.difficulty === "HARD"));
for (const scenario of CP005_COMPETING_SCENARIOS) {
  assert.equal(scenario.candidates.length, 4, `${scenario.id}: four proposed explanations required`);
  assert.equal(scenario.candidates.filter((candidate) => candidate.isCorrect).length, 1, `${scenario.id}: exactly one best explanation required`);
  const close = scenario.candidates.filter((candidate) => !candidate.isCorrect && candidate.fit === "CLOSE");
  assert.ok(close.length >= 2, `${scenario.id}: at least two alternatives must survive first-pass plausibility`);
  if (scenario.difficulty === "HARD") {
    assert.ok(close.length >= 3, `${scenario.id}: HARD requires three genuinely close alternatives`);
    const english = scenario.candidates.map((candidate) => candidate.text["en-IN"]).join(" ");
    assert.doesNotMatch(english, /different district|different metro station|one junction|one online application form|small load|one vegetable stall/i, `${scenario.id}: HARD item contains an old giveaway distractor pattern`);
  }
}

const seenStates = new Set<string>();
const seenVariants = new Set<string>();
const seenDifficulties = new Set<string>();
for (let seed = 0; seed < 240; seed += 1) {
  const question = generateCp005CompetingQuestion({ locale: "en-IN", seed });
  seenStates.add(question.causalStateId);
  seenVariants.add(question.scenarioVariantId);
  seenDifficulties.add(question.difficulty);
  assert.equal(question.checkpointId, "CAE-CP-005");
  assert.equal(question.qlId, "CAE-QL-005");
  assert.equal(question.scenarioFamilyId, "CAE-FAM-REVIEWED-COMPETING");
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.optionMetadata.filter((option) => option.isCorrect).length, 1);
  assert.equal(question.options[question.correctIndex], question.optionMetadata[question.correctIndex]!.text);
  assert.ok(question.difficulty === "MEDIUM" || question.difficulty === "HARD");
  assert.ok(question.difficultyEvidence.plausibleDistractors >= 2);
  if (question.difficulty === "HARD") {
    assert.ok(question.difficultyEvidence.plausibleDistractors >= 3, `${question.causalStateId}: HARD must retain at least three close alternatives`);
    assert.ok(question.difficultyEvidence.inferenceBurden >= 5, `${question.causalStateId}: HARD must require evidence-based discrimination`);
  }
  assert.equal(question.metadata.reviewOnly, true);
  assert.equal(question.metadata.questionBankWritable, false);
  assert.equal(question.metadata.publicEligible, false);
}
assert.equal(seenVariants.size, CP005_COMPETING_SCENARIOS.length, "240-seed CP005 QA must reach every calibrated scenario");
assert.equal(seenStates.size, CP005_COMPETING_SCENARIOS.length, "each calibrated CP005 scenario must own a distinct causal state");
assert.deepEqual(seenDifficulties, new Set(["HARD", "MEDIUM"]));

for (let seed = 0; seed < 40; seed += 1) {
  const en = generateCp005CompetingQuestion({ locale: "en-IN", seed });
  for (const locale of LOCALES) {
    const localized = generateCp005CompetingQuestion({ locale, seed });
    assert.equal(localized.causalStateId, en.causalStateId, `${seed}/${locale}: CP005 state drift`);
    assert.equal(localized.answerId, en.answerId, `${seed}/${locale}: CP005 answer drift`);
    assert.equal(localized.correctIndex, en.correctIndex, `${seed}/${locale}: CP005 option-order drift`);
    assert.equal(localized.difficulty, en.difficulty, `${seed}/${locale}: CP005 difficulty drift`);
    assert.deepEqual(localized.optionMetadata.map((option) => option.id), en.optionMetadata.map((option) => option.id), `${seed}/${locale}: CP005 semantic option drift`);
    if (locale !== "en-IN") {
      assert.equal(/[A-Za-z]{4,}/.test(localized.stem), false, `${seed}/${locale}: English stem fragment leaked`);
      assert.equal(/[A-Za-z]{4,}/.test(localized.explanation), false, `${seed}/${locale}: English explanation fragment leaked`);
    }
  }
}

const review = CAE_001_REVIEWED_EDITORIAL_REALNESS_REVIEW["CAE-QL-005"];
assert.equal(review.length, 10);
assert.equal(new Set(review.map((entry) => entry.question.causalStateId)).size, 10);
assert.ok(review.some((entry) => entry.question.difficulty === "MEDIUM"));
assert.ok(review.some((entry) => entry.question.difficulty === "HARD"));
assert.ok(review.every((entry) => entry.question.scenarioFamilyId === "CAE-FAM-REVIEWED-COMPETING"));

const reviewed = generateReviewedCaeQuestion({ qlId: "CAE-QL-005", locale: "en-IN", seed: 7 });
assert.equal(reviewed.scenarioFamilyId, "CAE-FAM-REVIEWED-COMPETING");
assert.throws(
  () => generateReviewedCaeQuestion({ qlId: "CAE-QL-005", locale: "en-IN", seed: 7, questionProfile: "FIVE_WAY" }),
  /question profile 'FIVE_WAY' is not allowed/,
  "CP005 is four-way-only; unsupported five-way requests must fail closed",
);

const studio = previewCae001QuestionStudioReview({ qlId: "CAE-QL-005", locale: "en-IN", seed: 21 });
assert.equal(studio.question.scenarioFamilyId, "CAE-FAM-REVIEWED-COMPETING");
assert.equal(studio.question.metadata.reviewOnly, true);
assert.equal(studio.question.metadata.questionBankWritable, false);