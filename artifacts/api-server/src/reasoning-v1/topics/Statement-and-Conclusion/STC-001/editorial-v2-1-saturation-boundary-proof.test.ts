import assert from "node:assert/strict";
import { generateStcV2EditorialQuestion } from "./editorial-v2-generator.ts";
import { STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE } from "./question-studio-review-v2.ts";
import { STC_QL_IDS } from "./types.ts";

for (const qlId of STC_QL_IDS) {
  const first16 = Array.from({ length: 16 }, (_, seed) => generateStcV2EditorialQuestion({ qlId, locale: "en-IN", seed }));
  const first64 = Array.from({ length: 64 }, (_, seed) => generateStcV2EditorialQuestion({ qlId, locale: "en-IN", seed }));
  const first256 = Array.from({ length: 256 }, (_, seed) => generateStcV2EditorialQuestion({ qlId, locale: "en-IN", seed }));

  const signature = (question: (typeof first16)[number]) => `${question.scenarioId}|${question.conclusions[0]}|${question.conclusions[1]}`;
  assert.equal(new Set(first16.map(signature)).size, 16, `${qlId}: 16-slot scheduler must expose all authority/order presentations once in its first block`);
  assert.equal(new Set(first256.map(signature)).size, 16, `${qlId}: curated V2.1 still has a hard 16-presentation ceiling and must remain saturation-blocked`);

  const first16AnswerCounts = Object.fromEntries(
    ["ONLY_I", "ONLY_II", "BOTH", "NEITHER"].map((answerClass) => [
      answerClass,
      first16.filter((question) => question.answerClass === answerClass).length,
    ]),
  );
  assert.deepEqual(first16AnswerCounts, { ONLY_I: 4, ONLY_II: 4, BOTH: 4, NEITHER: 4 }, `${qlId}: scheduler must remain balanced over one full 16-slot block`);

  const answerSequence = first64.map((question) => question.answerClass);
  assert.notDeepEqual(answerSequence.slice(0, 4), answerSequence.slice(4, 8), `${qlId}: answer sequence must not repeat the old four-seed pattern`);
  assert.notDeepEqual(answerSequence.slice(0, 8), answerSequence.slice(8, 16), `${qlId}: answer sequence must not repeat every eight seeds`);
  for (let residue = 0; residue < 4; residue += 1) {
    const classesForResidue = new Set(answerSequence.filter((_, index) => index % 4 === residue));
    assert.equal(classesForResidue.size, 4, `${qlId}: seed modulo 4 must not reveal answer class at residue ${residue}`);
  }

  for (const question of first64) {
    assert.equal(question.metadata.antiGamingScheduler, "STC_V2_1_NON_PERIODIC_16_SLOT");
    assert.equal(question.metadata.saturationReady, false);
  }
}

assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.currentGenerationReady, false);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.saturationStatus, "BLOCKED_NEEDS_VARIABLEIZED_SURFACE_ENGINE");
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.maximumDistinctCuratedPresentationsPerQlBeforeVariableization, 16);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.minimumDistinctQuestionsPerQlForGenerationReady, 1000);
assert.ok(
  STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.maximumDistinctCuratedPresentationsPerQlBeforeVariableization <
    STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.minimumDistinctQuestionsPerQlForGenerationReady,
  "STC V2.1 must not be represented as generation-ready before variableized saturation is implemented",
);

console.log("PASS_STC_001_V2_1_ANTIGAMING_SATURATION_BOUNDARY");
