import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

export const ratioProportionScopeMap = {
  chapter: "Ratio, Proportion & Variation",
  coreDomains: [
    "Basic Ratios",
    "Equivalent Ratios",
    "Proportion",
    "Continued Proportion",
    "Third and Fourth Proportional",
    "Distribution Problems",
    "Age Ratios",
    "Ratio Transformations",
    "Coin Value Mapping",
    "Mixture Ratios",
    "Direct Variation",
    "Inverse Variation",
    "Compound Variation",
    "Income and Expenditure",
  ],
} as const;

export const ratioProportionConcepts = [
  "relative quantity modeling",
  "scale invariant ratio representation",
  "common-base normalization",
  "ratio comparison across totals",
  "cross-multiplicative balance",
  "direct and inverse variation",
  "ratio-state transformation",
  "weighted proportional allocation",
  "time-weighted contribution ratios",
  "count-to-value mapping",
  "constant-difference state shift",
  "recursive composition tracking",
  "power-law variation",
];

export const ratioProportionCoreDomains = [
  "Basic Ratios",
  "Equivalent Ratios",
  "Ratio Simplification",
  "Proportion",
  "Continued Proportion",
  "Fourth Proportional",
  "Third Proportional",
  "Direct Variation",
  "Inverse Variation",
  "Compound Variation",
  "Partnership",
  "Distribution Problems",
  "Age Ratios",
  "Ratio Transformations",
  "Mixture Ratios",
  "Population Ratios",
];

export const ratioProportionFrameworks = [
  "ratio representation: a:b = a/b",
  "proportion: a:b = c:d implies ad = bc",
  "direct variation: x/y remains constant",
  "inverse variation: xy remains constant",
  "compound ratio: (a:b) x (c:d) = ac:bd",
  "ratio transformation: initial ratio -> change -> transformed ratio",
  "weighted distribution: share = weight / total weight x total",
];

export const ratioProportionConceptModules = [
  "bridge ratio unification",
  "transform mapping for coins and denominations",
  "invariant difference age ratios",
  "distribution under additive constraints",
  "income-expenditure cross-balance",
  "mixture replacement recursion",
  "power-law variation",
];

export const ratioProportionProceduralMotifs = [
  "bridge-unification-nested",
  "transform-mapping-coins",
  "invariant-difference-ages",
  "mixture-replacement-recursive",
  "distribution-constraint-adjusted",
  "income-expenditure-cross-balance",
  "variation-power-broken-object",
];

export const ratioProportionDistractorStrategies =
  [
    "treat ratio parts as absolute differences",
    "pair cross-multiplication terms incorrectly",
    "apply direct scaling to inverse variation",
    "ignore duration in partnership contributions",
    "apply an additive change to only one ratio side",
    "add directly to ratio symbols without scale consistency",
    "partition the wrong total in distribution",
    "forget the previous ratio state in multi-step transformations",
    "flip the ratio orientation while reading the target",
    "confuse count ratio with value ratio in coin problems",
    "reuse the new ratio as if it were the original state",
    "ignore unit conversion between paisa and rupee",
  ];

export const ratioProportionParameterRules = [
  "prefer common ratio families such as 2:3, 3:5, 4:7, 5:8, and 7:9",
  "choose totals divisible by the ratio-part sum for reconstruction and distribution",
  "keep direct-variation multipliers and inverse products clean",
  "use realistic ages, investment amounts, population counts, and share totals",
  "scale difficulty through hidden factors, chained conditions, and dependency ambiguity",
  "avoid cosmetic context changes that preserve the exact same topology",
];

export const ratioProportionDifficultyTuning = [
  "easy: simplification, direct proportion, or one clean distribution step",
  "medium: hidden scale factor, one transformation, or weighted contribution",
  "hard: chained ratio-state transitions, compound variation, or concealed direct/inverse dependency",
  "raise arithmetic friction only after the structural inference is stable",
];

export const ratioProportionGenerationStrategyMetadata =
  [
    "reward proportional reasoning over brute-force arithmetic",
    "conceal dependency type when generating medium or hard variation questions",
    "prefer state tracking for age and ratio transformation problems",
    "rotate contexts only when the primitive topology also changes",
    "use partnership as weighted allocation over capital x time, not capital alone",
    "treat ages, applicants, and portfolio shares as the same topology when constant-difference state shift is the underlying logic",
    "avoid cosmetic noun swaps when count-value transform or recursive replacement topology is unchanged",
  ];

export const ratioProportionDifficultyScaling = {
  L1: [
    "direct distribution from a simple ratio",
    "one-step proportion or fourth proportional",
  ],
  L2: [
    "single state shift or hidden scaling factor",
    "count-to-value mapping with one aggregate constraint",
  ],
  L3: [
    "nested bridge unification across three variables",
    "distribution after additive adjustments",
    "single replacement composition tracking",
  ],
  L4: [
    "hidden-variable variation",
    "multi-stage replacement or cross-balance reconstruction",
  ],
} as const;

export const ratioProportionAntiRepetitionNotes = [
  "Treat father-son ages, male-female applicants, and two share classes as the same constant-difference state-shift topology.",
  "Treat milk-water, acid-water, and solution replacement as the same recursive composition topology.",
  "Treat coin-count mapping and denomination-value mapping as one transform motif unless the hidden direction reverses.",
];

export const ratioProportionMotifs: QuantMotif[] =
  [
    defineQuantMotif({
      id: "bridge-unification-nested",
      topicCluster:
        "ratio-proportion",
      archetype: "ratio-trap",
      reasoningCategories: [
        "normalization",
        "cross-comparison",
        "multi-step-arithmetic",
      ],
      preferredOperations: [
        "transform",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "wrongNormalization",
        "ratioInversion",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 6],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "bridge multiple linked ratios through chained LCM scaling",
        "ask for a final quantity or unified ratio after normalization",
      ],
      distractorStrategies: [
        "compare raw bridge ratios without unifying the shared variable",
        "invert the last requested ratio",
      ],
      difficultyTuning: {
        medium: [
          "three variables and one total",
        ],
        hard: [
          "four variables or two nested bridges",
        ],
      },
      validationRules: [
        "prefer unified ratios that distribute cleanly into the total",
      ],
      diversityTags: [
        "ratio-bridge",
        "nested-unification",
      ],
      rotationGroup:
        "quant-ratio-core",
      wordingBias: {
        balanced: 0.75,
        inferenceHeavy: 0.8,
      },
      examWeights: {
        ssc: 1.2,
        ibps: 1.1,
      },
    }),
    defineQuantMotif({
      id: "transform-mapping-coins",
      topicCluster:
        "ratio-proportion",
      archetype: "ratio-trap",
      reasoningCategories: [
        "weighted-distribution",
        "multi-step-arithmetic",
      ],
      preferredOperations: [
        "transform",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "wrongDenominator",
        "arithmeticSlip",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [2, 5],
      supportedDifficultyBands: [
        "Easy",
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "convert count ratio into value totals through denomination mapping",
        "occasionally invert the task by giving value ratio and asking for count",
      ],
      distractorStrategies: [
        "treat the count ratio directly as the value ratio",
        "ignore rupee-paisa unit conversion",
      ],
      difficultyTuning: {
        easy: [
          "count ratio to total value",
        ],
        medium: [
          "find one denomination count from the mapped total",
        ],
        hard: [
          "inverse transform from value information back to count",
        ],
      },
      validationRules: [
        "keep the mapped total and requested count integral",
      ],
      diversityTags: [
        "coin-transform",
        "count-value-map",
      ],
      rotationGroup:
        "quant-ratio-allocation",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.15,
      },
    }),
    defineQuantMotif({
      id: "invariant-difference-ages",
      topicCluster:
        "ratio-proportion",
      archetype: "ratio-trap",
      reasoningCategories: [
        "ratio-state-transformation",
        "time-shift-reconstruction",
      ],
      preferredOperations: [
        "transform",
        "compare",
        "infer",
      ],
      commonDistractors: [
        "stateLoss",
        "wrongIntermediateValue",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 6],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "use present and future age ratios with constant absolute difference",
        "solve by scaling both states to the same unit gap",
      ],
      distractorStrategies: [
        "shift only one side of the age ratio",
        "reuse a raw ratio part as an actual age",
      ],
      difficultyTuning: {
        medium: [
          "single future-state ratio",
        ],
        hard: [
          "hidden year shift or reverse state recovery",
        ],
      },
      validationRules: [
        "keep all reconstructed ages positive and realistic",
      ],
      diversityTags: [
        "age-ratio",
        "constant-difference",
      ],
      rotationGroup:
        "quant-ratio-state",
      wordingBias: {
        balanced: 0.75,
        inferenceHeavy: 0.8,
      },
      examWeights: {
        ssc: 1.2,
      },
    }),
    defineQuantMotif({
      id: "mixture-replacement-recursive",
      topicCluster:
        "ratio-proportion",
      archetype: "ratio-trap",
      reasoningCategories: [
        "ratio-state-transformation",
        "multi-step-arithmetic",
      ],
      preferredOperations: [
        "transform",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "wrongIntermediateValue",
        "cumulativeMistake",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 6],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "preserve total volume and track only the residual part of the original component",
        "use replacement with the other component to create recursive composition change",
      ],
      distractorStrategies: [
        "subtract the replaced quantity linearly from the original component",
        "use the new ratio as if it were the initial ratio",
      ],
      difficultyTuning: {
        medium: [
          "single replacement update",
        ],
        hard: [
          "hidden initial composition or repeated replacement",
        ],
      },
      validationRules: [
        "keep total volume constant and final composition integral when ratio form is requested",
      ],
      diversityTags: [
        "replacement-mixture",
        "recursive-composition",
      ],
      rotationGroup:
        "quant-ratio-state",
      wordingBias: {
        balanced: 0.7,
        inferenceHeavy: 0.8,
      },
      examWeights: {
        ssc: 1.1,
        ibps: 1.1,
      },
    }),
    defineQuantMotif({
      id: "distribution-constraint-adjusted",
      topicCluster:
        "ratio-proportion",
      archetype: "ratio-trap",
      reasoningCategories: [
        "proportional-allocation",
        "hidden-base-inference",
      ],
      preferredOperations: [
        "transform",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "wrongDenominator",
        "arithmeticSlip",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 5],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "apply additive adjustments before using the given ratio",
        "recover the original distribution after reversing the adjustments",
      ],
      distractorStrategies: [
        "distribute the total directly in the final adjusted ratio",
      ],
      difficultyTuning: {
        medium: [
          "single additive adjustment on each share",
        ],
        hard: [
          "three-way constrained redistribution",
        ],
      },
      validationRules: [
        "choose totals that keep original shares integral",
      ],
      diversityTags: [
        "distribution-adjusted",
      ],
      rotationGroup:
        "quant-ratio-allocation",
      wordingBias: {
        balanced: 0.75,
      },
      examWeights: {
        ssc: 1.15,
      },
    }),
    defineQuantMotif({
      id: "income-expenditure-cross-balance",
      topicCluster:
        "ratio-proportion",
      archetype: "ratio-trap",
      reasoningCategories: [
        "cross-multiplicative-balance",
        "multi-step-arithmetic",
      ],
      preferredOperations: [
        "transform",
        "compare",
        "infer",
      ],
      commonDistractors: [
        "wrongIntermediateValue",
        "ratioInversion",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 6],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "use fixed savings or expenditure gap to recover actual incomes from separate ratios",
      ],
      distractorStrategies: [
        "compare income and expenditure ratios directly without common scaling",
      ],
      difficultyTuning: {
        medium: [
          "fixed savings with one required income",
        ],
        hard: [
          "two linked money flows with concealed common unit",
        ],
      },
      validationRules: [
        "keep savings and inferred incomes realistic",
      ],
      diversityTags: [
        "income-expenditure",
        "cross-balance",
      ],
      rotationGroup:
        "quant-ratio-core",
      wordingBias: {
        balanced: 0.7,
        inferenceHeavy: 0.75,
      },
      examWeights: {
        ssc: 1.05,
        ibps: 1.2,
      },
    }),
    defineQuantMotif({
      id: "variation-power-broken-object",
      topicCluster:
        "ratio-proportion",
      archetype: "ratio-trap",
      reasoningCategories: [
        "direct-inverse-variation",
        "nested-operations",
      ],
      preferredOperations: [
        "transform",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "wrongIntermediateValue",
        "arithmeticSlip",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [4, 7],
      supportedDifficultyBands: [
        "Hard",
      ],
      generationStrategy: [
        "map physical quantity ratio into a power-law value relation",
        "compare pre-break and post-break value states to recover loss",
      ],
      distractorStrategies: [
        "apply direct ratio to value instead of the required power",
      ],
      difficultyTuning: {
        hard: [
          "value proportional to square or cube of a physical quantity",
        ],
      },
      validationRules: [
        "ensure the computed loss or gain is an integer",
      ],
      diversityTags: [
        "variation-power",
        "broken-object",
      ],
      rotationGroup:
        "quant-ratio-variation",
      wordingBias: {
        inferenceHeavy: 0.85,
      },
      examWeights: {
        ssc: 1.0,
      },
    }),
    defineQuantMotif({
      id: "ratio-simplification-core",
      topicCluster:
        "ratio-proportion",
      archetype: "ratio-trap",
      reasoningCategories: [
        "simple-ratio",
        "common-factor-reduction",
      ],
      preferredOperations: [
        "ratio",
        "transform",
      ],
      commonDistractors: [
        "ratioInversion",
        "arithmeticSlip",
      ],
      inferenceStyle: "direct",
      reasoningDepthRange: [1, 2],
      supportedDifficultyBands: [
        "Easy",
      ],
      generationStrategy: [
        "present two quantities with a shared factor",
        "require reduction to the invariant relative form",
      ],
      parameterRanges: {
        ratioPart: {
          min: 2,
          max: 15,
        },
        commonFactor: {
          min: 2,
          max: 20,
        },
      },
      distractorStrategies: [
        "invert the simplified ratio",
        "divide only one side by the common factor",
      ],
      difficultyTuning: {
        easy: [
          "single common-factor reduction",
        ],
      },
      validationRules: [
        "ensure both parts share a non-trivial common factor",
      ],
      diversityTags: [
        "ratio-simplification",
      ],
      rotationGroup:
        "quant-ratio-foundation",
      wordingBias: {
        concise: 0.85,
      },
      examWeights: {
        ssc: 1.2,
        rrb: 1.2,
      },
    }),
    defineQuantMotif({
      id: "ratio-normalization-switch",
      topicCluster:
        "ratio-proportion",
      archetype: "ratio-trap",
      reasoningCategories: [
        "normalization",
        "cross-comparison",
      ],
      preferredOperations: [
        "transform",
        "compare",
        "aggregate",
      ],
      commonDistractors: [
        "directComparison",
        "wrongNormalization",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [2, 5],
      generationStrategy: [
        "present ratios on different totals",
        "force common-base normalization before comparison",
      ],
      parameterRanges: {
        ratioPart: {
          min: 2,
          max: 11,
        },
        totalValue: {
          min: 60,
          max: 360,
        },
      },
      distractorStrategies: [
        "compare raw ratio parts",
        "normalize only one side",
      ],
      difficultyTuning: {
        easy: [
          "single normalization",
        ],
        medium: [
          "normalization plus transfer",
        ],
        hard: [
          "hidden total after normalization",
        ],
      },
      validationRules: [
        "keep ratios reducible but non-trivial",
      ],
      diversityTags: [
        "ratio-normalization",
      ],
      rotationGroup:
        "quant-ratio-core",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.2,
        rrb: 1.1,
      },
    }),
    defineQuantMotif({
      id: "proportion-cross-balance",
      topicCluster:
        "ratio-proportion",
      archetype: "ratio-trap",
      reasoningCategories: [
        "cross-multiplicative-balance",
        "fourth-proportional",
      ],
      preferredOperations: [
        "ratio",
        "transform",
        "infer",
      ],
      commonDistractors: [
        "wrongIntermediateValue",
        "ratioInversion",
      ],
      inferenceStyle: "direct",
      reasoningDepthRange: [2, 4],
      supportedDifficultyBands: [
        "Easy",
        "Medium",
      ],
      generationStrategy: [
        "give three terms of a proportion and hide the fourth",
        "force cross-product equality rather than pattern guessing",
      ],
      parameterRanges: {
        proportionPart: {
          min: 2,
          max: 18,
        },
        scaleFactor: {
          min: 2,
          max: 12,
        },
      },
      distractorStrategies: [
        "cross-multiply the adjacent pair",
        "use additive difference between ratio parts",
      ],
      difficultyTuning: {
        easy: [
          "clean fourth proportional",
        ],
        medium: [
          "third proportional or hidden scale factor",
        ],
      },
      validationRules: [
        "keep the inferred term integral",
      ],
      diversityTags: [
        "proportion",
        "cross-product",
      ],
      rotationGroup:
        "quant-ratio-foundation",
      wordingBias: {
        concise: 0.75,
        balanced: 0.75,
      },
      examWeights: {
        ssc: 1.15,
        rrb: 1.1,
      },
    }),
    defineQuantMotif({
      id: "weighted-ratio-distribution",
      topicCluster:
        "ratio-proportion",
      archetype: "ratio-trap",
      reasoningCategories: [
        "proportional-allocation",
        "weighted-distribution",
      ],
      preferredOperations: [
        "ratio",
        "aggregate",
        "transform",
      ],
      commonDistractors: [
        "wrongIntermediateValue",
        "wrongDenominator",
      ],
      inferenceStyle: "direct",
      reasoningDepthRange: [2, 4],
      supportedDifficultyBands: [
        "Easy",
        "Medium",
      ],
      generationStrategy: [
        "divide a total according to ratio weights",
        "use the ratio sum as the allocation base",
      ],
      parameterRanges: {
        ratioPart: {
          min: 2,
          max: 11,
        },
        totalValue: {
          min: 120,
          max: 2400,
        },
      },
      distractorStrategies: [
        "divide by one ratio part instead of the sum",
        "allocate from the wrong total",
      ],
      difficultyTuning: {
        easy: [
          "two-way clean distribution",
        ],
        medium: [
          "three-way allocation or missing share reconstruction",
        ],
      },
      validationRules: [
        "prefer totals divisible by the ratio sum",
      ],
      diversityTags: [
        "distribution",
        "weighted-allocation",
      ],
      rotationGroup:
        "quant-ratio-allocation",
      wordingBias: {
        balanced: 0.85,
      },
      examWeights: {
        ssc: 1.1,
        ibps: 1.15,
        rrb: 1.1,
      },
    }),
    defineQuantMotif({
      id: "variation-dependency-switch",
      topicCluster:
        "ratio-proportion",
      archetype: "ratio-trap",
      reasoningCategories: [
        "directional-dependency",
        "direct-inverse-variation",
      ],
      preferredOperations: [
        "transform",
        "compare",
        "infer",
      ],
      commonDistractors: [
        "directInverseSwap",
        "ratioInversion",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 6],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "describe scaling narratively without always naming direct or inverse proportion",
        "preserve either constant quotient or constant product through the change",
      ],
      parameterRanges: {
        multiplier: {
          min: 2,
          max: 6,
        },
        baseValue: {
          min: 12,
          max: 240,
        },
      },
      distractorStrategies: [
        "apply same-direction scaling to an inverse case",
        "invert the constant product relation",
      ],
      difficultyTuning: {
        medium: [
          "one direct or inverse relation",
        ],
        hard: [
          "compound variation with multiple dependency variables",
        ],
      },
      validationRules: [
        "preserve the selected dependency type",
        "keep inverse products clean",
      ],
      diversityTags: [
        "direct-variation",
        "inverse-variation",
        "compound-variation",
      ],
      rotationGroup:
        "quant-ratio-variation",
      wordingBias: {
        balanced: 0.7,
        inferenceHeavy: 0.8,
      },
      examWeights: {
        ssc: 1.05,
        ibps: 1.15,
        cat: 1.1,
      },
    }),
    defineQuantMotif({
      id: "partnership-ratio-switch",
      topicCluster:
        "ratio-proportion",
      archetype: "ratio-trap",
      reasoningCategories: [
        "ratio-adjustment",
        "conditional-selection",
      ],
      preferredOperations: [
        "transform",
        "infer",
        "filter",
      ],
      commonDistractors: [
        "timeIgnored",
        "ratioInversion",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 6],
      generationStrategy: [
        "change one ratio driver mid-problem",
        "force part-time or weighted contribution reasoning",
      ],
      parameterRanges: {
        contributionMonths: {
          min: 3,
          max: 12,
        },
      },
      distractorStrategies: [
        "ignore timing switch",
        "apply final ratio throughout",
      ],
      difficultyTuning: {
        medium: [
          "one partner joins late",
        ],
        hard: [
          "join-and-leave contribution mix",
        ],
      },
      validationRules: [
        "ensure contribution shares remain integral",
      ],
      diversityTags: [
        "ratio-time-weight",
      ],
      rotationGroup:
        "quant-ratio-core",
      wordingBias: {
        balanced: 0.7,
        inferenceHeavy: 0.7,
      },
      examWeights: {
        ibps: 1.2,
        sbi: 1.15,
      },
    }),
    defineQuantMotif({
      id: "age-ratio-state-shift",
      topicCluster:
        "ratio-proportion",
      archetype: "ratio-trap",
      reasoningCategories: [
        "ratio-state-transformation",
        "time-shift-reconstruction",
      ],
      preferredOperations: [
        "transform",
        "infer",
        "compare",
      ],
      commonDistractors: [
        "stateLoss",
        "wrongIntermediateValue",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 6],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "give a present age ratio and a future or past ratio",
        "force tracking of the same people across time states",
      ],
      parameterRanges: {
        yearShift: {
          min: 2,
          max: 12,
        },
        ageValue: {
          min: 8,
          max: 60,
        },
      },
      distractorStrategies: [
        "apply the year shift to only one person",
        "reuse the original ratio after the time shift",
      ],
      difficultyTuning: {
        medium: [
          "one future or past ratio",
        ],
        hard: [
          "present ratio plus two time-shift constraints",
        ],
      },
      validationRules: [
        "keep ages realistic and positive in past states",
      ],
      diversityTags: [
        "age-ratio",
        "time-shift",
      ],
      rotationGroup:
        "quant-ratio-state",
      wordingBias: {
        balanced: 0.75,
        inferenceHeavy: 0.7,
      },
      examWeights: {
        ssc: 1.1,
        ibps: 1.1,
      },
    }),
    defineQuantMotif({
      id: "multi-stage-ratio-state-change",
      topicCluster:
        "ratio-proportion",
      archetype: "ratio-trap",
      reasoningCategories: [
        "ratio-state-transformation",
        "multi-constraint-reconstruction",
      ],
      preferredOperations: [
        "transform",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "cumulativeMistake",
        "wrongIntermediateValue",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [4, 7],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "start from an initial ratio and apply addition, removal, or replacement",
        "ask for an original value after the transformed ratio is known",
      ],
      parameterRanges: {
        changeAmount: {
          min: 2,
          max: 60,
        },
        ratioPart: {
          min: 2,
          max: 13,
        },
      },
      distractorStrategies: [
        "add the change directly to the ratio symbols",
        "forget the prior ratio state after the first transformation",
      ],
      difficultyTuning: {
        medium: [
          "single addition or removal",
        ],
        hard: [
          "successive transformations or replacement with hidden total",
        ],
      },
      validationRules: [
        "maintain ratio consistency after each state transition",
        "ensure the transformed state has integral values",
      ],
      diversityTags: [
        "ratio-transformation",
        "state-tracking",
      ],
      rotationGroup:
        "quant-ratio-state",
      wordingBias: {
        balanced: 0.65,
        inferenceHeavy: 0.85,
      },
      examWeights: {
        ibps: 1.2,
        sbi: 1.15,
        cat: 1.2,
      },
    }),
  ];
