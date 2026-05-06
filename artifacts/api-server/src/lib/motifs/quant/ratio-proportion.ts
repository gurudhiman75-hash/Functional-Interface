import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

export const ratioProportionConcepts = [
  "common-base normalization",
  "ratio comparison across totals",
  "time-weighted contribution ratios",
];

export const ratioProportionMotifs: QuantMotif[] =
  [
    defineQuantMotif({
      id: "ratio-normalization-switch",
      topicCluster:
        "ratio-proportion",
      archetype: "ratio-trap",
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
      inferenceStyle: "hidden",
      reasoningDepthRange: [2, 5],
      generationStrategy: [
        "present ratios on different totals",
        "force common-base normalization before comparison",
      ],
      parameterRanges: {
        ratioPart: {
          min: 2,
          max: 11,
        },
        totalValue: {
          min: 60,
          max: 360,
        },
      },
      distractorStrategies: [
        "compare raw ratio parts",
        "normalize only one side",
      ],
      difficultyTuning: {
        easy: [
          "single normalization",
        ],
        medium: [
          "normalization plus transfer",
        ],
        hard: [
          "hidden total after normalization",
        ],
      },
      validationRules: [
        "keep ratios reducible but non-trivial",
      ],
      diversityTags: [
        "ratio-normalization",
      ],
      rotationGroup:
        "quant-ratio-core",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.2,
        rrb: 1.1,
      },
    }),
    defineQuantMotif({
      id: "partnership-ratio-switch",
      topicCluster:
        "ratio-proportion",
      archetype: "ratio-trap",
      reasoningCategories: [
        "ratio-adjustment",
        "conditional-selection",
      ],
      preferredOperations: [
        "transform",
        "infer",
        "filter",
      ],
      commonDistractors: [
        "timeIgnored",
        "ratioInversion",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 6],
      generationStrategy: [
        "change one ratio driver mid-problem",
        "force part-time or weighted contribution reasoning",
      ],
      parameterRanges: {
        contributionMonths: {
          min: 3,
          max: 12,
        },
      },
      distractorStrategies: [
        "ignore timing switch",
        "apply final ratio throughout",
      ],
      difficultyTuning: {
        medium: [
          "one partner joins late",
        ],
        hard: [
          "join-and-leave contribution mix",
        ],
      },
      validationRules: [
        "ensure contribution shares remain integral",
      ],
      diversityTags: [
        "ratio-time-weight",
      ],
      rotationGroup:
        "quant-ratio-core",
      wordingBias: {
        balanced: 0.7,
        inferenceHeavy: 0.7,
      },
      examWeights: {
        ibps: 1.2,
        sbi: 1.15,
      },
    }),
  ];
