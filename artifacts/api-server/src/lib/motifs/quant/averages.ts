import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

export const averagesConcepts = [
  "weighted merge",
  "replacement delta",
  "group-size sensitivity",
];

export const averagesMotifs: QuantMotif[] =
  [
    defineQuantMotif({
      id: "weighted-average-confusion",
      topicCluster: "averages",
      archetype: "general",
      reasoningCategories: [
        "average-transformation",
        "comparison-chain",
      ],
      preferredOperations: [
        "aggregate",
        "compare",
        "transform",
      ],
      commonDistractors: [
        "simpleMeanTrap",
        "wrongGroupSize",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [2, 5],
      generationStrategy: [
        "split data into unequal groups",
        "force weighted average instead of direct mean",
      ],
      parameterRanges: {
        groupA: {
          min: 3,
          max: 10,
        },
        groupB: {
          min: 2,
          max: 8,
        },
      },
      distractorStrategies: [
        "take simple mean of subgroup averages",
        "swap subgroup sizes",
      ],
      difficultyTuning: {
        easy: [
          "two groups only",
        ],
        medium: [
          "weighted merge with missing total",
        ],
        hard: [
          "replacement or removal after weighted merge",
        ],
      },
      validationRules: [
        "avoid equal group sizes for weighted motifs",
      ],
      diversityTags: [
        "weighted-average",
      ],
      rotationGroup:
        "quant-averages-core",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.1,
        ibps: 1.2,
      },
    }),
    defineQuantMotif({
      id: "replacement-average-shift",
      topicCluster: "averages",
      archetype: "general",
      reasoningCategories: [
        "average-transformation",
        "hidden-base-inference",
      ],
      preferredOperations: [
        "transform",
        "compare",
        "infer",
      ],
      commonDistractors: [
        "differenceSignError",
        "wrongCountUsage",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [2, 5],
      generationStrategy: [
        "replace one or more observations",
        "solve through average delta and count",
      ],
      parameterRanges: {
        itemCount: {
          min: 4,
          max: 15,
        },
      },
      distractorStrategies: [
        "apply change to one value instead of total",
        "forget multiplication by count",
      ],
      difficultyTuning: {
        medium: [
          "single replacement",
        ],
        hard: [
          "multiple replacements with missing original",
        ],
      },
      validationRules: [
        "keep average shifts integer-friendly",
      ],
      diversityTags: [
        "average-replacement",
      ],
      rotationGroup:
        "quant-averages-core",
      wordingBias: {
        balanced: 0.75,
      },
      examWeights: {
        ssc: 1.2,
        ibps: 1.1,
      },
    }),
  ];
