import { SYL_BANKING_PAPER_CENSUS_V2 } from "./banking-paper-census-v2";

export interface SylBankingCrossExamRecoveredQuestionV1 {
  evidenceId: string;
  examSeries: "SBI_CLERK_PRELIMS";
  paperDate: "2025-02-22";
  shift: "SHIFT_1" | "SHIFT_4";
  sourceUrl: string;
  primaryShell: "ORDINARY_POSSIBILITY" | "CAN_NEVER";
  premiseOverlay: "ONLY_A_FEW";
  provenance: "MEMORY_BASED_PAPER_ARCHIVE" | "INDEPENDENT_PYP_ARCHIVE";
}

export const SYL_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_QUESTIONS_V1: readonly SylBankingCrossExamRecoveredQuestionV1[] = Object.freeze([
  {
    evidenceId: "CROSS-SBI-CLERK-2025-02-22-S1-CITIES-DISTRICTS",
    examSeries: "SBI_CLERK_PRELIMS",
    paperDate: "2025-02-22",
    shift: "SHIFT_1",
    sourceUrl: "https://testbook.com/question-answer/directionin-each-question-below-are-given-s--641050d28e799cd642d6bac7",
    primaryShell: "ORDINARY_POSSIBILITY",
    premiseOverlay: "ONLY_A_FEW",
    provenance: "MEMORY_BASED_PAPER_ARCHIVE",
  },
  {
    evidenceId: "CROSS-SBI-CLERK-2025-02-22-S4-POSSIBILITY",
    examSeries: "SBI_CLERK_PRELIMS",
    paperDate: "2025-02-22",
    shift: "SHIFT_4",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-question-given-below-a-set-of-statements-is-given-followed-by",
    primaryShell: "ORDINARY_POSSIBILITY",
    premiseOverlay: "ONLY_A_FEW",
    provenance: "INDEPENDENT_PYP_ARCHIVE",
  },
  {
    evidenceId: "CROSS-SBI-CLERK-2025-02-22-S4-CAN-NEVER",
    examSeries: "SBI_CLERK_PRELIMS",
    paperDate: "2025-02-22",
    shift: "SHIFT_4",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-question-given-below-a-set-of-statements-are-given-followed-by",
    primaryShell: "CAN_NEVER",
    premiseOverlay: "ONLY_A_FEW",
    provenance: "INDEPENDENT_PYP_ARCHIVE",
  },
]);

export const SYL_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_V1 = Object.freeze({
  authorityId: "SYL_001_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_V1",
  examSeries: "SBI_CLERK_PRELIMS",
  paperDate: "2025-02-22",
  shiftCount: 4,
  shiftReportedSyllogismCounts: Object.freeze({
    SHIFT_1: 4,
    SHIFT_2: 4,
    SHIFT_3: 4,
    SHIFT_4: 3,
  }),
  reportedSyllogismTotal: 15,
  recoveredQuestionCount: SYL_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_QUESTIONS_V1.length,
  recoveredQuestionCoverageRatio: SYL_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_QUESTIONS_V1.length / 15,
  recoveredShellCounts: Object.freeze({ ORDINARY_POSSIBILITY: 2, CAN_NEVER: 1 }),
  recoveredPremiseOverlayCounts: Object.freeze({ ONLY_A_FEW: 3 }),
  analysisUrls: Object.freeze({
    SHIFT_1: "https://www.oliveboard.in/blog/sbi-clerk-prelims-exam-analysis-2025-shift-1-22nd-january/",
    SHIFT_2: "https://www.oliveboard.in/blog/sbi-clerk-prelims-exam-analysis-2025-shift-2-22nd-january/",
    SHIFT_3: "https://www.oliveboard.in/blog/sbi-clerk-exam-analysis-2025-shift-3-22nd-february/",
    SHIFT_4: "https://www.oliveboard.in/blog/sbi-clerk-exam-analysis-2025-22nd-february-shift-4/",
  }),
  sourceDateLabelCaveat: "SHIFT_1_AND_SHIFT_2_URL_TITLES_SAY_JANUARY_BUT_ARE_PUBLISHED_22_FEBRUARY_AND_LINKED_FROM_THE_22_FEBRUARY_ALL_SHIFTS_ARCHIVE",
  recoveryStatus: "PARTIAL_3_OF_15_STRUCTURAL_SAMPLE",
  frequencyEstimationEligible: false,
  exactShellWeightEstimationEligible: false,
});

const recoveredShells = new Set(SYL_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_QUESTIONS_V1.map((entry) => entry.primaryShell));
const recoveredOverlays = new Set(SYL_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_QUESTIONS_V1.map((entry) => entry.premiseOverlay));

export const SYL_BANKING_CROSS_EXAM_CENSUS_V1 = Object.freeze({
  authorityId: "SYL_001_BANKING_CROSS_EXAM_CENSUS_V1",
  status: "TWO_EXAM_SERIES_EARLY_STRUCTURAL_SUPPORT_WEIGHTS_UNFROZEN",
  ibpsClerkAuthority: SYL_BANKING_PAPER_CENSUS_V2.authorityId,
  sbiClerkAuthority: SYL_BANKING_CROSS_EXAM_SBI_CLERK_2025_02_22_V1.authorityId,
  examSeriesObserved: ["IBPS_CLERK_PRELIMS", "SBI_CLERK_PRELIMS"] as const,
  examSeriesCount: 2,
  twoAxisWeightModelObservedAcrossExamSeries: recoveredShells.size >= 2 && recoveredOverlays.has("ONLY_A_FEW"),
  modelFinding: "PREMISE_VOCABULARY_OVERLAYS_CROSS_PRIMARY_CONCLUSION_SHELLS_IN_BOTH_IBPS_AND_SBI_CLERK_SAMPLES",
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
  activationPermitted: false,
  nextSamplePlan: [
    "Recover more SBI Clerk 22-Feb-2025 question-level items before estimating within-series shell shares.",
    "Add one complete or bounded SBI PO paper-day.",
    "Add one complete or bounded IBPS PO paper-day.",
    "Add one complete or bounded IBPS RRB PO paper-day.",
    "Only after broader cross-series sampling, redesign the provisional planner into independent shell and premise-overlay axes.",
  ] as const,
});
