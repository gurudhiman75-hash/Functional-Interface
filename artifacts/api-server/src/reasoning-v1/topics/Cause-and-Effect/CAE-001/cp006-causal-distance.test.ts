import assert from "node:assert/strict";
import { generateCp006CausalDistanceQuestion } from "./cp006-causal-distance.ts";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";
import type { CaeLocale } from "./types.ts";

const LOCALES: readonly CaeLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const legacyAnswerIds = new Set<string>();
const bridgeAnswerIds = new Set<string>();
let immediate = 0;
let remote = 0;
let bridge = 0;
const states = new Set<string>();

for (let seed = 0; seed < 240; seed += 1) {
  const question = generateReviewedCaeQuestion({ qlId: "CAE-QL-006", locale: "en-IN", seed });
  states.add(question.causalStateId);
  assert.equal(question.checkpointId, "CAE-CP-006");
  assert.equal(question.qlId, "CAE-QL-006");
  assert.equal(question.projectionId, "CAE-PLAN-CAUSAL-DISTANCE");
  assert.equal(question.options.length, 4);
  assert.equal(question.optionMetadata.filter((option) => option.isCorrect).length, 1);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.metadata.reviewOnly, true);

  if (seed % 3 === 2) {
    bridge += 1;
    bridgeAnswerIds.add(question.answerId);
    assert.equal(question.difficulty, "HARD");
    assert.ok(question.causalStructure.startsWith("CAUSAL_DISTANCE:"));
    assert.equal(question.causalTrace.length, 4);
    assert.equal(question.visibleContext.hiddenNodeIds.length, 2);
    assert.ok(question.explanation.includes("→"));
  } else {
    legacyAnswerIds.add(question.answerId);
    if (question.causalStructure.startsWith("IMMEDIATE:")) {
      immediate += 1;
      assert.equal(question.difficulty, "MEDIUM");
      assert.equal(question.difficultyEvidence.hiddenLinks, 0);
    } else {
      remote += 1;
      assert.equal(question.difficulty, "HARD");
      assert.ok(question.difficultyEvidence.hiddenLinks >= 1);
      assert.ok(question.explanation.includes("→"));
    }
  }
}

assert.ok(immediate > 0, "CP006 reviewed output must include immediate-cause classification");
assert.ok(remote > 0, "CP006 reviewed output must include remote/non-immediate classification");
assert.equal(bridge, 80, "CP006 reviewed output must allocate exactly one seed in three to bridge-distance operations.");
assert.deepEqual(legacyAnswerIds, new Set([
  "FIRST_EFFECT_SECOND_IMMEDIATE",
  "SECOND_EFFECT_FIRST_IMMEDIATE",
  "FIRST_EFFECT_SECOND_REMOTE",
  "SECOND_EFFECT_FIRST_REMOTE",
]));
assert.deepEqual(bridgeAnswerIds, new Set(["FIRST_BRIDGE", "FINAL_BRIDGE"]));
assert.ok(states.size >= 60, `CP006 reviewed output needs broad causal-state coverage after bridge-distance expansion; saw ${states.size}`);

for (let seed = 0; seed < 40; seed += 1) {
  const en = generateCp006CausalDistanceQuestion({ locale: "en-IN", seed });
  for (const locale of LOCALES) {
    const localized = generateCp006CausalDistanceQuestion({ locale, seed });
    assert.equal(localized.causalStateId, en.causalStateId, `${seed}/${locale}: CP006 causal-state drift`);
    assert.equal(localized.answerId, en.answerId, `${seed}/${locale}: CP006 answer drift`);
    assert.equal(localized.correctIndex, en.correctIndex, `${seed}/${locale}: CP006 option-order drift`);
    assert.deepEqual(localized.optionMetadata.map((option) => option.id), en.optionMetadata.map((option) => option.id), `${seed}/${locale}: CP006 semantic option drift`);
  }
}
