import { QuantMotif } from "./types";

export const directionSenseMotifs: QuantMotif[] = [
  {
    id: "straight_path_distance",
    topicCluster: "direction-sense",
    reasoningCategories: [
      "straight-movement",
      "direct-distance",
    ],
    preferredOperations: [
      "transform",
      "compare",
    ],
    commonDistractors: [
      "arithmeticSlip",
      "comparisonTrap",
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
    id: "simple_turn_tracking",
    topicCluster: "direction-sense",
    reasoningCategories: [
      "simple-left-right-turns",
      "orientation-changes",
    ],
    preferredOperations: [
      "transform",
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
      balanced: 0.6,
    },
    examWeights: {
      ssc: 1.2,
      ibps: 1.1,
      sbi: 1,
    },
  },
  {
    id: "shortest_distance_inference",
    topicCluster: "direction-sense",
    reasoningCategories: [
      "shortest-distance-inference",
      "multiple-turns",
    ],
    preferredOperations: [
      "transform",
      "aggregate",
      "infer",
    ],
    commonDistractors: [
      "wrongIntermediateValue",
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
      ssc: 1,
    },
  },
  {
    id: "orientation_shift_chain",
    topicCluster: "direction-sense",
    reasoningCategories: [
      "orientation-changes",
      "coordinate-inference-chains",
    ],
    preferredOperations: [
      "transform",
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
    id: "conditional_movement_reasoning",
    topicCluster: "direction-sense",
    reasoningCategories: [
      "conditional-movement-reasoning",
      "hidden-orientation-shifts",
    ],
    preferredOperations: [
      "filter",
      "transform",
      "infer",
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
    id: "coordinate_inference_chain",
    topicCluster: "direction-sense",
    reasoningCategories: [
      "complex-directional-chains",
      "coordinate-inference-chains",
    ],
    preferredOperations: [
      "transform",
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
  ...[
    {
      id: "spa-dir-pythagoras",
      reasoningCategories: [
        "vector-path",
        "shortest-distance-inference",
      ],
      preferredOperations: [
        "transform",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "HypotenuseNeglect",
        "RelativeDirectionFlip",
      ],
      inferenceStyle: "conditional" as const,
      reasoningDepthRange: [2, 4] as [
        number,
        number,
      ],
      examWeights: {
        ssc: 1.2,
        ibps: 1.2,
        rrb: 1.1,
      },
    },
    {
      id: "spa-dir-shadow",
      reasoningCategories: [
        "shadow-direction",
        "relative-direction",
      ],
      preferredOperations: [
        "compare",
        "infer",
      ],
      commonDistractors: [
        "RelativeDirectionFlip",
      ],
      inferenceStyle: "direct" as const,
      reasoningDepthRange: [1, 3] as [
        number,
        number,
      ],
      examWeights: {
        ssc: 1.1,
        rrb: 1.1,
      },
    },
    {
      id: "spa-dir-degrees",
      reasoningCategories: [
        "angle-turning",
        "coordinate-transformation",
      ],
      preferredOperations: [
        "transform",
        "infer",
      ],
      commonDistractors: [
        "RelativeDirectionFlip",
      ],
      inferenceStyle: "conditional" as const,
      reasoningDepthRange: [2, 5] as [
        number,
        number,
      ],
      examWeights: {
        ibps: 1.2,
        sbi: 1.1,
        cat: 1,
      },
    },
    {
      id: "spa-dice-logic",
      reasoningCategories: [
        "dice-opposite-face",
        "3d-visualization",
      ],
      preferredOperations: [
        "infer",
        "compare",
      ],
      commonDistractors: [
        "DiceAdjacencyTrap",
      ],
      inferenceStyle: "hidden" as const,
      reasoningDepthRange: [3, 5] as [
        number,
        number,
      ],
      examWeights: {
        ibps: 1.2,
        sbi: 1.2,
        cat: 1.1,
      },
    },
    {
      id: "spa-cube-painting",
      reasoningCategories: [
        "painted-cube",
        "3d-counting",
      ],
      preferredOperations: [
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "Surface_Count_Trap",
        "Corner_Edge_Confusion",
      ],
      inferenceStyle: "hidden" as const,
      reasoningDepthRange: [3, 6] as [
        number,
        number,
      ],
      examWeights: {
        ibps: 1.2,
        cat: 1.3,
      },
    },
    {
      id: "spa-cube-folding",
      reasoningCategories: [
        "cube-net",
        "3d-visualization",
      ],
      preferredOperations: [
        "transform",
        "infer",
      ],
      commonDistractors: [
        "DiceAdjacencyTrap",
      ],
      inferenceStyle: "hidden" as const,
      reasoningDepthRange: [3, 6] as [
        number,
        number,
      ],
      examWeights: {
        ibps: 1.1,
        cat: 1.3,
      },
    },
    {
      id: "spa-img-mirror",
      reasoningCategories: [
        "mirror-image",
        "vertical-reflection",
      ],
      preferredOperations: [
        "transform",
      ],
      commonDistractors: [
        "MirrorLinearError",
      ],
      inferenceStyle: "direct" as const,
      reasoningDepthRange: [1, 3] as [
        number,
        number,
      ],
      examWeights: {
        ssc: 1.2,
        rrb: 1.1,
      },
    },
    {
      id: "spa-img-water",
      reasoningCategories: [
        "water-image",
        "horizontal-reflection",
      ],
      preferredOperations: [
        "transform",
      ],
      commonDistractors: [
        "MirrorLinearError",
      ],
      inferenceStyle: "direct" as const,
      reasoningDepthRange: [1, 3] as [
        number,
        number,
      ],
      examWeights: {
        ssc: 1.1,
        rrb: 1.1,
      },
    },
    {
      id: "spa-paper-fold",
      reasoningCategories: [
        "paper-folding",
        "successive-symmetry",
      ],
      preferredOperations: [
        "transform",
        "infer",
      ],
      commonDistractors: [
        "Fold_Count_Error",
        "Symmetry_Omission",
      ],
      inferenceStyle: "hidden" as const,
      reasoningDepthRange: [3, 6] as [
        number,
        number,
      ],
      examWeights: {
        ibps: 1.1,
        sbi: 1.1,
        cat: 1.2,
      },
    },
  ].map((motif) => ({
    topicCluster:
      "direction-sense" as const,
    compatibleTopics: [
      "direction-sense",
      "engine-spatial",
      "cubes-dice",
      "mirror-water-images",
      "paper-folding",
      "spatial-reasoning",
    ],
    compatiblePatternTypes: [
      "logic" as const,
    ],
    supportedReasoningTypes: [
      "symbolic" as const,
      "inferential" as const,
      "multi-step" as const,
      "visual" as const,
    ],
    wordingBias: {
      balanced: 0.8,
      inferenceHeavy: 0.6,
    },
    ...motif,
  })),
];
