import assert from "node:assert/strict";
import { hasDirectEdge } from "./causal-solver.ts";
import { CAE_COMBINATION_SCENARIOS, CAE_COMBINATION_WORLDS, generateCaeCombinationQuestion } from "./cp003004-combination.ts";
import { CAE_EXPANDED_COMBINATION_FAMILY_IDS, CAE_EXPANDED_COMBINATION_SCENARIOS, generateExpandedCaeCombinationQuestion } from "./cp003004-expanded-combination.ts";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";
import type { CaeLocale } from "./types.ts";

const LOCALES: readonly CaeLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const EXPANDED_FAMILIES = new Set<string>(CAE_EXPANDED_COMBINATION_FAMILY_IDS);

assert.equal(CAE_COMBINATION_SCENARIOS.filter((scenario) => scenario.qlId === "CAE-QL-003").length, 4);
assert.equal(CAE_COMBINATION_SCENARIOS.filter((scenario) => scenario.qlId === "CAE-QL-004").length, 6);
assert.ok(CAE_COMBINATION_SCENARIOS.some((scenario) => scenario.mode === "EFFECT_THREE"));
assert.equal(CAE_EXPANDED_COMBINATION_SCENARIOS.filter((scenario) => scenario.qlId === "CAE-QL-003").length, 6);
assert.equal(CAE_EXPANDED_COMBINATION_SCENARIOS.filter((scenario) => scenario.qlId === "CAE-QL-004").length, 6);
assert.equal(new Set(CAE_EXPANDED_COMBINATION_SCENARIOS.map((scenario) => scenario.id)).size, 12);

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

for (const scenario of CAE_EXPANDED_COMBINATION_SCENARIOS) {
  assert.equal(scenario.candidates.length, 3, `${scenario.id}: expanded combination must expose three statements`);
  assert.ok(scenario.validIndices.length >= 1 && scenario.validIndices.length <= 3, `${scenario.id}: expanded truth vector must be non-empty`);
  assert.equal(new Set(scenario.validIndices).size, scenario.validIndices.length, `${scenario.id}: duplicate truth index`);
  assert.ok(scenario.validIndices.every((index) => index >= 0 && index < 3), `${scenario.id}: invalid truth index`);
}

for (const qlId of ["CAE-QL-003", "CAE-QL-004"] as const) {
  const legacySeen = new Set<string>();
  const expandedSeen = new Set<string>();
  const seenAnswers = new Set<string>();
  let sawConventional = false;
  let legacyCount = 0;
  let expandedCount = 0;

  for (let seed = 0; seed < 240; seed += 1) {
    const reviewed = generateReviewedCaeQuestion({ qlId, locale: "en-IN", seed });
    if (reviewed.projectionId.includes("COMBINATION")) {
      seenAnswers.add(reviewed.answerId);
      assert.equal(reviewed.options.length, 4);
      assert.equal(reviewed.optionMetadata.filter((option) => option.isCorrect).length, 1);
      assert.equal(reviewed.optionMetadata[reviewed.correctIndex]!.id, reviewed.answerId);
      assert.equal(new Set(reviewed.options).size, 4);
      assert.equal(reviewed.metadata.reviewOnly, true);
      assert.equal(reviewed.metadata.questionBankWritable, false);
      assert.equal(reviewed.metadata.publicEligible, false);

      if (EXPANDED_FAMILIES.has(reviewed.scenarioFamilyId)) {
        expandedCount += 1;
        expandedSeen.add(reviewed.scenarioVariantId);
        assert.equal(reviewed.difficulty, "HARD");
        assert.match(reviewed.causalStructure, /^(CAUSE_THREE|EFFECT_THREE_EXPANDED):/);
      } else {
        legacyCount += 1;
        legacySeen.add(reviewed.scenarioVariantId);
      }
    } else {
      sawConventional = true;
    }
  }

  assert.equal(sawConventional, true, `${qlId}: conventional/saturation one-of-four form must remain represented`);
  assert.equal(legacyCount, 32, `${qlId}: legacy combination lane must be exactly half of reviewed combination allocation over 240 seeds`);
  assert.equal(expandedCount, 32, `${qlId}: expanded combination lane must be exactly half of reviewed combination allocation over 240 seeds`);
  assert.equal(legacySeen.size, CAE_COMBINATION_SCENARIOS.filter((scenario) => scenario.qlId === qlId).length, `${qlId}: reviewed seeds must retain every legacy combination scenario`);
  assert.equal(expandedSeen.size, 6, `${qlId}: reviewed seeds must reach all six expanded combination scenarios`);
  assert.ok(seenAnswers.size >= 4, `${qlId}: answer patterns must not collapse after combination split`);
}

// The frozen legacy authored set deliberately exercises all four two-item truth outcomes.
const cp003AnswerIds = new Set<string>();
for (let seed = 0; seed < 240; seed += 1) cp003AnswerIds.add(generateCaeCombinationQuestion({ qlId: "CAE-QL-003", locale: "en-IN", seed }).answerId);
assert.deepEqual(cp003AnswerIds, new Set(["BOTH", "I", "II", "NONE"]));

// Legacy CP004 must continue to include both two-effect and three-effect reasoning.
const cp004Structures = new Set<string>();
for (let seed = 0; seed < 240; seed += 1) cp004Structures.add(generateCaeCombinationQuestion({ qlId: "CAE-QL-004", locale: "en-IN", seed }).causalStructure.split(":")[0]!);
assert.ok(cp004Structures.has("EFFECT_TWO"));
assert.ok(cp004Structures.has("EFFECT_THREE"));

// Expanded authority must independently reach all authored cases and preserve locale semantics.
for (const qlId of ["CAE-QL-003", "CAE-QL-004"] as const) {
  const variants = new Set<string>();
  const answers = new Set<string>();
  for (let seed = 0; seed < 360; seed += 1) {
    const en = generateExpandedCaeCombinationQuestion({ qlId, locale: "en-IN", seed });
    variants.add(en.scenarioVariantId);
    answers.add(en.answerId);
    assert.ok(EXPANDED_FAMILIES.has(en.scenarioFamilyId));
    assert.equal(en.options.length, 4);
    assert.equal(new Set(en.options).size, 4);
    assert.equal(en.optionMetadata[en.correctIndex]!.id, en.answerId);
    assert.ok(en.itemVariantId.includes(en.causalStateId));
    assert.equal(en.difficulty, "HARD");
    assert.equal(en.metadata.reviewOnly, true);
    assert.equal(en.metadata.questionBankWritable, false);
    assert.equal(en.metadata.publicEligible, false);

    if (seed < 60) {
      for (const locale of LOCALES) {
        const localized = generateExpandedCaeCombinationQuestion({ qlId, locale, seed });
        assert.equal(localized.causalStateId, en.causalStateId, `${qlId}/${seed}/${locale}: expanded causal-state drift`);
        assert.equal(localized.answerId, en.answerId, `${qlId}/${seed}/${locale}: expanded answer drift`);
        assert.equal(localized.correctIndex, en.correctIndex, `${qlId}/${seed}/${locale}: expanded option-order drift`);
        assert.deepEqual(localized.optionMetadata.map((option) => option.id), en.optionMetadata.map((option) => option.id), `${qlId}/${seed}/${locale}: expanded semantic option drift`);
        if (locale !== "en-IN") {
          assert.equal(/[A-Za-z]{4,}/.test(localized.stem), false, `${qlId}/${seed}/${locale}: English expanded-combination stem leakage`);
          assert.equal(/[A-Za-z]{4,}/.test(localized.explanation), false, `${qlId}/${seed}/${locale}: English expanded-combination explanation leakage`);
        }
      }
    }
  }
  assert.equal(variants.size, 6, `${qlId}: direct expanded sweep must reach all six scenarios`);
  assert.ok(answers.size >= 2, `${qlId}: expanded truth-vector patterns collapsed`);
}

// Reviewed locale parity applies to both legacy and expanded combination slots.
for (const qlId of ["CAE-QL-003", "CAE-QL-004"] as const) {
  for (let seed = 0; seed < 60; seed += 3) {
    if ((seed >>> 0) % 5 === 4) continue;
    const en = generateReviewedCaeQuestion({ qlId, locale: "en-IN", seed });
    assert.ok(en.projectionId.includes("COMBINATION"), `${qlId}/${seed}: combination allocation drifted.`);
    const expanded = EXPANDED_FAMILIES.has(en.scenarioFamilyId);
    assert.equal(expanded, seed % 6 === 0, `${qlId}/${seed}: legacy/expanded combination split drifted`);
    for (const locale of LOCALES) {
      const localized = generateReviewedCaeQuestion({ qlId, locale, seed });
      assert.equal(localized.causalStateId, en.causalStateId, `${qlId}/${seed}/${locale}: causal-state drift`);
      assert.equal(localized.answerId, en.answerId, `${qlId}/${seed}/${locale}: truth-vector answer drift`);
      assert.equal(localized.correctIndex, en.correctIndex, `${qlId}/${seed}/${locale}: option-order drift`);
      assert.deepEqual(localized.optionMetadata.map((option) => option.id), en.optionMetadata.map((option) => option.id), `${qlId}/${seed}/${locale}: semantic option drift`);
    }
  }
}

console.log("PASS_CAE_COMBINATION_EXPANSION", {
  legacy: {
    ql003: CAE_COMBINATION_SCENARIOS.filter((scenario) => scenario.qlId === "CAE-QL-003").length,
    ql004: CAE_COMBINATION_SCENARIOS.filter((scenario) => scenario.qlId === "CAE-QL-004").length,
  },
  expanded: {
    ql003: CAE_EXPANDED_COMBINATION_SCENARIOS.filter((scenario) => scenario.qlId === "CAE-QL-003").length,
    ql004: CAE_EXPANDED_COMBINATION_SCENARIOS.filter((scenario) => scenario.qlId === "CAE-QL-004").length,
  },
});
