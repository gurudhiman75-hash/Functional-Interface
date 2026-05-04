import { QuantMotif } from "./types";

export const inequalityMotifs: QuantMotif[] = [
  {
    id: "direct_inequality_reading",
    topicCluster: "inequality",
    reasoningCategories: [
      "direct-inequalities",
      "basic-symbol-interpretation",
    ],
    preferredOperations: [
      "compare",
    ],
    commonDistractors: [
      "comparisonTrap",
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
      ibps: 1,
    },
  },
  {
    id: "single_chain_deduction",
    topicCluster: "inequality",
    reasoningCategories: [
      "single-inference-chains",
      "basic-symbol-interpretation",
    ],
    preferredOperations: [
      "compare",
      "infer",
    ],
    commonDistractors: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    inferenceStyle: "direct",
    reasoningDepthRange: [1, 3],
    wordingBias: {
      concise: 0.7,
      balanced: 0.7,
    },
    examWeights: {
      ssc: 1.2,
      ibps: 1.1,
      sbi: 1,
    },
  },
  {
    id: "compound_inequality_linking",
    topicCluster: "inequality",
    reasoningCategories: [
      "compound-inequalities",
      "multi-statement-comparison",
    ],
    preferredOperations: [
      "compare",
      "aggregate",
      "infer",
    ],
    commonDistractors: [
      "comparisonTrap",
      "cumulativeMistake",
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
    id: "indirect_conclusion_validation",
    topicCluster: "inequality",
    reasoningCategories: [
      "indirect-conclusions",
      "multi-statement-comparison",
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
    inferenceStyle: "conditional",
    reasoningDepthRange: [2, 5],
    wordingBias: {
      balanced: 0.8,
      inferenceHeavy: 0.4,
    },
    examWeights: {
      ibps: 1.2,
      sbi: 1.1,
      cat: 0.9,
    },
  },
  {
    id: "uncertain_branch_comparison",
    topicCluster: "inequality",
    reasoningCategories: [
      "uncertain-conclusions",
      "conditional-inequality-logic",
    ],
    preferredOperations: [
      "filter",
      "infer",
      "compare",
    ],
    commonDistractors: [
      "wrongSubsetSelection",
      "comparisonTrap",
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
    id: "nested_symbolic_reasoning",
    topicCluster: "inequality",
    reasoningCategories: [
      "nested-inference-chains",
      "mixed-symbolic-reasoning",
    ],
    preferredOperations: [
      "aggregate",
      "infer",
      "compare",
    ],
    commonDistractors: [
      "cumulativeMistake",
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 6],
    wordingBias: {
      inferenceHeavy: 0.9,
    },
    examWeights: {
      cat: 1.5,
      ibps: 1.1,
      sbi: 1.1,
    },
  },
];
