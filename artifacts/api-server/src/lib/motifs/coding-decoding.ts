import { QuantMotif } from "./types";

export const codingDecodingMotifs: QuantMotif[] = [
  {
    id: "direct_alphabet_shift",
    topicCluster: "coding-decoding",
    reasoningCategories: [
      "direct-alphabet-shift",
      "simple-substitution",
    ],
    preferredOperations: [
      "transform",
    ],
    commonDistractors: [
      "arithmeticSlip",
      "wrongIntermediateValue",
    ],
    inferenceStyle: "direct",
    reasoningDepthRange: [1, 2],
    wordingBias: {
      concise: 0.8,
      balanced: 0.5,
    },
    examWeights: {
      ssc: 1.3,
      rrb: 1.2,
      ibps: 0.9,
    },
  },
  {
    id: "reverse_alphabet_mapping",
    topicCluster: "coding-decoding",
    reasoningCategories: [
      "reverse-alphabet",
      "positional-coding",
    ],
    preferredOperations: [
      "reverse",
      "transform",
    ],
    commonDistractors: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    inferenceStyle: "direct",
    reasoningDepthRange: [1, 3],
    wordingBias: {
      concise: 0.7,
      balanced: 0.6,
    },
    examWeights: {
      ssc: 1.2,
      ibps: 1,
      rrb: 1.1,
    },
  },
  {
    id: "symbolic_position_encoding",
    topicCluster: "coding-decoding",
    reasoningCategories: [
      "mixed-symbol-letter-coding",
      "positional-coding",
    ],
    preferredOperations: [
      "transform",
      "compare",
    ],
    commonDistractors: [
      "comparisonTrap",
      "wrongIntermediateValue",
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [2, 4],
    wordingBias: {
      balanced: 0.8,
    },
    examWeights: {
      ibps: 1.2,
      sbi: 1.2,
      ssc: 0.9,
    },
  },
  {
    id: "conditional_letter_mapping",
    topicCluster: "coding-decoding",
    reasoningCategories: [
      "conditional-letter-mapping",
      "filtered-comparison",
    ],
    preferredOperations: [
      "filter",
      "transform",
      "compare",
    ],
    commonDistractors: [
      "skippedCondition",
      "wrongSubsetSelection",
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [2, 5],
    wordingBias: {
      balanced: 0.8,
      inferenceHeavy: 0.4,
    },
    examWeights: {
      ibps: 1.3,
      sbi: 1.2,
      cat: 0.8,
    },
  },
  {
    id: "multi_stage_word_transform",
    topicCluster: "coding-decoding",
    reasoningCategories: [
      "multi-stage-coding",
      "word-transformation-chains",
    ],
    preferredOperations: [
      "transform",
      "reverse",
      "aggregate",
    ],
    commonDistractors: [
      "cumulativeMistake",
      "wrongIntermediateValue",
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 6],
    wordingBias: {
      balanced: 0.5,
      inferenceHeavy: 0.8,
    },
    examWeights: {
      cat: 1.4,
      ibps: 1.1,
      sbi: 1,
    },
  },
  {
    id: "inference_based_decoding",
    topicCluster: "coding-decoding",
    reasoningCategories: [
      "inference-based-decoding",
      "conditional-letter-mapping",
    ],
    preferredOperations: [
      "infer",
      "compare",
      "transform",
    ],
    commonDistractors: [
      "wrongIntermediateValue",
      "comparisonTrap",
      "skippedCondition",
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 6],
    wordingBias: {
      inferenceHeavy: 0.9,
    },
    examWeights: {
      cat: 1.5,
      ibps: 1.1,
      sbi: 1,
    },
  },
  ...[
    {
      id: "shift-fixed",
      reasoningCategories: [
        "state-shift-transformation",
        "direct-alphabet-shift",
      ],
      preferredOperations: [
        "transform",
      ],
      commonDistractors: [
        "Shift_Direction_Error",
        "Off_By_One_Shift",
      ],
      inferenceStyle: "direct",
      reasoningDepthRange: [1, 2],
      examWeights: {
        ssc: 1.3,
        rrb: 1.2,
        ibps: 1,
      },
    },
    {
      id: "shift-incremental",
      reasoningCategories: [
        "state-shift-transformation",
        "incremental-series-shift",
      ],
      preferredOperations: [
        "infer",
        "transform",
      ],
      commonDistractors: [
        "Wrong_Start_Index",
        "Constant_Shift_Trap",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [2, 4],
      examWeights: {
        ssc: 1.1,
        ibps: 1.2,
        cat: 1,
      },
    },
    {
      id: "shift-alternating",
      reasoningCategories: [
        "state-shift-transformation",
        "alternating-rule",
      ],
      preferredOperations: [
        "infer",
        "transform",
        "compare",
      ],
      commonDistractors: [
        "Alternation_Phase_Error",
        "Constant_Shift_Trap",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [2, 5],
      examWeights: {
        ibps: 1.2,
        sbi: 1.1,
        cat: 1,
      },
    },
    {
      id: "shift-vowel-consonant",
      reasoningCategories: [
        "state-shift-transformation",
        "conditional-letter-mapping",
      ],
      preferredOperations: [
        "filter",
        "transform",
        "compare",
      ],
      commonDistractors: [
        "Vowel_Consonant_Swap",
        "Skipped_Condition",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [2, 5],
      examWeights: {
        ibps: 1.3,
        sbi: 1.2,
        cat: 1,
      },
    },
    {
      id: "map-opposite",
      reasoningCategories: [
        "opposite-alphabet-map",
        "positional-coding",
      ],
      preferredOperations: [
        "map",
        "transform",
      ],
      commonDistractors: [
        "Rank_Sum_27_Error",
        "Reverse_Order_Trap",
      ],
      inferenceStyle: "direct",
      reasoningDepthRange: [1, 3],
      examWeights: {
        ssc: 1.2,
        ibps: 1.1,
        rrb: 1.1,
      },
    },
    {
      id: "map-cross",
      reasoningCategories: [
        "cross-position-map",
        "substring-reversal",
      ],
      preferredOperations: [
        "swap",
        "transform",
      ],
      commonDistractors: [
        "Partial_Swap_Error",
        "Reverse_Order_Trap",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [2, 4],
      examWeights: {
        ssc: 1,
        ibps: 1.1,
        cat: 1,
      },
    },
    {
      id: "map-rank-math",
      reasoningCategories: [
        "rank-aggregation",
        "positional-coding",
      ],
      preferredOperations: [
        "map",
        "aggregate",
      ],
      commonDistractors: [
        "Rank_Product_Trap",
        "Letter_Count_Trap",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [2, 4],
      examWeights: {
        ssc: 1,
        ibps: 1.2,
        cat: 1.1,
      },
    },
    {
      id: "math-power",
      reasoningCategories: [
        "number-series",
        "power-pattern",
      ],
      preferredOperations: [
        "infer",
        "transform",
      ],
      commonDistractors: [
        "Linear_Difference_Trap",
        "Power_Offset_Error",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [2, 5],
      examWeights: {
        ssc: 1.1,
        ibps: 1.1,
        cat: 1.2,
      },
    },
    {
      id: "math-difference-layer",
      reasoningCategories: [
        "number-series",
        "second-difference-layer",
      ],
      preferredOperations: [
        "infer",
        "compare",
        "transform",
      ],
      commonDistractors: [
        "First_Difference_Trap",
        "Layer_Skip_Error",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 6],
      examWeights: {
        ibps: 1.2,
        sbi: 1.2,
        cat: 1.3,
      },
    },
    {
      id: "math-interleaved",
      reasoningCategories: [
        "number-series",
        "interleaved-series",
      ],
      preferredOperations: [
        "split",
        "infer",
        "transform",
      ],
      commonDistractors: [
        "Interleaving_Phase_Error",
        "Single_Series_Trap",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 6],
      examWeights: {
        ibps: 1.2,
        sbi: 1.2,
        cat: 1.4,
      },
    },
  ].map((motif) => ({
    topicCluster:
      "coding-decoding" as const,
    compatibleTopics: [
      "coding-decoding",
      "engine-pattern",
      "pattern-inference",
      "number-series",
      "letter-series",
      "analogy",
      "odd-one-out",
      "classification",
    ],
    compatiblePatternTypes: [
      "logic" as const,
    ],
    supportedReasoningTypes: [
      "symbolic" as const,
      "inferential" as const,
      "multi-step" as const,
    ],
    wordingBias: {
      balanced: 0.8,
      inferenceHeavy: 0.6,
    },
    ...motif,
  })),
];
