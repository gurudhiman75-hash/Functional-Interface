import assert from "node:assert/strict";
import { generateCaeQuestion } from "./chapter-generator.ts";
import { CAE_001_CAUSAL_WORLDS, CAE_001_PROJECTION_AUTHORITIES, CAE_001_SCENARIO_FAMILIES } from "./causal-world-authorities.ts";
import {
  CAE_001_SATURATION_EFFECTIVE_FAMILY_COUNT,
  CAE_001_SATURATION_EFFECTIVE_VARIANT_COUNT,
  CAE_001_SATURATION_WAVE2_FAMILIES,
  CAE_001_SATURATION_WAVE2_VARIANT_COUNT,
  withCae001SaturationWave2,
} from "./causal-world-saturation-wave2.ts";
import { CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS } from "./saturation-candidate-authorities.ts";
import { CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE } from "./question-studio-review.ts";
import type { CaeLocale, CaeQlId } from "./types.ts";

assert.equal(CAE_001_SATURATION_WAVE2_FAMILIES.length, 9, "Wave 2 must keep all nine authored families.");
assert.equal(CAE_001_SATURATION_WAVE2_VARIANT_COUNT, 45, "Wave 2 must keep all 45 authored variants.");
assert.equal(CAE_001_SATURATION_EFFECTIVE_FAMILY_COUNT, 30, "Effective saturation floor must be 30 families.");
assert.equal(CAE_001_SATURATION_EFFECTIVE_VARIANT_COUNT, 120, "Effective saturation floor must be 120 canonical variants.");
assert.equal(CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE.effectiveScenarioFamilyCount, 30, "Question Studio must expose 30 effective families.");
assert.equal(CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE.effectiveCanonicalScenarioVariantCount, 120, "Question Studio must expose 120 effective canonical variants.");

assert.equal(CAE_001_SCENARIO_FAMILIES.length, 9, "Wave 2 module import leaked into frozen family registry.");
assert.equal(CAE_001_CAUSAL_WORLDS.length, 27, "Wave 2 module import leaked into frozen world registry.");

const wave2Ids = new Set(CAE_001_SATURATION_WAVE2_FAMILIES.map((family) => family.id));
const candidateReadyIds = new Set(CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS);
const chainIds = CAE_001_SATURATION_WAVE2_FAMILIES.filter((family) => family.topology === "DIRECT_CHAIN").map((family) => family.id);
const commonIds = CAE_001_SATURATION_WAVE2_FAMILIES.filter((family) => family.topology === "BRANCHING_COMMON_CAUSE" || family.topology === "PARALLEL_CHAINS").map((family) => family.id);
const correlationIds = CAE_001_SATURATION_WAVE2_FAMILIES.filter((family) => family.topology === "PARALLEL_CHAINS").map((family) => family.id);

const representatives = withCae001SaturationWave2(() => {
  assert.equal(CAE_001_SCENARIO_FAMILIES.length, 30, "Scoped Wave 2 registry must contain 30 families.");
  assert.equal(CAE_001_CAUSAL_WORLDS.length, 120, "Scoped Wave 2 registry must contain 120 canonical worlds.");

  const expectedByQl: Readonly<Partial<Record<CaeQlId, readonly string[]>>> = {
    "CAE-QL-001": chainIds,
    "CAE-QL-002": commonIds,
    "CAE-QL-006": chainIds,
    "CAE-QL-007": correlationIds,
    "CAE-QL-008": chainIds,
  };
  for (const [qlId, expectedIds] of Object.entries(expectedByQl) as [CaeQlId, readonly string[]][]) {
    const plan = CAE_001_PROJECTION_AUTHORITIES.find((entry) => entry.qlId === qlId)!;
    for (const familyId of expectedIds) assert.ok(plan.compatibleFamilyIds.includes(familyId), `${qlId}: Wave 2 family ${familyId} is not wired into the scoped plan.`);
  }

  const found = new Map<string, Readonly<{ qlId: CaeQlId; seed: number }>>();
  for (const qlId of ["CAE-QL-001", "CAE-QL-002", "CAE-QL-006", "CAE-QL-007", "CAE-QL-008"] as const) {
    for (let seed = 0; seed < 2048 && found.size < CAE_001_SATURATION_WAVE2_FAMILIES.length; seed += 1) {
      const question = generateCaeQuestion({ qlId, locale: "en-IN", seed, questionProfile: "FOUR_WAY" });
      if (wave2Ids.has(question.scenarioFamilyId) && !found.has(question.scenarioFamilyId)) found.set(question.scenarioFamilyId, { qlId, seed });
    }
  }
  return found;
});

assert.equal(representatives.size, CAE_001_SATURATION_WAVE2_FAMILIES.length, "Every Wave 2 family must be reachable by deterministic generation seeds.");

for (const family of CAE_001_SATURATION_WAVE2_FAMILIES) {
  const representative = representatives.get(family.id)!;
  for (const locale of ["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly CaeLocale[]) {
    const question = withCae001SaturationWave2(() => generateCaeQuestion({ qlId: representative.qlId, locale, seed: representative.seed, questionProfile: "FOUR_WAY" }));
    assert.equal(question.scenarioFamilyId, family.id, `${family.id}/${locale}: locale changed semantic family selection.`);
    assert.ok(question.stem.trim().length > 20, `${family.id}/${locale}: stem is unexpectedly short.`);
    assert.ok(question.explanation.trim().length > 20, `${family.id}/${locale}: explanation is unexpectedly short.`);
    assert.equal(question.options.length, 4, `${family.id}/${locale}: expected four options.`);
    assert.ok(question.correctIndex >= 0 && question.correctIndex < 4, `${family.id}/${locale}: invalid correct option index.`);
  }
}

// Hard projections may contain only the explicitly candidate-ready Wave 2
// families. The remaining four Wave 2 families stay gated.
withCae001SaturationWave2(() => {
  for (const qlId of ["CAE-QL-003", "CAE-QL-004", "CAE-QL-005", "CAE-QL-009"] as const) {
    const plan = CAE_001_PROJECTION_AUTHORITIES.find((entry) => entry.qlId === qlId)!;
    for (const familyId of CAE_001_SATURATION_CANDIDATE_READY_FAMILY_IDS) assert.ok(plan.compatibleFamilyIds.includes(familyId), `${qlId}: candidate-ready family ${familyId} is not unlocked.`);
    assert.ok(!plan.compatibleFamilyIds.some((familyId) => wave2Ids.has(familyId) && !candidateReadyIds.has(familyId)), `${qlId}: a non-ready Wave 2 family entered a candidate-heavy plan.`);
  }
});

assert.equal(CAE_001_SCENARIO_FAMILIES.length, 9, "Wave 2 scope did not restore frozen family registry.");
assert.equal(CAE_001_CAUSAL_WORLDS.length, 27, "Wave 2 scope did not restore frozen world registry.");

console.log("CAE-001 saturation wave 2 QA passed: 30 effective families / 120 effective canonical variants.");
