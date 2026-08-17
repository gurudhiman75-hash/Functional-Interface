import assert from "node:assert/strict";
import { SYL_BANKING_CROSS_EXAM_CENSUS_V1 } from "./banking-cross-exam-census-v1";
import {
  SYL_BANKING_CROSS_EXAM_CENSUS_V2,
  SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_QUESTIONS_V2,
  SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2,
} from "./banking-cross-exam-census-v2";

assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V2.supersedes, SYL_BANKING_CROSS_EXAM_CENSUS_V1.authorityId);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V2.examSeriesCount, 3);
assert.deepEqual(SYL_BANKING_CROSS_EXAM_CENSUS_V2.examSeriesObserved, [
  "IBPS_CLERK_PRELIMS",
  "SBI_CLERK_PRELIMS",
  "SBI_PO_PRELIMS",
]);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V2.structuralQuestionRecordsObserved, 27);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V2.structuralQuestionRecordsAreFrequencyDenominator, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V2.thirdSeriesIndependentSupportObserved, true);

assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2.reportedSyllogismCount, 4);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2.exactCountSourceAgreement, 3);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2.shiftCountSources.length, 3);
assert.equal(new Set(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2.shiftCountSources).size, 3);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2.recoveredQuestionCount, 3);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2.unresolvedQuestionCount, 1);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2.recoveredQuestionCoverageRatio, 0.75);
assert.deepEqual(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2.recoveredShellCounts, {
  ORDINARY_POSSIBILITY: 2,
  STANDARD_DEFINITE: 1,
});
assert.deepEqual(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2.recoveredPremiseOverlayCounts, {
  ONLY_A_FEW: 2,
  CORE: 1,
});
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2.onlyAFewObservedAcrossPrimaryShellCount, 2);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2.onlyAFewCrossesPrimaryShells, true);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2.recoveryStatus, "BOUNDED_3_OF_4_ONE_UNRESOLVED");
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2.unrecoveredQuestionShellImputed, false);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2.frequencyEstimationEligible, false);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2.exactShellWeightEstimationEligible, false);

assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_QUESTIONS_V2.length, 3);
assert.equal(new Set(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_QUESTIONS_V2.map((entry) => entry.evidenceId)).size, 3);
assert.equal(new Set(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_QUESTIONS_V2.map((entry) => entry.sourceUrl)).size, 3);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_QUESTIONS_V2.every((entry) => entry.examSeries === "SBI_PO_PRELIMS"), true);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_QUESTIONS_V2.every((entry) => entry.paperDate === "2023-11-06"), true);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_QUESTIONS_V2.every((entry) => entry.shift === "SHIFT_2"), true);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_QUESTIONS_V2.every((entry) => entry.provenance === "MEMORY_BASED_TRANSCRIPTION"), true);

const onlyAFewShells = new Set(
  SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_QUESTIONS_V2
    .filter((entry) => entry.premiseOverlay === "ONLY_A_FEW")
    .map((entry) => entry.primaryShell),
);
assert.deepEqual([...onlyAFewShells].sort(), ["ORDINARY_POSSIBILITY", "STANDARD_DEFINITE"]);

assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V2.twoAxisWeightModelObservedAcrossExamSeries, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V2.sbiPoOnlyAFewCrossesPrimaryShells, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V2.premiseOverlayMustRemainIndependentOfPrimaryShell, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V2.onlyAndOnlyAFewExclusiveShellWeightDeprecatedForFutureFreezeModel, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V2.existingPlannerFamilyStillUntouchedUntil_REDESIGN, "BANK_ONLY_AND_ONLY_A_FEW");
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V2.currentProvisionalMixChanged, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V2.crossExamModelSupportObserved, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V2.crossExamWeightGeneralizationPermitted, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V2.historicalFrequencyClaimPermitted, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V2.exactPercentageWeightingPermitted, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V2.productionPercentagesFrozen, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V2.connectedToProductionPlanner, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V2.registrationPermitted, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V2.activationPermitted, false);

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_CROSS_EXAM_CENSUS_V2",
  examSeriesCount: SYL_BANKING_CROSS_EXAM_CENSUS_V2.examSeriesCount,
  structuralQuestionRecordsObserved: SYL_BANKING_CROSS_EXAM_CENSUS_V2.structuralQuestionRecordsObserved,
  sbiPoReportedSyllogismCount: SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2.reportedSyllogismCount,
  sbiPoRecoveredQuestions: SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2.recoveredQuestionCount,
  sbiPoUnresolvedQuestions: SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2.unresolvedQuestionCount,
  sbiPoRecoveredShellCounts: SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2.recoveredShellCounts,
  sbiPoRecoveredPremiseOverlayCounts: SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2.recoveredPremiseOverlayCounts,
  onlyAFewCrossesPrimaryShells: SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2.onlyAFewCrossesPrimaryShells,
  unrecoveredQuestionShellImputed: SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2.unrecoveredQuestionShellImputed,
  currentProvisionalMixChanged: SYL_BANKING_CROSS_EXAM_CENSUS_V2.currentProvisionalMixChanged,
  crossExamWeightGeneralizationPermitted: SYL_BANKING_CROSS_EXAM_CENSUS_V2.crossExamWeightGeneralizationPermitted,
  productionPercentagesFrozen: SYL_BANKING_CROSS_EXAM_CENSUS_V2.productionPercentagesFrozen,
  connectedToProductionPlanner: SYL_BANKING_CROSS_EXAM_CENSUS_V2.connectedToProductionPlanner,
  activationPermitted: SYL_BANKING_CROSS_EXAM_CENSUS_V2.activationPermitted,
}, null, 2));
