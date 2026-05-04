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
];
