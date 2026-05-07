import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

type MixtureSubtype =
  | "alligation"
  | "replacement"
  | "repeated_replacement"
  | "weighted_mixture"
  | "purity"
  | "cost_mixture"
  | "ratio_mixing";

type MixtureMotifDraft = {
  id: string;
  subtype: MixtureSubtype;
  primitives: string[];
  hiddenStructures: string[];
  distractorFamilies: string[];
  arithmeticProfile: string[];
  difficulty: 1 | 2 | 3 | 4;
  examples: string[];
};

export const mixtureAlligationScopeMap = {
  chapter: "Mixture & Alligation",
  coreDomains: [
    "Simple Mixtures",
    "Alligation Rule",
    "Replacement Problems",
    "Concentration",
    "Ratio Mixing",
    "Profit-Oriented Mixtures",
    "Water-Milk Problems",
    "Successive Replacement",
    "Weighted Blending",
    "Average Value Mixing",
    "Purity Problems",
    "Cost Price Mixtures",
  ],
} as const;

export const mixtureAlligationConcepts =
  [
    "weighted contribution",
    "alligation rule",
    "replacement transformation",
    "concentration state model",
    "successive replacement decay",
    "cost-based blending",
    "constant-volume composition tracking",
  ];

export const mixtureAlligationCoreFrameworks =
  [
    {
      id: "CF1",
      title:
        "Weighted Mixture Framework",
      canonicalRelation:
        "final_value = sum(component_value x quantity) / total_quantity",
    },
    {
      id: "CF2",
      title: "Alligation Rule",
      canonicalRelation:
        "ratio = |higher - mean| : |mean - lower|",
    },
    {
      id: "CF3",
      title:
        "Replacement Transformation",
      canonicalRelation:
        "remove_quantity -> replace_with_new_component -> composition_changes",
    },
    {
      id: "CF4",
      title:
        "Concentration State Model",
      canonicalRelation:
        "concentration = pure_quantity / total_quantity",
    },
    {
      id: "CF5",
      title:
        "Successive Replacement Decay",
      canonicalRelation:
        "remaining_pure = Q (1 - x/V)^n",
    },
    {
      id: "CF6",
      title:
        "Cost-Based Mixture Framework",
      canonicalRelation:
        "blended_cost = sum(cost x quantity) / total_quantity",
    },
  ];

export const mixtureAlligationConceptModules =
  [
    "simple mixture formation",
    "alligation ratio reconstruction",
    "successive replacement",
    "purity transformation",
    "cost mixing systems",
    "ratio-based mixing",
    "water-milk systems",
    "multi-stage concentration update",
  ];

export const mixtureAlligationProceduralMotifs: MixtureMotifDraft[] =
  [
    {
      id: "weighted-contribution",
      subtype: "weighted_mixture",
      primitives: [
        "component values",
        "quantities",
      ],
      hiddenStructures: [
        "weighted contribution systems",
      ],
      distractorFamilies: [
        "arithmeticMeanTrap",
        "weightedContributionIgnorance",
      ],
      arithmeticProfile: [
        "weighted aggregation",
      ],
      difficulty: 1,
      examples: [
        "Mixture concentration after combining unequal quantities.",
      ],
    },
    {
      id: "inverse-distance-balancing",
      subtype: "alligation",
      primitives: [
        "higher value",
        "lower value",
        "mean value",
      ],
      hiddenStructures: [
        "inverse distance from mean",
      ],
      distractorFamilies: [
        "ratioInversion",
        "meanValueMisplacement",
      ],
      arithmeticProfile: [
        "cross difference ratio",
      ],
      difficulty: 2,
      examples: [
        "Rice of two costs mixed for a target mean price.",
      ],
    },
    {
      id: "concentration-decay",
      subtype: "repeated_replacement",
      primitives: [
        "initial pure quantity",
        "replacement fraction",
        "repetitions",
      ],
      hiddenStructures: [
        "multiplicative decay",
      ],
      distractorFamilies: [
        "exponentialDecayFailure",
        "replacementQuantityLoss",
      ],
      arithmeticProfile: [
        "geometric reduction",
      ],
      difficulty: 3,
      examples: [
        "Repeated milk-water replacement problems.",
      ],
    },
    {
      id: "composition-state-tracking",
      subtype: "purity",
      primitives: [
        "pure quantity",
        "total quantity",
      ],
      hiddenStructures: [
        "track pure component separately",
      ],
      distractorFamilies: [
        "purityStateForgetting",
      ],
      arithmeticProfile: [
        "state update",
      ],
      difficulty: 2,
      examples: [
        "Dilution or replacement with final purity target.",
      ],
    },
    {
      id: "ratio-reconstruction",
      subtype: "ratio_mixing",
      primitives: [
        "target concentration",
        "component ratio",
      ],
      hiddenStructures: [
        "reverse infer ratio",
      ],
      distractorFamilies: [
        "ratioInversion",
      ],
      arithmeticProfile: [
        "reverse ratio solve",
      ],
      difficulty: 2,
      examples: [
        "Infer component ratio from target mean concentration.",
      ],
    },
    {
      id: "multi-phase-purity-transition",
      subtype: "replacement",
      primitives: [
        "composition update",
        "second update",
      ],
      hiddenStructures: [
        "multi-stage state dependency",
      ],
      distractorFamilies: [
        "multiStageStateReset",
      ],
      arithmeticProfile: [
        "two-phase composition tracking",
      ],
      difficulty: 4,
      examples: [
        "Remove, replace, remix, then infer hidden state.",
      ],
    },
    {
      id: "cost-profit-blend",
      subtype: "cost_mixture",
      primitives: [
        "weighted cost",
        "target mean",
      ],
      hiddenStructures: [
        "weighted cost blending",
      ],
      distractorFamilies: [
        "arithmeticMeanTrap",
        "weightedContributionIgnorance",
      ],
      arithmeticProfile: [
        "weighted cost ratio",
      ],
      difficulty: 2,
      examples: [
        "Cheaper and expensive varieties mixed for a target mean cost.",
      ],
    },
  ];

export const mixtureAlligationQuestionArchetypes =
  [
    "direct alligation",
    "water-milk replacement",
    "repeated replacement",
    "mean concentration",
    "cost mixture",
    "purity reconstruction",
    "multi-step replacement",
  ];

export const mixtureAlligationDistractorEngineering =
  [
    "use arithmetic mean instead of weighted logic",
    "ignore removed pure component",
    "reverse the alligation ratio",
    "apply linear subtraction instead of multiplicative decay",
    "track total only and ignore pure component",
    "ignore unequal quantities",
    "misplace the mean in the cross-difference setup",
    "treat second replacement independently",
  ];

export const mixtureAlligationHiddenInferenceStructures =
  [
    "weighted average backbone",
    "inverse distance logic",
    "composition-state tracking",
    "multiplicative decay",
    "constant volume transformation",
  ];

export const mixtureAlligationDifficultyScaling =
  {
    L1: [
      "direct alligation",
      "simple weighted mixture",
    ],
    L2: [
      "single replacement",
      "ratio reconstruction",
      "cost-based blending",
    ],
    L3: [
      "repeated replacement",
      "hidden purity recovery",
      "multi-stage concentration update",
    ],
    L4: [
      "chained replacement with hidden intermediate states",
      "cost-profit or purity-weight integration",
    ],
  } as const;

export const mixtureAlligationDifficultyTuning =
  [
    "easy: direct weighted mixture or clean alligation ratio",
    "medium: single replacement, purity reconstruction, cost-based mixing",
    "hard: repeated replacement, multi-stage composition tracking, hidden intermediate state recovery",
  ];

export const mixtureAlligationNumericDesignPatterns =
  [
    "prefer concentration families like 10%, 20%, 25%, 40%, 50%, 60%, 75%",
    "prefer clean alligation triples such as (20,30,24), (15,25,20), (40,60,48)",
    "prefer replacement fractions like 1/5, 1/4, 1/3, 1/2",
    "choose decay families where (1 - x/V)^n stays mentally manageable",
  ];

export const mixtureAlligationGeneratorConstraints =
  [
    "preserve pure quantity and total quantity tracking correctly",
    "reward structural insight over brute-force arithmetic",
    "do not collapse weighted systems into simple averages",
    "use realistic litres or kilograms with mentally computable values",
    "treat milk-water, acid-water, and wine-water as the same topology when the state model is identical",
  ];

export const mixtureAlligationGenerationStrategyMetadata =
  [
    "Mixture & Alligation is a weighted-contribution and composition-state topic, not a direct averaging topic",
    "Price, purity, and concentration blending should collapse by weighted-contribution topology rather than wording",
    "Strong generation should rotate beyond direct alligation into replacement and chained purity updates",
    "Avoid cosmetic diversity from simply renaming milk to acid or wine without changing topology",
  ];

export const mixtureAlligationFormulaBank =
  [
    {
      label: "Weighted Mixture",
      latex:
        "\\text{Mean Value} = \\frac{\\sum (x_i q_i)}{\\sum q_i}",
    },
    {
      label: "Alligation",
      latex:
        "\\text{Ratio} = |H - M| : |M - L|",
    },
    {
      label:
        "Repeated Replacement",
      latex:
        "\\text{Remaining Pure Quantity} = Q\\left(1 - \\frac{x}{V}\\right)^n",
    },
  ];

export const mixtureAlligationMetadataSchema =
  {
    subtype: [
      "alligation",
      "replacement",
      "repeated_replacement",
      "weighted_mixture",
      "purity",
      "cost_mixture",
      "ratio_mixing",
    ],
    fields: [
      "primitives",
      "hiddenStructures",
      "distractorFamilies",
      "arithmeticProfile",
      "difficulty",
    ],
  } as const;

export const mixtureAlligationEvaluationRisks =
  [
    "formula exposure from words like mean price, mixed in ratio, or replaced repeatedly",
    "topology collapse where many contexts reduce to weighted contribution",
    "artificial context diversity from swapping milk, acid, wine, or solution without structural change",
  ];

export const mixtureAlligationRealismWeaknesses =
  [
    "overusing milk-water setups",
    "overusing direct alligation",
    "avoiding multi-stage transformations",
    "producing arithmetic-heavy rather than insight-heavy questions",
  ];

export const mixtureAlligationAntiRepetitionNotes =
  [
    "Treat price blending, purity blending, and concentration blending as the same weighted-contribution topology.",
    "Treat repeated replacement, repeated dilution, and repeated purification as the same multiplicative-composition-decay topology.",
  ];

export const mixtureAlligationMotifs: QuantMotif[] =
  [
    defineQuantMotif({
      id: "weighted-contribution",
      topicCluster:
        "mixture-alligation",
      archetype: "general",
      reasoningCategories: [
        "average-transformation",
        "comparison-chain",
      ],
      preferredOperations: [
        "aggregate",
        "transform",
        "infer",
      ],
      commonDistractors: [
        "straightAverageTrap",
        "wrongBaseVolume",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [2, 4],
      supportedDifficultyBands: [
        "Easy",
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "blend unequal component quantities and recover the final mean through weighted contribution",
      ],
      distractorStrategies: [
        "take a direct arithmetic mean of the component values",
        "ignore unequal quantities",
      ],
      difficultyTuning: {
        easy: [
          "direct weighted mixture",
        ],
        medium: [
          "one hidden quantity or target mean",
        ],
        hard: [
          "weighted blending embedded inside another transformation",
        ],
      },
      validationRules: [
        "keep component quantities and values mentally manageable",
      ],
      diversityTags: [
        "mixture-weighted",
      ],
      rotationGroup:
        "quant-mixture-core",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.1,
        ibps: 1.2,
      },
    }),
    defineQuantMotif({
      id: "inverse-distance-balancing",
      topicCluster:
        "mixture-alligation",
      archetype: "general",
      reasoningCategories: [
        "simple-ratio",
        "comparative-conditional-inference",
      ],
      preferredOperations: [
        "compare",
        "transform",
        "infer",
      ],
      commonDistractors: [
        "wrongReplacementRatio",
        "straightAverageTrap",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [2, 4],
      supportedDifficultyBands: [
        "Easy",
        "Medium",
      ],
      generationStrategy: [
        "use cross-difference alligation to infer the contribution ratio from the target mean",
      ],
      distractorStrategies: [
        "reverse the alligation ratio",
        "place the mean on the wrong side of the cross difference",
      ],
      difficultyTuning: {
        easy: [
          "direct alligation ratio",
        ],
        medium: [
          "alligation with hidden target or hidden component quantity",
        ],
      },
      validationRules: [
        "prefer clean ratio outcomes",
      ],
      diversityTags: [
        "mixture-alligation",
      ],
      rotationGroup:
        "quant-mixture-core",
      wordingBias: {
        concise: 0.75,
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.2,
        ibps: 1.15,
      },
    }),
    defineQuantMotif({
      id: "composition-state-tracking",
      topicCluster:
        "mixture-alligation",
      archetype: "general",
      reasoningCategories: [
        "conditional-ratio-logic",
        "multi-step-arithmetic",
      ],
      preferredOperations: [
        "transform",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "netVolumeIgnored",
        "wrongBaseVolume",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [2, 5],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "track pure quantity and total quantity separately across a single replacement or dilution event",
      ],
      distractorStrategies: [
        "track only total quantity and forget pure quantity",
        "ignore the removed pure component",
      ],
      difficultyTuning: {
        medium: [
          "single replacement or dilution",
        ],
        hard: [
          "hidden removed quantity or hidden final purity",
        ],
      },
      validationRules: [
        "preserve constant-volume logic where appropriate",
      ],
      diversityTags: [
        "mixture-composition",
      ],
      rotationGroup:
        "quant-mixture-core",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.15,
      },
    }),
    defineQuantMotif({
      id: "concentration-decay",
      topicCluster:
        "mixture-alligation",
      archetype: "general",
      reasoningCategories: [
        "nested-operations",
        "multi-step-arithmetic",
      ],
      preferredOperations: [
        "transform",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "netVolumeIgnored",
        "wrongReplacementRatio",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 6],
      supportedDifficultyBands: [
        "Hard",
      ],
      generationStrategy: [
        "apply multiplicative decay to the pure component across repeated equal replacement steps",
      ],
      distractorStrategies: [
        "apply linear subtraction instead of multiplicative decay",
        "reset the state after each replacement",
      ],
      difficultyTuning: {
        hard: [
          "repeated replacement with final remaining pure quantity or final concentration",
        ],
      },
      validationRules: [
        "prefer decay fractions that stay mentally tractable",
      ],
      diversityTags: [
        "mixture-decay",
      ],
      rotationGroup:
        "quant-mixture-core",
      wordingBias: {
        inferenceHeavy: 0.75,
        balanced: 0.65,
      },
      examWeights: {
        ssc: 1.0,
        ibps: 1.15,
      },
    }),
    defineQuantMotif({
      id: "ratio-reconstruction",
      topicCluster:
        "mixture-alligation",
      archetype: "general",
      reasoningCategories: [
        "simple-ratio",
        "conditional-ratio-logic",
      ],
      preferredOperations: [
        "transform",
        "compare",
        "infer",
      ],
      commonDistractors: [
        "wrongReplacementRatio",
        "straightAverageTrap",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [2, 4],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "reverse-infer the mixture ratio or missing component concentration from the target blend",
      ],
      distractorStrategies: [
        "invert the final ratio",
        "take a direct average instead of solving the weighted relation",
      ],
      difficultyTuning: {
        medium: [
          "recover one ratio directly",
        ],
        hard: [
          "recover ratio from partially hidden concentration state",
        ],
      },
      validationRules: [
        "prefer clean final ratios",
      ],
      diversityTags: [
        "mixture-ratio",
      ],
      rotationGroup:
        "quant-mixture-core",
      wordingBias: {
        balanced: 0.75,
      },
      examWeights: {
        ssc: 1.05,
      },
    }),
    defineQuantMotif({
      id: "cost-profit-blend",
      topicCluster:
        "mixture-alligation",
      archetype: "general",
      reasoningCategories: [
        "average-transformation",
        "comparative-conditional-inference",
      ],
      preferredOperations: [
        "aggregate",
        "transform",
        "infer",
      ],
      commonDistractors: [
        "straightAverageTrap",
        "wrongBaseVolume",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [2, 5],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "blend cheaper and costlier components to reach a target mean cost or implied profit-oriented blend",
      ],
      distractorStrategies: [
        "take direct average of prices",
        "ignore quantity contribution",
      ],
      difficultyTuning: {
        medium: [
          "target mean cost only",
        ],
        hard: [
          "cost blend plus margin or final selling-value inference",
        ],
      },
      validationRules: [
        "keep cost values SSC-friendly and ratio-solvable",
      ],
      diversityTags: [
        "mixture-cost",
      ],
      rotationGroup:
        "quant-mixture-core",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.1,
        ibps: 1.2,
      },
    }),
    defineQuantMotif({
      id: "multi-phase-purity-transition",
      topicCluster:
        "mixture-alligation",
      archetype: "general",
      reasoningCategories: [
        "nested-operations",
        "conditional-ratio-logic",
      ],
      preferredOperations: [
        "transform",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "netVolumeIgnored",
        "wrongReplacementRatio",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 6],
      supportedDifficultyBands: [
        "Hard",
      ],
      generationStrategy: [
        "chain two composition updates and recover a hidden intermediate or final state",
      ],
      distractorStrategies: [
        "treat the second stage independently from the first",
        "reset purity after remixing",
      ],
      difficultyTuning: {
        hard: [
          "replace, remix, and replace again before final recovery",
        ],
      },
      validationRules: [
        "limit stage count while preserving dependency",
      ],
      diversityTags: [
        "mixture-multi-stage",
      ],
      rotationGroup:
        "quant-mixture-core",
      wordingBias: {
        inferenceHeavy: 0.75,
        balanced: 0.65,
      },
      examWeights: {
        ssc: 0.95,
        ibps: 1.1,
      },
    }),
  ];
