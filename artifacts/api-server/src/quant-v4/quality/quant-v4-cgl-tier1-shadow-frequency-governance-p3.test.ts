import assert from "node:assert/strict";

import { QUANT_V4_REGISTERED_PYQ_OBSERVATIONS } from "./quant-v4-pyq-observation-registry-p2";
import { QUANT_V4_REAL_EXAM_PROFILES } from "./quant-v4-real-exam-simulation-p2";
import {
  QUANT_V4_CGL_TIER1_SHADOW_FREQUENCY_GOVERNANCE_AUTHORITY,
  buildQuantV4CglTier1ShadowFrequencyGovernance,
} from "./quant-v4-cgl-tier1-shadow-frequency-governance-p3";

const cglProfile = QUANT_V4_REAL_EXAM_PROFILES.find((profile) => profile.id === "SSC_CGL_TIER_I");
assert.ok(cglProfile);

// The active simulator remains untouched and explicitly provisional. This P3
// checkpoint only derives a shadow empirical plan for governance/review.
assert.equal(cglProfile.blueprintEvidence, "PROVISIONAL_PYQ_WEIGHTING_REQUIRED");
assert.deepEqual(cglProfile.slotPlan, [
  { kind: "ARITHMETIC_CORE", count: 13 },
  { kind: "GEOMETRY_MENSURATION", count: 4 },
  { kind: "TRIGONOMETRY", count: 3 },
  { kind: "ALGEBRA", count: 2 },
  { kind: "PROBABILITY", count: 3 },
]);

const governance = buildQuantV4CglTier1ShadowFrequencyGovernance({
  currentSlotPlan: cglProfile.slotPlan,
});

assert.equal(
  QUANT_V4_CGL_TIER1_SHADOW_FREQUENCY_GOVERNANCE_AUTHORITY,
  "QUANT-V4-CGL-TIER1-SHADOW-FREQUENCY-GOVERNANCE-P3",
);
assert.equal(governance.status, "SHADOW_EMPIRICAL_CANDIDATE_LOCKED");
assert.equal(governance.stabilityStatus, "STABILITY_CANDIDATE");
assert.equal(governance.completeSectionCount, 13);
assert.equal(governance.completeQuestionCount, 325);
assert.equal(governance.packageCoverageCount, 28);
assert.deepEqual([...governance.unmappedPackageIds], []);
assert.deepEqual([...governance.evidenceBlockers], []);
assert.deepEqual([...governance.governanceLocks], [
  "PRODUCTION_PROMOTION_NOT_AUTHORIZED",
  "RUNTIME_BLUEPRINT_MUTATION_NOT_AUTHORIZED",
  "SHADOW_REVIEW_REQUIRED_BEFORE_INTEGRATION",
]);

assert.deepEqual(
  governance.shadowSlotPlan.map((entry) => [entry.kind, entry.evidenceQuestionCount, entry.shadowQuestionCount]),
  [
    ["ARITHMETIC_CORE", 147, 11],
    ["DATA_INTERPRETATION", 40, 3],
    ["GEOMETRY_MENSURATION", 60, 5],
    ["TRIGONOMETRY", 37, 3],
    ["ALGEBRA", 41, 3],
  ],
);
assert.equal(governance.shadowSlotPlan.reduce((sum, entry) => sum + entry.evidenceQuestionCount, 0), 325);
assert.equal(governance.shadowSlotPlan.reduce((sum, entry) => sum + entry.shadowQuestionCount, 0), 25);

const exactQuestionsPer25 = Object.fromEntries(
  governance.shadowSlotPlan.map((entry) => [entry.kind, entry.exactQuestionsPer25]),
);
assert.ok(Math.abs(exactQuestionsPer25.ARITHMETIC_CORE - 147 / 13) < 1e-12);
assert.ok(Math.abs(exactQuestionsPer25.DATA_INTERPRETATION - 40 / 13) < 1e-12);
assert.ok(Math.abs(exactQuestionsPer25.GEOMETRY_MENSURATION - 60 / 13) < 1e-12);
assert.ok(Math.abs(exactQuestionsPer25.TRIGONOMETRY - 37 / 13) < 1e-12);
assert.ok(Math.abs(exactQuestionsPer25.ALGEBRA - 41 / 13) < 1e-12);

assert.deepEqual(
  governance.currentVsShadow.map((entry) => [entry.kind, entry.currentQuestionCount, entry.shadowQuestionCount, entry.delta]),
  [
    ["ARITHMETIC_CORE", 13, 11, -2],
    ["DATA_INTERPRETATION", 0, 3, 3],
    ["GEOMETRY_MENSURATION", 4, 5, 1],
    ["TRIGONOMETRY", 3, 3, 0],
    ["ALGEBRA", 2, 3, 1],
    ["PROBABILITY", 3, 0, -3],
  ],
);
assert.equal(governance.maxAbsoluteSlotDelta, 3);

// Candidate status must never silently authorize or mutate runtime weighting.
assert.equal(governance.productionPromotionAuthorized, false);
assert.equal(governance.runtimeMutationAllowed, false);
assert.equal(governance.runtimeProfileMutated, false);
assert.equal(cglProfile.blueprintEvidence, "PROVISIONAL_PYQ_WEIGHTING_REQUIRED");

// Unknown package ownership forces the shadow checkpoint back to HOLD instead
// of quietly dropping evidence from the 25-question apportionment.
const targetIndex = QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.findIndex(
  (entry) => entry.paperId === "SSC-CGL-2024-TIER-I-2024-09-13-S1" && entry.questionRef?.endsWith("Q51"),
);
assert.ok(targetIndex >= 0);
const contaminated = QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.map((entry, index) =>
  index === targetIndex ? Object.freeze({ ...entry, packageId: "UNMAPPED-P3-PROBE" }) : entry,
);
const held = buildQuantV4CglTier1ShadowFrequencyGovernance({
  currentSlotPlan: cglProfile.slotPlan,
  observations: contaminated,
});
assert.equal(held.status, "SHADOW_HOLD");
assert.ok(held.unmappedPackageIds.includes("UNMAPPED-P3-PROBE"));
assert.ok(held.evidenceBlockers.includes("UNMAPPED_WHOLE_SECTION_PACKAGE_PRESENT"));
assert.equal(held.runtimeMutationAllowed, false);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CGL_TIER1_SHADOW_FREQUENCY_GOVERNANCE_P3",
  authority: governance.authority,
  completeSections: governance.completeSectionCount,
  completeQuestions: governance.completeQuestionCount,
  shadowSlotPlan: governance.shadowSlotPlan,
  currentVsShadow: governance.currentVsShadow,
  maxAbsoluteSlotDelta: governance.maxAbsoluteSlotDelta,
  governanceLocks: governance.governanceLocks,
  productionPromotionAuthorized: governance.productionPromotionAuthorized,
  runtimeMutationAllowed: governance.runtimeMutationAllowed,
}));
