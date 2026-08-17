import { SYL_BANKING_CROSS_EXAM_CENSUS_V5 } from "./banking-cross-exam-census-v5";

export type SylBankingSbiPoConclusionStructureV6 = "TWO_CONCLUSION";

export type SylBankingSbiPoConclusionSemanticFeatureV6 =
  | "STANDARD_DEFINITE"
  | "ORDINARY_POSSIBILITY"
  | "CAN_NEVER";

export type SylBankingSbiPoPremiseOverlayFeatureV6 =
  | "ONLY"
  | "ONLY_A_FEW";

export type SylBankingSbiPoConclusionSetRelationshipV6 = "INDEPENDENT";

export interface SylBankingCrossExamSbiPoRecoveredQuestionV6 {
  evidenceId: string;
  examSeries: "SBI_PO_PRELIMS";
  paperDate: "2023-11-01";
  shift: "SHIFT_1";
  sourceUrl: string;
  conclusionStructure: SylBankingSbiPoConclusionStructureV6;
  conclusionSemanticFeatures: readonly SylBankingSbiPoConclusionSemanticFeatureV6[];
  premiseOverlayFeatures: readonly SylBankingSbiPoPremiseOverlayFeatureV6[];
  conclusionSetRelationship: SylBankingSbiPoConclusionSetRelationshipV6;
  provenance: "MEMORY_BASED_FULL_PAPER_TRANSCRIPTION_MIRROR";
}

export const SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_QUESTIONS_V6: readonly SylBankingCrossExamSbiPoRecoveredQuestionV6[] = Object.freeze([
  {
    evidenceId: "CROSS-SBI-PO-2023-11-01-S1-ROSE-PINK",
    examSeries: "SBI_PO_PRELIMS",
    paperDate: "2023-11-01",
    shift: "SHIFT_1",
    sourceUrl: "https://www.scribd.com/document/686745908/Formatted-SBI-PO-Pre-Memory-Based-Paper-Mock-01-1-Nov-2023-English",
    conclusionStructure: "TWO_CONCLUSION",
    conclusionSemanticFeatures: ["STANDARD_DEFINITE", "CAN_NEVER"],
    premiseOverlayFeatures: ["ONLY_A_FEW"],
    conclusionSetRelationship: "INDEPENDENT",
    provenance: "MEMORY_BASED_FULL_PAPER_TRANSCRIPTION_MIRROR",
  },
  {
    evidenceId: "CROSS-SBI-PO-2023-11-01-S1-TUBE-WELL",
    examSeries: "SBI_PO_PRELIMS",
    paperDate: "2023-11-01",
    shift: "SHIFT_1",
    sourceUrl: "https://www.studocu.com/en-us/document/creighton-university/money-and-banking/sbi-po-pre-memory-based-paper-mock-01-1-nov-2023/111475373",
    conclusionStructure: "TWO_CONCLUSION",
    conclusionSemanticFeatures: ["ORDINARY_POSSIBILITY"],
    premiseOverlayFeatures: ["ONLY_A_FEW"],
    conclusionSetRelationship: "INDEPENDENT",
    provenance: "MEMORY_BASED_FULL_PAPER_TRANSCRIPTION_MIRROR",
  },
  {
    evidenceId: "CROSS-SBI-PO-2023-11-01-S1-HAT-HOUSE",
    examSeries: "SBI_PO_PRELIMS",
    paperDate: "2023-11-01",
    shift: "SHIFT_1",
    sourceUrl: "https://www.studocu.com/en-us/document/creighton-university/money-and-banking/sbi-po-pre-memory-based-paper-mock-01-1-nov-2023/111475373",
    conclusionStructure: "TWO_CONCLUSION",
    conclusionSemanticFeatures: ["CAN_NEVER", "STANDARD_DEFINITE"],
    premiseOverlayFeatures: ["ONLY", "ONLY_A_FEW"],
    conclusionSetRelationship: "INDEPENDENT",
    provenance: "MEMORY_BASED_FULL_PAPER_TRANSCRIPTION_MIRROR",
  },
]);

const recoveredSemanticFeatureCounts = Object.freeze({
  STANDARD_DEFINITE: SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_QUESTIONS_V6.filter((entry) => entry.conclusionSemanticFeatures.includes("STANDARD_DEFINITE")).length,
  ORDINARY_POSSIBILITY: SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_QUESTIONS_V6.filter((entry) => entry.conclusionSemanticFeatures.includes("ORDINARY_POSSIBILITY")).length,
  CAN_NEVER: SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_QUESTIONS_V6.filter((entry) => entry.conclusionSemanticFeatures.includes("CAN_NEVER")).length,
});

const recoveredPremiseOverlayFeatureCounts = Object.freeze({
  ONLY: SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_QUESTIONS_V6.filter((entry) => entry.premiseOverlayFeatures.includes("ONLY")).length,
  ONLY_A_FEW: SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_QUESTIONS_V6.filter((entry) => entry.premiseOverlayFeatures.includes("ONLY_A_FEW")).length,
});

export const SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_V6 = Object.freeze({
  authorityId: "SYL_001_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_V6",
  examSeries: "SBI_PO_PRELIMS",
  paperDate: "2023-11-01",
  shift: "SHIFT_1",
  reportedSyllogismMinimum: 3,
  reportedSyllogismMaximum: 6,
  countSources: Object.freeze([
    Object.freeze({ sourceUrl: "https://www.bankersadda.com/sbi-po-exam-analysis-2023-1-november-shift-1/", reportedMinimum: 3, reportedMaximum: 3 }),
    Object.freeze({ sourceUrl: "https://blog.cafunsta.com/sbi-po-prelims-exam-analysis-2023/", reportedMinimum: 3, reportedMaximum: 3 }),
    Object.freeze({ sourceUrl: "https://www.pw.live/banking/exams/sbi-po-prelims-exam-analysis-2023-01-november-shift-1", reportedMinimum: 5, reportedMaximum: 5 }),
    Object.freeze({ sourceUrl: "https://www.ibpsguide.com/sbi-po-prelims-exam-analysis-2023/amp/", reportedMinimum: 5, reportedMaximum: 6 }),
  ]),
  shiftCountConflict: true,
  exactShiftFrequencyEligible: false,
  recoveredQuestionCount: SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_QUESTIONS_V6.length,
  recoveredCoversReportedMinimum: SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_QUESTIONS_V6.length === 3,
  unresolvedQuestionCountAtUpperBound: 6 - SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_QUESTIONS_V6.length,
  unrecoveredQuestionStructureOrSemanticsImputed: false,
  recoveredSemanticFeatureCounts,
  recoveredPremiseOverlayFeatureCounts,
  recoveredConclusionSetRelationshipCounts: Object.freeze({ INDEPENDENT: 3 }),
  premiseOverlayFeatureCountCanExceedRecoveredQuestionCount: Object.values(recoveredPremiseOverlayFeatureCounts).reduce((sum, count) => sum + count, 0) > SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_QUESTIONS_V6.length,
  questionWithMultiplePremiseOverlayFeaturesObserved: SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_QUESTIONS_V6.some((entry) => entry.premiseOverlayFeatures.length > 1),
  premiseVocabularyOverlayFeaturesAreMultiLabelWithinDimension: true,
  recoveryStatus: "LOWER_BOUND_RECOVERED_UPPER_BOUND_THREE_UNRESOLVED_COUNT_CONFLICT",
  frequencyEstimationEligible: false,
  exactWeightEstimationEligible: false,
});

export const SYL_BANKING_CROSS_EXAM_CENSUS_V6 = Object.freeze({
  authorityId: "SYL_001_BANKING_CROSS_EXAM_CENSUS_V6",
  supersedes: SYL_BANKING_CROSS_EXAM_CENSUS_V5.authorityId,
  status: "FIVE_EXAM_SERIES_FOUR_FACTOR_MODEL_PREMISE_OVERLAY_MULTILABEL_WEIGHTS_UNFROZEN",
  examSeriesObserved: SYL_BANKING_CROSS_EXAM_CENSUS_V5.examSeriesObserved,
  examSeriesCount: SYL_BANKING_CROSS_EXAM_CENSUS_V5.examSeriesCount,
  structuralQuestionRecordsObserved: SYL_BANKING_CROSS_EXAM_CENSUS_V5.structuralQuestionRecordsObserved + SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_01_S1_V6.recoveredQuestionCount,
  structuralQuestionRecordsAreFrequencyDenominator: false,
  completeOfficerLevelShiftCount: SYL_BANKING_CROSS_EXAM_CENSUS_V5.archiveCompleteOfficerLevelShiftCount,
  independentlyCountCorroboratedCompleteOfficerLevelShiftCount: SYL_BANKING_CROSS_EXAM_CENSUS_V5.independentlyCountCorroboratedCompleteOfficerLevelShiftCount,
  sbiPoDistinctPaperDatesObserved: ["2023-11-01", "2023-11-06"] as const,
  factorizedWeightModelRequired: true,
  minimumIndependentDimensions: 4,
  factorDimensions: SYL_BANKING_CROSS_EXAM_CENSUS_V5.factorDimensions,
  conclusionSemanticFeaturesRemainMultiLabel: true,
  premiseVocabularyOverlayFeaturesRemainMultiLabel: true,
  premiseOverlayMultiLabelDoesNotCreateAdditionalDimension: true,
  conclusionSetRelationshipRemainsIndependentDimension: true,
  legacyOnlyAndOnlyAFewFamilyMapsToPremiseVocabularyOverlayDimension: true,
  legacyProvisionalFamiliesMixIndependentDimensions: true,
  currentProvisionalMixChanged: false,
  redesignImplementationPermittedAtThisCheckpoint: false,
  crossExamWeightGeneralizationPermitted: false,
  historicalFrequencyClaimPermittedAcrossSeries: false,
  exactPercentageWeightingPermitted: false,
  productionPercentagesFrozen: false,
  connectedToProductionPlanner: false,
  registrationPermitted: false,
  activationPermitted: false,
  nextSamplePlan: [
    "Add another IBPS PO paper-day using the same four dimensions and multi-label premise-overlay representation.",
    "Reconcile or explicitly retain the SBI PO 01-Nov-2023 Shift-1 3-to-6 count conflict, IBPS PO 23-Sep-2023 Shift-2 count conflict and IBPS Clerk 25-Aug-2024 shift-attribution conflict.",
    "Only after broader systematic sampling, design a separate inactive four-factor planner candidate with multi-label semantic and premise-overlay features; do not mutate the current production mix inside source-evidence work.",
  ] as const,
});
