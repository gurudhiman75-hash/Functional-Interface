import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

export const algebraBasicsMotifs: QuantMotif[] =
  [
    defineQuantMotif({
      id: "equation-balance-shift",
      topicCluster:
        "algebra-basics",
      archetype: "general",
      reasoningCategories: [
        "one-step-arithmetic",
        "hidden-base-inference",
      ],
      preferredOperations: [
        "transform",
        "reverse",
        "compare",
      ],
      commonDistractors: [
        "signError",
        "wrongTransposition",
      ],
      inferenceStyle: "direct",
      reasoningDepthRange: [2, 4],
      generationStrategy: [
        "embed one linear relation inside another comparison or condition",
      ],
      parameterRanges: {
        coefficient: {
          min: 2,
          max: 12,
        },
      },
      distractorStrategies: [
        "flip sign while transposing",
        "divide before simplification",
      ],
      difficultyTuning: {
        easy: [
          "one linear equation",
        ],
        medium: [
          "equation plus condition",
        ],
        hard: [
          "two variables with elimination hint",
        ],
      },
      validationRules: [
        "ensure unique solution",
      ],
      diversityTags: [
        "algebra-linear",
      ],
      rotationGroup:
        "quant-algebra-core",
      wordingBias: {
        concise: 0.6,
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.1,
        cat: 0.9,
      },
    }),
    defineQuantMotif({
      id: "variable-elimination",
      topicCluster:
        "algebra-basics",
      archetype: "general",
      reasoningCategories: [
        "multi-step-arithmetic",
        "comparison-chain",
      ],
      preferredOperations: [
        "aggregate",
        "transform",
        "infer",
      ],
      commonDistractors: [
        "coefficientMismatch",
        "substitutionSlip",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 5],
      generationStrategy: [
        "solve paired equations through elimination or substitution",
      ],
      parameterRanges: {
        constant: {
          min: 6,
          max: 80,
        },
      },
      distractorStrategies: [
        "equate wrong coefficients",
        "substitute partial expression only",
      ],
      difficultyTuning: {
        medium: [
          "two-variable elimination",
        ],
        hard: [
          "parameterized elimination with one hidden relation",
        ],
      },
      validationRules: [
        "avoid dependent systems",
      ],
      diversityTags: [
        "algebra-elimination",
      ],
      rotationGroup:
        "quant-algebra-core",
      wordingBias: {
        balanced: 0.75,
      },
      examWeights: {
        cat: 1.1,
        ssc: 1.0,
      },
    }),
  ];
