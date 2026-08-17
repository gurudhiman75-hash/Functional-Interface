import {
  SYL_BANKING_CROSS_EXAM_CENSUS_V1,
  SYL_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_V1,
} from "./banking-cross-exam-census-v1";
import { SYL_BANKING_PAPER_CENSUS_V2 } from "./banking-paper-census-v2";

export type SylBankingSbiPoRecoveredShellV2 =
  | "ORDINARY_POSSIBILITY"
  | "STANDARD_DEFINITE";

export type SylBankingSbiPoPremiseOverlayV2 = "CORE" | "ONLY_A_FEW";

export interface SylBankingCrossExamSbiPoRecoveredQuestionV2 {
  evidenceId: string;
  examSeries: "SBI_PO_PRELIMS";
  paperDate: "2023-11-06";
  shift: "SHIFT_2";
  sourceUrl: string;
  primaryShell: SylBankingSbiPoRecoveredShellV2;
  premiseOverlay: SylBankingSbiPoPremiseOverlayV2;
  provenance: "MEMORY_BASED_TRANSCRIPTION";
}

export const SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_QUESTIONS_V2: readonly SylBankingCrossExamSbiPoRecoveredQuestionV2[] = Object.freeze([
  {
    evidenceId: "CROSS-SBI-PO-2023-11-06-S2-WALLET-SHOE",
    examSeries: "SBI_PO_PRELIMS",
    paperDate: "2023-11-06",
    shift: "SHIFT_2",
    sourceUrl: "https://testbook.com/question-answer/direction-in-the-question-below-are-given-three-s--6661ab6d2c33074b1b4b0f48",
    primaryShell: "ORDINARY_POSSIBILITY",
    premiseOverlay: "ONLY_A_FEW",
    provenance: "MEMORY_BASED_TRANSCRIPTION",
  },
  {
    evidenceId: "CROSS-SBI-PO-2023-11-06-S2-GLUE-RULER",
    examSeries: "SBI_PO_PRELIMS",
    paperDate: "2023-11-06",
    shift: "SHIFT_2",
    sourceUrl: "https://testbook.com/question-answer/direction-in-the-question-below-are-given-three-s--6661aa3a8704d72c3d054cef",
    primaryShell: "STANDARD_DEFINITE",
    premiseOverlay: "ONLY_A_FEW",
    provenance: "MEMORY_BASED_TRANSCRIPTION",
  },
  {
    evidenceId: "CROSS-SBI-PO-2023-11-06-S2-COIN-BANKNOTE",
    examSeries: "SBI_PO_PRELIMS",
    paperDate: "2023-11-06",
    shift: "SHIFT_2",
    sourceUrl: "https://testbook.com/question-answer/direction-in-the-question-below-are-given-three-s--6661acd9eab7846aa1837bf2",
    primaryShell: "ORDINARY_POSSIBILITY",
    premiseOverlay: "CORE",
    provenance: "MEMORY_BASED_TRANSCRIPTION",
  },
]);

const sbiPoRecoveredShellCounts = Object.freeze({
  ORDINARY_POSSIBILITY: SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_QUESTIONS_V2.filter((entry) => entry.primaryShell === "ORDINARY_POSSIBILITY").length,
  STANDARD_DEFINITE: SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_QUESTIONS_V2.filter((entry) => entry.primaryShell === "STANDARD_DEFINITE").length,
});

const sbiPoRecoveredPremiseOverlayCounts = Object.freeze({
  ONLY_A_FEW: SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_QUESTIONS_V2.filter((entry) => entry.premiseOverlay === "ONLY_A_FEW").length,
  CORE: SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_QUESTIONS_V2.filter((entry) => entry.premiseOverlay === "CORE").length,
});

const sbiPoOnlyAFewShells = new Set(
  SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_QUESTIONS_V2
    .filter((entry) => entry.premiseOverlay === "ONLY_A_FEW")
    .map((entry) => entry.primaryShell),
);

export const SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2 = Object.freeze({
  authorityId: "SYL_001_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2",
  examSeries: "SBI_PO_PRELIMS",
  paperDate: "2023-11-06",
  shift: "SHIFT_2",
  reportedSyllogismCount: 4,
  shiftCountSources: Object.freeze([
    "https://www.bankersadda.com/sbi-po-exam-analysis-2023-6-november-shift-2/",
    "https://www.practicemock.com/blog/sbi-po-exam-analysis-2023-6-november-all-shifts-prelims-analysis/",
    "https://www.ibpsguide.com/sbi-po-prelims-exam-analysis-2023/",
  ]),
  exactCountSourceAgreement: 3,
  recoveredQuestionCount: SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_QUESTIONS_V2.length,
  unresolvedQuestionCount: 4 - SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_QUESTIONS_V2.length,
  recoveredQuestionCoverageRatio: SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_QUESTIONS_V2.length / 4,
  recoveredShellCounts: sbiPoRecoveredShellCounts,
  recoveredPremiseOverlayCounts: sbiPoRecoveredPremiseOverlayCounts,
  onlyAFewObservedAcrossPrimaryShellCount: sbiPoOnlyAFewShells.size,
  onlyAFewCrossesPrimaryShells: sbiPoOnlyAFewShells.size >= 2,
  recoveryStatus: "BOUNDED_3_OF_4_ONE_UNRESOLVED",
  unrecoveredQuestionShellImputed: false,
  frequencyEstimationEligible: false,
  exactShellWeightEstimationEligible: false,
});

const structuralQuestionRecordsObserved =
  SYL_BANKING_PAPER_CENSUS_V2.recoveredQuestionCount
  + SYL_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_V1.recoveredQuestionCount
  + SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2.recoveredQuestionCount;

export const SYL_BANKING_CROSS_EXAM_CENSUS_V2 = Object.freeze({
  authorityId: "SYL_001_BANKING_CROSS_EXAM_CENSUS_V2",
  supersedes: SYL_BANKING_CROSS_EXAM_CENSUS_V1.authorityId,
  status: "THREE_EXAM_SERIES_STRUCTURAL_MODEL_SUPPORTED_WEIGHTS_UNFROZEN",
  ibpsClerkAuthority: SYL_BANKING_PAPER_CENSUS_V2.authorityId,
  sbiClerkAuthority: SYL_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_V1.authorityId,
  sbiPoAuthority: SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2.authorityId,
  examSeriesObserved: ["IBPS_CLERK_PRELIMS", "SBI_CLERK_PRELIMS", "SBI_PO_PRELIMS"] as const,
  examSeriesCount: 3,
  structuralQuestionRecordsObserved,
  structuralQuestionRecordsAreFrequencyDenominator: false,
  thirdSeriesIndependentSupportObserved: true,
  twoAxisWeightModelObservedAcrossExamSeries: true,
  sbiPoOnlyAFewCrossesPrimaryShells: SYL_BANKING_CROSS_EXAM_SBI_PO_2023_11_06_S2_V2.onlyAFewCrossesPrimaryShells,
  modelFinding: "PREMISE_VOCABULARY_OVERLAYS_RECUR_ACROSS_DISTINCT_PRIMARY_CONCLUSION_SHELLS_AND_THREE_BANKING_EXAM_SERIES",
  premiseOverlayMustRemainIndependentOfPrimaryShell: true,
  onlyAndOnlyAFewExclusiveShellWeightDeprecatedForFutureFreezeModel: true,
  existingPlannerFamilyStillUntouchedUntil_REDESIGN: "BANK_ONLY_AND_ONLY_A_FEW",
  currentProvisionalMixChanged: false,
  crossExamModelSupportObserved: true,
  crossExamWeightGeneralizationPermitted: false,
  historicalFrequencyClaimPermitted: false,
  exactPercentageWeightingPermitted: false,
  productionPercentagesFrozen: false,
  connectedToProductionPlanner: false,
  registrationPermitted: false,
  activationPermitted: false,
  nextSamplePlan: [
    "Recover the fourth SBI PO 06-Nov-2023 Shift-2 Syllogism question if independently identifiable; do not impute its shell.",
    "Add one complete or bounded IBPS PO paper-day using the same shell-plus-overlay protocol.",
    "Add one complete or bounded IBPS RRB PO paper-day using the same shell-plus-overlay protocol.",
    "Resolve the IBPS Clerk 25-Aug shift-attribution conflict before normalized within-series estimates.",
    "Only after broader systematic sampling, propose a separate shell-weight axis and premise-overlay-rate axis as a distinct inactive redesign checkpoint.",
  ] as const,
});
