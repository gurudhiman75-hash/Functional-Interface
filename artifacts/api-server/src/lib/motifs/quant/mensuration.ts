import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

export const mensurationMotifs: QuantMotif[] =
  [
    defineQuantMotif({
      id: "dimension-scale-effect",
      topicCluster: "mensuration",
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
        "linearAreaMixup",
        "areaVolumeMixup",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [2, 5],
      generationStrategy: [
        "change one dimension and ask area or volume effect",
      ],
      parameterRanges: {
        scaleFactor: {
          min: 2,
          max: 5,
        },
      },
      distractorStrategies: [
        "apply linear factor to area or volume",
        "square when cube is needed",
      ],
      difficultyTuning: {
        easy: [
          "single-dimension area change",
        ],
        medium: [
          "multi-dimension scale change",
        ],
        hard: [
          "reverse scale inference from area or volume",
        ],
      },
      validationRules: [
        "keep geometry primitive recognizable",
      ],
      diversityTags: [
        "mensuration-scaling",
      ],
      rotationGroup:
        "quant-mensuration-core",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.15,
        rrb: 1.05,
      },
    }),
    defineQuantMotif({
      id: "composite-shape-breakdown",
      topicCluster: "mensuration",
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
        "missedSubshape",
        "perimeterAreaSwap",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 6],
      generationStrategy: [
        "decompose a composite shape into standard pieces before solving",
      ],
      parameterRanges: {
        sideLength: {
          min: 4,
          max: 30,
        },
      },
      distractorStrategies: [
        "drop one component shape",
        "use area formula for perimeter target",
      ],
      difficultyTuning: {
        medium: [
          "two-piece breakdown",
        ],
        hard: [
          "surface or volume composite breakdown",
        ],
      },
      validationRules: [
        "avoid ambiguous composite geometry",
      ],
      diversityTags: [
        "mensuration-composite",
      ],
      rotationGroup:
        "quant-mensuration-core",
      wordingBias: {
        balanced: 0.75,
        inferenceHeavy: 0.65,
      },
      examWeights: {
        ssc: 1.1,
        ibps: 1.0,
      },
    }),
  ];
