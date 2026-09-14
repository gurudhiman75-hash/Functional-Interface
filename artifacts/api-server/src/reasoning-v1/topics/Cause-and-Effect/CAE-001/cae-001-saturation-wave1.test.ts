import assert from "node:assert/strict";
import { generateCaeQuestion } from "./chapter-generator.ts";
import { CAE_001_CAUSAL_WORLDS, CAE_001_PROJECTION_AUTHORITIES, CAE_001_SCENARIO_FAMILIES } from "./causal-world-authorities.ts";
import {
  CAE_001_SATURATION_WAVE1_FAMILIES,
  CAE_001_SATURATION_WAVE1_VARIANT_COUNT,
  installCae001SaturationWave1,
} from "./causal-world-saturation-wave1.ts";
import { CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE } from "./question-studio-review.ts";
import type { CaeLocale, CaeQlId } from "./types.ts";

assert.equal(CAE_001_SATURATION_WAVE1_FAMILIES.length, 12, "Wave 1 must keep all 12 authored saturation families.");
assert.equal(CAE_001_SATURATION_WAVE1_VARIANT_COUNT, 48, "Wave 1 must keep all 48 authored saturation variants.");
assert.equal(CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE.scenarioFamilyCount, 9, "Frozen V3 family-count compatibility drifted.");
assert.equal(CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE.canonicalScenarioVariantCount, 27, "Frozen V3 variant-count compatibility drifted.");
assert.equal(CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE.saturationWave1FamilyCount, 12, "Question Studio Wave 1 family count drifted.");
assert.equal(CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE.saturationWave1VariantCount, 48, "Question Studio Wave 1 variant count drifted.");

installCae001SaturationWave1();
assert.equal(CAE_001_SCENARIO_FAMILIES.length, 21, "Installed Wave 1 registry must contain 21 families.");
assert.equal(CAE_001_CAUSAL_WORLDS.length, 75, "Installed Wave 1 registry must contain 75 canonical worlds.");

const chainIds = CAE_001_SATURATION_WAVE1_FAMILIES.filter((family) => family.topology === "DIRECT_CHAIN").map((family) => family.id);
const commonIds = CAE_001_SATURATION_WAVE1_FAMILIES.filter((family) => family.topology === "BRANCHING_COMMON_CAUSE" || family.topology === "PARALLEL_CHAINS").map((family) => family.id);
const correlationIds = CAE_001_SATURATION_WAVE1_FAMILIES.filter((family) => family.topology === "PARALLEL_CHAINS").map((family) => family.id);

const expectedByQl: Readonly<Record<CaeQlId, readonly string[]>> = {
  "CAE-QL-001": chainIds,
  "CAE-QL-002": commonIds,
  "CAE-QL-003": [],
  "CAE-QL-004": [],
  "CAE-QL-005": [],
  "CAE-QL-006": chainIds,
  "CAE-QL-007": correlationIds,
  "CAE-QL-008": chainIds,
  "CAE-QL-009": [],
};

for (const [qlId, expectedIds] of Object.entries(expectedByQl) as [CaeQlId, readonly string[]][]) {
  const plan = CAE_001_PROJECTION_AUTHORITIES.find((entry) => entry.qlId === qlId);
  assert.ok(plan, `${qlId}: projection plan missing.`);
  for (const familyId of expectedIds) assert.ok(plan.compatibleFamilyIds.includes(familyId), `${qlId}: saturation family ${familyId} is not wired into the plan.`);
}

const representativeSeed = new Map<string, Readonly<{ qlId: CaeQlId; seed: number }>>();
const graphNativeQls: readonly CaeQlId[] = ["CAE-QL-001", "CAE-QL-002", "CAE-QL-006", "CAE-QL-007", "CAE-QL-008"];
const saturationIds = new Set(CAE_001_SATURATION_WAVE1_FAMILIES.map((family) => family.id));

for (const qlId of graphNativeQls) {
  for (let seed = 0; seed < 1024; seed += 1) {
    const question = generateCaeQuestion({ qlId, locale: "en-IN", seed, questionProfile: "FOUR_WAY" });
    if (saturationIds.has(question.scenarioFamilyId) && !representativeSeed.has(question.scenarioFamilyId)) representativeSeed.set(question.scenarioFamilyId, { qlId, seed });
  }
}

for (const family of CAE_001_SATURATION_WAVE1_FAMILIES) {
  const representative = representativeSeed.get(family.id);
  assert.ok(representative, `${family.id}: no deterministic seed reached this saturation family.`);
  for (const locale of ["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly CaeLocale[]) {
    const question = generateCaeQuestion({ qlId: representative.qlId, locale, seed: representative.seed, questionProfile: "FOUR_WAY" });
    assert.equal(question.scenarioFamilyId, family.id, `${family.id}/${locale}: locale changed semantic family selection.`);
    assert.ok(question.stem.trim().length > 20, `${family.id}/${locale}: rendered stem is unexpectedly short.`);
    assert.ok(question.explanation.trim().length > 20, `${family.id}/${locale}: rendered explanation is unexpectedly short.`);
    assert.equal(question.options.length, 4, `${family.id}/${locale}: expected four options.`);
    assert.ok(question.correctIndex >= 0 && question.correctIndex < question.options.length, `${family.id}/${locale}: invalid correct option index.`);
  }
}

for (const qlId of ["CAE-QL-003", "CAE-QL-004", "CAE-QL-005", "CAE-QL-009"] as const) {
  const plan = CAE_001_PROJECTION_AUTHORITIES.find((entry) => entry.qlId === qlId)!;
  assert.ok(!plan.compatibleFamilyIds.some((familyId) => saturationIds.has(familyId)), `${qlId}: Wave 1 candidate-heavy expansion was enabled before distractor authority was authored.`);
}

console.log(`CAE-001 saturation wave 1 QA passed: ${CAE_001_SCENARIO_FAMILIES.length} Wave 1 families / ${CAE_001_CAUSAL_WORLDS.length} Wave 1 variants.`);
