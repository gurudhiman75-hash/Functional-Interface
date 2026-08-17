import assert from "node:assert/strict";
import { SYL_BANKING_PAPER_CENSUS_V2 } from "./banking-paper-census-v2";
import {
  SYL_BANKING_CROSS_EXAM_CENSUS_V1,
  SYL_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_QUESTIONS_V1,
  SYL_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_V1,
} from "./banking-cross-exam-census-v1";

assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V1.ibpsClerkAuthority, SYL_BANKING_PAPER_CENSUS_V2.authorityId);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V1.examSeriesCount, 2);
assert.deepEqual(SYL_BANKING_CROSS_EXAM_CENSUS_V1.examSeriesObserved, ["IBPS_CLERK_PRELIMS", "SBI_CLERK_PRELIMS"]);

assert.deepEqual(SYL_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_V1.shiftReportedSyllogismCounts, {
  SHIFT_1: 4,
  SHIFT_2: 4,
  SHIFT_3: 4,
  SHIFT_4: 3,
});
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_V1.reportedSyllogismTotal, 15);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_V1.recoveredQuestionCount, 3);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_V1.recoveredQuestionCoverageRatio, 0.2);
assert.deepEqual(SYL_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_V1.recoveredShellCounts, {
  ORDINARY_POSSIBILITY: 2,
  CAN_NEVER: 1,
});
assert.deepEqual(SYL_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_V1.recoveredPremiseOverlayCounts, { ONLY_A_FEW: 3 });
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_V1.frequencyEstimationEligible, false);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_V1.exactShellWeightEstimationEligible, false);
assert.ok(SYL_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_V1.sourceDateLabelCaveat.includes("JANUARY"));
assert.ok(SYL_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_V1.sourceDateLabelCaveat.includes("FEBRUARY"));

assert.equal(SYL_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_QUESTIONS_V1.length, 3);
assert.equal(new Set(SYL_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_QUESTIONS_V1.map((entry) => entry.primaryShell)).size, 2);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_QUESTIONS_V1.every((entry) => entry.premiseOverlay === "ONLY_A_FEW"), true);

assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V1.twoAxisWeightModelObservedAcrossExamSeries, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V1.premiseOverlayMustRemainIndependentOfPrimaryShell, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V1.onlyAndOnlyAFewExclusiveShellWeightDeprecatedForFutureFreezeModel, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V1.existingPlannerFamilyStillUntouchedUntil_REDESIGN, "BANK_ONLY_AND_ONLY_A_FEW");
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V1.currentProvisionalMixChanged, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V1.crossExamModelSupportObserved, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V1.crossExamWeightGeneralizationPermitted, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V1.historicalFrequencyClaimPermitted, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V1.exactPercentageWeightingPermitted, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V1.productionPercentagesFrozen, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V1.connectedToProductionPlanner, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V1.activationPermitted, false);

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_CROSS_EXAM_CENSUS_V1",
  examSeriesCount: SYL_BANKING_CROSS_EXAM_CENSUS_V1.examSeriesCount,
  sbiReportedSyllogismTotal: SYL_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_V1.reportedSyllogismTotal,
  sbiRecoveredQuestions: SYL_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_V1.recoveredQuestionCount,
  sbiRecoveredShellCounts: SYL_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_V1.recoveredShellCounts,
  sbiRecoveredPremiseOverlayCounts: SYL_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_V1.recoveredPremiseOverlayCounts,
  twoAxisWeightModelObservedAcrossExamSeries: SYL_BANKING_CROSS_EXAM_CENSUS_V1.twoAxisWeightModelObservedAcrossExamSeries,
  currentProvisionalMixChanged: SYL_BANKING_CROSS_EXAM_CENSUS_V1.currentProvisionalMixChanged,
  crossExamWeightGeneralizationPermitted: SYL_BANKING_CROSS_EXAM_CENSUS_V1.crossExamWeightGeneralizationPermitted,
  historicalFrequencyClaimPermitted: SYL_BANKING_CROSS_EXAM_CENSUS_V1.historicalFrequencyClaimPermitted,
  productionPercentagesFrozen: SYL_BANKING_CROSS_EXAM_CENSUS_V1.productionPercentagesFrozen,
  activationPermitted: SYL_BANKING_CROSS_EXAM_CENSUS_V1.activationPermitted,
}, null, 2));
