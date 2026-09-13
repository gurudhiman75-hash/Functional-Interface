import assert from "node:assert/strict";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";

const LOCALES = ["en-IN", "hi-IN", "pa-IN"] as const;
const SEED_COUNT = 240;
const REMEDIATED_COMBINATION_VARIANTS = new Set([
  "late-deliveries-second-cause",
  "library-visits-neither-cause",
  "bridge-closure-one-effect",
  "server-load-second-effect",
  "power-failure-three-effects",
]);
const BANNED_ENGLISH_FRAGMENTS = [
  "colour of its delivery uniforms",
  "repainted the staff parking area",
  "colour of team jerseys",
  "colour of platform signs",
  "office garden received new plants",
  "morning assembly song",
];

const seenCombinationVariants = new Set<string>();
for (const qlId of ["CAE-QL-003", "CAE-QL-004"] as const) {
  for (let seed = 0; seed < SEED_COUNT; seed += 1) {
    const english = generateReviewedCaeQuestion({ qlId, locale: "en-IN", seed });
    if (!english.projectionId.includes("COMBINATION")) continue;

    if (REMEDIATED_COMBINATION_VARIANTS.has(english.scenarioVariantId)) {
      seenCombinationVariants.add(english.scenarioVariantId);
      assert.ok(
        english.itemVariantId.includes("surface:plausible-competing-events-v2"),
        `${qlId} seed ${seed}: remediated combination scenario did not use reviewed polish`,
      );
    }
    const lowered = `${english.stem}\n${english.explanation}`.toLowerCase();
    for (const fragment of BANNED_ENGLISH_FRAGMENTS) {
      assert.ok(!lowered.includes(fragment), `${qlId} seed ${seed}: weak cosmetic distractor '${fragment}' returned`);
    }

    for (const locale of LOCALES.slice(1)) {
      const localized = generateReviewedCaeQuestion({ qlId, locale, seed });
      assert.equal(localized.causalStateId, english.causalStateId, `${qlId} seed ${seed} ${locale}: causal-state drift`);
      assert.equal(localized.answerId, english.answerId, `${qlId} seed ${seed} ${locale}: answer drift`);
      assert.equal(localized.correctIndex, english.correctIndex, `${qlId} seed ${seed} ${locale}: answer-position drift`);
      assert.equal(localized.scenarioVariantId, english.scenarioVariantId, `${qlId} seed ${seed} ${locale}: scenario drift`);
    }
  }
}
assert.deepEqual(
  [...seenCombinationVariants].sort(),
  [...REMEDIATED_COMBINATION_VARIANTS].sort(),
  "Not every CP003/004 distractor-remediation scenario was reachable in the 240-seed reviewed sweep",
);

const seenCommonCauseVariants = new Set<string>();
for (let seed = 0; seed < SEED_COUNT; seed += 1) {
  const english = generateReviewedCaeQuestion({ qlId: "CAE-QL-009", locale: "en-IN", seed });
  if (!english.causalStructure.endsWith("COMMON_CAUSE_RECONSTRUCTION")) continue;

  seenCommonCauseVariants.add(english.scenarioVariantId);
  assert.equal(english.difficulty, "HARD", `CP009 seed ${seed}: common-cause reconstruction must remain HARD`);
  assert.ok(english.itemVariantId.includes("surface:credible-common-cause-v2"), `CP009 seed ${seed}: common-cause polish missing`);
  assert.equal(new Set(english.options).size, 4, `CP009 seed ${seed}: duplicate option text after polish`);
  const wrongOptions = english.optionMetadata.filter((option) => !option.isCorrect);
  assert.equal(wrongOptions.length, 3, `CP009 seed ${seed}: expected three distractors`);
  assert.ok(wrongOptions.every((option) => option.id.startsWith(`REVIEW_ALT:${english.scenarioVariantId}:`)), `CP009 seed ${seed}: generic cross-world distractor survived reviewed common-cause mode`);

  for (const locale of LOCALES.slice(1)) {
    const localized = generateReviewedCaeQuestion({ qlId: "CAE-QL-009", locale, seed });
    assert.equal(localized.causalStateId, english.causalStateId, `CP009 seed ${seed} ${locale}: causal-state drift`);
    assert.equal(localized.answerId, english.answerId, `CP009 seed ${seed} ${locale}: answer drift`);
    assert.equal(localized.correctIndex, english.correctIndex, `CP009 seed ${seed} ${locale}: answer-position drift`);
    assert.deepEqual(localized.optionMetadata.map((option) => option.id), english.optionMetadata.map((option) => option.id), `CP009 seed ${seed} ${locale}: semantic option-order drift`);
  }
}
assert.deepEqual(
  [...seenCommonCauseVariants].sort(),
  ["admissions", "festival", "heat"],
  "CP009 reviewed common-cause sweep did not reach all shared-pressure variants",
);

console.log("PASS_CAE_REVIEWED_EDITORIAL_POLISH", {
  combinationVariants: [...seenCombinationVariants].sort(),
  commonCauseVariants: [...seenCommonCauseVariants].sort(),
});
