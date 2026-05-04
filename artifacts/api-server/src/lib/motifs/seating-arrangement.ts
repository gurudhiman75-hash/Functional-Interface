import { QuantMotif } from "./types";

export const seatingArrangementMotifs: QuantMotif[] =
  [
    {
      id: "direct_clue_linear",
      topicCluster:
        "seating-arrangement",
      reasoningCategories: [
        "direct-placement",
      ],
      preferredOperations: [
        "compare",
        "transform",
      ],
      commonDistractors: [
        "wrongIntermediateValue",
        "comparisonTrap",
      ],
      inferenceStyle: "direct",
      reasoningDepthRange: [2, 3],
      wordingBias: {
        concise: 0.9,
        balanced: 0.6,
      },
      examWeights: {
        ssc: 1.25,
        rrb: 1.2,
        ibps: 0.9,
      },
    },
    {
      id: "neighbor_clue_linear",
      topicCluster:
        "seating-arrangement",
      reasoningCategories: [
        "neighbor-inference",
        "chained-deduction",
      ],
      preferredOperations: [
        "compare",
        "infer",
      ],
      commonDistractors: [
        "wrongIntermediateValue",
        "comparisonTrap",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 4],
      wordingBias: {
        concise: 0.7,
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.1,
        ibps: 1.2,
        sbi: 1.1,
      },
    },
    {
      id: "relative_position_clue",
      topicCluster:
        "seating-arrangement",
      reasoningCategories: [
        "chained-deduction",
        "neighbor-inference",
      ],
      preferredOperations: [
        "compare",
        "infer",
        "transform",
      ],
      commonDistractors: [
        "comparisonTrap",
        "wrongIntermediateValue",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 5],
      wordingBias: {
        balanced: 0.8,
        inferenceHeavy: 0.7,
      },
      examWeights: {
        ibps: 1.2,
        sbi: 1.2,
        cat: 1.1,
      },
    },
    {
      id: "circular_opposite_chain",
      topicCluster:
        "seating-arrangement",
      reasoningCategories: [
        "chained-deduction",
      ],
      preferredOperations: [
        "infer",
        "compare",
        "transform",
      ],
      commonDistractors: [
        "comparisonTrap",
        "wrongIntermediateValue",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [4, 6],
      wordingBias: {
        balanced: 0.7,
        inferenceHeavy: 0.8,
      },
      examWeights: {
        ibps: 1.2,
        sbi: 1.25,
        cat: 1.15,
      },
    },
    {
      id: "row_facing_inference",
      topicCluster:
        "seating-arrangement",
      reasoningCategories: [
        "neighbor-inference",
        "chained-deduction",
      ],
      preferredOperations: [
        "compare",
        "infer",
        "filter",
      ],
      commonDistractors: [
        "comparisonTrap",
        "wrongIntermediateValue",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [4, 6],
      wordingBias: {
        balanced: 0.75,
        inferenceHeavy: 0.8,
      },
      examWeights: {
        ibps: 1.25,
        sbi: 1.25,
        cat: 1.1,
      },
    },
    {
      id: "alternate_facing_deduction",
      topicCluster:
        "seating-arrangement",
      reasoningCategories: [
        "chained-deduction",
      ],
      preferredOperations: [
        "filter",
        "infer",
        "transform",
      ],
      commonDistractors: [
        "comparisonTrap",
        "wrongIntermediateValue",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [5, 7],
      wordingBias: {
        balanced: 0.65,
        inferenceHeavy: 0.9,
      },
      examWeights: {
        ibps: 1.3,
        sbi: 1.3,
        cat: 1.2,
      },
    },
    {
      id: "double_row_elimination",
      topicCluster:
        "seating-arrangement",
      reasoningCategories: [
        "chained-deduction",
      ],
      preferredOperations: [
        "filter",
        "compare",
        "infer",
      ],
      commonDistractors: [
        "comparisonTrap",
        "wrongIntermediateValue",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [5, 7],
      wordingBias: {
        balanced: 0.7,
        inferenceHeavy: 0.85,
      },
      examWeights: {
        ibps: 1.3,
        sbi: 1.3,
        cat: 1.15,
      },
    },
  ];
