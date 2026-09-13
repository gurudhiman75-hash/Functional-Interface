import assert from "node:assert/strict";
import { hasDirectEdge } from "./causal-solver.ts";
import { CAE_COMBINATION_SCENARIOS, CAE_COMBINATION_WORLDS, generateCaeCombinationQuestion } from "./cp003004-combination.ts";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";
import type { CaeLocale } from "./types.ts";

const LOCALES: readonly CaeLocale[] = ["en-IN", "hi-IN", "pa-IN"];

assert.equal(CAE_COMBINATION_SCENARIOS.filter((scenario) => scenario.qlId === "CAE-QL-003").length, 4);
assert.equal(CAE_COMBINATION_SCENARIOS.filter((scenario) => scenario.qlId === "CAE-QL-004").length, 6);
assert.ok(CAE_COMBINATION_SCENARIOS.some((scenario) => scenario.mode === "EFFECT_THREE"));

for (const scenario of CAE_COMBINATION_SCENARIOS) {
  const world = CAE_COMBINATION_WORLDS.find((entry) => entry.scenarioVariantId === scenario.id);
  assert.ok(world, `${scenario.id}: canonical combination world missing`);
  const anchor = `${world.id}:anchor`;
  const solved = scenario.candidates.flatMap((_, index) => {
    const candidate = `${world.id}:candidate-${index + 1}`;
    const valid = scenario.qlId === "CAE-QL-003" ? hasDirectEdge(world, candidate, anchor) : hasDirectEdge(world, anchor, candidate);
    return valid ? [index] : [];
  });
  assert.deepEqual(solved, scenario.validIndices, `${scenario.id}: truth vector must be graph-proven`);
}

for (const qlId of ["CAE-QL-003", "CAE-QL-004"] as const) {
  const seenVariants = new Set<string>();
  const seenAnswers = new Set<string>();
  let sawCombination = false;
  let sawConventional = false;

  for (let seed = 0; seed < 240; seed += 1) {
    const reviewed = generateReviewedCaeQuestion({ qlId, locale: "en-IN", seed });
    if (reviewed.projectionId.includes("COMBINATION")) {
      sawCombination = true;
      seenVariants.add(reviewed.scenarioVariantId);
      seenAnswers.add(reviewed.answerId);
      assert.equal(reviewed.options.length, 4);
      assert.equal(reviewed.optionMetadata.filter((option) => option.isCorrect).length, 1);
      assert.equal(new Set(reviewed.options).size, 4);
      assert.equal(reviewed.metadata.reviewOnly, true);
      assert.equal(reviewed.metadata.questionBankWritable, false);
      assert.equal(reviewed.metadata.publicEligible, false);
    } else {
      sawConventional = true;
    }
  }

  assert.equal(sawCombination, true, `${qlId}: reviewed generation must expose combination form`);
  assert.equal(sawConventional, true, `${qlId}: conventional one-of-four form must remain represented`);
  const authoredCount = CAE_COMBINATION_SCENARIOS.filter((scenario) => scenario.qlId === qlId).length;
  assert.equal(seenVariants.size, authoredCount, `${qlId}: 240 seeds must reach every combination scenario`);
  assert.ok(seenAnswers.size >= 3, `${qlId}: answer patterns must not collapse to one combination`);
}

// The authored set deliberately exercises all four two-item truth outcomes.
const cp003AnswerIds = new Set<string>();
for (let seed = 0; seed < 240; seed += 1) cp003AnswerIds.add(generateCaeCombinationQuestion({ qlId: "CAE-QL-003", locale: "en-IN", seed }).answerId);
assert.deepEqual(cp003AnswerIds, new Set(["BOTH", "I", "II", "NONE"]));

// CP004 must include both two-effect and three-effect combination reasoning.
const cp004Structures = new Set<string>();
for (let seed = 0; seed < 240; seed += 1) cp004Structures.add(generateCaeCombinationQuestion({ qlId: "CAE-QL-004", locale: "en-IN", seed }).causalStructure.split(":")[0]!);
assert.ok(cp004Structures.has("EFFECT_TWO"));
assert.ok(cp004Structures.has("EFFECT_THREE"));

for (const qlId of ["CAE-QL-003", "CAE-QL-004"] as const) {
  for (let seed = 0; seed < 36; seed += 3) {
    const en = generateReviewedCaeQuestion({ qlId, locale: "en-IN", seed });
    assert.ok(en.projectionId.includes("COMBINATION"));
    for (const locale of LOCALES) {
      const localized = generateReviewedCaeQuestion({ qlId, locale, seed });
      assert.equal(localized.causalStateId, en.causalStateId, `${qlId}/${seed}/${locale}: causal-state drift`);
      assert.equal(localized.answerId, en.answerId, `${qlId}/${seed}/${locale}: truth-vector answer drift`);
      assert.equal(localized.correctIndex, en.correctIndex, `${qlId}/${seed}/${locale}: option-order drift`);
      assert.deepEqual(localized.optionMetadata.map((option) => option.id), en.optionMetadata.map((option) => option.id), `${qlId}/${seed}/${locale}: semantic option drift`);
    }
  }
}
