import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

export const percentageConcepts = [
  "reverse percentage recovery",
  "hidden base reconstruction",
  "linked percentage changes",
];

export const percentageDistractorStrategies =
  [
    "use changed-base denominator",
    "treat successive changes as additive",
    "drop one bridge condition",
  ];

export const percentageParameterRules = [
  "keep percent values non-trivial",
  "avoid symmetric percentage pairs",
];

export const percentageDifficultyTuning = [
  "easy: one reverse step",
  "medium: reverse plus comparison",
  "hard: chained hidden-base inference",
];

export const percentageGenerationStrategyMetadata =
  [
    "prefer reverse reconstruction over direct percent lookup",
    "force one relational bridge before final arithmetic",
  ];

export const percentageMotifs: QuantMotif[] =
  [
    defineQuantMotif({
      id: "hidden-base-shift",
      topicCluster: "percentage",
      archetype: "reverse-percentage",
      reasoningCategories: [
        "hidden-base-inference",
        "reverse-percentage",
      ],
      preferredOperations: [
        "transform",
        "compare",
        "infer",
      ],
      commonDistractors: [
        "wrongDenominator",
        "baseSwapTrap",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 5],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "hide the original base value behind a later comparison",
        "force reverse-percentage reconstruction before final arithmetic",
      ],
      parameterRanges: {
        percentageChange: {
          min: 8,
          max: 45,
        },
        baseValue: {
          min: 80,
          max: 480,
        },
      },
      distractorStrategies: [
        "use changed-base denominator",
        "ignore reverse step",
      ],
      difficultyTuning: {
        easy: [
          "single reverse step",
        ],
        medium: [
          "combine reverse step with comparison",
        ],
        hard: [
          "chain two hidden-base inferences",
        ],
      },
      validationRules: [
        "avoid symmetric percentage pairs",
        "require non-trivial reverse calculation",
      ],
      diversityTags: [
        "percent-base-shift",
        "reverse-reconstruction",
      ],
      rotationGroup:
        "quant-percentage-core",
      wordingBias: {
        balanced: 0.8,
        inferenceHeavy: 0.7,
      },
      examWeights: {
        ssc: 1.1,
        ibps: 1.2,
        sbi: 1.1,
      },
    }),
    defineQuantMotif({
      id: "reverse-percentage-bridge",
      topicCluster: "percentage",
      archetype: "reverse-percentage",
      reasoningCategories: [
        "reverse-percentage",
        "chained-percentage-ratio",
      ],
      preferredOperations: [
        "reverse",
        "transform",
        "aggregate",
      ],
      commonDistractors: [
        "netChangeConfusion",
        "partialAggregation",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 6],
      generationStrategy: [
        "bridge two related percentage statements through one unknown",
        "ask for the original value or missing component",
      ],
      parameterRanges: {
        percentA: {
          min: 10,
          max: 35,
        },
        percentB: {
          min: 5,
          max: 25,
        },
      },
      distractorStrategies: [
        "treat successive changes as additive",
        "drop one bridge condition",
      ],
      difficultyTuning: {
        medium: [
          "one linked bridge",
        ],
        hard: [
          "two-stage bridge with hidden total",
        ],
      },
      validationRules: [
        "ensure integral final answer",
      ],
      diversityTags: [
        "successive-change",
        "linked-percent",
      ],
      rotationGroup:
        "quant-percentage-core",
      wordingBias: {
        balanced: 0.7,
        inferenceHeavy: 0.75,
      },
      examWeights: {
        ibps: 1.15,
        sbi: 1.2,
      },
    }),
  ];
