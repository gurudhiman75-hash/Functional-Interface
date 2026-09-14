import assert from "node:assert/strict";
import { generateCp006BridgeDistanceQuestion } from "./cp006-bridge-distance.ts";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";
import type { CaeLocale } from "./types.ts";

const LOCALES: readonly CaeLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const operations = new Set<string>();
const families = new Set<string>();
const variants = new Set<string>();

for (let seed = 0; seed < 480; seed += 1) {
  const en = generateCp006BridgeDistanceQuestion({ locale: "en-IN", seed });
  operations.add(en.answerId);
  families.add(en.scenarioFamilyId);
  variants.add(en.scenarioVariantId);
  assert.equal(en.checkpointId, "CAE-CP-006");
  assert.equal(en.qlId, "CAE-QL-006");
  assert.equal(en.difficulty, "HARD");
  assert.equal(en.options.length, 4);
  assert.equal(new Set(en.options).size, 4, `${seed}: bridge-distance options must be unique.`);
  assert.equal(en.optionMetadata.filter((option) => option.isCorrect).length, 1);
  assert.equal(en.visibleContext.visibleNodeIds.length, 2);
  assert.equal(en.visibleContext.hiddenNodeIds.length, 2);
  assert.equal(en.causalTrace.length, 4);
  assert.ok(en.itemVariantId.includes(en.causalStateId));
  assert.ok(en.explanation.includes("→"), `${seed}: explanation must show the complete causal chain.`);
  assert.equal(en.metadata.reviewOnly, true);
  assert.equal(en.metadata.questionBankWritable, false);
  assert.equal(en.metadata.publicEligible, false);

  for (const locale of LOCALES) {
    const localized = generateCp006BridgeDistanceQuestion({ locale, seed });
    assert.equal(localized.scenarioFamilyId, en.scenarioFamilyId, `${seed}/${locale}: family drift`);
    assert.equal(localized.scenarioVariantId, en.scenarioVariantId, `${seed}/${locale}: variant drift`);
    assert.equal(localized.answerId, en.answerId, `${seed}/${locale}: operation drift`);
    assert.equal(localized.correctIndex, en.correctIndex, `${seed}/${locale}: option-order drift`);
    assert.equal(localized.causalStructure, en.causalStructure, `${seed}/${locale}: structure drift`);
  }
}

assert.deepEqual(operations, new Set(["FIRST_BRIDGE", "FINAL_BRIDGE"]), "CP006 must expose both new causal-distance learner operations.");
assert.ok(families.size >= 10, `CP006 bridge-distance should reach broad chain-family depth; reached ${families.size}.`);
assert.ok(variants.size >= 35, `CP006 bridge-distance should reach broad variant depth; reached ${variants.size}.`);

let bridgeAllocation = 0;
let legacyAllocation = 0;
for (let seed = 0; seed < 600; seed += 1) {
  const question = generateReviewedCaeQuestion({ qlId: "CAE-QL-006", locale: "en-IN", seed });
  assert.notEqual(question.difficulty, "EASY");
  if (seed % 3 === 2) {
    bridgeAllocation += 1;
    assert.ok(["FIRST_BRIDGE", "FINAL_BRIDGE"].includes(question.answerId), `${seed}: reviewed CP006 bridge slot escaped the bridge-distance authority.`);
    assert.ok(question.causalStructure.startsWith("CAUSAL_DISTANCE:"));
  } else {
    legacyAllocation += 1;
    assert.ok(["FIRST_EFFECT_SECOND_IMMEDIATE", "SECOND_EFFECT_FIRST_IMMEDIATE", "FIRST_EFFECT_SECOND_REMOTE", "SECOND_EFFECT_FIRST_REMOTE"].includes(question.answerId));
  }
}
assert.equal(bridgeAllocation, 200);
assert.equal(legacyAllocation, 400);

console.log(`CAE-001 CP006 bridge-distance QA passed: ${operations.size} new operations / ${families.size} families / ${variants.size} variants.`);
