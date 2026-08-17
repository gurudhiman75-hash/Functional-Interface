import { SYL_BANKING_CROSS_EXAM_CENSUS_V4 } from "./banking-cross-exam-census-v4";

export type SylBankingRrbPoConclusionStructureV5 = "TWO_CONCLUSION";

export type SylBankingRrbPoConclusionSemanticFeatureV5 =
  | "STANDARD_DEFINITE"
  | "ORDINARY_POSSIBILITY";

export type SylBankingRrbPoPremiseOverlayV5 = "CORE" | "ONLY_A_FEW";

export type SylBankingConclusionSetRelationshipV5 =
  | "INDEPENDENT"
  | "COMPLEMENTARY_EITHER_OR";

export interface SylBankingCrossExamRrbPoRecoveredQuestionV5 {
  evidenceId: string;
  examSeries: "IBPS_RRB_PO_PRELIMS";
  paperDate: "2024-08-04";
  shift: "SHIFT_4";
  sourceUrl: string;
  conclusionStructure: SylBankingRrbPoConclusionStructureV5;
  conclusionSemanticFeatures: readonly SylBankingRrbPoConclusionSemanticFeatureV5[];
  premiseOverlay: SylBankingRrbPoPremiseOverlayV5;
  conclusionSetRelationship: SylBankingConclusionSetRelationshipV5;
  provenance: "INDEPENDENT_PYP_ARCHIVE";
}

export const SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_QUESTIONS_V5: readonly SylBankingCrossExamRrbPoRecoveredQuestionV5[] = Object.freeze([
  {
    evidenceId: "CROSS-RRB-PO-2024-08-04-S4-FIRE-DEN-BOW",
    examSeries: "IBPS_RRB_PO_PRELIMS",
    paperDate: "2024-08-04",
    shift: "SHIFT_4",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-each-of-the-questions-below-are-given-some-statements-followed-by-1784821-546473",
    conclusionStructure: "TWO_CONCLUSION",
    conclusionSemanticFeatures: ["STANDARD_DEFINITE"],
    premiseOverlay: "CORE",
    conclusionSetRelationship: "COMPLEMENTARY_EITHER_OR",
    provenance: "INDEPENDENT_PYP_ARCHIVE",
  },
  {
    evidenceId: "CROSS-RRB-PO-2024-08-04-S4-BOAT-CRUISE",
    examSeries: "IBPS_RRB_PO_PRELIMS",
    paperDate: "2024-08-04",
    shift: "SHIFT_4",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-question-given-below-three-statements-are-given-followed-two-1784821-546411",
    conclusionStructure: "TWO_CONCLUSION",
    conclusionSemanticFeatures: ["STANDARD_DEFINITE"],
    premiseOverlay: "ONLY_A_FEW",
    conclusionSetRelationship: "INDEPENDENT",
    provenance: "INDEPENDENT_PYP_ARCHIVE",
  },
  {
    evidenceId: "CROSS-RRB-PO-2024-08-04-S4-CARP-OSCAR",
    examSeries: "IBPS_RRB_PO_PRELIMS",
    paperDate: "2024-08-04",
    shift: "SHIFT_4",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-following-question-three-statements-are-given-and-two-1784821-546346",
    conclusionStructure: "TWO_CONCLUSION",
    conclusionSemanticFeatures: ["STANDARD_DEFINITE", "ORDINARY_POSSIBILITY"],
    premiseOverlay: "ONLY_A_FEW",
    conclusionSetRelationship: "INDEPENDENT",
    provenance: "INDEPENDENT_PYP_ARCHIVE",
  },
  {
    evidenceId: "CROSS-RRB-PO-2024-08-04-S4-GLOVE-CHAIR",
    examSeries: "IBPS_RRB_PO_PRELIMS",
    paperDate: "2024-08-04",
    shift: "SHIFT_4",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-question-given-below-three-statements-are-given-followed-by-1784821-546539",
    conclusionStructure: "TWO_CONCLUSION",
    conclusionSemanticFeatures: ["STANDARD_DEFINITE"],
    premiseOverlay: "CORE",
    conclusionSetRelationship: "INDEPENDENT",
    provenance: "INDEPENDENT_PYP_ARCHIVE",
  },
]);

const recoveredSemanticFeatureCounts = Object.freeze({
  STANDARD_DEFINITE: SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_QUESTIONS_V5.filter((entry) => entry.conclusionSemanticFeatures.includes("STANDARD_DEFINITE")).length,
  ORDINARY_POSSIBILITY: SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_QUESTIONS_V5.filter((entry) => entry.conclusionSemanticFeatures.includes("ORDINARY_POSSIBILITY")).length,
});

const recoveredPremiseOverlayCounts = Object.freeze({
  CORE: SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_QUESTIONS_V5.filter((entry) => entry.premiseOverlay === "CORE").length,
  ONLY_A_FEW: SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_QUESTIONS_V5.filter((entry) => entry.premiseOverlay === "ONLY_A_FEW").length,
});

const recoveredConclusionSetRelationshipCounts = Object.freeze({
  INDEPENDENT: SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_QUESTIONS_V5.filter((entry) => entry.conclusionSetRelationship === "INDEPENDENT").length,
  COMPLEMENTARY_EITHER_OR: SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_QUESTIONS_V5.filter((entry) => entry.conclusionSetRelationship === "COMPLEMENTARY_EITHER_OR").length,
});

export const SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_V5 = Object.freeze({
  authorityId: "SYL_001_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_V5",
  examSeries: "IBPS_RRB_PO_PRELIMS",
  paperDate: "2024-08-04",
  shift: "SHIFT_4",
  reportedSyllogismCount: 4,
  countSources: Object.freeze([
    "https://www.oliveboard.in/blog/ibps-rrb-po-exam-analysis-2024-shift-4/",
  ]),
  pypSeriesIndexUrl: "https://www.oliveboard.in/ibps-rrb-po-previous-year-papers/",
  exactCountIndependentlyCorroborated: false,
  recoveredQuestionCount: SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_QUESTIONS_V5.length,
  unresolvedQuestionCount: 0,
  recoveredQuestionCoverageRatioAgainstReportedCount: SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_QUESTIONS_V5.length / 4,
  recoveryStatus: "ARCHIVE_COMPLETE_FOUR_OF_FOUR_SINGLE_COUNT_SOURCE",
  allRecoveredQuestionsTwoConclusion: SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_QUESTIONS_V5.every((entry) => entry.conclusionStructure === "TWO_CONCLUSION"),
  recoveredSemanticFeatureCounts,
  recoveredPremiseOverlayCounts,
  recoveredConclusionSetRelationshipCounts,
  eitherOrQuestionObserved: recoveredConclusionSetRelationshipCounts.COMPLEMENTARY_EITHER_OR > 0,
  eitherOrQuestionUsesDefiniteConclusions: SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_QUESTIONS_V5
    .filter((entry) => entry.conclusionSetRelationship === "COMPLEMENTARY_EITHER_OR")
    .every((entry) => entry.conclusionSemanticFeatures.length === 1 && entry.conclusionSemanticFeatures[0] === "STANDARD_DEFINITE"),
  questionStructureOrSemanticsImputed: false,
  frequencyDescriptionEligibleForThisArchivedShift: true,
  crossExamProductionWeightEstimationEligible: false,
});

export const SYL_BANKING_CROSS_EXAM_CENSUS_V5 = Object.freeze({
  authorityId: "SYL_001_BANKING_CROSS_EXAM_CENSUS_V5",
  supersedes: SYL_BANKING_CROSS_EXAM_CENSUS_V4.authorityId,
  status: "FIVE_EXAM_SERIES_FOUR_FACTOR_MODEL_TWO_ARCHIVE_COMPLETE_OFFICER_SHIFTS_WEIGHTS_UNFROZEN",
  examSeriesObserved: SYL_BANKING_CROSS_EXAM_CENSUS_V4.examSeriesObserved,
  examSeriesCount: SYL_BANKING_CROSS_EXAM_CENSUS_V4.examSeriesCount,
  structuralQuestionRecordsObserved: SYL_BANKING_CROSS_EXAM_CENSUS_V4.structuralQuestionRecordsObserved + SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_V5.recoveredQuestionCount,
  structuralQuestionRecordsAreFrequencyDenominator: false,
  archiveCompleteOfficerLevelShiftCount: SYL_BANKING_CROSS_EXAM_CENSUS_V4.completeOfficerLevelShiftCount + 1,
  independentlyCountCorroboratedCompleteOfficerLevelShiftCount: SYL_BANKING_CROSS_EXAM_CENSUS_V4.completeOfficerLevelShiftCount,
  secondArchiveCompleteShiftAuthority: SYL_BANKING_CROSS_EXAM_RRB_PO_2024_08_04_S4_V5.authorityId,
  factorizedWeightModelRequired: true,
  minimumIndependentDimensions: 4,
  factorDimensions: [
    "CONCLUSION_STRUCTURE",
    "CONCLUSION_SEMANTIC_FEATURES",
    "PREMISE_VOCABULARY_OVERLAY",
    "CONCLUSION_SET_RELATIONSHIP",
  ] as const,
  eitherOrRequiresIndependentConclusionSetRelationshipDimension: true,
  eitherOrMustNotBeFoldedIntoConclusionSemanticFeature: true,
  conclusionSemanticFeaturesRemainMultiLabel: true,
  premiseOverlayMustRemainIndependentOfStructureSemanticsAndConclusionSetRelationship: true,
  legacyEitherOrFamilyMapsToConclusionSetRelationshipDimension: true,
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
    "Add at least one additional SBI PO and IBPS PO paper-day using all four independent dimensions to reduce single-day dependence in officer-level sampling.",
    "Seek an independent count source for IBPS RRB PO 04-Aug-2024 Shift-4; preserve its current single-count-source status until then.",
    "Reconcile or explicitly retain the IBPS PO 23-Sep-2023 Shift-2 and IBPS Clerk 25-Aug-2024 source conflicts.",
    "Only after broader systematic sampling, design a separate inactive factorized planner candidate; do not mutate the current production mix inside source-evidence work.",
  ] as const,
});
