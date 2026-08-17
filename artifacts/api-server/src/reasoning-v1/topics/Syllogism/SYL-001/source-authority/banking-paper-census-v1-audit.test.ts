import assert from "node:assert/strict";
import {
  SYL_BANKING_PAPER_CENSUS_QUESTIONS_V1,
  SYL_BANKING_PAPER_CENSUS_SHIFTS_V1,
  SYL_BANKING_PAPER_CENSUS_V1,
} from "./banking-paper-census-v1";

const census = SYL_BANKING_PAPER_CENSUS_V1;
assert.equal(census.authorityId, "SYL_001_BANKING_PAPER_CENSUS_V1");
assert.equal(census.examSeries, "IBPS_CLERK_PRELIMS");
assert.equal(census.paperDate, "2024-08-24");
assert.equal(census.shiftCount, 4);
assert.equal(SYL_BANKING_PAPER_CENSUS_SHIFTS_V1.length, 4);
assert.equal(SYL_BANKING_PAPER_CENSUS_QUESTIONS_V1.length, 9);
assert.equal(census.reportedSyllogismMinimum, 9);
assert.equal(census.reportedSyllogismMaximum, 10);
assert.equal(census.recoveredQuestionCount, 9);
assert.equal(census.minimumReportedCoverageRatio, 1);
assert.equal(census.maximumReportedCoverageRatio, 0.9);

const shift1 = SYL_BANKING_PAPER_CENSUS_SHIFTS_V1.find((entry) => entry.shift === "SHIFT_1");
const shift2 = SYL_BANKING_PAPER_CENSUS_SHIFTS_V1.find((entry) => entry.shift === "SHIFT_2");
const shift3 = SYL_BANKING_PAPER_CENSUS_SHIFTS_V1.find((entry) => entry.shift === "SHIFT_3");
const shift4 = SYL_BANKING_PAPER_CENSUS_SHIFTS_V1.find((entry) => entry.shift === "SHIFT_4");
assert.deepEqual(shift1 && [shift1.reportedSyllogismMin, shift1.reportedSyllogismMax, shift1.recoveredQuestionCount, shift1.completeness], [0, 0, 0, "COMPLETE_ZERO"]);
assert.deepEqual(shift2 && [shift2.reportedSyllogismMin, shift2.reportedSyllogismMax, shift2.recoveredQuestionCount, shift2.completeness], [3, 3, 3, "COMPLETE_EXACT"]);
assert.deepEqual(shift3 && [shift3.reportedSyllogismMin, shift3.reportedSyllogismMax, shift3.recoveredQuestionCount, shift3.completeness], [3, 3, 3, "COMPLETE_EXACT"]);
assert.deepEqual(shift4 && [shift4.reportedSyllogismMin, shift4.reportedSyllogismMax, shift4.recoveredQuestionCount, shift4.completeness], [3, 4, 3, "PARTIAL_UPPER_BOUND_ONE_UNRESOLVED"]);

assert.deepEqual(census.shellCounts, {
  ORDINARY_POSSIBILITY: 4,
  EITHER_OR: 2,
  CAN_NEVER: 1,
  CAN_NEVER_PLUS_ORDINARY_POSSIBILITY: 1,
  STANDARD_DEFINITE: 1,
});
assert.deepEqual(census.premiseOverlayCounts, { ONLY_A_FEW: 8, VERY_FEW: 1 });
assert.equal(census.questionsWithOnlyOrVeryFewPremise, 9);
assert.equal(census.questionsWithPossibilityConclusion, 5);
assert.equal(census.questionsWithCanNeverConclusion, 2);
assert.equal(census.questionsWithEitherOrSemanticAnswer, 2);
assert.equal(census.allRecoveredQuestionsUseThreeStatements, true);
assert.equal(census.allRecoveredQuestionsUseTwoConclusions, true);
assert.equal(census.keyDesignFinding, "ONLY_AND_ONLY_A_FEW_IS_A_PREMISE_OVERLAY_NOT_AN_EXCLUSIVE_SHELL_FAMILY");
assert.equal(census.twoAxisWeightModelRequiredBeforeFreeze, true);
assert.equal(census.currentProvisionalMixChanged, false);
assert.equal(census.exactPercentageWeightingPermitted, false);
assert.equal(census.systematicCrossExamCensusComplete, false);
assert.equal(census.productionPercentagesFrozen, false);
assert.equal(census.connectedToProductionPlanner, false);
assert.equal(census.activationPermitted, false);

assert.ok(SYL_BANKING_PAPER_CENSUS_QUESTIONS_V1.every((entry) => entry.sourceUrl.startsWith("https://www.oliveboard.in/question-answer/pyq-")));
assert.equal(new Set(SYL_BANKING_PAPER_CENSUS_QUESTIONS_V1.map((entry) => entry.evidenceId)).size, 9);

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_PAPER_CENSUS_V1",
  paperDate: census.paperDate,
  shifts: census.shiftCount,
  reportedRange: [census.reportedSyllogismMinimum, census.reportedSyllogismMaximum],
  recovered: census.recoveredQuestionCount,
  shellCounts: census.shellCounts,
  premiseOverlayCounts: census.premiseOverlayCounts,
  possibilityQuestions: census.questionsWithPossibilityConclusion,
  canNeverQuestions: census.questionsWithCanNeverConclusion,
  eitherOrQuestions: census.questionsWithEitherOrSemanticAnswer,
  twoAxisWeightModelRequiredBeforeFreeze: true,
  currentProvisionalMixChanged: false,
  productionPercentagesFrozen: false,
  activationPermitted: false,
}, null, 2));
