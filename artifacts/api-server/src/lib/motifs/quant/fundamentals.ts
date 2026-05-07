import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

export type FundamentalsDifficultyLevel =
  | 1
  | 2
  | 3
  | 4;

export type FundamentalsQuestionSubtype =
  | "simplification"
  | "fraction"
  | "decimal"
  | "hcf_lcm"
  | "indices"
  | "surds"
  | "divisibility"
  | "unit_digit"
  | "approximation";

export type FundamentalsMotifDraft = {
  id: string;
  subtype: FundamentalsQuestionSubtype;
  concepts: string[];
  operations: string[];
  traps: string[];
  difficulty: FundamentalsDifficultyLevel;
  generationStrategy: string[];
  examples?: string[];
  latexForms?: string[];
};

export const fundamentalsScopeMap = {
  chapter: "Fundamentals",
  coreDomains: [
    "BODMAS",
    "Fractions",
    "Decimals",
    "Factors and Multiples",
    "HCF",
    "LCM",
    "Squares",
    "Cubes",
    "Divisibility",
    "Surds",
    "Indices",
    "Simplification",
    "Approximation",
  ],
} as const;

export const fundamentalsConcepts = [
  "BODMAS evaluation order",
  "fraction arithmetic",
  "decimal-to-fraction normalization",
  "HCF-LCM relationship for two numbers",
  "prime factorization backbone",
  "surd simplification by extracting perfect square factors",
  "index laws",
  "divisibility rules",
  "unit digit cycles",
  "mental square and cube recognition",
  "structural cancellation",
  "cyclic modulo thinking",
];

export const fundamentalsComputationalFrameworks =
  [
    {
      id: "CF1",
      name: "BODMAS Evaluation Engine",
      priorityHierarchy: [
        "Bracket",
        "Of",
        "Division",
        "Multiplication",
        "Addition",
        "Subtraction",
      ],
      structuralPatterns: [
        "a + b x c",
        "(a + b) x c",
        "a / b x c",
      ],
      commonTrap:
        "do division before multiplication instead of resolving division and multiplication left-to-right",
    },
    {
      id: "CF2",
      name: "Fraction Arithmetic System",
      formulas: [
        "(a/b) + (c/d) = (ad + bc) / bd",
        "(a/b) x (c/d) = ac / bd",
        "(a/b) / (c/d) = ad / bc",
      ],
    },
    {
      id: "CF3",
      name: "Decimal Transformation",
      formulas: [
        "0.25 = 25/100 = 1/4",
        "0.125 = 1/8",
        "0.5 = 1/2",
      ],
      commonValues: [
        0.25,
        0.125,
        0.75,
        0.625,
        0.875,
      ],
    },
    {
      id: "CF4",
      name: "HCF Framework",
      formulas: [
        "product of two numbers = HCF x LCM",
      ],
      applicability: [
        "two numbers only",
      ],
    },
    {
      id: "CF5",
      name: "Prime Factorization Engine",
      formulas: [
        "60 = 2^2 x 3 x 5",
      ],
      dependencies: [
        "HCF",
        "LCM",
        "divisibility",
        "square root simplification",
        "cube root simplification",
      ],
    },
    {
      id: "CF6",
      name: "Surd Simplification",
      formulas: [
        "sqrt(50) = sqrt(25 x 2) = 5 sqrt(2)",
      ],
      pattern:
        "extract the perfect square factor",
    },
    {
      id: "CF7",
      name: "Index Laws",
      formulas: [
        "a^m x a^n = a^(m+n)",
        "a^m / a^n = a^(m-n)",
        "(a^m)^n = a^(mn)",
        "a^(-n) = 1 / a^n",
      ],
    },
  ] as const;

export const fundamentalsMentalMathStructures =
  [
    {
      id: "MM1",
      name: "Divisibility Rules",
      rules: [
        "2 -> last digit even",
        "3 -> sum of digits divisible by 3",
        "4 -> last two digits divisible by 4",
        "5 -> last digit 0 or 5",
        "6 -> divisible by both 2 and 3",
        "8 -> last three digits divisible by 8",
        "9 -> digit sum divisible by 9",
        "11 -> alternating digit sum difference divisible by 11",
      ],
    },
    {
      id: "MM2",
      name: "Unit Digit Cycles",
      rules: [
        "2^n -> [2, 4, 8, 6]",
        "3^n -> [3, 9, 7, 1]",
        "7^n -> [7, 9, 3, 1]",
      ],
    },
    {
      id: "MM3",
      name: "Square Recognition Bank",
      rules: [
        "memorize 1^2 to 30^2",
        "pay special attention to 12^2, 15^2, 18^2, 22^2, 25^2, 35^2, 45^2",
      ],
    },
    {
      id: "MM4",
      name: "Cube Recognition Bank",
      rules: [
        "memorize 1^3 to 20^3",
        "high-frequency values include 8, 27, 64, 125, 216, 343, 512, 729, 1000",
      ],
    },
  ] as const;

export const fundamentalsDistractorStrategies =
  [
    "treat BODMAS as if addition happens before multiplication",
    "add fractions as (a+c)/(b+d)",
    "swap HCF and LCM roles",
    "combine unlike surds directly under one root",
    "treat a^m + a^n as a^(m+n)",
    "skip divisibility rules and force long division",
    "ignore cancellation before multiplying",
    "use arithmetic mean instead of structural simplification",
  ];

export const fundamentalsDifficultyTuning = [
  "easy: direct simplification, explicit operations, small integers",
  "medium: nested fractions, mixed surds, multiple laws in one expression",
  "hard: disguised algebraic structure, cyclicity, reverse HCF/LCM construction",
  "cap practical SSC hardness around 6-7/10 rather than olympiad-style extremes",
];

export const fundamentalsGenerationStrategyMetadata =
  [
    "prefer mentally solvable arithmetic over long mechanical calculation",
    "reward shortcut discovery through cancellation, factorization, or cycle recognition",
    "keep arithmetic clean and exam-realistic",
    "use prime factorization as a hidden backbone for HCF, LCM, divisibility, and surds",
    "treat Fundamentals as a computation-efficiency topic rather than a heavily procedural topic",
  ];

export const fundamentalsGeneratorConstraints =
  [
    "prefer clean arithmetic families such as 12, 18, 24, 36, 48, 72",
    "avoid ugly primes unless the question is explicitly divisibility-focused",
    "questions should usually fit under 60 seconds in SSC conditions",
    "allow cancellation and pattern spotting wherever possible",
    "reuse factor-rich numeric families such as 72, 48, 108",
    "scale difficulty through concept compression and hidden structure, not just larger numbers",
  ];

export const fundamentalsFormulaBank = [
  {
    label: "Index multiplication",
    text: "a^m x a^n = a^(m+n)",
    latex:
      "a^m \\times a^n = a^{m+n}",
  },
  {
    label: "Fraction division",
    text: "(a/b) / (c/d) = ad/bc",
    latex:
      "\\frac{a}{b} \\div \\frac{c}{d} = \\frac{ad}{bc}",
  },
  {
    label: "HCF-LCM product",
    text: "HCF x LCM = product of two numbers",
    latex:
      "\\text{HCF} \\times \\text{LCM} = \\text{product of two numbers}",
  },
  {
    label: "Surd extraction",
    text: "sqrt(50) = 5 sqrt(2)",
    latex:
      "\\sqrt{50} = 5\\sqrt{2}",
  },
] as const;

export const fundamentalsQuestionArchetypes: FundamentalsMotifDraft[] =
  [
    {
      id: "simplification-expression",
      subtype: "simplification",
      concepts: [
        "BODMAS evaluation order",
        "structural cancellation",
      ],
      operations: [
        "sequence",
        "simplify",
        "evaluate",
      ],
      traps: [
        "BODMAS trap",
      ],
      difficulty: 1,
      generationStrategy: [
        "build direct operator-order expressions with one hidden priority trap",
      ],
      examples: [
        "8 + 4 x 5 - 12 / 3",
      ],
      latexForms: [
        "8 + 4 \\times 5 - \\frac{12}{3}",
      ],
    },
    {
      id: "fraction-chain",
      subtype: "fraction",
      concepts: [
        "fraction arithmetic",
        "LCM alignment",
        "cancellation",
      ],
      operations: [
        "align",
        "cancel",
        "aggregate",
      ],
      traps: [
        "fraction addition trap",
      ],
      difficulty: 2,
      generationStrategy: [
        "mix one addition/subtraction stage with one multiplication or division stage",
      ],
      examples: [
        "(3/4 + 5/6) x (8/9)",
      ],
      latexForms: [
        "\\left(\\frac{3}{4} + \\frac{5}{6}\\right) \\times \\frac{8}{9}",
      ],
    },
    {
      id: "decimal-fraction-conversion",
      subtype: "decimal",
      concepts: [
        "decimal normalization",
        "fraction simplification",
      ],
      operations: [
        "transform",
        "reduce",
      ],
      traps: [
        "place-value slip",
      ],
      difficulty: 1,
      generationStrategy: [
        "use common SSC decimals that reduce cleanly into fractions",
      ],
      examples: [
        "0.625 as a fraction",
      ],
      latexForms: [
        "0.625 = \\frac{5}{8}",
      ],
    },
    {
      id: "hcf-lcm-reverse-construction",
      subtype: "hcf_lcm",
      concepts: [
        "HCF-LCM product identity",
        "reverse construction",
      ],
      operations: [
        "factor",
        "reconstruct",
        "infer",
      ],
      traps: [
        "HCF-LCM swap",
      ],
      difficulty: 3,
      generationStrategy: [
        "give HCF, LCM, and one number, then recover the second number",
      ],
      examples: [
        "HCF = 12, LCM = 720, one number = 144",
      ],
      latexForms: [
        "\\text{HCF} = 12,\\ \\text{LCM} = 720,\\ a = 144",
      ],
    },
    {
      id: "surd-simplification",
      subtype: "surds",
      concepts: [
        "perfect square extraction",
        "like-surd combination",
      ],
      operations: [
        "factorize",
        "extract",
        "combine",
      ],
      traps: [
        "surd addition trap",
      ],
      difficulty: 2,
      generationStrategy: [
        "pair reducible surds so the final expression combines into like surds",
      ],
      examples: [
        "sqrt(72) + sqrt(32)",
      ],
      latexForms: [
        "\\sqrt{72} + \\sqrt{32}",
      ],
    },
    {
      id: "index-evaluation",
      subtype: "indices",
      concepts: [
        "index laws",
      ],
      operations: [
        "combine",
        "cancel",
        "evaluate",
      ],
      traps: [
        "exponent cancellation trap",
      ],
      difficulty: 2,
      generationStrategy: [
        "compress multiplication and division of the same base into one quick simplification chain",
      ],
      examples: [
        "2^3 x 2^5 / 2^4",
      ],
      latexForms: [
        "2^3 \\times 2^5 \\div 2^4",
      ],
    },
    {
      id: "divisibility-detection",
      subtype: "divisibility",
      concepts: [
        "divisibility rules",
        "fast elimination",
      ],
      operations: [
        "test",
        "filter",
      ],
      traps: [
        "divisibility shortcut failure",
      ],
      difficulty: 2,
      generationStrategy: [
        "ask for a number divisible by a target divisor using rule-based filtering",
      ],
      examples: [
        "Which number is divisible by 11?",
      ],
    },
    {
      id: "unit-digit-cycle",
      subtype: "unit_digit",
      concepts: [
        "unit digit cycles",
        "cyclic modulo thinking",
      ],
      operations: [
        "reduce",
        "index",
        "infer",
      ],
      traps: [
        "cycle misalignment",
      ],
      difficulty: 3,
      generationStrategy: [
        "use a manageable base with a short repeating unit-digit cycle",
      ],
      examples: [
        "Find the unit digit of 7^103",
      ],
      latexForms: [
        "7^{103}",
      ],
    },
  ];

export const fundamentalsMotifs: QuantMotif[] =
  [
    defineQuantMotif({
      id: "bodmas-sequencing",
      topicCluster: "fundamentals",
      archetype: "general",
      reasoningCategories: [
        "one-step-arithmetic",
        "nested-operations",
      ],
      preferredOperations: [
        "sequence",
        "transform",
        "infer",
      ],
      commonDistractors: [
        "bodmasTrap",
        "leftToRightSlip",
      ],
      inferenceStyle: "direct",
      reasoningDepthRange: [1, 3],
      supportedDifficultyBands: [
        "Easy",
        "Medium",
      ],
      generationStrategy: [
        "build simplification expressions with one operator-priority trap",
        "prefer compact arithmetic that rewards correct operation order",
      ],
      distractorStrategies: [
        "evaluate addition before multiplication",
        "ignore left-to-right handling for division and multiplication",
      ],
      difficultyTuning: {
        easy: [
          "single operator-priority trap",
        ],
        medium: [
          "nested brackets with one cancellation opportunity",
        ],
        hard: [
          "compressed mixed-operation chain with two priority pivots",
        ],
      },
      validationRules: [
        "keep arithmetic mentally solvable",
        "avoid unnecessarily large raw numbers",
      ],
      diversityTags: [
        "fundamentals-bodmas",
        "simplification",
      ],
      rotationGroup:
        "quant-fundamentals-core",
      wordingBias: {
        concise: 0.85,
        balanced: 0.7,
      },
      examWeights: {
        ssc: 1.25,
        ibps: 1.05,
      },
    }),
    defineQuantMotif({
      id: "fraction-cancellation-chain",
      topicCluster: "fundamentals",
      archetype: "general",
      reasoningCategories: [
        "simple-ratio",
        "multi-step-arithmetic",
      ],
      preferredOperations: [
        "transform",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "fractionAdditionTrap",
        "cancellationSlip",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [2, 4],
      supportedDifficultyBands: [
        "Easy",
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "mix LCM alignment with one multiplication or division step",
        "reward cancellation before raw multiplication",
      ],
      distractorStrategies: [
        "add fractions by adding numerators and denominators directly",
        "skip cancellation and multiply large terms",
      ],
      difficultyTuning: {
        easy: [
          "single alignment step",
        ],
        medium: [
          "alignment plus one cancellation pivot",
        ],
        hard: [
          "nested fraction chain with a hidden simplification path",
        ],
      },
      validationRules: [
        "prefer clean denominators",
        "preserve a visible shortcut path",
      ],
      diversityTags: [
        "fundamentals-fractions",
      ],
      rotationGroup:
        "quant-fundamentals-core",
      wordingBias: {
        concise: 0.75,
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.2,
        ibps: 1.0,
      },
    }),
    defineQuantMotif({
      id: "decimal-fraction-normalization",
      topicCluster: "fundamentals",
      archetype: "general",
      reasoningCategories: [
        "direct-substitution",
        "one-step-arithmetic",
      ],
      preferredOperations: [
        "transform",
        "reduce",
      ],
      commonDistractors: [
        "placeValueSlip",
        "partialReduction",
      ],
      inferenceStyle: "direct",
      reasoningDepthRange: [1, 2],
      supportedDifficultyBands: [
        "Easy",
        "Medium",
      ],
      generationStrategy: [
        "use common SSC decimal constants that reduce cleanly",
      ],
      distractorStrategies: [
        "misplace the decimal-to-fraction conversion",
        "stop before the lowest terms",
      ],
      difficultyTuning: {
        easy: [
          "single decimal to fraction reduction",
        ],
        medium: [
          "conversion embedded inside a short expression",
        ],
      },
      validationRules: [
        "prefer familiar terminating decimals",
      ],
      diversityTags: [
        "fundamentals-decimals",
      ],
      rotationGroup:
        "quant-fundamentals-core",
      wordingBias: {
        concise: 0.8,
      },
      examWeights: {
        ssc: 1.15,
      },
    }),
    defineQuantMotif({
      id: "hcf-lcm-reconstruction",
      topicCluster: "fundamentals",
      archetype: "general",
      reasoningCategories: [
        "hidden-base-inference",
        "multi-step-arithmetic",
      ],
      preferredOperations: [
        "factor",
        "transform",
        "infer",
      ],
      commonDistractors: [
        "hcfLcmSwap",
        "productIdentitySlip",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 5],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "give HCF, LCM, and one number, then reconstruct the missing number",
        "prefer factor-rich numeric families that simplify cleanly",
      ],
      distractorStrategies: [
        "swap HCF and LCM roles",
        "apply the product identity outside the two-number setting",
      ],
      difficultyTuning: {
        medium: [
          "direct reconstruction from one given number",
        ],
        hard: [
          "reconstruction plus divisibility or factor constraint",
        ],
      },
      validationRules: [
        "restrict identity usage to two-number problems",
        "ensure integral reconstruction",
      ],
      diversityTags: [
        "fundamentals-hcf-lcm",
      ],
      rotationGroup:
        "quant-fundamentals-core",
      wordingBias: {
        balanced: 0.75,
        inferenceHeavy: 0.65,
      },
      examWeights: {
        ssc: 1.2,
        rrb: 1.05,
      },
    }),
    defineQuantMotif({
      id: "surd-factor-extraction",
      topicCluster: "fundamentals",
      archetype: "general",
      reasoningCategories: [
        "direct-substitution",
        "multi-step-arithmetic",
      ],
      preferredOperations: [
        "factor",
        "transform",
        "aggregate",
      ],
      commonDistractors: [
        "surdAdditionTrap",
        "perfectSquareMiss",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [2, 4],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "extract perfect square factors before combining like surds",
      ],
      distractorStrategies: [
        "combine unlike surds directly under one root",
        "miss the largest extractable perfect square factor",
      ],
      difficultyTuning: {
        medium: [
          "single surd reduction",
        ],
        hard: [
          "sum or difference of two reducible surds",
        ],
      },
      validationRules: [
        "ensure surds reduce into a small number of like terms",
      ],
      diversityTags: [
        "fundamentals-surds",
      ],
      rotationGroup:
        "quant-fundamentals-core",
      wordingBias: {
        concise: 0.7,
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.0,
      },
    }),
    defineQuantMotif({
      id: "index-law-compression",
      topicCluster: "fundamentals",
      archetype: "general",
      reasoningCategories: [
        "direct-substitution",
        "multi-step-arithmetic",
      ],
      preferredOperations: [
        "aggregate",
        "reduce",
        "infer",
      ],
      commonDistractors: [
        "exponentCancellationTrap",
        "additionAsPowerTrap",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [2, 4],
      supportedDifficultyBands: [
        "Easy",
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "compress multiplication and division of the same base into a short simplification chain",
      ],
      distractorStrategies: [
        "add exponents across addition instead of multiplication",
        "drop one exponent sign during division",
      ],
      difficultyTuning: {
        easy: [
          "single-base multiplication and division",
        ],
        medium: [
          "nested power with one negative exponent or cancellation step",
        ],
        hard: [
          "multi-law compression with one hidden simplification shortcut",
        ],
      },
      validationRules: [
        "prefer same-base expressions for SSC-style speed solving",
      ],
      diversityTags: [
        "fundamentals-indices",
      ],
      rotationGroup:
        "quant-fundamentals-core",
      wordingBias: {
        concise: 0.8,
      },
      examWeights: {
        ssc: 1.1,
      },
    }),
    defineQuantMotif({
      id: "divisibility-filter",
      topicCluster: "fundamentals",
      archetype: "general",
      reasoningCategories: [
        "comparison-chain",
        "one-step-arithmetic",
      ],
      preferredOperations: [
        "filter",
        "compare",
        "infer",
      ],
      commonDistractors: [
        "divisibilityShortcutFailure",
        "digitRuleSlip",
      ],
      inferenceStyle: "direct",
      reasoningDepthRange: [1, 3],
      supportedDifficultyBands: [
        "Easy",
        "Medium",
      ],
      generationStrategy: [
        "ask for quick rule-based divisibility filtering rather than long division",
      ],
      distractorStrategies: [
        "test using full division instead of divisibility rules",
        "apply the wrong digit-sum or place-value test",
      ],
      difficultyTuning: {
        easy: [
          "single divisibility rule",
        ],
        medium: [
          "combined divisibility screening",
        ],
      },
      validationRules: [
        "ensure one short rule clearly resolves the answer",
      ],
      diversityTags: [
        "fundamentals-divisibility",
      ],
      rotationGroup:
        "quant-fundamentals-core",
      wordingBias: {
        concise: 0.85,
      },
      examWeights: {
        ssc: 1.2,
      },
    }),
    defineQuantMotif({
      id: "unit-digit-cycle",
      topicCluster: "fundamentals",
      archetype: "general",
      reasoningCategories: [
        "hidden-base-inference",
        "multi-step-arithmetic",
      ],
      preferredOperations: [
        "reduce",
        "index",
        "infer",
      ],
      commonDistractors: [
        "cycleMisalignment",
        "modReductionSlip",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [2, 4],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "use a small repeating unit-digit cycle and hide the final lookup behind exponent reduction",
      ],
      distractorStrategies: [
        "use the wrong cycle position after modulus reduction",
        "treat the exponent as the cycle index directly",
      ],
      difficultyTuning: {
        medium: [
          "single-cycle lookup",
        ],
        hard: [
          "cycle lookup with disguised modulus reduction",
        ],
      },
      validationRules: [
        "keep the cycle length short and standard",
      ],
      diversityTags: [
        "fundamentals-unit-digit",
      ],
      rotationGroup:
        "quant-fundamentals-core",
      wordingBias: {
        concise: 0.8,
        balanced: 0.7,
      },
      examWeights: {
        ssc: 1.15,
        ibps: 1.05,
      },
    }),
  ];
