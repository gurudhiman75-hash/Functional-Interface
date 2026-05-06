import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

export const speedDistanceConcepts = [
  "relative speed",
  "passing-length offset",
  "unit conversion discipline",
];

export const speedDistanceMotifs: QuantMotif[] =
  [
    defineQuantMotif({
      id: "relative-speed-meet",
      topicCluster:
        "speed-time-distance",
      archetype: "general",
      reasoningCategories: [
        "comparison-chain",
        "multi-step-arithmetic",
      ],
      preferredOperations: [
        "compare",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "sameDirectionTrap",
        "unitMismatch",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [2, 5],
      generationStrategy: [
        "build meet-or-overtake scenarios around relative speed",
      ],
      parameterRanges: {
        speedA: {
          min: 18,
          max: 90,
        },
        speedB: {
          min: 12,
          max: 80,
        },
      },
      distractorStrategies: [
        "add speeds when subtraction is needed",
        "ignore unit conversion",
      ],
      difficultyTuning: {
        easy: [
          "same-direction catch-up",
        ],
        medium: [
          "opposite-direction meet",
        ],
        hard: [
          "delay plus relative speed",
        ],
      },
      validationRules: [
        "convert to one unit system internally",
      ],
      diversityTags: [
        "relative-speed",
      ],
      rotationGroup:
        "quant-std-core",
      wordingBias: {
        concise: 0.5,
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.2,
        ibps: 1.1,
      },
    }),
    defineQuantMotif({
      id: "train-platform-offset",
      topicCluster:
        "speed-time-distance",
      archetype: "general",
      reasoningCategories: [
        "hidden-base-inference",
      ],
      preferredOperations: [
        "transform",
        "aggregate",
        "compare",
      ],
      commonDistractors: [
        "lengthIgnored",
        "secondsHoursConfusion",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [2, 5],
      generationStrategy: [
        "link passing time with train and platform length",
      ],
      parameterRanges: {
        trainLength: {
          min: 90,
          max: 360,
        },
        platformLength: {
          min: 60,
          max: 300,
        },
      },
      distractorStrategies: [
        "use only platform length",
        "forget to add train length",
      ],
      difficultyTuning: {
        medium: [
          "single platform crossing",
        ],
        hard: [
          "two crossings with changed speed",
        ],
      },
      validationRules: [
        "keep speed-time conversion clean",
      ],
      diversityTags: [
        "train-passing",
      ],
      rotationGroup:
        "quant-std-core",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.2,
        rrb: 1.1,
      },
    }),
  ];
