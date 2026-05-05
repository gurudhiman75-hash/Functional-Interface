import { QuantMotif } from "./types";

export const ratioMotifs: QuantMotif[] = [
  {
    id: "ratio_redistribution",

    topicCluster: "ratio-proportion",

    reasoningCategories: [
      "redistribution",
      "ratio-adjustment",
    ],

    preferredOperations: [
      "transform",
      "compare",
      "infer",
    ],

    commonDistractors: [
      "unchangedTotalAssumption",
      "ratioInversion",
    ],

    inferenceStyle: "hidden",

    reasoningDepthRange: [2, 5],

    wordingBias: {
      balanced: 0.8,
      concise: 0.5,
    },

    examWeights: {
      ssc: 1.3,
      ibps: 1.1,
      rrb: 1.0,
    },
  },

  {
    id: "common_base_comparison",

    topicCluster: "ratio-proportion",

    reasoningCategories: [
      "normalization",
      "cross-comparison",
    ],

    preferredOperations: [
      "transform",
      "compare",
      "aggregate",
    ],

    commonDistractors: [
      "directComparison",
      "wrongNormalization",
    ],

    inferenceStyle: "direct",

    reasoningDepthRange: [2, 4],

    wordingBias: {
      concise: 0.7,
    },

    examWeights: {
      ssc: 1.2,
      rrb: 1.1,
      ibps: 0.9,
    },
  },

  {
    id: "conditional_ratio_filtering",

    topicCluster: "ratio-proportion",

    reasoningCategories: [
      "conditional-selection",
      "filtered-comparison",
    ],

    preferredOperations: [
      "filter",
      "compare",
      "infer",
    ],

    commonDistractors: [
      "skippedCondition",
      "wrongSubsetSelection",
    ],

    inferenceStyle: "conditional",

    reasoningDepthRange: [3, 6],

    wordingBias: {
      inferenceHeavy: 0.8,
    },

    examWeights: {
      ibps: 1.3,
      sbi: 1.2,
      cat: 1.0,
    },
  },
  {
  id: "direct_ratio_sharing",

  topicCluster: "ratio-proportion",

  reasoningCategories: [
    "simple-ratio",
  ],

  preferredOperations: [
    "ratio",
  ],

  commonDistractors: [
    "ratioInversion",
    "arithmeticSlip",
  ],

  inferenceStyle: "direct",

  reasoningDepthRange: [1, 2],

  wordingBias: {
    concise: 1.2,
    balanced: 0.7,
  },

  examWeights: {
    ssc: 1.4,
    rrb: 1.3,
    ibps: 0.8,
  },
},

{
  id: "ratio_simplification",

  topicCluster: "ratio-proportion",

  reasoningCategories: [
    "simple-ratio",
  ],

  preferredOperations: [
    "ratio",
    "transform",
  ],

  commonDistractors: [
    "ratioInversion",
    "wrongIntermediateValue",
  ],

  inferenceStyle: "direct",

  reasoningDepthRange: [1, 2],

  wordingBias: {
    concise: 1.1,
  },

  examWeights: {
    ssc: 1.3,
    rrb: 1.2,
  },
},

{
  id: "proportional_distribution",

  topicCluster: "ratio-proportion",

  reasoningCategories: [
    "ratio-conversion",
  ],

  preferredOperations: [
    "ratio",
    "transform",
    "aggregate",
  ],

  commonDistractors: [
    "wrongIntermediateValue",
    "ratioInversion",
  ],

  inferenceStyle: "direct",

  reasoningDepthRange: [2, 4],

  wordingBias: {
    balanced: 0.9,
  },

  examWeights: {
    ibps: 1.2,
    sbi: 1.1,
  },
},

{
  id: "comparative_ratio_analysis",

  topicCluster: "ratio-proportion",

  reasoningCategories: [
    "comparison-chain",
    "ratio-conversion",
  ],

  preferredOperations: [
    "compare",
    "ratio",
    "transform",
  ],

  commonDistractors: [
    "comparisonTrap",
    "ratioInversion",
  ],

  inferenceStyle: "conditional",

  reasoningDepthRange: [3, 5],

  wordingBias: {
    balanced: 0.8,
  },

  examWeights: {
    ibps: 1.2,
    sbi: 1.1,
  },
},

{
  id: "ratio_to_percentage_conversion",

  topicCluster: "ratio-proportion",

  reasoningCategories: [
    "ratio-conversion",
    "simple-percentage",
  ],

  preferredOperations: [
    "ratio",
    "percentage",
    "transform",
  ],

  commonDistractors: [
    "wrongDenominator",
    "ratioInversion",
  ],

  inferenceStyle: "direct",

  reasoningDepthRange: [3, 5],

  wordingBias: {
    balanced: 0.9,
  },

  examWeights: {
    ibps: 1.3,
    sbi: 1.2,
  },
},

{
  id: "replacement_ratio_logic",

  topicCluster: "ratio-proportion",

  reasoningCategories: [
    "conditional-ratio-logic",
  ],

  preferredOperations: [
    "ratio",
    "conditional-selection",
    "infer",
  ],

  commonDistractors: [
    "wrongIntermediateValue",
    "ratioInversion",
  ],

  inferenceStyle: "hidden",

  reasoningDepthRange: [4, 6],

  wordingBias: {
    inferenceHeavy: 1.0,
  },

  examWeights: {
    ibps: 1.3,
    cat: 1.1,
  },
},

{
  id: "conditional_ratio_chain",

  topicCluster: "ratio-proportion",

  reasoningCategories: [
    "comparative-conditional-inference",
  ],

  preferredOperations: [
    "ratio",
    "compare",
    "infer",
  ],

  commonDistractors: [
    "comparisonTrap",
    "wrongIntermediateValue",
  ],

  inferenceStyle: "conditional",

  reasoningDepthRange: [4, 6],

  wordingBias: {
    inferenceHeavy: 1.1,
  },

  examWeights: {
    cat: 1.3,
    ibps: 1.1,
  },
},

{
  id: "hidden_ratio_base",

  topicCluster: "ratio-proportion",

  reasoningCategories: [
    "hidden-base-inference",
  ],

  preferredOperations: [
    "infer",
    "ratio",
    "transform",
  ],

  commonDistractors: [
    "ratioInversion",
    "wrongIntermediateValue",
  ],

  inferenceStyle: "hidden",

  reasoningDepthRange: [5, 7],

  wordingBias: {
    inferenceHeavy: 1.2,
  },

  examWeights: {
    cat: 1.4,
    ibps: 1.0,
  },
},

{
  id: "multi_stage_ratio_distribution",

  topicCluster: "ratio-proportion",

  reasoningCategories: [
    "nested-operations",
    "conditional-ratio-logic",
  ],

  preferredOperations: [
    "ratio",
    "aggregate",
    "transform",
    "infer",
  ],

  commonDistractors: [
    "cumulativeMistake",
    "wrongIntermediateValue",
  ],

  inferenceStyle: "hidden",

  reasoningDepthRange: [5, 7],

  wordingBias: {
    inferenceHeavy: 1.2,
  },

  examWeights: {
    cat: 1.5,
    sbi: 1.1,
  },
},

{
  id: "ratio_comparison_filtering",

  topicCluster: "ratio-proportion",

  reasoningCategories: [
    "comparison-chain",
    "comparative-conditional-inference",
  ],

  preferredOperations: [
    "compare",
    "filter",
    "ratio",
  ],

  commonDistractors: [
    "comparisonTrap",
    "ratioInversion",
  ],

  inferenceStyle: "conditional",

  reasoningDepthRange: [4, 6],

  wordingBias: {
    balanced: 0.7,
    inferenceHeavy: 0.7,
  },

  examWeights: {
    ibps: 1.2,
    cat: 1.2,
  },
},
];