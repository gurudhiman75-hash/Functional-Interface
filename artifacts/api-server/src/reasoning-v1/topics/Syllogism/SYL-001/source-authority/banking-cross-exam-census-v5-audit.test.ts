import assert from "node:assert/strict";
import { SYL_BANKING_CROSS_EXAM_CENSUS_V4 } from "./banking-cross-exam-census-v4";
import {
  SYL_BANKING_CROSS_EXAM_CENSUS_V5,
  SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_QUESTIONS_V5,
  SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_V5,
} from "./banking-cross-exam-census-v5";

assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V5.supersedes, SYL_BANKING_CROSS_EXAM_CENSUS_V4.authorityId);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V5.examSeriesCount, 5);
assert.deepEqual(SYL_BANKING_CROSS_EXAM_CENSUS_V5.examSeriesObserved, SYL_BANKING_CROSS_EXAM_CENSUS_V4.examSeriesObserved);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V5.structuralQuestionRecordsObserved, 37);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V5.structuralQuestionRecordsAreFrequencyDenominator, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V5.archiveCompleteOfficerLevelShiftCount, 2);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V5.independentlyCountCorroboratedCompleteOfficerLevelShiftCount, 2);

assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_V5.reportedSyllogismCount, 4);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_V5.countSources.length, 2);
assert.equal(new Set(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_V5.countSources).size, 2);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_V5.exactCountIndependentlyCorroborated, true);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_V5.recoveredQuestionCount, 4);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_V5.unresolvedQuestionCount, 0);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_V5.recoveredQuestionCoverageRatioAgainstReportedCount, 1);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_V5.recoveryStatus, "COMPLETE_EXACT_FOUR_OF_FOUR_COUNT_CORROBORATED");
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_V5.allRecoveredQuestionsTwoConclusion, true);
assert.deepEqual(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_V5.recoveredSemanticFeatureCounts, {
  STANDARD_DEFINITE: 4,
  ORDINARY_POSSIBILITY: 1,
});
assert.deepEqual(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_V5.recoveredPremiseOverlayCounts, {
  CORE: 2,
  ONLY_A_FEW: 2,
});
assert.deepEqual(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_V5.recoveredConclusionSetRelationshipCounts, {
  INDEPENDENT: 3,
  COMPLEMENTARY_EITHER_OR: 1,
});
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_V5.eitherOrQuestionObserved, true);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_V5.eitherOrQuestionUsesDefiniteConclusions, true);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_V5.questionStructureOrSemanticsImputed, false);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_V5.crossExamProductionWeightEstimationEligible, false);

assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_QUESTIONS_V5.length, 4);
assert.equal(new Set(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_QUESTIONS_V5.map((entry) => entry.evidenceId)).size, 4);
assert.equal(new Set(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_QUESTIONS_V5.map((entry) => entry.sourceUrl)).size, 4);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_QUESTIONS_V5.every((entry) => entry.examSeries === "IBPS_RRB_PO_PRELIMS"), true);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_QUESTIONS_V5.every((entry) => entry.paperDate === "2024-08-04"), true);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_QUESTIONS_V5.every((entry) => entry.shift === "SHIFT_4"), true);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_QUESTIONS_V5.every((entry) => entry.conclusionStructure === "TWO_CONCLUSION"), true);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_QUESTIONS_V5.every((entry) => entry.provenance === "INDEPENDENT_PYP_ARCHIVE"), true);

const eitherOrQuestions = SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_QUESTIONS_V5.filter((entry) => entry.conclusionSetRelationship === "COMPLEMENTARY_EITHER_OR");
assert.equal(eitherOrQuestions.length, 1);
assert.deepEqual(eitherOrQuestions[0].conclusionSemanticFeatures, ["STANDARD_DEFINITE"]);
assert.equal(eitherOrQuestions[0].premiseOverlay, "CORE");

assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V5.factorizedWeightModelRequired, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V5.minimumIndependentDimensions, 4);
assert.deepEqual(SYL_BANKING_CROSS_EXAM_CENSUS_V5.factorDimensions, [
  "CONCLUSION_STRUCTURE",
  "CONCLUSION_SEMANTIC_FEATURES",
  "PREMISE_VOCABULARY_OVERLAY",
  "CONCLUSION_SET_RELATIONSHIP",
]);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V5.eitherOrRequiresIndependentConclusionSetRelationshipDimension, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V5.eitherOrMustNotBeFoldedIntoConclusionSemanticFeature, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V5.conclusionSemanticFeaturesRemainMultiLabel, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V5.premiseOverlayMustRemainIndependentOfStructureSemanticsAndConclusionSetRelationship, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V5.legacyEitherOrFamilyMapsToConclusionSetRelationshipDimension, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V5.legacyProvisionalFamiliesMixIndependentDimensions, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V5.currentProvisionalMixChanged, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V5.redesignImplementationPermittedAtThisCheckpoint, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V5.crossExamWeightGeneralizationPermitted, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V5.historicalFrequencyClaimPermittedAcrossSeries, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V5.exactPercentageWeightingPermitted, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V5.productionPercentagesFrozen, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V5.connectedToProductionPlanner, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V5.registrationPermitted, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V5.activationPermitted, false);

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_CROSS_EXAM_CENSUS_V5",
  examSeriesCount: SYL_BANKING_CROSS_EXAM_CENSUS_V5.examSeriesCount,
  structuralQuestionRecordsObserved: SYL_BANKING_CROSS_EXAM_CENSUS_V5.structuralQuestionRecordsObserved,
  archiveCompleteOfficerLevelShiftCount: SYL_BANKING_CROSS_EXAM_CENSUS_V5.archiveCompleteOfficerLevelShiftCount,
  independentlyCountCorroboratedCompleteOfficerLevelShiftCount: SYL_BANKING_CROSS_EXAM_CENSUS_V5.independentlyCountCorroboratedCompleteOfficerLevelShiftCount,
  rrbShift4ReportedSyllogismCount: SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_V5.reportedSyllogismCount,
  rrbShift4RecoveredQuestions: SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_V5.recoveredQuestionCount,
  rrbShift4CountIndependentlyCorroborated: SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_V5.exactCountIndependentlyCorroborated,
  rrbShift4SemanticFeatureCounts: SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_V5.recoveredSemanticFeatureCounts,
  rrbShift4PremiseOverlayCounts: SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_V5.recoveredPremiseOverlayCounts,
  rrbShift4ConclusionSetRelationshipCounts: SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_V5.recoveredConclusionSetRelationshipCounts,
  minimumIndependentDimensions: SYL_BANKING_CROSS_EXAM_CENSUS_V5.minimumIndependentDimensions,
  currentProvisionalMixChanged: SYL_BANKING_CROSS_EXAM_CENSUS_V5.currentProvisionalMixChanged,
  productionPercentagesFrozen: SYL_BANKING_CROSS_EXAM_CENSUS_V5.productionPercentagesFrozen,
  connectedToProductionPlanner: SYL_BANKING_CROSS_EXAM_CENSUS_V5.connectedToProductionPlanner,
  activationPermitted: SYL_BANKING_CROSS_EXAM_CENSUS_V5.activationPermitted,
}, null, 2));
