import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

type ProgressionCategory =
  | "ap"
  | "gp"
  | "hp_means"
  | "special_series"
  | "algebraic";

type ProgressionMotifDraft = {
  id: string;
  category: ProgressionCategory;
  operations: string[];
  hiddenStructures: string[];
  distractors: string[];
  difficulty: 1 | 2 | 3 | 4;
};

export const progressionsScopeMap = {
  chapter: "Progressions",
  coreDomains: [
    "Arithmetic Progression",
    "Geometric Progression",
    "Harmonic Progression",
    "Means",
    "Special Series",
    "Sigma Notation",
    "Telescopic Series",
    "Arithmetico-Geometric Progression",
    "Algebraic Progression Relations",
  ],
} as const;

export const progressionsDistractorRegistry = [
  "Off_By_One_Term",
  "Common_Diff_Sign_Flip",
  "AP_GP_Formula_Mixup",
  "Infinite_Sum_Finite_Limit",
  "Mean_Inversion",
  "Log_Base_Assumption",
  "Telescopic_Boundary_Error",
  "Middle_Term_Neglect",
  "GP_Ratio_Reciprocal",
  "Divisibility_Boundary_Trap",
  "Square_Sum_Formula_Error",
  "Rebound_One_Way_Only",
  "AM_GM_Condition_Violation",
  "Ratio_Linear_Assumption",
  "Number_of_Terms_Count",
  "Recursive_Start_Error",
  "Geometric_Mean_Sign",
  "Sigma_Notation_Expansion",
  "Partial_Sum_Subtraction",
  "HP_Linear_Sum",
] as const;

export const progressionsProceduralMotifs: ProgressionMotifDraft[] = [
  { id: "prog-ap-term", category: "ap", operations: ["nth term"], hiddenStructures: ["linear term index"], distractors: ["Off_By_One_Term"], difficulty: 1 },
  { id: "prog-ap-sum", category: "ap", operations: ["finite AP sum"], hiddenStructures: ["linear aggregation"], distractors: ["Off_By_One_Term"], difficulty: 1 },
  { id: "prog-ap-middle", category: "ap", operations: ["middle term"], hiddenStructures: ["average equals middle term"], distractors: ["Middle_Term_Neglect"], difficulty: 2 },
  { id: "prog-ap-property", category: "ap", operations: ["three-term AP relation"], hiddenStructures: ["2b=a+c"], distractors: ["Common_Diff_Sign_Flip"], difficulty: 1 },
  { id: "prog-ap-series-id", category: "ap", operations: ["divisibility count"], hiddenStructures: ["first-last term count"], distractors: ["Divisibility_Boundary_Trap"], difficulty: 2 },
  { id: "prog-ap-arithmetic-mean", category: "ap", operations: ["insert means"], hiddenStructures: ["partition interval equally"], distractors: ["Number_of_Terms_Count"], difficulty: 3 },
  { id: "prog-ap-partial-sum", category: "ap", operations: ["range sum"], hiddenStructures: ["subtract S before range"], distractors: ["Partial_Sum_Subtraction"], difficulty: 3 },
  { id: "prog-gp-term", category: "gp", operations: ["nth GP term"], hiddenStructures: ["exponential index"], distractors: ["Off_By_One_Term"], difficulty: 1 },
  { id: "prog-gp-sum", category: "gp", operations: ["finite GP sum"], hiddenStructures: ["geometric aggregation"], distractors: ["AP_GP_Formula_Mixup"], difficulty: 2 },
  { id: "prog-gp-infinite", category: "gp", operations: ["infinite GP sum"], hiddenStructures: ["|r| < 1"], distractors: ["Infinite_Sum_Finite_Limit"], difficulty: 2 },
  { id: "prog-gp-property", category: "gp", operations: ["three-term GP relation"], hiddenStructures: ["b squared equals ac"], distractors: ["Ratio_Linear_Assumption"], difficulty: 2 },
  { id: "prog-gp-rebound", category: "gp", operations: ["rebound distance"], hiddenStructures: ["first fall plus doubled GP"], distractors: ["Rebound_One_Way_Only"], difficulty: 4 },
  { id: "prog-gp-fractional-ratio", category: "gp", operations: ["fractional ratio"], hiddenStructures: ["keep ratio exact"], distractors: ["GP_Ratio_Reciprocal"], difficulty: 2 },
  { id: "prog-gp-log-growth", category: "gp", operations: ["growth count"], hiddenStructures: ["powers of ratio"], distractors: ["Recursive_Start_Error"], difficulty: 3 },
  { id: "prog-hp-basic", category: "hp_means", operations: ["reciprocal AP"], hiddenStructures: ["invert terms first"], distractors: ["HP_Linear_Sum"], difficulty: 2 },
  { id: "prog-mean-relation", category: "hp_means", operations: ["AM GM HM relation"], hiddenStructures: ["G squared equals AH"], distractors: ["Mean_Inversion"], difficulty: 2 },
  { id: "prog-hp-average-speed", category: "hp_means", operations: ["harmonic mean"], hiddenStructures: ["equal-distance average speed"], distractors: ["Mean_Inversion"], difficulty: 3 },
  { id: "prog-mean-insert-geometric", category: "hp_means", operations: ["insert geometric mean"], hiddenStructures: ["square root of product"], distractors: ["Geometric_Mean_Sign"], difficulty: 2 },
  { id: "prog-spec-natural", category: "special_series", operations: ["sum natural numbers"], hiddenStructures: ["triangular number"], distractors: ["Square_Sum_Formula_Error"], difficulty: 1 },
  { id: "prog-spec-squares", category: "special_series", operations: ["sum squares"], hiddenStructures: ["quadratic summation"], distractors: ["Square_Sum_Formula_Error"], difficulty: 2 },
  { id: "prog-spec-cubes", category: "special_series", operations: ["sum cubes"], hiddenStructures: ["square of natural sum"], distractors: ["Square_Sum_Formula_Error"], difficulty: 2 },
  { id: "prog-spec-telescopic", category: "special_series", operations: ["telescoping"], hiddenStructures: ["cancel adjacent fractions"], distractors: ["Telescopic_Boundary_Error"], difficulty: 3 },
  { id: "prog-spec-agp", category: "special_series", operations: ["arithmetico-geometric sum"], hiddenStructures: ["AP times GP"], distractors: ["AP_GP_Formula_Mixup"], difficulty: 4 },
  { id: "prog-spec-sigma-linear", category: "special_series", operations: ["sigma linearity"], hiddenStructures: ["sum constants too"], distractors: ["Sigma_Notation_Expansion"], difficulty: 2 },
  { id: "prog-spec-odd-sum", category: "special_series", operations: ["sum odd numbers"], hiddenStructures: ["n squared"], distractors: ["Recursive_Start_Error"], difficulty: 1 },
  { id: "prog-spec-even-sum", category: "special_series", operations: ["sum even numbers"], hiddenStructures: ["n(n+1)"], distractors: ["Recursive_Start_Error"], difficulty: 1 },
  { id: "prog-alg-log-link", category: "algebraic", operations: ["log GP to AP"], hiddenStructures: ["log converts product to sum"], distractors: ["Log_Base_Assumption"], difficulty: 3 },
  { id: "prog-alg-roots", category: "algebraic", operations: ["roots in AP or GP"], hiddenStructures: ["structured roots"], distractors: ["Ratio_Linear_Assumption"], difficulty: 4 },
  { id: "prog-alg-n-split", category: "algebraic", operations: ["split into AP"], hiddenStructures: ["a-d, a, a+d"], distractors: ["Number_of_Terms_Count"], difficulty: 4 },
  { id: "prog-alg-find-n-from-sum", category: "algebraic", operations: ["infer number of terms"], hiddenStructures: ["quadratic in n"], distractors: ["Number_of_Terms_Count"], difficulty: 3 },
  { id: "prog-alg-common-diff-from-sum", category: "algebraic", operations: ["infer common difference"], hiddenStructures: ["sum formula inversion"], distractors: ["Common_Diff_Sign_Flip"], difficulty: 3 },
  { id: "prog-alg-common-ratio-from-terms", category: "algebraic", operations: ["infer common ratio"], hiddenStructures: ["term quotient"], distractors: ["GP_Ratio_Reciprocal"], difficulty: 2 },
  { id: "prog-recursive-linear", category: "ap", operations: ["recursive AP"], hiddenStructures: ["convert recurrence to explicit"], distractors: ["Recursive_Start_Error"], difficulty: 3 },
  { id: "prog-recursive-geometric", category: "gp", operations: ["recursive GP"], hiddenStructures: ["convert recurrence to explicit"], distractors: ["Recursive_Start_Error"], difficulty: 3 },
  { id: "prog-series-mixed-difference", category: "special_series", operations: ["successive differences"], hiddenStructures: ["second-level AP"], distractors: ["Off_By_One_Term"], difficulty: 4 },
];

const categoryReasoning: Record<ProgressionCategory, string[]> = {
  ap: ["arithmetic-progression", "linear-sequence"],
  gp: ["geometric-progression", "exponential-sequence"],
  hp_means: ["harmonic-progression", "means"],
  special_series: ["summation", "series"],
  algebraic: ["algebraic-progression-relation", "structured-terms"],
};

export const progressionsMotifs: QuantMotif[] =
  progressionsProceduralMotifs.map((motif) =>
    defineQuantMotif({
      id: motif.id,
      topicCluster: "progressions",
      reasoningCategories:
        categoryReasoning[motif.category],
      preferredOperations: motif.operations,
      compatibleTopics: [
        "progressions",
        "sequences",
        "series",
        "ap-gp-hp",
      ],
      compatiblePatternTypes: ["formula"],
      supportedReasoningTypes: [
        "symbolic",
        "multi-step",
        "conditional",
      ],
      requiredReasoningCapabilities: [
        motif.difficulty >= 3
          ? "multi-step"
          : "direct",
        "symbolic",
      ],
      supportedDifficultyBands:
        motif.difficulty <= 1
          ? ["Easy"]
          : motif.difficulty === 2
            ? ["Easy", "Medium"]
            : motif.difficulty === 3
              ? ["Medium", "Hard"]
              : ["Hard"],
      commonDistractors: motif.distractors,
      inferenceStyle:
        motif.difficulty >= 3
          ? "conditional"
          : "direct",
      reasoningDepthRange:
        motif.difficulty <= 2
          ? [1, 2]
          : motif.difficulty === 3
            ? [2, 3]
            : [3, 4],
      wordingBias: {
        concise: motif.difficulty <= 2 ? 0.45 : 0.2,
        balanced: 0.5,
        inferenceHeavy:
          motif.difficulty >= 3 ? 0.55 : 0.2,
      },
      examWeights: {
        ssc: motif.difficulty <= 3 ? 0.75 : 0.35,
        ibps: 0.45,
        cat: motif.difficulty >= 3 ? 0.8 : 0.4,
      },
      isActive: true,
      version: 1,
      source: "examtree-progressions-knowledge-layer",
    }),
  );
