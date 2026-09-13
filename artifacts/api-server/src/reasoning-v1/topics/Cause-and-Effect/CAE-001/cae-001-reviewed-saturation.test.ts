import assert from "node:assert/strict";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";
import { CAE_001_SATURATION_WAVE1_FAMILIES } from "./causal-world-saturation-wave1.ts";
import { CAE_001_SATURATION_WAVE2_FAMILIES } from "./causal-world-saturation-wave2.ts";
import { CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS } from "./saturation-candidate-authorities.ts";
import type { CaeQlId } from "./types.ts";

const saturationIds = new Set([...CAE_001_SATURATION_WAVE1_FAMILIES, ...CAE_001_SATURATION_WAVE2_FAMILIES].map((family) => family.id));
const controlledHardQls = ["CAE-QL-003", "CAE-QL-004", "CAE-QL-005"] as const satisfies readonly CaeQlId[];

for (const qlId of controlledHardQls) {
  let saturationCount = 0;
  const saturationFamilies = new Set<string>();
  let specialisedCount = 0;

  for (let seed = 0; seed < 500; seed += 1) {
    const question = generateReviewedCaeQuestion({ qlId, locale: "en-IN", seed });
    if (saturationIds.has(question.scenarioFamilyId)) {
      saturationCount += 1;
      saturationFamilies.add(question.scenarioFamilyId);
      assert.ok(CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS.includes(question.scenarioFamilyId), `${qlId}/${seed}: reviewed hard projection reached a saturation family without audited candidate authority.`);
      assert.equal(question.candidateComparisons.length, 3, `${qlId}/${seed}: saturation hard item lacks three candidate comparisons.`);
      assert.ok(question.candidateComparisons.filter((candidate) => candidate.editorialPlausibility === "CREDIBLE_ALTERNATIVE").length >= 2, `${qlId}/${seed}: saturation hard item lacks two credible distractors.`);
    } else specialisedCount += 1;
  }

  assert.ok(saturationCount >= 70 && saturationCount <= 130, `${qlId}: reviewed saturation share drifted too far from the intended one-in-five allocation (${saturationCount}/500).`);
  assert.ok(saturationFamilies.size >= 4, `${qlId}: reviewed saturation sampling reached too few candidate-ready families.`);
  assert.ok(specialisedCount >= 350, `${qlId}: specialised reviewed renderer lost dominance.`);
}

// CP007/008/009 have richer reviewed operations than their raw graph projection.
// They must stay entirely on the specialised renderer until dedicated saturation
// adapters preserve their inference/difficulty/operation contracts.
for (const qlId of ["CAE-QL-007", "CAE-QL-008", "CAE-QL-009"] as const satisfies readonly CaeQlId[]) {
  for (let seed = 0; seed < 500; seed += 1) {
    const question = generateReviewedCaeQuestion({ qlId, locale: "en-IN", seed });
    assert.ok(!saturationIds.has(question.scenarioFamilyId), `${qlId}/${seed}: raw saturation family bypassed the specialised reviewed renderer.`);
    assert.notEqual(question.difficulty, "EASY", `${qlId}/${seed}: specialised reviewed item became EASY.`);
  }
}

// Locale must never alter semantic selection for saturation-controlled reviewed seeds.
for (const qlId of controlledHardQls) {
  for (let seed = 4; seed < 100; seed += 5) {
    const en = generateReviewedCaeQuestion({ qlId, locale: "en-IN", seed });
    const hi = generateReviewedCaeQuestion({ qlId, locale: "hi-IN", seed });
    const pa = generateReviewedCaeQuestion({ qlId, locale: "pa-IN", seed });
    assert.equal(hi.scenarioFamilyId, en.scenarioFamilyId, `${qlId}/${seed}: Hindi changed reviewed family selection.`);
    assert.equal(pa.scenarioFamilyId, en.scenarioFamilyId, `${qlId}/${seed}: Punjabi changed reviewed family selection.`);
    assert.equal(hi.scenarioVariantId, en.scenarioVariantId, `${qlId}/${seed}: Hindi changed reviewed variant selection.`);
    assert.equal(pa.scenarioVariantId, en.scenarioVariantId, `${qlId}/${seed}: Punjabi changed reviewed variant selection.`);
  }
}

console.log("CAE-001 reviewed saturation sampling QA passed: controlled QL003/004/005 share with CP007/008/009 specialised contracts preserved.");
