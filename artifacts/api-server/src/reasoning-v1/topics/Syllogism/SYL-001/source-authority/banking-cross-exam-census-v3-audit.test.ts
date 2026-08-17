import assert from "node:assert/strict";
import { SYL_BANKING_CROSS_EXAM_CENSUS_V2 } from "./banking-cross-exam-census-v2";
import {
  SYL_BANKING_CROSS_EXAM_CENSUS_V3,
  SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_QUESTIONS_V3,
  SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_V3,
} from "./banking-cross-exam-census-v3";

assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V3.supersedes, SYL_BANKING_CROSS_EXAM_CENSUS_V2.authorityId);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V3.examSeriesCount, 4);
assert.deepEqual(SYL_BANKING_CROSS_EXAM_CENSUS_V3.examSeriesObserved, [
  "IBPS_CLERK_PRELIMS",
  "SBI_CLERK_PRELIMS",
  "SBI_PO_PRELIMS",
  "IBPS_PO_PRELIMS",
]);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V3.structuralQuestionRecordsObserved, 30);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V3.structuralQuestionRecordsAreFrequencyDenominator, false);

assert.equal(SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_V3.reportedSyllogismMinimum, 3);
assert.equal(SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_V3.reportedSyllogismMaximum, 4);
assert.equal(SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_V3.countSources.length, 4);
assert.deepEqual(SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_V3.countSources.map((entry) => entry.reportedCount), [4, 4, 3, 3]);
assert.equal(SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_V3.shiftCountConflict, true);
assert.equal(SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_V3.recoveredQuestionCount, 3);
assert.equal(SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_V3.recoveredCoversReportedMinimum, true);
assert.equal(SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_V3.unresolvedQuestionCountAtUpperBound, 1);
assert.equal(SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_V3.unrecoveredQuestionStructureOrSemanticsImputed, false);
assert.deepEqual(SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_V3.recoveredStructureCounts, {
  TWO_CONCLUSION: 1,
  THREE_CONCLUSION_ADVANCED: 2,
});
assert.deepEqual(SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_V3.recoveredSemanticFeatureCounts, {
  STANDARD_DEFINITE: 3,
  ORDINARY_POSSIBILITY: 2,
});
assert.deepEqual(SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_V3.recoveredPremiseOverlayCounts, {
  CORE: 1,
  ONLY_A_FEW: 2,
});
assert.equal(SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_V3.advancedQuestionsAlsoCarryOrdinaryPossibility, true);
assert.equal(SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_V3.frequencyEstimationEligible, false);
assert.equal(SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_V3.exactWeightEstimationEligible, false);

assert.equal(SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_QUESTIONS_V3.length, 3);
assert.equal(new Set(SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_QUESTIONS_V3.map((entry) => entry.evidenceId)).size, 3);
assert.equal(new Set(SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_QUESTIONS_V3.map((entry) => entry.sourceUrl)).size, 3);
assert.equal(SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_QUESTIONS_V3.every((entry) => entry.examSeries === "IBPS_PO_PRELIMS"), true);
assert.equal(SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_QUESTIONS_V3.every((entry) => entry.paperDate === "2023-09-23"), true);
assert.equal(SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_QUESTIONS_V3.every((entry) => entry.shift === "SHIFT_2"), true);
assert.equal(SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_QUESTIONS_V3.every((entry) => entry.provenance === "MEMORY_BASED_TRANSCRIPTION"), true);

const advanced = SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_QUESTIONS_V3.filter((entry) => entry.conclusionStructure === "THREE_CONCLUSION_ADVANCED");
assert.equal(advanced.length, 2);
assert.equal(advanced.every((entry) => entry.conclusionSemanticFeatures.includes("ORDINARY_POSSIBILITY")), true);
assert.equal(advanced.every((entry) => entry.premiseOverlay === "ONLY_A_FEW"), true);

assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V3.factorizedWeightModelRequired, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V3.minimumIndependentDimensions, 3);
assert.deepEqual(SYL_BANKING_CROSS_EXAM_CENSUS_V3.factorDimensions, [
  "CONCLUSION_STRUCTURE",
  "CONCLUSION_SEMANTIC_FEATURES",
  "PREMISE_VOCABULARY_OVERLAY",
]);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V3.twoAxisShellPlusPremiseModelStillUsefulButInsufficient, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V3.conclusionStructureAndPossibilityAreNotMutuallyExclusive, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V3.semanticFeaturesAreMultiLabelWithinQuestion, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V3.ordinaryPossibilityObservedInTwoConclusionAndThreeConclusionStructures, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V3.premiseOverlayMustRemainIndependentOfConclusionStructureAndSemantics, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V3.legacyProvisionalFamiliesMixIndependentDimensions, true);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V3.legacyFamiliesNeedingFactorizedRedesignBeforeFreeze.length, 5);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V3.currentProvisionalMixChanged, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V3.redesignImplementationPermittedAtThisCheckpoint, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V3.crossExamWeightGeneralizationPermitted, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V3.historicalFrequencyClaimPermitted, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V3.exactPercentageWeightingPermitted, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V3.productionPercentagesFrozen, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V3.connectedToProductionPlanner, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V3.registrationPermitted, false);
assert.equal(SYL_BANKING_CROSS_EXAM_CENSUS_V3.activationPermitted, false);

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_CROSS_EXAM_CENSUS_V3",
  examSeriesCount: SYL_BANKING_CROSS_EXAM_CENSUS_V3.examSeriesCount,
  structuralQuestionRecordsObserved: SYL_BANKING_CROSS_EXAM_CENSUS_V3.structuralQuestionRecordsObserved,
  ibpsPoReportedRange: [
    SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_V3.reportedSyllogismMinimum,
    SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_V3.reportedSyllogismMaximum,
  ],
  ibpsPoRecoveredQuestions: SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_V3.recoveredQuestionCount,
  ibpsPoCountConflict: SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_V3.shiftCountConflict,
  ibpsPoRecoveredStructureCounts: SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_V3.recoveredStructureCounts,
  ibpsPoRecoveredSemanticFeatureCounts: SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_V3.recoveredSemanticFeatureCounts,
  ibpsPoRecoveredPremiseOverlayCounts: SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_V3.recoveredPremiseOverlayCounts,
  factorizedWeightModelRequired: SYL_BANKING_CROSS_EXAM_CENSUS_V3.factorizedWeightModelRequired,
  minimumIndependentDimensions: SYL_BANKING_CROSS_EXAM_CENSUS_V3.minimumIndependentDimensions,
  currentProvisionalMixChanged: SYL_BANKING_CROSS_EXAM_CENSUS_V3.currentProvisionalMixChanged,
  redesignImplementationPermittedAtThisCheckpoint: SYL_BANKING_CROSS_EXAM_CENSUS_V3.redesignImplementationPermittedAtThisCheckpoint,
  productionPercentagesFrozen: SYL_BANKING_CROSS_EXAM_CENSUS_V3.productionPercentagesFrozen,
  activationPermitted: SYL_BANKING_CROSS_EXAM_CENSUS_V3.activationPermitted,
}, null, 2));
