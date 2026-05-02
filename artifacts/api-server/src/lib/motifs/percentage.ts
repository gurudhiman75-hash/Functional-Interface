import { QuantMotif } from "./types";

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
];