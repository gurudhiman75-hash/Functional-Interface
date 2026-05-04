import { QuantMotif } from "./types";

export const bloodRelationMotifs: QuantMotif[] = [
  {
    id: "direct_family_relation",
    topicCluster: "blood-relations",
    reasoningCategories: [
      "direct-family-relation",
      "single-chain-relation",
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
    id: "generation_gap_reasoning",
    topicCluster: "blood-relations",
    reasoningCategories: [
      "generation-gap-reasoning",
      "multi-person-chain-relations",
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
    reasoningDepthRange: [2, 4],
    wordingBias: {
      balanced: 0.8,
    },
    examWeights: {
      ibps: 1.2,
      sbi: 1.2,
      ssc: 1,
    },
  },
  {
    id: "gender_based_inference",
    topicCluster: "blood-relations",
    reasoningCategories: [
      "gender-based-inference",
      "multi-person-chain-relations",
    ],
    preferredOperations: [
      "infer",
      "compare",
    ],
    commonDistractors: [
      "wrongIntermediateValue",
      "skippedCondition",
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
      cat: 0.9,
    },
  },
  {
    id: "conditional_family_inference",
    topicCluster: "blood-relations",
    reasoningCategories: [
      "conditional-family-inference",
      "nested-relationship-logic",
    ],
    preferredOperations: [
      "filter",
      "infer",
      "compare",
    ],
    commonDistractors: [
      "skippedCondition",
      "wrongSubsetSelection",
      "comparisonTrap",
    ],
    inferenceStyle: "conditional",
    reasoningDepthRange: [3, 6],
    wordingBias: {
      balanced: 0.6,
      inferenceHeavy: 0.8,
    },
    examWeights: {
      ibps: 1.1,
      sbi: 1.2,
      cat: 1.1,
    },
  },
  {
    id: "circular_relation_chain",
    topicCluster: "blood-relations",
    reasoningCategories: [
      "circular-relation-chains",
      "nested-relationship-logic",
    ],
    preferredOperations: [
      "compare",
      "transform",
      "infer",
    ],
    commonDistractors: [
      "cumulativeMistake",
      "wrongIntermediateValue",
    ],
    inferenceStyle: "hidden",
    reasoningDepthRange: [3, 6],
    wordingBias: {
      inferenceHeavy: 0.8,
    },
    examWeights: {
      cat: 1.4,
      ibps: 1,
      sbi: 1,
    },
  },
  {
    id: "indirect_relation_deduction",
    topicCluster: "blood-relations",
    reasoningCategories: [
      "indirect-relation-deduction",
      "nested-relationship-logic",
    ],
    preferredOperations: [
      "infer",
      "compare",
      "aggregate",
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
      sbi: 1.1,
    },
  },
];
