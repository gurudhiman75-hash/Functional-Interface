import { SYL_BANKING_CROSS_EXAM_CENSUS_V3 } from "./banking-cross-exam-census-v3";

export type SylBankingRrbPoConclusionStructureV4 = "TWO_CONCLUSION";

export type SylBankingRrbPoSemanticFeatureV4 =
  | "STANDARD_DEFINITE"
  | "ORDINARY_POSSIBILITY"
  | "CAN_NEVER";

export type SylBankingRrbPoPremiseOverlayV4 = "ONLY_A_FEW";

export interface SylBankingCrossExamRrbPoRecoveredQuestionV4 {
  evidenceId: string;
  examSeries: "IBPS_RRB_PO_PRELIMS";
  paperDate: "2024-08-03";
  shift: "SHIFT_1";
  sourceUrl: string;
  conclusionStructure: SylBankingRrbPoConclusionStructureV4;
  conclusionSemanticFeatures: readonly SylBankingRrbPoSemanticFeatureV4[];
  premiseOverlay: SylBankingRrbPoPremiseOverlayV4;
  provenance: "INDEPENDENT_PYP_ARCHIVE";
}

export const SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_QUESTIONS_V4: readonly SylBankingCrossExamRrbPoRecoveredQuestionV4[] = Object.freeze([
  {
    evidenceId: "CROSS-RRB-PO-2024-08-03-S1-STAR-COMET",
    examSeries: "IBPS_RRB_PO_PRELIMS",
    paperDate: "2024-08-03",
    shift: "SHIFT_1",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-following-question-three-statements-are-given-and-two-1784821-478304",
    conclusionStructure: "TWO_CONCLUSION",
    conclusionSemanticFeatures: ["STANDARD_DEFINITE", "CAN_NEVER"],
    premiseOverlay: "ONLY_A_FEW",
    provenance: "INDEPENDENT_PYP_ARCHIVE",
  },
  {
    evidenceId: "CROSS-RRB-PO-2024-08-03-S1-CHART-SHEET",
    examSeries: "IBPS_RRB_PO_PRELIMS",
    paperDate: "2024-08-03",
    shift: "SHIFT_1",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-following-question-three-statements-are-given-and-two-1784821-478197",
    conclusionStructure: "TWO_CONCLUSION",
    conclusionSemanticFeatures: ["STANDARD_DEFINITE", "ORDINARY_POSSIBILITY"],
    premiseOverlay: "ONLY_A_FEW",
    provenance: "INDEPENDENT_PYP_ARCHIVE",
  },
  {
    evidenceId: "CROSS-RRB-PO-2024-08-03-S1-RICE-BARLEY",
    examSeries: "IBPS_RRB_PO_PRELIMS",
    paperDate: "2024-08-03",
    shift: "SHIFT_1",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-following-question-three-statements-are-given-and-two-1784821-478249",
    conclusionStructure: "TWO_CONCLUSION",
    conclusionSemanticFeatures: ["STANDARD_DEFINITE"],
    premiseOverlay: "ONLY_A_FEW",
    provenance: "INDEPENDENT_PYP_ARCHIVE",
  },
]);

const rrbPoSemanticFeatureCounts = Object.freeze({
  STANDARD_DEFINITE: SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_QUESTIONS_V4.filter((entry) => entry.conclusionSemanticFeatures.includes("STANDARD_DEFINITE")).length,
  ORDINARY_POSSIBILITY: SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_QUESTIONS_V4.filter((entry) => entry.conclusionSemanticFeatures.includes("ORDINARY_POSSIBILITY")).length,
  CAN_NEVER: SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_QUESTIONS_V4.filter((entry) => entry.conclusionSemanticFeatures.includes("CAN_NEVER")).length,
});

export const SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_V4 = Object.freeze({
  authorityId: "SYL_001_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_V4",
  examSeries: "IBPS_RRB_PO_PRELIMS",
  paperDate: "2024-08-03",
  shift: "SHIFT_1",
  reportedSyllogismCount: 3,
  countSources: Object.freeze([
    "https://www.oliveboard.in/blog/ibps-rrb-po-exam-analysis-2024-3rd-august-shift-1/",
    "https://www.practicemock.com/blog/ibps-rrb-po-exam-analysis-2024-3rd-august-1st-shift/",
    "https://www.pw.live/banking/exams/ibps-rrb-po-exam-analysis-2024-shift-1-3rd-august/",
  ]),
  exactCountSourceAgreement: 3,
  recoveredQuestionCount: SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_QUESTIONS_V4.length,
  unresolvedQuestionCount: 0,
  recoveredQuestionCoverageRatio: 1,
  recoveryStatus: "COMPLETE_EXACT_THREE_OF_THREE",
  allRecoveredQuestionsTwoConclusion: SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_QUESTIONS_V4.every((entry) => entry.conclusionStructure === "TWO_CONCLUSION"),
  allRecoveredQuestionsOnlyAFewOverlay: SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_QUESTIONS_V4.every((entry) => entry.premiseOverlay === "ONLY_A_FEW"),
  recoveredSemanticFeatureCounts: rrbPoSemanticFeatureCounts,
  semanticFeatureKindsObserved: Object.values(rrbPoSemanticFeatureCounts).filter((count) => count > 0).length,
  ordinaryPossibilityObserved: rrbPoSemanticFeatureCounts.ORDINARY_POSSIBILITY > 0,
  canNeverObserved: rrbPoSemanticFeatureCounts.CAN_NEVER > 0,
  standardDefiniteObserved: rrbPoSemanticFeatureCounts.STANDARD_DEFINITE > 0,
  questionStructureOrSemanticsImputed: false,
  frequencyEstimationEligibleForThisShiftOnly: true,
  crossExamProductionWeightEstimationEligible: false,
});

export const SYL_BANKING_CROSS_EXAM_CENSUS_V4 = Object.freeze({
  authorityId: "SYL_001_BANKING_CROSS_EXAM_CENSUS_V4",
  supersedes: SYL_BANKING_CROSS_EXAM_CENSUS_V3.authorityId,
  status: "FIVE_EXAM_SERIES_FACTOR_MODEL_SUPPORTED_ONE_COMPLETE_OFFICER_SHIFT_WEIGHTS_UNFROZEN",
  examSeriesObserved: [
    "IBPS_CLERK_PRELIMS",
    "SBI_CLERK_PRELIMS",
    "SBI_PO_PRELIMS",
    "IBPS_PO_PRELIMS",
    "IBPS_RRB_PO_PRELIMS",
  ] as const,
  examSeriesCount: 5,
  structuralQuestionRecordsObserved: SYL_BANKING_CROSS_EXAM_CENSUS_V3.structuralQuestionRecordsObserved + SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_V4.recoveredQuestionCount,
  structuralQuestionRecordsAreFrequencyDenominator: false,
  completeOfficerLevelShiftCount: 1,
  completeOfficerLevelShiftAuthority: SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_V4.authorityId,
  factorizedWeightModelRequired: true,
  minimumIndependentDimensions: 3,
  factorDimensions: SYL_BANKING_CROSS_EXAM_CENSUS_V3.factorDimensions,
  semanticFeatureVocabularyObserved: ["STANDARD_DEFINITE", "ORDINARY_POSSIBILITY", "CAN_NEVER"] as const,
  conclusionSemanticFeaturesRemainMultiLabel: true,
  premiseOverlayMustRemainIndependentOfConclusionStructureAndSemantics: true,
  rrbCompleteShiftSupportsFactorization: true,
  rrbOnlyAFewOverlaySpansThreeSemanticFeatureKinds: SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_03_S1_V4.semanticFeatureKindsObserved === 3,
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
    "Add a second complete or bounded IBPS RRB PO shift to avoid depending on one complete officer-level shift.",
    "Add at least one additional SBI PO and IBPS PO paper-day to reduce single-day dependence in officer-level sampling.",
    "Reconcile the IBPS PO 23-Sep-2023 Shift-2 count conflict and IBPS Clerk 25-Aug-2024 shift-attribution conflict where possible.",
    "After systematic cross-series sampling, design a separate inactive factorized planner candidate; do not mutate the current production mix in the source-evidence checkpoint.",
  ] as const,
});
