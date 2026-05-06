import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

export const profitLossConcepts = [
  "discount-profit bridge",
  "effective successive discount",
  "base consistency",
];

export const profitLossMotifs: QuantMotif[] =
  [
    defineQuantMotif({
      id: "discount-profit-link",
      topicCluster: "profit-loss",
      archetype: "general",
      reasoningCategories: [
        "comparative-conditional-inference",
      ],
      preferredOperations: [
        "transform",
        "compare",
        "infer",
      ],
      commonDistractors: [
        "sameBaseAssumption",
        "marginDiscountMixup",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 6],
      generationStrategy: [
        "link marked price, discount, and profit through one unknown cost price",
      ],
      parameterRanges: {
        discountPercent: {
          min: 5,
          max: 35,
        },
        profitPercent: {
          min: 8,
          max: 40,
        },
      },
      distractorStrategies: [
        "take profit percent on marked price",
        "subtract discount directly from profit",
      ],
      difficultyTuning: {
        easy: [
          "single discount-profit relation",
        ],
        medium: [
          "marked price backsolve",
        ],
        hard: [
          "successive discount before profit target",
        ],
      },
      validationRules: [
        "keep cost price positive and integral",
      ],
      diversityTags: [
        "marked-price-bridge",
      ],
      rotationGroup:
        "quant-profit-loss-core",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.2,
        ibps: 1.15,
      },
    }),
    defineQuantMotif({
      id: "successive-discount-margin",
      topicCluster: "profit-loss",
      archetype: "general",
      reasoningCategories: [
        "multi-step-arithmetic",
      ],
      preferredOperations: [
        "aggregate",
        "transform",
        "compare",
      ],
      commonDistractors: [
        "additiveDiscountError",
        "wrongFinalBase",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 6],
      generationStrategy: [
        "use two discounts or discount-plus-rebate",
        "ask effective profit, loss, or marked price",
      ],
      parameterRanges: {
        discountOne: {
          min: 5,
          max: 25,
        },
        discountTwo: {
          min: 5,
          max: 20,
        },
      },
      distractorStrategies: [
        "add discounts directly",
        "take net change from cost price",
      ],
      difficultyTuning: {
        medium: [
          "two successive discounts",
        ],
        hard: [
          "discount chain with target margin",
        ],
      },
      validationRules: [
        "avoid identical discount percentages",
      ],
      diversityTags: [
        "successive-discount",
      ],
      rotationGroup:
        "quant-profit-loss-core",
      wordingBias: {
        balanced: 0.7,
        inferenceHeavy: 0.65,
      },
      examWeights: {
        ibps: 1.2,
        sbi: 1.15,
      },
    }),
  ];
