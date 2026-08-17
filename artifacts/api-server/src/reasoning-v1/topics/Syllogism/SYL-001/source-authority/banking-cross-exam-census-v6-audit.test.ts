import assert from "node:assert/strict";
import { SYL_BANKING_CROSS_EXAM_CENSUS_V5 } from "./banking-cross-exam-census-v5";
import {
  SYL_BANKING_CROSS_EXAM_CENSUS_V6,
  SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_QUESTIONS_V6,
  SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_V6,
} from "./banking-cross-exam-census-v6";

assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V6.supersedes, SYL_BANKING_CROSS_EXAM_CENSUS_V5.authorityId);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V6.examSeriesCount, 5);
assert.deepEqual(SYL_BANKING_CROSS_EXAM_CENSUS_V6.examSeriesObserved, SYL_BANKING_CROSS_EXAM_CENSUS_V5.examSeriesObserved);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V6.structuralQuestionRecordsObserved, 40);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V6.structuralQuestionRecordsAreFrequencyDenominator, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V6.completeOfficerLevelShiftCount, 2);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V6.independentlyCountCorroboratedCompleteOfficerLevelShiftCount, 2);
assert.deepEqual(SYL_BANKING_CROSS_EXAM_CENSUS_V6.sbiPoDistinctPaperDatesObserved, ["2023-11-01", "2023-11-06"]);

assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_V6.reportedSyllogismMinimum, 3);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_V6.reportedSyllogismMaximum, 6);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_V6.countSources.length, 4);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_V6.shiftCountConflict, true);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_V6.exactShiftFrequencyEligible, false);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_V6.recoveredQuestionCount, 3);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_V6.recoveredCoversReportedMinimum, true);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_V6.unresolvedQuestionCountAtUpperBound, 3);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_V6.unrecoveredQuestionStructureOrSemanticsImputed, false);
assert.deepEqual(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_V6.recoveredSemanticFeatureCounts, {
  STANDARD_DEFINITE: 2,
  ORDINARY_POSSIBILITY: 1,
  CAN_NEVER: 2,
});
assert.deepEqual(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_V6.recoveredPremiseOverlayFeatureCounts, {
  ONLY: 1,
  ONLY_A_FEW: 3,
});
assert.deepEqual(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_V6.recoveredConclusionSetRelationshipCounts, { INDEPENDENT: 3 });
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_V6.premiseOverlayFeatureCountCanExceedRecoveredQuestionCount, true);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_V6.questionWithMultiplePremiseOverlayFeaturesObserved, true);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_V6.premiseVocabularyOverlayFeaturesAreMultiLabelWithinDimension, true);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_V6.recoveryStatus, "LOWER_BOUND_RECOVERED_UPPER_BOUND_THREE_UNRESOLVED_COUNT_CONFLICT");
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_V6.frequencyEstimationEligible, false);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_V6.exactWeightEstimationEligible, false);

assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_QUESTIONS_V6.length, 3);
assert.equal(new Set(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_QUESTIONS_V6.map((entry) => entry.evidenceId)).size, 3);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_QUESTIONS_V6.every((entry) => entry.examSeries === "SBI_PO_PRELIMS"), true);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_QUESTIONS_V6.every((entry) => entry.paperDate === "2023-11-01"), true);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_QUESTIONS_V6.every((entry) => entry.shift === "SHIFT_1"), true);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_QUESTIONS_V6.every((entry) => entry.conclusionStructure === "TWO_CONCLUSION"), true);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_QUESTIONS_V6.every((entry) => entry.conclusionSetRelationship === "INDEPENDENT"), true);
assert.equal(SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_QUESTIONS_V6.every((entry) => entry.provenance === "MEMORY_BASED_FULL_PAPER_TRANSCRIPTION_MIRROR"), true);

const multiOverlayQuestions = SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_QUESTIONS_V6.filter((entry) => entry.premiseOverlayFeatures.length > 1);
assert.equal(multiOverlayQuestions.length, 1);
assert.deepEqual(multiOverlayQuestions[0].premiseOverlayFeatures, ["ONLY", "ONLY_A_FEW"]);
assert.equal(multiOverlayQuestions[0].evidenceId, "CROSS-SBI-PO-2023-11-01-S1-HAT-HOUSE");

assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V6.factorizedWeightModelRequired, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V6.minimumIndependentDimensions, 4);
assert.deepEqual(SYL_BANKING_CROSS_EXAM_CENSUS_V6.factorDimensions, [
  "CONCLUSION_STRUCTURE",
  "CONCLUSION_SEMANTIC_FEATURES",
  "PREMISE_VOCABULARY_OVERLAY",
  "CONCLUSION_SET_RELATIONSHIP",
]);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V6.conclusionSemanticFeaturesRemainMultiLabel, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V6.premiseVocabularyOverlayFeaturesRemainMultiLabel, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V6.premiseOverlayMultiLabelDoesNotCreateAdditionalDimension, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V6.conclusionSetRelationshipRemainsIndependentDimension, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V6.legacyOnlyAndOnlyAFewFamilyMapsToPremiseVocabularyOverlayDimension, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V6.legacyProvisionalFamiliesMixIndependentDimensions, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V6.currentProvisionalMixChanged, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V6.redesignImplementationPermittedAtThisCheckpoint, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V6.crossExamWeightGeneralizationPermitted, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V6.historicalFrequencyClaimPermittedAcrossSeries, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V6.exactPercentageWeightingPermitted, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V6.productionPercentagesFrozen, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V6.connectedToProductionPlanner, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V6.registrationPermitted, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V6.activationPermitted, false);

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_CROSS_EXAM_CENSUS_V6",
  examSeriesCount: SYL_BANKING_CROSS_EXAM_CENSUS_V6.examSeriesCount,
  structuralQuestionRecordsObserved: SYL_BANKING_CROSS_EXAM_CENSUS_V6.structuralQuestionRecordsObserved,
  sbiPoReportedRange: [SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_V6.reportedSyllogismMinimum, SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_V6.reportedSyllogismMaximum],
  sbiPoRecoveredQuestions: SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_V6.recoveredQuestionCount,
  sbiPoUnresolvedAtUpperBound: SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_V6.unresolvedQuestionCountAtUpperBound,
  sbiPoRecoveredSemanticFeatureCounts: SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_V6.recoveredSemanticFeatureCounts,
  sbiPoRecoveredPremiseOverlayFeatureCounts: SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_V6.recoveredPremiseOverlayFeatureCounts,
  premiseVocabularyOverlayFeaturesRemainMultiLabel: SYL_BANKING_CROSS_EXAM_CENSUS_V6.premiseVocabularyOverlayFeaturesRemainMultiLabel,
  minimumIndependentDimensions: SYL_BANKING_CROSS_EXAM_CENSUS_V6.minimumIndependentDimensions,
  currentProvisionalMixChanged: SYL_BANKING_CROSS_EXAM_CENSUS_V6.currentProvisionalMixChanged,
  productionPercentagesFrozen: SYL_BANKING_CROSS_EXAM_CENSUS_V6.productionPercentagesFrozen,
  connectedToProductionPlanner: SYL_BANKING_CROSS_EXAM_CENSUS_V6.connectedToProductionPlanner,
  activationPermitted: SYL_BANKING_CROSS_EXAM_CENSUS_V6.activationPermitted,
}, null, 2));
