import assert from "node:assert/strict";

import { QUANT_V4_REAL_EXAM_MIN_SECTIONS_PER_PROFILE } from "./quant-v4-real-exam-simulation-p2";
import {
  QUANT_V4_REAL_EXAM_EMPIRICAL_FREQUENCY_DIAGNOSTIC_AUTHORITY,
  runQuantV4RealExamEmpiricalFrequencyDiagnosticP2,
} from "./quant-v4-real-exam-empirical-frequency-diagnostic-p2";

const diagnostic = await runQuantV4RealExamEmpiricalFrequencyDiagnosticP2({
  sectionsPerAudit: QUANT_V4_REAL_EXAM_MIN_SECTIONS_PER_PROFILE,
  seedPrefix: "QUANT-V4-REAL-EXAM-EMPIRICAL-FREQUENCY-DIAGNOSTIC-CI",
});

assert.equal(
  QUANT_V4_REAL_EXAM_EMPIRICAL_FREQUENCY_DIAGNOSTIC_AUTHORITY,
  "QUANT-V4-REAL-EXAM-EMPIRICAL-FREQUENCY-DIAGNOSTIC-P2",
);
assert.equal(diagnostic.examId, "SSC_CGL_TIER_I");
assert.equal(diagnostic.sectionsSimulated, 20);
assert.equal(diagnostic.simulatedRecordCount, 500);
assert.equal(diagnostic.simulatedRuntimeCount + diagnostic.simulatedCapabilityGapCount, 500);
assert.ok(diagnostic.simulatedRuntimeCount > 0);
assert.ok(diagnostic.simulatedCapabilityGapCount > 0);
assert.equal(diagnostic.simulatorReadiness, "EXAM_SIMULATION_NOT_READY");
assert.ok(diagnostic.simulatorBlockers.includes("PYQ_FREQUENCY_WEIGHTING_PENDING"));
assert.ok(diagnostic.simulatorBlockers.includes("CAPABILITY_GAPS_PRESENT"));

assert.equal(diagnostic.completeSectionCount, 3);
assert.equal(diagnostic.empiricalQuestionCount, 75);
assert.equal(diagnostic.empiricalPackageCoverageCount, 20);
assert.equal(diagnostic.empiricalDistinctSectionYearCount, 3);
assert.equal(diagnostic.nonWholeSectionCountableQuestionCount, 25);
assert.equal(diagnostic.undatedCountableQuestionCount, 10);
assert.equal(diagnostic.empiricalEvidenceStatus, "SECTION_EVIDENCE_ACCUMULATING");
assert.deepEqual([...diagnostic.empiricalBlockers], ["COMPLETE_SECTION_SAMPLE_BELOW_POLICY"]);

assert.equal(diagnostic.applicationStatus, "DIAGNOSTIC_ONLY_NOT_APPLIED");
assert.equal(diagnostic.empiricalWeightsApplied, false);
assert.equal(diagnostic.productionPromotionAuthorized, false);
assert.equal(diagnostic.canPromoteWholeSectionWeights, false);
assert.equal(diagnostic.provisionalBlueprintEvidence, "PROVISIONAL_PYQ_WEIGHTING_REQUIRED");
assert.deepEqual(diagnostic.provisionalSlotPlan, [
  { kind: "ARITHMETIC_CORE", count: 13 },
  { kind: "GEOMETRY_MENSURATION", count: 4 },
  { kind: "TRIGONOMETRY", count: 3 },
  { kind: "ALGEBRA", count: 2 },
  { kind: "PROBABILITY", count: 3 },
]);

assert.ok(Number.isFinite(diagnostic.totalVariationDistance));
assert.ok(Number.isFinite(diagnostic.l1ShareDistance));
assert.ok(diagnostic.totalVariationDistance >= 0 && diagnostic.totalVariationDistance <= 1);
assert.ok(diagnostic.l1ShareDistance >= 0 && diagnostic.l1ShareDistance <= 2);
assert.ok(Math.abs(diagnostic.totalVariationDistance * 2 - diagnostic.l1ShareDistance) < 1e-12);
assert.ok(diagnostic.packageComparison.length >= diagnostic.empiricalPackageCoverageCount);
assert.ok(
  diagnostic.packageComparison.every((entry, index, entries) =>
    index === 0 || entries[index - 1]!.absoluteShareDelta >= entry.absoluteShareDelta
  ),
  "Package divergence rows must be ordered from largest to smallest absolute share delta.",
);

const empiricalShareSum = diagnostic.packageComparison.reduce((sum, entry) => sum + entry.empiricalQuestionShare, 0);
const simulatedShareSum = diagnostic.packageComparison.reduce((sum, entry) => sum + entry.simulatedRecordShare, 0);
assert.ok(Math.abs(empiricalShareSum - 1) < 1e-12);
assert.ok(Math.abs(simulatedShareSum - 1) < 1e-12);

const capabilityGap = diagnostic.packageComparison.find((entry) => entry.packageId === "CAPABILITY_GAP");
assert.ok(capabilityGap, "Current CGL simulator must expose its known Algebra/Trigonometry assembly gaps explicitly.");
assert.equal(capabilityGap.empiricalQuestionCount, 0);
assert.equal(capabilityGap.empiricalQuestionShare, 0);
assert.equal(capabilityGap.simulatedRecordCount, diagnostic.simulatedCapabilityGapCount);
assert.ok(capabilityGap.simulatedRecordShare > 0);

const trig = diagnostic.packageComparison.find((entry) => entry.packageId === "TRG-001");
assert.ok(trig);
assert.equal(trig.empiricalQuestionCount, 8);
assert.equal(trig.empiricalMeanQuestionsPerSection, 8 / 3);
assert.equal(trig.empiricalSectionPresenceShare, 1);
assert.equal(trig.simulatedRecordCount, 0, "The diagnostic should reveal the current Trigonometry simulator-adapter gap rather than hide it.");
assert.ok(trig.absoluteShareDelta > 0);

const empiricalOnlyOrUnderrepresented = diagnostic.packageComparison.filter(
  (entry) => entry.empiricalQuestionShare > entry.simulatedRecordShare,
);
const simulatorOnlyOrOverrepresented = diagnostic.packageComparison.filter(
  (entry) => entry.simulatedRecordShare > entry.empiricalQuestionShare,
);
assert.ok(empiricalOnlyOrUnderrepresented.length > 0);
assert.ok(simulatorOnlyOrOverrepresented.length > 0);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_REAL_EXAM_EMPIRICAL_FREQUENCY_DIAGNOSTIC_P2",
  authority: diagnostic.authority,
  sectionsSimulated: diagnostic.sectionsSimulated,
  simulatedRecords: diagnostic.simulatedRecordCount,
  completeEmpiricalSections: diagnostic.completeSectionCount,
  empiricalQuestions: diagnostic.empiricalQuestionCount,
  empiricalPackageCoverage: diagnostic.empiricalPackageCoverageCount,
  totalVariationDistance: diagnostic.totalVariationDistance,
  largestDivergences: diagnostic.packageComparison.slice(0, 10),
  empiricalBlockers: diagnostic.empiricalBlockers,
  empiricalWeightsApplied: diagnostic.empiricalWeightsApplied,
  productionPromotionAuthorized: diagnostic.productionPromotionAuthorized,
}));
