import assert from "node:assert/strict";
import { SYL_BANKING_CROSS_EXAM_CENSUS_V3 } from "./banking-cross-exam-census-v3";
import {
  SYL_BANKING_CROSS_EXAM_CENSUS_V4,
  SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_QUESTIONS_V4,
  SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_V4,
} from "./banking-cross-exam-census-v4";

assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V4.supersedes, SYL_BANKING_CROSS_EXAM_CENSUS_V3.authorityId);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V4.examSeriesCount, 5);
assert.deepEqual(SYL_BANKING_CROSS_EXAM_CENSUS_V4.examSeriesObserved, [
  "IBPS_CLERK_PRELIMS",
  "SBI_CLERK_PRELIMS",
  "SBI_PO_PRELIMS",
  "IBPS_PO_PRELIMS",
  "IBPS_RRB_PO_PRELIMS",
]);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V4.structuralQuestionRecordsObserved, 33);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V4.structuralQuestionRecordsAreFrequencyDenominator, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V4.completeOfficerLevelShiftCount, 1);

assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_V4.reportedSyllogismCount, 3);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_V4.exactCountSourceAgreement, 3);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_V4.countSources.length, 3);
assert.equal(new Set(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_V4.countSources).size, 3);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_V4.recoveredQuestionCount, 3);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_V4.unresolvedQuestionCount, 0);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_V4.recoveredQuestionCoverageRatio, 1);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_V4.recoveryStatus, "COMPLETE_EXACT_THREE_OF_THREE");
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_V4.allRecoveredQuestionsTwoConclusion, true);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_V4.allRecoveredQuestionsOnlyAFewOverlay, true);
assert.deepEqual(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_V4.recoveredSemanticFeatureCounts, {
  STANDARD_DEFINITE: 3,
  ORDINARY_POSSIBILITY: 1,
  CAN_NEVER: 1,
});
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_V4.semanticFeatureKindsObserved, 3);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_V4.ordinaryPossibilityObserved, true);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_V4.canNeverObserved, true);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_V4.standardDefiniteObserved, true);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_V4.questionStructureOrSemanticsImputed, false);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_V4.frequencyEstimationEligibleForThisShiftOnly, true);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_V4.crossExamProductionWeightEstimationEligible, false);

assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_QUESTIONS_V4.length, 3);
assert.equal(new Set(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_QUESTIONS_V4.map((entry) => entry.evidenceId)).size, 3);
assert.equal(new Set(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_QUESTIONS_V4.map((entry) => entry.sourceUrl)).size, 3);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_QUESTIONS_V4.every((entry) => entry.examSeries === "IBPS_RRB_PO_PRELIMS"), true);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_QUESTIONS_V4.every((entry) => entry.paperDate === "2024-08-03"), true);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_QUESTIONS_V4.every((entry) => entry.shift === "SHIFT_1"), true);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_QUESTIONS_V4.every((entry) => entry.conclusionStructure === "TWO_CONCLUSION"), true);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_QUESTIONS_V4.every((entry) => entry.premiseOverlay === "ONLY_A_FEW"), true);
assert.equal(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_QUESTIONS_V4.every((entry) => entry.provenance === "INDEPENDENT_PYP_ARCHIVE"), true);

const featureSet = new Set(SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_QUESTIONS_V4.flatMap((entry) => entry.conclusionSemanticFeatures));
assert.deepEqual([...featureSet].sort(), ["CAN_NEVER", "ORDINARY_POSSIBILITY", "STANDARD_DEFINITE"]);

assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V4.factorizedWeightModelRequired, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V4.minimumIndependentDimensions, 3);
assert.deepEqual(SYL_BANKING_CROSS_EXAM_CENSUS_V4.factorDimensions, [
  "CONCLUSION_STRUCTURE",
  "CONCLUSION_SEMANTIC_FEATURES",
  "PREMISE_VOCABULARY_OVERLAY",
]);
assert.deepEqual(SYL_BANKING_CROSS_EXAM_CENSUS_V4.semanticFeatureVocabularyObserved, [
  "STANDARD_DEFINITE",
  "ORDINARY_POSSIBILITY",
  "CAN_NEVER",
]);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V4.conclusionSemanticFeaturesRemainMultiLabel, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V4.premiseOverlayMustRemainIndependentOfConclusionStructureAndSemantics, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V4.rrbCompleteShiftSupportsFactorization, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V4.rrbOnlyAFewOverlaySpansThreeSemanticFeatureKinds, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V4.legacyProvisionalFamiliesMixIndependentDimensions, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V4.currentProvisionalMixChanged, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V4.redesignImplementationPermittedAtThisCheckpoint, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V4.crossExamWeightGeneralizationPermitted, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V4.historicalFrequencyClaimPermittedAcrossSeries, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V4.exactPercentageWeightingPermitted, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V4.productionPercentagesFrozen, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V4.connectedToProductionPlanner, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V4.registrationPermitted, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V4.activationPermitted, false);

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_CROSS_EXAM_CENSUS_V4",
  examSeriesCount: SYL_BANKING_CROSS_EXAM_CENSUS_V4.examSeriesCount,
  structuralQuestionRecordsObserved: SYL_BANKING_CROSS_EXAM_CENSUS_V4.structuralQuestionRecordsObserved,
  rrbReportedSyllogismCount: SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_V4.reportedSyllogismCount,
  rrbRecoveredQuestions: SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_V4.recoveredQuestionCount,
  rrbUnresolvedQuestions: SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_V4.unresolvedQuestionCount,
  rrbRecoveredSemanticFeatureCounts: SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_V4.recoveredSemanticFeatureCounts,
  completeOfficerLevelShiftCount: SYL_BANKING_CROSS_EXAM_CENSUS_V4.completeOfficerLevelShiftCount,
  factorizedWeightModelRequired: SYL_BANKING_CROSS_EXAM_CENSUS_V4.factorizedWeightModelRequired,
  minimumIndependentDimensions: SYL_BANKING_CROSS_EXAM_CENSUS_V4.minimumIndependentDimensions,
  currentProvisionalMixChanged: SYL_BANKING_CROSS_EXAM_CENSUS_V4.currentProvisionalMixChanged,
  redesignImplementationPermittedAtThisCheckpoint: SYL_BANKING_CROSS_EXAM_CENSUS_V4.redesignImplementationPermittedAtThisCheckpoint,
  productionPercentagesFrozen: SYL_BANKING_CROSS_EXAM_CENSUS_V4.productionPercentagesFrozen,
  connectedToProductionPlanner: SYL_BANKING_CROSS_EXAM_CENSUS_V4.connectedToProductionPlanner,
  activationPermitted: SYL_BANKING_CROSS_EXAM_CENSUS_V4.activationPermitted,
}, null, 2));
