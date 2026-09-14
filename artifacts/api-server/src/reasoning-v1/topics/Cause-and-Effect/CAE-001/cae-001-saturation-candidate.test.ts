import assert from "node:assert/strict";
import { generateCaeQuestion } from "./chapter-generator.ts";
import { CAE_001_PROJECTION_AUTHORITIES } from "./causal-world-authorities.ts";
import { withCae001SaturationWave2 } from "./causal-world-saturation-wave2.ts";
import { CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS } from "./saturation-candidate-authorities.ts";
import type { CaeLocale, CaeQlId } from "./types.ts";

const qls = ["CAE-QL-003", "CAE-QL-004", "CAE-QL-005", "CAE-QL-009"] as const satisfies readonly CaeQlId[];
const locales = ["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly CaeLocale[];
assert.equal(CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS.length, 5, "Wave 2 candidate-ready floor must remain five families.");

for (const qlId of qls) {
  const representatives = withCae001SaturationWave2(() => {
    const plan = CAE_001_PROJECTION_AUTHORITIES.find((entry) => entry.qlId === qlId)!;
    for (const familyId of CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS) {
      assert.ok(plan.compatibleFamilyIds.includes(familyId), `${qlId}: candidate-ready family ${familyId} is not wired into the plan.`);
    }

    const found = new Map<string, number>();
    for (let seed = 0; seed < 8192 && found.size < CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS.length; seed += 1) {
      const question = generateCaeQuestion({ qlId, locale: "en-IN", seed, questionProfile: "FOUR_WAY" });
      if (CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS.includes(question.scenarioFamilyId) && !found.has(question.scenarioFamilyId)) found.set(question.scenarioFamilyId, seed);
    }
    return found;
  });

  assert.equal(representatives.size, CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS.length, `${qlId}: every candidate-ready family must be reachable.`);

  for (const familyId of CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS) {
    const seed = representatives.get(familyId)!;
    for (const locale of locales) {
      const question = withCae001SaturationWave2(() => generateCaeQuestion({ qlId, locale, seed, questionProfile: "FOUR_WAY" }));
      assert.equal(question.scenarioFamilyId, familyId, `${qlId}/${familyId}/${locale}: locale changed selected family.`);
      assert.equal(question.options.length, 4, `${qlId}/${familyId}/${locale}: expected four options.`);
      assert.equal(new Set(question.options).size, 4, `${qlId}/${familyId}/${locale}: option text duplicated.`);
      assert.equal(question.candidateComparisons.length, 3, `${qlId}/${familyId}/${locale}: expected three audited distractors.`);
      assert.ok(question.candidateComparisons.filter((candidate) => candidate.editorialPlausibility === "CREDIBLE_ALTERNATIVE").length >= 2, `${qlId}/${familyId}/${locale}: fewer than two credible distractors.`);
      assert.ok(question.candidateComparisons.every((candidate) => candidate.applicability.applicableProjectionKinds.includes(question.qlId === "CAE-QL-003" ? "PROBABLE_CAUSE" : question.qlId === "CAE-QL-004" ? "PROBABLE_EFFECT" : question.qlId === "CAE-QL-005" ? "COMPETING_EXPLANATION" : "MISSING_CAUSAL_LINK")), `${qlId}/${familyId}/${locale}: candidate applicability mismatch.`);
      assert.ok(question.explanation.trim().length > 20, `${qlId}/${familyId}/${locale}: explanation unexpectedly short.`);
    }
  }
}

console.log("CAE-001 candidate-heavy saturation QA passed: 5 families across QL003/004/005/009 in EN/HI/PA.");
