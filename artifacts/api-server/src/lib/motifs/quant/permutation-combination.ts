import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

const motifIds = [
  "pc-fpc-mul",
  "pc-fpc-add",
  "pc-digit-formation",
  "pc-digit-zero",
  "pc-perm-distinct",
  "pc-perm-identical",
  "pc-perm-together",
  "pc-perm-never-together",
  "pc-perm-relative",
  "pc-circ-table",
  "pc-circ-necklace",
  "pc-circ-constrained",
  "pc-comb-basic",
  "pc-comb-committee",
  "pc-handshake",
  "pc-geom-lines",
  "pc-geom-triangles",
  "pc-geom-diagonals",
  "pc-rank-word",
  "pc-dist-distinct",
  "pc-dist-identical",
  "pc-dearrangement",
  "pc-grid-path",
  "pc-password-repeat",
  "pc-word-vowels-together",
  "pc-selection-atleast",
  "pc-selection-atmost",
  "pc-distribution-positive",
  "pc-circular-alternate",
  "pc-binomial-coefficient",
  "pc-path-restricted",
  "pc-arrange-books-grouped",
] as const;

export const permutationCombinationScopeMap = {
  chapter: "Permutations & Combinations",
  stateModel:
    "constraint_based_counting_model",
  coreDomains: [
    "Fundamental Counting Principle",
    "Linear Permutations",
    "Circular Permutations",
    "Combinations",
    "Digit Formation",
    "Geometric Counting",
    "Distribution",
    "Rank",
    "Grid Paths",
  ],
  invariants: [
    "ordered sequences use nPr",
    "unordered subsets use nCr",
    "leading zero is invalid for fixed-length numbers",
    "circular table rotations are identical",
    "all generated answers must be positive integers",
  ],
};

export const permutationCombinationDistractorRegistry = [
  "Perm_vs_Comb",
  "Internal_Order_Neglect",
  "Gap_Count_Error",
  "Circular_Linear_Flip",
  "Identical_Division_Omission",
  "Handshake_Double_Count",
  "Leading_Zero_Ignorance",
  "Necklace_Factor_2_Omission",
  "Collinear_Point_Overcount",
  "Sticks_Stones_Inversion",
  "Rank_Alphabet_Order_Slip",
  "Additive_Counting_Trap",
  "Repetition_Logic_Mixup",
  "Geometric_Line_Constant_Error",
  "Case_Exclusion_Error",
  "Factorial_Calculation_Slip",
  "Case_Overlap_Overcount",
  "Diagonal_Formula_Inversion",
];

export const permutationCombinationMotifs: QuantMotif[] =
  motifIds.map((id) => {
    const isAdvanced =
      id.includes("rank") ||
      id.includes("dearrangement") ||
      id.includes("dist-identical") ||
      id.includes("grid");
    const isConditional =
      id.includes("atleast") ||
      id.includes("atmost") ||
      id.includes("zero") ||
      id.includes("together") ||
      id.includes("never") ||
      id.includes("committee") ||
      id.includes("geom");
    const isSelection =
      id.includes("comb") ||
      id.includes("handshake") ||
      id.includes("selection");

    return defineQuantMotif({
      id,
      topicCluster:
        "permutation-combination",
      archetype: isSelection
        ? "selection-counting"
        : id.includes("circ")
          ? "circular-arrangement"
          : id.includes("digit")
            ? "digit-constraint-counting"
            : "constraint-counting",
      reasoningCategories: [
        isSelection
          ? "unordered-selection"
          : "ordered-arrangement",
        isConditional
          ? "constraint-casework"
          : "direct-counting",
      ],
      preferredOperations: [
        isSelection ? "choose" : "arrange",
        isConditional
          ? "casework"
          : "multiply",
      ],
      compatibleTopics: [
        "permutation-combination",
        "permutations-combinations",
        "counting",
      ],
      compatiblePatternTypes: [
        "formula",
        "logic",
      ],
      requiredVariables: [
        "n",
        "r",
      ],
      supportedReasoningTypes: [
        "direct",
        "conditional",
        "multi-step",
        "inferential",
        "symbolic",
      ],
      requiredReasoningCapabilities: [
        "arithmetic",
        "conditional",
        "multi-step",
      ],
      supportedDifficultyBands:
        isAdvanced
          ? ["Hard"]
          : isConditional
            ? ["Medium", "Hard"]
            : ["Easy", "Medium", "Hard"],
      commonDistractors:
        permutationCombinationDistractorRegistry,
      inferenceStyle: isConditional
        ? "conditional"
        : "direct",
      reasoningDepthRange: isAdvanced
        ? [3, 5]
        : isConditional
          ? [2, 4]
          : [1, 3],
      generationStrategy: [
        "constraint-based counting scenario generation",
        "differentiate ordered nPr and unordered nCr before solving",
      ],
      parameterRanges: {
        n: "Use small factorial-safe values for SSC and larger topology-focused values for CAT.",
        r: "Always validate n >= r before selection or permutation.",
      },
      distractorStrategies:
        permutationCombinationDistractorRegistry,
      difficultyTuning: {
        easy: [
          "single-step factorial, nCr, or multiplication rule",
        ],
        medium: [
          "one explicit constraint such as repetition, togetherness, or leading zero",
        ],
        hard: [
          "casework, circular symmetry, collinearity, rank, distribution, or grid-path constraints",
        ],
      },
      validationRules: [
        "All answers must be positive integers.",
        "Use nPr only when order matters.",
        "Use nCr only when order does not matter.",
        "Leading zero is invalid in fixed-length number formation.",
      ],
      diversityTags: [
        "ordered-vs-unordered",
        "constraint-casework",
        "factorial-normalization",
      ],
    });
  });
