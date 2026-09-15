import assert from "node:assert/strict";

import { QUANT_V4_REAL_EXAM_PROFILES } from "./quant-v4-real-exam-simulation-p2";
import {
  QUANT_V4_CGL_TIER1_SHADOW_SIMULATION_AUTHORITY,
  QUANT_V4_CGL_TIER1_SHADOW_SIMULATION_SECTIONS,
  generateQuantV4CglTier1ShadowSection,
  runQuantV4CglTier1ShadowSimulationAudit,
} from "./quant-v4-cgl-tier1-shadow-simulation-p3";

assert.equal(
  QUANT_V4_CGL_TIER1_SHADOW_SIMULATION_AUTHORITY,
  "QUANT-V4-CGL-TIER1-SHADOW-SIMULATION-P3",
);
assert.equal(QUANT_V4_CGL_TIER1_SHADOW_SIMULATION_SECTIONS, 20);

const current = QUANT_V4_REAL_EXAM_PROFILES.find((profile) => profile.id === "SSC_CGL_TIER_I");
assert.ok(current);
assert.equal(current.blueprintEvidence, "PROVISIONAL_PYQ_WEIGHTING_REQUIRED");
assert.deepEqual(current.slotPlan, [
  { kind: "ARITHMETIC_CORE", count: 13 },
  { kind: "GEOMETRY_MENSURATION", count: 4 },
  { kind: "TRIGONOMETRY", count: 3 },
  { kind: "ALGEBRA", count: 2 },
  { kind: "PROBABILITY", count: 3 },
]);

const probe = await generateQuantV4CglTier1ShadowSection({
  sectionIndex: 1,
  seed: "QUANT-V4-CGL-TIER1-SHADOW-PROBE",
});
assert.equal(probe.records.length, 25);
assert.deepEqual(
  Object.fromEntries([
    "ARITHMETIC_CORE",
    "DATA_INTERPRETATION",
    "GEOMETRY_MENSURATION",
    "TRIGONOMETRY",
    "ALGEBRA",
  ].map((kind) => [kind, probe.records.filter((record) => record.slotKind === kind).length])),
  {
    ARITHMETIC_CORE: 11,
    DATA_INTERPRETATION: 3,
    GEOMETRY_MENSURATION: 5,
    TRIGONOMETRY: 3,
    ALGEBRA: 3,
  },
);
assert.equal(probe.records.filter((record) => record.slotKind === "TRIGONOMETRY" && record.sourceKind === "CAPABILITY_GAP").length, 3);
assert.equal(probe.records.filter((record) => record.slotKind === "ALGEBRA" && record.sourceKind === "CAPABILITY_GAP").length, 3);
assert.equal(probe.records.filter((record) => record.slotKind === "PROBABILITY").length, 0);

const audit = await runQuantV4CglTier1ShadowSimulationAudit({
  sections: 20,
  seedPrefix: "QUANT-V4-CGL-TIER1-SHADOW-SIMULATION-CI",
});

assert.equal(audit.status, "SHADOW_SIMULATION_HOLD");
assert.equal(audit.sectionsGenerated, 20);
assert.equal(audit.questionsExpected, 500);
assert.equal(audit.recordsGenerated, 500);
assert.equal(audit.structuralCapabilityGapsPerSection, 6);
assert.equal(audit.currentStructuralCapabilityGapsPerSection, 5);
assert.equal(audit.structuralCapabilityGapCount, 120);
assert.ok(audit.capabilityGapCount >= 120);
assert.ok(audit.runtimeGeneratedCount <= 380);
assert.equal(audit.runtimeGeneratedCount + audit.capabilityGapCount, 500);
assert.deepEqual(audit.slotDistribution, {
  ALGEBRA: 60,
  ARITHMETIC_CORE: 220,
  DATA_INTERPRETATION: 60,
  GEOMETRY_MENSURATION: 100,
  TRIGONOMETRY: 60,
});
assert.ok(audit.blockers.includes("SHADOW_CAPABILITY_GAPS_PRESENT"));
assert.ok(audit.blockers.includes("SHADOW_STRUCTURAL_GAPS_EXCEED_CURRENT_BLUEPRINT"));
assert.equal(audit.productionPromotionAuthorized, false);
assert.equal(audit.runtimeBlueprintMutationAuthorized, false);

// The shadow audit must not modify the currently active simulator profile.
assert.equal(current.blueprintEvidence, "PROVISIONAL_PYQ_WEIGHTING_REQUIRED");
assert.deepEqual(current.slotPlan, [
  { kind: "ARITHMETIC_CORE", count: 13 },
  { kind: "GEOMETRY_MENSURATION", count: 4 },
  { kind: "TRIGONOMETRY", count: 3 },
  { kind: "ALGEBRA", count: 2 },
  { kind: "PROBABILITY", count: 3 },
]);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CGL_TIER1_SHADOW_SIMULATION_P3",
  authority: audit.authority,
  sectionsGenerated: audit.sectionsGenerated,
  runtimeGeneratedCount: audit.runtimeGeneratedCount,
  capabilityGapCount: audit.capabilityGapCount,
  currentBaselineCapabilityGapCount: audit.currentBaselineCapabilityGapCount,
  structuralCapabilityGapsPerSection: audit.structuralCapabilityGapsPerSection,
  currentStructuralCapabilityGapsPerSection: audit.currentStructuralCapabilityGapsPerSection,
  optionMismatchCount: audit.optionMismatchCount,
  emptyExplanationCount: audit.emptyExplanationCount,
  exactStemDuplicateRate: audit.exactStemDuplicateRate,
  slotDistribution: audit.slotDistribution,
  packageDistribution: audit.packageDistribution,
  blockers: audit.blockers,
  productionPromotionAuthorized: audit.productionPromotionAuthorized,
  runtimeBlueprintMutationAuthorized: audit.runtimeBlueprintMutationAuthorized,
}));
