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
];