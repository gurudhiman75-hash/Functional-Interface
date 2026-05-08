import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

type InterestSubtype =
  | "simple_interest"
  | "compound_interest"
  | "si_vs_ci"
  | "installment"
  | "growth_decay"
  | "transaction";

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

type InterestMotifConfig = {
  id: string;
  categories: string[];
  operations: string[];
  distractors: string[];
  depth: [number, number];
  difficulties: QuantMotif["supportedDifficultyBands"];
  strategy: string;
  tuning: QuantMotif["difficultyTuning"];
  diversityTag: string;
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
    "timeline-state financial growth",
    "simple interest linear growth",
    "compound interest multiplier growth",
    "principal amount reconstruction",
    "rate-period normalization",
    "interest on interest",
    "installment amortization",
    "growth and depreciation analogies",
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
      title:
        "Compound Interest Framework",
      canonicalRelation:
        "A = P(1 + R/100)^T and CI = A - P",
    },
    {
      id: "CF3",
      title:
        "Timeline-State Model",
      canonicalRelation:
        "principal and amount are updated across t0 -> tn intervals",
    },
    {
      id: "CF4",
      title:
        "Rate-Period Normalization",
      canonicalRelation:
        "frequency k transforms rate to R/k and periods to kT",
    },
    {
      id: "CF5",
      title:
        "SI-CI Delta Framework",
      canonicalRelation:
        "CI - SI isolates interest earned on earlier interest",
    },
    {
      id: "CF6",
      title:
        "Installment Present Value",
      canonicalRelation:
        "P equals the discounted value of all equal repayments",
    },
  ];

export const simpleCompoundInterestConceptModules =
  [
    "direct simple interest",
    "principal reconstruction",
    "sum becoming multiple of itself",
    "rate shift sensitivity",
    "split investment",
    "equal interest allocation",
    "compound amount growth",
    "varying annual rates",
    "fractional compounding",
    "SI-CI difference",
    "installment reconstruction",
    "growth and depreciation",
    "transaction arbitrage",
  ];

export const simpleCompoundInterestProceduralMotifs: InterestMotifDraft[] =
  [
    {
      id: "si-basic-amount",
      subtype: "simple_interest",
      primitives: ["principal", "rate", "time"],
      hiddenStructures: ["linear growth"],
      distractorFamilies: ["Amount_vs_Interest_Confusion"],
      arithmeticProfile: ["single-stage percentage"],
      difficulty: 1,
      examples: ["Given P, R, T, find SI or amount."],
    },
    {
      id: "si-find-principal",
      subtype: "simple_interest",
      primitives: ["amount", "rate", "time"],
      hiddenStructures: ["reverse linear growth"],
      distractorFamilies: ["CI_Inversion"],
      arithmeticProfile: ["principal backsolve"],
      difficulty: 2,
      examples: ["Given amount under SI, find principal."],
    },
    {
      id: "si-multiple-times",
      subtype: "simple_interest",
      primitives: ["multiple", "time"],
      hiddenStructures: ["linear multiple growth"],
      distractorFamilies: ["SI_Growth_Assumption"],
      arithmeticProfile: ["rate reconstruction"],
      difficulty: 2,
      examples: ["A sum becomes k times itself in n years."],
    },
    {
      id: "si-rate-shift",
      subtype: "simple_interest",
      primitives: ["principal", "time", "rate delta"],
      hiddenStructures: ["interest sensitivity"],
      distractorFamilies: ["Rate_Time_Mismatch"],
      arithmeticProfile: ["delta interest"],
      difficulty: 2,
      examples: ["If rate were higher, interest would be more."],
    },
    {
      id: "si-split-investment",
      subtype: "simple_interest",
      primitives: ["total principal", "two rates", "total interest"],
      hiddenStructures: ["partition equation"],
      distractorFamilies: ["Unit_Inconsistency"],
      arithmeticProfile: ["linear equation"],
      difficulty: 3,
      examples: ["Part of a sum is invested at one rate and rest at another."],
    },
    {
      id: "si-equal-interest",
      subtype: "simple_interest",
      primitives: ["different rates", "different times"],
      hiddenStructures: ["inverse RT allocation"],
      distractorFamilies: ["Rate_Time_Mismatch"],
      arithmeticProfile: ["ratio reconstruction"],
      difficulty: 3,
      examples: ["Divide a sum so the parts earn equal interest."],
    },
    {
      id: "si-equal-amount",
      subtype: "simple_interest",
      primitives: ["different SI schedules", "equal final amounts"],
      hiddenStructures: ["inverse amount multiplier"],
      distractorFamilies: ["Amount_vs_Interest_Confusion"],
      arithmeticProfile: ["ratio reconstruction"],
      difficulty: 3,
      examples: ["Divide a sum so final amounts are equal."],
    },
    {
      id: "ci-basic-calc",
      subtype: "compound_interest",
      primitives: ["principal", "rate", "years"],
      hiddenStructures: ["multiplicative growth"],
      distractorFamilies: ["Simple_Addition_Trap"],
      arithmeticProfile: ["successive multiplier"],
      difficulty: 2,
      examples: ["Given P, R, n, find compound amount or CI."],
    },
    {
      id: "ci-varying-rate",
      subtype: "compound_interest",
      primitives: ["principal", "rate sequence"],
      hiddenStructures: ["timeline multipliers"],
      distractorFamilies: ["Mixed_Scheme_Overlap"],
      arithmeticProfile: ["stage-wise multiplication"],
      difficulty: 3,
      examples: ["Different rates apply in successive years."],
    },
    {
      id: "ci-compounding-period",
      subtype: "compound_interest",
      primitives: ["frequency", "nominal rate", "time"],
      hiddenStructures: ["rate-period normalization"],
      distractorFamilies: ["Compounding_Frequency_Neglect"],
      arithmeticProfile: ["period transformation"],
      difficulty: 3,
      examples: ["Compounded half-yearly or quarterly."],
    },
    {
      id: "ci-fractional-time",
      subtype: "compound_interest",
      primitives: ["whole years", "fractional year"],
      hiddenStructures: ["partial interval growth"],
      distractorFamilies: ["Fractional_Time_Linear"],
      arithmeticProfile: ["mixed exponent"],
      difficulty: 3,
      examples: ["Find amount for 2 1/3 years."],
    },
    {
      id: "ci-multiple-times",
      subtype: "compound_interest",
      primitives: ["growth multiple", "time"],
      hiddenStructures: ["exponential recurrence"],
      distractorFamilies: ["SI_Growth_Assumption"],
      arithmeticProfile: ["time scaling"],
      difficulty: 2,
      examples: ["If a sum becomes k times in n years, find time for k^m."],
    },
    {
      id: "ci-population-growth",
      subtype: "growth_decay",
      primitives: ["initial population", "growth rate", "years"],
      hiddenStructures: ["compound growth analogy"],
      distractorFamilies: ["Effective_Rate_Fallacy"],
      arithmeticProfile: ["successive multiplier"],
      difficulty: 2,
      examples: ["Population grows annually by a fixed rate."],
    },
    {
      id: "delta-2-year",
      subtype: "si_vs_ci",
      primitives: ["principal", "rate", "two years"],
      hiddenStructures: ["interest on interest"],
      distractorFamilies: ["Delta_Formula_Mixup"],
      arithmeticProfile: ["delta formula"],
      difficulty: 3,
      examples: ["Difference between SI and CI for two years."],
    },
    {
      id: "delta-3-year",
      subtype: "si_vs_ci",
      primitives: ["principal", "rate", "three years"],
      hiddenStructures: ["second and third year excess"],
      distractorFamilies: ["Delta_Formula_Mixup"],
      arithmeticProfile: ["delta formula"],
      difficulty: 3,
      examples: ["Difference between SI and CI for three years."],
    },
    {
      id: "delta-reverse",
      subtype: "si_vs_ci",
      primitives: ["delta", "rate or principal"],
      hiddenStructures: ["reverse delta"],
      distractorFamilies: ["CI_Inversion"],
      arithmeticProfile: ["parameter backsolve"],
      difficulty: 3,
      examples: ["Given SI-CI difference, find principal."],
    },
    {
      id: "ci-from-si",
      subtype: "si_vs_ci",
      primitives: ["simple interest", "rate", "time"],
      hiddenStructures: ["principal reconstruction plus compound growth"],
      distractorFamilies: ["Base_Year_Shift"],
      arithmeticProfile: ["two-stage reconstruction"],
      difficulty: 3,
      examples: ["Given SI for two years, find CI."],
    },
    {
      id: "si-installment",
      subtype: "installment",
      primitives: ["debt", "rate", "installments"],
      hiddenStructures: ["linear repayment accumulation"],
      distractorFamilies: ["Installment_Principal_Error"],
      arithmeticProfile: ["installment equation"],
      difficulty: 4,
      examples: ["Equal yearly payments clear a debt under SI."],
    },
    {
      id: "ci-installment",
      subtype: "installment",
      primitives: ["loan", "rate", "installments"],
      hiddenStructures: ["present value of annuity"],
      distractorFamilies: ["Residual_Debt_Ignorance"],
      arithmeticProfile: ["GP repayment"],
      difficulty: 4,
      examples: ["Equal yearly payments clear a loan under CI."],
    },
    {
      id: "ci-loan-repayment",
      subtype: "installment",
      primitives: ["loan", "installment", "rate"],
      hiddenStructures: ["interest component separation"],
      distractorFamilies: ["Installment_Principal_Error"],
      arithmeticProfile: ["amortization state"],
      difficulty: 4,
      examples: ["Find interest component of the first EMI."],
    },
    {
      id: "ci-continuous",
      subtype: "compound_interest",
      primitives: ["principal", "continuous rate", "time"],
      hiddenStructures: ["continuous multiplier"],
      distractorFamilies: ["Effective_Rate_Fallacy"],
      arithmeticProfile: ["elite exponent model"],
      difficulty: 4,
      examples: ["Compounded continuously."],
    },
    {
      id: "ci-growth-regression",
      subtype: "growth_decay",
      primitives: ["growth rate", "decay rate"],
      hiddenStructures: ["successive opposing multipliers"],
      distractorFamilies: ["Effective_Rate_Fallacy"],
      arithmeticProfile: ["increase decrease chain"],
      difficulty: 3,
      examples: ["An item appreciates and then depreciates."],
    },
    {
      id: "si-changing-principal",
      subtype: "simple_interest",
      primitives: ["partial repayment", "time intervals"],
      hiddenStructures: ["timeline principal state"],
      distractorFamilies: ["Mixed_Scheme_Overlap"],
      arithmeticProfile: ["piecewise SI"],
      difficulty: 4,
      examples: ["Part principal is repaid mid-term."],
    },
    {
      id: "ci-effective-annual-rate",
      subtype: "compound_interest",
      primitives: ["nominal rate", "frequency"],
      hiddenStructures: ["effective annual multiplier"],
      distractorFamilies: ["Compounding_Frequency_Neglect"],
      arithmeticProfile: ["effective rate"],
      difficulty: 4,
      examples: ["Find the effective annual rate of a quarterly scheme."],
    },
    {
      id: "transaction-arbitrage",
      subtype: "transaction",
      primitives: ["borrow SI", "lend CI"],
      hiddenStructures: ["growth model spread"],
      distractorFamilies: ["SI_CI_Formula_Swap"],
      arithmeticProfile: ["comparative transaction"],
      difficulty: 4,
      examples: ["Borrowed at SI and lent at CI; find profit."],
    },
  ];

export const simpleCompoundInterestQuestionArchetypes =
  simpleCompoundInterestProceduralMotifs.map(
    (motif) => motif.id,
  );

export const simpleCompoundInterestDistractorEngineering =
  [
    "Compounding_Frequency_Neglect",
    "Simple_Addition_Trap",
    "Amount_vs_Interest_Confusion",
    "Rate_Time_Mismatch",
    "Effective_Rate_Fallacy",
    "Installment_Principal_Error",
    "Delta_Formula_Mixup",
    "Base_Year_Shift",
    "Fractional_Time_Linear",
    "SI_Growth_Assumption",
    "CI_Inversion",
    "Decimal_Overflow",
    "Tax_Incidence_Omission",
    "Leap_Year_Day_Count",
    "Mixed_Scheme_Overlap",
    "Residual_Debt_Ignorance",
    "Unit_Inconsistency",
    "Rounding_Trap",
  ];

export const simpleCompoundInterestHiddenInferenceStructures =
  [
    "timeline-state financial growth",
    "linear vs multiplicative growth",
    "compound multiplier systems",
    "effective period transformation",
    "interest-on-interest accumulation",
    "reverse parameter isolation",
    "installment present-value reconstruction",
  ];

export const simpleCompoundInterestDifficultyScaling =
  {
    L1: [
      "direct SI formulas with clean whole-number values",
    ],
    L2: [
      "CI basics, varying rates, and SI rate shifts",
    ],
    L3: [
      "SI-CI differences, quarterly compounding, and fractional time",
    ],
    L4: [
      "installments, continuous compounding, and transaction arbitrage",
    ],
  } as const;

export const simpleCompoundInterestDifficultyTuning =
  [
    "easy: linear simple interest with whole-number arithmetic",
    "medium: annual compound growth, rate shifts, and varying rates",
    "hard: delta systems, fractional compounding, installments, and comparative transactions",
  ];

export const simpleCompoundInterestNumericDesignPatterns =
  [
    "prefer rates like 5%, 10%, 12.5%, 20%, and 25%",
    "prefer principal families around 1000, 2000, 5000, 8000, 10000, 12500, and 20000",
    "use 11^2, 11^3, 12^2, 12.5%, and 25% families for clean compound outputs",
    "round non-SSC elite outputs to 2 decimals while keeping SSC outputs mentally computable",
  ];

export const simpleCompoundInterestGeneratorConstraints =
  [
    "normalize every rate to a decimal and every time value to years before solving",
    "track principal, effective rate, and accumulated amount across every timeline interval",
    "do not reduce compound growth into simple additive percentage logic",
    "ensure SI-CI delta questions use the correct two-year or three-year topology",
    "avoid cosmetic diversity from changing bank, loan, population, or investment nouns without changing topology",
  ];

export const simpleCompoundInterestGenerationStrategyMetadata =
  [
    "The live generator should select topology first, then realize the financial context.",
    "Simple interest is linear timeline accumulation; compound interest is stateful multiplier progression.",
    "Installment questions must distinguish interest component, principal component, and residual balance.",
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
      label: "Two-Year SI-CI Difference",
      latex:
        "\\Delta = P\\left(\\frac{R}{100}\\right)^2",
    },
    {
      label:
        "Compound Installment",
      latex:
        "x = \\frac{P r(1+r)^n}{(1+r)^n - 1}",
    },
  ];

export const simpleCompoundInterestMetadataSchema =
  {
    subtype: [
      "simple_interest",
      "compound_interest",
      "si_vs_ci",
      "installment",
      "growth_decay",
      "transaction",
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
    "formula leakage from direct phrases like compounded quarterly or difference between SI and CI",
    "topology collapse where many contexts reduce to the same annual multiplier",
    "incorrect active duplication between old canonical motif names and new topology IDs",
  ];

export const simpleCompoundInterestRealismWeaknesses =
  [
    "overusing direct simple-interest substitution",
    "overusing annual compound-interest substitution",
    "avoiding split investment, installment, and timeline-state problems",
  ];

export const simpleCompoundInterestAntiRepetitionNotes =
  [
    "Treat investment growth, population growth, and bacterial growth as the same compound-multiplier topology.",
    "Treat depreciation, value reduction, and shrinking population as the same multiplicative-decay topology.",
    "Treat old names such as linear-interest-accumulation as aliases only, never as separate active motifs.",
  ];

function defineInterestMotif(
  config: InterestMotifConfig,
): QuantMotif {
  return defineQuantMotif({
    id: config.id,
    topicCluster: "si-ci",
    archetype: "general",
    reasoningCategories:
      config.categories,
    preferredOperations:
      config.operations,
    commonDistractors:
      config.distractors,
    inferenceStyle:
      config.depth[0] <= 2
        ? "direct"
        : "hidden",
    reasoningDepthRange:
      config.depth,
    supportedDifficultyBands:
      config.difficulties,
    generationStrategy: [
      config.strategy,
    ],
    distractorStrategies:
      config.distractors,
    difficultyTuning:
      config.tuning,
    validationRules: [
      "solve through the timeline-state model and keep the answer unique",
      "keep values clean or round to two decimals only when the motif is elite",
    ],
    diversityTags: [
      config.diversityTag,
    ],
    rotationGroup:
      "quant-interest-core",
    wordingBias: {
      balanced: 0.8,
      inferenceHeavy:
        config.depth[1] >= 5
          ? 0.75
          : 0.45,
    },
    examWeights: {
      ssc:
        config.depth[1] >= 6
          ? 0.75
          : 1.1,
      ibps: 1.1,
      sbi: 1.05,
    },
  });
}

const canonicalInterestMotifConfigs: InterestMotifConfig[] =
  simpleCompoundInterestProceduralMotifs.map(
    (motif) => ({
      id: motif.id,
      categories:
        motif.difficulty >= 4
          ? [
              "multi-step-arithmetic",
              "hidden-base-inference",
              "nested-operations",
            ]
          : motif.difficulty >= 3
            ? [
                "comparative-conditional-inference",
                "multi-step-arithmetic",
              ]
            : [
                "direct-substitution",
                "one-step-arithmetic",
              ],
      operations:
        motif.difficulty >= 3
          ? [
              "transform",
              "aggregate",
              "infer",
            ]
          : ["transform", "infer"],
      distractors:
        motif.distractorFamilies,
      depth:
        motif.difficulty === 1
          ? [1, 2]
          : motif.difficulty === 2
            ? [2, 4]
            : motif.difficulty === 3
              ? [3, 5]
              : [4, 7],
      difficulties:
        motif.difficulty === 1
          ? ["Easy", "Medium"]
          : motif.difficulty === 2
            ? ["Medium", "Hard"]
            : motif.difficulty === 3
              ? ["Medium", "Hard"]
              : ["Hard"],
      strategy: `Generate the ${motif.id} topology using ${motif.hiddenStructures.join(
        ", ",
      )}.`,
      tuning:
        motif.difficulty === 1
          ? {
              easy: [
                "clean whole-number direct calculation",
              ],
              medium: [
                "same topology with a hidden target value",
              ],
            }
          : motif.difficulty === 2
            ? {
                medium: [
                  "one financial transformation",
                ],
                hard: [
                  "concealed base or amount target",
                ],
              }
            : {
                medium: [
                  "visible topology but multi-step arithmetic",
                ],
                hard: [
                  "concealed topology with timeline-state tracking",
                ],
              },
      diversityTag: `interest-${motif.id}`,
    }),
  );

export const simpleCompoundInterestMotifs: QuantMotif[] =
  canonicalInterestMotifConfigs.map(
    defineInterestMotif,
  );

export const simpleInterestConcepts = [
  "simple interest",
  "principal-amount relation",
  "linear timeline growth",
  "split investment",
  "equal interest allocation",
  "changing principal",
];

export const compoundInterestConcepts =
  [
    "compound interest",
    "multiplicative growth",
    "fractional compounding",
    "interest on interest",
    "effective annual rate",
    "compound installment",
  ];

export const simpleInterestMotifs =
  simpleCompoundInterestMotifs.filter(
    (motif) =>
      motif.id.startsWith("si-"),
  );

export const compoundInterestMotifs =
  simpleCompoundInterestMotifs.filter(
    (motif) =>
      motif.id.startsWith("ci-") ||
      motif.id.startsWith("delta-"),
  );
