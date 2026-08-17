import assert from "node:assert/strict";
import { SYL_BANKING_PAPER_CENSUS_V1 } from "./banking-paper-census-v1";
import {
  SYL_BANKING_PAPER_CENSUS_DAYS_V2,
  SYL_BANKING_PAPER_CENSUS_V2,
} from "./banking-paper-census-v2";

assert.equal(SYL_BANKING_PAPER_CENSUS_V2.supersedes, SYL_BANKING_PAPER_CENSUS_V1.authorityId);
assert.deepEqual(SYL_BANKING_PAPER_CENSUS_V2.sampleDates, ["2024-08-24", "2024-08-25", "2024-08-31"]);
assert.equal(SYL_BANKING_PAPER_CENSUS_V2.sampledPaperDays, 3);
assert.equal(SYL_BANKING_PAPER_CENSUS_V2.recoveredQuestionCount, 21);
assert.deepEqual(SYL_BANKING_PAPER_CENSUS_V2.recoveredShellCounts, {
  ORDINARY_POSSIBILITY: 14,
  EITHER_OR: 2,
  CAN_NEVER: 2,
  CAN_NEVER_PLUS_ORDINARY_POSSIBILITY: 1,
  STANDARD_DEFINITE: 2,
});
assert.deepEqual(SYL_BANKING_PAPER_CENSUS_V2.recoveredPremiseOverlayCounts, {
  ONLY_A_FEW: 19,
  VERY_FEW: 1,
  CORE: 1,
});

const day24 = SYL_BANKING_PAPER_CENSUS_DAYS_V2.find((day) => day.paperDate === "2024-08-24");
const day25 = SYL_BANKING_PAPER_CENSUS_DAYS_V2.find((day) => day.paperDate === "2024-08-25");
const day31 = SYL_BANKING_PAPER_CENSUS_DAYS_V2.find((day) => day.paperDate === "2024-08-31");
assert.ok(day24 && day25 && day31);
assert.equal(day24.recoveredQuestionCount, SYL_BANKING_PAPER_CENSUS_V1.recoveredQuestionCount);
assert.equal(day25.shiftAttributionConflict, true);
assert.equal(day25.reliability, "STRUCTURAL_ONLY_SHIFT_ATTRIBUTION_CONFLICT");
assert.equal(day25.frequencyEstimationEligible, false);
assert.ok(day25.recoveredQuestionCount > day25.reportedSyllogismMaximum, "25-Aug conflict must remain explicit rather than normalized away");
assert.equal(day31.shiftAttributionConflict, false);
assert.equal(day31.reportedSyllogismMinimum, 11);
assert.equal(day31.reportedSyllogismMaximum, 11);
assert.equal(day31.recoveredQuestionCount, 5);
assert.ok(day31.recoveredQuestionCount < day31.reportedSyllogismMinimum, "31-Aug must remain partial recovery");

for (const day of SYL_BANKING_PAPER_CENSUS_DAYS_V2) {
  assert.equal(day.frequencyEstimationEligible, false);
  assert.ok(day.analysisUrls.length >= 3);
}

assert.equal(SYL_BANKING_PAPER_CENSUS_V2.twoAxisWeightModelSupported, true);
assert.deepEqual(SYL_BANKING_PAPER_CENSUS_V2.twoAxisDimensions, [
  "PRIMARY_CONCLUSION_SHELL",
  "PREMISE_VOCABULARY_OVERLAY",
]);
assert.equal(SYL_BANKING_PAPER_CENSUS_V2.premiseOverlayMustNotBeAllocatedAsExclusiveShellWeight, true);
assert.equal("ONLY_A_FEW" in SYL_BANKING_PAPER_CENSUS_V2.recoveredShellCounts, false);
assert.equal("VERY_FEW" in SYL_BANKING_PAPER_CENSUS_V2.recoveredShellCounts, false);
assert.equal(SYL_BANKING_PAPER_CENSUS_V2.currentProvisionalMixChanged, false);
assert.equal(SYL_BANKING_PAPER_CENSUS_V2.shiftNormalizedHistoricalFrequencyClaimPermitted, false);
assert.equal(SYL_BANKING_PAPER_CENSUS_V2.historicalFrequencyClaimPermitted, false);
assert.equal(SYL_BANKING_PAPER_CENSUS_V2.productionPercentagesFrozen, false);
assert.equal(SYL_BANKING_PAPER_CENSUS_V2.crossExamGeneralizationPermitted, false);
assert.equal(SYL_BANKING_PAPER_CENSUS_V2.connectedToProductionPlanner, false);
assert.equal(SYL_BANKING_PAPER_CENSUS_V2.activationPermitted, false);

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_PAPER_CENSUS_V2",
  sampledPaperDays: SYL_BANKING_PAPER_CENSUS_V2.sampledPaperDays,
  recoveredQuestions: SYL_BANKING_PAPER_CENSUS_V2.recoveredQuestionCount,
  recoveredShellCounts: SYL_BANKING_PAPER_CENSUS_V2.recoveredShellCounts,
  recoveredPremiseOverlayCounts: SYL_BANKING_PAPER_CENSUS_V2.recoveredPremiseOverlayCounts,
  conflictedPaperDays: SYL_BANKING_PAPER_CENSUS_V2.conflictedPaperDays,
  twoAxisWeightModelSupported: SYL_BANKING_PAPER_CENSUS_V2.twoAxisWeightModelSupported,
  historicalFrequencyClaimPermitted: SYL_BANKING_PAPER_CENSUS_V2.historicalFrequencyClaimPermitted,
  currentProvisionalMixChanged: SYL_BANKING_PAPER_CENSUS_V2.currentProvisionalMixChanged,
  productionPercentagesFrozen: SYL_BANKING_PAPER_CENSUS_V2.productionPercentagesFrozen,
  activationPermitted: SYL_BANKING_PAPER_CENSUS_V2.activationPermitted,
}, null, 2));
