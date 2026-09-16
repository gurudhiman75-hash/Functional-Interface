import assert from "node:assert/strict";
import { generateCp009SaturationQuestion } from "./cp009-saturation-adapter.ts";
import { CP009_EXPANDED_COMMON_CAUSE_FAMILY_IDS } from "./cp009-expanded-common-cause.ts";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";
import { CAE_001_SATURATION_WAVE1_FAMILIES } from "./causal-world-saturation-wave1.ts";
import { CAE_001_SATURATION_WAVE2_FAMILIES } from "./causal-world-saturation-wave2.ts";

const saturationIds = new Set([...CAE_001_SATURATION_WAVE1_FAMILIES, ...CAE_001_SATURATION_WAVE2_FAMILIES].map((family) => family.id));
const expandedCommonCauseIds = new Set(CP009_EXPANDED_COMMON_CAUSE_FAMILY_IDS);
const expectedModes = new Set(["MISSING_SINGLE", "MISSING_PAIR", "RELATION_TYPE", "CONNECTOR_PAIR", "NEXT_OUTCOME", "COMMON_CAUSE_RECONSTRUCTION"]);
const seenModes = new Set<string>();
const seenFamilies = new Set<string>();
let medium = 0;
let hard = 0;

for (let seed = 0; seed < 1200; seed += 1) {
  const en = generateCp009SaturationQuestion({ locale: "en-IN", seed });
  assert.equal(en.qlId, "CAE-QL-009");
  assert.equal(en.projectionId, "CAE-PLAN-INTEGRATED-V2");
  assert.ok(saturationIds.has(en.scenarioFamilyId));
  assert.equal(en.options.length, 4);
  assert.equal(new Set(en.options).size, 4);
  assert.equal(en.optionMetadata.filter((o) => o.isCorrect).length, 1);
  assert.notEqual(en.difficulty, "EASY");
  assert.equal(en.metadata.reviewOnly, true);
  assert.equal(en.metadata.publicEligible, false);
  const mode = en.causalStructure.split(":")[1]!;
  seenModes.add(mode);
  seenFamilies.add(en.scenarioFamilyId);
  if (en.difficulty === "MEDIUM") medium += 1;
  if (en.difficulty === "HARD") hard += 1;
  if (mode === "MISSING_PAIR" || mode === "CONNECTOR_PAIR") {
    assert.ok(en.answerId.includes("|"));
    const wrong = en.optionMetadata.filter((o) => !o.isCorrect);
    assert.equal(wrong.filter((o) => o.id.startsWith("NEAR_PAIR:TARGETED:")).length, 2);
    assert.equal(wrong.filter((o) => o.distractorRole === "TEMPORAL_VIOLATION").length, 1);
  }
  if (mode === "RELATION_TYPE") {
    assert.equal(en.answerId, "INDIRECT");
    assert.equal(en.difficulty, "MEDIUM");
    assert.equal(en.visibleContext.visibleNodeIds.length, 4);
  }
  if (mode === "COMMON_CAUSE_RECONSTRUCTION") {
    assert.equal(en.visibleContext.visibleNodeIds.length, 2);
    assert.equal(en.causalTrace.length, 3);
  }
  for (const locale of ["hi-IN", "pa-IN"] as const) {
    const localized = generateCp009SaturationQuestion({ locale, seed });
    assert.equal(localized.scenarioFamilyId, en.scenarioFamilyId, `${seed}/${locale}: family drift`);
    assert.equal(localized.scenarioVariantId, en.scenarioVariantId, `${seed}/${locale}: variant drift`);
    assert.equal(localized.answerId, en.answerId, `${seed}/${locale}: answer drift`);
    assert.equal(localized.correctIndex, en.correctIndex, `${seed}/${locale}: presentation drift`);
    assert.equal(localized.difficulty, en.difficulty, `${seed}/${locale}: difficulty drift`);
    assert.equal(localized.causalStructure, en.causalStructure, `${seed}/${locale}: mode drift`);
  }
}

assert.deepEqual(seenModes, expectedModes, "CP009 saturation must preserve all six integrated learner operations.");
assert.ok(seenFamilies.size >= 7, `CP009 saturation should reach broad family coverage; saw ${seenFamilies.size}.`);
assert.ok(medium > 0 && hard > 0, "CP009 saturation must retain MEDIUM and HARD content.");

let reviewedLegacySaturation = 0;
let reviewedExpandedCommon = 0;
const expandedFamiliesReached = new Set<string>();
for (let seed = 0; seed < 800; seed += 1) {
  const question = generateReviewedCaeQuestion({ qlId: "CAE-QL-009", locale: "en-IN", seed });
  if (saturationIds.has(question.scenarioFamilyId) && seed % 8 === 6) reviewedLegacySaturation += 1;
  if (seed % 8 === 2) {
    reviewedExpandedCommon += 1;
    expandedFamiliesReached.add(question.scenarioFamilyId);
    assert.ok(expandedCommonCauseIds.has(question.scenarioFamilyId), `${seed}: expanded CP009 common-cause slot used an unapproved family.`);
    assert.equal(question.answerId, "COMMON_CAUSE_RECONSTRUCTION_EXPANDED");
    assert.equal(question.difficulty, "HARD");
    assert.equal(question.visibleContext.visibleNodeIds.length, 2);
    assert.equal(question.visibleContext.hiddenNodeIds.length, 1);
    assert.equal(question.causalTrace.length, 3);
  }
  assert.notEqual(question.difficulty, "EASY");
}
assert.equal(reviewedLegacySaturation, 100, `CP009 legacy integrated saturation allocation drifted: ${reviewedLegacySaturation}/800.`);
assert.equal(reviewedExpandedCommon, 100, `CP009 expanded common-cause allocation drifted: ${reviewedExpandedCommon}/800.`);
assert.ok(expandedFamiliesReached.size >= 7, `CP009 expanded common-cause family breadth is too narrow (${expandedFamiliesReached.size}).`);

for (let seed = 2; seed < 130; seed += 8) {
  const en = generateReviewedCaeQuestion({ qlId: "CAE-QL-009", locale: "en-IN", seed });
  const hi = generateReviewedCaeQuestion({ qlId: "CAE-QL-009", locale: "hi-IN", seed });
  const pa = generateReviewedCaeQuestion({ qlId: "CAE-QL-009", locale: "pa-IN", seed });
  assert.equal(hi.scenarioFamilyId, en.scenarioFamilyId);
  assert.equal(pa.scenarioFamilyId, en.scenarioFamilyId);
  assert.equal(hi.scenarioVariantId, en.scenarioVariantId);
  assert.equal(pa.scenarioVariantId, en.scenarioVariantId);
  assert.equal(hi.answerId, en.answerId);
  assert.equal(pa.answerId, en.answerId);
  assert.equal(hi.correctIndex, en.correctIndex);
  assert.equal(pa.correctIndex, en.correctIndex);
}

console.log(`CAE-001 CP009 QA passed: ${seenFamilies.size} legacy saturation families / ${expandedFamiliesReached.size} expanded common-cause families / all six integrated operations preserved.`);
