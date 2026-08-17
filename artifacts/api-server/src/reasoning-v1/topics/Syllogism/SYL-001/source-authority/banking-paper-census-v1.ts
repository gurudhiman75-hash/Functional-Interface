export type SylBankingCensusShellV1 =
  | "ORDINARY_POSSIBILITY"
  | "CAN_NEVER"
  | "CAN_NEVER_PLUS_ORDINARY_POSSIBILITY"
  | "EITHER_OR"
  | "STANDARD_DEFINITE";

export type SylBankingCensusPremiseOverlayV1 =
  | "ONLY_A_FEW"
  | "VERY_FEW";

export interface SylBankingCensusQuestionV1 {
  evidenceId: string;
  shift: "SHIFT_2" | "SHIFT_3" | "SHIFT_4";
  sourceUrl: string;
  primaryShell: SylBankingCensusShellV1;
  premiseOverlay: SylBankingCensusPremiseOverlayV1;
  hasPossibilityConclusion: boolean;
  hasCanNeverConclusion: boolean;
  hasEitherOrSemanticAnswer: boolean;
  statementCount: 3;
  conclusionCount: 2;
}

export interface SylBankingCensusShiftV1 {
  shift: "SHIFT_1" | "SHIFT_2" | "SHIFT_3" | "SHIFT_4";
  analysisUrl: string;
  reportedSyllogismMin: number;
  reportedSyllogismMax: number;
  recoveredQuestionCount: number;
  completeness: "COMPLETE_EXACT" | "COMPLETE_ZERO" | "PARTIAL_UPPER_BOUND_ONE_UNRESOLVED";
}

export const SYL_BANKING_PAPER_CENSUS_QUESTIONS_V1: readonly SylBankingCensusQuestionV1[] = Object.freeze([
  {
    evidenceId: "CENSUS-IBPS-CLERK-2024-08-24-S2-287411",
    shift: "SHIFT_2",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-following-question-three-statements-are-given-and-two-2482-287411",
    primaryShell: "ORDINARY_POSSIBILITY",
    premiseOverlay: "ONLY_A_FEW",
    hasPossibilityConclusion: true,
    hasCanNeverConclusion: false,
    hasEitherOrSemanticAnswer: false,
    statementCount: 3,
    conclusionCount: 2,
  },
  {
    evidenceId: "CENSUS-IBPS-CLERK-2024-08-24-S2-287466",
    shift: "SHIFT_2",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-following-question-three-statements-are-given-and-two-2482-287466",
    primaryShell: "ORDINARY_POSSIBILITY",
    premiseOverlay: "ONLY_A_FEW",
    hasPossibilityConclusion: true,
    hasCanNeverConclusion: false,
    hasEitherOrSemanticAnswer: false,
    statementCount: 3,
    conclusionCount: 2,
  },
  {
    evidenceId: "CENSUS-IBPS-CLERK-2024-08-24-S2-287515",
    shift: "SHIFT_2",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-following-question-three-statements-are-given-and-two-2482-287515",
    primaryShell: "EITHER_OR",
    premiseOverlay: "ONLY_A_FEW",
    hasPossibilityConclusion: false,
    hasCanNeverConclusion: false,
    hasEitherOrSemanticAnswer: true,
    statementCount: 3,
    conclusionCount: 2,
  },
  {
    evidenceId: "CENSUS-IBPS-CLERK-2024-08-24-S3-309957",
    shift: "SHIFT_3",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-question-given-below-three-statements-are-given-followed-two-2482-309957",
    primaryShell: "ORDINARY_POSSIBILITY",
    premiseOverlay: "ONLY_A_FEW",
    hasPossibilityConclusion: true,
    hasCanNeverConclusion: false,
    hasEitherOrSemanticAnswer: false,
    statementCount: 3,
    conclusionCount: 2,
  },
  {
    evidenceId: "CENSUS-IBPS-CLERK-2024-08-24-S3-310022",
    shift: "SHIFT_3",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-question-given-below-three-statements-are-given-followed-two-2482-310022",
    primaryShell: "EITHER_OR",
    premiseOverlay: "ONLY_A_FEW",
    hasPossibilityConclusion: false,
    hasCanNeverConclusion: false,
    hasEitherOrSemanticAnswer: true,
    statementCount: 3,
    conclusionCount: 2,
  },
  {
    evidenceId: "CENSUS-IBPS-CLERK-2024-08-24-S3-310093",
    shift: "SHIFT_3",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-question-given-below-three-statements-are-given-followed-two-2482-310093",
    primaryShell: "CAN_NEVER",
    premiseOverlay: "VERY_FEW",
    hasPossibilityConclusion: false,
    hasCanNeverConclusion: true,
    hasEitherOrSemanticAnswer: false,
    statementCount: 3,
    conclusionCount: 2,
  },
  {
    evidenceId: "CENSUS-IBPS-CLERK-2024-08-24-S4-335455",
    shift: "SHIFT_4",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-following-question-three-statements-are-given-and-two-2482-335455",
    primaryShell: "CAN_NEVER_PLUS_ORDINARY_POSSIBILITY",
    premiseOverlay: "ONLY_A_FEW",
    hasPossibilityConclusion: true,
    hasCanNeverConclusion: true,
    hasEitherOrSemanticAnswer: false,
    statementCount: 3,
    conclusionCount: 2,
  },
  {
    evidenceId: "CENSUS-IBPS-CLERK-2024-08-24-S4-335395",
    shift: "SHIFT_4",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-following-question-three-statements-are-given-and-two-2482-335395",
    primaryShell: "ORDINARY_POSSIBILITY",
    premiseOverlay: "ONLY_A_FEW",
    hasPossibilityConclusion: true,
    hasCanNeverConclusion: false,
    hasEitherOrSemanticAnswer: false,
    statementCount: 3,
    conclusionCount: 2,
  },
  {
    evidenceId: "CENSUS-IBPS-CLERK-2024-08-24-S4-335341",
    shift: "SHIFT_4",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-following-question-three-statements-are-given-and-two-2482-335341",
    primaryShell: "STANDARD_DEFINITE",
    premiseOverlay: "ONLY_A_FEW",
    hasPossibilityConclusion: false,
    hasCanNeverConclusion: false,
    hasEitherOrSemanticAnswer: false,
    statementCount: 3,
    conclusionCount: 2,
  },
]);

export const SYL_BANKING_PAPER_CENSUS_SHIFTS_V1: readonly SylBankingCensusShiftV1[] = Object.freeze([
  {
    shift: "SHIFT_1",
    analysisUrl: "https://www.oliveboard.in/blog/ibps-clerk-exam-analysis-2024-1st-shift-24th-august-2024/",
    reportedSyllogismMin: 0,
    reportedSyllogismMax: 0,
    recoveredQuestionCount: 0,
    completeness: "COMPLETE_ZERO",
  },
  {
    shift: "SHIFT_2",
    analysisUrl: "https://www.oliveboard.in/blog/ibps-clerk-exam-analysis-2024-2nd-shift-24th-august/",
    reportedSyllogismMin: 3,
    reportedSyllogismMax: 3,
    recoveredQuestionCount: 3,
    completeness: "COMPLETE_EXACT",
  },
  {
    shift: "SHIFT_3",
    analysisUrl: "https://www.oliveboard.in/blog/ibps-clerk-exam-analysis-2024-3rd-shift-24th-august-2024/",
    reportedSyllogismMin: 3,
    reportedSyllogismMax: 3,
    recoveredQuestionCount: 3,
    completeness: "COMPLETE_EXACT",
  },
  {
    shift: "SHIFT_4",
    analysisUrl: "https://www.oliveboard.in/blog/ibps-clerk-prelims-exam-analysis-2024-4th-shift-24th-august/",
    reportedSyllogismMin: 3,
    reportedSyllogismMax: 4,
    recoveredQuestionCount: 3,
    completeness: "PARTIAL_UPPER_BOUND_ONE_UNRESOLVED",
  },
]);

function countBy<T extends string>(values: readonly T[]): Readonly<Record<T, number>> {
  return Object.freeze(values.reduce((result, value) => {
    result[value] = (result[value] ?? 0) + 1;
    return result;
  }, {} as Record<T, number>));
}

const shellCounts = countBy(SYL_BANKING_PAPER_CENSUS_QUESTIONS_V1.map((entry) => entry.primaryShell));
const overlayCounts = countBy(SYL_BANKING_PAPER_CENSUS_QUESTIONS_V1.map((entry) => entry.premiseOverlay));
const reportedMinimum = SYL_BANKING_PAPER_CENSUS_SHIFTS_V1.reduce((sum, entry) => sum + entry.reportedSyllogismMin, 0);
const reportedMaximum = SYL_BANKING_PAPER_CENSUS_SHIFTS_V1.reduce((sum, entry) => sum + entry.reportedSyllogismMax, 0);
const recovered = SYL_BANKING_PAPER_CENSUS_QUESTIONS_V1.length;

export const SYL_BANKING_PAPER_CENSUS_V1 = Object.freeze({
  authorityId: "SYL_001_BANKING_PAPER_CENSUS_V1",
  status: "BOUNDED_DAY_CENSUS_MINIMUM_COMPLETE_UPPER_BOUND_ONE_UNRESOLVED",
  examSeries: "IBPS_CLERK_PRELIMS",
  paperDate: "2024-08-24",
  sourceClass: "INDEPENDENT_MEMORY_BASED_PYP_ARCHIVE",
  shiftCount: 4,
  reportedSyllogismMinimum: reportedMinimum,
  reportedSyllogismMaximum: reportedMaximum,
  recoveredQuestionCount: recovered,
  minimumReportedCoverageRatio: recovered / reportedMinimum,
  maximumReportedCoverageRatio: recovered / reportedMaximum,
  shellCounts,
  premiseOverlayCounts: overlayCounts,
  questionsWithOnlyOrVeryFewPremise: recovered,
  questionsWithPossibilityConclusion: SYL_BANKING_PAPER_CENSUS_QUESTIONS_V1.filter((entry) => entry.hasPossibilityConclusion).length,
  questionsWithCanNeverConclusion: SYL_BANKING_PAPER_CENSUS_QUESTIONS_V1.filter((entry) => entry.hasCanNeverConclusion).length,
  questionsWithEitherOrSemanticAnswer: SYL_BANKING_PAPER_CENSUS_QUESTIONS_V1.filter((entry) => entry.hasEitherOrSemanticAnswer).length,
  allRecoveredQuestionsUseThreeStatements: SYL_BANKING_PAPER_CENSUS_QUESTIONS_V1.every((entry) => entry.statementCount === 3),
  allRecoveredQuestionsUseTwoConclusions: SYL_BANKING_PAPER_CENSUS_QUESTIONS_V1.every((entry) => entry.conclusionCount === 2),
  keyDesignFinding: "ONLY_AND_ONLY_A_FEW_IS_A_PREMISE_OVERLAY_NOT_AN_EXCLUSIVE_SHELL_FAMILY",
  twoAxisWeightModelRequiredBeforeFreeze: true,
  shellAxis: [
    "STANDARD_TWO_CONCLUSION",
    "EITHER_OR",
    "ORDINARY_POSSIBILITY",
    "CAN_NEVER",
    "MIXED_MODAL",
    "ADVANCED_MULTI_CONCLUSION",
  ] as const,
  premiseOverlayAxis: ["CORE", "ONLY", "ONLY_A_FEW_OR_VERY_FEW"] as const,
  currentProvisionalMixChanged: false,
  exactPercentageWeightingPermitted: false,
  systematicCrossExamCensusComplete: false,
  productionPercentagesFrozen: false,
  connectedToProductionPlanner: false,
  activationPermitted: false,
  nextSamplePlan: [
    "Complete the unresolved fourth-shift upper-bound question if recoverable.",
    "Add the remaining IBPS Clerk 2024 exam dates using the same shift-complete protocol.",
    "Add stratified SBI Clerk, SBI PO, IBPS PO and IBPS RRB PO paper-days before estimating shell weights.",
    "Estimate premise-overlay frequencies separately from shell/archetype frequencies.",
  ] as const,
});
