import assert from "node:assert/strict";
import { CP007_FALSE_CAUSATION_WORLDS } from "./cp007-false-causation.ts";
import { CAE_001_SATURATION_WAVE4_PARALLEL_FAMILIES } from "./causal-world-saturation-wave4-parallel.ts";
import { materializeCae001World } from "./causal-world-authorities.ts";
import { CP007_WAVE4_PARALLEL_FAMILY_IDS } from "./cp007-wave4-parallel-adapter.ts";
import { CP007_EXPANDED_FALSE_CAUSATION_FAMILY_ID, CP007_EXPANDED_FALSE_CAUSATION_SCENARIOS } from "./cp007-expanded-false-causation.ts";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";
import type { CaeLocale } from "./types.ts";

const LOCALES: readonly CaeLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const WAVE4_WORLDS = CAE_001_SATURATION_WAVE4_PARALLEL_FAMILIES.flatMap((family) => family.variants.map((variant) => materializeCae001World(family, variant)));
const WAVE4_FAMILY_IDS = new Set(CP007_WAVE4_PARALLEL_FAMILY_IDS);

for (let seed = 0; seed < 96; seed += 1) {
  if ((seed >>> 0) % 4 === 0) continue; // common-factor slots remain covered separately

  const en = generateReviewedCaeQuestion({ qlId: "CAE-QL-007", locale: "en-IN", seed });
  assert.equal(en.answerId, "CORRELATION_ONLY");
  assert.notEqual(en.difficulty, "EASY", `${seed}: reviewed CP007 false-causation item became EASY.`);

  const wave4 = WAVE4_FAMILY_IDS.has(en.scenarioFamilyId);
  const expanded = en.scenarioFamilyId === CP007_EXPANDED_FALSE_CAUSATION_FAMILY_ID;
  if (seed % 8 === 2 || seed % 8 === 6) {
    assert.equal(wave4, true, `${seed}: Wave 4 CP007 residue must use an approved parallel family.`);
    assert.equal(expanded, false);
    assert.equal(en.difficulty, "MEDIUM", `${seed}: Wave 4 CP007 parallel adapter must remain MEDIUM.`);
    assert.ok(en.causalStateId.includes("wave:4"), `${seed}: Wave 4 CP007 state identity missing.`);
  } else if (seed % 8 === 3 || seed % 8 === 7) {
    assert.equal(expanded, true, `${seed}: expanded CP007 residue must use the audited evidence authority.`);
    assert.equal(wave4, false);
    assert.ok(["MEDIUM", "HARD"].includes(en.difficulty), `${seed}: expanded CP007 difficulty calibration drifted.`);
  } else {
    assert.equal(en.scenarioFamilyId, "CAE-FAM-FALSE-CAUSATION", `${seed}: retained legacy CP007 residue must remain on the legacy false-causation family.`);
    assert.equal(wave4, false);
    assert.equal(expanded, false);
    assert.ok(["MEDIUM", "HARD"].includes(en.difficulty), `${seed}: legacy CP007 difficulty calibration drifted.`);
  }

  assert.equal(en.visibleContext.hiddenNodeIds.length, 0, `${en.causalStateId}: reviewed false-causation evidence must not remain hidden`);
  assert.equal(new Set(en.visibleContext.visibleNodeIds).size, 4, `${en.causalStateId}: both effects and both independent causes must be learner-visible`);

  if (expanded) {
    const scenario = CP007_EXPANDED_FALSE_CAUSATION_SCENARIOS.find((entry) => entry.id === en.scenarioVariantId);
    assert.ok(scenario, `${en.scenarioVariantId}: expanded CP007 scenario missing`);
    const expectedIds = new Set([
      `${scenario.id}:first-cause`,
      `${scenario.id}:first-effect`,
      `${scenario.id}:second-cause`,
      `${scenario.id}:second-effect`,
    ]);
    assert.deepEqual(new Set(en.visibleContext.visibleNodeIds), expectedIds, `${en.causalStateId}: expanded visible-evidence identity drift`);
    assert.ok(en.stem.includes(scenario.firstCause["en-IN"]), `${en.causalStateId}: first independent cause missing from stem`);
    assert.ok(en.stem.includes(scenario.secondCause["en-IN"]), `${en.causalStateId}: second independent cause missing from stem`);

    for (const locale of LOCALES) {
      const localized = generateReviewedCaeQuestion({ qlId: "CAE-QL-007", locale, seed });
      assert.equal(localized.causalStateId, en.causalStateId, `${seed}/${locale}: CP007 visible-evidence state drift`);
      assert.equal(localized.answerId, en.answerId, `${seed}/${locale}: CP007 visible-evidence answer drift`);
      assert.equal(localized.correctIndex, en.correctIndex, `${seed}/${locale}: CP007 visible-evidence option-order drift`);
      assert.equal(localized.difficulty, en.difficulty, `${seed}/${locale}: CP007 difficulty drift`);
      assert.equal(localized.visibleContext.hiddenNodeIds.length, 0, `${seed}/${locale}: CP007 evidence became hidden after localization`);
      assert.deepEqual(new Set(localized.visibleContext.visibleNodeIds), expectedIds, `${seed}/${locale}: expanded CP007 evidence visibility drift`);
      assert.ok(localized.stem.includes(scenario.firstCause[locale]), `${seed}/${locale}: first expanded independent cause missing from stem`);
      assert.ok(localized.stem.includes(scenario.secondCause[locale]), `${seed}/${locale}: second expanded independent cause missing from stem`);
    }
    continue;
  }

  const world = wave4
    ? WAVE4_WORLDS.find((entry) => entry.id === en.causalWorldId)
    : CP007_FALSE_CAUSATION_WORLDS.find((entry) => entry.id === en.causalWorldId);
  assert.ok(world, `${en.causalWorldId}: reviewed CP007 world missing`);

  const visibleNodes = en.visibleContext.visibleNodeIds.map((id) => world.nodes.find((node) => node.id === id)!);
  const visibleCauses = visibleNodes.filter((node) => node.role === "CAUSE");
  const visibleEffects = visibleNodes.filter((node) => node.role === "EFFECT");
  assert.equal(visibleCauses.length, 2, `${en.causalStateId}: two independent causes must be visible`);
  assert.equal(visibleEffects.length, 2, `${en.causalStateId}: two judged outcomes must be visible`);
  for (const cause of visibleCauses) {
    assert.ok(en.stem.includes(cause.text["en-IN"]), `${en.causalStateId}: explanation evidence leaked outside the learner-visible stem`);
  }

  for (const locale of LOCALES) {
    const localized = generateReviewedCaeQuestion({ qlId: "CAE-QL-007", locale, seed });
    assert.equal(localized.causalStateId, en.causalStateId, `${seed}/${locale}: CP007 visible-evidence state drift`);
    assert.equal(localized.answerId, en.answerId, `${seed}/${locale}: CP007 visible-evidence answer drift`);
    assert.equal(localized.correctIndex, en.correctIndex, `${seed}/${locale}: CP007 visible-evidence option-order drift`);
    assert.equal(localized.difficulty, en.difficulty, `${seed}/${locale}: CP007 difficulty drift`);
    assert.equal(localized.visibleContext.hiddenNodeIds.length, 0, `${seed}/${locale}: CP007 evidence became hidden after localization`);
    assert.equal(new Set(localized.visibleContext.visibleNodeIds).size, 4, `${seed}/${locale}: CP007 evidence visibility drift`);
    for (const id of localized.visibleContext.visibleNodeIds) {
      const node = world.nodes.find((entry) => entry.id === id)!;
      assert.ok(localized.stem.includes(node.text[locale]), `${seed}/${locale}: visible CP007 evidence missing from stem`);
    }
  }
}

console.log("PASS_CAE_CP007_LEARNER_VISIBLE_EVIDENCE");