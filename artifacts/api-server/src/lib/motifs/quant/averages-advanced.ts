import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

type AvgCategory =
  | "changes"
  | "sequences"
  | "weighted"
  | "applications"
  | "algebraic";

type AvgMotifDraft = {
  id: string;
  category: AvgCategory;
  operations: string[];
  hiddenStructures: string[];
  distractors: string[];
  difficulty: 1 | 2 | 3 | 4;
};

export const averageBalanceDistractorRegistry = [
  "Count_Shift_Neglect",
  "Simple_vs_Weighted",
  "Age_Time_Shift_Partial",
  "Replacement_Total_Constant",
  "Misread_Sign_Flip",
  "Bowling_Avg_Inversion",
  "Consecutive_Middle_Error",
  "Inclusion_Sum_Only",
  "Units_Mismatch",
  "Boundary_Overlap_Double_Count",
  "Deviation_Arithmetic_Error",
  "Ratio_Inversion",
  "Sum_to_Avg_Failure",
  "Distinct_Integer_Assumption",
  "Zero_Value_Omission",
  "Cricket_Inning_Count",
  "Successive_Avg_Assumption",
  "Temp_Diff_Linear",
  "Fraction_Decimal_Truncation",
  "Missing_Data_Trap",
] as const;

export const averageBalanceMotifDrafts: AvgMotifDraft[] = [
  { id: "avg-change-inclusion", category: "changes", operations: ["include new member"], hiddenStructures: ["old sum plus new value equals new sum"], distractors: ["Count_Shift_Neglect"], difficulty: 2 },
  { id: "avg-change-exclusion", category: "changes", operations: ["exclude member"], hiddenStructures: ["old sum minus leaving value equals new sum"], distractors: ["Count_Shift_Neglect"], difficulty: 2 },
  { id: "avg-change-replacement", category: "changes", operations: ["replacement delta"], hiddenStructures: ["count remains constant"], distractors: ["Replacement_Total_Constant"], difficulty: 2 },
  { id: "avg-correction-misread", category: "changes", operations: ["misread correction"], hiddenStructures: ["corrected sum adjustment"], distractors: ["Misread_Sign_Flip"], difficulty: 3 },
  { id: "avg-change-double-inclusion", category: "changes", operations: ["include two members"], hiddenStructures: ["two-value contribution"], distractors: ["Count_Shift_Neglect"], difficulty: 3 },
  { id: "avg-change-join-leave", category: "changes", operations: ["join and leave"], hiddenStructures: ["net sum and count transition"], distractors: ["Count_Shift_Neglect"], difficulty: 4 },
  { id: "avg-seq-consecutive", category: "sequences", operations: ["consecutive average"], hiddenStructures: ["middle term balance"], distractors: ["Consecutive_Middle_Error"], difficulty: 2 },
  { id: "avg-seq-shift", category: "sequences", operations: ["extend consecutive sequence"], hiddenStructures: ["new middle shifts"], distractors: ["Consecutive_Middle_Error"], difficulty: 2 },
  { id: "avg-seq-ap", category: "sequences", operations: ["AP average"], hiddenStructures: ["first last midpoint"], distractors: ["Consecutive_Middle_Error"], difficulty: 2 },
  { id: "avg-seq-even", category: "sequences", operations: ["consecutive even numbers"], hiddenStructures: ["symmetric even sequence"], distractors: ["Consecutive_Middle_Error"], difficulty: 2 },
  { id: "avg-seq-odd", category: "sequences", operations: ["consecutive odd numbers"], hiddenStructures: ["symmetric odd sequence"], distractors: ["Consecutive_Middle_Error"], difficulty: 2 },
  { id: "avg-seq-variable", category: "sequences", operations: ["solve sequence variable"], hiddenStructures: ["average equals central expression"], distractors: ["Sum_to_Avg_Failure"], difficulty: 3 },
  { id: "avg-weight-combine", category: "weighted", operations: ["combine two groups"], hiddenStructures: ["weighted contribution"], distractors: ["Simple_vs_Weighted"], difficulty: 3 },
  { id: "avg-weight-missing-n", category: "weighted", operations: ["infer group size ratio"], hiddenStructures: ["deviation balance"], distractors: ["Ratio_Inversion"], difficulty: 3 },
  { id: "avg-weight-missing-a", category: "weighted", operations: ["infer subgroup average"], hiddenStructures: ["total minus known group"], distractors: ["Successive_Avg_Assumption"], difficulty: 3 },
  { id: "avg-weight-three-group", category: "weighted", operations: ["combine three groups"], hiddenStructures: ["multi-group weighted sum"], distractors: ["Simple_vs_Weighted"], difficulty: 3 },
  { id: "avg-weight-salary", category: "weighted", operations: ["salary group average"], hiddenStructures: ["employee-count weighting"], distractors: ["Simple_vs_Weighted"], difficulty: 3 },
  { id: "avg-weight-production", category: "weighted", operations: ["production weighted average"], hiddenStructures: ["days as weights"], distractors: ["Successive_Avg_Assumption"], difficulty: 3 },
  { id: "avg-app-cricket-batting", category: "applications", operations: ["batting average update"], hiddenStructures: ["new innings count"], distractors: ["Cricket_Inning_Count"], difficulty: 3 },
  { id: "avg-app-cricket-bowling", category: "applications", operations: ["bowling average update"], hiddenStructures: ["runs per wicket decreases"], distractors: ["Bowling_Avg_Inversion"], difficulty: 4 },
  { id: "avg-app-age-family", category: "applications", operations: ["age average with birth"], hiddenStructures: ["uniform time shift plus new member"], distractors: ["Age_Time_Shift_Partial"], difficulty: 3 },
  { id: "avg-app-temp-weekly", category: "applications", operations: ["overlapping temperature averages"], hiddenStructures: ["shared days cancel"], distractors: ["Temp_Diff_Linear"], difficulty: 4 },
  { id: "avg-app-score-target", category: "applications", operations: ["target score reconstruction"], hiddenStructures: ["required final total"], distractors: ["Sum_to_Avg_Failure"], difficulty: 2 },
  { id: "avg-app-expenditure", category: "applications", operations: ["household expenditure average"], hiddenStructures: ["count transition"], distractors: ["Count_Shift_Neglect"], difficulty: 2 },
  { id: "avg-app-zero-score", category: "applications", operations: ["zero included in count"], hiddenStructures: ["zero still contributes count"], distractors: ["Zero_Value_Omission"], difficulty: 3 },
  { id: "avg-alg-deviation", category: "algebraic", operations: ["assumed mean deviations"], hiddenStructures: ["average plus net deviation"], distractors: ["Deviation_Arithmetic_Error"], difficulty: 3 },
  { id: "avg-alg-max-min", category: "algebraic", operations: ["maximum distinct integer"], hiddenStructures: ["minimize other values"], distractors: ["Distinct_Integer_Assumption"], difficulty: 4 },
  { id: "avg-alg-variable", category: "algebraic", operations: ["solve average variable"], hiddenStructures: ["symbolic sum state"], distractors: ["Sum_to_Avg_Failure"], difficulty: 3 },
  { id: "avg-alg-overlap-boundary", category: "algebraic", operations: ["overlap average reconstruction"], hiddenStructures: ["overlap counted twice"], distractors: ["Boundary_Overlap_Double_Count"], difficulty: 4 },
  { id: "avg-alg-first-last-overlap", category: "algebraic", operations: ["first last overlap"], hiddenStructures: ["middle region repeated"], distractors: ["Boundary_Overlap_Double_Count"], difficulty: 4 },
  { id: "avg-alg-insufficient-data", category: "algebraic", operations: ["information sufficiency"], hiddenStructures: ["missing group size"], distractors: ["Missing_Data_Trap"], difficulty: 4 },
  { id: "avg-alg-fraction-result", category: "algebraic", operations: ["fractional average"], hiddenStructures: ["keep exact mixed fraction"], distractors: ["Fraction_Decimal_Truncation"], difficulty: 3 },
  { id: "avg-alg-deviation-missing", category: "algebraic", operations: ["missing value from deviations"], hiddenStructures: ["net deviation zero around mean"], distractors: ["Deviation_Arithmetic_Error"], difficulty: 3 },
  { id: "avg-weight-ratio-balance", category: "weighted", operations: ["weighted ratio balance"], hiddenStructures: ["distance from mean gives ratio"], distractors: ["Ratio_Inversion"], difficulty: 3 },
  { id: "avg-change-months", category: "changes", operations: ["month-year unit average"], hiddenStructures: ["convert months to years"], distractors: ["Units_Mismatch"], difficulty: 3 },
];

const categoryReasoning: Record<AvgCategory, string[]> = {
  changes: ["sum-state-transition", "balance-scale-average"],
  sequences: ["symmetry-compression", "central-term-average"],
  weighted: ["weighted-contribution", "deviation-balance"],
  applications: ["contextual-average-state", "count-aware-transition"],
  algebraic: ["symbolic-sum-state", "constraint-balance"],
};

export const averageBalanceMotifs: QuantMotif[] =
  averageBalanceMotifDrafts.map((motif) =>
    defineQuantMotif({
      id: motif.id,
      topicCluster: "averages",
      reasoningCategories: [
        ...categoryReasoning[motif.category],
        ...motif.hiddenStructures,
      ],
      preferredOperations: motif.operations,
      compatibleTopics: [
        "averages",
        "central-tendency",
      ],
      compatiblePatternTypes: ["formula"],
      supportedReasoningTypes: [
        "direct",
        "conditional",
        "multi-step",
        "inferential",
        "comparative",
      ],
      difficultyBias:
        motif.difficulty <= 1
          ? "Easy"
          : motif.difficulty === 2
            ? "Medium"
            : "Hard",
      generationHints: [
        "model every question as sum = average x count",
        "show balance equations in MathJax",
        "prefer exact fractions when answers are non-integers",
      ],
      distractorHints: motif.distractors,
    }),
  );
