import assert from "node:assert/strict";
import { generateCp008SaturationQuestion } from "./cp008-saturation-adapter.ts";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";
import { CAE_001_SATURATION_WAVE1_FAMILIES } from "./causal-world-saturation-wave1.ts";
import { CAE_001_SATURATION_WAVE2_FAMILIES } from "./causal-world-saturation-wave2.ts";

const chainIds = new Set([...CAE_001_SATURATION_WAVE1_FAMILIES, ...CAE_001_SATURATION_WAVE2_FAMILIES].filter((family) => family.topology === "DIRECT_CHAIN").map((family) => family.id));
const expectedModes = new Set(["SEQUENCE", "IMMEDIATE_CAUSE", "IMMEDIATE_EFFECT", "EARLIEST_CAUSE", "FINAL_EFFECT", "BRIDGE_ROLE", "INVALID_RELATION"]);
const seenModes = new Set<string>();
const seenFamilies = new Set<string>();
const seenLabelOrders = new Set<string>();
let medium = 0;
let hard = 0;

for (let seed = 0; seed < 800; seed += 1) {
  const en = generateCp008SaturationQuestion({ locale: "en-IN", seed });
  assert.equal(en.qlId, "CAE-QL-008");
  assert.equal(en.projectionId, "CAE-PLAN-SEQUENCE-V2");
  assert.ok(chainIds.has(en.scenarioFamilyId), `${seed}: CP008 saturation escaped expanded chain families.`);
  assert.equal(en.options.length, 4);
  assert.equal(new Set(en.options).size, 4);
  assert.equal(en.optionMetadata.filter((option) => option.isCorrect).length, 1);
  assert.equal(en.metadata.reviewOnly, true);
  assert.equal(en.metadata.publicEligible, false);
  assert.equal(en.visibleContext.visibleNodeIds.length, 4);
  assert.equal(en.causalTrace.length, 4);
  assert.notEqual(en.difficulty, "EASY");
  const mode = en.causalStructure.split(":")[1]!;
  seenModes.add(mode);
  seenFamilies.add(en.scenarioFamilyId);
  if (en.difficulty === "MEDIUM") medium += 1;
  if (en.difficulty === "HARD") hard += 1;
  const labels = en.stem.split("\n").filter((line) => /^[PQRS]\.\s/u.test(line)).map((line) => line[0]).join("");
  if (labels) seenLabelOrders.add(labels);

  for (const locale of ["hi-IN", "pa-IN"] as const) {
    const localized = generateCp008SaturationQuestion({ locale, seed });
    assert.equal(localized.scenarioFamilyId, en.scenarioFamilyId, `${seed}/${locale}: family drift`);
    assert.equal(localized.scenarioVariantId, en.scenarioVariantId, `${seed}/${locale}: variant drift`);
    assert.equal(localized.answerId, en.answerId, `${seed}/${locale}: answer drift`);
    assert.equal(localized.correctIndex, en.correctIndex, `${seed}/${locale}: presentation drift`);
    assert.equal(localized.difficulty, en.difficulty, `${seed}/${locale}: difficulty drift`);
    assert.equal(localized.causalStructure, en.causalStructure, `${seed}/${locale}: mode drift`);
  }
}

assert.deepEqual(seenModes, expectedModes, "CP008 saturation must preserve all seven learner operations.");
assert.ok(seenFamilies.size >= 10, `CP008 saturation should reach broad chain-family coverage; saw ${seenFamilies.size}.`);
assert.ok(medium > 0 && hard > 0, "CP008 saturation must retain both MEDIUM and HARD bands.");

let reviewedSaturation = 0;
let reviewedLegacy = 0;
for (let seed = 0; seed < 800; seed += 1) {
  const question = generateReviewedCaeQuestion({ qlId: "CAE-QL-008", locale: "en-IN", seed });
  if (chainIds.has(question.scenarioFamilyId)) reviewedSaturation += 1;
  else reviewedLegacy += 1;
  assert.notEqual(question.difficulty, "EASY", `${seed}: reviewed CP008 became EASY.`);
}
assert.equal(reviewedSaturation, 100, `CP008 reviewed saturation allocation drifted: ${reviewedSaturation}/800.`);
assert.equal(reviewedLegacy, 700, `CP008 legacy renderer allocation drifted: ${reviewedLegacy}/800.`);

console.log(`CAE-001 CP008 Wave 3 saturation QA passed: ${seenFamilies.size} chain families / all seven operations.`);
