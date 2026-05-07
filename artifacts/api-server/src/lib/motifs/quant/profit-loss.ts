import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

type ProfitLossSubtype =
  | "direct_profit_loss"
  | "discount"
  | "successive_discount"
  | "dishonest_dealer"
  | "markup_discount"
  | "equivalent_change"
  | "ratio_profit"
  | "multi_stage_trade";

type ProfitLossMotifDraft = {
  id: string;
  subtype: ProfitLossSubtype;
  primitives: string[];
  hiddenStructures: string[];
  distractorFamilies: string[];
  arithmeticProfile: string[];
  difficulty: 1 | 2 | 3 | 4;
  examples: string[];
};

export const profitLossScopeMap = {
  chapter: "Profit, Loss & Discount",
  coreDomains: [
    "Profit and Loss",
    "Percentage Profit",
    "Percentage Loss",
    "Discount",
    "Marked Price",
    "Selling Price",
    "Cost Price",
    "Successive Discounts",
    "Dishonest Dealer Problems",
    "False Weight Systems",
    "Profit Percentage Comparison",
    "Equivalent Profit-Loss",
    "Successive Profit/Loss",
    "Cost Markup Systems",
    "Trade Discount",
    "Net Price Systems",
  ],
} as const;

export const profitLossConcepts = [
  "profit-loss base framework",
  "percentage base tracking",
  "discount and marked price relation",
  "successive percentage transformation",
  "equivalent percentage compression",
  "dishonest dealer quantity manipulation",
  "cost-markup-selling chain",
];

export const profitLossCoreFrameworks = [
  {
    id: "CF1",
    title: "Profit-Loss Base Framework",
    canonicalRelations: [
      "profit = SP - CP",
      "loss = CP - SP",
    ],
  },
  {
    id: "CF2",
    title:
      "Percentage Profit/Loss Framework",
    canonicalRelations: [
      "profit% = (profit / CP) x 100",
      "loss% = (loss / CP) x 100",
    ],
  },
  {
    id: "CF3",
    title:
      "Marked Price & Discount Framework",
    canonicalRelations: [
      "discount = MP - SP",
      "discount% = (discount / MP) x 100",
    ],
  },
  {
    id: "CF4",
    title:
      "Successive Percentage Transformation",
    canonicalRelations: [
      "net_multiplier = (1 +/- a/100)(1 +/- b/100)",
    ],
  },
  {
    id: "CF5",
    title:
      "Equivalent Percentage Framework",
    canonicalRelations: [
      "net_change% = a + b + ab/100",
    ],
  },
  {
    id: "CF6",
    title:
      "Dishonest Dealer Framework",
    canonicalRelations: [
      "false_weight + price_markup -> hidden compounded profit",
    ],
  },
  {
    id: "CF7",
    title:
      "Cost-Markup-Selling Chain",
    canonicalRelations: [
      "CP -> markup -> MP -> discount -> SP -> profit/loss",
    ],
  },
];

export const profitLossConceptModules = [
  "direct profit-loss computation",
  "percentage-based reconstruction",
  "discount systems",
  "successive discount problems",
  "dishonest dealer problems",
  "markup-discount interaction",
  "equivalent profit-loss",
  "profit comparison systems",
  "false weight systems",
  "multi-stage trade systems",
];

export const profitLossProceduralMotifs: ProfitLossMotifDraft[] =
  [
    {
      id: "base-percentage-transformation",
      subtype: "direct_profit_loss",
      primitives: [
        "base value",
        "percentage change",
      ],
      hiddenStructures: [
        "CP as percentage base",
      ],
      distractorFamilies: [
        "wrongPercentageBase",
      ],
      arithmeticProfile: [
        "single percentage transform",
      ],
      difficulty: 1,
      examples: [
        "Article bought for 500 and sold for 650. Find profit percentage.",
      ],
    },
    {
      id: "multiplicative-percentage-chaining",
      subtype: "successive_discount",
      primitives: [
        "successive percentage changes",
      ],
      hiddenStructures: [
        "compound percentage multiplier",
      ],
      distractorFamilies: [
        "additivePercentageTrap",
        "equivalentChangeSymmetryTrap",
      ],
      arithmeticProfile: [
        "multiplier chaining",
      ],
      difficulty: 2,
      examples: [
        "Two successive discounts of 20% and 10%.",
      ],
    },
    {
      id: "hidden-base-tracking",
      subtype: "discount",
      primitives: [
        "CP",
        "MP",
        "SP",
      ],
      hiddenStructures: [
        "reference-base tracking",
      ],
      distractorFamilies: [
        "wrongPercentageBase",
        "discountProfitConfusion",
      ],
      arithmeticProfile: [
        "base conversion chain",
      ],
      difficulty: 2,
      examples: [
        "Marked price and discount known; infer selling price or discount percentage.",
      ],
    },
    {
      id: "quantity-manipulation-profit",
      subtype: "dishonest_dealer",
      primitives: [
        "false weight",
        "listed price",
      ],
      hiddenStructures: [
        "effective quantity reduction",
      ],
      distractorFamilies: [
        "quantityIgnorance",
      ],
      arithmeticProfile: [
        "implicit unit-price increase",
      ],
      difficulty: 3,
      examples: [
        "A shopkeeper uses 900g instead of 1kg.",
      ],
    },
    {
      id: "markup-discount-compression",
      subtype: "markup_discount",
      primitives: [
        "markup",
        "discount",
      ],
      hiddenStructures: [
        "compound transformation chain",
      ],
      distractorFamilies: [
        "markupVsProfitConfusion",
        "additivePercentageTrap",
      ],
      arithmeticProfile: [
        "two-stage multiplier",
      ],
      difficulty: 2,
      examples: [
        "Marked up by 25% and discounted by 10%.",
      ],
    },
    {
      id: "equivalent-change-reduction",
      subtype: "equivalent_change",
      primitives: [
        "successive changes",
      ],
      hiddenStructures: [
        "single equivalent multiplier",
      ],
      distractorFamilies: [
        "equivalentChangeSymmetryTrap",
      ],
      arithmeticProfile: [
        "compressed equivalent change",
      ],
      difficulty: 2,
      examples: [
        "Price increased by 20% and then decreased by 20%.",
      ],
    },
    {
      id: "ratio-based-profit-reconstruction",
      subtype: "ratio_profit",
      primitives: [
        "SP:CP ratio",
      ],
      hiddenStructures: [
        "ratio to percentage conversion",
      ],
      distractorFamilies: [
        "ratioInversion",
        "wrongPercentageBase",
      ],
      arithmeticProfile: [
        "ratio normalization",
      ],
      difficulty: 2,
      examples: [
        "If SP:CP = 5:4, find the profit percentage.",
      ],
    },
    {
      id: "multi-state-transaction-flow",
      subtype: "multi_stage_trade",
      primitives: [
        "cost",
        "markup",
        "discount",
        "extra expense",
      ],
      hiddenStructures: [
        "multi-stage transaction chain",
      ],
      distractorFamilies: [
        "multiStageStateLoss",
      ],
      arithmeticProfile: [
        "layered trade flow",
      ],
      difficulty: 4,
      examples: [
        "cost -> markup -> discount -> transport expense -> final profit",
      ],
    },
  ];

export const profitLossQuestionArchetypes = [
  "direct profit or loss",
  "discount system",
  "successive discount",
  "dishonest dealer",
  "markup and discount interaction",
  "same SP / same CP comparison",
  "equivalent percentage change",
  "multi-step trade flow",
];

export const profitLossDistractorEngineering =
  [
    "use SP as the percentage base instead of CP",
    "add successive percentages directly",
    "treat discount as loss on cost price",
    "ignore false-weight effect",
    "assume +20% then -20% gives net zero",
    "forget an intermediate transformation",
    "invert the CP:SP or SP:CP ratio",
    "treat markup percentage as profit percentage without discount adjustment",
  ];

export const profitLossHiddenInferenceStructures =
  [
    "percentage multiplier systems",
    "base tracking",
    "effective quantity manipulation",
    "compound transformation compression",
    "nonlinear percentage symmetry",
  ];

export const profitLossDifficultyScaling =
  {
    L1: [
      "direct CP-SP profit/loss",
      "single discount or single profit percentage solve",
    ],
    L2: [
      "successive discounts",
      "markup-discount interaction",
      "ratio-based profit reconstruction",
      "equivalent percentage change",
    ],
    L3: [
      "dishonest dealer with hidden quantity manipulation",
      "same SP/same CP comparison",
      "hidden percentage base reconstruction",
    ],
    L4: [
      "multi-stage commercial transaction chain",
      "multiple transformation states with hidden bases",
    ],
  } as const;

export const profitLossDifficultyTuning = [
  "easy: direct profit-loss or single discount percentage conversion",
  "medium: markup-discount, successive discount, ratio-based profit, equivalent change",
  "hard: dishonest dealer, hidden-base commercial chains, multi-stage transaction flow",
];

export const profitLossNumericDesignPatterns =
  [
    "prefer percentage families like 5%, 10%, 12.5%, 20%, 25%, 33.33%, 50%",
    "prefer multiplicative-friendly pairs like (20,10), (25,20), (10,10), (50,20)",
    "prefer clean CP:SP ratios like 4:5, 5:6, 3:4, 8:9",
    "use false-weight families like 900g, 950g, 800g",
  ];

export const profitLossGeneratorConstraints =
  [
    "preserve the correct reference base through every percentage transformation",
    "reward transformation thinking over brute-force arithmetic",
    "preserve multiplicative compounding instead of reducing everything to addition",
    "keep prices and discount ranges commercially realistic",
    "treat trader, dealer, shopkeeper, and merchant variants as the same topology when the transformation chain is unchanged",
  ];

export const profitLossGenerationStrategyMetadata =
  [
    "Profit, Loss & Discount is fundamentally a percentage-transformation and base-tracking topic",
    "Markup then discount, profit then rebate, and increase then decrease should collapse by compound-percentage topology",
    "Strong generation should rotate beyond direct CP-SP arithmetic into chained multipliers and deceptive quantity systems",
    "Avoid cosmetic commercial wording diversity without structural change",
  ];

export const profitLossFormulaBank = [
  {
    label: "Profit Percentage",
    latex:
      "\\text{Profit \\%} = \\frac{SP - CP}{CP} \\times 100",
  },
  {
    label: "Discount Percentage",
    latex:
      "\\text{Discount \\%} = \\frac{MP - SP}{MP} \\times 100",
  },
  {
    label:
      "Equivalent Percentage Change",
    latex:
      "\\text{Net Change \\%} = a + b + \\frac{ab}{100}",
  },
  {
    label:
      "Successive Multiplier",
    latex:
      "\\text{Net Multiplier} = (1 \\pm a/100)(1 \\pm b/100)",
  },
];

export const profitLossMetadataSchema = {
  subtype: [
    "direct_profit_loss",
    "discount",
    "successive_discount",
    "dishonest_dealer",
    "markup_discount",
    "equivalent_change",
    "ratio_profit",
    "multi_stage_trade",
  ],
  fields: [
    "primitives",
    "hiddenStructures",
    "distractorFamilies",
    "arithmeticProfile",
    "difficulty",
  ],
} as const;

export const profitLossEvaluationRisks = [
  "formula exposure from words like profit percentage, successive discount, or marked price",
  "topology collapse where many contexts reduce to multiplicative percentage transformation",
  "artificial commercial context diversity from renaming dealer, trader, or businessman without structural change",
];

export const profitLossRealismWeaknesses = [
  "overusing direct percentage calculation",
  "overusing simplistic one-step discount problems",
  "avoiding multi-stage transformation chains",
  "ignoring deceptive quantity systems like false weight",
];

export const profitLossAntiRepetitionNotes = [
  "Treat markup then discount, profit then rebate, and increase then decrease as the same compound-percentage-transformation topology.",
  "Treat false weight, under-measurement, and quantity cheating as the same effective-quantity-manipulation topology.",
];

export const profitLossMotifs: QuantMotif[] =
  [
    defineQuantMotif({
      id: "base-percentage-transformation",
      topicCluster: "profit-loss",
      archetype: "general",
      reasoningCategories: [
        "direct-substitution",
        "one-step-arithmetic",
      ],
      preferredOperations: [
        "transform",
        "infer",
      ],
      commonDistractors: [
        "sameBaseAssumption",
        "wrongFinalBase",
      ],
      inferenceStyle: "direct",
      reasoningDepthRange: [1, 3],
      supportedDifficultyBands: [
        "Easy",
        "Medium",
      ],
      generationStrategy: [
        "compute profit, loss, or selling price directly while preserving cost price as the percentage base",
      ],
      distractorStrategies: [
        "use selling price as the percentage base",
      ],
      difficultyTuning: {
        easy: [
          "single profit or loss percentage",
        ],
        medium: [
          "one missing CP, SP, or profit value reconstruction",
        ],
      },
      validationRules: [
        "keep price arithmetic SSC-friendly",
      ],
      diversityTags: [
        "profit-loss-base",
      ],
      rotationGroup:
        "quant-profit-loss-core",
      wordingBias: {
        concise: 0.8,
        balanced: 0.75,
      },
      examWeights: {
        ssc: 1.2,
        ibps: 1.0,
      },
    }),
    defineQuantMotif({
      id: "multiplicative-percentage-chaining",
      topicCluster: "profit-loss",
      archetype: "general",
      reasoningCategories: [
        "multi-step-arithmetic",
        "nested-operations",
      ],
      preferredOperations: [
        "transform",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "additiveDiscountError",
        "wrongFinalBase",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [2, 5],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "chain two or more percentage changes multiplicatively rather than additively",
      ],
      distractorStrategies: [
        "add successive percentages directly",
        "ignore multiplier compounding",
      ],
      difficultyTuning: {
        medium: [
          "two successive discounts or gains",
        ],
        hard: [
          "successive percentage chain embedded inside another target solve",
        ],
      },
      validationRules: [
        "prefer clean effective multipliers",
      ],
      diversityTags: [
        "profit-loss-successive",
      ],
      rotationGroup:
        "quant-profit-loss-core",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.15,
        ibps: 1.2,
      },
    }),
    defineQuantMotif({
      id: "hidden-base-tracking",
      topicCluster: "profit-loss",
      archetype: "general",
      reasoningCategories: [
        "conditional-ratio-logic",
        "hidden-base-inference",
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
      reasoningDepthRange: [2, 5],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "track whether the active base is cost price, selling price, or marked price before resolving the unknown",
      ],
      distractorStrategies: [
        "mix profit, markup, and discount bases",
      ],
      difficultyTuning: {
        medium: [
          "single hidden base transition",
        ],
        hard: [
          "multiple coexisting bases inside one transaction chain",
        ],
      },
      validationRules: [
        "avoid ambiguous bases in the final interpretation",
      ],
      diversityTags: [
        "profit-loss-base-tracking",
      ],
      rotationGroup:
        "quant-profit-loss-core",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.1,
      },
    }),
    defineQuantMotif({
      id: "quantity-manipulation-profit",
      topicCluster: "profit-loss",
      archetype: "general",
      reasoningCategories: [
        "comparative-conditional-inference",
        "multi-step-arithmetic",
      ],
      preferredOperations: [
        "compare",
        "transform",
        "infer",
      ],
      commonDistractors: [
        "netVolumeIgnored",
        "wrongBaseVolume",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 5],
      supportedDifficultyBands: [
        "Hard",
      ],
      generationStrategy: [
        "model false weight or under-measurement as an effective increase in realized selling rate",
      ],
      distractorStrategies: [
        "ignore the quantity reduction",
        "calculate profit using listed weight instead of actual delivered weight",
      ],
      difficultyTuning: {
        hard: [
          "single false-weight manipulation",
          "false weight plus price markup",
        ],
      },
      validationRules: [
        "prefer classic false-weight families like 900g or 950g",
      ],
      diversityTags: [
        "profit-loss-false-weight",
      ],
      rotationGroup:
        "quant-profit-loss-core",
      wordingBias: {
        inferenceHeavy: 0.7,
        balanced: 0.65,
      },
      examWeights: {
        ssc: 1.2,
        ibps: 1.1,
      },
    }),
    defineQuantMotif({
      id: "markup-discount-compression",
      topicCluster: "profit-loss",
      archetype: "general",
      reasoningCategories: [
        "multi-step-arithmetic",
        "comparative-conditional-inference",
      ],
      preferredOperations: [
        "transform",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "additiveDiscountError",
        "marginDiscountMixup",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [2, 5],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "compress markup then discount into a net multiplier before inferring profitability",
      ],
      distractorStrategies: [
        "treat markup as profit directly",
        "subtract discount from markup percentage",
      ],
      difficultyTuning: {
        medium: [
          "single markup-discount interaction",
        ],
        hard: [
          "markup-discount with target profit or target cost reconstruction",
        ],
      },
      validationRules: [
        "keep markup and discount values commercially realistic",
      ],
      diversityTags: [
        "profit-loss-markup-discount",
      ],
      rotationGroup:
        "quant-profit-loss-core",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.15,
        ibps: 1.2,
      },
    }),
    defineQuantMotif({
      id: "equivalent-change-reduction",
      topicCluster: "profit-loss",
      archetype: "general",
      reasoningCategories: [
        "multi-step-arithmetic",
      ],
      preferredOperations: [
        "transform",
        "infer",
      ],
      commonDistractors: [
        "additiveDiscountError",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [2, 4],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "compress successive percentage changes into one equivalent effect and highlight nonlinear asymmetry",
      ],
      distractorStrategies: [
        "assume equal increase and decrease cancel out",
      ],
      difficultyTuning: {
        medium: [
          "two-step equivalent change",
        ],
        hard: [
          "equivalent change embedded inside a comparison or hidden-base question",
        ],
      },
      validationRules: [
        "prefer familiar SSC percentage pairs",
      ],
      diversityTags: [
        "profit-loss-equivalent-change",
      ],
      rotationGroup:
        "quant-profit-loss-core",
      wordingBias: {
        concise: 0.75,
        balanced: 0.75,
      },
      examWeights: {
        ssc: 1.1,
      },
    }),
    defineQuantMotif({
      id: "ratio-based-profit-reconstruction",
      topicCluster: "profit-loss",
      archetype: "general",
      reasoningCategories: [
        "simple-ratio",
        "hidden-base-inference",
      ],
      preferredOperations: [
        "transform",
        "infer",
      ],
      commonDistractors: [
        "sameBaseAssumption",
      ],
      inferenceStyle: "direct",
      reasoningDepthRange: [2, 4],
      supportedDifficultyBands: [
        "Easy",
        "Medium",
      ],
      generationStrategy: [
        "convert CP:SP or SP:CP ratio into profit or loss percentage through ratio normalization",
      ],
      distractorStrategies: [
        "invert the ratio before converting to percentage",
      ],
      difficultyTuning: {
        easy: [
          "clean SP:CP ratio",
        ],
        medium: [
          "ratio with one disguised intermediate value",
        ],
      },
      validationRules: [
        "prefer ratio-friendly pairs like 4:5 or 5:6",
      ],
      diversityTags: [
        "profit-loss-ratio",
      ],
      rotationGroup:
        "quant-profit-loss-core",
      wordingBias: {
        concise: 0.8,
      },
      examWeights: {
        ssc: 1.05,
      },
    }),
    defineQuantMotif({
      id: "multi-state-transaction-flow",
      topicCluster: "profit-loss",
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
        "wrongFinalBase",
        "marginDiscountMixup",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 6],
      supportedDifficultyBands: [
        "Hard",
      ],
      generationStrategy: [
        "chain cost, markup, discount, and one extra commercial state such as expense or rebate before the final profit-loss inference",
      ],
      distractorStrategies: [
        "forget one intermediate stage",
        "use the wrong intermediate selling or marked price as the final base",
      ],
      difficultyTuning: {
        hard: [
          "three-stage or four-stage commercial flow",
        ],
      },
      validationRules: [
        "keep layered arithmetic interpretable within SSC-style timing",
      ],
      diversityTags: [
        "profit-loss-multi-stage",
      ],
      rotationGroup:
        "quant-profit-loss-core",
      wordingBias: {
        inferenceHeavy: 0.75,
        balanced: 0.65,
      },
      examWeights: {
        ssc: 1.0,
        ibps: 1.15,
      },
    }),
  ];
