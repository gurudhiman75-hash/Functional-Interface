import assert from "node:assert/strict";
import { CP007_FALSE_CAUSATION_WORLDS } from "./cp007-false-causation.ts";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";
import type { CaeLocale } from "./types.ts";

const LOCALES: readonly CaeLocale[] = ["en-IN", "hi-IN", "pa-IN"];

for (let seed = 0; seed < 96; seed += 1) {
  if ((seed >>> 0) % 4 === 0) continue; // reviewed common-factor slot

  const en = generateReviewedCaeQuestion({ qlId: "CAE-QL-007", locale: "en-IN", seed });
  assert.equal(en.scenarioFamilyId, "CAE-FAM-FALSE-CAUSATION");
  assert.equal(en.answerId, "CORRELATION_ONLY");

  const world = CP007_FALSE_CAUSATION_WORLDS.find((entry) => entry.id === en.causalWorldId);
  assert.ok(world, `${en.causalWorldId}: reviewed CP007 world missing`);
  assert.equal(en.visibleContext.hiddenNodeIds.length, 0, `${en.causalStateId}: reviewed false-causation evidence must not remain hidden`);
  assert.equal(new Set(en.visibleContext.visibleNodeIds).size, 4, `${en.causalStateId}: both effects and both independent causes must be learner-visible`);

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
    assert.equal(localized.visibleContext.hiddenNodeIds.length, 0, `${seed}/${locale}: CP007 evidence became hidden after localization`);
    assert.equal(new Set(localized.visibleContext.visibleNodeIds).size, 4, `${seed}/${locale}: CP007 evidence visibility drift`);
    for (const id of localized.visibleContext.visibleNodeIds) {
      const node = world.nodes.find((entry) => entry.id === id)!;
      assert.ok(localized.stem.includes(node.text[locale]), `${seed}/${locale}: visible CP007 evidence missing from stem`);
    }
  }
}

console.log("PASS_CAE_CP007_LEARNER_VISIBLE_EVIDENCE");
