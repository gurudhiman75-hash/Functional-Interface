import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

export const mixtureAlligationConcepts = [
  "alligation",
  "replacement after mixing",
  "concentration shift",
];

export const mixtureAlligationMotifs: QuantMotif[] =
  [
    defineQuantMotif({
      id: "weighted-mixture-shift",
      topicCluster:
        "mixture-alligation",
      archetype: "general",
      reasoningCategories: [
        "ratio-conversion",
        "comparative-conditional-inference",
      ],
      preferredOperations: [
        "transform",
        "compare",
        "infer",
      ],
      commonDistractors: [
        "wrongBaseVolume",
        "straightAverageTrap",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 6],
      generationStrategy: [
        "mix two concentrations and shift one component after blending",
      ],
      parameterRanges: {
        concentrationA: {
          min: 10,
          max: 60,
        },
        concentrationB: {
          min: 5,
          max: 45,
        },
      },
      distractorStrategies: [
        "take direct average of concentrations",
        "ignore replacement after mixing",
      ],
      difficultyTuning: {
        medium: [
          "single alligation step",
        ],
        hard: [
          "alligation plus replacement",
        ],
      },
      validationRules: [
        "ensure concentration remains bounded",
      ],
      diversityTags: [
        "alligation-core",
      ],
      rotationGroup:
        "quant-mixture-core",
      wordingBias: {
        balanced: 0.75,
      },
      examWeights: {
        ibps: 1.15,
        sbi: 1.15,
      },
    }),
    defineQuantMotif({
      id: "replacement-alligation",
      topicCluster:
        "mixture-alligation",
      archetype: "general",
      reasoningCategories: [
        "conditional-ratio-logic",
      ],
      preferredOperations: [
        "filter",
        "transform",
        "infer",
      ],
      commonDistractors: [
        "netVolumeIgnored",
        "wrongReplacementRatio",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 6],
      generationStrategy: [
        "remove-and-replace equal quantity to reach target concentration",
      ],
      parameterRanges: {
        containerVolume: {
          min: 20,
          max: 120,
        },
      },
      distractorStrategies: [
        "adjust concentration without removal",
        "use wrong repeated replacement formula",
      ],
      difficultyTuning: {
        medium: [
          "single replacement",
        ],
        hard: [
          "repeated replacement",
        ],
      },
      validationRules: [
        "avoid degenerate 0% or 100% concentrations",
      ],
      diversityTags: [
        "replacement-mixture",
      ],
      rotationGroup:
        "quant-mixture-core",
      wordingBias: {
        balanced: 0.7,
        inferenceHeavy: 0.7,
      },
      examWeights: {
        ssc: 1.0,
        ibps: 1.2,
      },
    }),
  ];
