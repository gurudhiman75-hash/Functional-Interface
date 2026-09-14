import assert from "node:assert/strict";
import { CAE_001_CAUSAL_WORLDS, CAE_001_SCENARIO_FAMILIES } from "./causal-world-authorities.ts";
import {
  CAE_001_SATURATION_WAVE4_BRANCH_FAMILY_IDS,
  CAE_001_SATURATION_WAVE4_EFFECTIVE_FAMILY_COUNT,
  CAE_001_SATURATION_WAVE4_EFFECTIVE_VARIANT_COUNT,
  CAE_001_SATURATION_WAVE4_FAMILIES,
  CAE_001_SATURATION_WAVE4_FAMILY_IDS,
  CAE_001_SATURATION_WAVE4_PARALLEL_FAMILY_IDS,
  CAE_001_SATURATION_WAVE4_VARIANT_COUNT,
  withCae001SaturationWave4,
} from "./causal-world-saturation-wave4.ts";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";

assert.equal(CAE_001_SATURATION_WAVE4_FAMILIES.length, 10);
assert.equal(CAE_001_SATURATION_WAVE4_VARIANT_COUNT, 40);
assert.equal(CAE_001_SATURATION_WAVE4_EFFECTIVE_FAMILY_COUNT, 40);
assert.equal(CAE_001_SATURATION_WAVE4_EFFECTIVE_VARIANT_COUNT, 160);
assert.equal(CAE_001_SATURATION_WAVE4_BRANCH_FAMILY_IDS.length, 5);
assert.equal(CAE_001_SATURATION_WAVE4_PARALLEL_FAMILY_IDS.length, 5);
assert.equal(new Set(CAE_001_SATURATION_WAVE4_FAMILY_IDS).size, 10);
assert.equal(CAE_001_SATURATION_WAVE4_FAMILIES.every((family) => family.variants.length === 4), true);

const baseFamilyCount = CAE_001_SCENARIO_FAMILIES.length;
const baseWorldCount = CAE_001_CAUSAL_WORLDS.length;
withCae001SaturationWave4(() => {
  assert.equal(CAE_001_SCENARIO_FAMILIES.length, 40, "Wave 4 scoped registry must expose forty canonical families.");
  assert.equal(CAE_001_CAUSAL_WORLDS.length, 160, "Wave 4 scoped registry must expose 160 canonical worlds.");
});
assert.equal(CAE_001_SCENARIO_FAMILIES.length, baseFamilyCount, "Wave 4 family overlay leaked after scope exit.");
assert.equal(CAE_001_CAUSAL_WORLDS.length, baseWorldCount, "Wave 4 world overlay leaked after scope exit.");

const wave4Ids = new Set(CAE_001_SATURATION_WAVE4_FAMILY_IDS);
const seenFamilies = new Set<string>();
const seenVariants = new Set<string>();
const sampleSeeds: number[] = [];
for (let seed = 0; seed < 8_000; seed += 1) {
  const q = generateReviewedCaeQuestion({ qlId: "CAE-QL-002", locale: "en-IN", seed });
  if (!wave4Ids.has(q.scenarioFamilyId)) continue;
  seenFamilies.add(q.scenarioFamilyId);
  seenVariants.add(`${q.scenarioFamilyId}|${q.scenarioVariantId}`);
  if (sampleSeeds.length < 60) sampleSeeds.push(seed);
}
assert.deepEqual(seenFamilies, wave4Ids, "QL002 must reach every Wave 4 family.");
assert.equal(seenVariants.size, 40, "QL002 must reach all forty Wave 4 variants in the 8k sweep.");

for (const seed of sampleSeeds) {
  const en = generateReviewedCaeQuestion({ qlId: "CAE-QL-002", locale: "en-IN", seed });
  const hi = generateReviewedCaeQuestion({ qlId: "CAE-QL-002", locale: "hi-IN", seed });
  const pa = generateReviewedCaeQuestion({ qlId: "CAE-QL-002", locale: "pa-IN", seed });
  assert.equal(hi.scenarioFamilyId, en.scenarioFamilyId);
  assert.equal(pa.scenarioFamilyId, en.scenarioFamilyId);
  assert.equal(hi.scenarioVariantId, en.scenarioVariantId);
  assert.equal(pa.scenarioVariantId, en.scenarioVariantId);
  assert.equal(hi.answerId, en.answerId);
  assert.equal(pa.answerId, en.answerId);
  assert.equal(hi.correctIndex, en.correctIndex);
  assert.equal(pa.correctIndex, en.correctIndex);
}

console.log("CAE-001 Wave 4 QA passed: 40 effective families / 160 variants; all 40 new QL002 variants reachable with EN/HI/PA parity.");
