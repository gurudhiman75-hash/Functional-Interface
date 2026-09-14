import assert from "node:assert/strict";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";
import { CAE_001_SATURATION_WAVE1_FAMILIES } from "./causal-world-saturation-wave1.ts";
import { CAE_001_SATURATION_WAVE2_FAMILIES } from "./causal-world-saturation-wave2.ts";
import { CP007_SATURATION_COMMON_FACTOR_FAMILY_IDS } from "./cp007-saturation-adapter.ts";
import { CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS } from "./saturation-candidate-authorities.ts";
import type { CaeQlId } from "./types.ts";

const saturationFamilies = [...CAE_001_SATURATION_WAVE1_FAMILIES, ...CAE_001_SATURATION_WAVE2_FAMILIES];
const saturationIds = new Set(saturationFamilies.map((family) => family.id));
const saturationChainIds = new Set(saturationFamilies.filter((family) => family.topology === "DIRECT_CHAIN").map((family) => family.id));
const controlledHardQls = ["CAE-QL-003", "CAE-QL-004", "CAE-QL-005"] as const satisfies readonly CaeQlId[];

for (const qlId of controlledHardQls) {
  let saturationCount = 0;
  const reached = new Set<string>();
  let specialisedCount = 0;
  for (let seed = 0; seed < 500; seed += 1) {
    const question = generateReviewedCaeQuestion({ qlId, locale: "en-IN", seed });
    if (saturationIds.has(question.scenarioFamilyId)) {
      saturationCount += 1;
      reached.add(question.scenarioFamilyId);
      assert.ok(CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS.includes(question.scenarioFamilyId), `${qlId}/${seed}: reviewed hard projection reached a saturation family without audited candidate authority.`);
      assert.equal(question.candidateComparisons.length, 3, `${qlId}/${seed}: saturation hard item lacks three candidate comparisons.`);
      assert.ok(question.candidateComparisons.filter((candidate) => candidate.editorialPlausibility === "CREDIBLE_ALTERNATIVE").length >= 2, `${qlId}/${seed}: saturation hard item lacks two credible distractors.`);
    } else specialisedCount += 1;
  }
  assert.ok(saturationCount >= 70 && saturationCount <= 130, `${qlId}: reviewed saturation share drifted too far from one-in-five (${saturationCount}/500).`);
  assert.ok(reached.size >= 4, `${qlId}: reviewed saturation sampling reached too few candidate-ready families.`);
  assert.ok(specialisedCount >= 350, `${qlId}: specialised reviewed renderer lost dominance.`);
}

const cp007Approved = new Set(CP007_SATURATION_COMMON_FACTOR_FAMILY_IDS);
let cp007SaturationCount = 0;
for (let seed = 0; seed < 500; seed += 1) {
  const question = generateReviewedCaeQuestion({ qlId: "CAE-QL-007", locale: "en-IN", seed });
  assert.notEqual(question.difficulty, "EASY", `CAE-QL-007/${seed}: reviewed CP007 became EASY.`);
  if (saturationIds.has(question.scenarioFamilyId)) {
    cp007SaturationCount += 1;
    assert.ok(cp007Approved.has(question.scenarioFamilyId), `CAE-QL-007/${seed}: unadapted saturation family bypassed CP007 adapter.`);
    assert.equal(question.answerId, "COMMON_CAUSE");
    assert.equal(question.difficulty, "MEDIUM");
  }
}
assert.ok(cp007SaturationCount >= 55 && cp007SaturationCount <= 70, `CAE-QL-007 saturation share drifted (${cp007SaturationCount}/500).`);

let cp008SaturationCount = 0;
const cp008Modes = new Set<string>();
for (let seed = 0; seed < 500; seed += 1) {
  const question = generateReviewedCaeQuestion({ qlId: "CAE-QL-008", locale: "en-IN", seed });
  assert.notEqual(question.difficulty, "EASY", `CAE-QL-008/${seed}: reviewed CP008 became EASY.`);
  cp008Modes.add(question.causalStructure.split(":")[1]!);
  if (saturationIds.has(question.scenarioFamilyId)) {
    cp008SaturationCount += 1;
    assert.ok(saturationChainIds.has(question.scenarioFamilyId), `CAE-QL-008/${seed}: non-chain saturation family bypassed CP008 adapter.`);
    assert.equal(question.projectionId, "CAE-PLAN-SEQUENCE-V2");
    assert.equal(question.visibleContext.visibleNodeIds.length, 4);
  }
}
assert.ok(cp008SaturationCount >= 55 && cp008SaturationCount <= 70, `CAE-QL-008 saturation share drifted (${cp008SaturationCount}/500).`);
assert.equal(cp008Modes.size, 7, "Reviewed CP008 must retain all seven learner operations after saturation.");

for (let seed = 0; seed < 500; seed += 1) {
  const question = generateReviewedCaeQuestion({ qlId: "CAE-QL-009", locale: "en-IN", seed });
  assert.ok(!saturationIds.has(question.scenarioFamilyId), `CAE-QL-009/${seed}: raw saturation bypassed integrated CP009 renderer.`);
  assert.notEqual(question.difficulty, "EASY");
}

for (const qlId of controlledHardQls) {
  for (let seed = 4; seed < 100; seed += 5) {
    const en = generateReviewedCaeQuestion({ qlId, locale: "en-IN", seed });
    const hi = generateReviewedCaeQuestion({ qlId, locale: "hi-IN", seed });
    const pa = generateReviewedCaeQuestion({ qlId, locale: "pa-IN", seed });
    assert.equal(hi.scenarioFamilyId, en.scenarioFamilyId);
    assert.equal(pa.scenarioFamilyId, en.scenarioFamilyId);
    assert.equal(hi.scenarioVariantId, en.scenarioVariantId);
    assert.equal(pa.scenarioVariantId, en.scenarioVariantId);
  }
}

for (let seed = 0; seed < 96; seed += 8) {
  const en = generateReviewedCaeQuestion({ qlId: "CAE-QL-007", locale: "en-IN", seed });
  const hi = generateReviewedCaeQuestion({ qlId: "CAE-QL-007", locale: "hi-IN", seed });
  const pa = generateReviewedCaeQuestion({ qlId: "CAE-QL-007", locale: "pa-IN", seed });
  assert.equal(hi.scenarioFamilyId, en.scenarioFamilyId);
  assert.equal(pa.scenarioFamilyId, en.scenarioFamilyId);
  assert.equal(hi.scenarioVariantId, en.scenarioVariantId);
  assert.equal(pa.scenarioVariantId, en.scenarioVariantId);
  assert.equal(hi.correctIndex, en.correctIndex);
  assert.equal(pa.correctIndex, en.correctIndex);
}

for (let seed = 7; seed < 104; seed += 8) {
  const en = generateReviewedCaeQuestion({ qlId: "CAE-QL-008", locale: "en-IN", seed });
  const hi = generateReviewedCaeQuestion({ qlId: "CAE-QL-008", locale: "hi-IN", seed });
  const pa = generateReviewedCaeQuestion({ qlId: "CAE-QL-008", locale: "pa-IN", seed });
  assert.equal(hi.scenarioFamilyId, en.scenarioFamilyId, `${seed}: Hindi changed CP008 saturation family.`);
  assert.equal(pa.scenarioFamilyId, en.scenarioFamilyId, `${seed}: Punjabi changed CP008 saturation family.`);
  assert.equal(hi.scenarioVariantId, en.scenarioVariantId);
  assert.equal(pa.scenarioVariantId, en.scenarioVariantId);
  assert.equal(hi.answerId, en.answerId);
  assert.equal(pa.answerId, en.answerId);
  assert.equal(hi.correctIndex, en.correctIndex);
  assert.equal(pa.correctIndex, en.correctIndex);
}

console.log("CAE-001 reviewed saturation QA passed: QL003/004/005 controlled share plus calibrated CP007/CP008 Wave 3 adapters; CP009 remains specialised.");
