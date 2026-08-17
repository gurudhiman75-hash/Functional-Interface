import { SYL_BANKING_PAPER_CENSUS_V1 } from "./banking-paper-census-v1";

export type SylBankingCensusDayReliabilityV2 =
  | "BOUNDED_SHIFT_COUNTS_USABLE"
  | "STRUCTURAL_ONLY_SHIFT_ATTRIBUTION_CONFLICT";

export interface SylBankingCensusDayV2 {
  paperDate: "2024-08-24" | "2024-08-25" | "2024-08-31";
  listedShifts: readonly string[];
  analysisUrls: readonly string[];
  reportedSyllogismMinimum: number;
  reportedSyllogismMaximum: number;
  recoveredQuestionCount: number;
  recoveredShellCounts: Readonly<Record<string, number>>;
  recoveredPremiseOverlayCounts: Readonly<Record<string, number>>;
  reliability: SylBankingCensusDayReliabilityV2;
  shiftAttributionConflict: boolean;
  frequencyEstimationEligible: boolean;
  note: string;
}

const day24: SylBankingCensusDayV2 = Object.freeze({
  paperDate: "2024-08-24",
  listedShifts: ["SHIFT_1", "SHIFT_2", "SHIFT_3", "SHIFT_4"],
  analysisUrls: [
    "https://www.oliveboard.in/blog/ibps-clerk-exam-analysis-2024-1st-shift-24th-august-2024/",
    "https://www.oliveboard.in/blog/ibps-clerk-exam-analysis-2024-2nd-shift-24th-august/",
    "https://www.oliveboard.in/blog/ibps-clerk-exam-analysis-2024-3rd-shift-24th-august-2024/",
    "https://www.oliveboard.in/blog/ibps-clerk-prelims-exam-analysis-2024-4th-shift-24th-august/",
  ],
  reportedSyllogismMinimum: SYL_BANKING_PAPER_CENSUS_V1.reportedSyllogismMinimum,
  reportedSyllogismMaximum: SYL_BANKING_PAPER_CENSUS_V1.reportedSyllogismMaximum,
  recoveredQuestionCount: SYL_BANKING_PAPER_CENSUS_V1.recoveredQuestionCount,
  recoveredShellCounts: SYL_BANKING_PAPER_CENSUS_V1.shellCounts,
  recoveredPremiseOverlayCounts: SYL_BANKING_PAPER_CENSUS_V1.premiseOverlayCounts,
  reliability: "BOUNDED_SHIFT_COUNTS_USABLE",
  shiftAttributionConflict: false,
  frequencyEstimationEligible: false,
  note: "Question recovery covers the reported minimum, but the fourth-shift upper bound remains one question unresolved; retain as bounded evidence, not a production-frequency estimate.",
});

const day25: SylBankingCensusDayV2 = Object.freeze({
  paperDate: "2024-08-25",
  listedShifts: ["SHIFT_1", "SHIFT_2", "SHIFT_3"],
  analysisUrls: [
    "https://www.oliveboard.in/blog/ibps-clerk-exam-analysis-2024-shift-1-25th-august-2024/",
    "https://www.oliveboard.in/blog/ibps-clerk-exam-analysis-2024-25th-august-2024-2nd-shift/",
    "https://www.oliveboard.in/blog/ibps-clerk-exam-analysis-2024-25th-august-3rd-shift/",
    "https://www.oliveboard.in/blog/ibps-clerk-exam-analysis-2024/",
  ],
  reportedSyllogismMinimum: 5,
  reportedSyllogismMaximum: 5,
  recoveredQuestionCount: 7,
  recoveredShellCounts: Object.freeze({ ORDINARY_POSSIBILITY: 7 }),
  recoveredPremiseOverlayCounts: Object.freeze({ ONLY_A_FEW: 7 }),
  reliability: "STRUCTURAL_ONLY_SHIFT_ATTRIBUTION_CONFLICT",
  shiftAttributionConflict: true,
  frequencyEstimationEligible: false,
  note: "Oliveboard topic tables list no Syllogism in Shift 1, two in Shift 2 and three in Shift 3, while independent memory-question labels attribute additional Syllogism items to Shift 1. Use the recovered questions only as structural evidence until shift attribution is reconciled.",
});

const day31: SylBankingCensusDayV2 = Object.freeze({
  paperDate: "2024-08-31",
  listedShifts: ["SHIFT_1", "SHIFT_2", "SHIFT_3"],
  analysisUrls: [
    "https://www.oliveboard.in/blog/ibps-clerk-exam-analysis-2024-shift-1-31st-august-2024/",
    "https://www.oliveboard.in/blog/ibps-clerk-exam-analysis-2024-31st-august-2024-2nd-shift/",
    "https://www.oliveboard.in/blog/ibps-clerk-exam-analysis-2024-31st-august-3rd-shift/",
    "https://www.oliveboard.in/blog/ibps-clerk-exam-analysis-2024/",
  ],
  reportedSyllogismMinimum: 11,
  reportedSyllogismMaximum: 11,
  recoveredQuestionCount: 5,
  recoveredShellCounts: Object.freeze({
    ORDINARY_POSSIBILITY: 3,
    CAN_NEVER: 1,
    STANDARD_DEFINITE: 1,
  }),
  recoveredPremiseOverlayCounts: Object.freeze({ ONLY_A_FEW: 4, CORE: 1 }),
  reliability: "BOUNDED_SHIFT_COUNTS_USABLE",
  shiftAttributionConflict: false,
  frequencyEstimationEligible: false,
  note: "Shift analyses report 3, 5 and 3 Syllogism questions. Five question-level items have been recovered so far, so shell counts are a partial sample and must not be extrapolated to the unrecovered six.",
});

export const SYL_BANKING_PAPER_CENSUS_DAYS_V2: readonly SylBankingCensusDayV2[] = Object.freeze([
  day24,
  day25,
  day31,
]);

function sumRecord(values: readonly Readonly<Record<string, number>>[]): Readonly<Record<string, number>> {
  return Object.freeze(values.reduce((result, record) => {
    for (const [key, value] of Object.entries(record)) result[key] = (result[key] ?? 0) + value;
    return result;
  }, {} as Record<string, number>));
}

const recoveredShellCounts = sumRecord(SYL_BANKING_PAPER_CENSUS_DAYS_V2.map((day) => day.recoveredShellCounts));
const recoveredOverlayCounts = sumRecord(SYL_BANKING_PAPER_CENSUS_DAYS_V2.map((day) => day.recoveredPremiseOverlayCounts));
const recoveredQuestionCount = SYL_BANKING_PAPER_CENSUS_DAYS_V2.reduce((sum, day) => sum + day.recoveredQuestionCount, 0);

export const SYL_BANKING_PAPER_CENSUS_V2 = Object.freeze({
  authorityId: "SYL_001_BANKING_PAPER_CENSUS_V2",
  supersedes: "SYL_001_BANKING_PAPER_CENSUS_V1",
  status: "MULTI_DAY_IBPS_CLERK_SAMPLE_SOURCE_MODEL_CONFIRMED_WEIGHTS_UNFROZEN",
  examSeries: "IBPS_CLERK_PRELIMS",
  sampleDates: SYL_BANKING_PAPER_CENSUS_DAYS_V2.map((day) => day.paperDate),
  sampledPaperDays: SYL_BANKING_PAPER_CENSUS_DAYS_V2.length,
  recoveredQuestionCount,
  recoveredShellCounts,
  recoveredPremiseOverlayCounts: recoveredOverlayCounts,
  structuralRecoveredCountsOnly: true,
  shiftNormalizedHistoricalFrequencyClaimPermitted: false,
  conflictedPaperDays: SYL_BANKING_PAPER_CENSUS_DAYS_V2.filter((day) => day.shiftAttributionConflict).map((day) => day.paperDate),
  partialQuestionRecoveryPaperDays: ["2024-08-24", "2024-08-31"] as const,
  twoAxisWeightModelSupported: true,
  twoAxisDimensions: ["PRIMARY_CONCLUSION_SHELL", "PREMISE_VOCABULARY_OVERLAY"] as const,
  premiseOverlayMustNotBeAllocatedAsExclusiveShellWeight: true,
  currentProvisionalMixChanged: false,
  historicalFrequencyClaimPermitted: false,
  productionPercentagesFrozen: false,
  crossExamGeneralizationPermitted: false,
  connectedToProductionPlanner: false,
  activationPermitted: false,
  nextSamplePlan: [
    "Reconcile 25-Aug shift attribution before using that day in any normalized count.",
    "Recover more 31-Aug question-level items without imputing shell classes for missing questions.",
    "Add stratified SBI Clerk, SBI PO, IBPS PO and IBPS RRB PO paper-days using the same two-axis protocol.",
    "Only then estimate shell weights and premise-overlay rates separately.",
  ] as const,
});
