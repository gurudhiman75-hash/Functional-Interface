import { SYL_BANKING_CROSS_EXAM_CENSUS_V2, SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2 } from "./banking-cross-exam-census-v2";
import { SYL_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_V1 } from "./banking-cross-exam-census-v1";
import { SYL_BANKING_PAPER_CENSUS_V2 } from "./banking-paper-census-v2";

export type SylBankingConclusionStructureV3 =
  | "TWO_CONCLUSION"
  | "THREE_CONCLUSION_ADVANCED";

export type SylBankingConclusionSemanticFeatureV3 =
  | "STANDARD_DEFINITE"
  | "ORDINARY_POSSIBILITY";

export type SylBankingPremiseOverlayV3 = "CORE" | "ONLY_A_FEW";

export interface SylBankingCrossExamIbpsPoRecoveredQuestionV3 {
  evidenceId: string;
  examSeries: "IBPS_PO_PRELIMS";
  paperDate: "2023-09-23";
  shift: "SHIFT_2";
  sourceUrl: string;
  conclusionStructure: SylBankingConclusionStructureV3;
  conclusionSemanticFeatures: readonly SylBankingConclusionSemanticFeatureV3[];
  premiseOverlay: SylBankingPremiseOverlayV3;
  provenance: "MEMORY_BASED_TRANSCRIPTION";
}

export const SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_QUESTIONS_V3: readonly SylBankingCrossExamIbpsPoRecoveredQuestionV3[] = Object.freeze([
  {
    evidenceId: "CROSS-IBPS-PO-2023-09-23-S2-DAM-WOOD",
    examSeries: "IBPS_PO_PRELIMS",
    paperDate: "2023-09-23",
    shift: "SHIFT_2",
    sourceUrl: "https://testbook.com/question-answer/in-the-following-question-below-are-given-some-sta--64e0db290af9192f1e2a4656",
    conclusionStructure: "TWO_CONCLUSION",
    conclusionSemanticFeatures: ["STANDARD_DEFINITE"],
    premiseOverlay: "CORE",
    provenance: "MEMORY_BASED_TRANSCRIPTION",
  },
  {
    evidenceId: "CROSS-IBPS-PO-2023-09-23-S2-FAN-BULB",
    examSeries: "IBPS_PO_PRELIMS",
    paperDate: "2023-09-23",
    shift: "SHIFT_2",
    sourceUrl: "https://testbook.com/question-answer/directionsin-the-question-below-are-given-s--6447a3a42c4c7d7c16af98a6",
    conclusionStructure: "THREE_CONCLUSION_ADVANCED",
    conclusionSemanticFeatures: ["ORDINARY_POSSIBILITY", "STANDARD_DEFINITE"],
    premiseOverlay: "ONLY_A_FEW",
    provenance: "MEMORY_BASED_TRANSCRIPTION",
  },
  {
    evidenceId: "CROSS-IBPS-PO-2023-09-23-S2-GENES-DNA",
    examSeries: "IBPS_PO_PRELIMS",
    paperDate: "2023-09-23",
    shift: "SHIFT_2",
    sourceUrl: "https://testbook.com/question-answer/directionsin-the-question-below-are-given-s--6447a8b0b8177635c2498926",
    conclusionStructure: "THREE_CONCLUSION_ADVANCED",
    conclusionSemanticFeatures: ["ORDINARY_POSSIBILITY", "STANDARD_DEFINITE"],
    premiseOverlay: "ONLY_A_FEW",
    provenance: "MEMORY_BASED_TRANSCRIPTION",
  },
]);

const ibpsPoStructureCounts = Object.freeze({
  TWO_CONCLUSION: SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_QUESTIONS_V3.filter((entry) => entry.conclusionStructure === "TWO_CONCLUSION").length,
  THREE_CONCLUSION_ADVANCED: SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_QUESTIONS_V3.filter((entry) => entry.conclusionStructure === "THREE_CONCLUSION_ADVANCED").length,
});

const ibpsPoSemanticFeatureCounts = Object.freeze({
  STANDARD_DEFINITE: SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_QUESTIONS_V3.filter((entry) => entry.conclusionSemanticFeatures.includes("STANDARD_DEFINITE")).length,
  ORDINARY_POSSIBILITY: SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_QUESTIONS_V3.filter((entry) => entry.conclusionSemanticFeatures.includes("ORDINARY_POSSIBILITY")).length,
});

const ibpsPoPremiseOverlayCounts = Object.freeze({
  CORE: SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_QUESTIONS_V3.filter((entry) => entry.premiseOverlay === "CORE").length,
  ONLY_A_FEW: SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_QUESTIONS_V3.filter((entry) => entry.premiseOverlay === "ONLY_A_FEW").length,
});

export const SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_V3 = Object.freeze({
  authorityId: "SYL_001_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_V3",
  examSeries: "IBPS_PO_PRELIMS",
  paperDate: "2023-09-23",
  shift: "SHIFT_2",
  reportedSyllogismMinimum: 3,
  reportedSyllogismMaximum: 4,
  countSources: Object.freeze([
    Object.freeze({ sourceUrl: "https://www.oliveboard.in/blog/?p=140047", reportedCount: 4 }),
    Object.freeze({ sourceUrl: "https://www.bankersadda.com/ibps-po-exam-analysis-2023-shift-2-23-september/", reportedCount: 4 }),
    Object.freeze({ sourceUrl: "https://www.makemyexam.in/ibps-po-2023-exam-analysis-all-shifts-29093", reportedCount: 3 }),
    Object.freeze({ sourceUrl: "https://blog.cafunsta.com/ibps-po-prelims-exam-analysis-2023/", reportedCount: 3 }),
  ]),
  shiftCountConflict: true,
  recoveredQuestionCount: SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_QUESTIONS_V3.length,
  recoveredCoversReportedMinimum: SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_QUESTIONS_V3.length === 3,
  unresolvedQuestionCountAtUpperBound: 4 - SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_QUESTIONS_V3.length,
  unrecoveredQuestionStructureOrSemanticsImputed: false,
  recoveredStructureCounts: ibpsPoStructureCounts,
  recoveredSemanticFeatureCounts: ibpsPoSemanticFeatureCounts,
  recoveredPremiseOverlayCounts: ibpsPoPremiseOverlayCounts,
  advancedQuestionsAlsoCarryOrdinaryPossibility: SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_QUESTIONS_V3
    .filter((entry) => entry.conclusionStructure === "THREE_CONCLUSION_ADVANCED")
    .every((entry) => entry.conclusionSemanticFeatures.includes("ORDINARY_POSSIBILITY")),
  frequencyEstimationEligible: false,
  exactWeightEstimationEligible: false,
  recoveryStatus: "MINIMUM_COMPLETE_UPPER_BOUND_ONE_UNRESOLVED_COUNT_CONFLICT",
});

const structuralQuestionRecordsObserved =
  SYL_BANKING_PAPER_CENSUS_V2.recoveredQuestionCount
  + SYL_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_V1.recoveredQuestionCount
  + SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2.recoveredQuestionCount
  + SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_V3.recoveredQuestionCount;

export const SYL_BANKING_CROSS_EXAM_CENSUS_V3 = Object.freeze({
  authorityId: "SYL_001_BANKING_CROSS_EXAM_CENSUS_V3",
  supersedes: SYL_BANKING_CROSS_EXAM_CENSUS_V2.authorityId,
  status: "FOUR_EXAM_SERIES_FACTOR_MODEL_REQUIRED_WEIGHTS_UNFROZEN",
  examSeriesObserved: ["IBPS_CLERK_PRELIMS", "SBI_CLERK_PRELIMS", "SBI_PO_PRELIMS", "IBPS_PO_PRELIMS"] as const,
  examSeriesCount: 4,
  structuralQuestionRecordsObserved,
  structuralQuestionRecordsAreFrequencyDenominator: false,
  factorizedWeightModelRequired: true,
  minimumIndependentDimensions: 3,
  factorDimensions: [
    "CONCLUSION_STRUCTURE",
    "CONCLUSION_SEMANTIC_FEATURES",
    "PREMISE_VOCABULARY_OVERLAY",
  ] as const,
  twoAxisShellPlusPremiseModelStillUsefulButInsufficient: true,
  conclusionStructureAndPossibilityAreNotMutuallyExclusive: true,
  semanticFeaturesAreMultiLabelWithinQuestion: true,
  ordinaryPossibilityObservedInTwoConclusionAndThreeConclusionStructures: true,
  premiseOverlayMustRemainIndependentOfConclusionStructureAndSemantics: true,
  evidenceForFactorization: Object.freeze({
    twoConclusionPossibilityAuthority: SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2.authorityId,
    threeConclusionPossibilityAuthority: SYL_BANKING_CROSS_EXAM_IBPS_PO_2023_09_23_S2_V3.authorityId,
    premiseOverlayCrossShellAuthority: SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2.authorityId,
  }),
  legacyProvisionalFamiliesMixIndependentDimensions: true,
  legacyFamiliesNeedingFactorizedRedesignBeforeFreeze: [
    "BANK_TWO_CONCLUSION_FIVE_OPTION",
    "BANK_EITHER_OR_COMPLEMENTARY",
    "BANK_POSSIBILITY_IN_CONCLUSION_SET",
    "BANK_ONLY_AND_ONLY_A_FEW",
    "BANK_THREE_CONCLUSION_ADVANCED",
  ] as const,
  currentProvisionalMixChanged: false,
  redesignImplementationPermittedAtThisCheckpoint: false,
  crossExamWeightGeneralizationPermitted: false,
  historicalFrequencyClaimPermitted: false,
  exactPercentageWeightingPermitted: false,
  productionPercentagesFrozen: false,
  connectedToProductionPlanner: false,
  registrationPermitted: false,
  activationPermitted: false,
  nextSamplePlan: [
    "Reconcile or retain the IBPS PO 23-Sep-2023 Shift-2 3-versus-4 source-count conflict without imputing an extra question.",
    "Add one complete or bounded IBPS RRB PO paper-day and check the same three factor dimensions.",
    "Add at least one additional SBI/IBPS PO paper-day to reduce single-day dependence within officer-level exams.",
    "Only after systematic cross-series sampling, propose an inactive factorized planner candidate that preserves the current production mix until separately approved.",
  ] as const,
});
