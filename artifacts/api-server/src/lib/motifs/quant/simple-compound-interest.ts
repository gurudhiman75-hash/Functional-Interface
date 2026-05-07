import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

type InterestSubtype =
  | "simple_interest"
  | "compound_interest"
  | "si_vs_ci"
  | "half_yearly"
  | "quarterly"
  | "population_growth"
  | "depreciation"
  | "reverse_reconstruction"
  | "multi_stage_growth";

type InterestMotifDraft = {
  id: string;
  subtype: InterestSubtype;
  primitives: string[];
  hiddenStructures: string[];
  distractorFamilies: string[];
  arithmeticProfile: string[];
  difficulty: 1 | 2 | 3 | 4;
  examples: string[];
};

export const simpleCompoundInterestScopeMap = {
  chapter:
    "Simple & Compound Interest",
  coreDomains: [
    "Simple Interest",
    "Compound Interest",
    "Principal",
    "Amount",
    "Rate of Interest",
    "Time Period",
    "Difference Between SI and CI",
    "Half-Yearly Compounding",
    "Quarterly Compounding",
    "Successive Growth",
    "Population Growth Analogy",
    "Depreciation",
    "Installment Systems",
    "Effective Interest Rate",
    "Interest Reconstruction",
  ],
} as const;

export const simpleCompoundInterestConcepts =
  [
    "simple interest",
    "compound interest",
    "principal-amount relation",
    "linear growth",
    "multiplicative growth",
    "fractional compounding",
    "interest on interest",
    "depreciation",
    "reverse reconstruction",
  ];

export const simpleCompoundInterestCoreFrameworks =
  [
    {
      id: "CF1",
      title:
        "Simple Interest Framework",
      canonicalRelation:
        "SI = (P x R x T) / 100",
    },
    {
      id: "CF2",
      title: "Amount Relation",
      canonicalRelation:
        "A = P + SI",
    },
    {
      id: "CF3",
      title:
        "Compound Interest Framework",
      canonicalRelation:
        "A = P (1 + R/100)^T and CI = A - P",
    },
    {
      id: "CF4",
      title:
        "Successive Percentage Growth",
      canonicalRelation:
        "net_growth_multiplier = (1 + R/100)^T",
    },
    {
      id: "CF5",
      title:
        "Fractional Compounding Framework",
      canonicalRelation:
        "half-yearly uses (1 + (R/2)/100)^(2T) and quarterly uses (1 + (R/4)/100)^(4T)",
    },
    {
      id: "CF6",
      title:
        "Depreciation Framework",
      canonicalRelation:
        "A = P (1 - R/100)^T",
    },
    {
      id: "CF7",
      title:
        "Difference Between SI and CI",
      canonicalRelation:
        "CI - SI captures interest on interest",
    },
  ];

export const simpleCompoundInterestConceptModules =
  [
    "direct simple interest",
    "principal reconstruction",
    "compound amount growth",
    "difference between simple and compound interest",
    "fractional compounding",
    "population growth analogy",
    "depreciation systems",
    "effective rate comparison",
    "installment reconstruction",
    "reverse interest reconstruction",
  ];

export const simpleCompoundInterestProceduralMotifs: InterestMotifDraft[] =
  [
    {
      id: "linear-interest-accumulation",
      subtype: "simple_interest",
      primitives: [
        "principal",
        "rate",
        "time",
      ],
      hiddenStructures: [
        "linear growth",
      ],
      distractorFamilies: [
        "siCiFormulaSwap",
        "percentageBaseDrift",
      ],
      arithmeticProfile: [
        "single-stage percentage application",
      ],
      difficulty: 1,
      examples: [
        "Find simple interest on Rs. 5000 at 10% for 3 years.",
      ],
    },
    {
      id: "multiplicative-growth",
      subtype: "compound_interest",
      primitives: [
        "principal",
        "rate",
        "time",
      ],
      hiddenStructures: [
        "compound multiplier",
      ],
      distractorFamilies: [
        "additiveGrowthTrap",
        "siCiFormulaSwap",
      ],
      arithmeticProfile: [
        "successive percentage multiplication",
      ],
      difficulty: 2,
      examples: [
        "Find compound amount after 2 years.",
      ],
    },
    {
      id: "interest-on-interest-detection",
      subtype: "si_vs_ci",
      primitives: [
        "same principal",
        "same rate",
        "same time",
      ],
      hiddenStructures: [
        "secondary growth layer",
      ],
      distractorFamilies: [
        "interestOnInterestOmission",
      ],
      arithmeticProfile: [
        "growth model comparison",
      ],
      difficulty: 2,
      examples: [
        "Difference between SI and CI for 2 years.",
      ],
    },
    {
      id: "effective-period-transformation",
      subtype: "half_yearly",
      primitives: [
        "rate adjustment",
        "period adjustment",
      ],
      hiddenStructures: [
        "rate-period normalization",
      ],
      distractorFamilies: [
        "halfYearlyAdjustmentFailure",
      ],
      arithmeticProfile: [
        "period conversion",
      ],
      difficulty: 3,
      examples: [
        "Compounded half-yearly. Find amount.",
      ],
    },
    {
      id: "compound-decay",
      subtype: "depreciation",
      primitives: [
        "initial value",
        "depreciation rate",
        "years",
      ],
      hiddenStructures: [
        "multiplicative decay",
      ],
      distractorFamilies: [
        "depreciationSignError",
      ],
      arithmeticProfile: [
        "successive decay",
      ],
      difficulty: 2,
      examples: [
        "Machine depreciates by 10% yearly.",
      ],
    },
    {
      id: "reverse-growth-reconstruction",
      subtype: "reverse_reconstruction",
      primitives: [
        "amount",
        "rate or time",
      ],
      hiddenStructures: [
        "inverse growth reasoning",
      ],
      distractorFamilies: [
        "reverseReconstructionError",
      ],
      arithmeticProfile: [
        "parameter backsolve",
      ],
      difficulty: 3,
      examples: [
        "Amount and rate are known. Find principal.",
      ],
    },
    {
      id: "equivalent-multiplier-compression",
      subtype: "multi_stage_growth",
      primitives: [
        "multiple growth steps",
        "single net multiplier",
      ],
      hiddenStructures: [
        "successive multiplier compression",
      ],
      distractorFamilies: [
        "equivalentMultiplierCollapse",
        "additiveGrowthTrap",
      ],
      arithmeticProfile: [
        "multi-stage multiplier chaining",
      ],
      difficulty: 4,
      examples: [
        "Rate changes yearly and the final amount must be recovered.",
      ],
    },
    {
      id: "comparative-interest-systems",
      subtype: "si_vs_ci",
      primitives: [
        "same principal",
        "competing growth models",
      ],
      hiddenStructures: [
        "linear vs multiplicative growth comparison",
      ],
      distractorFamilies: [
        "siCiFormulaSwap",
        "percentageBaseDrift",
      ],
      arithmeticProfile: [
        "comparative model reasoning",
      ],
      difficulty: 3,
      examples: [
        "Compare simple and compound returns under different schedules.",
      ],
    },
  ];

export const simpleCompoundInterestQuestionArchetypes =
  [
    "direct simple interest computation",
    "direct compound interest computation",
    "si vs ci difference",
    "half-yearly compounding",
    "population growth",
    "depreciation problem",
    "reverse principal reconstruction",
    "multi-stage growth system",
  ];

export const simpleCompoundInterestDistractorEngineering =
  [
    "swap simple and compound growth formulas",
    "drift to the wrong percentage base after a compounding step",
    "add percentage changes directly instead of multiplying successive factors",
    "halve the rate for half-yearly compounding without doubling the periods",
    "ignore the interest on previous interest",
    "use a growth multiplier instead of a decay multiplier in depreciation",
    "mis-isolate the hidden principal, rate, or time during reverse reconstruction",
    "collapse multiplicative changes into additive shortcuts",
  ];

export const simpleCompoundInterestHiddenInferenceStructures =
  [
    "linear vs multiplicative growth",
    "compound multiplier systems",
    "effective period transformation",
    "interest-on-interest accumulation",
    "reverse parameter isolation",
  ];

export const simpleCompoundInterestDifficultyScaling =
  {
    L1: [
      "direct simple interest",
      "direct amount from simple interest",
    ],
    L2: [
      "direct compound interest",
      "simple si-vs-ci comparison",
      "depreciation",
    ],
    L3: [
      "half-yearly or quarterly compounding",
      "reverse principal reconstruction",
      "population-growth style multiplier use",
    ],
    L4: [
      "multi-stage growth with changing rates",
      "compressed multiplier comparison",
    ],
  } as const;

export const simpleCompoundInterestDifficultyTuning =
  [
    "easy: direct simple interest or clean compound amount questions",
    "medium: si-vs-ci difference, depreciation, or direct population growth",
    "hard: half-yearly or quarterly compounding, reverse reconstruction, and multi-stage multiplier chaining",
  ];

export const simpleCompoundInterestNumericDesignPatterns =
  [
    "prefer common rates like 5%, 10%, 12%, 12.5%, and 20%",
    "prefer principal-rate-time families such as (1000,10,2), (5000,20,3), and (8000,5,4)",
    "use half-yearly and quarterly patterns only when the resulting arithmetic stays mental-math friendly",
    "prefer SI-CI difference cases where the excess remains easy to compute mentally",
  ];

export const simpleCompoundInterestGeneratorConstraints =
  [
    "preserve the correct growth model at every transformation",
    "do not reduce compound growth into simple additive percentage logic",
    "reward multiplier recognition and transformation insight over brute-force arithmetic",
    "keep principals, rates, and time spans financially realistic and exam-friendly",
    "treat investment growth, population growth, and bacterial growth as one topology when the multiplier system is identical",
  ];

export const simpleCompoundInterestGenerationStrategyMetadata =
  [
    "This chapter is fundamentally about choosing the right growth topology before computing.",
    "Simple interest is linear-growth reasoning; compound interest is successive multiplier reasoning.",
    "Strong generation should rotate beyond direct substitution into reverse reconstruction, period transformation, and comparative growth systems.",
    "Avoid fake diversity from changing bank, loan, or population nouns without changing the multiplier topology.",
  ];

export const simpleCompoundInterestFormulaBank =
  [
    {
      label: "Simple Interest",
      latex:
        "SI = \\frac{P \\times R \\times T}{100}",
    },
    {
      label: "Compound Amount",
      latex:
        "A = P\\left(1 + \\frac{R}{100}\\right)^T",
    },
    {
      label:
        "Half-Yearly Compounding",
      latex:
        "A = P\\left(1 + \\frac{R/2}{100}\\right)^{2T}",
    },
    {
      label: "Depreciation",
      latex:
        "A = P\\left(1 - \\frac{R}{100}\\right)^T",
    },
  ];

export const simpleCompoundInterestMetadataSchema =
  {
    subtype: [
      "simple_interest",
      "compound_interest",
      "si_vs_ci",
      "half_yearly",
      "quarterly",
      "population_growth",
      "depreciation",
      "reverse_reconstruction",
      "multi_stage_growth",
    ],
    fields: [
      "primitives",
      "hiddenStructures",
      "distractorFamilies",
      "arithmeticProfile",
      "difficulty",
    ],
  } as const;

export const simpleCompoundInterestEvaluationRisks =
  [
    "formula leakage from phrases like compounded annually, half-yearly, or difference between SI and CI",
    "topology collapse where many contexts reduce to multiplicative growth",
    "artificial diversity from changing bank, investment, loan, or population wording without changing structure",
  ];

export const simpleCompoundInterestRealismWeaknesses =
  [
    "overusing direct simple-interest substitution",
    "overusing formula-only compound interest questions",
    "avoiding reverse reconstruction",
    "avoiding layered compounding and disguised multiplier systems",
  ];

export const simpleCompoundInterestAntiRepetitionNotes =
  [
    "Treat investment growth, population growth, and bacterial growth as the same compound-multiplier topology.",
    "Treat depreciation, value reduction, and shrinking population as the same multiplicative-decay topology.",
  ];

export const simpleCompoundInterestMotifs: QuantMotif[] =
  [
    defineQuantMotif({
      id: "linear-interest-accumulation",
      topicCluster: "si-ci",
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
        "siCiFormulaSwap",
        "percentageBaseDrift",
      ],
      inferenceStyle: "direct",
      reasoningDepthRange: [1, 3],
      supportedDifficultyBands: [
        "Easy",
        "Medium",
      ],
      generationStrategy: [
        "use the linear SI relation with clean principal, rate, and time values",
      ],
      distractorStrategies: [
        "apply compound-style multiplication to a simple-interest case",
      ],
      difficultyTuning: {
        easy: [
          "direct SI from P, R, and T",
        ],
        medium: [
          "recover amount or missing simple-interest component",
        ],
      },
      validationRules: [
        "prefer clean percentage calculations",
      ],
      diversityTags: [
        "interest-linear",
      ],
      rotationGroup:
        "quant-interest-core",
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
      id: "multiplicative-growth",
      topicCluster: "si-ci",
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
        "additiveGrowthTrap",
        "siCiFormulaSwap",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [2, 5],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "treat compound interest as successive multiplier growth rather than repeated addition",
      ],
      distractorStrategies: [
        "add the rate repeatedly instead of multiplying factors",
        "apply a simple-interest formula to a compound case",
      ],
      difficultyTuning: {
        medium: [
          "annual compounding with short time horizon",
        ],
        hard: [
          "hidden multiplier or changed rate across stages",
        ],
      },
      validationRules: [
        "keep multipliers mentally manageable",
      ],
      diversityTags: [
        "interest-compound-growth",
      ],
      rotationGroup:
        "quant-interest-core",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.05,
        ibps: 1.2,
        sbi: 1.2,
      },
    }),
    defineQuantMotif({
      id: "interest-on-interest-detection",
      topicCluster: "si-ci",
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
        "interestOnInterestOmission",
        "siCiFormulaSwap",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [2, 5],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "compare CI and SI on the same principal to isolate the excess produced by interest on interest",
      ],
      distractorStrategies: [
        "treat SI and CI as identical over multiple periods",
      ],
      difficultyTuning: {
        medium: [
          "two-year SI-CI difference",
        ],
        hard: [
          "three-year comparison with one hidden parameter",
        ],
      },
      validationRules: [
        "prefer clean excess values",
      ],
      diversityTags: [
        "interest-difference",
      ],
      rotationGroup:
        "quant-interest-core",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.15,
        ibps: 1.1,
      },
    }),
    defineQuantMotif({
      id: "effective-period-transformation",
      topicCluster: "si-ci",
      archetype: "general",
      reasoningCategories: [
        "conditional-ratio-logic",
        "nested-operations",
      ],
      preferredOperations: [
        "transform",
        "infer",
      ],
      commonDistractors: [
        "halfYearlyAdjustmentFailure",
        "percentageBaseDrift",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 6],
      supportedDifficultyBands: [
        "Hard",
      ],
      generationStrategy: [
        "normalize compounding frequency by adjusting both the rate per period and the number of periods",
      ],
      distractorStrategies: [
        "halve or quarter the rate without changing the number of periods",
        "change periods without changing the periodic rate",
      ],
      difficultyTuning: {
        hard: [
          "half-yearly or quarterly compounding with a manageable multiplier",
        ],
      },
      validationRules: [
        "prefer compounding schedules that stay SSC-friendly",
      ],
      diversityTags: [
        "interest-period-transform",
      ],
      rotationGroup:
        "quant-interest-core",
      wordingBias: {
        balanced: 0.75,
        inferenceHeavy: 0.7,
      },
      examWeights: {
        ssc: 1.0,
        ibps: 1.2,
        sbi: 1.25,
      },
    }),
    defineQuantMotif({
      id: "compound-decay",
      topicCluster: "si-ci",
      archetype: "general",
      reasoningCategories: [
        "multi-step-arithmetic",
        "comparative-conditional-inference",
      ],
      preferredOperations: [
        "transform",
        "infer",
      ],
      commonDistractors: [
        "depreciationSignError",
        "additiveGrowthTrap",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [2, 4],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "use a decay multiplier over repeated periods instead of subtracting a fixed amount each time",
      ],
      distractorStrategies: [
        "use a growth multiplier instead of a decay multiplier",
        "subtract the rate linearly each year",
      ],
      difficultyTuning: {
        medium: [
          "direct depreciation value after a few years",
        ],
        hard: [
          "hidden initial or final state under decay",
        ],
      },
      validationRules: [
        "keep remaining values mentally trackable",
      ],
      diversityTags: [
        "interest-decay",
      ],
      rotationGroup:
        "quant-interest-core",
      wordingBias: {
        balanced: 0.75,
      },
      examWeights: {
        ssc: 1.05,
      },
    }),
    defineQuantMotif({
      id: "reverse-growth-reconstruction",
      topicCluster: "si-ci",
      archetype: "general",
      reasoningCategories: [
        "hidden-base-inference",
        "nested-operations",
      ],
      preferredOperations: [
        "reverse",
        "transform",
        "infer",
      ],
      commonDistractors: [
        "reverseReconstructionError",
        "percentageBaseDrift",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 6],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "backsolve principal, rate, or time from a final amount or interest condition",
      ],
      distractorStrategies: [
        "solve forward instead of isolating the hidden parameter",
        "use the wrong reference amount while reversing growth",
      ],
      difficultyTuning: {
        medium: [
          "principal from simple amount or clean compound amount",
        ],
        hard: [
          "hidden rate or hidden period in a compound setup",
        ],
      },
      validationRules: [
        "ensure the hidden parameter resolves uniquely and cleanly",
      ],
      diversityTags: [
        "interest-reverse",
      ],
      rotationGroup:
        "quant-interest-core",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.1,
        ibps: 1.15,
      },
    }),
    defineQuantMotif({
      id: "equivalent-multiplier-compression",
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
        "equivalentMultiplierCollapse",
        "additiveGrowthTrap",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 6],
      supportedDifficultyBands: [
        "Hard",
      ],
      generationStrategy: [
        "compress multiple growth stages into one equivalent multiplier before solving for the target quantity",
      ],
      distractorStrategies: [
        "replace multiplier chaining with direct percentage addition",
      ],
      difficultyTuning: {
        hard: [
          "rate changes yearly or stage-wise growth is concealed in the wording",
        ],
      },
      validationRules: [
        "keep stage count low but structurally meaningful",
      ],
      diversityTags: [
        "interest-equivalent-multiplier",
      ],
      rotationGroup:
        "quant-interest-core",
      wordingBias: {
        inferenceHeavy: 0.75,
        balanced: 0.65,
      },
      examWeights: {
        ssc: 0.95,
        ibps: 1.2,
      },
    }),
    defineQuantMotif({
      id: "comparative-interest-systems",
      topicCluster: "si-ci",
      archetype: "general",
      reasoningCategories: [
        "comparative-conditional-inference",
        "comparison-chain",
      ],
      preferredOperations: [
        "compare",
        "transform",
        "infer",
      ],
      commonDistractors: [
        "siCiFormulaSwap",
        "percentageBaseDrift",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [2, 5],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "compare two growth systems, two schedules, or two return models on the same base",
      ],
      distractorStrategies: [
        "treat two growth models as if they share the same transformation rule",
      ],
      difficultyTuning: {
        medium: [
          "simple-interest versus compound-interest comparison",
        ],
        hard: [
          "compare schedules with changed compounding frequency or changed annual rates",
        ],
      },
      validationRules: [
        "ensure the comparison target is not directly exposed by the wording",
      ],
      diversityTags: [
        "interest-comparative",
      ],
      rotationGroup:
        "quant-interest-core",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.0,
        ibps: 1.15,
      },
    }),
  ];

export const simpleInterestConcepts = [
  "simple interest",
  "principal-amount relation",
  "linear growth",
  "reverse simple-interest reconstruction",
];

export const compoundInterestConcepts =
  [
    "compound interest",
    "multiplicative growth",
    "fractional compounding",
    "interest on interest",
    "compound decay",
  ];

export const simpleInterestMotifs =
  simpleCompoundInterestMotifs.filter(
    (motif) =>
      motif.id ===
        "linear-interest-accumulation" ||
      motif.id ===
        "reverse-growth-reconstruction" ||
      motif.id ===
        "comparative-interest-systems",
  );

export const compoundInterestMotifs =
  simpleCompoundInterestMotifs.filter(
    (motif) =>
      motif.id ===
        "multiplicative-growth" ||
      motif.id ===
        "interest-on-interest-detection" ||
      motif.id ===
        "effective-period-transformation" ||
      motif.id ===
        "compound-decay" ||
      motif.id ===
        "equivalent-multiplier-compression",
  );
