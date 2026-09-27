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

const probeAlgebra = probe.records.filter((record) => record.slotKind === "ALGEBRA");
const probeTrig = probe.records.filter((record) => record.slotKind === "TRIGONOMETRY");
console.log("SHADOW_ADVANCED_MATH_PROBE", JSON.stringify({
  algebra: probeAlgebra,
  trigonometry: probeTrig,
}));
assert.equal(probeAlgebra.length, 3);
assert.equal(probeTrig.length, 3);
assert.ok(probeAlgebra.every((record) => record.sourceKind === "RUNTIME_GENERATED"), "All Algebra probe slots must use the merged runtime adapter.");
assert.ok(probeAlgebra.every((record) => record.packageId.toUpperCase().includes("ALG")), "Every Algebra probe package id must identify the Algebra family.");
assert.ok(probeAlgebra.every((record) => record.bankOnly === true), "Every Algebra probe record must preserve BANK_ONLY lifecycle state.");
assert.ok(probeAlgebra.every((record) => record.testEligible === false), "Every Algebra probe record must remain test-ineligible.");
assert.ok(probeAlgebra.every((record) => record.publiclyPublishable === false), "Every Algebra probe record must remain public-release locked.");
assert.ok(probeTrig.every((record) => record.sourceKind === "RUNTIME_GENERATED"), "All Trigonometry probe slots must use the merged runtime adapter.");
assert.ok(probeTrig.every((record) => record.packageId === "TRG-001" || record.packageId === "TRG-002"), "Every Trigonometry probe package must be TRG-001 or TRG-002.");
assert.ok(probeTrig.every((record) => record.testEligible === true), "Every Trigonometry probe record must preserve internal test eligibility.");
assert.ok(probeTrig.every((record) => record.publiclyPublishable === false), "Every Trigonometry probe record must remain public-release locked.");
assert.equal(probe.records.filter((record) => record.sourceKind === "CAPABILITY_GAP").length, 0);
assert.equal(probe.records.filter((record) => record.slotKind === "PROBABILITY").length, 0);

const audit = await runQuantV4CglTier1ShadowSimulationAudit({
  sections: 20,
  seedPrefix: "QUANT-V4-CGL-TIER1-SHADOW-SIMULATION-CI",
});
console.log("SHADOW_ADVANCED_MATH_AUDIT", JSON.stringify(audit));

// Advanced Mathematics adapters now close the former Algebra/Trigonometry
// generation gaps, and Probability selection must choose only entries that are
// valid for the requested exam profile+difficulty. Promotion still remains on
// hold because Algebra is deliberately BANK_ONLY and the empirical shadow run
// remains above the conservative normalized-stem repetition ceiling.
assert.equal(audit.status, "SHADOW_SIMULATION_HOLD");
assert.equal(audit.sectionsGenerated, 20);
assert.equal(audit.questionsExpected, 500);
assert.equal(audit.recordsGenerated, 500);
assert.equal(audit.runtimeGeneratedCount, 500);
assert.equal(audit.capabilityGapCount, 0);
assert.equal(audit.advancedMathCapabilityGapCount, 0);
assert.equal(audit.structuralCapabilityGapCount, 0);
assert.equal(audit.structuralCapabilityGapsPerSection, 0);
assert.equal(audit.baseSimulatorHistoricalAdvancedMathGapsPerSection, 5);
assert.equal(audit.currentBaselineCapabilityGapCount, 0);
assert.equal(audit.currentStructuralCapabilityGapsPerSection, 0);
assert.equal(audit.currentBaselineAlgebraBankOnlyCount, 40);

assert.equal(audit.algebraRecordCount, 60);
assert.equal(audit.algebraBankOnlyCount, 60);
assert.equal(audit.trigonometryRecordCount, 60);
assert.equal(audit.trigonometryTestEligibleCount, 60);
assert.equal(audit.optionMismatchCount, 0);
assert.equal(audit.emptyExplanationCount, 0);
assert.ok(audit.literalStemDuplicateRate >= 0 && audit.literalStemDuplicateRate <= 1);
assert.ok(
  audit.normalizedStructuralStemReuseRate <= 0.05,
  "The remediated empirical shadow run must keep normalized structural stem reuse at or below 5%.",
);
assert.deepEqual(audit.slotDistribution, {
  ALGEBRA: 60,
  ARITHMETIC_CORE: 220,
  DATA_INTERPRETATION: 60,
  GEOMETRY_MENSURATION: 100,
  TRIGONOMETRY: 60,
});
const algebraPackageRecords = Object.entries(audit.packageDistribution)
  .filter(([packageId]) => packageId.toUpperCase().includes("ALG"))
  .reduce((sum, [, count]) => sum + count, 0);
assert.equal(algebraPackageRecords, 60);
assert.equal((audit.packageDistribution["TRG-001"] ?? 0) + (audit.packageDistribution["TRG-002"] ?? 0), 60);

assert.equal(audit.blockers.includes("CURRENT_INTEGRATED_BASELINE_CAPABILITY_GAPS_PRESENT"), false);
assert.ok(audit.blockers.includes("ALGEBRA_BANK_ONLY_LIFECYCLE_LOCK"));
assert.equal(
  audit.blockers.includes("SHADOW_STRUCTURAL_STEM_REUSE_ABOVE_5_PERCENT"),
  false,
);
assert.equal(audit.blockers.includes("SHADOW_CAPABILITY_GAPS_PRESENT"), false);
assert.equal(audit.blockers.includes("SHADOW_ADVANCED_MATH_CAPABILITY_GAPS_PRESENT"), false);
assert.equal(audit.blockers.includes("ADVANCED_MATH_LIFECYCLE_CONTRACT_BREACH"), false);
assert.equal(audit.blockers.includes("SHADOW_OPTION_COUNT_PROFILE_DRIFT"), false);
assert.equal(audit.blockers.includes("SHADOW_EMPTY_EXPLANATIONS_PRESENT"), false);
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
  advancedMathCapabilityGapCount: audit.advancedMathCapabilityGapCount,
  currentBaselineCapabilityGapCount: audit.currentBaselineCapabilityGapCount,
  currentBaselineAlgebraBankOnlyCount: audit.currentBaselineAlgebraBankOnlyCount,
  structuralCapabilityGapsPerSection: audit.structuralCapabilityGapsPerSection,
  currentStructuralCapabilityGapsPerSection: audit.currentStructuralCapabilityGapsPerSection,
  baseSimulatorHistoricalAdvancedMathGapsPerSection: audit.baseSimulatorHistoricalAdvancedMathGapsPerSection,
  algebraRecordCount: audit.algebraRecordCount,
  algebraBankOnlyCount: audit.algebraBankOnlyCount,
  trigonometryRecordCount: audit.trigonometryRecordCount,
  trigonometryTestEligibleCount: audit.trigonometryTestEligibleCount,
  optionMismatchCount: audit.optionMismatchCount,
  emptyExplanationCount: audit.emptyExplanationCount,
  literalStemDuplicateRate: audit.literalStemDuplicateRate,
  normalizedStructuralStemReuseRate: audit.normalizedStructuralStemReuseRate,
  slotDistribution: audit.slotDistribution,
  packageDistribution: audit.packageDistribution,
  blockers: audit.blockers,
  productionPromotionAuthorized: audit.productionPromotionAuthorized,
  runtimeBlueprintMutationAuthorized: audit.runtimeBlueprintMutationAuthorized,
}));
