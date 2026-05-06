import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

export const simpleInterestConcepts = [
  "interest difference backsolve",
  "principal reconstruction",
  "rate-time conditioning",
];

export const simpleInterestMotifs: QuantMotif[] =
  [
    defineQuantMotif({
      id: "interest-difference-backsolve",
      topicCluster: "si-ci",
      archetype: "general",
      reasoningCategories: [
        "hidden-base-inference",
        "multi-step-arithmetic",
      ],
      preferredOperations: [
        "reverse",
        "transform",
        "compare",
      ],
      commonDistractors: [
        "principalSlip",
        "rateTimeSwap",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 5],
      generationStrategy: [
        "provide interest difference and one auxiliary condition",
        "backsolve principal or rate",
      ],
      parameterRanges: {
        principal: {
          min: 500,
          max: 5000,
        },
      },
      distractorStrategies: [
        "treat difference as annual interest",
        "swap rate and time variables",
      ],
      difficultyTuning: {
        medium: [
          "solve principal from one difference",
        ],
        hard: [
          "solve rate with compound frequency change",
        ],
      },
      validationRules: [
        "ensure unique principal-rate combination",
      ],
      diversityTags: [
        "interest-backsolve",
      ],
      rotationGroup:
        "quant-interest-core",
      wordingBias: {
        balanced: 0.7,
        inferenceHeavy: 0.7,
      },
      examWeights: {
        ibps: 1.15,
        sbi: 1.2,
      },
    }),
  ];
