import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

export const compoundInterestConcepts = [
  "SI-CI contrast",
  "compounding frequency trap",
  "compound schedule comparison",
];

export const compoundInterestMotifs: QuantMotif[] =
  [
    defineQuantMotif({
      id: "compounding-trap",
      topicCluster: "si-ci",
      archetype: "general",
      reasoningCategories: [
        "compound-change",
        "nested-operations",
      ],
      preferredOperations: [
        "aggregate",
        "transform",
        "infer",
      ],
      commonDistractors: [
        "simpleInterestSubstitution",
        "wrongPeriodRate",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 6],
      generationStrategy: [
        "compare SI and CI or compare different compounding schedules",
      ],
      parameterRanges: {
        rate: {
          min: 4,
          max: 18,
        },
        years: {
          min: 2,
          max: 4,
        },
      },
      distractorStrategies: [
        "apply simple interest formula to CI",
        "forget compounding frequency change",
      ],
      difficultyTuning: {
        medium: [
          "two-year SI-CI difference",
        ],
        hard: [
          "quarterly or half-yearly compounding",
        ],
      },
      validationRules: [
        "keep resulting interest values manageable",
      ],
      diversityTags: [
        "si-ci-contrast",
      ],
      rotationGroup:
        "quant-interest-core",
      wordingBias: {
        balanced: 0.75,
      },
      examWeights: {
        ssc: 1.0,
        ibps: 1.2,
        sbi: 1.25,
      },
    }),
  ];
