import assert from "node:assert/strict";

import {
  generateSifBankingThreeInferenceQuestion,
  listSifBankingThreeInferenceAuthorities,
  SIF_BANKING_THREE_INFERENCE_PROFILE_ID,
} from "./banking-three-inference.ts";
import type { SifLocale } from "./types.ts";

const locales: readonly SifLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const authorities = listSifBankingThreeInferenceAuthorities();
assert.equal(authorities.length, 5, "expected five curated Banking three-inference authorities");
const mediumAuthorities = listSifBankingThreeInferenceAuthorities("MEDIUM");
const hardAuthorities = listSifBankingThreeInferenceAuthorities("HARD");
const easyAuthorities = listSifBankingThreeInferenceAuthorities("EASY");
assert.equal(
  mediumAuthorities.length + hardAuthorities.length + easyAuthorities.length,
  authorities.length,
  "difficulty-filtered Banking authority pools must partition the overlay inventory",
);

let generated = 0;
for (let seed = 0; seed < 40; seed++) {
  const english = generateSifBankingThreeInferenceQuestion({ locale: "en-IN", seed });

  assert.equal(english.profileId, SIF_BANKING_THREE_INFERENCE_PROFILE_ID);
  assert.equal(english.inferences.length, 3);
  assert.equal(english.options.length, 5);
  assert.equal(new Set(english.options).size, 5, `${english.authorityId}/${seed}: duplicate answer options`);
  assert.ok(english.correctIndex >= 0 && english.correctIndex < 5);
  assert.deepEqual(english.optionSubsets[english.correctIndex], english.correctSubset);
  assert.ok(english.explanation.length >= 60);
  assert.equal(english.reviewOnly, true);
  assert.equal(english.questionBankWritable, false);
  assert.equal(english.testEligible, false);
  assert.equal(english.mockEligible, false);
  assert.equal(english.publiclyPublishable, false);

  const localized = locales.map((locale) =>
    generateSifBankingThreeInferenceQuestion({ locale, seed }),
  );

  for (const question of localized) {
    assert.equal(question.authorityId, english.authorityId);
    assert.equal(question.baseScenarioId, english.baseScenarioId);
    assert.deepEqual(question.correctSubset, english.correctSubset);
    assert.equal(question.correctIndex, english.correctIndex);
    assert.deepEqual(question.optionSubsets, english.optionSubsets);
    assert.equal(question.inferences.length, 3);
    assert.equal(question.options.length, 5);
    if (locale === "hi-IN") {
      assert.doesNotMatch(question.options.join(" | "), /केवल [IVX]+, [IVX]+/u);
    }
    if (locale === "pa-IN") {
      assert.doesNotMatch(question.options.join(" | "), /ਕੇਵਲ [IVX]+, [IVX]+/u);
    }
    assert.ok(question.statement.length >= 20);
    assert.ok(question.inferences.every((value) => value.length >= 8));
    assert.ok(question.distractorTypes.length >= 1);
    generated++;
  }
}

const answerSubsets = new Set(
  Array.from({ length: 40 }, (_, seed) =>
    JSON.stringify(generateSifBankingThreeInferenceQuestion({ locale: "en-IN", seed }).correctSubset),
  ),
);
assert.ok(answerSubsets.size >= 3, `answer-subset diversity too thin: ${answerSubsets.size}`);

const answerPositions = new Set(
  Array.from({ length: 40 }, (_, seed) =>
    generateSifBankingThreeInferenceQuestion({ locale: "en-IN", seed }).correctIndex,
  ),
);
assert.equal(answerPositions.size, 5, "all five answer positions should be reachable");

for (const difficulty of ["MEDIUM", "HARD"] as const) {
  const eligible = listSifBankingThreeInferenceAuthorities(difficulty);
  if (eligible.length === 0) continue;
  for (let seed = 0; seed < eligible.length * 2; seed += 1) {
    const question = generateSifBankingThreeInferenceQuestion({
      locale: "en-IN",
      seed,
      difficulty,
    });
    assert.equal(question.difficulty, difficulty);
  }
}
assert.throws(
  () => generateSifBankingThreeInferenceQuestion({ locale: "en-IN", seed: 0, difficulty: "EASY" }),
  /no easy curated authority/i,
);

console.log(JSON.stringify({
  status: "PASS_SIF_BANKING_THREE_INFERENCE",
  authorityCount: authorities.length,
  seeds: 40,
  locales,
  generated,
  answerSubsetCount: answerSubsets.size,
  answerPositionCount: answerPositions.size,
  lifecycle: "REVIEW_ONLY",
}, null, 2));
