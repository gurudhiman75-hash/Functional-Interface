import assert from "node:assert/strict";
import { CP005_COMPETING_SCENARIOS, generateCp005CompetingQuestion } from "./cp005-competing-explanations.ts";
import { CP005_EVIDENCE_FIT_FAMILY_IDS, CP005_EVIDENCE_FIT_SCENARIOS, generateCp005EvidenceFitQuestion } from "./cp005-evidence-fit.ts";
import { previewCae001QuestionStudioReview } from "./question-studio-review.ts";
import { CAE_001_REVIEWED_EDITORIAL_REALNESS_REVIEW } from "./reviewed-editorial-review-pack.ts";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";
import { CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS } from "./saturation-candidate-authorities.ts";
import type { CaeLocale } from "./types.ts";

const LOCALES: readonly CaeLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const EVIDENCE_FAMILY_IDS = new Set<string>(CP005_EVIDENCE_FIT_FAMILY_IDS);

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

assert.equal(CP005_EVIDENCE_FIT_SCENARIOS.length, 12, "CP005 evidence-fit lane must expose twelve independently authored scenarios");
assert.equal(new Set(CP005_EVIDENCE_FIT_SCENARIOS.map((scenario) => scenario.familyId)).size, 3, "CP005 evidence-fit lane must expose three semantic families");
assert.deepEqual(
  new Set(CP005_EVIDENCE_FIT_SCENARIOS.map((scenario) => scenario.mode)),
  new Set(["TIMING_FIT", "SCOPE_FIT", "MECHANISM_FIT"]),
  "CP005 evidence-fit lane must expose timing, scope and mechanism discrimination",
);
for (const scenario of CP005_EVIDENCE_FIT_SCENARIOS) {
  assert.equal(scenario.candidates.length, 4, `${scenario.id}: evidence-fit item requires four causes`);
  assert.equal(scenario.candidates.filter((candidate) => candidate.isCorrect).length, 1, `${scenario.id}: evidence-fit item requires one best cause`);
  assert.ok(EVIDENCE_FAMILY_IDS.has(scenario.familyId), `${scenario.id}: unaudited evidence-fit family`);
}

const evidenceVariants = new Set<string>();
const evidenceFamilies = new Set<string>();
const evidenceModes = new Set<string>();
for (let seed = 0; seed < 480; seed += 1) {
  const en = generateCp005EvidenceFitQuestion({ locale: "en-IN", seed });
  evidenceVariants.add(en.scenarioVariantId);
  evidenceFamilies.add(en.scenarioFamilyId);
  evidenceModes.add(en.causalStructure.split(":")[1]!);
  assert.equal(en.checkpointId, "CAE-CP-005");
  assert.equal(en.qlId, "CAE-QL-005");
  assert.equal(en.projectionId, "CAE-PLAN-COMPETING");
  assert.ok(EVIDENCE_FAMILY_IDS.has(en.scenarioFamilyId));
  assert.equal(en.options.length, 4);
  assert.equal(new Set(en.options).size, 4);
  assert.equal(en.optionMetadata.filter((option) => option.isCorrect).length, 1);
  assert.equal(en.optionMetadata[en.correctIndex]!.id, en.answerId);
  assert.ok(en.causalStateId.includes(`operation:${en.causalStructure.split(":")[1]}`));
  assert.equal(en.metadata.reviewOnly, true);
  assert.equal(en.metadata.questionBankWritable, false);
  assert.equal(en.metadata.publicEligible, false);

  if (seed < 72) {
    for (const locale of LOCALES) {
      const localized = generateCp005EvidenceFitQuestion({ locale, seed });
      assert.equal(localized.causalStateId, en.causalStateId, `${seed}/${locale}: evidence-fit state drift`);
      assert.equal(localized.answerId, en.answerId, `${seed}/${locale}: evidence-fit answer drift`);
      assert.equal(localized.correctIndex, en.correctIndex, `${seed}/${locale}: evidence-fit option-order drift`);
      assert.equal(localized.difficulty, en.difficulty, `${seed}/${locale}: evidence-fit difficulty drift`);
      assert.deepEqual(localized.optionMetadata.map((option) => option.id), en.optionMetadata.map((option) => option.id), `${seed}/${locale}: evidence-fit semantic option drift`);
      if (locale !== "en-IN") {
        assert.equal(/[A-Za-z]{4,}/.test(localized.stem), false, `${seed}/${locale}: English evidence-fit stem fragment leaked`);
        assert.equal(/[A-Za-z]{4,}/.test(localized.explanation), false, `${seed}/${locale}: English evidence-fit explanation fragment leaked`);
      }
    }
  }
}
assert.equal(evidenceVariants.size, 12, "CP005 evidence-fit sweep must reach all twelve scenarios");
assert.equal(evidenceFamilies.size, 3, "CP005 evidence-fit sweep must reach all three families");
assert.deepEqual(evidenceModes, new Set(["TIMING_FIT", "SCOPE_FIT", "MECHANISM_FIT"]));

const allocation = Array.from({ length: 100 }, (_, seed) => generateReviewedCaeQuestion({ qlId: "CAE-QL-005", locale: "en-IN", seed }));
const legacyAllocation = allocation.filter((question) => question.scenarioFamilyId === "CAE-FAM-REVIEWED-COMPETING").length;
const evidenceAllocation = allocation.filter((question) => EVIDENCE_FAMILY_IDS.has(question.scenarioFamilyId)).length;
const saturationAllocation = allocation.filter((question) => CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS.includes(question.scenarioFamilyId)).length;
assert.equal(legacyAllocation, 40, "CP005 reviewed allocation must reserve 40% for legacy calibrated competing explanations");
assert.equal(evidenceAllocation, 40, "CP005 reviewed allocation must reserve 40% for evidence-fit semantic families");
assert.equal(saturationAllocation, 20, "CP005 reviewed allocation must preserve the audited 20% candidate-heavy saturation lane");

const review = CAE_001_REVIEWED_EDITORIAL_REALNESS_REVIEW["CAE-QL-005"];
assert.equal(review.length, 10);
assert.equal(new Set(review.map((entry) => entry.question.causalStateId)).size, 10);
assert.ok(review.some((entry) => entry.question.difficulty === "MEDIUM"));
assert.ok(review.some((entry) => entry.question.difficulty === "HARD"));
const specialisedReview = review.filter((entry) => entry.question.scenarioFamilyId === "CAE-FAM-REVIEWED-COMPETING");
const evidenceReview = review.filter((entry) => EVIDENCE_FAMILY_IDS.has(entry.question.scenarioFamilyId));
const saturationReview = review.filter((entry) => CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS.includes(entry.question.scenarioFamilyId));
assert.ok(specialisedReview.length >= 2, "CP005 review pack must retain legacy calibrated competing-explanation items.");
assert.ok(evidenceReview.length >= 2, "CP005 review pack must expose the new evidence-fit semantic lane.");
assert.ok(saturationReview.length >= 1, "CP005 review pack must expose at least one audited saturation family.");
assert.equal(specialisedReview.length + evidenceReview.length + saturationReview.length, review.length, "CP005 review pack contains an unaudited family.");

const reviewedLegacy = generateReviewedCaeQuestion({ qlId: "CAE-QL-005", locale: "en-IN", seed: 7 });
assert.equal(reviewedLegacy.scenarioFamilyId, "CAE-FAM-REVIEWED-COMPETING");
const reviewedEvidence = generateReviewedCaeQuestion({ qlId: "CAE-QL-005", locale: "en-IN", seed: 1 });
assert.ok(EVIDENCE_FAMILY_IDS.has(reviewedEvidence.scenarioFamilyId));
assert.match(reviewedEvidence.causalStructure, /^COMPETING_EXPLANATIONS:(TIMING_FIT|SCOPE_FIT|MECHANISM_FIT)$/);
assert.throws(
  () => generateReviewedCaeQuestion({ qlId: "CAE-QL-005", locale: "en-IN", seed: 7, questionProfile: "FIVE_WAY" }),
  /question profile 'FIVE_WAY' is not allowed/,
  "CP005 is four-way-only; unsupported five-way requests must fail closed",
);

const studio = previewCae001QuestionStudioReview({ qlId: "CAE-QL-005", locale: "en-IN", seed: 21 });
assert.ok(EVIDENCE_FAMILY_IDS.has(studio.question.scenarioFamilyId), "Question Studio must surface the CP005 evidence-fit lane");
assert.equal(studio.question.metadata.reviewOnly, true);
assert.equal(studio.question.metadata.questionBankWritable, false);

console.log("PASS_CAE_CP005_EVIDENCE_FIT_EXPANSION", {
  legacyScenarios: CP005_COMPETING_SCENARIOS.length,
  evidenceFitScenarios: evidenceVariants.size,
  evidenceFitFamilies: [...evidenceFamilies].sort(),
  evidenceFitModes: [...evidenceModes].sort(),
  reviewedAllocation: { legacy: legacyAllocation, evidenceFit: evidenceAllocation, candidateHeavy: saturationAllocation },
});
