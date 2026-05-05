import { QuantMotif } from "./types";
//gurbaj
export const percentageMotifs: QuantMotif[] = [
  {
    id: "reverse_percentage_inference",

    topicCluster: "percentage",

    reasoningCategories: [
      "reverse-percentage",
      "hidden-base-inference",
    ],

    preferredOperations: [
      "reverse",
      "transform",
      "compare",
    ],

    commonDistractors: [
      "wrongDenominator",
      "percentageTrap",
    ],

    inferenceStyle: "hidden",

    reasoningDepthRange: [2, 4],

    wordingBias: {
      concise: 0.8,
      balanced: 0.4,
    },

    examWeights: {
      ssc: 1.2,
      ibps: 1.0,
      cat: 0.7,
    },
  },

  {
    id: "successive_percentage_change",

    topicCluster: "percentage",

    reasoningCategories: [
      "successive-change",
      "compound-change",
    ],

    preferredOperations: [
      "transform",
      "aggregate",
    ],

    commonDistractors: [
      "cumulativeMistake",
      "percentageTrap",
    ],

    inferenceStyle: "direct",

    reasoningDepthRange: [2, 5],

    wordingBias: {
      balanced: 0.7,
    },

    examWeights: {
      ibps: 1.2,
      sbi: 1.3,
    },
  },

  {
    id: "contribution_based_growth",

    topicCluster: "percentage",

    reasoningCategories: [
      "contribution-analysis",
      "cross-comparison",
    ],

    preferredOperations: [
      "aggregate",
      "compare",
      "transform",
    ],

    commonDistractors: [
      "partialAggregation",
      "wrongSeries",
    ],

    inferenceStyle: "conditional",

    reasoningDepthRange: [3, 6],

    wordingBias: {
      inferenceHeavy: 0.8,
    },

    examWeights: {
      cat: 1.4,
      ibps: 1.1,
    },
  },
  {
  id: "direct_percentage_increase",

  topicCluster: "percentage",

  reasoningCategories: [
    "simple-percentage",
  ],

  preferredOperations: [
    "percentage",
  ],

  commonDistractors: [
    "arithmeticSlip",
    "wrongDenominator",
  ],

  inferenceStyle: "direct",

  reasoningDepthRange: [1, 2],

  wordingBias: {
    concise: 1.2,
    balanced: 0.8,
  },

  examWeights: {
    ssc: 1.4,
    rrb: 1.3,
    ibps: 0.8,
  },
},

{
  id: "direct_percentage_decrease",

  topicCluster: "percentage",

  reasoningCategories: [
    "simple-percentage",
  ],

  preferredOperations: [
    "percentage",
  ],

  commonDistractors: [
    "percentageTrap",
    "arithmeticSlip",
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
  id: "percentage_difference_comparison",

  topicCluster: "percentage",

  reasoningCategories: [
    "comparison-chain",
  ],

  preferredOperations: [
    "compare",
    "percentage",
  ],

  commonDistractors: [
    "comparisonTrap",
    "wrongDenominator",
  ],

  inferenceStyle: "direct",

  reasoningDepthRange: [2, 3],

  wordingBias: {
    balanced: 0.9,
  },

  examWeights: {
    ssc: 1.1,
    ibps: 1.1,
  },
},

{
  id: "net_percentage_change",

  topicCluster: "percentage",

  reasoningCategories: [
    "successive-percentage",
    "compound-change",
  ],

  preferredOperations: [
    "percentage",
    "transform",
    "aggregate",
  ],

  commonDistractors: [
    "cumulativeMistake",
    "percentageTrap",
  ],

  inferenceStyle: "conditional",

  reasoningDepthRange: [3, 5],

  wordingBias: {
    balanced: 0.8,
    inferenceHeavy: 0.4,
  },

  examWeights: {
    ibps: 1.2,
    sbi: 1.3,
    cat: 0.8,
  },
},

{
  id: "hidden_base_percentage",

  topicCluster: "percentage",

  reasoningCategories: [
    "hidden-base-inference",
    "reverse-percentage",
  ],

  preferredOperations: [
    "infer",
    "reverse",
    "percentage",
  ],

  commonDistractors: [
    "wrongIntermediateValue",
    "percentageTrap",
  ],

  inferenceStyle: "hidden",

  reasoningDepthRange: [4, 6],

  wordingBias: {
    inferenceHeavy: 1.1,
  },

  examWeights: {
    cat: 1.4,
    ibps: 1.1,
  },
},

{
  id: "percentage_ratio_conversion",

  topicCluster: "percentage",

  reasoningCategories: [
    "ratio-conversion",
    "comparison-chain",
  ],

  preferredOperations: [
    "percentage",
    "ratio",
    "transform",
  ],

  commonDistractors: [
    "ratioInversion",
    "wrongDenominator",
  ],

  inferenceStyle: "conditional",

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
  id: "multi_stage_growth_analysis",

  topicCluster: "percentage",

  reasoningCategories: [
    "comparative-conditional-inference",
    "nested-operations",
  ],

  preferredOperations: [
    "compare",
    "aggregate",
    "infer",
    "transform",
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
    ibps: 1.0,
  },
},
];