import assert from "node:assert/strict";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";
import { CAE_001_SATURATION_WAVE1_FAMILIES } from "./causal-world-saturation-wave1.ts";
import { CAE_001_SATURATION_WAVE2_FAMILIES } from "./causal-world-saturation-wave2.ts";
import { CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS } from "./saturation-candidate-authorities.ts";
import type { CaeQlId } from "./types.ts";

const saturationIds = new Set([...CAE_001_SATURATION_WAVE1_FAMILIES, ...CAE_001_SATURATION_WAVE2_FAMILIES].map((family) => family.id));
const hardQls = ["CAE-QL-003", "CAE-QL-004", "CAE-QL-005", "CAE-QL-009"] as const satisfies readonly CaeQlId[];

for (const qlId of hardQls) {
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
    } else {
      specialisedCount += 1;
    }
  }

  assert.ok(saturationCount >= 70 && saturationCount <= 130, `${qlId}: reviewed saturation share drifted too far from the intended one-in-five allocation (${saturationCount}/500).`);
  assert.ok(saturationFamilies.size >= 4, `${qlId}: reviewed saturation sampling reached too few candidate-ready families.`);
  assert.ok(specialisedCount >= 350, `${qlId}: specialised reviewed renderer lost dominance.`);
}

for (const qlId of ["CAE-QL-007", "CAE-QL-008"] as const satisfies readonly CaeQlId[]) {
  let saturated = 0;
  let specialised = 0;
  const families = new Set<string>();
  for (let seed = 0; seed < 500; seed += 1) {
    const question = generateReviewedCaeQuestion({ qlId, locale: "en-IN", seed });
    if (saturationIds.has(question.scenarioFamilyId)) {
      saturated += 1;
      families.add(question.scenarioFamilyId);
    } else specialised += 1;
  }
  assert.ok(saturated >= 70 && saturated <= 130, `${qlId}: reviewed graph-native saturation share drifted (${saturated}/500).`);
  assert.ok(families.size >= 2, `${qlId}: expanded reviewed output reaches too few saturation families.`);
  assert.ok(specialised >= 350, `${qlId}: specialised reviewed form lost dominance.`);
}

// Locale must never alter semantic selection for a saturation-sampled reviewed seed.
for (const qlId of ["CAE-QL-003", "CAE-QL-004", "CAE-QL-005", "CAE-QL-007", "CAE-QL-008", "CAE-QL-009"] as const satisfies readonly CaeQlId[]) {
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

console.log("CAE-001 reviewed saturation sampling QA passed: controlled saturation share with specialised forms preserved.");
